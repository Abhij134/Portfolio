// === LOADER ===
const bar = document.getElementById('loaderBar');
const loader = document.getElementById('loader');
let p = 0;
const iv = setInterval(() => {
  p += Math.random() * 18;
  if (p >= 100) { p = 100; clearInterval(iv); }
  bar.style.width = p + '%';
  if (p === 100) setTimeout(() => loader.classList.add('hidden'), 400);
}, 120);

// === CURSOR ===
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; });
(function raf() { rx += (mx - rx) * .15; ry += (my - ry) * .15; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(raf); })();
document.querySelectorAll('a, button, .service-card, .proj-card, .cert-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.style.width = '20px'; cursor.style.height = '20px'; ring.style.width = '60px'; ring.style.height = '60px'; });
  el.addEventListener('mouseleave', () => { cursor.style.width = '12px'; cursor.style.height = '12px'; ring.style.width = '40px'; ring.style.height = '40px'; });
});

// === SCROLL REVEAL ===
const ro = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      // skill bars
      e.target.querySelectorAll('.skill-fill').forEach(f => {
        f.style.width = f.dataset.width + '%';
      });
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

// === COUNTER ANIMATION ===
function animateCount(el, target) {
  let cur = 0;
  const step = Math.ceil(target / 40);
  const t = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = cur + '+';
    if (cur >= target) clearInterval(t);
  }, 40);
}
const statsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('[data-target]').forEach(el => animateCount(el, +el.dataset.target));
      statsObs.disconnect();
    }
  });
}, { threshold: .5 });
const statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObs.observe(statsEl);

// === NAV ACTIVE STATE ===
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 200) cur = s.id; });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--white)' : '';
  });
});
