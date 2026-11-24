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
      'Dieses Dokument ist ein vollständig erfundenes Beispiel für den Klickdummy.'
    ] }
  ];
  let settings = { auto: false, sound: true, folder: '' };
  try {
    const saved = JSON.parse(localStorage.getItem('scanner-prototype-settings') || '{}');
    settings.auto = saved.auto === true;
    settings.sound = saved.sound !== false;
    if (['Auf meinem iPhone / Scans', 'iCloud Drive / Scans'].includes(saved.folder)) settings.folder = saved.folder;
  } catch { /* Settings are optional; the prototype also works without localStorage. */ }
  const state = { view: 'home', pages: [], awaitingChange: false, filename: '', search: '', match: -1, saveError: false, ocrMissing: false, notice: '' };
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
    $('navigation').innerHTML = atHome
      ? `<div class="wordmark"><span class="app-icon">${icon('scan', 22)}</span>Scanner-App</div><button class="nav-button" data-action="settings">${icon('settings', 21)}Einstellungen</button>`
      : `<button class="nav-button" data-action="${state.view === 'settings' ? 'home' : 'abort'}">${state.view === 'settings' ? icon('back', 20) + 'Zurück' : 'Abbrechen'}</button><span class="nav-title">${state.view === 'settings' ? 'Einstellungen' : 'Neuer Scan'}</span>`;
    main.innerHTML = state.view === 'home' ? homeView() : state.view === 'settings' ? settingsView() : state.view === 'camera' ? cameraView() : documentView();
    if (focus) focusTitle();
  }
  function homeView() {
    return `<section class="home">
      <div class="hero-mark">${icon('scan', 47)}</div>
      <p class="eyebrow">Einfach digitalisieren</p>
      <h1 tabindex="-1">Dein Papier.<br>Einfach lesbar.</h1>
      <p class="intro">Dokument erfassen, Text lesen und als PDF speichern oder teilen.</p>
      ${state.notice ? `<p class="status-message" role="status">${esc(state.notice)}</p>` : ''}
      ${button('start', 'Neuer Scan', 'primary start-action', 'plus')}
      <p class="privacy-line">${icon('shield', 19)}<span>Für die App geplant: Verarbeitung auf deinem Gerät, ohne Konto.</span></p>
      <div class="home-help"><h2>Ein Schritt nach dem anderen.</h2><p>Die Kamera unterstützt beim Ausrichten. Danach kannst du den erkannten Text in Ruhe lesen und durchsuchen.</p></div>
    </section>`;
  }
  function cameraView() {
    const count = state.pages.length;
    const waiting = state.awaitingChange;
    return `<section class="camera-screen">
      <p class="eyebrow">Erfassen</p><h1 tabindex="-1">Dokument erfassen</h1>
      <div class="camera-count"><span>${settings.auto ? 'Automatisch weiterscannen' : 'Nach jeder Seite entscheiden'}</span><span class="count-pill">${count} ${count === 1 ? 'Seite' : 'Seiten'}</span></div>
      <div class="camera-preview" aria-hidden="true"><div class="camera-grid"></div><div class="demo-paper"><p>EINLADUNG<br>ZUM TEAMTAG</p><div class="paper-line"></div><div class="paper-line"></div><div class="paper-line short"></div><div class="paper-line"></div><div class="paper-line short"></div></div><span class="preview-label">Beispieldokument · keine Live-Kamera</span></div>
      <div class="guidance"><span class="guidance-icon">${icon(waiting ? 'check' : 'scan', 26)}</span><div><strong id="camera-guidance">${waiting ? `Seite ${count} erfasst.` : 'Das Dokument etwas nach rechts bewegen.'}</strong><p>${waiting ? 'Lege die nächste Seite auf. Dieselbe unveränderte Seite wird nicht erneut aufgenommen.' : 'Alle Ränder sollen im Bild sein. Bei guter Ausrichtung erfolgt die Aufnahme automatisch.'}</p></div></div>
      <div class="actions">${count ? button('finish', 'Fertig', 'primary', 'check') : ''}</div>
      <details class="demo-controls" open><summary>Klickdummy bedienen</summary>
        <p>Ohne Kamerazugriff: Über diese Schaltflächen spielst du Ausrichtung und Seitenwechsel durch.</p>
        ${waiting ? button('page-change', 'Nächste Seite auflegen', 'secondary', 'plus') : button('capture', 'Gute Ausrichtung simulieren', 'secondary', 'scan')}
        ${count && !settings.auto && waiting ? button('continue', 'Weiter scannen', 'secondary') : ''}
        ${button('permission', 'Verweigerte Kameraberechtigung testen', 'text-link')}
      </details>
    </section>`;
  }
  function settingsView() {
    return `<section class="settings-page"><p class="eyebrow">So, wie du es brauchst</p><h1 tabindex="-1">Einstellungen</h1>
      <h2 class="section-label">Speichern</h2><div class="group"><button class="setting-row row-button" data-action="folder"><span class="setting-copy"><strong>Speicherordner</strong><span class="value">${esc(settings.folder || 'Noch nicht ausgewählt')}</span></span><span class="chevron" aria-hidden="true">›</span></button></div>
      <h2 class="section-label">Beim Scannen</h2><div class="group">
        <div class="setting-row"><div class="setting-copy"><strong id="auto-label">Automatisch weiterscannen</strong><small id="auto-hint">Nach einem Seitenwechsel die nächste Seite erfassen. „Fertig“ bleibt erreichbar.</small></div><label class="toggle"><input type="checkbox" id="auto-setting" aria-labelledby="auto-label" aria-describedby="auto-hint" ${settings.auto ? 'checked' : ''}><span aria-hidden="true"></span></label></div>
        <div class="setting-row"><div class="setting-copy"><strong id="sound-label">Akustische Hinweise</strong><small id="sound-hint">Für die App geplant: Hinweise zum Ausrichten. VoiceOver bleibt davon unabhängig.</small></div><label class="toggle"><input type="checkbox" id="sound-setting" aria-labelledby="sound-label" aria-describedby="sound-hint" ${settings.sound ? 'checked' : ''}><span aria-hidden="true"></span></label></div>
      </div>
      <h2 class="section-label">Informationen</h2><div class="group">
        <button class="setting-row row-button" data-action="help"><span>Hilfe &amp; Kontakt</span><span class="chevron" aria-hidden="true">›</span></button>
        <button class="setting-row row-button" data-action="legal"><span>Impressum &amp; Datenschutz</span><span class="chevron" aria-hidden="true">›</span></button>
      </div><p class="compact-note">Der Klickdummy merkt sich nur diese Einstellungen in diesem Browser. Beispieldokumente bleiben bis zum Abschluss des Scans im Arbeitsspeicher.</p>
    </section>`;
  }
  function normalizedName(value) {
    const base = value.trim().replace(/(?:\.pdf)+$/gi, '').trim();
    if (!base) return { error: 'Bitte gib einen Dateinamen ein.' };
    if (/[<>:"/\\|?*\u0000-\u001f]/u.test(base) || /^[. ]+$/.test(base) || /[. ]$/.test(base)) return { error: 'Bitte verwende einen Namen ohne Sonderzeichen wie /, \\, : oder ? und ohne Punkt am Ende.' };
    if (base.length > 120) return { error: 'Bitte kürze den Dateinamen auf höchstens 120 Zeichen.' };
    return { name: base + '.pdf', base };
  }
  function documentView() {
    const normalized = normalizedName(state.filename);
    return `<section class="document-screen"><p class="eyebrow">Lesen &amp; exportieren</p>
      <div class="heading-row"><h1 tabindex="-1">Dein Dokument</h1><span class="muted">${state.pages.length} ${state.pages.length === 1 ? 'Seite' : 'Seiten'}</span></div>
      <label class="field" for="filename">Dateiname</label><input class="text-input" id="filename" type="text" autocomplete="off" spellcheck="false" value="${esc(state.filename)}" aria-describedby="filename-hint filename-error">
      <p class="filename-preview" id="filename-hint">${normalized.name ? 'PDF: ' + esc(normalized.name) : 'Die Endung .pdf wird automatisch ergänzt.'}</p><p id="filename-error" class="error-message" role="alert"></p>
      <div class="two-columns actions">${button('save', 'Speichern', 'primary', 'folder')}${button('share', 'Teilen', 'secondary', 'share')}</div>
      <p class="field-hint">${settings.folder ? 'Speicherordner: ' + esc(settings.folder) : 'Beim Speichern wählst du einen Ordner aus.'}</p><p id="export-error" class="error-message" role="alert"></p>
      <div class="card"><label class="field" for="search">Dokument durchsuchen</label><div class="search-box">${icon('search', 20)}<input class="text-input" type="search" id="search" placeholder="Suchbegriff" value="${esc(state.search)}" autocomplete="off" aria-describedby="search-status"></div>
      <div class="search-nav"><span id="search-status" role="status" aria-atomic="true">Suchbegriff eingeben</span><button class="secondary" id="previous-match" data-action="previous-match" disabled>Vorheriger Treffer</button><button class="secondary" id="next-match" data-action="next-match" disabled>Nächster Treffer</button></div></div>
      <div class="document-pages" id="document-pages">${pageMarkup()}</div>
      <div class="document-bottom">${button('abort', 'Scan verwerfen', 'danger-button')}</div>
      <details class="demo-controls"><summary>Weitere Zustände testen</summary><p>Diese Optionen gehören nur zum Klickdummy.</p>
        <label class="setting-row"><span>Speicherfehler simulieren</span><input id="save-error-setting" type="checkbox" ${state.saveError ? 'checked' : ''}></label>
        <label class="setting-row"><span>Fehlende Texterkennung auf Seite 1</span><input id="ocr-missing-setting" type="checkbox" ${state.ocrMissing ? 'checked' : ''}></label>
        ${button('collision', 'Vorhandenen Dateinamen testen', 'secondary')}
      </details>
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
  function start() {
    state.pages = [];
    state.awaitingChange = false;
    state.search = '';
    state.filename = '';
    state.notice = '';
    state.saveError = false;
    state.ocrMissing = false;
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
  function chooseFolder(saveAfter = false) {
    openDialog('Speicherordner auswählen', '<p>In der App öffnet sich hier die Ordnerauswahl von Apple Dateien. Wähle für den Klickdummy ein Beispiel.</p><p class="compact-note">Ein iCloud-Ordner kann durch den Dateianbieter synchronisiert werden.</p>',
      button(saveAfter ? 'folder-local-save' : 'folder-local', 'Auf meinem iPhone / Scans', 'secondary', 'folder') + button(saveAfter ? 'folder-cloud-save' : 'folder-cloud', 'iCloud Drive / Scans', 'secondary', 'folder') + button('close-dialog', 'Abbrechen', 'text-link'));
  }
  function save() {
    const name = filenameForExport();
    if (!name) return;
    if (!settings.folder) { chooseFolder(true); return; }
    if (state.saveError) {
      $('export-error').textContent = 'Der Ordner ist gerade nicht erreichbar. Dein Scan bleibt erhalten. Versuche es erneut oder wähle einen anderen Ordner.';
      openDialog('Speichern fehlgeschlagen', '<p>Simulierter Fehler: Der Speicherordner ist nicht erreichbar. Alle Seiten und dein Dateiname bleiben erhalten.</p>', button('retry-save', 'Erneut versuchen') + button('folder-for-save', 'Anderen Ordner wählen', 'secondary') + button('close-dialog', 'Zurück zum Dokument', 'text-link'));
      return;
    }
    const key = settings.folder + '/' + name.toLocaleLowerCase('de-DE');
    if (exportedNames.has(key)) {
      openDialog('Datei bereits vorhanden', `<p>„${esc(name)}“ liegt bereits im gewählten Beispielordner. Bitte wähle einen anderen Namen.</p>`, button('rename', 'Dateiname ändern') + button('unique-name', 'Mit ergänzter Nummer speichern', 'secondary'));
      return;
    }
    openDialog('Speichern simulieren', `<div class="file-chip">${icon('document', 30)}<div><strong>${esc(name)}</strong><small>${state.pages.length} ${state.pages.length === 1 ? 'Seite' : 'Seiten'} · ${esc(settings.folder)}</small></div></div><p class="compact-note" style="margin-top:16px">Im Klickdummy wird keine Datei erstellt. Die nächste Schaltfläche simuliert einen erfolgreich abgeschlossenen Schreibvorgang.</p>`, button('save-complete', 'Erfolgreiches Speichern simulieren') + button('close-dialog', 'Zurück zum Dokument', 'secondary'));
  }
  function share() {
    const name = filenameForExport();
    if (!name) return;
    openDialog('Teilen simulieren', `<div class="file-chip">${icon('document', 30)}<div><strong>${esc(name)}</strong><small>PDF · ${state.pages.length} ${state.pages.length === 1 ? 'Seite' : 'Seiten'}</small></div></div><p class="compact-note" style="margin-top:16px">In der App erscheint das iOS-Teilmenü. Es ist keine vorherige Speicherung nötig. Hier wird keine Datei übertragen.</p>`, button('share-complete', 'Übergabe simulieren', 'primary', 'share') + button('close-dialog', 'Abbrechen', 'secondary'));
  }
  function abort() {
    openDialog('Scan verwerfen?', `<p>${state.pages.length ? 'Die erfassten Seiten und der erkannte Text werden verworfen.' : 'Der Scan wird beendet.'} Es wird keine Datei erstellt.</p>`, button('confirm-abort', 'Scan verwerfen', 'danger-button') + button('close-dialog', 'Scan fortsetzen', 'secondary'));
  }
  function selectFolder(cloud, saveAfter) {
    settings.folder = cloud ? 'iCloud Drive / Scans' : 'Auf meinem iPhone / Scans';
    persistSettings();
    closeDialog(false);
    render();
    if (state.view === 'document') updateSearch();
    if (saveAfter) save();
  }
  const actions = {
    start, capture, finish, save, share, abort,
    settings() { state.view = 'settings'; render(); },
    home() { state.view = 'home'; render(); },
    'page-change'() { if (!state.awaitingChange) return; state.awaitingChange = false; render(); announce('Neue Seite bereit. Das Dokument etwas nach rechts bewegen.'); },
    continue() { closeDialog(false); state.awaitingChange = false; render(); },
    'close-dialog'() { closeDialog(); },
    'confirm-abort'() { closeDialog(false); state.pages = []; state.filename = ''; state.search = ''; state.notice = 'Scan verworfen. Es wurde keine Datei erstellt.'; state.view = 'home'; render(); },
    folder() { chooseFolder(false); },
    'folder-for-save'() { chooseFolder(true); },
    'folder-local'() { selectFolder(false, false); },
    'folder-cloud'() { selectFolder(true, false); },
    'folder-local-save'() { selectFolder(false, true); },
    'folder-cloud-save'() { selectFolder(true, true); },
    'retry-save'() { state.saveError = false; closeDialog(false); render(); updateSearch(); save(); },
    'save-complete'() {
      const name = normalizedName(state.filename).name;
      exportedNames.add(settings.folder + '/' + name.toLocaleLowerCase('de-DE'));
      closeDialog(false);
      state.notice = `Speichern simuliert: ${name}. Es wurde keine Datei erstellt.`;
      state.pages = []; state.filename = ''; state.search = ''; state.view = 'home'; render();
    },
    'share-complete'() { closeDialog(); announce('Übergabe simuliert. Es wurde keine Datei übertragen. Dein Dokument bleibt geöffnet.'); },
    rename() { closeDialog(false); $('filename').focus(); $('filename').select(); },
    'unique-name'() {
      const original = normalizedName(state.filename).base;
      let number = 2;
      while (exportedNames.has(settings.folder + '/' + `${original} (${number}).pdf`.toLocaleLowerCase('de-DE'))) number++;
      state.filename = `${original} (${number})`;
      closeDialog(false); render(); updateSearch(); save();
    },
    collision() {
      if (!settings.folder) { settings.folder = 'Auf meinem iPhone / Scans'; persistSettings(); }
      const name = normalizedName(state.filename).name;
      if (!name) { filenameForExport(); return; }
      exportedNames.add(settings.folder + '/' + name.toLocaleLowerCase('de-DE'));
      save();
    },
    'next-match'() { moveMatch(1); },
    'previous-match'() { moveMatch(-1); },
    permission() { openDialog('Kamerazugriff nicht erlaubt', '<p>In der App erlaubst du den Kamerazugriff in den iOS-Einstellungen. Ohne diese Erlaubnis kann kein Dokument erfasst werden.</p><p class="compact-note">Dieser Klickdummy greift nicht auf die Kamera zu. Ein Wechsel in die Geräteeinstellungen wird hier nur simuliert.</p>', button('permission-allow', 'Erlaubnis in Einstellungen simulieren') + button('close-dialog', 'Zurück zum Scan', 'secondary')); },
    'permission-allow'() { closeDialog(); announce('Kameraerlaubnis simuliert. Du kannst den Scan fortsetzen.'); },
    help() { openDialog('Hilfe & Kontakt', '<ol><li>Wähle „Neuer Scan“.</li><li>Simuliere die gute Ausrichtung des Dokuments.</li><li>Erfasse weitere Seiten oder wähle „Fertig“.</li><li>Lies und durchsuche den Text. Benenne dein Dokument und teste „Speichern“ oder „Teilen“.</li></ol><p>In den Einstellungen kannst du beide Scan-Modi ausprobieren. Der Produktname und die Kontaktdaten sind noch offen.</p><p class="compact-note">Die tatsächliche Kameraunterstützung und die Bedienung der iOS-App mit VoiceOver müssen später auf echten Geräten geprüft werden.</p>', button('close-dialog', 'Schließen')); },
    legal() { openDialog('Impressum & Datenschutz', '<h3>Konzeptstand</h3><p>Der endgültige Produktname sowie die rechtlichen Kontaktangaben sind noch nicht festgelegt.</p><h3>Dieser Klickdummy</h3><p>Er verwendet ausschließlich erfundene Beispieldokumente. Es gibt keine Kameraaufnahme, keine OCR, keinen Dateiexport und keine Analyse- oder Trackingdienste. Nur Einstellungen werden im Browser gespeichert. Beim Abruf der Website verarbeitet der Hostinganbieter technisch notwendige Verbindungsdaten.</p><h3>Für die App geplant</h3><p>Dokumente werden lokal verarbeitet. Eine Übertragung erfolgt nur beim ausdrücklich gewählten Export. Gewählte iCloud- oder andere Dateianbieter können Dateien synchronisieren.</p>', button('close-dialog', 'Schließen')); }
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
    if (id === 'auto-setting') { settings.auto = checked; persistSettings(); }
    if (id === 'sound-setting') { settings.sound = checked; persistSettings(); }
    if (id === 'save-error-setting') state.saveError = checked;
    if (id === 'ocr-missing-setting') { state.ocrMissing = checked; updateSearch(); announce(checked ? 'Auf Seite 1 wurde kein Text erkannt. Ein Hinweis ist in der Dokumentansicht verfügbar.' : 'Beispieltext auf Seite 1 wiederhergestellt.'); }
  });
  render(false);
})();
