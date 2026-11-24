# Prüfung des Scanner-Klickdummys – Überarbeitung 3

Datum: 24.11.2026. Ausgangscommit: `df09081138d80e3fd9ceef38126d11dabc1bc062`. Geprüft wurde der überarbeitete statische Web-Prototyp in Chromium mit Desktop-Viewport. Alle Aussagen betreffen die Simulation.

Nutzerentscheidung: Dateiname direkt über den unteren Dokumentaktionen; überflüssige Oberflächenelemente entfernen; am Stil der vorhandenen nativen Apps orientieren. Als Gestaltungsreferenzen wurden Barborants HomeView/SettingsView und Mitgemischts AppActionButtonStyle/ContentView auf main gelesen. Die vorherige Entscheidung „Speicherordner ausschließlich in Einstellungen“ gilt weiter.

| Gezielte Prüfung | Ergebnis |
| --- | --- |
| Startseite | Sichtprüfung: reduzierte Navigation, Haupttext, illustrierte Scan-Schaltfläche; keine zusätzliche Werbe-/Erklärsektion |
| Automatischer Scan → Dokument | Bestanden |
| Unterer Bereich | Dateinamenfeld gehört zum festen unteren Bereich; sein unterer Rand liegt oberhalb der drei Aktionen |
| Aktionsreihenfolge | Genau „Speichern“, „Teilen“, „Verwerfen“ |
| Position | Unterer Rand entspricht dem Viewport; dokumentierter Messwert 936 CSS-Pixel |
| Suche zunächst ausgeblendet | Bestanden; Lupe meldet eingeklappten Zustand |
| Suche öffnen, Treffer anwählen, schließen | Bestanden; Fokus auf markiertem Treffer, danach Suche geleert und eingeklappt |
| Leerer Dateiname beim Speichern | Bestanden; Fehlermeldung und Fokus im unteren Namensfeld, Dokument bleibt erhalten |
| Platzreserve bei Fehlermeldung | Bestanden; Höhe des unteren Bereichs und CSS-Platzreserve werden gemeinsam auf etwa 189 CSS-Pixel angepasst |
| Dateiname bei Umschaltung der Suche/Einstellungen | „Teamtag.pdf.pdf“ bleibt erhalten; Export verwendet normalisiert „Teamtag.pdf“ |
| Teilen und Abbrechen des Teilmenüs | Bestanden; Rückkehr zum erhaltenen Dokument |
| Speichern | Direkte Simulation im bereits konfigurierten Ordner; keine weitere Ordnerwahl |
| JavaScript und Whitespace | `node --check scanner/app.js` und `git diff --check` erfolgreich |

Die Grundfunktionen einschließlich beider Scan-Modi, Texterkennungshinweisen, Kollisionen, Abbruch, Ordnerfehlern und Export wurden in den vorherigen Fassungen geprüft. Diese Überarbeitung wurde gezielt für den verschobenen Dateinamen, den unteren Bereich, die Suchumschaltung und die geänderte Gestaltung nachgetestet.

## Offene praktische Prüfungen

VoiceOver auf iPhone/iPad, mobile Safari-Ansicht, Bildschirmtastatur, Dynamic Type, Anzeigezoom, dunkle Darstellung und untere Safe Area bleiben auf echten Geräten zu prüfen. Mindestgrößen, Safe-Area-Abstände und Anpassungen an den sichtbaren Bereich bei geöffneter Bildschirmtastatur sind im Layout enthalten; daraus wird keine praktische Geräteabnahme abgeleitet.

Kameraausrichtung, echte Seitenwechsel-/Dublettenerkennung, OCR-Qualität, Ordnerberechtigungen, PDF-Erstellung, PDF-Textebene, PDF/UA und das native Teilmenü können mit diesem Klickdummy nicht validiert werden. Die Darstellung bleibt eine Web-Simulation.
