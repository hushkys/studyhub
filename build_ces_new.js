require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const MODEL_NAME = 'gemini-3.1-flash-lite-preview';
const CACHE_DIR = '.gemini_cache';
const MD_DIR = '00 \u0160kola/\u010ce\u0161tina/\u010cten\u00e1\u0159\u00e1k';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

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
const CES_PROMPT = `Jsi expert na ceskou a svetovou literaturu a tvorbu ctenarskych denniku pro maturanty.

Dostanet surovy text rozboru literarniho dila stazeny z webu (rozbor-dila.cz).

Tvuj ukol: Vytvor KRASNE NAFORMATOVANY ctenarsky denik v Markdownu vhodny pro maturitu z cestiny.

POVINNA STRUKTURA (pouzij presne tyto sekce):
## Zakladni informace
- Autor, rok vydani, zanr, literarni smer/obdobi

## Autor
- Strucny zivotopis, kontext tvorby, dalsi dila

## Obsah dila
- Strucny dej (vystizny, ale bez zbytecnych spoileru)

## Tema a motivy
- Hlavni tema, vedlejsi motivy, symbolika

## Postavy
- Hlavni a vedlejsi postavy s charakteristikou

## Jazykove prostredky a styl
- Vypravec, jazyk, styl, literarni prostredky (metafory, prirovnani atd.)

## Kompozice
- Struktura dila, casoprostor, cleneni

## Literarnehistoricky kontext
- Zarazeni do literarniho proudu, srovnani s dobou, vliv na literaturu

## Maturitni shrnuti
- 3-5 klicovych bodu ktere si zapamatovat k maturite

PRAVIDLA:
- Pouzivej **tucne** pro klicove pojmy
- Pouzivej - pro odrazky
- Pouzivej > pro dulezite citace nebo definice
- POUZE fakta z poskytnuteho textu - NEVYMYSLEJ nic
- Pokud informace v textu chybi, sekci vynech nebo napiste "Informace neni k dispozici"
- Text musi byt v cestine (pouzij spravne diakritiku ve vystupu)
- Vrat POUZE Markdown, bez backtick markdown bloku`;

async function geminiFormatBook(rawText, title, cacheFile) {
  if (fs.existsSync(cacheFile)) {
    const cached = fs.readFileSync(cacheFile, 'utf8');
    if (cached.length > 200) {
      process.stdout.write(' [cache]');
      return cached;
    }
  }
  const prompt = CES_PROMPT + '\n\n---\nNazev dila: ' + title + '\n\nSurovy text rozboru:\n' + rawText.substring(0, 14000);
  const result = await model.generateContent(prompt);
  const formatted = result.response.text().trim();
  fs.writeFileSync(cacheFile, formatted, 'utf8');
  process.stdout.write(' [AI ok]');
  return formatted;
}
const NEW_BOOKS = [
  { title: 'Kytice', cacheKey: 'ces-md-kytice', mdFile: 'Kytice.md',
    urls: ['https://rozbor-dila.cz/kytice-rozbor-dila-k-maturite-4/'] },
  { title: 'Hobit', cacheKey: 'ces-md-hobit', mdFile: 'Hobit.md',
    urls: ['https://rozbor-dila.cz/hobit-rozbor-dila-k-maturite/'] },
  { title: 'Pan prstenu', cacheKey: 'ces-md-pan-prstenu', mdFile: 'Pan prstenu.md',
    urls: ['https://rozbor-dila.cz/pan-prstenu-spolecenstvo-prstenu-rozbor-dila/',
           'https://www.cesky-jazyk.cz/ctenarsky-denik/john-ronald-reuel-tolkien/pan-prstenu-dve-veze-2.html'] },
  { title: 'Komu zvoni hrana', cacheKey: 'ces-md-komu-zvoni-hrana', mdFile: 'Komu zvoni hrana.md',
    urls: ['https://rozbor-dila.cz/komu-zvoni-hrana-rozbor-dila-k-maturite/'] },
  { title: 'Starec a more', cacheKey: 'ces-md-starec-a-more', mdFile: 'Starec a more.md',
    urls: ['https://rozbor-dila.cz/starec-a-more-rozbor-dila-k-maturite-4/'] },
  { title: 'Rozmarne leto', cacheKey: 'ces-md-rozmarne-leto', mdFile: 'Rozmarne leto.md',
    urls: ['https://rozbor-dila.cz/rozmarne-leto-rozbor-k-maturite/'] },
  { title: 'Abeceda', cacheKey: 'ces-md-abeceda', mdFile: 'Abeceda.md',
    urls: ['https://rozbor-dila.cz/abeceda-rozbor-dila-k-maturite/'] },
  { title: 'Ceske nebe', cacheKey: 'ces-md-ceske-nebe', mdFile: 'Ceske nebe.md',
    urls: ['https://rozbor-dila.cz/ceske-nebe-rozbor-dila-k-maturite/'] },
];
async function main() {
  console.log('build_ces_new.js -- pridavani novych knih do cestiny');
  console.log('='.repeat(55));
  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY neni nastaven v .env');
    process.exit(1);
  }

  for (const book of NEW_BOOKS) {
    const cacheFile = path.join(CACHE_DIR, book.cacheKey + '.md');
    const mdFilePath = path.join(MD_DIR, book.mdFile);
    console.log('\n--- ' + book.title + ' ---');

    if (fs.existsSync(cacheFile)) {
      const cached = fs.readFileSync(cacheFile, 'utf8');
      if (cached.length > 200) {
        console.log('  Cache existuje (' + cached.length + ' chars) -- preskakuji');
        if (!fs.existsSync(mdFilePath)) {
          fs.writeFileSync(mdFilePath, '# ' + book.title + '\n', 'utf8');
          console.log('  MD placeholder vytvoren');
        }
        continue;
      }
    }

    let combinedText = '';
    for (const url of book.urls) {
      process.stdout.write('  Stahuji: ' + url.substring(0, 65) + '...');
      try {
        const html = await fetchUrl(url);
        const text = stripHtml(html);
        combinedText += (combinedText ? '\n\n---\n\n' : '') + text;
        console.log(' OK (' + text.length + ' chars)');
        await sleep(700);
      } catch (err) {
        console.log(' CHYBA: ' + err.message);
      }
    }

    if (!combinedText || combinedText.length < 100) {
      console.log('  Nepodarilo se stahnout obsah pro: ' + book.title);
      continue;
    }

    process.stdout.write('  Gemini formatuje...');
    try {
      await geminiFormatBook(combinedText, book.title, cacheFile);
      const saved = fs.readFileSync(cacheFile, 'utf8');
      console.log(' ok (' + saved.length + ' chars)');
      await sleep(800);
    } catch (err) {
      console.log(' CHYBA: ' + err.message);
      continue;
    }

    if (!fs.existsSync(mdFilePath)) {
      fs.writeFileSync(mdFilePath, '# ' + book.title + '\n', 'utf8');
      console.log('  MD placeholder: ' + mdFilePath);
    }
  }

  console.log('\n' + '='.repeat(55));
  console.log('Hotovo! Nyni spust: node build_data.js');
}

main().catch(err => { console.error('Chyba:', err); process.exit(1); });