
using System;

namespace Maturity
{
	/// <summary>
	/// Description of Skrin.
	/// </summary>
	class Skrin
    {
        protected int vyska;
        protected int sirka;
        protected int hloubka;

        public Skrin(int vyska, int sirka, int hloubka)
        {
            this.vyska = vyska;
            this.sirka = sirka;
            this.hloubka = hloubka;
        }

        public int Vyska
        {
            get { return vyska;}
        }

        public int Sirka
        {
            get { return sirka; }
        }

        public int Hloubka
        {
            get { return hloubka; }
        }

        public int Objem()
        {
            return this.vyska * this.sirka * this.hloubka;
        }
    }
}
