// Server statico + endpoint /api/invia per il form contatti.
// L'endpoint invia la mail tramite l'API HTTPS di Resend.
// - NIENTE SMTP, NIENTE file PHP.
// - RESEND_API_KEY sta solo come variabile d'ambiente su Render,
//   non e' MAI esposta al client ne' al repo.
// - Il destinatario (saracalosci7@gmail.com) sta lato server e
//   non compare nel sorgente HTML/JS.

import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

// Body parsing — limiti volutamente bassi, il form e' piccolo.
app.use(express.json({ limit: '32kb' }));
app.use(express.urlencoded({ extended: false, limit: '32kb' }));

// Rate-limit leggero in-memory (per IP, per minuto)
const rlBuckets = new Map();
function rateLimit(ip, limit = 6, windowMs = 60 * 1000) {
  const now = Date.now();
  const rec = rlBuckets.get(ip) || { count: 0, resetAt: now + windowMs };
  if (now > rec.resetAt) {
    rec.count = 0;
    rec.resetAt = now + windowMs;
  }
  rec.count += 1;
  rlBuckets.set(ip, rec);
  return rec.count <= limit;
}

function clip(s, max) {
  return String(s == null ? '' : s).slice(0, max).trim();
}

function isEmail(s) {
  // Semplice sanity check — non valida tutto, ma esclude roba palese.
  return typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 200;
}

// Endpoint di salute (utile per ping e per Render)
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, hasKey: !!process.env.RESEND_API_KEY });
});

// Endpoint principale: riceve il form e manda la mail via Resend
app.post('/api/invia', async (req, res) => {
  try {
    const ip = (req.headers['x-forwarded-for'] || req.ip || '').toString().split(',')[0].trim();
    if (!rateLimit(ip)) {
      return res.status(429).json({ ok: false, error: 'Troppi invii, riprova tra poco.' });
    }

    const body = req.body || {};

    // Honeypot anti-bot: campo _honey nascosto nel form HTML.
    // Se un bot lo ha riempito, fingiamo successo e scartiamo.
    if (body._honey) {
      return res.json({ ok: true, skipped: true });
    }

    const nome = clip(body.nome, 200);
    const email = clip(body.email, 200);
    const quartiere = clip(body.quartiere, 200);
    const messaggio = clip(body.messaggio, 5000);

    if (!nome || !messaggio || !isEmail(email)) {
      return res.status(400).json({ ok: false, error: 'Campi obbligatori mancanti o email non valida.' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY mancante');
      return res.status(500).json({ ok: false, error: 'Server non configurato.' });
    }

    const to = process.env.MAIL_TO || 'saracalosci7@gmail.com';
    const from = process.env.MAIL_FROM || 'Sito Sara Calosci <onboarding@resend.dev>';

    const subject = 'Nuovo messaggio dal sito — Sara Calosci';

    const textBody = [
      'Nuovo messaggio dal sito sara-calosci-pistoia.onrender.com',
      '',
      `Nome:       ${nome}`,
      `Email:      ${email}`,
      `Quartiere:  ${quartiere || '-'}`,
      '',
      'Messaggio:',
      messaggio,
      '',
      '--',
      `IP: ${ip || 'n/a'}`,
      `Ricevuto: ${new Date().toISOString()}`
    ].join('\n');

    const htmlBody = `
<!DOCTYPE html>
<html><body style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.5;color:#1a1a1a">
  <h2 style="margin:0 0 12px;color:#0b2545">Nuovo messaggio dal sito</h2>
  <table style="border-collapse:collapse;margin:0 0 16px">
    <tr><td style="padding:4px 12px 4px 0;color:#555">Nome</td><td style="padding:4px 0"><strong>${escapeHtml(nome)}</strong></td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#555">Email</td><td style="padding:4px 0"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#555">Quartiere</td><td style="padding:4px 0">${escapeHtml(quartiere || '-')}</td></tr>
  </table>
  <div style="white-space:pre-wrap;padding:12px 16px;background:#f5f0e5;border-left:3px solid #b8893b;border-radius:4px">${escapeHtml(messaggio)}</div>
  <p style="color:#888;font-size:12px;margin-top:20px">Puoi rispondere direttamente a questa mail per scrivere a ${escapeHtml(email)}.</p>
</body></html>`.trim();

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        reply_to: email,
        text: textBody,
        html: htmlBody
      })
    });

    if (!r.ok) {
      const errText = await r.text().catch(() => '');
      console.error('Resend error', r.status, errText);
      return res.status(502).json({ ok: false, error: 'Invio non riuscito. Riprova tra poco.' });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error('Errore /api/invia', err);
    return res.status(500).json({ ok: false, error: 'Errore server.' });
  }
});

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Serve tutti gli asset statici del sito
app.use(express.static(__dirname, { maxAge: '1h', extensions: ['html'] }));

// SPA fallback — ogni GET non matchato serve index.html
app.get('*', (_req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server attivo su porta ${PORT}`);
  console.log(`RESEND_API_KEY ${process.env.RESEND_API_KEY ? 'presente' : 'MANCANTE'}`);
});
