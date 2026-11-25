# Dokumaro – Klickdummy

Aktueller Web-Prototyp gemäß Projektquellen 01–13, Stand 25.11.2026. Öffentlich erreichbar unter https://4k5mm85mj2-ship-it.github.io/app-prototypen/scanner/ . Keine Installation, externen Bibliotheken oder kostenpflichtigen Builds erforderlich.

## Aktueller Ablauf

Start mit Dokumaro, „Einfach digital. Für alle.“, „Scannen. Lesen. Teilen.“ und eigenem Comic-Scanner. Heller bzw. sehr dunkler Schaltflächenhintergrund entsprechend Systemdarstellung. Kurze Deckelanimation vor der Kameraansicht; ohne Animation bei Reduce Motion. Das unveränderte abgenommene App-Icon aus Quelle 13 ist als Browser- und Homescreen-Icon eingebunden; die transparente Schaltflächenillustration bleibt ein eigenes Motiv.

Neuer Scan → Dokument ausrichten → nach Aufnahme Weiter scannen oder Fertig. Automatisch weiterscannen ist standardmäßig aus; vorhandene Einstellungen bleiben erhalten. Im automatischen Modus wird vor der nächsten Aufnahme ein Seitenwechsel bestätigt.

In der Dokumentansicht steht die Dateinamenszeile unmittelbar unter den Navigationsaktionen, vor dem OCR-Text und dauerhaft erreichbar. Die Überschrift der ersten Beispielseite liefert den kurzen Titelvorschlag. Bei unsicherem/fehlendem Titel wird ein neutraler Datum-/Uhrzeitname verwendet. Antippen öffnet die Bearbeitung mit fokussiertem und vollständig markiertem Text, Löschen, Fertig und Abbrechen. Änderungen werden erst mit Fertig bestätigt; Abbrechen erhält den Namen. Beide Wege erhalten den Dokumentinhalt und führen den Fokus zur Dateinamenszeile zurück, ohne den Text neu aufzubauen. PDF-Endungen werden aus der Bearbeitung entfernt und beim Export genau einmal ergänzt. Leere oder ungültige Namen werden verständlich abgewiesen.

Unten bleiben Speichern, Teilen und Verwerfen. Die Lupe öffnet die Suche. Speichern nutzt den konfigurierten Beispielordner; fehlt er, wird gemäß aktueller F06 eine Ordnerauswahl angeboten. Keine stille Überschreibung. „Speichern erfolgreich“ und Fertig schließen den Ablauf ab; beim Verwerfen erscheint keine Zusatzmeldung. Teilen verwendet den bestätigten Namen und kehrt zur Dokumentansicht zurück.

Einstellungen: Speicherort als natives HTML-select, kurze Schaltertexte, Hilfe und Kontakt, Unterstützen, Impressum und Datenschutz. Bestehende BRG-Kontaktdaten; keine erfundene Telefonnummer. Die Unterstützungsbeträge sind als nicht verfügbar dargestellt; keine Zahlungen.

## Technische Grenzen und Daten

Kamera, OCR, Seitenwechsel, Dateien-Ordner, PDF und iOS-Teilmenü bleiben Simulationen mit synthetischen Dokumenten. Es werden keine PDFs erzeugt und keine Kamera- oder Dateiberechtigungen angefordert. HTML-Dialoge zeigen den vorgesehenen Ablauf der späteren nativen iOS-App. Keine Aufnahme allein durch Zeitablauf. Es gibt keine externe OCR, KI, APIs oder Telemetrie.

Nur Einstellungen werden bei Verfügbarkeit in localStorage gespeichert. Dokumente und Namen bleiben im Arbeitsspeicher. Der Hostinganbieter verarbeitet technisch notwendige Verbindungsdaten. Reale VoiceOver-/Diktat-Abnahme auf iPhone/iPad sowie native Kamera-, OCR- und PDF-Prüfungen bleiben offen. Browserprüfungen ersetzen diese nicht.

## Gezielte Prüfung am 25.11.2026

Browsergeprüft: Überschrift als Vorschlag; Dateiname vor Dokumentinhalt in der Accessibility-Reihenfolge; direkter Textfeldfokus und vollständige Markierung; Abbrechen ohne Namensänderung; Löschen und Leernamenprüfung; mehrfach eingegebene PDF-Endungen normalisiert; bestätigter Name im Teilen-Dialog; Fokus zurück zur Namenszeile. JavaScript-Syntaxprüfung erfolgreich. Keine TestFlight- oder native VoiceOver-Abnahme behauptet.
