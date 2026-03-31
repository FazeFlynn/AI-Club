require('dotenv').config();

const { app, BrowserWindow, ipcMain, session, shell } = require('electron');

console.log('[TEST] Electron app module loaded');
console.log('[TEST] app object available:', !!app);

app.commandLine.appendSwitch('ignore-certificate-errors');
console.log('[TEST] commandLine switches appended');

app.whenReady().then(() => {
    console.log('[APP] App is ready');
    process.exit(0);
}).catch(err => {
    console.error('[APP] Error:', err);
    process.exit(1);
});

setTimeout(() => {
    console.log('[TEST] Timeout - app did not start');
    process.exit(1);
}, 10000);
