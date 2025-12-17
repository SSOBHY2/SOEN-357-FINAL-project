# LexiLoop - Text Simplification Chrome Extension

LexiLoop is a self-contained Chrome extension that simplifies complex text for ESL learners and individuals with reading difficulties. It uses AI (DeepSeek) directly from the extension - no backend server required!

## Features

- **One-Click Simplification**: Select text → Click "Simplify" button
- **Context Menu**: Right-click selected text → "Simplify with LexiLoop"
- **Keyboard Shortcuts**: Ctrl+Shift+S to simplify, Ctrl+Shift+L for popup
- **Accessibility**: Text-to-speech, adjustable font sizes, dark mode
- **Works Everywhere**: On any webpage, no server needed

## Installation

1. **Download/Clone** this repository

2. **Open Chrome** and go to `chrome://extensions/`

3. **Enable Developer mode** (toggle in top-right corner)

4. **Click "Load unpacked"** and select the `lexiloop-extension-v2` folder

5. **Done!** The LexiLoop icon appears in your toolbar

## Usage

### Method 1: Quick Button
1. Select any text on a webpage
2. Click the "Simplify" button that appears
3. View the simplified result

### Method 2: Context Menu
1. Select text on any webpage
2. Right-click → "Simplify with LexiLoop"

### Method 3: Keyboard Shortcut
1. Select text
2. Press **Ctrl+Shift+S** (or **Cmd+Shift+S** on Mac)

### Method 4: Popup
1. Click the LexiLoop icon in toolbar
2. Paste or type text
3. Click "Simplify Text"

## Configuration

The API key is stored in `config.js`. To use your own key:

1. Open `lexiloop-extension-v2/config.js`
2. Replace the `DEEPSEEK_API_KEY` value with your key
3. Reload the extension in `chrome://extensions/`

Get an API key from: https://platform.deepseek.com/

## Project Structure

```
lexiloop-extension-v2/
├── manifest.json      # Extension configuration
├── config.js          # API key and settings
├── background.js      # Service worker (API calls)
├── contentScript.js   # Page interaction
├── popup.html/js      # Extension popup
├── panel.html/js      # Full panel interface
├── result.html/js     # Results display
└── icon.png           # Extension icon
```

## Troubleshooting

### "API error" or simplification fails
- Check that your API key in `config.js` is valid
- Ensure you have internet connection
- Try reloading the extension

### Extension doesn't appear
- Go to `chrome://extensions/`
- Make sure LexiLoop is enabled
- Click the refresh icon

### Keyboard shortcuts don't work
- Go to `chrome://extensions/shortcuts`
- Check/set your preferred shortcuts

## Requirements

- **Chrome or Edge browser** (Manifest V3 compatible)
- **DeepSeek API key** - Get from https://platform.deepseek.com/

## License

Created for SOEN 357 - User Interface Design at Concordia University.
