'use strict';

// 1. PARTICLE BACKGROUND
(function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  const resize = () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.a  = Math.random() * 0.5 + 0.1;
      this.hue = Math.random() > 0.5 ? 270 : 187; // purple or cyan
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.a})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 90; i++) particles.push(new Particle());

  // Draw connections
  const drawLines = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(168, 85, 247, ${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  };

  const animate = () => {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  };
  animate();
})();


//2. CURSOR GLOW
(function initCursor() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;
  let mx = 0, my = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  const animate = () => {
    cx += (mx - cx) * 0.1;
    cy += (my - cy) * 0.1;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(animate);
  };
  animate();
})();


//3. NAVBAR SCROLL + ACTIVE LINKS
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const links  = document.querySelectorAll('.nav-link');
  const sections = Array.from(document.querySelectorAll('section[id]'));

  const onScroll = () => {
    // Scrolled state
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    // Active section highlight
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


// 4. HAMBURGER MENU
(function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    links.classList.toggle('open');
    const open = links.classList.contains('open');
    btn.setAttribute('aria-expanded', open);
    const spans = btn.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      const spans = btn.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
})();



//   5. TYPEWRITER EFFECT
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const phrases = [
    'Back-End .NET Developer',
    'Clean Architecture Advocate',
    'API Craftsman',
    'System Designer',
  ];
  let pi = 0, ci = 0, deleting = false;

  const tick = () => {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; return setTimeout(tick, 2200); }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? 55 : 90);
  };
  setTimeout(tick, 800);
})();



//   6. SCROLL REVEAL
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children of same parent
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), idx * 80);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => obs.observe(el));
})();


// 7. SKILLS TABS
(function initTabs() {
  const btns   = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.skills-panel');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;

      btns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => {
        p.classList.remove('active');
        // Reset bars for re-animation
        p.querySelectorAll('.sk-fill').forEach(f => {
          f.style.transition = 'none';
          f.style.transform  = 'scaleX(0)';
        });
      });

      btn.classList.add('active');
      const panel = document.getElementById('tab-' + tab);
      if (panel) {
        panel.classList.add('active');
        // Re-animate bars
        setTimeout(() => {
          panel.querySelectorAll('.sk-fill').forEach(f => {
            f.style.transition = '';
            f.style.transform  = 'scaleX(1)';
          });
        }, 30);
      }
    });
  });
})();



// 8. CONTACT FORM (demo — opens mailto)
(function initForm() {
  const form     = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name    = form['name'].value.trim();
    const email   = form['email'].value.trim();
    const subject = form['subject'].value.trim();
    const message = form['message'].value.trim();

    if (!name || !email || !subject || !message) {
      feedback.textContent = '⚠️ Please fill in all fields.';
      feedback.className   = 'form-feedback error';
      return;
    }

    const mailto = `mailto:Mahmoudandelsamed@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
    window.location.href = mailto;

    feedback.textContent = ' Opening your email client…';
    feedback.className   = 'form-feedback success';
    form.reset();
    setTimeout(() => { feedback.textContent = ''; feedback.className = 'form-feedback'; }, 5000);
  });
})();



// 9. SMOOTH SCROLL FOR ALL INTERNAL LINKS

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});



// 10. SECTION ENTRANCE TILT (subtle 3D on cards)
(function initTilt() {
  document.querySelectorAll('.project-card, .info-card, .tl-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-4px) rotateY(${dx * 5}deg) rotateX(${-dy * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s linear';
    });
  });
})();
