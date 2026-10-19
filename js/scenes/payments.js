FD.add({
  id: 'payments',
  title: 'Online payment systems',
  tab: 'Payments',
  icon: 'payments',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['cashless society', 'a society in which people pay for goods and services using methods other than cash'],
    ['payment processor', 'a computer that authorises financial transactions'],
    ['expiry date', 'the date after which something can no longer be used'],
    ['reader', 'a piece of electronic equipment that can read information that is stored or recorded somewhere, for example, on a card'],
    ['contactless', 'users can use a contactless debit card or credit card to pay for things by waving it over a machine, without using a PIN number'],
    ['smartwatch', 'a watch that provides data connectivity and often uses sensors to provide feedback to the device about its environment'],
  ],
  mount(el) {
    // Figure 6.16: number of mobile payment users (millions), read from the book's chart.
    const MOB = [['Asia/Pacific', 85, 163], ['Africa', 58, 101], ['North America', 32, 91], ['Europe', 27, 64], ['Latin America', 9, 22], ['Middle East', 2, 6]];
    const LIMIT = 50;
    el.innerHTML = `
      <div class="sim py">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="intro">🌍 Paying online</button><button data-p="tp">📧 Third-party processors</button><button data-p="card">💳 Bank cards</button><button data-p="nfc">📶 Contactless (NFC)</button>
        </div>

        <div data-panel="intro" class="sim">
          <div class="two-col">
            <div class="sim-box py-flow">
              <div class="py-node">🧑‍💻<small>buyer</small></div><span class="py-arr" data-zone="net">💳 → → →</span><div class="py-node">🗄️<small>computer that processes the payment</small></div><span class="py-arr">✓ → →</span><div class="py-node">🏪<small>shop</small></div>
            </div>
            <div class="sim-box">
              <p class="py-h">Number of mobile payment users (millions)</p>
              <div class="py-chart" id="chart">${MOB.map(([r, a, b]) => `<div class="py-col"><div class="py-bars"><i class="a" style="--h:${a / 1.7}%"><em>${a}</em></i><i class="b" style="--h:${b / 1.7}%"><em>${b}</em></i></div><small>${r}</small></div>`).join('')}</div>
              <p class="py-key"><span class="a"></span>2012 <span class="b"></span>2016</p>
            </div>
          </div>
          <p class="note">Did you know? About 85% of payments around the world are still made in cash, but many countries are moving quickly towards a <b>cashless society</b>.</p>
        </div>

        <div data-panel="tp" class="sim" hidden>
          <div class="two-col">
            <div class="win"><div class="win-bar">PayBuddy · send money</div><div class="win-body">
              <p class="note">Logged in as <b>aisha@email.example</b></p>
              <label class="pw-lbl">Send to (email address)<input id="to" value="ben@email.example"></label>
              <label class="pw-lbl">Amount (£)<input id="amt" type="number" min="1" max="500" value="12"></label>
              <button class="btn primary small-btn" id="sendM">Send money</button>
            </div></div>
            <div class="sim-box py-tp">
              <div class="py-node">👩 Aisha</div><div class="py-mid" id="tpMid">🗄️ payment processor</div><div class="py-node">👦 Ben</div>
              <p class="verdict" id="tpV"></p>
            </div>
          </div>
          <p class="note">PayBuddy is made up. Real examples in the book are PayPal and Skrill. Users can also use systems that link with online shopping applications, which can make shopping easier and faster.</p>
        </div>

        <div data-panel="card" class="sim" hidden>
          <div class="py-cardg">
            <div class="py-cardw">
              <div class="py-card" id="card">
                <div class="py-front">
                  <span class="py-bank">EXAMPLE BANK</span><span class="py-nfc">)))</span>
                  <span class="py-chip" data-zone="chip"></span>
                  <span class="py-num mono" data-zone="num">1234 5678 9012 3456</span>
                  <span class="py-exp mono" data-zone="exp">EXP 06/29</span>
                  <span class="py-name mono" data-zone="name">A STUDENT</span>
                </div>
                <div class="py-back">
                  <span class="py-strip"></span>
                  <span class="py-sig">A. Student <b class="mono" data-zone="csc">987</b></span>
                </div>
              </div>
              <button class="btn small-btn" id="flip">↻ Turn the card over</button>
              <p class="note">A made-up card. Never type a real card into a website you are not sure about.</p>
            </div>
            <div class="win"><div class="win-bar"><span class="url safe">${FD.icon.lock} https://shopmart.example/pay</span></div><div class="win-body" id="form">
              ${[['num', 'Card number'], ['exp', 'Expiry date (and sometimes start date)'], ['name', 'Name on the card'], ['csc', 'Card security code (CSC): 3 or 4 digits']].map(([k, l]) => `<label class="pw-lbl py-f" data-f="${k}">${l}<input data-f="${k}" autocomplete="off"></label>`).join('')}
              <button class="btn primary small-btn" id="payC">Pay £24.99</button>
              <div class="py-sec" id="sec" hidden><b>🔐 Secure check by your bank</b><label class="pw-lbl">Password<input type="password" id="secPw" placeholder="made-up only"></label><button class="btn small-btn" id="secGo">Confirm</button></div>
              <p class="verdict" id="cV"></p>
            </div></div>
          </div>
        </div>

        <div data-panel="nfc" class="sim" hidden>
          <div class="sim-box">
            <svg viewBox="0 0 560 200" aria-label="A contactless card near a card reader">
              <g transform="translate(400 50)"><rect class="dv-body" width="110" height="120" rx="12"/><rect class="dv-screen" x="12" y="12" width="86" height="34" rx="4"/><text class="py-scr" id="scr" x="55" y="34">£${'0.00'}</text><text class="emo" x="55" y="85" font-size="26">📶</text></g>
              <text class="svg-sm" x="455" y="190">card reader in a shop</text>
              <g id="cardG"><rect class="py-cardsvg" x="-40" y="-25" width="80" height="50" rx="6"/><rect x="-30" y="-10" width="14" height="11" rx="2" fill="#ffd43b"/><text x="20" y="-8" fill="#fff" font-size="11">)))</text><rect id="foil" class="py-foil" x="-46" y="-31" width="92" height="62" rx="8"/></g>
              <g id="crook" class="py-crook"><text class="emo" x="70" y="160" font-size="34">🕵️</text><text class="emo" x="105" y="150" font-size="20">📱</text><text class="svg-sm" x="85" y="195">criminal’s reader app</text></g>
              <path id="waves" class="py-waves" d=""/>
            </svg>
          </div>
          <div class="ctrls">
            <label class="rng"><span>Card distance from the reader <output id="dO"></output></span><input type="range" id="dist" min="0" max="100" value="80"></label>
            <label class="rng"><span>Amount <output id="aO"></output></span><input type="range" id="amount" min="1" max="120" value="18"></label>
          </div>
          <div class="ctrls">
            <button class="btn primary small-btn" id="tap">📶 Reader requests payment</button>
            <label class="tgl"><input type="checkbox" id="crookOn"> 🕵️ A criminal’s reader is nearby</label>
            <label class="tgl"><input type="checkbox" id="foilOn"> 🧻 Card wrapped in foil</label>
          </div>
          <p class="verdict" id="nV"></p>
        </div>
      </div>`;
    const root = el.querySelector('.py'), $ = (s) => root.querySelector(s);
    let dead = false, runId = 0;

    // ---- third party ----
    async function sendMoney() {
      const id = ++runId, v = $('#tpV'), m = $('#tpMid');
      v.textContent = ''; v.className = 'verdict';
      m.classList.add('busy'); m.textContent = '🗄️ checking the email accounts…';
      await FD.wait(1200); if (id !== runId || dead) return;
      m.classList.remove('busy'); m.textContent = '🗄️ payment processor ✓';
      v.className = 'verdict good';
      v.innerHTML = `✅ £${FD.esc($('#amt').value)} sent to <b>${FD.esc($('#to').value)}</b>. The email address identified the account, so Aisha did not share her bank details with Ben.`;
    }
    $('#sendM').addEventListener('click', sendMoney);

    // ---- bank card ----
    const card = $('#card');
    const cardFocus = (k) => { const back = k === 'csc'; card.classList.toggle('flip', back); FD.focus(card, k ? [k] : null); root.querySelectorAll('.py-f').forEach((f) => f.classList.toggle('hl', f.dataset.f === k)); };
    $('#flip').addEventListener('click', () => card.classList.toggle('flip'));
    root.querySelectorAll('#form input[data-f]').forEach((i) => i.addEventListener('focus', () => cardFocus(i.dataset.f)));
    const VAL = { num: '1234 5678 9012 3456', exp: '06/29', name: 'A STUDENT', csc: '987' };
    async function fillCard(ctx) {
      for (const k of ['num', 'exp', 'name', 'csc']) {
        const inp = root.querySelector(`#form input[data-f="${k}"]`); inp.value = ''; cardFocus(k);
        for (const c of VAL[k]) { inp.value += c; if (!(await ctx.sleep(60))) return; }
        if (!(await ctx.sleep(600))) return;
      }
      cardFocus(null);
    }
    function payCard() {
      const empty = [...root.querySelectorAll('#form input[data-f]')].filter((i) => !i.value.trim());
      const v = $('#cV');
      if (empty.length) { v.className = 'verdict bad'; v.textContent = `Fill in all four card details first (${empty.length} missing).`; return; }
      $('#sec').hidden = false; v.className = 'verdict'; v.textContent = '';
    }
    function secure() {
      const v = $('#cV'); $('#sec').hidden = true;
      v.className = 'verdict good'; v.innerHTML = '✅ Payment authenticated with a password by a secure system, then sent using <b>HTTPS</b>.';
    }
    const resetCard = () => { root.querySelectorAll('#form input').forEach((i) => { i.value = ''; }); $('#sec').hidden = true; $('#cV').textContent = ''; $('#cV').className = 'verdict'; cardFocus(null); };
    $('#payC').addEventListener('click', payCard);
    $('#secGo').addEventListener('click', secure);

    // ---- contactless ----
    const pos = () => { const d = +$('#dist').value; return [340 - d * 2.6, 80]; };
    function drawNfc() {
      const d = +$('#dist').value, a = +$('#amount').value, [x, y] = pos();
      $('#cardG').setAttribute('transform', `translate(${x} ${y})`);
      $('#dO').textContent = d < 15 ? 'in range (a few cm)' : 'out of range';
      $('#aO').textContent = `£${a}`;
      $('#foil').classList.toggle('on', $('#foilOn').checked);
      $('#crook').classList.toggle('on', $('#crookOn').checked);
      $('#scr').textContent = `£${a.toFixed(2)}`;
    }
    ['#dist', '#amount', '#foilOn', '#crookOn'].forEach((s) => $(s).addEventListener('input', () => { drawNfc(); $('#nV').textContent = ''; $('#nV').className = 'verdict'; }));
    async function tap() {
      const id = ++runId, v = $('#nV');
      const d = +$('#dist').value, a = +$('#amount').value, foil = $('#foilOn').checked, crook = $('#crookOn').checked;
      const [x] = pos();
      $('#waves').setAttribute('d', crook ? `M110 145 Q ${(x + 110) / 2} 130 ${x} 95` : `M400 100 Q ${(x + 400) / 2} 60 ${x} 80`);
      $('#waves').classList.add('on');
      await FD.wait(900); if (id !== runId || dead) return;
      $('#waves').classList.remove('on');
      if (crook) {
        v.className = 'verdict ' + (foil ? 'good' : 'bad');
        v.innerHTML = foil ? '✅ The foil stops the very weak signal from being intercepted. Nothing is taken.' : `❌ The criminal’s app took £${Math.min(a, LIMIT)} without a PIN. Contactless payments are <b>limited to a maximum amount</b> (£${LIMIT} in this simulation), so only a small amount can be stolen.`;
        return;
      }
      if (foil) { v.className = 'verdict bad'; v.textContent = 'The foil also blocks the shop’s reader: take the card out to pay.'; return; }
      if (d >= 15) { v.className = 'verdict bad'; v.textContent = 'Nothing happens: the card is not in range of the reader.'; return; }
      if (a > LIMIT) { v.className = 'verdict bad'; v.innerHTML = `⛔ £${a} is over the contactless limit (£${LIMIT} in this simulation). Insert the card and enter the PIN instead.`; return; }
      v.className = 'verdict good'; v.innerHTML = `✅ Paid £${a} by <b>NFC</b>: no PIN or any other form of user authentication.`;
    }
    $('#tap').addEventListener('click', tap);
    const setNfc = (o) => { if ('d' in o) $('#dist').value = o.d; if ('a' in o) $('#amount').value = o.a; if ('crook' in o) $('#crookOn').checked = o.crook; if ('foil' in o) $('#foilOn').checked = o.foil; drawNfc(); $('#nV').textContent = ''; $('#nV').className = 'verdict'; };
    async function move(to, ctx) { const from = +$('#dist').value; await FD.tween(900, (t) => { if (ctx.alive()) { $('#dist').value = from + (to - from) * t; drawNfc(); } }); }
    drawNfc();

    const show = FD.panels(root);
    show('intro');
    return { show, sendMoney, fillCard, payCard, secure, resetCard, cardFocus, tap, setNfc, move, destroy() { dead = true; runId++; } };
  },
  steps: [
    {
      title: 'Online payment systems',
      text: `<p>People can pay for goods and services online using various <strong>payment systems</strong>. These systems send <strong>payment details across networks</strong> to computers that <strong>process the payments</strong>.</p>
             <p class="muted">About 85% of payments around the world are still made in cash, but many countries are moving quickly towards a cashless society.</p>`,
      on: (a) => { a.show('intro'); },
    },
    {
      title: 'Mobile payments are growing',
      text: `<p>The number of people using non-cash payments differs from country to country (Figure 6.15), and <strong>mobile payments</strong> are a growing area (Figure 6.16).</p>`,
      on: (a) => { a.show('intro'); },
    },
    {
      title: 'Online third-party payment processors',
      text: `<p>Online third-party <strong>payment processors</strong> like <strong>PayPal</strong> or <strong>Skrill</strong> allow users to create an account so that they can send and receive money using <strong>email accounts for identification</strong>.</p>
             <p>Users can also use systems that link with online shopping applications, which can make shopping easier and faster.</p>`,
      tip: 'Try it: send money to an email address.',
      async on(a) { a.show('tp'); await a.sendMoney(); },
    },
    {
      title: 'Bank cards',
      text: `<p><strong>Bank cards</strong> allow customers to pay for goods and services online and in shops. When paying online, you usually need to enter the:</p>
             <ul><li><strong>card number</strong></li><li><strong>expiry date</strong> (and sometimes the start date) of the card</li><li><strong>name</strong> on the card</li><li>three- or four-digit <strong>card security code (CSC)</strong>.</li></ul>`,
      tip: 'Try it: click each box in the form to see where the detail is on the card.',
      async on(a, ctx) { a.show('card'); a.resetCard(); await a.fillCard(ctx); },
    },
    {
      title: 'CSC, CVC, CVV',
      text: `<p>The card security code is often called a <strong>card verification code (CVC)</strong> or <strong>card verification value (CVV)</strong>.</p>
             <p>The <strong>card number</strong> is <strong>not the same</strong> as the bank account number (Figure 6.17).</p>`,
      on: (a) => { a.show('card'); a.cardFocus('csc'); },
    },
    {
      title: 'Authenticating the payment',
      text: `<p>When a user chooses to use a card online, they are sometimes asked to <strong>authenticate the payment</strong> by entering a <strong>password</strong> using a secure system.</p>
             <p>These systems are used by financial organisations such as Mastercard®, which operates the Mastercard SecureCode® system.</p>`,
      async on(a, ctx) { a.show('card'); a.cardFocus(null); a.payCard(); if (!(await ctx.sleep(2200))) return; a.secure(); },
    },
    {
      title: 'Contactless cards using NFC',
      text: `<p><strong>Near field communication (NFC)</strong> is used in payment cards to allow the transfer of payment data. The payment does <strong>not require a PIN</strong> or any form of user authentication.</p>
             <p>If a card <strong>reader</strong> is <strong>in range</strong> and requesting payment, then the <strong>contactless</strong> card will take payment up to a <strong>maximum amount</strong>.</p>`,
      tip: 'Try it: move the card, change the amount and request a payment.',
      async on(a, ctx) { a.show('nfc'); a.setNfc({ d: 80, a: 18, crook: false, foil: false }); await a.move(5, ctx); if (!ctx.alive()) return; await a.tap(); if (!(await ctx.sleep(2000))) return; a.setNfc({ a: 90 }); await a.tap(); },
    },
    {
      title: 'Criminals and contactless cards',
      text: `<p>Criminals can use card readers or apps on NFC-enabled devices such as smartphones and smartwatches in order to commit fraud (Figure 6.19).</p>
             <p>The amount is limited, so that anyone using card readers or apps to commit fraud can <strong>only steal a small amount</strong>. NFC cards can be <strong>wrapped in foil</strong> to prevent the very weak signal from being intercepted by criminals.</p>`,
      async on(a, ctx) { a.show('nfc'); a.setNfc({ d: 100, a: 40, crook: true, foil: false }); await a.tap(); if (!(await ctx.sleep(2600))) return; a.setNfc({ foil: true }); await a.tap(); },
    },
    {
      title: 'Protecting online payments using HTTPS',
      text: `<p>Online payments are protected by <strong>HTTPS</strong>, which authenticates the payment server and encrypts the payment details. Look for the <strong>padlock</strong> in the address bar.</p>`,
      on: (a) => { a.show('card'); a.cardFocus(null); },
    },
  ],
});

FD.activities({
  section: 'payments',
  items: [
    {
      id: 'factsheet',
      title: 'Risks to data',
      task: '<p>Produce a <b>fact sheet</b> for other students at your school or college. The fact sheet should help to increase their awareness of the <b>risks to their data</b> and the <b>methods that they can use to reduce those risks</b>.</p><p class="note">Plan it here, then make it in a word processor or DTP program.</p>',
      sim: ['start', 'Look back at every section'],
      fields: ['Title and audience', 'The risks to data (one line each)', 'Methods to reduce each risk', 'Top tips box'],
      lines: 4,
    },
  ],
});

FD.check({
  section: 'payments',
  items: [
    { type: 'multi', q: 'List <b>three</b> pieces of data from a bank card that a user is asked to enter when making an online payment.', need: 3, opts: [['Card number', true], ['Expiry date', true], ['Card security code (CSC)', true], ['PIN', false], ['Bank account password', false]], why: 'Chapter question 4. Also the name on the card.' },
    { type: 'mcq', q: 'How do third-party payment processors such as PayPal identify users?', opts: ['Using email accounts', 'Using fingerprints', 'Using CAPTCHA tests', 'Using the card’s chip'], why: 'Users create an account and send and receive money using email accounts.' },
    { type: 'tf', q: 'The card number is the same as the bank account number.', a: false, why: 'They are different numbers.' },
    { type: 'mcq', q: 'Why are contactless payments limited to a maximum amount?', opts: ['So that anyone using card readers or apps to commit fraud can only steal a small amount', 'Because NFC is slow', 'To save battery in the card', 'Because shops cannot accept larger amounts'], why: 'NFC payments do not need a PIN.' },
    { type: 'mcq', q: 'How can an NFC card be protected from criminals’ readers?', opts: ['Wrap it in foil', 'Write the PIN on the back', 'Keep it next to a phone', 'Use it only online'], why: 'The foil prevents the very weak signal from being intercepted.' },
  ],
});
