FD.add({
  id: 'terms',
  title: 'Key terms',
  tab: 'Key terms',
  icon: 'terms',
  color: '--accent',
  page: true,
  mount(el) {
    const T = [
      ['access', 'Unauthorised access', 'Access to networks by users who are not permitted to access them.'],
      ['access', 'Botnet', 'A group of computers that have their resources used for harmful purposes, such as running and spreading malware.'],
      ['malware', 'Malware (malicious software)', 'Software that is created with the intention to do harm.'],
      ['malware', 'Ransomware', 'Malware that threatens to delete a user’s files, or restricts access, until money is paid, usually to an anonymous account.'],
      ['deletion', 'Accidental deletion', 'Deleting files or a whole drive by mistake: a key pressed by accident, formatting the wrong device or a power cut.'],
      ['phishing', 'Phishing', 'Sending emails or having a website intended to trick someone into giving away personal information, such as a bank account number or password.'],
      ['phishing', 'Spear phishing', 'Highly customised or personalised phishing messages targeted at a small number of particular users.'],
      ['phishing', 'Smishing', 'Phishing by SMS: the message opens a fake webpage in a mobile browser.'],
      ['phishing', 'Webform', 'A data entry form on a web page.'],
      ['pharming', 'Pharming', 'Creating fake versions of trusted websites to trick users into entering their login details.'],
      ['pharming', 'Internet traffic', 'Data transferred between computers connected to the internet.'],
      ['pharming', 'Domain name server', 'A computer connected to the internet that translates domain names, such as pearson.com, into IP addresses.'],
      ['firewall', 'Firewall', 'Controls the data travelling into and out of a network by comparing addresses and ports with a list of rules.'],
      ['firewall', 'Encryption', 'Using a key to scramble data into an unreadable form; intercepted data is useless without the key.'],
      ['passwords', 'Authenticate', 'Check that a user is who they say they are, e.g. with a password, PIN or biometrics.'],
      ['passwords', 'Masked', 'Hidden: password characters are shown as dots so anyone watching cannot see them.'],
      ['captcha', 'CAPTCHA', 'A computer program or system that can identify whether a user is a human or a computer. Completely Automated Public Turing Test To Tell Computers and Humans Apart.'],
      ['captcha', 'Bot', 'A computer program that can interact with systems or users (also called a web robot).'],
      ['captcha', 'reCAPTCHA', 'A CAPTCHA that uses text from scanned books or images; the answers help digitise books and annotate images.'],
      ['captcha', 'Security question', 'A question that only the real user should be able to answer.'],
      ['antimalware', 'Anti-malware', 'Software that prevents malware from accessing or operating on computers; it combines anti-virus, anti-adware and anti-spyware.'],
      ['antimalware', 'Real time', 'Processing data within milliseconds of it being input and making the output available almost immediately.'],
      ['antimalware', 'Virus', 'Malware that uses networks to spread to connected devices.'],
      ['antimalware', 'Virus definitions', 'Sequences of code that are found in computer viruses.'],
      ['antimalware', 'Quarantine', 'Isolate a suspected virus in a protected area of storage where it cannot harm other files.'],
      ['antimalware', 'Adware', 'Software that displays unwanted adverts.'],
      ['antimalware', 'Spyware', 'Software that monitors and records data and user input, e.g. a keylogger.'],
      ['antimalware', 'Permissions', 'Authorisation settings that provide the ability for a user or users to access files, folders or drives (read only, or read and write).'],
      ['secure', 'HTTPS', 'Hypertext Transfer Protocol Secure: a secure form of HTTP that authenticates payment servers and encrypts data using SSL or TLS.'],
      ['secure', 'Payment server', 'A computer that authorises financial transactions.'],
      ['secure', 'Legitimate website', 'A website that is operated legally.'],
      ['secure', 'Executable file', 'A computer file that can be run as a program, e.g. .exe.'],
      ['secure', 'Hover over', 'Use the mouse to position the cursor on an object without clicking on it.'],
      ['backup', 'Backup', 'One or more copies of data, usually stored on an external storage device or online storage.'],
      ['backup', 'Full / differential / incremental backup', 'Full: all files. Differential: files changed since the last full backup. Incremental: files changed since the last full or incremental backup.'],
      ['backup', 'Safe', 'A strong metal box or cupboard with special locks to contain money and valuable things.'],
      ['payments', 'Cashless society', 'A society in which people pay for goods and services using methods other than cash.'],
      ['payments', 'Payment processor', 'A computer that authorises financial transactions; third-party processors such as PayPal or Skrill use email accounts for identification.'],
      ['payments', 'Expiry date', 'The date after which something can no longer be used.'],
      ['payments', 'Card security code (CSC)', 'The three- or four-digit code on a bank card, also called CVC or CVV.'],
      ['payments', 'NFC / contactless', 'Near field communication lets a card pay by being waved over a reader, without a PIN, up to a maximum amount.'],
      ['payments', 'Reader', 'Electronic equipment that can read information that is stored or recorded somewhere, for example on a card.'],
      ['payments', 'Smartwatch', 'A watch that provides data connectivity and often uses sensors to provide feedback to the device about its environment.'],
    ];
    const colorOf = (id) => (FD.section(id) || { color: '--accent' }).color;
    el.innerHTML = `
      <h2>Key terms</h2>
      <div class="terms-tools"><input type="search" id="tq" placeholder="Search a term…" aria-label="Search terms">
        <span class="seg" id="tp"><button data-v="all">All</button><button data-v="A">Part A</button><button data-v="B">Part B</button></span>
        <span class="small muted" id="tn"></span></div>
      <div class="terms" id="terms">${T.map(([f, t, d]) => `
        <article class="term" data-part="${FD.section(f).part}" style="--c:var(${colorOf(f)})"><h3>${t}</h3><p>${d}</p><button class="link-btn" data-go="${f}">${FD.icon[f]} See it</button></article>`).join('')}</div>`;
    const cards = [...el.querySelectorAll('.term')];
    const q = el.querySelector('#tq'), n = el.querySelector('#tn');
    let part = 'all';
    const filter = () => {
      const s = q.value.trim().toLowerCase();
      let k = 0;
      cards.forEach((c) => { const show = (!s || c.textContent.toLowerCase().includes(s)) && (part === 'all' || c.dataset.part === part); c.hidden = !show; k += show; });
      n.textContent = `${k} of ${cards.length} terms`;
      FD.segSet(el.querySelector('#tp'), part);
    };
    q.addEventListener('input', filter);
    el.querySelector('#tp').addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) { part = b.dataset.v; filter(); } });
    filter();
    el.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => FD.goto(b.dataset.go)));
  },
});
