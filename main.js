// ── LOADER ──
const lFill = document.getElementById('lFill'), lNum = document.getElementById('lNum'), lLbl = document.getElementById('lLbl'), loader = document.getElementById('loader');
const steps = [{ l: 'Setting up design…', s: 'ls1' }, { l: 'Loading projects…', s: 'ls2' }, { l: 'Launching portfolio…', s: 'ls3' }];
let p = 0;


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
window.addEventListener('scroll', () => {
  let cur = '';
  secs.forEach(s => {
    if (window.scrollY >= s.offsetTop - 220) cur = s.id;
  });
  nls.forEach(a => {
    // Clear any lingering inline styles from the previous version
    a.style.color = '';
    
    if (a.getAttribute('href') === '#' + cur) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
});

// ── DYNAMIC GREETING ──
const gEl = document.getElementById('greeting');
if (gEl) {
  const h = new Date().getHours();
  const g = h < 12 ? 'Hi, Good morning' : h < 17 ? 'Hi, Good afternoon' : h < 21 ? 'Hi, Good evening' : 'Hi Night Owl!';
  gEl.textContent = `${g}, I'm`;
}

// ── HAMBURGER NAV ──
const hamburger = document.getElementById('navHamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  // Close menu when a nav link is clicked
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

// ── DYNAMIC ROTATING TITLES ──
const roles = ["Front End Dev", "AI Integration", "Data Analyst", "ML Engineer"];
let roleIndex = 0;
const roleEl = document.getElementById('dynamic-role');

if (roleEl) {
  // Set initial text
  roleEl.textContent = roles[0];
  
  setInterval(() => {
    // Phase 1: Fade out and move UP
    roleEl.style.opacity = '0';
    roleEl.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
      // Phase 2: Change text and reset to BOTTOM position instantly
      roleIndex = (roleIndex + 1) % roles.length;
      roleEl.style.transition = 'none'; // Disable transition for instant reset
      roleEl.style.transform = 'translateY(10px)';
      roleEl.textContent = roles[roleIndex];
      
      // Force reflow to ensure the 'none' transition is applied before we turn it back on
      roleEl.offsetHeight; 
      
      // Phase 3: Fade in and move UP to center
      roleEl.style.transition = 'all 0.4s ease';
      roleEl.style.opacity = '1';
      roleEl.style.transform = 'translateY(0)';
    }, 400); 
  }, 2500);
}