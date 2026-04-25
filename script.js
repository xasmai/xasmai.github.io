/* XasmAI — site interactions */

(() => {
  'use strict';

  // ---- Nav: shadow on scroll ----
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (window.scrollY > 12) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Reveal on scroll ----
  const revealTargets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('in'));
  }

  // ---- Stat counter animation ----
  const stats = document.querySelectorAll('.stat-num[data-count]');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const dur = 1200;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(target * eased);
      el.textContent = value.toLocaleString('tr-TR');
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const so = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCount(e.target);
          so.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    stats.forEach(el => so.observe(el));
  } else {
    stats.forEach(animateCount);
  }

  // ---- Smooth-scroll offset for sticky nav ----
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = nav.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ---- Wizard terminal: live "step" loss tick ----
  const wizardTerm = document.getElementById('wizard-term');
  if (wizardTerm) {
    const cursor = wizardTerm.querySelector('.cursor');
    if (cursor) {
      let step = 1000;
      let loss = 3.018;
      let lr = 3.0e-04;
      const tickLine = () => {
        step += 100 + Math.floor(Math.random() * 50);
        loss = Math.max(1.6, loss - 0.005 - Math.random() * 0.015);
        const tps = 24500 + Math.floor(Math.random() * 600);
        const line = document.createElement('span');
        line.className = 'muted';
        line.textContent =
          `\nstep   ${String(step).padStart(4, ' ')} | ` +
          `loss ${loss.toFixed(3)} | ` +
          `lr ${lr.toExponential(1)} | ` +
          `tok/s ${tps.toLocaleString('en-US')}`;
        cursor.before(line);

        // Keep terminal scrolled to the bottom
        wizardTerm.scrollTop = wizardTerm.scrollHeight;

        // Limit growth
        const lines = wizardTerm.querySelectorAll('.muted');
        if (lines.length > 18) lines[3]?.remove();
      };

      // Only tick when terminal is visible (saves CPU)
      let timer = null;
      const start = () => { if (!timer) timer = setInterval(tickLine, 1400); };
      const stop  = () => { if (timer) { clearInterval(timer); timer = null; } };

      if ('IntersectionObserver' in window) {
        const vo = new IntersectionObserver((entries) => {
          entries.forEach(e => e.isIntersecting ? start() : stop());
        }, { threshold: 0.25 });
        vo.observe(wizardTerm);
      } else {
        start();
      }
    }
  }

  // ---- Subtle parallax for the bg glow ----
  const glow = document.querySelector('.bg-glow');
  if (glow && window.matchMedia('(min-width: 880px)').matches) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY * 0.15;
        glow.style.transform = `translateX(-50%) translateY(${y}px)`;
        ticking = false;
      });
    }, { passive: true });
  }
})();
