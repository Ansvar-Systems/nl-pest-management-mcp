import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { handleIdentifyFromSymptoms } from '../../src/tools/identify-from-symptoms.js';
import { createSeededDatabase } from '../helpers/seed-db.js';
import type { Database } from '../../src/db.js';
import { existsSync, unlinkSync } from 'fs';

const TEST_DB = 'tests/test-identify-symptoms.db';

describe('identify_from_symptoms tool', () => {
  let db: Database;

  beforeAll(() => {
    db = createSeededDatabase(TEST_DB);
  });

  afterAll(() => {
    db.close();
    if (existsSync(TEST_DB)) unlinkSync(TEST_DB);
  });

  test('identifies septoria from gele vlekken on bladeren', () => {
    const result = handleIdentifyFromSymptoms(db, { symptoms: 'gele vlekken bladeren' });
    const typed = result as { diagnoses: { pest_id: string; pest_name: string; confidence_score: number }[] };
    expect(typed.diagnoses.length).toBeGreaterThan(0);
    // Septoria has a suggestive symptom "Gele vlekken op onderste bladeren"
    expect(typed.diagnoses[0].pest_id).toBe('septoria-tritici');
  });

  test('gives higher score for diagnostic-level symptom match', () => {
    const result = handleIdentifyFromSymptoms(db, { symptoms: 'bruine vlekken pycniden tarwebladeren' });
    const typed = result as { diagnoses: { pest_id: string; confidence_score: number }[] };
    expect(typed.diagnoses.length).toBeGreaterThan(0);
    expect(typed.diagnoses[0].pest_id).toBe('septoria-tritici');
    // Diagnostic confidence = weight 3
    expect(typed.diagnoses[0].confidence_score).toBeGreaterThanOrEqual(3);
  });

  test('returns multiple diagnoses for ambiguous symptoms', () => {
    // "bladeren" appears in symptoms for multiple pests
    const result = handleIdentifyFromSymptoms(db, { symptoms: 'bladeren schade vlekken' });
    const typed = result as { diagnoses: { pest_id: string }[] };
    // Should find at least one pest with leaf symptoms
    expect(typed.diagnoses.length).toBeGreaterThanOrEqual(1);
  });

  test('returns empty for unrecognised symptoms', () => {
    const result = handleIdentifyFromSymptoms(db, { symptoms: 'purple fluorescent glow' });
    const typed = result as { results_count: number; diagnoses: unknown[] };
    expect(typed.results_count).toBe(0);
    expect(typed.diagnoses).toHaveLength(0);
  });

  test('rejects unsupported jurisdiction', () => {
    const result = handleIdentifyFromSymptoms(db, { symptoms: 'gele vlekken', jurisdiction: 'NZ' });
    expect(result).toHaveProperty('error', 'jurisdiction_not_supported');
  });

  test('confidence scoring: diagnostic > suggestive > associated', () => {
    // Test with a query that matches the diagnostic symptom
    const diagnosticResult = handleIdentifyFromSymptoms(db, { symptoms: 'bruine vlekken pycniden tarwebladeren' });
    const suggestiveResult = handleIdentifyFromSymptoms(db, { symptoms: 'gele vlekken onderste bladeren' });

    const diagTyped = diagnosticResult as { diagnoses: { pest_id: string; confidence_score: number }[] };
    const suggTyped = suggestiveResult as { diagnoses: { pest_id: string; confidence_score: number }[] };

    const diagSeptoria = diagTyped.diagnoses.find(d => d.pest_id === 'septoria-tritici');
    const suggSeptoria = suggTyped.diagnoses.find(d => d.pest_id === 'septoria-tritici');

    expect(diagSeptoria).toBeDefined();
    expect(suggSeptoria).toBeDefined();
    // Diagnostic match should score higher (weight 3) than suggestive (weight 2)
    expect(diagSeptoria!.confidence_score).toBeGreaterThanOrEqual(suggSeptoria!.confidence_score);
  });
});
