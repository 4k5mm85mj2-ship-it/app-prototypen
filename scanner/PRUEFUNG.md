# Prüfung des Scanner-Klickdummys – Überarbeitung 2

Datum: 24.11.2026. Ausgangscommit: `342a9157472ee12d4ff7665ad875aee7cd558a8d`. Geprüft wurde der überarbeitete statische Web-Prototyp in Chromium mit Desktop-Viewport. Alle Aussagen betreffen die Simulation.

Neue Nutzerentscheidung: iOS-nahe Oberfläche, illustrierte Scanner-Schaltfläche, drei feste Dokumentaktionen am unteren Rand, Speicherordner ausschließlich in den Einstellungen. Diese Entscheidung ersetzt die frühere Ordnerauswahl beim Speichern aus F06.

| Gezielte Prüfung | Ergebnis |
| --- | --- |
| Startseite mit Scanner-Illustration | Sichtprüfung bestanden; Illustration im beschrifteten Button „Neuer Scan“, keine redundante Bildansage |
| Automatischer Scan → Dokument | Bestanden |
| Untere Aktionsleiste | Genau „Speichern“, „Teilen“, „Verwerfen“; CSS-Position `fixed`, unterer Rand entspricht dem Viewport |
| Dokument im Mittelpunkt | Kompakter Dateiname und Suche; keine zusätzlichen Exportaktionen oder Testoptionen im Dokumentbereich |
| Ordnerauswahl | Nur in Einstellungen verfügbar; keine Ordnerauswahl-Schaltfläche in der Dokumentansicht |
| Einstellungen während eines laufenden Scans | Name „Mein Testdokument“, Suchbegriff „Teamtag“ und eine Seite bleiben bei Rückkehr erhalten |
| Speicherordner auf iCloud Drive / Scans ändern | Bestanden; anschließend direkt Speichersimulation im konfigurierten Ordner, keine weitere Auswahl |
| Suchtreffer | Suche und Fokus auf markiertem Treffer funktionieren weiterhin |
| Teilen und Abbrechen des Teilmenüs | Dokument bleibt erhalten; Fokus kehrt zu „Teilen“ zurück |
| Speicherfehler | Zugänglicher Fehlerdialog mit erneutem Versuch; keine Ordnerauswahl im Fehlerdialog |
| JavaScript und Whitespace | `node --check scanner/app.js` und `git diff --check` erfolgreich |

Die Grundfunktionen einschließlich beider Scan-Modi, Texterkennungshinweisen, Namensprüfung, Kollisionen, Abbruch und simuliertem Export wurden in der Erstfassung geprüft. Diese Überarbeitung wurde gezielt für die geänderten Oberflächen und den Einstellungs-/Speicherablauf nachgetestet.

## Offene praktische Prüfungen

VoiceOver auf iPhone/iPad, mobile Safari-Ansicht, Bildschirmtastatur, Dynamic Type, Anzeigezoom, dunkle Darstellung und untere Safe Area bleiben auf echten Geräten zu prüfen. Das Layout enthält Mindestgrößen, einen Safe-Area-Abstand und eine Anpassung der Aktionsleiste an den sichtbaren Bereich bei geöffneter Bildschirmtastatur. Daraus wird keine praktische Geräteabnahme abgeleitet.

Kameraausrichtung, echte Seitenwechsel-/Dublettenerkennung, OCR-Qualität, Ordnerberechtigungen, PDF-Erstellung, PDF-Textebene, PDF/UA und das native Teilmenü können mit diesem Klickdummy nicht validiert werden. Die iOS-nahe Darstellung ist weiterhin eine Web-Simulation.
