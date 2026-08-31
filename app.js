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

/* Enlace activo según la sección visible: se marca la última que ha cruzado
   el tercio superior, que es lo que el ojo lee como "estoy aquí". */
const links = [...document.querySelectorAll('header nav a[href^="#"]')];
const targets = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);

const spy = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    // La tira de navegación del móvil arrastra el activo a la vista.
    const active = document.querySelector('header nav a.active');
    if (active && innerWidth <= 860) {
      active.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' });

targets.forEach((t) => spy.observe(t));

document.querySelector('.top')?.addEventListener('click', () =>
  scrollTo({ top: 0, behavior: 'smooth' }));
