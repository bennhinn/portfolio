(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const all = selector => [...document.querySelectorAll(selector)];
  const screens = JSON.parse($('#screen-data').textContent);
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false;
  try { paused = localStorage.getItem('seatly-motion') === 'paused'; } catch {}
  const animations = new Set();
  const motionAllowed = () => !paused && !preference.matches && !document.hidden;
  function updateMotion() {
    const enabled = motionAllowed();
    document.documentElement.dataset.motion = enabled ? 'on' : 'off';
    $('#motion-toggle').textContent = preference.matches ? 'Reduced motion on' : paused ? '▷ Resume motion' : 'Ⅱ Pause motion';
    $('#motion-toggle').setAttribute('aria-pressed', String(paused || preference.matches));
    if (!enabled) { animations.forEach(a => a.cancel()); animations.clear(); }
  }
  $('#motion-toggle').addEventListener('click', () => {
    if (preference.matches) return;
    paused = !paused;
    try { localStorage.setItem('seatly-motion', paused ? 'paused' : 'on'); } catch {}
    updateMotion();
  });
  preference.addEventListener('change', updateMotion);
  document.addEventListener('visibilitychange', updateMotion);
  updateMotion();
  function animate(el, frames, options) {
    if (!motionAllowed() || !el.animate) return;
    const animation = el.animate(frames, options);
    animations.add(animation);
    animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animate(entry.target, [{ opacity: .35, transform: 'translateY(26px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 900, easing: 'cubic-bezier(.22,.75,.22,1)' });
        observer.unobserve(entry.target);
      });
    }, { threshold: .12 });
    all('[data-reveal]').forEach(el => observer.observe(el));
  }
  const scene = $('.hero-scene'), rig = $('.scene-rig');
  scene.addEventListener('pointermove', event => {
    if (!motionAllowed() || event.pointerType !== 'mouse' || window.innerWidth < 761) return;
    const rect = scene.getBoundingClientRect();
    rig.style.setProperty('--ry', ((event.clientX - rect.left) / rect.width - .5) * 6 + 'deg');
    rig.style.setProperty('--rx', -((event.clientY - rect.top) / rect.height - .5) * 4 + 'deg');
  }, { passive: true });
  scene.addEventListener('pointerleave', () => { rig.style.setProperty('--ry', '0deg'); rig.style.setProperty('--rx', '0deg'); });

  const chapters = [
    { title: 'Somewhere new.\nSomething familiar.', text: 'Explore buses, matatus and flights, then compare route options with clear fares, departure times and seat availability.', primary: 0, secondary: 1, label: 'DISCOVER', caption: 'Explore / Find a trip' },
    { title: 'Your journey.\nYour window seat.', text: 'Review the trip, then make a visual choice. Distinct seat states separate available, selected and reserved places at a glance.', primary: 3, secondary: 2, label: 'CHOOSE', caption: 'Trip details / Seat selection' },
    { title: 'A familiar finish.\nA calmer checkout.', text: 'Passenger details lead into an M-Pesa payment concept, with the fare and next action kept visible. Payment integration remains in development.', primary: 5, secondary: 4, label: 'PAY', caption: 'Passenger details / M-Pesa checkout' },
    { title: 'Less searching.\nMore going.', text: 'A digital boarding pass concept brings the trip details together. My Journeys keeps upcoming bookings within reach after checkout.', primary: 6, secondary: 7, label: 'TRAVEL', caption: 'Digital ticket / My journeys' }
  ];
  const tabs = all('[data-chapter]');
  function setPhone(selector, index) {
    const button = $(selector), img = button.querySelector('img');
    button.dataset.screen = String(index);
    button.setAttribute('aria-label', 'Enlarge ' + screens[index].title + ' screen');
    img.src = screens[index].preview;
    img.alt = 'Seatly ' + screens[index].title + ' screen';
  }
  function setChapter(index) {
    const chapter = chapters[index];
    tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
    $('#journey-panel').setAttribute('aria-labelledby', 'chapter-' + index);
    $('#journey-heading').replaceChildren(...chapter.title.split('\n').flatMap((line, i) => i ? [document.createElement('br'), document.createTextNode(line)] : [document.createTextNode(line)]));
    $('#journey-copy').textContent = chapter.text;
    $('#journey-number').textContent = '0' + (index + 1) + ' / ' + chapter.label;
    $('#journey-caption').textContent = chapter.caption;
    $('#journey-enlarge').dataset.screen = String(chapter.primary);
    setPhone('#journey-primary', chapter.primary);
    setPhone('#journey-secondary', chapter.secondary);
    animate($('.journey-copy'), [{ opacity: .25, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 650, easing: 'cubic-bezier(.22,.75,.22,1)' });
    animate($('.journey-visual'), [{ opacity: .4, transform: 'translateY(15px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 750, easing: 'cubic-bezier(.22,.75,.22,1)' });
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => setChapter(i));
    tab.addEventListener('keydown', e => {
      let next;
      if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') next = (i + tabs.length - 1) % tabs.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { e.preventDefault(); setChapter(next); tabs[next].focus(); }
    });
  });
  all('[data-seat]').forEach(button => button.addEventListener('click', () => {
    all('[data-seat]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    $('#seat-demo-label').textContent = 'Seat ' + button.dataset.seat + ' selected. Surface preview only.';
  }));
  const rail = $('#screen-rail');
  function moveRail(direction) { rail.scrollBy({ left: direction * (rail.querySelector('.screen-card').getBoundingClientRect().width + 28), behavior: motionAllowed() ? 'smooth' : 'auto' }); }
  $('#rail-prev').addEventListener('click', () => moveRail(-1));
  $('#rail-next').addEventListener('click', () => moveRail(1));
  rail.addEventListener('keydown', e => { if (e.target !== rail) return; if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); moveRail(e.key === 'ArrowRight' ? 1 : -1); } });

  const dialog = $('#screen-dialog');
  let current = 0, previousFocus = null, previousOverflow = '';
  function showScreen(index) {
    current = (index + screens.length) % screens.length;
    const screen = screens[current];
    $('#viewer-image').src = screen.original;
    $('#viewer-image').alt = 'Seatly ' + screen.title + ' — original design screen';
    $('#viewer-title').textContent = screen.title;
    $('#viewer-count').textContent = String(current + 1).padStart(2, '0') + ' / ' + String(screens.length).padStart(2, '0');
    $('#viewer-original').href = screen.original;
  }
  all('[data-screen]').forEach(button => button.addEventListener('click', () => {
    previousFocus = button; showScreen(Number(button.dataset.screen));
    previousOverflow = document.body.style.overflow;
    dialog.showModal(); document.body.style.overflow = 'hidden'; $('#viewer-close').focus();
  }));
  $('#viewer-prev').addEventListener('click', () => showScreen(current - 1));
  $('#viewer-next').addEventListener('click', () => showScreen(current + 1));
  $('#viewer-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog || e.target.classList.contains('viewer-inner')) dialog.close(); });
  dialog.addEventListener('keydown', e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); showScreen(current + (e.key === 'ArrowRight' ? 1 : -1)); } });
  dialog.addEventListener('close', () => { document.body.style.overflow = previousOverflow; previousFocus?.focus(); });
})();
