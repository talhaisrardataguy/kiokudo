import { $, $$, esc, fmt, toast } from './util.js';
import * as store from './store.js';
import { LEVELS, LESSONS, MOCK_EVENTS, MINI_EVENTS, RECORDS } from './lessons.js';
import { QUOTES, quoteOfTheDay } from './quotes.js';
import { GLOSSARY, jp } from './glossary.js';
import { techVisual, cardLabel, SUITS, VALUES } from './visuals.js';
import { runTrainer, runFlash, runBreath, TRAINER_INFO } from './trainers.js';
import { renderDiary, diaryCount } from './diary.js';
import { MAJOR_WORDS } from './systems-data.js';
import { pool as facePool, loadPool } from './faces.js';

const view = $('#view');
let cleanup = null;

// ── Router ────────────────────────────────────────────
const routes = {
  '': home, learn, level, lesson, train, run: freeRun, mock, systems, palaces, palace: palaceEdit, walk: palaceWalk,
  diary, tools, progress, quotes, glossary, settings, flash: flashRoute, breath: breathRoute, about,
};
function go() {
  if (cleanup) { try { cleanup(); } catch {} cleanup = null; }
  const [r, ...args] = location.hash.replace(/^#\/?/, '').split('/');
  const f = routes[r] || home;
  $$('.nav a').forEach(a => a.classList.toggle('on', a.dataset.r === (navOf[r] ?? r)));
  window.scrollTo(0, 0);
  f(...args.map(decodeURIComponent));
}
const navOf = { level: 'learn', lesson: 'learn', run: 'train', mock: 'train', flash: 'train', breath: 'train', systems: 'tools', palaces: 'tools', palace: 'tools', walk: 'tools', progress: 'tools', quotes: 'tools', glossary: 'tools', settings: 'tools', about: 'tools' };
window.addEventListener('hashchange', go);

// ── Helpers ───────────────────────────────────────────
const levelUnlocked = n => n === 1 || store.S().settings.unlockAll || LESSONS.filter(l => l.level === n - 1).every(l => store.lessonDone(l.id));
const levelProgress = n => { const ls = LESSONS.filter(l => l.level === n); return [ls.filter(l => store.lessonDone(l.id)).length, ls.length]; };
const nextLesson = () => LESSONS.find(l => !store.lessonDone(l.id) && levelUnlocked(l.level));
const greet = () => { const h = new Date().getHours(); return h < 11 ? 'おはよう' : h < 18 ? 'こんにちは' : 'こんばんは'; };
const partsDone = id => { const s = store.S().lessons[id] || {}; return [!!s.lit, !!s.tech, !!s.ex]; };

function quoteHTML(q, big = false) {
  return `<figure class="quote ${big ? 'big' : ''}">
    <blockquote lang="${q.jp ? 'ja' : ''}">${esc(q.orig)}</blockquote>
    ${q.tr ? `<p class="qtr">${esc(q.tr)}</p>` : ''}
    <p class="qen">“${esc(q.en)}”</p>
    <figcaption>${esc(q.who)} · ${esc(q.region)}</figcaption></figure>`;
}

// ── Home: the garden ──────────────────────────────────
function home() {
  const s = store.S();
  if (s.quoteIdx == null) s.quoteIdx = QUOTES.indexOf(quoteOfTheDay());
  const q = QUOTES[s.quoteIdx] || quoteOfTheDay();
  const nl = nextLesson(); const st = store.streak();
  const stones = LEVELS.map(L => { const [d, t] = levelProgress(L.n); return { ...L, d, t, open: levelUnlocked(L.n) }; });
  view.innerHTML = `<section class="page home fade">
    <header class="hh">
      <div><p class="greet">${jp(greet())} <span>Talha</span></p><h1 class="brand">${jp('記憶道', 'brandjp')}</h1><p class="brand-sub">Kiokudō · the way of memory</p></div>
      <div class="streak" title="Days in a row"><b>${st}</b><span>day${st === 1 ? '' : 's'}</span></div>
    </header>
    <div class="garden" aria-hidden="true">
      <svg viewBox="0 0 390 230" preserveAspectRatio="xMidYMid slice">
        ${[0, 1, 2, 3, 4, 5].map(i => `<ellipse class="ring" style="animation-delay:${i * .55}s" cx="195" cy="118" rx="${58 + i * 34}" ry="${34 + i * 21}" fill="none" stroke="var(--rake)" stroke-width="2"/>`).join('')}
        ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<path d="M0 ${12 + i * 7} Q100 ${6 + i * 7} 200 ${12 + i * 7} T390 ${12 + i * 7}" fill="none" stroke="var(--rake)" stroke-width="1.5" opacity=".6"/>`).join('')}
        <ellipse cx="195" cy="122" rx="46" ry="29" fill="var(--stone)"/><ellipse cx="184" cy="113" rx="20" ry="9" fill="var(--stone-hi)"/>
        <ellipse cx="226" cy="140" rx="18" ry="8" fill="var(--moss)"/><ellipse cx="300" cy="190" rx="16" ry="10" fill="var(--stone)"/><ellipse cx="80" cy="60" rx="12" ry="8" fill="var(--stone)"/>
      </svg>
      <span class="leaf"></span><span class="leaf l2"></span>
    </div>
    <div class="qwrap">
      <p class="eyebrow">${jp('今日の言葉')} Today's words</p>
      ${quoteHTML(q)}
      <div class="qbtns"><button class="btn ghost small" data-a="nextq">${jp('次')} Another</button><a class="btn ghost small" href="#/quotes">All quotes</a></div>
    </div>
    ${nl ? `<article class="today card">
      <p class="eyebrow">One thing today · Level ${nl.level} ${jp(LEVELS[nl.level - 1].k)}</p>
      <h2>${esc(nl.title)}</h2>
      <div class="bars">${partsDone(nl.id).map((d, i) => `<span class="${d ? 'on' : ''}"><i></i>${['文', '技', '稽古'][i]}</span>`).join('')}</div>
      <p class="hint">${['Literature', 'Technique', 'Exercise'].map((p, i) => partsDone(nl.id)[i] ? p + ' ✓' : p).join(' · ')}</p>
      <a class="btn big" href="#/lesson/${nl.id}">Continue</a>
    </article>` : `<article class="today card"><h2>All lessons complete</h2><p>You are on the path of a 達人 (tatsujin). Run a mock championship every week.</p><a class="btn big" href="#/mock/full">Mock championship</a></article>`}
    <div class="stones">${stones.map(L => `<a href="#/level/${L.n}" class="stone ${L.open ? '' : 'locked'} ${L.d === L.t ? 'done' : ''}" style="--p:${L.d / L.t}">
      <span class="sh"><i></i></span><span class="sk">${L.k}</span><small>${L.name.split(' ')[0]}</small></a>`).join('')}</div>
    <div class="tiles">
      <a class="tile" href="#/flash/n2"><span class="tk">${jp('復習')}</span><b>Daily image drill</b><small>Your 00–99</small></a>
      <a class="tile" href="#/diary"><span class="tk">${jp('声')}</span><b>Voice diary</b><small class="dcount">Record today</small></a>
      <a class="tile" href="#/train"><span class="tk">${jp('練')}</span><b>Free training</b><small>All 10 events</small></a>
      <a class="tile" href="#/palaces"><span class="tk">${jp('宮')}</span><b>Palaces</b><small>${store.totalLoci()} loci</small></a>
    </div>
  </section>`;
  $('[data-a=nextq]').onclick = () => { s.quoteIdx = (s.quoteIdx + 1) % QUOTES.length; store.save(); const w = $('.qwrap figure'); w.classList.add('out'); setTimeout(home, 250); };
  diaryCount().then(n => { const el = $('.dcount'); if (el) el.textContent = n ? `${n} entr${n === 1 ? 'y' : 'ies'}` : 'Record today'; });
}

// ── Learn ─────────────────────────────────────────────
function learn() {
  view.innerHTML = `<section class="page fade">
    <header class="ph"><h1>${jp('学')} <span>Learn</span></h1><p class="sub">Five levels. Every lesson: ${jp('文')} literature → ${jp('技')} technique → ${jp('稽古')} exercise.</p></header>
    <div class="levels">${LEVELS.map(L => { const [d, t] = levelProgress(L.n), open = levelUnlocked(L.n); return `
      <a class="lvl card ${open ? '' : 'locked'}" href="#/level/${L.n}">
        <span class="lk">${jp(L.k)}</span>
        <div><h2>Level ${L.n} · ${L.name}</h2><p>${L.sub}</p><div class="pbar"><i style="width:${d / t * 100}%"></i></div><small>${d}/${t} lessons${open ? '' : ' · finish the previous level to unlock'}</small></div>
      </a>`; }).join('')}</div>
  </section>`;
}
function level(n) {
  n = +n || 1; const L = LEVELS[n - 1]; const open = levelUnlocked(n);
  const ls = LESSONS.filter(l => l.level === n);
  view.innerHTML = `<section class="page fade">
    <a class="back" href="#/learn">‹ All levels</a>
    <header class="ph"><h1>${jp(L.k)} <span>Level ${n} · ${L.name}</span></h1><p class="sub">${L.sub}</p></header>
    ${open ? '' : `<p class="notice">This level unlocks when Level ${n - 1} is complete. You can still read the lessons, or unlock all levels in ${jp('設定')} Settings.</p>`}
    <ol class="lessons">${ls.map((l, i) => { const p = partsDone(l.id); return `<li><a class="les card ${store.lessonDone(l.id) ? 'done' : ''}" href="#/lesson/${l.id}">
      <span class="ln">${i + 1}</span><div><b>${esc(l.title)}</b><small>${esc(l.lit.author)} · ${esc(String(l.lit.year))}</small></div>
      <span class="dots">${p.map(d => `<i class="${d ? 'on' : ''}"></i>`).join('')}</span></a></li>`; }).join('')}</ol>
  </section>`;
}

function lesson(id, tab) {
  const l = LESSONS.find(x => x.id === id); if (!l) return learn();
  const p = partsDone(id);
  tab = tab || (!p[0] ? 'lit' : !p[1] ? 'tech' : 'ex');
  const idx = LESSONS.filter(x => x.level === l.level).indexOf(l) + 1;
  const tabs = [['lit', '文', 'Literature'], ['tech', '技', 'Technique'], ['ex', '稽古', 'Exercise']];
  view.innerHTML = `<section class="page fade lesson">
    <a class="back" href="#/level/${l.level}">‹ Level ${l.level} · ${LEVELS[l.level - 1].name}</a>
    <header class="ph"><p class="eyebrow">Lesson ${idx}</p><h1 class="lt">${esc(l.title)}</h1></header>
    <nav class="steps" aria-label="Lesson steps">${tabs.map(([k, kj, en], i) => `<a href="#/lesson/${id}/${k}" class="${tab === k ? 'on' : ''} ${p[i] ? 'done' : ''}" aria-current="${tab === k}"><span class="sk">${kj}</span><small>${en}${p[i] ? ' ✓' : ''}</small></a>`).join('<span class="sline"></span>')}</nav>
    <div class="lbody"></div>
  </section>`;
  const body = $('.lbody');
  if (tab === 'lit') {
    body.innerHTML = `<article class="lit card">
      <p class="eyebrow">${jp('文')} From the books</p>
      <h2 class="book">${esc(l.lit.book)}</h2><p class="by">${esc(l.lit.author)} · ${esc(String(l.lit.year))}</p>
      <p>${esc(l.lit.body)}</p>
      ${l.lit.quote ? `<blockquote class="litq">${esc(l.lit.quote.text)}<cite>${esc(l.lit.quote.note)}</cite></blockquote>` : ''}
      <p class="fine">Summarised in our own words. Read the original for the full argument.</p>
    </article><button class="btn big" data-a="next">I've read it · next: ${jp('技')} Technique</button>`;
    $('[data-a=next]').onclick = () => { store.markPart(id, 'lit'); location.hash = `#/lesson/${id}/tech`; };
  } else if (tab === 'tech') {
    const t = l.tech;
    body.innerHTML = `<article class="tech card">
      <p class="eyebrow">${jp('技')} The technique</p><p class="intro">${esc(t.intro)}</p>
      ${techVisual(t.visual)}
      <ol class="tsteps">${t.steps.map((s, i) => `<li style="animation-delay:${i * .07}s">${esc(s)}</li>`).join('')}</ol>
      <div class="example"><p class="eyebrow">Example</p><p>${esc(t.example)}</p></div>
      ${t.tips?.length ? `<ul class="tips">${t.tips.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
    </article><button class="btn big" data-a="next">Got it · next: ${jp('稽古')} Exercise</button>`;
    $('[data-a=next]').onclick = () => { store.markPart(id, 'tech'); location.hash = `#/lesson/${id}/ex`; };
  } else exercise(l, body);
}

function exercise(l, body) {
  const ex = l.ex, done = (r) => {
    const st = store.lessonState(l.id); st.tries = (st.tries || 0) + 1; st.best = Math.max(st.best || 0, r?.score || 0);
    if (r?.pass) { st.ex = true; store.save(); celebrate(l); } else { store.save(); lesson(l.id, 'ex'); }
  };
  const st = store.S().lessons[l.id] || {};
  const head = `<article class="card exhead"><p class="eyebrow">${jp('稽古')} Your exercise</p><p>${esc(ex.task)}</p>
    <p class="target">Target: <b>${ex.target}</b>${st.best != null ? ` · your best: <b>${st.best}</b>` : ''}${st.ex ? ' · ✓ passed' : ''}</p></article>`;
  const markLink = (st.tries >= 3 && !st.ex) ? `<button class="linkbtn" data-a="skip">Mark complete anyway</button>` : '';
  if (ex.trainer === 'palace') {
    const big = Math.max(0, ...store.palaces().map(p => p.loci.filter(Boolean).length));
    const have = ex.cfg.total ? store.totalLoci() : big;
    const ok = have >= ex.cfg.loci;
    body.innerHTML = head + `<div class="card"><p>${ex.cfg.total ? 'Total loci across palaces' : 'Your biggest palace'}: <b>${have}</b> / ${ex.cfg.loci}</p>
      <a class="btn" href="#/palaces">Open ${jp('宮')} Palaces</a></div>
      ${ok ? (ex.then ? `<button class="btn big" data-a="then">Now memorise ${ex.then.cfg.count} words in it</button>` : `<button class="btn big" data-a="ok">Mark exercise complete</button>`) : '<p class="hint center">Come back when your palace is ready.</p>'}`;
    const t = $('[data-a=then]'); if (t) t.onclick = () => runTrainer(body, ex.then.trainer, { ...ex.then.cfg }, { title: l.title, task: 'Place one word on each stop of your palace.', target: Math.ceil(ex.then.cfg.count * .8), lessonId: l.id, onDone: done, onCancel: () => lesson(l.id, 'ex') });
    const o = $('[data-a=ok]'); if (o) o.onclick = () => done({ pass: true, score: have });
    return;
  }
  if (ex.trainer === 'system') {
    const have = Object.values(store.S().systems[ex.cfg.system] || {}).filter(Boolean).length;
    body.innerHTML = head + `<div class="card"><p>Images entered: <b>${have}</b> / 100 (need ${ex.cfg.min})</p><a class="btn" href="#/systems/n2">Open ${jp('型')} Systems</a></div>
      ${have >= ex.cfg.min ? '<button class="btn big" data-a="ok">Mark exercise complete</button>' : ''}`;
    const o = $('[data-a=ok]'); if (o) o.onclick = () => done({ pass: true, score: have });
    return;
  }
  if (ex.trainer === 'flash') { body.innerHTML = head + '<button class="btn big" data-a="go">Start drill</button>' + markLink; $('[data-a=go]').onclick = () => runFlash(body, ex.cfg.system, ex.cfg.count, { target: ex.target, onDone: done }); bindSkip(); return; }
  if (ex.trainer === 'breath') { body.innerHTML = head + '<button class="btn big" data-a="go">Begin</button>'; $('[data-a=go]').onclick = () => runBreath(body, ex.cfg.minutes, { onDone: done, onCancel: () => lesson(l.id, 'ex') }); return; }
  if (ex.trainer === 'mock') { body.innerHTML = head + `<a class="btn big" href="#/mock/${ex.cfg.mode}/${l.id}">Begin the ${ex.cfg.mode === 'full' ? 'full' : 'mini'} mock</a>`; return; }
  body.innerHTML = head + '<div class="trainer-host"></div>' + markLink;
  runTrainer($('.trainer-host'), ex.trainer, { ...ex.cfg }, { title: 'Exercise', target: ex.target, lessonId: l.id, onDone: done });
  bindSkip();
  function bindSkip() { const s = $('[data-a=skip]'); if (s) s.onclick = () => { store.markPart(l.id, 'ex'); celebrate(l); }; }
}

function celebrate(l) {
  const lvlDone = LESSONS.filter(x => x.level === l.level).every(x => store.lessonDone(x.id));
  const all = LESSONS.filter(x => x.level === l.level); const i = all.indexOf(l);
  const nx = all[i + 1] || LESSONS.find(x => x.level === l.level + 1);
  view.innerHTML = `<section class="page fade celebrate">
    <div class="ripple-burst big"><i></i><i></i><i></i><i></i></div>
    <p class="eyebrow">${jp('完了')} Lesson complete</p><h1>${esc(l.title)}</h1>
    ${lvlDone ? `<p class="lvlup">Level ${l.level} ${jp(LEVELS[l.level - 1].k)} complete. ${l.level < 5 ? `Level ${l.level + 1} ${jp(LEVELS[l.level].k)} is open.` : 'You are competition ready.'}</p>` : ''}
    ${quoteHTML(QUOTES[Math.floor(Math.random() * QUOTES.length)])}
    ${nx ? `<a class="btn big" href="#/lesson/${nx.id}">Next: ${esc(nx.title)}</a>` : ''}
    <a class="btn ghost" href="#/">Back to the garden</a>
  </section>`;
}

// ── Train (free practice) ─────────────────────────────
const FREE = {
  numbers: { count: 80, memo: 300, recall: 600 }, binary: { rows: 4, memo: 300, recall: 600 }, words: { count: 30, memo: 300, recall: 600 },
  cards: { count: 52, memo: 300, recall: 600, speed: true }, names: { count: 15, memo: 300, recall: 600 }, dates: { count: 20, memo: 300, recall: 600 },
  images: { rows: 10, memo: 300, recall: 600 }, spoken: { count: 50 },
};
const ML = { numbers: { count: 80, memo: 60, recall: 240 }, words: { count: 50, memo: 60, recall: 240 }, cards: { count: 52, memo: 60, recall: 240 }, names: { count: 15, memo: 60, recall: 240 }, images: { rows: 6, memo: 60, recall: 240 } };
function train() {
  const best = t => { const b = store.bestFor(t); return b ? `PB ${b.score}` : 'no score yet'; };
  view.innerHTML = `<section class="page fade">
    <header class="ph"><h1>${jp('練')} <span>Train</span></h1><p class="sub">Free practice in every discipline. Set your own amount and time.</p></header>
    <div class="grid2">${Object.keys(FREE).map(t => `<a class="disc card" href="#/run/${t}"><span class="tk">${TRAINER_INFO[t].k}</span><b>${TRAINER_INFO[t].name}</b><small>${best(t)}</small></a>`).join('')}</div>
    <h2 class="sec">Memory League sprints <small>1 minute to memorise</small></h2>
    <div class="chips">${Object.keys(ML).map(t => `<a class="chip big" href="#/run/${t}/ml">${TRAINER_INFO[t].name}</a>`).join('')}</div>
    <h2 class="sec">${jp('試合')} Mock championship</h2>
    <div class="grid2"><a class="disc card" href="#/mock/mini"><b>Mini mock</b><small>3 events · ~35 min</small></a><a class="disc card" href="#/mock/full"><b>Full mock</b><small>10 events · national standard</small></a></div>
    <h2 class="sec">Systems & calm</h2>
    <div class="grid2"><a class="disc card" href="#/flash/n2"><span class="tk">${jp('復習')}</span><b>00–99 flashcards</b></a><a class="disc card" href="#/flash/cards"><span class="tk">${jp('札')}</span><b>Card flashcards</b></a><a class="disc card" href="#/flash/pao"><b>PAO flashcards</b></a><a class="disc card" href="#/breath/3"><span class="tk">${jp('数息観')}</span><b>Breath counting</b></a></div>
  </section>`;
}
function freeRun(t, mode) {
  const cfg = { ...(mode === 'ml' ? ML[t] : FREE[t]) }; if (!cfg) return train();
  view.innerHTML = `<section class="page"><a class="back" href="#/train">‹ Train</a><div class="trainer-host"></div></section>`;
  runTrainer($('.trainer-host'), t, cfg, { free: mode !== 'ml', title: (mode === 'ml' ? 'Sprint · ' : '') + TRAINER_INFO[t].name, onCancel: () => location.hash = '#/train' });
}
function flashRoute(sys = 'n2') { view.innerHTML = `<section class="page"><a class="back" href="#/train">‹ Train</a><div class="trainer-host"></div></section>`; runFlash($('.trainer-host'), sys, 30, { onDone: () => location.hash = '#/train' }); }
function breathRoute(m = 3) { view.innerHTML = `<section class="page"><a class="back" href="#/train">‹ Train</a><div class="trainer-host"></div></section>`; runBreath($('.trainer-host'), +m || 3, { onDone: () => location.hash = '#/train', onCancel: () => location.hash = '#/train' }); }

// ── Mock championship ─────────────────────────────────
function mock(mode = 'mini', lessonId) {
  const events = mode === 'full' ? MOCK_EVENTS : MINI_EVENTS;
  const scores = [];
  const overview = () => {
    view.innerHTML = `<section class="page fade"><a class="back" href="#/train">‹ Train</a>
      <header class="ph"><h1>${jp('試合')} <span>${mode === 'full' ? 'Full' : 'Mini'} mock championship</span></h1><p class="sub">${events.length} events in a row. Rest a few minutes between events. Try 3 minutes of ${jp('数息観')} before you start.</p></header>
      <ol class="mocklist">${events.map((e, i) => `<li class="${i < scores.length ? 'done' : i === scores.length ? 'now' : ''}"><span>${jp(e.k)}</span><b>${e.name}</b><small>${i < scores.length ? `${scores[i].score} / ${scores[i].max}` : e.trainer === 'spoken' ? `${e.cfg.count} digits` : `${fmt(e.cfg.memo)} memorise`}</small></li>`).join('')}</ol>
      ${scores.length < events.length ? `<button class="btn big" data-a="go">${scores.length ? 'Next event' : 'Begin'}: ${events[scores.length].name}</button>` : ''}
    </section>`;
    const g = $('[data-a=go]'); if (g) g.onclick = runEvent;
  };
  const runEvent = () => {
    const e = events[scores.length];
    view.innerHTML = `<section class="page"><p class="eyebrow">Event ${scores.length + 1} of ${events.length}</p><div class="trainer-host"></div></section>`;
    runTrainer($('.trainer-host'), e.trainer, { ...e.cfg }, { title: e.name, autostart: false, onCancel: overview, onDone: r => { scores.push({ id: e.id, name: e.name, score: r.score, max: r.max }); scores.length < events.length ? overview() : finish(); } });
  };
  const finish = () => {
    const total = scores.reduce((a, b) => a + b.score, 0);
    store.addResult({ trainer: 'mock', score: total, max: scores.reduce((a, b) => a + b.max, 0), cfgKey: mode, detail: scores });
    if (lessonId) { store.markPart(lessonId, 'ex'); }
    view.innerHTML = `<section class="page fade celebrate"><div class="ripple-burst big"><i></i><i></i><i></i><i></i></div>
      <p class="eyebrow">${jp('お疲れ様')} Mock complete</p><h1>${total} points</h1>
      <table class="tbl">${scores.map(s => `<tr><td>${s.name}</td><td>${s.score}</td><td class="mut">/ ${s.max}</td></tr>`).join('')}</table>
      <p class="hint">Record your thoughts in the ${jp('声の日記')} voice diary while they are fresh.</p>
      <a class="btn big" href="#/diary">Open voice diary</a><a class="btn ghost" href="#/">Back to the garden</a></section>`;
  };
  overview();
}

// ── Systems ───────────────────────────────────────────
function systems(tab = 'n2') {
  const s = store.S().systems;
  const tabs = [['n2', '00–99'], ['cards', 'Cards'], ['pao', 'PAO']];
  view.innerHTML = `<section class="page fade"><a class="back" href="#/tools">‹ Tools</a>
    <header class="ph"><h1>${jp('型')} <span>Your systems</span></h1><p class="sub">Your fixed images. Changes save as you type.</p></header>
    <nav class="seg">${tabs.map(([k, n]) => `<a href="#/systems/${k}" class="${tab === k ? 'on' : ''}">${n}</a>`).join('')}</nav>
    <div class="sysbar"><a class="btn small" href="#/flash/${tab}">Flashcard drill</a>${tab === 'n2' ? '<button class="btn ghost small" data-a="fill">Fill blanks with starter words</button>' : ''}<span class="hint scount"></span></div>
    <div class="syslist"></div></section>`;
  const list = $('.syslist'), sys = s[tab];
  if (tab === 'n2') list.innerHTML = Array.from({ length: 100 }, (_, i) => { const k = String(i).padStart(2, '0'); return `<label class="sysrow"><b>${k}</b><input data-k="${k}" value="${esc(sys[k] || '')}" placeholder="${MAJOR_WORDS[k]}" autocomplete="off"></label>`; }).join('');
  if (tab === 'cards') list.innerHTML = SUITS.map(su => VALUES.map(v => { const k = v + su; return `<label class="sysrow"><b class="${su === 'H' || su === 'D' ? 'red' : ''}">${cardLabel(k)}</b><input data-k="${k}" value="${esc(sys[k] || '')}" placeholder="image for ${cardLabel(k)}" autocomplete="off"></label>`; }).join('')).join('');
  if (tab === 'pao') list.innerHTML = Array.from({ length: 100 }, (_, i) => { const k = String(i).padStart(2, '0'), v = sys[k] || {}; return `<div class="sysrow pao"><b>${k}</b>${['p', 'a', 'o'].map(f => `<input data-k="${k}" data-f="${f}" value="${esc(v[f] || '')}" placeholder="${{ p: 'person', a: 'action', o: 'object' }[f]}" aria-label="${k} ${f}" autocomplete="off">`).join('')}</div>`; }).join('');
  const count = () => { $('.scount').textContent = `${Object.values(sys).filter(v => v && (typeof v === 'string' ? v : v.p || v.a || v.o)).length} filled`; };
  list.oninput = e => { const i = e.target; if (!i.dataset.k) return; if (tab === 'pao') { (sys[i.dataset.k] ||= {})[i.dataset.f] = i.value; } else sys[i.dataset.k] = i.value; clearTimeout(list._t); list._t = setTimeout(() => { store.save(); count(); }, 300); };
  const f = $('[data-a=fill]'); if (f) f.onclick = () => { for (const k in MAJOR_WORDS) if (!sys[k]) sys[k] = MAJOR_WORDS[k]; store.save(); systems('n2'); toast('Starter words added. Make them your own.'); };
  count();
}

// ── Palaces ───────────────────────────────────────────
function palaces() {
  const ps = store.palaces();
  view.innerHTML = `<section class="page fade"><a class="back" href="#/tools">‹ Tools</a>
    <header class="ph"><h1>${jp('宮')} <span>Memory palaces</span></h1><p class="sub">${store.totalLoci()} loci in ${ps.length} palace${ps.length === 1 ? '' : 's'}. A national competition needs roughly 300–500.</p></header>
    <div class="plist">${ps.map(p => `<article class="card pal"><div><b>${esc(p.name)}</b><small>${p.loci.filter(Boolean).length} stops</small></div><div class="row"><a class="btn ghost small" href="#/walk/${p.id}">Walk</a><a class="btn small" href="#/palace/${p.id}">Edit</a></div></article>`).join('') || '<p class="hint">No palaces yet. Start with your home.</p>'}</div>
    <a class="btn big" href="#/palace/new">+ New palace</a></section>`;
}
function palaceEdit(id) {
  const p = id === 'new' ? { id: 'p' + Date.now(), name: '', loci: [] } : store.palaces().find(x => x.id === id);
  if (!p) return palaces();
  view.innerHTML = `<section class="page fade"><a class="back" href="#/palaces">‹ Palaces</a>
    <header class="ph"><h1>${jp('宮')} <span>${id === 'new' ? 'New palace' : 'Edit palace'}</span></h1></header>
    <label class="field">Name<input class="pname" value="${esc(p.name)}" placeholder="e.g. Home, ground floor"></label>
    <label class="field">Stops, one per line, in walking order<textarea class="ploci" rows="14" placeholder="front door&#10;shoe rack&#10;sofa&#10;TV&#10;window&#10;…">${esc(p.loci.join('\n'))}</textarea></label>
    <p class="hint lcount"></p>
    <div class="ruleset card"><p class="eyebrow">Rules from Ad Herennium</p><ul class="tips"><li>Every stop different from its neighbours.</li><li>Evenly spaced, not too close.</li><li>Mark every 5th stop as special (★).</li></ul></div>
    <div class="row"><button class="btn ghost danger" data-a="del">${id === 'new' ? 'Cancel' : 'Delete'}</button><button class="btn" data-a="save">Save</button></div></section>`;
  const ta = $('.ploci'), upd = () => $('.lcount').textContent = `${ta.value.split('\n').filter(x => x.trim()).length} stops`;
  ta.oninput = upd; upd();
  $('[data-a=save]').onclick = () => { p.name = $('.pname').value.trim() || 'Untitled palace'; p.loci = ta.value.split('\n').map(x => x.trim()).filter(Boolean); store.upsertPalace(p); toast('Palace saved'); location.hash = '#/palaces'; };
  $('[data-a=del]').onclick = () => { if (id !== 'new' && !confirm('Delete this palace?')) return; if (id !== 'new') store.deletePalace(id); location.hash = '#/palaces'; };
}
function palaceWalk(id) {
  const p = store.palaces().find(x => x.id === id); if (!p) return palaces();
  let i = 0;
  const draw = () => {
    view.innerHTML = `<section class="page walk fade"><a class="back" href="#/palaces">‹ Palaces</a>
      <p class="eyebrow">${esc(p.name)} · walk the route</p>
      <div class="locus"><span class="ln ${(i + 1) % 5 === 0 ? 'gold' : ''}">${i + 1}</span><h2>${esc(p.loci[i])}</h2></div>
      <div class="path">${p.loci.map((_, k) => `<i class="${k === i ? 'on' : k < i ? 'past' : ''}"></i>`).join('')}</div>
      <div class="pfoot"><button class="btn ghost" data-a="p">‹</button><button class="btn" data-a="n">${i < p.loci.length - 1 ? 'Next stop ›' : 'Finish'}</button></div></section>`;
    $('[data-a=p]').onclick = () => { i = Math.max(0, i - 1); draw(); };
    $('[data-a=n]').onclick = () => { if (i < p.loci.length - 1) { i++; draw(); } else location.hash = '#/palaces'; };
  };
  if (!p.loci.length) return palaceEdit(id);
  draw();
}

// ── Diary ─────────────────────────────────────────────
function diary() { renderDiary(view).then(c => cleanup = c); }

// ── Tools, progress, quotes, glossary, settings ───────
function tools() {
  const items = [['systems', '型', 'Systems', '00–99, cards, PAO'], ['palaces', '宮', 'Palaces', `${store.totalLoci()} loci`], ['progress', '録', 'Progress', 'Scores and bests'], ['quotes', '名言', 'Quotes', `${QUOTES.length} sayings`], ['glossary', '辞書', 'Japanese glossary', 'Every word explained'], ['settings', '設定', 'Settings', 'Unlock, voice, backup'], ['about', '道', 'How to use Kiokudō', 'Install & daily routine']];
  view.innerHTML = `<section class="page fade"><header class="ph"><h1>${jp('道具')} <span>Tools</span></h1></header>
    <div class="grid2">${items.map(([r, k, n, s]) => `<a class="disc card" href="#/${r}"><span class="tk">${jp(k)}</span><b>${n}</b><small>${s}</small></a>`).join('')}</div></section>`;
}
function progress() {
  const s = store.S(), h = s.history;
  const kinds = ['numbers', 'binary', 'words', 'cards', 'names', 'dates', 'images', 'spoken', 'flash', 'mock'];
  const spark = t => { const xs = h.filter(x => x.trainer === t).slice(-20); if (xs.length < 2) return ''; const m = Math.max(...xs.map(x => x.score), 1); return `<svg viewBox="0 0 100 24" class="spark" aria-hidden="true"><polyline fill="none" stroke="var(--moss)" stroke-width="2" points="${xs.map((x, i) => `${i / (xs.length - 1) * 100},${22 - x.score / m * 20}`).join(' ')}"/></svg>`; };
  const done = LESSONS.filter(l => store.lessonDone(l.id)).length;
  const sc = store.bestFor('cards') && h.filter(x => x.trainer === 'cards' && x.perfect && x.time).sort((a, b) => a.time - b.time)[0];
  view.innerHTML = `<section class="page fade"><a class="back" href="#/tools">‹ Tools</a>
    <header class="ph"><h1>${jp('録')} <span>Progress</span></h1></header>
    <div class="stats"><div><b>${store.streak()}</b><small>day streak</small></div><div><b>${s.days.length}</b><small>days trained</small></div><div><b>${done}/${LESSONS.length}</b><small>lessons</small></div><div><b>${h.length}</b><small>sessions</small></div></div>
    ${sc ? `<p class="card">Fastest perfect deck: <b>${sc.time.toFixed(1)} s</b></p>` : ''}
    <h2 class="sec">Personal bests</h2>
    <div class="pbs">${kinds.map(t => { const b = store.bestFor(t); return `<div class="pbrow"><span>${t === 'mock' ? 'Mock championship' : TRAINER_INFO[t].name}</span>${spark(t)}<b>${b ? b.score : '—'}</b></div>`; }).join('')}</div>
    <h2 class="sec">Recent sessions</h2>
    <ul class="recent">${h.slice(-15).reverse().map(x => `<li><span>${new Date(x.t).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span><b>${x.trainer === 'mock' ? 'Mock' : TRAINER_INFO[x.trainer]?.name || x.trainer}</b><em>${x.score}/${x.max}</em></li>`).join('') || '<li class="hint">No sessions yet.</li>'}</ul>
    <h2 class="sec">World records to aim at</h2>
    <table class="tbl">${RECORDS.map(r => `<tr><td>${r[0]}</td><td><b>${r[1]}</b></td><td class="mut">${r[2]}</td></tr>`).join('')}</table>
    <p class="fine">Records from IAM and WMSC statistics as listed on Wikipedia, 2026. They change often: check iam-stats.org and world-memory-statistics.com.</p></section>`;
}
function quotes(region = 'all') {
  const regions = ['all', 'Japan', 'China', 'South Asia', 'Middle East', 'Africa', 'SE Asia & Korea'];
  const match = q => region === 'all' || (region === 'Japan' && q.jp) || (region === 'China' && /China/.test(q.region) && !q.jp) || (region === 'South Asia' && /India|Pakistan|Bengal|Tamil/.test(q.region)) || (region === 'Middle East' && /Iran|Arab|Anatolia/.test(q.region)) || (region === 'Africa' && /Africa|Ethiopia/.test(q.region)) || (region === 'SE Asia & Korea' && /Korea|Vietnam|Indonesia|Philippines/.test(q.region));
  view.innerHTML = `<section class="page fade"><a class="back" href="#/tools">‹ Tools</a>
    <header class="ph"><h1>${jp('名言')} <span>Quotes</span></h1><p class="sub">Motivation from Asia, the Middle East and Africa. Original text, pronunciation and meaning.</p></header>
    <div class="chips">${regions.map(r => `<a class="chip ${r === region ? 'on' : ''}" href="#/quotes/${encodeURIComponent(r)}">${r}</a>`).join('')}</div>
    <div class="qlist">${QUOTES.filter(match).map(q => quoteHTML(q)).join('')}</div></section>`;
}
function glossary() {
  view.innerHTML = `<section class="page fade"><a class="back" href="#/tools">‹ Tools</a>
    <header class="ph"><h1>${jp('辞書')} <span>Japanese glossary</span></h1><p class="sub">Tap any Japanese word anywhere in the app to see this.</p></header>
    <dl class="gloss">${Object.entries(GLOSSARY).map(([k, g]) => `<div><dt lang="ja">${k}</dt><dd><b>${g.r}</b> · ${g.m}${g.n ? `<small>${g.n}</small>` : ''}</dd></div>`).join('')}</dl></section>`;
}
function settings() {
  const st = store.S().settings;
  view.innerHTML = `<section class="page fade"><a class="back" href="#/tools">‹ Tools</a>
    <header class="ph"><h1>${jp('設定')} <span>Settings</span></h1></header>
    <label class="toggle card"><input type="checkbox" name="unlockAll" ${st.unlockAll ? 'checked' : ''}><span>Unlock all levels</span></label>
    <label class="field">Voice diary transcription language<select name="sttLang">${[['en-US', 'English'], ['ur-PK', 'Urdu'], ['ja-JP', 'Japanese'], ['hi-IN', 'Hindi']].map(([v, n]) => `<option value="${v}" ${st.sttLang === v ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
    <label class="toggle card"><input type="checkbox" name="reduceMotion" ${st.reduceMotion ? 'checked' : ''}><span>Reduce animations</span></label>
    <h2 class="sec">Real face photos</h2>
    <p class="hint">Names & faces can use real portraits from <a href="https://unsplash.com/?utm_source=kiokudo&utm_medium=referral" target="_blank" rel="noopener">Unsplash</a>, free to use under the Unsplash License. Unsplash asks for a free personal Access Key (one-time, about 3 minutes):</p>
    <ol class="tsteps small"><li>Open <a href="https://unsplash.com/developers" target="_blank" rel="noopener">unsplash.com/developers</a> and sign up (free).</li><li>Tap <b>Your apps → New Application</b>, accept the terms, name it “Kiokudo”.</li><li>Scroll to <b>Keys</b>, copy the <b>Access Key</b> (not the Secret Key) and paste it below.</li></ol>
    <label class="field">Unsplash Access Key<input name="unsplashKey" value="${esc(st.unsplashKey || '')}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="paste Access Key"></label>
    <button class="btn" data-a="loadfaces">Load face photos</button>
    <p class="hint facestat" aria-live="polite"></p><div class="facepeek"></div>
    <label class="toggle card"><input type="checkbox" name="realFaces" ${st.realFaces ? 'checked' : ''}><span>Use real photos in Names & faces</span></label>
    <h2 class="sec">Backup</h2><p class="hint">Exports progress, systems and palaces (not audio; download diary entries separately).</p>
    <div class="row"><button class="btn ghost" data-a="exp">Export backup</button><label class="btn ghost">Import<input type="file" accept="application/json" hidden></label></div>
    <h2 class="sec">Danger</h2><button class="btn ghost danger" data-a="reset">Reset all progress</button></section>`;
  const fp = facePool(), stat = $('.facestat'), peek = $('.facepeek');
  const showPeek = list => { peek.innerHTML = list.slice(0, 8).map(x => `<img src="${esc(x.url)}" alt="" loading="lazy">`).join(''); };
  stat.textContent = fp.list.length ? `${fp.list.length} photos ready (loaded ${new Date(fp.t).toLocaleDateString()}). Load again for a fresh set.` : 'No photos loaded yet.';
  if (fp.list.length) showPeek(fp.list);
  $('[data-a=loadfaces]').onclick = async e => {
    const key = $('input[name=unsplashKey]').value.trim();
    if (!key) { stat.textContent = 'Paste your Access Key first.'; return; }
    st.unsplashKey = key; store.save(); e.target.disabled = true;
    try {
      const n = await loadPool(key, (d, t, c) => stat.textContent = `Loading… ${d}/${t} searches, ${c} photos`);
      st.realFaces = true; store.save(); $('input[name=realFaces]').checked = true;
      stat.textContent = `${n} photos ready. Names & faces will now use real portraits.`; showPeek(facePool().list);
    } catch (err) { stat.textContent = err.message.includes('fetch') ? 'Could not reach Unsplash. Check your internet connection.' : err.message; }
    e.target.disabled = false;
  };
  $$('input[type=checkbox], select, input[name=unsplashKey]', view).forEach(i => i.onchange = () => { st[i.name] = i.type === 'checkbox' ? i.checked : i.value; store.save(); applyMotion(); toast('Saved'); });
  $('[data-a=exp]').onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([store.exportJSON()], { type: 'application/json' })); a.download = `kiokudo-backup-${store.today()}.json`; a.click(); };
  $('input[type=file]').onchange = async e => { try { store.importJSON(await e.target.files[0].text()); toast('Backup restored'); } catch { toast('That file is not a Kiokudō backup'); } };
  $('[data-a=reset]').onclick = () => { if (confirm('Erase all progress, systems and palaces? Diary audio is kept.')) { store.resetAll(); toast('Reset'); location.hash = '#/'; } };
}
function about() {
  view.innerHTML = `<section class="page fade"><a class="back" href="#/tools">‹ Tools</a>
    <header class="ph"><h1>${jp('道')} <span>How to use Kiokudō</span></h1></header>
    <article class="card"><h2>Install on your phone</h2><ol class="tsteps"><li>Open the app's GitHub Pages link in Chrome (Android) or Safari (iPhone).</li><li>Chrome: menu ⋮ → Add to Home screen. Safari: Share → Add to Home Screen.</li><li>It now opens full-screen and works offline.</li></ol></article>
    <article class="card"><h2>Daily routine (45–60 min)</h2><ol class="tsteps"><li>3 min ${jp('数息観')} breath counting.</li><li>10 min ${jp('復習')} image flashcards.</li><li>20–30 min: today's lesson exercise or one discipline.</li><li>5 min ${jp('声の日記')} voice diary: scores, errors, tomorrow's target.</li></ol></article>
    <article class="card"><h2>Japanese words</h2><p>Every Japanese word is a button: tap it to see its reading and meaning. The full list is in ${jp('辞書')} Glossary.</p></article>
    <article class="card"><h2>Your data</h2><p>Everything is stored only on this phone. Use ${jp('設定')} Settings → Export backup now and then.</p></article></section>`;
}

// ── Glossary sheet (tap any Japanese word) ────────────
const openJp = e => {
  const b = e.target.closest('.jp'); if (!b || b.parentElement.closest('a, button')) return;
  e.preventDefault(); e.stopPropagation();
  const k = b.dataset.jp, g = GLOSSARY[k]; if (!g) return;
  const sh = $('#sheet');
  sh.innerHTML = `<div class="sheet-card" role="dialog" aria-modal="true" aria-label="${k}"><button class="x" aria-label="Close">×</button><p class="sk" lang="ja">${k}</p><p class="sr">${g.r}</p><p class="sm">${g.m}</p>${g.n ? `<p class="sn">${g.n}</p>` : ''}</div>`;
  sh.classList.add('open'); $('.x', sh).focus();
};
document.addEventListener('click', openJp, true);
document.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.classList?.contains('jp')) openJp(e); });
$('#sheet').addEventListener('click', e => { if (e.target.id === 'sheet' || e.target.closest('.x')) $('#sheet').classList.remove('open'); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') $('#sheet').classList.remove('open'); });

// Japanese words inside links become plain text (the link still navigates; meanings are in the glossary).
new MutationObserver(() => $$('a .jp, button .jp, summary .jp', view).forEach(b => { const sp = document.createElement('span'); sp.className = 'jp-i'; sp.lang = 'ja'; sp.textContent = b.textContent; b.replaceWith(sp); })).observe(view, { childList: true, subtree: true });

function applyMotion() { document.documentElement.classList.toggle('calm', !!store.S().settings.reduceMotion); }
applyMotion();
go();

if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
