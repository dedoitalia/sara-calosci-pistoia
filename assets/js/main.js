// === Piccoli fix non invasivi: foto ritratto + og:image ===
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

  // ---- Reveal on scroll ----
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
      el.classList.add('reveal', 'js-hide');
      observer.observe(el);
    });

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

// ---- Contact form: POST /api/invia (stesso origin, niente CORS) ----
// L'indirizzo di destinazione e' solo lato server, mai nel sorgente.
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

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        setNote('Per favore compila tutti i campi richiesti.', '#b81515');
        form.reportValidity();
        return;
      }

      var honey = form.querySelector('input[name="_honey"]');

      var payload = {
        nome: (form.nome && form.nome.value || '').trim(),
        email: (form.email && form.email.value || '').trim(),
        quartiere: (form.quartiere && form.quartiere.value || '').trim(),
        messaggio: (form.messaggio && form.messaggio.value || '').trim(),
        _honey: honey ? honey.value : ''
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.origText = submitBtn.textContent;
        submitBtn.textContent = 'Invio in corso…';
      }
      setNote('Invio del messaggio…', '#0b2545');

      fetch('/api/invia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          return { ok: r.ok, status: r.status, body: j };
        });
      })
      .then(function (res) {
        if (res.ok && res.body && res.body.ok) {
          setNote('Grazie! Il tuo messaggio è stato inviato. Ti risponderò al più presto.', 'var(--green)');
          form.reset();
          setTimeout(function () { setNote('', ''); }, 10000);
        } else {
          var msg = (res.body && res.body.error) || 'Invio non riuscito. Riprova tra poco o scrivimi su WhatsApp.';
          setNote(msg, '#b81515');
        }
      })
      .catch(function () {
        setNote('Errore di rete. Riprova tra poco o scrivimi su WhatsApp.', '#b81515');
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          if (submitBtn.dataset.origText) {
            submitBtn.textContent = submitBtn.dataset.origText;
          }
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
