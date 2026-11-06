QR KASSA - KONINKLIJKE FANFARE NUT EN VERMAAK MALDEGEM
VERSIE 1.0.0 | 06-11-2026
===============================================

Inhoud:
  docs/                  De volledige webapp inclusief offline ondersteuning
  01_SETUP_GITHUB.bat     EENMALIGE publicatie vanaf Windows 11
  02_UPDATE_PUBLICEREN.bat  Latere, versiegecontroleerde updates
  CHANGELOG.txt          Alle versiewijzigingen

VERIFIËER VOOR EEN ECHTE BETALING
  Naam: KONINKLIJKE FANFARE NUT EN VERMAAK
  IBAN: BE34 7373 0730 0790
  Standaardomschrijving: Barontvangst

1. PUBLICEREN (EENMALIG)
-------------------------
- Je hebt een GRATIS GitHub-account nodig: https://github.com/signup
- Git voor Windows moet geïnstalleerd zijn. Dat is reeds gebeurd.
- Pak dit ZIP-bestand volledig uit in een vaste map op je Windows-pc.
- Dubbelklik op 01_SETUP_GITHUB.bat.
- De browser opent de pagina https://github.com/new.
- Maak een PUBLIC repository 'fanfare-qr-kassa' (of een andere naam).
- Laat de opties 'Add README', '.gitignore', en 'license' UIT: repo leeg.
- Vul in het batchvenster je GitHub-gebruikersnaam en repositorynaam in.
- Druk op een toets. Bij vraag tot aanmelden kies je GitHub-aanmelding.
- Na succesvolle upload opent GitHub Pages onder Settings > Pages:
  Source: Deploy from a branch
  Branch: main
  Folder: /docs
  Klik Save. Wacht op de GitHub Pages publicatie.
- Je webadres is: https://JOUW-GEBRUIKERSNAAM.github.io/fanfare-qr-kassa/
  Gebruik je een andere repositorynaam, pas de URL aan.
- Bewaar de uitgepakte map op de pc voor toekomstige updates.

2. INSTALLEREN OP IPHONE
-------------------------
- Open je gepubliceerde HTTPS-link in SAFARI.
- Tik Deel (vierkant met pijl) > Zet op beginscherm > Voeg toe.
- Open het nieuwe beginschermicoon terwijl je nog internet hebt.
- De app slaat alle benodigde bestanden lokaal op.
- Zet internet uit en controleer of de QR-code nog wordt gegenereerd.

3. INSTALLEREN OP ANDROID
--------------------------
- Open de HTTPS-link in CHROME.
- Kies drie puntjes > App installeren / Toevoegen aan startscherm.
- Open het nieuwe icoon eenmaal terwijl internet beschikbaar is.
- Controleer offline werking met vliegtuigmodus.

4. BETALING TONEN
------------------
- Tik een bedrag en optioneel een andere omschrijving in.
- Tik 'Toon betaal-QR-code'.
- Klant scant met een COMPATIBELE BANKAPP op een TWEEDE toestel.
- Het bedrag en de omschrijving worden als SEPA-overschrijving ingevuld.
- Controleer in de bankapp altijd bedrag en begunstigde voor autorisatie.
- De app kent GEEN betaalbevestiging. Na scannen blijft de QR staan.
- Controleer in de bankrekening of het geld werkelijk ontvangen is.
- Tik op 'Nieuwe betaling' om de volgende QR-code te maken.

5. UPDATE PUBLICEREN
---------------------
- Wijzig de bestanden in docs/. Bewaar altijd het originele project.
- Geef iedere gewijzigde versie een NIEUW nummer in deze 5 plaatsen:
    docs/version.txt
    docs/sw.js     (CACHE = fanfare-qr-kassa-vNIEUW_NUMMER)
    docs/js/app.js (VERSION en commentaar)
    docs/index.html (beide zichtbare versienummers)
    CHANGELOG.txt (nieuwe versie met uitleg)
- Dubbelklik op 02_UPDATE_PUBLICEREN.bat; dit weigert dezelfde versie.
- Op de smartphone: zorg voor internet en open de app opnieuw; bij
  serviceworker-updates is soms nogmaals openen nodig.
- Bewaar vorige versies als ZIP-archief voordat je aanpassingen doet.

TECHNISCHE EN VEILIGHEIDSNOTA
-----------------------------
- De QR wordt volledig op het toestel gemaakt (geen externe betaalserver).
- EPC/SEPA-QR is NIET hetzelfde als Payconiq, Bancontact Pay of Wero QR.
- De bankapp van de betaler moet EPC-QR ondersteunen.
- Er zijn geen serverkosten voor de QR-generatie; GitHub Pages is gratis
  binnen de voorwaarden van de gekozen GitHub-formule.
- Offline QR-opbouw werkt na succesvol opslaan van de appbestanden.
  Voor de uiteindelijke bankoverschrijving is doorgaans internet nodig.
- Volgnummers en toestelcode zitten alleen lokaal op de betreffende telefoon.
  Verwijderen van browserdata of herinstallatie kan volgnummers resetten.
- Browserdata worden niet online opgeslagen. Er is geen betaalhistoriek
  of controle op bankontvangsten.
- GitHub Pages is een OPENBARE website; plaats er geen geheime gegevens.
- Bovenstaande EPC-QR is bedoeld voor een eenvoudige overschrijving en
  niet als een door banken gegarandeerd bevestigde kassabetaling.

BIBLIOTHEEK:
- Vendored QRCode by Kazuhiko Arase (MIT), via qrcode-terminal.
- Licentie en oorspronkelijke copyrights staan in docs/LICENSE_QR.txt.
