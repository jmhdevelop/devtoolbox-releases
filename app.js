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
