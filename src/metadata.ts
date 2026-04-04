export interface Meta {
  disclaimer: string;
  data_age: string;
  source_url: string;
  copyright: string;
  server: string;
  version: string;
}

const DISCLAIMER =
  'This data is provided for informational purposes only. It does not constitute professional ' +
  'pest management or agronomic advice. Always consult a qualified agronomist or licensed ' +
  'gewasbeschermingsadviseur before making crop protection decisions. Pesticide approval data is ' +
  'sourced from the Ctgb (College voor de toelating van gewasbeschermingsmiddelen en biociden) ' +
  'toelatingsbank. Always check the current Ctgb register before applying any pesticide product. ' +
  'IPM guidance is based on WUR/PPO and CLM publications.';

export function buildMeta(overrides?: Partial<Meta>): Meta {
  return {
    disclaimer: DISCLAIMER,
    data_age: overrides?.data_age ?? 'unknown',
    source_url: overrides?.source_url ?? 'https://toelatingen.ctgb.nl/',
    copyright: 'Data: Ctgb, WUR/PPO, CLM (public sources). Server: Apache-2.0 Ansvar Systems.',
    server: 'nl-pest-management-mcp',
    version: '0.1.0',
    ...overrides,
  };
}
