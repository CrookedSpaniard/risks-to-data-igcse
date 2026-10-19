FD.add({
  id: 'secure',
  title: 'Secure websites, attachments and links',
  tab: 'HTTPS · links',
  icon: 'secure',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['Hypertext Transfer Protocol Secure (HTTPS)', 'a secure form of HTTP'],
    ['payment server', 'a computer that authorises financial transactions'],
    ['legitimate website', 'a website that is operated legally'],
    ['executable file', 'a computer file that can be run as a program'],
    ['hover over', 'use the mouse to position the cursor on an object on a computer screen without clicking on the object'],
  ],
  mount(el) {
    const SIGNS = [
      ['sender', 'They do not recognise the sender'],
      ['general', 'The text is general, impersonal or irrelevant to the user'],
      ['errors', 'The text contains spelling or grammatical errors'],
      ['exe', 'The attached file is an executable file such as an .exe or .zip file'],
      ['now', 'The text tells the user to do something immediately'],
      ['url', 'The user does not recognise the URL'],
    ];
    const SECRET = 'card=4921773022150088&pw=Sunny#2009';
    el.innerHTML = `
      <div class="sim sc">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="https">🔒 HTTP or HTTPS?</button><button data-p="mail">✉️ Attachments and links</button>
        </div>

        <div data-panel="https" class="sim">
          <div class="seg" id="proto"><span class="seg-l">Protocol</span><button data-v="http">HTTP</button><button data-v="https">HTTPS</button></div>
          <div class="win sc-shop">
            <div class="win-bar"><span class="url" id="bar" data-zone="bar"></span></div>
            <div class="win-body sc-pay"><b>🛒 Checkout · ShopMart</b><span class="note">Card number and password are sent to the payment server.</span></div>
          </div>
          <div class="sim-box">
            <svg viewBox="0 0 560 150" aria-label="Data travelling from the client to the payment server">
              <g transform="translate(10 30)">${FD.dv.laptop(0, 0)}</g><text class="svg-sm" x="40" y="95">client</text>
              <g transform="translate(490 25)">${FD.dv.server(0, 0)}</g><text class="svg-sm" x="520" y="95">payment server</text>
              <line class="wire" x1="75" y1="50" x2="485" y2="50"/>
              <path class="fw-tap" d="M280 50 V100"/><text class="emo" x="280" y="118" font-size="22">🕵️</text>
              <g id="cert" class="sc-cert"><rect x="420" y="105" width="130" height="28" rx="6"/><text x="485" y="123" class="sc-ct">✓ server authenticated</text></g>
              <g id="pk"><rect x="-30" y="-13" width="60" height="26" rx="6" class="sc-pk"/><text class="emo" id="pkI" font-size="14">📄</text></g>
            </svg>
          </div>
          <div class="two-col">
            <div class="mini" style="--c:var(--bad)"><h5>🕵️ What an eavesdropper on the network reads</h5><p class="mono sc-sees" id="sees">–</p></div>
            <div class="mini"><h5>How it works</h5><p id="how"></p></div>
          </div>
          <div class="ctrls"><button class="btn primary small-btn" id="pay">▶ Pay now</button></div>
        </div>

        <div data-panel="mail" class="sim" hidden>
          <div class="sc-mailg">
            <div class="win sc-mail" id="mailW">
              <div class="win-bar">Inbox</div>
              <div class="win-body">
                <p data-zone="sender"><b>From:</b> Account Team &lt;<span class="mono">acc-team77@mailbox-free.example</span>&gt;</p>
                <p><b>Subject:</b> Invoice overdue</p>
                <p data-zone="exe"><b>Attachment:</b> 📦 <span class="mono">invoice_0391.zip</span></p>
                <p data-zone="general">Dear Sir or Madam,</p>
                <p data-zone="errors">We has not recieve you payment for the last invoice.</p>
                <p data-zone="now"><b>Open the attachment immediately</b> or legal action will start today.</p>
                <p data-zone="url">To pay online, go to <a class="sc-link" id="link" tabindex="0">www.shopmart.example/pay</a><span class="sc-tip" id="tip">http://shopmart-pay-login.example/verify</span></p>
              </div>
            </div>
            <ol class="sc-signs" id="signs">${SIGNS.map(([k, t]) => `<li><button data-k="${k}">${t}</button></li>`).join('')}</ol>
          </div>
          <p class="note">Hint: <b>hover over</b> a link to see its URL. The text of a link can say one thing and go somewhere else.</p>
        </div>
      </div>`;
    const root = el.querySelector('.sc'), $ = (s) => root.querySelector(s);
    let dead = false, runId = 0, proto = 'https';

    // ---- HTTP / HTTPS ----
    const scramble = (s) => [...s].map(() => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'[Math.floor(Math.random() * 64)]).join('');
    function setProto(v) {
      proto = v; runId++;
      FD.segSet($('#proto'), v);
      const s = v === 'https';
      $('#bar').className = 'url ' + (s ? 'safe' : 'risky');
      $('#bar').innerHTML = `${s ? FD.icon.lock : '⚠️'} <span>${s ? 'https://' : 'http://'}shopmart.example/checkout</span>${s ? '' : ' <small class="sc-ns">Not secure</small>'}`;
      $('#how').innerHTML = s
        ? '<b>HTTPS</b> authenticates the payment server and encrypts the data using <b>SSL</b> or, more recently, <b>TLS</b>. The browser shows a <b>padlock</b>.'
        : '<b>HTTP</b> is used to exchange data between a web server and a client, but data transferred using HTTP is <b>not secure</b>.';
      $('#sees').textContent = '–';
      $('#cert').classList.remove('on');
      $('#pk').setAttribute('transform', 'translate(110 50)');
    }
    $('#proto').addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) setProto(b.dataset.v); });
    async function pay() {
      const id = ++runId, s = proto === 'https';
      $('#sees').textContent = '–'; $('#cert').classList.remove('on');
      $('#pkI').textContent = s ? '🔒' : '📄';
      if (s) { $('#cert').classList.add('on'); await FD.wait(700); if (id !== runId || dead) return; }
      await FD.tween(1800, (t) => {
        if (id !== runId || dead) return;
        $('#pk').setAttribute('transform', `translate(${110 + t * 340} 50)`);
        if (t > .45 && $('#sees').textContent === '–') $('#sees').textContent = s ? scramble(SECRET) : SECRET;
      });
    }
    $('#pay').addEventListener('click', pay);

    // ---- attachments and links ----
    const mailW = $('#mailW');
    function sign(k) {
      FD.focus(mailW, k ? [k] : null);
      root.querySelectorAll('#signs button').forEach((b) => b.classList.toggle('on', b.dataset.k === k));
      $('#tip').classList.toggle('on', k === 'url');
    }
    root.querySelectorAll('#signs button').forEach((b) => b.addEventListener('click', () => sign(b.classList.contains('on') ? null : b.dataset.k)));
    const link = $('#link');
    ['mouseenter', 'focus'].forEach((ev) => link.addEventListener(ev, () => $('#tip').classList.add('on')));
    ['mouseleave', 'blur'].forEach((ev) => link.addEventListener(ev, () => { if (!root.querySelector('#signs button.on[data-k="url"]')) $('#tip').classList.remove('on'); }));
    link.addEventListener('click', () => FD.toast(mailW, '⛔ Do not click! Hovering shows that the link goes to a different website.'));
    async function signs(list, ctx) { for (const k of list) { sign(k); if (!(await ctx.sleep(1500))) return; } }

    const show = FD.panels(root);
    show('https');
    setProto('http');
    return { show, setProto, pay, sign, signs, focusBar: (on) => FD.focus($('.sc-shop'), on ? 'bar' : null), destroy() { dead = true; runId++; } };
  },
  steps: [
    {
      title: 'HTTP is not secure',
      text: `<p><strong>Hypertext Transfer Protocol (HTTP)</strong> is used to exchange data between a <strong>web server</strong> and a <strong>client</strong> (that is, a computer that is accessing the web server).</p>
             <p>However, data transferred using HTTP is <strong>not secure</strong>.</p>`,
      async on(a) { a.show('https'); a.setProto('http'); a.focusBar(false); await a.pay(); },
    },
    {
      title: 'HTTPS',
      text: `<p>So <strong>Hypertext Transfer Protocol Secure (HTTPS)</strong> was developed. HTTPS <strong>authenticates payment servers</strong> and provides <strong>encryption</strong> using <strong>Secure Socket Layer (SSL)</strong> and, more recently, <strong>Transport Layer Security (TLS)</strong>.</p>`,
      tip: 'Try it: switch between HTTP and HTTPS and pay again.',
      async on(a) { a.show('https'); a.setProto('https'); a.focusBar(false); await a.pay(); },
    },
    {
      title: 'The padlock',
      text: `<p>HTTPS keeps communications <strong>private</strong> and provides security for users’ online accounts.</p>
             <p>Web browsers often show that a website is secure by displaying a <strong>padlock</strong> in the address bar (Figure 6.13).</p>
             <p class="muted">Did you know? In 2016, experts reported that 75% of all legitimate websites had serious security problems.</p>`,
      on: (a) => { a.show('https'); a.setProto('https'); a.focusBar(true); },
    },
    {
      title: 'Email attachments and web links',
      text: `<p>Users should always be careful when opening <strong>email attachments</strong> or <strong>hyperlinks</strong> in emails and other messages, because some are fake and designed to steal users’ personal information.</p>
             <p>Users should ensure that their <strong>anti-malware software is up to date</strong> and be especially careful if…</p>`,
      on: (a) => { a.show('mail'); a.sign(null); },
    },
    {
      title: 'Warning signs: the sender and the text',
      text: `<ul><li>they <strong>do not recognise the sender</strong></li><li>the text is <strong>general, impersonal or irrelevant</strong> to the user</li><li>the text contains <strong>spelling or grammatical errors</strong></li></ul>`,
      tip: 'Try it: click each warning sign to find it in the email.',
      async on(a, ctx) { a.show('mail'); await a.signs(['sender', 'general', 'errors'], ctx); },
    },
    {
      title: 'Warning signs: files, pressure and URLs',
      text: `<ul><li>the attached file is an <strong>executable file</strong> such as an <strong>.exe</strong> or <strong>.zip</strong> file</li><li>the text tells the user to <strong>do something immediately</strong></li><li>the user <strong>does not recognise the URL</strong>: <strong>hover over</strong> a link to see it.</li></ul>`,
      async on(a, ctx) { a.show('mail'); await a.signs(['exe', 'now', 'url'], ctx); },
    },
  ],
});

FD.check({
  section: 'secure',
  items: [
    { type: 'mcq', q: 'What does HTTPS do that HTTP does not?', opts: ['Authenticates payment servers and encrypts the data', 'Makes web pages load without a server', 'Blocks all adverts', 'Backs up the website'], why: 'It uses SSL or, more recently, TLS.' },
    { type: 'mcq', q: 'How do web browsers often show that a website is secure?', opts: ['A padlock in the address bar', 'A red warning triangle', 'A CAPTCHA test', 'A countdown clock'], why: 'See Figure 6.13.' },
    { type: 'multi', q: 'Which <b>three</b> are warning signs in an email?', need: 3, opts: [['An attached .exe or .zip file', true], ['Spelling or grammatical errors', true], ['A message telling you to do something immediately', true], ['A sender you know, writing about something you expected', false], ['Your own name spelled correctly', false]], why: 'Also: an unknown sender, impersonal text and a URL you do not recognise.' },
    { type: 'mcq', q: 'How can you see where a link really goes without clicking it?', opts: ['Hover over the link to see its URL', 'Double-click it', 'Forward the email', 'Reply to the sender'], why: 'Hovering positions the cursor on the link without clicking.' },
  ],
});
