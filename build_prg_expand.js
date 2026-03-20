'use strict';
// Rozšíří PRG otázky na 5000+ znaků pomocí Gemini
// ZÁKLAD = lokální DOCX zápisky z PRG/ + MD zápisky
// Gemini pouze rozšiřuje, nepřepisuje
// Cache: .gemini_cache/prg_exp2_<id>.md

const fs = require('fs');
const https = require('https');
const path = require('path');
const mammoth = require('mammoth');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'gemini-3.1-flash-lite-preview';
const CACHE_DIR = '.gemini_cache';
const MIN_LEN = 5000;

if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR);

// Lokální zápisky — přidáme jako kontext ke každé otázce kde jsou relevantní
const SMIDOVINY = fs.readFileSync('00 Škola/IOT/Programko/šmídoviny.md', 'utf8');
const DOUCOVANI = fs.readFileSync('00 Škola/IOT/Programko/poznámky doučování.md', 'utf8');

// Mapování čísla otázky → DOCX soubor
const DOCX_MAP = {};
const prgFiles = fs.readdirSync('PRG').filter(f => f.endsWith('.docx'));
for (const f of prgFiles) {
  const m = f.match(/^(\d+)\./);
  if (m) DOCX_MAP[parseInt(m[1])] = path.join('PRG', f);
}

// prg-1 → 1, prg-2 → 2, atd.
function topicIdToNum(id) {
  const m = id.match(/^prg-(\d+)$/);
  return m ? parseInt(m[1]) : null;
}

// Zápisky relevantní pro konkrétní otázky (číslo → výňatek ze zápisků)
function getLocalNotes(topicId) {
  const num = topicIdToNum(topicId);
  const notes = [];

  // Šmídoviny — relevantní sekce podle čísla otázky
  if ([11, 12, 13, 14, 15, 16, 17].includes(num)) {
    notes.push('=== ZÁPISKY OD UČITELE (šmídoviny.md) ===\n' + SMIDOVINY);
  }

  // Doučování — relevantní pro OOP, metody, základy
  if ([11, 12, 14, 15].includes(num)) {
    notes.push('=== ZÁPISKY Z DOUČOVÁNÍ ===\n' + DOUCOVANI);
  }

  return notes.join('\n\n');
}

async function readDocx(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value.trim();
  } catch(e) {
    return '';
  }
}

function geminiRequest(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 4096 }
    });
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try {
          const j = JSON.parse(data);
          if (j.candidates && j.candidates[0]) {
            resolve(j.candidates[0].content.parts[0].text);
          } else {
            reject(new Error('No candidates: ' + data.slice(0, 400)));
          }
        } catch(e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function buildPrompt(topic, docxContent, localNotes) {
  const docxSection = docxContent
    ? `\n\n=== MOJE ZÁPISKY Z DOCX ===\n${docxContent}`
    : '';
  const notesSection = localNotes ? `\n\n${localNotes}` : '';

  return `Jsi student střední školy v ČR. Rozšiřuješ si zápisky na maturitu z programování.

NÁZEV OTÁZKY: ${topic.title}

MOJE ZÁPISKY ZE ŠKOLY (TOTO JE ZÁKLAD — ZACHOVEJ VŠECHNY INFORMACE):${docxSection}${notesSection}

INSTRUKCE — STYL (NEJDŮLEŽITĚJŠÍ):
Piš jako normální studentské zápisky. Vzor jak to má vypadat:

### Firewall
- funguje jako hradby kolem hradu — propustí jen to, co má povoleno
- filtruje síťový provoz podle pravidel (IP adresa, port, protokol)
- dělí se na hardwarový (fyzické zařízení v síti) a softwarový (program na PC)
- Windows má zabudovaný Windows Defender Firewall

### Antivirus
Antivirový program prochází soubory a hledá škodlivý kód. Má databázi známých virů a porovnává s ní. Důležité je ho pravidelně aktualizovat, jinak nezná nové hrozby.
- detekce: podle signatury (porovnání s databází) nebo heuristicky (podezřelé chování)
- příklady: Avast, ESET, Windows Defender

PRAVIDLA STYLU:
- MIX odrážek a krátkých odstavců — ne všechno musí být odrážka
- Odrážky pro výčty, vlastnosti, příklady
- 1-2 věty odstavce pro obecný popis nebo vysvětlení pojmu
- ŽÁDNÉ sekce "Klíčové pojmy" jako slovník — pojmy vysvětluj přímo v textu kde se vyskytují
- ŽÁDNÉ "Závěrečné shrnutí", "Poznámky k...", "Optimalizace", "Dokumentace" jako samostatné sekce
- ŽÁDNÉ akademické fráze ("Je důležité poznamenat", "Z hlediska", "V kontextu")
- Přidej sekci "### Typické otázky u maturity" s 3-5 otázkami
  - NIKDY nepoužívej číslovaný seznam (1. 2. 3.) pro otázky a odpovědi
  - Každou otázku piš jako: #### Otázka: text otázky? a hned pod ní odpověď jako normální text nebo odrážky
- Kód jen pokud je opravdu nutný — krátký příklad, ne výuka
- Výsledný text (bez kódových bloků) musí mít MINIMÁLNĚ 5000 znaků

OBSAH:
- Zachovej VŠE z mých zápisků
- Doplň co chybí — ale jen to co by učitel u maturity chtěl slyšet, ne encyklopedické pojmy
- Struktura: ## hlavní nadpis, ### podtémata

Vrať POUZE výsledný markdown obsah, bez úvodu.`;
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  // Load data.js
  const src = fs.readFileSync('data.js', 'utf8');
  let CATEGORIES;
  eval(src.replace('const CATEGORIES', 'CATEGORIES'));
  const prg = CATEGORIES.find(c => c.id === 'prg');

  const SKIP = ['prg-poznamky-doucovani', 'prg-smidoviny'];
  const topics = prg.topics.filter(t => !SKIP.includes(t.id));

  console.log(`Zpracovávám ${topics.length} PRG otázek s lokálními zápisky jako základem...`);

  for (const topic of topics) {
    const cacheFile = `${CACHE_DIR}/prg_exp2_${topic.id}.md`;

    // Use cache if exists and long enough
    if (fs.existsSync(cacheFile)) {
      const cached = fs.readFileSync(cacheFile, 'utf8');
      if (cached.length >= MIN_LEN) {
        console.log(`CACHE ${topic.id} (${cached.length} znaků)`);
        topic.content = cached;
        continue;
      }
    }

    // Read DOCX
    const num = topicIdToNum(topic.id);
    const docxPath = num ? DOCX_MAP[num] : null;
    let docxContent = '';
    if (docxPath && fs.existsSync(docxPath)) {
      docxContent = await readDocx(docxPath);
      console.log(`  DOCX ${path.basename(docxPath)}: ${docxContent.length} znaků`);
    } else {
      console.log(`  DOCX: nenalezen pro ${topic.id} (num=${num})`);
    }

    const localNotes = getLocalNotes(topic.id);

    console.log(`GEMINI ${topic.id} "${topic.title}"...`);
    try {
      const expanded = await geminiRequest(buildPrompt(topic, docxContent, localNotes));
      fs.writeFileSync(cacheFile, expanded, 'utf8');
      console.log(`  OK: ${expanded.length} znaků`);
      topic.content = expanded;
      await sleep(1200);
    } catch(e) {
      console.error(`  CHYBA ${topic.id}:`, e.message);
      // Fallback: use docx content if available
      if (docxContent.length > 200) {
        topic.content = docxContent;
      }
    }
  }

  // Inject do data.js
  console.log('\nInjectuji do data.js...');
  const newSrc = 'const CATEGORIES = ' + JSON.stringify(CATEGORIES, null, 0) + ';';
  fs.writeFileSync('data.js', newSrc, 'utf8');
  console.log('data.js uložen.');

  // Verify syntax
  try {
    // Quick check — parse as JSON the CATEGORIES part
    const check = fs.readFileSync('data.js', 'utf8');
    JSON.parse(check.replace('const CATEGORIES = ', '').replace(/;$/, ''));
    console.log('Syntax OK');
  } catch(e) {
    console.error('SYNTAX CHYBA:', e.message);
  }

  // Print lengths
  console.log('\nDélky PRG otázek:');
  prg.topics.filter(t => !SKIP.includes(t.id)).forEach(t => {
    const len = (t.content || '').length;
    const ok = len >= MIN_LEN ? 'OK' : 'KRATKE';
    console.log(`  ${ok} ${t.id}: ${len} znaků`);
  });
}

main().catch(e => { console.error(e); process.exit(1); });
