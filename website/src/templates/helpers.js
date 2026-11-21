// Small template helpers shared by every page template.
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const ICONS = {
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  right: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  left: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
  up: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21l1.6-4.7A8.5 8.5 0 1 1 8 19.4L3 21z"/><path d="M9 9.5c.3 2.3 2.2 4.2 4.5 4.5l1.5-1.5-2-.8-.8.8a3.5 3.5 0 0 1-1.7-1.7l.8-.8-.8-2L9 9.5z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4z"/><path d="M4 7l8 6 8-6"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM17.5 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v7h4v-7h3l1-4h-4V9c0-.6.4-1 1-1z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4v12H4zM6 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm5 6h4v2c.6-1.1 2-2.3 4-2.3 4 0 5 2.6 5 6V21h-4v-5.5c0-1.5 0-3.3-2-3.3s-2.3 1.5-2.3 3.2V21h-4z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 8s-.2-1.6-.8-2.3c-.8-.8-1.6-.8-2-.9C16.4 4.6 12 4.6 12 4.6s-4.4 0-7.2.2c-.4.1-1.2.1-2 .9C2.2 6.4 2 8 2 8s-.2 1.9-.2 3.8v1.7c0 1.9.2 3.8.2 3.8s.2 1.6.8 2.3c.8.8 1.8.8 2.2.9 1.6.2 7 .2 7 .2s4.4 0 7.2-.2c.4-.1 1.2-.1 2-.9.6-.7.8-2.3.8-2.3s.2-1.9.2-3.8v-1.7C22.2 9.9 22 8 22 8zM10 15V9l5.5 3L10 15z"/></svg>',
  // highlight icons (outline)
  leaf: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 40c-9 0-15-6-15-14 0-10 9-16 20-20-1 11 7 16 7 24 0 6-5 10-12 10z"/><path d="M24 40c0-10 3-16 10-22"/></svg>',
  home: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 36V20l16-10 16 10v16"/><path d="M20 36V26h8v10"/><path d="M6 36h36"/></svg>',
  shield: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 6l16 6v12c0 9-7 15-16 18-9-3-16-9-16-18V12l16-6z"/><path d="M17 24l5 5 9-10"/></svg>',
  clock: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="17"/><path d="M24 13v11l7 5"/></svg>',
  sun: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="8"/><path d="M24 6v6M24 36v6M6 24h6M36 24h6M11 11l4 4M33 33l4 4M11 37l4-4M33 15l4-4"/></svg>',
  water: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 6s12 14 12 23a12 12 0 0 1-24 0C12 20 24 6 24 6z"/><path d="M18 30a6 6 0 0 0 6 6"/></svg>',
  people: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="17" cy="16" r="6"/><circle cx="32" cy="18" r="5"/><path d="M6 38c0-7 5-11 11-11s11 4 11 11M28 38c0-5 3-8 8-8s8 3 8 8"/></svg>',
  grid: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="8" y="8" width="13" height="13"/><rect x="27" y="8" width="13" height="13"/><rect x="8" y="27" width="13" height="13"/><rect x="27" y="27" width="13" height="13"/></svg>',
  road: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 42L20 6h8l6 36"/><path d="M24 12v4M24 22v4M24 32v4"/></svg>',
  star: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 6l5.5 11.5L42 19l-9 8.8 2.2 12.5L24 34l-11.2 6.3L15 27.8 6 19l12.5-1.5z"/></svg>',
};
const icon = n => ICONS[n] || '';

const fmtDate = iso => new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
const paras = text => String(text || '').split(/\n\s*\n/).map(p => `<p>${esc(p.trim())}</p>`).join('');

module.exports = { esc, icon, fmtDate, paras, ICONS };
