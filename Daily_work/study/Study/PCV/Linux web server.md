**Instalace Linuxu**
- ve virtual boxu vytvořte nový
- vložte iso-file ubuntu (verze)
- pojmenujte soubor, nastavte si velikost a jméno s heslem.
- při zapnutí přepněte v nastavení na ==Sítový most==

**Step 1: Install LAMP Stack**
- Po dokončení instalace začneme příkazy
	 `sudo apt update`
	 `sudo apt upgrade -y`

- Instalace Apache
	 `sudo apt install apache2 -y`

- Instalace MySQL
	 `sudo apt install mysql-server -y`

- Instalace PHP a požadovaných rozšíření: 
	 `sudo apt install php libapache2-mod-php php-mysql php-curl php-gd php-mbstring php-xml php-xmlrpc php-soap php-intl php-zip -y` 

**Step 2: Configure MySQL for WordPress** 

- Přihlašte se do MySQL: 
	`sudo mysql -u root -p` 

- Vytvořte databázi a uživatele pro wordpress: 
	`CREATE DATABASE **wordpress** DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;` 
	
	`CREATE USER '**wordpressuser'@'localhost**' IDENTIFIED BY '**password**';` 
	
	`GRANT ALL PRIVILEGES ON wordpress.* TO '**wordpressuser'@'localhost**';` 
	
	`FLUSH PRIVILEGES;` 

	`EXIT;` 

**Step 3: Download and Configure WordPress** 

- Nainstalujte wordpress
	`cd /tmp` 
	`curl -O https://wordpress.org/latest.tar.gz` 
	`tar xzvf latest.tar.gz` 

- přemístěte složky do webu: 
	`sudo cp -a /tmp/wordpress/. /var/www/html/wordpress` 

Nastavení oprávnění: 
	`sudo chown -R www-data:www-data /var/www/html/wordpress` 
	`find /var/www/html/wordpress/ -type d -exec chmod 750 {} \;` 
	`sudo find /var/www/html/wordpress/ -type f -exec chmod 640 {} \;` 

**Step 4: Configure Apache** 

- vytvořte novou host-složku 
	`sudo nano /etc/apache2/sites-available/wordpress.conf` 

přidejte následující konfigurace: 

==<VirtualHost *;80>== 
==ServerAdmin [admin@example.com](mailto:admin@example.com "mailto:admin@example.com")== 
==DocumentRoot /var/www/html/wordpress== 
==ServerName example.com== 

==<Directory /var/www/html/wordpress/>== 
==AllowOverride All== 
==</Directory>== 

==ErrorLog ${APACHE_LOG_DIR}/error.log== 
==CustomLog ${APACHE_LOG_DIR}/access.log combined== 
==</VirtualHost>== 

- povolte konfigurační a rewrite modul: 
	`sudo a2ensite wordpress.conf` 
	`sudo a2enmod rewrite` 
	`sudo systemctl restart apache2`

## Připojení k serveru
- po dokončení Přepněte na se na ==Vnitřní síť== a restartujte virtualku
- po restartu napište příkaz:
	`ip a`
- a pokud vaše DHCP je správně nastavené mělo by vám to nastavit adresu. V našem případě by jste viděli (192.168.0.152)
- poté už jenom zadejte do vyhledávače na serveru/klientovi
	- 192.168.0.152/wordpress
- pokud vše funguje můžete se přihlásit do wordpresu
