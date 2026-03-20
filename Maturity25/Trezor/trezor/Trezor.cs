
using System;

namespace Maturity
{
	delegate void Del1();
	
	class Trezor:Skrin
    {
        public event Del1 Utok;
        private string heslo;
        private bool odemceno;

        public Trezor(): base(5, 3, 2)
        {
            this.odemceno = false;
            this.heslo = "letadlo";
        }
		
        public Trezor(string heslo): base(5, 3, 2)
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
}
