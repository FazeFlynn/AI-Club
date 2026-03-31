// preload.js - Context Bridge for secure IPC
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("authAPI", {
  startOAuth: (siteName, provider) =>
    ipcRenderer.invoke("start-oauth", siteName, provider),
  openGoogleAuth: (tabId) =>
    ipcRenderer.invoke("open-google-auth", tabId),

  // Event listeners
  onOAuthTokensReceived: (callback) => {
    ipcRenderer.on('oauth-tokens-received', (event, data) => callback(data));
  },
  onOAuthComplete: (callback) => {
    ipcRenderer.on('oauth-complete', (event, siteName) => callback(siteName));
  },
  onOAuthError: (callback) => {
    ipcRenderer.on('oauth-error', (event, data) => callback(data));
  },
  onAuthComplete: (callback) => {
    ipcRenderer.on('auth-complete', (event, tabId) => callback(tabId));
  }
});

contextBridge.exposeInMainWorld("electronVersions", {
  chrome: process.versions.chrome
});
