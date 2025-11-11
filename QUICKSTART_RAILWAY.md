# 🚀 Quick Start: docbitch auf Railway deployen

Eine super schnelle Anleitung, um docbitch in unter 10 Minuten auf Railway zu deployen!

## ⚡ In 5 Schritten live

### 1️⃣ Railway Account (1 Minute)

1. Gehe zu [railway.app](https://railway.app)
2. "Start a New Project" → Login mit GitHub
3. Fertig! ✅

### 2️⃣ Backend deployen (2 Minuten)

1. **New Project** → **Deploy from GitHub repo**
2. Wähle dein **docbitch** Repository
3. Railway erkennt automatisch Node.js
4. Warte auf den Build (1-2 Minuten) ⏳

### 3️⃣ MySQL Datenbank (1 Minute)

1. In deinem Projekt: **+ New** → **Database** → **Add MySQL**
2. Railway erstellt automatisch die Datenbank
3. Verbindungsdaten werden automatisch verknüpft! 🔗

### 4️⃣ Datenbank-Schema laden (2 Minuten)

**Option A: Via Railway Dashboard**
1. Klicke auf die MySQL-Datenbank
2. Tab **"Data"** → **"Query"**
3. Öffne `database/schema.sql` lokal
4. Kopiere den gesamten Inhalt und füge ihn ein
5. **Execute** ✅

**Option B: Via MySQL Client** (wenn installiert)
```bash
# Hole Credentials aus Railway Dashboard
mysql -h containers-us-west-xxx.railway.app \
      -u root \
      -p<PASSWORD> \
      railway < database/schema.sql
```

### 5️⃣ Environment Variables (2 Minuten)

1. Klicke auf deinen Backend-Service
2. **Variables** Tab
3. Füge hinzu:

```
PORT=3001
NODE_ENV=production
UPLOAD_DIR=/tmp/uploads
MAX_FILE_SIZE=52428800
CORS_ORIGIN=*
```

**Das war's!** 🎉 Railway verbindet automatisch die MySQL-Variablen.

### 🌐 Deine App ist live!

1. Im Backend-Service → **Settings** → **Networking**
2. Klicke **Generate Domain**
3. Du bekommst eine URL wie: `https://docbitch-production.up.railway.app`

### ✅ Test deine API

Öffne im Browser:
```
https://DEINE-URL.up.railway.app/api/health
```

Du solltest sehen:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 🎨 Frontend deployen (Optional - für separate Deployment)

### Option 1: Frontend auch auf Railway

1. **+ New** → **GitHub Repo** → docbitch
2. **Settings**:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx serve -s dist -p $PORT`
3. **Variables**:
   ```
   VITE_API_URL=https://DEIN-BACKEND.up.railway.app/api
   ```

### Option 2: Frontend auf Vercel (Empfohlen! ⚡)

1. Gehe zu [vercel.com](https://vercel.com)
2. **New Project** → Import dein Repository
3. **Configure**:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variable**:
   ```
   VITE_API_URL=https://DEIN-BACKEND.up.railway.app/api
   ```
5. **Deploy** 🚀

### 🔗 CORS aktualisieren

Zurück zu Railway → Backend → Variables:
```
CORS_ORIGIN=https://dein-frontend.vercel.app
```

## 🧪 Quick Tests

### Test 1: API Health Check
```bash
curl https://DEINE-URL.up.railway.app/api/health
```

### Test 2: Ordner abrufen
```bash
curl https://DEINE-URL.up.railway.app/api/folders
```

### Test 3: Dokumente abrufen
```bash
curl https://DEINE-URL.up.railway.app/api/documents
```

## 🐛 Schnelle Problemlösung

### Backend startet nicht?
1. **Logs checken**: Railway Dashboard → Dein Service → **Deployments** → **View Logs**
2. Suche nach Fehlern

### Datenbank-Verbindung fehlgeschlagen?
```bash
# In Railway Logs schauen nach:
"✗ Database connection failed"

# Lösung: Überprüfe ob MySQL-Service läuft
```

### 502 Bad Gateway?
- Backend ist noch nicht fertig gestartet
- Warte 30 Sekunden und versuche es erneut

### CORS Error im Frontend?
```
# Update CORS_ORIGIN in Railway Variables
CORS_ORIGIN=https://deine-frontend-domain.com
```

## 💾 Wichtige Hinweise

### ⚠️ Datei-Uploads auf Railway
Railway verwendet **ephemere Dateisysteme**. Uploads werden bei jedem Deployment gelöscht!

**Für Testing OK** ✅
**Für Production**: Verwende Cloud Storage (AWS S3, Cloudinary, etc.)

**Temporäre Lösung** (wenn UPLOAD_DIR=/tmp/uploads):
- Uploads bleiben bis zum nächsten Deployment
- Gut für Testing und Entwicklung

### 💰 Kosten

**Starter/Hobby**:
- $5 Gratis-Credit/Monat
- Perfekt für Testing
- MySQL inklusive

**Developer** ($20/Monat):
- Mehr Ressourcen
- Custom Domains

### 🔄 Automatische Deployments

**Jeder Git Push deployed automatisch!**

```bash
git add .
git commit -m "Update feature"
git push

# Railway deployed in 1-2 Minuten automatisch! 🚀
```

## 📊 Monitoring

### Logs anzeigen
```bash
# Railway CLI installieren
npm i -g @railway/cli

# Login und verknüpfen
railway login
railway link

# Logs live anzeigen
railway logs
```

### Im Dashboard
- CPU Usage
- Memory Usage
- Deploy History
- Error Logs

## ✨ Pro Tips

1. **Branch-basierte Deployments**: Railway kann automatisch Preview-Deployments für PRs erstellen!
2. **Environment per Branch**: Unterschiedliche Configs für `main` und `development`
3. **Rollback**: Ein-Klick-Rollback zu vorherigen Deployments
4. **Secrets**: Nutze Railway Variables für sensible Daten

## 🔜 Nächste Schritte

Nach erfolgreichem Railway-Deployment:

1. ✅ Features testen und entwickeln
2. ✅ Feedback von Benutzern einholen
3. ✅ Performance optimieren
4. ✅ Weitere Features hinzufügen
5. ➡️ **Dann**: Migration zu deinem VPS mit `DEPLOYMENT.md`

## 📚 Weiterführende Docs

- [Vollständige Railway-Anleitung](RAILWAY.md) - Detaillierte Erklärungen
- [VPS Deployment](DEPLOYMENT.md) - Für finales Production-Deployment
- [README](README.md) - Vollständige Projekt-Dokumentation

## 🆘 Hilfe benötigt?

1. Überprüfe die [Railway Docs](https://docs.railway.app)
2. Schau in die [Railway Logs](https://railway.app/dashboard)
3. [Railway Discord](https://discord.gg/railway)
4. Erstelle ein Issue im Repository

---

**Happy Deploying! 🎉🚀**
