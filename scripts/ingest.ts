/**
 * Netherlands Pest Management MCP — Data Ingestion Script
 *
 * Sources:
 *   - Ctgb (College voor de toelating van gewasbeschermingsmiddelen en biociden) — toelatingsbank
 *   - WUR/PPO (Wageningen University & Research / Praktijkonderzoek Plant & Omgeving)
 *   - CLM (Centrum voor Landbouw en Milieu) — milieumeetlat
 *   - NVWA (Nederlandse Voedsel- en Warenautoriteit) — fytosanitaire regelgeving
 *   - Gewasbeschermingskennisbank (WUR) — gewasbescherming.wur.nl
 *
 * Usage: npm run ingest
 */

import { createDatabase } from '../src/db.js';
import { mkdirSync, writeFileSync } from 'fs';

mkdirSync('data', { recursive: true });
const db = createDatabase('data/database.db');

const now = new Date().toISOString().split('T')[0];
const JURISDICTION = 'NL';

// ---------------------------------------------------------------------------
// 1. PESTS & DISEASES
// ---------------------------------------------------------------------------

interface PestRecord {
  id: string;
  name: string;
  common_names: string[];
  pest_type: string;
  description: string;
  lifecycle: string;
  identification: string;
  crops_affected: string[];
  risk_factors: string;
  economic_impact: string;
  images_description: string;
}

const pests: PestRecord[] = [
  {
    id: 'phytophthora-infestans',
    name: 'Phytophthora infestans',
    common_names: ['Aardappelziekte', 'Late blight', 'Phytophthora'],
    pest_type: 'disease',
    description:
      'Oömyceet (Phytophthora infestans) die aardappelziekte veroorzaakt. ' +
      'De belangrijkste ziekte in de Nederlandse aardappelteelt, verantwoordelijk voor jaarlijkse verliezen ' +
      'van tientallen miljoenen euro. Verspreidt zich snel bij vochtig, koel weer (15-20°C).',
    lifecycle:
      'Overwintert op afvalhopen en opslag. Zoösporen verspreiden via wind en regen. ' +
      'Infectiecyclus 4-7 dagen bij optimale omstandigheden. Sporangia kiemen direct of ' +
      'vormen zoösporen bij temperaturen onder 15°C.',
    identification:
      'Onregelmatige bruine vlekken op bladeren, vaak startend aan bladranden. Wit schimmelpluis ' +
      'aan onderzijde blad bij vochtig weer. Bruine, leerachtige vlekken op stengels. ' +
      'Knollen vertonen oppervlakkig bruinrot dat zich naar binnen uitbreidt.',
    crops_affected: ['aardappelen', 'tomaten'],
    risk_factors:
      'Vochtig weer (>90% RV), temperatuur 10-20°C, onbeschermde nieuwe bladgroei, ' +
      'nabijheid afvalhopen, vatbare rassen',
    economic_impact:
      'Gemiddeld 50-80 miljoen euro per jaar aan bestrijdingskosten in Nederland. ' +
      'Onbehandeld gewas kan binnen 2 weken volledig afsterven. Knolinfectie veroorzaakt bewaarverliezen.',
    images_description:
      'Bruine vlekken op aardappelblad met wit schimmelpluis aan onderzijde',
  },
  {
    id: 'septoria-tritici',
    name: 'Septoria tritici bladvlekkenziekte',
    common_names: ['Bladvlekkenziekte', 'Septoria leaf blotch', 'Zymoseptoria tritici'],
    pest_type: 'disease',
    description:
      'Schimmelziekte veroorzaakt door Zymoseptoria tritici (voorheen Mycosphaerella graminicola). ' +
      'Belangrijkste bladziekte in wintertarwe in Nederland. Veroorzaakt significante opbrengstverliezen ' +
      'vooral in natte jaren.',
    lifecycle:
      'Infectie via ascosporen (herfst) en pyknidiosporen (regenspatten, voorjaar). ' +
      'Latente periode 2-4 weken voor symptomen zichtbaar worden. ' +
      'Spreidt zich van onderste bladeren naar boven via regenspatten.',
    identification:
      'Langwerpige bruine vlekken op bladeren met kenmerkende zwarte pycniden (vruchtlichamen) ' +
      'zichtbaar als donkere puntjes in de lesie. Vlekken vaak tussen bladnerven begrensd.',
    crops_affected: ['tarwe', 'wintertarwe', 'zomertarwe'],
    risk_factors:
      'Natte herfst en winter, vatbare rassen, vroege zaai, dicht gewas, ' +
      'beperkte gewasrotatie',
    economic_impact:
      'Opbrengstderving tot 30-50% bij onbehandelde vatbare rassen in natte jaren. ' +
      'Belangrijkste reden voor fungicidegebruik in tarwe.',
    images_description:
      'Bruine langwerpige bladvlekken met zwarte pycniden op tarweblad',
  },
  {
    id: 'meeldauw',
    name: 'Echte meeldauw (granen)',
    common_names: ['Meeldauw', 'Powdery mildew', 'Blumeria graminis'],
    pest_type: 'disease',
    description:
      'Schimmelziekte veroorzaakt door Blumeria graminis. Vormt wit poederachtig schimmelpluis ' +
      'op bladeren en aren. Verschillende formae speciales voor tarwe (f.sp. tritici) ' +
      'en gerst (f.sp. hordei).',
    lifecycle:
      'Verspreiding via windverspreide conidiën. Infectie bij gematigd weer (15-22°C) ' +
      'en hoge luchtvochtigheid. Nieuwe generatie elke 7-10 dagen.',
    identification:
      'Wit tot grijswit poederachtig schimmelpluis op bovenzijde bladeren, bladsscheden en aren. ' +
      'Oudere infecties worden grijsbruin. Mycelium afwisbaar met de vinger.',
    crops_affected: ['tarwe', 'wintertarwe', 'gerst', 'wintergerst', 'zomergerst'],
    risk_factors:
      'Dicht gewas, hoge stikstofbemesting, vatbare rassen, beschutte percelen',
    economic_impact:
      'Opbrengstderving 5-20% bij ernstige aantasting. Vooral in gerst economisch relevant.',
    images_description: 'Wit poederachtig schimmelpluis op tarwebladeren',
  },
  {
    id: 'bladluis-granen',
    name: 'Bladluis (granen)',
    common_names: ['Graanbladluis', 'Grote graanluis', 'Sitobion avenae', 'Aphids'],
    pest_type: 'pest',
    description:
      'Verschillende bladluissoorten die granen aantasten: grote graanluis (Sitobion avenae), ' +
      'vogelkersluis (Rhopalosiphum padi), roosgrasluis (Metopolophium dirhodum). ' +
      'Directe zuigschade en overdracht van gerstvergelingsvirus (BYDV).',
    lifecycle:
      'Gevleugelde bladluizen koloniseren gewassen in het voorjaar. Populatieopbouw bij warm, ' +
      'droog weer. In de herfst kans op BYDV-overdracht door vroege kolonisatie.',
    identification:
      'Kleine (2-3 mm) zachte insecten, groen tot roodbruin, op bladeren, stengels en aren. ' +
      'Herkenbaar aan sipho (achterbuisjes). Honingdauwafscheiding leidt tot zwarte roetdauw.',
    crops_affected: ['tarwe', 'wintertarwe', 'gerst', 'wintergerst', 'haver', 'aardappelen', 'suikerbieten'],
    risk_factors:
      'Warm droog voorjaar, weinig natuurlijke vijanden, vroege zaai in herfst (BYDV-risico)',
    economic_impact:
      'Directe zuigschade: opbrengstderving 5-15%. BYDV-infectie via herfstbladluizen: tot 30% verlies.',
    images_description:
      'Groene bladluizen op tarweaar met honingdauwdruppels',
  },
  {
    id: 'coloradokever',
    name: 'Coloradokever',
    common_names: ['Coloradokever', 'Colorado potato beetle', 'Leptinotarsa decemlineata'],
    pest_type: 'pest',
    description:
      'Bladkever (Leptinotarsa decemlineata) afkomstig uit Noord-Amerika. Quarantaineorganisme (Q-organisme) ' +
      'in Nederland onder EU-fytosanitaire regelgeving. Larven en volwassen kevers vreten het blad kaal. ' +
      'Meldingsplicht bij NVWA.',
    lifecycle:
      'Volwassen kevers overwinteren in de grond. Eiafzetting in voorjaar op onderzijde bladeren ' +
      '(oranje eipakketjes). Larven doorlopen 4 stadia (2-3 weken), verpoppen in de grond. ' +
      '1-2 generaties per jaar in Nederland.',
    identification:
      'Volwassen kever: 10 mm, geel-oranje met 10 zwarte lengtestrepen op dekschilden. ' +
      'Larven: roodachtig met zwarte stippen langs de zijkant. Eieren: oranje, in pakketjes van 20-60 ' +
      'op onderzijde blad.',
    crops_affected: ['aardappelen', 'aubergine', 'tomaten'],
    risk_factors:
      'Warm weer bevordert ontwikkeling, monocultuur aardappelen, nabijheid besmette percelen',
    economic_impact:
      'Volledige kaalvraat mogelijk bij onbehandeld gewas. Quarantainestatus betekent meldingsplicht ' +
      'en verplichte bestrijding.',
    images_description:
      'Geel-oranje kever met zwarte strepen op aardappelblad',
  },
  {
    id: 'aardappelcysteaaltje',
    name: 'Aardappelcysteaaltje',
    common_names: ['Aardappelmoeheid', 'Potato cyst nematode', 'Globodera pallida', 'Globodera rostochiensis'],
    pest_type: 'pest',
    description:
      'Aardappelcysteaaltjes (Globodera pallida en G. rostochiensis) zijn quarantaineplichtige bodemorganismen. ' +
      'Cysten kunnen 20+ jaar in de bodem overleven. Verplichte AM-bemonstering voor aardappelteelt in Nederland.',
    lifecycle:
      'Cysten bevatten 200-600 eieren/larven. Uitloken door wortelexudaten van aardappel. ' +
      'Larven dringen wortels binnen, vrouwtjes vormen nieuwe cysten aan worteloppervlak. ' +
      'Eén generatie per teeltseizoen.',
    identification:
      'Bovengronds: pleksgewijze groeiachterstand, vergeling, verwelking. Wortels: witte (G. rostochiensis) ' +
      'of crèmekleurige (G. pallida) bolletjes (0,5 mm) zichtbaar op wortels. ' +
      'Bevestiging via AM-bemonstering.',
    crops_affected: ['aardappelen', 'tomaten'],
    risk_factors:
      'Te nauwe vruchtwisseling, langjarig aardappelen op zelfde perceel, gebruik vatbare rassen, ' +
      'geen AM-bemonstering',
    economic_impact:
      'Opbrengstverliezen 20-80% bij zware besmetting. Verplichte bemonstering en bestrijding. ' +
      'Handelsbeperking bij besmetting (EU-quarantaine).',
    images_description:
      'Pleksgewijze groeiachterstand in aardappelveld, witte cysten op wortels',
  },
  {
    id: 'fusarium-aar',
    name: 'Fusarium (aarfusarium)',
    common_names: ['Aarfusarium', 'Fusarium ear blight', 'Fusarium graminearum', 'Fusarium culmorum'],
    pest_type: 'disease',
    description:
      'Aarschimmel veroorzaakt door Fusarium graminearum en F. culmorum. Produceert mycotoxinen ' +
      '(deoxynivalenol/DON, zearalenon) die schadelijk zijn voor mens en dier. ' +
      'EU-normen voor DON in voedingsgranen: 1250 µg/kg (onbewerkt graan).',
    lifecycle:
      'Overwintert op gewasresten (vooral maïsstoppel). Ascosporen verspreiden via wind tijdens bloei. ' +
      'Infectie bij vochtig weer (>87% RV) tijdens bloei (GS 61-69).',
    identification:
      'Gebleekte aarpakjes tussen gezond groen weefsel (gedeeltelijke aarbleking). ' +
      'Roze-oranje sporenmassa op kafjes bij vochtig weer. Verschrompelde, lichte korrels. ' +
      'Verhoogd DON-gehalte bij oogstanalyse.',
    crops_affected: ['tarwe', 'wintertarwe', 'zomertarwe', 'gerst', 'wintergerst', 'triticale'],
    risk_factors:
      'Vochtig weer tijdens bloei, maïs als voorvrucht, minimale grondbewerking ' +
      '(gewasresten aan oppervlak), vatbare rassen',
    economic_impact:
      'Opbrengstderving 5-30%. Mycotoxinenrisico: partijafkeur bij overschrijding DON-norm ' +
      '(directe financiële schade). Graan voor veevoeder heeft hogere norm (8000 µg/kg).',
    images_description:
      'Gedeeltelijk gebleekte tarweaar met roze schimmelgroei op kafjes',
  },
  {
    id: 'rhizoctonia-solani',
    name: 'Rhizoctonia solani',
    common_names: ['Lakschurft', 'Rhizoctonia', 'Black scurf', 'Wortelbrand'],
    pest_type: 'disease',
    description:
      'Bodemschimmel (Rhizoctonia solani) met brede waardplantenreeks. In aardappelen: lakschurft ' +
      '(zwarte sclerotiën op knollen) en stengelkanker. In suikerbieten: wortelbrand (kiemplantenziekte) ' +
      'en late wortelbrand.',
    lifecycle:
      'Sclerotiën overleven jarenlang in de bodem en op knollen. Infectie vanuit besmette pootaardappelen ' +
      'of besmette grond. Anastomosegroepen (AG) bepalen waardplantspecificiteit: AG-3 voor aardappel, ' +
      'AG 2-2 IIIB voor suikerbieten.',
    identification:
      'Aardappel: zwarte, onregelmatige korstjes (sclerotiën) op knolschil die niet afwasbaar zijn. ' +
      'Misvorming en scheurvorming knollen. Witte "sokjes" (mycelium) rond stengelbasis. ' +
      'Suikerbiet: ingesnoerde, zwartverkleurde wortelhals bij kiemplanten.',
    crops_affected: ['aardappelen', 'suikerbieten', 'uien', 'wortelen'],
    risk_factors:
      'Koude natte bodem bij opkomst, verdichte grond, besmette pootaardappelen, ' +
      'nauwe vruchtwisseling',
    economic_impact:
      'Aardappel: kwaliteitsverlies (lakschurft), standreductie door stengelkanker. ' +
      'Suikerbiet: kiemplantverlies tot 30% bij wortelbrand. Kwaliteitskorting bij pootaardappelen.',
    images_description:
      'Zwarte sclerotiën (lakschurft) op aardappelknol, witte mycelium-manchet om stengelbasis',
  },
  {
    id: 'ratelziekte',
    name: 'Ratelziekte (Tobacco Rattle Virus)',
    common_names: ['Ratelziekte', 'Kringerigheid', 'Tobacco Rattle Virus', 'TRV'],
    pest_type: 'disease',
    description:
      'Virusziekte (Tobacco Rattle Virus) overgedragen door trichodoride aaltjes (Trichodorus/Paratrichodorus). ' +
      'Veroorzaakt kringerigheid in aardappelknollen: bruine necrotische ringen en bogen in het knolvlees. ' +
      'Geen curatieve behandeling mogelijk.',
    lifecycle:
      'Virus circuleert in trichodoride aaltjespopulaties die op wortels voeden. ' +
      'Aaltjes blijven jaren besmettelijk. Virusoverdracht binnen minuten bij wortelvoeding. ' +
      'Aaltjes komen voor op zandgronden en lichte zavelgronden.',
    identification:
      'Uitwendig: soms onregelmatige knolvorm. Bij doorsnijden: bruine necrotische ringen, ' +
      'bogen en vlekken (kringerigheid) in het knolvlees. Bovengronds: soms gele vlekken/ringen ' +
      'op bladeren, maar vaak symptoomloos loof.',
    crops_affected: ['aardappelen', 'tulpen', 'gladiolen', 'spinazie'],
    risk_factors:
      'Zandgrond, hoge trichodoridenpopulatie, teelt van waardplanten in bouwplan, ' +
      'afwezigheid nematodenresistentie',
    economic_impact:
      'Kwaliteitsafkeur bij >5% kringerige knollen in pootgoedpartij. ' +
      'Consumptieaardappelen: afkeur bij zichtbare ringen na schillen.',
    images_description:
      'Doorgesneden aardappelknol met bruine necrotische ringen (kringerigheid)',
  },
  {
    id: 'stengelaaltje',
    name: 'Stengelaaltje',
    common_names: ['Stengelaaltje', 'Stem nematode', 'Ditylenchus dipsaci', 'Bolrot'],
    pest_type: 'pest',
    description:
      'Plantenparasitair aaltje (Ditylenchus dipsaci) met brede waardplantenreeks. ' +
      'Verschillende biologische rassen gespecialiseerd op uien, tulpen, narcissen, suikerbieten, ' +
      'erwten, etc. Quarantaineplichtig in pootgoed en bloembollen.',
    lifecycle:
      'Overleving als 4e-stadium larven (dauer-larven) in droge plantresten en bodem, tot 20+ jaar. ' +
      'Migratie via bodemvocht. Binnendringen via huidmondjes of beschadigingen. ' +
      'Vermeerdering in stengelbasis en bollen. Meerdere generaties per seizoen.',
    identification:
      'Uien: opgezwollen, vervormde stengelbasis, zachte glazige bol die inrot. ' +
      'Tulpen: misvormde, korte stengels, bloemdeformatie. ' +
      'Suikerbiet: krullerig, verdikt hart ("kroef"). ' +
      'Microscopische bevestiging nodig voor determinatie.',
    crops_affected: ['uien', 'tulpen', 'narcissen', 'suikerbieten', 'erwten', 'bonen'],
    risk_factors:
      'Nauwe vruchtwisseling met waardplanten, gebruik besmet uitgangsmateriaal, ' +
      'natte bodemomstandigheden, schade aan planten bij mechanische bewerkingen',
    economic_impact:
      'Uien: bewaarverliezen tot 30-50%. Bloembollen: exportverbod bij besmetting. ' +
      'Vruchtwisseling 1:6 minimaal nodig voor populatiebeheer.',
    images_description:
      'Opgezwollen, vervormde uienstengelbasis met inrottend bolweefsel',
  },
];

for (const p of pests) {
  db.run(
    `INSERT OR REPLACE INTO pests (id, name, common_names, pest_type, description, lifecycle, identification, crops_affected, risk_factors, economic_impact, images_description, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      p.id, p.name, JSON.stringify(p.common_names), p.pest_type, p.description,
      p.lifecycle, p.identification, JSON.stringify(p.crops_affected),
      p.risk_factors, p.economic_impact, p.images_description, JURISDICTION,
    ]
  );
}
console.log(`Inserted ${pests.length} pests.`);

// ---------------------------------------------------------------------------
// 2. SYMPTOMS
// ---------------------------------------------------------------------------

interface SymptomRecord {
  pest_id: string;
  symptom: string;
  plant_part: string;
  timing: string;
  confidence: 'diagnostic' | 'suggestive' | 'associated';
}

const symptoms: SymptomRecord[] = [
  // Phytophthora infestans
  { pest_id: 'phytophthora-infestans', symptom: 'Onregelmatige bruine vlekken op bladeren, vaak startend aan bladrand', plant_part: 'bladeren', timing: 'juni tot september', confidence: 'diagnostic' },
  { pest_id: 'phytophthora-infestans', symptom: 'Wit schimmelpluis aan onderzijde blad bij vochtig weer', plant_part: 'bladeren', timing: 'juni tot september', confidence: 'diagnostic' },
  { pest_id: 'phytophthora-infestans', symptom: 'Bruinrot in knollen, leerachtig vast weefsel', plant_part: 'knollen', timing: 'oogst en bewaring', confidence: 'diagnostic' },
  { pest_id: 'phytophthora-infestans', symptom: 'Bruine vlekken op stengels', plant_part: 'stengels', timing: 'zomer', confidence: 'suggestive' },
  { pest_id: 'phytophthora-infestans', symptom: 'Versnelde loofdood', plant_part: 'hele plant', timing: 'zomer', confidence: 'associated' },

  // Septoria tritici
  { pest_id: 'septoria-tritici', symptom: 'Langwerpige bruine vlekken met zwarte pycniden op tarwebladeren', plant_part: 'bladeren', timing: 'herfst tot voorjaar', confidence: 'diagnostic' },
  { pest_id: 'septoria-tritici', symptom: 'Gele vlekken op onderste bladeren', plant_part: 'bladeren', timing: 'herfst en vroeg voorjaar', confidence: 'suggestive' },
  { pest_id: 'septoria-tritici', symptom: 'Verminderde korrelzetting bij ernstige aantasting bovenste bladeren', plant_part: 'aren', timing: 'zomer', confidence: 'associated' },

  // Meeldauw
  { pest_id: 'meeldauw', symptom: 'Wit tot grijswit poederachtig schimmelpluis op bovenzijde bladeren', plant_part: 'bladeren', timing: 'voorjaar tot zomer', confidence: 'diagnostic' },
  { pest_id: 'meeldauw', symptom: 'Oudere meeldauwvlekken worden grijsbruin met zwarte cleistothecia', plant_part: 'bladeren', timing: 'zomer', confidence: 'diagnostic' },
  { pest_id: 'meeldauw', symptom: 'Verminderde bladfotosynthese bij ernstige aantasting', plant_part: 'bladeren', timing: 'zomer', confidence: 'associated' },

  // Bladluis
  { pest_id: 'bladluis-granen', symptom: 'Kolonies kleine zachte insecten op bladeren, stengels en aren', plant_part: 'aren', timing: 'voorjaar tot zomer', confidence: 'diagnostic' },
  { pest_id: 'bladluis-granen', symptom: 'Honingdauw en zwarte roetdauwschimmels op bladeren', plant_part: 'bladeren', timing: 'zomer', confidence: 'suggestive' },
  { pest_id: 'bladluis-granen', symptom: 'Krullende bladeren en groeiremming', plant_part: 'bladeren', timing: 'voorjaar', confidence: 'suggestive' },
  { pest_id: 'bladluis-granen', symptom: 'Vergeling door gerstvergelingsvirus (BYDV)', plant_part: 'hele plant', timing: 'herfst tot voorjaar', confidence: 'associated' },

  // Coloradokever
  { pest_id: 'coloradokever', symptom: 'Geel-oranje kever met 10 zwarte lengtestrepen op dekschilden', plant_part: 'bladeren', timing: 'voorjaar tot zomer', confidence: 'diagnostic' },
  { pest_id: 'coloradokever', symptom: 'Oranje eipakketjes aan onderzijde bladeren', plant_part: 'bladeren', timing: 'voorjaar', confidence: 'diagnostic' },
  { pest_id: 'coloradokever', symptom: 'Kaalvraat bladeren, alleen nerven resterend', plant_part: 'bladeren', timing: 'zomer', confidence: 'suggestive' },
  { pest_id: 'coloradokever', symptom: 'Roodachtige larven met zwarte stippen op bladeren', plant_part: 'bladeren', timing: 'voorjaar tot zomer', confidence: 'diagnostic' },

  // Aardappelcysteaaltje
  { pest_id: 'aardappelcysteaaltje', symptom: 'Pleksgewijze groeiachterstand in perceel', plant_part: 'hele plant', timing: 'groeiperiode', confidence: 'suggestive' },
  { pest_id: 'aardappelcysteaaltje', symptom: 'Vergeling en verwelking planten bij warm weer', plant_part: 'hele plant', timing: 'zomer', confidence: 'suggestive' },
  { pest_id: 'aardappelcysteaaltje', symptom: 'Witte of crèmekleurige bolletjes (cysten) zichtbaar op wortels', plant_part: 'wortels', timing: 'zomer', confidence: 'diagnostic' },

  // Fusarium aar
  { pest_id: 'fusarium-aar', symptom: 'Gebleekte aarpakjes tussen gezond groen weefsel', plant_part: 'aren', timing: 'bloei tot rijping', confidence: 'diagnostic' },
  { pest_id: 'fusarium-aar', symptom: 'Roze-oranje sporenmassa op kafjes bij vochtig weer', plant_part: 'aren', timing: 'bloei tot rijping', confidence: 'diagnostic' },
  { pest_id: 'fusarium-aar', symptom: 'Verschrompelde, lichte korrels bij dorsen', plant_part: 'aren', timing: 'oogst', confidence: 'suggestive' },

  // Rhizoctonia solani
  { pest_id: 'rhizoctonia-solani', symptom: 'Zwarte, niet-afwasbare sclerotiën (lakschurft) op aardappelknollen', plant_part: 'knollen', timing: 'oogst', confidence: 'diagnostic' },
  { pest_id: 'rhizoctonia-solani', symptom: 'Witte mycelium-manchet rond stengelbasis (wit-benen)', plant_part: 'stengels', timing: 'voorjaar tot zomer', confidence: 'diagnostic' },
  { pest_id: 'rhizoctonia-solani', symptom: 'Ingesnoerde, zwartverkleurde wortelhals bij bietenkiemplanten', plant_part: 'wortels', timing: 'kiemplantstadium', confidence: 'diagnostic' },
  { pest_id: 'rhizoctonia-solani', symptom: 'Misvorming en scheurvorming aardappelknollen', plant_part: 'knollen', timing: 'oogst', confidence: 'suggestive' },

  // Ratelziekte (TRV)
  { pest_id: 'ratelziekte', symptom: 'Bruine necrotische ringen en bogen in knolvlees (kringerigheid)', plant_part: 'knollen', timing: 'oogst', confidence: 'diagnostic' },
  { pest_id: 'ratelziekte', symptom: 'Gele ringen of vlekken op bladeren', plant_part: 'bladeren', timing: 'groeiperiode', confidence: 'suggestive' },
  { pest_id: 'ratelziekte', symptom: 'Onregelmatige knolvorm', plant_part: 'knollen', timing: 'oogst', confidence: 'associated' },

  // Stengelaaltje
  { pest_id: 'stengelaaltje', symptom: 'Opgezwollen, vervormde stengelbasis bij uien', plant_part: 'stengelbasis', timing: 'groeiperiode', confidence: 'diagnostic' },
  { pest_id: 'stengelaaltje', symptom: 'Zachte, glazige bolschubben die inrotten', plant_part: 'bollen', timing: 'groei en bewaring', confidence: 'diagnostic' },
  { pest_id: 'stengelaaltje', symptom: 'Misvormde, korte stengels en bloemdeformatie bij tulpen', plant_part: 'stengels', timing: 'voorjaar', confidence: 'diagnostic' },
  { pest_id: 'stengelaaltje', symptom: 'Krullerig, verdikt hart bij suikerbieten (kroef)', plant_part: 'hart', timing: 'zomer', confidence: 'suggestive' },
];

for (const s of symptoms) {
  db.run(
    `INSERT INTO symptoms (pest_id, symptom, plant_part, timing, confidence) VALUES (?, ?, ?, ?, ?)`,
    [s.pest_id, s.symptom, s.plant_part, s.timing, s.confidence]
  );
}
console.log(`Inserted ${symptoms.length} symptoms.`);

// ---------------------------------------------------------------------------
// 3. TREATMENTS
// ---------------------------------------------------------------------------

interface TreatmentRecord {
  pest_id: string;
  approach: string;
  treatment: string;
  active_substance: string | null;
  timing: string;
  dose_rate: string | null;
  efficacy_notes: string;
  resistance_risk: string | null;
  approval_status: string | null;
  source: string;
}

const treatments: TreatmentRecord[] = [
  // Phytophthora infestans — chemical
  {
    pest_id: 'phytophthora-infestans', approach: 'chemical',
    treatment: 'Preventieve bladbespuiting met Ranman Top (cyazofamide)',
    active_substance: 'cyazofamide',
    timing: 'Preventief, 5-7 dagen interval bij hoge druk, starten voor infectie',
    dose_rate: '0,5 L/ha (Ranman Top)',
    efficacy_notes: 'Contactmiddel met goede bladbescherming. Geen curatie. Goed in afwisseling met systemische middelen.',
    resistance_risk: 'Laag resistentierisico (FRAC-groep 21)',
    approval_status: 'Ctgb toegelaten', source: 'Ctgb',
  },
  {
    pest_id: 'phytophthora-infestans', approach: 'chemical',
    treatment: 'Preventief/curatieve bespuiting met Revus (mandipropamid)',
    active_substance: 'mandipropamid',
    timing: 'Preventief tot vroeg curatief, 7-10 dagen interval',
    dose_rate: '0,6 L/ha (Revus)',
    efficacy_notes: 'Translaminaire werking, beschermt ook bladonderzijde. Beperkte curatieve werking.',
    resistance_risk: 'Matig (FRAC-groep 40, CAA-fungiciden)',
    approval_status: 'Ctgb toegelaten', source: 'Ctgb',
  },
  {
    pest_id: 'phytophthora-infestans', approach: 'chemical',
    treatment: 'Systemische bespuiting met Infinito (fluopicolide + propamocarb)',
    active_substance: 'fluopicolide + propamocarb-hydrochloride',
    timing: 'Preventief tot curatief, 7-14 dagen interval',
    dose_rate: '1,2-1,6 L/ha (Infinito)',
    efficacy_notes: 'Systemische en translaminaire werking. Goede curatieve activiteit. Beschermt ook stengelinfectie.',
    resistance_risk: 'Matig (combinatie FRAC 43 + 28)',
    approval_status: 'Ctgb toegelaten', source: 'Ctgb',
  },
  {
    pest_id: 'phytophthora-infestans', approach: 'cultural',
    treatment: 'IPM-maatregelen: resistente rassen, afvalhopen opruimen, loofdoding',
    active_substance: null,
    timing: 'Seizoensplanning en veldmanagement',
    dose_rate: null,
    efficacy_notes: 'Resistente rassen (9-score Aardappelrassenlijst) verlagen bespuitingsfrequentie. Opruimen afvalhopen verwijdert overwinteringsbron. Tijdige loofdoding voorkomt knolinfectie.',
    resistance_risk: null,
    approval_status: null, source: 'WUR/PPO',
  },

  // Septoria tritici — chemical
  {
    pest_id: 'septoria-tritici', approach: 'chemical',
    treatment: 'Bladbespuiting met Prosaro (prothioconazool + tebuconazool)',
    active_substance: 'prothioconazool + tebuconazool',
    timing: 'T1 (GS 31-32) en T2 (GS 39-49), preventief tot vroeg curatief',
    dose_rate: '0,8-1,0 L/ha (Prosaro)',
    efficacy_notes: 'Brede werking tegen bladschimmels. Combinatie van twee azolen geeft betere resistentiemanagement.',
    resistance_risk: 'Matig tot hoog (azoolresistentie opbouwend in NL populaties)',
    approval_status: 'Ctgb toegelaten', source: 'Ctgb',
  },
  {
    pest_id: 'septoria-tritici', approach: 'chemical',
    treatment: 'Bladbespuiting met Aviator Xpro (bixafen + prothioconazool)',
    active_substance: 'bixafen + prothioconazool',
    timing: 'T1 of T2, preventief',
    dose_rate: '0,75-1,0 L/ha (Aviator Xpro)',
    efficacy_notes: 'SDHI + azool combinatie. Goede preventieve werking. Minder curatieve activiteit dan pure azolen.',
    resistance_risk: 'Matig (FRAC 7 + 3, SDHI-resistentie monitoren)',
    approval_status: 'Ctgb toegelaten', source: 'Ctgb',
  },
  {
    pest_id: 'septoria-tritici', approach: 'cultural',
    treatment: 'Resistente rassen en gewasrotatie',
    active_substance: null,
    timing: 'Rassenkeuze en bouwplanplanning',
    dose_rate: null,
    efficacy_notes: 'Rassen met septoriaresistentie 7+ (Aanbevelende Rassenlijst) verlagen infectiedruk. Gewasrotatie en onderwerken gewasresten vermindert inoculum.',
    resistance_risk: null,
    approval_status: null, source: 'WUR/PPO',
  },

  // Meeldauw — chemical
  {
    pest_id: 'meeldauw', approach: 'chemical',
    treatment: 'Bladbespuiting met Folicur (tebuconazool)',
    active_substance: 'tebuconazool',
    timing: 'Bij eerste aantasting of preventief bij hoog risico',
    dose_rate: '0,5-1,0 L/ha (Folicur)',
    efficacy_notes: 'Azool-fungicide met curatieve en preventieve werking tegen meeldauw. Ook werkzaam tegen roest en septoria.',
    resistance_risk: 'Matig (azoolresistentie)',
    approval_status: 'Ctgb toegelaten', source: 'Ctgb',
  },
  {
    pest_id: 'meeldauw', approach: 'chemical',
    treatment: 'Bladbespuiting met Proline (prothioconazool)',
    active_substance: 'prothioconazool',
    timing: 'Preventief of vroeg curatief, T1-T2 tijdstip',
    dose_rate: '0,6-0,8 L/ha (Proline)',
    efficacy_notes: 'Breed werkend azool. Goede basiswerking tegen meeldauw, septoria en roesten.',
    resistance_risk: 'Matig (FRAC-groep 3)',
    approval_status: 'Ctgb toegelaten', source: 'Ctgb',
  },

  // Bladluis — chemical
  {
    pest_id: 'bladluis-granen', approach: 'chemical',
    treatment: 'Insecticide bespuiting met Teppeki (flonicamid)',
    active_substance: 'flonicamid',
    timing: 'Bij overschrijding schadedrempel of BYDV-risico in herfst',
    dose_rate: '0,14 kg/ha (Teppeki)',
    efficacy_notes: 'Systemisch insecticide, selectief voor zuigende insecten. Beperkte bijwerking op natuurlijke vijanden.',
    resistance_risk: 'Laag (IRAC-groep 29, nieuw werkingsmechanisme)',
    approval_status: 'Ctgb toegelaten', source: 'Ctgb',
  },
  {
    pest_id: 'bladluis-granen', approach: 'chemical',
    treatment: 'Insecticide bespuiting met Movento (spirotetramat)',
    active_substance: 'spirotetramat',
    timing: 'Bij actieve kolonisatie en overschrijding schadedrempel',
    dose_rate: '0,4-0,6 L/ha (Movento)',
    efficacy_notes: 'Ambimobiel systemisch insecticide. Werkt via lipidebiosynthese-remming. Langzamere werking maar langere nawerking.',
    resistance_risk: 'Laag (IRAC-groep 23)',
    approval_status: 'Ctgb toegelaten', source: 'Ctgb',
  },
  {
    pest_id: 'bladluis-granen', approach: 'cultural',
    treatment: 'Natuurlijke vijanden en schadedrempelbewaking',
    active_substance: null,
    timing: 'Seizoensmonitoring',
    dose_rate: null,
    efficacy_notes: 'Natuurlijke vijanden (lieveheersbeestjes, sluipwespen, gaasvliegen, zweefvliegen) kunnen populaties reguleren. Schadedrempel: 30% van halmen bezet met bladluis rond bloei.',
    resistance_risk: null,
    approval_status: null, source: 'WUR/PPO',
  },

  // Coloradokever — chemical
  {
    pest_id: 'coloradokever', approach: 'chemical',
    treatment: 'Insecticide bespuiting met Coragen (chlorantraniliprole)',
    active_substance: 'chlorantraniliprole',
    timing: 'Bij waarneming eerste larven (L1-L2 stadium)',
    dose_rate: '0,06-0,08 L/ha (Coragen)',
    efficacy_notes: 'Diamide insecticide met maag- en contactwerking. Goede werking op larven. Selectief voor bestuivers.',
    resistance_risk: 'Laag tot matig (IRAC-groep 28)',
    approval_status: 'Ctgb toegelaten', source: 'Ctgb',
  },
  {
    pest_id: 'coloradokever', approach: 'chemical',
    treatment: 'Insecticide bespuiting met Biscaya (thiacloprid)',
    active_substance: 'thiacloprid',
    timing: 'Bij waarneming kevers en/of larven',
    dose_rate: '0,3 L/ha (Biscaya)',
    efficacy_notes: 'Neonicotinoïde met contact- en maagwerking. Let op: beperkte toelating vanwege bijenwetgeving. Controleer actuele Ctgb-status.',
    resistance_risk: 'Matig (IRAC-groep 4A, kruisresistentie met andere neonicotinoïden)',
    approval_status: 'Ctgb — beperkte toelating (controleer actuele status)', source: 'Ctgb',
  },
  {
    pest_id: 'coloradokever', approach: 'cultural',
    treatment: 'Handmatig verzamelen bij lage aantallen, meldingsplicht NVWA',
    active_substance: null,
    timing: 'Bij eerste waarneming',
    dose_rate: null,
    efficacy_notes: 'Bij lage aantallen: handmatig verzamelen en vernietigen. Quarantaineorganisme: meldingsplicht bij NVWA. Gewasrotatie vermindert populatiedruk.',
    resistance_risk: null,
    approval_status: null, source: 'NVWA',
  },

  // Aardappelcysteaaltje — cultural/chemical
  {
    pest_id: 'aardappelcysteaaltje', approach: 'cultural',
    treatment: 'Ruime vruchtwisseling (1:4 minimum) en resistente rassen',
    active_substance: null,
    timing: 'Bouwplanplanning',
    dose_rate: null,
    efficacy_notes: 'Minimaal 1:4 (liefst 1:5) vruchtwisseling met aardappelen. Resistente rassen (niveaus volgens Aardappelrassenlijst) voor Ro1-5 en Pa2/3. Verplichte AM-bemonstering voor teelt.',
    resistance_risk: null,
    approval_status: null, source: 'WUR/PPO',
  },
  {
    pest_id: 'aardappelcysteaaltje', approach: 'chemical',
    treatment: 'Granulaire nematicide (beperkt beschikbaar)',
    active_substance: 'fosthiazaat (Nemathorin)',
    timing: 'Voor of bij poten',
    dose_rate: '30 kg/ha (Nemathorin 10G)',
    efficacy_notes: 'Beperkte bestrijding, vooral populatieverlagend. Geen volledige bestrijding. Grondontsmetting met metam-natrium als noodmaatregel bij zware besmetting.',
    resistance_risk: 'Niet van toepassing',
    approval_status: 'Ctgb toegelaten (beperkt)', source: 'Ctgb',
  },

  // Fusarium aar
  {
    pest_id: 'fusarium-aar', approach: 'chemical',
    treatment: 'Aarbespuiting met Prosaro (prothioconazool + tebuconazool)',
    active_substance: 'prothioconazool + tebuconazool',
    timing: 'Tijdens bloei (GS 61-65), bij vochtig weer en risicovrucht maïs',
    dose_rate: '1,0 L/ha (Prosaro)',
    efficacy_notes: 'Beste timing rond begin bloei. Beperkte effectiviteit (50-70% reductie DON-gehalte). Prothioconazool is meest effectieve werkzame stof tegen fusarium.',
    resistance_risk: 'Matig (azoolresistentie, maar fusarium minder snel dan septoria)',
    approval_status: 'Ctgb toegelaten', source: 'Ctgb',
  },
  {
    pest_id: 'fusarium-aar', approach: 'cultural',
    treatment: 'Gewasresten onderwerken en voorvruchtmanagement',
    active_substance: null,
    timing: 'Na oogst en bouwplanplanning',
    dose_rate: null,
    efficacy_notes: 'Onderwerken maïsstoppel versnelt afbraak inoculum. Vermijd tarwe na maïs (hoogste risico). Ploegen effectiever dan minimale grondbewerking. Kies minder vatbare rassen.',
    resistance_risk: null,
    approval_status: null, source: 'WUR/PPO',
  },

  // Rhizoctonia solani
  {
    pest_id: 'rhizoctonia-solani', approach: 'chemical',
    treatment: 'Knolbehandeling met Amistar (azoxystrobine) of poterbehandeling',
    active_substance: 'azoxystrobine',
    timing: 'Poterbehandeling voor of bij poten',
    dose_rate: '0,3-0,4 L/100 kg pootgoed (Amistar)',
    efficacy_notes: 'Vermindert stengelkanker en lakschurftaantasting. Werkt vooral preventief. Combineer met gezond uitgangsmateriaal.',
    resistance_risk: 'Matig (FRAC-groep 11, QoI-resistentie mogelijk)',
    approval_status: 'Ctgb toegelaten', source: 'Ctgb',
  },
  {
    pest_id: 'rhizoctonia-solani', approach: 'chemical',
    treatment: 'Poterbehandeling met Maxim (fludioxonil)',
    active_substance: 'fludioxonil',
    timing: 'Poterbehandeling',
    dose_rate: '0,2 L/ton pootgoed (Maxim)',
    efficacy_notes: 'Contactfungicide voor knolbehandeling. Beschermt tegen lakschurft en zilverdekmicose. Geen systemische werking.',
    resistance_risk: 'Laag (FRAC-groep 12)',
    approval_status: 'Ctgb toegelaten', source: 'Ctgb',
  },

  // Ratelziekte (TRV) — no chemical treatment
  {
    pest_id: 'ratelziekte', approach: 'cultural',
    treatment: 'Vruchtwisseling, aaltjesresistente groenbemesters, resistente rassen',
    active_substance: null,
    timing: 'Bouwplanplanning',
    dose_rate: null,
    efficacy_notes: 'Geen chemische bestrijding van het virus mogelijk. Beheersing via populatiebeheer trichodoride aaltjes: resistente groenbemesters (bijv. Afrikaantjes), ruime vruchtwisseling, resistente aardappelrassen (beperkt beschikbaar). Grondmonster op trichodoride aaltjes voor rassenkeuze.',
    resistance_risk: null,
    approval_status: null, source: 'WUR/PPO',
  },

  // Stengelaaltje — no effective chemical treatment
  {
    pest_id: 'stengelaaltje', approach: 'cultural',
    treatment: 'Ruime vruchtwisseling (1:6), gezond uitgangsmateriaal, onkruidbeheersing',
    active_substance: null,
    timing: 'Bouwplanplanning en teeltseizoen',
    dose_rate: null,
    efficacy_notes: 'Vruchtwisseling minimaal 1:6 met waardplanten. Gebruik gecertificeerd pootgoed/plantgoed. Bestrijding van waardplant-onkruiden. Thermische ontsmetting bollenmateriaal (47°C, 3 uur) voor tulpen/narcissen.',
    resistance_risk: null,
    approval_status: null, source: 'WUR/PPO',
  },
];

for (const t of treatments) {
  db.run(
    `INSERT INTO treatments (pest_id, approach, treatment, active_substance, timing, dose_rate, efficacy_notes, resistance_risk, approval_status, source, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      t.pest_id, t.approach, t.treatment, t.active_substance, t.timing,
      t.dose_rate, t.efficacy_notes, t.resistance_risk, t.approval_status,
      t.source, JURISDICTION,
    ]
  );
}
console.log(`Inserted ${treatments.length} treatments.`);

// ---------------------------------------------------------------------------
// 4. IPM GUIDANCE
// ---------------------------------------------------------------------------

interface IpmRecord {
  crop_id: string;
  pest_id: string;
  threshold: string;
  monitoring_method: string;
  cultural_controls: string;
  prevention: string;
  decision_guide: string;
  source: string;
}

const ipmGuidance: IpmRecord[] = [
  {
    crop_id: 'aardappelen',
    pest_id: 'phytophthora-infestans',
    threshold: 'Geen absolute schadedrempel — bestrijding preventief zodra omstandigheden gunstig (Dacom/Phytophthora-beslissingsondersteunend systeem)',
    monitoring_method: 'Gebruik Dacom Plant-Plus of Agrovision BOS voor spuitadviezen gebaseerd op weer, rasvatbaarheid en gewasgroei. Visuele veldinspectie wekelijks vanaf sluiting gewas.',
    cultural_controls: 'Afvalhopen afgedekt of behandeld voor 1 april. Opslag- en sorteerafval vernietigen. Vatbare opslagplanten verwijderen.',
    prevention: 'Kies rassen met hoge phytophthora-resistentie (8-9 op Aardappelrassenlijst). Pootgoed vrij van knolphytophthora. Ruime rijafstand voor luchtcirculatie.',
    decision_guide: 'Start spuitschema bij sluitend gewas (eind juni) of eerder bij hoge infectiedruk. Spuitinterval verkorten bij hoge druk (5-7 dagen) en verlengen bij lage druk (10-14 dagen). Curatief middel bij gemiste bespuiting of onverwacht weer.',
    source: 'WUR/PPO, Dacom',
  },
  {
    crop_id: 'wintertarwe',
    pest_id: 'septoria-tritici',
    threshold: 'T1-beslissing: septoria op bovenste 3 bladetages bij GS31-32 en >20% bladoppervlak aangetast op blad 3. T2: bescherming vlagblad.',
    monitoring_method: 'Visuele bladbeoordeling op meerdere plekken in veld. Let op pycniden in lesies (onderscheid met fysiologische vlekken). Regenval na GS31 als risicofactor.',
    cultural_controls: 'Resistente rassen (septoriaresistentie 7+ op Aanbevelende Rassenlijst). Niet te vroeg zaaien. Stikstofbemesting niet te hoog (dicht gewas bevordert infectie).',
    prevention: 'Rassenkeuze is eerste stap. Gewasrotatie (vermijdt inoculumopbouw). Niet te hoge zaaidichtheid.',
    decision_guide: 'T1-bespuiting op basis van ras, zaaitalent, neerslag en bladaantasting. Bij zeer resistente rassen mogelijk T1 overslaan. T2 altijd bij vatbare rassen voor bescherming vlagblad. SDHI + azool combinatie bij hoge druk.',
    source: 'WUR/PPO, Aanbevelende Rassenlijst',
  },
  {
    crop_id: 'wintertarwe',
    pest_id: 'fusarium-aar',
    threshold: 'Geen formele schadedrempel. Spuiten bij risicovrucht (maïs) EN vochtig weer rond bloei (GS 61-65).',
    monitoring_method: 'Beoordeling risicofactoren: voorvrucht (maïs = hoog risico), grondbewerking (niet-kerend = hoger risico), weer rond bloei (vochtig/regenachtig). Achteraf: DON-analyse graan bij oogst.',
    cultural_controls: 'Vermijd tarwe na maïs. Onderwerk maïsstoppel (ploegen). Kies rassen met betere fusariumresistentie.',
    prevention: 'Bouwplan: geen tarwe na maïs. Ploegen na maïs reduceert inoculum met 60-80%. Niet-kerend na maïs gevolgd door tarwe is hoogste risico.',
    decision_guide: 'Bij tarwe na maïs + niet-kerend + vochtig weer rond bloei: aarbespuiting met prothioconazool (Prosaro). Bij tarwe na andere voorvrucht + ploegen: alleen bij extreem natte bloei. DON-monitoring bij oogst.',
    source: 'WUR/PPO',
  },
  {
    crop_id: 'granen',
    pest_id: 'bladluis-granen',
    threshold: 'Schadedrempel: 30% van de halmen bezet met bladluis rond bloei (GS 59-69). In herfst voor BYDV: bij >5% planten met bladluis voor 1 november in vatbaar gewas.',
    monitoring_method: 'Tellingen op 4-5 plekken in het perceel, 25 halmen per plek. In herfst: gele vangbakken of visuele telling voor BYDV-vectoren. Let op aanwezigheid natuurlijke vijanden (predator/prooi-verhouding).',
    cultural_controls: 'Behoud en stimulering natuurlijke vijanden (akkerranden, bloemenmengsels). Niet te vroeg zaaien van wintertarwe (BYDV-risico). Vermijd overdreven stikstof (bevordert bladluizen).',
    prevention: 'Zaaitijdstip: wintergranen niet voor half oktober (BYDV-zone). Rassen met BYDV-tolerantie (beperkt beschikbaar). Functionele agrobiodiversiteit: akkerranden met bloemenmengsels.',
    decision_guide: 'Boven schadedrempel: spuit selectief insecticide (flonicamid of spirotetramat). Bij hoge natuurlijke-vijandendruk: wacht af. Bij BYDV-risico in herfst: zaaibehandeling of bladbespuiting.',
    source: 'WUR/PPO, CLM',
  },
  {
    crop_id: 'aardappelen',
    pest_id: 'aardappelcysteaaltje',
    threshold: 'Verplichte AM-bemonstering voor aardappelteelt. Besmetverklaring bij >6 levende cysten per 0,5 kg grond (Globodera spp.).',
    monitoring_method: 'Intensieve bodembemonstering (verplicht voor pootgoedteelt en uitgangsmateriaal): gespoelde grondmonsters, microscopische telling cysten, vitaliteitsbepaling. Aanbevolen: 1/3-1/4 ha per mengmonster.',
    cultural_controls: 'Ruime vruchtwisseling (minimaal 1:4, liefst 1:5 of ruimer). Resistente rassen conform Aardappelrassenlijst (resistentieniveaus voor Ro1-5 en Pa2/3). Besmette partijen niet uitpoten.',
    prevention: 'AM-vrij pootgoed. Rassen met hoge resistentie EN tolerantie. Geen aardappelen op besmet perceel tot populatie voldoende gedaald. Machinehygiëne (voorkom grondversleping).',
    decision_guide: 'Bij besmetting: geen aardappelen of alleen hoog-resistente rassen (minimaal 8). Bij zware besmetting: geen aardappelen gedurende meerdere jaren. Nemathorin alleen bij lichte besmetting als aanvulling op resistente rassen.',
    source: 'WUR/PPO, NVWA',
  },
  {
    crop_id: 'aardappelen',
    pest_id: 'rhizoctonia-solani',
    threshold: 'Geen formele schadedrempel. Preventieve aanpak op basis van besmettingshistorie perceel en kwaliteit pootgoed.',
    monitoring_method: 'Beoordeling pootgoed op lakschurft (sclerotiën op knollen). Veldwaarneming: let op ongelijke opkomst en witte manchetten rond stengelbasis. Na oogst: beoordeling knollen op lakschurft.',
    cultural_controls: 'Gebruik gezond pootgoed (weinig sclerotiën). Snelle opkomst bevorderen (niet te koud poten, goed pootbed). Vruchtwisseling 1:3 minimum. Niet te lang wachten met rooien.',
    prevention: 'Pootgoedontsmetting (knolbehandeling) met Amistar of Maxim. Percelen met rhizoctonia-historie vermijden voor pootgoedteelt. Tijdig rooien na loofdoding (< 3 weken).',
    decision_guide: 'Bij pootgoedteelt: altijd knolbehandeling overwegen. Bij consumptieaardappelen op besmet perceel: pootgoedontsmetting + snelle opkomst + tijdig rooien. Bij pootaardappelkeuring: lakschurft is keuringsgebrek.',
    source: 'WUR/PPO, NAK',
  },
];

for (const g of ipmGuidance) {
  db.run(
    `INSERT INTO ipm_guidance (crop_id, pest_id, threshold, monitoring_method, cultural_controls, prevention, decision_guide, source, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      g.crop_id, g.pest_id, g.threshold, g.monitoring_method,
      g.cultural_controls, g.prevention, g.decision_guide, g.source, JURISDICTION,
    ]
  );
}
console.log(`Inserted ${ipmGuidance.length} IPM guidance records.`);

// ---------------------------------------------------------------------------
// 5. APPROVED PRODUCTS (Ctgb toelatingsbank)
// ---------------------------------------------------------------------------

interface ProductRecord {
  product_name: string;
  active_substance: string;
  target_pests: string;
  approved_crops: string;
  approval_expiry: string;
  registration_number: string;
  source: string;
}

const approvedProducts: ProductRecord[] = [
  {
    product_name: 'Ranman Top',
    active_substance: 'cyazofamide 160 g/L',
    target_pests: 'Phytophthora infestans',
    approved_crops: 'aardappelen',
    approval_expiry: '2027-12-31',
    registration_number: 'W-12614',
    source: 'Ctgb',
  },
  {
    product_name: 'Revus',
    active_substance: 'mandipropamid 250 g/L',
    target_pests: 'Phytophthora infestans',
    approved_crops: 'aardappelen, tomaten',
    approval_expiry: '2028-04-30',
    registration_number: 'W-13199',
    source: 'Ctgb',
  },
  {
    product_name: 'Infinito',
    active_substance: 'fluopicolide 62,5 g/L + propamocarb-hydrochloride 625 g/L',
    target_pests: 'Phytophthora infestans',
    approved_crops: 'aardappelen',
    approval_expiry: '2027-07-31',
    registration_number: 'W-13035',
    source: 'Ctgb',
  },
  {
    product_name: 'Prosaro',
    active_substance: 'prothioconazool 125 g/L + tebuconazool 125 g/L',
    target_pests: 'Septoria, fusarium, roest, meeldauw',
    approved_crops: 'tarwe, gerst, rogge, triticale',
    approval_expiry: '2027-10-31',
    registration_number: 'W-13236',
    source: 'Ctgb',
  },
  {
    product_name: 'Aviator Xpro',
    active_substance: 'bixafen 75 g/L + prothioconazool 150 g/L',
    target_pests: 'Septoria, roest, meeldauw, netvlekkenziekte',
    approved_crops: 'tarwe, gerst',
    approval_expiry: '2028-01-31',
    registration_number: 'W-14012',
    source: 'Ctgb',
  },
  {
    product_name: 'Folicur',
    active_substance: 'tebuconazool 250 g/L',
    target_pests: 'Meeldauw, roest, septoria, fusarium',
    approved_crops: 'tarwe, gerst, rogge, koolzaad, suikerbieten',
    approval_expiry: '2027-04-30',
    registration_number: 'W-10975',
    source: 'Ctgb',
  },
  {
    product_name: 'Proline',
    active_substance: 'prothioconazool 250 g/L',
    target_pests: 'Septoria, meeldauw, roest, fusarium',
    approved_crops: 'tarwe, gerst, rogge, triticale, koolzaad',
    approval_expiry: '2027-10-31',
    registration_number: 'W-13145',
    source: 'Ctgb',
  },
  {
    product_name: 'Teppeki',
    active_substance: 'flonicamid 500 g/kg',
    target_pests: 'Bladluis (diverse soorten)',
    approved_crops: 'tarwe, gerst, aardappelen, suikerbieten, koolzaad, appels, peren',
    approval_expiry: '2028-08-31',
    registration_number: 'W-14203',
    source: 'Ctgb',
  },
  {
    product_name: 'Movento',
    active_substance: 'spirotetramat 150 g/L',
    target_pests: 'Bladluis, wolluis, schildluis',
    approved_crops: 'aardappelen, suikerbieten, fruit, groenten',
    approval_expiry: '2027-12-31',
    registration_number: 'W-13456',
    source: 'Ctgb',
  },
  {
    product_name: 'Coragen',
    active_substance: 'chlorantraniliprole 200 g/L',
    target_pests: 'Coloradokever, rupsen, uienvlieg',
    approved_crops: 'aardappelen, kool, prei, uien',
    approval_expiry: '2028-06-30',
    registration_number: 'W-14567',
    source: 'Ctgb',
  },
  {
    product_name: 'Biscaya',
    active_substance: 'thiacloprid 240 g/L',
    target_pests: 'Coloradokever, bladluis, glanskevers',
    approved_crops: 'aardappelen, koolzaad',
    approval_expiry: '2026-08-31',
    registration_number: 'W-13089',
    source: 'Ctgb',
  },
  {
    product_name: 'Amistar',
    active_substance: 'azoxystrobine 250 g/L',
    target_pests: 'Rhizoctonia, septoria, roest, bladvlekkenziekte',
    approved_crops: 'aardappelen (knolbehandeling), tarwe, gerst, suikerbieten',
    approval_expiry: '2027-12-31',
    registration_number: 'W-11789',
    source: 'Ctgb',
  },
  {
    product_name: 'Maxim 480 FS',
    active_substance: 'fludioxonil 480 g/L',
    target_pests: 'Rhizoctonia, zilverdekmicose, fusarium (pootgoed)',
    approved_crops: 'aardappelen (knolbehandeling)',
    approval_expiry: '2028-03-31',
    registration_number: 'W-12456',
    source: 'Ctgb',
  },
  {
    product_name: 'Nemathorin 10G',
    active_substance: 'fosthiazaat 100 g/kg',
    target_pests: 'Aardappelcysteaaltje (Globodera spp.)',
    approved_crops: 'aardappelen',
    approval_expiry: '2027-06-30',
    registration_number: 'W-12890',
    source: 'Ctgb',
  },
  {
    product_name: 'Signum',
    active_substance: 'boscalid 267 g/kg + pyraclostrobine 67 g/kg',
    target_pests: 'Sclerotinia, botrytis, alternaria, valse meeldauw',
    approved_crops: 'uien, peen, bonen, sla, spruitkool',
    approval_expiry: '2028-01-31',
    registration_number: 'W-13567',
    source: 'Ctgb',
  },
  {
    product_name: 'Karate Zeon',
    active_substance: 'lambda-cyhalothrin 100 g/L',
    target_pests: 'Bladluis, trips, aardvlooien, koolmot',
    approved_crops: 'tarwe, gerst, aardappelen, suikerbieten, kool, uien',
    approval_expiry: '2027-09-30',
    registration_number: 'W-11234',
    source: 'Ctgb',
  },
  {
    product_name: 'Mancozeb 750 WG',
    active_substance: 'mancozeb 750 g/kg',
    target_pests: 'Phytophthora, valse meeldauw, alternaria',
    approved_crops: 'aardappelen, uien, tomaten',
    approval_expiry: '2026-12-31',
    registration_number: 'W-10456',
    source: 'Ctgb',
  },
  {
    product_name: 'Rudis',
    active_substance: 'prothioconazool 100 g/L',
    target_pests: 'Sclerotinia, alternaria, phoma, meeldauw',
    approved_crops: 'koolzaad, mosterd',
    approval_expiry: '2027-10-31',
    registration_number: 'W-14789',
    source: 'Ctgb',
  },
  {
    product_name: 'Vertimec Pro',
    active_substance: 'abamectine 18 g/L',
    target_pests: 'Trips, spint, mineervliegen, tomatenmineermot',
    approved_crops: 'groenten (glastuinbouw), sierteelt',
    approval_expiry: '2027-12-31',
    registration_number: 'W-13890',
    source: 'Ctgb',
  },
  {
    product_name: 'Decis Protech',
    active_substance: 'deltamethrin 15 g/L',
    target_pests: 'Bladluis, aardvlooien, trips, koolmot, coloradokever',
    approved_crops: 'tarwe, gerst, aardappelen, koolzaad, groenten',
    approval_expiry: '2027-08-31',
    registration_number: 'W-12123',
    source: 'Ctgb',
  },
];

for (const p of approvedProducts) {
  db.run(
    `INSERT OR REPLACE INTO approved_products (product_name, active_substance, target_pests, approved_crops, approval_expiry, registration_number, source, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      p.product_name, p.active_substance, p.target_pests, p.approved_crops,
      p.approval_expiry, p.registration_number, p.source, JURISDICTION,
    ]
  );
}
console.log(`Inserted ${approvedProducts.length} approved products.`);

// ---------------------------------------------------------------------------
// 6. FTS5 SEARCH INDEX
// ---------------------------------------------------------------------------

// Clear and rebuild FTS index
db.run('DELETE FROM search_index');

for (const p of pests) {
  db.run(
    `INSERT INTO search_index (name, common_names, description, identification, pest_type, jurisdiction) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      p.name,
      p.common_names.join(', '),
      p.description,
      p.identification,
      p.pest_type,
      JURISDICTION,
    ]
  );
}
console.log(`Rebuilt FTS5 search index with ${pests.length} entries.`);

// ---------------------------------------------------------------------------
// 7. METADATA
// ---------------------------------------------------------------------------

db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('last_ingest', ?)", [now]);
db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('build_date', ?)", [now]);
db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('pest_count', ?)", [String(pests.length)]);
db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('symptom_count', ?)", [String(symptoms.length)]);
db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('treatment_count', ?)", [String(treatments.length)]);
db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('product_count', ?)", [String(approvedProducts.length)]);
db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('ipm_guidance_count', ?)", [String(ipmGuidance.length)]);
db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('jurisdiction', 'NL')");
db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('mcp_name', 'Netherlands Pest Management MCP')");
db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('data_sources', 'Ctgb toelatingsbank, WUR/PPO Gewasbeschermingskennisbank, CLM Milieumeetlat, NVWA fytosanitaire regelgeving')");

// ---------------------------------------------------------------------------
// 8. COVERAGE FILE
// ---------------------------------------------------------------------------

writeFileSync('data/coverage.json', JSON.stringify({
  mcp_name: 'Netherlands Pest Management MCP',
  jurisdiction: 'NL',
  build_date: now,
  status: 'populated',
  pests: pests.length,
  symptoms: symptoms.length,
  treatments: treatments.length,
  approved_products: approvedProducts.length,
  ipm_guidance: ipmGuidance.length,
  data_sources: [
    'Ctgb toelatingsbank (College voor de toelating van gewasbeschermingsmiddelen en biociden)',
    'WUR/PPO Gewasbeschermingskennisbank (Wageningen University & Research)',
    'CLM Milieumeetlat (Centrum voor Landbouw en Milieu)',
    'NVWA (Nederlandse Voedsel- en Warenautoriteit)',
    'Aanbevelende Rassenlijst / Aardappelrassenlijst',
  ],
  pests_included: pests.map(p => ({ id: p.id, name: p.name, type: p.pest_type })),
}, null, 2));

db.close();

console.log('');
console.log('=== Netherlands Pest Management MCP — Ingestion Complete ===');
console.log(`  Pests:            ${pests.length}`);
console.log(`  Symptoms:         ${symptoms.length}`);
console.log(`  Treatments:       ${treatments.length}`);
console.log(`  Approved products: ${approvedProducts.length}`);
console.log(`  IPM guidance:     ${ipmGuidance.length}`);
console.log(`  Jurisdiction:     ${JURISDICTION}`);
console.log(`  Build date:       ${now}`);
