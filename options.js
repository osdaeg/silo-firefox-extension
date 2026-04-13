const status = document.getElementById('status');

function showStatus(msg, type) {
  status.textContent = msg;
  status.className = `status ${type}`;
  if (type === 'ok') setTimeout(() => status.className = 'status', 3000);
}

// Load saved config
browser.storage.local.get(['siloHost', 'siloToken'], result => {
  if (result.siloHost) document.getElementById('silo-host').value = result.siloHost;
  if (result.siloToken) document.getElementById('silo-token').value = result.siloToken;
});

document.getElementById('save-btn').addEventListener('click', () => {
  const host = document.getElementById('silo-host').value.trim().replace(/\/$/, '');
  const token = document.getElementById('silo-token').value.trim();
  if (!host || !token) {
    showStatus('✕ Completá ambos campos', 'error');
    return;
  }
  browser.storage.local.set({ siloHost: host, siloToken: token }, () => {
    showStatus('✔ Configuración guardada', 'ok');
  });
});

document.getElementById('test-btn').addEventListener('click', async () => {
  const host = document.getElementById('silo-host').value.trim().replace(/\/$/, '');
  const token = document.getElementById('silo-token').value.trim();
  if (!host || !token) {
    showStatus('✕ Completá ambos campos', 'error');
    return;
  }
  showStatus('● Probando conexión...', 'ok');
  try {
    const res = await fetch(`${host}/collections`, {
      headers: { 'Authorization': `Bearer ${token}` },
      signal: AbortSignal.timeout(5000)
    });
    if (res.ok) {
      const cols = await res.json();
      showStatus(`✔ Conectado — ${cols.length} colección(es)`, 'ok');
    } else {
      showStatus(`✕ Error HTTP ${res.status}`, 'error');
    }
  } catch (e) {
    showStatus('✕ Servidor no disponible', 'error');
  }
});
