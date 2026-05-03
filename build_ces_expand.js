// build_ces_expand.js
// Rozšíří krátké čtenářáky přes Gemini API + web scraping
'use strict';
require('dotenv').config();
const fs = require('fs');
const https = require('https');
const { execSync } = require('child_process');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = 'gemini-3.1-flash-lite-preview';
const CACHE_DIR = '.gemini_cache';

if (!API_KEY) { console.error('GEMINI_API_KEY chybí v .env'); process.exit(1); }

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });
const sleep = ms => new Promise(r => setTimeout(r, ms));

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'cs,en;q=0.9',
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function stripHtml(html) {
  html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<style[\s\S]*?<\/style>/gi, '');
  html = html.replace(/<nav[\s\S]*?<\/nav>/gi, '');
  html = html.replace(/<footer[\s\S]*?<\/footer>/gi, '');
  html = html.replace(/<header[\s\S]*?<\/header>/gi, '');
  html = html.replace(/<!--[\s\S]*?-->/g, '');
  html = html.replace(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi, '\n\n### $1\n');
  html = html.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '\n- $1');
  html = html.replace(/<br\s*\/?>/gi, '\n');
  html = html.replace(/<\/p>/gi, '\n\n');
  html = html.replace(/<\/div>/gi, '\n');
  html = html.replace(/<[^>]+>/g, '');
  html = html.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
             .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
             .replace(/&ndash;/g, '\u2013').replace(/&mdash;/g, '\u2014');
  html = html.replace(/\n{4,}/g, '\n\n\n').replace(/[ \t]+/g, ' ').trim();
  return html;
}

// Topics to expand
// mdCacheKey = use existing web-scraped cache directly
// urls = scrape these URLs then format with Gemini
const TOPICS = [
  { id: 'ces-babicka', key: 'babicka', title: 'Babička',
    urls: ['https://rozbor-dila.cz/babicka-rozbor-dila-k-maturite-2/'] },
  { id: 'ces-maj', key: 'maj', title: 'Máj',
    urls: ['https://rozbor-dila.cz/maj-rozbor-dila-k-maturite-2/'] },
  { id: 'ces-labyrint-sveta-a-raj-srdce', key: 'labyrint', title: 'Labyrint světa a ráj srdce',
    urls: ['https://rozbor-dila.cz/labyrint-sveta-a-raj-srdce-rozbor-dila-k-maturite/'] },
  { id: 'ces-slavnosti-snezenek', key: 'slavnosti_snezenek', title: 'Slavnosti sněženek',
    urls: ['https://rozbor-dila.cz/slavnosti-snezenek-rozbor-dila-k-maturite/'] },
  { id: 'ces-sen-noci-svatojanske', key: 'sen_noci', title: 'Sen noci svatojánské',
    urls: ['https://rozbor-dila.cz/sen-noci-svatojanske-rozbor-dila-k-maturite/'] },
  { id: 'ces-ceske-nebe', key: 'ceske_nebe', title: 'České nebe',
    mdCacheKey: 'ces_md_ceske_nebe' },
  { id: 'ces-osudy-dobreho-vojaka-svejka-za-svetove-valky', key: 'svejk', title: 'Osudy dobrého vojáka Švejka',
    urls: ['https://rozbor-dila.cz/osudy-dobreho-vojaka-svejka-za-svetove-valky-rozbor-dila-k-maturite/'] },
  { id: 'ces-abeceda', key: 'abeceda', title: 'Abeceda',
    mdCacheKey: 'ces_md_abeceda' },
  { id: 'ces-komu-zvoni-hrana', key: 'komu_zvoni_hrana', title: 'Komu zvoní hrana',
    mdCacheKey: 'ces_md_komu_zvoni_hrana' },
  { id: 'ces-romeo-a-julie', key: 'romeo_julie', title: 'Romeo a Julie',
    urls: ['https://rozbor-dila.cz/romeo-a-julie-rozbor-dila-k-maturite/'] },
  { id: 'ces-pan-prstenu', key: 'pan_prstenu', title: 'Pán prstenů',
    mdCacheKey: 'ces_md_pan_prstenu' },
  { id: 'ces-rozmarne-leto', key: 'rozmarne_leto', title: 'Rozmarné léto',
    mdCacheKey: 'ces_md_rozmarne_leto' },
  { id: 'ces-krakatit', key: 'krakatit', title: 'Krakatit',
    urls: ['https://rozbor-dila.cz/krakatit-rozbor-dila-k-maturite/'] },
  { id: 'ces-obsluhoval-jsem-anglickeho-krale', key: 'anglicky_kral', title: 'Obsluhoval jsem anglického krále',
    urls: ['https://rozbor-dila.cz/obsluhoval-jsem-anglickeho-krale-rozbor-dila-k-maturite/'] },
  { id: 'ces-ostre-sledovane-vlaky', key: 'ostre_vlaky', title: 'Ostře sledované vlaky',
    urls: ['https://rozbor-dila.cz/ostre-sledovane-vlaky-rozbor-dila-k-maturite/'] },
  { id: 'ces-vychova-divek-v-cechach', key: 'vychova_divek', title: 'Výchova dívek v Čechách',
    urls: ['https://rozbor-dila.cz/vychova-divek-v-cechach-rozbor-dila-k-maturite/'] },
];

const FORMAT_PROMPT = `Jsi expert na českou a světovou literaturu. Vytvoř PODROBNÝ čtenářský deník v Markdownu vhodný pro maturitu z češtiny.

Název díla: {TITLE}

Surový text rozboru z webu:
{RAW_TEXT}

---

POVINNÁ STRUKTURA (použij přesně tyto sekce):

## Základní informace
- Autor, rok vydání, žánr, literární směr/období

## Autor
- Stručný životopis, kontext tvorby, další díla autora

## Obsah díla
- Podrobný děj (výstižný, ale kompletní — kdo jsou postavy, co se děje, jak to končí)

## Téma a motivy
- Hlavní téma, vedlejší motivy, symbolika

## Postavy
- Hlavní a vedlejší postavy s charakteristikou a jejich rolí v ději

## Jazykové prostředky a styl
- Vypravěč, jazyk, styl, literární prostředky (metafory, přirovnání, ironie atd.)

## Kompozice
- Struktura díla, časoprostor, členění

## Literárněhistorický kontext
- Zařazení do literárního proudu, srovnání s dobou, vliv na literaturu, srovnání s jinými díly

## Maturitní shrnutí
- 5–7 klíčových bodů, které si zapamatovat k maturitě

PRAVIDLA:
- Piš česky, gramaticky a pravopisně správně (správné skloňování, diakritika)
- Používej **tučné** pro klíčové pojmy
- Používej - pro odrážky
- Používej > pro důležité citace nebo definice
- POUZE fakta z poskytnutého textu — NEVYMÝŠLEJ nic
- Pokud informace v textu chybí, sekci vynech nebo napiš "Informace není k dispozici"
- Délka: minimálně 3500 znaků
- Vrať POUZE Markdown, bez backtick markdown bloku`;

async function getExpandedContent(topic) {
  const cachePath = CACHE_DIR + '/ces_exp_' + topic.key + '.md';

  // Already cached?
  if (fs.existsSync(cachePath)) {
    const cached = fs.readFileSync(cachePath, 'utf8');
    if (cached.length > 2500) {
      console.log('  [cache] ' + cached.length + ' chars');
      return cached;
    }
  }

  // Use existing md cache (web-scraped) if available
  if (topic.mdCacheKey) {
    const mdPath = CACHE_DIR + '/' + topic.mdCacheKey + '.md';
    if (fs.existsSync(mdPath)) {
      const content = fs.readFileSync(mdPath, 'utf8');
      if (content.length > 2500) {
        console.log('  [md-cache] ' + content.length + ' chars');
        fs.writeFileSync(cachePath, content, 'utf8');
        return content;
      }
    }
  }

  // Scrape web
  let rawText = '';
  for (const url of (topic.urls || [])) {
    process.stdout.write('  GET ' + url.substring(0, 60) + '...');
    try {
      const html = await fetchUrl(url);
      const text = stripHtml(html);
      rawText += (rawText ? '\n\n---\n\n' : '') + text;
      console.log(' ok (' + text.length + ')');
      await sleep(600);
    } catch (err) {
      console.log(' ERR: ' + err.message);
    }
  }

  if (!rawText || rawText.length < 200) {
    console.log('  SKIP: no web content');
    return null;
  }

  // Gemini format
  process.stdout.write('  Gemini...');
  const prompt = FORMAT_PROMPT
    .replace('{TITLE}', topic.title)
    .replace('{RAW_TEXT}', rawText.substring(0, 14000));

  try {
    const result = await model.generateContent(prompt);
    const content = result.response.text().trim();
    fs.writeFileSync(cachePath, content, 'utf8');
    console.log(' ok (' + content.length + ' chars)');
    await sleep(800);
    return content;
  } catch (err) {
    console.log(' ERR: ' + err.message);
    return null;
  }
}

async function main() {
  console.log('build_ces_expand.js');
  console.log('='.repeat(55));

  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR);

  // Collect all expanded content first
  const results = [];
  for (const topic of TOPICS) {
    console.log('\n[' + topic.id + ']');
    const content = await getExpandedContent(topic);
    if (content && content.length > 2500) {
      results.push({ id: topic.id, content });
    } else {
      console.log('  SKIP: content too short or missing');
    }
  }

  if (results.length === 0) {
    console.log('\nNic k aktualizaci.');
    return;
  }

  console.log('\n' + '='.repeat(55));
  console.log('Injektuji ' + results.length + ' témat do data.js...');

  // Write inject script
  const injectSrc = `'use strict';
const fs = require('fs');
const src = fs.readFileSync('data.js', 'utf8');
const fakeWindow = {};
new Function('window', src + '\\nwindow.CATEGORIES = CATEGORIES;')(fakeWindow);
const cats = fakeWindow.CATEGORIES;
const ces = cats.find(c => c.id === 'ces');

const updates = ${JSON.stringify(results)};
let changed = 0;
for (const u of updates) {
  const t = ces.topics.find(x => x.id === u.id);
  if (!t) { console.log('MISS: ' + u.id); continue; }
  const old = (t.content||'').length;
  t.content = u.content;
  changed++;
  console.log('  ' + u.id + ': ' + old + ' -> ' + u.content.length);
}

// Serialize back: replace entire CATEGORIES definition
const newSrc = 'const CATEGORIES = ' + JSON.stringify(cats) + ';';
// data.js starts with "const CATEGORIES = [..." and ends with ";"
// Replace from start to first semicolon after the array
const endIdx = src.indexOf(';');
if (endIdx === -1) { console.error('Cannot find end of CATEGORIES'); process.exit(1); }
const tail = src.slice(endIdx + 1);
fs.writeFileSync('data.js', newSrc + tail, 'utf8');
console.log('data.js updated (' + changed + ' topics)');
`;

  fs.writeFileSync('_inject_tmp.js', injectSrc, 'utf8');
  try {
    const out = execSync('node _inject_tmp.js', { encoding: 'utf8' });
    console.log(out);
  } catch (err) {
    console.error('Inject error:', err.message);
    fs.unlinkSync('_inject_tmp.js');
    process.exit(1);
  }
  fs.unlinkSync('_inject_tmp.js');

  // Verify
  try {
    execSync('node _check_ces_lengths.js', { encoding: 'utf8', stdio: 'inherit' });
  } catch (e) {
    console.log('(length check failed, but data.js may still be ok)');
  }
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
