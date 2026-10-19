FD.add({
  id: 'start',
  title: 'Start here',
  tab: 'Start',
  icon: 'start',
  color: '--accent',
  page: true,
  mount(el) {
    const S = FD.state;
    const nodes = [[60, 45, '🦠'], [160, 25, '🎣'], [265, 30, '🕵️'], [360, 55, '🗑️'], [55, 180, '🧱'], [150, 205, '🔑'], [265, 205, '💾'], [360, 175, '💳']];
    const part = (p) => `
      <section class="card st-part">
        <h3>Part ${p} · ${FD.PARTS[p].name} <small>${FD.PARTS[p].pages}</small></h3>
        <ul class="st-list">${FD.SECTIONS.filter((s) => s.part === p).map((s) => `
          <li><button data-go="${s.id}" style="--c:var(${s.color})">${FD.icon[s.id]}<span><b>${FD.SECTIONS.indexOf(s) + 1}. ${s.name}</b><small>${s.line}</small></span>${FD.state.checks['check-' + s.id] ? '<span class="st-done" title="Check done">✓</span>' : ''}</button></li>`).join('')}
          <li><button data-go="test${p}" style="--c:var(--red-ui)">${FD.icon.final}<span><b>Test Part ${p}</b><small>Multiple choice + exam-style questions</small></span>${S.tests['test' + p] && S.tests['test' + p].done ? '<span class="st-done">✓</span>' : ''}</button></li>
        </ul>
      </section>`;
    el.innerHTML = `
      <section class="card st-hero">
        <div>
          <p class="kick">Unit 3 · Operating online · Chapter 6 · Pearson Edexcel International GCSE ICT</p>
          <h2>Risks to data and personal information</h2>
          <p>Huge amounts of data are transmitted and stored digitally, and a lot of it is <b>personal or financial</b>. That is why criminals target digital systems: they want data to commit <b>fraud</b> or <b>identity theft</b>. In this lesson you will see the <b>risks</b> to your data when you operate online, and the <b>methods</b> used to secure it and prevent unauthorised access and use.</p>
          <div class="who">
            <label>Your name<input id="sName" autocomplete="name" placeholder="First name and surname" value="${FD.esc(S.name)}"></label>
            <label>Class<input id="sClass" placeholder="e.g. 10B" value="${FD.esc(S.cls)}"></label>
          </div>
          <p class="small" id="sMsg">Your name goes on the results you send to your teacher.</p>
          <div class="chk-btns">
            <button class="btn primary" id="sGo">${S.last && S.last !== 'start' ? '▶ Continue where I left off' : '▶ Start Part A'}</button>
            <button class="btn ghost" id="sProg" style="color:#fff;border-color:rgb(255 255 255 / .4)">${FD.icon.progress} My progress</button>
          </div>
        </div>
        <svg class="st-net" viewBox="0 0 420 230" role="img" aria-label="Risks and protections around your personal data">
          ${nodes.map(([x, y]) => `<line x1="${x}" y1="${y}" x2="210" y2="115"/>`).join('')}
          <rect class="nd" x="182" y="88" width="56" height="54" rx="8"/><text x="210" y="124" style="font-size:26px">🔒</text>
          ${nodes.map(([x, y, e]) => `<circle class="nd" cx="${x}" cy="${y}" r="25"/><text x="${x}" y="${y + 8}" style="font-size:23px">${e}</text>`).join('')}
        </svg>
      </section>

      <section class="card">
        <h3>How to use this website on your own</h3>
        ${FD.HOWTO}
      </section>

      <div class="st-cols">${part('A')}${part('B')}</div>
      <p class="small muted">Your progress is saved in this browser only. Nothing is sent to the internet. All the emails, websites, people and companies here are made-up simulations, except the examples taken from the book. Never type real passwords or card numbers into this website.</p>`;
    const $ = (s) => el.querySelector(s);
    $('#sName').addEventListener('input', (e) => { FD.state.name = e.target.value; FD.save(); });
    $('#sClass').addEventListener('input', (e) => { FD.state.cls = e.target.value; FD.save(); });
    $('#sGo').addEventListener('click', () => {
      if (FD.state.last && FD.state.last !== 'start') FD.goto(FD.state.last, FD.state.step || 0);
      else FD.goto('access');
    });
    $('#sProg').addEventListener('click', FD.openProgress);
    el.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => FD.goto(b.dataset.go)));
  },
});
