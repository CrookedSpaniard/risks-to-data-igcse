FD.add({
  id: 'passwords',
  title: 'Passwords, PINs and biometrics',
  tab: 'Passwords',
  icon: 'passwords',
  color: '--c2',
  section: true,
  interactive: true,
  vocab: [
    ['masked', 'hidden'],
  ],
  mount(el) {
    const WORDS = ['password', 'qwerty', 'letmein', 'welcome', 'football', 'monkey', 'dragon', 'sunshine', 'princess', 'admin', 'iloveyou', 'aisha', 'daniel', 'maria', 'london', 'madrid', 'school', 'summer'];
    el.innerHTML = `
      <div class="sim pw">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="auth">🪪 Authenticate</button><button data-p="strong">💪 A strong password</button><button data-p="mask">🙈 Masking</button><button data-p="rem">💾 Remember me?</button>
        </div>

        <div data-panel="auth" class="sim">
          <div class="pw-auth">
            ${[['pass', '🔑 Password', 'Webmail', '<input type="password" value="w7#Kq!2rTz9" readonly>'], ['pin', '🔢 PIN', 'Online bank app', '<div class="pw-pin"><i></i><i></i><i></i><i></i></div>'], ['bio', '👆 Biometrics', 'Phone banking', '<div class="pw-fp">👆</div>']].map(([k, h, s, w]) => `
              <div class="win pw-m" data-m="${k}"><div class="win-bar">${s}</div><div class="win-body"><b>${h}</b>${w}<button class="btn small-btn" data-go="${k}">Log in</button><p class="pw-ok">✅ Authenticated: access granted</p></div></div>`).join('')}
          </div>
        </div>

        <div data-panel="strong" class="sim" hidden>
          <div class="two-col">
            <div class="sim-box pw-try">
              <label class="pw-lbl">New password<input id="np" type="text" value="password" autocomplete="off" spellcheck="false"></label>
              <div class="meter"><span class="meter-l" id="sl">Strength</span><span class="bar pw-bar"><i id="sb"></i></span></div>
              <label class="pw-lbl">Last changed<select id="age"><option value="new">This month</option><option value="old">3 years ago</option></select></label>
              <label class="tgl"><input type="checkbox" id="reuse"> I have used this password before</label>
              <div class="chips">${['123456', '12345678', 'password', 'Summer2015', 'Daniel!1', 'v9#Lr2!qTe8'].map((p) => `<button class="tg" data-p="${p}">${p}</button>`).join('')}</div>
            </div>
            <ul class="pw-rules" id="rules">
              <li data-r="len">More than eight characters long</li>
              <li data-r="mix">A mix of letters, numbers and symbols</li>
              <li data-r="case">A mix of uppercase and lowercase letters</li>
              <li data-r="rand">Random characters: not common words, names or dates</li>
              <li data-r="chg">Changed frequently</li>
              <li data-r="new">Something they have not used before</li>
            </ul>
          </div>
          <p class="note">Did you know? ‘123456’, ‘12345678’ and ‘password’ were the three most commonly used passwords in the USA and Western Europe in 2015.</p>
        </div>

        <div data-panel="mask" class="sim" hidden>
          <div class="two-col">
            <div class="sim-box pw-shoulder">
              <div class="pw-scene"><span class="pw-peek">👀🧍</span><span class="pw-user">🧑‍💻</span></div>
              <p class="pw-sees" id="sees"></p>
            </div>
            <div class="win"><div class="win-bar">Log in</div><div class="win-body">
              <label class="pw-lbl">Email<input value="user@email.com" readonly></label>
              <label class="pw-lbl">Password<input id="mp" type="password" value="Tq8!mRz#41b" readonly></label>
              <label class="tgl"><input type="checkbox" id="unmask"> Show password</label>
            </div></div>
          </div>
        </div>

        <div data-panel="rem" class="sim" hidden>
          <div class="seg" id="os"><span class="seg-l">Operating system</span><button data-v="stand">🖥️ Stand-alone (one shared account)</button><button data-v="net">🏫 Network (everyone logs on)</button></div>
          <div class="two-col">
            <div class="win"><div class="win-bar" id="remBar">Computer in the library</div><div class="win-body">
              <p class="pw-who" id="who"></p>
              <div class="pw-site"><b>✉️ Webmail</b><span id="state"></span></div>
              <div class="ctrls"><button class="btn small-btn" id="anaIn">Ana logs in and ticks “Remember me”</button><button class="btn small-btn" id="benIn">Ben sits down next</button></div>
            </div></div>
            <p class="verdict" id="remV"></p>
          </div>
        </div>
      </div>`;
    const root = el.querySelector('.pw'), $ = (s) => root.querySelector(s);
    let dead = false;

    // ---- authenticate ----
    async function login(k) {
      const m = root.querySelector(`.pw-m[data-m="${k}"]`);
      m.classList.remove('ok');
      if (k === 'pin') { const d = m.querySelectorAll('.pw-pin i'); for (const i of d) { i.classList.add('on'); await FD.wait(220); if (dead) return; } }
      if (k === 'bio') { m.querySelector('.pw-fp').classList.add('scan'); await FD.wait(900); if (dead) return; }
      m.classList.add('ok');
    }
    function resetAuth() { root.querySelectorAll('.pw-m').forEach((m) => { m.classList.remove('ok'); m.querySelectorAll('.pw-pin i').forEach((i) => i.classList.remove('on')); const f = m.querySelector('.pw-fp'); if (f) f.classList.remove('scan'); }); }
    root.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => login(b.dataset.go)));
    async function loginAll() { resetAuth(); await login('pass'); await login('pin'); await login('bio'); }

    // ---- strength ----
    function rate() {
      const p = $('#np').value, low = p.toLowerCase();
      const r = {
        len: p.length > 8,
        mix: /[a-z]/i.test(p) && /\d/.test(p) && /[^a-z0-9]/i.test(p),
        case: /[a-z]/.test(p) && /[A-Z]/.test(p),
        rand: !!p && !WORDS.some((w) => low.includes(w)) && !/(19|20)\d\d/.test(p) && !/(0123|1234|2345|3456|4567|5678|6789|abcd)/.test(low),
        chg: $('#age').value === 'new',
        new: !$('#reuse').checked,
      };
      let n = 0;
      root.querySelectorAll('#rules li').forEach((li) => { const ok = r[li.dataset.r]; li.classList.toggle('ok', ok); n += ok; });
      $('#sb').style.setProperty('--v', (n / 6 * 100) + '%');
      $('#sb').dataset.n = n;
      $('#sl').textContent = n <= 2 ? 'Weak' : n <= 4 ? 'Medium' : n === 5 ? 'Good' : 'Strong';
    }
    ['#np', '#age', '#reuse'].forEach((s) => $(s).addEventListener('input', rate));
    root.querySelectorAll('[data-p]').forEach((b) => { if (b.classList.contains('tg')) b.addEventListener('click', () => { $('#np').value = b.dataset.p; rate(); }); });
    async function typePw(s, ctx) { $('#np').value = ''; rate(); for (const c of s) { $('#np').value += c; rate(); if (!(await ctx.sleep(120))) return false; } return true; }
    const setPw = (s, age = 'new', reuse = false) => { $('#np').value = s; $('#age').value = age; $('#reuse').checked = reuse; rate(); };
    const hl = (list) => root.querySelectorAll('#rules li').forEach((li) => li.classList.toggle('hl', list.includes(li.dataset.r)));

    // ---- masking ----
    function mask() {
      const show = $('#unmask').checked;
      $('#mp').type = show ? 'text' : 'password';
      $('#sees').innerHTML = show ? '😮 The person behind can read: <b class="mono">Tq8!mRz#41b</b>' : '🙈 The person behind only sees: <b class="mono">•••••••••••</b>';
      $('#sees').className = 'verdict ' + (show ? 'bad' : 'good');
    }
    $('#unmask').addEventListener('change', mask);
    const setMask = (on) => { $('#unmask').checked = !on; mask(); };

    // ---- remember me ----
    let os = 'stand', ana = false, user = '';
    const osSeg = $('#os');
    function drawRem() {
      $('#who').innerHTML = user ? `Logged on to the computer as: <b>${os === 'net' ? user : 'Library PC (shared)'}</b>` : 'Nobody is using the computer.';
      $('#state').innerHTML = user === 'Ben' && ana && os === 'stand' ? '<b class="pw-bad">Ana’s inbox is open!</b>' : user === 'Ana' ? 'Ana’s inbox' : user === 'Ben' ? 'Log in: enter email and password' : '';
      const v = $('#remV');
      if (user !== 'Ben') { v.textContent = ''; v.className = 'verdict'; return; }
      if (os === 'stand') { v.className = 'verdict bad'; v.innerHTML = '❌ The saved password is shared by everyone who uses this computer, so Ben can <b>access Ana’s account</b>.'; }
      else { v.className = 'verdict good'; v.innerHTML = '✅ Ben logged on to the network with his own account, so he <b>cannot see Ana’s stored passwords</b>.'; }
    }
    const setOs = (v) => { os = v; FD.segSet(osSeg, v); ana = false; user = ''; drawRem(); };
    osSeg.addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) setOs(b.dataset.v); });
    $('#anaIn').addEventListener('click', () => { ana = true; user = 'Ana'; drawRem(); });
    $('#benIn').addEventListener('click', () => { user = 'Ben'; drawRem(); });
    async function remDemo(v, ctx) { setOs(v); if (!(await ctx.sleep(900))) return; ana = true; user = 'Ana'; drawRem(); if (!(await ctx.sleep(1600))) return; user = 'Ben'; drawRem(); }

    const show = FD.panels(root);
    show('auth');
    setOs('stand'); rate(); mask();
    return { show, loginAll, resetAuth, typePw, setPw, hl, setMask, remDemo, destroy() { dead = true; } };
  },
  steps: [
    {
      title: 'Authenticating a user',
      text: `<p><strong>Passwords</strong>, <strong>PINs</strong> and <strong>biometrics</strong> are used online to <strong>authenticate</strong> a user so that they can access an online system, such as <strong>webmail</strong> or an <strong>online bank account</strong>.</p>`,
      async on(a) { a.show('auth'); await a.loginAll(); },
    },
    {
      title: 'Long, and a mix of characters',
      text: `<p>Users should make sure that their password is:</p>
             <ul><li><strong>more than eight characters</strong> long</li><li>a mix of <strong>letters, numbers and symbols</strong></li><li>a mix of <strong>uppercase and lowercase</strong> letters</li></ul>`,
      tip: 'Try it: type your own made-up password and watch the list. Never type a real password.',
      async on(a, ctx) { a.show('strong'); a.hl(['len', 'mix', 'case']); a.setPw('password'); if (!(await ctx.sleep(1200))) return; await a.typePw('Tiger#58wq', ctx); },
    },
    {
      title: 'Random, new and changed frequently',
      text: `<p>It should also be:</p>
             <ul><li>made up of <strong>random characters</strong> (not common words, names or dates)</li><li><strong>changed frequently</strong></li><li>something that they <strong>have not used before</strong>.</li></ul>`,
      async on(a, ctx) { a.show('strong'); a.hl(['rand', 'chg', 'new']); a.setPw('Daniel2015!', 'old', true); if (!(await ctx.sleep(2200))) return; a.setPw('v9#Lr2!qTe8', 'new', false); },
    },
    {
      title: 'The most common passwords',
      text: `<p>Did you know? <b>‘123456’</b>, <b>‘12345678’</b> and <b>‘password’</b> were the three most commonly used passwords in the USA and Western Europe in 2015.</p>
             <p>These are the first passwords that criminals’ software tries.</p>`,
      async on(a, ctx) { a.show('strong'); a.hl([]); for (const p of ['123456', '12345678', 'password']) { a.setPw(p); if (!(await ctx.sleep(1100))) return; } },
    },
    {
      title: 'Masking',
      text: `<p>When entering a password or a PIN, the characters are often <strong>masked</strong> (hidden) so that anyone watching the screen cannot see what is typed (Figure 6.6).</p>`,
      tip: 'Try it: tick “Show password” and see what the person behind can read.',
      async on(a, ctx) { a.show('mask'); a.setMask(false); if (!(await ctx.sleep(1800))) return; a.setMask(true); },
    },
    {
      title: 'Remembered passwords',
      text: `<p>Some services allow the password to be <strong>remembered</strong>. This is <strong>not recommended</strong> for multiple users of computers with <strong>stand-alone operating systems</strong>, as it may mean that another user can access someone else’s accounts.</p>`,
      async on(a, ctx) { a.show('rem'); await a.remDemo('stand', ctx); },
    },
    {
      title: 'Network operating systems',
      text: `<p><strong>Network operating systems</strong> are more secure and will <strong>not allow different users to see each other’s stored passwords</strong>.</p>`,
      async on(a, ctx) { a.show('rem'); await a.remDemo('net', ctx); },
    },
  ],
});

FD.activities({
  section: 'passwords',
  items: [
    {
      id: 'onlinesecurity',
      title: 'Your online security',
      task: '<p>Make a list of the websites that you use that require a password. List up to 10 websites, then answer the questions.</p><ul><li>Do you use the same password for each website?</li><li>Do any of those sites contain sensitive data?</li><li>Have you changed your password recently? If not, do it as soon as possible.</li></ul><p class="note">Do <b>not</b> write any of your passwords here.</p>',
      sim: ['passwords', 'Check what makes a strong password'],
      fields: ['Websites I use that need a password (up to 10)', 'Do I use the same password for each website?', 'Which sites contain sensitive data?', 'Have I changed my passwords recently? What will I do now?'],
      lines: 3,
    },
  ],
});

FD.check({
  section: 'passwords',
  items: [
    { type: 'multi', q: 'State <b>two</b> methods used by an online system to authenticate a user.', need: 2, opts: [['A password or PIN', true], ['Biometrics, e.g. a fingerprint', true], ['A firewall rule', false], ['A full backup', false]], why: 'Chapter question 7. CAPTCHA tests and security questions are also used.' },
    { type: 'sort', q: 'Does each password follow the advice?', bins: ['Strong', 'Weak'], rows: [['123456', 1], ['Summer2015', 1], ['k8#Vq!2mZr4', 0], ['password', 1], ['T7!pLw#3xQ9e', 0]], why: 'A strong password is more than eight random characters with a mix of uppercase, lowercase, numbers and symbols.' },
    { type: 'mcq', q: 'Why are passwords masked when they are entered?', opts: ['So that anyone watching the screen cannot see what is typed', 'So that the password is stored on the server', 'To make the password longer', 'So that the user can remember it'], why: 'Masked means hidden.' },
    { type: 'tf', q: 'Letting a browser remember passwords is recommended for a stand-alone computer shared by several users.', a: false, why: 'Another user could access someone else’s accounts. Network operating systems keep stored passwords separate.' },
  ],
});
