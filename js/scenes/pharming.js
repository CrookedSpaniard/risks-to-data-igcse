FD.add({
  id: 'pharming',
  title: 'Theft of personal data: pharming',
  tab: 'Pharming',
  icon: 'pharming',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['internet traffic', 'data transferred between computers connected to the internet'],
    ['domain name server', 'a computer connected to the internet that translates domain names, such as pearson.com, into IP addresses'],
  ],
  mount(el) {
    const REAL = '203.0.113.10', FAKE = '198.51.100.66';
    const P = { br: [70, 130], dns: [260, 45], real: [470, 55], fake: [470, 205] };
    const site = (fake) => `
      <div class="win pm-site">
        <div class="win-bar"><span class="url ${fake ? 'risky' : 'safe'}">${FD.icon.globe}<span class="pm-u"></span></span></div>
        <div class="win-body pm-bank">
          <div class="pm-logo">🏦 <b>MONEYBANK</b></div>
          <label>Customer number<input placeholder="made-up only"></label>
          <label>Password<input type="password" placeholder="never a real one"></label>
          <button class="btn primary small-btn pm-log">Log on 🔒</button>
          <p class="pm-ip mono"></p>
        </div>
      </div>`;
    el.innerHTML = `
      <div class="sim pm">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="dns">🔀 Redirected traffic</button><button data-p="url">⌨️ Look-alike URLs</button>
        </div>

        <div data-panel="dns" class="sim">
          <div class="sim-box">
            <svg viewBox="0 0 560 250" aria-label="A browser asks a domain name server for the address of a bank website">
              <path class="pm-path" d="M${P.br} L${P.dns}"/>
              <path class="pm-path" id="toReal" d="M${P.br} L${P.real}"/>
              <path class="pm-path" id="toFake" d="M${P.br} L${P.fake}"/>
              <g transform="translate(${P.br[0] - 30} ${P.br[1] - 23})">${FD.dv.laptop(0, 0)}</g><text class="svg-sm" x="${P.br[0]}" y="${P.br[1] + 38}">your browser</text>
              <g id="mal" class="pm-mal"><text class="emo" x="${P.br[0] + 30}" y="${P.br[1] - 26}" font-size="18">🦠</text></g>
              <g transform="translate(${P.dns[0] - 30} ${P.dns[1] - 25})">${FD.dv.server(0, 0)}</g>
              <text class="svg-sm" x="${P.dns[0]}" y="${P.dns[1] + 36}">domain name server</text>
              <g transform="translate(${P.dns[0] + 40} ${P.dns[1] - 15})"><rect class="pm-tbl" width="120" height="34" rx="5"/><text class="pm-tt" x="8" y="14">moneybank.lk →</text><text class="pm-tt mono" id="dnsIp" x="8" y="28">${REAL}</text></g>
              <g transform="translate(${P.real[0] - 30} ${P.real[1] - 23})">${FD.dv.server(0, 0)}</g><text class="svg-sm" x="${P.real[0]}" y="${P.real[1] + 36}">real bank · ${REAL}</text>
              <g transform="translate(${P.fake[0] - 30} ${P.fake[1] - 23})">${FD.dv.server(0, 0)}</g><text class="svg-sm pm-bad" x="${P.fake[0]}" y="${P.fake[1] + 36}">fake site · ${FAKE}</text>
              <text class="emo" x="${P.fake[0] + 40}" y="${P.fake[1] - 20}" font-size="20">🕵️</text>
              <circle class="pkt" id="pkt" r="8" cx="${P.br[0]}" cy="${P.br[1]}"/>
            </svg>
          </div>
          <div class="ctrls">
            <label class="tgl"><input type="checkbox" id="alt"> 🕵️ Criminals alter the domain name server</label>
            <label class="tgl"><input type="checkbox" id="mw"> 🦠 Malware redirects web requests</label>
            <button class="btn primary small-btn" id="visit">▶ Visit moneybank.lk</button>
          </div>
          <div class="two-col"><div id="landing"></div><p class="verdict" id="dnsV"></p></div>
        </div>

        <div data-panel="url" class="sim" hidden>
          <div class="pm-type">
            <label class="pm-bar">Address bar<input id="addr" class="mono" value="moneybank.lk" autocomplete="off" spellcheck="false"></label>
            <button class="btn primary small-btn" id="goUrl">Go</button>
            <button class="btn small-btn" data-u="moneybank.lk">moneybank.lk</button>
            <button class="btn small-btn" data-u="moneybamk.lk">moneyba<b>m</b>k.lk</button>
          </div>
          <div class="two-col"><div id="landing2"></div><div><p class="verdict" id="urlV"></p><p class="note pm-cmp" id="cmp"></p></div></div>
        </div>
      </div>`;
    const root = el.querySelector('.pm'), $ = (s) => root.querySelector(s);
    let dead = false, runId = 0;

    function land(box, fake, url) {
      box.innerHTML = site(fake);
      box.querySelector('.pm-u').textContent = 'http://' + url;
      box.querySelector('.pm-ip').textContent = 'server: ' + (fake ? FAKE : REAL);
      box.querySelector('.pm-log').addEventListener('click', () => FD.toast(box.querySelector('.win'), fake ? '🕵️ Login details sent to the criminals!' : '✅ Logged on to the real bank'));
    }
    const setAttack = (alt, mw) => { $('#alt').checked = alt; $('#mw').checked = mw; $('#dnsIp').textContent = alt ? FAKE : REAL; $('#dnsIp').classList.toggle('pm-bad', alt); $('#mal').classList.toggle('on', mw); $('#landing').innerHTML = ''; $('#dnsV').textContent = ''; $('#dnsV').className = 'verdict'; };
    $('#alt').addEventListener('change', () => setAttack($('#alt').checked, $('#mw').checked));
    $('#mw').addEventListener('change', () => setAttack($('#alt').checked, $('#mw').checked));

    async function move(pts, ms) {
      const id = runId, c = $('#pkt');
      await FD.tween(ms, (t) => { if (id === runId && !dead) { const [x, y] = FD.along(pts, t); c.setAttribute('cx', x); c.setAttribute('cy', y); } });
      return id === runId && !dead;
    }
    async function visit() {
      const id = ++runId;
      const alt = $('#alt').checked, mw = $('#mw').checked, fake = alt || mw;
      $('#landing').innerHTML = ''; $('#dnsV').textContent = ''; $('#dnsV').className = 'verdict';
      root.querySelectorAll('.pm-path').forEach((p) => p.classList.remove('on'));
      if (!mw) {
        if (!(await move([P.br, P.dns], 900))) return;
        if (!(await move([P.dns, P.br], 700))) return;
      }
      if (id !== runId) return;
      $(fake ? '#toFake' : '#toReal').classList.add('on');
      if (!(await move([P.br, fake ? P.fake : P.real], 1000))) return;
      land($('#landing'), fake, 'moneybank.lk');
      const v = $('#dnsV');
      v.className = 'verdict ' + (fake ? 'bad' : 'good');
      v.innerHTML = fake
        ? `❌ The address bar still says <b>moneybank.lk</b>, but this is the <b>fake site</b>. ${mw ? 'Malware on the computer redirected the web request.' : 'The domain name server was altered to send the traffic to the criminals.'}`
        : '✅ The domain name server gave the real address, so you reached the real bank.';
    }
    $('#visit').addEventListener('click', visit);

    // ---- look-alike URLs ----
    function go(u) {
      if (u != null) $('#addr').value = u;
      const url = $('#addr').value.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
      const real = url === 'moneybank.lk';
      land($('#landing2'), !real, url || '?');
      const v = $('#urlV');
      v.className = 'verdict ' + (real ? 'good' : 'bad');
      v.innerHTML = real ? '✅ The real URL: the real bank.' : `❌ <b>${FD.esc(url)}</b> is not the real URL. The criminals registered a look-alike, so a small typing mistake takes you to their fake site.`;
      $('#cmp').innerHTML = real ? '' : `Real: <b class="mono">${'moneybank.lk'}</b><br>Typed: <b class="mono">${[...url].map((c, i) => c !== 'moneybank.lk'[i] ? `<mark>${FD.esc(c)}</mark>` : FD.esc(c)).join('')}</b>`;
    }
    $('#goUrl').addEventListener('click', () => go());
    $('#addr').addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
    root.querySelectorAll('[data-u]').forEach((b) => b.addEventListener('click', () => go(b.dataset.u)));
    async function typo(ctx) {
      $('#addr').value = ''; $('#landing2').innerHTML = ''; $('#urlV').textContent = ''; $('#urlV').className = 'verdict'; $('#cmp').innerHTML = '';
      for (const ch of 'moneybamk.lk') { $('#addr').value += ch; if (!(await ctx.sleep(110))) return; }
      if (!(await ctx.sleep(400))) return;
      go();
    }

    const show = FD.panels(root);
    show('dns');
    return { show, setAttack, visit, go, typo, destroy() { dead = true; runId++; } };
  },
  steps: [
    {
      title: 'Pharming',
      text: `<p>Like phishing, <strong>pharming</strong> is a technique used by criminals to gain <strong>personal information</strong> and <strong>payment details</strong> from users.</p>
             <p>Criminals create <strong>fake versions of trusted websites</strong> to trick users into entering their <strong>login details</strong>, which are then used by the criminals to <strong>access users’ accounts</strong>.</p>`,
      async on(a) { a.show('dns'); a.setAttack(false, false); await a.visit(); },
    },
    {
      title: 'Method 1 · Redirected internet traffic',
      text: `<p><strong>Internet traffic</strong> going to the real website is <strong>redirected to the fake website</strong>, so that users think they are visiting the real thing.</p>
             <p>Criminals do this by <strong>altering the domain name servers</strong> to make internet traffic go to their fake site.</p>`,
      tip: 'Try it: tick or untick the attacks and visit the bank again.',
      async on(a) { a.show('dns'); a.setAttack(true, false); await a.visit(); },
    },
    {
      title: 'Malware can redirect too',
      text: `<p>They can also use <strong>malware</strong> to <strong>redirect web requests</strong>.</p>`,
      async on(a) { a.show('dns'); a.setAttack(false, true); await a.visit(); },
    },
    {
      title: 'Method 2 · A URL very similar to the real one',
      text: `<p>Often, the <strong>URL</strong> of a pharming website is designed to be <strong>very similar</strong> to the URL of the real website.</p>
             <p>If a user <strong>misspells the URL</strong> when typing it into the address bar, they could go to the pharming site by mistake.</p>
             <p>Real bank: <b class="mono">http://moneybank.lk</b> · Fake: <b class="mono">http://moneybamk.lk</b></p>`,
      tip: 'Try it: type different URLs into the address bar.',
      async on(a, ctx) { a.show('url'); await a.typo(ctx); },
    },
    {
      title: 'Always check the URL',
      text: `<p>Users should <strong>always check the URL</strong> of websites that they visit to make sure that they are not fake websites (Figure 6.5).</p>`,
      on: (a) => { a.show('url'); a.go('moneybank.lk'); },
    },
  ],
});

FD.check({
  section: 'pharming',
  items: [
    { type: 'mcq', q: 'What is pharming?', opts: ['Creating fake versions of trusted websites to trick users into entering their login details', 'Sending SMS messages that ask for a reply', 'Locking files until money is paid', 'Groups of computers used for harmful purposes'], why: 'The details are then used to access users’ accounts.' },
    { type: 'multi', q: 'State <b>two</b> methods used by criminals to get users to visit fake sites.', need: 2, opts: [['Altering domain name servers (or using malware) to redirect internet traffic', true], ['Registering a URL very similar to the real one, so a misspelt URL goes to the fake site', true], ['Installing a firewall', false], ['Sending a CAPTCHA test', false]], why: 'These are the two main methods in the book (chapter question 8).' },
    { type: 'mcq', q: 'What does a domain name server do?', opts: ['Translates domain names into IP addresses', 'Stores backups of websites', 'Scans files for viruses', 'Encrypts passwords'], why: 'Criminals can alter it to send traffic to their fake site.' },
    { type: 'mcq', q: 'The real bank is <b class="mono">moneybank.lk</b>. Which URL is most likely a pharming site?', opts: ['moneybamk.lk', 'moneybank.lk', 'www.moneybank.lk', 'moneybank.lk/help'], why: 'One letter has been changed: easy to type by mistake.' },
  ],
});
