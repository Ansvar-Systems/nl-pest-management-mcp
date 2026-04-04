# Netherlands Pest Management MCP

[![CI](https://github.com/ansvar-systems/nl-pest-management-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/ansvar-systems/nl-pest-management-mcp/actions/workflows/ci.yml)
[![GHCR](https://github.com/ansvar-systems/nl-pest-management-mcp/actions/workflows/ghcr-build.yml/badge.svg)](https://github.com/ansvar-systems/nl-pest-management-mcp/actions/workflows/ghcr-build.yml)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Dutch pest, disease, and crop protection data via the [Model Context Protocol](https://modelcontextprotocol.io). Identify crop threats, get treatment options, IPM guidance, and run symptom-based differential diagnosis -- all from your AI assistant.

Part of [Ansvar Open Agriculture](https://ansvar.eu/open-agriculture).

## Why This Exists

Dutch farmers and agronomists need quick access to pest identification, treatment options, and IPM thresholds. This information is published by Ctgb, WUR/PPO, and CLM but is scattered across databases, research publications, and advisory bulletins. This MCP server brings it all together in a searchable, structured format.

## Quick Start

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "nl-pest-management": {
      "command": "npx",
      "args": ["-y", "@ansvar/nl-pest-management-mcp"]
    }
  }
}
```

### Claude Code

```bash
claude mcp add nl-pest-management npx @ansvar/nl-pest-management-mcp
```

### Streamable HTTP (remote)

```
https://mcp.ansvar.eu/nl-pest-management/mcp
```

### Docker (self-hosted)

```bash
docker run -p 3000:3000 ghcr.io/ansvar-systems/nl-pest-management-mcp:latest
```

### npm (stdio)

```bash
npx @ansvar/nl-pest-management-mcp
```

## Example Queries

Ask your AI assistant:

- "Welke ziekten treffen wintertarwe?"
- "Ik zie bruine vlekken op mijn aardappelbladeren met wit schimmelpluis -- wat kan het zijn?"
- "Wat zijn de behandelopties voor phytophthora in aardappelen?"
- "Toon de IPM-richtlijnen voor septoria in wintertarwe"
- "Welke producten met prothioconazool zijn toegelaten voor tarwe?"
- "Wat zijn de plagen en ziekten die gerst aantasten?"

## Stats

| Metric | Value |
|--------|-------|
| Tools | 10 (3 meta + 7 domain) |
| Jurisdiction | NL |
| Pests & diseases | 10 major Dutch arable threats |
| Approved products | 20 (Ctgb toelatingsbank) |
| IPM guidance records | 6 |
| Data sources | Ctgb toelatingsbank, WUR/PPO, CLM Milieumeetlat, NVWA |
| License (data) | Public government/research sources |
| License (code) | Apache-2.0 |
| Transport | stdio + Streamable HTTP |

## Tools

| Tool | Description |
|------|-------------|
| `about` | Server metadata and links |
| `list_sources` | Data sources with freshness info |
| `check_data_freshness` | Staleness status and refresh command |
| `search_pests` | FTS5 search across pest and disease data |
| `get_pest_details` | Full pest profile with symptoms and identification |
| `get_treatments` | Chemical, cultural, and biological treatment options |
| `get_ipm_guidance` | IPM thresholds, monitoring, and decision guides |
| `search_crop_threats` | All threats affecting a specific crop |
| `identify_from_symptoms` | Symptom-based differential diagnosis with confidence scoring |
| `get_approved_products` | Ctgb-approved pesticide products (gewasbeschermingsmiddelen) |

See [TOOLS.md](TOOLS.md) for full parameter documentation.

## Security Scanning

This repository runs 6 security checks on every push:

- **CodeQL** -- static analysis for JavaScript/TypeScript
- **Gitleaks** -- secret detection across full history
- **Dependency review** -- via Dependabot
- **Container scanning** -- via GHCR build pipeline

See [SECURITY.md](SECURITY.md) for reporting policy.

## Disclaimer

Pesticide data is for reference only. **Always check the current Ctgb register before applying any product.** This tool is not professional pest management advice. See [DISCLAIMER.md](DISCLAIMER.md).

## Contributing

Issues and pull requests welcome. For security vulnerabilities, email security@ansvar.eu (do not open a public issue).

## License

Apache-2.0. Data sourced from public Dutch government and research publications.
