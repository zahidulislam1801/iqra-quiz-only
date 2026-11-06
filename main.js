/* Quiz Studio for Windows: a window that opens your Quiz Studio website.
   The website keeps itself up to date and works offline from its saved copy, so this app never needs re-building for site changes.
   >>> Put YOUR site address on the next line (same as publicUrl in config.js). */
const SITE = 'https://iqra-quiz.pages.dev/';

const { app, BrowserWindow, shell, Menu } = require('electron');
const path = require('path');

function isOwn(u) { try { return new URL(u).origin === new URL(SITE).origin; } catch (e) { return false; } }

function create() {
  const win = new BrowserWindow({
    width: 1100, height: 800, minWidth: 420, minHeight: 600,
    title: 'Quiz Studio', backgroundColor: '#F3F5FB',
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: { contextIsolation: true, sandbox: true }
  });
  Menu.setApplicationMenu(null);
  // Google sign-in must run in the real browser (Google blocks it inside app windows). The site handles the hand-over.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e, url) => { if (!isOwn(url)) { e.preventDefault(); if (/^https?:/i.test(url)) shell.openExternal(url); } });
  win.webContents.on('did-fail-load', (e, code, desc, url, isMain) => {
    if (!isMain) return;
    win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(
      '<body style="font-family:Segoe UI,sans-serif;background:#F3F5FB;display:grid;place-items:center;height:100vh;margin:0"><div style="text-align:center;max-width:420px"><h2>No internet</h2><p>Quiz Studio could not open ' + SITE +
      '. Check your connection, then press Ctrl+R.</p></div><script>addEventListener("keydown",e=>{if(e.ctrlKey&&e.key=="r")location.href=' + JSON.stringify(SITE) + '})</script></body>'));
  });
  win.loadURL(SITE);
}

const lock = app.requestSingleInstanceLock();
if (!lock) app.quit();
else {
  app.on('second-instance', () => { const w = BrowserWindow.getAllWindows()[0]; if (w) { if (w.isMinimized()) w.restore(); w.focus(); } });
  app.whenReady().then(create);
  app.on('window-all-closed', () => app.quit());
}
