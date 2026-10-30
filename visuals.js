// Small SVG illustrations for techniques, plus generators for faces, abstract shapes and cards.
import { MAJOR_WORDS } from './systems-data.js';

const ink = 'var(--ink)', moss = 'var(--moss)', stone = 'var(--stone)', sand = 'var(--sand-2)', accent = 'var(--accent)';

export function techVisual(kind) {
  const f = V[kind];
  return f ? `<figure class="tech-visual">${f()}</figure>` : '';
}

const V = {
  see: () => `<svg viewBox="0 0 320 130" role="img" aria-label="SEE: senses, exaggerate, energize">
    ${['Senses', 'Exaggerate', 'Energize'].map((t, i) => `
      <g transform="translate(${20 + i * 100},10)">
        <circle cx="40" cy="45" r="${28 + i * 6}" fill="none" stroke="${moss}" stroke-width="2" class="pulse" style="animation-delay:${i * .4}s"/>
        <circle cx="40" cy="45" r="18" fill="${i === 1 ? accent : moss}"/>
        <text x="40" y="50" text-anchor="middle" fill="var(--paper)" font-size="16" font-weight="700">${t[0]}</text>
        <text x="40" y="112" text-anchor="middle" fill="${ink}" font-size="13">${t}</text>
      </g>`).join('')}
  </svg>`,
  chain: () => `<svg viewBox="0 0 320 110" role="img" aria-label="Each item linked to the next">
    ${['kite', 'apple', 'shoe', 'drum'].map((t, i) => `
      <g transform="translate(${12 + i * 78},20)">
        <rect width="62" height="44" rx="10" fill="var(--paper)" stroke="${moss}" stroke-width="2"/>
        <text x="31" y="27" text-anchor="middle" font-size="13" fill="${ink}">${t}</text>
        ${i < 3 ? `<path d="M64 22 h12" stroke="${accent}" stroke-width="3" class="dash"/>` : ''}
      </g>`).join('')}
    <text x="160" y="96" text-anchor="middle" font-size="12" fill="var(--ink-2)">each picture holds two items</text>
  </svg>`,
  loci: () => {
    const pts = [[30, 95], [80, 60], [135, 90], [185, 50], [240, 85], [290, 45]];
    const names = ['door', 'shoes', 'sofa', 'TV', 'window', '★ clock'];
    return `<svg viewBox="0 0 320 140" role="img" aria-label="A route of numbered stops through a palace">
      <path d="M${pts.map(p => p.join(' ')).join(' L')}" fill="none" stroke="${stone}" stroke-width="2" stroke-dasharray="5 6" class="dash"/>
      ${pts.map((p, i) => `<g class="pop" style="animation-delay:${i * .15}s">
        <ellipse cx="${p[0]}" cy="${p[1]}" rx="16" ry="11" fill="${i === 5 ? accent : moss}"/>
        <text x="${p[0]}" y="${p[1] + 4}" text-anchor="middle" font-size="12" fill="var(--paper)">${i + 1}</text>
        <text x="${p[0]}" y="${p[1] + 28}" text-anchor="middle" font-size="11" fill="${ink}">${names[i]}</text></g>`).join('')}
    </svg>`;
  },
  pegs: () => {
    const parts = ['feet', 'knees', 'thighs', 'hips', 'belly', 'chest', 'shoulders', 'neck', 'face', 'head'];
    return `<svg viewBox="0 0 320 210" role="img" aria-label="Body peg list from feet to head">
      <circle cx="90" cy="28" r="16" fill="none" stroke="${ink}" stroke-width="2"/>
      <path d="M90 44 V120 M90 60 L60 95 M90 60 L120 95 M90 120 L70 190 M90 120 L110 190" stroke="${ink}" stroke-width="2" fill="none"/>
      ${parts.map((p, i) => { const y = 195 - i * 19; return `<g class="pop" style="animation-delay:${i * .08}s"><line x1="112" y1="${y}" x2="170" y2="${y}" stroke="${sand}"/><circle cx="182" cy="${y}" r="9" fill="${i === 4 ? accent : moss}"/><text x="182" y="${y + 4}" text-anchor="middle" font-size="10" fill="var(--paper)">${i + 1}</text><text x="198" y="${y + 4}" font-size="12" fill="${ink}">${p}</text></g>`; }).join('')}
    </svg>`;
  },
  curve: () => `<svg viewBox="0 0 320 150" role="img" aria-label="Forgetting curve, lifted by each review">
    <line x1="30" y1="120" x2="305" y2="120" stroke="${stone}"/><line x1="30" y1="15" x2="30" y2="120" stroke="${stone}"/>
    <path d="M30 20 C 50 70, 70 90, 300 105" fill="none" stroke="${stone}" stroke-width="2" stroke-dasharray="4 4"/>
    <path d="M30 20 C 40 50, 50 55, 60 60 L60 22 C 75 45, 90 50, 110 52 L110 22 C 135 38, 160 42, 190 44 L190 22 C 230 32, 270 34, 300 36" fill="none" stroke="${moss}" stroke-width="3" class="draw"/>
    ${[60, 110, 190].map((x, i) => `<circle cx="${x}" cy="22" r="5" fill="${accent}"/><text x="${x}" y="138" text-anchor="middle" font-size="11" fill="${ink}">${['day 1', 'day 3', 'week 1'][i]}</text>`).join('')}
    <text x="300" y="100" text-anchor="end" font-size="11" fill="var(--ink-2)">no review</text>
  </svg>`,
  major: () => {
    const code = [['0', 's z'], ['1', 't d'], ['2', 'n'], ['3', 'm'], ['4', 'r'], ['5', 'l'], ['6', 'j sh ch'], ['7', 'k g'], ['8', 'f v'], ['9', 'p b']];
    return `<div class="code-grid">${code.map(([d, s], i) => `<div class="code-cell pop" style="animation-delay:${i * .05}s"><b>${d}</b><span>${s}</span><em>${MAJOR_WORDS[('0' + d).slice(-2)] || ''}</em></div>`).join('')}</div>`;
  },
  dominic: () => {
    const L = 'OABCDESGHN';
    return `<div class="code-grid">${[...L].map((l, d) => `<div class="code-cell pop" style="animation-delay:${d * .05}s"><b>${d}</b><span>${l}</span></div>`).join('')}</div>
    <p class="caption">15 → A·E, 07 → O·G, 66 → S·S: a person with those initials</p>`;
  },
  pao: () => `<svg viewBox="0 0 320 120" role="img" aria-label="Six digits become person, action, object">
    ${[['52', 'Person', 'footballer'], ['07', 'Action', 'wringing'], ['86', 'Object', 'fish']].map(([n, r, w], i) => `
      <g transform="translate(${12 + i * 102},12)"><g class="pop" style="animation-delay:${i * .2}s">
        <rect width="92" height="80" rx="12" fill="var(--paper)" stroke="${i === 1 ? accent : moss}" stroke-width="2"/>
        <text x="46" y="28" text-anchor="middle" font-size="22" font-weight="700" fill="${ink}">${n}</text>
        <text x="46" y="50" text-anchor="middle" font-size="11" fill="var(--ink-2)">${r}</text>
        <text x="46" y="68" text-anchor="middle" font-size="12" fill="${ink}">${w}</text></g></g>`).join('')}
    <text x="160" y="112" text-anchor="middle" font-size="12" fill="var(--ink-2)">520786 → the footballer wringing a fish</text>
  </svg>`,
  binary: () => `<div class="code-grid">${[0, 1, 2, 3, 4, 5, 6, 7].map(n => `<div class="code-cell pop" style="animation-delay:${n * .05}s"><span class="mono">${n.toString(2).padStart(3, '0')}</span><b>${n}</b></div>`).join('')}</div>
    <p class="caption">101 110 → 5 6 → your image for 56</p>`,
  cards: () => `<div class="card-fan">${['A♠', '3♥', 'K♣', '7♦', 'Q♥'].map((c, i) => `<div class="pcard ${/[♥♦]/.test(c) ? 'red' : ''}" style="--r:${(i - 2) * 9}deg;animation-delay:${i * .1}s">${c}</div>`).join('')}</div>`,
  faces: () => `<div class="face-row">${[11, 42, 77].map((s, i) => `<div class="pop" style="animation-delay:${i * .15}s">${faceSVG(s, 72)}<small>${['Hiro Tanaka', 'Ayesha Khan', 'Kofi Mensah'][i]}</small></div>`).join('')}</div>`,
  images: () => `<div class="img-row">${[3, 8, 15, 21, 34].map(s => `<div>${abstractSVG(s, 52)}</div>`).join('')}</div>`,
  spoken: () => `<svg viewBox="0 0 320 90" role="img" aria-label="Digits spoken one per second">
    ${[5, 2, 0, 7, 8, 6].map((d, i) => `<g class="pop" style="animation-delay:${i * .5}s"><circle cx="${30 + i * 52}" cy="40" r="20" fill="${i % 2 ? moss : 'var(--paper)'}" stroke="${moss}" stroke-width="2"/><text x="${30 + i * 52}" y="46" text-anchor="middle" font-size="18" fill="${i % 2 ? 'var(--paper)' : ink}">${d}</text></g>`).join('')}
    <text x="160" y="82" text-anchor="middle" font-size="12" fill="var(--ink-2)">one digit per second, no pause</text>
  </svg>`,
  rows: () => `<div class="rows-demo">${['5207 8614 9302 7716 4421', '0938 1175 6620 3349 8851', '7712 0346 5589 2210 9963'].map((r, i) => `<div class="pop ${i === 1 ? 'half' : ''}" style="animation-delay:${i * .2}s"><span class="mono">${r}</span><b>${i === 1 ? '½' : '✓'}</b></div>`).join('')}</div>`,
  flash: () => `<div class="flash-demo"><div class="flip"><div class="front">86</div><div class="back">fish</div></div></div>`,
  breath: () => `<div class="breath-demo"><div class="breath-circle"></div><span>in · out · count</span></div>`,
};

// ── Seeded random ──────────────────────────────────────────
export function rng(seed) { let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }

// ── Procedural faces ───────────────────────────────────────
const SKIN = ['#F6D7B8', '#EBC29A', '#D9A57A', '#C08A5B', '#9C6B43', '#7A4E2E', '#5B3820'];
const HAIR = ['#1B1714', '#3B2A1E', '#6B4A2E', '#A2703F', '#D9B26A', '#8F8F8F', '#E8E3D8', '#7A2E2E'];
const SHIRT = ['#5B6B3A', '#3D5A80', '#9E2B1F', '#C9A227', '#6B6A64', '#7A4E8C', '#2E7D7A', '#D07A4A'];
export function faceSVG(seed, size = 120) {
  const r = rng(seed * 7919 + 13), pick = a => a[Math.floor(r() * a.length)];
  const skin = pick(SKIN), hair = pick(HAIR), shirt = pick(SHIRT);
  const hs = Math.floor(r() * 6), w = 34 + r() * 8, h = 42 + r() * 8, eye = 3 + r() * 2;
  const glasses = r() < .3, beard = r() < .25, earrings = r() < .25, brows = 1.5 + r() * 3, mouthW = 8 + r() * 8, smile = r() < .6;
  const hairShapes = [
    `<path d="M${60 - w} 52 Q60 ${4 - r() * 6} ${60 + w} 52 L${60 + w} 40 Q60 10 ${60 - w} 40Z" fill="${hair}"/>`,
    `<path d="M${60 - w - 4} 95 Q${56 - w} 20 60 18 Q${64 + w} 20 ${64 + w} 95 L${50 + w} 95 Q${52 + w} 40 60 34 Q${68 - w} 40 ${70 - w} 95Z" fill="${hair}"/>`,
    `<ellipse cx="60" cy="30" rx="${w + 6}" ry="22" fill="${hair}"/>`,
    `<path d="M${60 - w} 45 Q60 14 ${60 + w} 45 Q60 30 ${60 - w} 45Z" fill="${hair}"/>`,
    `<g fill="${hair}">${[...Array(9)].map((_, i) => `<circle cx="${60 - w + i * w / 4}" cy="${30 + Math.sin(i) * 4}" r="10"/>`).join('')}</g>`,
    `<path d="M${60 - w} 48 Q60 8 ${60 + w} 48 Q${60 + w} 30 60 26 Q${60 - w} 30 ${60 - w} 48Z" fill="${hair}"/><circle cx="60" cy="12" r="11" fill="${hair}"/>`,
  ];
  return `<svg viewBox="0 0 120 130" width="${size}" height="${size * 130 / 120}" role="img" aria-label="face">
    <rect x="10" y="100" width="100" height="40" rx="30" fill="${shirt}"/>
    <rect x="52" y="86" width="16" height="18" fill="${skin}"/>
    ${hs === 1 ? hairShapes[1] : ''}
    <ellipse cx="60" cy="60" rx="${w}" ry="${h}" fill="${skin}"/>
    <ellipse cx="${60 - w}" cy="62" rx="5" ry="8" fill="${skin}"/><ellipse cx="${60 + w}" cy="62" rx="5" ry="8" fill="${skin}"/>
    ${earrings ? `<circle cx="${60 - w}" cy="73" r="3" fill="#C9A227"/><circle cx="${60 + w}" cy="73" r="3" fill="#C9A227"/>` : ''}
    ${hs !== 1 ? hairShapes[hs] : `<path d="M${60 - w} 50 Q60 10 ${60 + w} 50 Q60 34 ${60 - w} 50Z" fill="${hair}"/>`}
    <path d="M${46 - eye} ${50 - brows} h${10 + eye}" stroke="${hair}" stroke-width="${brows}" stroke-linecap="round"/>
    <path d="M${64} ${50 - brows} h${10 + eye}" stroke="${hair}" stroke-width="${brows}" stroke-linecap="round"/>
    <circle cx="50" cy="58" r="${eye}" fill="#1B1714"/><circle cx="70" cy="58" r="${eye}" fill="#1B1714"/>
    ${glasses ? `<g fill="none" stroke="#2E2D29" stroke-width="2"><circle cx="50" cy="58" r="9"/><circle cx="70" cy="58" r="9"/><path d="M59 58h2"/></g>` : ''}
    <path d="M60 62 q-3 9 0 11" stroke="#00000040" stroke-width="2" fill="none"/>
    <path d="M${60 - mouthW / 2} 82 q${mouthW / 2} ${smile ? 6 : -2} ${mouthW} 0" stroke="#7A2E2E" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    ${beard ? `<path d="M${62 - w} 70 Q60 ${115 + r() * 6} ${58 + w} 70 Q60 96 ${62 - w} 70Z" fill="${hair}" opacity=".9"/>` : ''}
  </svg>`;
}

// ── Abstract images (black and white shapes with textures) ──────────────
export function abstractSVG(seed, size = 64) {
  const r = rng(seed * 104729 + 7);
  const n = 5 + Math.floor(r() * 5), cx = 32, cy = 32;
  const pts = [...Array(n)].map((_, i) => { const a = i / n * Math.PI * 2 + r() * .6, d = 12 + r() * 18; return [cx + Math.cos(a) * d, cy + Math.sin(a) * d]; });
  const f1 = v => v.toFixed(1);
  const d = `M${f1(pts[0][0])} ${f1(pts[0][1])} ` + pts.map((p, i) => { const q = pts[(i + 1) % n]; const k = .4 + r() * 1.2; return `Q${f1(cx + (p[0] - cx) * k)} ${f1(cy + (p[1] - cy) * k)} ${f1(q[0])} ${f1(q[1])}`; }).join(' ') + 'Z';
  const pat = Math.floor(r() * 4), id = 'p' + seed;
  const fills = [
    `<pattern id="${id}" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 6 L6 0" stroke="#111" stroke-width="1.6"/></pattern>`,
    `<pattern id="${id}" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.4" fill="#111"/></pattern>`,
    `<pattern id="${id}" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 4 H8 M4 0 V8" stroke="#111" stroke-width="1.2"/></pattern>`,
    `<pattern id="${id}" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="#111"/></pattern>`,
  ];
  return `<svg viewBox="0 0 64 64" width="${size}" height="${size}" role="img" aria-label="abstract shape"><defs>${fills[pat]}</defs><rect width="64" height="64" fill="#fff"/><path d="${d}" fill="url(#${id})" stroke="#111" stroke-width="2"/></svg>`;
}

// ── Playing cards ──────────────────────────────────────────
export const SUITS = ['S', 'H', 'D', 'C'];
export const SUIT_SYM = { S: '♠', H: '♥', D: '♦', C: '♣' };
export const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
export function cardLabel(id) { return (id[0] === 'T' ? '10' : id[0]) + SUIT_SYM[id[1]]; }
export function cardHTML(id, cls = '') {
  const red = id[1] === 'H' || id[1] === 'D';
  return `<div class="pcard big ${red ? 'red' : ''} ${cls}"><span class="tl">${cardLabel(id)}</span><span class="mid">${SUIT_SYM[id[1]]}</span><span class="br">${cardLabel(id)}</span></div>`;
}
