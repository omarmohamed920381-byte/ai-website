// api/image.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST' });
  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_KEY) return res.status(500).json({ error: 'Missing OPENAI_API_KEY' });

  const { prompt, size = '1024x1024', n = 1 } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'No prompt' });

  try {
    const payload = { prompt, n, size, response_format: 'b64_json' };
    const r = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!r.ok) {
      const txt = await r.text();
      return res.status(500).json({ error: 'OpenAI Images error: ' + txt });
    }
    const data = await r.json();
    const b64 = data.data && data.data[0] && data.data[0].b64_json ? data.data[0].b64_json : null;
    if (!b64) return res.status(500).json({ error: 'No image returned' });
    res.json({ b64 });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
