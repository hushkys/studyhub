const EXERCISES = [
  {
    "topic_id": "java-basics",
    "topic_name": "Java/C# základy",
    "exercises": [
      {
        "id": "cs-basics-dd-1",
        "type": "dragdrop",
        "difficulty": "easy",
        "instruction": "Doplň datový typ pro proměnnou reprezentující věk.",
        "code": "public class Program {\n    public static void Main() {\n        ___BLANK___ age = 25;\n        Console.WriteLine(age);\n    }\n}",
        "blanks": [
          "int"
        ],
        "options": [
          "int",
          "string",
          "bool",
          "double",
          "char"
        ],
        "explanation": "Pro celá čísla v C# používáme datový typ int."
      },
      {
        "id": "cs-basics-dd-2",
        "type": "dragdrop",
        "difficulty": "easy",
        "instruction": "Doplň podmínku pro kontrolu, zda je číslo kladné.",
        "code": "int number = 10;\nif (___BLANK___) {\n    Console.WriteLine(\"Kladné\");\n}",
        "blanks": [
          "number > 0"
        ],
        "options": [
          "number > 0",
          "number = 0",
          "number < 0",
          "number == \"0\"",
          "number >= 10"
        ],
        "explanation": "Operátor > porovnává, zda je hodnota větší než nula."
      },
      {
        "id": "cs-basics-dd-3",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplň cyklus for, který vypíše čísla od 0 do 4.",
        "code": "for (int i = 0; ___BLANK___; i++) {\n    Console.WriteLine(i);\n}",
        "blanks": [
          "i < 5"
        ],
        "options": [
          "i < 5",
          "i <= 4",
          "i > 5",
          "i == 5",
          "i != 5"
        ],
        "explanation": "Podmínka i < 5 zajistí, že cyklus proběhne pro hodnoty 0, 1, 2, 3, 4."
      },
      {
        "id": "cs-basics-dd-4",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplň klíčové slovo pro ukončení větve v switch.",
        "code": "switch (day) {\n    case 1: \n        Console.WriteLine(\"Pondělí\");\n        ___BLANK___;\n}",
        "blanks": [
          "break"
        ],
        "options": [
          "break",
          "return",
          "continue",
          "stop",
          "exit"
        ],
        "explanation": "Příkaz break ukončuje provádění bloku case v switch."
      },
      {
        "id": "cs-basics-dd-5",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplň operátor pro logické AND.",
        "code": "if (age > 18 ___BLANK___ hasLicense) {\n    Console.WriteLine(\"Může řídit\");\n}",
        "blanks": [
          "&&"
        ],
        "options": [
          "&&",
          "||",
          "!",
          "&",
          "|"
        ],
        "explanation": "Logický operátor && vyžaduje splnění obou podmínek."
      },
      {
        "id": "cs-basics-dd-6",
        "type": "dragdrop",
        "difficulty": "hard",
        "instruction": "Doplň cyklus foreach pro průchod polem čísel.",
        "code": "int[] numbers = {1, 2, 3};\nforeach (___BLANK___ n in numbers) {\n    Console.WriteLine(n);\n}",
        "blanks": [
          "int"
        ],
        "options": [
          "int",
          "var",
          "foreach",
          "array",
          "int[]"
        ],
        "explanation": "V foreach cyklu musíme definovat datový typ proměnné, která drží aktuální prvek."
      },
      {
        "id": "cs-basics-dd-7",
        "type": "dragdrop",
        "difficulty": "hard",
        "instruction": "Doplň správný operátor pro přiřazení hodnoty.",
        "code": "int score = 0;\nscore ___BLANK___ 10;\n// score je nyní 10",
        "blanks": [
          "="
        ],
        "options": [
          "=",
          "==",
          "===",
          "+",
          "is"
        ],
        "explanation": "Pro přiřazení hodnoty do proměnné používáme operátor =."
      },
      {
        "id": "cs-basics-dd-8",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplň klíčové slovo pro deklaraci konstanty.",
        "code": "___BLANK___ double PI = 3.14;\nPI = 3.15; // Způsobí chybu",
        "blanks": [
          "const"
        ],
        "options": [
          "const",
          "readonly",
          "static",
          "final",
          "var"
        ],
        "explanation": "Klíčové slovo const v C# definuje neměnnou hodnotu."
      },
      {
        "id": "cs-basics-f-1",
        "type": "fill",
        "difficulty": "easy",
        "instruction": "Jaký datový typ se v C# používá pro textové řetězce?",
        "answer": "string",
        "accept_also": [
          "String"
        ],
        "explanation": "Typ string slouží k ukládání textových řetězců."
      },
      {
        "id": "cs-basics-f-2",
        "type": "fill",
        "difficulty": "easy",
        "instruction": "Jak se nazývá operátor pro zbytek po dělení?",
        "answer": "modulo",
        "accept_also": [
          "%",
          "mod"
        ],
        "explanation": "Operátor % vrací zbytek po celočíselném dělení."
      },
      {
        "id": "cs-basics-f-3",
        "type": "fill",
        "difficulty": "medium",
        "instruction": "Jaký datový typ se používá pro hodnoty true nebo false?",
        "answer": "bool",
        "accept_also": [
          "boolean"
        ],
        "explanation": "Typ bool reprezentuje logickou hodnotu (pravda/nepravda)."
      },
      {
        "id": "cs-basics-f-4",
        "type": "hard",
        "instruction": "Jak se nazývá cyklus, který zaručeně proběhne alespoň jednou?",
        "answer": "do-while",
        "accept_also": [
          "do while"
        ],
        "explanation": "Cyklus do-while vyhodnocuje podmínku až po vykonání těla cyklu."
      },
      {
        "id": "cs-basics-o-1",
        "type": "order",
        "difficulty": "medium",
        "instruction": "Seřaď řádky pro výpočet součtu čísel v poli.",
        "lines": [
          "int sum = 0;",
          "foreach (int n in numbers) {",
          "}",
          "sum += n;",
          "int[] numbers = {1, 2, 3};"
        ],
        "correct_order": [
          4,
          0,
          1,
          3,
          2
        ],
        "explanation": "Nejprve deklarujeme pole, pak proměnnou pro součet, poté cyklus a v něm přičítání."
      },
      {
        "id": "cs-basics-o-2",
        "type": "order",
        "difficulty": "medium",
        "instruction": "Seřaď řádky pro jednoduchou if-else strukturu.",
        "lines": [
          "else {",
          "Console.WriteLine(\"Liché\");",
          "if (x % 2 == 0) {",
          "Console.WriteLine(\"Sudé\");",
          "}"
        ],
        "correct_order": [
          2,
          3,
          0,
          1,
          4
        ],
        "explanation": "Nejprve podmínka, pak blok pro pravdu, pak else a blok pro nepravdu."
      },
      {
        "id": "cs-basics-o-3",
        "type": "order",
        "difficulty": "hard",
        "instruction": "Seřaď řádky pro metodu, která vrací výsledek.",
        "lines": [
          "return result;",
          "int result = a + b;",
          "public int Add(int a, int b) {",
          "}",
          "int a = 5;"
        ],
        "correct_order": [
          2,
          1,
          0,
          3,
          4
        ],
        "explanation": "Definice metody, výpočet, návrat hodnoty a uzavření bloku."
      }
    ]
  },
  {
    "topic_id": "oop",
    "topic_name": "OOP principy",
    "exercises": [
      {
        "id": "oop-dd-1",
        "type": "dragdrop",
        "difficulty": "easy",
        "instruction": "Doplň modifikátor přístupu tak, aby atribut nebyl přístupný zvenčí třídy.",
        "code": "public class Uzivatel {\n    ___BLANK___ string jmeno;\n\n    public string GetJmeno() {\n        return jmeno;\n    }\n}",
        "blanks": [
          "private"
        ],
        "options": [
          "private",
          "public",
          "protected",
          "internal",
          "static"
        ],
        "explanation": "Zapouzdření vyžaduje použití modifikátoru private pro skrytí vnitřních dat třídy."
      },
      {
        "id": "oop-dd-2",
        "type": "dragdrop",
        "difficulty": "easy",
        "instruction": "Doplň klíčové slovo pro dědičnost v C#.",
        "code": "public class Pes ___BLANK___ Zvire {\n    public void Stenat() { }\n}",
        "blanks": [
          ":"
        ],
        "options": [
          ":",
          "extends",
          "inherits",
          "implements",
          "base"
        ],
        "explanation": "V C# se dědičnost tříd definuje pomocí dvojtečky za názvem třídy."
      },
      {
        "id": "oop-dd-3",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplň klíčové slovo pro přepsání metody v odvozené třídě.",
        "code": "public class Pes : Zvire {\n    public ___BLANK___ void VydavejZvuk() {\n        Console.WriteLine(\"Haf\");\n    }\n}",
        "blanks": [
          "override"
        ],
        "options": [
          "override",
          "virtual",
          "new",
          "abstract",
          "static"
        ],
        "explanation": "Klíčové slovo override se používá pro změnu chování virtuální metody předka."
      },
      {
        "id": "oop-dd-4",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplň klíčové slovo, které umožní přepsání metody v potomkovi.",
        "code": "public class Zvire {\n    public ___BLANK___ void VydavejZvuk() {\n        Console.WriteLine(\"Zvuk\");\n    }\n}",
        "blanks": [
          "virtual"
        ],
        "options": [
          "virtual",
          "override",
          "abstract",
          "sealed",
          "public"
        ],
        "explanation": "Metoda musí být označena jako virtual, aby ji potomek mohl přepsat pomocí override."
      },
      {
        "id": "oop-dd-5",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplň volání konstruktoru předka.",
        "code": "public class Pes : Zvire {\n    public Pes(string jmeno) ___BLANK___ (jmeno) { }\n}",
        "blanks": [
          ": base"
        ],
        "options": [
          ": base",
          ": this",
          "base()",
          "super()",
          "parent()"
        ],
        "explanation": "V C# se konstruktor předka volá pomocí klíčového slova base v hlavičce konstruktoru."
      },
      {
        "id": "oop-dd-6",
        "type": "dragdrop",
        "difficulty": "hard",
        "instruction": "Doplň modifikátor pro abstraktní třídu, kterou nelze instanciovat.",
        "code": "___BLANK___ class Zvire {\n    public abstract void VydavejZvuk();\n}",
        "blanks": [
          "abstract"
        ],
        "options": [
          "abstract",
          "sealed",
          "static",
          "virtual",
          "interface"
        ],
        "explanation": "Abstraktní třída slouží jako šablona a nelze z ní vytvořit přímou instanci."
      },
      {
        "id": "oop-dd-7",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplň klíčové slovo pro odkaz na aktuální instanci objektu.",
        "code": "public class Osoba {\n    private string jmeno;\n    public void SetJmeno(string jmeno) {\n        ___BLANK___.jmeno = jmeno;\n    }\n}",
        "blanks": [
          "this"
        ],
        "options": [
          "this",
          "base",
          "self",
          "instance",
          "current"
        ],
        "explanation": "Klíčové slovo this odkazuje na aktuální instanci třídy a řeší kolizi názvů parametrů."
      },
      {
        "id": "oop-dd-8",
        "type": "dragdrop",
        "difficulty": "hard",
        "instruction": "Doplň modifikátor, aby třída nemohla být dále děděna.",
        "code": "public ___BLANK___ class FinalniTrida {\n}",
        "blanks": [
          "sealed"
        ],
        "options": [
          "sealed",
          "static",
          "abstract",
          "final",
          "private"
        ],
        "explanation": "Modifikátor sealed v C# znemožňuje dědění od dané třídy."
      },
      {
        "id": "oop-f-1",
        "type": "fill",
        "difficulty": "easy",
        "instruction": "Jak se nazývá proces skrytí vnitřních dat objektu před vnějším světem?",
        "answer": "zapouzdření",
        "accept_also": [
          "enkapsulace"
        ],
        "explanation": "Zapouzdření (encapsulation) je základní princip OOP chránící stav objektu."
      },
      {
        "id": "oop-f-2",
        "type": "fill",
        "difficulty": "easy",
        "instruction": "Jaká je šablona (návrh) pro vytváření objektů v OOP?",
        "answer": "třída",
        "accept_also": [
          "class"
        ],
        "explanation": "Třída definuje vlastnosti a chování objektů, které z ní vznikají."
      },
      {
        "id": "oop-f-3",
        "type": "fill",
        "difficulty": "medium",
        "instruction": "Jak se nazývá schopnost objektu vystupovat v různých formách (např. potomek jako předek)?",
        "answer": "polymorfismus",
        "accept_also": [
          "mnohotvárnost"
        ],
        "explanation": "Polymorfismus umožňuje zacházet s objekty různých tříd skrze společné rozhraní."
      },
      {
        "id": "oop-f-4",
        "type": "fill",
        "difficulty": "hard",
        "instruction": "Jak se nazývá speciální metoda, která se automaticky volá při vytvoření instance třídy?",
        "answer": "konstruktor",
        "accept_also": [
          "constructor"
        ],
        "explanation": "Konstruktor inicializuje objekt při jeho vzniku v paměti."
      },
      {
        "id": "oop-o-1",
        "type": "order",
        "difficulty": "medium",
        "instruction": "Seřaď řádky pro správné vytvoření a použití objektu.",
        "lines": [
          "Osoba o = new Osoba();",
          "o.Jmeno = \"Petr\";",
          "public class Osoba { public string Jmeno; }",
          "Console.WriteLine(o.Jmeno);",
          "class Program { static void Main() {"
        ],
        "correct_order": [
          2,
          4,
          0,
          1,
          3
        ],
        "explanation": "Nejprve definujeme třídu, pak metodu Main, vytvoříme instanci, nastavíme hodnotu a vypíšeme ji."
      },
      {
        "id": "oop-o-2",
        "type": "order",
        "difficulty": "medium",
        "instruction": "Seřaď řádky metody pro bezpečné nastavení soukromého pole (setter).",
        "lines": [
          "if (vek >= 0) {",
          "public void SetVek(int vek) {",
          "this.vek = vek;",
          "}",
          "}"
        ],
        "correct_order": [
          1,
          0,
          2,
          4,
          3
        ],
        "explanation": "Metoda musí začínat definicí, následovat podmínka pro validaci, přiřazení a uzavření bloků."
      },
      {
        "id": "oop-o-3",
        "type": "order",
        "difficulty": "hard",
        "instruction": "Seřaď řádky pro dědičnost a volání konstruktoru předka.",
        "lines": [
          ": base(jmeno) { }",
          "public class Pes : Zvire {",
          "public Pes(string jmeno)",
          "public Zvire(string jmeno) { }",
          "}"
        ],
        "correct_order": [
          3,
          1,
          2,
          0,
          4
        ],
        "explanation": "Nejprve definujeme předka, poté potomka, konstruktor potomka a volání base."
      }
    ]
  },
  {
    "topic_id": "methods",
    "topic_name": "Metody tříd",
    "exercises": [
      {
        "id": "methods-dd-1",
        "type": "dragdrop",
        "difficulty": "easy",
        "instruction": "Doplňte návratový typ metody, která vrací celé číslo.",
        "code": "public class Calculator {\n    public ___BLANK___ Add(int a, int b) {\n        return a + b;\n    }\n}",
        "blanks": [
          "int"
        ],
        "options": [
          "int",
          "void",
          "string",
          "bool",
          "double"
        ],
        "explanation": "Metoda vrací součet dvou celých čísel, proto musí být návratový typ int."
      },
      {
        "id": "methods-dd-2",
        "type": "dragdrop",
        "difficulty": "easy",
        "instruction": "Doplňte klíčové slovo pro metodu, která nic nevrací.",
        "code": "public class Logger {\n    public ___BLANK___ PrintMessage(string msg) {\n        Console.WriteLine(msg);\n    }\n}",
        "blanks": [
          "void"
        ],
        "options": [
          "void",
          "null",
          "empty",
          "int",
          "static"
        ],
        "explanation": "Klíčové slovo void označuje, že metoda nevrací žádnou hodnotu."
      },
      {
        "id": "methods-dd-3",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplňte modifikátor, aby byla metoda přístupná pouze v rámci své třídy.",
        "code": "public class Secret {\n    ___BLANK___ void ShowSecret() {\n        Console.WriteLine(\"Secret\");\n    }\n}",
        "blanks": [
          "private"
        ],
        "options": [
          "private",
          "public",
          "protected",
          "internal",
          "static"
        ],
        "explanation": "Modifikátor private omezuje přístup k členu pouze na danou třídu."
      },
      {
        "id": "methods-dd-4",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplňte klíčové slovo pro volání metody bez vytvoření instance třídy.",
        "code": "public class MathUtils {\n    public ___BLANK___ int Square(int x) {\n        return x * x;\n    }\n}",
        "blanks": [
          "static"
        ],
        "options": [
          "static",
          "void",
          "public",
          "const",
          "readonly"
        ],
        "explanation": "Statické metody patří třídě, nikoliv instanci, a volají se přímo přes název třídy."
      },
      {
        "id": "methods-dd-5",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplňte správný datový typ parametru pro metodu, která přijímá pravdivostní hodnotu.",
        "code": "public class Switcher {\n    public void Toggle(___BLANK___ state) {\n        Console.WriteLine(\"State: \" + state);\n    }\n}",
        "blanks": [
          "bool"
        ],
        "options": [
          "bool",
          "boolean",
          "int",
          "string",
          "void"
        ],
        "explanation": "V C# se pro logické hodnoty používá klíčové slovo bool."
      },
      {
        "id": "methods-dd-6",
        "type": "dragdrop",
        "difficulty": "hard",
        "instruction": "Doplňte kód pro volání přetížené metody s jiným počtem parametrů.",
        "code": "public class Printer {\n    public void Show(string text) { Console.WriteLine(text); }\n    public void Show(string text, int count) {\n        for(int i=0; i<count; i++) ___BLANK___;\n    }\n}",
        "blanks": [
          "Show(text)"
        ],
        "options": [
          "Show(text)",
          "Show()",
          "Print(text)",
          "this.Show(text)",
          "base.Show(text)"
        ],
        "explanation": "Přetížení umožňuje volat metodu se stejným názvem, ale jinou signaturou."
      },
      {
        "id": "methods-dd-7",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplňte klíčové slovo pro návrat hodnoty z metody.",
        "code": "public int GetNumber() {\n    int x = 10;\n    ___BLANK___ x;\n}",
        "blanks": [
          "return"
        ],
        "options": [
          "return",
          "yield",
          "output",
          "send",
          "give"
        ],
        "explanation": "Příkaz return ukončí metodu a vrátí specifikovanou hodnotu volajícímu."
      },
      {
        "id": "methods-dd-8",
        "type": "dragdrop",
        "difficulty": "hard",
        "instruction": "Doplňte volání metody v rámci téže třídy.",
        "code": "public class Processor {\n    public void Run() {\n        ___BLANK___;\n    }\n    private void Start() { }\n}",
        "blanks": [
          "Start()"
        ],
        "options": [
          "Start()",
          "this.Run()",
          "Processor.Start()",
          "void Start()",
          "new Start()"
        ],
        "explanation": "Metody uvnitř stejné třídy lze volat přímo jejich názvem."
      },
      {
        "id": "methods-f-1",
        "type": "fill",
        "difficulty": "easy",
        "instruction": "Jak se nazývá technika, kdy máme v jedné třídě více metod se stejným názvem, ale různými parametry?",
        "answer": "přetížení",
        "accept_also": [
          "overloading",
          "metodové přetížení"
        ],
        "explanation": "Přetížení (overloading) umožňuje definovat více verzí metody se stejným jménem."
      },
      {
        "id": "methods-f-2",
        "type": "fill",
        "difficulty": "medium",
        "instruction": "Jaký modifikátor přístupu zajistí, že metoda je viditelná pouze v rámci stejného projektu?",
        "answer": "internal",
        "accept_also": [
          "internal"
        ],
        "explanation": "Modifikátor internal omezuje viditelnost na aktuální assembly (projekt)."
      },
      {
        "id": "methods-f-3",
        "type": "fill",
        "difficulty": "hard",
        "instruction": "Jak se nazývá proměnná definovaná v záhlaví metody, která přijímá hodnotu při volání?",
        "answer": "parametr",
        "accept_also": [
          "formální parametr"
        ],
        "explanation": "Parametr je zástupný název pro hodnotu, kterou metoda očekává při svém zavolání."
      },
      {
        "id": "methods-f-4",
        "type": "fill",
        "difficulty": "easy",
        "instruction": "Jaké klíčové slovo v C# označuje metodu, která nevrací žádnou hodnotu?",
        "answer": "void",
        "accept_also": [
          "void"
        ],
        "explanation": "Void je návratový typ používaný u metod, které pouze vykonají kód bez vrácení výsledku."
      },
      {
        "id": "methods-o-1",
        "type": "order",
        "difficulty": "medium",
        "instruction": "Seřaďte řádky definice metody, která sčítá dvě čísla.",
        "lines": [
          "public int Sum(int a, int b)",
          "{",
          "return a + b;",
          "}",
          "public class Calc"
        ],
        "correct_order": [
          4,
          1,
          0,
          1,
          2,
          3
        ],
        "explanation": "Správná struktura je třída -> metoda -> tělo metody s return."
      },
      {
        "id": "methods-o-2",
        "type": "order",
        "difficulty": "medium",
        "instruction": "Seřaďte řádky pro vytvoření statické metody.",
        "lines": [
          "public static void SayHello()",
          "{",
          "Console.WriteLine(\"Hello\");",
          "}",
          "public class Greeter"
        ],
        "correct_order": [
          4,
          1,
          0,
          1,
          2,
          3
        ],
        "explanation": "Třída obsahuje metodu, metoda má modifikátory, hlavičku a tělo."
      },
      {
        "id": "methods-o-3",
        "type": "order",
        "difficulty": "hard",
        "instruction": "Seřaďte řádky pro volání metody s návratovou hodnotou a jejím uložením.",
        "lines": [
          "int result;",
          "result = myObj.Calculate(5, 10);",
          "Calculator myObj = new Calculator();",
          "Console.WriteLine(result);",
          "myObj = new Calculator();"
        ],
        "correct_order": [
          2,
          0,
          1,
          3
        ],
        "explanation": "Nejprve vytvoříme instanci, deklarujeme proměnnou, zavoláme metodu a výsledek vypíšeme."
      }
    ]
  },
  {
    "topic_id": "constructors",
    "topic_name": "Konstruktory",
    "exercises": [
      {
        "id": "constructors-dd-1",
        "type": "dragdrop",
        "difficulty": "easy",
        "instruction": "Doplňte klíčové slovo pro volání konstruktoru předka.",
        "code": "public class Manager : Employee {\n    public Manager(string name) ___BLANK___(name) {\n    }\n}",
        "blanks": [
          "base"
        ],
        "options": [
          "base",
          "this",
          "super",
          "parent",
          "new"
        ],
        "explanation": "Klíčové slovo 'base' v C# slouží k volání konstruktoru nadřazené třídy."
      },
      {
        "id": "constructors-dd-2",
        "type": "dragdrop",
        "difficulty": "easy",
        "instruction": "Doplňte název konstruktoru pro třídu Car.",
        "code": "public class Car {\n    public ___BLANK___() {\n        Console.WriteLine(\"Auto vytvořeno\");\n    }\n}",
        "blanks": [
          "Car"
        ],
        "options": [
          "Car",
          "void",
          "public",
          "Init",
          "create"
        ],
        "explanation": "Konstruktor musí mít přesně stejný název jako třída, ve které je definován."
      },
      {
        "id": "constructors-dd-3",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplňte klíčové slovo pro odlišení parametru od členské proměnné.",
        "code": "public class Student {\n    private string name;\n    public Student(string name) {\n        ___BLANK___.name = name;\n    }\n}",
        "blanks": [
          "this"
        ],
        "options": [
          "this",
          "base",
          "self",
          "class",
          "instance"
        ],
        "explanation": "Klíčové slovo 'this' odkazuje na aktuální instanci objektu a umožňuje přístup k jejím polím."
      },
      {
        "id": "constructors-dd-4",
        "type": "medium",
        "difficulty": "medium",
        "instruction": "Doplňte volání konstruktoru téže třídy.",
        "code": "public class User {\n    public User() : ___BLANK___(\"Neznámý\") { }\n    public User(string name) { }\n}",
        "blanks": [
          "this"
        ],
        "options": [
          "this",
          "base",
          "new",
          "User",
          "super"
        ],
        "explanation": "Zápis ': this(...)' umožňuje delegovat inicializaci na jiný konstruktor ve stejné třídě."
      },
      {
        "id": "constructors-dd-5",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplňte modifikátor přístupu pro standardní konstruktor.",
        "code": "public class Settings {\n    ___BLANK___ Settings() { }\n}",
        "blanks": [
          "private"
        ],
        "options": [
          "private",
          "static",
          "void",
          "override",
          "virtual"
        ],
        "explanation": "Použití 'private' konstruktoru zabrání vytvoření instance třídy zvenčí (např. u Singletonu)."
      },
      {
        "id": "constructors-dd-6",
        "type": "dragdrop",
        "difficulty": "hard",
        "instruction": "Doplňte správný zápis pro volání konstruktoru předka s parametry.",
        "code": "public class Dog : Animal {\n    public Dog(string name, int age) ___BLANK___(name) {\n        this.Age = age;\n    }\n}",
        "blanks": [
          "base"
        ],
        "options": [
          "base",
          "this",
          "super",
          "parent",
          "new"
        ],
        "explanation": "Konstruktor potomka musí explicitně předat parametry konstruktoru předka pomocí 'base'."
      },
      {
        "id": "constructors-dd-7",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplňte chybějící typ návratové hodnoty (pokud existuje).",
        "code": "public class Logger {\n    public ___BLANK___ Logger() {\n    }\n}",
        "blanks": [
          ""
        ],
        "options": [
          "",
          "void",
          "int",
          "Logger",
          "static"
        ],
        "explanation": "Konstruktor nemá žádný návratový typ, ani 'void'."
      },
      {
        "id": "constructors-dd-8",
        "type": "dragdrop",
        "difficulty": "hard",
        "instruction": "Doplňte klíčové slovo pro statický konstruktor.",
        "code": "public class Database {\n    ___BLANK___ Database() {\n        Console.WriteLine(\"Inicializace statických dat\");\n    }\n}",
        "blanks": [
          "static"
        ],
        "options": [
          "static",
          "public",
          "private",
          "sealed",
          "readonly"
        ],
        "explanation": "Statický konstruktor se označuje klíčovým slovem 'static' a volá se pouze jednou při prvním přístupu ke třídě."
      },
      {
        "id": "constructors-f-1",
        "type": "fill",
        "difficulty": "easy",
        "instruction": "Jak se nazývá konstruktor, který nemá žádné parametry?",
        "answer": "bezparametrický",
        "accept_also": [
          "defaultní",
          "implicitní"
        ],
        "explanation": "Bezparametrický konstruktor je základní konstruktor bez argumentů."
      },
      {
        "id": "constructors-f-2",
        "type": "fill",
        "difficulty": "medium",
        "instruction": "Jak se nazývá technika, kdy má třída více konstruktorů s různými parametry?",
        "answer": "přetížení",
        "accept_also": [
          "overloading"
        ],
        "explanation": "Přetížení (overloading) umožňuje definovat více verzí konstruktoru podle signatury parametrů."
      },
      {
        "id": "constructors-f-3",
        "type": "fill",
        "difficulty": "medium",
        "instruction": "Které klíčové slovo v C# odkazuje na instanci třídy, ve které se právě nacházíme?",
        "answer": "this",
        "accept_also": [],
        "explanation": "Klíčové slovo 'this' reprezentuje aktuální instanci objektu."
      },
      {
        "id": "constructors-f-4",
        "type": "fill",
        "difficulty": "hard",
        "instruction": "Jaký modifikátor přístupu musí mít konstruktor, aby bylo možné vytvořit instanci třídy z jiné třídy?",
        "answer": "public",
        "accept_also": [
          "veřejný"
        ],
        "explanation": "Pokud je konstruktor public, lze instanci vytvořit odkudkoliv."
      },
      {
        "id": "constructors-o-1",
        "type": "order",
        "difficulty": "medium",
        "instruction": "Seřaďte řádky kódu třídy s přetíženým konstruktorem.",
        "lines": [
          "public Person(string name) {",
          "this.name = name;",
          "}",
          "public Person() : this(\"Neznámý\") {",
          "} "
        ],
        "correct_order": [
          3,
          4,
          0,
          1,
          2
        ],
        "explanation": "Nejprve definujeme bezparametrický konstruktor, který volá přetížený konstruktor, poté definujeme přetížený konstruktor."
      },
      {
        "id": "constructors-o-2",
        "type": "order",
        "difficulty": "medium",
        "instruction": "Seřaďte řádky kódu pro třídu dědící od předka.",
        "lines": [
          "public Child(int id) : base(id) {",
          "}",
          "public class Child : Parent {",
          "public Parent(int id) { }",
          "}"
        ],
        "correct_order": [
          2,
          3,
          0,
          1,
          4
        ],
        "explanation": "Nejprve deklarujeme třídu, poté předka a nakonec konstruktor potomka volající base."
      },
      {
        "id": "constructors-o-3",
        "type": "order",
        "difficulty": "hard",
        "instruction": "Seřaďte řádky kódu pro správnou inicializaci polí.",
        "lines": [
          "public class Box {",
          "private int size;",
          "public Box(int size) {",
          "this.size = size;",
          "}"
        ],
        "correct_order": [
          0,
          1,
          2,
          3,
          4
        ],
        "explanation": "Standardní struktura: deklarace třídy, privátní pole, konstruktor a jeho tělo."
      }
    ]
  },
  {
    "topic_id": "interfaces",
    "topic_name": "Rozhraní a abstrakce",
    "exercises": [
      {
        "id": "interfaces-dd-1",
        "type": "dragdrop",
        "difficulty": "easy",
        "instruction": "Doplň klíčové slovo pro implementaci rozhraní v C#.",
        "code": "public class Dog : ___BLANK___ {\n    public void MakeSound() {\n        Console.WriteLine(\"Haf\");\n    }\n}",
        "blanks": [
          "IAnimal"
        ],
        "options": [
          "IAnimal",
          "Animal",
          "extends",
          "virtual",
          "abstract"
        ],
        "explanation": "V C# se pro implementaci rozhraní používá dvojtečka následovaná názvem rozhraní, které obvykle začíná písmenem I."
      },
      {
        "id": "interfaces-dd-2",
        "type": "dragdrop",
        "difficulty": "easy",
        "instruction": "Doplň modifikátor pro abstraktní metodu.",
        "code": "public abstract class Shape {\n    public ___BLANK___ void Draw();\n}",
        "blanks": [
          "abstract"
        ],
        "options": [
          "abstract",
          "virtual",
          "override",
          "static",
          "sealed"
        ],
        "explanation": "Abstraktní metody v abstraktní třídě musí mít modifikátor abstract a nesmí mít tělo."
      },
      {
        "id": "interfaces-dd-3",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplň modifikátor pro přepsání metody v odvozené třídě.",
        "code": "public class Circle : Shape {\n    public ___BLANK___ void Draw() {\n        Console.WriteLine(\"Kreslím kruh\");\n    }\n}",
        "blanks": [
          "override"
        ],
        "options": [
          "override",
          "abstract",
          "virtual",
          "new",
          "static"
        ],
        "explanation": "Pro implementaci abstraktní metody nebo přepsání virtuální metody je nutné použít klíčové slovo override."
      },
      {
        "id": "interfaces-dd-4",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplň klíčové slovo pro volání metody předka.",
        "code": "public override void Display() {\n    ___BLANK___.Display();\n    Console.WriteLine(\"Dodatečný text\");\n}",
        "blanks": [
          "base"
        ],
        "options": [
          "base",
          "this",
          "super",
          "parent",
          "override"
        ],
        "explanation": "Klíčové slovo base slouží v C# k přístupu k členům základní třídy."
      },
      {
        "id": "interfaces-dd-5",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplň správný návratový typ pro metodu rozhraní.",
        "code": "public interface IRepository {\n    ___BLANK___ Save(string data);\n}",
        "blanks": [
          "void"
        ],
        "options": [
          "void",
          "abstract",
          "virtual",
          "int",
          "public"
        ],
        "explanation": "Metody v rozhraní mohou mít návratový typ void, pokud nic nevracejí."
      },
      {
        "id": "interfaces-dd-6",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplň klíčové slovo pro definici abstraktní třídy.",
        "code": "___BLANK___ class DatabaseConnection {\n    public abstract void Connect();\n}",
        "blanks": [
          "abstract"
        ],
        "options": [
          "abstract",
          "interface",
          "sealed",
          "static",
          "public"
        ],
        "explanation": "Třída obsahující abstraktní metodu musí být sama označena jako abstract."
      },
      {
        "id": "interfaces-dd-7",
        "type": "dragdrop",
        "difficulty": "hard",
        "instruction": "Doplň modifikátor pro zabránění dědičnosti třídy.",
        "code": "public ___BLANK___ class Configuration {\n    // Tuto třídu nelze dědit\n}",
        "blanks": [
          "sealed"
        ],
        "options": [
          "sealed",
          "static",
          "abstract",
          "private",
          "readonly"
        ],
        "explanation": "Klíčové slovo sealed v C# znemožňuje další dědění od dané třídy."
      },
      {
        "id": "interfaces-dd-8",
        "type": "dragdrop",
        "difficulty": "hard",
        "instruction": "Doplň správný modifikátor pro metodu, kterou lze přepsat.",
        "code": "public class Base {\n    public ___BLANK___ void Log() { }\n}",
        "blanks": [
          "virtual"
        ],
        "options": [
          "virtual",
          "abstract",
          "sealed",
          "override",
          "static"
        ],
        "explanation": "Metoda musí být označena jako virtual, aby ji bylo možné v odvozené třídě přepsat pomocí override."
      },
      {
        "id": "interfaces-f-1",
        "type": "fill",
        "difficulty": "easy",
        "instruction": "Jak se nazývá proces, kdy třída přebírá vlastnosti a metody od jiné třídy?",
        "answer": "dědičnost",
        "accept_also": [
          "inheritance"
        ],
        "explanation": "Dědičnost je základní pilíř objektově orientovaného programování."
      },
      {
        "id": "interfaces-f-2",
        "type": "fill",
        "difficulty": "easy",
        "instruction": "Kolik abstraktních tříd může v C# třída dědit současně?",
        "answer": "jedna",
        "accept_also": [
          "1",
          "pouze jedna"
        ],
        "explanation": "C# nepodporuje vícenásobnou dědičnost tříd, pouze rozhraní."
      },
      {
        "id": "interfaces-f-3",
        "type": "fill",
        "difficulty": "medium",
        "instruction": "Jaký modifikátor přístupu mají implicitně všechny metody v rozhraní?",
        "answer": "public",
        "accept_also": [
          "veřejný"
        ],
        "explanation": "Všechny členy rozhraní jsou implicitně veřejné."
      },
      {
        "id": "interfaces-f-4",
        "type": "hard",
        "instruction": "Jak se v C# nazývá návrhový vzor, který umožňuje implementovat více rozhraní v jedné třídě?",
        "answer": "vícenásobná implementace",
        "accept_also": [
          "multiple interface implementation"
        ],
        "explanation": "Na rozdíl od dědičnosti tříd, C# umožňuje implementovat libovolný počet rozhraní."
      },
      {
        "id": "interfaces-o-1",
        "type": "order",
        "difficulty": "medium",
        "instruction": "Seřaď řádky pro definici a implementaci rozhraní.",
        "lines": [
          "public class Printer : IPrintable {",
          "public void Print() {",
          "Console.WriteLine(\"Tisk...\");",
          "}",
          "}"
        ],
        "correct_order": [
          0,
          1,
          2,
          3,
          4
        ],
        "explanation": "Správná struktura je deklarace třídy, metoda, tělo metody a uzavření závorek."
      },
      {
        "id": "interfaces-o-2",
        "type": "order",
        "difficulty": "medium",
        "instruction": "Seřaď kód pro abstraktní třídu a její implementaci.",
        "lines": [
          "public abstract class Animal {",
          "public abstract void Speak();",
          "}",
          "public class Cat : Animal {",
          "public override void Speak() { Console.WriteLine(\"Mňau\"); } }"
        ],
        "correct_order": [
          0,
          1,
          2,
          3,
          4
        ],
        "explanation": "Nejprve definujeme abstraktní třídu, poté její metodu a nakonec konkrétní implementaci v potomkovi."
      },
      {
        "id": "interfaces-o-3",
        "type": "order",
        "difficulty": "hard",
        "instruction": "Seřaď řádky pro správné použití konstruktoru v dědičnosti.",
        "lines": [
          "public class Child : Parent {",
          "public Child() : base() {",
          "}",
          "public class Parent {",
          "public Parent() { } }"
        ],
        "correct_order": [
          3,
          4,
          0,
          1,
          2
        ],
        "explanation": "Nejprve musí existovat rodičovská třída, poté deklarujeme potomka a voláme konstruktor předka přes : base()."
      }
    ]
  },
  {
    "topic_id": "collections",
    "topic_name": "Kolekce a generika",
    "exercises": [
      {
        "id": "collections-dd-1",
        "type": "dragdrop",
        "difficulty": "easy",
        "instruction": "Doplňte správný typ pro inicializaci seznamu řetězců.",
        "code": "using System.Collections.Generic;\n\npublic class Program {\n    public static void Main() {\n        List<string> names = new ___BLANK___();\n        names.Add(\"Petr\");\n    }\n}",
        "blanks": [
          "List<string>"
        ],
        "options": [
          "List<string>",
          "ArrayList",
          "Dictionary<string>",
          "List<int>",
          "Array<string>"
        ],
        "explanation": "Pro inicializaci instance třídy List<T> musíme uvést stejný typ v konstruktoru."
      },
      {
        "id": "collections-dd-2",
        "type": "dragdrop",
        "difficulty": "easy",
        "instruction": "Doplňte metodu pro přidání prvku do Dictionary.",
        "code": "using System.Collections.Generic;\n\npublic class Program {\n    public static void Main() {\n        Dictionary<int, string> users = new Dictionary<int, string>();\n        users.___BLANK___(1, \"Admin\");\n    }\n}",
        "blanks": [
          "Add"
        ],
        "options": [
          "Add",
          "Put",
          "Insert",
          "Push",
          "Append"
        ],
        "explanation": "Třída Dictionary v C# používá metodu Add pro vložení dvojice klíč-hodnota."
      },
      {
        "id": "collections-dd-3",
        "type": "dragdrop",
        "difficulty": "easy",
        "instruction": "Doplňte klíčové slovo pro iteraci přes prvky kolekce.",
        "code": "using System.Collections.Generic;\n\npublic class Program {\n    public void PrintList(List<int> numbers) {\n        ___BLANK___ (int n in numbers) {\n            System.Console.WriteLine(n);\n        }\n    }\n}",
        "blanks": [
          "foreach"
        ],
        "options": [
          "foreach",
          "for",
          "while",
          "each",
          "loop"
        ],
        "explanation": "Cyklus foreach je v C# určen pro pohodlnou iteraci přes kolekce implementující IEnumerable."
      },
      {
        "id": "collections-dd-4",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplňte LINQ metodu pro filtrování prvků.",
        "code": "using System.Collections.Generic;\nusing System.Linq;\n\npublic class Program {\n    public void Filter(List<int> nums) {\n        var result = nums.___BLANK___(n => n > 10);\n    }\n}",
        "blanks": [
          "Where"
        ],
        "options": [
          "Where",
          "Filter",
          "Select",
          "Find",
          "Query"
        ],
        "explanation": "Metoda Where z LINQ vrací prvky, které splňují zadanou podmínku (predikát)."
      },
      {
        "id": "collections-dd-5",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplňte správný způsob přístupu k hodnotě v Dictionary.",
        "code": "using System.Collections.Generic;\n\npublic class Program {\n    public string GetName(Dictionary<int, string> dict, int id) {\n        return dict.___BLANK___;\n    }\n}",
        "blanks": [
          "[id]"
        ],
        "options": [
          "[id]",
          "(id)",
          ".get(id)",
          ".value(id)",
          "{id}"
        ],
        "explanation": "V C# se k prvkům v Dictionary přistupuje pomocí indexeru v hranatých závorkách."
      },
      {
        "id": "collections-dd-6",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplňte definici generické třídy.",
        "code": "public class Box___BLANK___ {\n    private T item;\n    public void Set(T item) { this.item = item; }\n}",
        "blanks": [
          "<T>"
        ],
        "options": [
          "<T>",
          "(T)",
          "[T]",
          "<type>",
          "<generic>"
        ],
        "explanation": "Generický parametr se v definici třídy uvádí v lomených závorkách za názvem třídy."
      },
      {
        "id": "collections-dd-7",
        "type": "dragdrop",
        "difficulty": "hard",
        "instruction": "Doplňte LINQ metodu pro transformaci prvků.",
        "code": "using System.Linq;\nusing System.Collections.Generic;\n\npublic class Program {\n    public List<int> GetLengths(List<string> words) {\n        return words.___BLANK___(w => w.Length).ToList();\n    }\n}",
        "blanks": [
          "Select"
        ],
        "options": [
          "Select",
          "Map",
          "Transform",
          "Project",
          "Convert"
        ],
        "explanation": "Metoda Select v LINQ slouží k transformaci (projekci) každého prvku na jinou hodnotu."
      },
      {
        "id": "collections-dd-8",
        "type": "dragdrop",
        "difficulty": "hard",
        "instruction": "Doplňte metodu pro zjištění počtu prvků v Listu.",
        "code": "using System.Collections.Generic;\n\npublic class Program {\n    public int GetCount(List<string> list) {\n        return list.___BLANK___;\n    }\n}",
        "blanks": [
          "Count"
        ],
        "options": [
          "Count",
          "Length",
          "Size()",
          "Count()",
          "Capacity"
        ],
        "explanation": "Třída List<T> v C# používá vlastnost Count pro zjištění počtu prvků."
      },
      {
        "id": "collections-f-1",
        "type": "fill",
        "difficulty": "easy",
        "instruction": "Jak se nazývá rozhraní, které musí implementovat kolekce, aby ji bylo možné procházet pomocí foreach?",
        "answer": "IEnumerable",
        "accept_also": [
          "IEnumerable<T>"
        ],
        "explanation": "Rozhraní IEnumerable definuje metodu GetEnumerator, která umožňuje iteraci."
      },
      {
        "id": "collections-f-2",
        "type": "fill",
        "difficulty": "medium",
        "instruction": "Jakou LINQ metodu použijete, pokud chcete získat pouze první prvek kolekce, který splňuje podmínku?",
        "answer": "FirstOrDefault",
        "accept_also": [
          "First"
        ],
        "explanation": "Metoda FirstOrDefault vrátí první prvek nebo výchozí hodnotu, pokud prvek neexistuje."
      },
      {
        "id": "collections-f-3",
        "type": "fill",
        "difficulty": "medium",
        "instruction": "Jak se v C# nazývá klíčové slovo pro omezení generického typu (např. aby T muselo být třída)?",
        "answer": "where",
        "accept_also": [
          "constraints"
        ],
        "explanation": "Klíčové slovo 'where' se používá k definici omezení (constraints) pro generické parametry."
      },
      {
        "id": "collections-f-4",
        "type": "hard",
        "difficulty": "hard",
        "instruction": "Jak se nazývá proces, kdy se hodnota typu int automaticky převede na objekt typu object při vložení do staré kolekce ArrayList?",
        "answer": "boxing",
        "accept_also": [
          "boxování"
        ],
        "explanation": "Boxing je proces balení hodnotového typu do objektové obálky."
      },
      {
        "id": "collections-o-1",
        "type": "order",
        "difficulty": "medium",
        "instruction": "Seřaďte řádky pro vytvoření, naplnění a výpis seznamu.",
        "lines": [
          "List<int> cisla = new List<int>();",
          "foreach (int c in cisla) Console.WriteLine(c);",
          "cisla.Add(10);",
          "cisla.Add(20);",
          "cisla.Add(30);"
        ],
        "correct_order": [
          0,
          2,
          3,
          4,
          1
        ],
        "explanation": "Nejprve musíme seznam vytvořit, poté naplnit daty a nakonec iterovat."
      },
      {
        "id": "collections-o-2",
        "type": "order",
        "difficulty": "medium",
        "instruction": "Seřaďte řádky pro LINQ dotaz, který vybere sudá čísla a seřadí je.",
        "lines": [
          "var vysledek = cisla",
          ".Where(x => x % 2 == 0)",
          ".OrderBy(x => x)",
          ".ToList();",
          "List<int> cisla = new List<int> { 5, 2, 8, 1 };"
        ],
        "correct_order": [
          4,
          0,
          1,
          2,
          3
        ],
        "explanation": "Nejprve deklarujeme data, poté aplikujeme filtry a řazení, a nakonec výsledek uložíme."
      },
      {
        "id": "collections-o-3",
        "type": "order",
        "difficulty": "hard",
        "instruction": "Seřaďte řádky pro bezpečné získání hodnoty z Dictionary.",
        "lines": [
          "if (dict.TryGetValue(key, out string val))",
          "Dictionary<int, string> dict = new Dictionary<int, string>();",
          "Console.WriteLine(val);",
          "dict.Add(1, \"Ahoj\");",
          "int key = 1;"
        ],
        "correct_order": [
          1,
          3,
          4,
          0,
          2
        ],
        "explanation": "Inicializace, přidání dat, definice klíče, kontrola existence a následné vypsání."
      }
    ]
  },
  {
    "topic_id": "design-patterns",
    "topic_name": "Návrhové vzory",
    "exercises": [
      {
        "id": "design-patterns-dd-1",
        "type": "dragdrop",
        "difficulty": "easy",
        "instruction": "Doplňte modifikátor přístupu pro konstruktor u vzoru Singleton.",
        "code": "public class DatabaseConnection {\n    private static DatabaseConnection _instance;\n    ___BLANK___ DatabaseConnection() { }\n    public static DatabaseConnection GetInstance() {\n        if (_instance == null) _instance = new DatabaseConnection();\n        return _instance;\n    }\n}",
        "blanks": [
          "private"
        ],
        "options": [
          "private",
          "public",
          "protected",
          "internal",
          "static"
        ],
        "explanation": "U vzoru Singleton musí být konstruktor privátní, aby nebylo možné vytvořit instanci zvenčí."
      },
      {
        "id": "design-patterns-dd-2",
        "type": "dragdrop",
        "difficulty": "easy",
        "instruction": "Doplňte klíčové slovo pro definici Utility třídy, která nemá mít instance.",
        "code": "public ___BLANK___ class MathUtils {\n    public static double Add(double a, double b) => a + b;\n}",
        "blanks": [
          "static"
        ],
        "options": [
          "static",
          "sealed",
          "abstract",
          "final",
          "readonly"
        ],
        "explanation": "Utility třída by měla být označena jako static, což v C# vynutí, aby obsahovala pouze statické členy."
      },
      {
        "id": "design-patterns-dd-3",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplňte návratový typ tovární metody.",
        "code": "public class LoggerFactory {\n    public static ILogger CreateLogger(string type) {\n        if (type == \"file\") return new FileLogger();\n        return new ConsoleLogger();\n    }\n}\n// Volející kód:\n___BLANK___ logger = LoggerFactory.CreateLogger(\"file\");",
        "blanks": [
          "ILogger"
        ],
        "options": [
          "ILogger",
          "var",
          "object",
          "Logger",
          "void"
        ],
        "explanation": "Tovární metoda vrací rozhraní nebo abstraktní třídu, aby klient nebyl závislý na konkrétní implementaci."
      },
      {
        "id": "design-patterns-dd-4",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplňte chybějící kód pro Lazy inicializaci Singletonu.",
        "code": "public class ConfigManager {\n    private static ConfigManager _instance;\n    public static ConfigManager Instance {\n        get {\n            if (_instance == null) _instance = new ConfigManager();\n            return ___BLANK___;\n        }\n    }\n}",
        "blanks": [
          "_instance"
        ],
        "options": [
          "_instance",
          "new ConfigManager()",
          "null",
          "this",
          "Instance"
        ],
        "explanation": "Vlastnost Instance musí vrátit již existující statickou instanci třídy."
      },
      {
        "id": "design-patterns-dd-5",
        "type": "dragdrop",
        "difficulty": "easy",
        "instruction": "Vyberte správný klíčový typ pro definici výčtu (Enum).",
        "code": "public ___BLANK___ OrderStatus {\n    Pending,\n    Shipped,\n    Delivered\n}",
        "blanks": [
          "enum"
        ],
        "options": [
          "enum",
          "class",
          "interface",
          "struct",
          "delegate"
        ],
        "explanation": "Klíčové slovo enum se používá k definici množiny pojmenovaných konstant."
      },
      {
        "id": "design-patterns-dd-6",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplňte metodu pro odeslání zprávy ve vzoru Messenger.",
        "code": "public class Messenger {\n    public void Send(string message) {\n        Console.WriteLine($\"Sending: {___BLANK___}\");\n    }\n}",
        "blanks": [
          "message"
        ],
        "options": [
          "message",
          "this",
          "null",
          "string",
          "Messenger"
        ],
        "explanation": "Metoda musí pracovat s parametrem, který nese obsah zprávy."
      },
      {
        "id": "design-patterns-dd-7",
        "type": "hard",
        "difficulty": "hard",
        "instruction": "Doplňte typ parametru pro Servant metodu, která obsluhuje jiný objekt.",
        "code": "public class Servant {\n    public void Move(IMovable ___BLANK___, int x, int y) {\n        target.SetPosition(x, y);\n    }\n}",
        "blanks": [
          "target"
        ],
        "options": [
          "target",
          "servant",
          "position",
          "this",
          "object"
        ],
        "explanation": "Servant přijímá jako parametr objekt, nad kterým vykonává operaci, kterou ten objekt sám nemá."
      },
      {
        "id": "design-patterns-dd-8",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplňte chybějící modifikátor, aby třída nemohla být děděna (vzor Utility).",
        "code": "public ___BLANK___ class StringHelper {\n    private StringHelper() { }\n    public static string Reverse(string s) { /*...*/ }\n}",
        "blanks": [
          "sealed"
        ],
        "options": [
          "sealed",
          "abstract",
          "static",
          "private",
          "public"
        ],
        "explanation": "Klíčové slovo sealed zabraňuje dědění, což je u Utility tříd žádoucí."
      },
      {
        "id": "design-patterns-f-1",
        "type": "fill",
        "difficulty": "easy",
        "instruction": "Jak se nazývá návrhový vzor, který zajišťuje, že třída má pouze jednu instanci?",
        "answer": "Singleton",
        "accept_also": [
          "singleton"
        ],
        "explanation": "Singleton je základní vzor pro zajištění unikátní instance v aplikaci."
      },
      {
        "id": "design-patterns-f-2",
        "type": "fill",
        "difficulty": "medium",
        "instruction": "Jaký modifikátor přístupu musí mít konstruktor u Singletonu, aby nebylo možné vytvořit instanci pomocí 'new'?",
        "answer": "private",
        "accept_also": [
          "privátní"
        ],
        "explanation": "Privátní konstruktor znemožňuje volání operátoru 'new' mimo danou třídu."
      },
      {
        "id": "design-patterns-f-3",
        "type": "fill",
        "difficulty": "medium",
        "instruction": "Který vzor slouží k oddělení logiky vytváření objektů od jejich použití?",
        "answer": "Factory Method",
        "accept_also": [
          "tovární metoda",
          "factory"
        ],
        "explanation": "Tovární metoda (Factory Method) zapouzdřuje logiku instancování objektů."
      },
      {
        "id": "design-patterns-f-4",
        "type": "fill",
        "difficulty": "hard",
        "instruction": "Jak se v C# nazývá třída, která obsahuje pouze statické metody a nelze ji instancovat?",
        "answer": "Utility",
        "accept_also": [
          "statická třída",
          "utility class"
        ],
        "explanation": "Utility třída slouží jako knihovna pomocných funkcí."
      },
      {
        "id": "design-patterns-o-1",
        "type": "order",
        "difficulty": "medium",
        "instruction": "Seřaďte řádky pro implementaci Singletonu.",
        "lines": [
          "private static MySingleton _instance;",
          "public static MySingleton GetInstance() {",
          "if (_instance == null) _instance = new MySingleton();",
          "return _instance;",
          "private MySingleton() { }"
        ],
        "correct_order": [
          0,
          4,
          1,
          2,
          3
        ],
        "explanation": "Nejprve definujeme instanci, pak privátní konstruktor, následně metodu pro získání instance s kontrolou null."
      },
      {
        "id": "design-patterns-o-2",
        "type": "order",
        "difficulty": "medium",
        "instruction": "Seřaďte kód pro definici a použití výčtu (Enum).",
        "lines": [
          "public enum Day { Mon, Tue, Wed }",
          "Day today = Day.Mon;",
          "if (today == Day.Mon) {",
          "Console.WriteLine(\"Pondělí\");",
          "}"
        ],
        "correct_order": [
          0,
          1,
          2,
          3,
          4
        ],
        "explanation": "Nejprve definujeme enum, vytvoříme proměnnou a poté ji použijeme v podmínce."
      },
      {
        "id": "design-patterns-o-3",
        "type": "hard",
        "difficulty": "hard",
        "instruction": "Seřaďte části kódu pro tovární metodu.",
        "lines": [
          "public static IProduct Create(string type) {",
          "if (type == \"A\") return new ProductA();",
          "return new ProductB();",
          "}",
          "public interface IProduct { }"
        ],
        "correct_order": [
          4,
          0,
          1,
          2,
          3
        ],
        "explanation": "Nejprve definujeme rozhraní, poté metodu, která vrací typ tohoto rozhraní na základě podmínek."
      }
    ]
  },
  {
    "topic_id": "sql",
    "topic_name": "SQL databáze",
    "exercises": [
      {
        "id": "sql-dd-1",
        "type": "dragdrop",
        "difficulty": "easy",
        "instruction": "Doplňte klíčové slovo pro výběr všech sloupců z tabulky.",
        "code": "public void GetAllUsers(SqlConnection conn) {\n  string query = \"___BLANK___ * FROM Users;\";\n  SqlCommand cmd = new SqlCommand(query, conn);\n}",
        "blanks": [
          "SELECT"
        ],
        "options": [
          "SELECT",
          "GET",
          "FETCH",
          "READ",
          "SHOW"
        ],
        "explanation": "Příkaz SELECT se používá pro načítání dat z databázové tabulky."
      },
      {
        "id": "sql-dd-2",
        "type": "dragdrop",
        "difficulty": "easy",
        "instruction": "Doplňte klauzuli pro filtrování záznamů podle podmínky.",
        "code": "public void GetActiveUsers(SqlConnection conn) {\n  string query = \"SELECT * FROM Users ___BLANK___ IsActive = 1;\";\n  SqlCommand cmd = new SqlCommand(query, conn);\n}",
        "blanks": [
          "WHERE"
        ],
        "options": [
          "WHERE",
          "FILTER",
          "HAVING",
          "LIMIT",
          "CONDITION"
        ],
        "explanation": "Klauzule WHERE slouží k omezení výsledků dotazu na základě zadané podmínky."
      },
      {
        "id": "sql-dd-3",
        "type": "dragdrop",
        "difficulty": "easy",
        "instruction": "Doplňte příkaz pro vložení nového záznamu do tabulky.",
        "code": "public void AddUser(SqlConnection conn) {\n  string query = \"___BLANK___ INTO Users (Name) VALUES ('Petr');\";\n  SqlCommand cmd = new SqlCommand(query, conn);\n}",
        "blanks": [
          "INSERT"
        ],
        "options": [
          "INSERT",
          "ADD",
          "CREATE",
          "PUSH",
          "SAVE"
        ],
        "explanation": "Příkaz INSERT INTO se používá pro přidávání nových řádků do tabulky."
      },
      {
        "id": "sql-dd-4",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplňte klauzuli pro seřazení výsledků podle jména sestupně.",
        "code": "public void GetSortedUsers(SqlConnection conn) {\n  string query = \"SELECT * FROM Users ORDER BY Name ___BLANK___;\";\n  SqlCommand cmd = new SqlCommand(query, conn);\n}",
        "blanks": [
          "DESC"
        ],
        "options": [
          "DESC",
          "DOWN",
          "REVERSE",
          "BACKWARD",
          "LAST"
        ],
        "explanation": "Klíčové slovo DESC určuje sestupné řazení (descending)."
      },
      {
        "id": "sql-dd-5",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplňte typ spojení pro získání všech záznamů z obou tabulek, které mají shodu v klíčích.",
        "code": "public void GetOrders(SqlConnection conn) {\n  string query = \"SELECT * FROM Users ___BLANK___ JOIN Orders ON Users.Id = Orders.UserId;\";\n  SqlCommand cmd = new SqlCommand(query, conn);\n}",
        "blanks": [
          "INNER"
        ],
        "options": [
          "INNER",
          "OUTER",
          "FULL",
          "CROSS",
          "UNION"
        ],
        "explanation": "INNER JOIN vrací pouze řádky, které mají shodu v obou propojených tabulkách."
      },
      {
        "id": "sql-dd-6",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplňte příkaz pro úpravu existujících dat v databázi.",
        "code": "public void UpdateEmail(SqlConnection conn) {\n  string query = \"___BLANK___ Users SET Email = 'test@test.cz' WHERE Id = 1;\";\n  SqlCommand cmd = new SqlCommand(query, conn);\n}",
        "blanks": [
          "UPDATE"
        ],
        "options": [
          "UPDATE",
          "MODIFY",
          "CHANGE",
          "ALTER",
          "SET"
        ],
        "explanation": "Příkaz UPDATE se používá k modifikaci stávajících dat v tabulce."
      },
      {
        "id": "sql-dd-7",
        "type": "dragdrop",
        "difficulty": "hard",
        "instruction": "Doplňte příkaz pro definici primárního klíče při vytváření tabulky.",
        "code": "public void CreateTable(SqlConnection conn) {\n  string query = \"CREATE TABLE Students (Id INT ___BLANK___, Name VARCHAR(50));\";\n  SqlCommand cmd = new SqlCommand(query, conn);\n}",
        "blanks": [
          "PRIMARY KEY"
        ],
        "options": [
          "PRIMARY KEY",
          "UNIQUE ID",
          "MAIN KEY",
          "IDENTITY",
          "FOREIGN KEY"
        ],
        "explanation": "PRIMARY KEY jednoznačně identifikuje každý záznam v tabulce."
      },
      {
        "id": "sql-dd-8",
        "type": "dragdrop",
        "difficulty": "hard",
        "instruction": "Doplňte klauzuli pro definici cizího klíče v tabulce.",
        "code": "public void CreateOrderTable(SqlConnection conn) {\n  string query = \"CREATE TABLE Orders (Id INT, UserId INT, ___BLANK___ (UserId) REFERENCES Users(Id));\";\n  SqlCommand cmd = new SqlCommand(query, conn);\n}",
        "blanks": [
          "FOREIGN KEY"
        ],
        "options": [
          "FOREIGN KEY",
          "LINK KEY",
          "REFERENCE KEY",
          "JOIN KEY",
          "RELATION"
        ],
        "explanation": "FOREIGN KEY propojuje data mezi dvěma tabulkami a zajišťuje referenční integritu."
      },
      {
        "id": "sql-f-1",
        "type": "fill",
        "difficulty": "easy",
        "instruction": "Jaký příkaz se používá k odstranění všech dat z tabulky, která splňují podmínku?",
        "answer": "DELETE",
        "accept_also": [
          "DELETE FROM"
        ],
        "explanation": "Příkaz DELETE se používá k odstranění záznamů z databáze."
      },
      {
        "id": "sql-f-2",
        "type": "fill",
        "difficulty": "medium",
        "instruction": "Jak se nazývá typ spojení, které vrací všechny řádky z levé tabulky, i když v pravé tabulce není shoda?",
        "answer": "LEFT JOIN",
        "accept_also": [
          "LEFT OUTER JOIN"
        ],
        "explanation": "LEFT JOIN vrací všechny záznamy z levé tabulky a odpovídající z pravé."
      },
      {
        "id": "sql-f-3",
        "type": "fill",
        "difficulty": "medium",
        "instruction": "Jaký SQL operátor se používá pro vyhledávání vzoru v textovém řetězci (např. začínající na 'A')?",
        "answer": "LIKE",
        "accept_also": [
          "operator LIKE"
        ],
        "explanation": "Operátor LIKE se používá v klauzuli WHERE pro hledání vzorů pomocí zástupných znaků."
      },
      {
        "id": "sql-f-4",
        "type": "hard",
        "difficulty": "hard",
        "instruction": "Jak se nazývá SQL příkaz pro vytvoření nové tabulky?",
        "answer": "CREATE TABLE",
        "accept_also": [
          "CREATE"
        ],
        "explanation": "Příkaz CREATE TABLE definuje strukturu nové tabulky v databázi."
      },
      {
        "id": "sql-o-1",
        "type": "order",
        "difficulty": "medium",
        "instruction": "Seřaďte řádky SQL dotazu pro výběr a řazení uživatelů.",
        "lines": [
          "ORDER BY Age DESC;",
          "SELECT *",
          "FROM Users",
          "WHERE Age > 18",
          ";"
        ],
        "correct_order": [
          1,
          2,
          3,
          0,
          4
        ],
        "explanation": "Standardní pořadí je SELECT, FROM, WHERE a nakonec ORDER BY."
      },
      {
        "id": "sql-o-2",
        "type": "order",
        "difficulty": "medium",
        "instruction": "Seřaďte části příkazu pro vytvoření tabulky.",
        "lines": [
          "(Id INT PRIMARY KEY,",
          "CREATE TABLE Students",
          "Name VARCHAR(50)",
          ");"
        ],
        "correct_order": [
          1,
          0,
          2,
          3
        ],
        "explanation": "Nejprve definujeme název tabulky, poté sloupce v závorkách."
      },
      {
        "id": "sql-o-3",
        "type": "order",
        "difficulty": "hard",
        "instruction": "Seřaďte části SQL dotazu s vnitřním spojením (JOIN).",
        "lines": [
          "ON Users.Id = Orders.UserId",
          "SELECT *",
          "FROM Users",
          "INNER JOIN Orders",
          ";"
        ],
        "correct_order": [
          1,
          2,
          3,
          0,
          4
        ],
        "explanation": "Nejprve vybereme sloupce, určíme hlavní tabulku, připojíme druhou tabulku a definujeme podmínku spojení."
      }
    ]
  },
  {
    "topic_id": "html-css",
    "topic_name": "HTML a CSS",
    "exercises": [
      {
        "id": "html-css-dd-1",
        "type": "dragdrop",
        "difficulty": "easy",
        "instruction": "Doplňte sémantický tag pro hlavní navigační menu.",
        "code": "<header>\n  <h1>Můj web</h1>\n  <___BLANK___>\n    <ul><li>Domů</li></ul>\n  </nav>\n</header>",
        "blanks": [
          "nav"
        ],
        "options": [
          "nav",
          "div",
          "section",
          "aside",
          "footer"
        ],
        "explanation": "Tag <nav> je určen pro definování bloku navigačních odkazů."
      },
      {
        "id": "html-css-dd-2",
        "type": "dragdrop",
        "difficulty": "easy",
        "instruction": "Doplňte CSS selektor pro výběr všech prvků s třídou 'btn'.",
        "code": "___BLANK___ {\n  background-color: blue;\n  color: white;\n}",
        "blanks": [
          ".btn"
        ],
        "options": [
          ".btn",
          "#btn",
          "btn",
          "*btn",
          "element.btn"
        ],
        "explanation": "Tečka před názvem definuje třídu (class) v CSS."
      },
      {
        "id": "html-css-dd-3",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplňte vlastnost Flexboxu pro zarovnání prvků na střed v hlavní ose.",
        "code": ".container {\n  display: flex;\n  ___BLANK___: center;\n}",
        "blanks": [
          "justify-content"
        ],
        "options": [
          "justify-content",
          "align-items",
          "flex-direction",
          "align-content",
          "gap"
        ],
        "explanation": "Vlastnost justify-content určuje zarovnání prvků podél hlavní osy flex kontejneru."
      },
      {
        "id": "html-css-dd-4",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplňte syntaxi pro Media Query, která se aplikuje pro obrazovky širší než 768px.",
        "code": "___BLANK___ (min-width: 768px) {\n  body { font-size: 18px; }\n}",
        "blanks": [
          "@media"
        ],
        "options": [
          "@media",
          "@screen",
          "@import",
          "@query",
          "@style"
        ],
        "explanation": "Pravidlo @media se používá pro definici stylů v závislosti na vlastnostech zařízení."
      },
      {
        "id": "html-css-dd-5",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplňte CSS vlastnost pro nastavení vnitřního odsazení (box model).",
        "code": ".box {\n  width: 200px;\n  ___BLANK___: 20px;\n  border: 1px solid black;\n}",
        "blanks": [
          "padding"
        ],
        "options": [
          "padding",
          "margin",
          "spacing",
          "inset",
          "gap"
        ],
        "explanation": "Padding definuje vnitřní prostor mezi obsahem prvku a jeho rámečkem."
      },
      {
        "id": "html-css-dd-6",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplňte CSS Grid vlastnost pro definici šířky sloupců.",
        "code": ".grid-container {\n  display: grid;\n  ___BLANK___: 1fr 1fr 1fr;\n}",
        "blanks": [
          "grid-template-columns"
        ],
        "options": [
          "grid-template-columns",
          "grid-columns",
          "grid-cols",
          "column-width",
          "grid-template"
        ],
        "explanation": "Vlastnost grid-template-columns určuje počet a šířku sloupců v gridu."
      },
      {
        "id": "html-css-dd-7",
        "type": "dragdrop",
        "difficulty": "hard",
        "instruction": "Doplňte atribut pro vložení externího CSS souboru do HTML.",
        "code": "<head>\n  <link rel=\"stylesheet\" ___BLANK___=\"style.css\">\n</head>",
        "blanks": [
          "href"
        ],
        "options": [
          "href",
          "src",
          "link",
          "url",
          "path"
        ],
        "explanation": "Atribut href určuje cestu k cílovému souboru u tagu link."
      },
      {
        "id": "html-css-dd-8",
        "type": "dragdrop",
        "difficulty": "hard",
        "instruction": "Doplňte selektor pro výběr přímého potomka (child combinator).",
        "code": "div ___BLANK___ p {\n  color: red;\n}",
        "blanks": [
          ">"
        ],
        "options": [
          ">",
          "+",
          "~",
          " ",
          "::"
        ],
        "explanation": "Znak > vybere pouze přímé potomky daného elementu."
      },
      {
        "id": "html-css-f-1",
        "type": "fill",
        "difficulty": "easy",
        "instruction": "Jak se nazývá HTML atribut, který slouží k unikátní identifikaci prvku na stránce?",
        "answer": "id",
        "accept_also": [
          "ID"
        ],
        "explanation": "Atribut id musí být v rámci celého HTML dokumentu unikátní."
      },
      {
        "id": "html-css-f-2",
        "type": "fill",
        "difficulty": "medium",
        "instruction": "Jaká hodnota vlastnosti 'position' vyjme prvek z normálního toku dokumentu a umístí ho vzhledem k nejbližšímu rodiči s jinou než statickou pozicí?",
        "answer": "absolute",
        "accept_also": [
          "position: absolute"
        ],
        "explanation": "Absolute pozicování vyjme prvek z toku a pozicuje ho relativně k nejbližšímu předkovi, který není static."
      },
      {
        "id": "html-css-f-3",
        "type": "fill",
        "difficulty": "medium",
        "instruction": "Jak se nazývá proces, kterým prohlížeč určuje, která CSS pravidla mají přednost při konfliktu?",
        "answer": "kaskáda",
        "accept_also": [
          "specifičnost",
          "cascade"
        ],
        "explanation": "Kaskáda a specifičnost určují prioritu pravidel při aplikaci stylů."
      },
      {
        "id": "html-css-f-4",
        "type": "fill",
        "difficulty": "hard",
        "instruction": "Jaká je výchozí hodnota vlastnosti 'display' pro element <div>?",
        "answer": "block",
        "accept_also": [
          "block element"
        ],
        "explanation": "Div je blokový element, který standardně zabírá celou šířku řádku."
      },
      {
        "id": "html-css-o-1",
        "type": "order",
        "difficulty": "medium",
        "instruction": "Seřaďte CSS pravidla podle priority (od nejnižší po nejvyšší).",
        "lines": [
          "element",
          "class",
          "id",
          "inline style",
          "* (univerzální selektor)"
        ],
        "correct_order": [
          4,
          0,
          1,
          2,
          3
        ],
        "explanation": "Priorita roste od univerzálního selektoru přes tagy, třídy, ID až po inline styly."
      },
      {
        "id": "html-css-o-2",
        "type": "order",
        "difficulty": "medium",
        "instruction": "Seřaďte části Box Modelu od středu směrem ven.",
        "lines": [
          "border",
          "margin",
          "content",
          "padding"
        ],
        "correct_order": [
          2,
          3,
          0,
          1
        ],
        "explanation": "Box model začíná obsahem, následuje padding, border a nakonec vnější margin."
      },
      {
        "id": "html-css-o-3",
        "type": "order",
        "difficulty": "hard",
        "instruction": "Seřaďte řádky pro vytvoření základní struktury HTML5 dokumentu.",
        "lines": [
          "<body></body>",
          "<html>",
          "<head></head>",
          "<!DOCTYPE html>",
          "</html>"
        ],
        "correct_order": [
          3,
          1,
          2,
          0,
          4
        ],
        "explanation": "Správná struktura začíná deklarací typu, následovanou kořenovým elementem html a sekcemi head a body."
      }
    ]
  },
  {
    "topic_id": "algorithms",
    "topic_name": "Algoritmizace",
    "exercises": [
      {
        "id": "algorithms-dd-1",
        "type": "dragdrop",
        "difficulty": "easy",
        "instruction": "Doplňte podmínku pro prohození prvků v algoritmu Bubble Sort.",
        "code": "public void BubbleSort(int[] arr) {\n  for (int i = 0; i < arr.Length - 1; i++) {\n    for (int j = 0; j < arr.Length - i - 1; j++) {\n      if (arr[j] ___BLANK___ arr[j + 1]) {\n        int temp = arr[j];\n        arr[j] = arr[j + 1];\n        arr[j + 1] = temp;\n      }\n    }\n  }\n}",
        "blanks": [
          ">"
        ],
        "options": [
          ">",
          "<",
          "==",
          "!=",
          "<="
        ],
        "explanation": "Pro vzestupné řazení musíme prohodit prvky, pokud je levý prvek větší než pravý."
      },
      {
        "id": "algorithms-dd-2",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplňte rekurzivní výpočet faktoriálu.",
        "code": "public long Factorial(int n) {\n  if (n <= 1) return 1;\n  return n * ___BLANK___;\n}",
        "blanks": [
          "Factorial(n - 1)"
        ],
        "options": [
          "Factorial(n - 1)",
          "Factorial(n)",
          "n * Factorial(n)",
          "n - 1",
          "0"
        ],
        "explanation": "Rekurze vyžaduje volání funkce se zmenšeným argumentem, aby se přiblížila k ukončovací podmínce."
      },
      {
        "id": "algorithms-dd-3",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplňte metodu pro přidání prvku do fronty (Queue).",
        "code": "public void Enqueue(int value) {\n  Node newNode = new Node(value);\n  if (tail != null) {\n    tail.next = newNode;\n  }\n  tail = ___BLANK___;\n  if (head == null) head = tail;\n}",
        "blanks": [
          "newNode"
        ],
        "options": [
          "newNode",
          "head",
          "null",
          "tail.next",
          "new Node()"
        ],
        "explanation": "Při přidávání do fronty se nový uzel stává novým koncem (tail) fronty."
      },
      {
        "id": "algorithms-dd-4",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplňte logiku binárního vyhledávání (nalezení středu).",
        "code": "int low = 0, high = arr.Length - 1;\nwhile (low <= high) {\n  int mid = ___BLANK___;\n  if (arr[mid] == target) return mid;\n  if (arr[mid] < target) low = mid + 1;\n  else high = mid - 1;\n}",
        "blanks": [
          "low + (high - low) / 2"
        ],
        "options": [
          "low + (high - low) / 2",
          "(low + high) / 2",
          "low + high / 2",
          "high - low",
          "mid + 1"
        ],
        "explanation": "Výpočet středu pomocí low + (high - low) / 2 zabraňuje přetečení celočíselné hodnoty."
      },
      {
        "id": "algorithms-dd-5",
        "type": "dragdrop",
        "difficulty": "easy",
        "instruction": "Doplňte operaci odebrání ze zásobníku (Stack).",
        "code": "public int Pop() {\n  if (top == null) throw new Exception();\n  int value = top.data;\n  top = ___BLANK___;\n  return value;\n}",
        "blanks": [
          "top.next"
        ],
        "options": [
          "top.next",
          "top",
          "null",
          "top.prev",
          "head"
        ],
        "explanation": "V zásobníkovém seznamu se 'top' posune na následující uzel v pořadí."
      },
      {
        "id": "algorithms-dd-6",
        "type": "dragdrop",
        "difficulty": "hard",
        "instruction": "Doplňte vložení uzlu na začátek Linked Listu.",
        "code": "public void AddFirst(int data) {\n  Node newNode = new Node(data);\n  newNode.next = ___BLANK___;\n  head = newNode;\n}",
        "blanks": [
          "head"
        ],
        "options": [
          "head",
          "null",
          "newNode",
          "tail",
          "newNode.next"
        ],
        "explanation": "Nový uzel musí ukazovat na dosavadní první prvek (head), aby se řetězec nepřerušil."
      },
      {
        "id": "algorithms-dd-7",
        "type": "dragdrop",
        "difficulty": "medium",
        "instruction": "Doplňte časovou složitost průchodu polem.",
        "code": "public void PrintAll(int[] arr) {\n  // Časová složitost: ___BLANK___\n  foreach (int i in arr) Console.WriteLine(i);\n}",
        "blanks": [
          "O(n)"
        ],
        "options": [
          "O(n)",
          "O(1)",
          "O(n^2)",
          "O(log n)",
          "O(n log n)"
        ],
        "explanation": "Lineární průchod polem o n prvcích má složitost O(n)."
      },
      {
        "id": "algorithms-dd-8",
        "type": "dragdrop",
        "difficulty": "easy",
        "instruction": "Doplňte inicializaci prázdného Linked Listu.",
        "code": "public class LinkedList {\n  private Node head = ___BLANK___;\n}",
        "blanks": [
          "null"
        ],
        "options": [
          "null",
          "new Node()",
          "0",
          "new int[0]",
          "head"
        ],
        "explanation": "Prázdný Linked List nemá žádný první uzel, proto je head null."
      },
      {
        "id": "algorithms-f-1",
        "type": "fill",
        "difficulty": "easy",
        "instruction": "Jaká je časová složitost algoritmu Bubble Sort v nejhorším případě?",
        "answer": "O(n^2)",
        "accept_also": [
          "O(n na druhou)",
          "kvadratická"
        ],
        "explanation": "Bubble sort používá dva vnořené cykly, což vede ke kvadratické složitosti."
      },
      {
        "id": "algorithms-f-2",
        "type": "fill",
        "difficulty": "medium",
        "instruction": "Jak se nazývá datová struktura typu LIFO (Last In, First Out)?",
        "answer": "zásobník",
        "accept_also": [
          "stack"
        ],
        "explanation": "Zásobník (Stack) pracuje na principu poslední dovnitř, první ven."
      },
      {
        "id": "algorithms-f-3",
        "type": "hard",
        "instruction": "Jaká je časová složitost binárního vyhledávání v seřazeném poli o n prvcích?",
        "answer": "O(log n)",
        "accept_also": [
          "logaritmická"
        ],
        "explanation": "Binární vyhledávání v každém kroku půlí prohledávaný prostor."
      },
      {
        "id": "algorithms-f-4",
        "type": "medium",
        "instruction": "Jak se nazývá chyba, kdy rekurzivní funkce volá sama sebe donekonečna?",
        "answer": "přetečení zásobníku",
        "accept_also": [
          "stack overflow"
        ],
        "explanation": "Při nekonečné rekurzi dojde k vyčerpání paměti vyhrazené pro zásobník volání."
      },
      {
        "id": "algorithms-o-1",
        "type": "order",
        "difficulty": "medium",
        "instruction": "Seřaďte kroky pro prohození dvou hodnot pomocí pomocné proměnné.",
        "lines": [
          "int temp = a;",
          "a = b;",
          "b = temp;",
          "// nyní jsou hodnoty prohozeny",
          "int a = 5, b = 10;"
        ],
        "correct_order": [
          4,
          0,
          1,
          2,
          3
        ],
        "explanation": "Nejprve deklarujeme proměnné, pak uložíme první do temp, přepíšeme první druhou a druhou přepíšeme hodnotou z temp."
      },
      {
        "id": "algorithms-o-2",
        "type": "order",
        "difficulty": "medium",
        "instruction": "Seřaďte logické kroky metody pro vyprázdnění zásobníku.",
        "lines": [
          "while (top != null) {",
          "int data = top.data;",
          "top = top.next;",
          "Console.WriteLine(data);",
          "}"
        ],
        "correct_order": [
          0,
          1,
          3,
          2,
          4
        ],
        "explanation": "Kontrolujeme existenci uzlu, uložíme data, vypíšeme je a posuneme ukazatel na další uzel."
      },
      {
        "id": "algorithms-o-3",
        "type": "order",
        "difficulty": "hard",
        "instruction": "Seřaďte kroky binárního vyhledávání.",
        "lines": [
          "int mid = low + (high - low) / 2;",
          "if (arr[mid] == target) return mid;",
          "if (arr[mid] < target) low = mid + 1;",
          "else high = mid - 1;",
          "while (low <= high) {"
        ],
        "correct_order": [
          4,
          0,
          1,
          2,
          3
        ],
        "explanation": "Nejprve cyklus, pak výpočet středu, kontrola shody, a následně úprava hranic."
      }
    ]
  }
];