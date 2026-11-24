# Scanner-App – Klickdummy

Interaktiver, eigenständiger Web-Prototyp nach den Projektquellen 00–12, Version 1.0 vom 24.11.2026. Arbeitstitel **Scanner-App**; Produktname und Kontaktangaben bleiben offen.

## Öffnen

GitHub Pages: https://4k5mm85mj2-ship-it.github.io/app-prototypen/scanner/

`index.html` funktioniert auch direkt im Browser. Es sind keine Installation, externen Bibliotheken, API-Schlüssel oder kostenpflichtigen Builds erforderlich. Die bestehenden Prototypen werden nicht verändert.

## Durchspielen

1. **Neuer Scan** wählen. Im Bereich **Klickdummy bedienen** die gute Ausrichtung simulieren. Die übrige Kameraansicht bildet die geplante App ab.
2. Standardmodus: Nach jeder Aufnahme **Weiter scannen** oder **Fertig** wählen. Alternativ in den Einstellungen **Automatisch weiterscannen** einschalten: Nach der Aufnahme **Nächste Seite auflegen** und die gute Ausrichtung simulieren. **Fertig** ist nach mindestens einer Seite verfügbar.
3. Ein bis mehrere Beispieldokumente lesen, durchsuchen und benennen. **Nächster Treffer** und **Vorheriger Treffer** setzen den Tastatur-/Screenreader-Fokus auf den Treffer. Die zweite Seite demonstriert unsichere OCR.
4. **Speichern** öffnet bei Bedarf eine beispielhafte Ordnerauswahl; anschließend den erfolgreichen Schreibvorgang ausdrücklich simulieren. Erst danach erscheint wieder der Start. Gleiche Namen werden nicht überschrieben.
5. **Teilen** zeigt eine Simulation des Teilmenüs und kehrt zum erhaltenen Dokument zurück.
6. Unter **Weitere Zustände testen** Speicherfehler, Dateinamenskollision und fehlenden OCR-Text prüfen. Verweigerte Kameraberechtigung lässt sich in der Kameraansicht demonstrieren.

## Grenzen und Daten

Kamera, Seitenwechsel, OCR, Dateien-Ordner, PDF-Schreiben und iOS-Teilmenü sind **Simulationen**. Es werden keine Kamera- oder Dateiberechtigungen angefordert und keine PDFs erstellt oder übertragen. Die HTML-Dialoge stellen die geplanten nativen iOS-Dialoge dar. Keine Zeitsteuerung löst Aufnahmen aus. Die Simulation blockiert weitere Aufnahmen, bis ein Seitenwechsel bestätigt oder „Weiter scannen“ gewählt wurde; echte kamerabasierte Dublettenerkennung ist damit nicht nachgewiesen.

Nur Einstellungen (zwei Schalter, beispielhafter Ordner) werden in `localStorage` gespeichert, sofern verfügbar. Die synthetischen Seiten und Dateinamen bleiben im Arbeitsspeicher und werden bei Abbruch/Abschluss verworfen. Die Liste simulierter Exporte enthält nur Namen und bleibt bis zum Neuladen im Arbeitsspeicher, um Kollisionen abzubilden. Keine externen Ressourcen, Trackingdienste oder Netzwerkaufrufe aus dem Anwendungscode. Der Hostinganbieter verarbeitet beim Seitenabruf Verbindungsdaten.

Semantisches HTML, beschriftete Bedienelemente, Suchtrefferfokus, native HTML-Dialoge, Hell-/Dunkelmodus und anpassungsfähiges Layout sind umgesetzt. Reale VoiceOver-Abnahme auf iPhone/iPad bleibt erforderlich. Dieser Prototyp ist kein Nachweis für Kameraqualität, native iOS-Zugänglichkeit, OCR-Qualität, PDF-Textebene, PDF/UA oder technische Machbarkeit der späteren App.
