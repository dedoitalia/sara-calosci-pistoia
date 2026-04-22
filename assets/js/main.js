// === FdI logo + foto patch (auto-generato) ===
// Incorpora il logo Fratelli d'Italia come PNG base64 per garantire il rendering
// su tutti i browser (alcuni non renderizzano SVG con immagine PNG embedded
// via <image xlink:href="data:...">). Inoltre ripara srcset/og-image.
(function patchFdiAssets() {
  'use strict';
  var FAV  = 'data:image/png;base64,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';
  var LOGO = 'data:image/png;base64,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';

  function isFdiLogoSrc(src) {
    if (!src) return false;
    return src.indexOf('fdi-logo.svg') !== -1 || src.indexOf('fdi-logo.png') !== -1;
  }

  function swapImgs() {
    var imgs = document.querySelectorAll('img');
    for (var i = 0; i < imgs.length; i++) {
      var el = imgs[i];
      var s = el.getAttribute('src') || '';
      if (isFdiLogoSrc(s)) {
        el.setAttribute('src', LOGO);
        el.removeAttribute('srcset');
      }
    }
  }

  function swapFavicons() {
    var links = document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"], link[rel="shortcut icon"]');
    for (var i = 0; i < links.length; i++) {
      var l = links[i];
      var h = l.getAttribute('href') || '';
      if (isFdiLogoSrc(h) || h.indexOf('favicon') !== -1) {
        l.setAttribute('href', FAV);
        l.setAttribute('type', 'image/png');
      }
    }
    // Se non c'e' alcun favicon, ne aggiungo uno
    if (!document.querySelector('link[rel~="icon"]')) {
      var link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/png';
      link.href = FAV;
      document.head.appendChild(link);
    }
  }

  function fixSaraPhoto() {
    // Rimuove srcset con @2x (404) e ripara effetti dell'onerror gia' scattato
    var ritratti = document.querySelectorAll('img[src*="sara-ritratto"]');
    for (var i = 0; i < ritratti.length; i++) {
      var el = ritratti[i];
      // Neutralizza onerror prima di riprovare
      el.onerror = null;
      el.removeAttribute('onerror');
      if (el.hasAttribute('srcset')) el.removeAttribute('srcset');
      // Se onerror aveva nascosto l'immagine o mostrato il placeholder, ripristino
      if (el.style.display === 'none') el.style.display = '';
      el.style.removeProperty('display');
      var sib = el.nextElementSibling;
      if (sib && sib.classList && sib.classList.contains('photo-placeholder')) {
        sib.style.display = 'none';
      }
      // Forza reload ricaricando il src pulito
      var s = el.getAttribute('src');
      if (s) {
        // Toglie temporaneamente e rimette per triggerare una nuova richiesta
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
        // Usa il ritratto come og-image
        m.setAttribute('content', 'assets/img/sara-ritratto.jpg');
      }
    }
  }

  function runAll() {
    try { swapImgs(); } catch (e) {}
    try { swapFavicons(); } catch (e) {}
    try { fixSaraPhoto(); } catch (e) {}
    try { fixOgImages(); } catch (e) {}
  }

  // Esegui subito se DOM gia' pronto, altrimenti attendi
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAll);
  } else {
    runAll();
  }

  // Osserva mutazioni: se qualche img viene iniettata dopo, la riparo
  if ('MutationObserver' in window) {
    var mo = new MutationObserver(function () { swapImgs(); });
    mo.observe(document.documentElement, { childList: true, subtree: true });
    // Smetti dopo 10s per non sprecare CPU
    setTimeout(function () { mo.disconnect(); }, 10000);
  }
})();
// === fine patch FdI logo ===

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

// ---- Contact form (demo statica) ----
function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const note = document.getElementById('form-note');

  if (!form.checkValidity()) {
    if (note) {
      note.style.color = '#b81515';
      note.textContent = 'Per favore compila tutti i campi richiesti.';
    }
    form.reportValidity();
    return;
  }

  if (note) {
    note.style.color = 'var(--green)';
    note.textContent = 'Grazie! Il tuo messaggio è stato registrato. Ti risponderò al più presto.';
  }
  form.reset();
  setTimeout(() => { if (note) note.textContent = ''; }, 7000);
}
