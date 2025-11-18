document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('inputText');
    const simplifyBtn = document.getElementById('simplifyBtn');
    const simplifiedText = document.getElementById('simplifiedText');
    const loader = document.getElementById('loader');
    const fontFamilySelect = document.getElementById('font-family');
    const fontSizeInput = document.getElementById('font-size');

    // --- DeepSeek API Configuration ---
    const DEEPSEEK_API_KEY = 'sk-82c0ea79f27041378d0c9b9a9e056aee';
    const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

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
            const response = await fetch(DEEPSEEK_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        { "role": "system", "content": "You are a helpful assistant that simplifies complex text for English language learners and people with dyslexia. Keep the original meaning but use simpler vocabulary and sentence structures." },
                        { "role": "user", "content": `Simplify the following text: ${textToSimplify}` }
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error: ${errorData.error.message}`);
            }

            const data = await response.json();
            if (data.choices && data.choices.length > 0) {
                simplifiedText.textContent = data.choices[0].message.content.trim();
            } else {
                simplifiedText.textContent = 'Sorry, the simplification could not be generated.';
            }
        } catch (error) {
            console.error('Error simplifying text:', error);
            simplifiedText.textContent = `An error occurred: ${error.message}. Please check the console for details.`;
        } finally {
            loader.style.display = 'none';
            simplifyBtn.disabled = false;
        }
    });

    // --- Adaptive Formatting Controls ---
    fontFamilySelect.addEventListener('change', (e) => {
        simplifiedText.style.fontFamily = e.target.value;
    });

    fontSizeInput.addEventListener('input', (e) => {
        simplifiedText.style.fontSize = `${e.target.value}px`;
    });
});