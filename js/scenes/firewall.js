FD.add({
  id: 'firewall',
  title: 'Firewalls and encryption',
  tab: 'Firewalls · encryption',
  icon: 'firewall',
  color: '--c1',
  section: true,
  interactive: true,
  mount(el) {
    // Firewall rules (set by the network administrator) and traffic (address, port, direction).
    const RULES = [
      { k: 'web', t: 'Web pages · port 443', allow: true },
      { k: 'mail', t: 'Email · port 587', allow: true },
      { k: 'remote', t: 'Remote log-in · port 3389', allow: false },
      { k: 'bad', t: 'Address 198.51.100.66 (known attacker)', allow: false },
    ];
    const TRAFFIC = [
      { a: '93.184.216.34', p: 443, r: 'web', in: true, l: '🌐 web page' },
      { a: '198.51.100.66', p: 443, r: 'bad', in: true, l: '🦠 malware download' },
      { a: '203.0.113.20', p: 587, r: 'mail', in: false, l: '✉️ email sent' },
      { a: '203.0.113.99', p: 3389, r: 'remote', in: true, l: '🕵️ log-in attempt' },
      { a: '93.184.216.34', p: 443, r: 'web', in: false, l: '🌐 web request' },
      { a: '198.51.100.66', p: 587, r: 'bad', in: true, l: '🎣 fake email' },
    ];
    el.innerHTML = `
      <div class="sim fw">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="fw">🧱 Firewall</button><button data-p="enc">🔑 Encryption</button>
        </div>

        <div data-panel="fw" class="sim">
          <div class="fw-grid">
            <div class="sim-box fw-scene">
              <svg viewBox="0 0 520 210" aria-label="Data travelling between the internet and a school network through a firewall">
                <g transform="translate(10 60)">${FD.dv.cloud(0, 0)}</g><text class="svg-sm" x="40" y="128">internet</text>
                <g class="fw-wall" data-zone="wall">${[0, 1, 2, 3, 4, 5].map((r) => `<rect x="${238 + (r % 2) * 10}" y="${20 + r * 28}" width="34" height="24" rx="2"/>`).join('')}<text class="svg-sm" x="260" y="200">firewall</text></g>
                <g transform="translate(420 30)">${FD.dv.desktop(0, 0)}</g><g transform="translate(420 110)">${FD.dv.laptop(0, 0)}</g><text class="svg-sm" x="450" y="200">school network</text>
                <g id="pk" class="fw-pk" opacity="0"><rect x="-58" y="-14" width="116" height="28" rx="7"/><text id="pkT" y="1" class="emo">…</text></g>
              </svg>
              <p class="fw-read mono" id="read" data-zone="read">address · port</p>
            </div>
            <div class="fw-rules" data-zone="rules">
              <p class="fw-h">📋 Rules <small>set by the network administrator</small></p>
              ${RULES.map((r) => `<div class="fw-rule" data-k="${r.k}"><span>${r.t}</span><button class="mini-btn" data-k="${r.k}"></button></div>`).join('')}
              <div class="readout"><div class="ro good"><small>Allowed</small><b id="nIn">0</b></div><div class="ro bad"><small>Blocked</small><b id="nOut">0</b></div></div>
            </div>
          </div>
          <div class="ctrls"><button class="btn primary small-btn" id="send">▶ Send traffic</button><span class="note">Click a rule to switch it between <b>Allow</b> and <b>Block</b>.</span></div>
        </div>

        <div data-panel="enc" class="sim" hidden>
          <div class="fw-enc">
            <label class="fw-msg">Message<input id="plain" value="Card 4921 7730 2215 0088" maxlength="40"></label>
            <label class="rng"><span>Key <output id="kO"></output></span><input type="range" id="key" min="1" max="25" value="7"></label>
          </div>
          <div class="sim-box">
            <svg viewBox="0 0 584 150" aria-label="An encrypted message is intercepted on the network">
              <g transform="translate(10 40)">${FD.dv.laptop(0, 0)}</g><text class="svg-sm" x="40" y="105">sender</text>
              <g transform="translate(490 40)">${FD.dv.laptop(0, 0)}</g><text class="svg-sm" x="520" y="105">receiver (has the key)</text>
              <line class="wire" x1="75" y1="62" x2="485" y2="62"/>
              <path class="fw-tap" d="M280 62 V112"/><text class="emo" x="280" y="128" font-size="22">🕵️</text>
              <g id="env" class="fw-env"><rect x="-26" y="-15" width="52" height="30" rx="5"/><text class="emo" font-size="16">🔒</text></g>
            </svg>
          </div>
          <div class="fw-out">
            <div class="mini"><h5>🔒 Sent across the network</h5><p class="mono" id="ct"></p></div>
            <div class="mini" style="--c:var(--bad)"><h5>🕵️ Interceptor’s guess</h5><p class="mono" id="guessT"></p>
              <label class="rng"><span>Guess the key <output id="gO"></output></span><input type="range" id="guess" min="1" max="25" value="1"></label></div>
            <div class="mini" style="--c:var(--good)"><h5>🔓 Receiver decrypts with the key</h5><p class="mono" id="pt"></p></div>
          </div>
          <div class="ctrls"><button class="btn primary small-btn" id="sendEnc">▶ Send the message</button></div>
        </div>
      </div>`;
    const root = el.querySelector('.fw'), $ = (s) => root.querySelector(s);
    let dead = false, runId = 0;

    // ---- firewall ----
    const rule = (k) => RULES.find((r) => r.k === k);
    function drawRules() {
      root.querySelectorAll('.fw-rule').forEach((row) => {
        const r = rule(row.dataset.k), b = row.querySelector('button');
        b.textContent = r.allow ? '✅ Allow' : '⛔ Block';
        row.classList.toggle('block', !r.allow);
      });
    }
    root.querySelectorAll('.fw-rule button').forEach((b) => b.addEventListener('click', () => { const r = rule(b.dataset.k); r.allow = !r.allow; drawRules(); }));
    const pk = $('#pk');
    const at = (x, y) => pk.setAttribute('transform', `translate(${x} ${y})`);
    async function send() {
      const id = ++runId;
      let nIn = 0, nOut = 0;
      $('#nIn').textContent = '0'; $('#nOut').textContent = '0';
      for (const t of TRAFFIC) {
        if (dead || id !== runId) return;
        const from = t.in ? 70 : 450, to = t.in ? 450 : 70, y = 100;
        $('#pkT').textContent = t.l;
        const pw = Math.max(116, $('#pkT').getComputedTextLength() + 22); pk.querySelector('rect').setAttribute('width', pw); pk.querySelector('rect').setAttribute('x', -pw / 2);
        pk.setAttribute('opacity', 1); pk.classList.remove('ok', 'no');
        await FD.tween(700, (k) => { if (id === runId) at(from + (255 - from) * k * .85, y); });
        if (dead || id !== runId) return;
        $('#read').textContent = `${t.in ? 'IN ' : 'OUT'} · address ${t.a} · port ${t.p}`;
        root.querySelectorAll('.fw-rule').forEach((row) => row.classList.toggle('hit', row.dataset.k === t.r));
        await FD.wait(650);
        const ok = rule(t.r).allow;
        pk.classList.add(ok ? 'ok' : 'no');
        const x0 = from + (255 - from) * .85;
        if (ok) { nIn++; await FD.tween(700, (k) => { if (id === runId) at(x0 + (to - x0) * k, y); }); }
        else { nOut++; await FD.tween(500, (k) => { if (id === runId) at(x0 - (x0 - from) * k * .4, y + k * 40); }); }
        $('#nIn').textContent = nIn; $('#nOut').textContent = nOut;
      }
      if (id === runId) { pk.setAttribute('opacity', 0); root.querySelectorAll('.fw-rule').forEach((row) => row.classList.remove('hit')); }
    }
    $('#send').addEventListener('click', send);
    function setRule(k, allow) { rule(k).allow = allow; drawRules(); }
    drawRules();

    // ---- encryption (a simple shift key, just to show the idea) ----
    const shift = (s, n) => s.replace(/[a-z]/gi, (c) => { const b = c <= 'Z' ? 65 : 97; return String.fromCharCode((c.charCodeAt(0) - b + n + 26) % 26 + b); })
      .replace(/[0-9]/g, (d) => String((+d + n + 10) % 10));
    function enc() {
      const k = +$('#key').value, g = +$('#guess').value, p = $('#plain').value, c = shift(p, k);
      $('#kO').textContent = k; $('#gO').textContent = g;
      $('#ct').textContent = c;
      $('#pt').textContent = shift(c, -k);
      $('#guessT').textContent = shift(c, -g);
      $('#guessT').closest('.mini').classList.toggle('hot', g === k);
    }
    ['#plain', '#key', '#guess'].forEach((s) => $(s).addEventListener('input', enc));
    async function sendEnc() {
      const id = ++runId, e = $('#env');
      await FD.tween(1800, (t) => { if (id === runId && !dead) e.setAttribute('transform', `translate(${100 + t * 360} 62)`); });
    }
    $('#sendEnc').addEventListener('click', sendEnc);
    function setGuess(g) { $('#guess').value = g; enc(); }
    $('#env').setAttribute('transform', 'translate(100 62)');
    enc();

    const show = FD.panels(root);
    show('fw');
    return { show, send, setRule, sendEnc, setGuess, key: () => +$('#key').value, focus: (z) => FD.focus($('.fw-grid'), z), destroy() { dead = true; runId++; } };
  },
  steps: [
    {
      title: 'Methods to secure data',
      text: `<p>Much of the data transmitted online is <strong>sensitive and valuable</strong>, and it is important to protect that data from <strong>unauthorised access</strong>.</p>
             <p>There are several different methods used to secure data and personal information. The first is a <strong>firewall</strong>.</p>`,
      on: (a) => { a.show('fw'); a.focus(); },
    },
    {
      title: 'Firewalls control traffic',
      text: `<p><strong>Firewalls</strong> control the data travelling <strong>into and out of</strong> a network.</p>`,
      async on(a) { a.show('fw'); a.focus('wall'); await a.send(); },
    },
    {
      title: 'Addresses, ports and rules',
      text: `<p>They examine the <strong>network addresses</strong> and <strong>ports</strong> of the data. They then compare those details to a <strong>list of rules</strong>.</p>`,
      on: (a) => { a.show('fw'); a.focus(['read', 'rules']); },
    },
    {
      title: 'Rules set by network administrators',
      text: `<p>The list of rules can be <strong>changed by network administrators</strong>. The rules determine what traffic should be <strong>allowed</strong> to travel into and out of the network.</p>`,
      tip: 'Try it: allow remote log-in, then send the traffic again.',
      async on(a) { a.show('fw'); a.focus('rules'); a.setRule('remote', true); await a.send(); a.setRule('remote', false); },
    },
    {
      title: 'Preventing unauthorised access and malware',
      text: `<p>In this way, firewalls can <strong>prevent unauthorised access</strong> to a network and <strong>protect the network from malware</strong>.</p>`,
      async on(a) { a.show('fw'); a.focus(); await a.send(); },
    },
    {
      title: 'Encryption',
      text: `<p><strong>Encryption</strong> uses a <strong>key</strong> to <strong>scramble data</strong> into an <strong>unreadable form</strong>.</p>
             <p class="muted">Here the key is a simple number that shifts every letter and digit. Real encryption keys are much longer.</p>`,
      tip: 'Try it: change the message and the key.',
      async on(a) { a.show('enc'); a.setGuess(1); await a.sendEnc(); },
    },
    {
      title: 'Useless without the key',
      text: `<p>If encrypted data is <strong>intercepted</strong> on the network, it is <strong>useless</strong> unless the interceptor <strong>has or can identify the key</strong>.</p>`,
      async on(a, ctx) {
        a.show('enc');
        for (let g = 1; g <= a.key(); g++) { a.setGuess(g); if (!(await ctx.sleep(380))) return; }
      },
    },
  ],
});

FD.check({
  section: 'firewall',
  items: [
    { type: 'mcq', q: 'Which <b>one</b> of these is used to control internet traffic entering a network?', opts: ['Firewall', 'Server', 'Backup', 'Encryption'], why: 'Chapter question 1: firewalls control data travelling into and out of a network.' },
    { type: 'mcq', q: 'What does a firewall compare the network addresses and ports of data with?', opts: ['A list of rules that can be changed by network administrators', 'A list of virus definitions', 'The user’s password', 'A backup of the network'], why: 'The rules determine what traffic is allowed.' },
    { type: 'multi', q: 'Which <b>two</b> things can a firewall do?', need: 2, opts: [['Prevent unauthorised access to a network', true], ['Protect the network from malware', true], ['Make a backup of every file', false], ['Translate domain names into IP addresses', false]], why: 'It filters traffic into and out of the network.' },
    { type: 'mcq', q: 'Describe how encryption secures data on a network.', opts: ['A key scrambles the data into an unreadable form, so intercepted data is useless without the key', 'It deletes the data if it is intercepted', 'It sends the data twice', 'It stops the data from leaving the computer'], why: 'Chapter question 6.' },
  ],
});
