const { contextBridge, ipcRenderer } = require("electron");


contextBridge.exposeInMainWorld("more_materials", {
    update: () => ipcRenderer.invoke("mojinran.more_materials.update"),
});
