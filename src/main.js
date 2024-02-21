const manifest = require("../manifest.json");
const default_config = require("../static/config.json");
const { Module } = require("module");
const { execSync } = require("child_process");
const { BrowserWindow, ipcMain } = require("electron");


exports.onBrowserWindowCreated = window => {
    window.once("show", () => {
        update(window);
    });
}


ipcMain.handle("LiteLoader.more_materials.update", () => {
    for (const window of BrowserWindow.getAllWindows()) {
        if (!window.isVisible()) {
            continue;
        }
        update(window);
    }
});


function update(window) {
    const config = LiteLoader.api.config.get(manifest.slug, default_config);
    if (LiteLoader.os.platform == "win32") {
        if (!config.transparent) {
            window.setBackgroundMaterial(config.win32.material);
        }
        window.setBackgroundColor(config.win32.color);
    }
    if (LiteLoader.os.platform == "linux") {
        const ids = execSync(`wmctrl -xl | grep qq.QQ`, { encoding: "utf-8" });
        for (const id of ids.trim().split("\n")) {
            if (config.linux.material == "none") {
                execSync(`xprop -id ${id.split(" ")[0]} -remove _KDE_NET_WM_BLUR_BEHIND_REGION`);
            }
            if (config.linux.material == "blur") {
                execSync(`xprop -id ${id.split(" ")[0]} -f _KDE_NET_WM_BLUR_BEHIND_REGION 32c -set _KDE_NET_WM_BLUR_BEHIND_REGION 0x0`);
            }
        }
    }
}


Module._load = new Proxy(Module._load, {
    apply(target, thisArg, argArray) {
        const module = Reflect.apply(target, thisArg, argArray);
        if (argArray[0] != "electron") {
            return module;
        }
        return new Proxy(module, {
            get(target, property, receiver) {
                if (property != "BrowserWindow") {
                    return Reflect.get(target, property, receiver);
                }
                return new Proxy(module.BrowserWindow, {
                    construct(target, [original_options], newTarget) {
                        const config = LiteLoader.api.config.get(manifest.slug, default_config);
                        if (LiteLoader.os.platform == "win32") {
                            return Reflect.construct(target, [{
                                ...original_options,
                                transparent: config.win32.transparent,
                                frame: config.win32.frame,
                                thickFrame: config.win32.thickFrame,
                                autoHideMenuBar: true
                            }], newTarget);
                        }
                        if (LiteLoader.os.platform == "linux") {
                            return Reflect.construct(target, [{
                                ...original_options,
                                transparent: config.linux.transparent,
                                autoHideMenuBar: true
                            }], newTarget);
                        }
                    },
                });
            }
        });
    }
});
