chrome.action.onClicked.addListener((tab) => {
  if (!tab || !tab.id) {
    return;
  }

  chrome.tabs.sendMessage(
    tab.id,
    { type: 'LEXILOOP_TOGGLE_PANEL' },
    () => {
      // Ignore errors when there is no content script on the page (e.g., chrome:// pages)
      if (chrome.runtime.lastError) {
        // No-op: extension simply does nothing on restricted pages
      }
    }
  );
});
