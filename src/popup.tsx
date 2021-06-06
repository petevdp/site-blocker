import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const Popup = () => {
  const [currentPageBlocked, setCurrentPageBlocked] = useState(false);
  const [sitesText, setSitesText] = useState<string>();
  useEffect(() => {
    (async() => {
      const sitesText = await new Promise<string>((resolve) => chrome.storage.local.get(({sitesText}) => resolve(sitesText)));
      setSitesText(sitesText);
    })();
  }, []);

  const onCheck: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (sitesText === undefined) {
      return;
    }
    const currentTabs = await chrome.tabs.query({ currentWindow: true, active: true });
    let newSitesText: string;
    if (!e.target.checked) {
      console.log('new entry');
      const newEntry = currentTabs
        .filter((tab) => tab.url)
        .map((tab) => new URL(tab.url as string).host)
        .join("\n")

      newSitesText = sitesText + "\n" + newEntry;
    } else {
      console.log('delete entry');
      const targetHost = currentTabs
        .filter((tab) => tab.url)
        .map((tab) => new URL(tab.url as string).host)[0]

      newSitesText = sitesText.replace(new RegExp(`${targetHost}\n?`), "");
    }
    console.log({sitesText, newSitesText});
    chrome.storage.local.set({sitesText: newSitesText})
    setCurrentPageBlocked(!e.target.checked);
  };
  return (
    <div>
      <input type="checkbox" checked={currentPageBlocked} onChange={onCheck}></input>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
