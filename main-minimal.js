// Minimal main.js for testing
const { app, BrowserWindow } = require('electron');
const path = require('path');

console.log('[MAIN] main.js starting');

let mainWindow;

function createWindow() {
    console.log('[MAIN] Creating window...');
    mainWindow = new BrowserWindow({
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

    console.log('[MAIN] Loading index.html...');
    mainWindow.loadFile('index.html');
    mainWindow.webContents.openDevTools();
}

console.log('[MAIN] app.whenReady...');
app.whenReady().then(() => {
    console.log('[MAIN] App ready, creating window...');
    createWindow();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
