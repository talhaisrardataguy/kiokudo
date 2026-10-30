// Local storage for progress, systems and palaces. Audio diary uses IndexedDB (diary.js).
const KEY = 'kiokudo.v1';

const DEFAULT = {
  lessons: {},          // id → { lit:true, tech:true, ex:true, best:number, tries:number }
  history: [],          // { t, trainer, cfgKey, score, max, secs, lesson }
  systems: { n2: {}, cards: {}, pao: {} },
  flash: {},            // 'n2:07' → { box, due }
  palaces: [],          // { id, name, loci: [string] }
  days: [],             // ISO dates trained
  quoteIdx: null,
  settings: { unlockAll: false, sttLang: 'en-US', voiceRate: 1, reduceMotion: false, realFaces: false, unsplashKey: '' },
};

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULT);
    const s = JSON.parse(raw);
    return { ...structuredClone(DEFAULT), ...s, systems: { ...DEFAULT.systems, ...(s.systems || {}) }, settings: { ...DEFAULT.settings, ...(s.settings || {}) } };
  } catch { return structuredClone(DEFAULT); }
}
export function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { console.warn('save failed', e); } }
export const S = () => state;

export function lessonState(id) { return state.lessons[id] || (state.lessons[id] = {}); }
export function markPart(id, part, val = true) { lessonState(id)[part] = val; save(); }
export function lessonDone(id) { const l = state.lessons[id]; return !!(l && l.lit && l.tech && l.ex); }

export function today() { return new Date().toISOString().slice(0, 10); }
export function logDay() { const d = today(); if (!state.days.includes(d)) { state.days.push(d); save(); } }
export function streak() {
  const set = new Set(state.days); let n = 0; const d = new Date();
  if (!set.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1);
  while (set.has(d.toISOString().slice(0, 10))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

export function addResult(r) {
  state.history.push({ t: Date.now(), ...r });
  if (state.history.length > 2000) state.history.splice(0, state.history.length - 2000);
  logDay(); save();
}
export function bestFor(trainer) {
  const h = state.history.filter(x => x.trainer === trainer);
  if (!h.length) return null;
  return h.reduce((a, b) => (b.score > a.score ? b : a));
}

// Palaces
export function palaces() { return state.palaces; }
export function totalLoci() { return state.palaces.reduce((n, p) => n + p.loci.filter(Boolean).length, 0); }
export function upsertPalace(p) {
  const i = state.palaces.findIndex(x => x.id === p.id);
  if (i >= 0) state.palaces[i] = p; else state.palaces.push(p);
  save();
}
export function deletePalace(id) { state.palaces = state.palaces.filter(p => p.id !== id); save(); }

// Flashcard spacing (Leitner boxes: 0 → today, 1 → 1 day, 2 → 3 days, 3 → 7, 4 → 14, 5 → 30)
const GAPS = [0, 1, 3, 7, 14, 30];
export function flashGrade(key, ok) {
  const f = state.flash[key] || { box: 0 };
  f.box = ok ? Math.min(5, f.box + 1) : 0;
  const d = new Date(); d.setDate(d.getDate() + GAPS[f.box]);
  f.due = d.toISOString().slice(0, 10);
  state.flash[key] = f; save();
}
export function flashDue(key) { const f = state.flash[key]; return !f || f.due <= today(); }

export function exportJSON() { return JSON.stringify(state, null, 1); }
export function importJSON(text) { const s = JSON.parse(text); state = { ...structuredClone(DEFAULT), ...s }; save(); }
export function resetAll() { state = structuredClone(DEFAULT); save(); }
