/* script.js
 - preview upload
 - analyze using /api/analyze
 - chat via /api/chat (sends image context)
 - generate images via /api/image (style options incl. anime)
*/

let uploadedB64 = null;
let lastAnalysisText = '';

const previewWrap = document.getElementById('previewWrap');
const analysisBox = document.getElementById('analysisBox');
const chatHistory = document.getElementById('chatHistory');

document.getElementById('imageFile').addEventListener('change', async (e) => {
  clearAnalysis();
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const dataUrl = ev.target.result;
    previewWrap.innerHTML = `<div class="preview"><img src="${dataUrl}" /></div>`;
    uploadedB64 = dataUrl.split(',')[1];
  };
  reader.readAsDataURL(file);
});

function clearAnalysis(){
  previewWrap.innerHTML = '';
  analysisBox.textContent = 'Analysis will appear here.';
  uploadedB64 = null;
  lastAnalysisText = '';
  chatHistory.innerHTML = '';
  document.getElementById('outputImg').style.display = 'none';
}

function clearAll(){ document.getElementById('imageFile').value = ''; clearAnalysis(); }

/* Analyze image: POST to /api/analyze with { image_b64 } */
async function analyzeImage(){
  if (!uploadedB64) return alert('Select an image first');
  analysisBox.textContent = 'Analyzing...';
  try {
    const r = await fetch('/api/analyze', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ image_b64: uploadedB64 })
    });
    const json = await r.json();
    if (json.error) {
      analysisBox.textContent = 'Error: ' + json.error;
      return;
    }
    lastAnalysisText = json.analysis_text || JSON.stringify(json, null, 2);
    analysisBox.textContent = lastAnalysisText;
    if (json.caption) {
      appendChat('AI', 'Caption: ' + json.caption);
    }
  } catch (err) {
    analysisBox.textContent = 'Error: ' + (err.message || err);
  }
}

/* Chat: send message + image_context to /api/chat */
function appendChat(role, text) {
  const el = document.createElement('div');
  el.className = 'bubble ' + (role === 'You' ? 'me' : 'ai');
  el.innerHTML = `<strong style="display:block;font-size:13px;margin-bottom:6px">${role}</strong><div>${escapeHtml(text)}</div>`;
  chatHistory.appendChild(el);
  chatHistory.scrollTop = chatHistory.scrollHeight;
}
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

async function sendChat(){
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  appendChat('You', text);
  input.value = '';
  appendChat('AI', 'Thinking...');
  try {
    const r = await fetch('/api/chat', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ message: text, image_context: lastAnalysisText || null })
    });
    const json = await r.json();
    // remove last Thinking bubble
    const bubbles = chatHistory.querySelectorAll('.bubble.ai');
    if (bubbles.length) {
      const last = bubbles[bubbles.length - 1];
      if (last && last.textContent.includes('Thinking')) last.remove();
    }
    if (json.error) appendChat('AI', 'Error: ' + json.error);
    else appendChat('AI', json.reply || 'No reply');
  } catch (err) {
    appendChat('AI', 'Error: ' + (err.message || err));
  }
}

/* Generate image from prompt + style via /api/image */
async function generateImage(){
  const prompt = document.getElementById('imgPrompt').value || '';
  const style = document.getElementById('styleSelect').value || '';
  const full = (prompt + ' ' + style).trim();
  if (!full) { alert('Enter an image prompt'); return; }
  document.getElementById('imgStatus').style.display = 'inline';
  try {
    const r = await fetch('/api/image', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ prompt: full, size: '1024x1024' })
    });
    const json = await r.json();
    document.getElementById('imgStatus').style.display = 'none';
    if (json.error) return alert('Image error: ' + json.error);
    if (json.b64) {
      const out = document.getElementById('outputImg');
      out.src = 'data:image/png;base64,' + json.b64;
      out.style.display = 'block';
    } else if (json.url) {
      const out = document.getElementById('outputImg');
      out.src = json.url;
      out.style.display = 'block';
    } else {
      alert('No image returned');
    }
  } catch (err) {
    document.getElementById('imgStatus').style.display = 'none';
    alert('Error: ' + (err.message || err));
  }
}
