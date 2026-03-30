const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("authAPI", {
  startOAuth: (siteName, provider) =>
    ipcRenderer.invoke("start-oauth", siteName, provider)
});

// contextBridge.exposeInMainWorld("authAPI", {
//   startOAuth: (siteId, provider) =>
//     ipcRenderer.invoke("start-oauth", siteId, provider)
// });
