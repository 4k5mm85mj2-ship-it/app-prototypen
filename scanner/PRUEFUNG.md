# Prüfung des Scanner-Klickdummys

Datum: 24.11.2026. Grundlage: Projektquellen 00–12, Version 1.0. Prüfung des statischen Web-Prototyps in Chromium, Desktop-Viewport etwa 1363 CSS-Pixel. Alle Aussagen betreffen die Simulation.

| Prüfung | Ergebnis |
| --- | --- |
| Start → Kamera, kein Fertig ohne Seite | Bestanden |
| Standardmodus: Aufnahme → Dialog → Weiter scannen → zweite Aufnahme → Fertig | Bestanden; zwei Seiten in Aufnahmefolge |
| Automatischer Modus: Aufnahme ohne Entscheidungsdialog, Fertig verfügbar | Bestanden |
| Automatischer Modus: weitere Aufnahme erst nach simuliertem Seitenwechsel | Bestanden; nach Aufnahme keine Aufnahmeschaltfläche verfügbar |
| Vollständiger synthetischer Text und Hinweis auf unsichere OCR | Bestanden |
| Suche „mittagessen“ über zwei Seiten | Bestanden; zwei Treffer |
| Weiterer Suchtreffer | Bestanden; Treffer 2 auf Seite 2 |
| Suchtrefferfokus | Bestanden; aktives Element ist der markierte Treffer, mit Trefferzahl und Seitenangabe |
| Leerer Dateiname beim Speichern | Bestanden; konkrete Meldung, Fokus im Namensfeld, beide Seiten erhalten |
| Mehrfache Endung „Teamtag.pdf.pdf“ | Bestanden; Übergabe verwendet „Teamtag.pdf“ |
| Teilen ohne vorherigen Speicherordner | Bestanden; simuliertes Teilmenü, danach Dokument und Name erhalten |
| Erstes Speichern ohne Ordner | Bestanden; beispielhafte Ordnerauswahl |
| Speicherfehler und erneuter Versuch | Bestanden; Seiten und Name erhalten, danach ausdrücklich simulierte erfolgreiche Speicherung möglich |
| Dateinamenskollision | Bestanden; keine Überschreiboption, nummerierter Name „Teamtag (2).pdf“ |
| Erfolgreiches Speichern | Bestanden; erst nach Abschluss der Simulation Rückkehr zum Start |
| Fehlende OCR auf Seite 1 | Bestanden; Hinweis statt erfundenem Text, Seite 2 bleibt lesbar |
| Verweigerte Kameraberechtigung | Bestanden; zugänglicher Hinweis, Rückkehrfokus auf auslösender Schaltfläche |
| Scan verwerfen | Bestanden; Rückkehr zum Start, keine Datei erzeugt |
| Tastatur-/Screenreader-Semantik der Dialoge | Überschrift fokussiert, Hintergrund während des modalen HTML-Dialogs nicht im Accessibility-Baum |
| JavaScript-Syntax und Git-Whitespace-Prüfung | `node --check scanner/app.js` und `git diff --check` erfolgreich |

Die Fokuswiederherstellung bei ersetzten Dialogen wurde abgesichert; nach der Korrektur wurde die Rückkehr aus dem Kameraberechtigungsdialog geprüft. Veraltete Ansagen werden beim Ansichtswechsel entfernt.

## Offene praktische Prüfungen

Reales VoiceOver auf iPhone/iPad, mobile Safari-Ansicht, Dynamic Type, Anzeigezoom und dunkle Darstellung sind nicht praktisch abgenommen. Die native Testfenster-/Zoomsteuerung dieser Umgebung war nicht verwendbar; daraus wird kein bestandener Vergrößerungstest abgeleitet. Das CSS enthält responsive Layouts, Hell-/Dunkelmodus, sichtbaren Fokus und Reduced-Motion-Unterstützung.

Kameraausrichtung, echte Seitenwechsel-/Dublettenerkennung, OCR-Qualität, Ordnerberechtigungen, PDF-Erstellung, PDF-Textebene, PDF/UA und das native Teilmenü können mit diesem Klickdummy nicht validiert werden. Hierfür bleibt die spätere technische Machbarkeitsprüfung und echte Geräteabnahme notwendig.
