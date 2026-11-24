/* Static interaction prototype. No camera, OCR, file access or network requests. */
'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const main = $('main');
  const dialog = $('dialog');
  const icons = {
    scan: '<rect x="6" y="5" width="12" height="14" rx="2"/><path d="M3 8V3h5m8 0h5v5M3 16v5h5m8 0h5v-5M9 10h6m-6 4h4"/>',
    settings: '<path d="m9 3-1 3-3 1 1 3-2 2 2 2-1 3 3 1 1 3h6l1-3 3-1-1-3 2-2-2-2 1-3-3-1-1-3z"/><circle cx="12" cy="12" r="3"/>',
    back: '<path d="m14 5-7 7 7 7"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z"/><path d="m8 12 3 3 5-6"/>',
    search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>',
    check: '<path d="m4 12 5 5L20 6"/>',
    document: '<path d="M14 3H5v18h14V8zM14 3v5h5M8 12h8m-8 4h6"/>',
    share: '<path d="M7 10H4v11h16V10h-3M12 15V3m-5 5 5-5 5 5"/>',
    folder: '<path d="M3 6h7l2 3h9v11H3z"/>',
    save: '<path d="M12 3v11m-4-4 4 4 4-4M4 14v7h16v-7"/>',
    trash: '<path d="M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7"/>',
    plus: '<path d="M12 5v14M5 12h14"/>'
  };
  const icon = (name, size = 24) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${icons[name] || icons.document}</svg>`;
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const samples = [
    { title: 'Einladung zum Teamtag', paragraphs: [
      'Liebe Kolleginnen und Kollegen,\nwir laden euch herzlich zu unserem gemeinsamen Teamtag ein.',
      'Termin: Freitag, 4. Dezember 2026\nZeit: 10:00 bis 15:00 Uhr\nOrt: Besprechungsraum im Erdgeschoss',
      'Wir starten mit einem gemeinsamen Frühstück. Anschließend sammeln wir Ideen für das kommende Jahr. Nach dem Mittagessen bleibt Zeit für Gespräche und einen kurzen Spaziergang.',
      'Bitte gebt bis zum 30. November Bescheid, ob ihr dabei seid. Wir freuen uns auf euch!'
    ] },
    { title: 'Ablauf und Vorbereitung', uncertain: true, paragraphs: [
      '10:00 Uhr – Ankommen und Frühstück\n11:00 Uhr – Ideen für das kommende Jahr\n12:30 Uhr – Gemeinsames Mittagessen\n13:30 Uhr – Austausch und Spaziergang\n15:00 Uhr – Abschluss',
      'Bitte bringt eine Idee mit, die unseren Arbeitsalltag einfacher macht. Alle Vorschläge sind willkommen.',
      'Treffpunkt für den Spaziergang: Ausgang zum Innenhof. Bei Regen bleiben wir im Besprechungsraum.'
    ] },
    { title: 'Hinweise zum Teamtag', paragraphs: [
      'Der Besprechungsraum ist stufenlos erreichbar. Für Fragen zur Teilnahme könnt ihr euch an die Organisation wenden.',
      'Für das Mittagessen gibt es eine vegetarische Auswahl. Bitte nennt besondere Wünsche zusammen mit eurer Rückmeldung.',
      'Wir freuen uns auf einen gemeinsamen Tag mit guten Gesprächen und neuen Ideen.'
    ] }
  ];
  let settings = { auto: false, sound: true, folder: '' };
  try {
    const saved = JSON.parse(localStorage.getItem('scanner-prototype-settings') || '{}');
    settings.auto = saved.auto === true;
    settings.sound = saved.sound !== false;
    if (['Auf meinem iPhone / Scans', 'iCloud Drive / Scans'].includes(saved.folder)) settings.folder = saved.folder;
  } catch { /* Settings are optional; the prototype also works without localStorage. */ }
  const state = { view: 'home', settingsReturn: 'home', pages: [], awaitingChange: false, filename: '', search: '', searchOpen: false, match: -1, saveError: false, ocrMissing: false, forceCollision: false, notice: '' };
  const exportedNames = new Set();
  let returnFocus = null;
  function persistSettings() {
    try { localStorage.setItem('scanner-prototype-settings', JSON.stringify(settings)); } catch { /* Use in-memory settings. */ }
  }
  function announce(text) { $('announcer').textContent = text; }
  function button(action, label, style = 'primary', symbol = '') {
    return `<button type="button" class="${style}" data-action="${action}">${symbol ? icon(symbol, 21) : ''}${label}</button>`;
  }
  function focusTitle() { main.querySelector('h1')?.focus(); }
  function render(focus = true) {
    announce('');
    const atHome = state.view === 'home';
    const isDocument = state.view === 'document';
    const isInfo = ['help','support','imprint','privacy'].includes(state.view);
    document.body.classList.toggle('home-active', atHome);
    document.body.classList.toggle('document-active', isDocument);
    $('navigation').innerHTML = atHome
      ? `<span class="navigation-spacer" aria-hidden="true"></span><span class="nav-title">Dokumaro</span><button class="nav-button icon-button" aria-label="Einstellungen" data-action="settings">${icon('settings', 23)}</button>`
      : isInfo ? `<button class="nav-button" data-action="back-info">${icon('back',20)}Einstellungen</button>`
      : isDocument
        ? `<span class="navigation-spacer" aria-hidden="true"></span><span class="nav-title">Dokument</span><div class="nav-actions"><button class="nav-button icon-button" aria-label="Dokument durchsuchen" aria-expanded="${state.searchOpen}" aria-controls="search-panel" data-action="toggle-search">${icon('search', 22)}</button><button class="nav-button icon-button" aria-label="Einstellungen" data-action="settings">${icon('settings', 23)}</button></div>`
        : `<button class="nav-button" data-action="${state.view === 'settings' ? 'back-settings' : 'abort'}">${state.view === 'settings' ? icon('back', 20) + 'Zurück' : 'Abbrechen'}</button><span class="nav-title">${state.view === 'settings' ? '' : 'Neuer Scan'}</span>`;
    main.innerHTML = state.view === 'home' ? homeView() : state.view === 'settings' ? settingsView() : state.view === 'camera' ? cameraView() : isInfo ? informationView() : documentView();
    $('document-actions').innerHTML = isDocument ? documentDock() : '';
    dockObserver.disconnect();
    if (isDocument) dockObserver.observe(main.ownerDocument.querySelector('.document-dock'));
    updateDockHeight();
    if (focus) focusTitle();
  }
  function homeView() {
    return `<section class="home">
      <h1 tabindex="-1">Einfach digital.<br>Für alle.</h1>
      <p class="intro">Scannen. Lesen. Teilen.</p>
      ${state.notice ? `<p class="status-message" role="status">${esc(state.notice)}</p>` : ''}
      <button type="button" class="scan-start-button" data-action="start"><span class="scanner-art" aria-hidden="true"><img class="scanner-base" src="scanner-comic.webp" width="640" height="480" alt=""><img class="scanner-lid" src="scanner-comic.webp" width="640" height="480" alt=""></span><span>Neuer Scan</span></button>
    </section>`;
  }
  function cameraView() {
    const count = state.pages.length;
    const waiting = state.awaitingChange;
    return `<section class="camera-screen">
      <h1 tabindex="-1">Dokument erfassen</h1>
      <div class="camera-count"><span>${settings.auto ? 'Automatisch weiterscannen' : 'Nach jeder Seite entscheiden'}</span><span class="count-pill">${count} ${count === 1 ? 'Seite' : 'Seiten'}</span></div>
      <div class="camera-preview" aria-hidden="true"><div class="camera-grid"></div><div class="demo-paper"><p>EINLADUNG<br>ZUM TEAMTAG</p><div class="paper-line"></div><div class="paper-line"></div><div class="paper-line short"></div><div class="paper-line"></div><div class="paper-line short"></div></div></div>
      <div class="guidance"><span class="guidance-icon">${icon(waiting ? 'check' : 'scan', 26)}</span><div><strong id="camera-guidance">${waiting ? `Seite ${count} erfasst.` : 'Das Dokument etwas nach rechts bewegen.'}</strong><p>${waiting ? 'Lege die nächste Seite auf. Dieselbe unveränderte Seite wird nicht erneut aufgenommen.' : 'Alle Ränder sollen im Bild sein. Bei guter Ausrichtung erfolgt die Aufnahme automatisch.'}</p></div></div>
      <div class="actions">${count ? button('finish', 'Fertig', 'primary', 'check') : ''}</div>
      <div class="actions">
        ${waiting ? button('page-change', 'Nächste Seite auflegen', 'secondary', 'plus') : button('capture', 'Dokument ausrichten', 'secondary', 'scan')}
        ${count && !settings.auto && waiting ? button('continue', 'Weiter scannen', 'secondary') : ''}
      </div>
    </section>`;
  }
  function settingsView() {
    return `<section class="settings-page"><h1 tabindex="-1">Einstellungen</h1>
      <h2 class="section-label">Speichern</h2><div class="group"><div class="setting-row folder-picker"><label for="folder-setting">Speicherort</label><select id="folder-setting"><option value="" disabled ${!settings.folder ? 'selected' : ''}>Auswählen</option>${['Auf meinem iPhone / Scans','iCloud Drive / Scans'].map(folder => `<option value="${folder}" ${settings.folder === folder ? 'selected' : ''}>${folder}</option>`).join('')}</select></div></div>
      <h2 class="section-label">Beim Scannen</h2><div class="group">
        <div class="setting-row"><div class="setting-copy"><strong id="auto-label">Automatisch weiterscannen</strong><small id="auto-hint">Die nächste Seite wird ohne Nachfrage gescannt.</small></div><label class="toggle"><input type="checkbox" id="auto-setting" aria-labelledby="auto-label" aria-describedby="auto-hint" ${settings.auto ? 'checked' : ''}><span aria-hidden="true"></span></label></div>
        <div class="setting-row"><div class="setting-copy"><strong id="sound-label">Akustische Hinweise</strong><small id="sound-hint">Die App sagt dir, wie du das Dokument halten sollst.</small></div><label class="toggle"><input type="checkbox" id="sound-setting" aria-labelledby="sound-label" aria-describedby="sound-hint" ${settings.sound ? 'checked' : ''}><span aria-hidden="true"></span></label></div>
      </div>
      <h2 class="section-label">Informationen</h2><div class="group">
        <button class="setting-row row-button" data-action="help"><span>Hilfe und Kontakt</span><span class="chevron" aria-hidden="true">›</span></button>
        <button class="setting-row row-button" data-action="support"><span>Dokumaro unterstützen</span><span class="chevron" aria-hidden="true">›</span></button>
        <button class="setting-row row-button" data-action="imprint"><span>Impressum</span><span class="chevron" aria-hidden="true">›</span></button>
        <button class="setting-row row-button" data-action="privacy"><span>Datenschutz</span><span class="chevron" aria-hidden="true">›</span></button>
      </div>
    </section>`;
  }
  function mailLink(label, subject) {
    const href = 'mailto:brg.entwicklung@gmail.com?subject=' + encodeURIComponent('Dokumaro – ' + subject);
    return `<a class="setting-row row-button mail-link" href="${esc(href)}"><span>${label}</span><span class="chevron" aria-hidden="true">›</span></a>`;
  }
  function informationView() {
    const titles = {help:'Hilfe und Kontakt',support:'Dokumaro unterstützen',imprint:'Impressum',privacy:'Datenschutz'};
    let content = '';
    if (state.view === 'help') content = `<div class="group information-copy"><h2>Schön, dass du Dokumaro nutzt!</h2><p>Ich entwickle Apps aus Überzeugung: Sie sollen den Alltag einfacher machen, Freude bereiten und für alle Menschen gut bedienbar sein – unabhängig davon, ob sie mit oder ohne Einschränkungen genutzt werden.</p><p>Dabei gilt für mich: Weniger ist mehr. Klare Funktionen, durchdachtes Design und echte Barrierefreiheit stehen im Mittelpunkt.</p><p>Hast du eine Idee, einen Verbesserungsvorschlag oder funktioniert etwas nicht wie erwartet? Dann schreib mir gerne. Deine Rückmeldung hilft mir, Dokumaro weiterzuentwickeln.</p></div><div class="group">${mailLink('Problem melden','Problem melden')}${mailLink('Idee oder Feedback senden','Idee oder Feedback')}<button class="setting-row row-button" data-action="copy-address">Supportadresse kopieren</button></div><p id="contact-status" role="status"></p>`;
    if (state.view === 'support') content = `<div class="group information-copy"><p>Dokumaro soll für alle zugänglich bleiben. Wenn dir die App gefällt, kannst du ihre Weiterentwicklung freiwillig unterstützen.</p></div><h2 class="section-label">Wähle einen Betrag</h2><div class="group information-copy"><p id="support-status" role="status">Die Unterstützungsbeträge sind gerade nicht verfügbar. Bitte versuche es später erneut.</p>${button('retry-support','Erneut versuchen','secondary')}</div><p class="compact-note">Freiwillig · Einmalig</p>`;
    if (state.view === 'imprint') content = `<h2 class="section-label">Anbieter</h2><div class="group information-copy address-block"><strong>Bruno Geßner</strong><div>c/o POSTFLEX PFX-425-383<br>Emsdettener Straße 10<br>48268 Greven</div></div><h2 class="section-label contact-heading">Kontakt</h2><div class="group information-copy"><p>E-Mail: brg.entwicklung@gmail.com</p>${mailLink('E-Mail schreiben','Kontakt')}</div>`;
    if (state.view === 'privacy') content = `<div class="group information-copy"><p>Einstellungen werden lokal auf deinem Gerät gespeichert. Dokumentinhalte bleiben bis zum Abschluss im Arbeitsspeicher.</p><p>Es werden keine Analyse- oder Trackingdienste eingebunden. Beim Aufruf verarbeitet der Hostinganbieter technisch notwendige Verbindungsdaten.</p></div>`;
    return `<section class="settings-page"><h1 tabindex="-1">${titles[state.view]}</h1>${content}</section>`;
  }
  function normalizedName(value) {
    const base = value.trim().replace(/(?:\.pdf)+$/gi, '').trim();
    if (!base) return { error: 'Bitte gib einen Dateinamen ein.' };
    if (/[<>:"/\\|?*\u0000-\u001f]/u.test(base) || /^[. ]+$/.test(base) || /[. ]$/.test(base)) return { error: 'Bitte verwende einen Namen ohne Sonderzeichen wie /, \\, : oder ? und ohne Punkt am Ende.' };
    if (base.length > 120) return { error: 'Bitte kürze den Dateinamen auf höchstens 120 Zeichen.' };
    return { name: base + '.pdf', base };
  }
  function documentView() {
    return `<section class="document-screen"><h1 class="sr-only" tabindex="-1">Dein Dokument, ${state.pages.length} ${state.pages.length === 1 ? 'Seite' : 'Seiten'}</h1>
      <div class="document-search" id="search-panel" ${state.searchOpen ? '' : 'hidden'}><label class="sr-only" for="search">Dokument durchsuchen</label><div class="search-box">${icon('search', 20)}<input class="text-input" type="search" id="search" placeholder="Dokument durchsuchen" value="${esc(state.search)}" autocomplete="off" aria-describedby="search-status"></div>
      <div class="search-nav"><span id="search-status" role="status" aria-atomic="true">Suchbegriff eingeben</span><button class="secondary" id="previous-match" data-action="previous-match" disabled>Vorheriger Treffer</button><button class="secondary" id="next-match" data-action="next-match" disabled>Nächster Treffer</button></div></div>
      <div class="document-pages" id="document-pages">${pageMarkup()}</div>
    </section>`;
  }
  function documentDock() {
    const normalized = normalizedName(state.filename);
    return `<section class="document-dock" aria-label="Dateiname und Dokumentaktionen">
      <div class="document-name"><label for="filename">Dateiname</label><input class="text-input" id="filename" type="text" autocomplete="off" spellcheck="false" value="${esc(state.filename)}" aria-describedby="filename-hint filename-error"></div>
      <p class="sr-only" id="filename-hint">${normalized.name ? 'PDF: ' + esc(normalized.name) : 'Die Endung .pdf wird automatisch ergänzt.'}</p>
      <p id="filename-error" class="error-message" role="alert"></p><p id="export-error" class="error-message" role="alert"></p>
      <div class="document-toolbar" role="group" aria-label="Dokumentaktionen">${button('save', 'Speichern', 'toolbar-action primary', 'save')}${button('share', 'Teilen', 'toolbar-action secondary', 'share')}${button('abort', 'Verwerfen', 'toolbar-action destructive', 'trash')}</div>
    </section>`;
  }
  function pageMarkup() {
    return state.pages.map((page, index) => `<article class="document-page" aria-labelledby="page-title-${index}"><span class="page-number">Seite ${index + 1} von ${state.pages.length}</span>
      ${state.ocrMissing && index === 0 ? `<h2 id="page-title-${index}">Kein Text erkannt</h2><p class="warning">Auf dieser Seite wurde kein Text erkannt. Zum erneuten Erfassen kannst du den Scan abbrechen und neu starten.</p>` : `<h2 class="searchable" id="page-title-${index}">${esc(page.title)}</h2>${page.paragraphs.map(p => `<p class="searchable">${esc(p)}</p>`).join('')}${page.uncertain ? '<p class="warning">Texterkennung unsicher: Die Uhrzeit 12:30 Uhr konnte nicht sicher gelesen werden. Bitte prüfe sie am Original.</p>' : ''}`}
    </article>`).join('');
  }
  function updateSearch() {
    const term = state.search.trim();
    $('document-pages').innerHTML = pageMarkup();
    if (term) {
      main.querySelectorAll('.searchable').forEach(node => {
        const source = node.textContent;
        const lower = source.toLocaleLowerCase('de-DE');
        const needle = term.toLocaleLowerCase('de-DE');
        let pos = 0, found;
        const fragment = document.createDocumentFragment();
        while ((found = lower.indexOf(needle, pos)) !== -1) {
          fragment.append(source.slice(pos, found));
          const mark = document.createElement('mark');
          mark.textContent = source.slice(found, found + term.length);
          mark.tabIndex = -1;
          fragment.append(mark);
          pos = found + term.length;
        }
        fragment.append(source.slice(pos));
        node.replaceChildren(fragment);
      });
    }
    const count = main.querySelectorAll('mark').length;
    state.match = -1;
    $('search-status').textContent = term ? `${count} Treffer` : 'Suchbegriff eingeben';
    main.querySelector('.search-nav').hidden = !term;
    $('next-match').disabled = $('previous-match').disabled = !count;
  }
  function moveMatch(direction) {
    const matches = [...main.querySelectorAll('mark')];
    if (!matches.length) return;
    state.match = state.match < 0 ? (direction > 0 ? 0 : matches.length - 1) : (state.match + direction + matches.length) % matches.length;
    matches.forEach((m, i) => m.classList.toggle('current', i === state.match));
    const target = matches[state.match];
    const page = [...main.querySelectorAll('.document-page')].indexOf(target.closest('.document-page')) + 1;
    target.setAttribute('aria-label', `Treffer ${state.match + 1} von ${matches.length}, Seite ${page}: ${target.textContent}`);
    target.focus();
    target.scrollIntoView({ block: 'center', behavior: 'instant' });
    $('search-status').textContent = `Treffer ${state.match + 1} von ${matches.length} · Seite ${page}`;
  }
  function openDialog(title, content, actions) {
    if (!dialog.contains(document.activeElement)) returnFocus = document.activeElement;
    $('dialog-content').innerHTML = `<h2 id="dialog-title" tabindex="-1">${title}</h2>${content}<div class="actions">${actions}</div>`;
    if (!dialog.open) dialog.showModal();
    $('dialog-title').focus();
  }
  function closeDialog(restore = true) {
    dialog.close();
    if (restore) {
      if (returnFocus?.isConnected) returnFocus.focus();
      else focusTitle();
    }
  }
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeDialog(); });
  async function start() {
    const trigger = main.querySelector('.scan-start-button');
    if (!trigger || trigger.disabled) return;
    trigger.disabled = true;
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const lid = trigger.querySelector('.scanner-lid');
      const motion = lid.animate([
        { transform: 'translate(0, 0) matrix(1, 0, 0, 1, 0, 0)' },
        { transform: 'translate(6.375%, 90.664%) matrix(.983817, -.172620, -.157457, -.679545, 0, 0)' }
      ], { duration: 520, easing: 'ease-in-out', fill: 'forwards' });
      await motion.finished.catch(() => {});
      if (state.view !== 'home' || !trigger.isConnected) return;
    }
    state.pages = [];
    state.awaitingChange = false;
    state.search = '';
    state.searchOpen = false;
    state.filename = '';
    state.notice = '';
    state.saveError = false;
    state.ocrMissing = false;
    state.forceCollision = false;
    state.view = 'camera';
    render();
  }
  function capture() {
    if (state.view !== 'camera' || state.awaitingChange || dialog.open) return;
    state.pages.push(samples[state.pages.length % samples.length]);
    state.awaitingChange = true;
    render(false);
    if (settings.auto) {
      main.querySelector('[data-action="page-change"]').focus();
      announce(`Seite ${state.pages.length} erfasst. Lege die nächste Seite auf oder wähle Fertig.`);
    } else {
      openDialog(`Seite ${state.pages.length} erfasst`, '<p>Möchtest du eine weitere Seite scannen oder das Dokument lesen?</p>', button('continue', 'Weiter scannen') + button('finish', 'Fertig', 'secondary'));
    }
  }
  function finish() {
    if (!state.pages.length) return;
    closeDialog(false);
    state.view = 'document';
    const date = new Intl.DateTimeFormat('sv-SE', {timeZone:'Europe/Berlin', year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit'}).format(new Date()).replace(' ', '_').replace(':', '-');
    state.filename ||= `Scan_${date}`;
    render();
    updateSearch();
  }
  function filenameForExport() {
    const result = normalizedName(state.filename);
    $('filename-error').textContent = result.error || '';
    $('filename').setAttribute('aria-invalid', result.error ? 'true' : 'false');
    if (result.error) { $('filename').focus(); return null; }
    return result.name;
  }
  function chooseFolder() {
    if (state.view !== 'settings') return;
    openDialog('Speicherordner auswählen', '<p class="compact-note">Ein iCloud-Ordner kann durch den Dateianbieter synchronisiert werden.</p>',
      button('folder-local', 'Auf meinem iPhone / Scans', 'secondary', 'folder') + button('folder-cloud', 'iCloud Drive / Scans', 'secondary', 'folder') + button('close-dialog', 'Abbrechen', 'text-link'));
  }
  function save() {
    const name = filenameForExport();
    if (!name) return;
    if (!settings.folder) {
      $('export-error').textContent = 'Bitte lege in den Einstellungen einen Speicherordner fest. Dein Dokument bleibt erhalten.';
      return;
    }
    if (state.saveError) {
      $('export-error').textContent = 'Der Ordner ist gerade nicht erreichbar. Dein Scan bleibt erhalten. Versuche es erneut. Den Speicherordner kannst du in den Einstellungen ändern.';
      openDialog('Speichern fehlgeschlagen', '<p>Der Speicherordner ist nicht erreichbar. Alle Seiten und dein Dateiname bleiben erhalten. Den Ordner kannst du in den Einstellungen ändern.</p>', button('retry-save', 'Erneut versuchen') + button('close-dialog', 'Zurück zum Dokument', 'secondary'));
      return;
    }
    const key = settings.folder + '/' + name.toLocaleLowerCase('de-DE');
    if (state.forceCollision) { exportedNames.add(key); state.forceCollision = false; }
    if (exportedNames.has(key)) {
      openDialog('Datei bereits vorhanden', `<p>„${esc(name)}“ ist bereits vergeben. Bitte wähle einen anderen Namen.</p>`, button('rename', 'Dateiname ändern') + button('unique-name', 'Mit ergänzter Nummer speichern', 'secondary'));
      return;
    }
    openDialog('Speichern erfolgreich', '', button('save-complete', 'Fertig'));
  }
  function share() {
    const name = filenameForExport();
    if (!name) return;
    openDialog('Teilen', `<div class="file-chip">${icon('document', 30)}<div><strong>${esc(name)}</strong><small>PDF · ${state.pages.length} ${state.pages.length === 1 ? 'Seite' : 'Seiten'}</small></div></div>`, button('share-complete', 'Fertig', 'primary', 'share') + button('close-dialog', 'Abbrechen', 'secondary'));
  }
  function abort() {
    openDialog('Scan verwerfen?', `<p>${state.pages.length ? 'Die erfassten Seiten und der erkannte Text werden verworfen.' : 'Der Scan wird beendet.'}</p>`, button('confirm-abort', 'Scan verwerfen', 'danger-button') + button('close-dialog', 'Scan fortsetzen', 'secondary'));
  }
  function selectFolder(cloud) {
    if (state.view !== 'settings') return;
    settings.folder = cloud ? 'iCloud Drive / Scans' : 'Auf meinem iPhone / Scans';
    persistSettings();
    closeDialog(false);
    render();
  }
  const actions = {
    start, capture, finish, save, share, abort,
    settings() { state.settingsReturn = state.view; state.view = 'settings'; render(); },
    'back-settings'() { state.view = state.settingsReturn; render(); if (state.view === 'document') updateSearch(); },
    home() { state.view = 'home'; render(); },
    'page-change'() { if (!state.awaitingChange) return; state.awaitingChange = false; render(); announce('Neue Seite bereit. Das Dokument etwas nach rechts bewegen.'); },
    continue() { closeDialog(false); state.awaitingChange = false; render(); },
    'close-dialog'() { closeDialog(); },
    'confirm-abort'() { closeDialog(false); state.pages = []; state.filename = ''; state.search = ''; state.notice = ''; state.view = 'home'; render(); },
    folder() { chooseFolder(); },
    'folder-local'() { selectFolder(false); },
    'folder-cloud'() { selectFolder(true); },
    'retry-save'() { state.saveError = false; closeDialog(false); render(); updateSearch(); save(); },
    'save-complete'() {
      const name = normalizedName(state.filename).name;
      exportedNames.add(settings.folder + '/' + name.toLocaleLowerCase('de-DE'));
      closeDialog(false);
      state.notice = '';
      state.pages = []; state.filename = ''; state.search = ''; state.view = 'home'; render();
    },
    'share-complete'() { closeDialog(); announce('Dokumentansicht.'); },
    rename() { closeDialog(false); $('filename').focus(); $('filename').select(); },
    'unique-name'() {
      const original = normalizedName(state.filename).base;
      let number = 2;
      while (exportedNames.has(settings.folder + '/' + `${original} (${number}).pdf`.toLocaleLowerCase('de-DE'))) number++;
      state.filename = `${original} (${number})`;
      closeDialog(false); render(); updateSearch(); save();
    },
    'next-match'() { moveMatch(1); },
    'previous-match'() { moveMatch(-1); },
    'toggle-search'() {
      state.searchOpen = !state.searchOpen;
      if (!state.searchOpen) state.search = '';
      render(false); updateSearch();
      if (state.searchOpen) $('search').focus();
      else $('navigation').querySelector('[data-action="toggle-search"]').focus();
    },
    permission() { openDialog('Kamerazugriff nicht erlaubt', '<p>Erlaube den Kamerazugriff in den iOS-Einstellungen, um Dokumente zu erfassen.</p>', button('close-dialog', 'Zurück zum Scan')); },
    help() { state.view = 'help'; render(); },
    support() { state.view = 'support'; render(); },
    imprint() { state.view = 'imprint'; render(); },
    privacy() { state.view = 'privacy'; render(); },
    'back-info'() { state.view = 'settings'; render(); },
    async 'copy-address'() {
      try { await navigator.clipboard.writeText('brg.entwicklung@gmail.com'); $('contact-status').textContent = 'Supportadresse kopiert.'; }
      catch { $('contact-status').textContent = 'Supportadresse: brg.entwicklung@gmail.com'; }
    },
    'retry-support'() { $('support-status').textContent = 'Die Unterstützungsbeträge sind gerade nicht verfügbar. Bitte versuche es später erneut.'; }

  };
  document.addEventListener('click', event => {
    const target = event.target.closest('[data-action]');
    if (!target || target.disabled) return;
    actions[target.dataset.action]?.();
  });
  document.addEventListener('input', event => {
    if (event.target.id === 'filename') {
      state.filename = event.target.value;
      const result = normalizedName(state.filename);
      $('filename-hint').textContent = result.name ? 'PDF: ' + result.name : 'Die Endung .pdf wird automatisch ergänzt.';
      $('filename-error').textContent = '';
      event.target.removeAttribute('aria-invalid');
    }
    if (event.target.id === 'search') { state.search = event.target.value; updateSearch(); }
  });
  document.addEventListener('change', event => {
    const {id, checked} = event.target;
    if (id === 'folder-setting') { settings.folder = event.target.value; persistSettings(); }
    if (id === 'auto-setting') { settings.auto = checked; persistSettings(); }
    if (id === 'sound-setting') { settings.sound = checked; persistSettings(); }
    if (id === 'save-error-setting') state.saveError = checked;
    if (id === 'collision-setting') state.forceCollision = checked;
    if (id === 'ocr-missing-setting') { state.ocrMissing = checked; announce(checked ? 'Auf Seite 1 wurde kein Text erkannt. Ein Hinweis ist in der Dokumentansicht verfügbar.' : 'Text auf Seite 1 wiederhergestellt.'); }
  });
  function updateKeyboardInset() {
    const viewport = window.visualViewport;
    const editing = document.activeElement?.matches('input[type="text"], input[type="search"]');
    const inset = viewport && editing ? Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop) : 0;
    document.documentElement.style.setProperty('--keyboard-inset', `${inset}px`);
  }
  window.visualViewport?.addEventListener('resize', updateKeyboardInset);
  window.visualViewport?.addEventListener('scroll', updateKeyboardInset);
  document.addEventListener('focusin', updateKeyboardInset);
  document.addEventListener('focusout', () => requestAnimationFrame(updateKeyboardInset));
  function updateDockHeight() {
    const height = document.querySelector('.document-dock')?.getBoundingClientRect().height || 0;
    document.documentElement.style.setProperty('--document-dock-height', `${height}px`);
  }
  const dockObserver = new ResizeObserver(updateDockHeight);
  render(false);
})();
