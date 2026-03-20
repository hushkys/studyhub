/* UTF-8 codepage: Příliš žluťoučký kůň úpěl ďábelské ódy. ÷ × ¤
 * «Stereotype», Section mark-§, Copyright-©, Alpha-α, Beta-β, Smile-☺
 */




/*******************************************************************************
 * Třída {@code Testy} je hlavní třídou projektu,
 * který ...
 *
 * @author  author name
 * @version 0.00.0000 — 20yy-mm-dd
 */
public class Testy
{
    /***************************************************************************
     * Metoda, prostřednictvím níž se spouští celá aplikace.
     *
     * @param args Parametry příkazového řádku
     */
    public static void main(String[] args)
    {
        IPohyb trojuhelnik = new Trojúhelník();
        IPohyb obdelnik = new Obdélník();
        IPohyb elipsa = new Elipsa();
        IPohyb[] poleTvaru = new IPohyb[3];
        poleTvaru[0] = trojuhelnik;
        poleTvaru[1] = obdelnik;
        poleTvaru[2] = elipsa;
    }
}
