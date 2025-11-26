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

document.addEventListener('DOMContentLoaded', function() {
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

    const BACKEND_URL = CONFIG.BACKEND_URL || 'http://localhost:8000';

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
            const response = await fetch(`${BACKEND_URL}/simplify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: textToSimplify })
            });

            const data = await response.json();

            if (!response.ok) {
                const message = data.detail || 'The simplification service returned an error.';
                throw new Error(message);
            }

            if (data.simplified_text) {
                const output = data.simplified_text.trim();
                renderSimplifiedTextLines(output);
            } else {
                simplifiedText.textContent = 'Sorry, the simplification could not be generated.';
            }
        } catch (error) {
            console.error('Error simplifying text:', error);
            simplifiedText.textContent = `An error occurred: ${error.message}.`;
        } finally {
            loader.style.display = 'none';
            simplifyBtn.disabled = false;
        }
    });

    fontFamilySelect.addEventListener('change', (e) => {
        simplifiedText.style.fontFamily = e.target.value;
    });

    fontSizeInput.addEventListener('input', (e) => {
        simplifiedText.style.fontSize = `${e.target.value}px`;
    });

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

            pdfStatus.textContent = 'Uploading PDF to server...';

            try {
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch(`${BACKEND_URL}/pdf/extract`, {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (!response.ok) {
                    const message = data.detail || 'The PDF service returned an error.';
                    pdfStatus.textContent = message;
                    return;
                }

                const text = (data.text || '').trim();
                if (!text) {
                    pdfStatus.textContent = 'No text could be extracted from this PDF.';
                    return;
                }

                if (inputText.value) {
                    inputText.value = inputText.value + '\n\n' + text;
                } else {
                    inputText.value = text;
                }

                const pagesInfo = typeof data.pages === 'number' ? ` from ${data.pages} page(s)` : '';
                const nameInfo = data.filename ? ` of ${data.filename}` : '';
                pdfStatus.textContent = `PDF text loaded${pagesInfo}${nameInfo}. You can now click "Simplify Text".`;
            } catch (e) {
                console.error('Error sending PDF to backend', e);
                pdfStatus.textContent = 'Error sending PDF to the server.';
            }
        });
    }

    if (ttsBtn) {
        ttsBtn.addEventListener('click', () => {
            const text = getSimplifiedOutputPlainText().trim();
            if (!text) {
                return;
            }
            if (!('speechSynthesis' in window)) {
                return;
            }
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            window.speechSynthesis.speak(utterance);
        });
    }
});
