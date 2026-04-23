// === Piccoli fix non invasivi: foto ritratto + og:image ===
// Il logo FdI ora è un SVG pulito in assets/img/fdi-logo.svg, quindi
// non serve più sostituirlo runtime con un PNG. Mantengo solo le riparazioni
// non-logo che erano utili.
(function fixAssets() {
  function fixSaraPhoto() {
    var ritratti = document.querySelectorAll('img[src*="sara-ritratto"]');
    for (var i = 0; i < ritratti.length; i++) {
      var el = ritratti[i];
      el.onerror = null;
      el.removeAttribute('onerror');
      if (el.hasAttribute('srcset')) el.removeAttribute('srcset');
      if (el.style.display === 'none') el.style.display = '';
      el.style.removeProperty('display');
      var sib = el.nextElementSibling;
      if (sib && sib.classList && sib.classList.contains('photo-placeholder')) {
        sib.style.display = 'none';
      }
      var s = el.getAttribute('src');
      if (s) {
        el.setAttribute('src', '');
        el.setAttribute('src', s);
      }
    }
  }

  function fixOgImages() {
    var metas = document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]');
    for (var i = 0; i < metas.length; i++) {
      var m = metas[i];
      var c = m.getAttribute('content') || '';
      if (c.indexOf('og-image') !== -1) {
        m.setAttribute('content', 'assets/img/sara-ritratto.jpg');
      }
    }
  }

  function runAll() {
    try { fixSaraPhoto(); } catch (e) {}
    try { fixOgImages(); } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAll);
  } else {
    runAll();
  }
})();
// === fine fix asset ===

// Sara Calosci — Consigliere Comunale Pistoia · Fratelli d'Italia
// Interazioni minime, accessibili, ottimizzate.

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Mobile nav toggle (con Escape + click fuori) ----
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    const closeNav = () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
    });
  }

  // ---- Reveal on scroll (solo se non preferenza reduced-motion) ----
  const revealTargets = document.querySelectorAll(
    '.priority-item, .event, .quote-card, .fact-card, .variant-item, .vote-step-mini'
  );
  if (!prefersReduced && 'IntersectionObserver' in window && revealTargets.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(el => {
      // "js-hide" nasconde SOLO se JS è attivo; senza JS resta visibile.
      el.classList.add('reveal', 'js-hide');
      observer.observe(el);
    });

    // Fallback di sicurezza: dopo 1.2s rivela tutto quello che non è stato
    // ancora intercettato (utile per screenshot, stampa, user-agent insoliti).
    setTimeout(() => {
      document.querySelectorAll('.reveal.js-hide:not(.in-view)')
        .forEach(el => { el.classList.remove('js-hide'); el.classList.add('in-view'); });
    }, 1200);
  }

  // ---- Header: ombra leggera allo scroll ----
  const header = document.querySelector('.site-header');
  if (header) {
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > 10 && lastY <= 10) header.style.boxShadow = '0 4px 14px rgba(11,37,69,.08)';
      else if (y <= 10 && lastY > 10) header.style.boxShadow = '';
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();

// ---- Contact form: invio via Formsubmit (POST tradizionale + redirect)
// ---- Nessuna dipendenza da CORS, funziona anche prima dell'attivazione.
// L'indirizzo di destinazione NON compare in chiaro nel sorgente HTML:
// viene ricomposto a runtime da due parti base64 splittate.
(function contactFormInit() {
  function init() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    var note = document.getElementById('form-note');
    var submitBtn = form.querySelector('button[type="submit"]');

    function setNote(msg, color) {
      if (!note) return;
      note.style.color = color || 'var(--green)';
      note.textContent = msg;
    }

    // Ricomposizione email destinazione — parti base64
    function getTargetEmail() {
      var a = 'c2FyYWNhbG9z';
      var b = 'Y2k3QGdtYWlsLmNvbQ==';
      try { return atob(a + b); } catch (e) { return ''; }
    }

    // Se l'utente è tornato dopo un submit riuscito, mostra la conferma
    // e pulisce l'URL. Formsubmit redirige a ?inviato=1#contatti.
    try {
      var qs = window.location.search || '';
      if (qs.indexOf('inviato=1') !== -1) {
        setNote('Grazie! Il tuo messaggio è stato inviato. Ti risponderò al più presto.', 'var(--green)');
        var clean = window.location.pathname + (window.location.hash || '');
        if (window.history && window.history.replaceState) {
          window.history.replaceState({}, document.title, clean);
        }
        setTimeout(function () { setNote('', ''); }, 12000);
      }
    } catch (e) {}

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        setNote('Per favore compila tutti i campi richiesti.', '#b81515');
        form.reportValidity();
        return;
      }

      // Honeypot: se un bot ha riempito il campo nascosto, fingi successo e stop
      var honey = form.querySelector('input[name="_honey"]');
      if (honey && honey.value) {
        setNote('Grazie! Ti risponderò presto.', 'var(--green)');
        form.reset();
        return;
      }

      var email = getTargetEmail();
      if (!email) {
        setNote('Impossibile inviare adesso — scrivimi su WhatsApp.', '#b81515');
        return;
      }

      // Costruisce un form nascosto e lo invia via POST tradizionale a
      // formsubmit.co. Questo evita qualsiasi problema di CORS e funziona
      // anche alla primissima submission (attivazione).
      var hidden = document.createElement('form');
      hidden.method = 'POST';
      hidden.action = 'https://formsubmit.co/' + email;
      hidden.style.display = 'none';
      hidden.acceptCharset = 'UTF-8';

      function addField(name, value) {
        var inp = document.createElement('input');
        inp.type = 'hidden';
        inp.name = name;
        inp.value = value == null ? '' : String(value);
        hidden.appendChild(inp);
      }

      var nextUrl = window.location.origin + window.location.pathname + '?inviato=1#contatti';

      addField('nome', (form.nome && form.nome.value || '').trim());
      addField('email', (form.email && form.email.value || '').trim());
      addField('quartiere', (form.quartiere && form.quartiere.value || '').trim());
      addField('messaggio', (form.messaggio && form.messaggio.value || '').trim());
      addField('_subject', 'Nuovo messaggio dal sito — Sara Calosci');
      addField('_template', 'table');
      addField('_captcha', 'false');
      addField('_replyto', (form.email && form.email.value || '').trim());
      addField('_next', nextUrl);

      document.body.appendChild(hidden);

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.origText = submitBtn.textContent;
        submitBtn.textContent = 'Invio in corso…';
      }
      setNote('Invio del messaggio…', '#0b2545');

      // Submit nativo — il browser navigherà a formsubmit, che poi
      // farà il redirect a nextUrl (?inviato=1#contatti).
      hidden.submit();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
