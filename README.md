# Quiz Studio

Make quizzes, share a private link, print papers and read results. One codebase, three apps: website (Cloudflare Pages), Android APK (Capacitor via GitHub Actions) and Windows app (Electron via GitHub Actions).

**Start here: [SETUP.md](SETUP.md)** (step-by-step guide).

| File | What it is |
|---|---|
| `config.js` | Your settings: Firebase, site address, admin e-mails (the only file you edit) |
| `studio.js` | The whole studio + quiz player (extracted from the IQRA VOCAB app) |
| `shell.js` | Admin check and Google sign-in bridge for the Android / Windows apps |
| `index.html`, `manifest.webmanifest`, `sw.js` | The website and its offline cache |
| `icon-*.png`, `apple-touch-icon.png`, `logo.svg` | Your IQRA logo files (copy them from the IQRA VOCAB repository) |
| `firestore.rules` | Database security rules (paste into Firebase Console) |
| `.github/workflows/` | `android.yml`, `windows.yml`, `make-keystore.yml` |
| `desktop/` | Windows app wrapper (Electron) |
| `capacitor.config.json`, `package.json` | Android wrapper settings |

Local test: `npm start` then open http://localhost:8000 (needs `config.js` filled in).
Address map: `/` studio · `/?k=CODE` quiz player · `/?v=ID` certificate check · `/?iqlink=X` app sign-in helper.
