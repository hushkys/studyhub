// rebuild_kyb.js — přegeneruje KYB cache soubory s rozšířeným obsahem
'use strict';
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const MODEL_NAME = 'gemini-3.1-flash-lite-preview';
const CACHE_DIR = '.gemini_cache';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const sleep = ms => new Promise(r => setTimeout(r, ms));

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

const KYB_INLINE = JSON.parse(fs.readFileSync('kyb_inline.json', 'utf8'));

const EXPAND_PROMPT = `Jsi expert na kybernetickou bezpečnost a sítě. Dostaneš studijní materiál pro maturanta (maturitní otázka z kybernetické bezpečnosti).

Tvůj úkol: Vezmi existující obsah a ROZŠIŘ ho do přehledného, kompletního studijního materiálu.

PRAVIDLA:
- Zachovej VEŠKERÝ existující obsah — nic nevynechávej
- Přidej stručné vysvětlení ke každému pojmu (1-2 věty co to je a k čemu slouží)
- Přidej praktické příklady tam kde chybí
- Přidej sekci "Klíčové pojmy" na konec s definicemi nejdůležitějších termínů
- Používej ## pro hlavní sekce, ### pro podsekce
- Používej **tučné** pro klíčové pojmy
- Používej \`kód\` pro technické termíny, protokoly, zkratky
- Používej - pro odrážky
- Buď fakticky přesný — NEVYMÝŠLEJ si informace, pouze rozveď co je v podkladech
- Pokud je pojem zmíněn bez vysvětlení, přidej stručné vysvětlení
- Text musí být v češtině
- Cíl: student musí být schopen mluvit o tématu 5-10 minut u maturity

Vrať POUZE Markdown text, bez úvodního komentáře, bez \`\`\`markdown bloků.`;

async function readDocx(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value.trim();
  } catch (e) {
    return '';
  }
}

function readMd(filePath) {
  try { return fs.readFileSync(filePath, 'utf8').trim(); } catch { return ''; }
}

async function expandWithGemini(rawContent, title, cacheKey) {
  const cacheFile = path.join(CACHE_DIR, cacheKey + '.md');
  const prompt = `${EXPAND_PROMPT}\n\n---\nNázev tématu: ${title}\n\nExistující obsah:\n${rawContent.substring(0, 14000)}`;
  
  const result = await model.generateContent(prompt);
  const expanded = result.response.text().trim();
  fs.writeFileSync(cacheFile, expanded, 'utf8');
  return expanded;
}

async function main() {
  console.log('🔄 Rebuild KYB — rozšiřuji obsah přes Gemini');
  console.log('='.repeat(50));

  // Collect DOCX files
  const docxMap = {};
  if (fs.existsSync('KYB')) {
    fs.readdirSync('KYB').filter(f => f.endsWith('.docx')).forEach(f => {
      const num = f.match(/^(\d+)/)?.[1];
      if (num) docxMap[num] = path.join('KYB', f);
    });
  }

  // Collect MD files from school notes
  const kybMdMap = {};
  const kybMdDir = '00 Škola/Otázky/KYB';
  if (fs.existsSync(kybMdDir)) {
    fs.readdirSync(kybMdDir).filter(f => f.endsWith('.md')).forEach(f => {
      const m = f.match(/^(\d+)\./);
      if (m) kybMdMap[m[1]] = path.join(kybMdDir, f);
    });
  }

  const results = {};

  for (let n = 1; n <= 20; n++) {
    const num = String(n);
    const title = KYB_TITLES[num];
    const cacheKey = `kyb_${num}`;
    const cacheFile = path.join(CACHE_DIR, cacheKey + '.md');

    process.stdout.write(`  KYB-${num.padStart(2,'0')} ${title.substring(0,38).padEnd(38)}...`);

    // Build raw content
    let rawContent = '';
    if (docxMap[num]) {
      rawContent = await readDocx(docxMap[num]);
    } else if (KYB_INLINE[num]) {
      rawContent = KYB_INLINE[num];
    }
    if (kybMdMap[num]) {
      const md = readMd(kybMdMap[num]);
      rawContent = rawContent ? rawContent + '\n\n' + md : md;
    }

    if (!rawContent || rawContent.length < 30) {
      console.log(' ⚠ prázdný obsah, přeskakuji');
      // Keep existing cache
      if (fs.existsSync(cacheFile)) {
        results[num] = fs.readFileSync(cacheFile, 'utf8');
      }
      continue;
    }

    // Check existing cache length — only rebuild if short
    let existingLen = 0;
    if (fs.existsSync(cacheFile)) {
      existingLen = fs.readFileSync(cacheFile, 'utf8').length;
    }

    // Rebuild all — force fresh expansion
    try {
      const expanded = await expandWithGemini(rawContent, title, cacheKey);
      results[num] = expanded;
      console.log(` ✓ [AI✓] (${expanded.length} chars)`);
      await sleep(400);
    } catch (e) {
      console.log(` ❌ Chyba: ${e.message}`);
      if (fs.existsSync(cacheFile)) {
        results[num] = fs.readFileSync(cacheFile, 'utf8');
      }
    }
  }

  // Now inject into data.js
  console.log('\n📦 Injektuji do data.js...');
  const dataJs = fs.readFileSync('data.js', 'utf8');
  const fn = new Function(dataJs + '; return CATEGORIES;');
  const categories = fn();

  const kybCat = categories.find(c => c.id === 'kyb');
  if (!kybCat) { console.error('❌ KYB kategorie nenalezena'); process.exit(1); }

  kybCat.topics.forEach(topic => {
    const num = topic.num;
    if (results[num]) {
      topic.content = results[num];
    }
  });

  const out = 'const CATEGORIES = ' + JSON.stringify(categories) + ';';
  fs.writeFileSync('data.js', out, 'utf8');

  console.log('='.repeat(50));
  console.log(`✅ data.js aktualizován (KYB: ${kybCat.topics.length} témat)`);
  console.log(`   Velikost: ${(out.length / 1024).toFixed(0)} KB`);
}

main().catch(err => { console.error('❌ Chyba:', err); process.exit(1); });
