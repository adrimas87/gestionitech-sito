(function () {
  'use strict';
  var menoMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Anno nel pie' di pagina
  var anno = document.getElementById('anno');
  if (anno) anno.textContent = new Date().getFullYear();

  // Testata trasparente che diventa vetro scorrendo
  var testata = document.getElementById('testata');
  function aggiornaTestata() { testata.classList.toggle('scorsa', window.scrollY > 20); }
  aggiornaTestata();
  window.addEventListener('scroll', aggiornaTestata, { passive: true });

  // Il menu del telefono si chiude scegliendo una voce
  document.querySelectorAll('.menu a').forEach(function (a) {
    a.addEventListener('click', function () { document.getElementById('menu-apri').checked = false; });
  });

  // Comparsa allo scorrimento, con un piccolo ritardo fra elementi vicini
  var elementi = document.querySelectorAll('.rivela');
  document.querySelectorAll('.mini-grafico span').forEach(function (s, i) { s.style.setProperty('--i', i); });
  if (menoMovimento || !('IntersectionObserver' in window)) {
    elementi.forEach(function (el) { el.classList.add('visibile'); });
  } else {
    var osservatore = new IntersectionObserver(function (voci) {
      voci.forEach(function (voce) {
        if (!voce.isIntersecting) return;
        var el = voce.target;
        var fratelli = Array.prototype.indexOf.call(el.parentNode.children, el);
        el.style.transitionDelay = Math.min(fratelli, 5) * 80 + 'ms';
        el.classList.add('visibile');
        osservatore.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    elementi.forEach(function (el) { osservatore.observe(el); });
  }

  // Luce che segue il puntatore sulle schede
  document.querySelectorAll('.scheda').forEach(function (scheda) {
    scheda.addEventListener('pointermove', function (e) {
      var r = scheda.getBoundingClientRect();
      scheda.style.setProperty('--x', (e.clientX - r.left) + 'px');
      scheda.style.setProperty('--y', (e.clientY - r.top) + 'px');
    });
  });

  // Copia dell'indirizzo e-mail (il link mailto non fa niente senza un programma di posta)
  var copia = document.getElementById('copia-email');
  if (copia) {
    copia.addEventListener('click', function () {
      var indirizzo = copia.getAttribute('data-email');
      function fatto() {
        copia.textContent = 'Indirizzo copiato ✓';
        copia.classList.add('copiato');
        setTimeout(function () { copia.textContent = 'Copia indirizzo'; copia.classList.remove('copiato'); }, 2500);
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(indirizzo).then(fatto, function () { window.prompt('Copia l'indirizzo:', indirizzo); });
      } else {
        var t = document.createElement('textarea');
        t.value = indirizzo; t.style.position = 'fixed'; t.style.opacity = '0';
        document.body.appendChild(t); t.select();
        try { document.execCommand('copy'); fatto(); } catch (e) { window.prompt('Copia l'indirizzo:', indirizzo); }
        document.body.removeChild(t);
      }
    });
  }

  // Terminale che scrive il codice
  var righe = [
    ['c', '// Gestioni Tech: dall\'idea al software'],
    ['', ''],
    ['k', 'const ', 'f', 'progetto', '', ' = ', 'k', 'await ', 'f', 'analizza', '', '({'],
    ['', '  processi: ', 's', '\'magazzino, vendite\'', '', ','],
    ['', '  canali: [', 's', '\'web\'', '', ', ', 's', '\'mobile\'', '', ', ', 's', '\'cloud\'', '', '],'],
    ['', '  sicurezza: ', 'n', 'true', '', ','],
    ['', '});'],
    ['', ''],
    ['k', 'await ', 'f', 'sviluppa', '', '(progetto);'],
    ['k', 'await ', 'f', 'integra', '', '(progetto, ', 's', '\'sistemi aziendali\'', '', ');'],
    ['k', 'return ', 'f', 'avvia', '', '(progetto); ', 'c', '// pronto'],
  ];
  var codice = document.getElementById('codice');
  var terminale = document.querySelector('.terminale');
  var stato = document.getElementById('stato-testo');
  if (!codice) return;

  function html(t) { return t.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function rigaCompleta(r) {
    var out = '';
    for (var i = 0; i < r.length; i += 2) out += r[i] ? '<span class="' + r[i] + '">' + html(r[i + 1]) + '</span>' : html(r[i + 1]);
    return out;
  }
  function fine() { terminale.classList.add('pronto'); stato.textContent = 'deploy completato ✓'; }

  if (menoMovimento) {
    codice.innerHTML = righe.map(rigaCompleta).join('\n');
    fine();
    return;
  }

  var r = 0, pezzo = 0, car = 0, fatto = '';
  function scrivi() {
    if (r >= righe.length) { fine(); return; }
    var riga = righe[r];
    if (pezzo >= riga.length) {
      fatto += rigaCompleta(riga) + '\n';
      r++; pezzo = 0; car = 0;
      codice.innerHTML = fatto;
      setTimeout(scrivi, 120);
      return;
    }
    var classe = riga[pezzo], testo = riga[pezzo + 1];
    car++;
    var parziale = '';
    for (var i = 0; i < pezzo; i += 2) parziale += riga[i] ? '<span class="' + riga[i] + '">' + html(riga[i + 1]) + '</span>' : html(riga[i + 1]);
    var corrente = html(testo.slice(0, car));
    parziale += classe ? '<span class="' + classe + '">' + corrente + '</span>' : corrente;
    codice.innerHTML = fatto + parziale;
    if (car >= testo.length) { pezzo += 2; car = 0; }
    setTimeout(scrivi, 18 + Math.random() * 30);
  }
  setTimeout(scrivi, 700);
})();
