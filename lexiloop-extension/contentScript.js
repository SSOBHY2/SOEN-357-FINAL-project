const LEXILOOP_PANEL_ID = 'lexiloop-panel-container';

function createLexiLoopPanel() {
  const existing = document.getElementById(LEXILOOP_PANEL_ID);
  if (existing) {
    existing.style.display = 'block';
    return;
  }

  const container = document.createElement('div');
  container.id = LEXILOOP_PANEL_ID;
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.right = '0';
  container.style.bottom = '0';
  container.style.left = '0';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.zIndex = '2147483647';
  container.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
  container.style.borderRadius = '8px';
  container.style.overflow = 'hidden';
  container.style.backgroundColor = '#f8f9fa';
  container.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.alignItems = 'center';
  header.style.justifyContent = 'space-between';
  header.style.backgroundColor = '#0056b3';
  header.style.color = '#ffffff';
  header.style.padding = '10px 16px';
  header.style.fontSize = '20px';

  const titleSpan = document.createElement('span');
  titleSpan.textContent = 'LexiLoop';
  header.appendChild(titleSpan);

  const headerButtons = document.createElement('div');
  headerButtons.style.display = 'flex';
  headerButtons.style.alignItems = 'center';

  const minimizeButton = document.createElement('button');
  minimizeButton.textContent = '_';
  minimizeButton.title = 'Minimize';
  minimizeButton.style.background = 'transparent';
  minimizeButton.style.border = 'none';
  minimizeButton.style.color = '#ffffff';
  minimizeButton.style.fontSize = '22px';
  minimizeButton.style.cursor = 'pointer';
  minimizeButton.style.marginRight = '4px';

  const closeButton = document.createElement('button');
  closeButton.textContent = 'X';
  closeButton.title = 'Close';
  closeButton.style.background = 'transparent';
  closeButton.style.border = 'none';
  closeButton.style.color = '#ffffff';
  closeButton.style.fontSize = '26px';
  closeButton.style.cursor = 'pointer';

  headerButtons.appendChild(minimizeButton);
  headerButtons.appendChild(closeButton);
  header.appendChild(headerButtons);

  const iframe = document.createElement('iframe');
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframe.src = chrome.runtime.getURL('panel.html');
  iframe.addEventListener('load', () => {
    let selectionText = '';
    const selection = window.getSelection && window.getSelection();
    if (selection) {
      selectionText = selection.toString();
    }
    if (selectionText && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        { type: 'LEXILOOP_PREFILL_TEXT', text: selectionText },
        '*'
      );
    }
  });

  minimizeButton.addEventListener('click', () => {
    if (iframe.style.display === 'none') {
      iframe.style.display = 'block';
      container.style.height = '100vh';
    } else {
      iframe.style.display = 'none';
      container.style.height = '40px';
    }
  });

  closeButton.addEventListener('click', () => {
    container.remove();
  });

  container.appendChild(header);
  container.appendChild(iframe);

  document.body.appendChild(container);
}

function toggleLexiLoopPanel() {
  const existing = document.getElementById(LEXILOOP_PANEL_ID);
  if (!existing) {
    createLexiLoopPanel();
  } else {
    if (existing.style.display === 'none') {
      existing.style.display = 'block';
    } else {
      existing.style.display = 'none';
    }
  }
}

chrome.runtime.onMessage.addListener((message) => {
  if (message && message.type === 'LEXILOOP_TOGGLE_PANEL') {
    toggleLexiLoopPanel();
  }
});
