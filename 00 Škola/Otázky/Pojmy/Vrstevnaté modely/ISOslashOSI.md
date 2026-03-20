![[Pasted image 20260116083017.png]]

referenční model ISO/OSI (International Organization for Standardization/Open System Interconnection) vypracovala organizace ISO jako hlavní část snahy o standardizaci počítačových sítí nazvané OSI.
- používá se jako názorný příklad řešení komunikace v počítačových sítích pomocí vrstevnatého modelu, kde jsou jednotlivé vrstvy nezávislé a snadno nahraditelné.
- Každá ze sedmi vrstev vykonává skupinu jasně definovaných funkcí potřebných pro komunikaci. Pro svou činnost využívá služeb své sousední nižší vrstvy. Své služby pak poskytuje sousední vyšší vrstvě.
	- Podle referenčního modelu není dovoleno vynechávat vrstvy, ale některá vrstva nemusí být aktivní. Takové vrstvě se říká *nulová* nebo *transparentní*
- Komunikaci mezi systémy tvoří:
	- Komunikace mezi vrstvami jednoho systému, řídí se pravidly, která se obvykle nazývají **rozhraní** (interface)
	- Komunikace mezi stejnými vrstvami různých systémů, řídí se **protokoly**.
### 1. Fyzická vrstva
- Specifikuje fyzickou komunikaci. Aktivuje, udržuje deaktivuje fyzické spoje mezi koncovými systémy. Fyzické spojení může být dvoubodové (sériová linka) nebo mnohobodové (ethernet).