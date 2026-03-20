

public class ServantPohybuj
{
    public ServantPohybuj()
    {
        
    }
    
    public void presunVpravo(IPohyb obrazec, int x)
    {
        for (int i=0;i<x;i++)
        {
           obrazec.posunVpravo(1);
           IO.čekej(100);
        }
    }
    public void pohybNa(IPohyb objekt, int x, int y)
    { 
       objekt.setPozice(x, y); 
    }
    
    public void pohybO(IPohyb objekt, int x, int y)
    {
       objekt.posunDolů(y); 
       objekt.posunVpravo(x);
    }
}
