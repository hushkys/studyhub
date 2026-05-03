/**
 * build_data.js — generuje data.js z DOCX + MD souborů
 * Gemini AI přeformátuje surový text do krásného Markdownu
 *
 * Použití:
 *   1. Vlož svůj Gemini API klíč do .env:  GEMINI_API_KEY=AIza...
 *   2. node build_data.js
 *
 * Výstup: data.js (načítán přímo v prohlížeči)
 */

require('dotenv').config();
const fs   = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// ── CONFIG ──────────────────────────────────────────────────────
const USE_GEMINI = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_key_here';
const MODEL_NAME = 'gemini-3.1-flash-lite-preview';
const CACHE_DIR  = '.gemini_cache';            // cache aby se nevolalo API zbytečně

const genAI = USE_GEMINI ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: MODEL_NAME }) : null;

if (!USE_GEMINI) {
  console.log('⚠  GEMINI_API_KEY není nastaven — obsah se zpracuje bez AI formátování.');
} else {
  console.log(`✓  Gemini API připraven (model: ${MODEL_NAME})`);
}

if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR);

// ── KYB TITLES MAP ──────────────────────────────────────────────
const KYB_TITLES = {
  '1':  'Základy kybernetické bezpečnosti',
  '2':  'Bezpečnost na internetu a v lokálních sítích',
  '3':  'Kybernetické hrozby a ochrana proti nim',
  '4':  'Revitalizace počítačové sítě',
  '5':  'Úloha aktualizací a monitorovacích systémů v oblasti kybernetiky',
  '6':  'Bezpečnost dat a jejich ochrana',
  '7':  'Steganografie a kryptografie v kybernetické bezpečnosti',
  '8':  'Autorský zákoník a zákon o kybernetické bezpečnosti v běžném životě',
  '9':  'Organizace a týmy zapojené do kybernetické bezpečnosti',
  '10': 'Serverové a desktopové operační systémy',
  '11': 'Bezpečnost operačních systémů z pohledu kybernetiky',
  '12': 'Bezdrátová komunikace a její zabezpečení',
  '13': 'Hardware a periferní zařízení',
  '14': 'Aktivní a pasivní síťové prvky',
  '15': 'Síťové vrstevnaté modely',
  '16': 'Základy počítačových sítí',
  '17': 'Bezpečnost v sítích',
  '18': 'IP adresace',
  '19': 'Segmentace počítačových sítí',
  '20': 'Aplikační protokoly v sítích',
};

// KYB inline obsah pro otázky bez DOCX souboru (1-9 kromě těch co mají DOCX)
const KYB_INLINE = JSON.parse(fs.readFileSync('kyb_inline.json', 'utf8'));

// ── GEMINI FORMATTER ────────────────────────────────────────────
const GEMINI_PROMPT = `Jsi expert na formátování studijních materiálů. Dostaneš surový text z DOCX dokumentu (maturitní otázka nebo čtenářský deník).

Tvůj úkol: Přeformátuj text do KRÁSNÉHO, PŘEHLEDNÉHO Markdownu vhodného pro studium.

PRAVIDLA:
- Používej ## pro hlavní sekce, ### pro podsekce
- Používej **tučné** pro klíčové pojmy a důležité věci
- Používej - pro odrážky (bullet points) — VŽDY když je seznam věcí
- Používej > pro důležité definice nebo citace
- Používej \`kód\` pro technické termíny, zkratky, protokoly
- Zachovej VEŠKERÝ obsah — nic nevynechávej, jen přeformátuj
- Odstraň duplicity a zbytečné prázdné řádky
- Pokud jsou v textu nadpisy VELKÝMI PÍSMENY, převeď je na normální nadpisy (## nebo ###)
- Pokud jsou věci ve sloupcích nebo tabulkách, udělej z nich přehledné sekce s odrážkami
- Přidej logickou strukturu — seskup související věci pod společný nadpis
- Text musí být v češtině
- NEVYMÝŠLEJ nový obsah — pouze přeformátuj existující

Vrať POUZE Markdown text, bez úvodního komentáře, bez \`\`\`markdown bloků.`;

async function geminiFormat(rawText, title, cacheKey) {
  // Check cache first
  const cacheFile = path.join(CACHE_DIR, cacheKey.replace(/[^a-z0-9]/gi, '_') + '.md');
  if (fs.existsSync(cacheFile)) {
    const cached = fs.readFileSync(cacheFile, 'utf8');
    if (cached.length > 50) {
      process.stdout.write(' [cache]');
      return cached;
    }
  }

  if (!model) return rawText; // no API key — return as-is

  try {
    const prompt = `${GEMINI_PROMPT}\n\n---\nNázev tématu: ${title}\n\nSurový text:\n${rawText.substring(0, 12000)}`;
    const result = await model.generateContent(prompt);
    const formatted = result.response.text().trim();
    fs.writeFileSync(cacheFile, formatted, 'utf8');
    process.stdout.write(' [AI✓]');
    return formatted;
  } catch (err) {
    console.error(`\n  ⚠ Gemini error pro "${title}": ${err.message}`);
    return rawText;
  }
}

// ── DOCX READER ─────────────────────────────────────────────────
async function readDocx(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value.trim();
}

// ── MD READER ───────────────────────────────────────────────────
function readMd(filePath) {
  return fs.readFileSync(filePath, 'utf8').trim();
}

// ── SLUG ────────────────────────────────────────────────────────
function slug(str) {
  return str.toLowerCase()
    .replace(/[áàäâ]/g,'a').replace(/[čc]/g,'c').replace(/[ďd]/g,'d')
    .replace(/[éěèê]/g,'e').replace(/[íìî]/g,'i').replace(/[ňn]/g,'n')
    .replace(/[óòöô]/g,'o').replace(/[řr]/g,'r').replace(/[šs]/g,'s')
    .replace(/[ťt]/g,'t').replace(/[úůùü]/g,'u').replace(/[ýy]/g,'y')
    .replace(/[žz]/g,'z').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}

// ── SLEEP (rate limiting) ────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── MAT TOPICS ──────────────────────────────────────────────────
const MAT_TOPICS = [
  { num: '0',  title: 'Přijímací zkouška na UHK — FIM (příprava)',
    prompt: `Vytvoř KOMPLETNÍ přípravu na přijímací zkoušku z matematiky na Fakultu informatiky a managementu UHK (Univerzita Hradec Králové).

Analýza skutečných testů FIM UHK (2019–2025) ukazuje tato NEJČASTĚJŠÍ TÉMATA (seřazena podle četnosti výskytu):

1. LOGARITMY A EXPONENCIÁLY (velmi časté ••) — definiční obory logaritmických funkcí, logaritmické rovnice, exponenciální rovnice, výpočty s logaritmy
2. ROVNICE A NEROVNICE — kvadratické rovnice, rovnice s odmocninami (ověření kořenů!), exponenciální nerovnice, soustavy rovnic s parametrem
3. MOCNINY A ODMOCNINY — úpravy výrazů, výpočty hodnot výrazů jako (³√3³)⁻², racionalizace
4. MNOŽINY A LOGIKA — negace výroků, průnik/sjednocení množin, absolutní hodnota jako množinová podmínka, dělitelé čísel
5. GONIOMETRIE — nejmenší kladné řešení rovnic typu sin x = k, cos x = k
6. ANALYTICKÁ GEOMETRIE — vzdálenost bodu od přímky, nejbližší bod na přímce, rovnice kružnice
7. KOMBINATORIKA — počty čísel s danými vlastnostmi (cifry, sudá/lichá čísla), kombinace, variace
8. POSLOUPNOSTI A FINANČNÍ MATEMATIKA — aritmetická/geometrická posloupnost, zdvojnásobení vkladu, složené úročení
9. SLOVNÍ ÚLOHY — soustavy rovnic (ceny zboží), procenta (zdražení/zlevnění), práce a výkon, směsi
10. STEREOMETRIE — objem těles (krychle, koule) při změně rozměrů (mocninná závislost)
11. STATISTIKA A PRAVDĚPODOBNOST — průměrné zdražení, množiny studentů (Vennovy diagramy)
12. FUNKCE S PARAMETREM — určení parametrů a,b aby funkce procházela danými body

Pro KAŽDÉ téma:
- Vysvětli teorii (vzorce, pravidla, definice)
- Uveď KONKRÉTNÍ PŘÍKLADY z reálných testů UHK s KOMPLETNÍM POSTUPEM ŘEŠENÍ
- Zdůrazni nejčastější CHYBY a PASTI (např. ověření kořenů u rovnic s odmocninami, záporný základ logaritmu, změna nerovnosti)
- Přidej TIPY jak rychle řešit (test je časově omezený, 15 příkladů za ~60 minut)

FORMÁT: Každé téma jako samostatná sekce ## s podsekci ### Teorie, ### Příklady z UHK testů, ### Časté chyby

Zahrň také sekci ## Strategie řešení testu s tipy na time management a postup při nejistotě (eliminace možností a,b,c,d,e).

Materiál musí být VELMI ROZSÁHLÝ — toto je klíčová příprava na přijímací zkoušku.` },
  { num: '1',  title: 'Logická výstavba matematiky',
    prompt: `Zpracuj maturitní okruh: Logická výstavba matematiky.
Zahrň: výroky (definice, operace AND/OR/NOT, pravdivostní tabulky), negace složených výroků, implikace (přímá, obrácená, obměněná, negace), obecný a existenční výrok s negacemi, množiny (způsoby zadání, operace: průnik, sjednocení, rozdíl, doplněk, kartézský součin), Vennovy diagramy, typy důkazů (přímý, nepřímý, sporem, matematická indukce). Přidej konkrétní příklady a vzorce.` },
  { num: '2',  title: 'Číselné obory',
    prompt: `Zpracuj maturitní okruh: Číselné obory.
Zahrň: přehled oborů N, Z, Q, R, C s příklady a vztahy mezi nimi, dělitelnost přirozených čísel (znaky dělitelnosti 2,3,4,5,6,8,9,10,11), největší společný dělitel (NSD) a nejmenší společný násobek (NSN) — Euklidův algoritmus, rozklad na prvočísla. Komplexní čísla: algebraický tvar (a+bi), reálná a imaginární část, imaginární jednotka i, početní operace (+,-,×,÷), komplexně sdružené číslo, goniometrický tvar (r·(cosφ+i·sinφ)), absolutní hodnota, argument, Gaussova rovina, Moivreova věta. Přidej příklady výpočtů.` },
  { num: '3',  title: 'Lineární funkce; lineární rovnice, nerovnice a jejich soustavy',
    prompt: `Zpracuj maturitní okruh: Lineární funkce, rovnice, nerovnice a soustavy.
Zahrň: lineární funkce f(x)=ax+b — předpis, graf (přímka), vlastnosti (rostoucí/klesající/konstantní), směrnice, průsečíky s osami. Lineární rovnice — řešení, ekvivalentní úpravy. Lineární nerovnice — řešení, zápis na číselné ose a intervalem. Soustavy lineárních rovnic: sčítací metoda, dosazovací metoda, grafické řešení, Cramerovo pravidlo (2×2), typy soustav (jednoznačně/nejednoznačně/neřešitelná). Přidej vzorce a postup řešení s příklady.` },
  { num: '4',  title: 'Kvadratické funkce; kvadratické rovnice a nerovnice',
    prompt: `Zpracuj maturitní okruh: Kvadratické funkce, rovnice a nerovnice.
Zahrň: kvadratická funkce f(x)=ax²+bx+c — předpis, parabola, souřadnice vrcholu V=[-b/2a, -D/4a], osa souměrnosti, průsečíky s osami, vlastnosti (a>0 minimum, a<0 maximum). Kvadratické rovnice: diskriminant D=b²-4ac, vzorec pro kořeny, typy (D>0 dva kořeny, D=0 dvojnásobný kořen, D<0 žádný reálný kořen). Vietovy vzorce: x₁+x₂=-b/a, x₁·x₂=c/a. Rozklad na součin. Kvadratické nerovnice — grafická a algebraická metoda. Přidej příklady.` },
  { num: '5',  title: 'Mocninné funkce; lineární lomená funkce; výrazy s mocninami a odmocninami',
    prompt: `Zpracuj maturitní okruh: Mocninné funkce, lineární lomená funkce, mocniny a odmocniny.
Zahrň: mocninné funkce f(x)=xⁿ — grafy pro n=1,2,3,1/2 atd., vlastnosti (sudá/lichá funkce, definiční obor). Lineární lomená funkce f(x)=(ax+b)/(cx+d) — předpis, hyperbola, asymptoty, definiční obor, vlastnosti. Pravidla pro počítání s mocninami: aᵐ·aⁿ=aᵐ⁺ⁿ, aᵐ/aⁿ=aᵐ⁻ⁿ, (aᵐ)ⁿ=aᵐⁿ, záporný exponent, nultá mocnina. Odmocniny: definice, pravidla √(a·b)=√a·√b, racionalizace jmenovatele. Přidej příklady úprav výrazů.` },
  { num: '6',  title: 'Exponenciální funkce; exponenciální rovnice a nerovnice',
    prompt: `Zpracuj maturitní okruh: Exponenciální funkce, rovnice a nerovnice.
Zahrň: exponenciální funkce f(x)=aˣ (a>0, a≠1) — předpis, graf, vlastnosti (rostoucí pro a>1, klesající pro 0<a<1), definiční obor R, obor hodnot (0,+∞), asymptota y=0. Eulerovo číslo e. Exponenciální rovnice: metody řešení (stejný základ, logaritmování, substituce). Exponenciální nerovnice — pozor na změnu nerovnosti při a<1. Přidej vzorce a příklady různých typů rovnic.` },
  { num: '7',  title: 'Logaritmické funkce; logaritmy; logaritmické rovnice a nerovnice',
    prompt: `Zpracuj maturitní okruh: Logaritmické funkce, logaritmy, rovnice a nerovnice.
Zahrň: definice logaritmu logₐb=x ↔ aˣ=b, přirozený logaritmus ln, dekadický logaritmus log. Pravidla: log(a·b)=loga+logb, log(a/b)=loga-logb, log(aⁿ)=n·loga, změna základu. Logaritmická funkce f(x)=logₐx — graf, vlastnosti, definiční obor (0,+∞), vztah s exponenciální funkcí (inverzní). Logaritmické rovnice: metody řešení, podmínky existence. Logaritmické nerovnice — pozor na základ. Přidej příklady.` },
  { num: '8',  title: 'Goniometrické funkce; goniometrické rovnice a nerovnice',
    prompt: `Zpracuj maturitní okruh: Goniometrické funkce, rovnice a nerovnice.
Zahrň: definice sin, cos, tan, cot na jednotkové kružnici a v pravoúhlém trojúhelníku. Grafy a vlastnosti: perioda, definiční obor, obor hodnot, sudost/lichost. Základní hodnoty (0°,30°,45°,60°,90°,180°,270°,360°). Goniometrické identity: sin²x+cos²x=1, tanx=sinx/cosx, součtové vzorce, dvojnásobný úhel. Goniometrické rovnice: základní typy, obecné řešení (k∈Z). Goniometrické nerovnice. Přidej tabulku hodnot a příklady.` },
  { num: '9',  title: 'Funkce s absolutní hodnotou; rovnice a nerovnice s absolutní hodnotou',
    prompt: `Zpracuj maturitní okruh: Absolutní hodnota — funkce, rovnice a nerovnice.
Zahrň: definice |x| = x pro x≥0, -x pro x<0, geometrický význam (vzdálenost od nuly). Grafy funkcí s absolutní hodnotou: |x|, |ax+b|, |x²+bx+c|. Rovnice s absolutní hodnotou: metoda rozkladu na případy, grafická metoda. Nerovnice s absolutní hodnotou: |x|<a ↔ -a<x<a, |x|>a ↔ x<-a nebo x>a. Složitější případy s více absolutními hodnotami. Přidej příklady všech typů.` },
  { num: '10', title: 'Rovnice vyšších stupňů',
    prompt: `Zpracuj maturitní okruh: Rovnice vyšších stupňů.
Zahrň: rovnice stupně n≥3 v oborech R i C, základní věta algebry (n kořenů v C). Metody řešení: rozklad na součin (vytýkání, grupování), substituce (biquadratické rovnice — substituce t=x²), Hornerovo schéma pro dělení polynomů. Binomické rovnice xⁿ=a — řešení v R i C. Racionální kořeny — racionální kořen p/q kde p|a₀ a q|aₙ. Přidej příklady rozkladu a řešení.` },
  { num: '11', title: 'Rovnice s parametry',
    prompt: `Zpracuj maturitní okruh: Rovnice s parametry.
Zahrň: lineární rovnice s parametrem — diskuse řešení podle hodnoty parametru (jednoznačné řešení, nekonečně mnoho řešení, žádné řešení). Kvadratické rovnice s parametrem — diskuse podle diskriminantu D(a), typy kvadratické rovnice (ryze kvadratická, neúplná, úplná). Podmínky pro počet reálných kořenů (D>0, D=0, D<0). Podmínky na kořeny (oba kladné, záporné, různých znamének). Přidej systematický postup a příklady.` },
  { num: '12', title: 'Posloupnosti a řady; finanční matematika',
    prompt: `Zpracuj maturitní okruh: Posloupnosti, řady a finanční matematika.
Zahrň: definice posloupnosti, způsoby zadání (vzorcem, rekurentně). Aritmetická posloupnost: diferenece d, vzorec aₙ=a₁+(n-1)d, součet Sₙ=n(a₁+aₙ)/2. Geometrická posloupnost: kvocient q, vzorec aₙ=a₁·qⁿ⁻¹, součet Sₙ=a₁(qⁿ-1)/(q-1). Nekonečná geometrická řada: S=a₁/(1-q) pro |q|<1. Finanční matematika: jednoduché a složené úročení, vzorec Kₙ=K₀(1+i)ⁿ, úrokovací období, RPSN, půjčky a úvěry, umořování (anuita). Přidej příklady výpočtů.` },
  { num: '13', title: 'Kombinatorika; binomická věta',
    prompt: `Zpracuj maturitní okruh: Kombinatorika a binomická věta.
Zahrň: pravidlo součtu a součinu. Variace bez opakování V(k,n)=n!/(n-k)!, variace s opakováním V'(k,n)=nᵏ. Permutace bez opakování P(n)=n!, permutace s opakováním P'(n;n₁,...,nₖ)=n!/(n₁!·...·nₖ!). Kombinace bez opakování C(k,n)=n!/(k!(n-k)!), kombinační číslo (n nad k). Vlastnosti kombinačních čísel. Binomická věta: (a+b)ⁿ=Σ C(k,n)·aⁿ⁻ᵏ·bᵏ, Pascalův trojúhelník, určení konkrétního členu rozvoje. Přidej příklady.` },
  { num: '14', title: 'Pravděpodobnost; statistika',
    prompt: `Zpracuj maturitní okruh: Pravděpodobnost a statistika.
Zahrň: náhodný pokus, elementární jevy, jev jistý a nemožný, pravděpodobnost P(A)=|A|/|Ω|. Operace s jevy: sjednocení, průnik, doplněk. Sčítání pravděpodobností: P(A∪B)=P(A)+P(B)-P(A∩B). Násobení pravděpodobností: nezávislé jevy P(A∩B)=P(A)·P(B), podmíněná pravděpodobnost. Geometrická pravděpodobnost. Statistika: statistický soubor, četnosti (absolutní, relativní, kumulativní), grafy (histogram, koláčový, sloupcový). Charakteristiky polohy: průměr, medián, modus. Charakteristiky variability: rozptyl, směrodatná odchylka, variační rozpětí. Přidej příklady.` },
  { num: '15', title: 'Trojúhelník',
    prompt: `Zpracuj maturitní okruh: Trojúhelník.
Zahrň: základní vlastnosti (součet úhlů 180°, trojúhelníková nerovnost), druhy trojúhelníků. Obvod a obsah: S=a·h/2, Heronův vzorec. Shodnost trojúhelníků (sss, sus, usu, Ssu). Podobnost trojúhelníků (podmínky, poměr podobnosti, poměr obsahů). Pravoúhlý trojúhelník: Pythagorova věta a²+b²=c², goniometrické funkce v pravoúhlém trojúhelníku. Střední příčky, těžnice, výšky, osy stran a úhlů — vlastnosti a průsečíky (těžiště, ortocentrum, střed kružnice opsané/vepsané). Konstrukční úlohy. Izometrie: středová souměrnost, osová souměrnost, otočení, posunutí. Stejnolehlost. Přidej vzorce a příklady.` },
  { num: '16', title: 'Mnohoúhelníky',
    prompt: `Zpracuj maturitní okruh: Mnohoúhelníky.
Zahrň: obecné vlastnosti mnohoúhelníků, konvexní a nekonvexní, součet vnitřních úhlů (n-2)·180°. Čtyřúhelníky — rozdělení: rovnoběžníky (čtverec, obdélník, kosočtverec, kosodélník), lichoběžník, deltoid. Vlastnosti, obvody a obsahy každého druhu: čtverec a²; obdélník a·b; kosočtverec d₁·d₂/2; kosodélník a·h; lichoběžník (a+c)·h/2. Pravidelné mnohoúhelníky: vzorec pro obsah a obvod. Konstrukční úlohy. Izometrie a stejnolehlost. Přidej přehlednou tabulku vzorců.` },
  { num: '17', title: 'Kružnice, kruh a jejich části',
    prompt: `Zpracuj maturitní okruh: Kružnice, kruh a jejich části.
Zahrň: definice kružnice a kruhu, rovnice kružnice (x-a)²+(y-b)²=r². Obvod kružnice 2πr, obsah kruhu πr². Části: oblouk, kruhová výseč (obsah πr²α/360°, délka oblouku 2πrα/360°), kruhová úseč. Vzájemná poloha přímky a kružnice (sečna, tečna, vnější přímka) — podmínky pomocí vzdálenosti středu. Tečna ke kružnici — vlastnosti. Úhly v kružnici: středový úhel, obvodový úhel (Thaletova věta), úhel tečny a tětivy. Konstrukční úlohy. Izometrie. Přidej vzorce a příklady.` },
  { num: '18', title: 'Trigonometrie',
    prompt: `Zpracuj maturitní okruh: Trigonometrie — řešení obecného trojúhelníku.
Zahrň: sinová věta a/sinα = b/sinβ = c/sinγ = 2R. Kosinová věta a²=b²+c²-2bc·cosα. Obsah obecného trojúhelníku S=ab·sinγ/2. Postup řešení trojúhelníku podle zadaných prvků (sss, sus, usu, Ssu, ssú). Praktické úlohy: výškový úhel (elevace), hloubkový úhel (deprese), výpočet výšky budovy, vzdálenosti nedostupného bodu. Přidej vzorce, schémata a příklady praktických úloh.` },
  { num: '19', title: 'Polohové a metrické vlastnosti útvarů v prostoru (stereometrie)',
    prompt: `Zpracuj maturitní okruh: Stereometrie — polohové a metrické vlastnosti.
Zahrň: základní pojmy (bod, přímka, rovina v prostoru). Vzájemné polohy dvou přímek: rovnoběžné, různoběžné, mimoběžné. Vzájemné polohy přímky a roviny: přímka v rovině, rovnoběžná s rovinou, různoběžná (průsečík). Vzájemné polohy dvou rovin: totožné, rovnoběžné, různoběžné (průsečnice). Řezy těles rovinou. Vzdálenosti: dva body, bod a přímka, dvě rovnoběžné přímky, bod a rovina, přímka rovnoběžná s rovinou, dvě rovnoběžné roviny. Odchylky: dvou přímek, přímky a roviny, dvou rovin. Přidej příklady výpočtů.` },
  { num: '20', title: 'Povrch a objem mnohostěnů',
    prompt: `Zpracuj maturitní okruh: Povrch a objem mnohostěnů.
Zahrň: hranoly (přímý, kosý, pravidelný) — povrch S=2·Sₚ+n·a·v, objem V=Sₚ·v. Jehlany — povrch S=Sₚ+n·Sₛ, objem V=Sₚ·v/3. Komolý jehlan — povrch a objem. Pravidelné mnohostěny (Platónská tělesa) — přehled. Přidej přehlednou tabulku vzorců pro všechny typy, schémata těles a příklady výpočtů s číselnými hodnotami.` },
  { num: '21', title: 'Povrch a objem rotačních těles',
    prompt: `Zpracuj maturitní okruh: Povrch a objem rotačních těles.
Zahrň: válec — povrch S=2πr²+2πrv, objem V=πr²v. Kužel — povrch S=πr²+πrs (s=šikmá výška), objem V=πr²v/3. Komolý kužel — povrch S=π(r₁²+r₂²+s(r₁+r₂)), objem V=πv(r₁²+r₁r₂+r₂²)/3. Koule — povrch S=4πr², objem V=4πr³/3. Kulová vrstva, kulová výseč, kulový úsek. Přidej přehlednou tabulku vzorců, schémata a příklady výpočtů.` },
  { num: '22', title: 'Vektorová algebra v rovině i v prostoru',
    prompt: `Zpracuj maturitní okruh: Vektorová algebra.
Zahrň: orientovaná úsečka, vektor jako třída ekvivalence, souřadnice vektoru AB=(b₁-a₁, b₂-a₂). Velikost vektoru |v|=√(v₁²+v₂²). Operace: součet, rozdíl, násobení skalárem. Skalární součin: u·v=u₁v₁+u₂v₂, u·v=|u|·|v|·cosφ — výpočet úhlu, podmínka kolmosti (u·v=0) a rovnoběžnosti. Vektorový součin (v prostoru): u×v, velikost |u×v|=|u|·|v|·sinφ — obsah rovnoběžníku, podmínka rovnoběžnosti. Smíšený součin — objem rovnoběžnostěnu. Přidej příklady výpočtů.` },
  { num: '23', title: 'Polohové úlohy v analytické geometrii',
    prompt: `Zpracuj maturitní okruh: Polohové úlohy v analytické geometrii.
Zahrň: rovnice přímky v rovině (obecná ax+by+c=0, směrnicová y=kx+q, parametrická, úsečková). Vzájemná poloha dvou přímek v rovině (rovnoběžné, totožné, různoběžné — výpočet průsečíku). Rovnice roviny v prostoru (obecná ax+by+cz+d=0, parametrická). Vzájemná poloha přímky a roviny v prostoru. Vzájemná poloha dvou rovin. Vzájemná poloha dvou přímek v prostoru (rovnoběžné, různoběžné, mimoběžné). Přidej systematický postup a příklady.` },
  { num: '24', title: 'Metrické úlohy v analytické geometrii',
    prompt: `Zpracuj maturitní okruh: Metrické úlohy v analytické geometrii.
Zahrň: vzdálenost dvou bodů d=√((x₂-x₁)²+(y₂-y₁)²). Vzdálenost bodu od přímky v rovině d=|ax₀+by₀+c|/√(a²+b²). Vzdálenost bodu od roviny v prostoru d=|ax₀+by₀+cz₀+d|/√(a²+b²+c²). Vzdálenost dvou rovnoběžných přímek. Vzdálenost přímky a roviny. Vzdálenost dvou rovnoběžných rovin. Odchylka dvou přímek (cosφ=|u·v|/(|u||v|)). Odchylka přímky a roviny. Odchylka dvou rovin. Přidej vzorce a příklady výpočtů.` },
  { num: '25', title: 'Kuželosečky',
    prompt: `Zpracuj maturitní okruh: Kuželosečky.
Zahrň: definice jako průnik roviny s kuželem. Kružnice: (x-a)²+(y-b)²=r², střed, poloměr. Elipsa: x²/a²+y²/b²=1, střed, poloosa a,b, ohniska F₁F₂, excentricita e=c/a, c²=a²-b². Hyperbola: x²/a²-y²/b²=1, asymptoty y=±(b/a)x, ohniska, excentricita e>1. Parabola: y²=2px nebo x²=2py, ohnisko, řídící přímka, parametr p. Obecná rovnice kuželosečky. Vzájemná poloha přímky a kuželosečky (sečna, tečna, vnější přímka) — podmínky pomocí diskriminantu. Přidej grafy, vzorce a příklady.` },
];

// ── BUILD MAT ───────────────────────────────────────────────────
async function buildMAT() {
  console.log('\n📁 MAT — Matematika (maturitní okruhy + přijímačky UHK)');
  const topics = [];

  const MAT_GEMINI_PROMPT = `Jsi expert na středoškolskou matematiku a tvorbu studijních materiálů pro maturanty.
Dostaneš zadání maturitního okruhu z matematiky (CERMAT didaktický test).

Tvůj úkol: Vytvoř KOMPLETNÍ, KRÁSNĚ NAFORMÁTOVANÝ studijní materiál v Markdownu.

PRAVIDLA FORMÁTOVÁNÍ:
- Používej ## pro hlavní sekce, ### pro podsekce
- Používej **tučné** pro klíčové pojmy, vzorce a definice
- Používej > pro důležité definice, věty a pravidla
- Používej - pro odrážky, čísla pro postupy
- Používej \`kód\` pro matematické symboly a zkratky
- Vzorce piš přehledně, vysvětli každý symbol
- Přidej konkrétní ČÍSELNÉ PŘÍKLADY s postupem řešení
- Přidej sekci "Časté chyby" nebo "Maturitní tipy"
- Materiál musí být ROZSÁHLÝ a KOMPLETNÍ — student se z něj musí naučit celý okruh
- Text musí být v češtině
- NEVYNECHÁVEJ nic z požadovaného obsahu

Vrať POUZE Markdown text, bez úvodního komentáře, bez \`\`\`markdown bloků.`;

  const UHK_GEMINI_PROMPT = `Jsi expert na přijímací zkoušky z matematiky na vysoké školy v ČR, zejména FIM UHK (Fakulta informatiky a managementu, Univerzita Hradec Králové).

Tvůj úkol: Vytvoř KOMPLETNÍ, KRÁSNĚ NAFORMÁTOVANÝ studijní materiál v Markdownu — přípravu na přijímací zkoušku.

PRAVIDLA FORMÁTOVÁNÍ:
- Používej ## pro hlavní sekce (každé téma), ### pro podsekce (Teorie / Příklady / Chyby)
- Používej **tučné** pro klíčové vzorce, definice a upozornění
- Používej > pro důležitá pravidla a varování
- Používej - pro odrážky, čísla pro kroky postupu
- Vzorce piš přehledně s vysvětlením každého symbolu
- U každého příkladu uveď KOMPLETNÍ POSTUP ŘEŠENÍ krok za krokem
- Materiál musí být VELMI ROZSÁHLÝ — student se z něj musí připravit na celý test
- Text musí být v češtině

Vrať POUZE Markdown text, bez úvodního komentáře, bez \`\`\`markdown bloků.`;

  for (const topic of MAT_TOPICS) {
    process.stdout.write(`  MAT-${topic.num.padStart(2,'0')} ${topic.title.substring(0,40).padEnd(40)}...`);

    const cacheKey = `mat_${topic.num}`;
    const cacheFile = path.join(CACHE_DIR, cacheKey + '.md');

    let content = '';

    // Check cache
    if (fs.existsSync(cacheFile)) {
      const cached = fs.readFileSync(cacheFile, 'utf8');
      if (cached.length > 100) {
        content = cached;
        process.stdout.write(' [cache]');
      }
    }

    if (!content) {
      if (model) {
        try {
          const systemPrompt = topic.num === '0' ? UHK_GEMINI_PROMPT : MAT_GEMINI_PROMPT;
          const fullPrompt = `${systemPrompt}\n\n---\nTÉMA: ${topic.title}\n\nZADÁNÍ:\n${topic.prompt}`;
          const result = await model.generateContent(fullPrompt);
          content = result.response.text().trim();
          fs.writeFileSync(cacheFile, content, 'utf8');
          process.stdout.write(' [AI✓]');
          await sleep(400);
        } catch (err) {
          console.error(`\n  ⚠ Gemini error pro MAT-${topic.num}: ${err.message}`);
          content = `## ${topic.title}\n\n${topic.prompt}`;
        }
      } else {
        content = `## ${topic.title}\n\n${topic.prompt}`;
      }
    }

    topics.push({ id: `mat-${topic.num}`, num: topic.num, title: topic.title, content });
    console.log(` ✓ (${content.length} chars)`);
  }

  return {
    id: 'mat',
    name_cs: 'Matematika',
    name_en: 'Mathematics',
    icon: '📐',
    desc_cs: 'Maturitní okruhy — algebra, geometrie, analýza, statistika',
    desc_en: 'Matura topics — algebra, geometry, analysis, statistics',
    color: 'mat',
    topics,
  };
}
async function buildKYB() {
  console.log('\n📁 KYB — Kybernetická bezpečnost');
  const topics = [];

  // DOCX files in KYB/
  const kybFiles = fs.readdirSync('KYB').filter(f => f.endsWith('.docx')).sort((a,b) => {
    const na = parseInt(a); const nb = parseInt(b);
    return na - nb;
  });

  const docxMap = {};
  for (const file of kybFiles) {
    const num = file.match(/^(\d+)/)?.[1];
    if (num) docxMap[num] = path.join('KYB', file);
  }

  // Also check 00 Škola/Otázky/KYB for MD files (main school notes)
  const kybMdDir = '00 Škola/Otázky/KYB';
  const kybMdMap = {};
  if (fs.existsSync(kybMdDir)) {
    fs.readdirSync(kybMdDir).filter(f => f.endsWith('.md')).forEach(f => {
      const numMatch = f.match(/^(\d+)\./);
      if (numMatch) kybMdMap[numMatch[1]] = path.join(kybMdDir, f);
    });
  }
  // Also check 00 Škola/IOT/Kybernetika
  const kybMdDir2 = '00 Škola/IOT/Kybernetika';
  if (fs.existsSync(kybMdDir2)) {
    fs.readdirSync(kybMdDir2).filter(f => f.endsWith('.md')).forEach(f => {
      const numMatch = f.match(/^(\d+)\./);
      if (numMatch && !kybMdMap[numMatch[1]]) kybMdMap[numMatch[1]] = path.join(kybMdDir2, f);
    });
  }

  for (let n = 1; n <= 20; n++) {
    const num = String(n);
    const title = KYB_TITLES[num];
    process.stdout.write(`  KYB-${num.padStart(2,'0')} ${title.substring(0,35).padEnd(35)}...`);

    let rawContent = '';

    if (docxMap[num]) {
      rawContent = await readDocx(docxMap[num]);
    } else if (KYB_INLINE[num]) {
      rawContent = KYB_INLINE[num];
    }

    // Check for matching MD in 00 Škola (by number)
    if (kybMdMap[num]) {
      const mdContent = readMd(kybMdMap[num]);
      rawContent = rawContent ? rawContent + '\n\n' + mdContent : mdContent;
    }

    let content = rawContent;
    if (rawContent && rawContent.length > 30) {
      content = await geminiFormat(rawContent, title, `kyb-${num}`);
      await sleep(300); // rate limit
    }

    topics.push({ id: `kyb-${num}`, num, title, content: content || '' });
    console.log(` ✓ (${content.length} chars)`);
  }

  return {
    id: 'kyb',
    name_cs: 'Kybernetická bezpečnost',
    name_en: 'Cybersecurity',
    icon: '🛡️',
    desc_cs: 'Sítě, bezpečnost, hardware, protokoly, hrozby',
    desc_en: 'Networks, security, hardware, protocols, threats',
    color: 'kyb',
    topics,
  };
}

// ── BUILD PRG ───────────────────────────────────────────────────
async function buildPRG() {
  console.log('\n📁 PRG — Programování');
  const topics = [];

  const prgFiles = fs.readdirSync('PRG').filter(f => f.endsWith('.docx')).sort((a,b) => parseInt(a) - parseInt(b));

  for (const file of prgFiles) {
    const num = file.match(/^(\d+)/)?.[1];
    if (!num) continue;
    const titleMatch = file.replace(/^\d+\.\s*/, '').replace('.docx', '').trim();
    const title = titleMatch;
    process.stdout.write(`  PRG-${num.padStart(2,'0')} ${title.substring(0,35).padEnd(35)}...`);

    const rawContent = await readDocx(path.join('PRG', file));
    let content = rawContent;
    if (rawContent.length > 30) {
      content = await geminiFormat(rawContent, title, `prg-${num}`);
      await sleep(300);
    }

    topics.push({ id: `prg-${num}`, num, title, content });
    console.log(` ✓ (${content.length} chars)`);
  }

  // Also check 00 Škola/IOT/Programko for MD extras
  const prgMdDir = '00 Škola/IOT/Programko';
  if (fs.existsSync(prgMdDir)) {
    const mdFiles = fs.readdirSync(prgMdDir).filter(f => f.endsWith('.md'));
    for (const f of mdFiles) {
      const title = f.replace('.md','');
      const rawContent = readMd(path.join(prgMdDir, f));
      process.stdout.write(`  PRG-md ${title.substring(0,35).padEnd(35)}...`);
      let content = rawContent;
      if (rawContent.length > 30) {
        content = await geminiFormat(rawContent, title, `prg-md-${slug(title)}`);
        await sleep(300);
      }
      const id = `prg-${slug(title)}`;
      if (!topics.find(t => t.id === id)) {
        topics.push({ id, num: '', title, content });
        console.log(` ✓ (${content.length} chars)`);
      }
    }
  }

  return {
    id: 'prg',
    name_cs: 'Programování',
    name_en: 'Programming',
    icon: '💻',
    desc_cs: 'HTML, CSS, C#, OOP, databáze, algoritmy, robotika',
    desc_en: 'HTML, CSS, C#, OOP, databases, algorithms, robotics',
    color: 'prg',
    topics,
  };
}

// ── BUILD CES ───────────────────────────────────────────────────
async function buildCES() {
  console.log('\n📁 Čeština — Čtenářský deník');
  const topics = [];

  const cesFiles = fs.readdirSync('Čeština').filter(f => f.endsWith('.docx')).sort();

  for (const file of cesFiles) {
    const title = file.replace('.docx','').trim();
    const id = `ces-${slug(title)}`;
    process.stdout.write(`  CES ${title.substring(0,35).padEnd(35)}...`);

    let rawContent = await readDocx(path.join('Čeština', file));

    // Check for matching MD in 00 Škola/Čeština/Čtenářák
    const mdPath = `00 Škola/Čeština/Čtenářák/${title}.md`;
    if (fs.existsSync(mdPath)) {
      const mdContent = readMd(mdPath);
      rawContent = rawContent ? rawContent + '\n\n' + mdContent : mdContent;
    }

    let content = rawContent;
    if (rawContent.length > 30) {
      content = await geminiFormat(rawContent, title, `ces-${slug(title)}`);
      await sleep(300);
    }

    topics.push({ id, num: '', title, content });
    console.log(` ✓ (${content.length} chars)`);
  }

  // Add MD-only books from 00 Škola that don't have DOCX
  const cesMdDir = '00 Škola/Čeština/Čtenářák';
  if (fs.existsSync(cesMdDir)) {
    const mdFiles = fs.readdirSync(cesMdDir).filter(f => f.endsWith('.md') && !f.startsWith('A '));
    for (const f of mdFiles) {
      const title = f.replace('.md','').trim();
      const id = `ces-${slug(title)}`;
      if (topics.find(t => t.id === id)) continue; // already added
      process.stdout.write(`  CES-md ${title.substring(0,35).padEnd(35)}...`);
      const rawContent = readMd(path.join(cesMdDir, f));
      let content = rawContent;
      // Always try geminiFormat — it checks cache first, so placeholder files still get cached content
      content = await geminiFormat(rawContent.length > 30 ? rawContent : `Rozbor díla: ${title}`, title, `ces-md-${slug(title)}`);
      await sleep(300);
      topics.push({ id, num: '', title, content });
      console.log(` ✓ (${content.length} chars)`);
    }
  }

  return {
    id: 'ces',
    name_cs: 'Český jazyk',
    name_en: 'Czech Language',
    icon: '📚',
    desc_cs: 'Čtenářský deník — rozbory literárních děl',
    desc_en: 'Reading journal — literary analysis',
    color: 'ces',
    topics,
  };
}


// ── ANG TOPICS ──────────────────────────────────────────────────
const ANG_TOPICS = [
  { num: '1', title: 'Describing a Person',
    prompt: `Maturitni tema anglictina: Popis a charakteristika osoby (Describing a Person).
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:
- Fyzicky popis: vzhled, vek, vyska, vlasy, oci, obleceni (vocabulary: tall/short/slim/overweight, blonde/brunette/bald, blue-eyed atd.)
- Povahove vlastnosti: positive (kind, reliable, outgoing, ambitious) vs negative (stubborn, selfish, lazy) - aspon 15 adjektiv s prekladem
- Jak popsat charakter: He/She is known for..., tends to..., is the type of person who...
- Popis slavnych osobnosti (kratky priklad)
- Uzitecne fraze pro rozhovor: In my opinion, I would describe myself as..., My best friend is...
- Mozne otazky zkousejiciho a kratke odpovedi
Pis v cestine, anglicke vyrazy tucne.` },

  { num: '2', title: 'Global Problems',
    prompt: `Maturitni tema anglictina: Globalni problemy lidstva (Global Problems).
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:
- Hlavni globalni problemy: climate change, poverty, hunger, terrorism, wars, pandemics, overpopulation, pollution, deforestation, water shortage
- Ke kazdemu problemu: co to je, priciny, dusledky, mozna reseni (2-3 vety)
- Klicova slovni zasoba: greenhouse effect, carbon footprint, renewable energy, sustainable development, NGO, UN, WHO
- Statistiky: napr. 700 mil lidi v extreme poverty, 1.5°C global warming target
- Uzitecne fraze: The most serious problem is..., We should..., Governments need to...
- Mozne otazky zkousejiciho
Pis v cestine, anglicke vyrazy tucne.` },

  { num: '3', title: 'Housing',
    prompt: `Maturitni tema anglictina: Bydleni (Housing).
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:
- Typy bydleni: detached house, semi-detached, terraced house, flat/apartment, cottage, mansion, studio
- Mistnosti a vybaveni: living room, bedroom, kitchen, bathroom, attic, cellar - vybaveni kazde mistnosti
- Vlastnictvi vs. najem: mortgage, rent, landlord, tenant, deposit
- Idealni bydleni - jak ho popsat
- Bydleni v CR vs. UK/USA: rozdily, ceny, trendy
- Uzitecne fraze: I live in..., My dream home would be..., The house consists of...
- Mozne otazky zkousejiciho
Pis v cestine, anglicke vyrazy tucne.` },

  { num: '4', title: 'Customs and Traditions',
    prompt: `Maturitni tema anglictina: Zvyky a tradice (Customs and Traditions).
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:
- Ceske tradice: Vanoce (Christmas Eve dinner, carp, gifts), Velikonoce (whipping, painted eggs), Masopust, Mikulase, Silvestr
- Britske tradice: Guy Fawkes Night (5.11.), Boxing Day (26.12.), Bonfire Night, afternoon tea, pub culture, Trooping the Colour
- Americke tradice: Thanksgiving (4. ctvrtek listopadu, turkey, pilgrims), Halloween (31.10.), 4th of July, Super Bowl Sunday
- Svatky: public holidays v UK a USA
- Uzitecne fraze: It is traditional to..., We celebrate..., The custom dates back to...
- Mozne otazky zkousejiciho
Pis v cestine, anglicke vyrazy tucne.` },

  { num: '5', title: 'Education',
    prompt: `Maturitni tema anglictina: Vzdelani (Education).
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:
- Skolsky system v CR: materska, zakladni (1.-9. rocnik), stredni (gymnazium, SOŠ, SOU), vysoka skola, maturita
- Skolsky system v UK: primary school (5-11), secondary school (11-16), sixth form/college (16-18), GCSE, A-levels, university (Bachelor/Master/PhD), Oxbridge (Oxford, Cambridge)
- Skolsky system v USA: elementary, middle school, high school, college/university, SAT/ACT, Ivy League (Harvard, Yale, MIT, Princeton...)
- Typy skol: state/public vs. private/independent, boarding school
- Klicova slovni zasoba: curriculum, tuition fees, scholarship, degree, graduate, undergraduate, semester, GPA
- Vyhody/nevyhody ruznych systemu
- Uzitecne fraze
Pis v cestine, anglicke vyrazy tucne.` },

  { num: '6', title: 'My Region',
    prompt: `Maturitni tema anglictina: Kraj, ve kterem studuji (My Region - Kralovehradecky kraj).
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:
- Kralovehradecky kraj: poloha (vychodni Cechy), rozloha (4758 km2), pocet obyvatel (~550 000), krajske mesto Hradec Kralove
- Hradec Kralove: ~90 000 obyvatel, historicke centrum, Bile mesto (architektura Jana Kotery a Josefa Gocare), UHK (Univerzita Hradec Kralove), Muzeum vychodních Cech
- Dvur Kralove nad Labem: Safari Park (nejvetsi v CR a stredni Evrope), textilni tradice
- Krkonose: nejvyssi pohoří CR, Snezka (1603 m), Spindleruv Mlyn, Pec pod Snezkou, KRNAP (Krkonossky narodni park)
- Adrspassko-Teplicke skaly, Broumovsko
- Prumysl: textil, strojirenstvi, farmaceutika (Galen)
- Uzitecne fraze pro popis regionu
Pis v cestine, anglicke vyrazy tucne.` },

  { num: '7', title: 'Sport',
    prompt: `Maturitni tema anglictina: Sport.
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:
- Typy sportu: team sports (football/soccer, basketball, volleyball, hockey), individual sports (tennis, swimming, athletics, cycling), extreme sports (snowboarding, rock climbing)
- Nejpopularnejsi sporty v CR: hokej, fotbal, tenis (Navratilova, Berdych, Kvitova), atletika (Zatopek - 3x zlato OH 1952)
- Sporty v UK: football (Premier League, Arsenal/Chelsea/Man Utd/Liverpool), cricket, rugby, tennis (Wimbledon)
- Sporty v USA: American football (NFL, Super Bowl), baseball (MLB), basketball (NBA - Lakers, Bulls), ice hockey (NHL)
- Olympijske hry: letni vs. zimni, historie, nejuspesnejsi zeme
- Zdravotni benefity sportu
- Klicova slovni zasoba: championship, tournament, referee, score, defeat, victory, athlete, coach
- Uzitecne fraze
Pis v cestine, anglicke vyrazy tucne.` },

  { num: '8', title: 'Interpersonal Relationships',
    prompt: `Maturitni tema anglictina: Mezilidske vztahy (Interpersonal Relationships).
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:
- Typy vztahu: family (nuclear family, extended family, single-parent family), friendship, romantic relationships, colleagues
- Rodina: clenove rodiny a jejich role, generacni rozdily, rozvod, adopce
- Pratelstvi: jak se pratelstvi navazuje a udrzuje, online vs. offline pratelstvi
- Romanticky vztah: dating, engagement, marriage, divorce - slovni zasoba
- Konflikty a jejich reseni: argument, misunderstanding, compromise, forgiveness
- Socialni site a vztahy: vliv na mezilidske vztahy
- Klicova slovni zasoba: trustworthy, supportive, jealous, loyal, commitment, break up
- Uzitecne fraze
Pis v cestine, anglicke vyrazy tucne.` },

  { num: '9', title: 'Travel',
    prompt: `Maturitni tema anglictina: Cestovani (Travel).
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:
- Dopravni prostredky: plane (airport, check-in, boarding pass, departure/arrival), train, bus, car, ship/cruise
- Typy cestovani: package holiday, backpacking, city break, road trip, cruise, camping
- Ubytovani: hotel (star rating, reception, check-in/out), hostel, Airbnb, camping
- Cestovni dokumenty: passport, visa, travel insurance, boarding pass
- Oblibene destinace: top 5 nejnavstevovanejsich zemi sveta (Francie, Spanelsko, USA, Cina, Italie)
- Cestovani v CR: turisticke atrakce, Cesky Krumlov, Praha, Brno
- Klicova slovni zasoba: itinerary, sightseeing, souvenir, jet lag, currency exchange
- Uzitecne fraze: I would like to visit..., Have you ever been to...
Pis v cestine, anglicke vyrazy tucne.` },

  { num: '10', title: 'Health and Healthy Lifestyle',
    prompt: `Maturitni tema anglictina: Zdravi, zdravy zivotni styl (Health and Healthy Lifestyle).
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:
- Zdravy zivotni styl: balanced diet, regular exercise, enough sleep (7-9 hodin), no smoking/alcohol, stress management
- Nemoci a symptomy: cold, flu, headache, fever, sore throat, allergy, diabetes, cancer, obesity - slovni zasoba
- U lekare: GP (general practitioner), specialist, prescription, diagnosis, treatment, surgery, hospital
- Zdravotni system v CR vs. UK (NHS - National Health Service, bezplatna zdravotni pece) vs. USA (soukrome pojisteni, drahe)
- Mentalni zdravi: stress, anxiety, depression, therapy, mindfulness
- Klicova slovni zasoba: symptom, diagnosis, prescription, vaccination, epidemic, pandemic
- Uzitecne fraze
Pis v cestine, anglicke vyrazy tucne.` },
];

const ANG_TOPICS_2 = [
  { num: '11', title: 'Food and Drink',
    prompt: `Maturitni tema anglictina: Jidlo, piti (Food and Drink).
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:
- Ceska kuchyne: svickova, gulas, knedliky, bramborak, trdelnik, pivo (CR - nejvyssi spotreba piva na osobu na svete ~180 l/rok)
- Britska kuchyne: fish and chips, full English breakfast (bacon, eggs, beans, toast, sausages), Sunday roast, scones, tea culture (5 o'clock tea)
- Americka kuchyne: hamburger, hot dog, BBQ, pancakes, fast food kultura (McDonald's, KFC, Burger King)
- Stravovaci navyky: breakfast/lunch/dinner, snack, brunch
- Diety a trendy: vegetarian, vegan, gluten-free, organic food
- Restaurace: menu, starter/main course/dessert, bill, tip, reservation
- Klicova slovni zasoba: ingredients, recipe, cuisine, nutritious, calorie, portion
- Uzitecne fraze: I am a big fan of..., My favourite dish is..., I tend to avoid...
Pis v cestine, anglicke vyrazy tucne.` },

  { num: '12', title: 'Shopping',
    prompt: `Maturitni tema anglictina: Nakupovani (Shopping).
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:
- Typy obchodu: supermarket, department store, boutique, market, shopping mall, online shop
- Slavne nakupni ulice: Oxford Street (Londyn), 5th Avenue (New York), Champs-Elysees (Pariz)
- Online nakupovani: Amazon, eBay, vyhody (pohodli, cena) vs. nevyhody (nelze zkusit, vraceni)
- Platba: cash, credit/debit card, contactless, PayPal, cryptocurrency
- Obleceni a moda: fashion trends, fast fashion vs. sustainable fashion, second-hand
- Reklamace: complaint, refund, exchange, receipt, warranty
- Klicova slovni zasoba: bargain, discount, sale, receipt, fitting room, queue, checkout
- Uzitecne fraze: Can I try this on?, I am looking for..., Do you have this in a different size?
Pis v cestine, anglicke vyrazy tucne.` },

  { num: '13', title: 'Work and Employment',
    prompt: `Maturitni tema anglictina: Prace a zamestnani (Work and Employment).
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:
- Typy zamestnani: full-time, part-time, freelance, self-employed, remote work/home office
- Hledani prace: CV/resume, cover letter, job interview, job advertisement, LinkedIn
- Pracovni podmínky: salary/wage, benefits (sick leave, holiday pay, pension), working hours, overtime
- Karierni postup: promotion, raise, training, internship, apprenticeship
- Nezamestnanost: unemployment rate, job centre, benefits
- Prace v IT: software developer, cybersecurity analyst, network engineer, data scientist - poptavka na trhu
- Klicova slovni zasoba: employer, employee, colleague, deadline, resign, redundancy, trade union
- Uzitecne fraze pro pohovor: I have experience in..., My strengths are..., I am a team player
Pis v cestine, anglicke vyrazy tucne.` },

  { num: '14', title: 'Transport',
    prompt: `Maturitni tema anglictina: Doprava (Transport).
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:
- Pozemni doprava: car (advantages: flexibility; disadvantages: traffic jams, pollution), bus, tram, metro/underground (London Tube - nejstarsi metro na svete, 1863), train (Eurostar, TGV, ICE)
- Letecka doprava: airport (Heathrow - nejrušnejsi v Evrope, ~80 mil pasazeru/rok), low-cost airlines (Ryanair, easyJet)
- Vodni doprava: ferry, cruise ship, cargo ship
- Budoucnost dopravy: electric cars (Tesla), hydrogen cars, autonomous vehicles, hyperloop, e-scooters
- Dopravni problemy: traffic congestion, road accidents, carbon emissions, parking
- Infrastruktura: motorway, highway, roundabout, traffic lights
- Klicova slovni zasoba: commute, rush hour, timetable, platform, delay, fare
- Uzitecne fraze
Pis v cestine, anglicke vyrazy tucne.` },

  { num: '15', title: 'Society',
    prompt: `Maturitni tema anglictina: Spolecnost (Society).
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:
- Socialni problemy: poverty, homelessness, crime, drug abuse, racism, discrimination, gender inequality
- Socialni skupiny: generation Z/millennials/baby boomers - rozdily a konflikty
- Politicky system: democracy, monarchy, republic - typy vlad
- Lidska prava: UN Declaration of Human Rights (1948), freedom of speech, right to education
- Multikulturalismus: immigration, integration, diversity, tolerance
- Dobrovolnictvi a charita: NGO, volunteering, fundraising
- Klicova slovni zasoba: inequality, welfare state, social security, prejudice, stereotype, minority
- Uzitecne fraze: Society should..., In my view, the biggest social issue is...
Pis v cestine, anglicke vyrazy tucne.` },

  { num: '16', title: 'Culture',
    prompt: `Maturitni tema anglictina: Kultura (Culture).
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:
- Typy kultury: music (classical, pop, rock, jazz, hip-hop), film, theatre, literature, visual arts
- Hudba: slavni britsti umelci (Beatles, Rolling Stones, Adele, Ed Sheeran, Coldplay), americti (Elvis, Michael Jackson, Taylor Swift, Beyonce)
- Film: Hollywood vs. Bollywood, Oscar (Academy Awards), nejslavnejsi filmy vsech dob
- Divadlo: West End (Londyn) vs. Broadway (New York), muzikaly (Hamilton, Les Miserables, Phantom of the Opera)
- Muzea a galerie: British Museum, National Gallery, Tate Modern (Londyn); MoMA, Metropolitan Museum (New York)
- Ceska kultura: Narodni divadlo, Ceska filharmonie, Kafka, Kundera, Dvorak, Smetana
- Klicova slovni zasoba: exhibition, performance, premiere, genre, masterpiece, contemporary
- Uzitecne fraze
Pis v cestine, anglicke vyrazy tucne.` },

  { num: '17', title: 'Nature and Environment',
    prompt: `Maturitni tema anglictina: Priroda a zivotni prostredi (Nature and Environment).
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:
- Klimaticka zmena: greenhouse effect, global warming (1.1°C od prumysle revoluce), CO2 emise, tani ledovcu, vzestup hladiny mori
- Znecisteni: air pollution (PM2.5, NOx), water pollution (plastics - 8 mil tun plastu rocne do oceanu), soil pollution
- Odlesnovani: Amazon (9 mil km2, "plice Zeme"), biodiversity loss, extinction (1 mil druhu ohrozeno)
- Obnovitelne zdroje: solar, wind, hydro, geothermal - podil na energii (EU: ~40% z OZE v 2023)
- Reseni: Paris Agreement (2015, 195 zemi, limit 1.5°C), recycling, electric vehicles, veganism
- Prirodni katastrofy: earthquake, flood, hurricane, drought, wildfire
- Klicova slovni zasoba: carbon footprint, sustainability, ecosystem, biodiversity, deforestation
- Uzitecne fraze
Pis v cestine, anglicke vyrazy tucne.` },

  { num: '18', title: 'Services',
    prompt: `Maturitni tema anglictina: Sluzby (Services).
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:
- Typy sluzeb: healthcare, education, banking, postal services, emergency services (police, fire brigade, ambulance - 999 v UK, 911 v USA, 112 v EU)
- Bankovni sluzby: account (current/savings), loan, mortgage, interest rate, ATM, online banking, credit card
- Posta: letter, parcel, registered mail, courier (DHL, FedEx, UPS)
- Verejne sluzby: public transport, libraries, waste collection
- Digitalni sluzby: e-government, online banking, streaming (Netflix, Spotify), cloud storage
- Stiznosti a reklamace: complaint, customer service, refund
- Klicova slovni zasoba: insurance, subscription, utility bills, direct debit, invoice
- Uzitecne fraze: I would like to open an account..., I need to report a problem...
Pis v cestine, anglicke vyrazy tucne.` },

  { num: '19', title: 'Media',
    prompt: `Maturitni tema anglictina: Media (Media).
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:
- Typy medii: print (newspapers, magazines), broadcast (TV, radio), online (websites, social media, podcasts)
- Slavne medialni domy: BBC (British Broadcasting Corporation - zalozena 1927, verejnopravni), CNN, Fox News, New York Times, Guardian
- Socialni site: Facebook (3 mld uzivatelu), Instagram, TikTok, Twitter/X, YouTube, LinkedIn - vyhody a rizika
- Fake news a dezinformace: jak rozpoznat, fact-checking, media literacy
- Vliv medii na spolecnost: agenda-setting, propaganda, advertising
- Svoboda tisku: press freedom index (Finsko, Norsko - top; Severní Korea, Eritrea - bottom)
- Klicova slovni zasoba: journalist, editor, headline, broadcast, censorship, influencer, algorithm
- Uzitecne fraze
Pis v cestine, anglicke vyrazy tucne.` },

  { num: '20', title: 'Science and Technology',
    prompt: `Maturitni tema anglictina: Veda a technologie (Science and Technology).
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:
- Vyznamne vynalezy: internet (Tim Berners-Lee, 1989), smartphone (iPhone 2007), penicillin (Fleming 1928), electricity (Edison/Tesla), printing press (Gutenberg ~1440)
- IT a digitalni revoluce: cloud computing, big data, IoT (Internet of Things), 5G, blockchain
- Umela inteligence: machine learning, ChatGPT, autonomni vozidla, AI v medicine (diagnostika)
- Vesmirny vyzkum: NASA, SpaceX (Elon Musk), ISS, Mars mission, James Webb telescope
- Biotechnologie: CRISPR, gene editing, vaccines (mRNA - COVID-19)
- Etika technologii: privacy, surveillance, job automation, digital divide
- Klicova slovni zasoba: innovation, breakthrough, patent, prototype, algorithm, automation, robotics
- Uzitecne fraze: Technology has revolutionized..., The biggest challenge is...
Pis v cestine, anglicke vyrazy tucne.` },
];

const ANG_ODBORNE = [
  { num: 'it-1', title: 'IT Field — Popis oboru IT',
    prompt: `Maturitni odborne tema anglictina: Popis oboru IT (IT Field Description).
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:
- Co je IT: Information Technology = sprava systemu, vyvoj softwaru, kyberneticka bezpecnost, datova analyza, pocitacove site
- Hlavni oblasti IT: software development, networking, cybersecurity, data science, cloud computing, AI
- IT v praxi: pouziti v bankovnictvi, zdravotnictvi, doprave, vzdelani, zabave
- IT v Kralovehradeckem kraji: UHK FIM (Fakulta informatiky a managementu), IT firmy v regionu
- IT v CR: ceske IT firmy (Avast/Gen Digital, Kiwi.com, JetBrains), IT export, startup scena
- IT ve svete: Silicon Valley (Apple, Google, Meta, Amazon, Microsoft), globalni trh IT ~$5 bil/rok
- Klicova slovni zasoba: software, hardware, network, database, cloud, algorithm, cybersecurity, developer
- Uzitecne fraze pro rozhovor
Pis v cestine, anglicke vyrazy tucne.` },

  { num: 'it-2', title: 'Software',
    prompt: `Maturitni odborne tema anglictina: Software.
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:
- Definice software: programy a data, ktera ridí hardware
- Typy software: system software (OS: Windows ~75% market share, macOS, Linux, Android, iOS), application software (MS Office, browsers, games), utility software (antivirus, backup)
- Operacni systemy: Windows (Microsoft, 1985), macOS (Apple, 2001), Linux (Linus Torvalds, 1991, open-source), Android (Google, 2008)
- Vyvoj softwaru: programming languages (Python, Java, JavaScript, C#, C++), IDE (Visual Studio, VS Code, IntelliJ), version control (Git, GitHub)
- Licencovani: freeware (zdarma), shareware (zkusebni), open-source (GNU GPL, MIT), proprietary (placeny)
- Software updates: patches, security updates, bug fixes - proc jsou dulezite
- Klicova slovni zasoba: source code, compiler, debugger, update, patch, bug, interface, API, database, framework
Pis v cestine, anglicke vyrazy tucne.` },

  { num: 'it-3', title: 'Hardware',
    prompt: `Maturitni odborne tema anglictina: Hardware.
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:
- Definice hardware: fyzicke komponenty pocitace
- Hlavni komponenty PC: CPU/processor (Intel Core, AMD Ryzen - rychlost v GHz, jadra), RAM (operacni pamet, DDR5, GB), storage (HDD vs SSD - rychlost, kapacita, cena), GPU (graficka karta, NVIDIA GeForce, AMD Radeon), motherboard, PSU (zdroj), cooling (chladice, ventilatory)
- Periferie vstupni (input): keyboard, mouse, microphone, webcam, scanner, touchscreen
- Periferie vystupni (output): monitor (rozliseni 1080p/4K/8K, Hz), printer, speakers, headphones
- Porty a konektory: USB-A/C, HDMI, DisplayPort, Thunderbolt, Ethernet (RJ-45), audio jack
- Klicova slovni zasoba: processor speed, memory capacity, resolution, bandwidth, peripheral, component, upgrade
Pis v cestine, anglicke vyrazy tucne.` },

  { num: 'it-4', title: 'Types of Computers',
    prompt: `Maturitni odborne tema anglictina: Typy pocitacu a kazoddenni pouziti (Types of Computers).
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:
- Desktop PC: vykony, upgradovatelnost, pouziti v kancelari a pro gaming
- Laptop/notebook: prenosnost, baterie, pouziti na cestach a ve skole
- Tablet: dotykovy displej, iOS/Android, pouziti pro konzumaci obsahu
- Smartphone: nejpouzivanejsi zarizeni na svete (6.8 mld uzivatelu), Android vs iOS
- Server: 24/7 provoz, hosting webovych stranek, databaze, cloud
- Mainframe: velke korporace, banky, zpracovani milionu transakci/sec
- Supercomputer: vedecky vyzkum, simulace, AI trenovani; Frontier (USA, 1.1 exaFLOPS, nejrychlejsi 2024)
- Wearables: smartwatch (Apple Watch, Samsung Galaxy Watch), fitness tracker
- Kazoddenni pouziti: office work, gaming, video editing, programming, communication, entertainment
- Klicova slovni zasoba: portable, performance, battery life, touchscreen, processing power
Pis v cestine, anglicke vyrazy tucne.` },

  { num: 'it-5', title: 'IT Career',
    prompt: `Maturitni odborne tema anglictina: Kariera v oblasti IT (IT Career).
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:
- Nejzadavanejsi IT pozice: software developer/engineer (~$120k/rok USA), cybersecurity analyst (~$100k), data scientist (~$110k), network engineer, DevOps engineer, cloud architect, UX/UI designer, IT project manager
- Vzdelani: university (computer science, informatics), coding bootcamps (3-6 mesicu), online kurzy (Coursera, Udemy, edX), self-learning
- Certifikace: CompTIA Security+, CISSP, CEH (ethical hacking), AWS Certified, Google Cloud, Microsoft Azure, Cisco CCNA
- Trh prace: nedostatek IT specialistu (EU: 500 000+ volnych mist), remote work/home office moznosti, globalni poptavka
- Mekke dovednosti (soft skills): problem-solving, teamwork, communication, continuous learning
- Budoucnost IT: AI/ML specialiste, cloud engineers, cybersecurity - nejrychleji rostouci obory
- Klicova slovni zasoba: resume/CV, job interview, salary, promotion, internship, freelance, remote work
Pis v cestine, anglicke vyrazy tucne.` },

  { num: 'it-6', title: 'IT Devices and E-waste',
    prompt: `Maturitni odborne tema anglictina: IT zarizeni a elektronicky odpad (IT Devices and E-waste).
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:
- IT zarizeni v kazoddennim zivote: smartphone, laptop, smart TV, router, printer, smart home devices
- Zivotni cyklus zarizeni: vyroba → pouzivani → zastarani (obsolescence) → likvidace
- Planovana zastaralost (planned obsolescence): vyrobci navrhnou zarizeni tak, aby brzy zastaralo
- Elektronicky odpad (e-waste): 53.6 mil tun rocne (2019), nejrychleji rostouci typ odpadu na svete
- Nebezpecne latky v elektronice: lead (olovo), mercury (rtut), cadmium, arsenic - zdravotni rizika
- Recyklace: pouze ~17% e-waste se recykluje spravne; WEEE direktiva v EU (povinny sber e-odpadu)
- Reseni: oprava misto vymeny, second-hand zarizeni, recyklacni programy (Apple Trade In, Samsung)
- Klicova slovni zasoba: obsolete, recycle, toxic, landfill, circular economy, refurbish, dispose
Pis v cestine, anglicke vyrazy tucne.` },

  { num: 'it-7', title: 'Electronic Communication',
    prompt: `Maturitni odborne tema anglictina: Zpusoby elektronicke komunikace (Electronic Communication).
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:
- Email: nejpouzivanejsi forma, protokoly SMTP/IMAP/POP3, spam, phishing pres email
- Instant messaging: WhatsApp (2 mld uzivatelu), Telegram, Signal (end-to-end sifrovani), iMessage
- Video hovory: Zoom (pandemie COVID-19 = boom), Microsoft Teams, Google Meet, Skype (VoIP)
- Socialni site jako komunikace: Facebook Messenger, Instagram DM, Twitter/X, LinkedIn
- Firemni komunikace: Slack, Microsoft Teams, email - rozdily a pouziti
- Sifrovani: end-to-end encryption (E2EE) - Signal, WhatsApp; HTTPS pro web; SSL/TLS certifikaty
- Vyhody elektronicke komunikace: rychlost, cena, globalnost; Nevyhody: bezpecnost, privacy, zavislost
- Klicova slovni zasoba: attachment, encryption, spam, phishing, VoIP, bandwidth, protocol
Pis v cestine, anglicke vyrazy tucne.` },

  { num: 'it-8', title: 'Smart Home',
    prompt: `Maturitni odborne tema anglictina: Chytra domacnost (Smart Home).
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:
- Definice: Smart Home = domacnost s IoT zarizeni ovladanymi pres internet/smartphone
- Typy smart zarizeni: smart speaker (Amazon Echo/Alexa, Google Home/Nest), smart thermostat (Nest - usetri az 15% energie), smart locks, smart lighting (Philips Hue), security cameras, smart TV, robot vacuum (Roomba)
- Protokoly a standardy: Wi-Fi, Bluetooth, Zigbee, Z-Wave, Matter (novy standard 2022)
- Hlasovi asistenti: Amazon Alexa, Google Assistant, Apple Siri, Microsoft Cortana
- Vyhody: komfort, energeticka ucinnost, bezpecnost, automatizace
- Nevyhody a rizika: privacy (zarizeni posloucha), hackovani IoT, zavislost na internetu, cena
- Klicova slovni zasoba: IoT (Internet of Things), automation, voice assistant, sensor, hub, protocol
Pis v cestine, anglicke vyrazy tucne.` },

  { num: 'it-9', title: 'Programming',
    prompt: `Maturitni odborne tema anglictina: Programovani (Programming).
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:
- Co je programovani: psani instrukci pro pocitac v programovacim jazyce
- Nejpopularnejsi jazyky 2024 (TIOBE/Stack Overflow): Python (#1, AI/ML/data science), JavaScript (#2, web frontend/backend), Java (#3, enterprise/Android), C/C++ (#4-5, systems/games), C# (#6, .NET/Unity games), PHP (web), SQL (databaze)
- Typy jazyku: compiled (C, C++, Java - rychle) vs interpreted (Python, JavaScript - flexibilni); high-level vs low-level (Assembly)
- Programovaci paradigmata: OOP - Object-Oriented Programming (Java, C#, Python), functional (Haskell), procedural (C)
- Vyvoj: IDE (Visual Studio Code, IntelliJ IDEA, PyCharm), Git/GitHub (version control), debugging, testing
- Algoritmy a datove struktury: zaklady pro kazdeho programatora
- Klicova slovni zasoba: variable, function, loop, condition, class, object, library, framework, bug, debug
Pis v cestine, anglicke vyrazy tucne.` },

  { num: 'it-10', title: 'Cryptography',
    prompt: `Maturitni odborne tema anglictina: Kryptografie (Cryptography).
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:
- Definice: kryptografie = veda o sifrovani dat pro zajisteni bezpecnosti a soukromi
- Historicke sifry: Caesarova sifra (posun pismen), Enigma (WWII, prelomena Turingem)
- Symetricka kryptografie: stejny klic pro sifrovani i desifrovani; AES-256 (standard, banky, VPN); rychla ale problem s predanim klice
- Asymetricka kryptografie: par klicu - verejny (public) + soukromy (private); RSA-2048; pouziti: SSL/TLS (HTTPS), digitalni podpisy, email sifrovani (PGP)
- Hashovani: jednosmerna funkce, nelze zpet; SHA-256 (Bitcoin, SSL certifikaty), MD5 (zastaraly), bcrypt (hesla)
- Digitalni podpis: overeni autenticity a integrity dokumentu
- PKI (Public Key Infrastructure): certifikacni autority (CA), SSL certifikaty, HTTPS
- Blockchain: decentralizovana databaze, kazdy blok obsahuje hash predchoziho; Bitcoin, Ethereum
- Klicova slovni zasoba: encryption, decryption, key, cipher, hash, digital signature, certificate, SSL/TLS
Pis v cestine, anglicke vyrazy tucne.` },

  { num: 'it-11', title: 'Artificial Intelligence',
    prompt: `Maturitni odborne tema anglictina: Umela inteligence (Artificial Intelligence).
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:
- Definice AI: systemy schopne vykonavat ukoly vyzadujici lidskou inteligenci
- Typy AI: Narrow AI (specificke ukoly - sachovy pocitac, doporucovaci systemy), General AI (hypoteticky - lidska uroven), Super AI (hypoteticky - nad lidskou uroven)
- Machine Learning (ML): algoritmy ktere se uci z dat; supervised/unsupervised/reinforcement learning
- Deep Learning: neuronove site (neural networks), inspirovano lidskym mozkem
- Generativni AI: ChatGPT (OpenAI, GPT-4), Gemini (Google), Copilot (Microsoft), DALL-E (obrazky), Midjourney
- Pouziti AI: medicina (diagnostika rakoviny), autonomni vozidla (Tesla Autopilot, Waymo), prekladace (DeepL), doporucovaci systemy (Netflix, Spotify, YouTube), chatboti
- Rizika AI: deepfakes, ztrata pracovnich mist (automatizace), bias v algoritmech, privacy
- Klicova slovni zasoba: algorithm, neural network, training data, model, automation, bias, deepfake
Pis v cestine, anglicke vyrazy tucne.` },

  { num: 'it-12', title: 'Video Games and Virtual Reality',
    prompt: `Maturitni odborne tema anglictina: Videohry a virtualni realita (Video Games and VR).
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:
- Historie videoher: Pong (1972, Atari), Space Invaders (1978), Super Mario (1985, Nintendo), Doom (1993), World of Warcraft (2004), Minecraft (2011, nejprodavanejsi hra vsech dob ~238 mil kopii), Fortnite (2017)
- Platformy: PC (Steam), konzole (PlayStation 5, Xbox Series X, Nintendo Switch), mobilni hry (nejvetsi trh ~50% gaming revenue)
- Zanry: FPS (Call of Duty, CS:GO), RPG (The Witcher, Skyrim), strategy (Civilization), sports (FIFA), battle royale (Fortnite, PUBG)
- Herní průmysl: $200+ mld/rok (vetsi nez film a hudba dohromady), esports (~$1.4 mld)
- Virtualni realita (VR): Meta Quest, PlayStation VR2, HTC Vive; pouziti: hry, vzdelani, medicina, architektura
- Rozsirena realita (AR): Pokemon GO, Apple Vision Pro, Google Glass
- Vyhody her: reflexy, problem-solving, teamwork; Nevyhody: zavislost, sedavy zivotni styl
- Klicova slovni zasoba: console, graphics, multiplayer, esports, immersive, headset, simulation
Pis v cestine, anglicke vyrazy tucne.` },

  { num: 'it-13', title: 'Malware and Cyber Attacks',
    prompt: `Maturitni odborne tema anglictina: Malware a kyberutoky (Malware and Cyber Attacks).
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:
- Typy malware: virus (siri se sam, infikuje soubory), worm (siri se pres sit bez interakce), trojan (maskuje se za legitimni program), ransomware (sifrovani dat + vykupne), spyware (sleduje uzivatele), adware (reklamy), rootkit (skryty pristup), botnet (sit infikovanych PC)
- Typy utoku: phishing (podvodne emaily/weby), spear phishing (cileny), DDoS (Distributed Denial of Service - zahlteni serveru), man-in-the-middle (odposlech komunikace), SQL injection (databaze), XSS (Cross-Site Scripting), brute force (hádání hesel), social engineering (manipulace lidi)
- Nejznamejsi kyberutoky v historii:
  - Stuxnet (2010): prvni kyberzbran, iránske nuklearni centrifugy, USA+Izrael
  - WannaCry (2017): ransomware, 200 000 PC, 150 zemi, NHS UK paralyzovana, skoda $4 mld
  - NotPetya (2017): Ukrajina → svet, Maersk/Merck, skoda $10 mld
  - SolarWinds (2020): supply chain attack, US vládní agentury, Rusko (APT29)
  - Colonial Pipeline (2021): DarkSide ransomware, palivovod USA, $4.4 mil vykupne
- Klicova slovni zasoba: malware, ransomware, phishing, vulnerability, exploit, payload, botnet, zero-day
Pis v cestine, anglicke vyrazy tucne.` },

  { num: 'it-14', title: 'Network Security and Cybersecurity Basics',
    prompt: `Maturitni odborne tema anglictina: Zabezpeceni site + Zaklady kyberneticke bezpecnosti + Bezpecne chovani na internetu + Bezpecnostni politika + Online sluzby.
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:
- CIA triada: Confidentiality (duvernost), Integrity (integrita), Availability (dostupnost) - zaklad kyberneticke bezpecnosti
- Zabezpeceni site: firewall (filtrovani provozu), IDS/IPS (detekce/prevence naruseni), VPN (sifrovany tunel), DMZ, network segmentation, Wi-Fi security (WPA3)
- Bezpecne chovani na internetu: silna hesla (12+ znaku, mix), 2FA/MFA (dvoufaktorova autentizace), aktualizace softwaru, opatrnost pri klikani na odkazy, HTTPS kontrola
- Bezpecnostni politika: firemni pravidla pro pouzivani IT, acceptable use policy, password policy, BYOD (Bring Your Own Device)
- Vyuziti internetu a online sluzby: cloud storage (Google Drive, OneDrive, Dropbox), streaming (Netflix, Spotify), online banking, e-commerce (Amazon, Alza), social media
- Bezpecnost online sluzeb: GDPR (ochrana osobnich udaju v EU, od 2018), cookies, privacy settings, data breach
- Klicova slovni zasoba: firewall, VPN, encryption, authentication, password, GDPR, privacy, data breach
Pis v cestine, anglicke vyrazy tucne.` },

  { num: 'it-15', title: 'UK and USA Realia',
    prompt: `Maturitni odborne tema anglictina: Realie UK a USA (UK and USA Realia).
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:

UNITED KINGDOM (UK):
- Plny nazev: United Kingdom of Great Britain and Northern Ireland
- Casti: England, Scotland, Wales, Northern Ireland
- Hlavni mesto: London (~9 mil, 14 mil Greater London)
- Pocet obyvatel: ~67 milionů (2024)
- Typ vlady: konstituční monarchie + parlamentní demokracie
- Hlava statu: Kral Karel III. (od 2022, po Alzbete II.)
- Predseda vlady: Keir Starmer (Labour, od cervence 2024)
- Parlament: House of Commons (650 clenu, voleni) + House of Lords (~800, jmenovani)
- Mena: British Pound Sterling (GBP)
- Pamatky: Big Ben, Tower of London, Buckingham Palace, Tower Bridge, Stonehenge, Windsor Castle, Edinburgh Castle
- Pohori: Ben Nevis (1345 m, nejvyssi hora UK), Pennines, Snowdonia
- Slavne osobnosti: Shakespeare, Newton, Darwin, Churchill, Beatles, Hawking, Alan Turing
- Ekonomika: 6. nejvetsi GDP (~$3.1 bil), Brexit (2020), City of London (financni centrum)

UNITED STATES OF AMERICA (USA):
- Hlavni mesto: Washington D.C.
- Nejvetsi mesto: New York City (~8.3 mil)
- Pocet obyvatel: ~335 milionů (2024), 3. nejlidnatejsi zeme
- Typ vlady: federalni prezidentska republika
- Hlava statu: prezident Donald Trump (od ledna 2025, 47. prezident)
- Kongres: Senate (100 senátorů, 2/stat) + House of Representatives (435 clenu)
- Nejvyssi soud: Supreme Court (9 soudcu, dozivotni)
- 50 statu + Washington D.C.
- Mena: US Dollar (USD)
- Pohori: Rocky Mountains, Appalachians; Denali 6190 m (nejvyssi hora)
- Pamatky: Statue of Liberty, White House, Grand Canyon, Yellowstone, Golden Gate Bridge, Mount Rushmore
- Slavne osobnosti: Washington, Lincoln, Edison, Einstein, Steve Jobs, Elon Musk, Obama
- Ekonomika: nejvetsi na svete (GDP ~$27 bil), Silicon Valley
Pis v cestine, anglicke vyrazy tucne.` },

  { num: 'it-16', title: 'Czech Republic and Prague',
    prompt: `Maturitni odborne tema anglictina: Ceska republika a Praha (Czech Republic and Prague).
Zpracuj jako pripravu na 4minutovy ustni rozhovor. Obsah:

CESKA REPUBLIKA:
- Plny nazev: Czech Republic / Czechia
- Hlavni mesto: Praha (~1.3 mil, 2 mil aglomerace)
- Pocet obyvatel: ~10.9 milionů (2024)
- Typ vlady: parlamentni demokracie, republika
- Hlava statu: prezident Petr Pavel (od 2023)
- Predseda vlady: Petr Fiala (ODS, od 2021)
- Parlament: Poslanecka snemovna (200 clenu) + Senat (81 clenu)
- Mena: Ceska koruna (CZK) - neni v eurozóne
- Clenstvi: EU (2004), NATO (1999), Schengen, OECD
- Pohori: Krkonose (Snezka 1603 m - nejvyssi hora CR), Sumava, Jeseniky, Beskydy
- Reky: Vltava (430 km, Praha), Labe, Morava
- Ekonomika: Skoda Auto (Mlada Boleslav, Volkswagen Group), strojirenstvi, IT sektor
- Slavne osobnosti: Karel IV., Kafka, Dvorak, Smetana, Navratilova, Jagr, Zatopek

PRAHA:
- Historicke centrum UNESCO (od 1992)
- Prazsky hrad: nejvetsi hradni komplex na svete (70 000 m2)
- Karluv most: 1357, 30 soch svateho
- Staromestske namesti: Orloj (astronomicke hodiny, 1410)
- Dalsi pamatky: Josefov, Vaclavske namesti, Vysehrad, Narodni divadlo
- Ctvrti: Stare Mesto, Nove Mesto, Mala Strana, Hradcany, Vinohrady
- Turistika: 7-8 mil turistu rocne, 6. nejnavstevovanejsi mesto EU
Pis v cestine, anglicke vyrazy tucne.` },
];

// ── BUILD ANG ───────────────────────────────────────────────────
async function buildANG() {
  console.log('\n📁 ANG — Anglický jazyk (maturitní témata)');
  const topics = [];

  const ANG_GEMINI_PROMPT = `Jsi expert na anglicky jazyk a pripravujes studenty na maturitni ustni zkousku z anglictiny.
Dostanes zadani maturitniho tematu s klicovymi informacemi.

Tvuj ukol: Vytvor KRASNE NAFORMATOVANY studijni material v Markdownu - pripravu na 4minutovy ustni rozhovor.

PRAVIDLA FORMATOVANI:
- Pouzivej ## pro hlavni sekce, ### pro podsekce
- Pouzivej **tucne** pro anglicke vyrazy, klicova slova a dulezite fakty
- Pouzivej - pro odrazky
- Pouzivej > pro dulezite definice nebo tipy
- Anglicke vyrazy vzdy tucne, cesky preklad v zavorkach
- Pridej sekci "Uzitecne fraze" s anglickymi vetami pro rozhovor
- Pridej sekci "Mozne otazky zkousejiciho" s 3-5 otazkami
- Material musi byt STRUCNY ale KOMPLETNI - student se z nej pripravi za 15 minut
- Text musi byt v cestine, anglicke vyrazy tucne
- NEVYMYSLEJ fakta - pouzij pouze informace ze zadani

Vrat POUZE Markdown text, bez backtick markdown bloku.`;

  const allTopics = [...ANG_TOPICS, ...ANG_TOPICS_2, ...ANG_ODBORNE];

  for (const topic of allTopics) {
    process.stdout.write(`  ANG-${topic.num.padStart(4,' ')} ${topic.title.substring(0,38).padEnd(38)}...`);

    const cacheKey = `ang_${topic.num.replace(/[^a-z0-9]/gi,'_')}`;
    const cacheFile = path.join(CACHE_DIR, cacheKey + '.md');

    let content = '';

    if (fs.existsSync(cacheFile)) {
      const cached = fs.readFileSync(cacheFile, 'utf8');
      if (cached.length > 100) {
        content = cached;
        process.stdout.write(' [cache]');
      }
    }

    if (!content) {
      if (model) {
        try {
          const fullPrompt = `${ANG_GEMINI_PROMPT}\n\n---\nTEMA: ${topic.title}\n\nZADANI:\n${topic.prompt}`;
          const result = await model.generateContent(fullPrompt);
          content = result.response.text().trim();
          fs.writeFileSync(cacheFile, content, 'utf8');
          process.stdout.write(' [AI ok]');
          await sleep(400);
        } catch (err) {
          console.error(`\n  Gemini error pro ANG-${topic.num}: ${err.message}`);
          content = `## ${topic.title}\n\n${topic.prompt}`;
        }
      } else {
        content = `## ${topic.title}\n\n${topic.prompt}`;
      }
    }

    topics.push({ id: `ang-${topic.num}`, num: topic.num, title: topic.title, content });
    console.log(` ok (${content.length} chars)`);
  }

  return {
    id: 'ang',
    name_cs: 'Anglický jazyk',
    name_en: 'English Language',
    icon: '🇬🇧',
    desc_cs: 'Maturitní témata — konverzace, reálie UK/USA, odborná IT témata',
    desc_en: 'Matura topics — conversation, UK/USA facts, IT terminology',
    color: 'ang',
    topics,
  };
}
// ── MAIN ────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 StudyHub — build_data.js');
  console.log('='.repeat(50));

  const categories = [];
  categories.push(await buildKYB());
  categories.push(await buildPRG());
  categories.push(await buildCES());
  categories.push(await buildMAT());
  categories.push(await buildANG());

  const out = 'const CATEGORIES = ' + JSON.stringify(categories) + ';';
  fs.writeFileSync('data.js', out, 'utf8');

  console.log('\n' + '='.repeat(50));
  console.log('✅ data.js vygenerován');
  categories.forEach(c => console.log(`   ${c.icon} ${c.name_cs}: ${c.topics.length} témat`));
  console.log(`   📦 Velikost: ${(out.length / 1024).toFixed(0)} KB`);
}

main().catch(err => { console.error('❌ Chyba:', err); process.exit(1); });
