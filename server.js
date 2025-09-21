// server.js
const express = require('express');
const path = require('path');
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine & static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Helper: validate URL sederhana
function isValidUrl(str) {
  try {
    const u = new URL(str);
    return ['http:', 'https:'].includes(u.protocol);
  } catch {
    return false;
  }
}

// Halaman utama
app.get('/', (req, res) => {
  res.render('index', { error: null });
});

// Endpoint gambar PNG langsung
app.get('/qrcode', async (req, res) => {
  const text = (req.query.text || '').trim();
  if (!text || !isValidUrl(text) || text.length > 2048) {
    return res.status(400).send('Invalid or missing URL.');
  }

  try {
    const pngBuffer = await QRCode.toBuffer(text, {
      type: 'png',
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 512
    });

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'inline; filename="qrcode.png"');
    res.send(pngBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to generate QR code.');
  }
});

// API generate (data URL + link PNG)
app.post('/api/generate', async (req, res) => {
  const { url } = req.body || {};
  const text = (url || '').trim();

  if (!text || !isValidUrl(text) || text.length > 2048) {
    return res.status(400).json({ ok: false, message: 'URL tidak valid. Gunakan http(s)://' });
  }

  try {
    const dataUrl = await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 512
    });
    const pngUrl = `/qrcode?text=${encodeURIComponent(text)}`;
    res.json({ ok: true, dataUrl, pngUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: 'Gagal generate QR code.' });
  }
});

// ---- penting: export untuk Vercel, listen hanya lokal ----
if (process.env.VERCEL) {
  module.exports = app; // Vercel akan pakai ini
} else {
  app.listen(PORT, () => {
    console.log(`QR Generator running at http://localhost:${PORT}`);
  });
  module.exports = app;
}