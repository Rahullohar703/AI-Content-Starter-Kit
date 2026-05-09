// ── Particle Background ──
(function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(124,92,255,${p.opacity})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ── Navbar Scroll ──
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ── Scroll Reveal ──
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
reveals.forEach(el => observer.observe(el));

// ── FAQ Accordion ──
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// ── Terminal Typing Effect ──
(function initTerminal() {
  const lines = document.querySelectorAll('.term-line');
  const termObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        lines.forEach((line, i) => {
          line.style.opacity = '0';
          line.style.transform = 'translateY(10px)';
          setTimeout(() => {
            line.style.transition = 'opacity 0.5s, transform 0.5s';
            line.style.opacity = '1';
            line.style.transform = 'translateY(0)';
          }, i * 300);
        });
        termObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const terminal = document.querySelector('.terminal');
  if (terminal) termObserver.observe(terminal);
})();

// ── Smooth scroll for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── Razorpay Modal Fix ──
(function fixRazorpayModal() {
  let scrollY = 0;
  let modalOpen = false;

  function lockBody() {
    if (modalOpen) return;
    modalOpen = true;
    scrollY = window.scrollY;
    document.body.classList.add('razorpay-modal-open');
    document.body.style.top = `-${scrollY}px`;
  }

  function unlockBody() {
    if (!modalOpen) return;
    modalOpen = false;
    document.body.classList.remove('razorpay-modal-open');
    document.body.style.top = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.height = '';
    document.body.style.overflow = '';
    document.body.style.overflowX = '';
    document.body.style.overflowY = '';
    document.body.style.margin = '';
    document.body.style.padding = '';
    document.documentElement.style.overflow = '';
    document.documentElement.style.width = '';
    window.scrollTo(0, scrollY);
  }

  const obs = new MutationObserver(mutations => {
    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (!node.tagName) return;
        if (node.tagName === 'IFRAME' || node.tagName === 'DIV') {
          const src = node.getAttribute && node.getAttribute('src');
          const cls = node.className || '';
          if ((src && src.includes('razorpay')) || cls.includes('razorpay')) {
            lockBody();
          }
        }
      });
      m.removedNodes.forEach(node => {
        if (!node.tagName) return;
        const src = node.getAttribute && node.getAttribute('src');
        const cls = node.className || '';
        if ((src && src.includes('razorpay')) || cls.includes('razorpay')) {
          setTimeout(unlockBody, 100);
        }
      });
    });
  });
  obs.observe(document.body, { childList: true, subtree: true });
  obs.observe(document.documentElement, { childList: true });
})();
