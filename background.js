chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "saveFlirt") {
    const profile = message.profile;
    chrome.storage.local.get({ flirts: [] }, (data) => {
      const flirts = data.flirts;
      const exists = flirts.some(f => f.name === profile.name || f.photo === profile.photo);

      if (!exists) {
        flirts.push(profile);
        chrome.storage.local.set({ flirts }, () => {
          sendResponse({ status: "saved" });
        });
      } else {
        sendResponse({ status: "duplicate" });
      }
    });

    return true; // IMPORTANT: needed to keep sendResponse async
  }

  if (message.type === "savePass") {
    const name = message.name;
    chrome.storage.local.get({ passes: [] }, (data) => {
      const passes = data.passes;
      if (!passes.includes(name)) {
        passes.push(name);
        chrome.storage.local.set({ passes });
      }
    });
  }
});
