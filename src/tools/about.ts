import { buildMeta } from '../metadata.js';
import { SUPPORTED_JURISDICTIONS } from '../jurisdiction.js';

export function handleAbout() {
  return {
    name: 'Netherlands Pest Management MCP',
    description:
      'Dutch pest, disease, and crop protection data — identification, treatment options, IPM guidance, and ' +
      'symptom-based differential diagnosis. Data sourced from Ctgb toelatingsbank, WUR/PPO ' +
      'gewasbeschermingskennisbank, and CLM milieumeetlat.',
    version: '0.1.0',
    jurisdiction: [...SUPPORTED_JURISDICTIONS],
    data_sources: ['Ctgb toelatingsbank', 'WUR/PPO Gewasbeschermingskennisbank', 'CLM Milieumeetlat', 'NVWA'],
    tools_count: 10,
    links: {
      homepage: 'https://ansvar.eu/open-agriculture',
      repository: 'https://github.com/ansvar-systems/nl-pest-management-mcp',
      mcp_network: 'https://ansvar.ai/mcp',
    },
    _meta: buildMeta(),
  };
}
