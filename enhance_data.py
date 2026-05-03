#!/usr/bin/env python3
"""
Rozšíří všechna témata v data.js pomocí Gemini 3.1 Flash Lite Preview.
Kontext: zápisky (.txt/.md) + .docx soubory ze složek Čeština/, KYB/, PRG/
Progress: jeden řádek který se přepisuje.
"""

import json, re, time, os, sys, zipfile, unicodedata, urllib.request

import os
API_KEY = os.environ.get("GEMINI_API_KEY", "")
MODEL   = "gemini-3.1-flash-lite-preview"
URL     = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"

PROGRESS_FILE = "/root/maturita-web-uceni3/.enhance_progress.json"
DATA_FILE     = "/root/maturita-web-uceni3/data.js"
BASE          = "/root/maturita-web-uceni3"

# ── helpers ───────────────────────────────────────────────────────────────────

def load_data():
    with open(DATA_FILE, encoding="utf-8") as f:
        raw = f.read()
    m = re.match(r"const CATEGORIES = (.*?);?\s*$", raw, re.DOTALL)
    return json.loads(m.group(1).rstrip(";"))

def save_data(data):
    js = "const CATEGORIES = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";"
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        f.write(js)

def load_progress():
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE) as f:
            return json.load(f)
    return {}

def save_progress(p):
    with open(PROGRESS_FILE, "w") as f:
        json.dump(p, f)

def read_file(path):
    for enc in ("utf-8-sig", "utf-8", "cp1250", "latin-1"):
        try:
            with open(path, encoding=enc) as f:
                return f.read()
        except Exception:
            continue
    return ""

def read_docx(path):
    try:
        with zipfile.ZipFile(path) as z:
            xml = z.read("word/document.xml").decode("utf-8")
        text = re.sub(r"<[^>]+>", " ", xml)
        text = re.sub(r"\s+", " ", text).strip()
        return text
    except Exception:
        return ""

def slugify(s):
    s = unicodedata.normalize("NFKD", s.lower())
    s = "".join(c for c in s if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9]+", " ", s).strip()

# ── load all source documents ─────────────────────────────────────────────────

def load_all_sources():
    """Returns list of (slug, content) from all .txt/.md/.docx files."""
    sources = []
    scan_dirs = [
        os.path.join(BASE, "zapisky"),
        os.path.join(BASE, "Daily_work"),
        os.path.join(BASE, "Čeština"),
        os.path.join(BASE, "KYB"),
        os.path.join(BASE, "PRG"),
    ]
    for d in scan_dirs:
        if not os.path.isdir(d):
            continue
        for root, _, files in os.walk(d):
            for fname in files:
                ext = os.path.splitext(fname)[1].lower()
                if ext not in (".md", ".txt", ".docx"):
                    continue
                path = os.path.join(root, fname)
                content = read_docx(path) if ext == ".docx" else read_file(path)
                if content.strip():
                    slug = slugify(os.path.splitext(fname)[0])
                    sources.append((slug, content[:5000]))
    return sources

def find_context(title: str, sources: list) -> str:
    title_slug = slugify(title)
    title_words = set(w for w in title_slug.split() if len(w) > 3)
    if not title_words:
        return ""

    scored = []
    for slug, content in sources:
        slug_words = set(slug.split())
        overlap = len(title_words & slug_words)
        if overlap > 0:
            scored.append((overlap, slug, content))

    scored.sort(reverse=True)
    parts = []
    for _, slug, content in scored[:3]:
        parts.append(f"[Zdroj: {slug}]\n{content[:3000]}")
    return "\n\n".join(parts)

# ── gemini ────────────────────────────────────────────────────────────────────

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
            # Immediate raise on content block — no retries
            if d.get("promptFeedback", {}).get("blockReason"):
                raise RuntimeError(f"PROHIBITED_CONTENT: {d['promptFeedback']['blockReason']}")
            if "candidates" not in d:
                raise KeyError(f"No candidates: {json.dumps(d)[:200]}")
            return d["candidates"][0]["content"]["parts"][0]["text"]
        except RuntimeError:
            raise  # don't retry on block
        except Exception as e:
            wait = 15 * (attempt + 1)
            print(f"\n    ⚠ Pokus {attempt+1}/{retries}: {str(e)[:100]}, čekám {wait}s...", flush=True)
            time.sleep(wait)
    raise RuntimeError("Gemini selhal")

# ── prompt ────────────────────────────────────────────────────────────────────

SUBJECT_HINTS = {
    "kyb": "Kybernetická bezpečnost — sítě, protokoly, bezpečnost, hardware, OS, hrozby",
    "prg": "Programování — C#, Java, OOP, HTML, CSS, SQL, algoritmy, datové struktury",
    "ces": "Český jazyk — literatura, autoři, literární pojmy, sloh, jazykové prostředky",
    "mat": "Matematika — algebra, geometrie, analýza, kombinatorika, statistika",
    "ang": "Anglický jazyk — gramatika, slovní zásoba, konverzační témata",
}

def build_prompt(cat_id, cat_name, title, content, context=""):
    hint = SUBJECT_HINTS.get(cat_id, cat_name)
    is_book = cat_id == "ces" and not any(x in title.lower() for x in ["sloh", "rozbor", "mluvnice", "jazykové", "pravopis"])

    length_req = (
        "Výsledek musí být výrazně delší než originál (min. +60 %). "
        "Jde o literární dílo — student musí být schopen mluvit 15 minut. "
        "Povinně zahrň: autor + stručný životopis, historický a literární kontext, literární směr, "
        "rozbor díla (téma, motiv, kompozice, jazyk, postavy, děj), literárněhistorický přínos."
        if is_book else
        "Výsledek má být o 40–70 % delší než originál."
    )

    ctx_section = f"\nPODKLADY K TÉMATU (využij relevantní informace, nepřepisuj doslova):\n{context}\n" if context else ""

    return f"""Jsi odborný editor studijních materiálů pro maturitní přípravu. Předmět: {hint}.
Zpracováváš LITERÁRNÍ ROZBOR díla pro školní účely. Veškerý obsah je čistě vzdělávací.

ÚKOL: Rozšiř a vylepši níže uvedený studijní text na základě podkladů.

ZÁVAZNÁ PRAVIDLA:
1. ZACHOVEJ celý původní text — pouze ho ROZŠIŘ o informace z podkladů a obecně známá fakta.
2. Styl: výhradně objektivní, věcný, odborný. Žádné oslovování čtenáře, žádné „představ si", „zkus", „pojďme".
3. Každý odborný termín, zkratku, jméno autora nebo literární pojem označ:
   [[TERM:název|Definice v 1–3 větách.]]
   Příklady:
   [[TERM:VLAN|Virtuální lokální síť (IEEE 802.1Q). Logicky odděluje provoz na fyzickém switchi bez fyzického oddělení kabeláže.]]
   [[TERM:Karel Čapek|Český spisovatel (1890–1938). Autor R.U.R., Války s mloky, Bílé nemoci. Představitel demokratického proudu české meziválečné literatury.]]
   [[TERM:metafora|Přenesení pojmenování na základě podobnosti (např. „moře slz"). Základní básnický tropus.]]
4. Formátování (markdown):
   - `##` hlavní nadpis, `###` podnadpisy
   - `*   **Pojem**: vysvětlení` pro výčty — každý bod na vlastním řádku
   - Odstavce max 3–4 věty
   - Tabulky pro srovnání kde to dává smysl
5. {length_req}
6. Pouze ověřené fakty z podkladů nebo obecně známé. Nic nevymýšlej.
{ctx_section}
Téma: {title}

--- PŮVODNÍ OBSAH ---
{content}
--- KONEC ---

Vrať POUZE rozšířený markdown text. Bez komentářů."""

# ── progress bar (single line) ────────────────────────────────────────────────

def print_progress(done, total, tid, status):
    filled = int(done / total * 30)
    bar = "█" * filled + "░" * (30 - filled)
    pct = int(done / total * 100)
    line = f"\r  [{bar}] {pct:3d}% {done}/{total}  {status:<50}"
    sys.stdout.write(line)
    sys.stdout.flush()

# ── main ──────────────────────────────────────────────────────────────────────

def main():
    data     = load_data()
    progress = load_progress()

    print("📁 Načítám podklady...", end="", flush=True)
    sources = load_all_sources()
    print(f" {len(sources)} souborů načteno.")

    all_topics = [(cat, t) for cat in data for t in cat["topics"]]
    total = len(all_topics)
    done  = sum(1 for v in progress.values() if v == "done")

    print(f"📚 Celkem: {total} témat | Hotovo: {done} | Zbývá: {total - done}\n")

    for cat, topic in all_topics:
        tid   = topic["id"]
        title = topic["title"]
        done  = sum(1 for v in progress.values() if v in ("done", "skipped"))

        if progress.get(tid) in ("done", "skipped"):
            print_progress(done, total, tid, f"✓ {title[:40]}")
            continue

        content   = topic["content"]
        ctx       = find_context(title, sources)
        ctx_flag  = "📎" if ctx else "  "

        print_progress(done, total, tid, f"⟳ {ctx_flag} {title[:35]}...")

        try:
            enhanced = gemini(build_prompt(cat["id"], cat["name_cs"], title, content, ctx))

            if len(enhanced) < len(content) * 0.75:
                progress[tid] = "skipped"
                save_progress(progress)
                print_progress(done + 1, total, tid, f"⚠ krátký, přeskočeno — {title[:30]}")
                continue

            topic["content"] = enhanced.strip()
            progress[tid]    = "done"
            save_progress(progress)
            save_data(data)

            pct_inc = round((len(enhanced) / len(content) - 1) * 100)
            print_progress(done + 1, total, tid, f"✓ {ctx_flag} {title[:28]}  +{pct_inc}%")
            time.sleep(1.5)

        except KeyboardInterrupt:
            print(f"\n\n⏸ Přerušeno. Pokrok uložen ({done}/{total}). Spusť znovu pro pokračování.")
            sys.exit(0)
        except Exception as e:
            err_msg = str(e)
            # PROHIBITED_CONTENT — retry without the title in prompt
            if "PROHIBITED_CONTENT" in err_msg or "blockReason" in err_msg:
                try:
                    print_progress(done, total, tid, f"⟳ retry bez názvu — {title[:30]}...")
                    enhanced = gemini(build_prompt(cat["id"], cat["name_cs"], "literární dílo", content, ctx))
                    topic["content"] = enhanced.strip()
                    progress[tid] = "done"
                    save_progress(progress)
                    save_data(data)
                    pct_inc = round((len(enhanced) / len(content) - 1) * 100)
                    print_progress(done + 1, total, tid, f"✓ {title[:28]}  +{pct_inc}%")
                    time.sleep(1.5)
                except Exception:
                    progress[tid] = "skipped"
                    save_progress(progress)
                    print_progress(done + 1, total, tid, f"⚠ blokováno — {title[:30]}")
            else:
                progress[tid] = "error"
                save_progress(progress)
                print_progress(done, total, tid, f"✗ {title[:30]}: {err_msg[:35]}")

    done_c = sum(1 for v in progress.values() if v == "done")
    err_c  = sum(1 for v in progress.values() if v == "error")
    print(f"\n\n✅ Hotovo! {done_c}/{total} zpracováno | Chyby: {err_c}")
    if err_c == 0 and done_c == total and os.path.exists(PROGRESS_FILE):
        os.remove(PROGRESS_FILE)

if __name__ == "__main__":
    main()
