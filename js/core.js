// Shared namespace, helpers, icons, the sections and the saved progress.
window.FD = (() => {
  'use strict';
  const FD = { scenes: [], speed: 1 };

  FD.add = (scene) => FD.scenes.push(scene);

  // Build one element from an HTML string.
  FD.h = (html) => {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  };

  // Durations are divided by the playback speed.
  FD.dur = (ms) => ms / FD.speed;
  FD.wait = (ms) => new Promise((r) => setTimeout(r, FD.dur(ms)));
  FD.fmt = (n) => Math.round(n).toLocaleString('en-GB');
  FD.esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  FD.shuffle = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
  FD.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  FD.today = () => new Date().toLocaleDateString('en-GB');

  // Run fn(t) with t going 0 → 1 over ms (scaled by speed). Resolves when finished.
  FD.tween = (ms, fn) => new Promise((res) => {
    const t0 = performance.now(), d = FD.dur(ms);
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / d);
      fn(t);
      if (t < 1) requestAnimationFrame(tick); else res();
    };
    requestAnimationFrame(tick);
  });
  // Point at fraction t along a polyline [[x, y], …].
  FD.along = (pts, t) => {
    const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
    let d = t * seg.reduce((a, b) => a + b, 0);
    for (let i = 0; i < seg.length; i++) {
      if (d <= seg[i] || i === seg.length - 1) {
        const k = seg[i] ? Math.min(1, d / seg[i]) : 1;
        return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k];
      }
      d -= seg[i];
    }
    return pts[pts.length - 1];
  };

  FD.shake = (el) => {
    el.classList.remove('shake');
    void el.offsetWidth;
    el.classList.add('shake');
  };
  FD.pulse = (el) => {
    if (!el) return;
    el.classList.remove('pulse');
    void el.offsetWidth;
    el.classList.add('pulse');
  };

  // Segmented control: buttons with data-v, one is .on.
  FD.segSet = (root, v) => {
    root.querySelectorAll('button[data-v]').forEach((b) => {
      const on = b.dataset.v === String(v);
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on);
    });
  };

  // Highlight one zone of a mock: root gets .focusing, matching [data-zone] gets .focus.
  FD.focus = (root, zones) => {
    const list = zones ? [].concat(zones) : [];
    root.classList.toggle('focusing', list.length > 0);
    const zs = [...root.querySelectorAll('[data-zone]')];
    zs.forEach((z) => { z.classList.toggle('focus', list.includes(z.dataset.zone)); z.classList.remove('focus-in'); });
    zs.filter((z) => z.classList.contains('focus')).forEach((z) => {
      for (let p = z.parentElement?.closest('[data-zone]'); p && root.contains(p); p = p.parentElement?.closest('[data-zone]')) p.classList.add('focus-in');
    });
  };

  // Small toast inside a mock.
  FD.toast = (host, html, ms = 2600) => {
    const t = FD.h(`<div class="toast">${html}</div>`);
    host.appendChild(t);
    setTimeout(() => t.classList.add('out'), FD.dur(ms));
    setTimeout(() => t.remove(), FD.dur(ms) + 400);
  };

  // Panels inside a stage: buttons [data-p] switch the visible [data-panel].
  FD.panels = (root, onShow) => {
    const show = (p) => {
      root.querySelectorAll('[data-panel]').forEach((x) => { x.hidden = x.dataset.panel !== p; });
      root.querySelectorAll('.ptabs button[data-p]').forEach((b) => {
        const on = b.dataset.p === p;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', on);
      });
      root.dataset.panel = p;
      if (onShow) onShow(p);
    };
    root.querySelectorAll('.ptabs button[data-p]').forEach((b) => b.addEventListener('click', () => show(b.dataset.p)));
    return show;
  };

  // Copy text to the clipboard, with a fallback for older browsers.
  FD.copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      ta.remove();
      return ok;
    }
  };

  FD.download = (name, text, type = 'text/plain') => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type }));
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  FD.slug = (s) => String(s || 'student').trim().replace(/[^\w]+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'student';

  // ---------- the two parts and their sections ----------
  FD.PARTS = {
    A: { name: 'Risks to data and information', ch: 'Unit 3', pages: 'pages 96–99' },
    B: { name: 'Keeping data secure and paying online', ch: 'Unit 3', pages: 'pages 99–108' },
  };
  FD.SECTIONS = [
    { id: 'access', part: 'A', name: 'Unauthorised access', short: 'Unauthorised access', color: '--c4', line: 'Getting into networks without permission, and botnets.' },
    { id: 'malware', part: 'A', name: 'Deliberate damage by malware', short: 'Malware', color: '--c9', line: 'What malware can do, and ransomware.' },
    { id: 'deletion', part: 'A', name: 'Accidental deletion', short: 'Accidental deletion', color: '--c8', line: 'A wrong key, the wrong drive or a power cut.' },
    { id: 'phishing', part: 'A', name: 'Theft of personal data: phishing', short: 'Phishing', color: '--c6', line: 'Fake messages, spear phishing and smishing.' },
    { id: 'pharming', part: 'A', name: 'Theft of personal data: pharming', short: 'Pharming', color: '--c3', line: 'Fake websites, redirected traffic and look-alike URLs.' },
    { id: 'firewall', part: 'B', name: 'Firewalls and encryption', short: 'Firewalls · encryption', color: '--c1', line: 'Rules for traffic in and out, and scrambling data with a key.' },
    { id: 'passwords', part: 'B', name: 'Passwords, PINs and biometrics', short: 'Passwords', color: '--c2', line: 'Authenticating users, strong passwords and masking.' },
    { id: 'captcha', part: 'B', name: 'CAPTCHA tests and security questions', short: 'CAPTCHA', color: '--c5', line: 'Telling humans and bots apart; reCAPTCHA.' },
    { id: 'antimalware', part: 'B', name: 'Anti-malware and file permissions', short: 'Anti-malware', color: '--c7', line: 'Anti-virus, anti-adware, anti-spyware and access rights.' },
    { id: 'secure', part: 'B', name: 'Secure websites, attachments and links', short: 'HTTPS · links', color: '--c4', line: 'HTTPS and the padlock; when not to open or click.' },
    { id: 'backup', part: 'B', name: 'Backup procedures', short: 'Backups', color: '--c8', line: 'Full, differential and incremental backups; good ideas.' },
    { id: 'payments', part: 'B', name: 'Online payment systems', short: 'Payments', color: '--c6', line: 'Third-party processors, bank cards, contactless NFC and HTTPS.' },
  ];
  FD.section = (id) => FD.SECTIONS.find((s) => s.id === id);

  // ---------- saved progress (this browser, plus a progress code to move it) ----------
  const KEY = 'rd-progress-v1';
  const blank = () => ({ v: 1, name: '', cls: '', seen: {}, last: '', step: 0, checks: {}, acts: {}, tests: {}, started: FD.today(), updated: '' });
  FD.state = blank();
  FD.canSave = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) FD.state = Object.assign(blank(), JSON.parse(raw));
  } catch (e) { FD.canSave = false; }
  FD.results = FD.state.checks;

  let saveTimer = null;
  FD.save = (now) => {
    FD.state.updated = new Date().toISOString();
    clearTimeout(saveTimer);
    const write = () => { try { localStorage.setItem(KEY, JSON.stringify(FD.state)); FD.canSave = true; } catch (e) { FD.canSave = false; } };
    if (now) write(); else saveTimer = setTimeout(write, 250);
    if (FD.onChange) FD.onChange();
  };
  FD.replaceState = (s) => {
    FD.state = Object.assign(blank(), s);
    FD.results = FD.state.checks;
    FD.save(true);
  };
  FD.resetState = () => FD.replaceState(blank());
  FD.hasProgress = () => !!(Object.keys(FD.state.seen).length || Object.keys(FD.state.checks).length || Object.keys(FD.state.acts).length || Object.keys(FD.state.tests).length);

  FD.saveResult = (id, score, total) => {
    const r = FD.state.checks[id] || { tries: 0, best: 0 };
    FD.state.checks[id] = { score, total, tries: r.tries + 1, best: Math.max(r.best || 0, score), date: FD.today() };
    FD.save();
    if (FD.onResult) FD.onResult(id);
  };
  FD.markSeen = (id) => {
    if (FD.state.seen[id]) return;
    FD.state.seen[id] = FD.today();
    FD.save();
    if (FD.onResult) FD.onResult(id);
  };

  // ---------- icons (24×24 line icons) ----------
  const ic = (p) => `<svg viewBox="0 0 24 24" class="ic" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  FD.icon = {
    start: ic('<circle cx="12" cy="12" r="9"/><path d="M10 8.5l5 3.5-5 3.5z"/>'),
    access: ic('<rect x="3" y="11" width="11" height="9" rx="1.6"/><path d="M5.5 11V8a3 3 0 0 1 6 0v3"/><path d="M16.5 8.5l4 4M20.5 8.5l-4 4"/>'),
    malware: ic('<ellipse cx="12" cy="13.5" rx="4.5" ry="5.5"/><path d="M12 8V5.5M9.5 6.5L8 4.5M14.5 6.5L16 4.5M7.5 12H4M7.5 16l-3 1.5M16.5 12H20M16.5 16l3 1.5M12 9v9"/>'),
    deletion: ic('<path d="M4.5 6.5h15M9.5 6.5V4h5v2.5M6.5 6.5l1 14h9l1-14"/><path d="M10 10.5v6.5M14 10.5v6.5"/>'),
    phishing: ic('<path d="M12 3v9a4 4 0 0 1-8 0"/><path d="M4 12l2.5-1.8"/><rect x="11" y="14" width="10" height="7" rx="1"/><path d="M11 14.5l5 3.5 5-3.5"/>'),
    pharming: ic('<rect x="2.5" y="4" width="19" height="16" rx="2"/><path d="M2.5 8.5h19"/><circle cx="5.2" cy="6.3" r=".5"/><path d="M7 13.5h5M7 16.5h9"/><path d="M16 12l3 3M19 12l-3 3"/>'),
    firewall: ic('<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 9.3h18M3 14.7h18M9 4v5.3M15 4v5.3M6 9.3v5.4M12 9.3v5.4M18 9.3v5.4M9 14.7V20M15 14.7V20"/>'),
    passwords: ic('<rect x="2.5" y="8" width="19" height="8" rx="2"/><path d="M6.5 12h.01M10 12h.01M13.5 12h.01M17 12h.01" stroke-width="3"/>'),
    captcha: ic('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 12.5l3 3 7-7"/>'),
    antimalware: ic('<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6z"/><path d="M8.5 12.2l2.5 2.5 4.5-5"/>'),
    secure: ic('<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15.5" r="1.3"/>'),
    backup: ic('<ellipse cx="12" cy="6" rx="7" ry="2.8"/><path d="M5 6v6c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V6"/><path d="M5 12v6c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-6"/>'),
    payments: ic('<rect x="2.5" y="5.5" width="19" height="13" rx="2"/><path d="M2.5 9.5h19M6 15h4"/>'),
    wifi: ic('<path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.6 16a5 5 0 0 1 6.8 0"/><circle cx="12" cy="19.2" r=".8"/>'),
    terms: ic('<path d="M3.5 5h6a2.5 2.5 0 0 1 2.5 2.5V20a2 2 0 0 0-2-2H3.5z"/><path d="M20.5 5h-6A2.5 2.5 0 0 0 12 7.5V20a2 2 0 0 1 2-2h6.5z"/>'),
    final: ic('<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1"/><path d="M8.5 11l1.6 1.6 3-3M8.5 16.5h7"/>'),
    check: ic('<circle cx="12" cy="12" r="9"/><path d="M8 12.3l2.8 2.8L16.2 9.6"/>'),
    activity: ic('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>'),
    progress: ic('<path d="M3.5 3.5v17h17"/><path d="M7.5 15l4-4.5 3 2.5 5-6"/>'),
    help: ic('<circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.8"/><circle cx="12" cy="17.2" r=".5"/>'),
    tick: ic('<path d="M4.5 12.5l5 5 10-11"/>'),
    cross: ic('<path d="M6 6l12 12M18 6L6 18"/>'),
    copy: ic('<rect x="8.5" y="8.5" width="12" height="12" rx="2"/><path d="M15.5 8.5V5a1.5 1.5 0 0 0-1.5-1.5H5A1.5 1.5 0 0 0 3.5 5v9A1.5 1.5 0 0 0 5 15.5h3.5"/>'),
    download: ic('<path d="M12 4v11M7 10.5l5 5 5-5"/><path d="M4.5 19.5h15"/>'),
    upload: ic('<path d="M12 15.5V4.5M7 9l5-5 5 5"/><path d="M4.5 19.5h15"/>'),
    key: ic('<circle cx="7.5" cy="12" r="3.5"/><path d="M11 12h10M17.5 12v3M20.5 12v2"/>'),
    lock: ic('<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>'),
    unlock: ic('<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 7.6-1.7"/>'),
    globe: ic('<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18z"/>'),
    user: ic('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
    play: ic('<path d="M7 4.5v15l12-7.5z"/>'),
    shield: ic('<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6z"/>'),
    search: ic('<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>'),
    file: ic('<path d="M6 3h8l4.5 4.5V21H6z"/><path d="M14 3v4.5h4.5"/>'),
    printer: ic('<path d="M7 9V3.5h10V9"/><rect x="3.5" y="9" width="17" height="7.5" rx="1.5"/><path d="M7 14h10v6.5H7z"/>'),
    bt: ic('<path d="M7 7.5l10 9-5 4.5V3l5 4.5-10 9"/>'),
  };

  // ---------- small device drawings used in several scenes (inline SVG <g>) ----------
  // Each returns markup for a 60×46 box with its top-left corner at (x, y).
  FD.dv = {
    laptop: (x, y) => `<g transform="translate(${x} ${y})"><rect class="dv-body" x="8" y="2" width="44" height="30" rx="3"/><rect class="dv-screen" x="12" y="6" width="36" height="22" rx="1"/><path class="dv-body" d="M2 34h56l-4 7H6z"/></g>`,
    desktop: (x, y) => `<g transform="translate(${x} ${y})"><rect class="dv-body" x="6" y="2" width="48" height="32" rx="3"/><rect class="dv-screen" x="10" y="6" width="40" height="24" rx="1"/><rect class="dv-body" x="26" y="34" width="8" height="6"/><rect class="dv-body" x="18" y="40" width="24" height="4" rx="2"/></g>`,
    phone: (x, y) => `<g transform="translate(${x} ${y})"><rect class="dv-body" x="19" y="0" width="22" height="44" rx="4"/><rect class="dv-screen" x="22" y="5" width="16" height="32" rx="1"/><circle class="dv-detail" cx="30" cy="40.5" r="1.6"/></g>`,
    tablet: (x, y) => `<g transform="translate(${x} ${y})"><rect class="dv-body" x="10" y="0" width="40" height="46" rx="4"/><rect class="dv-screen" x="14" y="4" width="32" height="36" rx="1"/><circle class="dv-detail" cx="30" cy="43" r="1.4"/></g>`,
    printer: (x, y) => `<g transform="translate(${x} ${y})"><rect class="dv-paper" x="16" y="2" width="28" height="14"/><rect class="dv-body" x="4" y="14" width="52" height="20" rx="4"/><rect class="dv-paper" x="14" y="30" width="32" height="12"/><circle class="dv-led" cx="48" cy="21" r="2"/></g>`,
    server: (x, y) => `<g transform="translate(${x} ${y})"><rect class="dv-body" x="14" y="0" width="32" height="46" rx="3"/><path class="dv-detail" d="M18 7h24v3H18zM18 15h24v3H18zM18 23h24v3H18z"/><circle class="dv-led" cx="40" cy="38" r="2"/></g>`,
    router: (x, y) => `<g transform="translate(${x} ${y})"><path class="dv-detail" d="M14 22V4h3v18zM43 22V4h3v18z"/><rect class="dv-body" x="4" y="20" width="52" height="18" rx="5"/><circle class="dv-led" cx="14" cy="29" r="2"/><circle class="dv-led" cx="21" cy="29" r="2"/><circle class="dv-led" cx="28" cy="29" r="2"/></g>`,
    switch: (x, y) => `<g transform="translate(${x} ${y})"><rect class="dv-body" x="2" y="14" width="56" height="18" rx="3"/>${[0, 1, 2, 3, 4, 5].map((i) => `<rect class="dv-screen" x="${7 + i * 8}" y="19" width="5" height="5" rx="1"/>`).join('')}<circle class="dv-led" cx="52" cy="27" r="1.6"/></g>`,
    tv: (x, y) => `<g transform="translate(${x} ${y})"><rect class="dv-body" x="2" y="2" width="56" height="34" rx="3"/><rect class="dv-screen" x="6" y="6" width="48" height="26" rx="1"/><rect class="dv-body" x="22" y="36" width="16" height="4"/><rect class="dv-body" x="16" y="40" width="28" height="4" rx="2"/></g>`,
    ap: (x, y) => `<g transform="translate(${x} ${y})"><ellipse class="dv-body" cx="30" cy="30" rx="22" ry="9"/><ellipse class="dv-screen" cx="30" cy="27" rx="18" ry="5"/><circle class="dv-led" cx="30" cy="31" r="1.6"/><path class="dv-arc" d="M20 14a14 14 0 0 1 20 0M24 18a8 8 0 0 1 12 0"/></g>`,
    cloud: (x, y) => `<g transform="translate(${x} ${y})"><path class="dv-cloud" d="M16 40h30a10 10 0 0 0 1-20 14 14 0 0 0-27-3 11 11 0 0 0-4 23z"/></g>`,
  };

  return FD;
})();
