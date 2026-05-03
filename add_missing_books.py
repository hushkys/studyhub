#!/usr/bin/env python3
"""
Přidá chybějící knihy do data.js (ces kategorie) pomocí Gemini.
Kontext: zápisky z Daily_work/study/Maturita/Povinna četba/
"""

import json, re, os, time, sys, zipfile, unicodedata, urllib.request

import os
API_KEY = os.environ.get("GEMINI_API_KEY", "")
MODEL   = "gemini-3.1-flash-lite-preview"
URL     = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"
DATA_FILE = "/root/maturita-web-uceni3/data.js"
BOOKS_DIR = "/root/maturita-web-uceni3/Daily_work/study/Maturita/Povinna četba"

# Chybějící knihy: (title, source_file)
MISSING = [
    ("Hobit aneb cesta tam a zase zpět", "12. Hobbit aneb cesta tam a zase zpět.md"),
    ("Krysař",                            "18. Krysař.md"),
    ("Důmyslný rytíř Don Quijote de la Mancha", "2. Důmyslný rytíř Don Quijote de la Mancha.md"),
    ("Spalovač mrtvol",                   "20. Spalovač Mrtvol.md"),
    ("Hamlet",                            "4. Hamlet.md"),
    ("Havran",                            "9. Havran.md"),
    ("Noc na Karlštejně",                 "6. Noc na Karlštejně.md"),
    ("Malý princ",                        "8. Malí princ.md"),
]

def load_data():
    with open(DATA_FILE, encoding="utf-8") as f:
        raw = f.read()
    m = re.match(r"const CATEGORIES = (.*?);?\s*$", raw, re.DOTALL)
    return json.loads(m.group(1).rstrip(";"))

def save_data(data):
    js = "const CATEGORIES = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";"
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        f.write(js)

def read_file(path):
    for enc in ("utf-8-sig", "utf-8", "cp1250", "latin-1"):
        try:
            with open(path, encoding=enc) as f:
                return f.read()
        except Exception:
            continue
    return ""

def slugify(s):
    s = unicodedata.normalize("NFKD", s.lower())
    s = "".join(c for c in s if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")

def gemini(prompt: str, retries=4) -> str:
    body = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.2, "maxOutputTokens": 8192}
    }).encode("utf-8")
    for attempt in range(retries):
        try:
            req = urllib.request.Request(URL, data=body,
                headers={"Content-Type": "application/json"}, method="POST")
            with urllib.request.urlopen(req, timeout=120) as r:
                d = json.load(r)
            if d.get("promptFeedback", {}).get("blockReason"):
                raise RuntimeError(f"BLOCKED: {d['promptFeedback']['blockReason']}")
            if "candidates" not in d:
                raise KeyError(f"No candidates: {json.dumps(d)[:200]}")
            return d["candidates"][0]["content"]["parts"][0]["text"]
        except RuntimeError:
            raise
        except Exception as e:
            wait = 15 * (attempt + 1)
            print(f"\n  ⚠ Pokus {attempt+1}/{retries}: {str(e)[:80]}, čekám {wait}s...")
            time.sleep(wait)
    raise RuntimeError("Gemini selhal")

def build_prompt(title, notes):
    return f"""Jsi odborný editor studijních materiálů pro maturitní přípravu z českého jazyka a literatury.
Toto je školní literární rozbor pro vzdělávací účely.

ÚKOL: Vytvoř kompletní studijní materiál pro literární dílo: {title}

POVINNÉ ČÁSTI (každá jako ### sekce):
- Autor (jméno, léta, národnost, literární období, další díla)
- Literární a historický kontext (doba vzniku, literární směr, dobové souvislosti)
- Literární druh a žánr
- Téma a motivy
- Kompozice a struktura
- Postavy (hlavní + vedlejší, charakteristika)
- Děj (stručný, výstižný)
- Jazyk a styl (vypravěč, jazykové prostředky)
- Literárněhistorický přínos a srovnání s jinými díly

PRAVIDLA:
1. Každý odborný termín, jméno autora nebo literární pojem označ:
   [[TERM:název|Definice v 1–3 větách.]]
2. Styl: objektivní, věcný, odborný. Žádné oslovování čtenáře.
3. Formátování: ### podnadpisy, *   **Pojem**: vysvětlení pro výčty, krátké odstavce (max 3–4 věty).
4. Délka: dostatečná pro 15minutový ústní výklad.
5. Pouze ověřené fakty.

ZÁPISKY STUDENTA K TOMUTO DÍLU (zakomponuj):
{notes}

Vrať POUZE markdown text. Bez komentářů."""

def main():
    data = load_data()
    ces_cat = next(c for c in data if c["id"] == "ces")

    # Get existing topic IDs to avoid duplicates
    existing_slugs = {slugify(t["title"]) for t in ces_cat["topics"]}
    # Get max topic num for ordering
    nums = [int(t["num"]) for t in ces_cat["topics"] if t.get("num", "—").isdigit()]
    next_num = max(nums) + 1 if nums else 40

    print(f"📚 Přidávám {len(MISSING)} chybějících knih do ces kategorie\n")

    for i, (title, source_file) in enumerate(MISSING, 1):
        tid = "ces-" + slugify(title)
        if slugify(title) in existing_slugs:
            print(f"  ✓ {title} — již existuje, přeskakuji")
            continue

        notes_path = os.path.join(BOOKS_DIR, source_file)
        notes = read_file(notes_path) if os.path.exists(notes_path) else ""

        print(f"  [{i}/{len(MISSING)}] ⟳ {title}...", end="", flush=True)

        try:
            content = gemini(build_prompt(title, notes[:4000]))

            new_topic = {
                "id": tid,
                "num": str(next_num),
                "title": title,
                "content": content.strip()
            }
            ces_cat["topics"].append(new_topic)
            existing_slugs.add(slugify(title))
            next_num += 1
            save_data(data)
            print(f" ✓ {len(content)} znaků")
            time.sleep(1.5)

        except KeyboardInterrupt:
            print(f"\n⏸ Přerušeno.")
            sys.exit(0)
        except Exception as e:
            print(f" ✗ {e}")

    print(f"\n✅ Hotovo! ces má nyní {len(ces_cat['topics'])} témat.")

if __name__ == "__main__":
    main()
