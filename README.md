# docbitch - Dokumentenverwaltungs-Webapp

Eine moderne, responsive Webanwendung zur Verwaltung und Organisation von Dokumenten (PDF, Bilder, Word, Text) für PC, Tablet und Mobilgeräte.

## 🚀 Quick Start

**Neu?** Starte in unter 10 Minuten mit Railway!

👉 **[Quick Start Guide für Railway](QUICKSTART_RAILWAY.md)** - Deploy in 5 Schritten

oder

📖 **Lokale Entwicklung?** Siehe [Installation & Entwicklung](#installation--entwicklung) unten

## Features

- 📁 **Ordnerverwaltung**: Organisieren Sie Ihre Dokumente in Ordnern
- 🏷️ **Tags**: Kennzeichnen Sie Dokumente mit Tags für bessere Auffindbarkeit
- 🔍 **Suche**: Schnelle Volltextsuche durch alle Dokumente
- 📤 **Drag & Drop Upload**: Einfaches Hochladen per Drag & Drop
- 👁️ **Vorschau**: Direkte Vorschau für PDF, Bilder und Textdateien
- 📱 **Responsive Design**: Optimiert für Desktop, Tablet und Smartphone
- 💾 **MariaDB**: Robuste Datenbankverwaltung

## Technologie-Stack

### Backend
- Node.js mit Express
- MariaDB Datenbank
- Multer für Datei-Uploads
- RESTful API

### Frontend
- React mit TypeScript
- Tailwind CSS für Styling
- Vite als Build-Tool
- Axios für API-Kommunikation

## Voraussetzungen

- Node.js (v18 oder höher)
- MariaDB (v10.5 oder höher)
- npm oder yarn

## Installation & Entwicklung

### 1. Repository klonen

```bash
git clone <repository-url>
cd docbitch
```

### 2. Datenbank einrichten

```bash
# Mit MariaDB verbinden
mysql -u root -p

# Datenbank und Schema erstellen
source database/schema.sql

# Benutzer erstellen (Passwort anpassen!)
CREATE USER IF NOT EXISTS 'docbitch_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON docbitch_db.* TO 'docbitch_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Backend konfigurieren

```bash
cd backend
cp .env.example .env
# .env bearbeiten und Datenbank-Zugangsdaten eintragen
npm install
```

### 4. Frontend installieren

```bash
cd ../frontend
npm install
```

### 5. Anwendung starten

#### Entwicklungsmodus (beide Server gleichzeitig)

```bash
# Im Root-Verzeichnis
npm run install:all  # Alle Dependencies installieren
npm run dev          # Startet Backend (Port 3001) und Frontend (Port 5173)
```

#### Oder separat starten

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Die Anwendung ist dann erreichbar unter:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api

## Production Build

### Frontend bauen

```bash
cd frontend
npm run build
# Build-Output in frontend/dist/
```

### Backend für Production

```bash
cd backend
NODE_ENV=production npm start
```

## Deployment-Optionen

### 🚀 Railway (Empfohlen für Testing)
- **[Quick Start (5 Minuten)](QUICKSTART_RAILWAY.md)** - Schnellstart-Anleitung
- **[Vollständige Railway-Anleitung](RAILWAY.md)** - Detaillierte Dokumentation

### 🖥️ VPS mit Hestia (Production)
- **[VPS Deployment-Guide](DEPLOYMENT.md)** - Detaillierte Anweisungen für Linux VPS mit Hestia Control Panel und MariaDB

**Empfohlener Workflow:**
1. Entwickeln und testen Sie auf Railway
2. Wenn bereit, migrieren Sie zu Ihrem VPS für Production

## API Endpunkte

### Dokumente
- `GET /api/documents` - Alle Dokumente abrufen (mit optionalen Filtern)
- `GET /api/documents/:id` - Einzelnes Dokument abrufen
- `POST /api/documents` - Dokument hochladen
- `PUT /api/documents/:id` - Dokument aktualisieren
- `DELETE /api/documents/:id` - Dokument löschen
- `GET /api/documents/:id/download` - Dokument herunterladen

### Ordner
- `GET /api/folders` - Alle Ordner abrufen
- `POST /api/folders` - Ordner erstellen
- `PUT /api/folders/:id` - Ordner aktualisieren
- `DELETE /api/folders/:id` - Ordner löschen

### Tags
- `GET /api/tags` - Alle Tags abrufen
- `POST /api/tags` - Tag erstellen
- `PUT /api/tags/:id` - Tag aktualisieren
- `DELETE /api/tags/:id` - Tag löschen

## Dateiformat-Unterstützung

- **PDF**: application/pdf
- **Bilder**: JPEG, PNG, GIF
- **Text**: text/plain
- **Word**: DOC, DOCX

## Sicherheitshinweise

- Ändern Sie alle Standard-Passwörter
- Verwenden Sie HTTPS in Production
- Setzen Sie angemessene Dateigrößenlimits
- Implementieren Sie Benutzer-Authentifizierung für öffentliche Deployments
- Sichern Sie regelmäßig Ihre Datenbank

## Lizenz

MIT

## Support

Bei Fragen oder Problemen erstellen Sie bitte ein Issue im Repository.
