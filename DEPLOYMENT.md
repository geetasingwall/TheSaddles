# Deployment Guide — The Saddles

## Architecture

```
React (Vite) Web App
       │
       ├── Web → Nginx (Docker) → any cloud/VPS
       ├── Android → Capacitor → Android Studio → APK / Play Store
       └── iOS → Capacitor → Xcode → IPA / App Store
```

The same React codebase runs on all three platforms via Capacitor.

---

## 1. Web Deployment (Docker)

### Production build
```bash
# From CLUB/
docker compose up --build -d
```
- Frontend: http://your-server:80
- Backend API: http://your-server:8000

### Environment — edit before deploying
`backend/.env`:
```
DATABASE_URL=postgresql://postgres:STRONG_PASSWORD@postgres:5432/horse_riding_club
UPLOAD_PATH=/app/uploads
ALLOWED_ORIGINS=https://your-domain.com
SERVER_PORT=8000
DEBUG_MODE=false
```

`docker-compose.yml` — update POSTGRES_PASSWORD and ALLOWED_ORIGINS to match.

### Recommended cloud hosts
| Provider | Notes |
|----------|-------|
| AWS EC2 / Lightsail | Full control, Docker ready |
| DigitalOcean Droplet | Simple, $6/mo |
| Railway / Render | Push-to-deploy, free tier |
| Fly.io | Docker native |

---

## 2. Android APK / Play Store

### Prerequisites
- [Android Studio](https://developer.android.com/studio) installed
- Java 17+ installed

### Step 1 — Point the app at your production backend
Edit `frontend/capacitor.config.ts`:
```ts
server: {
  url: 'https://your-production-domain.com',
  androidScheme: 'https',
},
```

### Step 2 — Build and sync
```bash
cd frontend
npm run build          # builds dist/
npx cap sync android   # copies dist/ into Android project
```

### Step 3 — Open in Android Studio
```bash
npx cap open android
```

### Step 4 — Generate APK (debug)
In Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
Output: `frontend/android/app/build/outputs/apk/debug/app-debug.apk`

### Step 5 — Generate signed APK (release / Play Store)
In Android Studio: **Build → Generate Signed Bundle / APK**
- Create a keystore if you don't have one
- Select APK → Release
- Output: `app-release.apk`

### Install directly on device (debug)
```bash
adb install frontend/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 3. iOS IPA / App Store

### Prerequisites
- macOS with [Xcode](https://developer.apple.com/xcode/) 14+
- Apple Developer account ($99/year) for App Store / device testing

### Step 1 — Point the app at your production backend
Edit `frontend/capacitor.config.ts`:
```ts
server: {
  url: 'https://your-production-domain.com',
  androidScheme: 'https',
},
```

### Step 2 — Build and sync
```bash
cd frontend
npm run build
npx cap sync ios
```

### Step 3 — Open in Xcode
```bash
npx cap open ios
```

### Step 4 — Configure signing
In Xcode: Select the `App` target → **Signing & Capabilities**
- Set your Team (Apple Developer account)
- Bundle Identifier: `com.thesaddles.club`

### Step 5 — Build for device / App Store
- **Device testing**: Connect iPhone → Product → Run
- **App Store**: Product → Archive → Distribute App

---

## 4. After every code change

```bash
cd frontend
npm run build       # rebuild web app
npx cap sync        # push to both Android and iOS projects
```

Or use the shortcut script:
```bash
npm run cap:update  # = npm run build + npx cap sync
```

---

## 5. Backend API URL — important

| Environment | API URL in capacitor.config.ts |
|-------------|-------------------------------|
| Local dev (browser) | Not needed — Vite proxy handles it |
| Local dev (device/emulator) | `http://YOUR_LAN_IP:8000` |
| Production | `https://your-domain.com` |

For local device testing, find your machine's LAN IP:
- Windows: `ipconfig` → IPv4 Address (e.g. 192.168.1.5)
- Set: `url: 'http://192.168.1.5:8000'` in capacitor.config.ts

---

## 6. Project structure after Capacitor setup

```
frontend/
├── android/          ← Android Studio project (git-tracked)
├── ios/              ← Xcode project (git-tracked)
├── dist/             ← Built web app (git-ignored)
├── src/              ← React source
└── capacitor.config.ts
```

---

## 7. Quick reference

| Task | Command |
|------|---------|
| Run web locally | `cd frontend && npm run dev` |
| Build web | `cd frontend && npm run build` |
| Sync to native | `cd frontend && npx cap sync` |
| Open Android Studio | `cd frontend && npx cap open android` |
| Open Xcode | `cd frontend && npx cap open ios` |
| Full stack (Docker) | `docker compose up --build` |
