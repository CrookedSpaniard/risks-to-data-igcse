FD.add({
  id: 'access',
  title: 'Unauthorised access',
  tab: 'Unauthorised access',
  icon: 'access',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['malware (malicious software)', 'software that is created with the intention to do harm'],
  ],
  mount(el) {
    // Figure 6.1: the amount of data communicated online.
    const DATA = [
      ['📧', 2.9, 'million', 'emails sent every second'],
      ['🐦', 50, 'million', 'tweets every day'],
      ['👍', 700, 'billion', 'minutes spent on Facebook every month'],
      ['🔍', 24, 'petabytes', 'of data processed by Google every day'],
    ];
    const COMMON = ['123456', 'password', '12345678', 'qwerty', 'abc123', '111111', 'iloveyou', 'admin', 'welcome', 'monkey', 'football', 'letmein'];
    const PCS = [[60, 50], [150, 30], [240, 50], [60, 130], [150, 150], [240, 130], [60, 210], [150, 230], [240, 210]];
    const VICTIMS = [[470, 40], [500, 125], [470, 215]];
    el.innerHTML = `
      <div class="sim ac">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="data">📊 Data online</button><button data-p="bot">🔐 Trying to log in</button><button data-p="net">🤖 Botnets</button>
        </div>

        <div data-panel="data" class="sim">
          <div class="sim-box ac-data">
            <div class="ac-me"><span>🧑</span><small>you, online</small></div>
            ${DATA.map(([e, n, u, t], i) => `<div class="ac-bub" data-zone="b${i}"><span>${e}</span><b data-n="${n}">0</b> <i>${u}</i><small>${t}</small></div>`).join('')}
          </div>
          <div class="cards3">
            <div class="mini" data-c="pers"><h5>🪪 Personal data</h5><p>Names, addresses, dates of birth, photos, passwords.</p></div>
            <div class="mini" data-c="fin"><h5>💳 Financial data</h5><p>Bank account numbers, card numbers, payment details.</p></div>
            <div class="mini" data-c="crim" style="--c:var(--bad)"><h5>🕵️ Criminals want it</h5><p>To commit <b>fraud</b> or <b>identity theft</b>.</p></div>
          </div>
        </div>

        <div data-panel="bot" class="sim" hidden>
          <div class="ac-bot">
            <div class="sim-box ac-login">
              <p class="ac-net">🏢 School network · log in</p>
              <label>Username<input value="admin" readonly></label>
              <label>Password<input id="pw" readonly></label>
              <p class="ac-res" id="res">🔒 Locked</p>
              <div class="seg" id="sec"><span class="seg-l">Security of this network</span><button data-v="poor">Poor: a common password</button><button data-v="good">Better: a long, random password</button></div>
            </div>
            <div>
              <div class="readout"><div class="ro"><small>Attempts</small><b id="att">0</b></div><div class="ro"><small>Per second</small><b id="rate">0</b></div></div>
              <pre class="cli" id="log" aria-live="off"></pre>
            </div>
          </div>
          <div class="ctrls"><button class="btn primary small-btn" id="go">▶ Run the login software</button><span class="note">The software runs <b>thousands of times per second</b>, inputting login details one after another.</span></div>
        </div>

        <div data-panel="net" class="sim" hidden>
          <div class="sim-box">
            <svg viewBox="0 0 560 270" aria-label="An attacker takes over computers to make a botnet that spreads malware">
              <g id="links">${PCS.map(([x, y], i) => `<line class="ac-link" data-i="${i}" x1="${x + 30}" y1="${y + 22}" x2="370" y2="135"/>`).join('')}</g>
              <g id="spread">${VICTIMS.map(([x, y], i) => `<line class="ac-spread" data-i="${i}" x1="${PCS[[2, 5, 8][i]][0] + 30}" y1="${PCS[[2, 5, 8][i]][1] + 22}" x2="${x + 20}" y2="${y + 22}"/>`).join('')}</g>
              ${PCS.map(([x, y], i) => `<g class="ac-pc" data-i="${i}">${FD.dv.desktop(x, y)}<text class="emo ac-bad" x="${x + 30}" y="${y + 17}" font-size="16">🤖</text></g>`).join('')}
              <g transform="translate(345 105)"><circle r="30" cx="25" cy="30" class="ac-hk"/><text class="emo" x="25" y="31" font-size="28">🕵️</text><text class="svg-sm" x="25" y="76">unauthorised user</text></g>
              ${VICTIMS.map(([x, y], i) => `<g class="ac-vic" data-i="${i}"><circle cx="${x + 20}" cy="${y + 22}" r="20"/><text class="emo" x="${x + 20}" y="${y + 23}" font-size="18">💻</text></g>`).join('')}
              <text class="svg-sm" x="490" y="262">other devices</text>
            </svg>
          </div>
          <div class="ctrls">
            <button class="btn primary small-btn" id="take">▶ Take over the computers</button>
            <button class="btn small-btn" id="use" disabled>🦠 Use the botnet</button>
            <span class="pill">🤖 In the botnet: <b id="nBot">0</b> / 9</span>
          </div>
        </div>
      </div>`;
    const root = el.querySelector('.ac'), $ = (s) => root.querySelector(s);
    let dead = false;

    // ---- data counters ----
    async function count() {
      root.querySelectorAll('.ac-bub b').forEach((b) => { b.textContent = '0'; });
      await FD.tween(1800, (t) => root.querySelectorAll('.ac-bub b').forEach((b) => {
        const n = +b.dataset.n;
        b.textContent = n < 10 ? (n * t).toFixed(1) : Math.round(n * t);
      }));
    }
    const cards = (list) => root.querySelectorAll('.mini').forEach((m) => { m.classList.toggle('hot', list.includes(m.dataset.c)); m.classList.toggle('off', list.length > 0 && !list.includes(m.dataset.c)); });

    // ---- login software ----
    let sec = 'poor', runId = 0;
    const secSeg = $('#sec');
    const setSec = (v) => { sec = v; FD.segSet(secSeg, v); resetBot(); };
    secSeg.addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) setSec(b.dataset.v); });
    function resetBot() {
      runId++;
      $('#att').textContent = '0'; $('#rate').textContent = '0'; $('#log').textContent = ''; $('#pw').value = '';
      const r = $('#res'); r.textContent = '🔒 Locked'; r.className = 'ac-res';
    }
    const rnd = () => Math.random().toString(36).slice(2, 10);
    async function attack() {
      resetBot();
      const id = runId, log = $('#log'), lines = [];
      const add = (s) => { lines.push(s); if (lines.length > 9) lines.shift(); log.textContent = lines.join('\n'); };
      const total = sec === 'poor' ? COMMON.length : 60;
      for (let i = 0; i < total; i++) {
        if (dead || id !== runId) return;
        const guess = i < COMMON.length ? COMMON[i] : rnd();
        $('#pw').value = '•'.repeat(guess.length);
        const n = sec === 'poor' ? i + 1 : Math.round(1 + i * i * 37 + i * 911);
        $('#att').textContent = FD.fmt(n);
        $('#rate').textContent = FD.fmt(2800 + Math.random() * 600);
        const hit = sec === 'poor' && guess === 'letmein';
        add(`try ${FD.fmt(n).padStart(7)}  admin / ${guess.padEnd(10)} ${hit ? '✔ ACCEPTED' : '✗ rejected'}`);
        if (hit) {
          const r = $('#res'); r.textContent = '🔓 Access granted to an unauthorised user!'; r.className = 'ac-res bad';
          return;
        }
        await FD.wait(sec === 'poor' ? 260 : 90);
      }
      if (id === runId) { add('… still trying: no match found'); const r = $('#res'); r.textContent = '🔒 Still locked: the software gives up and looks for a network with poorer security'; r.className = 'ac-res good'; }
    }
    $('#go').addEventListener('click', attack);

    // ---- botnet ----
    let botRun = 0;
    function resetNet() {
      botRun++;
      root.querySelectorAll('.ac-pc, .ac-link, .ac-spread, .ac-vic').forEach((x) => x.classList.remove('on'));
      $('#nBot').textContent = '0'; $('#use').disabled = true;
    }
    async function take() {
      resetNet();
      const id = botRun;
      for (let i = 0; i < PCS.length; i++) {
        await FD.wait(320);
        if (dead || id !== botRun) return;
        root.querySelector(`.ac-link[data-i="${i}"]`).classList.add('on');
        root.querySelector(`.ac-pc[data-i="${i}"]`).classList.add('on');
        $('#nBot').textContent = i + 1;
      }
      $('#use').disabled = false;
    }
    async function use() {
      if ($('#nBot').textContent !== '9') await take();
      const id = botRun;
      if (dead || $('#nBot').textContent !== '9') return;
      root.querySelectorAll('.ac-spread').forEach((l) => l.classList.add('on'));
      for (let i = 0; i < VICTIMS.length; i++) {
        await FD.wait(500);
        if (dead || id !== botRun) return;
        root.querySelector(`.ac-vic[data-i="${i}"]`).classList.add('on');
      }
    }
    $('#take').addEventListener('click', take);
    $('#use').addEventListener('click', use);

    const show = FD.panels(root);
    show('data');
    setSec('poor');
    return { show, count, cards, setSec, attack, resetBot, take, use, resetNet, focus: (z) => FD.focus($('.ac-data'), z), destroy() { dead = true; runId++; botRun++; } };
  },
  steps: [
    {
      title: 'A huge amount of data',
      text: `<p>The amount of data communicated online is almost unimaginable (Figure 6.1). A lot of this data contains <strong>personal</strong> or <strong>financial</strong> information.</p>`,
      async on(a) { a.show('data'); a.focus(); a.cards([]); await a.count(); },
    },
    {
      title: 'Why criminals target data',
      text: `<p>Because of this, digital systems are <strong>targeted by criminals</strong> who try to access data so that they can use it to commit <strong>fraud</strong> or <strong>identity theft</strong>.</p>
             <p>You need to be aware of the risks to your data when operating online.</p>`,
      on: (a) => { a.show('data'); a.cards(['pers', 'fin', 'crim']); },
    },
    {
      title: 'Unauthorised access',
      text: `<p>Access to networks by users who are <strong>not permitted</strong> to access them is called <strong>unauthorised access</strong>.</p>
             <p>Unauthorised users can attempt to gain access to networks <strong>directly</strong>, by themselves.</p>`,
      on: (a) => { a.show('bot'); a.setSec('poor'); },
    },
    {
      title: 'Software that tries thousands of logins',
      text: `<p>Alternatively, they may create <strong>software</strong> that runs <strong>thousands of times per second</strong> on devices, <strong>inputting multiple login details</strong> in order to attempt to gain access to networks with <strong>poor security</strong>.</p>`,
      tip: 'Try it: run the login software against a network with poor security, then switch to a long, random password.',
      async on(a) { a.show('bot'); a.setSec('poor'); await a.attack(); },
    },
    {
      title: 'Poor security is the target',
      text: `<p>With a long, random password the software keeps getting <strong>rejected</strong>. The criminals look for networks with <strong>poor security</strong> instead.</p>
             <p class="muted">Did you know? In 2012, a survey showed that 31% of people store financial data on their PC.</p>`,
      async on(a) { a.show('bot'); a.setSec('good'); await a.attack(); },
    },
    {
      title: 'Botnets',
      text: `<p>Sometimes, devices on a network can be targeted by unauthorised users in order to be used as <strong>botnets</strong>.</p>
             <p>Botnets are <strong>groups of computers</strong> that have their resources used for <strong>harmful purposes</strong>.</p>`,
      async on(a) { a.show('net'); await a.take(); },
    },
    {
      title: 'Running and spreading malware',
      text: `<p>Harmful purposes include <strong>running and spreading malware</strong>: software that is created with the intention to do harm.</p>`,
      tip: 'Try it: take over the computers, then use the botnet.',
      async on(a) { a.show('net'); await a.use(); },
    },
  ],
});

FD.check({
  section: 'access',
  items: [
    { type: 'mcq', q: 'What is unauthorised access?', opts: ['Access to networks by users who are not permitted to access them', 'Logging in with your own username and password', 'A network that has no users', 'Backing up data to online storage'], why: 'The users are not permitted to access the network.' },
    { type: 'mcq', q: 'Why are digital systems targeted by criminals?', opts: ['They hold personal and financial data that can be used for fraud or identity theft', 'Criminals want to make the systems faster', 'They want to delete the internet', 'They need somewhere to store their photos'], why: 'A lot of data is personal or financial.' },
    { type: 'tf', q: 'Software can input multiple login details thousands of times per second to try to get into networks with poor security.', a: true, why: 'This is one way unauthorised users attempt to gain access.' },
    { type: 'mcq', q: 'What is a botnet?', opts: ['A group of computers that have their resources used for harmful purposes', 'A network of robots in a factory', 'A type of firewall', 'A secure website'], why: 'For example, running and spreading malware.' },
    { type: 'mcq', q: 'Malware is…', opts: ['software that is created with the intention to do harm', 'software that removes viruses', 'a backup of your files', 'a type of password'], why: 'Malware = malicious software.' },
  ],
});
