# Coverage

## What Is Included

- **Pest and disease profiles**: 10 major threats to Dutch arable agriculture -- diseases (Phytophthora, Septoria, meeldauw, Fusarium, Rhizoctonia, ratelziekte), pests (bladluis, coloradokever, aardappelcysteaaltje, stengelaaltje)
- **Symptom database** with confidence levels (diagnostic, suggestive, associated) for differential diagnosis -- 36 symptom records
- **Treatment options**: chemical (with active substances, Ctgb registration, timing, resistance risk) and cultural approaches -- 23 treatment records
- **IPM guidance**: monitoring thresholds (schadedrempels), decision guides, cultural controls -- 6 guidance records covering aardappelen, wintertarwe, and granen
- **Approved products**: 20 Ctgb-registered gewasbeschermingsmiddelen with W-nummers, active substances, approved crops, and expiry dates

## Jurisdictions

| Code | Country | Status |
|------|---------|--------|
| NL | Netherlands | Supported |

## Pests & Diseases Covered

| ID | Name | Type | Key Crops |
|----|------|------|-----------|
| phytophthora-infestans | Phytophthora infestans (aardappelziekte) | disease | aardappelen, tomaten |
| septoria-tritici | Septoria tritici bladvlekkenziekte | disease | tarwe |
| meeldauw | Echte meeldauw (granen) | disease | tarwe, gerst |
| fusarium-aar | Fusarium (aarfusarium) | disease | tarwe, gerst, triticale |
| rhizoctonia-solani | Rhizoctonia solani (lakschurft) | disease | aardappelen, suikerbieten |
| ratelziekte | Ratelziekte (Tobacco Rattle Virus) | disease | aardappelen, tulpen |
| bladluis-granen | Bladluis (granen) | pest | tarwe, gerst, aardappelen |
| coloradokever | Coloradokever | pest | aardappelen |
| aardappelcysteaaltje | Aardappelcysteaaltje (Globodera) | pest | aardappelen |
| stengelaaltje | Stengelaaltje (Ditylenchus dipsaci) | pest | uien, tulpen, suikerbieten |

## Data Sources

| Source | Authority | Coverage |
|--------|-----------|----------|
| Ctgb toelatingsbank | College voor de toelating van gewasbeschermingsmiddelen en biociden | Approved products, registration numbers, active substances |
| WUR/PPO | Wageningen University & Research | Pest profiles, IPM guidance, damage thresholds |
| CLM Milieumeetlat | Centrum voor Landbouw en Milieu | Environmental impact indicators |
| NVWA | Nederlandse Voedsel- en Warenautoriteit | Quarantine organisms, phytosanitary regulations |
| Aanbevelende Rassenlijst | Stichting CGO | Variety resistance ratings |

## What Is NOT Included

- **Other EU member state approvals** -- only Dutch Ctgb-registered products are included
- **Horticultural and ornamental pest detail** -- primary focus is arable crops in v0.1.0
- **Detailed resistance data** -- general resistance risk notes are included, not full resistance maps or monitoring data
- **Real-time product approval changes** -- Ctgb updates are ingested periodically, not in real time
- **Biological control agent products** -- focus is on chemical and cultural approaches
- **Spray application rates** -- always refer to product labels for current authorised rates
- **CLM environmental scores** -- planned for future release
- **Weed species** -- focus is on diseases and invertebrate pests in v0.1.0

## Known Gaps

1. Symptom database coverage is focused on the 10 most important Dutch arable pests/diseases
2. FTS5 search quality varies with query phrasing -- use specific pest or symptom terms for best results (Dutch or Latin names work)
3. Approved product data depends on Ctgb publication schedule; always verify current approvals before use
4. IPM guidance covers key crop-pest combinations; not all 10 pests have dedicated IPM records
5. Quarantine organism regulations (coloradokever, aardappelcysteaaltje) reference NVWA requirements but do not replicate full regulatory text

## Data Freshness

Run `check_data_freshness` to see when data was last updated. The ingestion pipeline runs on a schedule; manual triggers available via `gh workflow run ingest.yml`.
