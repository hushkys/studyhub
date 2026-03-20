

public class Vektor
{
    Bod bod1;
    Bod bod2;
    
    public Vektor(Bod bod1, Bod bod2)
    {
        this.bod1 = bod1;
        this.bod2 = bod2;
    }
    
    public Bod getVektor()
    {
         Bod u = new Bod(this.bod2.getX()-this.bod1.getX(),this.bod2.getY()-this.bod1.getY());
         return u;
    }
}
