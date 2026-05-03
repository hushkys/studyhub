// build_ces_sloh.js
// Přidá téma "Písemná práce a rozbor textu" do češtiny v data.js přes Gemini
'use strict';
const fs = require('fs');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = 'gemini-3.1-flash-lite-preview';
const CACHE_KEY = 'ces_sloh_pisemna';
const CACHE_PATH = `.gemini_cache/${CACHE_KEY}.md`;

const PROMPT = `Jsi učitel češtiny na střední škole. Vytvoř PODROBNÝ studijní materiál pro maturanta.
Téma: MATURITNÍ ZKOUŠKA Z ČJL — PROFILOVÁ ČÁST: Písemná práce + Rozbor uměleckého a neuměleckého textu.

DŮLEŽITÉ: Materiál musí být KOMPLETNÍ a DETAILNÍ — student z něj musí být schopen odpovědět na JAKOUKOLIV otázku u maturity. Uveď VŠECHNY pojmy s příklady.

---

## ČÁST 1: PÍSEMNÁ PRÁCE

**Parametry:** min. 250 slov, 120 minut, pomůcky: Pravidla českého pravopisu
**4 zadání** — žák vybírá 1, zastoupeny styly: prostě sdělovací, umělecký, odborný, publicistický, řečnický, administrativní

### FUNKČNÍ STYLY — pro každý uveď: charakteristiku, příklady útvarů, typické jazykové prostředky:

**Prostě sdělovací styl:**
- Účel: jednoduché sdělení v běžné komunikaci
- Útvary: vzkaz, SMS, e-mail příteli, dopis, telefonát, chat
- Jazyk: hovorové výrazy, nespisovné prvky, volná stavba, krátké věty

**Administrativní styl:**
- Účel: výměna informací mezi osobou a institucí
- Útvary: životopis (strukturovaný/narativní), úřední dopis, žádost, formulář, protokol, smlouva
- Jazyk: přesnost, ustálené fráze, neosobní, bez emocí, spisovný jazyk

**Publicistický styl:**
- Účel: informovat o aktuálním dění, přesvědčovat, bavit
- Útvary: zpráva, článek, reportáž, interview, sloupek, úvodník, fejeton, recenze, komentář
- Jazyk: přitažlivé titulky, aktuálnost, kombinace informačního a úvahového postupu

**Odborný styl:**
- Účel: předávání vědeckých a odborných informací
- Útvary: referát, encyklopedické heslo, přednáška, učebnicový text, odborný článek, recenze
- Jazyk: terminologie, přesnost, objektivita, složitější větná stavba

**Umělecký styl:**
- Účel: estetický účinek, zábava, umělecký zážitek
- Útvary: román, povídka, báseň, drama, líčení, fejeton
- Jazyk: tropy, figury, obrazná pojmenování, subjektivita

**Řečnický styl:**
- Účel: přesvědčování, oslovení publika
- Útvary: proslov, řeč, toast, kázání, projev, debata
- Jazyk: gradace, oslovení, opakování, otázky k publiku

### SLOHOVÉ POSTUPY (v textu se obvykle mísí 2–3):
- **Informační** — nepromyšlený sled informací, nejjednodušší (zpráva, oznámení)
- **Vyprávěcí** — příběh v časovém sledu, zápletka, vyvrcholení, rozuzlení
- **Popisný** — vnější vzhled osoby/věci/prostředí (statický popis)
- **Charakterizační** — povahové vlastnosti osoby, skupiny, zvířete (dynamický popis)
- **Výkladový** — vztahy mezi jevy, příčiny a důsledky, vysvětlování
- **Úvahový** — myšlenkové pochody, osobní názory, argumentace, hodnocení

### KOMPOZICE SLOHOVÉ PRÁCE:
- **Nadpis:** výstižný, přitažlivý, naznačuje téma
- **Úvod:** uvedení do tématu, zaujmutí čtenáře, teze (co budu dokazovat)
- **Stať (tělo):** rozvíjení tématu, argumenty, příklady, příběh — nejdelší část
- **Závěr:** shrnutí, pointa, výzva k akci, otázka k zamyšlení
- **Odstavce:** každá nová myšlenka = nový odstavec; odsazení nebo prázdný řádek

---

## ČÁST 2: ROZBOR UMĚLECKÉHO TEXTU

### 1. Zasazení výňatku do kontextu díla
- Sdělit, z jaké části knihy úryvek pochází
- Termíny: kapitola / sloka / jednání / výstup
- Např.: úvod/střed/závěr románu; první jednání; třetí zpěv

### 2. Téma a motiv
- **Téma** = námět, ústřední myšlenka díla (neomezené: válka, láska, mezilidské vztahy, ruský venkov)
- **Motiv** = nejdrobnější téma, konkrétnější než téma (růže, zbraň, oblaka, nenávist)
- Souhrn motivů tvoří téma

### 3. Časoprostor
- **Čas** = část dne, roční období, historická epocha (večer, jaro, 1. pol. 19. stol. – romantismus)
- **Prostor** = místo, obec, stát (venkov, Ratibořice, Rakousko-Uhersko)

### 4. Kompoziční výstavba
- **Chronologická** — děj plyne za sebou od nejstarších po nejmladší události (Petr a Lucie)
- **Retrospektivní** — příběh v obráceném pořadí, nebo retrospektivní pasáže vsunuty do chronologie (Babička — babiččino vzpomínání)
- **Rámcová** — mezi úvod a závěr vložen ucelený příběh (Dekameron — útěk před morem)
- **Paralelní** — více časových rovin současně (Hra o trůny)

### 5. Literární druh a žánr
**Literární druhy:**
- **Lyrika** — bez děje, popisuje dojmy, pocity, nálady autora
- **Epika** — má děj, popisuje skutečnost
- **Drama** — má děj, předvádí skutečnost, určeno pro divadlo

**Literární žánry:**
- Lyrické: óda, elegie, epigram, hymna
- Lyricko-epické: balada, romance, poéma
- Epické: román, povídka, novela, bajka, pohádka, báje, pověst, epos
- Dramatické: komedie, tragédie, činohra, fraška

### 6. Vypravěč / lyrický subjekt
- V próze: **vypravěč** = mluvčí, který předkládá příběh čtenářovi
- V poezii: **lyrický subjekt** = mluvčí básnického díla

**Podle gramatické osoby:**
- **Er-forma** — vypravěč hovoří ve 3. osobě, obvykle v minulém čase
- **Ich-forma** — vypravěč je jedna z postav (obvykle hlavní), hovoří v 1. osobě

**Podle vyprávěcí roviny:**
- **Vševědoucí vypravěč** — er-forma, sleduje všechny postavy, stojí „nad" příběhem (V. Dyk — Krysař)
- **Personální vypravěč** — ich-forma, vypravěčem je jedna z postav (V. Nabokov — Lolita)
- **Neosobní vypravěč** — er-forma, zaznamenává chování postav, ale „nevidí" do jejich nitra (V. Páral — Soukromá vichřice)

### 7. Postavy
- Jmenovat a charakterizovat osoby z úryvku i celé knihy
- **Dělení:** hlavní / vedlejší / epizodická / fiktivní (v ději nevystupuje přímo, např. Godot)
- **Hodnocení:** kladná / neutrální / záporná

### 8. Vyprávěcí způsoby
- **Přímá řeč** — promluva postavy oddělena uvozovkami: Pavel řekl: „Pojď, tady nemůžeme zůstat."
- **Polopřímá řeč** — vnitřní monolog propojený s pásmem vypravěče, bez uvozovek: Pavel sáhl po její ruce, ne, tady nemohou zůstat.
- **Nevlastní přímá řeč** — vnitřní monolog postavy, bez uvozovek: Pavel sáhl po její ruce, pojď, tady nemůžeme zůstat.
- **Nepřímá řeč** — reprodukce řeči vypravěčem, bez uvozovek: Pavel řekl, že tady nemohou zůstat.

### 9. Typy promluv
- **Pásmo vypravěče** — promluva vypravěče v ich-formě nebo er-formě
- **Monolog** — promluva jedné postavy, nesouvisí s dialogem
- **Dialog** — promluva dvou a více postav; rozhovor

### 10. Veršová výstavba (pouze poezie)
- Určit počet slok a veršů v úryvku
- **Druhy rýmů:**
  - **Volný rým** — bez pravidelného schématu
  - **Střídavý rým** — schéma: a b a b
  - **Sdružený rým** — schéma: a a b b
  - **Obkročný rým** — schéma: a b b a
  - **Přerývaný rým** — schéma: a b c b nebo a b c a
  - **Postupný rým** — schéma: a b c d; a b c d

### 11. Jazykové prostředky (próza a drama)
**Slova spisovná:**
- Neutrální (pes), hovorová (spacák), knižní (oř), básnická/poetismy (luna)
- Archaismy — zastaralá slova (hvozd)
- Historismy — označují zaniklé skutečnosti (palcát)
- Neologismy — nově utvořená slova (Smuténka)
- Přechodníky — archaické tvary sloves (vstávajíc)
- Citoslovce (kšá, hú, hrrr)
- Termíny — odborné názvy (pálená cihla)

**Slova nespisovná:**
- Obecná čeština (von, pěknej)
- Citově zabarvená (zlatíčko, kretén)
- Nářeční — vázaná na území (šufánek)
- Slang — mluva zájmové skupiny (perón, tělák)
- Argot — mluva spodiny společnosti (háčko = heroin)
- Vulgarismy — sprostá slova

Vždy zdůvodnit, proč autor tyto prostředky využil!

### 12. Tropy (próza, drama i poezie)
- **Metafora** — nepřímé pojmenování na základě vnější podobnosti: hlad — nejlepší kuchař
- **Metonymie** — nepřímé pojmenování na základě vnitřní souvislosti: půjčil si Kunderu
- **Personifikace** — zosobnění: stromy šeptaly
- **Přirovnání** — porovnání dvou jevů se společným rysem: chová se jako vůl
- **Epiteton** — básnický přívlastek: nejčokoládovější čokoláda, krutopřísný vtip
- **Hyperbola** — nadsázka: sto let v šachtě žil
- **Eufemismus** — zjemnění nepříjemné skutečnosti: usnout navěky = zemřít
- **Dysfemismus** — zhrubění skutečnosti: pazoura = ruka
- **Oxymóron** — nelogické spojení slov: mrtvé milenky cit
- **Synekdocha** — záměna části za celek: přišel o střechu nad hlavou
- **Ironie** — řečené je myšleno obráceně: Tobě to ale sluší!

### 13. Figury (pouze poezie)
- **Epizeuxis** — opakování téhož slova krátce za sebou
- **Anafora** — opakování slov na začátku veršů
- **Epifora** — opakování slov na konci veršů
- **Epanastrofa** — opakování slova na konci jednoho a na začátku druhého verše

### 14. Kontext autorovy tvorby
- Prvotina / vrcholné dílo / dílo ze závěrečného období / dílo vydané posmrtně

### 15. Literární a kulturní kontext
- Zařadit autora do: století, půlstoletí, uměleckého slohu, literárního proudu
- Příklady: 1. pol. 19. stol. = romantismus; meziválečné období = demokratický proud
- Uvést základní rysy směru a další zástupce

---

## ČÁST 3: ROZBOR NEUMĚLECKÉHO TEXTU

### 1. Souvislost s uměleckým textem
- Najít a vyjádřit společné téma obou textů, zdůvodnit

### 2. Hlavní myšlenka textu
- Vlastními slovy říct, o čem text pojednává; postihnout ústřední téma

### 3. Podstatné a nepodstatné informace
- Najít pasáže nesoucí základní informace
- Najít pasáže/slova, která by bylo možné vypustit (závorky, vysvětlivky, nadbytečná synonyma)

### 4. Různé způsoby čtení a interpretace
- Je text jednoznačný, nebo připouští více výkladů?

### 5. Domněnky a fakta
- Obsahuje text pouze ověřené informace, nebo i neověřená tvrzení?

### 6. Komunikační situace
- **Účel:** proč text vznikl (informovat, přesvědčit, pobavit, prodat)
- **Adresát:** komu je text určen
- Příklad: inzerát — účel: prodat věc; adresát: ten, kdo věc shání

### 7. Funkční styl (viz Část 1)

### 8. Slohový postup (viz Část 1)

### 9. Kompoziční výstavba výňatku
- Rozlišit a pojmenovat části textu: počet odstavců, nadpis, titulek, mezititulek, přímá řeč, odrážky, vysvětlivky

### 10. Jazykové prostředky (viz Část 2, bod 11)

---

Vrať POUZE Markdown text, bez úvodního komentáře, bez \`\`\`markdown bloků.`;


function geminiRequest(prompt) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  return model.generateContent(prompt).then(r => r.response.text());
}

async function main() {
  // Check cache
  if (fs.existsSync(CACHE_PATH)) {
    console.log('✓ Cache nalezena, používám cache...');
    const cached = fs.readFileSync(CACHE_PATH, 'utf8');
    injectIntoData(cached);
    return;
  }

  console.log(`🤖 Volám Gemini API (${MODEL_NAME})...`);
  const content = await geminiRequest(PROMPT);
  console.log(`✓ Gemini odpověděl (${content.length} znaků)`);

  // Save cache
  fs.writeFileSync(CACHE_PATH, content, 'utf8');
  console.log(`✓ Cache uložena: ${CACHE_PATH}`);

  injectIntoData(content);
}

function injectIntoData(mdContent) {
  if (!fs.existsSync('data.js')) {
    console.error('❌ data.js nenalezeno! Nejdřív spusť build_data.js');
    process.exit(1);
  }

  const dataJs = fs.readFileSync('data.js', 'utf8');
  let categories;
  try {
    // eval in a sandbox-like way
    const fn = new Function('return ' + dataJs.replace('const CATEGORIES = ', '').replace(/;$/, ''));
    categories = fn();
  } catch (e) {
    console.error('❌ Nepodařilo se parsovat data.js:', e.message);
    process.exit(1);
  }

  const cesCat = categories.find(c => c.id === 'ces');
  if (!cesCat) {
    console.error('❌ Kategorie "ces" nenalezena v data.js');
    process.exit(1);
  }

  // Remove existing if already there
  cesCat.topics = cesCat.topics.filter(t => t.id !== 'ces-sloh-pisemna');

  // Add as first topic
  cesCat.topics.unshift({
    id: 'ces-sloh-pisemna',
    num: '0',
    title: 'Písemná práce + Rozbor textu',
    content: mdContent
  });

  const out = 'const CATEGORIES = ' + JSON.stringify(categories) + ';';
  fs.writeFileSync('data.js', out, 'utf8');
  console.log(`✅ Téma přidáno do data.js (ces: ${cesCat.topics.length} témat celkem)`);
  console.log(`   Velikost data.js: ${(out.length / 1024).toFixed(0)} KB`);
}

main().catch(err => { console.error('❌ Chyba:', err); process.exit(1); });
