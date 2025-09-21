const form = document.getElementById('qr-form');
const urlInput = document.getElementById('url');
const btnGenerate = document.getElementById('btn-generate');
const btnDownload = document.getElementById('btn-download');
const img = document.getElementById('qr-image');
const placeholder = document.getElementById('placeholder');

function setLoading(loading) {
  btnGenerate.disabled = loading;
  btnGenerate.innerText = loading ? 'Generating...' : 'Generate';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const url = urlInput.value.trim();
  if (!url) return;

  setLoading(true);
  btnDownload.classList.add('disabled');
  img.classList.add('d-none');
  placeholder.classList.remove('d-none');
  placeholder.textContent = 'Sedang membuat QR code...';

  try {
    const resp = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    const data = await resp.json();
    if (!data.ok) {
      throw new Error(data.message || 'Gagal generate QR code.');
    }

    // Tampilkan QR (data URL) di <img>
    img.src = data.dataUrl;
    img.classList.remove('d-none');
    placeholder.classList.add('d-none');

    // Set link download ke endpoint PNG langsung agar filename rapi
    btnDownload.href = data.pngUrl;
    btnDownload.classList.remove('disabled');
  } catch (err) {
    placeholder.textContent = err.message || 'Terjadi kesalahan.';
    img.classList.add('d-none');
    btnDownload.classList.add('disabled');
  } finally {
    setLoading(false);
  }
});