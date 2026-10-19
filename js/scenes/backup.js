FD.add({
  id: 'backup',
  title: 'Backup procedures',
  tab: 'Backups',
  icon: 'backup',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['safe', 'a strong metal box or cupboard with special locks to contain money and valuable things'],
  ],
  mount(el) {
    const F = ['A', 'B', 'C', 'D', 'E', 'F'];
    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const CHG = [F, ['A'], ['B', 'C'], ['A'], ['D'], ['B', 'E'], ['F']]; // files changed each day (Sunday = first full backup)
    const IDEAS = [
      ['auto', '⏰ Set automatic backups.'],
      ['optical', '💿 Do not use optical media: they deteriorate over time and are fragile.'],
      ['late', '🌙 Schedule backups for late in the evening, when users will not be using the data, to avoid conflicts.'],
      ['copies', '📑 Create more than one copy.'],
      ['online', '☁️ Keep one copy of a folder containing important files backed up using online storage.'],
      ['places', '📍 Store copies at multiple locations.'],
      ['safe', '🔐 Store important data in a fireproof safe.'],
    ];
    el.innerHTML = `
      <div class="sim bk">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="why">💾 Why back up?</button><button data-p="types">📅 Three types of backup</button><button data-p="ideas">✅ Good ideas</button>
        </div>

        <div data-panel="why" class="sim">
          <div class="bk-why">
            <div class="sim-box bk-site" data-zone="home">
              <p class="bk-h">🏠 At home</p>
              <div class="bk-dev" id="dMain"><b>💻 Laptop</b><small>original files</small></div>
              <div class="bk-dev" id="dExt"><b>🔌 External hard drive</b><small>backup</small></div>
            </div>
            <div class="sim-box bk-site" data-zone="cloud">
              <p class="bk-h">☁️ Online storage <small>another geographical location</small></p>
              <label class="tgl"><input type="checkbox" id="useOnline" checked> Also back up online</label>
              <div class="bk-dev" id="dOn"><b>🗄️ Data centre</b><small>backup</small></div>
            </div>
          </div>
          <div class="ctrls">
            ${[['theft', '🕵️ Theft'], ['fire', '🔥 Flooding or fire'], ['malware', '🦠 Malware'], ['power', '⚡ Power cut']].map(([k, l]) => `<button class="btn small-btn" data-x="${k}">${l}</button>`).join('')}
            <button class="btn ghost small-btn" id="bkReset">↺ Start again</button>
          </div>
          <p class="verdict" id="whyV"></p>
          <label class="rng"><span>Back up every… <output id="fO"></output></span><input type="range" id="freq" min="1" max="30" value="7"></label>
          <div class="readout"><div class="ro"><small>Storage needed per month</small><b id="stor"></b></div><div class="ro bad"><small>Most work you could lose</small><b id="lose"></b></div></div>
        </div>

        <div data-panel="types" class="sim" hidden>
          <div class="seg" id="kind"><span class="seg-l">Type of backup</span><button data-v="full">Full</button><button data-v="diff">Differential</button><button data-v="inc">Incremental</button></div>
          <div class="bk-tl-wrap"><table class="tbl bk-tl"><thead><tr><th>Day</th><th>Files changed</th>${F.map((f) => `<th>${f}</th>`).join('')}<th>Copied</th></tr></thead><tbody id="tl"></tbody></table></div>
          <p class="note bk-def" id="def"></p>
          <div class="readout"><div class="ro"><small>Files copied this week</small><b id="tot"></b></div><div class="ro"><small>To restore on Saturday you need</small><b id="need"></b></div></div>
        </div>

        <div data-panel="ideas" class="sim" hidden>
          <ul class="bk-ideas" id="ideas">${IDEAS.map(([k, t]) => `<li data-k="${k}">${t}</li>`).join('')}</ul>
          <p class="bk-hint"><b>Hint:</b> never put humans in charge of creating backups because they will forget. An automatic system is more reliable.</p>
        </div>
      </div>`;
    const root = el.querySelector('.bk'), $ = (s) => root.querySelector(s);
    let dead = false;

    // ---- disasters ----
    function resetWhy() { root.querySelectorAll('.bk-dev').forEach((d) => d.classList.remove('lost', 'ok')); $('#whyV').textContent = ''; $('#whyV').className = 'verdict'; $('#dOn').classList.toggle('off', !$('#useOnline').checked); }
    function hit(k) {
      resetWhy();
      const online = $('#useOnline').checked;
      const both = k === 'theft' || k === 'fire'; // the laptop and the drive are in the same place
      $('#dMain').classList.add('lost');
      if (both) $('#dExt').classList.add('lost'); else $('#dExt').classList.add('ok');
      if (online) $('#dOn').classList.add('ok');
      const v = $('#whyV');
      const what = { theft: 'The laptop was stolen', fire: 'A fire or flood damaged the house', malware: 'Malware deleted the files', power: 'A power cut damaged the files' }[k];
      if (!both) { v.className = 'verdict good'; v.innerHTML = `${what}, but the backup files are safe: restore them from the external drive.`; }
      else if (online) { v.className = 'verdict good'; v.innerHTML = `${what}, and the external drive was in the same place. The <b>online copy</b> is in a different geographical location, so it is safe (restoring over the internet is <b>slower</b>).`; }
      else { v.className = 'verdict bad'; v.innerHTML = `${what}. The external drive was in the same place, so <b>every copy is lost</b>.`; }
    }
    root.querySelectorAll('[data-x]').forEach((b) => b.addEventListener('click', () => hit(b.dataset.x)));
    $('#bkReset').addEventListener('click', resetWhy);
    $('#useOnline').addEventListener('change', resetWhy);
    function freq() {
      const d = +$('#freq').value;
      $('#fO').textContent = d === 1 ? 'day' : `${d} days`;
      $('#stor').textContent = `${Math.round(30 / d * 8)} GB`;
      $('#lose').textContent = d === 1 ? '1 day' : `${d} days`;
    }
    $('#freq').addEventListener('input', freq);
    async function slide(ctx) { for (const d of [1, 3, 7, 14, 30]) { $('#freq').value = d; freq(); if (!(await ctx.sleep(700))) return; } }
    const setOnline = (on) => { $('#useOnline').checked = on; resetWhy(); };

    // ---- full / differential / incremental ----
    let kind = 'full';
    const DEF = {
      full: 'A <b>full backup</b> creates a copy of <b>all files</b>.',
      diff: 'A <b>differential backup</b> creates a copy of all files that have changed <b>since the last full backup</b>.',
      inc: 'An <b>incremental backup</b> saves a copy of <b>only the files that have changed since the last full or incremental backup</b>.',
    };
    function draw() {
      FD.segSet($('#kind'), kind);
      let since = new Set(), tot = 0;
      $('#tl').innerHTML = DAYS.map((d, i) => {
        const ch = CHG[i];
        let copy;
        if (i === 0 || kind === 'full') copy = F;
        else if (kind === 'diff') { ch.forEach((f) => since.add(f)); copy = F.filter((f) => since.has(f)); }
        else copy = ch;
        if (i === 0) since = new Set();
        tot += copy.length;
        return `<tr><th>${d}${i === 0 ? ' <small>(full)</small>' : ''}</th><td>${i === 0 ? 'all' : ch.join(', ')}</td>${F.map((f) => `<td class="${copy.includes(f) ? 'cp' : ''}">${copy.includes(f) ? '💾' : ''}</td>`).join('')}<td><b>${copy.length}</b></td></tr>`;
      }).join('');
      $('#def').innerHTML = DEF[kind];
      $('#tot').textContent = `${tot} files`;
      $('#need').textContent = kind === 'full' ? 'Saturday’s backup only' : kind === 'diff' ? 'Sunday’s full + Saturday’s' : 'Sunday’s full + every day after';
    }
    const setKind = (k) => { kind = k; draw(); };
    $('#kind').addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) setKind(b.dataset.v); });

    // ---- good ideas ----
    const ideas = (list) => root.querySelectorAll('#ideas li').forEach((li) => li.classList.toggle('on', list.includes(li.dataset.k)));

    const show = FD.panels(root);
    show('why');
    resetWhy(); freq(); draw();
    return { show, hit, resetWhy, setOnline, slide, setKind, ideas, focus: (z) => FD.focus($('.bk-why'), z), destroy() { dead = true; } };
  },
  steps: [
    {
      title: 'Backups',
      text: `<p><strong>Backups</strong> create one or more <strong>copies of data</strong>. A backup is usually stored to an <strong>external storage device</strong>.</p>
             <p>This makes the data more secure, because the backup files will be safe even if the original storage device <strong>fails or is damaged, lost or stolen</strong>.</p>`,
      on: (a) => { a.show('why'); a.setOnline(false); a.focus('home'); a.hit('malware'); },
    },
    {
      title: 'Online storage',
      text: `<p>Backups can also be saved to <strong>online storage</strong>. This means that a copy of the data is held in <strong>two different geographical locations</strong>.</p>
             <p>Backing up to online storage can be <strong>slower</strong> because the process uses an internet connection.</p>`,
      tip: 'Try it: untick online backup and try each disaster.',
      async on(a, ctx) { a.show('why'); a.focus(); a.setOnline(false); a.hit('fire'); if (!(await ctx.sleep(2500))) return; a.setOnline(true); a.hit('fire'); },
    },
    {
      title: 'How many files, how often?',
      text: `<p>Users need to decide <strong>how many files</strong> to back up and <strong>how often</strong>.</p>
             <p>More regular backups will require <strong>more storage space</strong>. However, less frequent backups may result in a <strong>loss of data</strong> (for example, if that data has not been backed up recently).</p>`,
      async on(a, ctx) { a.show('why'); a.focus(); await a.slide(ctx); },
    },
    {
      title: 'What causes loss or damage?',
      text: `<p>Loss of files or damage to files can be caused by: <strong>theft</strong>, <strong>malware</strong>, <strong>flooding or fire</strong> and <strong>power cuts</strong>.</p>`,
      async on(a, ctx) { a.show('why'); a.focus(); a.setOnline(true); for (const k of ['theft', 'malware', 'fire', 'power']) { a.hit(k); if (!(await ctx.sleep(1700))) return; } },
    },
    {
      title: 'Full backup',
      text: `<p>There are three types of backup. A <strong>full backup</strong> creates a copy of <strong>all files</strong>.</p>`,
      tip: 'Try it: switch between the three types and compare the files copied.',
      on: (a) => { a.show('types'); a.setKind('full'); },
    },
    {
      title: 'Differential backup',
      text: `<p>A <strong>differential backup</strong> creates a copy of all files that have changed <strong>since the last full backup</strong>.</p>`,
      on: (a) => { a.show('types'); a.setKind('diff'); },
    },
    {
      title: 'Incremental backup',
      text: `<p>An <strong>incremental backup</strong> saves a copy of only the files that have changed <strong>since the last full or incremental backup</strong>.</p>
             <p>So incremental backups copy fewer files each day than differential backups, but you need every incremental backup to restore.</p>`,
      on: (a) => { a.show('types'); a.setKind('inc'); },
    },
    {
      title: 'Good backup procedures (1)',
      text: `<p>Good ideas for backup procedures are as follows:</p><ul><li>Set <strong>automatic</strong> backups.</li><li>Do not use <strong>optical media</strong> because they deteriorate over time and are fragile.</li><li>Schedule backups for <strong>late in the evening</strong>, when users will not be using the data, in order to avoid conflicts.</li></ul>`,
      on: (a) => { a.show('ideas'); a.ideas(['auto', 'optical', 'late']); },
    },
    {
      title: 'Good backup procedures (2)',
      text: `<ul><li>Create <strong>more than one copy</strong>.</li><li>Keep one copy of a folder containing important files backed up using <strong>online storage</strong>.</li><li>Store copies at <strong>multiple locations</strong>.</li><li>Store important data in a <strong>fireproof safe</strong>.</li></ul>`,
      on: (a) => { a.show('ideas'); a.ideas(['copies', 'online', 'places', 'safe']); },
    },
  ],
});

FD.activities({
  section: 'backup',
  items: [
    {
      id: 'datasecurity',
      title: 'Data security',
      task: '<p>Read through the list of ideas for creating a thorough backup procedure. Discuss how each idea will help to keep data secure.</p>',
      sim: ['backup', 'See the list of good ideas'],
      fields: ['Automatic backups', 'No optical media', 'Late in the evening', 'More than one copy', 'Online storage', 'Multiple locations', 'Fireproof safe'],
      lines: 1,
    },
    {
      id: 'raid',
      title: 'RAID backup storage',
      task: '<p>Research <b>RAID</b> backup storage. Why is <b>RAID 1</b> backup storage better for data security than <b>RAID 0</b> backup storage?</p>',
      fields: ['What RAID is', 'How RAID 0 stores data', 'How RAID 1 stores data', 'Why RAID 1 is better for data security'],
      lines: 2,
    },
  ],
});

FD.check({
  section: 'backup',
  items: [
    { type: 'mcq', q: 'Describe <b>one</b> way in which an incremental backup differs from a differential backup.', opts: ['Incremental copies only files changed since the last full or incremental backup; differential copies all files changed since the last full backup', 'Incremental copies every file; differential copies none', 'Incremental is stored online; differential on optical media', 'There is no difference'], why: 'Chapter question 5.' },
    { type: 'mcq', q: 'Explain <b>one</b> disadvantage of using online storage for backups rather than local storage.', opts: ['It can be slower because the process uses an internet connection', 'The copy is in a different geographical location', 'It cannot be stolen with the computer', 'It survives a fire at home'], why: 'Chapter question 9. The other options are advantages.' },
    { type: 'multi', q: 'Which <b>three</b> are good ideas for backup procedures?', need: 3, opts: [['Set automatic backups', true], ['Store copies at multiple locations', true], ['Store important data in a fireproof safe', true], ['Use optical media for every backup', false], ['Run backups while everyone is using the data', false]], why: 'Optical media deteriorate and are fragile; late-evening backups avoid conflicts.' },
    { type: 'tf', q: 'More regular backups require more storage space.', a: true, why: 'But less frequent backups may result in a loss of data.' },
  ],
});
