// 声の日記 Voice diary: record audio, optional live transcript, stored on the phone in IndexedDB.
import { $, $$, esc, fmt, toast } from './util.js';
import * as store from './store.js';
import { jp } from './glossary.js';

const DB = 'kiokudo-diary', OS = 'entries';
function db() {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(OS, { keyPath: 'id' });
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  });
}
async function tx(mode, fn) { const d = await db(); return new Promise((res, rej) => { const t = d.transaction(OS, mode); const s = t.objectStore(OS); const out = fn(s); t.oncomplete = () => res(out && out.result !== undefined ? out.result : out); t.onerror = () => rej(t.error); }); }
const all = () => tx('readonly', s => s.getAll());
const put = e => tx('readwrite', s => s.put(e));
const del = id => tx('readwrite', s => s.delete(id));

export async function diaryCount() { try { return (await all()).length; } catch { return 0; } }

export async function renderDiary(root) {
  root.innerHTML = `<section class="page fade diary">
    <header class="ph"><h1>${jp('声の日記')} <span>Voice diary</span></h1>
    <p class="sub">Talk through your session: what worked, which images failed, how you felt. Recordings stay on this phone.</p></header>
    <div class="rec-card">
      <button class="recbtn" aria-label="Start recording"><span class="rings"><i></i><i></i><i></i></span><span class="dot"></span></button>
      <p class="rec-time">Tap to record</p>
      <p class="live" aria-live="polite"></p>
      <div class="rec-save hidden">
        <label class="field">Title<input class="rtitle" maxlength="80" placeholder="e.g. Speed cards, 3:10, mixed up ♥8 and ♦8"></label>
        <label class="field">Notes / transcript<textarea class="rnote" rows="3"></textarea></label>
        <div class="row"><button class="btn ghost" data-a="discard">Discard</button><button class="btn" data-a="save">Save entry</button></div>
      </div>
    </div>
    <div class="prompts"><p class="hint">Ideas to talk about:</p><div class="chips">${['Today\'s scores', 'Images that failed', 'Palace problems', 'Focus and nerves', 'Tomorrow\'s target'].map(p => `<span class="chip">${p}</span>`).join('')}</div></div>
    <h2 class="sec">Entries</h2><div class="entries"><p class="hint">Loading…</p></div>
  </section>`;

  let rec = null, chunks = [], stream = null, t0 = 0, tick = null, blob = null, mime = '', recog = null, transcript = '';
  const btn = $('.recbtn', root), time = $('.rec-time', root), live = $('.live', root), saveBox = $('.rec-save', root);

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const startSTT = () => {
    if (!SR) return;
    try {
      recog = new SR(); recog.lang = store.S().settings.sttLang || 'en-US'; recog.continuous = true; recog.interimResults = true;
      recog.onresult = e => { let fin = '', int = ''; for (let i = 0; i < e.results.length; i++) { const r = e.results[i]; (r.isFinal ? (fin += r[0].transcript + ' ') : (int += r[0].transcript)); } transcript = fin; live.textContent = (fin + int).trim(); };
      recog.onerror = () => {}; recog.onend = () => { if (rec && rec.state === 'recording') try { recog.start(); } catch {} };
      recog.start();
    } catch { recog = null; }
  };

  btn.onclick = async () => {
    if (rec && rec.state === 'recording') { rec.stop(); return; }
    if (!navigator.mediaDevices || !window.MediaRecorder) { toast('Recording is not supported in this browser.'); return; }
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
    catch { toast('Microphone permission was refused.'); return; }
    chunks = []; transcript = ''; live.textContent = '';
    mime = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm', 'audio/ogg'].find(m => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) || '';
    rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    rec.ondataavailable = e => e.data.size && chunks.push(e.data);
    rec.onstop = () => {
      clearInterval(tick); stream.getTracks().forEach(t => t.stop()); recog && recog.stop(); recog = null;
      blob = new Blob(chunks, { type: rec.mimeType || mime || 'audio/webm' });
      btn.classList.remove('on'); btn.setAttribute('aria-label', 'Start recording');
      time.textContent = `Recorded ${fmt((Date.now() - t0) / 1000)}`;
      saveBox.classList.remove('hidden');
      $('.rnote', root).value = transcript.trim();
      $('.rtitle', root).focus();
    };
    rec.start(250); t0 = Date.now(); btn.classList.add('on'); btn.setAttribute('aria-label', 'Stop recording');
    saveBox.classList.add('hidden');
    tick = setInterval(() => time.textContent = `● ${fmt((Date.now() - t0) / 1000)}  · tap to stop`, 250);
    startSTT();
  };

  $('[data-a=discard]', root).onclick = () => { blob = null; saveBox.classList.add('hidden'); time.textContent = 'Tap to record'; live.textContent = ''; };
  $('[data-a=save]', root).onclick = async () => {
    if (!blob) return;
    const e = { id: Date.now(), date: new Date().toISOString(), title: $('.rtitle', root).value.trim() || 'Training note', note: $('.rnote', root).value.trim(), blob, mime: blob.type, secs: Math.round((Date.now() - t0) / 1000) };
    try { await put(e); store.logDay(); toast('Saved to your diary'); } catch (err) { toast('Could not save: storage is full or blocked.'); return; }
    blob = null; saveBox.classList.add('hidden'); time.textContent = 'Tap to record'; live.textContent = ''; $('.rtitle', root).value = '';
    list();
  };
  $$('.prompts .chip', root).forEach(c => c.onclick = () => { $('.rtitle', root).value = c.textContent; });

  const list = async () => {
    const box = $('.entries', root);
    let items = [];
    try { items = (await all()).sort((a, b) => b.id - a.id); } catch { box.innerHTML = '<p class="hint">Diary storage is not available in this browser mode.</p>'; return; }
    if (!items.length) { box.innerHTML = '<p class="hint">No entries yet. Your first recording will appear here.</p>'; return; }
    box.innerHTML = items.map(e => { const d = new Date(e.date); return `<article class="entry" data-id="${e.id}">
      <div class="eh"><div><b>${esc(e.title)}</b><small>${d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })} · ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · ${fmt(e.secs || 0)}</small></div></div>
      ${e.note ? `<p class="enote">${esc(e.note)}</p>` : ''}
      <audio controls preload="none"></audio>
      <div class="row"><button class="btn ghost small" data-a="dl">Download</button><button class="btn ghost small danger" data-a="del">Delete</button></div></article>`; }).join('');
    $$('.entry', box).forEach(el => {
      const e = items.find(x => x.id === +el.dataset.id); const url = URL.createObjectURL(e.blob);
      $('audio', el).src = url;
      $('[data-a=dl]', el).onclick = () => { const a = document.createElement('a'); a.href = url; a.download = `kiokudo-diary-${e.date.slice(0, 16).replace(/[:T]/g, '-')}.${(e.mime || '').includes('mp4') ? 'm4a' : 'webm'}`; a.click(); };
      $('[data-a=del]', el).onclick = async () => { if (!confirm('Delete this diary entry?')) return; await del(e.id); list(); };
    });
  };
  list();
  return () => { if (rec && rec.state === 'recording') rec.stop(); };
}
