// Real face photos from Unsplash (free Unsplash License), loaded on the phone with the user's own free Access Key.
// Photos are hotlinked from Unsplash, as its API guidelines require, and each one is credited to its photographer.
import * as store from './store.js';
import { shuffle } from './util.js';

const POOL_KEY = 'kiokudo.faces.v1';
const UTM = 'utm_source=kiokudo&utm_medium=referral';
const QUERIES = {
  f: ['woman portrait face', 'woman headshot', 'african woman portrait', 'east asian woman portrait', 'south asian woman portrait', 'middle eastern woman portrait', 'latina woman portrait', 'older woman portrait'],
  m: ['man portrait face', 'man headshot', 'african man portrait', 'east asian man portrait', 'south asian man portrait', 'middle eastern man portrait', 'latino man portrait', 'older man portrait'],
};

export function pool() {
  try { return JSON.parse(localStorage.getItem(POOL_KEY)) || { list: [], recent: [] }; } catch { return { list: [], recent: [] }; }
}
function savePool(p) { try { localStorage.setItem(POOL_KEY, JSON.stringify(p)); } catch {} }
export const photosReady = (n = 1) => !!(store.S().settings.realFaces && pool().list.length >= n);

// Fetch about 300–450 portraits: 16 searches, well inside the free 50-requests-per-hour limit.
export async function loadPool(key, onProgress = () => {}) {
  const list = [], seen = new Set(); let done = 0;
  const jobs = Object.entries(QUERIES).flatMap(([g, qs]) => qs.map(q => ({ g, q })));
  for (const { g, q } of jobs) {
    const page = 1 + Math.floor(Math.random() * 2);
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=30&page=${page}&orientation=portrait&content_filter=high&client_id=${encodeURIComponent(key)}`;
    const res = await fetch(url, { headers: { 'Accept-Version': 'v1' } });
    if (res.status === 401) throw new Error('That Access Key was not accepted. Check you copied the Access Key, not the Secret Key.');
    if (res.status === 403 || res.status === 429) throw new Error('Unsplash hourly limit reached. Try again in an hour; photos already loaded are kept.');
    if (!res.ok) throw new Error(`Unsplash error ${res.status}`);
    const js = await res.json();
    for (const r of js.results || []) {
      if (seen.has(r.id) || !r.urls?.raw) continue; seen.add(r.id);
      list.push({ id: r.id, g, url: `${r.urls.raw}&w=320&h=400&fit=crop&crop=faces&q=70&auto=format`, by: r.user?.name || 'Unsplash photographer', link: `${r.user?.links?.html || 'https://unsplash.com'}?${UTM}` });
    }
    onProgress(++done, jobs.length, list.length);
  }
  const p = pool(); p.list = list; p.t = Date.now(); savePool(p);
  return list.length;
}

// Choose n photos, avoiding ones used in recent sessions so faces stay fresh.
export function pickPhotos(n) {
  const p = pool(); const recent = new Set(p.recent || []);
  let fresh = shuffle(p.list.filter(x => !recent.has(x.id)));
  if (fresh.length < n) { p.recent = []; fresh = shuffle(p.list); }
  const out = fresh.slice(0, n);
  p.recent = [...(p.recent || []), ...out.map(x => x.id)].slice(-Math.floor(p.list.length * .7));
  savePool(p);
  return out;
}

// Load images before the clock starts. Any photo that fails falls back to a drawn face.
export function preload(people, ms = 15000) {
  return Promise.race([
    Promise.all(people.filter(x => x.photo).map(x => new Promise(res => { const i = new Image(); i.onload = () => res(); i.onerror = () => { x.photo = null; res(); }; i.src = x.photo.url; }))),
    new Promise(res => setTimeout(res, ms)),
  ]);
}

export const unsplashHome = `https://unsplash.com/?${UTM}`;
