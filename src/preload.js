const { contextBridge, ipcRenderer } = require("electron");


contextBridge.exposeInMainWorld("more_materials", {
    update: () => ipcRenderer.invoke("LiteLoader.more_materials.update"),
});
