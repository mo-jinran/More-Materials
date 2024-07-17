const manifest = require("../manifest.json");
const default_config = require("../static/config.json");
const { execSync } = require("child_process");
const { BrowserWindow, ipcMain } = require("electron");


exports.onBrowserWindowCreated = window => {
    window.on("show", () => update(window));
    window.on("focus", () => update(window));
}


ipcMain.handle("mojinran.more_materials.update", () => {
    for (const window of BrowserWindow.getAllWindows()) {
        update(window);
    }
});


function update(window) {
    const url = window.webContents.getURL();
    const config = LiteLoader.api.config.get(manifest.slug, default_config);
    const blacklist = ["#/screen-record", "#/desktop-screenshot"];
    if (blacklist.some(item => url.includes(item))) {
        return;
    }
    if (!window.isVisible()) {
        return;
    }
    if (LiteLoader.os.platform == "win32") {
        if (!config.win32.transparent) {
            window.setBackgroundMaterial(config.win32.material);
        }
        window.setBackgroundColor(config.win32.color);
    }
    if (LiteLoader.os.platform == "linux") {
        try {
            const ids = execSync(`wmctrl -xl | grep qq.QQ`, { encoding: "utf-8" });
            for (const id of ids.trim().split("\n")) {
                if (config.linux.material === "none" || !config.linux.transparent) {
                    execSync(`xprop -id ${id.split(" ")[0]} -remove _KDE_NET_WM_BLUR_BEHIND_REGION`);
                } else if (config.linux.material === "blur") {
                    execSync(`xprop -id ${id.split(" ")[0]} -f _KDE_NET_WM_BLUR_BEHIND_REGION 32c -set _KDE_NET_WM_BLUR_BEHIND_REGION 0x0`);
                }
            }
        } catch (e) {
            console.log(e);
        }
        window.setBackgroundColor(config.linux.color);
    }
}


require.cache["electron"] = new Proxy(require.cache["electron"], {
    get(target, property, receiver) {
        const electron = Reflect.get(target, property, receiver);
        return property != "exports" ? electron : new Proxy(electron, {
            get(target, property, receiver) {
                const BrowserWindow = Reflect.get(target, property, receiver);
                return property != "BrowserWindow" ? BrowserWindow : new Proxy(BrowserWindow, {
                    construct(target, [options], newTarget) {
                        const config = LiteLoader.api.config.get(manifest.slug, default_config);
                        if (LiteLoader.os.platform == "win32") {
                            console.log(options);
                            return Reflect.construct(target, [{
                                ...options,
                                transparent: options.transparent || config.win32.transparent,
                            }], newTarget);
                        }
                        if (LiteLoader.os.platform == "linux") {
                            return Reflect.construct(target, [{
                                ...options,
                                transparent: options.transparent || config.linux.transparent,
                            }], newTarget);
                        }
                    }
                });
            }
        });
    }
});