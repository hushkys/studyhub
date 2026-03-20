- objektově orientovaný programovací jazyk vytvoření Microsoftem.
- využívá se s platformou NET Framework (*bezplatná open-source platforma pro vývojáře od společnosti Microsoft určená k vytváření, spouštění a nasazování různých aplikací*), který umožňuje spouštění aplikací na více platformách, včetně Windows, macOS a Linux s .NET Core a novějšími verzemi 
- .NET. Jeho syntaxe je podobná jiným jazykům založeným na C, jako jsou C++ a Java.
- Java a C++ jsou zároveň jazyk ze kterých C# vzniknul
- V C# neexistuje vícenásobná dědičnost (*každá třída může dědit pouze od jedné třídy*)
- neexistují globální **Proměnné** a ==Metody==, vše musí být uvnitř Tříd
- používá CTS (common type system)

**CTS**
- Unifikovaný typový systém, používaný všemi jazyky pod .NET Framework
- Všechny typy jsou potomky třídy System.Object a dědí od ní i všechny její metody
- Všechny typy v .NET jsou buď typy hodnot nebo typy odkazů.


### Hodnotové datové typy

1. **Primitivní datové typy**
    - Celočíselné datové typy (Byte, Integer, Char, …) a datové typy reprezentující reálná čísla (float, double, decimal)
2. **Struktury**
    - Uživatelsky definované datové typy
    - Připomínají třídy, ale nemohou dědit ani být děděny.
    - Mohou implementovat rozhraní
3. **Výčtové typy**
    - Množina předem definovaných hodnot (např. Dny v týdnu)
#### Referenční datové typy

- Neuchovávají na rozdíl od typů hodnotových hodnotu samotnou, ale odkaz na místo v paměti, kde je požadovaná instance uložena

# Hlavní prvky

==Namespace==
- Je to celý náš projekt, který obsahuje všechny třídy, které se v projektu nachází. Zaručuje nám integritu mezi třídami a kontroluje, aby se nejmenovali dvě třídy napříč projektem stejně​

==Class==
- Je to šablona pro následné objekty dané třídy(neboli instance). Do které se následně vkládají konstruktory, metody, atributy atd.​

==Metody==
- Jsou poslední úrovní před samotným kódem. Dělí se na funkce a procedury. Zvláštním metody je main metoda, která je unikátní v celém projektu a je vždy tou jedinou, která spouští náš program.​

![[Pasted image 20260310163447.png|428]]

**Kompilátor** - umožnuje psát kód naší syntaxí a následně si to program přeloží do strojového kódu​

## Datové typy

- Určuje typ hodnoty, které proměnná může nabývat
- Dělí se na **Hodnotové** a **Referenční**
- Dělí se na **jednoduché, složené a zvláštní datové typy**

### Hodnotové datové typy

1. **Primitivní datové typy**
    - Celočíselné datové typy (Byte, Integer, Char, …) a datové typy reprezentující reálná čísla (float, double, decimal)
2. **Struktury**
    - Uživatelsky definované datové typy
    - Připomínají třídy, ale nemohou dědit ani být děděny.
3. **Výčtové typy**
    - Množina předem definovaných hodnot (např. Dny v týdnu)

#### Referenční datové typy

- Neuchovávají na rozdíl od typů hodnotových pouze hodnotu samotnou, ale odkaz na místo v paměti, kde je požadovaná instance uložena

### Jednoduché datové typy

- Většinou přímo zabudovány do jazyka
- Dělí se na **ordinální, neordinální a prázdný datové typy**

#### Ordinální datové typy

- Tvoří lineárně uspořádanou množinu, kde pro každý prvek je přesně definovaný předchůdce i následovník

1. **Logická hodnota (boolean)**
    - Hodnoty true nebo false (boolean)
2. **Celé číslo (byte, integer, long)**
    - Hodnoty celého čísla
    - Má určitý rozsah (byte = 8 bitů, integer = 32 bitů, long = 64 bitů)
3. **Znak (char)**
    - Hodnota znaku (a,b,c)
4. **Výčtový typ (enum)**
    - Programátorem definovaný typ
    - Většinou se sem ukládají neměnné hodnoty (konstanty)
    - Příklad
        
        `enum barva {piky, srdce, kary, krize}; // barvy karet`
        

#### Neordinální datové typy

- Není jednoznačně určen předchůdce a následovník každé hodnoty

1. Reálné číslo (double, float, real)
    - Hodnoty reálných čísel
    - Mohou ve stejné velikosti paměti reprezentovat mnohem větší rozsah hodnot než celé číslo
        - 32bitové celé číslo = +-10^9 zatímco 32bitové reálné číslo = +-10
        - 
==Prázdný datový typ (void)==
- Nenabývá žádných hodnot

 ***Složené datové typy***
- Obsahují více prvků většinou stejného typu

1. **Pole (array)**
    - Obsahuje několik hodnot stejného datového typu (int[], string[])
    - Každá položka v poli má určitý **index (pořadí v poli)**
    - Mohou být vícerozměrné (těm se říká matice)
2. **Textový řetězec (String)**
    - **Pole znaků**
    - Ukládá například Slovo nebo větu/věty
3. **Seznam (list)**
    - Obdoba pole
    - Nelze seznam přímo adresovat pomocí indexu a lze ho procházet pouze postupně (od začátku do konce)
    - Výhodou seznamů je snadné přidávání nebo odebíraní prvků uprostřed seznamu
4. **Záznam**
    - Může být složen z prvků různých datových typů
    
##### Proměnné (Variables)
- Označena identifikátorem (symbolické jméno) a datovým typem
- drží v sobě nějaká data ke kterým můžeme později přistupovat
- Můžou mít nějaký **modifikátor přístupu *(public, private, protected)***
- Privátní proměnné se získávají/nastavují **gettery a settery**
- Neměnné proměnné se nazývají konstanty
==Druhy==
- textové
	- string, char​
- číselné 
	- *Celočíselné*: int, long, short​
	- *S desetinným místem*: float, double​
- logické
	- bool (může být pouze TRUE/FALS)





