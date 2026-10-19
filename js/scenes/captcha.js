FD.add({
  id: 'captcha',
  title: 'CAPTCHA tests and security questions',
  tab: 'CAPTCHA',
  icon: 'captcha',
  color: '--c5',
  section: true,
  interactive: true,
  vocab: [
    ['CAPTCHA', 'a computer program or system that can identify whether a user is a human or a computer'],
    ['bot', 'a computer program that can interact with systems or users'],
  ],
  mount(el) {
    const CH = 'ABCDEFGHJKLMNPQRSTUVWXYZabdefghkmnpqrt23456789';
    const GRID = [['🌳', 1], ['🦌', 0], ['🌲', 1], ['🦁', 0], ['🌳', 1], ['🐹', 0], ['🦓', 0], ['🐆', 0], ['🌴', 1]];
    // reCAPTCHA: a control word the system knows, and a word from a scanned book it could not read.
    const BOOK = [['library', 'forgotten'], ['harbour', 'lanterns'], ['ancient', 'merchants']];
    el.innerHTML = `
      <div class="sim cp">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="text">🔤 Type the characters</button><button data-p="img">🌳 Select the images</button><button data-p="re">📚 reCAPTCHA</button><button data-p="sq">❓ Security questions</button>
        </div>

        <div data-panel="text" class="sim">
          <div class="two-col">
            <div class="win"><div class="win-bar">Create an account · step 2 of 2</div><div class="win-body">
              <div class="cp-img" id="cimg" data-zone="img"></div>
              <div class="cp-row"><input id="cin" placeholder="Type the characters" autocomplete="off" spellcheck="false"><button class="ib" id="cnew" title="New characters" aria-label="New characters">↻</button><button class="ib" id="csay" title="Listen" aria-label="Listen to the characters" data-zone="audio">🔊</button></div>
              <button class="btn primary small-btn" id="cgo">Create account</button>
            </div></div>
            <div class="sim-box cp-side">
              <p class="cp-h">Who is filling in the form?</p>
              <div class="ctrls"><button class="btn small-btn" id="bot">🤖 Let a bot try</button></div>
              <pre class="cli" id="botLog">…</pre>
              <p class="verdict" id="cv"></p>
            </div>
          </div>
        </div>

        <div data-panel="img" class="sim" hidden>
          <div class="cp-grid-wrap">
            <div class="cp-grid-box"><p class="cp-gh">Select all the trees</p>
              <div class="cp-grid" id="grid">${GRID.map(([e], i) => `<button data-i="${i}" aria-pressed="false">${e}</button>`).join('')}</div>
              <button class="btn primary small-btn" id="gGo">Submit</button></div>
            <div class="cp-side"><p class="verdict" id="gv"></p><p class="note">Image identification CAPTCHA tests are another way of checking that users are human (Figure 6.7). Some ask users to complete more challenging tasks, such as putting the parts of a robot together (Figure 6.9).</p></div>
          </div>
        </div>

        <div data-panel="re" class="sim" hidden>
          <div class="two-col">
            <div class="win"><div class="win-bar">reCAPTCHA</div><div class="win-body">
              <div class="cp-re" id="reImg"></div>
              <input id="reIn" placeholder="Type the two words" autocomplete="off" spellcheck="false">
              <button class="btn primary small-btn" id="reGo">Verify</button>
            </div></div>
            <div class="sim-box cp-side">
              <div class="cp-scan" data-zone="scan"><p class="cp-h">📖 Page 37 of a scanned book</p><p class="cp-line" id="line"></p></div>
              <div class="meter"><span class="meter-l">Book digitised</span><span class="bar"><i id="dig"></i></span></div>
              <p class="verdict" id="rv"></p>
            </div>
          </div>
        </div>

        <div data-panel="sq" class="sim" hidden>
          <div class="two-col">
            <div class="win"><div class="win-bar">Forgotten your password?</div><div class="win-body">
              <p class="cp-h">Security question</p>
              <p>What was the name of your first pet?</p>
              <input id="sqIn" placeholder="Type the answer" autocomplete="off">
              <button class="btn primary small-btn" id="sqGo">Continue</button>
              <p class="verdict" id="sqv"></p>
            </div></div>
            <div class="sim-box"><p class="note">A <b>security question</b> asks something that only the real user should know. The answer was chosen when the account was created, so the system can check that it is the real user, for example before resetting a password.</p>
            <p class="note">In this simulation the answer is <b class="mono">Biscuit</b>.</p></div>
          </div>
        </div>
      </div>`;
    const root = el.querySelector('.cp'), $ = (s) => root.querySelector(s);
    let dead = false, code = '', reIdx = 0, digitised = 0;
    const rnd = (a, b) => a + Math.random() * (b - a);

    // ---- distorted text ----
    function warp(word, big) {
      const w = word.length * (big ? 30 : 26) + 30;
      return `<svg viewBox="0 0 ${w} 64" class="cp-svg" aria-hidden="true">
        ${[0, 1, 2].map(() => `<path class="cp-noise" d="M0 ${rnd(10, 54)} Q ${w / 2} ${rnd(0, 64)} ${w} ${rnd(10, 54)}"/>`).join('')}
        ${[...word].map((c, i) => `<text x="${20 + i * (big ? 30 : 26)}" y="${rnd(38, 48)}" transform="rotate(${rnd(-25, 25)} ${20 + i * 26} 40)" class="cp-ch" style="font-family:${['Georgia', 'Courier New', 'Trebuchet MS', 'Impact'][i % 4]}">${FD.esc(c)}</text>`).join('')}
      </svg>`;
    }
    function newCode() {
      code = Array.from({ length: 6 }, () => CH[Math.floor(Math.random() * CH.length)]).join('');
      $('#cimg').innerHTML = warp(code);
      $('#cin').value = ''; $('#cv').textContent = ''; $('#cv').className = 'verdict'; $('#botLog').textContent = '…';
    }
    function check(val, who) {
      const ok = val.trim() === code, v = $('#cv');
      v.className = 'verdict ' + (ok ? 'good' : 'bad');
      v.innerHTML = ok ? '✅ Correct: a <b>human</b> filled in the form. Account created.' : who === 'bot' ? '⛔ Wrong: the automatic software could not read the characters. <b>Bot blocked.</b>' : '❌ Not quite. Try again or get new characters.';
      return ok;
    }
    async function botTry(ctx) {
      const log = $('#botLog'), sleep = ctx ? ctx.sleep : async (ms) => { await FD.wait(ms); return !dead; };
      log.textContent = 'bot> reading image…';
      if (!(await sleep(900))) return;
      const guess = [...code].map((c) => (Math.random() < .6 ? '?' : CH[Math.floor(Math.random() * CH.length)])).join('');
      log.textContent += `\nbot> best guess: ${guess}\nbot> submitting form…`;
      $('#cin').value = guess;
      if (!(await sleep(800))) return;
      check(guess, 'bot');
    }
    async function humanTry(ctx) {
      newCode();
      for (const c of code) { $('#cin').value += c; if (!(await ctx.sleep(180))) return; }
      check($('#cin').value, 'human');
    }
    function say() {
      try {
        const u = new SpeechSynthesisUtterance(code.split('').map((c) => (/[A-Z]/.test(c) ? 'capital ' + c : c)).join(', '));
        u.lang = 'en-GB'; u.rate = .8;
        speechSynthesis.cancel(); speechSynthesis.speak(u);
      } catch (e) { FD.toast($('#cimg').closest('.win'), 'Audio is not available in this browser.'); }
    }
    $('#cnew').addEventListener('click', newCode);
    $('#csay').addEventListener('click', say);
    $('#cgo').addEventListener('click', () => check($('#cin').value, 'human'));
    $('#cin').addEventListener('keydown', (e) => { if (e.key === 'Enter') check($('#cin').value, 'human'); });
    $('#bot').addEventListener('click', () => botTry());
    const focusText = (z) => FD.focus($('#cimg').closest('.win'), z);

    // ---- image grid ----
    const cells = [...root.querySelectorAll('#grid button')];
    cells.forEach((b) => b.addEventListener('click', () => { b.classList.toggle('on'); b.setAttribute('aria-pressed', b.classList.contains('on')); }));
    function submitGrid() {
      const ok = cells.every((b, i) => b.classList.contains('on') === !!GRID[i][1]);
      cells.forEach((b, i) => b.classList.toggle('miss', !!GRID[i][1] !== b.classList.contains('on')));
      const v = $('#gv'); v.className = 'verdict ' + (ok ? 'good' : 'bad');
      v.innerHTML = ok ? '✅ Every tree selected: you are human!' : '❌ Not quite: check the squares outlined in red.';
    }
    function resetGrid() { cells.forEach((b) => { b.classList.remove('on', 'miss'); b.setAttribute('aria-pressed', false); }); $('#gv').textContent = ''; $('#gv').className = 'verdict'; }
    $('#gGo').addEventListener('click', submitGrid);
    async function gridDemo(ctx) { resetGrid(); for (let i = 0; i < GRID.length; i++) { if (GRID[i][1]) { cells[i].click(); if (!(await ctx.sleep(450))) return; } } submitGrid(); }

    // ---- reCAPTCHA ----
    function newRe() {
      const [known, unknown] = BOOK[reIdx % BOOK.length];
      $('#reImg').innerHTML = `<span class="cp-w">${warp(known, true)}</span><span class="cp-w" data-zone="scan">${warp(unknown, true)}</span>`;
      $('#reIn').value = ''; $('#rv').textContent = ''; $('#rv').className = 'verdict';
      const done = BOOK.slice(0, reIdx).map((b) => b[1]);
      $('#line').innerHTML = `…the old ${done.length > 0 ? '<b>forgotten</b>' : '<mark>f0rg?tt3n</mark>'} ${'library'} by the ${done.length > 1 ? '<b>lanterns</b>' : '<mark>lant?rn5</mark>'} of the ${done.length > 2 ? '<b>merchants</b>' : '<mark>rnerch@nts</mark>'}…`;
      $('#dig').style.setProperty('--v', Math.min(100, 70 + digitised * 10) + '%');
    }
    function verifyRe(val) {
      const [known, unknown] = BOOK[reIdx % BOOK.length], words = val.trim().toLowerCase().split(/\s+/);
      const ok = words.includes(known), v = $('#rv');
      v.className = 'verdict ' + (ok ? 'good' : 'bad');
      if (!ok) { v.innerHTML = `❌ The first word was wrong. Try again.`; return; }
      v.innerHTML = `✅ You are human. Your answer for the second word, <b>${FD.esc(words.find((w) => w !== known) || '?')}</b>, helps to <b>digitise the book</b>.`;
      reIdx++; digitised++;
      setTimeout(() => { if (!dead && $('#rv').classList.contains('good')) newRe(); }, FD.dur(2200));
    }
    $('#reGo').addEventListener('click', () => verifyRe($('#reIn').value));
    $('#reIn').addEventListener('keydown', (e) => { if (e.key === 'Enter') verifyRe($('#reIn').value); });
    async function reDemo(ctx) { const [k, u] = BOOK[reIdx % BOOK.length]; $('#reIn').value = ''; for (const c of `${k} ${u}`) { $('#reIn').value += c; if (!(await ctx.sleep(90))) return; } verifyRe($('#reIn').value); }

    // ---- security question ----
    function sq() {
      const ok = $('#sqIn').value.trim().toLowerCase() === 'biscuit', v = $('#sqv');
      v.className = 'verdict ' + (ok ? 'good' : 'bad');
      v.innerHTML = ok ? '✅ Correct answer: you can now choose a new password.' : '❌ That is not the answer that was chosen for this account.';
    }
    $('#sqGo').addEventListener('click', sq);
    async function sqDemo(ctx) { $('#sqIn').value = ''; for (const c of 'Biscuit') { $('#sqIn').value += c; if (!(await ctx.sleep(120))) return; } sq(); }

    const show = FD.panels(root);
    show('text');
    newCode(); newRe();
    return { show, newCode, botTry, humanTry, focusText, gridDemo, resetGrid, reDemo, sqDemo, destroy() { dead = true; try { speechSynthesis.cancel(); } catch (e) { /* ignore */ } } };
  },
  steps: [
    {
      title: 'CAPTCHA tests',
      text: `<p>When users create an online account, they may be given a test called a <strong>CAPTCHA test</strong>.</p>
             <p>CAPTCHA tests are used to make sure that data is entered by a <strong>human</strong> and not by an automatic software program known as a <strong>bot</strong> or <strong>web robot</strong>.</p>`,
      on: (a) => { a.show('text'); a.focusText(); a.newCode(); },
    },
    {
      title: 'What CAPTCHA stands for',
      text: `<p><strong>CAPTCHA</strong> stands for <strong>C</strong>ompletely <strong>A</strong>utomated <strong>P</strong>ublic <strong>T</strong>uring Test To Tell <strong>C</strong>omputers and <strong>H</strong>umans <strong>A</strong>part.</p>`,
      async on(a, ctx) { a.show('text'); a.focusText(); await a.humanTry(ctx); },
    },
    {
      title: 'Random letters and numbers',
      text: `<p>Some CAPTCHA tests ask users to enter a <strong>randomly generated series of letters and numbers</strong> that are displayed on the screen.</p>
             <p>Automatic software <strong>cannot read</strong> the letters displayed, or enter them into the required field, so this is used to <strong>distinguish human users from bots</strong>.</p>`,
      tip: 'Try it: type the characters yourself, then let a bot try.',
      async on(a, ctx) { a.show('text'); a.focusText('img'); a.newCode(); await a.botTry(ctx); },
    },
    {
      title: 'Images, audio and harder tasks',
      text: `<p><strong>Image identification</strong> CAPTCHA tests are another way of checking that users are human (Figure 6.7).</p>
             <p>CAPTCHA tests can play <strong>audio versions</strong> for users who cannot read the text (Figure 6.8), and some ask users to complete <strong>more challenging tasks</strong> (Figure 6.9).</p>`,
      tip: 'Try it: select all the trees. On the first tab, the 🔊 button reads the characters aloud.',
      async on(a, ctx) { a.show('img'); await a.gridDemo(ctx); },
    },
    {
      title: 'reCAPTCHA',
      text: `<p><strong>reCAPTCHA</strong> tests work in the same way, but they use <strong>extracts of text from scanned books</strong> or a selection of <strong>images that share common features</strong>.</p>
             <p>One word is already known: it checks that you are human. The other is a word the computer could not read.</p>`,
      on: (a) => { a.show('re'); },
    },
    {
      title: 'Helping to digitise books',
      text: `<p>When a user solves a reCAPTCHA test, their solution is used to help <strong>digitise books</strong> and <strong>annotate images</strong>.</p>
             <p>This helps to make <strong>more books available online</strong> and improves the information provided in <strong>online maps</strong> and other services.</p>`,
      async on(a, ctx) { a.show('re'); await a.reDemo(ctx); },
    },
    {
      title: 'Security questions',
      text: `<p><strong>Security questions</strong> are another check: a question that only the real user should be able to answer, for example before a forgotten password is reset.</p>`,
      async on(a, ctx) { a.show('sq'); await a.sqDemo(ctx); },
    },
  ],
});

FD.activities({
  section: 'captcha',
  items: [
    {
      id: 'humanvscomputer',
      title: 'Human versus computer',
      task: '<p>Figure 6.10 shows a line of scanned type and what a computer read: <span class="mono">“nlis” aged pntkm at society were distinguished frow.</span></p><p>Can you read the text better than the computer? Write what the scanned line really says, then explain why using humans to interpret scanned text produces more accurate outcomes.</p>',
      sim: ['captcha', 'Try the reCAPTCHA simulation'],
      fields: ['What the scanned line really says', 'Why humans read scanned text more accurately than computers'],
      lines: 2,
    },
    {
      id: 'recaptchaethics',
      title: 'reCAPTCHA',
      task: '<p>Investigate reCAPTCHA tests. Discuss whether you think it is right for companies to use these tests to help translate text and classify information, or whether you think companies are <b>exploiting internet users as unpaid labour</b>.</p>',
      fields: ['Arguments that it is right', 'Arguments that it exploits users as unpaid labour', 'My conclusion'],
      lines: 3,
    },
  ],
});

FD.check({
  section: 'captcha',
  items: [
    { type: 'mcq', q: 'What is the purpose of a CAPTCHA test?', opts: ['To make sure that data is entered by a human and not by a bot', 'To encrypt the user’s password', 'To block traffic on certain ports', 'To back up the user’s account'], why: 'It tells computers and humans apart.' },
    { type: 'mcq', q: 'Explain why CAPTCHA tests work.', opts: ['Automatic software cannot read the distorted characters or enter them into the field, but humans can', 'Bots are not allowed on the internet', 'Humans type faster than bots', 'The characters are encrypted with a key'], why: 'Chapter question 2: this distinguishes human users from bots.' },
    { type: 'tf', q: 'CAPTCHA tests can play audio versions for users who cannot read the text.', a: true, why: 'See Figure 6.8.' },
    { type: 'mcq', q: 'How is a user’s reCAPTCHA solution used?', opts: ['To help digitise books and annotate images', 'To create a new password', 'To update virus definitions', 'To pay for goods online'], why: 'This makes more books available online and improves online maps.' },
  ],
});
