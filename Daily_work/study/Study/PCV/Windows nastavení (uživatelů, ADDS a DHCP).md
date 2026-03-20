# Instalace Windows serveru/klienta

- V aplikaci virtual box klikněte na nový
	- pojmenujte svůj projekt jako třeba win-server
	- vyberte iso soubor se serverem/klientem
	- u serveru si v podkategorii změňte nastavení na desktopové prostředí aby jste nedělali v konzoli bez desktopu
	- nastavte si jméno a heslo a správnou velikost (**dodělat**)
- Poté spusťte a při instalaci obě instalace přenastavte na z NAT na vnitřní síť v nastavení
- před vším ostatním jděte do ovládací panel > systém a zabezpečení > firewall (vypnout firewall)
- V ovládacím panelu dále přenastavte svojí IP adresu z automatické na ruční příklad: (maska se nastaví automaticky)
	- 192.168.0.100
- po spuštění klienta zatím není potřeba, otevřete nastavení serveru a přidejte ADDS a DNS. Po instalaci po vás bude chtít povýšit na doménový řadič. Po kliknutí na oznámení zvolte možnost nový (**něco**) pojmenujte svojí doménu a pokračujte ve stahování. Po dokončení se vám restartuje počítač pro aplikaci změn.

# uživatelé

Na serveru otevřete správu zásad skupin a do své domény přidejte složku **uživatelé** a **admin**
- ve složce uživatelé vytvořte složku 6 uživatelů, dejte jim heslo a vytvořte složku **skupiny** kde budou 3 skupiny (jakékoliv pojmenování), a do každé z nich přidejte 2 uživatele aby každý uživatel byl ve skupině po 2 a nikdo nebyl ve více než jedné.
- Do složky admin přidejte... admina, a nastavte mu tyto práva
- 
		 ![[Pasted image 20260312155550.png|354]]

# DHCP

- na serveru se odhlašte a přihlašte se na vašeho vytvořeného admina
- Zároveň si otevřete klienta nainstalujte a vypněte firewall. A nastavte si IP adresu (jen pro teď aby jste mohli komunikovat se serverem)
	- IP (192.168.0.101)
	- Gateway (192.168.0.100)
- Poté se přihlaste do vaší vytvořené domény. Zadejte přihlašovací údaje k adminovy pro potvrzení a poté restartujte počítač.
- Pokud vše proběhlo správně po naběhnutí by jste měli vidět když najedete na ikonku ethernetu či v ovládacím panelu název vaší domény např.*(pozler.local)*
- Následně přejděte na server a nainstalujte si DHCP jako admin, kterého jsme vytvořily
- po instalaci vám DHCP pošle zprávu že je potřeba ho do konfigurovat pokud je vše správně po dokončení by jste měli vydět 2 zprávy a u nich ke konci napsáno **Hotovo**. To znamená že jste udělali vše správně a můžete DHCP nakonfigurovat
- půjdeme do program DHCP → right click IPv4 → Nový obor → pojmenovat
	 ![[Pasted image 20260312160449.png|385]]
	- nastavíme rozsah našeho DHCP
	 ![[Pasted image 20260312161856.png|408]]
	- zadat IP hlavního AD serveru
- po dokončení přejděte na klienta a změňte IP na DHCP, restartujte se a znovu přihlašte se na jednoho z vašich uživatelů
- jděte do terminálu a zadejte **ipconfig**
- pokud vše funguje uvidíte třeba u našeho příkladu v IPv4: 192.168.0.151, a název vaší domény.


# Sdílení Složek

- na serveru jděte do files otevřete svůj disk a vytvořte zde složku Home
- když pak right clickete na složky můžete ve sdílení přidat skupiny a uživatelé a nastavit jim práva jako (zápis, změna, možnost číst či složku vůbec otevřít)
- dále v zabezpečení zakažte dědičnost
- do této složky vytvořte složky:
	- Uživatelé (přidejte zde všechny uživatele)
	- v uživatelý vytvořte složky tří skupiny které jste si před tím vytvořily
		- uživatele do složky přidáte ve *správě zásad skupin*
		- kde jejich složku nastavíte na //Home/Uzivatele/(skupina_ve_které_jsou)%Username%
		- jakmile si tyto složky vytvoříte v jednotlivých skupinách jim zakaže oprávnění otevírat ostatní uživatele (aby užiavatel mohl jen do své skupiny a otevřit svoji složku)
	- Zálohy
	- Dokumenty


# Mapování 

- Správa zásad skupiny → right click SPOS.local → Vytvořit objet zásad skupiny → pojmenovat, right-clicknout → upravit
	- ![[Pasted image 20260314100536.png]]
# Práva a zásady uživatelů - domovské složky
    
- označíme všechny uživatele které chceme, aby měli Home
	- right-click → vlastnosti → Profil → Domovská složka checkbox → připojit k - `\\JmenoServeru\Homes\%username%`
    - tím se hodí domy všech uživatelů úspěšně 
- omezíme uživatele ve složce speciální pomocí
    
    - Správa zásad skupiny → right-click OU → Vytvořit objekt zásad skupiny v této doméně a propojit jej sem
    - ten objekt ZS right-click → upravit
    - naklikat 5 omezení uživatele
    - např. : Konfigurace uživatele → Zásady → Šablony pro správu: Definice zásad → Plocha → Zakázat všechny položky
        - zakáže všechny ikony na ploše pro danou OU
    - ![[Pasted image 20260312162226.png|520]]
    - Zakázané funkce (Plocha/Zakázání všech ikon, Zákaz otevření Ovládacích panelů a Nastavení)

