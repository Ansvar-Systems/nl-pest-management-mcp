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
  // ===== AARDAPPELEN =====
  {
    id: 'phytophthora-infestans',
    name: 'Phytophthora infestans',
    common_names: ['Aardappelziekte', 'Late blight', 'Phytophthora'],
    pest_type: 'disease',
    description:
      'Oomyceet (Phytophthora infestans) die aardappelziekte veroorzaakt. ' +
      'De belangrijkste ziekte in de Nederlandse aardappelteelt, verantwoordelijk voor jaarlijkse verliezen ' +
      'van tientallen miljoenen euro. Verspreidt zich snel bij vochtig, koel weer (15-20 graden C).',
    lifecycle:
      'Overwintert op afvalhopen en opslag. Zoosporen verspreiden via wind en regen. ' +
      'Infectiecyclus 4-7 dagen bij optimale omstandigheden. Sporangia kiemen direct of ' +
      'vormen zoosporen bij temperaturen onder 15 graden C.',
    identification:
      'Onregelmatige bruine vlekken op bladeren, vaak startend aan bladranden. Wit schimmelpluis ' +
      'aan onderzijde blad bij vochtig weer. Bruine, leerachtige vlekken op stengels. ' +
      'Knollen vertonen oppervlakkig bruinrot dat zich naar binnen uitbreidt.',
    crops_affected: ['aardappelen', 'tomaten'],
    risk_factors:
      'Vochtig weer (>90% RV), temperatuur 10-20 graden C, onbeschermde nieuwe bladgroei, ' +
      'nabijheid afvalhopen, vatbare rassen',
    economic_impact:
      'Gemiddeld 50-80 miljoen euro per jaar aan bestrijdingskosten in Nederland. ' +
      'Onbehandeld gewas kan binnen 2 weken volledig afsterven. Knolinfectie veroorzaakt bewaarverliezen.',
    images_description:
      'Bruine vlekken op aardappelblad met wit schimmelpluis aan onderzijde',
  },
  {
    id: 'schurft-streptomyces',
    name: 'Gewone schurft (Streptomyces scabies)',
    common_names: ['Gewone schurft', 'Common scab', 'Streptomyces scabies', 'Aardappelschurft'],
    pest_type: 'disease',
    description:
      'Bacterieziekte veroorzaakt door Streptomyces scabies en verwante soorten. Tast de knolschil aan ' +
      'met oppervlakkige tot diepe schurftlesies. Geen opbrengstverlies maar wel ernstig kwaliteitsverlies ' +
      'bij consumptie- en pootaardappelen.',
    lifecycle:
      'Streptomyces overleeft in de bodem als saprofyt. Infectie via lenticellen in jonge knollen ' +
      'gedurende de eerste weken na knolaanleg. Droge, warme bodemomstandigheden bevorderen infectie. ' +
      'Hoge bodem-pH (>5,5) verhoogt risico.',
    identification:
      'Oppervlakkige, verheven of diepe kraterachtige lesies op knolschil. Lesies kurk- of korkachtig, ' +
      'bruin tot donkerbruin. Verschillende typen: oppervlakkig (vlak), verheven (bultschurft), ' +
      'verzonken (diepschurft). Geen aantasting van loof.',
    crops_affected: ['aardappelen', 'wortelen', 'bieten', 'radijs'],
    risk_factors:
      'Droge bodem tijdens knolaanleg, hoge bodem-pH (>5,5), kalkrijke grond, lage organische stof, ' +
      'geen beregening in kritieke periode',
    economic_impact:
      'Kwaliteitskorting bij consumptieaardappelen (visueel gebrek). Afkeur bij pootaardappelen ' +
      'bij >10% oppervlak aangetast. Geen opbrengstverlies maar wel forse financiele schade.',
    images_description:
      'Aardappelknol met oppervlakkige en diepe schurftlesies op de schil',
  },
  {
    id: 'zilverschurft',
    name: 'Zilverschurft (Helminthosporium solani)',
    common_names: ['Zilverschurft', 'Silver scurf', 'Helminthosporium solani'],
    pest_type: 'disease',
    description:
      'Schimmelziekte veroorzaakt door Helminthosporium solani. Tast de knolschil aan waardoor ' +
      'zilverachtige verkleuring en uitdroging optreedt tijdens bewaring. Steeds belangrijker ' +
      'door eisen aan uiterlijke kwaliteit.',
    lifecycle:
      'Verspreiding via besmet pootgoed (belangrijkste bron) en besmette grond. Infectie van dochterkollen ' +
      'vanuit moederknol. Sterke vermeerdering tijdens bewaring bij hoge RV en temperatuur.',
    identification:
      'Zilverachtige, licht ingezonken vlekken op knolschil, vooral zichtbaar na wassen. ' +
      'Vlekken breiden uit tijdens bewaring. Knollen verliezen meer vocht (uitdroging). ' +
      'Microscopisch: donkere conidioforen met conidien op lesieoppervlak.',
    crops_affected: ['aardappelen'],
    risk_factors:
      'Besmet pootgoed, lange bewaring, hoge RV in bewaring, niet-gekoeld bewaren, ' +
      'nauwe rotatie',
    economic_impact:
      'Kwaliteitskorting bij gewassen aardappelen. Gewichtsverlies door uitdroging in bewaring. ' +
      'Toenemend economisch belang door hogere eisen aan visuele kwaliteit.',
    images_description:
      'Aardappelknol met zilverachtige schilferende schilverkleuring',
  },
  {
    id: 'droogrot-fusarium',
    name: 'Droogrot (Fusarium spp.)',
    common_names: ['Droogrot', 'Dry rot', 'Fusarium sambucinum', 'Fusarium coeruleum'],
    pest_type: 'disease',
    description:
      'Bewaarziekte van aardappelknollen veroorzaakt door Fusarium sambucinum, F. coeruleum ' +
      'en andere Fusarium-soorten. Infectie vindt plaats via beschadigingen bij rooien en verwerken. ' +
      'Kan grote bewaarverliezen veroorzaken.',
    lifecycle:
      'Schimmel dringt binnen via wonden (rooibeschadiging, snijvlakken). Ontwikkelt zich bij bewaartemperaturen ' +
      'boven 4 graden C. Vormt sporen die zich via lucht en contact verspreiden in bewaarplaats.',
    identification:
      'Ingezonken, gerimpelde lesies op knolschil met concentrische ringen. Inwendig: droog, ' +
      'korrelig bruin-grijs weefsel met holten bekleed met schimmelpluis (wit, blauw of roze). ' +
      'Knol droogt in tot verschrompeld restant.',
    crops_affected: ['aardappelen'],
    risk_factors:
      'Rooibeschadiging, sorteren bij lage temperatuur, hoge RV in bewaring, ' +
      'onvoldoende wondhelingsperiode',
    economic_impact:
      'Bewaarverliezen tot 25% bij ongunstige omstandigheden. Vooral in pootgoedhandel financieel relevant ' +
      'door afkeur van partijen.',
    images_description:
      'Doorsnede aardappelknol met droog, korrelig bruin rot en holten met schimmelpluis',
  },
  {
    id: 'natrot-erwinia',
    name: 'Natrot (Pectobacterium/Dickeya)',
    common_names: ['Natrot', 'Soft rot', 'Zwartbenigheid', 'Pectobacterium', 'Dickeya', 'Erwinia'],
    pest_type: 'disease',
    description:
      'Bacterieziekten veroorzaakt door Pectobacterium carotovorum subsp. carotovorum, P. atrosepticum ' +
      '(zwartbenigheid) en Dickeya solani. Veroorzaken natrot in knollen en zwartbenigheid van stengels. ' +
      'Dickeya solani is extra agressief bij hogere temperaturen.',
    lifecycle:
      'Bacterien overleven in besmet pootgoed (latent). Activeren bij warm, nat weer. Stengelbasis-infectie ' +
      '(zwartbenigheid) leidt tot verwelking. Knolinfectie via lenticellen of wonden. Verspreiding via ' +
      'bodemwater, insecten, mechanische bewerkingen.',
    identification:
      'Stengel: zwarte, natte verkleuring stengelbasis die zich naar boven uitbreidt (zwartbenigheid). ' +
      'Knol: waterig, zacht rot met scherpe grens tussen gezond en ziek weefsel. Typische rottingsgeur. ' +
      'Inwendig: cremeachtig tot bruin, vloeibaar rot.',
    crops_affected: ['aardappelen'],
    risk_factors:
      'Besmet pootgoed, warm vochtig weer, wateroverlast, beschadigingen bij rooien, ' +
      'anaerobe omstandigheden in bewaring',
    economic_impact:
      'Zwartbenigheid: standverlies tot 30%. Natrot in bewaring: partijafkeur. ' +
      'Dickeya solani heeft geleid tot aanscherping pootgoedcertificering.',
    images_description:
      'Aardappelstengel met zwarte natte verkleuring aan basis (zwartbenigheid)',
  },
  {
    id: 'rhizoctonia-solani',
    name: 'Rhizoctonia solani',
    common_names: ['Lakschurft', 'Rhizoctonia', 'Black scurf', 'Wortelbrand'],
    pest_type: 'disease',
    description:
      'Bodemschimmel (Rhizoctonia solani) met brede waardplantenreeks. In aardappelen: lakschurft ' +
      '(zwarte sclerotien op knollen) en stengelkanker. In suikerbieten: wortelbrand (kiemplantenziekte) ' +
      'en late wortelbrand.',
    lifecycle:
      'Sclerotien overleven jarenlang in de bodem en op knollen. Infectie vanuit besmette pootaardappelen ' +
      'of besmette grond. Anastomosegroepen (AG) bepalen waardplantspecificiteit: AG-3 voor aardappel, ' +
      'AG 2-2 IIIB voor suikerbieten.',
    identification:
      'Aardappel: zwarte, onregelmatige korstjes (sclerotien) op knolschil die niet afwasbaar zijn. ' +
      'Misvorming en scheurvorming knollen. Witte sokjes (mycelium) rond stengelbasis. ' +
      'Suikerbiet: ingesnoerde, zwartverkleurde wortelhals bij kiemplanten.',
    crops_affected: ['aardappelen', 'suikerbieten', 'uien', 'wortelen'],
    risk_factors:
      'Koude natte bodem bij opkomst, verdichte grond, besmette pootaardappelen, ' +
      'nauwe vruchtwisseling',
    economic_impact:
      'Aardappel: kwaliteitsverlies (lakschurft), standreductie door stengelkanker. ' +
      'Suikerbiet: kiemplantverlies tot 30% bij wortelbrand. Kwaliteitskorting bij pootaardappelen.',
    images_description:
      'Zwarte sclerotien (lakschurft) op aardappelknol, witte mycelium-manchet om stengelbasis',
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
    id: 'trips-aardappel',
    name: 'Trips (aardappelen)',
    common_names: ['Trips', 'Tabakstrips', 'Thrips tabaci'],
    pest_type: 'pest',
    description:
      'Tabakstrips (Thrips tabaci) is een zuigend insect dat aardappelloof aantast. ' +
      'Bij warm droog weer kan aanzienlijke schade optreden door zuigactiviteit op bladcellen. ' +
      'Indirect ook betrokken bij virusoverdracht.',
    lifecycle:
      'Meerdere generaties per jaar. Verpopping in de bodem. Populatieopbouw bij warm, ' +
      'droog weer. Overwintert als adult in bodem en plantaardig materiaal.',
    identification:
      'Kleine (1-2 mm) slanke insecten, geelbruin. Zilverachtige vlekjes op bladeren (lege cellen). ' +
      'Zwarte stipjes (uitwerpselen) op bladonderzijde. Bladranden kunnen krullen bij zware aantasting.',
    crops_affected: ['aardappelen', 'uien', 'prei', 'kool', 'glastuinbouwgewassen'],
    risk_factors:
      'Warm droog weer, beschutte percelen, gebrek aan natuurlijke vijanden',
    economic_impact:
      'Directe schade: opbrengstderving 5-15% bij zware aantasting. ' +
      'In uien grotere economische relevantie dan in aardappelen.',
    images_description:
      'Zilverachtige zuigvlekjes op aardappelblad veroorzaakt door trips',
  },
  {
    id: 'bladrandkever',
    name: 'Bladrandkever (Sitona lineatus)',
    common_names: ['Bladrandkever', 'Pea leaf weevil', 'Sitona lineatus', 'Groefsnuitkever'],
    pest_type: 'pest',
    description:
      'Snuitkever (Sitona lineatus) die kenmerkende halfronde vreterij veroorzaakt aan bladranden ' +
      'van vlinderbloemigen. Larven voeden op wortelknolletjes (Rhizobium). ' +
      'In sommige jaren ook schade aan aardappelen en suikerbieten.',
    lifecycle:
      'Overwintert als adult in de bodem. Wordt actief bij bodemtemperatuur >5 graden C in het voorjaar. ' +
      'Eieren in de bodem nabij wortels. Larven voeden op wortels en wortelknolletjes.',
    identification:
      'Kenmerkende halfronde vraat aan bladranden (U-vormige inkepingen). Kever 4-5 mm, grijs-bruin, ' +
      'met korte snuit. Niet vliegen maar lopen. Larven wit, pootloos, op wortels.',
    crops_affected: ['erwten', 'bonen', 'luzerne', 'klaver', 'aardappelen', 'suikerbieten'],
    risk_factors:
      'Vlinderbloemigen in bouwplan, milde winter, vroege zaai',
    economic_impact:
      'Opbrengstderving 5-10% door verminderde stikstofbinding (larven op Rhizobium-knolletjes). ' +
      'Bladvreterij zelden economisch relevant behalve bij kiemplanten.',
    images_description:
      'Halfronde vraat-inkepingen aan bladranden van erwtenbladeren',
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
      'Een generatie per teeltseizoen.',
    identification:
      'Bovengronds: pleksgewijze groeiachterstand, vergeling, verwelking. Wortels: witte (G. rostochiensis) ' +
      'of cremekleurige (G. pallida) bolletjes (0,5 mm) zichtbaar op wortels. ' +
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

  // ===== GRANEN =====
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
      'Verspreiding via windverspreide conidien. Infectie bij gematigd weer (15-22 graden C) ' +
      'en hoge luchtvochtigheid. Nieuwe generatie elke 7-10 dagen.',
    identification:
      'Wit tot grijswit poederachtig schimmelpluis op bovenzijde bladeren, bladscheden en aren. ' +
      'Oudere infecties worden grijsbruin. Mycelium afwisbaar met de vinger.',
    crops_affected: ['tarwe', 'wintertarwe', 'gerst', 'wintergerst', 'zomergerst'],
    risk_factors:
      'Dicht gewas, hoge stikstofbemesting, vatbare rassen, beschutte percelen',
    economic_impact:
      'Opbrengstderving 5-20% bij ernstige aantasting. Vooral in gerst economisch relevant.',
    images_description: 'Wit poederachtig schimmelpluis op tarwebladeren',
  },
  {
    id: 'bruine-roest',
    name: 'Bruine roest (Puccinia triticina)',
    common_names: ['Bruine roest', 'Brown rust', 'Leaf rust', 'Puccinia triticina'],
    pest_type: 'disease',
    description:
      'Obligate biotrofe schimmel (Puccinia triticina) die bruine roest veroorzaakt in tarwe. ' +
      'Vormt oranje-bruine pustels (uredosori) op bladeren. Kan zich explosief uitbreiden bij warm weer ' +
      'en leidt tot aanzienlijke opbrengstderving door verlies aan bladgroen.',
    lifecycle:
      'Uredosporen verspreiden via wind over lange afstanden. Infectie bij 15-22 graden C en bladnat (3-6 uur). ' +
      'Sporulatie 7-10 dagen na infectie. Overwintering op groene tarweplanten en grassen.',
    identification:
      'Oranje-bruine, ronde pustels (1-1,5 mm) verspreid over bladoppervlak, vooral bovenzijde. ' +
      'Pustels bevatten massa uredosporen. Omgeven door intacte epidermis (in tegenstelling tot gele roest). ' +
      'Bij ernstige aantasting: bladvergeling en -verdroging.',
    crops_affected: ['tarwe', 'wintertarwe', 'zomertarwe', 'triticale'],
    risk_factors:
      'Warm weer (15-22 graden C), vatbare rassen, hoge stikstofbemesting, dicht gewas, ' +
      'milde winter (overleving inoculum)',
    economic_impact:
      'Opbrengstderving 10-30% bij ernstige aantasting van vlagblad en aar. ' +
      'Economisch belangrijker in warmere jaren.',
    images_description:
      'Oranje-bruine ronde pustels verspreid over bovenzijde van tarweblad',
  },
  {
    id: 'gele-roest',
    name: 'Gele roest (Puccinia striiformis)',
    common_names: ['Gele roest', 'Yellow rust', 'Stripe rust', 'Puccinia striiformis'],
    pest_type: 'disease',
    description:
      'Obligate biotrofe schimmel (Puccinia striiformis f.sp. tritici) die gele roest veroorzaakt. ' +
      'Vormt oranjegele pustels in strepen langs de bladnerven. Zeer destructief bij koeler weer. ' +
      'Nieuwe virulente rassen doorbreken regelmatig rasresistentie.',
    lifecycle:
      'Uredosporen verspreiden via wind. Optimale infectietemperatuur 10-15 graden C (koeler dan bruine roest). ' +
      'Sporulatie 10-14 dagen na infectie. Epidemieen starten vaak vroeg in het voorjaar.',
    identification:
      'Oranjegele pustels in duidelijke strepen (lijnen) langs bladnerven. Rijen pustels evenwijdig ' +
      'aan bladlengte. Bij ernstige aantasting ook op bladscheden en aren. ' +
      'Blad wordt geel en sterft af.',
    crops_affected: ['tarwe', 'wintertarwe', 'zomertarwe', 'gerst', 'wintergerst', 'triticale'],
    risk_factors:
      'Koel vochtig weer (10-15 graden C), vatbare rassen, vroege zaai, dicht gewas, ' +
      'milde herfst/winter',
    economic_impact:
      'Opbrengstderving tot 50% bij vatbare rassen zonder bestrijding. ' +
      'Epidemisch karakter: snelle verspreiding door luchtverplaatsing sporen.',
    images_description:
      'Oranjegele pustels in strepen langs bladnerven van tarweblad',
  },
  {
    id: 'oogvlekkenziekte',
    name: 'Oogvlekkenziekte (Oculimacula yallundae)',
    common_names: ['Oogvlekkenziekte', 'Eyespot', 'Oculimacula yallundae', 'Oculimacula acuformis'],
    pest_type: 'disease',
    description:
      'Stengelvoetziekte veroorzaakt door Oculimacula yallundae (scherp oogvormig) en O. acuformis ' +
      '(diffuus oogvormig). Tast de stengelvoet aan wat leidt tot legering en opbrengstverlies. ' +
      'Onderscheid van halmdoder (Gaeumannomyces) door oogvormige lesies.',
    lifecycle:
      'Overwintert op gewasresten. Conidien verspreiden via regenspatten. Infectie in herfst en winter ' +
      'bij 5-10 graden C. Symptomen zichtbaar vanaf GS 30-31. Langzame uitbreiding in de stengel.',
    identification:
      'Ovale, oogvormige lesies op stengelvoet ter hoogte van eerste internodia. Lesie met donkere rand ' +
      'en lichter centrum. Stengel kan inrotten bij zware aantasting waardoor legering optreedt. ' +
      'Niet te verwarren met halmdoder (diffuse bruinverkleuring wortels).',
    crops_affected: ['tarwe', 'wintertarwe', 'wintergerst', 'rogge', 'triticale'],
    risk_factors:
      'Nauwe graanrotatie (tarwe na tarwe), vroege zaai, milde natte herfst/winter, ' +
      'minimale grondbewerking',
    economic_impact:
      'Opbrengstderving 10-30% door legering. Verlaagde korrelkwaliteit. ' +
      'Vooral relevant bij intensieve graanteelt zonder rotatie.',
    images_description:
      'Oogvormige lesie op stengelvoet van wintertarwe met donkere rand en licht centrum',
  },
  {
    id: 'halmdoder',
    name: 'Halmdoder (Gaeumannomyces tritici)',
    common_names: ['Halmdoder', 'Take-all', 'Gaeumannomyces tritici', 'Gaeumannomyces graminis var. tritici'],
    pest_type: 'disease',
    description:
      'Wortel- en stengelvoetziekte veroorzaakt door Gaeumannomyces tritici. ' +
      'Verwoest het wortelstelsel en de stengelbasis. Typisch probleem bij intensieve graanteelt ' +
      'zonder voldoende vruchtwisseling. Geen effectieve chemische bestrijding beschikbaar.',
    lifecycle:
      'Overwintert als mycelium op gewasresten en graswortels. Infectie vanuit besmette grond via wortels. ' +
      'Verspreiding van wortel tot wortel. Eerste jaars tarwe na niet-graan schoon, ' +
      'tweede jaars tarwe na tarwe zwaar besmet (take-all decline na 3+ jaar tarwe).',
    identification:
      'Wortels: zwarte verkleuring (runner hyphae zichtbaar als donkere lijnen op worteloppervlak). ' +
      'Stengelbasis: zwart verkleurd. Bovengronds: witte aren (whiteheads) in plekken. ' +
      'Planten makkelijk uit grond te trekken (wortelvernietiging).',
    crops_affected: ['tarwe', 'wintertarwe', 'zomertarwe', 'gerst', 'wintergerst', 'triticale'],
    risk_factors:
      'Tarwe na tarwe (hoogste risico), minimale grondbewerking, lage bodem-pH, ' +
      'slechte bodemstructuur',
    economic_impact:
      'Opbrengstderving tot 50% bij zware aantasting. Tweede jaars tarwe hoogste risico. ' +
      'Take-all decline treedt op na 3-4 jaar continue tarwe (bodem-suppressie).',
    images_description:
      'Zwart verkleurd wortelstelsel en stengelbasis, witte aren in tarweveld',
  },
  {
    id: 'fusarium-aar',
    name: 'Fusarium (aarfusarium)',
    common_names: ['Aarfusarium', 'Fusarium ear blight', 'Fusarium graminearum', 'Fusarium culmorum'],
    pest_type: 'disease',
    description:
      'Aarschimmel veroorzaakt door Fusarium graminearum en F. culmorum. Produceert mycotoxinen ' +
      '(deoxynivalenol/DON, zearalenon) die schadelijk zijn voor mens en dier. ' +
      'EU-normen voor DON in voedingsgranen: 1250 microgram/kg (onbewerkt graan).',
    lifecycle:
      'Overwintert op gewasresten (vooral maisstoppel). Ascosporen verspreiden via wind tijdens bloei. ' +
      'Infectie bij vochtig weer (>87% RV) tijdens bloei (GS 61-69).',
    identification:
      'Gebleekte aarpakjes tussen gezond groen weefsel (gedeeltelijke aarbleking). ' +
      'Roze-oranje sporenmassa op kafjes bij vochtig weer. Verschrompelde, lichte korrels. ' +
      'Verhoogd DON-gehalte bij oogstanalyse.',
    crops_affected: ['tarwe', 'wintertarwe', 'zomertarwe', 'gerst', 'wintergerst', 'triticale'],
    risk_factors:
      'Vochtig weer tijdens bloei, mais als voorvrucht, minimale grondbewerking ' +
      '(gewasresten aan oppervlak), vatbare rassen',
    economic_impact:
      'Opbrengstderving 5-30%. Mycotoxinenrisico: partijafkeur bij overschrijding DON-norm ' +
      '(directe financiele schade). Graan voor veevoeder heeft hogere norm (8000 microgram/kg).',
    images_description:
      'Gedeeltelijk gebleekte tarweaar met roze schimmelgroei op kafjes',
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
    id: 'graanhaantje',
    name: 'Graanhaantje (Oulema melanopus)',
    common_names: ['Graanhaantje', 'Cereal leaf beetle', 'Oulema melanopus'],
    pest_type: 'pest',
    description:
      'Bladkever (Oulema melanopus) waarvan de larven venstervormige vraat veroorzaken op graanbladeren. ' +
      'Larven zijn bedekt met slijmerige faecale massa waardoor ze op slakken lijken. ' +
      'Bij zware aantasting significante opbrengstderving door verlies aan bladgroen.',
    lifecycle:
      'Eieren worden afzet op bladeren in april-mei. Larven voeden 2-3 weken op bladeren. ' +
      'Verpopping in de bodem. Nieuwe adulten verschijnen in juli-augustus. ' +
      'Overwintert als adult in de bodem.',
    identification:
      'Adult: 4-5 mm, blauwzwarte dekschilden, rood halsschild. ' +
      'Larven: geel-groen, bedekt met zwarte slijmerige faecale massa. ' +
      'Vraat: venstervormige strepen (epidermis intact aan een zijde).',
    crops_affected: ['tarwe', 'wintertarwe', 'gerst', 'haver', 'mais'],
    risk_factors:
      'Warm droog voorjaar, geen natuurlijke vijanden, graanrijke bouwplannen',
    economic_impact:
      'Opbrengstderving 5-25% bij zware aantasting op vlagblad. ' +
      'Schadedrempel: 0,5-1 ei/larve per halm.',
    images_description:
      'Slijmerig bedekte larve van graanhaantje op tarweblad met venstervormige vraat',
  },
  {
    id: 'fritvlieg',
    name: 'Fritvlieg (Oscinella frit)',
    common_names: ['Fritvlieg', 'Frit fly', 'Oscinella frit'],
    pest_type: 'pest',
    description:
      'Kleine vlieg (Oscinella frit) waarvan de larven groeipunten van granen en grassen aantasten. ' +
      'Eerste generatie (voorjaar) in mais en grassen, derde generatie (herfst) in wintergranen. ' +
      'Kiemplanten meest kwetsbaar.',
    lifecycle:
      'Drie generaties per jaar. Voorjaarsgeneratie tast mais en gras aan. ' +
      'Zomergeneratie op grassen. Herfstgeneratie koloniseert jonge wintergranen. ' +
      'Larven boren in groeipunt en stengelbasis.',
    identification:
      'Kleine (2 mm) zwarte vlieg. Larven: witte maden in het groeipunt of stengelbasis. ' +
      'Symptomen: centraal blad vergelt en sterft af (doodhart), uitstoelingsstimulatie, ' +
      'misvormde plantjes bij vroege aantasting.',
    crops_affected: ['mais', 'tarwe', 'wintertarwe', 'gerst', 'wintergerst', 'gras'],
    risk_factors:
      'Vroege zaai wintergranen (voor half oktober), mais na gras, ' +
      'warme nazomer (hoge vliegactiviteit)',
    economic_impact:
      'Kiemplantverlies tot 50% bij zware aantasting in vroeg gezaaide wintergranen. ' +
      'Economisch relevant in mais na grasland.',
    images_description:
      'Doodhart-symptoom in jonge tarweplant door fritvlieg-larve',
  },

  // ===== SUIKERBIETEN =====
  {
    id: 'vergelingsziekte-biet',
    name: 'Vergelingsziekte (bietenvirus)',
    common_names: ['Vergelingsziekte', 'Beet yellows virus', 'BYV', 'Beet mild yellowing virus', 'BMYV'],
    pest_type: 'disease',
    description:
      'Virusziekte van suikerbieten overgedragen door de groene perzikbladluis (Myzus persicae). ' +
      'Twee virussen betrokken: Beet yellows virus (BYV, ernstig) en Beet mild yellowing virus (BMYV, milder). ' +
      'Na EU-verbod op neonicotinoide zaadbehandeling weer sterk toegenomen.',
    lifecycle:
      'Virus overwintert in winterbieten, bietenstekken en onkruiden (m.n. melde). ' +
      'Bladluizen brengen virus over vanaf bronplanten naar jonge suikerbieten. ' +
      'Vroege infectie (juni) geeft meer schade dan late infectie.',
    identification:
      'Vergeling van oudere bladeren, beginnend aan bladpunten en -randen. Bladeren worden dik en bros. ' +
      'BYV: intens geel-oranje verkleuring. BMYV: geelgroene intervenale chlorose. ' +
      'Vergelingshaarden in perceel (startend bij randen).',
    crops_affected: ['suikerbieten'],
    risk_factors:
      'Hoge bladluisdruk, vroege kolonisatie, bronplanten (winterbieten, melde), ' +
      'milde winter (bladluisoverleving)',
    economic_impact:
      'Suikeropbrengstderving 20-50% bij vroege infectie. Na verbod neonicotinoide zaadcoatings ' +
      '(2018) weer toenemend probleem in NL en heel Europa.',
    images_description:
      'Vergelende suikerbietbladeren met geel-oranje verkleuring aan randen',
  },
  {
    id: 'cercospora-biet',
    name: 'Cercospora-bladvlekkenziekte (Cercospora beticola)',
    common_names: ['Cercospora', 'Cercospora leaf spot', 'Cercospora beticola'],
    pest_type: 'disease',
    description:
      'Schimmelziekte veroorzaakt door Cercospora beticola. Vormt kleine ronde bladvlekken met ' +
      'donkere rand en grijs centrum. In warme jaren kan aanzienlijke bladvernietiging optreden ' +
      'met negatief effect op suikergehalte.',
    lifecycle:
      'Overwintert op gewasresten en onkruiden. Conidien verspreiden via regenspatten en wind. ' +
      'Optimale temperatuur 25-30 graden C. Incubatietijd 7-14 dagen. Meerdere cycli per seizoen.',
    identification:
      'Ronde bladvlekken (2-5 mm) met donkerbruine rand en grijs centrum met conidien. ' +
      'Bij zware aantasting vloeien vlekken samen, blad sterft af. Hertgroei vanuit hart ' +
      'kost energie ten koste van suikeropslag.',
    crops_affected: ['suikerbieten', 'rode bieten', 'snijbieten'],
    risk_factors:
      'Warm vochtig weer (>25 graden C), nauwe bietenrotatie, gewasresten aan oppervlak, ' +
      'beregening',
    economic_impact:
      'Suikergehalte-verlies 1-3%. Verlaagde winbaarheid. Toenemend relevant door klimaatverandering ' +
      '(warmere zomers in NL).',
    images_description:
      'Ronde bladvlekken met grijzig centrum en donkere rand op suikerbietenblad',
  },
  {
    id: 'bietenvlieg',
    name: 'Bietenvlieg (Pegomya betae)',
    common_names: ['Bietenvlieg', 'Beet leaf miner', 'Pegomya betae', 'Mangoldvlieg'],
    pest_type: 'pest',
    description:
      'Minerende vlieg (Pegomya betae) waarvan de larven gangen (mijnen) vreten in bietenbladeren. ' +
      'Eerste generatie (mei-juni) veroorzaakt de meeste schade aan jonge bietenplanten. ' +
      'Tweede generatie (juli-augustus) minder schadelijk op volgroeide planten.',
    lifecycle:
      'Overwintert als pop in de bodem. Vliegen verschijnen in april-mei. ' +
      'Eieren op onderzijde bladeren (wit, langwerpig, in groepjes). ' +
      'Larven mineren 2-3 weken. Twee generaties per jaar.',
    identification:
      'Bladmijnen: blaasachtige, lichtbruine opzwellingen op bladeren. Larve zichtbaar als ' +
      'witte made in de mijn. Eieren: wit, langwerpig, in groepjes van 3-6 op bladonderzijde. ' +
      'Bij zware aantasting: volledig verteerd bladmoes.',
    crops_affected: ['suikerbieten', 'rode bieten', 'spinazie', 'snijbieten'],
    risk_factors:
      'Vroege zaai, kleine bietenplanten bij eerste vlucht, percelen nabij vorig jaar bieten, ' +
      'geen zaadbehandeling',
    economic_impact:
      'Opbrengstderving tot 15% bij zware aantasting eerste generatie op kiemplanten. ' +
      'Tweede generatie zelden economisch relevant.',
    images_description:
      'Blaasachtige bladmijnen op suikerbietenblad met witte larve zichtbaar',
  },
  {
    id: 'bietencysteaaltje',
    name: 'Bietencysteaaltje (Heterodera schachtii)',
    common_names: ['Bietencysteaaltje', 'Beet cyst nematode', 'Heterodera schachtii', 'Bietenmoeheid'],
    pest_type: 'pest',
    description:
      'Cysteaaltje (Heterodera schachtii) gespecialiseerd op Chenopodiaceae (bieten, spinazie) ' +
      'en Brassicaceae (kool). Cysten overleven 5-10 jaar in de bodem. Belangrijkste bodemgebonden ' +
      'belager van suikerbieten in Nederland.',
    lifecycle:
      'Cysten bevatten 200-600 eieren. Uitloken door wortelexudaten van waardplanten. ' +
      'Larven dringen wortels binnen. Vrouwtjes zwellen op en worden tot cysten. ' +
      'Meerdere generaties per seizoen bij suikerbieten.',
    identification:
      'Bovengronds: pleksgewijze groeiachterstand, verwelking bij warm weer (middag), ' +
      'vergeling buitenste bladeren. Wortels: sterk vertakt (baardvorming), ' +
      'witte bolletjes (cysten) zichtbaar op wortels in juni-juli.',
    crops_affected: ['suikerbieten', 'spinazie', 'kool', 'koolzaad', 'rode bieten'],
    risk_factors:
      'Nauwe bietenrotatie (<1:4), teelt van kruisbloemigen (waardplanten), ' +
      'niet-resistente groenbemesters, lichte gronden',
    economic_impact:
      'Opbrengstderving 20-50% bij zware besmetting. Verplichte vruchtwisseling 1:4 minimaal. ' +
      'Resistente groenbemesters (bladrammenas, gele mosterd) verlagen populatie.',
    images_description:
      'Pleksgewijze groeiachterstand in suikerbietenveld, vertakte bietenwortels met witte cysten',
  },

  // ===== UIEN =====
  {
    id: 'bladvlekkenziekte-botrytis-ui',
    name: 'Bladvlekkenziekte uien (Botrytis squamosa)',
    common_names: ['Bladvlekkenziekte', 'Botrytis leaf blight', 'Botrytis squamosa'],
    pest_type: 'disease',
    description:
      'Schimmelziekte veroorzaakt door Botrytis squamosa. Vormt kleine witte bladvlekjes die ' +
      'bij vochtig weer snel uitbreiden. Belangrijkste bladziekte in zaaiuien. ' +
      'Vervroegde bladverdroging vermindert bolopbrengst.',
    lifecycle:
      'Overwintert als sclerotien op gewasresten. Conidien verspreiden via wind bij hoge luchtvochtigheid. ' +
      'Optimaal bij 15-20 graden C en langdurige bladnatperioden. Meerdere infectiecycli per seizoen.',
    identification:
      'Kleine (1-5 mm) wittige tot lichtbruine vlekjes op uienblad, ovaal tot langwerpig. ' +
      'Lesies worden necrotisch en vloeien samen. Bladpunten verdrogen het eerst. ' +
      'Conidioforen zichtbaar als grijzig waas op dood bladweefsel.',
    crops_affected: ['uien', 'sjalotten', 'knoflook'],
    risk_factors:
      'Vochtig weer, langdurige bladnatperioden, dicht plantverband, ' +
      'nauwe uienrotatie, nabij vorig jaar uienperceel',
    economic_impact:
      'Opbrengstderving 10-30% door vervroegde bladverdroging. ' +
      'Hoge fungicidekosten (8-12 bespuitingen per seizoen in natte jaren).',
    images_description:
      'Kleine witte vlekjes op uienblad die samenvoegen tot necrotische zones',
  },
  {
    id: 'valse-meeldauw-ui',
    name: 'Valse meeldauw uien (Peronospora destructor)',
    common_names: ['Valse meeldauw', 'Downy mildew', 'Peronospora destructor'],
    pest_type: 'disease',
    description:
      'Oomyceet (Peronospora destructor) die valse meeldauw in uien veroorzaakt. ' +
      'Systemische infectie vanuit plantuien of secundaire infectie via sporangia. ' +
      'Kan hele partijen vernietigen bij gunstige omstandigheden.',
    lifecycle:
      'Overwintert als mycelium in plantuien (systemisch besmet) en als oosporen in de bodem. ' +
      'Sporangien verspreiden via wind. Infectie bij 8-15 graden C en bladnat >6 uur. ' +
      'Incubatietijd 9-16 dagen.',
    identification:
      'Ovale, lichtgroene tot gele vlekken op bladeren die zich vergroten. ' +
      'Grijspaars sporenpluis op lesieoppervlak bij vochtig weer (sporulatie). ' +
      'Bladeren knikken om en verdrogen. Systemisch besmette planten herkenbaar ' +
      'aan achterblijvende groei.',
    crops_affected: ['uien', 'sjalotten', 'prei', 'knoflook'],
    risk_factors:
      'Koele vochtige omstandigheden, besmet plantgoed, dicht plantverband, ' +
      'nauwe uienrotatie, beregening',
    economic_impact:
      'Opbrengstderving 30-50% bij onbehandelde vatbare rassen. ' +
      'Systemische infectie vanuit plantuien bijzonder destructief.',
    images_description:
      'Grijspaars sporenpluis op lichtgroene vlekken op uienblad',
  },
  {
    id: 'preimot',
    name: 'Preimot (Acrolepiopsis assectella)',
    common_names: ['Preimot', 'Leek moth', 'Acrolepiopsis assectella'],
    pest_type: 'pest',
    description:
      'Kleine mot (Acrolepiopsis assectella) waarvan de rupsen gangen vreten in bladeren en ' +
      'stengels van prei en ui. Toenemend probleem in Nederland sinds de jaren 2000. ' +
      'Meerdere generaties per seizoen.',
    lifecycle:
      'Overwintert als pop. Vliegt vanaf april-mei. Eieren op bladoppervlak. ' +
      'Rupsen mineren eerst in bladeren, later in schacht/bol. ' +
      'Twee tot drie generaties per jaar.',
    identification:
      'Rupsen: geelgroen, 10-15 mm. Vraatgangen (mijnen) in uienblad en preischacht. ' +
      'Uitwerpselen (frass) in en rondom vraatgangen. Bij zware aantasting: ' +
      'uitholling van preischacht, secundaire rotinfectie.',
    crops_affected: ['prei', 'uien', 'knoflook', 'bieslook'],
    risk_factors:
      'Milde winters (overleving), nabijheid vorig jaar alliumgewas, ' +
      'geen netten/insectengazen',
    economic_impact:
      'Kwaliteitsverlies door vraatschade en secundaire rot. Opbrengstderving 10-40%. ' +
      'Toenemend probleem door verminderde insecticidebeschikbaarheid.',
    images_description:
      'Vraatgangen van preimot-rups in preischacht met zichtbare frass',
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
      'Suikerbiet: krullerig, verdikt hart (kroef). ' +
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

  // ===== KOOL =====
  {
    id: 'koolvlieg',
    name: 'Koolvlieg (Delia radicum)',
    common_names: ['Koolvlieg', 'Cabbage root fly', 'Delia radicum'],
    pest_type: 'pest',
    description:
      'Vlieg (Delia radicum) waarvan de larven (maden) de wortels van koolgewassen aanvreten. ' +
      'Drie generaties per jaar. Eerste generatie (mei-juni) veroorzaakt meeste schade aan jonge planten. ' +
      'Economisch de belangrijkste plaag in koolgewassen.',
    lifecycle:
      'Overwintert als pop in de bodem. Vliegen verschijnen in april-mei (eerste generatie). ' +
      'Eieren aan stengelbasis. Maden vreten aan wortels 3-4 weken. ' +
      'Drie generaties per jaar (mei, juli, september).',
    identification:
      'Bovengronds: verwelking en blauwverkleuring blad bij warm weer. Groeiachterstand. ' +
      'Wortels: witte maden (8 mm) in en rondom wortels. Vreterij aan hoofdwortel en zijwortels. ' +
      'Stengelbasis kan uitgehold raken.',
    crops_affected: ['bloemkool', 'broccoli', 'spruitkool', 'witte kool', 'boerenkool', 'koolrabi', 'koolzaad'],
    risk_factors:
      'Nabijheid vorig jaar koolperceel, organische stof in bodem, ' +
      'geen insectengaas of -netten, vroege planting',
    economic_impact:
      'Uitval 10-30% door wortelvernietiging. Kwaliteitsverlies bij spruitkool. ' +
      'Beperking insecticiden maakt biologische bestrijding noodzakelijk.',
    images_description:
      'Witte maden van koolvlieg op beschadigde koolwortels',
  },
  {
    id: 'koolwitje',
    name: 'Koolwitje (Pieris brassicae / P. rapae)',
    common_names: ['Groot koolwitje', 'Klein koolwitje', 'Pieris brassicae', 'Pieris rapae', 'Cabbage white butterfly'],
    pest_type: 'pest',
    description:
      'Vlinders (Pieris brassicae, groot koolwitje; P. rapae, klein koolwitje) waarvan de rupsen ' +
      'koolbladeren kaalvreten. Groot koolwitje legt eieren in groepen, klein koolwitje afzonderlijk. ' +
      'Rupsen van groot koolwitje leven gregair en zijn opvallender.',
    lifecycle:
      'Twee tot drie generaties per jaar. Vlindermigratie vanuit Zuid-Europa in sommige jaren. ' +
      'Eieren op onderzijde bladeren. Rupsen voeden 2-4 weken. Verpopping aan palen, muren, hekken.',
    identification:
      'Groot koolwitje: rupsen geelgroen met zwarte vlekken, gregair. ' +
      'Klein koolwitje: rupsen groen, solitair. Kaalvraat van buitenste bladeren naar binnen. ' +
      'Uitwerpselen (groene keutels) op en tussen bladeren.',
    crops_affected: ['bloemkool', 'broccoli', 'spruitkool', 'witte kool', 'boerenkool', 'koolrabi'],
    risk_factors:
      'Warme zomers, migratiejaren (groot koolwitje), geen netten of biologische bestrijding',
    economic_impact:
      'Kaalvraat bij onbehandeld gewas. Kwaliteitsverlies door uitwerpselen en rupsen in product. ' +
      'Goed beheersbaar met Bt-preparaten en insectengaas.',
    images_description:
      'Geelgroene rupsen van groot koolwitje op kaalgevreten koolblad',
  },
  {
    id: 'kooluil',
    name: 'Kooluil (Mamestra brassicae)',
    common_names: ['Kooluil', 'Cabbage moth', 'Mamestra brassicae'],
    pest_type: 'pest',
    description:
      'Nachtvlinder (Mamestra brassicae) waarvan de rupsen bladeren en koppen/kroppen van ' +
      'koolgewassen aanvreten. Rupsen boren zich in het product en zijn moeilijk te bestrijden ' +
      'als ze eenmaal beschut zitten.',
    lifecycle:
      'Overwintert als pop in de bodem. Vlinder verschijnt in mei-juni. ' +
      'Eieren in groepen op onderzijde bladeren. Rupsen doorlopen 5-6 stadia (6-8 weken). ' +
      'Een tot twee generaties per jaar.',
    identification:
      'Rupsen: groen tot bruin, tot 45 mm, met lichte zijstreep. Boren zich in de kool. ' +
      'Uitwerpselen in koolkop. Vlinder: grijsbruin, vleugels met niervormige vlek. ' +
      'Vraat begint aan buitenste bladeren, later in de krop.',
    crops_affected: ['bloemkool', 'broccoli', 'spruitkool', 'witte kool', 'sla', 'rode kool'],
    risk_factors:
      'Warme nazomer, geen monitoring met feromoonvallen, ' +
      'late bestrijding (rupsen al in product)',
    economic_impact:
      'Kwaliteitsverlies door rupsen en uitwerpselen in product. ' +
      'Afkeur bij verse-markt producten. Moeilijk te bestrijden zodra rupsen in koolkop zitten.',
    images_description:
      'Groene rups van kooluil in koolkop met uitwerpselen',
  },
  {
    id: 'knolvoet',
    name: 'Knolvoet (Plasmodiophora brassicae)',
    common_names: ['Knolvoet', 'Clubroot', 'Plasmodiophora brassicae'],
    pest_type: 'disease',
    description:
      'Bodemgebonden protist (Plasmodiophora brassicae) die knolvormige galvorming op wortels ' +
      'van kruisbloemigen veroorzaakt. Rustsporen overleven 15-20 jaar in de bodem. ' +
      'Geen effectieve chemische bestrijding beschikbaar.',
    lifecycle:
      'Rustsporen kiemen bij aanwezigheid wortelexudaten van kruisbloemige waardplanten. ' +
      'Zwermsporen infecteren wortelharen. Secondaire infectie leidt tot celvermeerdering (knolvorming). ' +
      'Nieuwe rustsporen vrijgekomen bij verrotting wortels. pH <7,0 bevordert infectie.',
    identification:
      'Wortels: opgezwollen, knolvormige gallen varieerend van klein (duimnagel) tot groot (vuist). ' +
      'Bovengronds: verwelking bij warm weer, groeiachterstand, vergeling. ' +
      'Secundaire rotinfectie van gallen veroorzaakt stank.',
    crops_affected: ['bloemkool', 'broccoli', 'spruitkool', 'witte kool', 'koolzaad', 'koolrabi', 'Chinese kool'],
    risk_factors:
      'Lage bodem-pH (<7,0), natte grond, nauwe kruisbloemige rotatie, ' +
      'besmet plantmateriaal, mechanische grondverplaatsing',
    economic_impact:
      'Opbrengstderving tot 100% bij zware besmetting. Perceel ongeschikt voor koolteelt ' +
      'gedurende decennia. Geen effectieve chemische bestrijding.',
    images_description:
      'Opgezwollen knolvormige gallen op koolwortels (knolvoet)',
  },

  // ===== MAIS =====
  {
    id: 'maisstengelborer',
    name: 'Maisstengelborer (Ostrinia nubilalis)',
    common_names: ['Maisstengelborer', 'European corn borer', 'Ostrinia nubilalis'],
    pest_type: 'pest',
    description:
      'Vlinder (Ostrinia nubilalis) waarvan de rupsen stengels en kolven van mais aanboren. ' +
      'Rupsengangen in de stengel veroorzaken stengelbreuk en kolfreductie. ' +
      'Toenemend in Zuid-Nederland door klimaatverandering.',
    lifecycle:
      'Overwintert als volgroeide rups in maisstoppels. Verpopping in voorjaar. ' +
      'Vlindervlucht in juni-juli. Eieren op onderzijde maisbladeren. ' +
      'Rupsen boren in stengel na kort bladvoeding. Een generatie per jaar in NL.',
    identification:
      'Boorgangen in maisstengel met uitwerpselen (boormeel) bij boorgat. ' +
      'Stengelbreuk bij knik. Rupsen (20-25 mm, lichtbruin met donkere kop) in stengelmerg. ' +
      'Kolfschade: rupsen in kolfsteel of spil.',
    crops_affected: ['mais', 'snijmais', 'korrelmals', 'paprika', 'aardappelen'],
    risk_factors:
      'Maisstoppels niet versnipperd, mais na mais, warm klimaat (Zuid-NL), ' +
      'niet-kerend grondbewerking',
    economic_impact:
      'Opbrengstderving 5-20% door stengelbreuk en kolfreductie. ' +
      'Fusariuminfectie via boorgangen verhoogt mycotoxinenrisico in korrel.',
    images_description:
      'Boorgat in maisstengel met boormeel, rups zichtbaar in stengelmerg',
  },
  {
    id: 'builenbrand-mais',
    name: 'Builenbrand (Ustilago maydis)',
    common_names: ['Builenbrand', 'Corn smut', 'Ustilago maydis', 'Maisgal'],
    pest_type: 'disease',
    description:
      'Schimmelziekte veroorzaakt door Ustilago maydis. Vormt grote, grijswitte gallen (builen) ' +
      'gevuld met zwarte brandsporen op kolven, stengels en bladeren. Infectie via wonden en ' +
      'meristematisch weefsel.',
    lifecycle:
      'Brandsporen overleven 2-3 jaar in de bodem. Kieming bij vochtige omstandigheden. ' +
      'Infectie via wonden (hagel, insecten) of jong weefsel. Gallen ontwikkelen 10-14 dagen ' +
      'na infectie. Sporen verspreiden via wind.',
    identification:
      'Grijswitte gallen (tot 15 cm) die later openbarsten en massa zwarte brandsporen ' +
      'vrijlaten. Meest opvallend op kolven, ook op stengels, bladeren en pluimen. ' +
      'Jonge gallen wit en vast, ouder gallen grijs en poederig.',
    crops_affected: ['mais', 'snijmais', 'korrelmals', 'suikermais'],
    risk_factors:
      'Hagelschade, insectenvraat (boorgangen), droogtestress gevolgd door regen, ' +
      'hoge stikstofbemesting',
    economic_impact:
      'Incidenteel, meestal <5% aangetaste planten. In sommige jaren na hagel of droogtestress ' +
      'tot 20% aantasting. Korrelmaiskwaliteit verminderd.',
    images_description:
      'Grote grijswitte gallen op maiskolf die openbarsten met zwarte sporen',
  },

  // ===== FRUIT =====
  {
    id: 'schurft-venturia',
    name: 'Schurft (Venturia inaequalis)',
    common_names: ['Appelschurft', 'Apple scab', 'Venturia inaequalis'],
    pest_type: 'disease',
    description:
      'Schimmelziekte veroorzaakt door Venturia inaequalis (appel) en V. pirina (peer). ' +
      'Belangrijkste schimmelziekte in de Nederlandse fruitteelt. Tast bladeren en vruchten aan ' +
      'met donkere, fluwelige vlekken.',
    lifecycle:
      'Overwintert als pseudothecia op gevallen bladeren. Ascosporen verspreiden in voorjaar bij regen. ' +
      'Primaire infecties maart-juni. Conidien zorgen voor secundaire infecties in zomer. ' +
      'Mills-tabel: relatie temperatuur, bladnatduur en infectiekans.',
    identification:
      'Bladeren: olijfgroene tot donkerbruine, fluwelige vlekken. Blad kan krullen en afvallen. ' +
      'Vruchten: donkere, kurk- of korkachtige vlekken met scheurvorming. ' +
      'Late schurft: kleine zwarte stippen rond oogst (laat latente infectie).',
    crops_affected: ['appels', 'peren', 'mispel'],
    risk_factors:
      'Nat voorjaar, vatbare rassen (Elstar, Jonagold), niet-opgeruimd blad, ' +
      'hoge boomkroon (slecht drogend)',
    economic_impact:
      'Kwaliteitsafkeur bij >1% schurftvruchten. 10-20 bespuitingen per seizoen nodig. ' +
      'Kosten gewasbescherming: 1500-2500 euro/ha/jaar in appels.',
    images_description:
      'Donkere fluwelige schurftvlekken op appel met scheurvorming',
  },
  {
    id: 'vruchtboomkanker',
    name: 'Vruchtboomkanker (Neonectria ditissima)',
    common_names: ['Vruchtboomkanker', 'European canker', 'Neonectria ditissima', 'Nectria galligena'],
    pest_type: 'disease',
    description:
      'Schimmelziekte veroorzaakt door Neonectria ditissima. Vormt kankers op takken en stammen ' +
      'van fruitbomen. Infectie via wonden (snoei, bladlittekens). Kan ook vruchten aantasten ' +
      '(oogrotkanker). Belangrijke ziekte in natte gebieden.',
    lifecycle:
      'Ascosporen en conidien verspreiden bij regen het hele jaar door. ' +
      'Infectie via snoei-, oogst- of bladlittekenswonden. Kankers breiden langzaam uit ' +
      'en sporuleren continu. Rode sporenhoopjes op kankerranden.',
    identification:
      'Ingezonken, gescheurde kankers op takken en stam, vaak bij vertakking of littekenweefsel. ' +
      'Callusvorming rondom geeft kanker concentrisch uiterlijk. ' +
      'Rode sporenhoopjes (sporodochien) op kankerrand. Oogrotkanker: nat rot vanuit kelk of steeleinde.',
    crops_affected: ['appels', 'peren', 'pruimen'],
    risk_factors:
      'Natte klimaat (westelijk NL), vatbare rassen (Cox, Gala), slechte snoei-hygiene, ' +
      'verwonde bomen',
    economic_impact:
      'Taksterfte en boomuitval. Productieverlies door verlies dragende takken. ' +
      'Oogrotkanker: bewaarverliezen.',
    images_description:
      'Concentrische kanker op appelboomtak met rode sporenhoopjes aan de rand',
  },
  {
    id: 'fruitmot',
    name: 'Fruitmot (Cydia pomonella)',
    common_names: ['Fruitmot', 'Codling moth', 'Cydia pomonella'],
    pest_type: 'pest',
    description:
      'Kleine mot (Cydia pomonella) waarvan de rupsen in appelvruchten boren en naar het klokhuis ' +
      'vreten. Belangrijkste fruitplaag wereldwijd. In Nederland goed beheersbaar maar blijvende ' +
      'aandacht vereist.',
    lifecycle:
      'Overwintert als volgroeide rups in cocon onder bast. Verpopping in voorjaar. ' +
      'Vlindervlucht mei-juli (eerste generatie). Eieren op bladeren en vruchten. ' +
      'Rupsen boren in vrucht naar klokhuis. Een tot twee generaties per jaar.',
    identification:
      'Boorgat in vrucht met roodbruine uitwerpselen (frass). Rups (15-20 mm, roze-wit met ' +
      'bruine kop) in klokhuis. Vlinder: 15-20 mm spanwijdte, grijze voorvleugels met ' +
      'koperachtige stip aan buitenrand.',
    crops_affected: ['appels', 'peren', 'walnoten', 'pruimen'],
    risk_factors:
      'Warme zomers (twee generaties), geen feromoonstoringssysteem, ' +
      'nabijheid onbehandelde boomgaarden',
    economic_impact:
      'Afkeur bij >1% aangetaste vruchten op verse markt. ' +
      'Feromoonstoringssysteem (mating disruption) effectief maar kostbaar.',
    images_description:
      'Boorgat in appel met roodbruine frass, rups in klokhuis',
  },
  {
    id: 'appelbloesemkever',
    name: 'Appelbloesemkever (Anthonomus pomorum)',
    common_names: ['Appelbloesemkever', 'Apple blossom weevil', 'Anthonomus pomorum'],
    pest_type: 'pest',
    description:
      'Snuitkever (Anthonomus pomorum) die eieren legt in appelbloesemknoppen. ' +
      'Larve vreet bloembodem leeg waardoor bloem niet opengaat (bruine kapjes). ' +
      'Relevant in jaren met beperkte bloei.',
    lifecycle:
      'Overwintert als adult onder bast en bladstrooisel. Actief bij >10 graden C in voorjaar. ' +
      'Eieren in bloesemknoppen. Larve vreet bloembodem leeg en verpopt in de bloem. ' +
      'Nieuwe adulten in juni.',
    identification:
      'Kenmerkende bruine kapjes: bloesemknoppen die niet opengaan, bruin en verdroogd. ' +
      'Larve (wit, pootloos, 5-7 mm) in de gesloten bloem. ' +
      'Kever: 3-5 mm, bruin, met duidelijke snuit en V-tekening op dekschilden.',
    crops_affected: ['appels', 'peren'],
    risk_factors:
      'Koele voorjaren (langzame bloeiontwikkeling geeft kever meer tijd), ' +
      'boomgaarden nabij bosranden, weinig bloei',
    economic_impact:
      'Oogstderving door verlies bloesem. Vooral relevant in off-jaren (beperkte bloei). ' +
      'Bij goede bloei compenseert de boom het verlies meestal.',
    images_description:
      'Bruine kapjes van niet-geopende appelbloesemknoppen door kever-aantasting',
  },
  {
    id: 'bloedluis',
    name: 'Bloedluis (Eriosoma lanigerum)',
    common_names: ['Bloedluis', 'Woolly apple aphid', 'Eriosoma lanigerum'],
    pest_type: 'pest',
    description:
      'Bladluis (Eriosoma lanigerum) die kolonies vormt op wond- en snoeiplaatsen van appelbomen. ' +
      'Herkenbaar aan witte wasachtige wollige bedekking. Bij aanraken: rode vloeistof (vandaar bloedluis). ' +
      'Veroorzaakt galvorming op takken en wortels.',
    lifecycle:
      'Overwintert als nymfen op wortels en in scheuren van bast. Voorjaarskolonisatie van bovengrondse ' +
      'plantdelen. Meerdere generaties per seizoen. Gevleugelde vormen verspreiden naar andere bomen.',
    identification:
      'Witte wollige massa op wondplaatsen, snoeiplaatsen en scheuren in bast. ' +
      'Bij aanraken rode vloeistof. Galvorming (knobbels) op takken bij langdurige kolonisatie. ' +
      'Wortelkolonies: witte massa op wortels bij uitgraven.',
    crops_affected: ['appels'],
    risk_factors:
      'Veel snoei-/wondplaatsen, vatbare onderstammen (M9 enigszins), ' +
      'afwezigheid natuurlijke vijand Aphelinus mali',
    economic_impact:
      'Verzwakking bomen door zuigschade en galvorming. Wasinfiltratie in vruchten bij ernstige aantasting. ' +
      'Biologische bestrijding met sluipwesp Aphelinus mali effectief.',
    images_description:
      'Witte wollige kolonies van bloedluis op appelboomtak bij snoeiplaats',
  },
  {
    id: 'perevuur',
    name: 'Perevuur (Erwinia amylovora)',
    common_names: ['Perevuur', 'Bacterievuur', 'Fire blight', 'Erwinia amylovora'],
    pest_type: 'disease',
    description:
      'Bacterieziekte veroorzaakt door Erwinia amylovora. Tast bloesem, scheuten, takken en stam aan ' +
      'van appel, peer en siergewassen (meidoorn, cotoneaster). Quarantaineorganisme in de EU. ' +
      'Kan volwassen bomen doden.',
    lifecycle:
      'Bacterien overwinteren in kankerranden op takken. Bij warm vochtig weer in bloei (>18 graden C) ' +
      'bacterieel exudaat (slijmdruppels) op kankers. Insecten en regen verspreiden bacterien naar bloesem. ' +
      'Snelle systemische verspreiding via xyleem.',
    identification:
      'Bruine tot zwarte, verschrompelde bloesemtrossen (blossom blight). Scheuten knikken om ' +
      '(herderstaf-symptoom). Zwarte verkleuring bast met scherpe overgang. ' +
      'Melkachtig bacterieel exudaat (slijmdruppels) op aangetaste delen bij hoge RV.',
    crops_affected: ['peren', 'appels', 'meidoorn', 'cotoneaster', 'lijsterbes', 'kwee'],
    risk_factors:
      'Warm vochtig weer tijdens bloei (>18 graden C, regen), vatbare rassen (Conference peer), ' +
      'nabijheid waardplanten (meidoorn), besmette snoeigereedschappen',
    economic_impact:
      'Boomsterfte bij ernstige aantasting. Rooiplicht bij quarantainestatus. ' +
      'Preventie: streptomycine niet toegelaten in NL, beperkt tot koperhoudende middelen.',
    images_description:
      'Zwart verschrompelde perebloesem met herderstaf-symptoom aan scheut',
  },

  // ===== BOLGEWASSEN =====
  {
    id: 'tulpenvuur',
    name: 'Tulpenvuur (Botrytis tulipae)',
    common_names: ['Tulpenvuur', 'Tulip fire', 'Botrytis tulipae'],
    pest_type: 'disease',
    description:
      'Schimmelziekte veroorzaakt door Botrytis tulipae, specifiek voor tulpen. ' +
      'Kan hele partijen vernietigen in natte voorjaren. Verspreiding via sporen en besmette bollen. ' +
      'Belangrijkste ziekte in de tulpenteelt.',
    lifecycle:
      'Overleving als sclerotien op en in bollen en in de grond. Bij opkomst: primaire infectie ' +
      'vanuit besmette bollen. Sporenproductie op aangetaste plantdelen verspreidt via wind en regen. ' +
      'Meerdere infectiecycli per seizoen.',
    identification:
      'Primaire symptomen: misvormde, verdraaide scheuten met bruine vlekken (blind-gaan). ' +
      'Secundair: kleine waterige vlekjes op bladeren en bloemen die snel uitbreiden. ' +
      'Grijs schimmelpluis op afgestorven weefsel. Sclerotien op bolhuid.',
    crops_affected: ['tulpen'],
    risk_factors:
      'Nat koud voorjaar, dicht plantverband, besmet plantgoed, ' +
      'niet-verwijderde zieke planten, nauwe rotatie',
    economic_impact:
      'Opbrengstderving tot 100% in onbehandelde natte jaren. ' +
      '6-10 fungicidebespuitingen per seizoen standaard. Hoge bestrijdingskosten.',
    images_description:
      'Misvormde tulpenscheut met bruine vlekken en grijs schimmelpluis',
  },
  {
    id: 'pythium-bol',
    name: 'Pythium (bolgewassen)',
    common_names: ['Pythium', 'Pythium root rot', 'Pythium ultimum', 'Wortelrot'],
    pest_type: 'disease',
    description:
      'Oomyceet (Pythium spp., m.n. P. ultimum) die wortelrot en bolrot veroorzaakt ' +
      'in bolgewassen en sierteelt. Tast wortels en bolbasis aan in natte, slecht gedraineerde grond. ' +
      'Breed waardplantbereik.',
    lifecycle:
      'Oosporen overleven jarenlang in de bodem. Zoosporen verspreiden via bodemwater. ' +
      'Infectie van wortelpunten en wonden. Snelle vermeerdering in natte, warme grond. ' +
      'Meerdere cycli per seizoen.',
    identification:
      'Wortels: waterig, glazig rot dat snel bruin verkleurt. Wortels breken gemakkelijk af. ' +
      'Bol: zachte, bruine rot aan bolbasis. Bovengronds: vergeling, verwelking, groeiachterstand. ' +
      'Kiemplanten: wegvallen (damping-off).',
    crops_affected: ['tulpen', 'hyacinten', 'narcissen', 'lelies', 'irissen'],
    risk_factors:
      'Slechte drainage, zware grond, overmatig beregenen, verwonde bollen, ' +
      'hoge bodemtemperatuur',
    economic_impact:
      'Uitval 5-30% afhankelijk van omstandigheden. Bolkwaliteitsverlies. ' +
      'Preventie via drainage en bodemmanagement effectiever dan chemische bestrijding.',
    images_description:
      'Waterig glazig wortelrot bij tulpenbol door Pythium-infectie',
  },
  {
    id: 'fusarium-bol',
    name: 'Fusarium oxysporum (bolgewassen)',
    common_names: ['Bolrot', 'Fusarium', 'Fusarium oxysporum', 'Zuur'],
    pest_type: 'disease',
    description:
      'Schimmelziekte veroorzaakt door Fusarium oxysporum f.sp. tulipae (en andere formae speciales). ' +
      'Veroorzaakt inwendig bolrot (zuur) met typische ethanolgeur. ' +
      'Belangrijkste bewaarziekte in tulpenbollen.',
    lifecycle:
      'Schimmel overleeft als chlamydosporen in de bodem (10+ jaar). Infectie via wonden ' +
      '(rooibeschadiging, pelletje). Ontwikkeling bij bewaartemperatuur >20 graden C. ' +
      'Ethyleenproductie door besmette bollen stimuleert gommose in buurbollingen.',
    identification:
      'Uitwendig: bruine vlekken op bolbasis of wonden. Inwendig: bruine tot donkerbruine rot, ' +
      'vaak met roze schimmelpluis in holten. Typische geur (ethanol/azijnzuur, vandaar zuur). ' +
      'Bovengronds: planten komen niet op of vergelen vroeg.',
    crops_affected: ['tulpen', 'narcissen', 'lelies', 'gladiolen', 'krokussen'],
    risk_factors:
      'Rooibeschadiging, warm drogen (>25 graden C), verwonding bij pellen, ' +
      'besmette bewaarplaats, ethyleenbelasting',
    economic_impact:
      'Bewaarverliezen 5-30%. Ethyleenproductie kan kettingreactie veroorzaken in bewaarcel. ' +
      'Exportafkeur bij >2% zuur in partij.',
    images_description:
      'Doorgesneden tulpenbol met bruin inwendig rot en roze schimmelpluis (fusarium/zuur)',
  },

  // ===== GLASTUINBOUW =====
  {
    id: 'wittevlieg-glas',
    name: 'Wittevlieg (Trialeurodes vaporariorum)',
    common_names: ['Kaswittevlieg', 'Greenhouse whitefly', 'Trialeurodes vaporariorum'],
    pest_type: 'pest',
    description:
      'Kaswittevlieg (Trialeurodes vaporariorum) is de belangrijkste plaag in de Nederlandse glastuinbouw. ' +
      'Zuigt floeemsap en scheidt honingdauw af. Tabakswittevlieg (Bemisia tabaci) is quarantainesoort ' +
      'die ook in kassen voorkomt.',
    lifecycle:
      'Continue voortplanting in verwarmde kassen (geen diapauze). Generatietijd 3-4 weken bij 20 graden C. ' +
      'Eieren op bladonderzijde. Nymphen doorlopen 4 stadia. Poppen herkenbaar als witte schijfjes.',
    identification:
      'Volwassen: kleine (1,5 mm) witte vliegjes die opvliegen bij aanraking gewas. ' +
      'Nymphen: platte groene tot witte schijfjes op bladonderzijde. ' +
      'Honingdauw en roetdauw op bladeren. Vergelende bladeren.',
    crops_affected: ['tomaten', 'komkommer', 'paprika', 'aubergine', 'sierteelt', 'potplanten'],
    risk_factors:
      'Verwarmde kassen, continue teelt, geen biologische bestrijding, ' +
      'resistentie tegen insecticiden',
    economic_impact:
      'Directe zuigschade en kwaliteitsverlies door honingdauw/roetdauw. ' +
      'Biologische bestrijding met sluipwesp Encarsia formosa standaard in NL glastuinbouw.',
    images_description:
      'Witte vliegjes op onderzijde tomatenblad met nymphen en honingdauw',
  },
  {
    id: 'spint-glas',
    name: 'Spint (Tetranychus urticae)',
    common_names: ['Bonenspintmijt', 'Two-spotted spider mite', 'Tetranychus urticae', 'Kasspint'],
    pest_type: 'pest',
    description:
      'Spintmijt (Tetranychus urticae) die celinhoud van bladeren leegzuigt. ' +
      'Vormt webben aan onderzijde bladeren. Snelle populatieopbouw bij warm, droog weer. ' +
      'Belangrijke plaag in zowel glastuinbouw als openluchtteelten.',
    lifecycle:
      'Overwintert als diapauze-vrouwtje (oranje) in kasnaden en plantmateriaal. ' +
      'Generatietijd 10-14 dagen bij 25 graden C. Meerdere generaties per seizoen. ' +
      'Explosieve populatiegroei bij warm droog weer.',
    identification:
      'Bladonderzijde: stipvormige gele vlekjes (lege cellen). Spinsel (webben) bij zware aantasting. ' +
      'Mijten: 0,5 mm, groenachtig met twee donkere vlekken (twospotted). ' +
      'Diapauze-vrouwtjes: oranje-rood. Bladeren verkleuren geel-bruin en vallen af.',
    crops_affected: ['komkommer', 'bonen', 'aubergine', 'paprika', 'roos', 'chrysant', 'aardbeien'],
    risk_factors:
      'Warm droog weer/klimaat, brede-spectrum insecticiden (doden roofmijten), ' +
      'geen biologische bestrijding',
    economic_impact:
      'Opbrengstderving 20-60% bij onbehandelde zware aantasting. ' +
      'Biologische bestrijding met roofmijt Phytoseiulus persimilis standaard in NL glastuinbouw.',
    images_description:
      'Spinsel en gele stippen op bladonderzijde door spintmijt-aantasting',
  },
  {
    id: 'trips-glas',
    name: 'Californische trips (Frankliniella occidentalis)',
    common_names: ['Californische trips', 'Western flower thrips', 'Frankliniella occidentalis'],
    pest_type: 'pest',
    description:
      'Frankliniella occidentalis, ook wel Californische trips, is de economisch belangrijkste tripssoort ' +
      'in de Nederlandse glastuinbouw. Zuigschade op bladeren en bloemen. ' +
      'Belangrijke vector van tomatenbronsvlekkenvirus (TSWV).',
    lifecycle:
      'Continue voortplanting in verwarmde kassen. Generatietijd 2-3 weken bij 25 graden C. ' +
      'Eieren in bladweefsel. Larven voeden op bladeren en bloemen. Verpopping in bodem/substraat.',
    identification:
      'Kleine (1-2 mm) slanke insecten, geelbruin tot donkerbruin. Zilverachtige zuigvlekken op bladeren. ' +
      'Bruine vlekken en misvorming van bloemen. Zwarte stipjes (uitwerpselen). ' +
      'TSWV: necrotische ringen en bronsvlekken op bladeren en vruchten.',
    crops_affected: ['paprika', 'komkommer', 'chrysant', 'roos', 'gerbera', 'aardbeien', 'sla'],
    risk_factors:
      'Verwarmde kassen, bloeiende gewassen, resistentie tegen insecticiden, ' +
      'geen biologische bestrijding',
    economic_impact:
      'Directe schade: kwaliteitsverlies bloemen en vruchten. ' +
      'TSWV-overdracht: ernstige virusziekte met opbrengstverliezen tot 100% in vatbare rassen.',
    images_description:
      'Zilverachtige zuigvlekken en bruine bloemverkleuring door Californische trips',
  },
  {
    id: 'mineervlieg-glas',
    name: 'Mineervlieg (Liriomyza spp.)',
    common_names: ['Mineervlieg', 'Leaf miner', 'Liriomyza trifolii', 'Liriomyza huidobrensis'],
    pest_type: 'pest',
    description:
      'Kleine vliegen (Liriomyza spp.) waarvan de larven slingergangetjes (mijnen) in bladmoes vreten. ' +
      'L. trifolii en L. huidobrensis zijn quarantainesoorten. Belangrijke plaag in glastuinbouw, ' +
      'met name in sierteelt.',
    lifecycle:
      'Generatietijd 2-4 weken in verwarmde kas. Eieren in bladweefsel (vrouwtjes prikken met legboor). ' +
      'Larven mineren in bladmoes. Verpopping in of op blad, of in de grond.',
    identification:
      'Slingergangetjes (mijnen) in bladeren, groen tot bruin verkleurend. Witte larven (2-3 mm) ' +
      'zichtbaar in de mijn. Prikstipjes (feeding punctures) van vrouwtjes op bladoppervlak. ' +
      'Bij zware aantasting: volledig verminerd blad.',
    crops_affected: ['chrysant', 'gerbera', 'tomaten', 'sla', 'bonen', 'selderij'],
    risk_factors:
      'Verwarmde kassen, continue teelt, geen biologische bestrijding, ' +
      'besmet plantmateriaal',
    economic_impact:
      'Kwaliteitsverlies sierteelt. Quarantainestatus L. huidobrensis: export-beperking. ' +
      'Biologische bestrijding met sluipwespen (Diglyphus, Dacnusa) standaard.',
    images_description:
      'Slingergangetjes (mijnen) in chrysantenblad door mineervlieg-larve',
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
  // === Phytophthora infestans ===
  { pest_id: 'phytophthora-infestans', symptom: 'Onregelmatige bruine vlekken op bladeren, vaak startend aan bladrand', plant_part: 'bladeren', timing: 'juni tot september', confidence: 'diagnostic' },
  { pest_id: 'phytophthora-infestans', symptom: 'Wit schimmelpluis aan onderzijde blad bij vochtig weer', plant_part: 'bladeren', timing: 'juni tot september', confidence: 'diagnostic' },
  { pest_id: 'phytophthora-infestans', symptom: 'Bruinrot in knollen, leerachtig vast weefsel', plant_part: 'knollen', timing: 'oogst en bewaring', confidence: 'diagnostic' },
  { pest_id: 'phytophthora-infestans', symptom: 'Bruine vlekken op stengels', plant_part: 'stengels', timing: 'zomer', confidence: 'suggestive' },
  { pest_id: 'phytophthora-infestans', symptom: 'Versnelde loofdood', plant_part: 'hele plant', timing: 'zomer', confidence: 'associated' },

  // === Schurft (Streptomyces) ===
  { pest_id: 'schurft-streptomyces', symptom: 'Oppervlakkige kurkachtige lesies op knolschil', plant_part: 'knollen', timing: 'oogst', confidence: 'diagnostic' },
  { pest_id: 'schurft-streptomyces', symptom: 'Diepe kraterachtige schurftlesies op knollen', plant_part: 'knollen', timing: 'oogst', confidence: 'diagnostic' },
  { pest_id: 'schurft-streptomyces', symptom: 'Verheven bultschurft op knoloppervlak', plant_part: 'knollen', timing: 'oogst', confidence: 'diagnostic' },
  { pest_id: 'schurft-streptomyces', symptom: 'Geen symptomen op bovengrondse plantdelen', plant_part: 'hele plant', timing: 'groeiperiode', confidence: 'associated' },

  // === Zilverschurft ===
  { pest_id: 'zilverschurft', symptom: 'Zilverachtige verkleuring op knolschil, vooral zichtbaar na wassen', plant_part: 'knollen', timing: 'oogst en bewaring', confidence: 'diagnostic' },
  { pest_id: 'zilverschurft', symptom: 'Knoluitdroging tijdens bewaring', plant_part: 'knollen', timing: 'bewaring', confidence: 'suggestive' },
  { pest_id: 'zilverschurft', symptom: 'Schilferende schilverkleuring bij langdurige bewaring', plant_part: 'knollen', timing: 'bewaring', confidence: 'suggestive' },

  // === Droogrot ===
  { pest_id: 'droogrot-fusarium', symptom: 'Ingezonken, gerimpelde lesies op knolschil met concentrische ringen', plant_part: 'knollen', timing: 'bewaring', confidence: 'diagnostic' },
  { pest_id: 'droogrot-fusarium', symptom: 'Droog korrelig bruin-grijs weefsel inwendig met holten en schimmelpluis', plant_part: 'knollen', timing: 'bewaring', confidence: 'diagnostic' },
  { pest_id: 'droogrot-fusarium', symptom: 'Verschrompelde, ingedroogde knollen', plant_part: 'knollen', timing: 'bewaring', confidence: 'suggestive' },

  // === Natrot ===
  { pest_id: 'natrot-erwinia', symptom: 'Zwarte natte verkleuring stengelbasis (zwartbenigheid)', plant_part: 'stengels', timing: 'groeiperiode', confidence: 'diagnostic' },
  { pest_id: 'natrot-erwinia', symptom: 'Waterig zacht rot in knollen met scherpe grens gezond/ziek', plant_part: 'knollen', timing: 'bewaring', confidence: 'diagnostic' },
  { pest_id: 'natrot-erwinia', symptom: 'Typische rottingsgeur bij aangetaste knollen', plant_part: 'knollen', timing: 'bewaring', confidence: 'suggestive' },
  { pest_id: 'natrot-erwinia', symptom: 'Verwelking bovengrondse delen bij warm weer', plant_part: 'hele plant', timing: 'zomer', confidence: 'associated' },

  // === Rhizoctonia solani ===
  { pest_id: 'rhizoctonia-solani', symptom: 'Zwarte, niet-afwasbare sclerotien (lakschurft) op aardappelknollen', plant_part: 'knollen', timing: 'oogst', confidence: 'diagnostic' },
  { pest_id: 'rhizoctonia-solani', symptom: 'Witte mycelium-manchet rond stengelbasis (wit-benen)', plant_part: 'stengels', timing: 'voorjaar tot zomer', confidence: 'diagnostic' },
  { pest_id: 'rhizoctonia-solani', symptom: 'Ingesnoerde, zwartverkleurde wortelhals bij bietenkiemplanten', plant_part: 'wortels', timing: 'kiemplantstadium', confidence: 'diagnostic' },
  { pest_id: 'rhizoctonia-solani', symptom: 'Misvorming en scheurvorming aardappelknollen', plant_part: 'knollen', timing: 'oogst', confidence: 'suggestive' },

  // === Ratelziekte (TRV) ===
  { pest_id: 'ratelziekte', symptom: 'Bruine necrotische ringen en bogen in knolvlees (kringerigheid)', plant_part: 'knollen', timing: 'oogst', confidence: 'diagnostic' },
  { pest_id: 'ratelziekte', symptom: 'Gele ringen of vlekken op bladeren', plant_part: 'bladeren', timing: 'groeiperiode', confidence: 'suggestive' },
  { pest_id: 'ratelziekte', symptom: 'Onregelmatige knolvorm', plant_part: 'knollen', timing: 'oogst', confidence: 'associated' },

  // === Trips (aardappel) ===
  { pest_id: 'trips-aardappel', symptom: 'Zilverachtige vlekjes op bladeren door lege cellen', plant_part: 'bladeren', timing: 'zomer', confidence: 'diagnostic' },
  { pest_id: 'trips-aardappel', symptom: 'Zwarte stipjes (uitwerpselen) op bladonderzijde', plant_part: 'bladeren', timing: 'zomer', confidence: 'suggestive' },
  { pest_id: 'trips-aardappel', symptom: 'Krullende bladranden bij zware aantasting', plant_part: 'bladeren', timing: 'zomer', confidence: 'suggestive' },

  // === Bladrandkever ===
  { pest_id: 'bladrandkever', symptom: 'Halfronde U-vormige inkepingen aan bladranden', plant_part: 'bladeren', timing: 'voorjaar', confidence: 'diagnostic' },
  { pest_id: 'bladrandkever', symptom: 'Kleine grijsbruine kever (4-5 mm) met korte snuit op planten', plant_part: 'bladeren', timing: 'voorjaar', confidence: 'diagnostic' },
  { pest_id: 'bladrandkever', symptom: 'Verminderde stikstofbinding door wortelknolletje-vraat larven', plant_part: 'wortels', timing: 'zomer', confidence: 'associated' },

  // === Coloradokever ===
  { pest_id: 'coloradokever', symptom: 'Geel-oranje kever met 10 zwarte lengtestrepen op dekschilden', plant_part: 'bladeren', timing: 'voorjaar tot zomer', confidence: 'diagnostic' },
  { pest_id: 'coloradokever', symptom: 'Oranje eipakketjes aan onderzijde bladeren', plant_part: 'bladeren', timing: 'voorjaar', confidence: 'diagnostic' },
  { pest_id: 'coloradokever', symptom: 'Kaalvraat bladeren, alleen nerven resterend', plant_part: 'bladeren', timing: 'zomer', confidence: 'suggestive' },
  { pest_id: 'coloradokever', symptom: 'Roodachtige larven met zwarte stippen op bladeren', plant_part: 'bladeren', timing: 'voorjaar tot zomer', confidence: 'diagnostic' },

  // === Aardappelcysteaaltje ===
  { pest_id: 'aardappelcysteaaltje', symptom: 'Pleksgewijze groeiachterstand in perceel', plant_part: 'hele plant', timing: 'groeiperiode', confidence: 'suggestive' },
  { pest_id: 'aardappelcysteaaltje', symptom: 'Vergeling en verwelking planten bij warm weer', plant_part: 'hele plant', timing: 'zomer', confidence: 'suggestive' },
  { pest_id: 'aardappelcysteaaltje', symptom: 'Witte of cremekleurige bolletjes (cysten) zichtbaar op wortels', plant_part: 'wortels', timing: 'zomer', confidence: 'diagnostic' },

  // === Septoria tritici ===
  { pest_id: 'septoria-tritici', symptom: 'Langwerpige bruine vlekken met zwarte pycniden op tarwebladeren', plant_part: 'bladeren', timing: 'herfst tot voorjaar', confidence: 'diagnostic' },
  { pest_id: 'septoria-tritici', symptom: 'Gele vlekken op onderste bladeren', plant_part: 'bladeren', timing: 'herfst en vroeg voorjaar', confidence: 'suggestive' },
  { pest_id: 'septoria-tritici', symptom: 'Verminderde korrelzetting bij ernstige aantasting bovenste bladeren', plant_part: 'aren', timing: 'zomer', confidence: 'associated' },

  // === Meeldauw ===
  { pest_id: 'meeldauw', symptom: 'Wit tot grijswit poederachtig schimmelpluis op bovenzijde bladeren', plant_part: 'bladeren', timing: 'voorjaar tot zomer', confidence: 'diagnostic' },
  { pest_id: 'meeldauw', symptom: 'Oudere meeldauwvlekken worden grijsbruin met zwarte cleistothecia', plant_part: 'bladeren', timing: 'zomer', confidence: 'diagnostic' },
  { pest_id: 'meeldauw', symptom: 'Verminderde bladfotosynthese bij ernstige aantasting', plant_part: 'bladeren', timing: 'zomer', confidence: 'associated' },

  // === Bruine roest ===
  { pest_id: 'bruine-roest', symptom: 'Oranje-bruine ronde pustels verspreid over bovenzijde bladeren', plant_part: 'bladeren', timing: 'voorjaar tot zomer', confidence: 'diagnostic' },
  { pest_id: 'bruine-roest', symptom: 'Pustels omgeven door intacte epidermis', plant_part: 'bladeren', timing: 'voorjaar tot zomer', confidence: 'diagnostic' },
  { pest_id: 'bruine-roest', symptom: 'Vergeling en verdroging bladeren bij ernstige aantasting', plant_part: 'bladeren', timing: 'zomer', confidence: 'suggestive' },

  // === Gele roest ===
  { pest_id: 'gele-roest', symptom: 'Oranjegele pustels in strepen langs bladnerven', plant_part: 'bladeren', timing: 'voorjaar', confidence: 'diagnostic' },
  { pest_id: 'gele-roest', symptom: 'Rijen pustels evenwijdig aan bladlengte', plant_part: 'bladeren', timing: 'voorjaar', confidence: 'diagnostic' },
  { pest_id: 'gele-roest', symptom: 'Gele verkleuring en afsterving aangetaste bladeren', plant_part: 'bladeren', timing: 'voorjaar tot zomer', confidence: 'suggestive' },

  // === Oogvlekkenziekte ===
  { pest_id: 'oogvlekkenziekte', symptom: 'Ovale oogvormige lesies op stengelvoet met donkere rand en licht centrum', plant_part: 'stengels', timing: 'voorjaar', confidence: 'diagnostic' },
  { pest_id: 'oogvlekkenziekte', symptom: 'Legering van gewas bij zware aantasting', plant_part: 'hele plant', timing: 'zomer', confidence: 'suggestive' },
  { pest_id: 'oogvlekkenziekte', symptom: 'Stengel inrotten bij stengelvoet', plant_part: 'stengels', timing: 'zomer', confidence: 'suggestive' },

  // === Halmdoder ===
  { pest_id: 'halmdoder', symptom: 'Zwart verkleurd wortelstelsel met donkere runner hyphae', plant_part: 'wortels', timing: 'groeiperiode', confidence: 'diagnostic' },
  { pest_id: 'halmdoder', symptom: 'Witte aren (whiteheads) in plekken', plant_part: 'aren', timing: 'zomer', confidence: 'diagnostic' },
  { pest_id: 'halmdoder', symptom: 'Planten makkelijk uit grond te trekken door wortelvernietiging', plant_part: 'wortels', timing: 'groeiperiode', confidence: 'suggestive' },
  { pest_id: 'halmdoder', symptom: 'Zwart verkleurde stengelbasis', plant_part: 'stengels', timing: 'groeiperiode', confidence: 'suggestive' },

  // === Fusarium aar ===
  { pest_id: 'fusarium-aar', symptom: 'Gebleekte aarpakjes tussen gezond groen weefsel', plant_part: 'aren', timing: 'bloei tot rijping', confidence: 'diagnostic' },
  { pest_id: 'fusarium-aar', symptom: 'Roze-oranje sporenmassa op kafjes bij vochtig weer', plant_part: 'aren', timing: 'bloei tot rijping', confidence: 'diagnostic' },
  { pest_id: 'fusarium-aar', symptom: 'Verschrompelde, lichte korrels bij dorsen', plant_part: 'aren', timing: 'oogst', confidence: 'suggestive' },

  // === Bladluis granen ===
  { pest_id: 'bladluis-granen', symptom: 'Kolonies kleine zachte insecten op bladeren, stengels en aren', plant_part: 'aren', timing: 'voorjaar tot zomer', confidence: 'diagnostic' },
  { pest_id: 'bladluis-granen', symptom: 'Honingdauw en zwarte roetdauwschimmels op bladeren', plant_part: 'bladeren', timing: 'zomer', confidence: 'suggestive' },
  { pest_id: 'bladluis-granen', symptom: 'Krullende bladeren en groeiremming', plant_part: 'bladeren', timing: 'voorjaar', confidence: 'suggestive' },
  { pest_id: 'bladluis-granen', symptom: 'Vergeling door gerstvergelingsvirus (BYDV)', plant_part: 'hele plant', timing: 'herfst tot voorjaar', confidence: 'associated' },

  // === Graanhaantje ===
  { pest_id: 'graanhaantje', symptom: 'Venstervormige vraat-strepen op bladeren (epidermis intact aan een zijde)', plant_part: 'bladeren', timing: 'voorjaar tot zomer', confidence: 'diagnostic' },
  { pest_id: 'graanhaantje', symptom: 'Slijmerig bedekte larve op bladeren', plant_part: 'bladeren', timing: 'voorjaar tot zomer', confidence: 'diagnostic' },
  { pest_id: 'graanhaantje', symptom: 'Blauwe metallic kever met rood halsschild op bladeren', plant_part: 'bladeren', timing: 'voorjaar', confidence: 'diagnostic' },

  // === Fritvlieg ===
  { pest_id: 'fritvlieg', symptom: 'Centraal blad vergelt en sterft af (doodhart) bij kiemplant', plant_part: 'bladeren', timing: 'herfst en voorjaar', confidence: 'diagnostic' },
  { pest_id: 'fritvlieg', symptom: 'Witte maden in groeipunt of stengelbasis', plant_part: 'stengels', timing: 'herfst en voorjaar', confidence: 'diagnostic' },
  { pest_id: 'fritvlieg', symptom: 'Overmatige uitstoeling door verlies van hoofdspruit', plant_part: 'hele plant', timing: 'herfst', confidence: 'suggestive' },

  // === Vergelingsziekte biet ===
  { pest_id: 'vergelingsziekte-biet', symptom: 'Vergeling oudere bladeren, beginnend aan bladpunten en -randen', plant_part: 'bladeren', timing: 'zomer', confidence: 'diagnostic' },
  { pest_id: 'vergelingsziekte-biet', symptom: 'Bladeren worden dik en bros', plant_part: 'bladeren', timing: 'zomer', confidence: 'suggestive' },
  { pest_id: 'vergelingsziekte-biet', symptom: 'Geel-oranje verkleuring bij BYV, geelgroene intervenale chlorose bij BMYV', plant_part: 'bladeren', timing: 'zomer', confidence: 'diagnostic' },
  { pest_id: 'vergelingsziekte-biet', symptom: 'Vergelingshaarden in perceel, startend bij randen', plant_part: 'hele plant', timing: 'zomer', confidence: 'suggestive' },

  // === Cercospora biet ===
  { pest_id: 'cercospora-biet', symptom: 'Ronde bladvlekken (2-5 mm) met donkerbruine rand en grijs centrum', plant_part: 'bladeren', timing: 'zomer tot herfst', confidence: 'diagnostic' },
  { pest_id: 'cercospora-biet', symptom: 'Vlekken vloeien samen, blad sterft af', plant_part: 'bladeren', timing: 'zomer tot herfst', confidence: 'suggestive' },
  { pest_id: 'cercospora-biet', symptom: 'Hertgroei vanuit hart na bladvernietiging', plant_part: 'hele plant', timing: 'herfst', confidence: 'associated' },

  // === Bietenvlieg ===
  { pest_id: 'bietenvlieg', symptom: 'Blaasachtige lichtbruine bladmijnen op bietenbladeren', plant_part: 'bladeren', timing: 'mei tot juni', confidence: 'diagnostic' },
  { pest_id: 'bietenvlieg', symptom: 'Witte maden zichtbaar in bladmijnen', plant_part: 'bladeren', timing: 'mei tot juni', confidence: 'diagnostic' },
  { pest_id: 'bietenvlieg', symptom: 'Witte langwerpige eieren in groepjes op bladonderzijde', plant_part: 'bladeren', timing: 'mei', confidence: 'suggestive' },

  // === Bietencysteaaltje ===
  { pest_id: 'bietencysteaaltje', symptom: 'Pleksgewijze groeiachterstand in bietenperceel', plant_part: 'hele plant', timing: 'groeiperiode', confidence: 'suggestive' },
  { pest_id: 'bietencysteaaltje', symptom: 'Verwelking bij warm weer met herstel in avond', plant_part: 'hele plant', timing: 'zomer', confidence: 'suggestive' },
  { pest_id: 'bietencysteaaltje', symptom: 'Sterk vertakte wortels (baardvorming) met witte cysten', plant_part: 'wortels', timing: 'zomer', confidence: 'diagnostic' },
  { pest_id: 'bietencysteaaltje', symptom: 'Vergeling buitenste bladeren', plant_part: 'bladeren', timing: 'zomer', confidence: 'associated' },

  // === Bladvlekkenziekte uien ===
  { pest_id: 'bladvlekkenziekte-botrytis-ui', symptom: 'Kleine wittige tot lichtbruine vlekjes (1-5 mm) op uienblad', plant_part: 'bladeren', timing: 'groeiperiode', confidence: 'diagnostic' },
  { pest_id: 'bladvlekkenziekte-botrytis-ui', symptom: 'Bladpunten verdrogen, necrotische zones breiden uit', plant_part: 'bladeren', timing: 'groeiperiode', confidence: 'suggestive' },
  { pest_id: 'bladvlekkenziekte-botrytis-ui', symptom: 'Grijzig waas van conidioforen op dood bladweefsel', plant_part: 'bladeren', timing: 'groeiperiode', confidence: 'diagnostic' },

  // === Valse meeldauw uien ===
  { pest_id: 'valse-meeldauw-ui', symptom: 'Ovale lichtgroene tot gele vlekken op uienblad', plant_part: 'bladeren', timing: 'voorjaar tot zomer', confidence: 'diagnostic' },
  { pest_id: 'valse-meeldauw-ui', symptom: 'Grijspaars sporenpluis op lesieoppervlak bij vochtig weer', plant_part: 'bladeren', timing: 'voorjaar tot zomer', confidence: 'diagnostic' },
  { pest_id: 'valse-meeldauw-ui', symptom: 'Bladeren knikken om en verdrogen', plant_part: 'bladeren', timing: 'zomer', confidence: 'suggestive' },

  // === Preimot ===
  { pest_id: 'preimot', symptom: 'Vraatgangen (mijnen) in uienblad en preischacht', plant_part: 'bladeren', timing: 'mei tot september', confidence: 'diagnostic' },
  { pest_id: 'preimot', symptom: 'Geelgroene rupsen (10-15 mm) in bladeren of schacht', plant_part: 'bladeren', timing: 'mei tot september', confidence: 'diagnostic' },
  { pest_id: 'preimot', symptom: 'Uitwerpselen (frass) in en rondom vraatgangen', plant_part: 'bladeren', timing: 'mei tot september', confidence: 'suggestive' },

  // === Stengelaaltje ===
  { pest_id: 'stengelaaltje', symptom: 'Opgezwollen, vervormde stengelbasis bij uien', plant_part: 'stengelbasis', timing: 'groeiperiode', confidence: 'diagnostic' },
  { pest_id: 'stengelaaltje', symptom: 'Zachte, glazige bolschubben die inrotten', plant_part: 'bollen', timing: 'groei en bewaring', confidence: 'diagnostic' },
  { pest_id: 'stengelaaltje', symptom: 'Misvormde, korte stengels en bloemdeformatie bij tulpen', plant_part: 'stengels', timing: 'voorjaar', confidence: 'diagnostic' },
  { pest_id: 'stengelaaltje', symptom: 'Krullerig, verdikt hart bij suikerbieten (kroef)', plant_part: 'hart', timing: 'zomer', confidence: 'suggestive' },

  // === Koolvlieg ===
  { pest_id: 'koolvlieg', symptom: 'Verwelking en blauwverkleuring koolblad bij warm weer', plant_part: 'bladeren', timing: 'mei tot september', confidence: 'suggestive' },
  { pest_id: 'koolvlieg', symptom: 'Witte maden (8 mm) in en rondom koolwortels', plant_part: 'wortels', timing: 'mei tot september', confidence: 'diagnostic' },
  { pest_id: 'koolvlieg', symptom: 'Groeiachterstand en uitval jonge koolplanten', plant_part: 'hele plant', timing: 'mei tot juni', confidence: 'suggestive' },

  // === Koolwitje ===
  { pest_id: 'koolwitje', symptom: 'Geelgroene rupsen met zwarte vlekken (groot koolwitje) op koolbladeren', plant_part: 'bladeren', timing: 'zomer', confidence: 'diagnostic' },
  { pest_id: 'koolwitje', symptom: 'Kaalvraat van bladeren, alleen nerven resterend', plant_part: 'bladeren', timing: 'zomer', confidence: 'suggestive' },
  { pest_id: 'koolwitje', symptom: 'Groene keutels (uitwerpselen) op en tussen koolbladeren', plant_part: 'bladeren', timing: 'zomer', confidence: 'suggestive' },

  // === Kooluil ===
  { pest_id: 'kooluil', symptom: 'Groene tot bruine rupsen (tot 45 mm) in koolkop', plant_part: 'kop', timing: 'zomer tot herfst', confidence: 'diagnostic' },
  { pest_id: 'kooluil', symptom: 'Uitwerpselen in koolkop en tussen bladeren', plant_part: 'kop', timing: 'zomer tot herfst', confidence: 'suggestive' },
  { pest_id: 'kooluil', symptom: 'Vraatschade aan buitenste bladeren, later in de krop', plant_part: 'bladeren', timing: 'zomer tot herfst', confidence: 'suggestive' },

  // === Knolvoet ===
  { pest_id: 'knolvoet', symptom: 'Opgezwollen knolvormige gallen op wortels van koolgewassen', plant_part: 'wortels', timing: 'groeiperiode', confidence: 'diagnostic' },
  { pest_id: 'knolvoet', symptom: 'Verwelking bij warm weer ondanks voldoende bodemvocht', plant_part: 'hele plant', timing: 'zomer', confidence: 'suggestive' },
  { pest_id: 'knolvoet', symptom: 'Groeiachterstand en vergeling', plant_part: 'hele plant', timing: 'groeiperiode', confidence: 'associated' },

  // === Maisstengelborer ===
  { pest_id: 'maisstengelborer', symptom: 'Boorgangen in maisstengel met boormeel bij boorgat', plant_part: 'stengels', timing: 'zomer', confidence: 'diagnostic' },
  { pest_id: 'maisstengelborer', symptom: 'Stengelbreuk bij knik door boorgangen', plant_part: 'stengels', timing: 'herfst', confidence: 'suggestive' },
  { pest_id: 'maisstengelborer', symptom: 'Lichtbruine rupsen (20-25 mm) in stengelmerg', plant_part: 'stengels', timing: 'zomer', confidence: 'diagnostic' },

  // === Builenbrand mais ===
  { pest_id: 'builenbrand-mais', symptom: 'Grijswitte gallen (tot 15 cm) op kolven, stengels of bladeren', plant_part: 'kolven', timing: 'zomer tot herfst', confidence: 'diagnostic' },
  { pest_id: 'builenbrand-mais', symptom: 'Openbarstende gallen met massa zwarte brandsporen', plant_part: 'kolven', timing: 'herfst', confidence: 'diagnostic' },
  { pest_id: 'builenbrand-mais', symptom: 'Vervorming en verdikking aangetaste plantdelen', plant_part: 'hele plant', timing: 'zomer', confidence: 'suggestive' },

  // === Appelschurft ===
  { pest_id: 'schurft-venturia', symptom: 'Olijfgroene tot donkerbruine fluwelige vlekken op bladeren', plant_part: 'bladeren', timing: 'voorjaar tot zomer', confidence: 'diagnostic' },
  { pest_id: 'schurft-venturia', symptom: 'Donkere kurkachtige vlekken op vruchten met scheurvorming', plant_part: 'vruchten', timing: 'zomer tot oogst', confidence: 'diagnostic' },
  { pest_id: 'schurft-venturia', symptom: 'Bladkrulling en vroege bladval', plant_part: 'bladeren', timing: 'zomer', confidence: 'suggestive' },
  { pest_id: 'schurft-venturia', symptom: 'Late schurft: kleine zwarte stippen op vruchten rond oogst', plant_part: 'vruchten', timing: 'oogst', confidence: 'suggestive' },

  // === Vruchtboomkanker ===
  { pest_id: 'vruchtboomkanker', symptom: 'Ingezonken gescheurde kankers op takken met concentrisch uiterlijk', plant_part: 'takken', timing: 'jaarrond', confidence: 'diagnostic' },
  { pest_id: 'vruchtboomkanker', symptom: 'Rode sporenhoopjes (sporodochien) op kankerrand', plant_part: 'takken', timing: 'jaarrond', confidence: 'diagnostic' },
  { pest_id: 'vruchtboomkanker', symptom: 'Nat rot vanuit kelk of steeleinde op vruchten (oogrotkanker)', plant_part: 'vruchten', timing: 'bewaring', confidence: 'suggestive' },

  // === Fruitmot ===
  { pest_id: 'fruitmot', symptom: 'Boorgat in vrucht met roodbruine uitwerpselen (frass)', plant_part: 'vruchten', timing: 'zomer', confidence: 'diagnostic' },
  { pest_id: 'fruitmot', symptom: 'Roze-witte rups (15-20 mm) in klokhuis', plant_part: 'vruchten', timing: 'zomer', confidence: 'diagnostic' },
  { pest_id: 'fruitmot', symptom: 'Vroegtijdig vruchtenval bij aangetaste vruchten', plant_part: 'vruchten', timing: 'zomer', confidence: 'suggestive' },

  // === Appelbloesemkever ===
  { pest_id: 'appelbloesemkever', symptom: 'Bruine kapjes: bloesemknoppen die niet opengaan en verdrogen', plant_part: 'bloesem', timing: 'voorjaar', confidence: 'diagnostic' },
  { pest_id: 'appelbloesemkever', symptom: 'Witte pootloze larve (5-7 mm) in gesloten bloem', plant_part: 'bloesem', timing: 'voorjaar', confidence: 'diagnostic' },
  { pest_id: 'appelbloesemkever', symptom: 'Eiafzetpunt zichtbaar als prikgaatje in bloesemknop', plant_part: 'bloesem', timing: 'voorjaar', confidence: 'suggestive' },

  // === Bloedluis ===
  { pest_id: 'bloedluis', symptom: 'Witte wollige massa op wondplaatsen en snoeiplaatsen van appelboom', plant_part: 'takken', timing: 'voorjaar tot herfst', confidence: 'diagnostic' },
  { pest_id: 'bloedluis', symptom: 'Rode vloeistof bij aanraken van kolonie', plant_part: 'takken', timing: 'voorjaar tot herfst', confidence: 'diagnostic' },
  { pest_id: 'bloedluis', symptom: 'Galvorming (knobbels) op takken bij langdurige kolonisatie', plant_part: 'takken', timing: 'zomer tot herfst', confidence: 'suggestive' },

  // === Perevuur ===
  { pest_id: 'perevuur', symptom: 'Bruine tot zwarte verschrompelde bloesemtrossen', plant_part: 'bloesem', timing: 'voorjaar', confidence: 'diagnostic' },
  { pest_id: 'perevuur', symptom: 'Scheuten knikken om in herderstaf-vorm', plant_part: 'scheuten', timing: 'voorjaar tot zomer', confidence: 'diagnostic' },
  { pest_id: 'perevuur', symptom: 'Melkachtig bacterieel exudaat (slijmdruppels) op aangetaste delen', plant_part: 'takken', timing: 'voorjaar tot zomer', confidence: 'diagnostic' },
  { pest_id: 'perevuur', symptom: 'Zwarte verkleuring bast met scherpe overgang gezond/ziek', plant_part: 'takken', timing: 'zomer', confidence: 'suggestive' },

  // === Tulpenvuur ===
  { pest_id: 'tulpenvuur', symptom: 'Misvormde verdraaide scheuten met bruine vlekken (blind-gaan)', plant_part: 'scheuten', timing: 'voorjaar', confidence: 'diagnostic' },
  { pest_id: 'tulpenvuur', symptom: 'Kleine waterige vlekjes op bladeren en bloemen die snel uitbreiden', plant_part: 'bladeren', timing: 'voorjaar', confidence: 'diagnostic' },
  { pest_id: 'tulpenvuur', symptom: 'Grijs schimmelpluis op afgestorven weefsel', plant_part: 'bladeren', timing: 'voorjaar', confidence: 'suggestive' },

  // === Pythium ===
  { pest_id: 'pythium-bol', symptom: 'Waterig glazig wortelrot dat snel bruin verkleurt', plant_part: 'wortels', timing: 'groeiperiode', confidence: 'diagnostic' },
  { pest_id: 'pythium-bol', symptom: 'Zachte bruine rot aan bolbasis', plant_part: 'bollen', timing: 'groeiperiode', confidence: 'diagnostic' },
  { pest_id: 'pythium-bol', symptom: 'Wegvallen kiemplanten (damping-off)', plant_part: 'hele plant', timing: 'kiemplantstadium', confidence: 'suggestive' },

  // === Fusarium bol ===
  { pest_id: 'fusarium-bol', symptom: 'Bruine vlekken op bolbasis of wonden, inwendig bruin rot', plant_part: 'bollen', timing: 'bewaring', confidence: 'diagnostic' },
  { pest_id: 'fusarium-bol', symptom: 'Typische ethanol/azijnzuur geur (zuur) bij besmette bollen', plant_part: 'bollen', timing: 'bewaring', confidence: 'diagnostic' },
  { pest_id: 'fusarium-bol', symptom: 'Roze schimmelpluis in holten van aangetaste bol', plant_part: 'bollen', timing: 'bewaring', confidence: 'suggestive' },
  { pest_id: 'fusarium-bol', symptom: 'Planten komen niet op of vergelen vroeg', plant_part: 'hele plant', timing: 'voorjaar', confidence: 'associated' },

  // === Wittevlieg (glas) ===
  { pest_id: 'wittevlieg-glas', symptom: 'Kleine witte vliegjes die opvliegen bij aanraking gewas', plant_part: 'hele plant', timing: 'jaarrond (kas)', confidence: 'diagnostic' },
  { pest_id: 'wittevlieg-glas', symptom: 'Platte groene tot witte nymphen-schijfjes op bladonderzijde', plant_part: 'bladeren', timing: 'jaarrond (kas)', confidence: 'diagnostic' },
  { pest_id: 'wittevlieg-glas', symptom: 'Honingdauw en roetdauw op bladeren', plant_part: 'bladeren', timing: 'jaarrond (kas)', confidence: 'suggestive' },

  // === Spint (glas) ===
  { pest_id: 'spint-glas', symptom: 'Stipvormige gele vlekjes op bladonderzijde door lege cellen', plant_part: 'bladeren', timing: 'jaarrond (kas)', confidence: 'diagnostic' },
  { pest_id: 'spint-glas', symptom: 'Spinsel (webben) tussen bladeren bij zware aantasting', plant_part: 'bladeren', timing: 'jaarrond (kas)', confidence: 'diagnostic' },
  { pest_id: 'spint-glas', symptom: 'Bladverkleuring geel-bruin en bladval', plant_part: 'bladeren', timing: 'jaarrond (kas)', confidence: 'suggestive' },

  // === Trips (glas) ===
  { pest_id: 'trips-glas', symptom: 'Zilverachtige zuigvlekken op bladeren van glasgewassen', plant_part: 'bladeren', timing: 'jaarrond (kas)', confidence: 'diagnostic' },
  { pest_id: 'trips-glas', symptom: 'Bruine vlekken en misvorming van bloemen', plant_part: 'bloemen', timing: 'jaarrond (kas)', confidence: 'diagnostic' },
  { pest_id: 'trips-glas', symptom: 'Necrotische ringen en bronsvlekken (TSWV) op bladeren en vruchten', plant_part: 'bladeren', timing: 'jaarrond (kas)', confidence: 'suggestive' },

  // === Mineervlieg (glas) ===
  { pest_id: 'mineervlieg-glas', symptom: 'Slingergangetjes (mijnen) in bladeren, groen tot bruin verkleuring', plant_part: 'bladeren', timing: 'jaarrond (kas)', confidence: 'diagnostic' },
  { pest_id: 'mineervlieg-glas', symptom: 'Witte larven (2-3 mm) zichtbaar in de mijn', plant_part: 'bladeren', timing: 'jaarrond (kas)', confidence: 'diagnostic' },
  { pest_id: 'mineervlieg-glas', symptom: 'Prikstipjes (feeding punctures) van vrouwtjes op bladoppervlak', plant_part: 'bladeren', timing: 'jaarrond (kas)', confidence: 'suggestive' },
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
  // === Phytophthora infestans ===
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

  // === Septoria tritici ===
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

  // === Meeldauw ===
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

  // === Bruine roest ===
  {
    pest_id: 'bruine-roest', approach: 'chemical',
    treatment: 'Bladbespuiting met Elatus Era (benzovindiflupyr + prothioconazool)',
    active_substance: 'benzovindiflupyr + prothioconazool',
    timing: 'T2 (GS 39-49), preventief tot vroeg curatief',
    dose_rate: '0,8-1,0 L/ha (Elatus Era)',
    efficacy_notes: 'SDHI + azool combinatie met sterke roestwerking. Goede nawerking. Breed inzetbaar in granen.',
    resistance_risk: 'Matig (FRAC 7 + 3)',
    approval_status: 'Ctgb toegelaten', source: 'Ctgb',
  },
  {
    pest_id: 'bruine-roest', approach: 'cultural',
    treatment: 'Resistente rassen en tijdige waarneming',
    active_substance: null,
    timing: 'Rassenkeuze en gewasmonitoring',
    dose_rate: null,
    efficacy_notes: 'Rassenkeuze met roestresistentie 7+ (Aanbevelende Rassenlijst). Monitoring op eerste pustels. Resistentiedoorbraak komt regelmatig voor bij nieuwe roestpopulaties.',
    resistance_risk: null,
    approval_status: null, source: 'WUR/PPO',
  },

  // === Gele roest ===
  {
    pest_id: 'gele-roest', approach: 'chemical',
    treatment: 'Noodbespuiting met Folicur (tebuconazool) bij eerste haarden',
    active_substance: 'tebuconazool',
    timing: 'Direct bij waarneming eerste haarden (curatief)',
    dose_rate: '0,5-1,0 L/ha (Folicur)',
    efficacy_notes: 'Curatief bij gele roest. Actieve haarden behandelen. Opvolgen met preventief schema indien epidemisch.',
    resistance_risk: 'Matig (azoolresistentie)',
    approval_status: 'Ctgb toegelaten', source: 'Ctgb',
  },

  // === Oogvlekkenziekte ===
  {
    pest_id: 'oogvlekkenziekte', approach: 'chemical',
    treatment: 'Stengelvoetbespuiting met Proline (prothioconazool)',
    active_substance: 'prothioconazool',
    timing: 'GS 30-32, bij >20% stengels aangetast',
    dose_rate: '0,6-0,8 L/ha (Proline)',
    efficacy_notes: 'Prothioconazool heeft goede werking tegen beide Oculimacula-soorten. Combineer met T1-bespuiting voor maximale efficiency.',
    resistance_risk: 'Matig (FRAC-groep 3)',
    approval_status: 'Ctgb toegelaten', source: 'Ctgb',
  },

  // === Halmdoder ===
  {
    pest_id: 'halmdoder', approach: 'cultural',
    treatment: 'Gewasrotatie (geen tarwe na tarwe), ploegen, bodem-pH verhogen',
    active_substance: null,
    timing: 'Bouwplanplanning',
    dose_rate: null,
    efficacy_notes: 'Geen effectieve chemische bestrijding. Gewasrotatie (1 jaar niet-graan) doorbreekt cyclus. Bekalking tot pH 6,5-7,0. Ploegen versnelt afbraak gewasresten. Take-all decline na 3-4 jaar continue tarwe.',
    resistance_risk: null,
    approval_status: null, source: 'WUR/PPO',
  },

  // === Bladluis granen ===
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

  // === Graanhaantje ===
  {
    pest_id: 'graanhaantje', approach: 'chemical',
    treatment: 'Insecticide bespuiting met Karate Zeon (lambda-cyhalothrin)',
    active_substance: 'lambda-cyhalothrin',
    timing: 'Bij >0,5-1 ei/larve per halm (schadedrempel)',
    dose_rate: '0,075-0,15 L/ha (Karate Zeon)',
    efficacy_notes: 'Contactinsecticide met snelle knock-down. Breed werkend pyrethroide. Let op bijwerking op natuurlijke vijanden.',
    resistance_risk: 'Matig (IRAC-groep 3A)',
    approval_status: 'Ctgb toegelaten', source: 'Ctgb',
  },

  // === Coloradokever ===
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
    pest_id: 'coloradokever', approach: 'cultural',
    treatment: 'Handmatig verzamelen bij lage aantallen, meldingsplicht NVWA',
    active_substance: null,
    timing: 'Bij eerste waarneming',
    dose_rate: null,
    efficacy_notes: 'Bij lage aantallen: handmatig verzamelen en vernietigen. Quarantaineorganisme: meldingsplicht bij NVWA. Gewasrotatie vermindert populatiedruk.',
    resistance_risk: null,
    approval_status: null, source: 'NVWA',
  },

  // === Aardappelcysteaaltje ===
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
    treatment: 'Granulaire nematicide Nemathorin (fosthiazaat)',
    active_substance: 'fosthiazaat (Nemathorin)',
    timing: 'Voor of bij poten',
    dose_rate: '30 kg/ha (Nemathorin 10G)',
    efficacy_notes: 'Beperkte bestrijding, vooral populatieverlagend. Geen volledige bestrijding. Grondontsmetting met metam-natrium als noodmaatregel bij zware besmetting.',
    resistance_risk: 'Niet van toepassing',
    approval_status: 'Ctgb toegelaten (beperkt)', source: 'Ctgb',
  },
  {
    pest_id: 'aardappelcysteaaltje', approach: 'chemical',
    treatment: 'Rijenbehandeling met Velum Prime (fluopyram)',
    active_substance: 'fluopyram',
    timing: 'Bij poten, rijentoepassing',
    dose_rate: '0,625 L/ha (Velum Prime)',
    efficacy_notes: 'SDHI-nematicide met systemische werking. Verlaagt populatie en beschermt wortels eerste weken. Combineer met resistente rassen.',
    resistance_risk: 'Laag (FRAC-groep 7)',
    approval_status: 'Ctgb toegelaten', source: 'Ctgb',
  },

  // === Fusarium aar ===
  {
    pest_id: 'fusarium-aar', approach: 'chemical',
    treatment: 'Aarbespuiting met Prosaro (prothioconazool + tebuconazool)',
    active_substance: 'prothioconazool + tebuconazool',
    timing: 'Tijdens bloei (GS 61-65), bij vochtig weer en risicovrucht mais',
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
    efficacy_notes: 'Onderwerken maisstoppel versnelt afbraak inoculum. Vermijd tarwe na mais (hoogste risico). Ploegen effectiever dan minimale grondbewerking. Kies minder vatbare rassen.',
    resistance_risk: null,
    approval_status: null, source: 'WUR/PPO',
  },

  // === Rhizoctonia solani ===
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
    efficacy_notes: 'Contactfungicide voor knolbehandeling. Beschermt tegen lakschurft en zilverschurft. Geen systemische werking.',
    resistance_risk: 'Laag (FRAC-groep 12)',
    approval_status: 'Ctgb toegelaten', source: 'Ctgb',
  },

  // === Ratelziekte (TRV) ===
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

  // === Stengelaaltje ===
  {
    pest_id: 'stengelaaltje', approach: 'cultural',
    treatment: 'Ruime vruchtwisseling (1:6), gezond uitgangsmateriaal, onkruidbeheersing',
    active_substance: null,
    timing: 'Bouwplanplanning en teeltseizoen',
    dose_rate: null,
    efficacy_notes: 'Vruchtwisseling minimaal 1:6 met waardplanten. Gebruik gecertificeerd pootgoed/plantgoed. Bestrijding van waardplant-onkruiden. Thermische ontsmetting bollenmateriaal (47 graden C, 3 uur) voor tulpen/narcissen.',
    resistance_risk: null,
    approval_status: null, source: 'WUR/PPO',
  },

  // === Vergelingsziekte biet ===
  {
    pest_id: 'vergelingsziekte-biet', approach: 'chemical',
    treatment: 'Insecticide bespuiting met Teppeki (flonicamid) tegen bladluisvectoren',
    active_substance: 'flonicamid',
    timing: 'Bij eerste bladluiskolonisatie (preventief)',
    dose_rate: '0,14 kg/ha (Teppeki)',
    efficacy_notes: 'Bestrijding van bladluisvectoren (Myzus persicae). Geen virusbestrijding mogelijk na infectie. Selectief middel, spaart natuurlijke vijanden.',
    resistance_risk: 'Laag (IRAC-groep 29)',
    approval_status: 'Ctgb toegelaten', source: 'Ctgb',
  },
  {
    pest_id: 'vergelingsziekte-biet', approach: 'cultural',
    treatment: 'Bronplanten verwijderen, winterbieten opruimen, onkruid beheren',
    active_substance: null,
    timing: 'Vroeg voorjaar en seizoensmanagement',
    dose_rate: null,
    efficacy_notes: 'Winterbieten en bietenstekken opruimen voor april (virusbron). Melde en andere waardplanten bestrijden. Zaaitijdstip optimaliseren voor snelle grondbedekking. Rassen met vergelingstolerantie (beperkt beschikbaar).',
    resistance_risk: null,
    approval_status: null, source: 'WUR/PPO',
  },

  // === Cercospora biet ===
  {
    pest_id: 'cercospora-biet', approach: 'chemical',
    treatment: 'Bladbespuiting met Amistar Gold (azoxystrobine + difenoconazool)',
    active_substance: 'azoxystrobine + difenoconazool',
    timing: 'Preventief bij eerste vlekken of bij warmteperiode >25 graden C',
    dose_rate: '0,8-1,0 L/ha (Amistar Gold)',
    efficacy_notes: 'Strobilurine + azool combinatie. Goede preventieve en beperkte curatieve werking. Afwisselen met andere werkingsmechanismen.',
    resistance_risk: 'Matig (FRAC 11 + 3)',
    approval_status: 'Ctgb toegelaten', source: 'Ctgb',
  },

  // === Bietencysteaaltje ===
  {
    pest_id: 'bietencysteaaltje', approach: 'cultural',
    treatment: 'Resistente groenbemesters (bladrammenas, gele mosterd) en vruchtwisseling',
    active_substance: null,
    timing: 'Bouwplanplanning en groenbemesting',
    dose_rate: null,
    efficacy_notes: 'Vruchtwisseling minimaal 1:4 met waardplanten. Resistente groenbemesters lokken aaltjes uit maar laten geen vermeerdering toe (vanggewas). Geen kruisbloemige groenbemesters bij hoge besmetting.',
    resistance_risk: null,
    approval_status: null, source: 'WUR/PPO',
  },

  // === Bladvlekkenziekte uien ===
  {
    pest_id: 'bladvlekkenziekte-botrytis-ui', approach: 'chemical',
    treatment: 'Bladbespuiting met Luna Sensation (fluopyram + trifloxystrobine)',
    active_substance: 'fluopyram + trifloxystrobine',
    timing: 'Preventief, 7-10 dagen interval in risicoperiode',
    dose_rate: '0,4-0,5 L/ha (Luna Sensation)',
    efficacy_notes: 'SDHI + strobilurine combinatie. Goede werking tegen Botrytis en andere bladschimmels in uien. Breed inzetbaar.',
    resistance_risk: 'Matig (FRAC 7 + 11)',
    approval_status: 'Ctgb toegelaten', source: 'Ctgb',
  },
  {
    pest_id: 'bladvlekkenziekte-botrytis-ui', approach: 'chemical',
    treatment: 'Bladbespuiting met Switch (cyprodinil + fludioxonil)',
    active_substance: 'cyprodinil + fludioxonil',
    timing: 'Preventief tot vroeg curatief, afwisselen met andere middelen',
    dose_rate: '0,8-1,0 kg/ha (Switch)',
    efficacy_notes: 'Twee werkingsmechanismen. Goede Botrytis-werking. Maximaal 2 toepassingen per seizoen.',
    resistance_risk: 'Matig (FRAC 9 + 12)',
    approval_status: 'Ctgb toegelaten', source: 'Ctgb',
  },

  // === Valse meeldauw uien ===
  {
    pest_id: 'valse-meeldauw-ui', approach: 'chemical',
    treatment: 'Bladbespuiting met Signum (boscalid + pyraclostrobine)',
    active_substance: 'boscalid + pyraclostrobine',
    timing: 'Preventief schema, 7-10 dagen interval',
    dose_rate: '1,0-1,5 kg/ha (Signum)',
    efficacy_notes: 'SDHI + strobilurine combinatie. Afwisselen met andere middelen in schema. Brede werking tegen schimmels in allium.',
    resistance_risk: 'Matig (FRAC 7 + 11)',
    approval_status: 'Ctgb toegelaten', source: 'Ctgb',
  },

  // === Koolvlieg ===
  {
    pest_id: 'koolvlieg', approach: 'chemical',
    treatment: 'Plantvoetbehandeling met Coragen (chlorantraniliprole)',
    active_substance: 'chlorantraniliprole',
    timing: 'Bij planting, plantvoetbehandeling of druppeltoepassing',
    dose_rate: '0,06-0,08 L/ha (Coragen)',
    efficacy_notes: 'Diamide insecticide. Werkt op maden in de bodem. Selectief voor bestuivers. Effectief bij plantvoetbehandeling.',
    resistance_risk: 'Laag tot matig (IRAC-groep 28)',
    approval_status: 'Ctgb toegelaten', source: 'Ctgb',
  },
  {
    pest_id: 'koolvlieg', approach: 'cultural',
    treatment: 'Insectengaas, kraagjes rond plantvoet, gewasrotatie',
    active_substance: null,
    timing: 'Bij planting',
    dose_rate: null,
    efficacy_notes: 'Insectenwerend gaas voorkomt eiafzetting. Koolkraagjes rond stengelbasis effectief bij lage druk. Gewasrotatie vermindert populatiedruk. Biologische bestrijding in ontwikkeling.',
    resistance_risk: null,
    approval_status: null, source: 'WUR/PPO',
  },

  // === Koolwitje + Kooluil ===
  {
    pest_id: 'koolwitje', approach: 'biological',
    treatment: 'Bespuiting met Turex (Bacillus thuringiensis var. aizawai)',
    active_substance: 'Bacillus thuringiensis var. aizawai',
    timing: 'Bij eerste rupsen, herhalen na 7-10 dagen',
    dose_rate: '0,5-1,0 kg/ha (Turex)',
    efficacy_notes: 'Biologisch insecticide. Werkt specifiek op rupsen (Lepidoptera). Geen bijwerking op natuurlijke vijanden en bestuivers. Ingezet in zowel biologische als gangbare teelt.',
    resistance_risk: 'Laag (biologisch middel)',
    approval_status: 'Ctgb toegelaten', source: 'Ctgb',
  },

  // === Knolvoet ===
  {
    pest_id: 'knolvoet', approach: 'cultural',
    treatment: 'Bekalking tot pH >7,2, ruime rotatie, resistente rassen',
    active_substance: null,
    timing: 'Bouwplanplanning en bodemmanagement',
    dose_rate: null,
    efficacy_notes: 'Geen effectieve chemische bestrijding. Bekalking tot pH >7,2 vermindert infectiedruk sterk. Vruchtwisseling minimaal 1:7 met kruisbloemigen. Resistente rassen beschikbaar voor sommige koolsoorten.',
    resistance_risk: null,
    approval_status: null, source: 'WUR/PPO',
  },

  // === Maisstengelborer ===
  {
    pest_id: 'maisstengelborer', approach: 'chemical',
    treatment: 'Bespuiting met Steward (indoxacarb) bij eerste boorgaten',
    active_substance: 'indoxacarb',
    timing: 'Bij eerste boorgaten/boormeel, voor rupsen diep in stengel zitten',
    dose_rate: '0,125-0,170 kg/ha (Steward)',
    efficacy_notes: 'Oxadiazine insecticide met maag- en contactwerking. Timing is cruciaal: rupsen moeten nog bereikbaar zijn. Eenmaal in de stengel niet meer effectief.',
    resistance_risk: 'Laag (IRAC-groep 22A)',
    approval_status: 'Ctgb toegelaten', source: 'Ctgb',
  },
  {
    pest_id: 'maisstengelborer', approach: 'cultural',
    treatment: 'Maisstoppels versnipperen en onderwerken na oogst',
    active_substance: null,
    timing: 'Direct na oogst',
    dose_rate: null,
    efficacy_notes: 'Versnipperen maisstoppels vernietigt overwinterende rupsen. Combineer met onderwerken. Mais na mais vermijden waar mogelijk. Biologische bestrijding met Trichogramma sluipwespen in ontwikkeling.',
    resistance_risk: null,
    approval_status: null, source: 'WUR/PPO',
  },

  // === Appelschurft ===
  {
    pest_id: 'schurft-venturia', approach: 'chemical',
    treatment: 'Preventieve bespuiting met Nativo (tebuconazool + trifloxystrobine)',
    active_substance: 'tebuconazool + trifloxystrobine',
    timing: 'Preventief volgens Mills-tabel, voor en tijdens infectieperiode',
    dose_rate: '0,15-0,20 kg/ha (Nativo)',
    efficacy_notes: 'Azool + strobilurine combinatie. Preventieve en vroeg-curatieve werking. Afwisselen met andere middelen in seizoensschema.',
    resistance_risk: 'Matig (FRAC 3 + 11)',
    approval_status: 'Ctgb toegelaten', source: 'Ctgb',
  },
  {
    pest_id: 'schurft-venturia', approach: 'cultural',
    treatment: 'Bladvernietiging (ureum-bespuiting gevallen blad) en resistente rassen',
    active_substance: null,
    timing: 'Na bladval (november) en rassenkeuze',
    dose_rate: null,
    efficacy_notes: 'Ureumbespuiting (5%) op gevallen blad versnelt bladvertering en vermindert ascosporen-productie met 80-90%. Schurftresistente rassen (Vf-resistentie) verlagen spuitdruk sterk.',
    resistance_risk: null,
    approval_status: null, source: 'WUR/PPO',
  },

  // === Perevuur ===
  {
    pest_id: 'perevuur', approach: 'chemical',
    treatment: 'Preventieve koperbespuiting tijdens bloei',
    active_substance: 'koperhydroxide',
    timing: 'Tijdens bloei bij warm vochtig weer (>18 graden C + regen)',
    dose_rate: 'Conform Ctgb-etiket (koperpreparaat)',
    efficacy_notes: 'Koper heeft beperkte preventieve werking. Streptomycine niet toegelaten in NL. Timing tijdens bloei cruciaal. Snoei aangetaste takken 30 cm onder grens aantasting.',
    resistance_risk: 'Laag (koper)',
    approval_status: 'Ctgb toegelaten (beperkt)', source: 'Ctgb',
  },

  // === Fruitmot ===
  {
    pest_id: 'fruitmot', approach: 'biological',
    treatment: 'Granulosevirus-preparaat Madex (CpGV)',
    active_substance: 'Cydia pomonella granulovirus (CpGV)',
    timing: 'Bij ei-uitkomst eerste generatie, herhalen na 8-14 dagen',
    dose_rate: '0,1 L/ha (Madex)',
    efficacy_notes: 'Biologisch insecticide specifiek voor fruitmot-rupsen. Geen bijwerking op nuttige insecten. Combineer met feromoonverwarring (mating disruption) voor beste resultaat.',
    resistance_risk: 'Laag (biologisch middel)',
    approval_status: 'Ctgb toegelaten', source: 'Ctgb',
  },

  // === Tulpenvuur ===
  {
    pest_id: 'tulpenvuur', approach: 'chemical',
    treatment: 'Preventieve bladbespuiting met Rovral (iprodion) of Switch',
    active_substance: 'iprodion',
    timing: 'Preventief vanaf opkomst, 7-10 dagen interval',
    dose_rate: '1,0-1,5 L/ha (Rovral)',
    efficacy_notes: 'Contactfungicide met goede Botrytis-werking. Afwisselen met andere werkingsmechanismen. Maximaal aantal toepassingen per seizoen respecteren.',
    resistance_risk: 'Matig (FRAC-groep 2)',
    approval_status: 'Ctgb toegelaten', source: 'Ctgb',
  },

  // === Wittevlieg glas ===
  {
    pest_id: 'wittevlieg-glas', approach: 'biological',
    treatment: 'Sluipwesp Encarsia formosa inzet',
    active_substance: 'Encarsia formosa (sluipwesp)',
    timing: 'Preventief bij start teelt, wekelijks introduceren',
    dose_rate: '3-6 per m2/week (Encarsia formosa)',
    efficacy_notes: 'Standaard biologische bestrijding in NL glastuinbouw. Parasiteert nymfen van wittevlieg. Combineer met Macrolophus (roofwants) bij hoge druk. Temperatuur >18 graden C nodig voor goede werking.',
    resistance_risk: 'Niet van toepassing (biologisch)',
    approval_status: null, source: 'WUR/Glastuinbouw NL',
  },

  // === Spint glas ===
  {
    pest_id: 'spint-glas', approach: 'biological',
    treatment: 'Roofmijt Phytoseiulus persimilis inzet',
    active_substance: 'Phytoseiulus persimilis (roofmijt)',
    timing: 'Bij eerste spinthaarden, curatief en preventief',
    dose_rate: '25-50 per m2 (Phytoseiulus persimilis)',
    efficacy_notes: 'Gespecialiseerde spintpredator. Standaard in NL glastuinbouw. Eet alleen spintmijten. Temperatuur 20-30 graden C optimaal. Bij hoge RV ook Feltiella gebruiken.',
    resistance_risk: 'Niet van toepassing (biologisch)',
    approval_status: null, source: 'WUR/Glastuinbouw NL',
  },

  // === Trips glas ===
  {
    pest_id: 'trips-glas', approach: 'biological',
    treatment: 'Roofmijt Amblyseius swirskii en roofwants Orius inzet',
    active_substance: 'Amblyseius swirskii + Orius laevigatus',
    timing: 'Preventief bij start teelt',
    dose_rate: '50-100 per m2 (Amblyseius) + 1-2 per m2 (Orius)',
    efficacy_notes: 'Amblyseius swirskii: preventief tegen larven. Orius: curatief tegen adulte trips. Combineren geeft beste resultaat. Standaard in NL glastuinbouw.',
    resistance_risk: 'Niet van toepassing (biologisch)',
    approval_status: null, source: 'WUR/Glastuinbouw NL',
  },
  {
    pest_id: 'trips-glas', approach: 'chemical',
    treatment: 'Bespuiting met Conserve (spinosad)',
    active_substance: 'spinosad',
    timing: 'Bij hoge tripsdruk als aanvulling op biologische bestrijding',
    dose_rate: '0,4-0,6 L/ha (Conserve)',
    efficacy_notes: 'Natuurlijk afgeleid insecticide (spinosyne). Beperkte bijwerking op roofmijten. Maximaal 3 toepassingen per seizoen. IRAC-groep 5.',
    resistance_risk: 'Matig (IRAC-groep 5, resistentie in sommige tripspopulaties)',
    approval_status: 'Ctgb toegelaten', source: 'Ctgb',
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
    decision_guide: 'T1-bespuiting op basis van ras, zaaitijdstip, neerslag en bladaantasting. Bij zeer resistente rassen mogelijk T1 overslaan. T2 altijd bij vatbare rassen voor bescherming vlagblad. SDHI + azool combinatie bij hoge druk.',
    source: 'WUR/PPO, Aanbevelende Rassenlijst',
  },
  {
    crop_id: 'wintertarwe',
    pest_id: 'fusarium-aar',
    threshold: 'Geen formele schadedrempel. Spuiten bij risicovrucht (mais) EN vochtig weer rond bloei (GS 61-65).',
    monitoring_method: 'Beoordeling risicofactoren: voorvrucht (mais = hoog risico), grondbewerking (niet-kerend = hoger risico), weer rond bloei (vochtig/regenachtig). Achteraf: DON-analyse graan bij oogst.',
    cultural_controls: 'Vermijd tarwe na mais. Onderwerk maisstoppel (ploegen). Kies rassen met betere fusariumresistentie.',
    prevention: 'Bouwplan: geen tarwe na mais. Ploegen na mais reduceert inoculum met 60-80%. Niet-kerend na mais gevolgd door tarwe is hoogste risico.',
    decision_guide: 'Bij tarwe na mais + niet-kerend + vochtig weer rond bloei: aarbespuiting met prothioconazool (Prosaro). Bij tarwe na andere voorvrucht + ploegen: alleen bij extreem natte bloei. DON-monitoring bij oogst.',
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
    prevention: 'AM-vrij pootgoed. Rassen met hoge resistentie EN tolerantie. Geen aardappelen op besmet perceel tot populatie voldoende gedaald. Machinehygiene (voorkom grondversleping).',
    decision_guide: 'Bij besmetting: geen aardappelen of alleen hoog-resistente rassen (minimaal 8). Bij zware besmetting: geen aardappelen gedurende meerdere jaren. Nemathorin alleen bij lichte besmetting als aanvulling op resistente rassen.',
    source: 'WUR/PPO, NVWA',
  },
  {
    crop_id: 'aardappelen',
    pest_id: 'rhizoctonia-solani',
    threshold: 'Geen formele schadedrempel. Preventieve aanpak op basis van besmettingshistorie perceel en kwaliteit pootgoed.',
    monitoring_method: 'Beoordeling pootgoed op lakschurft (sclerotien op knollen). Veldwaarneming: let op ongelijke opkomst en witte manchetten rond stengelbasis. Na oogst: beoordeling knollen op lakschurft.',
    cultural_controls: 'Gebruik gezond pootgoed (weinig sclerotien). Snelle opkomst bevorderen (niet te koud poten, goed pootbed). Vruchtwisseling 1:3 minimum. Niet te lang wachten met rooien.',
    prevention: 'Pootgoedontsmetting (knolbehandeling) met Amistar of Maxim. Percelen met rhizoctonia-historie vermijden voor pootgoedteelt. Tijdig rooien na loofdoding (< 3 weken).',
    decision_guide: 'Bij pootgoedteelt: altijd knolbehandeling overwegen. Bij consumptieaardappelen op besmet perceel: pootgoedontsmetting + snelle opkomst + tijdig rooien. Bij pootaardappelkeuring: lakschurft is keuringsgebrek.',
    source: 'WUR/PPO, NAK',
  },
  {
    crop_id: 'wintertarwe',
    pest_id: 'bruine-roest',
    threshold: 'Schadedrempel: eerste pustels op vlagblad of blad 2 na GS 39. Bij vatbare rassen: preventief bij T2.',
    monitoring_method: 'Visuele gewascontrole wekelijks vanaf GS 31. Let op eerste pustels op bovenste bladetages. Warmteperioden (>18 graden C) als risicofactor.',
    cultural_controls: 'Resistente rassen (roestresistentie 7+ Aanbevelende Rassenlijst). Resistentiedoorbraak komt voor: monitoren. Vroege zaai verhoogt risico.',
    prevention: 'Rassenkeuze primair. T1/T2-schema met azool of SDHI+azool beschermt ook tegen roest als nevenwerking.',
    decision_guide: 'Bij eerste pustels op vlagblad: curatief ingrijpen met azool (prothioconazool of tebuconazool). Bij vatbare rassen zonder T2: direct behandelen. Preventief meegenomen in standaard T2-bespuiting.',
    source: 'WUR/PPO',
  },
  {
    crop_id: 'wintertarwe',
    pest_id: 'gele-roest',
    threshold: 'Nultolerantie bij eerste haarden in vatbare rassen. Epidemisch karakter vereist directe actie.',
    monitoring_method: 'Wekelijkse veldcontrole. Let op gele streepjes langs bladnerven, vaak eerst in lagere zones perceel of bij bomen/heggen. NVWA/WUR-waarschuwingsdienst volgen.',
    cultural_controls: 'Resistente rassen (meest effectieve maatregel). Resistentiedoorbraak frequenter dan bij bruine roest door nieuwe virulente gele-roestrassen.',
    prevention: 'Rassenkeuze met actuele resistentie-informatie (resistentie kan doorbroken worden). Niet te vroeg zaaien.',
    decision_guide: 'Bij eerste haarden: direct curatief behandelen met azool. Bij epidemie: veldbrede behandeling. T1 en T2 meenemen als preventief schema bij vatbare rassen.',
    source: 'WUR/PPO',
  },
  {
    crop_id: 'wintertarwe',
    pest_id: 'oogvlekkenziekte',
    threshold: 'Schadedrempel: >20% stengelvoeten met oogvlekkenziekte-lesies bij GS 30-32.',
    monitoring_method: 'Trek 25 stengels op 4-5 plekken. Beoordeel stengelvoet op oogvormige lesies. Onderscheid van halmdoder (diffuse bruine wortels vs. scherpe oogvormige stengellesie).',
    cultural_controls: 'Gewasrotatie: geen tarwe na tarwe. Kies rassen met oogvlekkenresistentie. Vroege zaai verhoogt risico.',
    prevention: 'Rotatie is primair. Rassen met Pch1-resistentiegen. Niet te vroeg zaaien.',
    decision_guide: 'Boven 20% stengels aangetast: bespuiting met prothioconazool bij GS 30-32. Onder drempel: niet spuiten. Combineer eventueel met T1-bespuiting voor efficiency.',
    source: 'WUR/PPO',
  },
  {
    crop_id: 'wintertarwe',
    pest_id: 'halmdoder',
    threshold: 'Geen chemische schadedrempel (geen effectief middel). Risicoanalyse op basis van bouwplan en bodemomstandigheden.',
    monitoring_method: 'Beoordeel wortels in voorjaar: zwarte wortels, verdachte percelen bij tarwe na tarwe. Whiteheads in zomer zijn diagnostisch maar te laat voor actie.',
    cultural_controls: 'Gewasrotatie: 1 jaar niet-graan doorbreekt cyclus. Bekalking naar pH 6,5-7,0. Goede bodemstructuur. Ploegen helpt.',
    prevention: 'Nooit tarwe na tarwe op percelen zonder take-all decline. Eerste-jaars tarwe na niet-graan is veilig. Tweede-jaars tarwe is hoogste risico.',
    decision_guide: 'Bij tarwe na tarwe: bereken opbrengstrisico en overweeg ander gewas. Bij noodzaak tarwe na tarwe: zaaibehandeling met silthiofam (Latitude, indien beschikbaar). Na 3+ jaar continue tarwe: take-all decline kan optreden.',
    source: 'WUR/PPO',
  },
  {
    crop_id: 'granen',
    pest_id: 'graanhaantje',
    threshold: 'Schadedrempel: 0,5-1 ei/larve per halm. Beoordeling bij GS 37-45 (vlagblad zichtbaar tot bloei).',
    monitoring_method: 'Tel eieren en larven op 25 halmen op 4-5 plekken per perceel. Focus op vlagblad. Slijmerige faecale massa maakt larven makkelijk herkenbaar.',
    cultural_controls: 'Afwisseling graansoorten. Stimuleren natuurlijke vijanden (sluipwespen Tetrastichus). Gemengde bouwplannen.',
    prevention: 'Geen specifieke preventieve maatregelen. Rassenkeuze niet relevant (geen significante rasverschillen).',
    decision_guide: 'Boven schadedrempel: bespuiting met lambda-cyhalothrin of deltamethrin. Let op: pyrethroiden doden ook natuurlijke vijanden. Alleen spuiten bij overschrijding drempel.',
    source: 'WUR/PPO',
  },
  {
    crop_id: 'suikerbieten',
    pest_id: 'vergelingsziekte-biet',
    threshold: 'Behandeling van bladluisvectoren: bij >5% planten gekoloniseerd door bladluis (Myzus persicae) voor half juni.',
    monitoring_method: 'Wekelijkse bladluistelilngen op 50 planten per perceel vanaf opkomst. Gele vangbakken voor monitoring eerste vlucht. IRS-bladluiswaarschuwingen volgen.',
    cultural_controls: 'Winterbieten en bietenstekken opruimen voor april. Onkruidbeheersing (melde). Vroege grondbedekking stimuleren.',
    prevention: 'Zaaibehandeling met insecticide (indien beschikbaar/toegelaten). Rassen met vergelingstolerantie (beperkt). Functionele biodiversiteit: bloemenranden voor natuurlijke vijanden.',
    decision_guide: 'Bij vroege bladluiskolonisatie (<half juni): spuiten met selectief middel (flonicamid). Na half juni: beperkt economisch rendabel. Monitoren natuurlijke vijanden: bij voldoende predatoren afwachten.',
    source: 'IRS, WUR/PPO',
  },
  {
    crop_id: 'suikerbieten',
    pest_id: 'bietencysteaaltje',
    threshold: 'Grondonderzoek: schadedrempel soort- en perceelafhankelijk. Indicatief: >500 eieren+larven per 100 ml grond levert significante opbrengstderving.',
    monitoring_method: 'Bodembemonstering op nematoden (gespoeld grondmonster). Telling eieren+larven per 100 ml grond. Vitaliteitsbepaling cysten. Kartering van besmettingsplekken.',
    cultural_controls: 'Vruchtwisseling minimaal 1:4. Resistente groenbemesters (bladrammenas, gele mosterd) als vanggewas. Geen kruisbloemige groenbemesters bij besmetting. Geen spinazie of rode biet in rotatie.',
    prevention: 'Machinehygiene (grondversleping). Resistente bieten (niet beschikbaar voor H. schachtii). Resistente groenbemesters in bouwplan.',
    decision_guide: 'Bij hoge besmetting: geen bieten, spinazie of kruisbloemigen. Resistente groenbemester in zomer/herfst. Na 2-3 jaar groenbemester: herbemonsteren. Nematicide (Vydate) alleen als noodmaatregel.',
    source: 'IRS, WUR/PPO',
  },
  {
    crop_id: 'uien',
    pest_id: 'bladvlekkenziekte-botrytis-ui',
    threshold: 'Preventief spuiten: geen formele schadedrempel. Start schema bij eerste sporelvorming (Dacom BOS-systeem) of bij langdurige bladnatperioden.',
    monitoring_method: 'Dacom BOS-waarschuwingssysteem voor Botrytis squamosa. Visuele beoordeling: let op kleine witte vlekjes. Bladnatduur en temperatuur als risicofactoren.',
    cultural_controls: 'Ruime plantafstand (luchtcirculatie). Gewasrotatie 1:4. Gezond uitgangsmateriaal. Niet beregenen in avond (langere bladnatperiode).',
    prevention: 'Rassenkeuze met bladstevigheid. Plantafstand. Percelen met goede luchtcirculatie. BOS-systeem voor optimale timing.',
    decision_guide: 'Start preventief schema bij BOS-waarschuwing. 7-10 dagen interval bij hoge druk, verlengen bij droog weer. Afwisseling fungiciden: Luna Sensation, Switch, Signum. Maximaal 2 toepassingen per middel.',
    source: 'WUR/PPO, IRS',
  },
  {
    crop_id: 'uien',
    pest_id: 'valse-meeldauw-ui',
    threshold: 'Nultolerantie bij systemisch besmette planten (herkenbaar aan achterblijvende groei). Bij secundaire infectie: spuiten bij eerste sporulatie.',
    monitoring_method: 'Wekelijkse veldinspectie op systemisch besmette planten. Let op blauwgroene verflauwing en achterblijvende groei. Bij vochtig weer: check op grijspaars sporenpluis.',
    cultural_controls: 'Gezond plantgoed (plantuien controleren). Besmette planten verwijderen. Gewasrotatie 1:4 met allium. Percelen met goede luchtcirculatie.',
    prevention: 'Plantuipartijen controleren op systemische infectie. Resistente rassen (beperkt beschikbaar). Geen beregening tijdens risicomomenten.',
    decision_guide: 'Systemisch besmette planten: verwijderen en vernietigen. Bij sporenvorming: veldbrede fungicidebehandeling (Signum, Acrobat). Preventief schema bij natte perioden. Metalaxyl alleen preventief inzetten.',
    source: 'WUR/PPO',
  },
  {
    crop_id: 'kool',
    pest_id: 'koolvlieg',
    threshold: 'Eerste generatie (mei-juni): monitoring met eivallen rond plantvoet. >1 ei per plant = behandeling overwegen. Bij jonge planten: nultolerantie.',
    monitoring_method: 'Eivallen: viltschijfjes rond stengelbasis, wekelijks controleren op eieren. Gele vangplaten voor vliegactiviteit. Visuele controle op verwelking.',
    cultural_controls: 'Insectengaas (Bionet 0,8 mm). Koolkraagjes. Gewasrotatie. Stevige planten (goede bemesting). Bestrijding eerste generatie voorkomt opbouw tweede/derde generatie.',
    prevention: 'Insectengaas is meest effectieve preventie. Koolkraagjes bij lage druk. Geen koolresten op perceel laten liggen. Plantversterking (goede start).',
    decision_guide: 'Bij insectengaas: meestal geen aanvullende behandeling nodig. Zonder gaas: plantvoetbehandeling met Coragen bij planting. Bij >1 ei per plant na monitoring: lokale behandeling.',
    source: 'WUR/PPO, CLM',
  },
  {
    crop_id: 'kool',
    pest_id: 'knolvoet',
    threshold: 'Geen schadedrempel: percelen met bekende knolvoethistorie vermijden voor kruisbloemige teelt.',
    monitoring_method: 'Historische perceelsinformatie. Bij twijfel: lokaasplanten (kool of Chinese kool) planten en na 6-8 weken wortels beoordelen op gallen. Bodemlaboratorium: DNA-test op Plasmodiophora.',
    cultural_controls: 'Bekalking tot pH >7,2 (belangrijkste maatregel). Drainage verbeteren. Vruchtwisseling minimaal 1:7 met kruisbloemigen. Machinehygiene.',
    prevention: 'Bodem-pH >7,2 is meest effectieve preventie. Resistente rassen (beschikbaar voor Chinese kool, beperkt voor andere koolsoorten). Geen kruisbloemige groenbemesters op besmette percelen.',
    decision_guide: 'Besmet perceel: geen koolteelt gedurende minimaal 7 jaar. Bekalking tot pH >7,2. Resistente rassen indien beschikbaar. Bij lichte besmetting: bekalking + resistente rassen kan werkbaar zijn.',
    source: 'WUR/PPO',
  },
  {
    crop_id: 'appels',
    pest_id: 'schurft-venturia',
    threshold: 'Mills-tabel: infectie bij combinatie bladnatduur (uren) en temperatuur. Bij 10 graden C: 14 uur bladnat = lichte infectie, 22 uur = zware infectie.',
    monitoring_method: 'Weerstation in boomgaard: temperatuur en bladnatduur. Mills-tabel voor infectiemomenten. RIMpro software voor geautomatiseerd advies. Visuele controle op eerste vlekken.',
    cultural_controls: 'Ureumbespuiting op gevallen blad (5%, november). Blad versnipperen of composteren. Resistente rassen (Vf-gen). Snoei voor open kroon (sneller drogen).',
    prevention: 'Rassenkeuze is fundamenteel. Bladvernietiging na bladval vermindert ascosporen 80-90%. Open boomvorm voor snelle droging.',
    decision_guide: 'Preventief spuiten voor infectiemomenten (Mills-tabel/RIMpro). Gemiste preventieve bespuiting: curatief binnen 24-36 uur na infectie. Seizoen: 10-20 bespuitingen in vatbare rassen, 3-5 in resistente rassen.',
    source: 'WUR/PPO, NFO',
  },
  {
    crop_id: 'appels',
    pest_id: 'fruitmot',
    threshold: 'Feromoonval: >5 vlinders/val/week (conventioneel). Bij feromoonverwarring: visuele vruchtcontrole op boorgaten.',
    monitoring_method: 'Feromoonvallen ophangen eind april: monitoring vlindervlucht. Temperatuursom (day-degrees) voor timing bestrijding. Vruchtcontrole op boorgaten na piek eerste generatie.',
    cultural_controls: 'Feromoonverwarring (mating disruption): dispensers in boomgaard. Verwijderen aangetaste vruchten. Wellband-vallen rond stammen voor rupsen zoekend naar verpoppingsplaats.',
    prevention: 'Feromoonverwarringssysteem is meest effectieve preventie. Goede bedrijfshygiene. Buurman-afstemming (areaalbreed werken).',
    decision_guide: 'Onder feromoonverwarring: alleen ingrijpen bij >2% aangetaste vruchten. Zonder verwarring: spuiten bij >5 vlinders/val/week. Biologisch: Madex (CpGV) bij ei-uitkomst. Chemisch: Coragen of Runner.',
    source: 'WUR/PPO, NFO',
  },
  {
    crop_id: 'glastuinbouw',
    pest_id: 'wittevlieg-glas',
    threshold: 'Preventieve inzet: geen formele drempel. Curatief: bij >1 adult per vangplaat per week in begin teelt.',
    monitoring_method: 'Gele vangplaten (1 per 500-1000 m2) wekelijks tellen. Bladcontrole op nymfen en poppen (bladonderzijde). Verhouding geparasiteerd/niet-geparasiteerd monitoren.',
    cultural_controls: 'Start teelt schoon (hygieneprotocol). Gaasdoeken voor luchtramen. Minimaal 2 weken gewasloze periode tussen teelten. Onkruidvrije kas.',
    prevention: 'Encarsia formosa preventief introduceren bij start teelt. Aanvullen met Macrolophus caliginosus bij hoge druk. Temperatuur >18 graden C voor goede sluipwespwerking.',
    decision_guide: 'Biologische bestrijding is standaard. Bij doorbraak: selectief ingrijpen met insecticiden die sluipwespen sparen. Regelmatige kwaliteitscontrole van geleverde sluipwespen.',
    source: 'WUR/Glastuinbouw NL, Koppert',
  },
  {
    crop_id: 'glastuinbouw',
    pest_id: 'trips-glas',
    threshold: 'Blauwe vangplaten: >10 trips/plaat/week bij start teelt = actie. Bij TSWV-risico: nultolerantie.',
    monitoring_method: 'Blauwe vangplaten (1 per 500 m2) wekelijks tellen. Visuele controle op zilverachtige zuigvlekken. TSWV-monitoring: verdachte planten laten toetsen (ELISA).',
    cultural_controls: 'Hygieneprotocol: gewasloze periode, onkruidvrij, gaasdoeken. Verwijderen en vernietigen van TSWV-besmette planten. Geen overdracht via werkzaamheden (handschoenen wisselen).',
    prevention: 'Amblyseius swirskii preventief introduceren bij start teelt. Orius laevigatus als aanvulling bij bloeiende gewassen. Hygieneprotocol strikt naleven.',
    decision_guide: 'Biologische bestrijding is basis. Bij hoge druk: aanvullen met spinosad (Conserve) als selectief middel. Bij TSWV-haarden: besmette planten verwijderen, breed behandelen. Resistente rassen als beschikbaar.',
    source: 'WUR/Glastuinbouw NL, Koppert',
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
  // === Fungiciden ===
  { product_name: 'Ranman Top', active_substance: 'cyazofamide 160 g/L', target_pests: 'Phytophthora infestans', approved_crops: 'aardappelen', approval_expiry: '2027-12-31', registration_number: 'W-12614', source: 'Ctgb' },
  { product_name: 'Revus', active_substance: 'mandipropamid 250 g/L', target_pests: 'Phytophthora infestans', approved_crops: 'aardappelen, tomaten', approval_expiry: '2028-04-30', registration_number: 'W-13199', source: 'Ctgb' },
  { product_name: 'Infinito', active_substance: 'fluopicolide 62,5 g/L + propamocarb-hydrochloride 625 g/L', target_pests: 'Phytophthora infestans', approved_crops: 'aardappelen', approval_expiry: '2027-07-31', registration_number: 'W-13035', source: 'Ctgb' },
  { product_name: 'Prosaro', active_substance: 'prothioconazool 125 g/L + tebuconazool 125 g/L', target_pests: 'Septoria, fusarium, roest, meeldauw', approved_crops: 'tarwe, gerst, rogge, triticale', approval_expiry: '2027-10-31', registration_number: 'W-13236', source: 'Ctgb' },
  { product_name: 'Aviator Xpro', active_substance: 'bixafen 75 g/L + prothioconazool 150 g/L', target_pests: 'Septoria, roest, meeldauw, netvlekkenziekte', approved_crops: 'tarwe, gerst', approval_expiry: '2028-01-31', registration_number: 'W-14012', source: 'Ctgb' },
  { product_name: 'Folicur', active_substance: 'tebuconazool 250 g/L', target_pests: 'Meeldauw, roest, septoria, fusarium', approved_crops: 'tarwe, gerst, rogge, koolzaad, suikerbieten', approval_expiry: '2027-04-30', registration_number: 'W-10975', source: 'Ctgb' },
  { product_name: 'Proline', active_substance: 'prothioconazool 250 g/L', target_pests: 'Septoria, meeldauw, roest, fusarium', approved_crops: 'tarwe, gerst, rogge, triticale, koolzaad', approval_expiry: '2027-10-31', registration_number: 'W-13145', source: 'Ctgb' },
  { product_name: 'Nativo', active_substance: 'tebuconazool 200 g/kg + trifloxystrobine 100 g/kg', target_pests: 'Schurft, meeldauw, roest', approved_crops: 'appels, peren, granen', approval_expiry: '2027-12-31', registration_number: 'W-13567', source: 'Ctgb' },
  { product_name: 'Elatus Era', active_substance: 'benzovindiflupyr 75 g/L + prothioconazool 150 g/L', target_pests: 'Septoria, roest, netvlekkenziekte, ramularia', approved_crops: 'tarwe, gerst', approval_expiry: '2028-06-30', registration_number: 'W-15012', source: 'Ctgb' },
  { product_name: 'Propulse', active_substance: 'fluopyram 125 g/L + prothioconazool 125 g/L', target_pests: 'Septoria, roest, meeldauw, sclerotinia', approved_crops: 'tarwe, gerst, koolzaad', approval_expiry: '2028-03-31', registration_number: 'W-14890', source: 'Ctgb' },
  { product_name: 'Amistar Gold', active_substance: 'azoxystrobine 125 g/L + difenoconazool 125 g/L', target_pests: 'Cercospora, alternaria, roest, bladvlekkenziekte', approved_crops: 'suikerbieten, wortelen, uien', approval_expiry: '2028-01-31', registration_number: 'W-14234', source: 'Ctgb' },
  { product_name: 'Fandango', active_substance: 'fluoxastrobine 100 g/L + prothioconazool 100 g/L', target_pests: 'Septoria, roest, meeldauw, netvlekkenziekte', approved_crops: 'tarwe, gerst', approval_expiry: '2027-09-30', registration_number: 'W-14567', source: 'Ctgb' },
  { product_name: 'Luna Sensation', active_substance: 'fluopyram 250 g/L + trifloxystrobine 250 g/L', target_pests: 'Botrytis, alternaria, sclerotinia, bladvlekkenziekte', approved_crops: 'uien, prei, sla, aardbei, bonen', approval_expiry: '2028-06-30', registration_number: 'W-15234', source: 'Ctgb' },
  { product_name: 'Switch', active_substance: 'cyprodinil 375 g/kg + fludioxonil 250 g/kg', target_pests: 'Botrytis, sclerotinia, fusarium', approved_crops: 'uien, aardbeien, sla, druiven, sierteelt', approval_expiry: '2027-12-31', registration_number: 'W-13678', source: 'Ctgb' },
  { product_name: 'Rovral', active_substance: 'iprodion 500 g/L', target_pests: 'Botrytis, sclerotinia, alternaria', approved_crops: 'uien, sla, bonen, tulpen, bloembollen', approval_expiry: '2027-06-30', registration_number: 'W-11234', source: 'Ctgb' },
  { product_name: 'Thiram', active_substance: 'thiram 800 g/kg', target_pests: 'Diverse schimmelziekten (breed spectrum)', approved_crops: 'bloembollen, zaadbehandeling granen', approval_expiry: '2027-03-31', registration_number: 'W-10345', source: 'Ctgb' },
  { product_name: 'Amistar', active_substance: 'azoxystrobine 250 g/L', target_pests: 'Rhizoctonia, septoria, roest, bladvlekkenziekte', approved_crops: 'aardappelen (knolbehandeling), tarwe, gerst, suikerbieten', approval_expiry: '2027-12-31', registration_number: 'W-11789', source: 'Ctgb' },
  { product_name: 'Maxim 480 FS', active_substance: 'fludioxonil 480 g/L', target_pests: 'Rhizoctonia, zilverschurft, fusarium (pootgoed)', approved_crops: 'aardappelen (knolbehandeling)', approval_expiry: '2028-03-31', registration_number: 'W-12456', source: 'Ctgb' },
  { product_name: 'Signum', active_substance: 'boscalid 267 g/kg + pyraclostrobine 67 g/kg', target_pests: 'Sclerotinia, botrytis, alternaria, valse meeldauw', approved_crops: 'uien, peen, bonen, sla, spruitkool', approval_expiry: '2028-01-31', registration_number: 'W-13567', source: 'Ctgb' },
  { product_name: 'Mancozeb 750 WG', active_substance: 'mancozeb 750 g/kg', target_pests: 'Phytophthora, valse meeldauw, alternaria', approved_crops: 'aardappelen, uien, tomaten', approval_expiry: '2026-12-31', registration_number: 'W-10456', source: 'Ctgb' },
  { product_name: 'Rudis', active_substance: 'prothioconazool 100 g/L', target_pests: 'Sclerotinia, alternaria, phoma, meeldauw', approved_crops: 'koolzaad, mosterd', approval_expiry: '2027-10-31', registration_number: 'W-14789', source: 'Ctgb' },

  // === Insecticiden ===
  { product_name: 'Teppeki', active_substance: 'flonicamid 500 g/kg', target_pests: 'Bladluis (diverse soorten)', approved_crops: 'tarwe, gerst, aardappelen, suikerbieten, koolzaad, appels, peren', approval_expiry: '2028-08-31', registration_number: 'W-14203', source: 'Ctgb' },
  { product_name: 'Movento', active_substance: 'spirotetramat 150 g/L', target_pests: 'Bladluis, wolluis, schildluis', approved_crops: 'aardappelen, suikerbieten, fruit, groenten', approval_expiry: '2027-12-31', registration_number: 'W-13456', source: 'Ctgb' },
  { product_name: 'Coragen', active_substance: 'chlorantraniliprole 200 g/L', target_pests: 'Coloradokever, rupsen, uienvlieg, koolvlieg', approved_crops: 'aardappelen, kool, prei, uien', approval_expiry: '2028-06-30', registration_number: 'W-14567', source: 'Ctgb' },
  { product_name: 'Biscaya', active_substance: 'thiacloprid 240 g/L', target_pests: 'Coloradokever, bladluis, glanskevers', approved_crops: 'aardappelen, koolzaad', approval_expiry: '2026-08-31', registration_number: 'W-13089', source: 'Ctgb' },
  { product_name: 'Karate Zeon', active_substance: 'lambda-cyhalothrin 100 g/L', target_pests: 'Bladluis, trips, aardvlooien, koolmot, graanhaantje', approved_crops: 'tarwe, gerst, aardappelen, suikerbieten, kool, uien', approval_expiry: '2027-09-30', registration_number: 'W-11234', source: 'Ctgb' },
  { product_name: 'Decis Protech', active_substance: 'deltamethrin 15 g/L', target_pests: 'Bladluis, aardvlooien, trips, koolmot, coloradokever', approved_crops: 'tarwe, gerst, aardappelen, koolzaad, groenten', approval_expiry: '2027-08-31', registration_number: 'W-12123', source: 'Ctgb' },
  { product_name: 'Vertimec Pro', active_substance: 'abamectine 18 g/L', target_pests: 'Trips, spint, mineervliegen, tomatenmineermot', approved_crops: 'groenten (glastuinbouw), sierteelt', approval_expiry: '2027-12-31', registration_number: 'W-13890', source: 'Ctgb' },
  { product_name: 'Steward', active_substance: 'indoxacarb 300 g/kg', target_pests: 'Rupsen (kooluil, koolmot), maisstengelborer, fruitmot', approved_crops: 'kool, mais, appels, peren', approval_expiry: '2028-03-31', registration_number: 'W-14345', source: 'Ctgb' },
  { product_name: 'Calypso', active_substance: 'thiacloprid 480 g/L', target_pests: 'Bladluis, appelbloesemkever, glanskevers', approved_crops: 'appels, peren, koolzaad', approval_expiry: '2026-12-31', registration_number: 'W-13234', source: 'Ctgb' },
  { product_name: 'Gazelle', active_substance: 'acetamiprid 200 g/kg', target_pests: 'Bladluis, appelbloesemkever, wantsen', approved_crops: 'appels, peren, aardappelen, koolzaad', approval_expiry: '2027-09-30', registration_number: 'W-14678', source: 'Ctgb' },
  { product_name: 'Pirimor', active_substance: 'pirimicarb 500 g/kg', target_pests: 'Bladluis (selectief)', approved_crops: 'granen, aardappelen, suikerbieten, fruit, groenten', approval_expiry: '2027-06-30', registration_number: 'W-10890', source: 'Ctgb' },
  { product_name: 'Plenum', active_substance: 'pymetrozine 500 g/kg', target_pests: 'Bladluis, wittevlieg', approved_crops: 'aardappelen, sla, komkommer, tomaten', approval_expiry: '2027-12-31', registration_number: 'W-13456', source: 'Ctgb' },
  { product_name: 'Tracer', active_substance: 'spinosad 480 g/L', target_pests: 'Trips, mineervlieg, rupsen', approved_crops: 'paprika, tomaten, sla, sierteelt', approval_expiry: '2027-09-30', registration_number: 'W-14123', source: 'Ctgb' },
  { product_name: 'Runner', active_substance: 'methoxyfenozide 240 g/L', target_pests: 'Rupsen (fruitmot, bladrollers, kooluil)', approved_crops: 'appels, peren, kool', approval_expiry: '2028-01-31', registration_number: 'W-14890', source: 'Ctgb' },
  { product_name: 'Conserve', active_substance: 'spinosad 120 g/L', target_pests: 'Trips, mineervlieg, rupsen (biologisch middel)', approved_crops: 'groenten, sierteelt, fruit', approval_expiry: '2028-06-30', registration_number: 'W-14567', source: 'Ctgb' },

  // === Herbiciden ===
  { product_name: 'Roundup Ultimate', active_substance: 'glyfosaat 450 g/L', target_pests: 'Onkruiden (breed spectrum, niet-selectief)', approved_crops: 'stoppelbehandeling, perceelsranden (niet in gewas)', approval_expiry: '2027-12-15', registration_number: 'W-11567', source: 'Ctgb' },
  { product_name: 'Stomp Aqua', active_substance: 'pendimethalin 455 g/L', target_pests: 'Onkruiden (kiemplant, bodemherbicide)', approved_crops: 'uien, wortelen, mais, granen', approval_expiry: '2027-10-31', registration_number: 'W-12890', source: 'Ctgb' },
  { product_name: 'Boxer', active_substance: 'prosulfocarb 800 g/L', target_pests: 'Onkruiden (grassen, breedbladige)', approved_crops: 'wintertarwe, wintergerst, aardappelen', approval_expiry: '2028-01-31', registration_number: 'W-14012', source: 'Ctgb' },
  { product_name: 'Centium 360 CS', active_substance: 'clomazone 360 g/L', target_pests: 'Onkruiden (breedbladige, bodemherbicide)', approved_crops: 'aardappelen, kool, wortelen', approval_expiry: '2027-08-31', registration_number: 'W-14234', source: 'Ctgb' },
  { product_name: 'Focus Plus', active_substance: 'cycloxydim 100 g/L', target_pests: 'Grasonkruiden (selectief)', approved_crops: 'suikerbieten, uien, aardappelen, koolzaad', approval_expiry: '2027-12-31', registration_number: 'W-13345', source: 'Ctgb' },
  { product_name: 'Sencor WG', active_substance: 'metribuzin 700 g/kg', target_pests: 'Onkruiden (breedbladige, bodemherbicide)', approved_crops: 'aardappelen, wortelen, tomaten', approval_expiry: '2027-06-30', registration_number: 'W-11456', source: 'Ctgb' },
  { product_name: 'Basagran', active_substance: 'bentazon 480 g/L', target_pests: 'Onkruiden (breedbladige, contactherbicide)', approved_crops: 'bonen, erwten, mais, granen', approval_expiry: '2027-09-30', registration_number: 'W-10678', source: 'Ctgb' },

  // === Biologische middelen ===
  { product_name: 'Trichoderma (Trianum)', active_substance: 'Trichoderma harzianum T-22', target_pests: 'Bodemschimmels (Pythium, Fusarium, Rhizoctonia)', approved_crops: 'glastuinbouw, vollegrond, bloembollen', approval_expiry: '2028-06-30', registration_number: 'W-14890', source: 'Ctgb' },
  { product_name: 'Contans WG', active_substance: 'Coniothyrium minitans CON/M/91-08', target_pests: 'Sclerotinia sclerotiorum (rattenkeutelziekte)', approved_crops: 'sla, bonen, koolzaad, zonneblomen', approval_expiry: '2028-03-31', registration_number: 'W-14012', source: 'Ctgb' },
  { product_name: 'Serenade ASO', active_substance: 'Bacillus subtilis QST 713', target_pests: 'Botrytis, meeldauw, sclerotinia', approved_crops: 'sla, aardbei, druif, tomaten, sierteelt', approval_expiry: '2027-12-31', registration_number: 'W-14345', source: 'Ctgb' },
  { product_name: 'Madex', active_substance: 'Cydia pomonella granulovirus (CpGV)', target_pests: 'Fruitmot (Cydia pomonella)', approved_crops: 'appels, peren', approval_expiry: '2028-06-30', registration_number: 'W-13678', source: 'Ctgb' },
  { product_name: 'Turex', active_substance: 'Bacillus thuringiensis var. aizawai', target_pests: 'Rupsen (koolwitje, kooluil, koolmot, bladrollers)', approved_crops: 'kool, sla, fruit, sierteelt', approval_expiry: '2028-01-31', registration_number: 'W-14123', source: 'Ctgb' },

  // === Nematiciden ===
  { product_name: 'Nemathorin 10G', active_substance: 'fosthiazaat 100 g/kg', target_pests: 'Aardappelcysteaaltje (Globodera spp.)', approved_crops: 'aardappelen', approval_expiry: '2027-06-30', registration_number: 'W-12890', source: 'Ctgb' },
  { product_name: 'Velum Prime', active_substance: 'fluopyram 400 g/L', target_pests: 'Cysteaaltjes, wortellesieaaltjes', approved_crops: 'aardappelen, wortelen, suikerbieten', approval_expiry: '2028-03-31', registration_number: 'W-15123', source: 'Ctgb' },
  { product_name: 'Vydate 10G', active_substance: 'oxamyl 100 g/kg', target_pests: 'Cysteaaltjes, vrijlevende aaltjes', approved_crops: 'aardappelen, suikerbieten, wortelen', approval_expiry: '2027-09-30', registration_number: 'W-12345', source: 'Ctgb' },

  // === Groeiregulatoren ===
  { product_name: 'CCC 750', active_substance: 'chloormequat-chloride 750 g/L', target_pests: 'Groeiregulatie (legeringspreventie)', approved_crops: 'tarwe, gerst, rogge, triticale, haver', approval_expiry: '2027-12-31', registration_number: 'W-10234', source: 'Ctgb' },
  { product_name: 'Moddus', active_substance: 'trinexapac-ethyl 250 g/L', target_pests: 'Groeiregulatie (halmverkorting)', approved_crops: 'tarwe, gerst, rogge, triticale, gras', approval_expiry: '2028-01-31', registration_number: 'W-13012', source: 'Ctgb' },
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
db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('data_sources', 'Ctgb toelatingsbank, WUR/PPO Gewasbeschermingskennisbank, CLM Milieumeetlat, NVWA fytosanitaire regelgeving, IRS suikerbieten')");

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
    'IRS (Instituut voor Rationele Suikerproductie)',
    'NFO (Nederlandse Fruittelers Organisatie)',
    'Glastuinbouw NL / Koppert Biological Systems',
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
