import manifest from "../manifest.json" with {type: "json"};
import default_config from "../static/config.json" with {type: "json"};


export const onSettingWindowCreated = async view => {
    const config = await LiteLoader.api.config.get(manifest.slug, default_config);
    const plugin_path = LiteLoader.plugins[manifest.slug].path.plugin;

    view.innerHTML = await (await fetch(`local:///${plugin_path}/static/settings.html`)).text();

    if (LiteLoader.os.platform == "win32") {
        view.querySelector(".windows setting-list").setAttribute("is-active", "");
    }
    if (LiteLoader.os.platform == "linux") {
        view.querySelector(".linux setting-list").setAttribute("is-active", "");
    }

    const win32_material = view.querySelectorAll(".windows setting-select")[0];
    win32_material.querySelector(`[data-value="${config.win32.material}"]`).click()
    win32_material.addEventListener("selected", update((event, config) => {
        config.win32.material = event.detail.value;
    }));

    const win32_color = view.querySelectorAll(".windows input")[0];
    win32_color.value = config.win32.color;
    win32_color.addEventListener("change", update((event, config) => {
        config.win32.color = event.target.value;
    }));

    const win32_transparent = view.querySelectorAll(".windows setting-switch")[0];
    win32_transparent.toggleAttribute("is-active", config.win32.transparent);
    win32_transparent.addEventListener("click", update((event, config) => {
        event.target.toggleAttribute("is-active");
        config.win32.transparent = event.target.hasAttribute("is-active");
    }));

    const linux_material = view.querySelectorAll(".linux setting-select")[0];
    linux_material.querySelector(`[data-value="${config.linux.material}"]`).click()
    linux_material.addEventListener("selected", update((event, config) => {
        config.linux.material = event.detail.value;
    }));

    const linux_color = view.querySelectorAll(".linux input")[0];
    linux_color.value = config.linux.color;
    linux_color.addEventListener("change", update((event, config) => {
        config.linux.color = event.target.value;
    }));

    const linux_transparent = view.querySelectorAll(".linux setting-switch")[0];
    linux_transparent.toggleAttribute("is-active", config.linux.transparent);
    linux_transparent.addEventListener("click", update((event, config) => {
        event.target.toggleAttribute("is-active");
        config.linux.transparent = event.target.hasAttribute("is-active");
    }));
}


function update(callback) {
    return async (event) => {
        const config = await LiteLoader.api.config.get(manifest.slug, default_config);
        callback(event, config);
        await LiteLoader.api.config.set(manifest.slug, config);
        await more_materials.update();
    }
}
