// api/analyze.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST' });

  const { image_b64 } = req.body || {};
  if (!image_b64) return res.status(400).json({ error: 'No image_b64 provided' });

  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_KEY) return res.status(500).json({ error: 'Server missing OPENAI_API_KEY' });

  try {
    const payload = {
      model: 'gpt-4o-mini', // replace with a model available to your account if needed
      input: [
        {
          role: 'user',
          content: [
            { type: 'input_text', text: 'Analyze the image: give a one-sentence caption, list visible objects, detect people, read any visible text (OCR) and list any safety concerns. Keep bullet points and a short caption.'},
            { type: 'input_image', image: { b64: image_b64 } }
          ]
        }
      ]
    };

    const r = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!r.ok) {
      const text = await r.text();
      return res.status(500).json({ error: 'OpenAI error: ' + text });
    }

    const data = await r.json();

    // Extract output text
    let analysisText = '';
    if (Array.isArray(data.output)) {
      analysisText = data.output.map(block => {
        if (block.content && Array.isArray(block.content)) {
          return block.content.map(c => c.text || c.plain_text || '').join('');
        }
        return block.text || block.message || '';
      }).join('\n\n');
    } else if (data.output_text) {
      analysisText = data.output_text;
    } else {
      analysisText = JSON.stringify(data, null, 2);
    }

    // Try to get a short caption heuristically
    let caption = null;
    if (analysisText) {
      const lines = analysisText.split('\n').map(s => s.trim()).filter(Boolean);
      caption = lines.find(l => /caption[:\-]/i.test(l)) || lines.find(l => l.split(' ').length < 20) || null;
      if (caption) caption = caption.replace(/^(caption[:\-\s]*)/i, '').trim();
    }

    res.json({ analysis_text: analysisText, caption });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
