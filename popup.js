const $ = id => document.getElementById(id);
const content = document.getElementById('main-content');

let config = {};
let collections = [];
let currentTab = null;

async function loadConfig() {
  return new Promise(resolve => {
    browser.storage.local.get(['siloHost', 'siloToken'], result => {
      config = result;
      resolve(result);
    });
  });
}

async function getActiveTab() {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

async function fetchCollections() {
  const res = await fetch(`${config.siloHost}/collections`, {
    headers: { 'Authorization': `Bearer ${config.siloToken}` },
    signal: AbortSignal.timeout(5000)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function saveLink(url, title, collectionId) {
  const body = {
    url,
    title: title || null,
    collection_id: collectionId ? parseInt(collectionId) : null
  };
  const res = await fetch(`${config.siloHost}/links`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.siloToken}`
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function renderNotConfigured() {
  content.innerHTML = `
    <div class="not-configured">
      <div style="font-size:24px; margin-bottom:12px; color: var(--green-border)">◻</div>
      Silo no está configurado.<br><br>
      <a id="open-options">Abrir configuración →</a>
    </div>
  `;
  document.getElementById('open-options').addEventListener('click', () => {
    browser.runtime.openOptionsPage();
  });
}

function renderForm(tab, cols) {
  const title = tab.title || '';
  const url = tab.url || '';

  content.innerHTML = `
    <div class="body">
      <div class="url-preview">
        <div class="url-title" title="${escHtml(title)}">${escHtml(title || url)}</div>
        <div title="${escHtml(url)}">${escHtml(url)}</div>
      </div>

      <div class="field">
        <label>Título</label>
        <input type="text" id="field-title" value="${escHtml(title)}" placeholder="opcional">
      </div>

      <div class="field">
        <label>Colección</label>
        <select id="field-collection">
          <option value="">— sin colección —</option>
          ${cols.map(c => `<option value="${c.id}">${escHtml(c.name)}</option>`).join('')}
        </select>
      </div>

      <div id="status" class="status"></div>

      <button class="save-btn" id="save-btn">▶ GUARDAR</button>
    </div>
  `;

  // Restore last used collection
  browser.storage.local.get('lastCollection', r => {
    if (r.lastCollection) {
      const sel = document.getElementById('field-collection');
      if (sel) sel.value = r.lastCollection;
    }
  });

  document.getElementById('save-btn').addEventListener('click', async () => {
    const btn = document.getElementById('save-btn');
    const status = document.getElementById('status');
    const titleVal = document.getElementById('field-title').value.trim();
    const colId = document.getElementById('field-collection').value;

    btn.disabled = true;
    status.className = 'status loading';
    status.textContent = '● GUARDANDO...';

    try {
      await saveLink(url, titleVal, colId);
      // Remember last used collection
      browser.storage.local.set({ lastCollection: colId });
      status.className = 'status ok';
      status.textContent = '✔ ENLACE GUARDADO';
      btn.textContent = '✔ LISTO';
      setTimeout(() => window.close(), 1200);
    } catch (e) {
      btn.disabled = false;
      status.className = 'status error';
      if (e.name === 'TimeoutError' || e.message.includes('NetworkError') || e.message.includes('Failed to fetch')) {
        status.textContent = '✕ SERVIDOR NO DISPONIBLE';
      } else {
        status.textContent = `✕ ERROR: ${e.message}`;
      }
    }
  });
}

function renderError(msg) {
  content.innerHTML = `
    <div class="body">
      <div class="status error" style="display:block">${escHtml(msg)}</div>
    </div>
  `;
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Init ────────────────────────────────────────────
document.getElementById('settings-btn').addEventListener('click', () => {
  browser.runtime.openOptionsPage();
});

(async () => {
  await loadConfig();

  if (!config.siloHost || !config.siloToken) {
    renderNotConfigured();
    return;
  }

  currentTab = await getActiveTab();

  // Show loading state
  content.innerHTML = `
    <div class="body">
      <div class="status loading" style="display:block">● CONECTANDO...</div>
    </div>
  `;

  try {
    collections = await fetchCollections();
    renderForm(currentTab, collections);
  } catch (e) {
    if (e.name === 'TimeoutError' || e.message.includes('NetworkError') || e.message.includes('Failed to fetch')) {
      renderError('✕ SERVIDOR NO DISPONIBLE');
    } else {
      renderError(`✕ ERROR: ${e.message}`);
    }
  }
})();
