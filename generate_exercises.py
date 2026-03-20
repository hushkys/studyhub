#!/usr/bin/env python3
import json, re, time, urllib.request

API_KEY = "REMOVED"
MODEL   = "gemini-3.1-flash-lite-preview"
URL     = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"

def ask(prompt):
    body = json.dumps({"contents":[{"parts":[{"text":prompt}]}],
        "generationConfig":{"temperature":0.5,"maxOutputTokens":8192}}).encode()
    req = urllib.request.Request(URL, data=body, headers={"Content-Type":"application/json"}, method="POST")
    with urllib.request.urlopen(req, timeout=120) as r:
        d = json.load(r)
    if d.get("promptFeedback",{}).get("blockReason"): raise RuntimeError("BLOCKED")
    return d["candidates"][0]["content"]["parts"][0]["text"]

TOPICS = [
    ("java-basics",     "Java/C# základy",        "proměnné, datové typy, podmínky if/else, cykly for/while/foreach, switch, operátory"),
    ("oop",             "OOP principy",            "třídy, objekty, dědičnost (extends), zapouzdření (private/public), polymorfismus, override"),
    ("methods",         "Metody tříd",             "návratové typy, parametry, přetížení metod, modifikátory přístupu, static, void"),
    ("constructors",    "Konstruktory",            "bezparametrický konstruktor, konstruktor s parametry, přetížení konstruktorů, this, base"),
    ("interfaces",      "Rozhraní a abstrakce",    "interface, abstract class, implements, override, abstraktní metody, dědičnost rozhraní"),
    ("collections",     "Kolekce a generika",      "ArrayList, List<T>, Dictionary, HashMap, foreach iterace, generické třídy, LINQ"),
    ("design-patterns", "Návrhové vzory",          "Singleton (private konstruktor, static instance), Utility (static třída), Messenger, Servant, Enum, tovární metoda"),
    ("sql",             "SQL databáze",            "SELECT, WHERE, ORDER BY, JOIN (INNER/LEFT), INSERT INTO, UPDATE, DELETE, CREATE TABLE, PRIMARY KEY, FOREIGN KEY"),
    ("html-css",        "HTML a CSS",              "sémantické tagy, atributy, CSS selektory, box model, flexbox, grid, media queries, specifičnost"),
    ("algorithms",      "Algoritmizace",           "bubble sort, binary search, rekurze, časová složitost O(n), zásobník, fronta, linked list"),
]

PROMPT = '''You are an expert programming teacher creating exercises for Czech high school students (IT specialization, C# / Java).

Generate exercises for topic: {name} ({desc})

Return ONLY a valid JSON array (no markdown, no comments). Generate exactly 15 exercises:
- 8 of type "dragdrop"
- 4 of type "fill"  
- 3 of type "order"

DRAGDROP format (fill in the blank in real code):
{{
  "id": "{tid}-dd-1",
  "type": "dragdrop",
  "difficulty": "easy"|"medium"|"hard",
  "instruction": "Short task description in Czech.",
  "code": "realistic multiline C# or Java code with ___BLANK___ placeholders\\nuse \\\\n for newlines",
  "blanks": ["correct answer for each BLANK in order"],
  "options": ["correct1", "wrong1", "wrong2", "wrong3", "wrong4"],
  "explanation": "Why this is correct — 1 sentence in Czech."
}}

FILL format (type the answer):
{{
  "id": "{tid}-f-1",
  "type": "fill",
  "difficulty": "easy"|"medium"|"hard",
  "instruction": "Question in Czech requiring 1-3 word answer.",
  "answer": "exact answer",
  "accept_also": ["alternative correct answers"],
  "explanation": "Explanation in Czech."
}}

ORDER format (reorder shuffled code lines):
{{
  "id": "{tid}-o-1",
  "type": "order",
  "difficulty": "medium"|"hard",
  "instruction": "Seřaď řádky kódu do správného pořadí.",
  "lines": ["line1", "line2", "line3", "line4", "line5"],
  "correct_order": [2, 0, 4, 1, 3],
  "explanation": "Explanation of correct order in Czech."
}}

REQUIREMENTS:
- Code must be REALISTIC and COMPLETE (not just fragments) — show full method/class context
- Use proper C# syntax (not pseudocode)
- Wrong options must be plausible (same type, similar syntax)
- Difficulties: 5 easy, 7 medium, 3 hard
- Each exercise must test something DIFFERENT
- Code in "code" field: use \\n for newlines, no actual newlines in JSON strings
- Return ONLY the JSON array, starting with [ and ending with ]
'''

results = []
for tid, name, desc in TOPICS:
    print(f"  [{TOPICS.index((tid,name,desc))+1}/{len(TOPICS)}] {name}...", end="", flush=True)
    for attempt in range(3):
        try:
            raw = ask(PROMPT.format(tid=tid, name=name, desc=desc))
            raw = re.sub(r"^```(?:json)?\s*", "", raw.strip())
            raw = re.sub(r"\s*```$", "", raw.strip())
            # Find JSON array
            m = re.search(r'\[.*\]', raw, re.DOTALL)
            if m: raw = m.group(0)
            exercises = json.loads(raw)
            results.append({"topic_id": tid, "topic_name": name, "exercises": exercises})
            print(f" ✓ {len(exercises)} cvičení")
            break
        except Exception as e:
            if attempt == 2: print(f" ✗ {e}")
            else: time.sleep(5)
    time.sleep(2)

with open("/root/maturita-web-uceni3/exercises.js", "w", encoding="utf-8") as f:
    f.write("const EXERCISES = " + json.dumps(results, ensure_ascii=False, indent=2) + ";")
total = sum(len(r["exercises"]) for r in results)
print(f"\n✅ {total} cvičení v {len(results)} tématech")
