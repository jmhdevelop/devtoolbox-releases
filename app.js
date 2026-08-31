/* Navegación de la página. El panel de la portada es estático: se dibuja en
   HTML y CSS, sin JavaScript. */

/* Progreso de lectura. */
const bar = document.querySelector('.progress');
const onScroll = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + '%';
  document.querySelector('.top')?.classList.toggle('on', scrollY > 700);
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();


document.querySelector('.top')?.addEventListener('click', () =>
  scrollTo({ top: 0, behavior: 'smooth' }));


/* Al elegir idioma a mano, esa decisión pesa más que la del navegador. */
document.querySelectorAll('.lang a').forEach((a) =>
  a.addEventListener('click', () => {
    try { localStorage.setItem('dtb-lang', a.getAttribute('hreflang')); } catch (e) {}
  }));


/* ── Aparición al hacer scroll ─────────────────────────────────────────────
   Este observador se perdió al recortar el archivo y la página se quedó en
   blanco al bajar. Ahora, si algo falla, el contenido se muestra igualmente:
   nunca debe depender de JavaScript para ser legible. */

const targets = document.querySelectorAll('.reveal, .card, .price-box');
const show = (el) => el.classList.add('in');

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  targets.forEach((el, i) => {
    el.style.transitionDelay = (i % 3) * 70 + 'ms';
    io.observe(el);
  });
  // Red de seguridad: pase lo que pase, a los dos segundos todo es visible.
  setTimeout(() => targets.forEach(show), 2000);
} else {
  targets.forEach(show);
}
