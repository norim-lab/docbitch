# Deployment auf Linux VPS mit Hestia und MariaDB

Diese Anleitung beschreibt die Installation von docbitch auf einem Linux VPS mit Hestia Control Panel und MariaDB.

## Voraussetzungen

- Linux VPS mit Ubuntu/Debian
- Hestia Control Panel installiert
- Root- oder Sudo-Zugriff
- Domain oder Subdomain konfiguriert
- Node.js und npm installiert
- MariaDB läuft

## 1. Server-Vorbereitung

### Node.js installieren (falls nicht vorhanden)

```bash
# NodeSource Repository hinzufügen (Node.js 18.x)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Node.js installieren
sudo apt-get install -y nodejs

# Version überprüfen
node --version
npm --version
```

### PM2 installieren (Process Manager)

```bash
sudo npm install -g pm2
```

## 2. MariaDB Datenbank einrichten

### Via Hestia Control Panel

1. Loggen Sie sich in Hestia ein
2. Gehen Sie zu "Databases"
3. Erstellen Sie eine neue Datenbank:
   - Name: `docbitch_db`
   - User: `docbitch_user`
   - Passwort: Sicheres Passwort generieren

### Via Kommandozeile

```bash
# Als root in MariaDB einloggen
mysql -u root -p

# Datenbank erstellen
CREATE DATABASE docbitch_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Benutzer erstellen
CREATE USER 'docbitch_user'@'localhost' IDENTIFIED BY 'IHR_SICHERES_PASSWORT';
GRANT ALL PRIVILEGES ON docbitch_db.* TO 'docbitch_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Datenbank-Schema importieren

```bash
mysql -u docbitch_user -p docbitch_db < database/schema.sql
```

## 3. Anwendung auf den Server hochladen

### Via Git (empfohlen)

```bash
# In das Web-Verzeichnis Ihrer Domain wechseln
cd /home/username/web/domain.com/

# Repository klonen
git clone <repository-url> docbitch
cd docbitch
```

### Via SFTP

- Laden Sie alle Dateien in `/home/username/web/domain.com/docbitch/` hoch

## 4. Backend konfigurieren

```bash
cd backend

# Dependencies installieren
npm install --production

# .env Datei erstellen
cp .env.example .env
nano .env
```

### .env Konfiguration für Production:

```env
# Server Configuration
PORT=3001
NODE_ENV=production

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=docbitch_user
DB_PASSWORD=IHR_DATENBANK_PASSWORT
DB_NAME=docbitch_db

# File Upload Configuration
UPLOAD_DIR=/home/username/web/domain.com/docbitch/backend/uploads
MAX_FILE_SIZE=52428800

# CORS Configuration
CORS_ORIGIN=https://domain.com
```

### Uploads-Verzeichnis erstellen

```bash
mkdir -p uploads
chmod 755 uploads
```

## 5. Frontend bauen

```bash
cd ../frontend

# Dependencies installieren
npm install

# Production Build erstellen
npm run build

# Build-Output in dist/ Verzeichnis
```

## 6. Backend mit PM2 starten

```bash
cd ../backend

# Anwendung mit PM2 starten
pm2 start src/server.js --name docbitch-backend

# PM2 beim Systemstart automatisch starten
pm2 startup
pm2 save

# Status überprüfen
pm2 status
pm2 logs docbitch-backend
```

## 7. Nginx Konfiguration (via Hestia)

### Option A: Mit Hestia Web-Interface

1. Gehen Sie zu "Web" → Ihre Domain
2. Klicken Sie auf "Edit"
3. Fügen Sie unter "Proxy Support" hinzu:

### Option B: Manuelle Nginx-Konfiguration

Erstellen Sie `/home/username/conf/web/domain.com/nginx.conf_docbitch`:

```nginx
location /api {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}

location /uploads {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}

location / {
    root /home/username/web/domain.com/docbitch/frontend/dist;
    try_files $uri $uri/ /index.html;
}
```

### Nginx neu laden

```bash
sudo systemctl reload nginx
```

## 8. SSL-Zertifikat einrichten

### Via Hestia (Let's Encrypt)

1. In Hestia zu "Web" → Ihre Domain
2. Klicken Sie auf "SSL" Tab
3. Aktivieren Sie "Let's Encrypt Support"
4. Klicken Sie "Save"

### Via Certbot (Kommandozeile)

```bash
sudo certbot --nginx -d domain.com -d www.domain.com
```

## 9. Firewall konfigurieren

```bash
# Port 3001 nur für localhost öffnen (Backend läuft lokal)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

## 10. Wartung und Monitoring

### PM2 Befehle

```bash
# Status anzeigen
pm2 status

# Logs anzeigen
pm2 logs docbitch-backend

# Anwendung neustarten
pm2 restart docbitch-backend

# Anwendung stoppen
pm2 stop docbitch-backend

# Anwendung aus PM2 entfernen
pm2 delete docbitch-backend
```

### Logs überwachen

```bash
# Backend-Logs
pm2 logs docbitch-backend --lines 100

# Nginx-Logs
tail -f /var/log/nginx/domain.com.error.log
tail -f /var/log/nginx/domain.com.access.log
```

### Datenbank-Backup

```bash
# Backup erstellen
mysqldump -u docbitch_user -p docbitch_db > backup_$(date +%Y%m%d).sql

# Backup wiederherstellen
mysql -u docbitch_user -p docbitch_db < backup_20240101.sql
```

### Cronjob für automatische Backups

```bash
# Crontab bearbeiten
crontab -e

# Täglich um 2 Uhr Backup erstellen
0 2 * * * mysqldump -u docbitch_user -pPASSWORT docbitch_db > /home/username/backups/docbitch_$(date +\%Y\%m\%d).sql
```

## 11. Updates deployen

```bash
cd /home/username/web/domain.com/docbitch

# Code aktualisieren
git pull

# Backend
cd backend
npm install --production
pm2 restart docbitch-backend

# Frontend
cd ../frontend
npm install
npm run build

# Nginx neu laden
sudo systemctl reload nginx
```

## Troubleshooting

### Backend startet nicht

```bash
# Logs überprüfen
pm2 logs docbitch-backend

# Datenbank-Verbindung testen
mysql -u docbitch_user -p docbitch_db
```

### Upload funktioniert nicht

```bash
# Berechtigungen prüfen
ls -la backend/uploads/
chmod 755 backend/uploads/

# Dateigrößenlimit in Nginx erhöhen
# In /etc/nginx/nginx.conf:
client_max_body_size 50M;
```

### 502 Bad Gateway

```bash
# Backend-Status prüfen
pm2 status

# Port prüfen
netstat -tulpn | grep 3001

# Backend neu starten
pm2 restart docbitch-backend
```

## Sicherheitsempfehlungen

1. **Starke Passwörter** für Datenbank verwenden
2. **Firewall** korrekt konfigurieren
3. **SSL/TLS** aktivieren (Let's Encrypt)
4. **Regelmäßige Updates** von System und Dependencies
5. **Backup-Strategie** implementieren
6. **Monitoring** einrichten (z.B. mit PM2 oder Uptime Kuma)
7. **Dateigrößen-Limits** anpassen
8. **Rate Limiting** für API einrichten (z.B. mit nginx)

## Performance-Optimierung

1. **Gzip-Kompression** in Nginx aktivieren
2. **Static-File-Caching** konfigurieren
3. **MariaDB-Query-Cache** optimieren
4. **PM2-Cluster-Modus** für mehrere CPU-Kerne nutzen

```bash
# Cluster-Modus mit PM2
pm2 start src/server.js -i max --name docbitch-backend
```

## Support

Bei Problemen:
1. Überprüfen Sie die Logs (`pm2 logs`)
2. Prüfen Sie die Nginx-Konfiguration
3. Testen Sie die Datenbank-Verbindung
4. Überprüfen Sie Dateiberechtigungen

Für weitere Hilfe erstellen Sie ein Issue im Repository.
