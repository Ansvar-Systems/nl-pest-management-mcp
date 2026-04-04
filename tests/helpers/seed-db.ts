import { createDatabase, type Database } from '../../src/db.js';

export function createSeededDatabase(dbPath: string): Database {
  const db = createDatabase(dbPath);

  // Pests
  db.run(
    `INSERT INTO pests (id, name, common_names, pest_type, description, lifecycle, identification, crops_affected, risk_factors, economic_impact, images_description, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'septoria-tritici', 'Septoria tritici bladvlekkenziekte', JSON.stringify(['Bladvlekkenziekte', 'Septoria leaf blotch', 'Zymoseptoria tritici']),
      'disease', 'Schimmelziekte veroorzaakt door Zymoseptoria tritici. Belangrijkste bladziekte in wintertarwe in Nederland.',
      'Infectie via ascosporen (herfst) en pyknidiosporen (regenspatten, voorjaar). Latente periode 2-4 weken.',
      'Langwerpige bruine vlekken op bladeren met kenmerkende zwarte pycniden (vruchtlichamen) zichtbaar als donkere puntjes.',
      JSON.stringify(['tarwe', 'wintertarwe', 'zomertarwe']),
      'Natte herfst en winter, vatbare rassen, vroege zaai, dicht gewas',
      'Opbrengstderving tot 30-50% bij onbehandelde vatbare rassen in natte jaren.',
      'Bruine langwerpige bladvlekken met zwarte pycniden op tarweblad',
      'NL',
    ]
  );
  db.run(
    `INSERT INTO pests (id, name, common_names, pest_type, description, lifecycle, identification, crops_affected, risk_factors, economic_impact, images_description, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'phytophthora-infestans', 'Phytophthora infestans', JSON.stringify(['Aardappelziekte', 'Late blight', 'Phytophthora']),
      'disease', 'Oömyceet die aardappelziekte veroorzaakt. De belangrijkste ziekte in de Nederlandse aardappelteelt.',
      'Overwintert op afvalhopen en opslag. Zoösporen verspreiden via wind en regen. Infectiecyclus 4-7 dagen.',
      'Onregelmatige bruine vlekken op bladeren, vaak startend aan bladranden. Wit schimmelpluis aan onderzijde blad.',
      JSON.stringify(['aardappelen', 'tomaten']),
      'Vochtig weer (>90% RV), temperatuur 10-20°C, onbeschermde nieuwe bladgroei, nabijheid afvalhopen',
      'Gemiddeld 50-80 miljoen euro per jaar aan bestrijdingskosten in Nederland.',
      'Bruine vlekken op aardappelblad met wit schimmelpluis aan onderzijde',
      'NL',
    ]
  );
  db.run(
    `INSERT INTO pests (id, name, common_names, pest_type, description, lifecycle, identification, crops_affected, risk_factors, economic_impact, images_description, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'bladluis-granen', 'Bladluis (granen)', JSON.stringify(['Graanbladluis', 'Grote graanluis', 'Sitobion avenae']),
      'pest', 'Verschillende bladluissoorten die granen aantasten: grote graanluis (Sitobion avenae), vogelkersluis (Rhopalosiphum padi).',
      'Gevleugelde bladluizen koloniseren gewassen in het voorjaar. Populatieopbouw bij warm, droog weer.',
      'Kleine (2-3 mm) zachte insecten, groen tot roodbruin, op bladeren, stengels en aren. Honingdauwafscheiding.',
      JSON.stringify(['tarwe', 'wintertarwe', 'gerst', 'wintergerst', 'aardappelen']),
      'Warm droog voorjaar, weinig natuurlijke vijanden, vroege zaai in herfst (BYDV-risico)',
      'Directe zuigschade: opbrengstderving 5-15%. BYDV-infectie via herfstbladluizen: tot 30% verlies.',
      'Groene bladluizen op tarweaar met honingdauwdruppels',
      'NL',
    ]
  );

  // Symptoms -- Septoria (3 symptoms at different confidence levels)
  db.run(
    `INSERT INTO symptoms (pest_id, symptom, plant_part, timing, confidence)
     VALUES (?, ?, ?, ?, ?)`,
    ['septoria-tritici', 'Langwerpige bruine vlekken met zwarte pycniden op tarwebladeren', 'bladeren', 'herfst tot voorjaar', 'diagnostic']
  );
  db.run(
    `INSERT INTO symptoms (pest_id, symptom, plant_part, timing, confidence)
     VALUES (?, ?, ?, ?, ?)`,
    ['septoria-tritici', 'Gele vlekken op onderste bladeren', 'bladeren', 'herfst en vroeg voorjaar', 'suggestive']
  );
  db.run(
    `INSERT INTO symptoms (pest_id, symptom, plant_part, timing, confidence)
     VALUES (?, ?, ?, ?, ?)`,
    ['septoria-tritici', 'Verminderde korrelzetting bij ernstige aantasting', 'aren', 'zomer', 'associated']
  );

  // Symptoms -- Phytophthora (2 symptoms)
  db.run(
    `INSERT INTO symptoms (pest_id, symptom, plant_part, timing, confidence)
     VALUES (?, ?, ?, ?, ?)`,
    ['phytophthora-infestans', 'Onregelmatige bruine vlekken op bladeren met wit schimmelpluis', 'bladeren', 'juni tot september', 'diagnostic']
  );
  db.run(
    `INSERT INTO symptoms (pest_id, symptom, plant_part, timing, confidence)
     VALUES (?, ?, ?, ?, ?)`,
    ['phytophthora-infestans', 'Bruinrot in knollen', 'knollen', 'oogst en bewaring', 'suggestive']
  );

  // Symptoms -- Bladluis (2 symptoms)
  db.run(
    `INSERT INTO symptoms (pest_id, symptom, plant_part, timing, confidence)
     VALUES (?, ?, ?, ?, ?)`,
    ['bladluis-granen', 'Kolonies kleine zachte insecten op bladeren stengels en aren', 'aren', 'voorjaar tot zomer', 'diagnostic']
  );
  db.run(
    `INSERT INTO symptoms (pest_id, symptom, plant_part, timing, confidence)
     VALUES (?, ?, ?, ?, ?)`,
    ['bladluis-granen', 'Honingdauw en zwarte roetdauwschimmels op bladeren', 'bladeren', 'zomer', 'suggestive']
  );

  // Treatments -- Septoria (1 chemical, 1 cultural)
  db.run(
    `INSERT INTO treatments (pest_id, approach, treatment, active_substance, timing, dose_rate, efficacy_notes, resistance_risk, approval_status, source, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'septoria-tritici', 'chemical', 'Bladbespuiting met Prosaro (prothioconazool + tebuconazool)',
      'prothioconazool + tebuconazool', 'T1 (GS 31-32) en T2 (GS 39-49), preventief tot vroeg curatief',
      '0,8-1,0 L/ha', 'Brede werking tegen bladschimmels. Combinatie van twee azolen voor resistentiemanagement.',
      'Matig tot hoog (azoolresistentie opbouwend in NL populaties)',
      'Ctgb toegelaten', 'Ctgb', 'NL',
    ]
  );
  db.run(
    `INSERT INTO treatments (pest_id, approach, treatment, active_substance, timing, dose_rate, efficacy_notes, resistance_risk, approval_status, source, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'septoria-tritici', 'cultural', 'Resistente rassen en gewasrotatie',
      null, 'Rassenkeuze en bouwplanplanning',
      null, 'Rassen met septoriaresistentie 7+ (Aanbevelende Rassenlijst) verlagen infectiedruk.',
      null, null, 'WUR/PPO', 'NL',
    ]
  );

  // Treatments -- Phytophthora (1 chemical, 1 cultural)
  db.run(
    `INSERT INTO treatments (pest_id, approach, treatment, active_substance, timing, dose_rate, efficacy_notes, resistance_risk, approval_status, source, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'phytophthora-infestans', 'chemical', 'Preventieve bladbespuiting met Ranman Top',
      'cyazofamide', 'Preventief, 5-7 dagen interval bij hoge druk',
      '0,5 L/ha', 'Contactmiddel met goede bladbescherming. Geen curatie.',
      'Laag resistentierisico (FRAC-groep 21)',
      'Ctgb toegelaten', 'Ctgb', 'NL',
    ]
  );
  db.run(
    `INSERT INTO treatments (pest_id, approach, treatment, active_substance, timing, dose_rate, efficacy_notes, resistance_risk, approval_status, source, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'phytophthora-infestans', 'cultural', 'IPM-maatregelen: resistente rassen, afvalhopen opruimen',
      null, 'Seizoensplanning en veldmanagement',
      null, 'Resistente rassen verlagen bespuitingsfrequentie. Opruimen afvalhopen verwijdert overwinteringsbron.',
      null, null, 'WUR/PPO', 'NL',
    ]
  );

  // Treatments -- Bladluis (1 chemical, 1 cultural)
  db.run(
    `INSERT INTO treatments (pest_id, approach, treatment, active_substance, timing, dose_rate, efficacy_notes, resistance_risk, approval_status, source, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'bladluis-granen', 'chemical', 'Insecticide bespuiting met Teppeki (flonicamid)',
      'flonicamid', 'Bij overschrijding schadedrempel',
      '0,14 kg/ha', 'Systemisch insecticide, selectief voor zuigende insecten.',
      'Laag (IRAC-groep 29)',
      'Ctgb toegelaten', 'Ctgb', 'NL',
    ]
  );
  db.run(
    `INSERT INTO treatments (pest_id, approach, treatment, active_substance, timing, dose_rate, efficacy_notes, resistance_risk, approval_status, source, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'bladluis-granen', 'cultural', 'Natuurlijke vijanden en schadedrempelbewaking',
      null, 'Seizoensmonitoring',
      null, 'Natuurlijke vijanden (lieveheersbeestjes, sluipwespen) kunnen populaties reguleren.',
      null, null, 'WUR/PPO', 'NL',
    ]
  );

  // IPM guidance -- wintertarwe + septoria
  db.run(
    `INSERT INTO ipm_guidance (crop_id, pest_id, threshold, monitoring_method, cultural_controls, prevention, decision_guide, source, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'wintertarwe', 'septoria-tritici',
      'T1-beslissing: septoria op bovenste 3 bladetages bij GS31-32 en >20% bladoppervlak aangetast op blad 3',
      'Visuele bladbeoordeling op meerdere plekken in veld. Let op pycniden in lesies.',
      'Resistente rassen (septoriaresistentie 7+), niet te vroeg zaaien, stikstofbemesting beperken',
      'Rassenkeuze is eerste stap. Gewasrotatie vermijdt inoculumopbouw.',
      'T1-bespuiting op basis van ras, zaaitijdstip, neerslag en bladaantasting. T2 altijd bij vatbare rassen.',
      'WUR/PPO', 'NL',
    ]
  );

  // Approved products
  db.run(
    `INSERT INTO approved_products (product_name, active_substance, target_pests, approved_crops, approval_expiry, registration_number, source, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'Prosaro', 'prothioconazool + tebuconazool', 'Septoria, fusarium, roest, meeldauw',
      'tarwe, gerst, rogge, triticale', '2027-10-31', 'W-13236', 'Ctgb', 'NL',
    ]
  );
  db.run(
    `INSERT INTO approved_products (product_name, active_substance, target_pests, approved_crops, approval_expiry, registration_number, source, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'Ranman Top', 'cyazofamide', 'Phytophthora infestans',
      'aardappelen', '2027-12-31', 'W-12614', 'Ctgb', 'NL',
    ]
  );

  // FTS5 search index entries for all 3 pests
  db.run(
    `INSERT INTO search_index (name, common_names, description, identification, pest_type, jurisdiction) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      'Septoria tritici bladvlekkenziekte', 'Bladvlekkenziekte, Septoria leaf blotch, Zymoseptoria tritici',
      'Schimmelziekte veroorzaakt door Zymoseptoria tritici. Belangrijkste bladziekte in wintertarwe in Nederland.',
      'Langwerpige bruine vlekken op bladeren met kenmerkende zwarte pycniden (vruchtlichamen) zichtbaar als donkere puntjes.',
      'disease', 'NL',
    ]
  );
  db.run(
    `INSERT INTO search_index (name, common_names, description, identification, pest_type, jurisdiction) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      'Phytophthora infestans', 'Aardappelziekte, Late blight, Phytophthora',
      'Oömyceet die aardappelziekte veroorzaakt. De belangrijkste ziekte in de Nederlandse aardappelteelt.',
      'Onregelmatige bruine vlekken op bladeren, vaak startend aan bladranden. Wit schimmelpluis aan onderzijde blad.',
      'disease', 'NL',
    ]
  );
  db.run(
    `INSERT INTO search_index (name, common_names, description, identification, pest_type, jurisdiction) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      'Bladluis (granen)', 'Graanbladluis, Grote graanluis, Sitobion avenae',
      'Verschillende bladluissoorten die granen aantasten: grote graanluis (Sitobion avenae), vogelkersluis (Rhopalosiphum padi).',
      'Kleine (2-3 mm) zachte insecten, groen tot roodbruin, op bladeren, stengels en aren. Honingdauwafscheiding.',
      'pest', 'NL',
    ]
  );

  return db;
}
