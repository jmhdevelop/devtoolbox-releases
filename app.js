/* Interacción de la portada: el panel es un simulador de la app, no una imagen.
   Sin dependencias. */

const $ = (sel) => document.querySelector(sel);

/* Trazos simples en currentColor: pesan nada y heredan el gris del sistema. */
const ICON = {
  hammer: '<path d="M2 14l6-6M8 8l3-3 1 1 3-3-2-2-3 3-1-1-3 3z"/>',
  phone:  '<rect x="4" y="1.5" width="8" height="13" rx="2"/><path d="M7 12.5h2"/>',
  cable:  '<path d="M5 2v4a3 3 0 006 0V2M8 9v5"/>',
  box:    '<path d="M8 1.5l6 3v7l-6 3-6-3v-7z"/><path d="M2 4.5l6 3 6-3M8 7.5v7"/>',
  folder: '<path d="M1.5 4.5h4l1.5 2h7.5v7h-13z"/>',
  sparkle:'<path d="M8 1.5l1.4 3.6L13 6.5l-3.6 1.4L8 11.5 6.6 7.9 3 6.5l3.6-1.4z"/>',
  grid:   '<rect x="2" y="2" width="5" height="5" rx="1"/><rect x="9" y="2" width="5" height="5" rx="1"/><rect x="2" y="9" width="5" height="5" rx="1"/><rect x="9" y="9" width="5" height="5" rx="1"/>',
  gauge:  '<circle cx="8" cy="8" r="6"/><path d="M8 8l3-2.5"/>',
  gear:   '<circle cx="8" cy="8" r="2.6"/><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M12.5 3.5l-1.4 1.4M4.9 11.1l-1.4 1.4"/>',
};
const svg = (name) => `<span class="glyph" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none"
  stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${ICON[name]}</svg></span>`;
const gb = (n) => n.toFixed(1).replace('.', ',') + ' GB';

/* ── Limpiador ─────────────────────────────────────────────────────────── */

const CATEGORIES = [
  { icon: 'hammer', name: 'DerivedData',          sub: 'Builds intermedios de Xcode',    size: 24.8, n: 12, on: true },
  { icon: 'phone',  name: 'Simuladores sin usar', sub: 'Dispositivos que ya no soporta', size: 11.2, n: 7,  on: true },
  { icon: 'cable',  name: 'iOS DeviceSupport',    sub: 'Símbolos de versiones antiguas', size: 6.4,  n: 4,  on: true },
  { icon: 'box',    name: 'Caches de usuario',    sub: 'Xcode, Homebrew, apps',          size: 2.9,  n: 63, on: false },
  { icon: 'folder', name: 'node_modules',         sub: 'En ~/Projects',                  size: 3.1,  n: 9,  on: false },
];

let cats = CATEGORIES.map((c) => ({ ...c }));

function renderClean() {
  $('#cleanRows').innerHTML = cats.map((c, i) => `
    <button class="row" data-cat="${i}" role="checkbox" aria-checked="${c.on}">
      <span class="check ${c.on ? 'on' : ''}" aria-hidden="true"></span>
      ${svg(c.icon)}
      <span class="txt"><span class="name">${c.name}</span><span class="sub">${c.sub}</span></span>
      <span class="count">${c.n}</span>
      <span class="size">${gb(c.size)}</span>
    </button>`).join('');

  const total = cats.filter((c) => c.on).reduce((s, c) => s + c.size, 0);
  $('#cleanTotal').textContent = gb(total);
  $('#cleanBtn').disabled = total === 0;

  document.querySelectorAll('[data-cat]').forEach((el) =>
    el.addEventListener('click', () => {
      cats[+el.dataset.cat].on = !cats[+el.dataset.cat].on;
      renderClean();
    }));
}

$('#cleanBtn').addEventListener('click', () => {
  const freed = cats.filter((c) => c.on).reduce((s, c) => s + c.size, 0);
  if (!freed) return;

  // Las filas marcadas se van una a una, como en la app.
  const rows = [...document.querySelectorAll('[data-cat]')]
    .filter((el) => cats[+el.dataset.cat].on);
  rows.forEach((el, i) => setTimeout(() => el.classList.add('gone'), i * 110));

  $('#cleanBtn').textContent = 'Limpiando…';
  setTimeout(() => {
    $('#cleanBtn').textContent = `✓ ${gb(freed)} liberados`;
    $('#cleanBtn').classList.add('done');
    bumpDisk(freed);
  }, rows.length * 110 + 350);

  // Y se rearma, para que se pueda volver a probar.
  setTimeout(() => {
    cats = CATEGORIES.map((c) => ({ ...c }));
    $('#cleanBtn').classList.remove('done');
    $('#cleanBtn').innerHTML = '🗑 Limpiar <span id="cleanTotal"></span>';
    renderClean();
  }, rows.length * 110 + 2600);
});

/* El disco libre sube de verdad al limpiar. */
let diskFree = 91.7;
const DISK_TOTAL = 460;
function bumpDisk(freed) {
  const target = diskFree + freed;
  const step = () => {
    diskFree += (target - diskFree) * 0.12;
    if (target - diskFree < 0.05) diskFree = target;
    $('#vDisk').textContent = gb(diskFree);
    $('#bDisk').style.width = (100 - (diskFree / DISK_TOTAL) * 100) + '%';
    if (diskFree < target) requestAnimationFrame(step);
  };
  step();
}

/* ── Otras pestañas ────────────────────────────────────────────────────── */

$('#appRows').innerHTML = [
  ['Android Studio', 'App 3,4 GB · 92 archivos relacionados', '12,8 GB'],
  ['Docker',         'App 2,1 GB · 58 archivos relacionados', '9,4 GB'],
  ['Figma',          'App 1,2 GB · 34 archivos relacionados', '1,6 GB'],
].map(([n, s, z]) => `<div class="row">${svg('box')}
  <span class="txt"><span class="name">${n}</span><span class="sub">${s}</span></span>
  <span class="size">${z}</span></div>`).join('');

const PROCS = [
  ['WindowServer', 597], ['Xcode', 1841], ['Simulator', 2044],
  ['node', 3120], ['Safari', 998],
];
function renderProcs() {
  $('#procRows').innerHTML = PROCS.map(([n, pid]) => {
    const cpu = Math.max(1, Math.round(Math.random() * 40));
    const ram = 40 + Math.round(Math.random() * 900);
    return `<div class="row"><span class="txt"><span class="name">${n}</span>
      <span class="sub">PID ${pid}</span></span>
      <span class="size">${cpu}%</span><span class="size ram">${ram} MB</span></div>`;
  }).join('');
}
renderProcs();

$('#setRows').innerHTML = [
  ['sparkle', 'Auto-limpieza', 'Cada 3 días', true],
  ['box', 'Mantener el Mac despierto', 'Para builds largos', false],
  ['gear', 'Arrancar al iniciar sesión', '', true],
].map(([i, n, s, on]) => `<button class="row sw-row"><span class="ico">${i}</span>
  <span class="txt"><span class="name">${n}</span>${s ? `<br><span class="sub">${s}</span>` : ''}</span>
  <span class="sw ${on ? 'on' : ''}"></span></button>`).join('');

document.querySelectorAll('.sw-row').forEach((el) =>
  el.addEventListener('click', () => el.querySelector('.sw').classList.toggle('on')));

/* ── Pestañas ──────────────────────────────────────────────────────────── */

const tabs = [...document.querySelectorAll('[data-tab]')];

function selectTab(btn) {
  tabs.forEach((b) => {
    const on = b === btn;
    b.classList.toggle('on', on);
    b.setAttribute('aria-selected', String(on));
    b.tabIndex = on ? 0 : -1;
  });
  document.querySelectorAll('[data-pane]').forEach((p) =>
    p.classList.toggle('on', p.dataset.pane === btn.dataset.tab));
  if (btn.dataset.tab === '2') renderProcs();
}

const TAB_ICONS = ['sparkle', 'grid', 'gauge', 'gear'];
tabs.forEach((b, i) => { b.innerHTML = svg(TAB_ICONS[i]) + b.textContent.trim(); });

tabs.forEach((btn, i) => {
  btn.tabIndex = btn.classList.contains('on') ? 0 : -1;
  btn.addEventListener('click', () => selectTab(btn));
  // Flechas entre pestañas: es lo que espera quien navega con teclado.
  btn.addEventListener('keydown', (e) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = tabs[(i + step + tabs.length) % tabs.length];
    selectTab(next);
    next.focus();
  });
});

/* ── Métricas vivas ────────────────────────────────────────────────────── */

let cpu = 38, ram = 10;

/* El panel solo late si está en pantalla y la pestaña está en primer plano.
   Si no, son repintados constantes que gastan batería y penalizan el INP. */
let panelVisible = true;
new IntersectionObserver(([e]) => { panelVisible = e.isIntersecting; })
  .observe(document.getElementById('sim'));

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

setInterval(() => {
  if (!panelVisible || document.hidden || reduced) return;
  cpu = Math.min(96, Math.max(4, cpu + (Math.random() - 0.5) * 22));
  ram = Math.min(16.4, Math.max(7, ram + (Math.random() - 0.5) * 0.8));
  const down = Math.random() * 2.4;

  $('#vCpu').textContent = Math.round(cpu) + ' %';
  $('#bCpu').style.width = cpu + '%';
  $('#vRam').textContent = ram.toFixed(1).replace('.', ',') + ' GB';
  $('#bRam').style.width = (ram / 17.2) * 100 + '%';
  $('#vNet').textContent = '↓ ' + down.toFixed(1).replace('.', ',') + 'M';
  $('#vNetUp').textContent = '↑ ' + Math.round(Math.random() * 90 + 10) + 'K';
  $('#bNet').style.width = Math.min(100, down * 42) + '%';

  if (document.querySelector('[data-pane="2"]').classList.contains('on')) renderProcs();
}, 2000);

/* ── Aparición al hacer scroll ─────────────────────────────────────────── */

const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .card, .price-box').forEach((el, i) => {
  el.style.transitionDelay = (i % 3) * 70 + 'ms';
  io.observe(el);
});

renderClean();


/* ── Navegación ────────────────────────────────────────────────────────── */

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
