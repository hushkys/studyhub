přirozená 255ni long pint flow decimal všechno co jsme probírali
protoře byli definovány pro tzv dálnopis
pak máme boolean vyjmenovaný datový tp jsou jen dvě hodntoy true a falsse 
string je pole znaků
definovat vlastní datové typy jako třídu osoba a pka žák je osoba deklarován jako osoba
mohu definovat proměnnou a konstantu
to je ais všechno co sse k tomu dá říct
základní struktury jazyka c#
třídy = 
principy oop
otázka č12
třída = je kod v jazyce c# ktarý odráží realitu okolního světa proto muzeme vytvorit tridu pro libovolne podstatne jmeno at je to podstatne jmeno realne nebo abstraktni muzeme vytvorit tridu pro auto a taky pro bankovni ucet (ten je abstraktni narozdil od auta) tridu tvori atributy coz jsou zakladni charakteristiky pozdejsiho objektu ktera vznika jako instance umisteni tridy, z jedne tridy muze vznikat libovolny pocet objektu. objekt vznika pomoci konstruktoru coz je cast kodu ve tride ktera inicializuje tridu. pojem ktery byste meli umet rict. coz znamena ze jeho ukolem je priradit atributum kontkertni hodnoty. muzeme tedy konstruktory ktere jsou bezoarametricke vytvorit stejny objekt nebo parametricke kde zasilame hodnoty v podobe 
otazka byva kolik muzum mit ve tride konstruktoru = jeden bezoarametricky s jednim parametrem se dvouma, se trema, nema cenu vytvaret konstruktory s prehazenymy parametry takže odpoved je tolik kolik mam atributu plus jedna = jednicka je bezparametricky konsturktor
objekt je instance tridy vznika tak ze pomoci operatoru new zavolame pomoci nazvu tridy konstruktor, ktery se jmenuje stejne jako trida auto auto jedna = auto 
skladani je prikad: kdyz chci vytvorit usecku usecka je tvorena dvema body a bod je zase trida tvorena ze dvou atributu x a y.
dam tu jednotlive tridy ze kterych se sklada
zizala bude mit z toho cloveka jenom neco, bude mit srdce, nema oci,


### otázka 14
#### konstruktor
- konstruktor třídy
	- je to část kodu ve tride ktera az na vyjimky je public, ktere nezverejnuji konstruktor priklad singleton jedináček
	- standartní třída ma verejny konstruktor, nema zadny navratovy typ, tvari se castence jakoo metoda nema void ani navratovy tym, nazev stejny jako nazev tridy.
	- co dela: **KONSTRUKTOR INICIALIZUJE TŘÍDU!!!!!**  → atributum prirazuje hodnoty
	- mame nekolik druhu 
		- bezparametru - ten vytvori vzdycky stejny objekt (bile auto znacky Ford 2000cmna treti)
		- pretizene neboli parametricke
		- tolik kolik máme atributů +1 tolik máme typů konstruktoru????
	- priklad AUTO!
	- kdyz je parametricky thi.barva=barva a vysvětlit this.barva je pristup k te tride a a jeimu atributu, ke kteremu je prirazena hodnota toho paramateru. nevymislime dalsi nazvy takze barva barva obsahmotoru obsahmotoru

### otázka 15
#### metody tříd
- metoda je část třídy, kod ktery zacina hlavickou a prvni je modifikator pristupu
	- metoda privatni, public
- navratovy typ je-li to procedura tak ma navrtaovy typ prazdny neboli void, a když je to funkce tak je datovy typ. pak je nazev metody za tim nasleduji kulate zavorky a pripadne paramtery. 
- jak se vola procedura
	- svym nazvem jejim ukolem je neco udelat (Uloz) 
- jak se vola funkce
	- nemuzu volat jen nazvem protoze funkce vraci hodnotu 
	- hodnotu funkce musim k necemu priradit (int funkce Prirad)
	- druha moznost je ze se funkce stava parametrem jine procedury.
	- sin3 se stava parametrem metody Writeline takze volame dvema zpusoby, bud prirazujeme nebo se hodota stava parametrem jine metody
- procedura pozdravjmenem
	- public void pozdravjmenem(string jmeno)
	- Console.Writeline ahoj + jmeno
	- public int mocnina (int x)
	- return x * x
	- int x = mocnina(4;)
	- **funkce vždycky vrací hodnotu**

### otázka 16
#### Winforms
- budeme sedět u počítače  WOOOOOOOW
- spustíme si projekt ve winforms, první ovládací prvek který se vykresluje a to je formulář. 
- formulář se vykreslí způsobem, že máme třídu standartně s názvem Form1 a ta třída dědí od Form. formulář vzniká děděním a v souboru program.cs dáme instanci te nasi tridy ktera dedi od form, nepojmenovanou, nemusime pojmenovavat, staci parametr winform1 a dáme to do Application.run(new Form1());
- z panelu nastroju na nej davame dalsi ovladaci prvky (**kliknout na zobrazit a tam bude zobrazit panel nástrojů**)
- ukolem je pokud mozno co nejvic prvku si umistit na formular a popsat je. 
	- radio button, panel, label, button atd.
	- rict ze tohle je list box a nejdulezitejsi vlastnosti listboxu- ma vlastnost items coz je kolekce a muzu tu kolekci vytvorit. kliknutim na blesk mam ty vlastnosti
- kdyz z panelu nastroju pretahnu nejaky ovladaci prvek - treba legendarni scrollbar - vlastnosti → value, minimum a maximum, v jakym kroku se posouva
- **kdyz pretahnu na to co se stalo je že se vytvořila instance**
- pod kazdym formem mame designer a v nem najdu neco jako private.system.windows.forms.button button1; private.system.windows.forms.checkbox checkbox1; atd.
- takze z hlediska progrrmoavi znamena pretazeni ovladaciho prvku na formular znameno to vytvoreni instance tridy button 

### otázka 3 
Dynamické weby

nepíšu tam další složku mám složku deník
