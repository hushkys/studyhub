// build_prg_code.js
// Rozšíří všechna témata v prg_code.js přes Gemini API
'use strict';
const fs = require('fs');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = 'gemini-3.1-flash-lite-preview';

if (!API_KEY) { console.error('❌ GEMINI_API_KEY chybí v .env'); process.exit(1); }

const genAI = new GoogleGenerativeAI(API_KEY);

function geminiRequest(prompt) {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  return model.generateContent(prompt).then(r => r.response.text());
}

// Load current topics from prg_code.js
function loadTopics() {
  const src = fs.readFileSync('prg_code.js', 'utf8');
  // Extract the CODE_TOPICS array
  const match = src.match(/const CODE_TOPICS = (\[[\s\S]*?\]);\s*\n\nif/);
  if (!match) throw new Error('Nepodařilo se najít CODE_TOPICS v prg_code.js');
  return JSON.parse(match[1]);
}

function buildPrompt(topic) {
  return `Jsi zkušený učitel programování na střední škole v ČR. Máš za úkol ROZŠÍŘIT a VYLEPŠIT studijní materiál pro maturanta.

Téma: "${topic.title}"

Aktuální obsah (Markdown):
${topic.content}

---

ÚKOL: Rozšiř a vylepši tento materiál. Zachovej VEŠKERÝ stávající obsah, ale přidej:
1. Více vysvětlení ke každému konceptu — co to je, proč to existuje, jak to funguje
2. Tipy "Co říct u maturity" — konkrétní věty, které student může říct komisi
3. Časté chyby a jak se jim vyhnout
4. Více příkladů kódu s komentáři v kódu (za //)
5. Srovnávací tabulky (Java vs C#, abstract class vs interface, apod.) pokud jsou relevantní
6. Sekci "### Klíčové otázky u maturity" s 5–8 otázkami a odpověďmi
7. Shrnutí na konci — co si zapamatovat

PRAVIDLA FORMÁTOVÁNÍ — DODRŽUJ PŘESNĚ:
- Piš česky, gramaticky a pravopisně správně (správné skloňování, diakritika)
- Zachovej Markdown: ##, ###, \`\`\`java nebo \`\`\`csharp, tabulky
- Kód musí být syntakticky správný Java nebo C# (podle tématu)
- Komentáře v kódu (za //) piš normálně jako text, NIKDY je neobaluj HTML tagy
- Sekce "Klíčové otázky u maturity" MUSÍ být formátována PŘESNĚ takto (každá otázka jako H4, odpověď jako odstavec):

#### Otázka: Co je XYZ?
Odpověď: XYZ je...

#### Otázka: Proč se používá ABC?
Odpověď: ABC se používá proto, že...

- NEPOUŽÍVEJ číslované seznamy (1. 2. 3.) pro otázky a odpovědi — použij vždy #### Otázka: / Odpověď:
- Délka: 2–4× delší než originál
- Vrať POUZE Markdown text, bez úvodního komentáře, bez \`\`\`markdown bloků`;
}

async function enrichTopic(topic) {
  const cacheKey = `prg_${topic.id}`;
  const cachePath = `.gemini_cache/${cacheKey}.md`;

  if (fs.existsSync(cachePath)) {
    console.log(`  ✓ Cache: ${topic.id}`);
    return fs.readFileSync(cachePath, 'utf8');
  }

  console.log(`  🤖 Gemini: ${topic.title}...`);
  const content = await geminiRequest(buildPrompt(topic));
  fs.writeFileSync(cachePath, content, 'utf8');
  console.log(`  ✓ Hotovo (${content.length} znaků) → ${cachePath}`);
  return content;
}

async function main() {
  if (!fs.existsSync('.gemini_cache')) fs.mkdirSync('.gemini_cache');

  console.log('📚 Načítám témata z prg_code.js...');
  const topics = loadTopics();
  console.log(`   Nalezeno ${topics.length} témat\n`);

  const enriched = [];
  for (const topic of topics) {
    const newContent = await enrichTopic(topic);
    enriched.push({ ...topic, content: newContent });
  }

  // Rebuild prg_code.js
  const src = fs.readFileSync('prg_code.js', 'utf8');
  const topicsJson = JSON.stringify(enriched, null, 2);
  const newSrc = src.replace(/const CODE_TOPICS = \[[\s\S]*?\];\s*\n\nif/, `const CODE_TOPICS = ${topicsJson};\n\nif`);

  if (newSrc === src) {
    console.error('❌ Nepodařilo se nahradit CODE_TOPICS — zkontroluj regex');
    process.exit(1);
  }

  fs.writeFileSync('prg_code.js', newSrc, 'utf8');
  console.log(`\n✅ prg_code.js aktualizován (${(newSrc.length / 1024).toFixed(0)} KB)`);
}

main().catch(err => { console.error('❌ Chyba:', err.message); process.exit(1); });
