// Infalytics landing page motion. Content is fully visible without this file;
// every animation starts from a visible resting state and is skipped under reduced motion.

// Spotlight hover on tiles (pure CSS variables, runs regardless of GSAP).
document.querySelectorAll('.spot').forEach((el) => {
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// A page loaded hidden (background tab, preview, crawler) stays static and complete.
if (window.gsap && !reduce && document.visibilityState === 'visible') {
  const { gsap } = window;
  gsap.registerPlugin(window.ScrollTrigger);

  // Split the headline into words (short headline only, per the skill's guidance).
  const h = document.querySelector('[data-split]');
  if (h) {
    const words = h.textContent.trim().split(/\s+/);
    h.setAttribute('aria-label', h.textContent.trim());
    h.innerHTML = words.map((w) => `<span class="w" aria-hidden="true">${w}</span>`).join(' ');
  }

  // Count-up for figures, formatted like the resting text.
  const countUp = (el, delay = 0) => {
    const end = Number(el.dataset.count);
    const obj = { v: 0 };
    return gsap.to(obj, {
      v: end, duration: 1.4, delay, ease: 'power2.out',
      onUpdate: () => { el.textContent = Math.round(obj.v).toLocaleString('en-US'); },
    });
  };

  // Hero sequence.
  const bars = gsap.utils.toArray('.chart .bars rect');
  const mark = document.querySelector('.chart .mark');
  const len = mark ? mark.getTotalLength() : 0;
  if (mark) gsap.set(mark, { strokeDasharray: len, strokeDashoffset: len });

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from('.hero .eyebrow.reveal', { y: 12, opacity: 0, duration: 0.6 })
    .from('.headline .w', { y: 28, opacity: 0, rotateX: -35, duration: 0.8, stagger: 0.05 }, '-=0.35')
    .from('.hero-copy .reveal:not(.eyebrow)', { y: 14, opacity: 0, duration: 0.6, stagger: 0.08 }, '-=0.5')
    .from('.card-chart', { opacity: 0, y: 40, z: -120, duration: 1.1 }, 0.2)
    .from(bars, { scaleY: 0, transformOrigin: '50% 100%', duration: 0.9, stagger: 0.07, ease: 'power3.out' }, 0.55)
    .from('.chart .note', { opacity: 0, x: -8, duration: 0.5 }, 1.25)
    .to(mark, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, 1.2)
    .from('.card-readout', { opacity: 0, y: -24, z: 0, duration: 0.9, ease: 'back.out(1.4)' }, 0.7)
    .from('.card-status', { opacity: 0, x: 30, duration: 0.9, ease: 'back.out(1.4)' }, 0.85)
    .from('.card-status li', { opacity: 0, x: 10, duration: 0.4, stagger: 0.07 }, 1.1)
    .from('.card-finding', { opacity: 0, y: 30, duration: 0.9, ease: 'back.out(1.4)' }, 1.4);
  const heroFigure = document.querySelector('.card-readout [data-count]');
  if (heroFigure) tl.add(countUp(heroFigure), 0.8);
  // Never leave the hero blank: a background tab, link preview or crawler gets the finished state.
  const finishHero = () => { if (tl.progress() < 1) tl.progress(1); };
  setTimeout(finishHero, 3000);

  // Pointer parallax on the report stack (desktop only).
  const stack = document.querySelector('[data-tilt]');
  const hero = document.querySelector('.hero');
  if (stack && hero && window.matchMedia('(min-width: 961px) and (pointer: fine)').matches) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(stack, { rotateY: -16 + x * 10, rotateX: 8 - y * 8, duration: 0.8, ease: 'power2.out' });
    });
    hero.addEventListener('pointerleave', () => gsap.to(stack, { rotateY: -16, rotateX: 8, duration: 1, ease: 'power2.out' }));
    // Scroll depth: the stack drifts back as the hero leaves.
    gsap.to(stack, { yPercent: -6, z: -80, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }

  // Section reveals: children stagger in (8 or fewer per group).
  gsap.utils.toArray('.reveal-group').forEach((group) => {
    gsap.from(group.children, {
      opacity: 0, y: 24, duration: 0.6, stagger: 0.08, ease: 'power2.out',
      scrollTrigger: { trigger: group, start: 'top 85%' },
    });
  });
  gsap.utils.toArray('.reveal-rows').forEach((body) => {
    gsap.from(body.children, { opacity: 0, x: -12, duration: 0.45, stagger: 0.07, ease: 'power2.out', scrollTrigger: { trigger: body, start: 'top 85%' } });
  });

  // Pipeline: the line fills as you scroll, nodes light in turn.
  const fill = document.querySelector('.pipe-fill');
  if (fill) {
    gsap.fromTo(fill, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.pipeline', start: 'top 75%', end: 'bottom 55%', scrub: 0.6 } });
  }
  gsap.utils.toArray('.step').forEach((step, i) => {
    gsap.from(step, { opacity: 0.25, y: 16, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: '.pipeline', start: `top ${78 - i * 7}%` } });
    gsap.from(step.querySelector('.node'), { scale: 0.4, duration: 0.6, ease: 'back.out(2)', scrollTrigger: { trigger: '.pipeline', start: `top ${78 - i * 7}%` } });
  });

  // Count-ups outside the hero, when they scroll into view.
  gsap.utils.toArray('[data-count]').forEach((el) => {
    if (el.closest('.card-readout')) return;
    window.ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => countUp(el) });
  });

  // Same-question tile: the second answer lands a beat after the first.
  gsap.from('.run', { opacity: 0, y: 12, duration: 0.5, stagger: 0.35, ease: 'power2.out', scrollTrigger: { trigger: '.runs', start: 'top 88%' } });
}

// Use cases: filter the cards by audience. Without this script every card stays visible.
document.querySelectorAll('.uc-btn').forEach((btn, _, buttons) => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    document.querySelectorAll('.uc').forEach((card) => {
      card.hidden = filter !== 'all' && !card.dataset.for.split(' ').includes(filter);
    });
    window.ScrollTrigger?.refresh();
  });
});
