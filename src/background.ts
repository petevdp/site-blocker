import { resolve } from "path/posix";
import { isSiteBlocked } from "./helpers";
import { AppStorage, APP_STORAGE_KEYS } from "./types";

let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ sitesText: '', boopCounts: {} });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});


const checkBlocked = async (details: chrome.webNavigation.WebNavigationParentedCallbackDetails | chrome.webNavigation.WebNavigationFramedCallbackDetails) => {
  const urlTabsPromise = chrome.tabs.query({url: details.url})
  const {sitesText, boopCounts} =  await new Promise<AppStorage>((resolve) => {
    chrome.storage.local.get(APP_STORAGE_KEYS, (res) => resolve(res as AppStorage));
  });
  if (isSiteBlocked(sitesText, details.url)) {
    const tabs = await urlTabsPromise;
    tabs.forEach((tab) => {
      chrome.tabs.update(tab.id as number, {url: chrome.runtime.getURL("blocked.html")});
    });
    if (!!boopCounts[details.url]) {
      boopCounts[details.url]++
    } else {
      boopCounts[details.url] = 1;
    }
  }
}

chrome.webNavigation.onBeforeNavigate.addListener(checkBlocked);




