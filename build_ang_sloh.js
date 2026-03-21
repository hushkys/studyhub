'use strict';
const fs = require('fs');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = 'gemini-3.1-flash-lite-preview';
const CACHE_PATH = '.gemini_cache/ang_sloh.md';

const PROMPT = `Jsi učitel angličtiny na střední škole v ČR. Vytvoř KOMPLETNÍ studijní materiál pro maturanta na téma: Písemná část maturitní zkoušky z angličtiny (Writing).

FORMÁTOVACÍ PRAVIDLA (PŘÍSNĚ DODRŽUJ):
- Nadpisy sekcí: ### Název útvaru
- Pod každým nadpisem: krátký popis + struktura + fráze jako bullet list (*)
- Ukázka textu: každý řádek začíná > (blockquote markdown), prázdný řádek v ukázce = řádek obsahující pouze >
- Datum/místo dopisu: <div style="text-align:right">Město, datum</div> PŘED ukázkou (ne uvnitř)
- Oddělovač mezi sekcemi: ---
- Tabulky: markdown tabulky
- ŽÁDNÉ jiné HTML tagy

PŘÍKLAD SPRÁVNÉHO FORMÁTU UKÁZKY:
<div style="text-align:right">Prague, 10th June 2025</div>

> Dear Sir or Madam,
>
> I am writing to inquire about the summer course.
>
> Yours faithfully,
> Jan Novák

OBSAH — zahrň VŠECHNY tyto sekce v tomto pořadí:

### Obecné informace o písemné části
- čas: 70 minut celkem
- 2 části: část 1 (130–160 slov), část 2 (70–90 slov)
- 4 hodnotící kritéria: obsah, organizace, slovní zásoba, gramatika
- tabulka všech útvarů s částí a rozsahem

---

### Neformální dopis / e-mail
- popis, kdy se používá
- struktura (bullet list)
- klíčové fráze (bullet list)
- <div style="text-align:right">London, 12th May 2025</div>
- ukázka v blockquote (130–160 slov, realistická, kompletní)

---

### Formální dopis / e-mail
- popis
- struktura
- klíčové fráze
- <div style="text-align:right">Prague, 10th June 2025</div>
- ukázka v blockquote (130–160 slov)

---

### Článek (Article)
- popis
- struktura
- klíčové fráze
- ukázka v blockquote (130–160 slov, s nadpisem jako první řádek ukázky)

---

### Vypravování (Story / Narrative)
- popis, narrative tenses
- struktura
- klíčové fráze
- ukázka v blockquote (130–160 slov)

---

### Popis místa (Description of a Place)
- popis
- struktura
- klíčové fráze
- <div style="text-align:right">Prague, 15th May 2025</div>
- ukázka v blockquote (130–160 slov)

---

### Charakteristika osoby (Description of a Person)
- popis
- struktura
- klíčové fráze
- <div style="text-align:right">London, 10th June 2025</div>
- ukázka v blockquote (130–160 slov)

---

### Vzkaz (Message / Note)
- popis
- struktura
- klíčové fráze
- <div style="text-align:right">Home, 12th April 2025</div>
- ukázka v blockquote (70–90 slov)

---

### Pozvánka (Invitation)
- popis
- struktura
- klíčové fráze
- <div style="text-align:right">Bristol, 5th July 2025</div>
- ukázka v blockquote (70–90 slov)

---

### Oznámení (Announcement / Notice)
- popis
- struktura
- klíčové fráze
- <div style="text-align:right">School Hall, 20th May 2025</div>
- ukázka v blockquote (70–90 slov)

---

### Návod (Instructions / How-to)
- popis, imperativ
- struktura
- klíčové fráze
- <div style="text-align:right">Kitchen, 15th August 2025</div>
- ukázka v blockquote (70–90 slov)

---

### Časté chyby
- bullet list 8–10 nejčastějších chyb

---

### Tipy pro 70 minut
- bullet list 5–6 praktických tipů

---

### Linking Words (Propojovací výrazy)
- tabulka: Kategorie | Výrazy (přidávání, kontrast, příčina, pořadí, shrnutí, názor)

Vrať POUZE Markdown text, bez úvodního komentáře, bez \`\`\`markdown bloků.`;

async function main() {
  if (!fs.existsSync('.gemini_cache')) fs.mkdirSync('.gemini_cache');

  let content;
  if (fs.existsSync(CACHE_PATH)) {
    console.log('✓ Cache nalezena');
    content = fs.readFileSync(CACHE_PATH, 'utf8');
  } else {
    console.log(`🤖 Volám Gemini (${MODEL_NAME})...`);
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(PROMPT);
    content = result.response.text();
    fs.writeFileSync(CACHE_PATH, content, 'utf8');
    console.log(`✓ Vygenerováno (${content.length} znaků), cache uložena`);
  }

  // Inject into data.js
  const dataJs = fs.readFileSync('data.js', 'utf8');
  const fn = new Function('return ' + dataJs.replace('const CATEGORIES = ', '').replace(/;$/, ''));
  const categories = fn();

  const angCat = categories.find(c => c.id === 'ang');
  if (!angCat) { console.error('❌ Kategorie ang nenalezena'); process.exit(1); }

  // Replace ang-0
  const idx = angCat.topics.findIndex(t => t.id === 'ang-0');
  const newTopic = { id: 'ang-0', num: '0', title: 'Sloh — Písemná práce', content };
  if (idx >= 0) angCat.topics[idx] = newTopic;
  else angCat.topics.unshift(newTopic);

  const out = 'const CATEGORIES = ' + JSON.stringify(categories) + ';';
  fs.writeFileSync('data.js', out, 'utf8');
  console.log(`✅ ang-0 aktualizováno (${content.length} znaků obsahu)`);
}

main().catch(e => { console.error('❌', e); process.exit(1); });
