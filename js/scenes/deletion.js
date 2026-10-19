FD.add({
  id: 'deletion',
  title: 'Accidental deletion',
  tab: 'Accidental deletion',
  icon: 'deletion',
  color: '--c8',
  section: true,
  interactive: true,
  mount(el) {
    const FILES = ['📄 History essay.docx', '📊 Science results.xlsx', '🖼️ Art portfolio.jpg', '📄 Coursework draft.docx', '🎞️ Presentation.pptx'];
    const DRIVES = { usb: ['🔌 USB flash drive (E:)', 3], main: ['💽 Main drive (C:)', 5] };
    const TEXT = 'My ICT coursework: risks to data. Data can be lost through unauthorised access, malware or accidental deletion, so it is important to';
    el.innerHTML = `
      <div class="sim dl">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="key">⌨️ A key pressed by accident</button><button data-p="fmt">💽 The wrong drive</button><button data-p="pwr">🔌 A power cut</button>
        </div>

        <div data-panel="key" class="sim">
          <div class="win">
            <div class="win-bar">Documents</div>
            <div class="win-body"><ul class="dl-files" id="files">${FILES.map((f, i) => `<li data-i="${i}"><label><input type="checkbox"${i === 3 ? ' checked' : ''}> ${f}</label></li>`).join('')}</ul></div>
          </div>
          <div class="ctrls">
            <button class="btn small-btn" id="ctrlA">Ctrl + A <small>(select all)</small></button>
            <button class="btn small-btn" id="delKey">⌫ Delete</button>
            <button class="btn ghost small-btn" id="undo">↺ Get them back</button>
            <span class="note" id="keyMsg"></span>
          </div>
        </div>

        <div data-panel="fmt" class="sim" hidden>
          <div class="two-col">
            <div class="win">
              <div class="win-bar">Format drive</div>
              <div class="win-body">
                <p class="note">You want to wipe your old USB flash drive so you can reuse it.</p>
                <div class="seg" id="drv"><span class="seg-l">Drive to format</span><button data-v="usb">${DRIVES.usb[0]}</button><button data-v="main">${DRIVES.main[0]}</button></div>
                <div class="meter"><span class="meter-l">Formatting</span><span class="bar"><i id="fBar"></i></span></div>
                <div class="ctrls"><button class="btn primary small-btn" id="fmtGo">Format</button><button class="btn ghost small-btn" id="fmtReset">↺ Start again</button></div>
              </div>
            </div>
            <div class="dl-drives">
              ${Object.entries(DRIVES).map(([k, [n, c]]) => `<div class="sim-box dl-drive" data-d="${k}"><b>${n}</b><p class="dl-cont">${k === 'usb' ? '📄 old-notes.txt · 🖼️ meme.png · 🎵 tune.mp3' : '📁 Windows · 📁 Programs · 📁 Documents · 📁 Photos · 📁 Music'}</p><small>${c} items</small></div>`).join('')}
              <p class="verdict" id="fmtV"></p>
            </div>
          </div>
        </div>

        <div data-panel="pwr" class="sim" hidden>
          <div class="two-col">
            <div class="win dl-doc">
              <div class="win-bar">Coursework.docx <span class="dl-uns" id="uns">● not saved</span></div>
              <div class="win-body"><p class="dl-text" id="doc"></p><div class="dl-black" id="black" hidden>⚫ No power</div></div>
            </div>
            <div class="sim-box dl-plug">
              <p class="dl-sock" id="sock">🔌 Plugged in</p>
              <div class="ctrls">
                <button class="btn small-btn" id="type">⌨️ Keep typing</button>
                <button class="btn small-btn" id="cut">⚡ Power cut</button>
                <button class="btn small-btn" id="boot">🔁 Switch on again</button>
              </div>
              <p class="verdict" id="pwrV"></p>
            </div>
          </div>
        </div>
      </div>`;
    const root = el.querySelector('.dl'), $ = (s) => root.querySelector(s);
    let dead = false, runId = 0;

    // ---- key ----
    const boxes = () => [...root.querySelectorAll('#files input')];
    function resetKey() { root.querySelectorAll('#files li').forEach((li, i) => { li.classList.remove('gone'); li.querySelector('input').checked = i === 3; }); $('#keyMsg').textContent = ''; }
    function selectAll() { boxes().forEach((b) => { b.checked = true; }); $('#keyMsg').textContent = 'Every file is now selected…'; }
    async function del() {
      const sel = root.querySelectorAll('#files li');
      let n = 0;
      for (const li of sel) {
        if (!li.querySelector('input').checked || li.classList.contains('gone')) continue;
        li.classList.add('gone'); n++;
        await FD.wait(180); if (dead) return;
      }
      $('#keyMsg').innerHTML = n ? `🗑️ <b>${n} file${n > 1 ? 's' : ''} deleted</b> by one key press.` : 'Nothing selected.';
    }
    $('#ctrlA').addEventListener('click', selectAll);
    $('#delKey').addEventListener('click', del);
    $('#undo').addEventListener('click', resetKey);
    async function oops(ctx) { resetKey(); if (!(await ctx.sleep(900))) return; selectAll(); if (!(await ctx.sleep(1100))) return; await del(); }

    // ---- format ----
    let drive = 'usb';
    const drv = $('#drv');
    drv.addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) { drive = b.dataset.v; FD.segSet(drv, drive); } });
    function resetFmt() { runId++; root.querySelectorAll('.dl-drive').forEach((d) => d.classList.remove('wiped')); $('#fBar').style.setProperty('--v', '0%'); $('#fmtV').textContent = ''; $('#fmtV').className = 'verdict'; }
    async function format(d) {
      if (d) { drive = d; FD.segSet(drv, d); }
      resetFmt();
      const id = runId;
      await FD.tween(1800, (t) => { if (id === runId && !dead) $('#fBar').style.setProperty('--v', t * 100 + '%'); });
      if (id !== runId || dead) return;
      root.querySelector(`.dl-drive[data-d="${drive}"]`).classList.add('wiped');
      const v = $('#fmtV');
      if (drive === 'main') { v.innerHTML = '❌ Wrong device! The <b>entire contents of the main drive</b> have been deleted by mistake.'; v.className = 'verdict bad'; }
      else { v.innerHTML = '✅ The right drive: only the old USB files were wiped.'; v.className = 'verdict good'; }
    }
    $('#fmtGo').addEventListener('click', () => format());
    $('#fmtReset').addEventListener('click', resetFmt);
    FD.segSet(drv, drive);

    // ---- power ----
    let typed = 0, saved = 0, on = true;
    const show = () => { $('#doc').textContent = TEXT.slice(0, typed) + (on ? '|' : ''); $('#uns').hidden = typed === saved; };
    function resetPwr() { runId++; typed = 0; saved = 0; on = true; $('#black').hidden = true; $('#sock').textContent = '🔌 Plugged in'; $('#pwrV').textContent = ''; $('#pwrV').className = 'verdict'; show(); }
    async function type() {
      if (!on) return;
      const id = ++runId;
      while (typed < TEXT.length) {
        typed++; show();
        await FD.wait(35);
        if (id !== runId || dead) return;
      }
    }
    function cut() { runId++; on = false; $('#black').hidden = false; $('#sock').textContent = '❌ Power lost unexpectedly'; }
    async function boot() {
      if (on) return;
      $('#sock').textContent = '🔁 Starting up…';
      await FD.wait(900); if (dead) return;
      on = true; $('#black').hidden = true; $('#sock').textContent = '🔌 Plugged in';
      const lost = typed - saved; typed = saved; show();
      const v = $('#pwrV');
      v.innerHTML = lost ? `❌ <b>${lost} characters lost.</b> The work was never saved, so it is gone.` : 'Nothing was lost.';
      v.className = 'verdict ' + (lost ? 'bad' : 'good');
    }
    $('#type').addEventListener('click', type);
    $('#cut').addEventListener('click', cut);
    $('#boot').addEventListener('click', boot);
    async function powerCut(ctx) { resetPwr(); type(); if (!(await ctx.sleep(3200))) return; cut(); if (!(await ctx.sleep(1400))) return; await boot(); }
    resetPwr();

    const showP = FD.panels(root);
    showP('key');
    return { show: showP, oops, resetKey, format, resetFmt, powerCut, destroy() { dead = true; runId++; } };
  },
  steps: [
    {
      title: 'Deleting by mistake',
      text: `<p>Users can sometimes <strong>delete files</strong> or even the <strong>entire contents of a drive</strong> by mistake.</p>
             <p>This can happen in three ways.</p>`,
      on: (a) => { a.show('key'); a.resetKey(); },
    },
    {
      title: '1 · A key pressed by accident',
      text: `<p>They <strong>press a key on a keyboard by accident</strong>.</p>
             <p>Here, <b>Ctrl + A</b> selects every file and then <b>Delete</b> removes them all.</p>`,
      tip: 'Try it: select files and press Delete, then get them back.',
      async on(a, ctx) { a.show('key'); await a.oops(ctx); },
    },
    {
      title: '2 · Formatting the wrong device',
      text: `<p>They <strong>format media on the wrong storage device</strong>.</p>
             <p>Formatting wipes a drive. Choose the main drive instead of the USB flash drive and everything on it is gone.</p>`,
      tip: 'Try it: format the USB flash drive, then the main drive.',
      async on(a) { a.show('fmt'); await a.format('main'); },
    },
    {
      title: '3 · Losing power unexpectedly',
      text: `<p>Their <strong>device loses power unexpectedly</strong>.</p>
             <p>Work that has not been saved is lost when the power is cut.</p>`,
      tip: 'Try it: type, cut the power and switch on again.',
      async on(a, ctx) { a.show('pwr'); await a.powerCut(ctx); },
    },
  ],
});

FD.check({
  section: 'deletion',
  items: [
    { type: 'multi', q: 'Which <b>three</b> situations can cause accidental deletion?', need: 3, opts: [['Pressing a key on a keyboard by accident', true], ['Formatting media on the wrong storage device', true], ['The device losing power unexpectedly', true], ['Using a strong password', false], ['Installing anti-virus software', false]], why: 'These are the three examples in the book.' },
    { type: 'tf', q: 'Accidental deletion can remove the entire contents of a drive.', a: true, why: 'For example, formatting the wrong storage device.' },
    { type: 'mcq', q: 'A student wipes their main drive instead of a USB flash drive. What has happened?', opts: ['They formatted media on the wrong storage device', 'Ransomware encrypted the files', 'A botnet took over the computer', 'Their account was phished'], why: 'This is accidental deletion: nobody meant to cause harm.' },
  ],
});
