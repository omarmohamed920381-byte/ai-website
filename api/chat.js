// api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST' });

  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_KEY) return res.status(500).json({ error: 'Missing OPENAI_API_KEY' });

  const { message, image_context } = req.body || {};
  if (!message) return res.status(400).json({ error: 'No message' });

  try {
    const messages = [];
    if (image_context) {
      messages.push({ role: 'system', content: 'Image context (for reference, do not invent):\n' + image_context });
    } else {
      messages.push({ role: 'system', content: 'You are an assistant that answers questions about images concisely.' });
    }
    messages.push({ role: 'user', content: message });

    const payload = {
      model: 'gpt-4o-mini', // change to gpt-4.1 or gpt-3.5-turbo if needed
      messages,
      max_tokens: 600,
      temperature: 0.2
    };

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!r.ok) {
      const txt = await r.text();
      return res.status(500).json({ error: 'OpenAI chat error: ' + txt });
    }

    const data = await r.json();
    const reply = data.choices && data.choices[0] && (data.choices[0].message?.content || data.choices[0].text) ? (data.choices[0].message?.content || data.choices[0].text) : null;
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
