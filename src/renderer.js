import manifest from "../manifest.json" assert {type: "json"};
import default_config from "../static/config.json" assert {type: "json"};


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
    const win32_color = view.querySelectorAll(".windows input")[0];
    const win32_transparent = view.querySelectorAll(".windows setting-switch")[0];
    const win32_frame = view.querySelectorAll(".windows setting-switch")[1];
    const win32_thickFrame = view.querySelectorAll(".windows setting-switch")[2];
    const linux_material = view.querySelectorAll(".linux setting-select")[0];
    const linux_color = view.querySelectorAll(".linux input")[0];
    const linux_transparent = view.querySelectorAll(".linux setting-switch")[0];

    win32_material.querySelector(`[data-value="${config.win32.material}"]`).click()
    win32_color.value = config.win32.color;
    win32_transparent.toggleAttribute("is-active", config.win32.transparent);
    win32_frame.toggleAttribute("is-active", config.win32.frame);
    win32_thickFrame.toggleAttribute("is-active", config.win32.thickFrame);
    linux_material.querySelector(`[data-value="${config.linux.material}"]`).click()
    linux_color.value = config.linux.color;
    linux_transparent.toggleAttribute("is-active", config.linux.transparent);

    win32_material.addEventListener("selected", updateWin32Material);
    win32_color.addEventListener("change", updateWin32Color);
    win32_transparent.addEventListener("click", updateWin32Transparent);
    win32_frame.addEventListener("click", updateWin32Frame);
    win32_thickFrame.addEventListener("click", updateWin32ThickFrame);
    linux_material.addEventListener("selected", updateLinuxMaterial);
    linux_color.addEventListener("change", updateLinuxColor);
    linux_transparent.addEventListener("click", updateLinuxTransparent);
}


async function updateWin32Material(event) {
    const config = await LiteLoader.api.config.get(manifest.slug, default_config);
    config.win32.material = event.detail.value;
    await LiteLoader.api.config.set(manifest.slug, config);
    await more_materials.update();
}


async function updateWin32Color(event) {
    const config = await LiteLoader.api.config.get(manifest.slug, default_config);
    config.win32.color = event.target.value;
    await LiteLoader.api.config.set(manifest.slug, config);
    await more_materials.update();
}


async function updateWin32Transparent(event) {
    event.target.toggleAttribute("is-active");
    const config = await LiteLoader.api.config.get(manifest.slug, default_config);
    config.win32.transparent = event.target.hasAttribute("is-active");
    await LiteLoader.api.config.set(manifest.slug, config);
    await more_materials.update();
}


async function updateWin32Frame(event) {
    event.target.toggleAttribute("is-active");
    const config = await LiteLoader.api.config.get(manifest.slug, default_config);
    config.win32.frame = event.target.hasAttribute("is-active");
    await LiteLoader.api.config.set(manifest.slug, config);
    await more_materials.update();
}


async function updateWin32ThickFrame(event) {
    event.target.toggleAttribute("is-active");
    const config = await LiteLoader.api.config.get(manifest.slug, default_config);
    config.win32.thickFrame = event.target.hasAttribute("is-active");
    await LiteLoader.api.config.set(manifest.slug, config);
    await more_materials.update();
}


async function updateLinuxMaterial(event) {
    const config = await LiteLoader.api.config.get(manifest.slug, default_config);
    config.linux.material = event.detail.value;
    await LiteLoader.api.config.set(manifest.slug, config);
    await more_materials.update();
}


async function updateLinuxColor(event) {
    const config = await LiteLoader.api.config.get(manifest.slug, default_config);
    config.linux.color = event.target.value;
    await LiteLoader.api.config.set(manifest.slug, config);
    await more_materials.update();
}


async function updateLinuxTransparent(event) {
    event.target.toggleAttribute("is-active");
    const config = await LiteLoader.api.config.get(manifest.slug, default_config);
    config.linux.transparent = event.target.hasAttribute("is-active");
    await LiteLoader.api.config.set(manifest.slug, config);
    await more_materials.update();
}
