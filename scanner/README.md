# Scanner-App – Klickdummy

Interaktiver, eigenständiger Web-Prototyp nach den Projektquellen 00–12, Version 1.0 vom 24.11.2026. Arbeitstitel **Scanner-App**; Produktname und Kontaktangaben bleiben offen.

Überarbeitung vom 24.11.2026 nach Nutzerentscheidung: iOS-nahe Navigation und Einstellungen; illustrierte Scanner-Schaltfläche; Dokument im Mittelpunkt mit fester unterer Leiste **Speichern · Teilen · Verwerfen**. Die Ordnerauswahl erfolgt ausschließlich in den Einstellungen. Diese Entscheidung ersetzt für den Klickdummy die bisherige Ordnerauswahl beim Speichern aus F06.

Überarbeitung 3: Das Dateinamenfeld sitzt jetzt direkt über den drei unteren Aktionen. Die Suche öffnet sich über die Lupe in der Navigation. Startseite und Dokumentansicht enthalten nur die nötigen Elemente. Die Gestaltung orientiert sich an den aktuellen App-Oberflächen: Systemhintergrund und Navigation wie in Barborant/Mitgemischt; Haupt-, Neben- und Verwerfen-Aktion mit der Farbgebung und den 20-Punkt-Rundungen des Mitgemischt-Standards. Die Scanner-Illustration bleibt erhalten und ist blau abgestimmt.

Überarbeitung 4: Auf ausdrücklichen Nutzerwunsch enthält die Anwenderoberfläche keine Präsentations-, Test- oder Simulationshinweise mehr. Dies betrifft auch Browser-Titel, Fußzeile, Kamera, Hilfe, Einstellungen, Dialoge und Ansagen. Die technischen Grenzen dieser Dokumentation gelten weiterhin; es wurde kein echter Kamera-, OCR- oder PDF-Export ergänzt. Testoptionen werden nicht mehr als Produkteinstellungen angezeigt. Nach den Export-Dialogen erscheinen keine Behauptungen über tatsächlich geschriebene oder übertragene Dateien.

## Öffnen

GitHub Pages: https://4k5mm85mj2-ship-it.github.io/app-prototypen/scanner/

`index.html` funktioniert auch direkt im Browser. Es sind keine Installation, externen Bibliotheken, API-Schlüssel oder kostenpflichtigen Builds erforderlich. Die bestehenden Prototypen werden nicht verändert.

## Durchspielen

1. Einmalig in **Einstellungen → Speicherordner** einen Beispielordner konfigurieren. Danach **Neuer Scan** und **Dokument ausrichten** wählen. Die letztgenannte Schaltfläche löst im Web-Prototyp den bestehenden Aufnahmeadapter aus; sie ist kein Nachweis realer Kamerafunktion.
2. Standardmodus: Nach jeder Aufnahme **Weiter scannen** oder **Fertig** wählen. Alternativ in den Einstellungen **Automatisch weiterscannen** einschalten: Nach der Aufnahme **Nächste Seite auflegen** und die gute Ausrichtung simulieren. **Fertig** ist nach mindestens einer Seite verfügbar.
3. Ein bis mehrere Beispieldokumente lesen. Die Lupe öffnet die Suche; **Nächster Treffer** und **Vorheriger Treffer** setzen den Tastatur-/Screenreader-Fokus auf den Treffer. Erneutes Antippen der Lupe schließt und leert die Suche. Der Dateiname wird im festen unteren Bereich eingegeben. Die zweite Seite demonstriert unsichere OCR.
4. Am unteren Rand **Speichern**, **Teilen** oder **Verwerfen** wählen. **Speichern** verwendet den konfigurierten Beispielordner; **Fertig** beendet den Ablauf und öffnet den Start. Gleiche Namen werden nicht überschrieben. Ohne Ordner erscheint ein Hinweis, keine Ordnerauswahl. Über das Einstellungssymbol kann die Konfiguration geändert werden; **Zurück** erhält das aktuelle Dokument einschließlich Namen und Suchbegriff.
5. **Teilen** zeigt eine Simulation des Teilmenüs und kehrt zum erhaltenen Dokument zurück.
6. Die zweite Seite enthält weiterhin den fachlichen Hinweis auf unsichere Texterkennung. Nicht zur App gehörende Fehler-Testschalter und die Testschaltfläche zur Kameraberechtigung sind aus der Oberfläche entfernt.

## Grenzen und Daten

Kamera, Seitenwechsel, OCR, Dateien-Ordner, PDF-Schreiben und iOS-Teilmenü sind **Simulationen**. Es werden keine Kamera- oder Dateiberechtigungen angefordert und keine PDFs erstellt oder übertragen. Die HTML-Dialoge stellen die geplanten nativen iOS-Dialoge dar. Keine Zeitsteuerung löst Aufnahmen aus. Die Simulation blockiert weitere Aufnahmen, bis ein Seitenwechsel bestätigt oder „Weiter scannen“ gewählt wurde; echte kamerabasierte Dublettenerkennung ist damit nicht nachgewiesen.

Nur Einstellungen (zwei Schalter, beispielhafter Ordner) werden in `localStorage` gespeichert, sofern verfügbar. Die synthetischen Seiten und Dateinamen bleiben im Arbeitsspeicher und werden bei Abbruch/Abschluss verworfen. Die Liste simulierter Exporte enthält nur Namen und bleibt bis zum Neuladen im Arbeitsspeicher, um Kollisionen abzubilden. Keine externen Ressourcen, Trackingdienste oder Netzwerkaufrufe aus dem Anwendungscode. Der Hostinganbieter verarbeitet beim Seitenabruf Verbindungsdaten.

Semantisches HTML, beschriftete Bedienelemente, Suchtrefferfokus, native HTML-Dialoge, Hell-/Dunkelmodus und anpassungsfähiges Layout sind umgesetzt. Reale VoiceOver-Abnahme auf iPhone/iPad bleibt erforderlich. Dieser Prototyp ist kein Nachweis für Kameraqualität, native iOS-Zugänglichkeit, OCR-Qualität, PDF-Textebene, PDF/UA oder technische Machbarkeit der späteren App.
