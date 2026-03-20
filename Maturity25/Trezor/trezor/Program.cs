using System;
using System.Collections.Generic;
using System.Text;

namespace Maturity
{
     
    class Program
    {
        static void Main(string[] args)
        {
        	Trezor Kovomat1236 = new Trezor("Heslo1234");
            Kovomat1236.Utok += new Del1(Poplach);
            Kovomat1236.Utok += new Del1(VolejPolicii);
          
            string hsl = null;
            do
            {
                Console.Write("Zadej heslo pro otevření trezoru:");
                hsl = Console.ReadLine();
                Kovomat1236.Odemkni(hsl);
            }
            while (!Kovomat1236.Odemceno);
           
            if (Kovomat1236.Odemceno)
            {
                Console.WriteLine("Trezor je odemčen");
            }
            else
            {
                Console.WriteLine("Trezor je zamčen");
            }
            Console.WriteLine("Objem trezoru je:"+Kovomat1236.Objem());
            Console.ReadKey();
        }


        static void VolejPolicii()
        {
            Console.WriteLine("Volam Policii");
        }

        static void Poplach()
        {
            Console.WriteLine("Poplach");
            Console.Beep(440, 5000);
            
        }
    }
}

