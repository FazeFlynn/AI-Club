// test-bisect.js - testing main.js line by line to find crash
console.log('[BISECT] Starting...');

try {
    require('dotenv').config();
    console.log('[BISECT] dotenv loaded OK');
} catch (e) {
    console.error('[BISECT] dotenv FAILED:', e.message);
}

try {
    const { app, BrowserWindow, ipcMain, session, shell } = require('electron');
    console.log('[BISECT] electron loaded OK, app:', !!app);
} catch (e) {
    console.error('[BISECT] electron FAILED:', e.message);
}

try {
    const { login } = require("./auth/authService");
    console.log('[BISECT] authService loaded OK');
} catch (e) {
    console.error('[BISECT] authService FAILED:', e.message);
}

const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');

console.log('[BISECT] All requires done');

app.commandLine.appendSwitch('ignore-certificate-errors');
console.log('[BISECT] CLI switches done');

app.whenReady().then(() => {
    console.log('[BISECT] App ready!');
    
    const mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webviewTag: true,
            preload: path.join(__dirname, 'preload.js'),
        },
        autoHideMenuBar: true
    });

    mainWindow.loadFile('index.html');
    console.log('[BISECT] Window created and loaded');
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
