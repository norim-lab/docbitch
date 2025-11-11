# Railway Deployment für docbitch

Diese Anleitung beschreibt das Deployment von docbitch auf Railway.app für Testing und Entwicklung vor dem finalen Deployment auf Ihrem VPS.

## Vorteile von Railway

- ✅ Schnelles Deployment mit GitHub-Integration
- ✅ Automatische CI/CD Pipeline
- ✅ Kostenlose MySQL-Datenbank inklusive
- ✅ Automatisches HTTPS
- ✅ Environment Variables Management
- ✅ Logs und Monitoring
- ✅ Easy Rollbacks

## Schritt-für-Schritt Anleitung

### 1. Railway Account erstellen

1. Gehen Sie zu [railway.app](https://railway.app)
2. Klicken Sie auf "Start a New Project"
3. Authentifizieren Sie sich mit GitHub

### 2. Neues Projekt erstellen

1. Klicken Sie auf "New Project"
2. Wählen Sie "Deploy from GitHub repo"
3. Wählen Sie Ihr `docbitch` Repository
4. Railway erkennt automatisch Node.js und startet das Deployment

### 3. MySQL Datenbank hinzufügen

1. Klicken Sie in Ihrem Railway-Projekt auf "+ New"
2. Wählen Sie "Database" → "Add MySQL"
3. Railway erstellt automatisch eine MySQL-Instanz
4. Die Verbindungsdaten werden automatisch als Environment Variables bereitgestellt:
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`

### 4. Datenbank-Schema importieren

#### Option A: Via Railway Dashboard

1. Klicken Sie auf Ihre MySQL-Datenbank
2. Gehen Sie zum "Data" Tab
3. Klicken Sie auf "Query"
4. Kopieren Sie den Inhalt von `database/schema.sql` und führen Sie ihn aus

#### Option B: Via MySQL Client

1. Holen Sie sich die Verbindungsdaten aus dem Railway Dashboard
2. Verbinden Sie sich lokal:

```bash
mysql -h <MYSQLHOST> -P <MYSQLPORT> -u <MYSQLUSER> -p<MYSQLPASSWORD> <MYSQLDATABASE> < database/schema.sql
```

### 5. Environment Variables konfigurieren

Gehen Sie zu Ihrem Railway-Projekt → Backend Service → Variables und fügen Sie hinzu:

```env
# Server Configuration
PORT=3001
NODE_ENV=production

# Diese werden automatisch von Railway bereitgestellt:
# MYSQLHOST
# MYSQLPORT
# MYSQLUSER
# MYSQLPASSWORD
# MYSQLDATABASE

# Oder manuell setzen:
DB_HOST=${{MYSQLHOST}}
DB_PORT=${{MYSQLPORT}}
DB_USER=${{MYSQLUSER}}
DB_PASSWORD=${{MYSQLPASSWORD}}
DB_NAME=${{MYSQLDATABASE}}

# File Upload Configuration
UPLOAD_DIR=/tmp/uploads
MAX_FILE_SIZE=52428800
ALLOWED_FILE_TYPES=.pdf,.jpg,.jpeg,.png,.gif,.txt,.doc,.docx

# CORS - wird nach Frontend-Deployment aktualisiert
CORS_ORIGIN=*
```

**Wichtig:** Railway stellt automatisch die MySQL-Variablen bereit, Sie müssen nur die Mapping-Variablen (`DB_HOST`, etc.) hinzufügen.

### 6. Frontend als separaten Service deployen

#### Option A: Frontend auf Railway deployen

1. Klicken Sie auf "+ New" in Ihrem Projekt
2. Wählen Sie "GitHub Repo" → Ihr docbitch Repository
3. Unter "Settings" → "Build Command":
   ```bash
   cd frontend && npm install && npm run build
   ```
4. Under "Start Command":
   ```bash
   npx serve -s frontend/dist -p $PORT
   ```
5. Fügen Sie serve zu den Dependencies hinzu:
   ```bash
   npm install -g serve
   ```

#### Option B: Frontend auf Vercel/Netlify (empfohlen)

Railway ist besser für Backend, für Frontend empfehle ich Vercel:

1. Gehen Sie zu [vercel.com](https://vercel.com)
2. "Import Project" → Ihr GitHub Repo
3. Framework: Vite
4. Root Directory: `frontend`
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Environment Variable hinzufügen:
   ```
   VITE_API_URL=https://ihr-railway-backend.up.railway.app
   ```

### 7. Backend CORS aktualisieren

Nachdem das Frontend deployed ist, aktualisieren Sie die CORS-Konfiguration:

1. Gehen Sie zu Railway → Backend Service → Variables
2. Aktualisieren Sie `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=https://ihr-frontend.vercel.app
   ```
3. Oder für mehrere Origins:
   ```
   CORS_ORIGIN=https://ihr-frontend.vercel.app,https://docbitch.railway.app
   ```

### 8. Frontend API-URL konfigurieren

Aktualisieren Sie `frontend/src/services/api.ts` für Railway:

```typescript
const API_URL = import.meta.env.VITE_API_URL ||
                (import.meta.env.MODE === 'production'
                  ? 'https://ihr-backend.up.railway.app'
                  : 'http://localhost:3001');

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 9. Custom Domain einrichten (optional)

1. Gehen Sie zu Service Settings → Networking
2. Klicken Sie auf "Generate Domain" für eine Railway-Subdomain
3. Oder fügen Sie eine Custom Domain hinzu

## Deployment-Architekturen

### Option 1: Alles auf Railway (Einfacher)

```
┌─────────────────────────────────────┐
│         Railway Project              │
├─────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐        │
│  │ Backend  │  │  MySQL   │        │
│  │ Node.js  │──│ Database │        │
│  └──────────┘  └──────────┘        │
│       │                              │
│  ┌──────────┐                       │
│  │ Frontend │                       │
│  │  Static  │                       │
│  └──────────┘                       │
└─────────────────────────────────────┘
```

### Option 2: Backend auf Railway, Frontend auf Vercel (Empfohlen)

```
┌─────────────────┐      ┌──────────────────┐
│     Vercel      │      │     Railway      │
│   ┌──────────┐  │      │  ┌──────────┐    │
│   │ Frontend │  │──────│→ │ Backend  │    │
│   │  React   │  │ API  │  │ Node.js  │    │
│   └──────────┘  │      │  └────┬─────┘    │
└─────────────────┘      │       │          │
                         │  ┌────▼─────┐    │
                         │  │  MySQL   │    │
                         │  │ Database │    │
                         │  └──────────┘    │
                         └──────────────────┘
```

## Monitoring und Logs

### Logs anzeigen

1. Railway Dashboard → Ihr Service
2. Klicken Sie auf "Deployments"
3. Wählen Sie ein Deployment
4. Klicken Sie auf "View Logs"

### Metrics

Railway zeigt automatisch:
- CPU Usage
- Memory Usage
- Network Traffic
- Response Times

## Troubleshooting

### Deployment schlägt fehl

```bash
# Lokale Build testen
cd backend
npm install
npm start
```

### Datenbankverbindung fehlgeschlagen

1. Überprüfen Sie die Environment Variables
2. Stellen Sie sicher, dass MySQL-Service läuft
3. Prüfen Sie die Logs auf Verbindungsfehler

### Upload funktioniert nicht

Railway verwendet ephemere Dateisysteme. Uploads gehen nach Neustart verloren.

**Lösung**: Verwenden Sie Cloud Storage (S3, Cloudinary, etc.)

```bash
# Temporäre Lösung für Testing
UPLOAD_DIR=/tmp/uploads
```

**Produktions-Lösung** (für späteren VPS):
- AWS S3
- Cloudflare R2
- Oder lokaler Storage auf VPS

### CORS Fehler

1. Überprüfen Sie `CORS_ORIGIN` Environment Variable
2. Stellen Sie sicher, dass die Frontend-URL korrekt ist
3. Fügen Sie `https://` am Anfang hinzu

## Kosten

### Hobby Plan (Kostenlos)
- $5 Gratis-Credit pro Monat
- Ausreichend für Testing
- Inkludiert MySQL-Datenbank

### Developer Plan ($20/Monat)
- Mehr Ressourcen
- Custom Domains
- Mehr Datenbank-Storage

## Updates deployen

Railway deployed automatisch bei jedem Push zu Ihrem GitHub Repository!

```bash
# Änderungen committen
git add .
git commit -m "Update feature"
git push

# Railway deployed automatisch innerhalb von 1-2 Minuten
```

## Migration zu VPS vorbereiten

Wenn Sie bereit sind für VPS:

1. **Datenbank exportieren**:
   ```bash
   mysqldump -h <RAILWAY_MYSQL_HOST> -u <USER> -p <DATABASE> > railway_backup.sql
   ```

2. **Auf VPS importieren**:
   ```bash
   mysql -u docbitch_user -p docbitch_db < railway_backup.sql
   ```

3. Folgen Sie dann `DEPLOYMENT.md` für VPS-Installation

## Nützliche Railway CLI Commands

```bash
# Railway CLI installieren
npm i -g @railway/cli

# Login
railway login

# Projekt verknüpfen
railway link

# Logs anzeigen
railway logs

# Variables anzeigen
railway variables

# Shell in Service öffnen
railway run
```

## Backup-Strategie

Während der Entwicklung auf Railway:

1. **Automatische Backups**: Railway macht automatisch Snapshots
2. **Manuelle Backups**: Exportieren Sie regelmäßig die Datenbank
3. **Git**: Alle Code-Änderungen sind in Git versioniert

## Support und Ressourcen

- [Railway Dokumentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [Railway Status](https://status.railway.app)

## Nächste Schritte

Nach erfolgreichem Testing auf Railway:

1. ✅ Anwendung testen
2. ✅ Features entwickeln und testen
3. ✅ Performance optimieren
4. ✅ Feedback sammeln
5. ➡️ Migration zu VPS mit `DEPLOYMENT.md`

Bei Fragen oder Problemen, überprüfen Sie die Railway-Logs oder erstellen Sie ein Issue im Repository.
