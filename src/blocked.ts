document.addEventListener("DOMContentLoaded", async () => {
    const attemptsBlocked = document.getElementById("attempts-blocked")!;
    const mostRecentBlockedUrl = (await chrome.storage.local.get("mostRecentBlocked"))?.mostRecentBlocked;
    if (!mostRecentBlockedUrl) return;
    const currentHost = new URL(mostRecentBlockedUrl).host;
    const attempts = (await chrome.storage.sync.get("attemptsBlocked"))?.attemptsBlocked;
    if (!attempts) return;
    attemptsBlocked.innerText = attempts[currentHost] || 0;
});
