'use strict';
const fs = require('fs');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = 'gemini-3.1-flash-lite-preview';
const CACHE_PATH = '.gemini_cache/ang_sloh.md';

const PROMPT = `Jsi učitel angličtiny na střední škole v ČR. Vytvoř KOMPLETNÍ studijní materiál pro maturanta na téma: Písemná část maturitní zkoušky z angličtiny (Writing).

FORMÁTOVACÍ PRAVIDLA — PŘÍSNĚ DODRŽUJ:
1. Nadpisy sekcí: ### Název
2. Bullet listy: * položka
3. Ukázky textu: každý řádek ukázky začíná > (blockquote), prázdný řádek uvnitř ukázky = řádek obsahující POUZE >
4. Před každou ukázkou napiš tučně: **Ukázka:**
5. Oddělovač sekcí: ---
6. Tabulky: standardní markdown tabulky
7. ŽÁDNÉ HTML tagy — ani <div>, ani nic jiného
8. Datum/místo dopisu piš jako PRVNÍ řádek uvnitř blockquote, zarovnaný doprava pomocí mezer nebo prostě jako první řádek: > Prague, 10th June 2025

PŘÍKLAD SPRÁVNÉHO FORMÁTU:

**Ukázka:**
> Prague, 10th June 2025
>
> Dear Sir or Madam,
>
> I am writing to inquire about the summer language course advertised on your website. Could you please send me more details about the schedule and fees?
>
> Yours faithfully,
> Jan Novák

---

OBSAH — zahrň VŠECHNY sekce v tomto pořadí:

### Obecné informace o písemné části
- čas, části, rozsah slov, hodnotící kritéria
- markdown tabulka útvarů: Útvar | Část | Rozsah slov

---

### Neformální dopis / e-mail
- kdy se používá, komu
- struktura (bullet list)
- klíčové fráze (bullet list)
- **Ukázka:** blockquote, 130–160 slov, realistická, kompletní, datum jako první řádek

---

### Formální dopis / e-mail
- kdy se používá
- struktura
- klíčové fráze
- **Ukázka:** blockquote, 130–160 slov, datum jako první řádek

---

### Článek (Article)
- popis
- struktura
- klíčové fráze
- **Ukázka:** blockquote, 130–160 slov, první řádek = nadpis článku

---

### Vypravování (Story / Narrative)
- popis, narrative tenses
- struktura
- klíčové fráze
- **Ukázka:** blockquote, 130–160 slov

---

### Popis místa (Description of a Place)
- popis
- struktura
- klíčové fráze
- **Ukázka:** blockquote, 130–160 slov, datum jako první řádek

---

### Charakteristika osoby (Description of a Person)
- popis
- struktura
- klíčové fráze
- **Ukázka:** blockquote, 130–160 slov, datum jako první řádek

---

### Vzkaz (Message / Note)
- popis
- struktura
- klíčové fráze
- **Ukázka:** blockquote, 70–90 slov, datum jako první řádek

---

### Pozvánka (Invitation)
- popis
- struktura
- klíčové fráze
- **Ukázka:** blockquote, 70–90 slov, datum jako první řádek

---

### Oznámení (Announcement / Notice)
- popis
- struktura
- klíčové fráze
- **Ukázka:** blockquote, 70–90 slov

---

### Návod (Instructions / How-to)
- popis, imperativ
- struktura
- klíčové fráze
- **Ukázka:** blockquote, 70–90 slov

---

### Časté chyby
- bullet list 8–10 nejčastějších chyb

---

### Tipy pro 70 minut
- bullet list 5–6 praktických tipů

---

### Linking Words — Propojovací výrazy
- tabulka: Kategorie | Výrazy

Vrať POUZE Markdown text, bez úvodního komentáře, bez \`\`\`markdown bloků, bez jakéhokoliv HTML.`;

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
