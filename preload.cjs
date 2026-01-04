const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    saveImage: (url, gameName) => ipcRenderer.invoke('save-image', url, gameName)
});