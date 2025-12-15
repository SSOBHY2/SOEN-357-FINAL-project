// LexiLoop Background Service Worker
// Handles context menu and communication with content scripts

const BACKEND_URL = 'http://localhost:8000';

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'lexiloop-simplify',
    title: 'Simplify with LexiLoop (⌘+Shift+S)',
    contexts: ['selection']
  });
});

// Handle keyboard shortcut
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'simplify-selection') {
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return;

    // Try to get selection from content script and simplify
    try {
      chrome.tabs.sendMessage(tab.id, { type: 'LEXILOOP_SHORTCUT_SIMPLIFY' });
    } catch (e) {
      showNotification('Please select some text first');
    }
  }
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'lexiloop-simplify' && info.selectionText) {
    const text = info.selectionText.trim();

    if (!text || text.length < 5) {
      showNotification('Please select more text to simplify');
      return;
    }

    // Check if we're on a page where content script can't run
    // This includes: PDFs, chrome:// pages, extensions, local files
    const url = tab?.url || '';
    const isPDF = url.endsWith('.pdf') ||
      url.includes('/pdf/') ||
      url.includes('pdfjs') ||
      url.includes('mhjfbmdgcfjbbpaeojofohoefgiehjai') || // Chrome's PDF viewer extension ID
      (tab?.title && tab.title.endsWith('.pdf'));

    const isRestrictedPage = !url ||
      url.startsWith('chrome://') ||
      url.startsWith('chrome-extension://') ||
      url.startsWith('edge://') ||
      url.startsWith('about:') ||
      url.includes('blob:') ||
      url.startsWith('file://') ||
      isPDF;

    console.log('LexiLoop: URL =', url, 'isRestricted =', isRestrictedPage, 'isPDF =', isPDF);

    if (isRestrictedPage) {
      // Restricted page (including PDF) - use fallback directly
      console.log('LexiLoop: Using fallback for restricted page');
      handleFallback(text);
    } else if (tab?.id) {
      // Try to send to content script first
      chrome.tabs.sendMessage(tab.id, {
        type: 'LEXILOOP_SIMPLIFY_SELECTION',
        text: text
      }, (response) => {
        // If content script didn't respond or didn't handle it, use fallback
        if (chrome.runtime.lastError || !response?.handled) {
          console.log('LexiLoop: Content script unavailable or did not handle, using fallback');
          handleFallback(text);
        } else {
          console.log('LexiLoop: Content script handled the request');
        }
      });
    } else {
      handleFallback(text);
    }
  }
});

// Fallback handler for PDFs and restricted pages
async function handleFallback(text) {
  console.log('LexiLoop: handleFallback called with text length:', text.length);

  // 1. Set initial loading state and open popup immediately
  const loadingData = {
    original: text,
    simplified: '',
    status: 'loading',
    timestamp: Date.now()
  };

  await chrome.storage.local.set({ lexiloop_result: loadingData });
  await createResultWindow();

  try {
    console.log('LexiLoop: Calling simplifyText API...');
    const simplified = await simplifyText(text);
    console.log('LexiLoop: API returned simplified text length:', simplified.length);

    // 2. Update with result
    const resultData = {
      original: text,
      simplified: simplified,
      status: 'complete',
      timestamp: Date.now()
    };

    await chrome.storage.local.set({ lexiloop_result: resultData });
    console.log('LexiLoop: Result updated in storage');

  } catch (error) {
    console.error('LexiLoop: Error in handleFallback:', error);

    // 3. Update with error
    const errorData = {
      original: text,
      simplified: 'Error: ' + error.message,
      status: 'error',
      timestamp: Date.now()
    };

    await chrome.storage.local.set({ lexiloop_result: errorData });
    showNotification('Error: ' + error.message);
  }
}

// Open the result popup window
async function createResultWindow() {
  try {
    // Check if window already exists? (Optional, but strictly create new for now as per previous logic)
    const window = await chrome.windows.create({
      url: 'result.html',
      type: 'popup',
      width: 450,
      height: 500
    });
    console.log('LexiLoop: Window created:', window);
  } catch (e) {
    console.error('LexiLoop: Failed to create window:', e);
  }
}

// Handle simplification requests from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'LEXILOOP_API_REQUEST') {
    simplifyText(message.text)
      .then(result => sendResponse({ success: true, simplified: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async response
  }
});

// Call backend API to simplify text
async function simplifyText(text) {
  const response = await fetch(`${BACKEND_URL}/simplify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to simplify text');
  }

  const data = await response.json();
  return data.simplified_text || data.simplified || data.result || JSON.stringify(data);
}

// Show notification
function showNotification(message) {
  chrome.notifications?.create({
    type: 'basic',
    iconUrl: 'icon.png',
    title: 'LexiLoop',
    message: message
  });
}
