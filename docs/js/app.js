/* QR-Kassa Nut en Vermaak | versie 1.0.0 | enkel lokaal werkende SEPA QR generatie */
(function () {
  'use strict';
  const VERSION = '1.0.0';
  const PAYEE = 'KONINKLIJKE FANFARE NUT EN VERMAAK';
  const IBAN = 'BE34737307300790';
  const DEFAULT_DESCRIPTION = 'Barontvangst';
  const LAST_KEY = 'fanfare-qr-last-sequence-v1';
  const DEVICE_KEY = 'fanfare-qr-device-id-v1';
  const $ = id => document.getElementById(id);
  const amountInput = $('amount');
  const descriptionInput = $('description');
  const formError = $('formError');
  const resultCard = $('resultCard');
  const inputCard = $('inputCard');

  // EPC-QR versie 002, karakterset 1 = UTF-8. BIC is optioneel.
  // Velden: service, versie, tekenset, SCT, BIC, naam, IBAN, bedrag,
  // purpose, gestructureerde mededeling, ongestructureerde mededeling.
  function epcPayload(amount, reference) {
    return [
      'BCD', '002', '1', 'SCT', '', PAYEE, IBAN,
      'EUR' + amount.toFixed(2), '', '', reference
    ].join('\n');
  }

  function cleanAmount(raw) {
    let s = raw.trim().replace(/\s/g, '').replace(/^€/, '');
    if (!/^(?:\d{1,5})(?:[.,]\d{1,2})?$/.test(s)) return null;
    const cents = Math.round(Number(s.replace(',', '.')) * 100);
    // Bedrag begrensd op 999,99 EUR voor gebruik aan de bar.
    if (!Number.isSafeInteger(cents) || cents < 1 || cents > 99999) return null;
    return cents / 100;
  }

  function utf8ByteLength(text) {
    return new TextEncoder().encode(text).length;
  }

  function getDeviceId() {
    let id = localStorage.getItem(DEVICE_KEY);
    if (!id || !/^[A-Z0-9]{6}$/.test(id)) {
      const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      const bytes = new Uint8Array(6);
      if (globalThis.crypto && globalThis.crypto.getRandomValues) {
        globalThis.crypto.getRandomValues(bytes);
      } else {
        for (let i = 0; i < 6; i++) bytes[i] = Math.floor(Math.random() * 256);
      }
      id = Array.from(bytes, v => alphabet[v % alphabet.length]).join('');
      localStorage.setItem(DEVICE_KEY, id);
    }
    return id;
  }

  function nextReference(description) {
    const now = new Date();
    const date = String(now.getFullYear())
      + String(now.getMonth() + 1).padStart(2, '0')
      + String(now.getDate()).padStart(2, '0');
    let state;
    try { state = JSON.parse(localStorage.getItem(LAST_KEY) || '{}'); } catch (_) { state = {}; }
    const num = state.date === date ? (Number(state.num) || 0) + 1 : 1;
    if (num > 9999) throw new Error('Het lokale dagnummer is opgebruikt.');
    const suffix = date + '-' + getDeviceId() + '-' + String(num).padStart(4, '0');
    // Max. 70 UTF-8 bytes in de onsamengestelde omschrijving;
    // reserveer plaats voor datum, toestel-ID en volgnummer.
    let trimmed = description.trim().replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ') || DEFAULT_DESCRIPTION;
    const maxDescBytes = 70 - utf8ByteLength(suffix) - 1;
    while (utf8ByteLength(trimmed) > maxDescBytes) trimmed = trimmed.slice(0, -1);
    const reference = trimmed + ' ' + suffix;
    return {reference, state: {date, num}};
  }

  function formatEuro(value) {
    return new Intl.NumberFormat('nl-BE', {style: 'currency', currency: 'EUR'}).format(value);
  }

  function renderQr(payload) {
    // De QR-bibliotheek zet elk codepunt om naar 1 byte. Wij leveren de
    // echte UTF-8 bytes aan als binaire string (geen externe online dienst).
    const bytes = new TextEncoder().encode(payload);
    if (bytes.length > 331) throw new Error('De betaalgegevens zijn te lang voor een EPC-QR-code.');
    let binary = '';
    for (const b of bytes) binary += String.fromCharCode(b);
    const qr = new LocalQRCode(0, 1); // L foutcorrectie, versiekeuze automatisch
    qr.addData(binary);
    qr.make();
    // Canvas-vrije SVG werkt ook in oudere mobiele browsers.
    const n = qr.getModuleCount();
    const quiet = 4;
    const size = n + quiet * 2;
    const paths = [];
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (qr.isDark(r, c)) paths.push('M' + (c + quiet) + ',' + (r + quiet) + 'h1v1h-1z');
      }
    }
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + size + ' ' + size + '" aria-label="QR-code voor SEPA-overschrijving" role="img"><rect width="100%" height="100%" fill="#fff"/><path d="' + paths.join('') + '" fill="#000"/></svg>';
    $('qr').innerHTML = svg;
  }

  function showError(message) {
    formError.textContent = message;
    formError.hidden = false;
  }

  $('payForm').addEventListener('submit', e => {
    e.preventDefault();
    formError.hidden = true;
    const amount = cleanAmount(amountInput.value);
    if (amount === null) {
      showError('Vul een geldig bedrag in tussen € 0,01 en € 999,99.');
      amountInput.focus();
      return;
    }
    try {
      const candidate = nextReference(descriptionInput.value);
      const payload = epcPayload(amount, candidate.reference);
      renderQr(payload);
      // Alleen na succesvolle QR-creatie wordt het lokale volgnummer opgehoogd.
      localStorage.setItem(LAST_KEY, JSON.stringify(candidate.state));
      $('displayAmount').textContent = formatEuro(amount);
      $('displayReference').textContent = candidate.reference;
      resultCard.hidden = false;
      inputCard.hidden = true;
      window.scrollTo({top: 0, behavior: 'auto'});
    } catch (ex) {
      showError('De QR-code kon niet worden gemaakt: ' + (ex.message || 'onbekende fout'));
    }
  });

  $('newPayment').addEventListener('click', () => {
    resultCard.hidden = true;
    inputCard.hidden = false;
    $('qr').innerHTML = '';
    amountInput.value = '';
    descriptionInput.value = DEFAULT_DESCRIPTION;
    formError.hidden = true;
    window.scrollTo({top: 0, behavior: 'auto'});
    amountInput.focus();
  });

  // Registratie is alleen actief op HTTPS of localhost. Na installatie
  // worden alle bestanden lokaal op het toestel bijgehouden.
  const offlineLabel = $('offlineStatus');
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('./sw.js').then(() => navigator.serviceWorker.ready).then(() => {
      offlineLabel.textContent = '✓ Offline beschikbaar na eerste installatie';
    }).catch(() => {
      offlineLabel.textContent = 'Offline opslag mislukt; controleer internet';
    });
  } else {
    offlineLabel.textContent = 'Offline installatie beschikbaar via HTTPS';
  }
  window.QRKassaTest = {VERSION, IBAN, PAYEE, cleanAmount, epcPayload, nextReference};
})();
