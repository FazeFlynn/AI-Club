// auth-preload.js - runs before ANY page JS
const { ipcRenderer } = require('electron');

// Expose OAuth API to renderer context
window.authAPI = {
    startOAuth: (siteName, provider) => {
        console.log(`[Preload] Requesting OAuth for ${siteName} with provider ${provider}`);
        return ipcRenderer.invoke('start-oauth', siteName, provider);
    }
};

window.chrome = {
    runtime: {
        id: undefined,
        connect: function () { return { onMessage: { addListener: function () { } }, postMessage: function () { }, disconnect: function () { } }; },
        sendMessage: function () { },
        onMessage: { addListener: function () { }, removeListener: function () { }, hasListener: function () { } },
        onConnect: { addListener: function () { }, removeListener: function () { } },
    },
    app: {
        isInstalled: false,
        getDetails: function () { return null; },
        runningState: function () { return 'cannot_run'; }
    },
    csi: function () { },
    loadTimes: function () { }
};