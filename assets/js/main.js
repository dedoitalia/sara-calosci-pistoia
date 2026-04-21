// Sara Calosci — Consigliere Comunale Pistoia
// Minimal interactions

(function () {
  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Subtle reveal on scroll
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: .12 });
  document.querySelectorAll('.priority, .event, .quote-card, .fact-card, .contact-card').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });

  // Reveal animation styles (injected)
  const style = document.createElement('style');
  style.textContent = `
    .reveal { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
    .reveal.in-view { opacity: 1; transform: translateY(0); }
  `;
  document.head.appendChild(style);
})();

// Contact form handler (static — for a real backend, replace with a fetch POST to Formspree, Web3Forms, etc.)
function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const note = document.getElementById('form-note');
  note.style.color = 'var(--green)';
  note.textContent = 'Grazie! Il tuo messaggio è stato registrato. Ti risponderò al più presto.';
  form.reset();
  setTimeout(() => { note.textContent = ''; }, 7000);
}
