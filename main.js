const { app, BrowserWindow, ipcMain, session, shell } = require('electron');
const path = require('path');
const { login } = require("./auth/authService");

let mainWindow;

// const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const UA = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${process.versions.chrome} Safari/537.36`;

const TAB_IDS = ['chatgpt', 'gemini', 'claude', 'perplexity', 'copilot'];

function setupSession(tabId) {
    const partitionSession = session.fromPartition(`persist:${tabId}`);
    console.log(`Setting up session for partition: persist:${tabId}`);

    partitionSession.setUserAgent(UA);

    // partitionSession.webRequest.onBeforeSendHeaders((details, callback) => {
    //     details.requestHeaders['User-Agent'] = UA;
    //     delete details.requestHeaders['X-Electron-Version'];
    //     delete details.requestHeaders['X-Electron-App-Version'];
    //     callback({ requestHeaders: details.requestHeaders });
    // });

    // Add these extra headers to look more like a real browser
    partitionSession.webRequest.onBeforeSendHeaders((details, callback) => {
        details.requestHeaders['User-Agent'] = UA;
        delete details.requestHeaders['X-Electron-Version'];
        delete details.requestHeaders['X-Electron-App-Version'];

        // ✅ Add missing headers real Chrome always sends
        if (!details.requestHeaders['Accept-Language']) {
            details.requestHeaders['Accept-Language'] = 'en-US,en;q=0.9';
        }
        if (!details.requestHeaders['sec-ch-ua']) {
            details.requestHeaders['sec-ch-ua'] = `"Chromium";v="144", "Google Chrome";v="144", "Not-A.Brand";v="99"`;
        }
        if (!details.requestHeaders['sec-ch-ua-platform']) {
            details.requestHeaders['sec-ch-ua-platform'] = '"Windows"';
        }

        callback({ requestHeaders: details.requestHeaders });
    });
}
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,

        show: false,

        frame: false,
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#2f324100',
            symbolColor: '#ffffff',
            height: 25
        },

        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webviewTag: true,
            allowRunningInsecureContent: false,
            webSecurity: true,
            preload: path.join(__dirname, 'auth-preload.js')
        },

        icon: path.join(__dirname, 'icon.png'),
        autoHideMenuBar: true
    });

    mainWindow.setMenuBarVisibility(false);

    mainWindow.webContents.setUserAgent(UA);

    mainWindow.loadFile('index.html');

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

// main.js - add this before app.whenReady()
app.commandLine.appendSwitch('ignore-certificate-errors');
app.commandLine.appendSwitch('ignore-ssl-errors');
app.commandLine.appendSwitch('ignore-certificate-errors-spki-list');

app.whenReady().then(() => {

    console.log('Electron version:', process.versions.electron);
    console.log('Chromium version:', process.versions.chrome);  // ← Use THIS
    console.log('Node version:', process.versions.node);

    TAB_IDS.forEach(setupSession);



    // ✅ Also cover default session
    session.defaultSession.setUserAgent(UA);
    session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
        details.requestHeaders['User-Agent'] = UA;
        delete details.requestHeaders['X-Electron-Version'];
        delete details.requestHeaders['X-Electron-App-Version'];
        callback({ requestHeaders: details.requestHeaders });
    });

    // ✅ Catch any future dynamic sessions just in case
    app.on('session-created', (sess) => {
        sess.setUserAgent(UA);
        sess.webRequest.onBeforeSendHeaders((details, callback) => {
            details.requestHeaders['User-Agent'] = UA;
            delete details.requestHeaders['X-Electron-Version'];
            delete details.requestHeaders['X-Electron-App-Version'];
            callback({ requestHeaders: details.requestHeaders });
        });
    });

    createWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

// Handle JavaScript injection requests
ipcMain.on('inject-js', (event, data) => {
    const { webviewId, code } = data;
    const webview = mainWindow.webContents;

    // The actual injection happens in the renderer process
    event.reply('inject-js-reply', { success: true });
});

ipcMain.handle("start-oauth", async (event, siteName, provider) => {
    await login(siteName, provider, mainWindow);
});

// Keep the IPC handler too as a fallback
ipcMain.handle('setup-session', (event, tabId) => {
    setupSession(tabId);
});


const openAuthWindows = new Map(); // track open windows per tab

// main.js - serviceConfig update
const serviceConfig = {
    gemini: {
        loginUrl: `https://accounts.google.com/v3/signin/identifier?continue=${encodeURIComponent('https://gemini.google.com')}&flowName=GlifWebSignIn&flowEntry=ServiceLogin&hl=en`,
        successUrl: 'https://gemini.google.com',
        // Uses its own partition
    },
    chatgpt: {
        loginUrl: 'https://chatgpt.com/auth/login',
        successUrl: 'https://chatgpt.com',
    },
    copilot: {
        loginUrl: 'https://copilot.microsoft.com',
        successUrl: 'https://copilot.microsoft.com',
        // ✅ Share Google session with Gemini partition
        sharedGooglePartition: 'persist:gemini',
    },
    claude: {
        loginUrl: 'https://claude.ai/login',
        successUrl: 'https://claude.ai',
    },
    perplexity: {
        loginUrl: 'https://www.perplexity.ai',
        successUrl: 'https://www.perplexity.ai',
    },
};

// Don't loose it, IT IS WOKRING FOR GEMINI
ipcMain.handle('open-google-auth', (event, tabId) => {
    if (openAuthWindows.has(tabId)) {
        openAuthWindows.get(tabId).focus();
        return;
    }

    const serviceUrls = {
        gemini: 'https://gemini.google.com',
        chatgpt: 'https://chatgpt.com',
        claude: 'https://claude.ai',
        perplexity: 'https://www.perplexity.ai',
        copilot: 'https://copilot.microsoft.com',
    };

    const continueUrl = serviceUrls[tabId] || 'https://google.com';

    // ✅ Use this specific URL — it's the one Google allows for embedded browsers
    const loginUrl = `https://accounts.google.com/signin/v2/identifier` +
        `?continue=${encodeURIComponent(continueUrl)}` +
        `&flowName=GlifWebSignIn` +
        `&flowEntry=ServiceLogin` +
        `&hl=en`;

    const authWindow = new BrowserWindow({
        width: 500,
        height: 700,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            partition: `persist:${tabId}`,
        },
        autoHideMenuBar: true,
        show: false,
        title: 'Sign in to Google'
    });

    openAuthWindows.set(tabId, authWindow);

    // ✅ Critical: set UA before anything loads
    authWindow.webContents.setUserAgent(UA);

    // ✅ Also set on the session
    const authSession = authWindow.webContents.session;
    authSession.setUserAgent(UA);
    authSession.webRequest.onBeforeSendHeaders((details, callback) => {
        details.requestHeaders['User-Agent'] = UA;
        delete details.requestHeaders['X-Electron-Version'];
        delete details.requestHeaders['X-Electron-App-Version'];
        // ✅ Add missing sec-ch headers Google expects
        details.requestHeaders['sec-ch-ua'] = `"Chromium";v="144", "Google Chrome";v="144", "Not-A.Brand";v="99"`;
        details.requestHeaders['sec-ch-ua-mobile'] = '?0';
        details.requestHeaders['sec-ch-ua-platform'] = '"Windows"';
        callback({ requestHeaders: details.requestHeaders });
    });

    authWindow.webContents.on('did-finish-load', () => {
        authWindow.show();

        // ✅ Inject chrome.runtime on every page load
        authWindow.webContents.executeJavaScript(`
            if (!window.chrome) window.chrome = {};
            if (!window.chrome.runtime) window.chrome.runtime = {
                id: undefined,
                connect: () => ({ onMessage: { addListener: ()=>{} }, postMessage: ()=>{}, disconnect: ()=>{} }),
                sendMessage: ()=>{},
                onMessage: { addListener: ()=>{}, removeListener: ()=>{} },
            };
        `).catch(() => { });
    });

    authWindow.webContents.on('did-navigate', (e, url) => {
        console.log(`[AUTH-NAV] ${url}`);
        if (url.startsWith(continueUrl)) {
            console.log(`[AUTH] ✅ Login successful!`);
            authWindow.close();
            mainWindow.webContents.send('auth-complete', tabId);
        }
    });

    authWindow.on('closed', () => openAuthWindows.delete(tabId));

    authWindow.loadURL(loginUrl);
});


