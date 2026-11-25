# Dokumaro – Klickdummy

Aktueller Web-Prototyp gemäß Projektquellen 01–13, Stand 25.11.2026, Quellenfassung 1.3 / Klickdummy 12. Öffentlich erreichbar unter https://4k5mm85mj2-ship-it.github.io/app-prototypen/scanner/ . Keine Installation, externen Bibliotheken oder kostenpflichtigen Builds erforderlich.

## Aktueller Ablauf

Start mit Dokumaro, „Einfach digital. Für alle.“, „Scannen. Lesen. Teilen.“ und eigenem Comic-Scanner. Heller bzw. sehr dunkler Schaltflächenhintergrund entsprechend Systemdarstellung. Kurze Deckelanimation vor der Kameraansicht; ohne Animation bei Reduce Motion. Das unveränderte abgenommene App-Icon aus Quelle 13 ist als Browser- und Homescreen-Icon eingebunden; die transparente Schaltflächenillustration bleibt ein eigenes Motiv.

Neuer Scan → Dokument ausrichten → nach Aufnahme Weiter scannen oder Fertig. Automatisch weiterscannen ist standardmäßig aus; vorhandene Einstellungen bleiben erhalten. Im automatischen Modus wird vor der nächsten Aufnahme ein Seitenwechsel bestätigt.

In der Dokumentansicht steht die Dateinamenszeile unmittelbar unter den Navigationsaktionen, vor dem OCR-Text und dauerhaft erreichbar. Die Überschrift der ersten Beispielseite liefert den kurzen Titelvorschlag. Bei unsicherem/fehlendem Titel wird ein neutraler Datum-/Uhrzeitname verwendet. Antippen öffnet die Bearbeitung mit fokussiertem und vollständig markiertem Text, Löschen, Fertig und Abbrechen. Änderungen werden erst mit Fertig bestätigt; Abbrechen erhält den Namen. Beide Wege erhalten den Dokumentinhalt und führen den Fokus zur Dateinamenszeile zurück, ohne den Text neu aufzubauen. Bekannte Exportendungen werden aus der Bearbeitung entfernt und beim Export genau einmal passend zum aktuellen Format ergänzt. Leere oder ungültige Namen werden verständlich abgewiesen.

Unten bleiben Speichern, Teilen und Verwerfen. Die Lupe öffnet die Suche. Speichern nutzt den konfigurierten Beispielordner; fehlt er, wird gemäß aktueller F06 eine Ordnerauswahl angeboten. Keine stille Überschreibung. „Speichern erfolgreich“ und Fertig schließen den Ablauf ab; beim Verwerfen erscheint keine Zusatzmeldung. Teilen verwendet den bestätigten Namen und kehrt zur Dokumentansicht zurück.

Einstellungen: Speicherort als natives HTML-select, kurze Schaltertexte, Hilfe und Kontakt, Unterstützen, Impressum und Datenschutz. Bestehende BRG-Kontaktdaten; keine erfundene Telefonnummer. Unterstützung zeigt die drei in Quelle 12 vorgesehenen Beispielbeträge 1,99 / 4,99 / 9,99 EUR. Auswahl führt zum Nichtverfügbarkeitszustand mit erneutem Laden und Schließen; keine Zahlungen, kein StoreKit und kein erfundener Kauferfolg. Die späteren nativen Preise kommen dynamisch von Apple.

## Technische Grenzen und Daten

Kamera, OCR, Seitenwechsel, Dateien-Ordner, PDF und iOS-Teilmenü bleiben Simulationen mit synthetischen Dokumenten. Es werden keine PDFs erzeugt und keine Kamera- oder Dateiberechtigungen angefordert. HTML-Dialoge zeigen den vorgesehenen Ablauf der späteren nativen iOS-App. Keine Aufnahme allein durch Zeitablauf. Es gibt keine externe OCR, KI, APIs oder Telemetrie.

Nur Einstellungen werden bei Verfügbarkeit in localStorage gespeichert. Dokumente und Namen bleiben im Arbeitsspeicher. Der Hostinganbieter verarbeitet technisch notwendige Verbindungsdaten. Reale VoiceOver-/Diktat-Abnahme auf iPhone/iPad sowie native Kamera-, OCR- und PDF-Prüfungen bleiben offen. Browserprüfungen ersetzen diese nicht.

## Gezielte Prüfung am 25.11.2026

Browsergeprüft: Überschrift als Vorschlag; Dateiname vor Dokumentinhalt in der Accessibility-Reihenfolge; direkter Textfeldfokus und vollständige Markierung; Abbrechen ohne Namensänderung; Löschen und Leernamenprüfung; mehrfach eingegebene PDF-Endungen normalisiert; bestätigter Name im Teilen-Dialog; Fokus zurück zur Namenszeile. JavaScript-Syntaxprüfung erfolgreich. Keine TestFlight- oder native VoiceOver-Abnahme behauptet.

## Ergänzungen aus Quellenfassung 1.3

- Vollflächige Kameraansicht mit überlagertem Abbrechen, Seitenzahl, jeweils einem priorisierten Hinweis und Fertig nach der ersten Seite. Ein kontrastreicher Rahmen verändert seine Lage zusammen mit dem synthetischen Papier. „Dokument ausrichten“ durchläuft deterministisch rechts → parallel → ruhig halten → Aufnahme. Kein Timer löst eine Aufnahme aus. Keine echte Bildanalyse oder Entzerrung: Die synthetische Vorschau zeigt nur das gewünschte Verhalten.
- Dateiformat als native HTML-Auswahl unmittelbar nach dem Namen: PDF (.pdf), Word (.docx), Rich Text (.rtf), Text (.txt). Formatwechsel verändert ausschließlich den Formatzustand, erhält DOM, Suchtreffer, Namen, Text und Leseposition. Standardformat separat lokal konfigurierbar, initial PDF; neuer Scan übernimmt es. Endungen und Namenskollisionen berücksichtigen das Format. Keine echte Dateierzeugung ergänzt.
- Anleitung als erster Informationseintrag, vollständig lokal mit kleinem SVG-Gerät-über-Papier-Diagramm und sieben kurzen Schritten.
- BRG-Webadresse https://www.brg-entwicklung.de/ im Impressum. Bestätigt über CNAME des Repositorys Webseite-produktiv; keine neue Domain geraten.
- Startseite: Claim, Produktname und Illustration dekorativ ausgeblendet, Skip-Link dort verborgen; nur Einstellungen und Neuer Scan als reguläre Fokusstopps. Start- und Rückkehrfokus Neuer Scan.

Zusätzlich browsergeprüft: Vollbild und drei Hinweisstufen, Aufnahme, Formatinitialisierung aus Standard, alle vier Dateiendungen im Teilen-Dialog, mehrfach gemischte Endungen beim Umbenennen, Standardformat unverändert bei Dokumentwechsel, Anleitung und Impressumslink, drei Unterstützungsoptionen sowie Nichtverfügbarkeit ohne Transaktion. Keine reale Kamera-, OCR-, Bildkorrektur-, Datei-, Kauf- oder VoiceOver-Abnahme. Diese bleiben Aufgaben der späteren nativen App und sind mit dem Klickdummy nicht nachgewiesen.
