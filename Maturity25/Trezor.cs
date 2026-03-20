using System;
using System.Collections.Generic;
using System.Text;

namespace Maturity
{
    delegate void Del1();
    

    class Trezor:Skrin
    {
        public event Del1 Utok;
        private string heslo;
        private bool odemceno;

        public Trezor(string heslo): base(int vyska, int sirka, int hloubka)
        {
            this.odemceno = false;
            this.heslo = heslo;
        }

        public bool Odemceno
        {
            get { return odemceno; }
        }

        public void Odemkni(string h)
        {
            if (h == heslo)
            {
                odemceno = true;
            }
            else Utok();
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            Trezor Kovomat1236 = new Trezor("letadlo",2,4,3);
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

