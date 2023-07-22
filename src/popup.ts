import {createEffect, createRoot, createSignal} from "solid-js";

let [currentPageBlocked, setCurrentPageBlocked] = createSignal(false)
let [sitesText, setSitesText] = createSignal<string>("")

async function onLoaded() {
    const isEnabled = document.getElementById("enabled") as HTMLInputElement;
    setSitesText((await chrome.storage.sync.get("sitesText")).sitesText)

    isEnabled.onchange = async (e: any) => {
        console.log({e})
        if (!sitesText()) {
            return;
        }

        const currentTabs = await chrome.tabs.query({currentWindow: true, active: true});
        let newSitesText: string;
        if (!e.target.checked) {
            console.log('new entry');
            const newEntry = currentTabs
                .filter((tab) => tab.url)
                .map((tab) => new URL(tab.url as string).host)
                .join("\n")

            newSitesText = sitesText() + "\n" + newEntry;
        } else {
            console.log('delete entry');
            const targetHost = currentTabs
                .filter((tab) => tab.url)
                .map((tab) => new URL(tab.url as string).host)[0]

            newSitesText = sitesText().replace(new RegExp(`${targetHost}\n?`), "");
        }
        console.log({sitesText, newSitesText});
        chrome.storage.sync.set({sitesText: newSitesText})
        setCurrentPageBlocked(!e.target.checked);
        setSitesText(newSitesText);
    }
    createEffect(() => {
        isEnabled.checked = currentPageBlocked();
    })
}

document.addEventListener("DOMContentLoaded", () => {
    createRoot(onLoaded)
});
