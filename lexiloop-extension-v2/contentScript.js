// LexiLoop Content Script
// Handles text selection, floating popups, and in-page simplification

(() => {
  const POPUP_ID = 'lexiloop-popup';
  const LOADING_CLASS = 'lexiloop-loading';

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    #${POPUP_ID} {
      position: absolute;
      z-index: 2147483647;
      max-width: 420px;
      min-width: 300px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      animation: lexiloop-fade-in 0.2s ease-out;
      overflow: hidden;
    }
    
    @keyframes lexiloop-fade-in {
      from { opacity: 0; transform: translateY(-10px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    
    .lexiloop-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
    }
    
    .lexiloop-logo {
      display: flex;
      align-items: center;
      gap: 8px;
      color: white;
      font-weight: 600;
      font-size: 14px;
    }
    
    .lexiloop-logo-icon {
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }
    
    .lexiloop-close {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      transition: background 0.2s;
    }
    
    .lexiloop-close:hover {
      background: rgba(255, 255, 255, 0.3);
    }
    
    .lexiloop-close:focus {
      outline: 2px solid white;
      outline-offset: 2px;
    }

    /* Accessibility Controls Bar */
    .lexiloop-a11y-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: #f0f3ff;
      border-bottom: 1px solid #e0e0e0;
      gap: 8px;
    }

    .lexiloop-font-control {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .lexiloop-font-btn {
      width: 24px;
      height: 24px;
      border: 1px solid #667eea;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 11px;
      font-weight: bold;
      color: #667eea;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .lexiloop-font-btn:hover {
      background: #667eea;
      color: white;
    }

    .lexiloop-font-btn:focus {
      outline: 2px solid #667eea;
      outline-offset: 1px;
    }

    .lexiloop-font-indicator {
      font-size: 10px;
      color: #333;
      min-width: 18px;
      text-align: center;
      font-weight: 600;
    }

    .lexiloop-tts-btn {
      padding: 6px 10px;
      border: 1px solid #667eea;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      font-size: 11px;
      font-weight: 500;
      color: #667eea;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: all 0.2s;
    }

    .lexiloop-tts-btn:hover {
      background: #667eea;
      color: white;
    }

    .lexiloop-tts-btn:focus {
      outline: 2px solid #667eea;
      outline-offset: 1px;
    }

    .lexiloop-tts-btn.speaking {
      background: #f44336;
      border-color: #f44336;
      color: white;
    }
    
    .lexiloop-content {
      padding: 16px;
      background: white;
      color: #333;
      font-size: 15px;
      line-height: 1.6;
      max-height: 300px;
      overflow-y: auto;
    }
    
    .lexiloop-original {
      background: #f8f9fa;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 12px;
      font-size: 13px;
      color: #666;
      border-left: 3px solid #667eea;
      transition: font-size 0.2s ease;
    }
    
    .lexiloop-original-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #999;
      margin-bottom: 4px;
    }
    
    .lexiloop-simplified {
      background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
      padding: 12px;
      border-radius: 8px;
      border-left: 3px solid #4caf50;
      transition: font-size 0.2s ease;
    }

    /* Font size classes */
    .lexiloop-font-small { font-size: 11px !important; }
    .lexiloop-font-medium { font-size: 13px !important; }
    .lexiloop-font-large { font-size: 16px !important; }
    .lexiloop-font-xlarge { font-size: 19px !important; }
    
    .lexiloop-simplified-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #2e7d32;
      margin-bottom: 4px;
      font-weight: 600;
    }
    
    .lexiloop-actions {
      display: flex;
      gap: 8px;
      padding: 12px 16px;
      background: #f8f9fa;
      border-top: 1px solid #eee;
    }
    
    .lexiloop-btn {
      flex: 1;
      padding: 10px 16px;
      border: none;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .lexiloop-btn:focus {
      outline: 2px solid #667eea;
      outline-offset: 2px;
    }
    
    .lexiloop-btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .lexiloop-btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
    
    .lexiloop-btn-secondary {
      background: white;
      color: #667eea;
      border: 1px solid #667eea;
    }
    
    .lexiloop-btn-secondary:hover {
      background: #f0f3ff;
    }
    
    .lexiloop-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
      background: white;
    }
    
    .lexiloop-spinner {
      width: 32px;
      height: 32px;
      border: 3px solid #f0f0f0;
      border-top-color: #667eea;
      border-radius: 50%;
      animation: lexiloop-spin 0.8s linear infinite;
    }
    
    @keyframes lexiloop-spin {
      to { transform: rotate(360deg); }
    }
    
    .lexiloop-error {
      background: #ffebee;
      color: #c62828;
      padding: 12px;
      border-radius: 8px;
      text-align: center;
    }
    
    /* Selection highlight button */
    .lexiloop-quick-btn {
      position: absolute;
      z-index: 2147483646;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 8px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      font-family: 'Segoe UI', system-ui, sans-serif;
      display: flex;
      align-items: center;
      gap: 6px;
      --btn-scale: 1;
      transform: scale(var(--btn-scale));
      transform-origin: top left;
      animation: lexiloop-btn-appear 0.15s ease-out;
    }

    @keyframes lexiloop-btn-appear {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .lexiloop-quick-btn:hover {
      filter: brightness(1.1);
    }

    .lexiloop-quick-btn:focus {
      outline: 2px solid white;
      outline-offset: 2px;
    }

    /* Theme toggle button */
    .lexiloop-theme-btn {
      padding: 6px 10px;
      border: 1px solid #667eea;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      font-size: 11px;
      font-weight: 500;
      color: #667eea;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: all 0.2s;
    }

    .lexiloop-theme-btn:hover {
      background: #667eea;
      color: white;
    }

    .lexiloop-theme-btn:focus {
      outline: 2px solid #667eea;
      outline-offset: 1px;
    }

    /* Dark Mode Styles */
    #lexiloop-popup.lexiloop-dark {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    }

    #lexiloop-popup.lexiloop-dark .lexiloop-header {
      background: rgba(255, 255, 255, 0.1);
    }

    #lexiloop-popup.lexiloop-dark .lexiloop-a11y-bar {
      background: #2a2a3e;
      border-bottom-color: #3a3a4e;
    }

    #lexiloop-popup.lexiloop-dark .lexiloop-font-btn,
    #lexiloop-popup.lexiloop-dark .lexiloop-tts-btn,
    #lexiloop-popup.lexiloop-dark .lexiloop-theme-btn {
      background: #2a2a3e;
      border-color: #667eea;
      color: #a0b0ff;
    }

    #lexiloop-popup.lexiloop-dark .lexiloop-font-btn:hover,
    #lexiloop-popup.lexiloop-dark .lexiloop-tts-btn:hover,
    #lexiloop-popup.lexiloop-dark .lexiloop-theme-btn:hover {
      background: #667eea;
      color: white;
    }

    #lexiloop-popup.lexiloop-dark .lexiloop-font-indicator {
      color: #ddd;
    }

    #lexiloop-popup.lexiloop-dark .lexiloop-content {
      background: #1e1e2e;
    }

    #lexiloop-popup.lexiloop-dark .lexiloop-original {
      background: #2a2a3e;
      border-left-color: #667eea;
      color: #ccc;
    }

    #lexiloop-popup.lexiloop-dark .lexiloop-original-label {
      color: #999;
    }

    #lexiloop-popup.lexiloop-dark .lexiloop-simplified {
      background: linear-gradient(135deg, #1b3a2f 0%, #2a4a3f 100%);
      border-left-color: #66bb6a;
      color: #ddd;
    }

    #lexiloop-popup.lexiloop-dark .lexiloop-simplified-label {
      color: #66bb6a;
    }

    #lexiloop-popup.lexiloop-dark .lexiloop-actions {
      background: #2a2a3e;
      border-top-color: #3a3a4e;
    }

    #lexiloop-popup.lexiloop-dark .lexiloop-btn-secondary {
      background: #3a3a4e;
      color: #ddd;
      border-color: #4a4a5e;
    }

    #lexiloop-popup.lexiloop-dark .lexiloop-btn-secondary:hover {
      background: #4a4a5e;
    }

    #lexiloop-popup.lexiloop-dark .lexiloop-error {
      background: #3a2a2a;
      color: #ff8a80;
    }

    #lexiloop-popup.lexiloop-dark .lexiloop-loading {
      background: #1e1e2e;
      color: #aaa;
    }

    #lexiloop-popup.lexiloop-dark .lexiloop-spinner {
      border-color: #3a3a4e;
      border-top-color: #667eea;
    }
  `;
  document.head.appendChild(style);

  let quickButton = null;
  let currentPopup = null;
  let selectedText = '';
  let selectionRange = null;
  let isProcessing = false;

  // Cached button size (loaded once at init, updated on storage change)
  let cachedButtonSize = 100;

  // Load button size preference at init
  chrome.storage.local.get(['lexiloop_button_size'], (data) => {
    if (data.lexiloop_button_size !== undefined) {
      cachedButtonSize = data.lexiloop_button_size;
    }
  });

  // Listen for button size changes
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.lexiloop_button_size) {
      cachedButtonSize = changes.lexiloop_button_size.newValue || 100;
    }
  });

  // Show quick "Simplify" button on text selection
  document.addEventListener('mouseup', (e) => {
    // Don't show button if clicked on the quick button itself or if processing
    if (quickButton && quickButton.contains(e.target)) {
      return;
    }

    // Don't show if we're currently showing a popup or processing
    if (currentPopup || isProcessing) {
      return;
    }

    setTimeout(() => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (text && text.length > 10 && text.length < 5000) {
        selectedText = text;
        selectionRange = selection.getRangeAt(0).cloneRange();
        showQuickButton(e.clientX, e.clientY);
      } else {
        hideQuickButton();
      }
    }, 10);
  });

  // Hide button on click elsewhere
  document.addEventListener('mousedown', (e) => {
    if (quickButton && !quickButton.contains(e.target)) {
      hideQuickButton();
    }
    if (currentPopup && !currentPopup.contains(e.target)) {
      hidePopup();
    }
  });

  function showQuickButton(x, y) {
    hideQuickButton();

    quickButton = document.createElement('button');
    quickButton.className = 'lexiloop-quick-btn';
    quickButton.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
      Simplify
    `;
    quickButton.style.left = `${x + window.scrollX + 10}px`;
    quickButton.style.top = `${y + window.scrollY + 10}px`;

    // Apply cached button size using CSS variable (respects animation)
    const scale = cachedButtonSize / 100;
    quickButton.style.setProperty('--btn-scale', scale);

    quickButton.addEventListener('click', (e) => {
      e.stopPropagation();
      simplifySelectedText();
    });

    document.body.appendChild(quickButton);
  }

  function hideQuickButton() {
    if (quickButton) {
      quickButton.remove();
      quickButton = null;
    }
  }

  function hidePopup() {
    if (currentPopup) {
      currentPopup.remove();
      currentPopup = null;
    }
  }

  function showPopup(x, y, originalText, simplifiedText, isError = false) {
    hidePopup();
    hideQuickButton();

    // Stop any ongoing speech
    if (window.speechSynthesis?.speaking) {
      window.speechSynthesis.cancel();
    }

    const popup = document.createElement('div');
    popup.id = POPUP_ID;
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-labelledby', 'lexiloop-title');

    // Position popup
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    let left = x + window.scrollX;
    let top = y + window.scrollY + 20;

    // Adjust if too close to edges
    if (left + 420 > viewportWidth + window.scrollX) {
      left = viewportWidth + window.scrollX - 440;
    }
    if (left < window.scrollX + 10) {
      left = window.scrollX + 10;
    }

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;

    if (isError) {
      popup.innerHTML = `
        <div class="lexiloop-header">
          <div class="lexiloop-logo">
            <div class="lexiloop-logo-icon" aria-hidden="true">L</div>
            <span id="lexiloop-title">LexiLoop</span>
          </div>
          <button class="lexiloop-close" aria-label="Close" onclick="this.closest('#${POPUP_ID}').remove()">×</button>
        </div>
        <div class="lexiloop-content" role="alert">
          <div class="lexiloop-error">
            ⚠️ ${simplifiedText}
          </div>
        </div>
      `;
    } else {
      popup.innerHTML = `
        <div class="lexiloop-header">
          <div class="lexiloop-logo">
            <div class="lexiloop-logo-icon" aria-hidden="true">L</div>
            <span id="lexiloop-title">LexiLoop</span>
          </div>
          <button class="lexiloop-close" aria-label="Close" onclick="this.closest('#${POPUP_ID}').remove()">×</button>
        </div>
        <div class="lexiloop-a11y-bar" role="toolbar" aria-label="Accessibility options">
          <div class="lexiloop-font-control" role="group" aria-label="Font size">
            <button class="lexiloop-font-btn" id="lexiloop-font-dec" aria-label="Decrease font size">A-</button>
            <span class="lexiloop-font-indicator" id="lexiloop-font-ind" aria-live="polite">M</span>
            <button class="lexiloop-font-btn" id="lexiloop-font-inc" aria-label="Increase font size">A+</button>
          </div>
          <div style="display: flex; gap: 6px;">
            <button class="lexiloop-theme-btn" id="lexiloop-theme" aria-label="Toggle dark mode">
              🌙
            </button>
            <button class="lexiloop-tts-btn" id="lexiloop-tts" aria-label="Read simplified text aloud">
              🔊 Read
            </button>
          </div>
        </div>
        <div class="lexiloop-content">
          <div class="lexiloop-original lexiloop-font-medium" id="lexiloop-orig-text" role="article" tabindex="0">
            <div class="lexiloop-original-label">Original</div>
            <div class="lexiloop-text-content">${escapeHtml(originalText.length > 200 ? originalText.substring(0, 200) + '...' : originalText)}</div>
          </div>
          <div class="lexiloop-simplified lexiloop-font-medium" id="lexiloop-simp-text" role="article" tabindex="0" aria-live="polite">
            <div class="lexiloop-simplified-label">✓ Simplified</div>
            <div class="lexiloop-text-content">${escapeHtml(simplifiedText)}</div>
          </div>
        </div>
        <div class="lexiloop-actions" role="group" aria-label="Actions">
          <button class="lexiloop-btn lexiloop-btn-secondary" id="lexiloop-copy" tabindex="0">
            📋 Copy
          </button>
          <button class="lexiloop-btn lexiloop-btn-primary" id="lexiloop-replace" tabindex="0">
            ✨ Replace
          </button>
        </div>
      `;
    }

    document.body.appendChild(popup);
    currentPopup = popup;

    // Font size state
    const fontSizes = ['lexiloop-font-small', 'lexiloop-font-medium', 'lexiloop-font-large', 'lexiloop-font-xlarge'];
    const fontLabels = ['S', 'M', 'L', 'XL'];
    let currentFontIndex = 1;

    // Font size controls
    const fontDec = popup.querySelector('#lexiloop-font-dec');
    const fontInc = popup.querySelector('#lexiloop-font-inc');
    const fontInd = popup.querySelector('#lexiloop-font-ind');
    const origText = popup.querySelector('#lexiloop-orig-text');
    const simpText = popup.querySelector('#lexiloop-simp-text');

    function updateFontSize() {
      [origText, simpText].forEach(el => {
        if (el) {
          fontSizes.forEach(s => el.classList.remove(s));
          el.classList.add(fontSizes[currentFontIndex]);
        }
      });
      if (fontInd) fontInd.textContent = fontLabels[currentFontIndex];
    }

    if (fontDec) {
      fontDec.addEventListener('click', () => {
        if (currentFontIndex > 0) {
          currentFontIndex--;
          updateFontSize();
        }
      });
    }

    if (fontInc) {
      fontInc.addEventListener('click', () => {
        if (currentFontIndex < fontSizes.length - 1) {
          currentFontIndex++;
          updateFontSize();
        }
      });
    }

    // TTS functionality
    const ttsBtn = popup.querySelector('#lexiloop-tts');
    let isSpeaking = false;

    function updateTTSBtn() {
      if (ttsBtn) {
        if (isSpeaking) {
          ttsBtn.innerHTML = '⏹️ Stop';
          ttsBtn.classList.add('speaking');
          ttsBtn.setAttribute('aria-label', 'Stop reading');
        } else {
          ttsBtn.innerHTML = '🔊 Read';
          ttsBtn.classList.remove('speaking');
          ttsBtn.setAttribute('aria-label', 'Read simplified text aloud');
        }
      }
    }

    if (ttsBtn) {
      ttsBtn.addEventListener('click', async () => {
        if (isSpeaking) {
          window.speechSynthesis.cancel();
          isSpeaking = false;
          updateTTSBtn();
        } else {
          // Wait for voices to be available
          let voices = window.speechSynthesis.getVoices();
          if (voices.length === 0) {
            // Voices not loaded yet, wait a bit
            await new Promise(resolve => {
              window.speechSynthesis.onvoiceschanged = () => {
                voices = window.speechSynthesis.getVoices();
                resolve();
              };
              setTimeout(resolve, 500); // Fallback timeout
            });
            voices = window.speechSynthesis.getVoices();
          }

          const utterance = new SpeechSynthesisUtterance(simplifiedText);
          utterance.rate = 0.9;

          const preferredVoice = voices.find(v =>
            v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Samantha'))
          ) || voices.find(v => v.lang.startsWith('en'));
          if (preferredVoice) utterance.voice = preferredVoice;

          utterance.onstart = () => { isSpeaking = true; updateTTSBtn(); };
          utterance.onend = () => { isSpeaking = false; updateTTSBtn(); };
          utterance.onerror = (e) => {
            console.error('TTS error:', e.error);
            isSpeaking = false;
            updateTTSBtn();
          };

          window.speechSynthesis.speak(utterance);
        }
      });
    }

    // Theme toggle functionality
    const themeBtn = popup.querySelector('#lexiloop-theme');
    let isDarkMode = false;

    // Load saved theme preference
    chrome.storage.local.get(['lexiloop_dark_mode'], (data) => {
      if (data.lexiloop_dark_mode) {
        isDarkMode = true;
        popup.classList.add('lexiloop-dark');
        if (themeBtn) themeBtn.textContent = '☀️';
      }
    });

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        if (isDarkMode) {
          popup.classList.add('lexiloop-dark');
          themeBtn.textContent = '☀️';
          themeBtn.setAttribute('aria-label', 'Switch to light mode');
        } else {
          popup.classList.remove('lexiloop-dark');
          themeBtn.textContent = '🌙';
          themeBtn.setAttribute('aria-label', 'Switch to dark mode');
        }
        // Save preference
        chrome.storage.local.set({ lexiloop_dark_mode: isDarkMode });
      });
    }

    // Add button handlers
    const copyBtn = popup.querySelector('#lexiloop-copy');
    const replaceBtn = popup.querySelector('#lexiloop-replace');

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(simplifiedText);
        copyBtn.innerHTML = '✓ Copied!';
        setTimeout(() => { copyBtn.innerHTML = '📋 Copy'; }, 1500);
      });
    }

    if (replaceBtn) {
      replaceBtn.addEventListener('click', () => {
        window.speechSynthesis?.cancel();
        replaceSelectedText(simplifiedText);
        hidePopup();
      });
    }
  }

  function showLoadingPopup(x, y) {
    hidePopup();
    hideQuickButton();

    const popup = document.createElement('div');
    popup.id = POPUP_ID;
    popup.style.left = `${x + window.scrollX}px`;
    popup.style.top = `${y + window.scrollY + 20}px`;

    popup.innerHTML = `
      <div class="lexiloop-header">
        <div class="lexiloop-logo">
          <div class="lexiloop-logo-icon">L</div>
          <span>LexiLoop</span>
        </div>
      </div>
      <div class="lexiloop-loading">
        <div class="lexiloop-spinner"></div>
      </div>
    `;

    document.body.appendChild(popup);
    currentPopup = popup;
  }

  async function simplifySelectedText() {
    if (!selectedText) return;

    isProcessing = true;

    const rect = selectionRange?.getBoundingClientRect();
    const x = rect ? rect.left : 100;
    const y = rect ? rect.bottom : 100;

    showLoadingPopup(x, y);

    try {
      const response = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
          { type: 'LEXILOOP_API_REQUEST', text: selectedText },
          (response) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else if (response?.success) {
              resolve(response.simplified);
            } else {
              reject(new Error(response?.error || 'Unknown error'));
            }
          }
        );
      });

      showPopup(x, y, selectedText, response);
    } catch (error) {
      showPopup(x, y, selectedText, error.message || 'Failed to simplify text', true);
    } finally {
      isProcessing = false;
    }
  }

  function replaceSelectedText(newText) {
    if (!selectionRange) return;

    try {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(selectionRange);

      // Check if we can edit
      const container = selectionRange.commonAncestorContainer;
      const editableParent = container.nodeType === 3
        ? container.parentElement
        : container;

      if (editableParent && (editableParent.isContentEditable ||
        editableParent.tagName === 'TEXTAREA' ||
        editableParent.tagName === 'INPUT')) {
        document.execCommand('insertText', false, newText);
      } else {
        // For non-editable content, wrap in a span with visual highlight
        const span = document.createElement('span');
        span.textContent = newText;
        span.style.background = 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)';
        span.style.padding = '2px 4px';
        span.style.borderRadius = '4px';
        span.title = 'Simplified by LexiLoop';

        selectionRange.deleteContents();
        selectionRange.insertNode(span);
      }
    } catch (e) {
      console.error('LexiLoop: Could not replace text', e);
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'LEXILOOP_SIMPLIFY_SELECTION') {
      selectedText = message.text;
      simplifySelectedText();
      // Send acknowledgment so background knows we handled it
      sendResponse({ handled: true });
    } else if (message.type === 'LEXILOOP_SHORTCUT_SIMPLIFY') {
      // Keyboard shortcut triggered - get current selection and simplify
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      if (text && text.length > 5) {
        selectedText = text;
        selectionRange = selection.getRangeAt(0).cloneRange();
        simplifySelectedText();
        sendResponse({ handled: true });
      } else {
        sendResponse({ handled: false });
      }
    } else if (message.type === 'LEXILOOP_TOGGLE_PANEL') {
      // Could show a floating panel here if needed
      sendResponse({ handled: true });
    } else if (message.type === 'GET_SELECTION') {
      // Return currently selected text to popup
      const selection = window.getSelection();
      const text = selection?.toString().trim() || '';
      sendResponse({ text });
    }
    return true; // Keep channel open for async response
  });
})();
