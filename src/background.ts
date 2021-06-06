import { resolve } from "path/posix";
import { AppStorage } from "./types";

let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ sitesText: '' });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});

chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  const url = new URL(details.url);
  const urlTabsPromise = chrome.tabs.query({url: details.url})
  const {sitesText} =  await new Promise<AppStorage>((resolve) => {
    chrome.storage.local.get("sitesText", (res) => resolve(res as AppStorage));
  });
  
  const blockedHosts =  sitesText.split("\n").map((line) => line.trim())
  console.log({url, blockedHosts});

  if (blockedHosts.some((host) => url.host.endsWith(host))) {
    const tabs = await urlTabsPromise;
    tabs.forEach((tab) => {
      console.log("navigating tab: ", tab);
      chrome.tabs.update(tab.id as number, {url: chrome.runtime.getURL("blocked.html")});
    })
  }
});




