Úvod do PSI
druhák-
první věc, co je počítačová síť - propojení dvou a více zařízení (switche, routery, počítače, telefony ...), za účelem sdílení dat, hardwaru, a komunikace.

![[schéma data 1.svg]]
Modely: 
	ISO/OSI referenční model - znázorňuje komunikaci mezi dvěma zařízení. Jedná se o vrstevnatý model, kde každá vrstva má svůj účel a funkci (je teoretický)
	TCP/IP vrstevnatý model používaný v praxi a pracuje na základě protokolu
ISO/OSI
1.fyzická vrstva
	stará se o přenos signálů po přenosové cestě
	Funkce:
	konverze bitů na signál
	třetí funkce tvorba bitů
	Zařízení:
	pasivní: kroucená dvoulinka koaxiální kabel optický kabel
	aktivní: mezi aktivní patří síťová karta (NIC), repeater, převodník, HUB
2.linková vrstva
	Funkce:
	z bitů vytváří rámce
	komunikuje s okolními vrstvami (s fyzickou a síťovou)
	řeší kolize
	pracuje s mac adresami
	je spolehlivá
	Zařízení: Bridge a L2 switch (protože jsem na druhé vrstvě)
	Vzniká: rámec
3.síťová vrstva:
	funkce: 
	komunikace s okolními vrstvami (transportní a linková)
	adresace (IP adresy)
	směrování packetů
	segmentace sítě pomocí VLAN
	zařízení:
	L3 switch a router
	Vzniká: packety
4.transportní vrstva:
	funkce:
	příprava dat pro přenos (segmentace)
	volí způsob komunikace (TCP a UDP)
	práce s porty a jednoznačná identifikace aplikace nebo služby (zde se pozná jestli to je mail a nebo web)
	šifrování dat!!!!!!! (SSL a TLS)
	komunikace s okolními vrstvami -  relační a síťová
	navazování spojení
	zařízení: žádný
	vzniká: segment
přeskočíme 5,6
7.vrstva
	úkoly:
	jednotlivé protokoly (služby)
	elektronická pošta, DNS, FTP apod.
	zařízení: žádná
	vzniká: data z jednotlivých služeb, de facto nic

TCP/IP
1. vrstva síťového rozhraní
	vznikla spojením fyzické a linkové vrstvy z modelu ISO/OSI a má na starosti typy připojení rámce
2. síťová vrstva 
	zde pracují protokoly ARP, ICMP, protokol IP (který se stará o IP)
	routovací protokoly
3. transportní 
	zde pracují základní protokoly TCP a UDP a šifrovací protokoly SSL a TLS
4. aplikační 
	vznikla sloučením vrstev relační, prezentační a aplikační a pracují zde dva aplikační protokoly POP3, IMAP, SMTP, FTP, HTTP

![[TCP-IP_zapouzdreni_-_edited.svg 1.png]]
zpátky na fyzickou vrstvu- bity nám vytváří zařízení - síťovka (NIC) - drátové a bezdrátové... drátové - optický a metalický


NIC- převádí bity na napětí a obráceně = tvorba bitů
síťová karta (síťové rozhraní)
druhý zařízení na fyzické vrstvě(aktivní)- repeater - zesiluje a opakuje, opravuje signál. 
další zařízení: převodník - převádí bity (signál) z jednoho media na druhý.
bridge - spojuje dvě možný sítě s různým číslováním. přes MAC adresy, má tabulku adres, a převádí rámce z jedné sítě do druhý pomocí MAC adres které jsou v hlavičce.
switch - pracuje v rámci vlastní tabulku portů a MAC adres, a na základě této tabulky propojuje jednotlivé porty
port mirroring (ve switchi) mezi switchem a počítačem, respektive síťové rozhraní. na switchi máme Macovku a stejnou macovku máme na sitovem rozhrani ale na switchi to je pouze virtualni. zdrcadleni portu je switch je virtualne a na druhe strane v sitovem rozhrani to je fyzicky. fyzicky to je na počítači a ogicky to je na portu
metody: store and forward, vezme se rámec, prijde na switch ulozi se do cache pameti, zjisti se cilova mac adresa cilova a najde si ji v tabulce , propoji dva porty a posle ji tam
prijdete s novym switchem, strcime do zasuvky, prvni vec co switch je to ze naplni tabulku, jak - (typy komunikace -  broadcast) vyšle broadcast aby vyplnil mac tabulku a standartne zacne fungovat jak ma, ramec jde na jeden port, stane se metoda a posle se dal a neposila se na ty ostani

další kapitolka
router slouží k tvorbě routování podsítí, vyhledávání správné cesty, pro daný packet
směruje packet skrz podsítě, popřípadě vyhodí packet z podsítě pomocí tzv defaultní routy, vše funguje na bázi routovacích protokolů (rip, ispf, rigrp, vgb) ,jedná se o tzv. dynamické routování
u statického routování administrátor plní routovací tabulky sám. 
routovací protokoly:
![[routovací-protokoly.svg]]
igp:
v lokálních sítích a používají dvě motody pro typ routování (next hop - distance vector, cena linky - link-state)
egp:
používá se pouze v internetu 
path vectoru
RIP: 
jedná se o dynamický protokol využívá metodu next hop, címž určuje nejkratší vzdálenost (od?) packet, každý router si udržuje routovací tabulku, ve které je zadaná vzdálenost do všech podsítí
 routery si mezi sebou sdílejí tabulky 
 nevýhody rip:
  je starý
 routovací smyčky (zacyklí se) - řešení pomocí TTL (Time To Live)
 díky pravidelnému vyměňování tabulek dochází ke zvýšenému provozu na síti
 
 co se píše do routovací tabulky - jaké podsítě? ty přímo připojené
vyplňují se přímé podsítě

Statický
nepřímo připojené podsítě a výchozí brána neboli gateway v dané podsíti. 
nevýhody:
a) dlouho se to nastavuje, všechno ručně
b) při změně je nutná aktualizace všech  routovacích sítí
výhody: 
a) tvorba vlastních cest 

routovací tabulka
obsahuje v prvním sloupečku typ protokolu, typ routování a jestli se jedná o přímo připojenou podsíť
druhej sloupeček - podsíť kam jdu nebo jestli je přímo připojená
další - gateway
další - metrika
poslední - síťové rozhraní 
poslední znova -  defualtní routa (0.0.0.0)

VLANy
rozdělení sítě na určité části pomocí L3 switche a dáváte stejná zařízení která mají být ve tejné podsíti dáváme do jedné VLANy

zatímco jednotlivé porty tak je tzv. access (jedna VLANa)
všechny VLANy si nastavujeme v druhým vlanu a v druhých portech přiřazujeme jednu nebi více vlan
dopředu je nutné si připravit VLANy a to jsem nestihl
výhody použití VLAN:
segmentace sítě na menší části
vyšší bezpečnost
menší zatížení daného segmentu
snížení kolizí => zmenšení broadcastu => oddělení služeb
snížení nákladu na hardwaru
komunikace probíhá na základě rámců podle mac adresy popřípadě podle protokolu
primárně na základě portů na switchi

na třetí vrstvě
IP adresace má tři druhy přidělování
1) ručně správce v desítkové soustavě (přiděluje admin sítě)
2) dynamicky přes DHCP server
3) APIPA (přiděluje to kdo? operační systém)

u IP se jedná o logickou adresu která je napevno svázaná s maskou sítě z pohledu síťového adaptéru je vázaná na mac adresu
IP adresa je zapsaná desítkově a pro práci s ní se využívá zápis ve dvojkové soustavě (binární)
IP adresa se skládá z host ID a z net ID hranice mezi host id a net id je určena jedničkami z masky sítě 
IP adresa má 32 bitů a jsou to 4 oktety po 8 bitech 
další dělení je na IPv4 a IPv6 
další dělení na privátní a veřejná
privátní - využívá se v lokálních sítích v rámci jedné sítě musí být jedinečná ale může se opakovat v jiných lokálních sítí
veřejná - je viditelná v internetu a v rámci celého internetu je jedinečná

adresace podsítí: 
172.16.0.0

MUA - outlook, thunderbird - poštovní klient
MTA
POŠTOVNÍ SERVER- podívá se do hlavičky a podívá se kdo je příjemce
do složky new

server vidí tyto uživatelské funkce: 
- vidí verze prohlížeče
- vidí váš OS
- rozlišení
bezpečnost prohlížečů (neboli druhý ročník)
- důležité:
	- aktuální verze
	- pravidelně mazat chache a historii a cookies


využívá porty 20(data) a 21(příkazy)

#### DHCP
- slouží k dynamickému připojování konfigurace síťového rozhraní pomocí protokolu IP (přidělí IP, masku, gateway, DNSky)
- v případě nefunkčnosti DHCP serveru přiděluje konfiguraci OS z rozsahu 169.254.1.0 - 16.254.254.255/16 (maska 255.255.0.0)
- **funkčnost**
	- na počátku má počítač 0.0.0.0 (4 nuly jsou defaultní route)
	- první co se udělá - vyslat broadcast (ten packet se jmenuje DHCPDISCOVER) ten packet hledá DHCP server v celé síti, nic víc.
	- přijde zpátky packet který se jmenuje DHCPOFFER s nabídkou té konfigurace pro tu danou síť (síťové rozhraní)
	- klient si vybere příslušnou konfiguraci a packetem DHCPPREREQUEST o ní požádá
	- server potvrdí danou konfiguraci pomocí DHCPACK 
	- ke konci platnosti konfigurace klient požádá server pomocí packetu DHCPACK o prodloužení
	- v případě že je již adresa obsazená postup se opakuje o DHCPOFFER?

#### DNS
- Domain Name System
- je realizovaný pomocí DNS serverů a prvním typem je tzv. autoritativní - de facto ukládá záznamy pro danou síť
- Rekurzivní (cachovací) server co ukládá všechny záznamy který jako klient potřebujeme přeložit( ukládá si požadované záznamy neboli překlady do klienta)
- většinou mají ISP poskytovatele
- root name servery (úplně nejvyšší)
	- spadají do tzv. top level domain
	- označovaný písmeny A - M a obsahují všechny záznamy překladu
	- servery spravuje IANA 
#### DNS záznamy a registrace domény
 doména se zakládá skrz registrátora
 - existují domény prvního, druhého a třetího řádu
	 - doména prvního řádu je .CZ (národní koncovky, ale i EDU nebo BIZ, COM)
	 - doména druhého řádu - gmail.etc, google.etc
	 - třetího řádu - sub domény (xxxxx.[xyz.cz]) 
- s domény souvisí nějaké? záznamy
	- A - IPv4
	- AAAA - IPv6
	- MX - mail exchange (mail.seznam.cz)
	- TXT  - textový záznam
	- CNAME - *.SPOSDK.CZ tak je záznam 
- DNS překládá doménový název na IP adresu
- překlad funguje tak , že máme někde počítač a chceme si otevřít seznam, ten počítač se zeptá nějakého DNS serveru podle nastavení konfigurace, jestli má ten překlad
### Hardware a periferie
počítačový zdroj 
- napájí veškeré komponenty v počítači 
- obsahuje základní konektory 
	- hlavní je main power 24 pinů a slouží k hlavnímu napájení základní desky
- přídavné napájení procesu
	- 4 pinový
	- černá a žlutá
- Molex 
	- slouží k napájení optických mechanik a paměťových disků
- SATA power
- **důležité barvy** 
	- žlutá +12V
	- červená +5V
	- oranžová +3.3V
	- černá - zem
	- zelený - PS_ON
	- šedý - PWR-OK
	- fialový - +5VSB
- veškerá napětí jsou stejnosměrná
**ÚKOL**
- převést napětí na stejnosměrné
- rozdělit ho na správné velikosti

- řeší se výkon zdroje - watáž a účinnost
##### operační paměti
- ROM read only memory (ROM, PROM, EPROM, EEPROM)
- RAM random access memory
##### ROM 
. nejde změnit, už je naprogramovaná od várobce
**PROM** - koupíš si prázdný čip a sám si ho naprogramuješ
**EPROM** - jde použít víckrát, lze ji vymazat UV světlem
**EEPROM** - lze ji vymazat přivedeným napětím a naprogramovat znovu
	- electric erase programmable read only memory
**FLASH** - 

#### RAM
- static
- dynamic - refresh dat v paměti

- static
	- SIMM - čipy pouze po jedné straně

- dynamic
	- DIMM - po dvou stranách

- SDDRAM
- DDR1-5 
u paměti se řeší časování, frekvence, uložení čipu a kapacita (SIMM a DIMM)


### základní deska
obsahuje sloty na paměť, patici na procesor (PGA nebo LGA)
vstupní a výstupní konektory k připojování periferií - USB, ethernetový výstup, výstup z grafických karet (HDMI) apod.
pak má rozšiřující sloty pro karty - PSI, PSI expess, krátký 1x a dlouhý 4,8,16, a možná i 32
konektory na připojení pevných disků - SATA, mSATA
čipy → chipset

### Procesory
dva základní druhy procesoru
RISC A CISC
RISC - redukovaná instrukční sada
CISC - kompletní řada instrukcí
patice LGA PGA, jak INTEL tak AMD
frekvence se udává v GHz
počet DDR a vláken
**Hyperthreading** - umožňuje single CPU fungovat jako dvě virtuální jádra
**hypertransport** - vysokorychlostní komunikační technologie která se používá ke spojení integrovaných obvodů v počítačích a serverech (POUZE U AMD) vysokorychlostní komunikace mezi hardwarem za účelem nízké latence
**multitasking** - procesor je schopný  zpracovávat víc procesů najednou

### Grafické karty
 v dnešní době je nejrychlejší a nejvýkonnější část počítače
 obsahuje
 - vlastní paměť (GGDR 1-6)
 - vlastní procesor (1 a více procesorů)
 - vlastní chipset
zapojují se  do slotu agb a pci express

### Pevný dick
**HDD** (Hard Disc Drive)
Rozdělení pevných disků:
	1)elektronický SSD
	- mechanický
- mechanický
	- HDD
	- Hybridní disk SSHDD
konektory - SATA
			- externě ESATA
			- M.2
			- PCI Express

struktura:
fyzická struktura disku:
![[OIP-3749395851 1.jpg]]
mechanismus pomocí cívek

logická struktura disku:
![[pevnydisk_cluster-3728734673.jpg]]
### Tiskárny
- **jehličková**
	- základní typy:
		- 1 jehličková (splašený hřebík)
		- 9 jehličková (nejčastější)
		- 24 jehličková
	- dopsat jak funguje jehličková tiskárna (funguje na principu psacího stroje)
	- nevýhody:
		- hlučné
		- na dnešní poměry jsou velmi drahý (začínají okolo 16k)
		- nízká kvalita tisku
		- omezený počet barev (standartně 1, na barevných max 4)
		- velmi pomalá (stránka třeba půl minuty)
	- výhody:
		- prakticky nezničitelná
		- tisk je levný (ta páska cca 500Kč cca 10000 stránek)
		- zvládá více kopií najednou
- **Inkoustová**
	- dvě základní technologie:
		- deskjet
			- fyzikální princip roztahování kapalin (dopsat jak funguje)
		- bubblejet / inkjet
			- funguje na podobným principu ale teplo vzniká piezo elektrických krystalů (jako v zapalovači)
	- výhody:
		- kvalita tisku
		- relativně rychlost
		- standartně ink tiskárny obsahují další funkce (scan, fax, copy) 
		- jsou levný (pořiz. cena levná, náklady na údržbu faaaakt ne)
	- nevýhody:
		- drahý tiskový náklady
		- při nečinnosti zasychají trysky
		- nutnost uschnutí tisku (musíš aftercare víš co)
- **laserová**
	- tisk pomocí toneru
	- skládá se z:
		- barva
		- pryskyřice
		- kovové částečky
	- výhody:
		- rychlost
		- relativně levný (obyč za 1800 Kč, barevná okolo 6000 Kč)
	- nevýhody:
		- pryskyřice smrdí (někomu, panu Mackovi to voní)
		- drahé náklady na opravu (komponenty jsou mastný)
- **termální**
	- obsahuje jenom tu hlavici která fouká horký vzduch na papír + termo citlivý papír. jakmile horký vzduch lehne na ten papír tak zčerná
	- nevýhody:
		- speciální papír
		- stářím papír vybledne nebo na sluníčku zčerná
	- výhody:
		- rychlá
		- svým způsobem levná
		- jediný co se může pokazit na tej tiskárně je ta tisková hlava

### Bezdrátová komunikace
- je založená na šíření elektromagnetických vln v prostředí (nešíří se vzduchem)
- ty vlny nevycházejí faraday klecí
- **druhy bezdrátových sítí:**
	- televize, rádio
	- bluetooth, GPS, BSM signál, NFC, infraport, Wi-Fi, zkušebně Li-Fi,  šíření pomocí laserového paprksu (FSO - free space optic)
	- každá bezdrátová síť má svojí normu a svoji přiřazenou frekvenci na který funguje
	- frekvence se dělí na dvě pásma:
		- licenční
			- 10, 60 GHz 
			- potřeba potvrzení od českého telekomunikačního úřadu (ČTU)
		- bezlicenční
			- veřejně dostupné 2.4, 5, 6GHz
- **Hardware**
	- anténa
	- účinnost antény se udává v imbecilech (decibelech)
		- směrová anténa (yagi anténa nebo taky rybí kost)
			- vyzařuje úzký pásmo el.mag. vln (na dlouhé vzdálenosti 1 - 15km)
		- sektorová anténa 
			-  vyzařují pod určitým úhlem na určitý sektor (třeba 60°)
		- všesměrová
			- do všech směrů
- Kabeláž
	- používá se pro napájení popřípadě k připojení antén
	- pro napájení se používá kroucená dvoulinka v kombinaci s POE
	- připojení antén pomocí koaxiálního kabelu
	- **konektory**
		- RJ-45
		- RSMA (připojení antény na ten koaxiál) Female or Male
- Bezdrátové síťové karty
	- interní
		- PCI express
	- externí
		- USB
	- aktivní
		- accespoint
		- bezdrátové routery
- Bezdrátová síť wifi
	- základní frekvenci 2.4; 5; 6; 7
	- bezlicenční
	- využívá pásma 20 a 40 GHz
- Zabezpečení bezdrátových sítí
	- bez hesla jenom s klientem SSID 
		- není úplně ideální
	- WEP klíč
		- dá se prolomit do 2 vteřin
	- WPA 1 až 3
		- patří dva šifrovací klíče (PSK a ASK)


