// Training engine: ready → memorise → (delay) → recall → result.
import { $, $$, esc, shuffle, pick, fmt, same, toast, vibrate } from './util.js';
import { CONCRETE, ABSTRACT, FIRST, FIRST_F, FIRST_M, LAST, EVENT_WHO, EVENT_DO } from './pools.js';
import { photosReady, pickPhotos, preload } from './faces.js';
import { faceSVG, abstractSVG, cardHTML, cardLabel, SUITS, VALUES, SUIT_SYM } from './visuals.js';
import { MAJOR_WORDS } from './systems-data.js';
import * as store from './store.js';
import { jp } from './glossary.js';

export const TRAINER_INFO = {
  numbers: { name: 'Numbers', k: '数字', unit: 'digits' },
  binary: { name: 'Binary', k: '二進数', unit: 'digits' },
  words: { name: 'Words', k: '単語', unit: 'words' },
  cards: { name: 'Cards', k: '札', unit: 'cards' },
  names: { name: 'Names & faces', k: '名前と顔', unit: 'names' },
  dates: { name: 'Dates', k: '年号', unit: 'dates' },
  images: { name: 'Abstract images', k: '図形', unit: 'rows' },
  spoken: { name: 'Spoken numbers', k: '音声数字', unit: 'digits' },
  flash: { name: 'Image flashcards', k: '復習', unit: 'cards' },
  breath: { name: 'Breath counting', k: '数息観', unit: '' },
};

// ── Timer ─────────────────────────────────────────────
function timer(el, secs, onEnd) {
  const start = performance.now(); let done = false, raf;
  const bar = $('.tbar i', el), txt = $('.ttxt', el);
  const tick = () => {
    if (done) return;
    const left = secs - (performance.now() - start) / 1000;
    txt.textContent = fmt(left);
    bar.style.transform = `scaleX(${Math.max(0, left / secs)})`;
    el.classList.toggle('low', left < 30 && secs > 60);
    if (left <= 0) { done = true; onEnd(); return; }
    raf = requestAnimationFrame(tick);
  };
  tick();
  return { stop() { done = true; cancelAnimationFrame(raf); return (performance.now() - start) / 1000; }, elapsed: () => (performance.now() - start) / 1000 };
}
const timerHTML = label => `<div class="timer" role="timer"><div class="tlabel">${label}</div><div class="ttxt"></div><div class="tbar"><i></i></div></div>`;

// ── Generators ──────────────────────────────────────────
const digits = n => Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join('');
const bits = n => Array.from({ length: n }, () => (Math.random() < .5 ? 0 : 1)).join('');
function wordList(n, abstract = 0) {
  const a = shuffle(ABSTRACT), c = shuffle(CONCRETE), out = []; let ai = 0, ci = 0;
  for (let i = 0; i < n; i++) out.push(Math.random() < abstract && ai < a.length ? a[ai++] : c[ci++ % c.length]);
  return out;
}
function deck(n) {
  const one = SUITS.flatMap(s => VALUES.map(v => v + s));
  let out = []; while (out.length < n) out = out.concat(shuffle(one));
  return out.slice(0, n);
}

// ── Scoring helpers ─────────────────────────────────────
function rowScore(truthRows, ansRows, eq = (a, b) => a === b) {
  let score = 0, max = 0; const review = [];
  const lastAttempt = ansRows.reduce((m, r, i) => (r && r.length ? i : m), -1);
  truthRows.forEach((t, i) => {
    max += t.length;
    const a = ansRows[i] || [];
    const L = i === lastAttempt ? Math.min(lastFilled(a) + 1, t.length) : t.length;
    let err = 0; const marks = [];
    for (let k = 0; k < t.length; k++) {
      const ok = k < L && a[k] != null && a[k] !== '' && eq(a[k], t[k]);
      if (k < L && !ok) err++;
      marks.push({ t: t[k], a: a[k] ?? '', ok, used: k < L });
    }
    const pts = !a.length || L === 0 ? 0 : err === 0 ? L : err === 1 ? L / 2 : 0;
    score += pts; review.push({ pts, marks, len: t.length });
  });
  return { score, max, review };
}
const lastFilled = a => { for (let i = a.length - 1; i >= 0; i--) if (a[i] != null && String(a[i]).trim() !== '') return i; return -1; };
const chunk = (arr, n) => Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n));

// ── Trainers ────────────────────────────────────────────
const T = {};

T.numbers = {
  gen: c => ({ d: digits(c.count) }),
  rowLen: c => c.rowLen || (c.count <= 40 ? 20 : c.count <= 100 ? 20 : 40),
  memo(el, data, c) {
    const rl = this.rowLen(c);
    const rows = chunk([...data.d], rl);
    el.innerHTML = `<div class="tools"><span>Group</span>${[2, 3, 4, 6].map(g => `<button class="chip ${g === 2 ? 'on' : ''}" data-g="${g}">${g}</button>`).join('')}</div>
      <div class="digits">${rows.map((r, i) => `<div class="drow"><span class="rn">${i + 1}</span><span class="dd" data-row="${r.join('')}"></span></div>`).join('')}</div>`;
    const draw = g => $$('.dd', el).forEach(s => { const t = s.dataset.row; s.innerHTML = chunk([...t], g).map(x => `<b tabindex="0">${x.join('')}</b>`).join(''); });
    draw(2);
    $$('[data-g]', el).forEach(b => b.onclick = () => { $$('[data-g]', el).forEach(x => x.classList.remove('on')); b.classList.add('on'); draw(+b.dataset.g); });
    el.onclick = e => { const b = e.target.closest('.dd b'); if (b) { $$('.dd b.hl', el).forEach(x => x.classList.remove('hl')); b.classList.add('hl'); } };
  },
  recall(el, data, c) {
    const rl = this.rowLen(c), n = Math.ceil(c.count / rl);
    el.innerHTML = `<p class="hint">Type each row. Leave unsure digits out at the end of a row rather than guess.</p>` +
      Array.from({ length: n }, (_, i) => `<label class="rin"><span>${i + 1}</span><input inputmode="numeric" autocomplete="off" maxlength="${Math.min(rl, c.count - i * rl)}" data-i="${i}" aria-label="Row ${i + 1}"></label>`).join('');
    $$('input', el).forEach(inp => inp.addEventListener('input', () => { inp.value = inp.value.replace(/\D/g, ''); if (inp.value.length >= +inp.maxLength) { const nx = $(`input[data-i="${+inp.dataset.i + 1}"]`, el); nx && nx.focus(); } }));
  },
  collect: el => $$('input', el).map(i => [...i.value]),
  score(data, ans, c) {
    const rl = this.rowLen(c);
    const r = rowScore(chunk([...data.d], rl), ans);
    return { ...r, html: rowReview(r.review) };
  },
};

T.binary = {
  gen: c => ({ d: bits(c.rows * 30) }),
  memo(el, data) {
    const rows = chunk([...data.d], 30);
    el.innerHTML = `<div class="digits bin">${rows.map((r, i) => `<div class="drow"><span class="rn">${i + 1}</span><span class="dd">${chunk(r, 3).map(x => `<b>${x.join('')}</b>`).join('')}</span></div>`).join('')}</div>`;
  },
  recall(el, data, c) {
    el.innerHTML = `<p class="hint">30 digits per row. Use the 0 and 1 keys.</p>` + Array.from({ length: c.rows }, (_, i) => `<label class="rin"><span>${i + 1}</span><input inputmode="numeric" maxlength="30" data-i="${i}" aria-label="Row ${i + 1}"></label>`).join('');
    $$('input', el).forEach(inp => inp.addEventListener('input', () => { inp.value = inp.value.replace(/[^01]/g, ''); if (inp.value.length >= 30) { const nx = $(`input[data-i="${+inp.dataset.i + 1}"]`, el); nx && nx.focus(); } }));
  },
  collect: el => $$('input', el).map(i => [...i.value]),
  score(data, ans) { const r = rowScore(chunk([...data.d], 30), ans); return { ...r, html: rowReview(r.review) }; },
};

function rowReview(review) {
  return `<div class="review">${review.map((r, i) => `<div class="rrow"><span class="rn">${i + 1}</span><span class="rm">${r.marks.map(m => `<i class="${!m.used ? 'skip' : m.ok ? 'ok' : 'bad'}" title="${esc(m.a)}">${esc(m.t)}</i>`).join('')}</span><b>${r.pts}</b></div>`).join('')}</div>`;
}

T.words = {
  gen: c => ({ w: wordList(c.count, c.abstract || 0), order: c.peg ? shuffle([...Array(c.count).keys()]) : null }),
  memo(el, data, c) {
    const cols = chunk(data.w, c.colLen || 20);
    el.innerHTML = `<div class="wcols">${cols.map((col, ci) => `<ol start="${ci * (c.colLen || 20) + 1}">${col.map(w => `<li>${esc(w)}</li>`).join('')}</ol>`).join('')}</div>`;
  },
  recall(el, data, c) {
    if (data.order) {
      el.innerHTML = `<p class="hint">Out of order: what was on each peg?</p>` + data.order.map(i => `<label class="win"><span>#${i + 1}</span><input data-i="${i}" autocomplete="off" autocapitalize="off"></label>`).join('');
    } else {
      el.innerHTML = `<p class="hint">Write the words in order. Small spelling slips are accepted.</p><div class="wgrid">` + data.w.map((_, i) => `<label class="win"><span>${i + 1}</span><input data-i="${i}" autocomplete="off" autocapitalize="off" enterkeyhint="next"></label>`).join('') + '</div>';
    }
    $$('input', el).forEach(inp => inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); const all = $$('input', el); const nx = all[all.indexOf(inp) + 1]; nx && nx.focus(); } }));
  },
  collect(el, data) { const a = []; $$('input', el).forEach(i => a[+i.dataset.i] = i.value); return a; },
  score(data, ans, c) {
    if (c.colLen) {
      const r = rowScore(chunk(data.w, c.colLen), chunk(data.w.map((_, i) => ans[i] || ''), c.colLen).map(col => { const lf = lastFilled(col); return lf < 0 ? [] : col; }), (a, b) => same(a, b));
      return { ...r, html: wordReview(data.w, ans) };
    }
    const score = data.w.reduce((n, w, i) => n + (same(ans[i], w) ? 1 : 0), 0);
    return { score, max: data.w.length, html: wordReview(data.w, ans) };
  },
};
function wordReview(w, ans) {
  return `<ol class="wreview">${w.map((x, i) => { const ok = same(ans[i], x); return `<li class="${ok ? 'ok' : ans[i] ? 'bad' : 'skip'}"><b>${esc(x)}</b>${!ok && ans[i] ? ` <s>${esc(ans[i])}</s>` : ''}</li>`; }).join('')}</ol>`;
}

T.cards = {
  gen: c => ({ cards: deck(c.count) }),
  memo(el, data, c, ctl) {
    let i = 0, g = 1;
    el.innerHTML = `<div class="tools"><span>Show</span>${[1, 2, 3].map(n => `<button class="chip ${n === 1 ? 'on' : ''}" data-g="${n}">${n}</button>`).join('')}</div>
      <div class="cardstage" aria-live="polite"></div>
      <div class="cardnav"><button class="btn ghost" data-a="prev" aria-label="Previous">‹</button><span class="cpos"></span><button class="btn" data-a="next" aria-label="Next">›</button></div>
      <p class="hint">Tap the card or › to flip forward. Swipe also works.</p>`;
    const stage = $('.cardstage', el);
    const draw = () => {
      stage.innerHTML = data.cards.slice(i, i + g).map(id => cardHTML(id, 'deal')).join('');
      $('.cpos', el).textContent = `${Math.min(i + g, data.cards.length)} / ${data.cards.length}`;
    };
    const move = d => { i = Math.max(0, Math.min(data.cards.length - 1, i + d * g)); draw(); vibrate(5); if (c.speed && i + g >= data.cards.length) $('.cpos', el).textContent += ' · tap Done'; };
    $$('[data-g]', el).forEach(b => b.onclick = () => { $$('[data-g]', el).forEach(x => x.classList.remove('on')); b.classList.add('on'); g = +b.dataset.g; i = Math.floor(i / g) * g; draw(); });
    $('[data-a=next]', el).onclick = () => move(1); $('[data-a=prev]', el).onclick = () => move(-1);
    stage.onclick = () => move(1);
    let sx = null; stage.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
    stage.addEventListener('touchend', e => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) { e.preventDefault(); move(dx < 0 ? 1 : -1); } sx = null; });
    draw();
  },
  recall(el, data, c) {
    const maxUse = Math.ceil(data.cards.length / 52);
    const seq = [];
    el.innerHTML = `<div class="seq" aria-live="polite"></div>
      <div class="pickrow"><button class="btn ghost small" data-a="undo">Undo</button><span class="cnt"></span></div>
      <div class="picker">${SUITS.map(s => `<div class="prow">${VALUES.map(v => `<button class="pk ${s === 'H' || s === 'D' ? 'red' : ''}" data-c="${v + s}" aria-label="${cardLabel(v + s)}">${v === 'T' ? '10' : v}<small>${SUIT_SYM[s]}</small></button>`).join('')}</div>`).join('')}</div>`;
    const draw = () => {
      $('.seq', el).innerHTML = seq.map((id, k) => `<span class="sc ${id[1] === 'H' || id[1] === 'D' ? 'red' : ''}">${k + 1}·${cardLabel(id)}</span>`).join('') || '<span class="hint">Tap cards in the order you memorised them.</span>';
      $('.cnt', el).textContent = `${seq.length} / ${data.cards.length}`;
      $$('.pk', el).forEach(b => b.disabled = seq.filter(x => x === b.dataset.c).length >= maxUse || seq.length >= data.cards.length);
      const s = $('.seq', el); s.scrollLeft = s.scrollWidth;
    };
    el.onclick = e => { const b = e.target.closest('.pk'); if (b && !b.disabled) { seq.push(b.dataset.c); vibrate(5); draw(); } if (e.target.closest('[data-a=undo]')) { seq.pop(); draw(); } };
    el._seq = seq; draw();
  },
  collect: el => el._seq,
  score(data, ans) {
    let score = 0, first = null;
    data.cards.forEach((c, i) => { if (ans[i] === c) score++; else if (first == null) first = i; });
    const html = `<p>${first == null ? 'Perfect deck!' : `First error at card ${first + 1}.`}</p><div class="seq wrap">${data.cards.map((c, i) => `<span class="sc ${ans[i] === c ? 'ok' : 'bad'} ${c[1] === 'H' || c[1] === 'D' ? 'red' : ''}">${i + 1}·${cardLabel(c)}${ans[i] && ans[i] !== c ? ` <s>${cardLabel(ans[i])}</s>` : ''}</span>`).join('')}</div>`;
    return { score, max: data.cards.length, html, perfect: first == null };
  },
};

const faceBox = (p, size, credit = true) => p.photo
  ? `<figure class="ph" style="width:${size}px"><img src="${esc(p.photo.url)}" alt="Face to remember" width="${size}" height="${Math.round(size * 1.25)}" decoding="async">${credit ? `<figcaption>${esc(p.photo.by)} / Unsplash</figcaption>` : ''}</figure>`
  : faceSVG(p.seed, size);

T.names = {
  gen: c => {
    const photos = photosReady(c.count) ? pickPhotos(c.count) : [];
    const used = new Set();
    return {
      people: Array.from({ length: c.count }, (_, i) => {
        const ph = photos[i] || null, firsts = ph ? (ph.g === 'f' ? FIRST_F : FIRST_M) : FIRST;
        let f, l; do { f = pick(firsts); l = pick(LAST); } while (used.has(f + l)); used.add(f + l);
        return { f, l, seed: Math.floor(Math.random() * 1e6), photo: ph };
      }),
      order: shuffle([...Array(c.count).keys()]),
    };
  },
  prepare: data => data.people.some(p => p.photo) ? preload(data.people) : null,
  memo(el, data) { el.innerHTML = `<div class="faces">${data.people.map(p => `<div class="fc">${faceBox(p, 120)}<b>${esc(p.f)}</b><span>${esc(p.l)}</span></div>`).join('')}</div>`; },
  recall(el, data) {
    el.innerHTML = `<p class="hint">Faces are in a new order. 1 point per correct first name and per correct surname.</p><div class="faces">${data.order.map(i => `<div class="fc">${faceBox(data.people[i], 120)}<input data-i="${i}" data-k="f" placeholder="First" autocomplete="off" aria-label="First name"><input data-i="${i}" data-k="l" placeholder="Last" autocomplete="off" aria-label="Last name"></div>`).join('')}</div>`;
  },
  collect(el) { const a = {}; $$('input', el).forEach(i => { (a[i.dataset.i] ||= {})[i.dataset.k] = i.value; }); return a; },
  score(data, ans) {
    let score = 0;
    const html = `<div class="faces">${data.people.map((p, i) => { const a = ans[i] || {}; const f = same(a.f, p.f), l = same(a.l, p.l); score += f + l; return `<div class="fc">${faceBox(p, 90, false)}<b class="${f ? 'ok' : 'bad'}">${esc(p.f)}</b><span class="${l ? 'ok' : 'bad'}">${esc(p.l)}</span>${p.photo ? `<a class="credit" href="${esc(p.photo.link)}" target="_blank" rel="noopener">Photo: ${esc(p.photo.by)}</a>` : ''}</div>`; }).join('')}</div>`
      + (data.people.some(p => p.photo) ? '<p class="fine">Photos from <a href="https://unsplash.com/?utm_source=kiokudo&utm_medium=referral" target="_blank" rel="noopener">Unsplash</a>, free under the Unsplash License.</p>' : '');
    return { score, max: data.people.length * 2, html };
  },
};

T.dates = {
  gen: c => ({ items: Array.from({ length: c.count }, () => ({ y: 1000 + Math.floor(Math.random() * 1100), e: `${pick(EVENT_WHO)} ${pick(EVENT_DO)}` })), order: null }),
  memo(el, data) { data.order = shuffle([...data.items.keys()]); el.innerHTML = `<ul class="dates">${data.items.map(d => `<li><b>${d.y}</b><span>${esc(d.e)}</span></li>`).join('')}</ul>`; },
  recall(el, data) { el.innerHTML = `<p class="hint">+1 correct, −½ wrong, blank = 0.</p><ul class="dates">${data.order.map(i => `<li><input inputmode="numeric" maxlength="4" data-i="${i}" aria-label="Year"><span>${esc(data.items[i].e)}</span></li>`).join('')}</ul>`; },
  collect(el) { const a = {}; $$('input', el).forEach(i => a[i.dataset.i] = i.value.trim()); return a; },
  score(data, ans) {
    let score = 0;
    const html = `<ul class="dates">${data.items.map((d, i) => { const a = ans[i]; const ok = a && +a === d.y; if (a) score += ok ? 1 : -0.5; return `<li class="${ok ? 'ok' : a ? 'bad' : 'skip'}"><b>${d.y}</b><span>${esc(d.e)}${a && !ok ? ` <s>${esc(a)}</s>` : ''}</span></li>`; }).join('')}</ul>`;
    return { score: Math.max(0, Math.ceil(score)), max: data.items.length, html };
  },
};

T.images = {
  gen: c => ({ rows: Array.from({ length: c.rows }, () => Array.from({ length: 5 }, () => Math.floor(Math.random() * 1e6))) }),
  memo(el, data) { el.innerHTML = data.rows.map((r, i) => `<div class="irow"><span class="rn">${i + 1}</span>${r.map(s => `<div class="im">${abstractSVG(s, 56)}</div>`).join('')}</div>`).join(''); },
  recall(el, data) {
    data.shown = data.rows.map(r => shuffle(r.map((s, k) => ({ s, k }))));
    el.innerHTML = `<p class="hint">Tap the images of each row in their original order (1→5). Tap again to clear.</p>` + data.shown.map((r, i) => `<div class="irow" data-r="${i}"><span class="rn">${i + 1}</span>${r.map(o => `<button class="im" data-k="${o.k}" aria-label="image">${abstractSVG(o.s, 56)}<em></em></button>`).join('')}</div>`).join('');
    el._ans = data.rows.map(() => []);
    el.onclick = e => {
      const b = e.target.closest('.im'); if (!b) return;
      const r = +b.closest('.irow').dataset.r, k = +b.dataset.k, a = el._ans[r];
      const at = a.indexOf(k);
      if (at >= 0) a.splice(at, 1); else if (a.length < 5) a.push(k);
      $$(`.irow[data-r="${r}"] .im`, el).forEach(x => { const p = a.indexOf(+x.dataset.k); $('em', x).textContent = p >= 0 ? p + 1 : ''; x.classList.toggle('on', p >= 0); });
      vibrate(5);
    };
  },
  collect: el => el._ans,
  score(data, ans) {
    let score = 0;
    const html = data.rows.map((r, i) => { const a = ans[i] || []; const done = a.length === 5; const ok = done && a.every((k, j) => k === j); if (done) score += ok ? 5 : -1; return `<div class="irow ${ok ? 'ok' : done ? 'bad' : 'skip'}"><span class="rn">${i + 1}</span>${r.map(s => `<div class="im">${abstractSVG(s, 40)}</div>`).join('')}<b>${ok ? '+5' : done ? '−1' : '0'}</b></div>`; }).join('');
    return { score: Math.max(0, score), max: data.rows.length * 5, html };
  },
};

T.spoken = {
  gen: c => ({ d: digits(c.count) }),
  speechless: true,
  memo(el, data, c, ctl) {
    const synth = window.speechSynthesis;
    el.innerHTML = `<div class="spoken"><div class="spk"><i></i><i></i><i></i></div><p class="sp-n">Get ready…</p><p class="hint">Listen. Digits are read at one per second.</p></div>`;
    if (!synth) { $('.sp-n', el).textContent = 'Your browser cannot speak. Try Chrome or Safari.'; return; }
    const rate = store.S().settings.voiceRate || 1;
    let i = -3; const nEl = $('.sp-n', el);
    const say = t => { const u = new SpeechSynthesisUtterance(t); u.lang = 'en-GB'; u.rate = Math.min(1.6, rate * 1.1); synth.cancel(); synth.speak(u); };
    const step = () => {
      if (ctl.cancelled) return;
      if (i < 0) { nEl.textContent = `Starting in ${-i}`; i++; ctl.h = setTimeout(step, 1000); return; }
      if (i >= data.d.length) { nEl.textContent = 'Finished'; ctl.h = setTimeout(() => ctl.finish(), 800); return; }
      say(data.d[i]); nEl.textContent = `${i + 1} / ${data.d.length}`; el.querySelector('.spk').classList.remove('beat'); void el.offsetWidth; el.querySelector('.spk').classList.add('beat');
      i++; ctl.h = setTimeout(step, 1000);
    };
    step();
    ctl.cleanup = () => { clearTimeout(ctl.h); synth.cancel(); };
  },
  recall(el, data) { el.innerHTML = `<p class="hint">Type the digits in order. Score counts until your first error.</p><textarea inputmode="numeric" rows="5" aria-label="Spoken digits"></textarea>`; const t = $('textarea', el); t.oninput = () => t.value = t.value.replace(/\D/g, ''); },
  collect: el => $('textarea', el).value,
  score(data, ans) {
    let score = 0; while (score < data.d.length && ans[score] === data.d[score]) score++;
    const html = `<div class="review"><div class="rrow"><span class="rm">${[...data.d].map((t, k) => `<i class="${k < score ? 'ok' : k === score ? 'bad' : 'skip'}">${t}</i>`).join('')}</span></div></div>`;
    return { score, max: data.d.length, html };
  },
};

// ── Runner ──────────────────────────────────────────────
export function runTrainer(root, type, cfg, opts = {}) {
  const tr = T[type];
  const info = TRAINER_INFO[type] || { name: type, k: '' };
  const ctl = { cancelled: false };
  const free = !!opts.free;
  let data;

  const ready = () => {
    root.innerHTML = `<section class="trainer fade">
      <header class="th"><span class="tk">${jp(info.k) || ''}</span><h2>${esc(opts.title || info.name)}</h2></header>
      ${opts.task ? `<p class="task">${esc(opts.task)}</p>` : ''}
      ${free ? configForm(type, cfg) : ''}
      <dl class="cfg">${cfgSummary(type, cfg)}</dl>
      ${opts.target != null ? `<p class="target">Target: <b>${opts.target}</b> points</p>` : ''}
      ${type === 'names' ? (photosReady() ? '<p class="hint">Using real face photos from Unsplash.</p>' : '<p class="hint">Using drawn faces. For real photos, see <a href="#/settings">設定 Settings → Real face photos</a>.</p>') : ''}
      <button class="btn big" data-a="start">${jp('開始')} Start</button>
      ${opts.onCancel ? '<button class="btn ghost" data-a="back">Back</button>' : ''}
    </section>`;
    if (free) $$('.cfgform input, .cfgform select', root).forEach(i => i.onchange = () => { cfg[i.name] = i.type === 'checkbox' ? i.checked : +i.value; $('.cfg', root).innerHTML = cfgSummary(type, cfg); });
    $('[data-a=start]', root).onclick = memo;
    const b = $('[data-a=back]', root); if (b) b.onclick = () => opts.onCancel();
  };

  const memo = async () => {
    data = tr.gen(cfg);
    const prep = tr.prepare && tr.prepare(data);
    if (prep) { root.innerHTML = `<section class="trainer phase"><div class="loading"><div class="ripple-burst"><i></i><i></i><i></i></div><p>Loading faces…</p></div></section>`; await prep; if (ctl.cancelled) return; }
    root.innerHTML = `<section class="trainer phase">${tr.speechless ? '' : timerHTML('Memorise')}<div class="pbody"></div>
      <div class="pfoot">${tr.speechless ? '<button class="btn ghost" data-a="quit">Stop</button>' : '<button class="btn ghost" data-a="quit">Quit</button><button class="btn" data-a="done">Done</button>'}</div></section>`;
    const body = $('.pbody', root);
    let t;
    ctl.finish = () => { const used = t ? t.stop() : 0; ctl.memoSecs = used; ctl.cleanup && ctl.cleanup(); cfg.delay ? delay() : recall(); };
    tr.memo(body, data, cfg, ctl);
    if (!tr.speechless) t = timer($('.timer', root), cfg.memo, ctl.finish);
    const d = $('[data-a=done]', root); if (d) d.onclick = ctl.finish;
    $('[data-a=quit]', root).onclick = () => { ctl.cancelled = true; t && t.stop(); ctl.cleanup && ctl.cleanup(); ready(); };
  };

  const delay = () => {
    root.innerHTML = `<section class="trainer phase">${timerHTML('Distraction')}<div class="pbody"><p class="hint">Solve sums until the timer ends. This tests memory after a delay.</p><p class="sum"></p><input inputmode="numeric" class="sumin" aria-label="Answer"><p class="sumscore"></p></div></section>`;
    let a, b, n = 0; const p = $('.sum', root), inp = $('.sumin', root);
    const next = () => { a = 10 + Math.floor(Math.random() * 90); b = 10 + Math.floor(Math.random() * 90); p.textContent = `${a} + ${b} = ?`; inp.value = ''; inp.focus(); };
    inp.oninput = () => { if (+inp.value === a + b) { n++; $('.sumscore', root).textContent = `${n} solved`; next(); } };
    next();
    timer($('.timer', root), cfg.delay, recall);
  };

  const recall = () => {
    root.innerHTML = `<section class="trainer phase">${timerHTML('Recall')}<div class="pbody"></div><div class="pfoot"><button class="btn" data-a="submit">Submit</button></div></section>`;
    const body = $('.pbody', root);
    tr.recall(body, data, cfg);
    let submitted = false;
    const submit = () => { if (submitted) return; submitted = true; t.stop(); result(tr.collect(body, data)); };
    const t = timer($('.timer', root), cfg.recall || 300, submit);
    $('[data-a=submit]', root).onclick = submit;
    const first = $('input, textarea', body); first && setTimeout(() => first.focus({ preventScroll: true }), 50);
  };

  const result = ans => {
    const r = tr.score(data, ans, cfg);
    const pass = opts.target != null ? r.score >= opts.target : null;
    const rec = { trainer: type, score: r.score, max: r.max, secs: Math.round(ctl.memoSecs || 0), cfgKey: JSON.stringify(cfg), lesson: opts.lessonId || null };
    if (type === 'cards' && cfg.speed) rec.time = +(ctl.memoSecs || 0).toFixed(2), rec.perfect = !!r.perfect;
    const prevBest = store.bestFor(type);
    store.addResult(rec);
    const pb = !prevBest || r.score > prevBest.score;
    root.innerHTML = `<section class="trainer result fade">
      <div class="ripple-burst ${pass === false ? 'calm' : ''}"><i></i><i></i><i></i></div>
      <p class="rlabel">${pass ? `${jp('完了')} Passed` : pass === false ? 'Keep going, ' + jp('頑張って') : jp('お疲れ様')}</p>
      <p class="rscore"><b>${r.score}</b> / ${r.max}</p>
      ${type === 'cards' && cfg.speed ? `<p class="rtime">${r.perfect ? `Deck time: <b>${(ctl.memoSecs || 0).toFixed(1)} s</b>` : 'Time only counts for a perfect deck.'}</p>` : `<p class="rtime">Memorised in ${fmt(ctl.memoSecs || 0)}</p>`}
      ${pb && r.score > 0 ? '<p class="pb">New personal best</p>' : ''}
      ${opts.target != null ? `<p class="target">Target ${opts.target}</p>` : ''}
      <details class="rdetail" open><summary>Review your answers</summary>${r.html}</details>
      <div class="pfoot"><button class="btn ghost" data-a="again">Again</button><button class="btn" data-a="ok">Continue</button></div>
    </section>`;
    $('[data-a=again]', root).onclick = ready;
    $('[data-a=ok]', root).onclick = () => opts.onDone ? opts.onDone({ ...r, pass }) : ready();
    if (pass) vibrate([20, 40, 20]);
  };

  if (opts.autostart) memo(); else ready();
  return ctl;
}

function cfgSummary(type, c) {
  const items = [];
  if (type === 'binary') items.push(['Digits', c.rows * 30]); else if (type === 'images') items.push(['Rows', c.rows]); else if (c.count) items.push([TRAINER_INFO[type].unit || 'Items', c.count]);
  if (c.memo) items.push(['Memorise', fmt(c.memo)]);
  if (c.recall && type !== 'spoken') items.push(['Recall', fmt(c.recall)]);
  if (type === 'spoken') items.push(['Pace', '1 digit / s']);
  if (c.delay) items.push(['Delay', fmt(c.delay)]);
  if (c.peg) items.push(['Recall', 'out of order']);
  return items.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('');
}

function configForm(type, c) {
  const num = (name, label, min, max, step = 1) => `<label>${label}<input type="number" name="${name}" value="${c[name]}" min="${min}" max="${max}" step="${step}"></label>`;
  const f = [];
  if (type === 'binary') f.push(num('rows', 'Rows of 30', 1, 40));
  else if (type === 'images') f.push(num('rows', 'Rows of 5', 1, 60));
  else f.push(num('count', 'Amount', 4, type === 'cards' ? 520 : 1000));
  if (type !== 'spoken') f.push(num('memo', 'Memorise (s)', 10, 3600, 10), num('recall', 'Recall (s)', 30, 7200, 30));
  return `<div class="cfgform">${f.join('')}</div>`;
}

// ── Flashcards for your systems ──────────────────────────
export function runFlash(root, system, count, opts = {}) {
  const sys = store.S().systems[system] || {};
  let keys;
  if (system === 'cards') keys = SUITS.flatMap(s => VALUES.map(v => v + s));
  else keys = Array.from({ length: 100 }, (_, i) => String(i).padStart(2, '0'));
  const val = k => system === 'pao' ? (sys[k] ? [sys[k].p, sys[k].a, sys[k].o].filter(Boolean).join(' · ') : '') : (sys[k] || (system === 'n2' ? MAJOR_WORDS[k] + ' (starter)' : ''));
  const pool = keys.filter(k => val(k));
  if (!pool.length) { root.innerHTML = `<section class="trainer fade"><p>No images yet for this system. Add some in ${jp('型')} Systems first.</p><button class="btn" onclick="location.hash='#/systems'">Open Systems</button></section>`; return; }
  const due = shuffle(pool.filter(k => store.flashDue(system + ':' + k)));
  const rest = shuffle(pool.filter(k => !due.includes(k)));
  const list = due.concat(rest).slice(0, Math.min(count, pool.length));
  let i = 0, got = 0, t0, times = [];
  const show = () => {
    if (i >= list.length) return done();
    const k = list[i];
    root.innerHTML = `<section class="trainer phase"><div class="fprog"><i style="width:${i / list.length * 100}%"></i></div>
      <p class="hint center">${i + 1} / ${list.length} · see the image, then flip</p>
      <button class="flip big" aria-label="Flip card"><div class="front">${system === 'cards' ? cardHTML(k) : k}</div><div class="back">${esc(val(k))}</div></button>
      <div class="pfoot hidden" data-g><button class="btn ghost" data-a="miss">Missed</button><button class="btn" data-a="got">Got it</button></div></section>`;
    t0 = performance.now();
    const f = $('.flip', root);
    f.onclick = () => { if (f.classList.contains('on')) return; times.push((performance.now() - t0) / 1000); f.classList.add('on'); $('[data-g]', root).classList.remove('hidden'); };
    $('[data-a=got]', root).onclick = () => { store.flashGrade(system + ':' + k, true); got++; i++; show(); };
    $('[data-a=miss]', root).onclick = () => { store.flashGrade(system + ':' + k, false); i++; show(); };
  };
  const done = () => {
    const avg = times.reduce((a, b) => a + b, 0) / (times.length || 1);
    store.addResult({ trainer: 'flash', score: got, max: list.length, secs: Math.round(avg * 10) / 10, cfgKey: system });
    const pass = opts.target != null ? got >= opts.target : null;
    root.innerHTML = `<section class="trainer result fade"><div class="ripple-burst"><i></i><i></i><i></i></div>
      <p class="rlabel">${jp('お疲れ様')}</p><p class="rscore"><b>${got}</b> / ${list.length}</p><p class="rtime">Average time to image: <b>${avg.toFixed(1)} s</b></p>
      ${opts.target != null ? `<p class="target">Target ${opts.target}</p>` : ''}
      <div class="pfoot"><button class="btn ghost" data-a="again">Again</button><button class="btn" data-a="ok">Continue</button></div></section>`;
    $('[data-a=again]', root).onclick = () => runFlash(root, system, count, opts);
    $('[data-a=ok]', root).onclick = () => opts.onDone ? opts.onDone({ score: got, max: list.length, pass }) : history.back();
  };
  show();
}

// ── Breath counting (数息観) ─────────────────────────────
export function runBreath(root, minutes, opts = {}) {
  let count = 1, phase = 'in', alive = true; const end = performance.now() + minutes * 60000;
  root.innerHTML = `<section class="trainer phase breath">${timerHTML(jp('数息観') + ' Breath counting')}
    <div class="bwrap"><div class="bcircle"></div><p class="bphase">Breathe in</p><p class="bcount">1</p></div>
    <p class="hint center">Count each out-breath, 1 to 10. Lost count? Tap below and start again at 1. That return is the practice.</p>
    <div class="pfoot"><button class="btn ghost" data-a="lost">I lost count</button><button class="btn ghost" data-a="stop">Stop</button></div></section>`;
  const c = $('.bcircle', root), ph = $('.bphase', root), cn = $('.bcount', root);
  const t = timer($('.timer', root), minutes * 60, () => finish());
  const cycle = () => {
    if (!alive) return;
    if (phase === 'in') { c.className = 'bcircle grow'; ph.textContent = 'Breathe in'; phase = 'out'; setTimeout(cycle, 4000); }
    else { c.className = 'bcircle shrink'; ph.textContent = 'Breathe out'; cn.textContent = count; count = count >= 10 ? 1 : count + 1; phase = 'in'; setTimeout(cycle, 6000); }
  };
  cycle();
  $('[data-a=lost]', root).onclick = () => { count = 1; cn.textContent = '1'; };
  $('[data-a=stop]', root).onclick = () => { alive = false; t.stop(); opts.onCancel ? opts.onCancel() : history.back(); };
  const finish = () => {
    alive = false;
    store.addResult({ trainer: 'breath', score: 1, max: 1, secs: minutes * 60, cfgKey: String(minutes) });
    root.innerHTML = `<section class="trainer result fade"><div class="ripple-burst"><i></i><i></i><i></i></div><p class="rlabel">${jp('完了')}</p><p class="rscore">${minutes} min of calm</p><div class="pfoot"><button class="btn" data-a="ok">Continue</button></div></section>`;
    $('[data-a=ok]', root).onclick = () => opts.onDone ? opts.onDone({ score: 1, max: 1, pass: true }) : history.back();
  };
}
