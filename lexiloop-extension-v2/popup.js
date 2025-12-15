// LexiLoop Popup Script
const BACKEND_URL = 'http://localhost:8000';

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
                // Content script not available (e.g., PDF, chrome:// pages)
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
        const response = await fetch(`${BACKEND_URL}/simplify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });

        if (!response.ok) {
            throw new Error('Failed to simplify text');
        }

        const data = await response.json();
        simplifiedResult = data.simplified_text || data.simplified || data.result || data;

        showResult(simplifiedResult);
    } catch (error) {
        showError(error.message || 'Failed to connect to server');
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

        // Update display
        if (sizeValue) sizeValue.textContent = `${size}%`;

        // Update preview
        if (previewBtn) previewBtn.style.transform = `scale(${size / 100})`;

        // Save preference
        chrome.storage.local.set({ lexiloop_button_size: parseInt(size) });
    });
}