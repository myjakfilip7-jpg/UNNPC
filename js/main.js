/* ==========================================================
   main.js — GSAP + ScrollTrigger choreography
   ========================================================== */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktop = window.matchMedia('(min-width: 901px)').matches;
  const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

  // NPC meter days (static data for now)
  const meter = document.getElementById('meterDays');
  if (meter) {
    const pattern = [1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1];
    meter.innerHTML = pattern.map((d) => `<i class="${d ? 'on' : 'off'}"></i>`).join('') +
      Array.from({ length: 17 }, () => '<i></i>').join('');
  }

  // Nav border on scroll
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (!hasGsap || reduced) {
    document.documentElement.classList.add('reduced');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- progress bar ---------- */
  gsap.to('#progressBar', {
    scaleX: 1, ease: 'none',
    scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
  });

  /* ---------- hero: split headline ---------- */
  const title = document.querySelector('[data-split]');
  if (title) {
    title.innerHTML = title.innerHTML.split(/(<br\s*\/?>)/i).map((chunk) => {
      if (/<br/i.test(chunk)) return chunk;
      const tmp = document.createElement('div');
      tmp.innerHTML = chunk;
      return Array.from(tmp.childNodes).map((node) => {
        const isAcc = node.nodeType === 1;
        const words = node.textContent.split(' ').filter(Boolean);
        return words.map((w) => `<span class="word"><span class="${isAcc ? 'acc' : ''}">${w}</span></span>`).join(' ');
      }).join('');
    }).join('');
  }

  const intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
  intro
    .from('.hero__title .word > span', { yPercent: 110, duration: 1, stagger: 0.06 }, 0.1)
    .to('.hero [data-reveal]', { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 }, 0.5)
    .from('.chips .chip', { opacity: 0, y: -10, duration: 0.5, stagger: 0.08 }, 0.2)
    .from('#heroTilt', { opacity: 0, y: 60, duration: 1.2 }, 0.3)
    .from('.stage__float', { opacity: 0, scale: 0.8, duration: 0.6, stagger: 0.1 }, 0.9);

  /* ---------- hero: 3D screenshot flattens on scroll ---------- */
  gsap.to('#heroShot', {
    rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom 40%', scrub: 0.6 },
  });
  gsap.to('#heroTilt', {
    y: 120, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
  });

  /* ---------- hero: mouse parallax tilt ---------- */
  if (desktop) {
    const tilt = document.getElementById('heroTilt');
    const qx = gsap.quickTo(tilt, 'rotateY', { duration: 0.6, ease: 'power3' });
    const qy = gsap.quickTo(tilt, 'rotateX', { duration: 0.6, ease: 'power3' });
    document.getElementById('hero').addEventListener('mousemove', (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      qx(px * 10); qy(-py * 8);
    });
    document.getElementById('hero').addEventListener('mouseleave', () => { qx(0); qy(0); });
  }

  /* ---------- floating chips ---------- */
  gsap.utils.toArray('[data-float]').forEach((el, i) => {
    gsap.to(el, { y: i % 2 ? -10 : 10, duration: 2.2 + i * 0.3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  });

  /* ---------- ticker ---------- */
  gsap.to('#ticker', { xPercent: -50, duration: 28, ease: 'none', repeat: -1 });

  /* ---------- generic reveals ---------- */
  gsap.utils.toArray('[data-reveal]:not(.hero [data-reveal])').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  /* ---------- counters ---------- */
  gsap.utils.toArray('[data-count]').forEach((el) => {
    const target = +el.dataset.count;
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target, duration: 1.2, ease: 'power2.out',
      onUpdate: () => { el.textContent = Math.round(obj.v); },
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });

  /* ---------- modules: pinned deck scrollytelling ---------- */
  if (desktop) {
    const cards = gsap.utils.toArray('.deck__card');
    const steps = gsap.utils.toArray('.step');
    const n = cards.length;

    gsap.set(cards, { rotateY: 35, rotateX: 8, x: 140, z: -200, opacity: 0 });
    gsap.set(cards[0], { rotateY: 0, rotateX: 0, x: 0, z: 0, opacity: 1 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#modulesPin', pin: true, start: 'top top',
        end: () => `+=${n * 700}`, scrub: 0.8,
        onUpdate: (self) => {
          const idx = Math.min(n - 1, Math.floor(self.progress * n + 0.0001));
          steps.forEach((s, i) => s.classList.toggle('is-active', i === idx));
        },
      },
    });

    for (let i = 1; i < n; i++) {
      tl.to(cards[i - 1], { rotateY: -30, rotateX: -6, x: -120, z: -250, opacity: 0, duration: 1, ease: 'power2.inOut' }, i)
        .to(cards[i], { rotateY: 0, rotateX: 0, x: 0, z: 0, opacity: 1, duration: 1, ease: 'power2.inOut' }, i);
    }
    tl.to({}, { duration: 0.6 }); // hold on the last card
  }

  /* ---------- level up: XP bar scrub ---------- */
  const xp = { v: 0 };
  gsap.timeline({
    scrollTrigger: { trigger: '#levelup', start: 'top 60%', end: 'center 40%', scrub: 0.5 },
  })
    .to('#xpFill', { width: '100%', ease: 'none' }, 0)
    .to(xp, { v: 3000, ease: 'none', onUpdate: () => { document.getElementById('xpNow').textContent = String(Math.round(xp.v)).replace(/\B(?=(\d{3})+(?!\d))/g, document.documentElement.lang === 'en' ? ',' : '\u00a0'); } }, 0);

  ScrollTrigger.create({
    trigger: '#levelup', start: 'center 40%', once: true,
    onEnter: () => {
      gsap.timeline()
        .to('#xpBurst', { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(2)' })
        .to('#xpLevel', { textContent: 13, snap: { textContent: 1 }, duration: 0.3 }, 0.2)
        .fromTo('#xpFill', { boxShadow: '0 0 24px rgba(182,243,106,0.6)' }, { boxShadow: '0 0 60px rgba(182,243,106,1)', duration: 0.3, yoyo: true, repeat: 1 }, 0);
    },
  });

  /* ---------- themes: horizontal pinned scroll ---------- */
  if (desktop) {
    const track = document.getElementById('themesTrack');
    const dist = () => track.scrollWidth - window.innerWidth + 72;
    const horiz = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: '#themesPin', pin: true, start: 'top top',
        end: () => `+=${dist()}`, scrub: 0.8, invalidateOnRefresh: true,
      },
    });
    gsap.utils.toArray('.theme .shot').forEach((s) => {
      gsap.fromTo(s, { rotateY: 22 }, {
        rotateY: -22, ease: 'none',
        scrollTrigger: { trigger: s, containerAnimation: horiz, start: 'left right', end: 'right left', scrub: true },
      });
    });
  }

  /* ---------- pricing: hover tilt ---------- */
  if (desktop) {
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      const rx = gsap.quickTo(card, 'rotateX', { duration: 0.4 });
      const ry = gsap.quickTo(card, 'rotateY', { duration: 0.4 });
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 8);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
      });
      card.addEventListener('mouseleave', () => { rx(0); ry(0); });
    });
  }

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
