// ── LOADER ──
const lFill = document.getElementById('lFill'), lNum = document.getElementById('lNum'), lLbl = document.getElementById('lLbl'), loader = document.getElementById('loader');
const steps = [{ l: 'Setting up design…', s: 'ls1' }, { l: 'Loading projects…', s: 'ls2' }, { l: 'Launching portfolio…', s: 'ls3' }];
let p = 0;

// spawn particles
const pc = document.getElementById('pContainer');
const cols = ['#6366f1', '#8b5cf6', '#ec4899', '#0ea5e9', '#f59e0b'];
for (let i = 0; i < 14; i++) {
  const d = document.createElement('div'); const sz = 4 + Math.random() * 8;
  d.className = 'particle';
  d.style.cssText = `width:${sz}px;height:${sz}px;background:${cols[Math.floor(Math.random() * 5)]};left:${38 + Math.random() * 24}%;top:${38 + Math.random() * 24}%;animation-duration:${1.5 + Math.random() * 2}s;animation-delay:${Math.random() * 2}s;box-shadow:0 0 8px currentColor;`;
  pc.appendChild(d);
}

const iv = setInterval(() => {
  p += Math.random() * 13; if (p >= 100) p = 100;
  lFill.style.width = p + '%'; lNum.textContent = Math.round(p) + '%';
  const si = p < 33 ? 0 : p < 66 ? 1 : 2;
  lLbl.textContent = steps[si].l;
  ['ls1', 'ls2', 'ls3'].forEach((id, i) => { document.getElementById(id).className = 'l-step' + (i <= si ? ' on' : ''); });
  if (p >= 100) { clearInterval(iv); setTimeout(() => loader.classList.add('hidden'), 600); setTimeout(() => loader.style.display = 'none', 1400); }
}, 100);

// ── SCROLL REVEAL ──
const ro = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => {
        e.target.classList.add('visible');
        e.target.querySelectorAll('.skfill').forEach(f => f.style.width = f.dataset.width + '%');
      }, i * 80);
    }
  });
}, { threshold: .1 });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

// ── COUNTER ──
function animateCount(el, target) { let c = 0; const s = Math.ceil(target / 36); const t = setInterval(() => { c = Math.min(c + s, target); el.textContent = c + '+'; if (c >= target) clearInterval(t); }, 40); }
const sObs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { document.querySelectorAll('[data-target]').forEach(el => animateCount(el, +el.dataset.target)); sObs.disconnect(); } }); }, { threshold: .5 });
const stEl = document.querySelector('.hstats'); if (stEl) sObs.observe(stEl);

// ── NAV ACTIVE ──
const secs = document.querySelectorAll('section[id]'), nls = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => { let cur = ''; secs.forEach(s => { if (window.scrollY >= s.offsetTop - 220) cur = s.id; }); nls.forEach(a => { a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--indigo)' : ''; }); });

// ── DYNAMIC GREETING ──
const gEl = document.getElementById('greeting');
if (gEl) {
  const h = new Date().getHours();
  const g = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  gEl.textContent = `${g}, I'm`;
}
