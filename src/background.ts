import { resolve } from "path/posix";
import { isSiteBlocked } from "./helpers";
import { AppStorage } from "./types";

let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ sitesText: '' });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});


const checkBlocked = async (details: chrome.webNavigation.WebNavigationParentedCallbackDetails | chrome.webNavigation.WebNavigationFramedCallbackDetails) => {
  const urlTabsPromise = chrome.tabs.query({url: details.url})
  const {sitesText} =  await new Promise<AppStorage>((resolve) => {
    chrome.storage.local.get("sitesText", (res) => resolve(res as AppStorage));
  });
  if (isSiteBlocked(sitesText, details.url)) {
    const tabs = await urlTabsPromise;
    tabs.forEach((tab) => {
      chrome.tabs.update(tab.id as number, {url: chrome.runtime.getURL("blocked.html")});
    })
  }
}

chrome.webNavigation.onBeforeNavigate.addListener(checkBlocked);




