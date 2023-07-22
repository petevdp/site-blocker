async function loaded() {
    const textElt = document.getElementById("blocked-sites") as HTMLTextAreaElement;
    const form = document.getElementById("options-form") as HTMLFormElement;
    const {sitesText} = await chrome.storage.sync.get("sitesText");
    textElt.value = sitesText;

    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (changes.sitesText) {
            textElt.value = changes.sitesText.newValue;
        }
    });

    form.onsubmit = (e) => {
        e.preventDefault();
        chrome.storage.sync.set({sitesText: textElt.value});
    }

    const attemptsBlockedElt = document.getElementById("all-attempts-blocked")!;
    const attempts = (await chrome.storage.sync.get("attemptsBlocked")) as {[key: string]: number};
    const totalAttempts = Object.values(attempts.attemptsBlocked).reduce((acc, val) => acc + val, 0);
    attemptsBlockedElt.innerText = totalAttempts.toString();
}


document.addEventListener("DOMContentLoaded", loaded);
