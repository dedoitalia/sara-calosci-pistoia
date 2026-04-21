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
