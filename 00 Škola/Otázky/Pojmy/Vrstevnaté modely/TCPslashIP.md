- je sada (rodina) protokolů pro komunikaci v počítačových sítích používaná v celosvětové síti Internet. Její název pochází ze dvou nejdůležitějších protokolů: IP (Internet Protocol – „protokol pro propojení sítí“) je protokol síťové vrstvy, který umožňuje komunikaci libovolných dvou uzlů (počítačů) v propojených sítích (internetwork), a TCP (Transmission Control Protocol – „protokol pro řízení přenosu“) je protokol transportní vrstvy, který zajišťuje spolehlivý obousměrný přenos dat mezi aplikacemi na příslušných dvou uzlech. 
### 1. **Vrstva síťového rozhraní**
- Nejnižší vrstva umožňuje přístup k fyzickému přenosovému médiu. Je specifická pro každou síť v závislosti na její implementaci. 
	- Příklady sítí: Ethernet, Token ring, FDDI, 100BaseVG, X.25, SMDS. 
### 2. Síťová vrstva
- Vrstva zajišťuje především síťovou adresaci, směřování datagramů. 
	- Protokoly: IP, ARP, RARP, ICMP, IGMP, IGRP, IPSEC. 
- Je implementována ve všech prvcích sítě - směrovacích i koncových zařízeních.
### 3. Transportní vrstva
- Poskytuje transportní služby pro kontrolu celistvosti dat: kontrolované spojení spolehlivým protokolem TCP nebo  nekontrolované spojení nespolehlivým protokolem UDP (user datagram protocol). Transportní vrstva je implementovaná až v koncových zařízeních a umožňuje přizpůsobit chování sítě potřebám aplikace.
### 4. Aplikační vrstva
- Vrstva aplikací. Jedná se o protokoly, které slouží k přenosu konkrétních dat. Příklady: Telnet, FTP, HTTP, DHCP, DNS.
- Aplikační protokoly používají vždy jednu ze dvou základních služeb transportní vrstvy: TCP nebo UDP, případně obě dvě (např. DNS). Pro rozlišení aplikačních protokolů se používají tzv. porty, což jsou domluvená číselná označení aplikací. Každé síťové spojení aplikace je jednoznačně určeno číslem portu a transportním protokolem (a samozřejmě adresou počítače). 

### IPv4
- 1981, stále nejrozšířenější protokol internetu
- 32 bitové adresy, což umožňuje asi 4,3 miliardy unikárních adres
- formát: 0-255 → 192.18.1.1
- adresy se vyčerpaly - všechny už byly přiděleny
### IPv6
- nástupce IPv4 kvůli nedostatku adres
- používá 128 bitové adresy => prakticky nevyčerpatelný počet adres (340 undeciliónů... to je 36 nul bráško)
- formát: osm skupin čtyř hexadecimálních číslic oddělených dvojtečkami (např. 2001:0db8:85a3:0000:0000:8a2e:0370:7334)
- Zabudované pokročilé bezpečnostní funkce (IPsec)
### rozdíly mezi IPv4 a IPv6
- kromě očividných...:
	- IPv6 má IPsec standartně, IPv4 má volitelný
	- IPv4 potřebuje překlad adres (NAT) kvůli nedostatku adres, IPv6 ne