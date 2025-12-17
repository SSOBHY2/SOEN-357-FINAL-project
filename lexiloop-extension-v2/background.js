// LexiLoop Background Service Worker
// ===================================
// Handles context menu, API calls, and communication with content scripts
// Calls DeepSeek API directly - no backend server needed!

// Import config (service workers use importScripts)
importScripts('config.js');

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'lexiloop-simplify',
    title: 'Simplify with LexiLoop',
    contexts: ['selection']
  });
});

// Handle keyboard shortcut
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'simplify-selection') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return;

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

    // Check if we're on a restricted page
    const url = tab?.url || '';
    const isPDF = url.endsWith('.pdf') ||
      url.includes('/pdf/') ||
      url.includes('pdfjs') ||
      url.includes('mhjfbmdgcfjbbpaeojofohoefgiehjai') ||
      (tab?.title && tab.title.endsWith('.pdf'));

    const isRestrictedPage = !url ||
      url.startsWith('chrome://') ||
      url.startsWith('chrome-extension://') ||
      url.startsWith('edge://') ||
      url.startsWith('about:') ||
      url.includes('blob:') ||
      url.startsWith('file://') ||
      isPDF;

    if (isRestrictedPage) {
      handleFallback(text);
    } else if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, {
        type: 'LEXILOOP_SIMPLIFY_SELECTION',
        text: text
      }, (response) => {
        if (chrome.runtime.lastError || !response?.handled) {
          handleFallback(text);
        }
      });
    } else {
      handleFallback(text);
    }
  }
});

// Fallback handler - opens result window
async function handleFallback(text) {
  const loadingData = {
    original: text,
    simplified: '',
    status: 'loading',
    timestamp: Date.now()
  };

  await chrome.storage.local.set({ lexiloop_result: loadingData });
  await createResultWindow();

  try {
    const simplified = await simplifyTextWithDeepSeek(text);
    
    const resultData = {
      original: text,
      simplified: simplified,
      status: 'complete',
      timestamp: Date.now()
    };

    await chrome.storage.local.set({ lexiloop_result: resultData });

  } catch (error) {
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
    await chrome.windows.create({
      url: 'result.html',
      type: 'popup',
      width: 450,
      height: 500
    });
  } catch (e) {
    console.error('LexiLoop: Failed to create window:', e);
  }
}

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'LEXILOOP_API_REQUEST') {
    simplifyTextWithDeepSeek(message.text)
      .then(result => sendResponse({ success: true, simplified: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async response
  }
});

// Call DeepSeek API directly to simplify text
async function simplifyTextWithDeepSeek(text) {
  if (!text || !text.trim()) {
    throw new Error('Text cannot be empty');
  }

  if (!CONFIG.DEEPSEEK_API_KEY || CONFIG.DEEPSEEK_API_KEY === 'your_api_key_here') {
    throw new Error('API key not configured. Please update config.js');
  }

  try {
    const response = await fetch(CONFIG.DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: CONFIG.DEEPSEEK_MODEL,
        messages: [
          {
            role: 'system',
            content: CONFIG.SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: `Simplify the following text:\n\n${text}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from DeepSeek API');
    }

    return data.choices[0].message.content.trim();

  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error - check your internet connection');
    }
    throw error;
  }
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
