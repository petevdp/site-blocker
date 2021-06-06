import React, { FormEventHandler, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

const Options = () => {
  const [sitesText, setSitesText] = useState<string>("");
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const onSubmitSites = () => {
    chrome.storage.local.set({ sitesText }, () => alert("saved"));
  };
  
  const handleKeyPress: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && e.ctrlKey)  {
      onSubmitSites();
    }
  }

  useEffect(() => {
    chrome.storage.local.get("sitesText", ({ sitesText }) => {
      console.log({ sitesText });
      setSitesText(sitesText);
      setSettingsLoaded(true);
    });
  }, [setSitesText]);
  return (
    <form onSubmit={onSubmitSites}>
      <h1>Blocked Sites</h1>
      <textarea
        onKeyPress={handleKeyPress}
        readOnly={!settingsLoaded}
        className="sites-text"
        onChange={(e) => setSitesText(e.target.value)}
        value={sitesText}
      />
      <button type="submit">Save</button>
    </form>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
  document.getElementById("root")
);
