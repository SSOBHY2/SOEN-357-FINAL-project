 LexiLoop Extension - README
==============================

Thank you for using LexiLoop! This file explains how to install and use the browser extension.


--------------------
 WHAT YOU NEED
--------------------
- A modern web browser like Google Chrome, Microsoft Edge, or Brave.


------------------------------
 HOW TO INSTALL THE EXTENSION
------------------------------

You only need to do this once.

Step 1: Open Your Browser
   - Launch Google Chrome or a similar browser.

Step 2: Go to the Extensions Page
   - In the address bar at the top, type the following and press Enter:
     chrome://extensions

Step 3: Turn on Developer Mode
   - On the Extensions page, look for a switch labeled "Developer mode" in the top-right corner.
   - Click this switch to turn it ON. You will see some new buttons appear.

Step 4: Load the Extension
   - Click the button that says "Load unpacked".
   - A window will open, asking you to choose a folder.

Step 5: Select the LexiLoop Folder
   - Find and select the folder that contains all the LexiLoop files (manifest.json, popup.html, etc.).
   - IMPORTANT: Do NOT go inside the folder. Just click on the folder itself to highlight it, and then click "Select Folder".

That's it! The LexiLoop extension should now appear in your list of extensions and you will see its icon in your browser's toolbar.


--------------------
 HOW TO USE LEXILOOP
--------------------

Step 1: Pin the Icon (Recommended)
   - Click the puzzle piece icon in your browser's toolbar.
   - Find "LexiLoop" in the list and click the pin icon next to it. This will keep the LexiLoop icon visible in your toolbar for easy access.

Step 2: Open LexiLoop
   - Click on the LexiLoop icon in your toolbar. A small window will pop up.

Step 3: Add Your Text
   - Copy any complex text you want to simplify.
   - Paste it into the text box inside the LexiLoop window.

Step 4: Simplify!
   - Click the "Simplify Text" button.
   - Wait a few moments, and the simplified version of your text will appear in the box below.
   - You can also change the font and font size using the controls.


--------------------
 TROUBLESHOOTING
--------------------

"Failed to load extension" or "Could not load icon.png" error:
   - This means the icon file is missing.
   - Make sure a valid image file named exactly "icon.png" (all lowercase) is inside the LexiLoop folder along with all the other files.

---------------------
 PROJECT STRUCTURE
---------------------

- `lexiloop-extension/`
  - The plain JavaScript Chrome/Edge extension you have been editing.
  - Injects a LexiLoop panel into any page and talks to the backend.

- `lexiloop-backend/`
  - FastAPI backend that calls the DeepSeek API and parses PDFs.
  - Keeps your API key on the server instead of inside the extension.

- `lexiloop-react-extension/`
  - Optional React + Vite version (web app + buildable MV3 extension).

---------------------
 HOW TO RUN THE BACKEND API
---------------------

1. Install Python 3.11 or 3.12.

2. In a terminal, go to the backend folder:

       cd lexiloop-backend

3. Create a virtual environment (example for Python 3.12 on Windows):

       py -3.12 -m venv .venv

   On Mac/Linux you can use:

       python3 -m venv .venv

4. Activate the virtualenv:

   - **Windows (PowerShell):**

         .\.venv\Scripts\Activate

   - **Mac/Linux (bash/zsh):**

         source .venv/bin/activate

5. Install backend dependencies:

       pip install -r requirements.txt

6. Configure your DeepSeek API key:

       cp .env.example .env   # or create .env manually

   Then open `.env` and set:

       DEEPSEEK_API_KEY=sk-...your-key...

7. Start the FastAPI server:

       python run.py

   The API will be available at:

       http://localhost:8000

---------------------
 HOW TO RUN THE CHROME EXTENSION
---------------------

1. Make sure the backend is running on `http://localhost:8000`.

2. In `lexiloop-extension/config.js`, confirm:

       const CONFIG = {
           BACKEND_URL: 'http://localhost:8000'
       };

3. Open Chrome (or Edge) and go to:

       chrome://extensions

4. Turn on **Developer mode**.

5. Click **Load unpacked** and select the `lexiloop-extension` folder
   (the folder that contains `manifest.json`).

6. Pin the LexiLoop icon from the extensions menu so it is always visible.

7. On any normal web page:
   - Click the LexiLoop icon.
   - A large in-page LexiLoop panel opens.
   - You can:
     - Type or paste text and click **Simplify Text** (uses the backend `/simplify` endpoint).
     - Upload a PDF and click **Load PDF Text** (uses the backend `/pdf/extract` endpoint).
     - Adjust font & size, or use **Read Aloud** for text-to-speech.

---------------------
 OPTIONAL: REACT VERSION
---------------------

If you want to run the React-based version in `lexiloop-react-extension/`:

1. Install Node.js (version 18+ recommended).
2. In a terminal:

       cd lexiloop-react-extension
       npm install

3. To run the web app during development:

       npm run dev

4. To build an extension bundle from the React code:

       npm run build

   Then load the `dist/` folder as an unpacked extension in `chrome://extensions`.
