// LexiLoop Popup Script
// ======================
// Handles the extension popup UI - calls DeepSeek API via background script

const inputText = document.getElementById('inputText');
const simplifyBtn = document.getElementById('simplifyBtn');
const resultBox = document.getElementById('resultBox');
const resultLabel = document.getElementById('resultLabel');
const resultText = document.getElementById('resultText');
const copyBtn = document.getElementById('copyBtn');

let simplifiedResult = '';

// Try to get selected text from the active tab
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'GET_SELECTION' }, (response) => {
            if (chrome.runtime.lastError) {
                return;
            }
            if (response?.text) {
                inputText.value = response.text;
            }
        });
    }
});

simplifyBtn.addEventListener('click', async () => {
    const text = inputText.value.trim();

    if (!text) {
        showError('Please enter some text to simplify');
        return;
    }

    if (text.length < 10) {
        showError('Please enter at least 10 characters');
        return;
    }

    // Show loading state
    simplifyBtn.disabled = true;
    simplifyBtn.innerHTML = '<div class="spinner"></div><span>Simplifying...</span>';
    resultBox.classList.remove('show');

    try {
        // Send request to background script which handles the API call
        const response = await new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                { type: 'LEXILOOP_API_REQUEST', text: text },
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

        simplifiedResult = response;
        showResult(simplifiedResult);
    } catch (error) {
        showError(error.message || 'Failed to simplify text');
    } finally {
        simplifyBtn.disabled = false;
        simplifyBtn.innerHTML = '<span>✨ Simplify Text</span>';
    }
});

copyBtn.addEventListener('click', () => {
    if (simplifiedResult) {
        navigator.clipboard.writeText(simplifiedResult);
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
            copyBtn.textContent = '📋 Copy';
        }, 1500);
    }
});

function showResult(text) {
    resultBox.classList.remove('error');
    resultBox.classList.add('show');
    resultLabel.textContent = '✓ Simplified';
    resultText.textContent = text;
}

function showError(message) {
    resultBox.classList.add('error', 'show');
    resultLabel.textContent = '⚠️ Error';
    resultText.textContent = message;
}

// Customize shortcuts button
const customizeBtn = document.getElementById('customizeBtn');
if (customizeBtn) {
    customizeBtn.addEventListener('click', () => {
        chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
    });
}

// Button size slider
const buttonSizeSlider = document.getElementById('buttonSizeSlider');
const sizeValue = document.getElementById('sizeValue');
const previewBtn = document.getElementById('previewBtn');

// Load saved button size
chrome.storage.local.get(['lexiloop_button_size'], (data) => {
    if (data.lexiloop_button_size !== undefined) {
        const size = data.lexiloop_button_size;
        if (buttonSizeSlider) buttonSizeSlider.value = size;
        if (sizeValue) sizeValue.textContent = `${size}%`;
        if (previewBtn) previewBtn.style.transform = `scale(${size / 100})`;
    }
});

if (buttonSizeSlider) {
    buttonSizeSlider.addEventListener('input', () => {
        const size = buttonSizeSlider.value;

        if (sizeValue) sizeValue.textContent = `${size}%`;
        if (previewBtn) previewBtn.style.transform = `scale(${size / 100})`;

        chrome.storage.local.set({ lexiloop_button_size: parseInt(size) });
    });
}
