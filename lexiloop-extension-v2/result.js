document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const originalText = document.getElementById('originalText');
    const simplifiedText = document.getElementById('simplifiedText');
    const copyBtn = document.getElementById('copyBtn');
    const closeBtn = document.getElementById('closeBtn');
    const successMsg = document.getElementById('successMsg');
    const loading = document.getElementById('loading');
    const result = document.getElementById('result');

    // Accessibility controls
    const ttsBtn = document.getElementById('ttsBtn');
    const fontIncrease = document.getElementById('fontIncrease');
    const fontDecrease = document.getElementById('fontDecrease');
    const fontIndicator = document.getElementById('fontIndicator');

    // Theme controls
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const themeLabel = document.getElementById('themeLabel');

    // Font size state
    const fontSizes = ['font-small', 'font-medium', 'font-large', 'font-xlarge'];
    const fontLabels = ['S', 'M', 'L', 'XL'];
    let currentFontIndex = 1; // Start at medium

    // TTS state
    let isSpeaking = false;
    let speechUtterance = null;

    // Theme state
    let isDarkMode = false;

    // ==================== UI Update Functions ====================

    function updateUI(data) {
        if (!data) return;

        const { original, simplified, status } = data;

        if (status === 'loading') {
            if (loading) loading.style.display = 'block';
            if (result) result.style.display = 'none';
        } else {
            if (loading) loading.style.display = 'none';
            if (result) result.style.display = 'block';

            if (originalText && original) {
                originalText.textContent = original.length > 500
                    ? original.substring(0, 500) + '...'
                    : original;
            }

            if (simplifiedText) {
                simplifiedText.textContent = simplified || 'Processing...';
            }
        }
    }

    // ==================== Font Size Controls ====================

    function updateFontSize() {
        const textBoxes = document.querySelectorAll('.text-box');
        textBoxes.forEach(box => {
            // Remove all font size classes
            fontSizes.forEach(size => box.classList.remove(size));
            // Add current font size class
            box.classList.add(fontSizes[currentFontIndex]);
        });

        // Update indicator
        if (fontIndicator) {
            fontIndicator.textContent = fontLabels[currentFontIndex];
        }

        // Save preference
        chrome.storage.local.set({ lexiloop_font_size: currentFontIndex });
    }

    function increaseFontSize() {
        if (currentFontIndex < fontSizes.length - 1) {
            currentFontIndex++;
            updateFontSize();
        }
    }

    function decreaseFontSize() {
        if (currentFontIndex > 0) {
            currentFontIndex--;
            updateFontSize();
        }
    }

    // Load saved font size preference
    chrome.storage.local.get(['lexiloop_font_size'], (data) => {
        if (data.lexiloop_font_size !== undefined) {
            currentFontIndex = data.lexiloop_font_size;
            updateFontSize();
        }
    });

    if (fontIncrease) {
        fontIncrease.addEventListener('click', increaseFontSize);
    }

    if (fontDecrease) {
        fontDecrease.addEventListener('click', decreaseFontSize);
    }

    // ==================== Theme Toggle (Light/Dark Mode) ====================

    function updateTheme() {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            if (themeIcon) themeIcon.textContent = '☀️';
            if (themeLabel) themeLabel.textContent = 'Light';
            if (themeToggle) themeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            document.body.classList.remove('dark-mode');
            if (themeIcon) themeIcon.textContent = '🌙';
            if (themeLabel) themeLabel.textContent = 'Dark';
            if (themeToggle) themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
        // Save preference
        chrome.storage.local.set({ lexiloop_dark_mode: isDarkMode });
    }

    function toggleTheme() {
        isDarkMode = !isDarkMode;
        updateTheme();
    }

    // Load saved theme preference
    chrome.storage.local.get(['lexiloop_dark_mode'], (data) => {
        if (data.lexiloop_dark_mode !== undefined) {
            isDarkMode = data.lexiloop_dark_mode;
            updateTheme();
        }
    });

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // ==================== Text-to-Speech (TTS) ====================

    // Helper function to get voices (handles async loading)
    function getVoicesAsync() {
        return new Promise((resolve) => {
            let voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                resolve(voices);
                return;
            }
            // Voices not loaded yet, wait for them
            window.speechSynthesis.onvoiceschanged = () => {
                voices = window.speechSynthesis.getVoices();
                resolve(voices);
            };
            // Fallback timeout in case onvoiceschanged never fires
            setTimeout(() => {
                resolve(window.speechSynthesis.getVoices());
            }, 1000);
        });
    }

    async function speak(text) {
        // Check if speechSynthesis is available
        if (!window.speechSynthesis) {
            console.error('Speech synthesis not supported');
            alert('Text-to-speech is not supported in this browser.');
            return;
        }

        // Cancel any ongoing speech
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }

        // Wait for voices to load
        const voices = await getVoicesAsync();
        console.log('Available voices:', voices.length);

        speechUtterance = new SpeechSynthesisUtterance(text);
        speechUtterance.rate = 0.9; // Slightly slower for clarity
        speechUtterance.pitch = 1;

        // Try to use a natural-sounding voice
        const preferredVoice = voices.find(v =>
            v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google'))
        ) || voices.find(v => v.lang.startsWith('en'));

        if (preferredVoice) {
            speechUtterance.voice = preferredVoice;
            console.log('Using voice:', preferredVoice.name);
        }

        speechUtterance.onstart = () => {
            console.log('Speech started');
            isSpeaking = true;
            updateTTSButton();
        };

        speechUtterance.onend = () => {
            console.log('Speech ended');
            isSpeaking = false;
            updateTTSButton();
        };

        speechUtterance.onerror = (event) => {
            console.error('Speech error:', event.error);
            isSpeaking = false;
            updateTTSButton();
        };

        window.speechSynthesis.speak(speechUtterance);
    }

    function stopSpeech() {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
        isSpeaking = false;
        updateTTSButton();
    }

    function updateTTSButton() {
        if (ttsBtn) {
            if (isSpeaking) {
                ttsBtn.innerHTML = '<span aria-hidden="true">⏹️</span> Stop';
                ttsBtn.classList.add('speaking');
                ttsBtn.setAttribute('aria-label', 'Stop reading');
            } else {
                ttsBtn.innerHTML = '<span aria-hidden="true">🔊</span> Read Aloud';
                ttsBtn.classList.remove('speaking');
                ttsBtn.setAttribute('aria-label', 'Read simplified text aloud');
            }
        }
    }

    function toggleTTS() {
        if (isSpeaking) {
            stopSpeech();
        } else {
            const text = simplifiedText?.textContent;
            if (text && text.length > 0 && text !== 'Processing...') {
                speak(text);
            }
        }
    }

    if (ttsBtn) {
        ttsBtn.addEventListener('click', toggleTTS);
    }

    // Load voices (they may not be immediately available)
    if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
        };
    }

    // ==================== Load Data ====================

    // Load initial result from storage
    chrome.storage.local.get(['lexiloop_result'], (data) => {
        if (data.lexiloop_result) {
            updateUI(data.lexiloop_result);
        } else {
            if (loading) loading.style.display = 'none';
            if (result) result.style.display = 'block';
            if (originalText) originalText.textContent = 'No result found';
        }
    });

    // Listen for updates
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'local' && changes.lexiloop_result) {
            updateUI(changes.lexiloop_result.newValue);
        }
    });

    // ==================== Copy & Close ====================

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            if (simplifiedText) {
                navigator.clipboard.writeText(simplifiedText.textContent);
                if (successMsg) successMsg.classList.add('show');
                copyBtn.innerHTML = '✓ Copied!';
                setTimeout(() => {
                    if (successMsg) successMsg.classList.remove('show');
                    copyBtn.innerHTML = '📋 Copy Simplified';
                }, 2000);
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            // Stop any ongoing speech before closing
            stopSpeech();
            window.close();
        });
    }

    // Stop speech when window is closed/unloaded
    window.addEventListener('beforeunload', () => {
        stopSpeech();
    });
});
