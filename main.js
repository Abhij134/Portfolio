
// ── FUTURISTIC LOADER LOGIC ──
const lNum = document.getElementById('lNum'),
  lFill = document.getElementById('lFill'),
  loader = document.getElementById('loader'),
  loaderScene = document.getElementById('loaderScene'),
  loaderLogoBox = document.getElementById('loaderLogoBox');

let progress = 0;
function startLoading() {
  const iv = setInterval(() => {
    const remaining = 100 - progress;
    // Aiming for ~1.5 seconds total
    const increment = remaining > 30 ? Math.random() * 3.0 + 1.2 : Math.random() * 1.5 + 0.5;
    progress = Math.min(progress + increment, 100);

    if (lNum && lNum.childNodes[0]) lNum.childNodes[0].textContent = Math.floor(progress);
    if (lFill) lFill.style.width = progress + '%';

    if (progress >= 100) {
      clearInterval(iv);
      if (lNum) lNum.classList.add('glitch-flicker');

      // Sequence: "Disappear in dark"
      // 1. Fade out the loader visuals into darkness
      // 2. Fade out the dark background itself
      setTimeout(() => {
        if (loader) {
          loader.classList.add('fade-content'); // fades out logo, rings, particles, leaving dark bg
          setTimeout(() => {
            loader.classList.add('hidden'); // fades out the dark background revealing content
            setTimeout(() => {
              loader.style.display = 'none';
            }, 1200); // Wait for CSS opacity transition
          }, 800); // Stay pure dark for 0.8s
        }
      }, 300);
    }

  }, 30);
}

// Start loader
setTimeout(startLoading, 400);

// Accelerate on click
document.addEventListener('click', () => { if (progress < 85) progress += 12; });

// Parallax effect on loader logo
document.addEventListener('mousemove', (e) => {
  if (loaderLogoBox && loader && !loader.classList.contains('hidden')) {
    const x = (e.clientX / window.innerWidth - 0.5) * 8;
    const y = (e.clientY / window.innerHeight - 0.5) * 8;
    loaderLogoBox.style.transform = `translate(${x}px, ${y}px)`;
  }
});

// ── CANVAS PARTICLE SYSTEM ──
(function () {
  const canvas = document.getElementById('loaderCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  const MAX = 25; // Reduced for subtlety
  // UI-matching palette: indigo, cyan, violet, teal
  const COLORS = [
    { r: '129', g: '140', b: '248' },  // --indigo  #818cf8
    { r: '34', g: '211', b: '238' },  // --cyan    #22d3ee
    { r: '192', g: '132', b: '252' },  // --violet  #c084fc
    { r: '165', g: '180', b: '252' },  // --indigo-light #a5b4fc
  ];

  function spawnParticle() {
    const cx = canvas.width / 2, cy = canvas.height / 2;
    const angle = Math.random() * Math.PI * 2;
    const radius = 30 + Math.random() * 80; // tight spawn near logo
    const col = COLORS[Math.floor(Math.random() * COLORS.length)];
    particles.push({
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -(Math.random() * 0.9 + 0.3),
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.2,
      life: 0,
      maxLife: 90 + Math.random() * 70,
      glow: Math.random() * 10 + 6,
      color: col,
    });
  }

  let rafId;
  function draw() {
    if (!loader || loader.classList.contains('hidden')) {
      cancelAnimationFrame(rafId);
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (particles.length < MAX) spawnParticle();

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life++;

      const ratio = p.life / p.maxLife;
      const fadeIn = ratio < 0.15 ? ratio / 0.15 : 1;
      const fadeOut = ratio > 0.7 ? 1 - (ratio - 0.7) / 0.3 : 1;
      const a = p.alpha * fadeIn * fadeOut;
      const { r, g, b } = p.color;

      ctx.save();
      ctx.globalAlpha = a;
      ctx.shadowBlur = p.glow;
      ctx.shadowColor = `rgba(${r},${g},${b},0.9)`;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (p.life >= p.maxLife) particles.splice(i, 1);
    }

    rafId = requestAnimationFrame(draw);
  }
  draw();
})();

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
const navFab = document.getElementById('navFab');

// Create overlay for sidebar backdrop tap-to-close
const navOverlay = document.createElement('div');
navOverlay.id = 'navOverlay';
navOverlay.style.cssText = `
  display: none; position: fixed; inset: 0; z-index: 995;
  background: rgba(0,0,0,0); transition: background 0.38s ease;
`;
document.body.appendChild(navOverlay);

function openNav() {
  if (hamburger) hamburger.classList.add('open');
  if (navFab) navFab.classList.add('open');
  navLinks.classList.add('open');
  navOverlay.style.display = 'block';
  requestAnimationFrame(() => navOverlay.style.background = 'rgba(0,0,0,0.5)');
}
function closeNav() {
  if (hamburger) hamburger.classList.remove('open');
  if (navFab) navFab.classList.remove('open');
  navLinks.classList.remove('open');
  navOverlay.style.background = 'rgba(0,0,0,0)';
  setTimeout(() => { navOverlay.style.display = 'none'; }, 380);
}

if (navLinks) {
  // Old hamburger toggle (desktop fallback)
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.contains('open') ? closeNav() : openNav();
    });
  }
  // Floating fab toggle (primary mobile)
  if (navFab) {
    navFab.addEventListener('click', () => {
      navLinks.classList.contains('open') ? closeNav() : openNav();
    });
  }
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeNav);
  });
  navOverlay.addEventListener('click', closeNav);
}


// ── DYNAMIC ROTATING TITLES ──
const roles = ['Front End Developer', 'Data Analyst', 'AI Engineer', 'ML Engineer'];
let roleIndex = 0;
function cycleRole(el) {
  if (!el) return;
  el.textContent = roles[0];
  el.style.transition = 'all 0.4s ease';
  setInterval(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(-12px)';
    setTimeout(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      el.style.transition = 'none';
      el.style.transform = 'translateY(12px)';
      el.textContent = roles[roleIndex];
      el.offsetHeight;
      el.style.transition = 'all 0.4s cubic-bezier(0.22,1,0.36,1)';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 380);
  }, 2800);
}
cycleRole(document.getElementById('dynamic-role'));

// ── ABOUT ROLE CYCLER ──
const aboutRoles = ['Front End Developer', 'Data Analyst', 'AI Engineer'];
let aboutRoleIdx = 0;
const aboutRoleEl = document.getElementById('about-role');
if (aboutRoleEl) {
  setInterval(() => {
    aboutRoleEl.classList.add('exiting');
    setTimeout(() => {
      aboutRoleIdx = (aboutRoleIdx + 1) % aboutRoles.length;
      aboutRoleEl.textContent = aboutRoles[aboutRoleIdx];
      aboutRoleEl.classList.remove('exiting');
      void aboutRoleEl.offsetWidth;
      aboutRoleEl.style.animation = 'none';
      void aboutRoleEl.offsetWidth;
      aboutRoleEl.style.animation = '';
    }, 320);
  }, 3000);
}

// ── SKILLS INTERACTIVITY ──
const filterBtns = document.querySelectorAll('.filter-btn');
const skillCards = document.querySelectorAll('.skill-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const category = btn.dataset.filter;
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    skillCards.forEach(card => {
      if (category === 'all' || card.dataset.category === category) {
        card.style.display = 'block';
        setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
      } else {
        card.style.opacity = '0'; card.style.transform = 'translateY(20px)';
        setTimeout(() => card.style.display = 'none', 300);
      }
    });
  });
});

// ── SKILLS SCROLL REVEAL ──
const skObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      entry.target.querySelectorAll('.skill-bar').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.sk-reveal').forEach(card => skObserver.observe(card));

// ── SKILL CARD 3D TILT ──
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const centerX = rect.width / 2, centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20, rotateY = (centerX - x) / 20;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
  });
});

// ── CURSOR GLOW ──
const curGlow = document.getElementById('cursorGlow');
if (curGlow) {
  document.addEventListener('mousemove', (e) => {
    curGlow.style.left = e.clientX + 'px';
    curGlow.style.top = e.clientY + 'px';
  });
}

// ── MINI-LLM TYPING EFFECT & LOGIC ──
const initTypewriter = () => {
  const typeTarget = document.getElementById("typewriterText");
  const responseBox = document.getElementById("llmResponseBox");
  
  if (!typeTarget) return;

  const textToType = 'coding_agent("Abhijeet Gautam");';
  let i = 0;

  // 1. Initial Typing Animation
  function typeWriter() {
    if (i < textToType.length) {
      typeTarget.innerHTML += textToType.charAt(i);
      i++;
      setTimeout(typeWriter, 50); // Speed of typing
    } else {
      // 2. Show response after typing finishes
      setTimeout(() => {
        responseBox.classList.remove("hidden");
        // Trigger a tiny animation for the reveal
        responseBox.animate([
          { opacity: 0, transform: 'translateY(10px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 400, fill: 'forwards', easing: 'ease-out' });
      }, 400); // slight pause before AI answers
    }
  }

  // Start the animation 1.5 seconds after page loads
  setTimeout(typeWriter, 1500);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTypewriter);
} else {
  initTypewriter();
}

// 3. Handle Button Clicks & Clear inside the Monitor
let activeLlmInterval = null;
let activeLlmTimeout = null;

window.clearLlmOutput = function() {
  const outputArea = document.getElementById("llmDynamicOutput");
  if (activeLlmInterval) clearInterval(activeLlmInterval);
  if (activeLlmTimeout) clearTimeout(activeLlmTimeout);
  if (outputArea) {
    outputArea.style.transition = "opacity 0.2s ease";
    outputArea.style.opacity = 0;
    setTimeout(() => {
      outputArea.innerHTML = "";
      outputArea.style.minHeight = "0px";
      outputArea.style.opacity = 1;
    }, 180);
  }
};

window.runLlmQuery = function(queryType) {
  const outputArea = document.getElementById("llmDynamicOutput");
  const llmBody = document.querySelector(".llm-body");
  if (!outputArea) return;

  // Clear any existing query timers
  if (activeLlmInterval) clearInterval(activeLlmInterval);
  if (activeLlmTimeout) clearTimeout(activeLlmTimeout);

  // Lock current height so terminal screen never shrinks or jumps/scrolls up automatically
  const currentHeight = outputArea.offsetHeight;
  if (currentHeight > 0) {
    outputArea.style.minHeight = currentHeight + "px";
  }
  
  if (queryType === 'tech_stack') {
    outputArea.style.opacity = 1;
    outputArea.innerHTML = "<span style='font-size: 11px; color: var(--teal);'>&gt; Executing ./fetch_stack.sh<span id='loadingDotsTech'>...</span></span>";
    
    if (llmBody) {
      llmBody.scrollTo({ top: llmBody.scrollHeight, behavior: 'smooth' });
    }

    let dotCount = 0;
    activeLlmInterval = setInterval(() => {
      const dotsEl = document.getElementById('loadingDotsTech');
      if (dotsEl) {
        dotCount = (dotCount + 1) % 4;
        dotsEl.textContent = '.'.repeat(dotCount);
      }
    }, 200);

    activeLlmTimeout = setTimeout(() => {
      clearInterval(activeLlmInterval);
      outputArea.innerHTML = "<div style='display:flex; justify-content:space-between; align-items:center;'><span style='color:#10B981; font-weight:600;'>Found : </span><button onclick='clearLlmOutput()' class='llm-clear-btn' title='Clear output'>clear</button></div>" +
                   "<span style='color:#10B981'>Front-End:</span> Next.js, React, Tailwind<br/>" +
                   "<span style='color:#A855F7'>Back-End:</span> Prisma, Supabase, PHP, Python<br/>" +
                   "<span style='color:#22D3EE'>Database:</span> MongoDB, PostgreSQL";
      outputArea.style.minHeight = "0px"; // Release height lock smoothly
      if (llmBody) {
        requestAnimationFrame(() => {
          llmBody.scrollTo({ top: llmBody.scrollHeight, behavior: 'smooth' });
        });
      }
    }, 1000); // 1 second delay
  } else if (queryType === 'projects') {
    outputArea.style.opacity = 1;
    outputArea.innerHTML = "<span style='font-size: 11px; color: var(--teal);'>&gt; Searching repos<span id='loadingDots'>...</span></span>";
    
    if (llmBody) {
      llmBody.scrollTo({ top: llmBody.scrollHeight, behavior: 'smooth' });
    }

    let dotCount = 0;
    activeLlmInterval = setInterval(() => {
      const dotsEl = document.getElementById('loadingDots');
      if (dotsEl) {
        dotCount = (dotCount + 1) % 4;
        dotsEl.textContent = '.'.repeat(dotCount);
      }
    }, 200);

    activeLlmTimeout = setTimeout(() => {
      clearInterval(activeLlmInterval);
      outputArea.innerHTML = "<div style='display:flex; justify-content:space-between; align-items:center;'><span style='color:#10B981; font-weight:600;'>Found : </span><button onclick='clearLlmOutput()' class='llm-clear-btn' title='Clear output'>clear</button></div>" +
                   "<span style='color:var(--muted); font-size: 10px;'>github.com/Abhij134</span><br/>" +
                   "[1] <span style='color:#fff'>FinanceNeo:</span> AI-Powered Financial Tracking<br/>" +
                   "[2] <span style='color:#fff'>Burzt:</span> Audio Tracker API Integration<br/>";
      outputArea.style.minHeight = "0px"; // Release height lock smoothly
      if (llmBody) {
        requestAnimationFrame(() => {
          llmBody.scrollTo({ top: llmBody.scrollHeight, behavior: 'smooth' });
        });
      }
    }, 1000); // 1 second delay
  }
};

// ── 3D MONITOR CURSOR TRACKING TILT ──
const monitorFrame = document.querySelector('.monitor-3d-frame');
if (monitorFrame) {
  document.addEventListener('mousemove', (e) => {
    // Calculate rotation based on cursor offset from screen center
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    
    // Tilt on X axis based on Y movement (range: -10 to +30 degrees)
    // Tilt on Y axis based on X movement (range: -35 to +5 degrees)
    const tiltX = 10 - (dy / cy) * 15;  // base: 10deg, offset: +/-15deg
    const tiltY = -15 + (dx / cx) * 20; // base: -15deg, offset: +/-20deg
    
    monitorFrame.style.setProperty('--rot-x', `${tiltX}deg`);
    monitorFrame.style.setProperty('--rot-y', `${tiltY}deg`);
  });
}

// ── SCROLL DOWN INDICATOR FADE LOGIC ──
const scrollIndicator = document.querySelector('.scroll-down-indicator');
if (scrollIndicator) {
  window.addEventListener('scroll', () => {
    // Fade out arrow when scrolled past 150px
    if (window.scrollY > 150) {
      scrollIndicator.classList.add('fade-out');
    } else {
      scrollIndicator.classList.remove('fade-out');
    }
  });
}

// ── SOCIAL LINKS TOGGLE LOGIC ──
const socialToggleBtn = document.getElementById('socialToggleBtn');
const socialPanel = document.getElementById('socialPanel');
if (socialToggleBtn && socialPanel) {
  socialToggleBtn.addEventListener('click', () => {
    socialToggleBtn.classList.toggle('active');
    socialPanel.classList.toggle('active');
  });
}