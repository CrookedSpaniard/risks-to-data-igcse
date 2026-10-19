FD.add({
  id: 'phishing',
  title: 'Theft of personal data: phishing',
  tab: 'Phishing',
  icon: 'phishing',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['phishing', 'the criminal activity of sending emails or having a website that is intended to trick someone into giving away personal information such as their bank account number or their computer password; this information is then used to get money or goods'],
    ['webform', 'a data entry form on a web page'],
  ],
  mount(el) {
    // Made-up emails. phish: true = phishing.
    const MAIL = [
      { k: 'bank', from: 'MoneyBank Security', addr: 'alerts@moneybank-secure-login.co', subj: 'Your account will be closed', phish: true,
        body: '<p>Dear customer,</p><p>We have noticed unusual activity on your account. To keep your account open, <b>confirm your details within 24 hours</b>.</p><p><a data-zone="link">➜ Confirm my account details</a></p><p>MoneyBank Customer Team</p>',
        why: 'It pretends to be a real bank and asks you to follow a hyperlink to a webpage where you type your personal details.' },
      { k: 'school', from: 'Ms Ortega', addr: 'm.ortega@ourschool.example', subj: 'ICT homework deadline moved', phish: false,
        body: '<p>Hi 10B,</p><p>The deadline for the fact sheet on risks to data is now <b>Friday</b>. Hand it in on the school learning platform as usual.</p><p>Ms Ortega</p>',
        why: 'It is from a sender you know, it is about something you expect and it does not ask for any personal information.' },
      { k: 'shop', from: 'ShopMart Rewards', addr: 'winner@shopmart-prizes.win', subj: 'You have won a £500 voucher!!', phish: true,
        body: '<p>Congratulations!</p><p>You have been chosen to receive a <b>£500 ShopMart voucher</b>. Reply to this email with your <b>full name, address and card number</b> to pay the £1.99 delivery fee.</p>',
        why: 'It appears to be from a shop and asks you to reply with personal and payment details.' },
      { k: 'charity', from: 'Help the Flood Victims', addr: 'donate@help-flood-now.info', subj: 'Please help today', phish: true,
        body: '<p>Thousands of families have lost their homes. <b>Reply with your bank account number and sort code</b> and we will take a donation of £10.</p>',
        why: 'Criminals pretend to be charities too. A real charity would never ask for your bank details by email.' },
      { k: 'invest', from: 'Head of Corporate Investment', addr: 'k.h.investments1954@freemail.example', subj: 'Business proposal', phish: true,
        body: '<p>Greetings,</p><p>I am the head of investment at a large company. I have a client who wishes to move a large fortune and needs a partner with financial understanding. Please send a description of your experience together with your <b>address and business name</b> so we can discuss a lot more.</p><p>Sincerely, Mr K. Harrow</p>',
        why: 'Some phishing emails are less believable than others. The free email address gives away that this is not a real company.' },
      { k: 'lib', from: 'Town Library', addr: 'no-reply@townlibrary.example', subj: 'Your reserved book is ready', phish: false,
        body: '<p>The book you reserved, <i>Cyber Security for Beginners</i>, is ready to collect from the front desk.</p>',
        why: 'It gives information you expected and does not ask for any details.' },
    ];
    el.innerHTML = `
      <div class="sim ph">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="mail">📨 Phishing emails</button><button data-p="spear">🎯 Spear phishing</button><button data-p="sms">📱 Phishing by SMS</button>
        </div>

        <div data-panel="mail" class="sim">
          <div class="ph-mail">
            <ul class="ph-inbox" id="inbox">${MAIL.map((m, i) => `<li><button data-i="${i}"><b>${m.from}</b><span>${m.subj}</span></button></li>`).join('')}</ul>
            <div class="win ph-read" id="read">
              <div class="win-bar">Inbox</div>
              <div class="win-body" id="msg"><p class="note">Open an email. Is it <b>phishing</b> or <b>genuine</b>?</p></div>
            </div>
          </div>
          <p class="note"><span class="pill" id="score">0 / ${MAIL.length} sorted</span> All these emails, people and companies are made up.</p>
        </div>

        <div data-panel="spear" class="sim" hidden>
          <div class="seg" id="mode"><span class="seg-l">Kind of attack</span><button data-v="mass">🕸️ Phishing: thousands of people</button><button data-v="spear">🎯 Spear phishing: a few people</button></div>
          <div class="two-col">
            <div class="sim-box">
              <svg viewBox="0 0 300 170" aria-label="Many targets or a few chosen targets">
                ${Array.from({ length: 40 }, (_, i) => `<text class="emo ph-tg" data-i="${i}" x="${20 + (i % 10) * 29}" y="${25 + Math.floor(i / 10) * 38}" font-size="20">🧑</text>`).join('')}
              </svg>
            </div>
            <div class="win">
              <div class="win-bar" id="spFrom"></div>
              <div class="win-body" id="spBody"></div>
            </div>
          </div>
          <p class="note">Did you know? The threat from spear phishing grew by 55% between 2014 and 2015.</p>
        </div>

        <div data-panel="sms" class="sim" hidden>
          <div class="ph-sms">
            <div class="ph-phone" data-zone="phone">
              <div class="ph-scr" id="scr">
                <div class="ph-chat" id="chat">
                  <p class="ph-who">Orbit Bank</p>
                  <p class="ph-bub">Orbit Bank: we have blocked a payment on your account. Log on now to unblock it: <a id="smsLink" data-zone="url">orbitbank-mobile.center</a></p>
                </div>
                <div class="ph-web" id="web" hidden>
                  <p class="ph-url" data-zone="url">🔒 orbitbank-mobile.center</p>
                  <div class="ph-form" data-zone="form">
                    <p class="ph-brand">ORBIT BANK</p>
                    <b>Log on to Internet Banking</b>
                    <label>Customer number<input id="cn" placeholder="made-up number only"></label>
                    <label>Password<input id="cp" type="password" placeholder="never a real one"></label>
                    <button class="btn primary small-btn" id="logon">Log on 🔒</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="sim-box ph-crook" data-zone="crook">
              <p class="ph-who">🕵️ The criminals’ server</p>
              <pre class="cli" id="stolen">waiting…</pre>
              <p class="verdict" id="smsV"></p>
            </div>
          </div>
          <div class="ctrls"><button class="btn small-btn" id="smsReset">↺ Start again</button></div>
        </div>
      </div>`;
    const root = el.querySelector('.ph'), $ = (s) => root.querySelector(s);
    let dead = false;

    // ---- inbox ----
    const done = {};
    function open(i) {
      const m = MAIL[i];
      root.querySelectorAll('#inbox button').forEach((b) => b.classList.toggle('on', +b.dataset.i === i));
      $('#msg').innerHTML = `
        <div class="ph-hd" data-zone="from"><b>${m.from}</b> <span class="mono">&lt;${m.addr}&gt;</span></div>
        <div class="ph-subj">${m.subj}</div>
        <div class="ph-body">${m.body}</div>
        <div class="ph-btns"><button class="btn small-btn" data-v="1">🎣 Phishing</button><button class="btn small-btn" data-v="0">✅ Genuine</button></div>
        <p class="verdict" id="mv"></p>`;
      $('#msg').querySelectorAll('.ph-btns button').forEach((b) => b.addEventListener('click', () => judge(i, b.dataset.v === '1')));
      if (done[i] != null) judge(i, done[i], true);
    }
    function judge(i, said, again) {
      const m = MAIL[i], ok = said === m.phish, v = $('#mv');
      done[i] = said;
      v.className = 'verdict ' + (ok ? 'good' : 'bad');
      v.innerHTML = `${ok ? '✓ Right:' : '✗ Not quite:'} it is <b>${m.phish ? 'phishing' : 'genuine'}</b>. ${m.why}`;
      root.querySelector(`#inbox button[data-i="${i}"]`).dataset.r = m.phish ? 'p' : 'g';
      $('#score').textContent = `${Object.keys(done).length} / ${MAIL.length} sorted`;
      if (!again) FD.pulse(v);
    }
    $('#inbox').addEventListener('click', (e) => { const b = e.target.closest('button[data-i]'); if (b) open(+b.dataset.i); });
    const focusMail = (z) => FD.focus($('#msg'), z);

    // ---- spear ----
    const modeSeg = $('#mode');
    function setMode(v) {
      FD.segSet(modeSeg, v);
      const spear = v === 'spear';
      root.querySelectorAll('.ph-tg').forEach((t, i) => t.classList.toggle('on', spear ? [13, 26].includes(i) : true));
      $('#spFrom').textContent = spear ? 'From: Mr Daniels, Trip Organiser' : 'From: Parcel Service';
      $('#spBody').innerHTML = spear
        ? '<p>Hi <b>Aisha</b>,</p><p>Your <b>Year 10 trip to the science museum</b> on <b>14 March</b> is nearly full. To keep your place, pay the £25 deposit today using <a>this payment link</a>.</p><p class="note">Personalised: it uses her name and real details about her life.</p>'
        : '<p>Dear customer,</p><p>We could not deliver your parcel. Pay £1.45 to rebook delivery: <a>track-my-parcel.info</a></p><p class="note">Sent to thousands of people: some of them will be waiting for a parcel.</p>';
    }
    modeSeg.addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) setMode(b.dataset.v); });

    // ---- SMS ----
    function resetSms() {
      $('#chat').hidden = false; $('#web').hidden = true;
      $('#cn').value = ''; $('#cp').value = '';
      $('#stolen').textContent = 'waiting…'; $('#smsV').textContent = ''; $('#smsV').className = 'verdict';
      FD.focus(root.querySelector('.ph-sms'), null);
    }
    const openWeb = () => { $('#chat').hidden = true; $('#web').hidden = false; };
    function logon() {
      const n = $('#cn').value || '10442817', p = $('#cp').value ? '•'.repeat($('#cp').value.length) + ' (as typed)' : 'sunshine22';
      $('#stolen').textContent = `NEW VICTIM\ncustomer no: ${n}\npassword:    ${p}\n→ log on to the REAL bank with these`;
      const v = $('#smsV'); v.className = 'verdict bad'; v.innerHTML = '❌ The details were typed into a <b>fake webpage</b> and revealed to the criminals.';
      FD.pulse($('.ph-crook'));
    }
    $('#smsLink').addEventListener('click', openWeb);
    $('#logon').addEventListener('click', logon);
    $('#smsReset').addEventListener('click', resetSms);
    async function smsDemo(ctx) {
      resetSms();
      FD.focus(root.querySelector('.ph-sms'), 'url');
      if (!(await ctx.sleep(1600))) return;
      openWeb();
      FD.focus(root.querySelector('.ph-sms'), 'form');
      for (const [id, s] of [['#cn', '10442817'], ['#cp', 'sunshine22']]) {
        for (const ch of s) { $(id).value += ch; if (!(await ctx.sleep(70))) return; }
      }
      if (!(await ctx.sleep(500))) return;
      $('#cp').value = ''; logon();
      FD.focus(root.querySelector('.ph-sms'), ['form', 'crook']);
    }

    const show = FD.panels(root);
    show('mail');
    setMode('mass');
    return { show, open, focusMail, setMode, smsDemo, resetSms, destroy() { dead = true; } };
  },
  steps: [
    {
      title: 'Theft of personal data',
      text: `<p>Criminals use a number of methods to <strong>steal personal data</strong>. The first is <strong>phishing</strong>.</p>`,
      on: (a) => { a.show('mail'); },
    },
    {
      title: 'Phishing',
      text: `<p><strong>Phishing</strong> is a technique used by criminals to get <strong>personal information</strong> and <strong>payment details</strong> from users.</p>
             <p>It involves sending <strong>large numbers of messages</strong> that appear to be from <strong>real organisations</strong>, such as <strong>shops, banks or charities</strong>.</p>`,
      tip: 'Try it: open each email and decide whether it is phishing or genuine.',
      on: (a) => { a.show('mail'); },
    },
    {
      title: 'Reply, or follow a hyperlink',
      text: `<p>Phishing messages are often sent as <strong>emails</strong>. These emails ask the user to provide their information by <strong>replying to the message</strong> or <strong>following a hyperlink</strong> that opens a webpage into which the user is asked to type their personal details.</p>`,
      on: (a) => { a.show('mail'); a.open(0); a.focusMail('link'); },
    },
    {
      title: 'Some are less believable',
      text: `<p>Some phishing emails are <strong>less believable</strong> than others; the <strong>email address</strong> can be a giveaway as to the authenticity of the sender (Figure 6.3).</p>`,
      on: (a) => { a.show('mail'); a.open(4); a.focusMail('from'); },
    },
    {
      title: 'Spear phishing',
      text: `<p>Sometimes, phishing messages are <strong>highly customised</strong> or <strong>personalised</strong> and are targeted at a <strong>smaller number of particular users</strong>. This technique has become known as <strong>spear phishing</strong>.</p>`,
      async on(a, ctx) { a.show('spear'); a.setMode('mass'); if (!(await ctx.sleep(2200))) return; a.setMode('spear'); },
    },
    {
      title: 'Phishing by SMS: smishing',
      text: `<p>Phishing messages can also be sent via <strong>SMS</strong> or <strong>instant message apps</strong> so that users open the <strong>fake webpage</strong> in a <strong>mobile browser</strong>.</p>
             <p class="muted">SMS phishing is sometimes referred to as <strong>smishing</strong>.</p>`,
      on: (a) => { a.show('sms'); a.resetSms(); },
    },
    {
      title: 'Revealing personal data',
      text: `<p>Users may not realise that the webpage is fake, particularly if they have <strong>never seen the company’s real webpage</strong> in a mobile browser.</p>
             <p>As a result, they might type in their <strong>username and password</strong> and reveal this personal data to the criminals.</p>`,
      tip: 'Try it: tap the link in the message. Use made-up details only.',
      async on(a, ctx) { a.show('sms'); await a.smsDemo(ctx); },
    },
  ],
});

FD.check({
  section: 'phishing',
  items: [
    { type: 'mcq', q: 'What is phishing?', opts: ['Sending large numbers of messages that appear to be from real organisations to get personal information and payment details', 'Creating a fake website and changing domain name servers', 'Deleting files by mistake', 'Copying data to an external storage device'], why: 'Phishing messages pretend to come from shops, banks or charities.' },
    { type: 'multi', q: 'How do phishing emails ask users to provide their information? Choose <b>two</b>.', need: 2, opts: [['By replying to the message', true], ['By following a hyperlink to a webpage', true], ['By phoning the police', false], ['By installing anti-virus software', false]], why: 'The webpage asks the user to type in their personal details.' },
    { type: 'mcq', q: 'What is spear phishing?', opts: ['Personalised phishing messages targeted at a small number of particular users', 'Phishing messages sent to millions of people', 'Phishing by SMS', 'A program that blocks phishing'], why: 'The messages are highly customised.' },
    { type: 'mcq', q: 'SMS phishing is sometimes called…', opts: ['smishing', 'pharming', 'spamming', 'botnetting'], why: 'The SMS opens a fake webpage in a mobile browser.' },
    { type: 'spot', q: 'Which parts of this email suggest it is phishing?', html: `<div class="spot-mail"><p><b>From:</b> <span data-spot="1" data-why="The email address does not belong to the real bank.">security@m0neybank-help.co</span></p><p><span data-spot="0" data-why="">Subject: Account notice</span></p><p><span data-spot="1" data-why="General, impersonal greeting.">Dear valued customer,</span></p><p><span data-spot="1" data-why="It asks you to follow a link and type in your details.">Click here and enter your password and card number</span> <span data-spot="1" data-why="It tells you to act immediately.">within 1 hour or your account will be closed.</span></p><p><span data-spot="0" data-why="">Kind regards</span></p></div>`, why: 'Check the sender’s address and never type personal details after following a link in a message.' },
  ],
});
