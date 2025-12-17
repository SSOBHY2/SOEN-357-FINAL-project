// LexiLoop Panel Script
// ======================
// Full panel interface - calls DeepSeek API via background script

let inputTextRef = null;
let simplifiedTextRef = null;
let pendingPrefillText = null;

function applyPrefillIfAny() {
    if (inputTextRef && pendingPrefillText !== null) {
        inputTextRef.value = pendingPrefillText;
        pendingPrefillText = null;
    }
}

function renderSimplifiedTextLines(text) {
    if (!simplifiedTextRef) {
        return;
    }
    simplifiedTextRef.innerHTML = '';
    const lines = text.split(/\r?\n/);
    let firstLineElement = null;
    lines.forEach((line) => {
        const span = document.createElement('span');
        span.className = 'focus-line';
        span.textContent = line || ' ';
        span.addEventListener('mouseenter', () => {
            const existing = simplifiedTextRef.querySelectorAll('.focus-line.focused');
            existing.forEach((el) => el.classList.remove('focused'));
            span.classList.add('focused');
        });
        if (!firstLineElement) {
            firstLineElement = span;
        }
        simplifiedTextRef.appendChild(span);
    });
    if (firstLineElement) {
        firstLineElement.classList.add('focused');
    }
}

function getSimplifiedOutputPlainText() {
    if (!simplifiedTextRef) {
        return '';
    }
    if (typeof simplifiedTextRef.innerText === 'string') {
        return simplifiedTextRef.innerText;
    }
    if (typeof simplifiedTextRef.textContent === 'string') {
        return simplifiedTextRef.textContent;
    }
    return '';
}

window.addEventListener('message', (event) => {
    const data = event.data;
    if (data && data.type === 'LEXILOOP_PREFILL_TEXT' && typeof data.text === 'string') {
        pendingPrefillText = data.text;
        applyPrefillIfAny();
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const inputText = document.getElementById('inputText');
    const simplifyBtn = document.getElementById('simplifyBtn');
    const simplifiedText = document.getElementById('simplifiedText');
    const loader = document.getElementById('loader');
    const fontFamilySelect = document.getElementById('font-family');
    const fontSizeInput = document.getElementById('font-size');
    const ttsBtn = document.getElementById('ttsBtn');
    const pdfInput = document.getElementById('pdfInput');
    const loadPdfBtn = document.getElementById('loadPdfBtn');
    const pdfStatus = document.getElementById('pdfStatus');

    inputTextRef = inputText;
    simplifiedTextRef = simplifiedText;
    applyPrefillIfAny();

    simplifyBtn.addEventListener('click', async () => {
        const textToSimplify = inputText.value.trim();
        if (!textToSimplify) {
            simplifiedText.textContent = 'Please paste some text into the box above.';
            return;
        }

        loader.style.display = 'block';
        simplifiedText.textContent = '';
        simplifyBtn.disabled = true;

        try {
            // Call API via background script
            const response = await new Promise((resolve, reject) => {
                chrome.runtime.sendMessage(
                    { type: 'LEXILOOP_API_REQUEST', text: textToSimplify },
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

            renderSimplifiedTextLines(response.trim());
        } catch (error) {
            console.error('Error simplifying text:', error);
            simplifiedText.textContent = `An error occurred: ${error.message}.`;
        } finally {
            loader.style.display = 'none';
            simplifyBtn.disabled = false;
        }
    });

    fontFamilySelect?.addEventListener('change', (e) => {
        simplifiedText.style.fontFamily = e.target.value;
    });

    fontSizeInput?.addEventListener('input', (e) => {
        simplifiedText.style.fontSize = `${e.target.value}px`;
    });

    // PDF upload - extract text using PDF.js from browser or simple file reader
    if (pdfInput && loadPdfBtn && pdfStatus) {
        loadPdfBtn.addEventListener('click', async () => {
            const file = pdfInput.files && pdfInput.files[0];
            if (!file) {
                pdfStatus.textContent = 'Please choose a PDF file first.';
                return;
            }

            if (file.type && file.type !== 'application/pdf') {
                pdfStatus.textContent = 'Selected file is not a PDF.';
                return;
            }

            pdfStatus.textContent = 'PDF reading is not available in extension mode. Please copy and paste text manually.';
        });
    }

    if (ttsBtn) {
        ttsBtn.addEventListener('click', async () => {
            const text = getSimplifiedOutputPlainText().trim();
            if (!text) {
                return;
            }
            if (!('speechSynthesis' in window)) {
                alert('Text-to-speech is not supported in this browser.');
                return;
            }
            window.speechSynthesis.cancel();

            let voices = window.speechSynthesis.getVoices();
            if (voices.length === 0) {
                await new Promise(resolve => {
                    window.speechSynthesis.onvoiceschanged = () => {
                        voices = window.speechSynthesis.getVoices();
                        resolve();
                    };
                    setTimeout(resolve, 500);
                });
                voices = window.speechSynthesis.getVoices();
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;

            const preferredVoice = voices.find(v =>
                v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google'))
            ) || voices.find(v => v.lang.startsWith('en'));

            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }

            window.speechSynthesis.speak(utterance);
        });
    }
});
