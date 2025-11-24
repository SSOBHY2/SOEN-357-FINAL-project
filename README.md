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

--------------------
 HOW TO USE THE REACT VERSION
--------------------

Go to the lexiloop-react-extension folder

If you want to use the web version just run npm run dev

If you want to build the extension version run npm run build and then follow the same steps as above to load the unpacked extension but select the dist folder inside lexiloop-react-extension

---------------------
 BACKEND SETUP
---------------------

If you are on Linux or MacOS, navigate to the lexiloop-backend folder and run the setup.sh script, be sure to have python3 installed or you gonna run into issues

If you are on windows, good luck lol
