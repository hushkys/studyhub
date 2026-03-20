#### Přehled symbolů

|                                           Značka                                           |      Název      |        Význam         |
| :----------------------------------------------------------------------------------------: | :-------------: | :-------------------: |
|       ![\neg a](https://www.vypocitejto.cz/zaklady-matematiky/vyroky/obr/vyr-1.svg)        | negace výroku a |    negace výroku a    |
|     ![a \wedge b](https://www.vypocitejto.cz/zaklady-matematiky/vyroky/obr/vyr-2.svg)      |    konjunkce    |    a a (zároveň) b    |
|      ![a \vee b](https://www.vypocitejto.cz/zaklady-matematiky/vyroky/obr/vyr-3.svg)       |    disjunkce    |       a nebo b        |
|   ![a \Rightarrow b](https://www.vypocitejto.cz/zaklady-matematiky/vyroky/obr/vyr-4.svg)   |    implikace    |   jestliže a, pak b   |
| ![a \Leftrightarrow b](https://www.vypocitejto.cz/zaklady-matematiky/vyroky/obr/vyr-5.svg) |   ekvivalence   | a je ekvivalentní s b |
- Výrok je sdělení (oznamovací věta), u kterého je možné určit, jestli je nebo není pravdivé. Na základě toho výrokům přiřazujeme pravdivostní hodnoty:
	- 0 – výrok je nepravdivý
	- 1 – výrok je pravdivý

- Negace výroku a je výrok: „Není pravda, ža a“. Značí se ¬a. Je-li výrok a pravdivý, pak je výrok ¬a nepravdivý a naopak, což je vyjádřeno v následující tabulce pravdivostních hodnot:

|  a  | ¬a  |
| :-: | :-: |
|  1  |  0  |
|  0  |  1  |

# Složené výroky

##### Konjunkce
- zápis: ![a \wedge b](https://www.vypocitejto.cz/zaklady-matematiky/vyroky/obr/vyr-2.svg)
- Konjunkce výroků vznikne jejich spojením spojkou „a“. Zapisuje se ![a \wedge b](https://www.vypocitejto.cz/zaklady-matematiky/vyroky/obr/vyr-2.svg), což znamená „a a b“, případně „a a zároveň b“.
- Konjunkce je pravdivá pouze v tom případě, kdy jsou pravdivé oba výroky, které ji tvoří:

|  a  |  b  | ![a \wedge b](https://www.vypocitejto.cz/zaklady-matematiky/vyroky/obr/vyr-2.svg) |
| :-: | :-: | :-------------------------------------------------------------------------------: |
|  1  |  1  |                                        11                                         |
|  1  |  0  |                                         0                                         |
|  0  |  1  |                                         0                                         |
|  0  |  0  |                                         0                                         |

##### Disjunkce
- zápis: ![a \vee b](https://www.vypocitejto.cz/zaklady-matematiky/vyroky/obr/vyr-3.svg)
- Disjunkce výroků vznikne jejich spojením spojkou „nebo“. Zapisuje se ![a \vee b](https://www.vypocitejto.cz/zaklady-matematiky/vyroky/obr/vyr-3.svg), což znamená „a nebo b“.
- Disjunkce je pravdivá pouze v tom případě, kdy je pravdivý alespoň jeden z výroků, které ji tvoří:

|  a  |  b  | ![a \vee b](https://www.vypocitejto.cz/zaklady-matematiky/vyroky/obr/vyr-3.svg) |
| :-: | :-: | :-----------------------------------------------------------------------------: |
|  1  |  1  |                                        1                                        |
|  1  |  0  |                                        1                                        |
|  0  |  1  |                                        1                                        |
|  0  |  0  |                                        0                                        |

##### Implikace
- zápis: ![a \Rightarrow b](https://www.vypocitejto.cz/zaklady-matematiky/vyroky/obr/vyr-4.svg)
- Implikace výroků vznikne jejich spojením obratem „jestliže, pak“. Zapisuje se ![a \Rightarrow b](https://www.vypocitejto.cz/zaklady-matematiky/vyroky/obr/vyr-4.svg), což znamená „jestliže a, pak b“, případně „z a plyne b“ nebo „platí-li a, platí b“. Výrok a se za této situace nazývá předpoklad a výrok b závěr.
- Implikace je pravdivá ve všech případech, kromě toho, kdy z pravdivého předpokladu plyne nepravdivý závěr:

|  a  |  b  | ![a \Rightarrow b](https://www.vypocitejto.cz/zaklady-matematiky/vyroky/obr/vyr-4.svg) | ![b \Rightarrow a](https://www.vypocitejto.cz/zaklady-matematiky/vyroky/obr/vyr-8.svg) |
| :-: | :-: | :------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------: |
|  1  |  1  |                                           1                                            |                                           1                                            |
|  1  |  0  |                                           0                                            |                                           1                                            |
|  0  |  1  |                                           1                                            |                                           0                                            |
|  0  |  0  |                                           1                                            |                                           1                                            |
- ![b \Rightarrow a](https://www.vypocitejto.cz/zaklady-matematiky/vyroky/obr/vyr-8.svg) se nazývá obrácená imlikace k ![a \Rightarrow b](https://www.vypocitejto.cz/zaklady-matematiky/vyroky/obr/vyr-4.svg). T tabulky je zřejmé, že z pravdivosti implikace ![a \Rightarrow b](https://www.vypocitejto.cz/zaklady-matematiky/vyroky/obr/vyr-4.svg) nevyplývá pravdivost obrácené implikace ![b \Rightarrow a](https://www.vypocitejto.cz/zaklady-matematiky/vyroky/obr/vyr-8.svg). Na rozdíl od konjunkce ![a \wedge b](https://www.vypocitejto.cz/zaklady-matematiky/vyroky/obr/vyr-2.svg) a disjunkce ![a \vee b](https://www.vypocitejto.cz/zaklady-matematiky/vyroky/obr/vyr-3.svg) v případě implikace nelze pořadí výroků zaměnit, aniž by se změnila pravdivostní hodnota složeného výroku.

##### Ekvivalence
- zápis: ![a \Leftrightarrow b](https://www.vypocitejto.cz/zaklady-matematiky/vyroky/obr/vyr-5.svg)
- Ekvivalence výroků a, b je konjunkce implikace ![a \Rightarrow b](https://www.vypocitejto.cz/zaklady-matematiky/vyroky/obr/vyr-4.svg) a obrácené implikace ![b \Rightarrow a](https://www.vypocitejto.cz/zaklady-matematiky/vyroky/obr/vyr-8.svg):
	- ![(a \Rightarrow b)^(b \Rightarrow a)](https://www.vypocitejto.cz/zaklady-matematiky/vyroky/obr/vyr-9.svg)
- Tedy: „z a plyne b a zároveň z b plyne a“. Zápis ![a \Leftrightarrow b](https://www.vypocitejto.cz/zaklady-matematiky/vyroky/obr/vyr-5.svg) čteme „a je ekvivalentní s b,“ případně „a platí právě tehdy, když platí .“.

|  a  |  b  | ![a \Rightarrow b](https://www.vypocitejto.cz/zaklady-matematiky/vyroky/obr/vyr-4.svg) | ![b \Rightarrow a](https://www.vypocitejto.cz/zaklady-matematiky/vyroky/obr/vyr-8.svg) | ![(a \Rightarrow b)^(b \Rightarrow a)](https://www.vypocitejto.cz/zaklady-matematiky/vyroky/obr/vyr-9.svg)  <br>neboli:  <br>![a \Leftrightarrow b](https://www.vypocitejto.cz/zaklady-matematiky/vyroky/obr/vyr-5.svg) |
| :-: | :-: | :------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|  1  |  1  |                                           1                                            |                                           1                                            |                                                                                                            1                                                                                                            |
|  1  |  0  |                                           0                                            |                                           1                                            |                                                                                                            0                                                                                                            |
|  0  |  1  |                                           1                                            |                                           0                                            |                                                                                                            0                                                                                                            |
|  0  |  0  |                                           1                                            |                                           1                                            |                                                                                                            1                                                                                                            |

## Kvantifikované výroky
- Pro vymezení prvků, kterých se vlastnost týká, se užívají kvantifikátory:

|                                              symbol                                              |             název             |                                    význam                                    |     |
| :----------------------------------------------------------------------------------------------: | :---------------------------: | :--------------------------------------------------------------------------: | --- |
|   ![Obecný kvantifikátor](https://www.vypocitejto.cz/zaklady-matematiky/vyroky/obr/vyr-11.svg)   |   obecný  <br>kvantifikátor   |                vlastnost platí pro všechny prvky („každý...“)                |     |
| ![Existenční kvantifikátor](https://www.vypocitejto.cz/zaklady-matematiky/vyroky/obr/vyr-12.svg) | existenční  <br>kvantifikátor | existuje alespoň jeden prvek, pro který vlastnost platí („alespoň jeden...“) |     |
![\forall n \in N;\ n > 0](https://www.vypocitejto.cz/zaklady-matematiky/vyroky/obr/vyr-13.svg)
Zápis výše znamená: „Každé n náležející do oboru přirozených čísel (značka: N) je větší než nula,“ tedy jednodušeji řešeno: „Každé přirozené číslo je kladné.“ Jedná se tedy o pravdivý výrok.

![\exists n \in N;\ n > 0](https://www.vypocitejto.cz/zaklady-matematiky/vyroky/obr/vyr-14.svg)
Druhý zápis znamená: „Existuje alespoň jedno n náležející do oboru přirozených čísel větší než nula,“ tedy jednodušeji řešeno: „Alespoň jedno přirozené číslo je kladné.“ Jedná se tedy rovněž o pravdivý výrok.

####  Kvantifikované výroky a jejich negace

|         a          |                      ¬a                       |
| :----------------: | :-------------------------------------------: |
|   Každý... je...   |           Alespoň jeden... není...            |
|  Žádný... není...  |            Alespoň jeden... je...             |
| Alespoň k... je... |           Nejvýše (k – 1)... je...            |
| Nejvýše k... je... |           Alespoň (k + 1)... je...            |
|  Právě k... je...  | Nejvýše (k – 1) nebo alespoň (k + 1)... je... |
