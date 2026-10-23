/** Native progressive motion. No scroll interception, cursor replacement or animation dependency. */
export function mountSelectedWork(root) {
 if (!root) return () => {};
 const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
 const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
 const button = root.querySelector('[data-work-motion]');
 const label = root.querySelector('[data-work-motion-label]');
 const cards = [...root.querySelectorAll('.project-frame')];
 const entrants = [...root.querySelectorAll('.work-head, .project-frame, .gallery-head')];
 const visibleCards = new Set();
 const removeListeners = [];
 let userPaused = false, sectionVisible = false, destroyed = false;
 let pointerFrame = 0, scrollFrame = 0, activeCard = null, retiringCard = null;
 let x = 0, y = 0, targetX = 0, targetY = 0;
 const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
 const enabled = () => !reduced.matches && !userPaused && !document.hidden;
 const listen = (target, type, handler, options) => {
  target.addEventListener(type, handler, options);
  removeListeners.push(() => target.removeEventListener(type, handler, options));
 };
 const clearCard = card => {
  if (!card) return;
  ['--turn-x', '--turn-y', '--slide-x', '--slide-y', '--light-x', '--light-y'].forEach(name => card.style.removeProperty(name));
  card.classList.remove('is-pointer-active');
 };
 const stopPointer = () => {
  if (pointerFrame) cancelAnimationFrame(pointerFrame);
  pointerFrame = 0;
  clearCard(activeCard); clearCard(retiringCard);
  activeCard = retiringCard = null;
  x = y = targetX = targetY = 0;
  root.style.removeProperty('--orbit-x'); root.style.removeProperty('--orbit-y');
 };
 const stopScroll = () => {
  if (scrollFrame) cancelAnimationFrame(scrollFrame);
  scrollFrame = 0;
 };
 const animatePointer = () => {
  pointerFrame = 0;
  if (destroyed || !enabled() || !sectionVisible || !finePointer.matches) return;
  x += (targetX - x) * .13;
  y += (targetY - y) * .13;
  const card = activeCard || retiringCard;
  if (card) {
   card.style.setProperty('--turn-x', `${(-y * 4).toFixed(3)}deg`);
   card.style.setProperty('--turn-y', `${(x * 5).toFixed(3)}deg`);
   card.style.setProperty('--slide-x', `${(x * 9).toFixed(3)}px`);
   card.style.setProperty('--slide-y', `${(y * 7).toFixed(3)}px`);
   card.style.setProperty('--light-x', `${(50 + x * 50).toFixed(2)}%`);
   card.style.setProperty('--light-y', `${(50 + y * 50).toFixed(2)}%`);
  }
  root.style.setProperty('--orbit-x', `${(x * 12).toFixed(3)}px`);
  root.style.setProperty('--orbit-y', `${(y * 10).toFixed(3)}px`);
  if (Math.abs(targetX - x) + Math.abs(targetY - y) > .002) pointerFrame = requestAnimationFrame(animatePointer);
  else if (retiringCard) { clearCard(retiringCard); retiringCard = null; }
 };
 const onPointer = event => {
  if (!enabled() || !sectionVisible || !finePointer.matches || event.pointerType === 'touch') return;
  const card = event.target.closest?.('.project-frame');
  if (card !== activeCard) {
   clearCard(activeCard); clearCard(retiringCard); retiringCard = null;
   activeCard = card && root.contains(card) ? card : null;
  }
  const surface = activeCard || root.querySelector('.work-head');
  const rect = surface.getBoundingClientRect();
  targetX = clamp((event.clientX - rect.left) / rect.width * 2 - 1, -1, 1);
  targetY = clamp((event.clientY - rect.top) / rect.height * 2 - 1, -1, 1);
  activeCard?.classList.add('is-pointer-active');
  if (!pointerFrame) pointerFrame = requestAnimationFrame(animatePointer);
 };
 const onPointerLeave = () => {
  clearCard(retiringCard);
  retiringCard = activeCard; activeCard = null;
  retiringCard?.classList.remove('is-pointer-active');
  targetX = targetY = 0;
  if (enabled() && sectionVisible && finePointer.matches && !pointerFrame) pointerFrame = requestAnimationFrame(animatePointer);
 };
 const updateScroll = () => {
  scrollFrame = 0;
  if (destroyed || !enabled() || !sectionVisible) return;
  const viewport = window.innerHeight;
  const rect = root.getBoundingClientRect();
  root.style.setProperty('--path-progress', clamp((viewport * .55 - rect.top) / rect.height, 0, 1).toFixed(4));
  visibleCards.forEach(card => {
   if (!card.querySelector('.work-stage')) return;
   const bounds = card.getBoundingClientRect();
   const shift = clamp((bounds.top + bounds.height / 2 - viewport / 2) / viewport, -1, 1) * -18;
   card.style.setProperty('--scroll-lift', `${shift.toFixed(2)}px`);
  });
 };
 const onScroll = () => {
  if (enabled() && sectionVisible && !scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
 };
 const sync = () => {
  const moving = enabled();
  root.classList.toggle('work-motion-ready', moving);
  root.classList.toggle('work-playing', moving && sectionVisible);
  root.classList.toggle('work-still', !moving);
  if (button) {
   button.hidden = false;
   button.disabled = reduced.matches;
   button.setAttribute('aria-pressed', String(userPaused || reduced.matches));
   button.setAttribute('aria-label', reduced.matches ? 'Selected Work motion follows your reduced motion preference' : userPaused ? 'Resume Selected Work motion' : 'Pause Selected Work motion');
  }
  if (label) label.textContent = reduced.matches ? 'Reduced motion' : userPaused ? 'Resume motion' : 'Pause motion';
  if (!moving || !finePointer.matches || !sectionVisible) stopPointer();
  if (!moving) {
   stopScroll();
   cards.forEach(card => card.style.removeProperty('--scroll-lift'));
   entrants.forEach(item => item.classList.add('is-revealed'));
  } else if (sectionVisible) onScroll();
  else stopScroll();
 };
 entrants.forEach(item => item.classList.add('work-enter'));
 let observer;
 if ('IntersectionObserver' in window) {
  observer = new IntersectionObserver(entries => {
   entries.forEach(entry => {
    if (entry.target === root) { sectionVisible = entry.isIntersecting; sync(); }
    else if (entry.isIntersecting) {
     entry.target.classList.add('is-revealed');
     if (entry.target.classList.contains('project-frame')) visibleCards.add(entry.target);
    } else visibleCards.delete(entry.target);
   });
   onScroll();
  }, { threshold: 0, rootMargin: '0px 0px -32px 0px' });
  observer.observe(root);
  entrants.forEach(item => observer.observe(item));
 } else {
  sectionVisible = true;
  entrants.forEach(item => item.classList.add('is-revealed'));
  cards.forEach(card => visibleCards.add(card));
 }
 if (button) listen(button, 'click', () => { userPaused = !userPaused; sync(); });
 listen(root, 'pointermove', onPointer, { passive: true });
 listen(root, 'pointerleave', onPointerLeave, { passive: true });
 listen(window, 'scroll', onScroll, { passive: true });
 listen(window, 'resize', onScroll, { passive: true });
 listen(document, 'visibilitychange', sync);
 listen(reduced, 'change', sync);
 listen(finePointer, 'change', sync);
 sync();
 return () => {
  destroyed = true;
  observer?.disconnect(); removeListeners.forEach(remove => remove());
  stopPointer(); stopScroll();
  cards.forEach(card => card.style.removeProperty('--scroll-lift'));
  entrants.forEach(item => item.classList.remove('work-enter', 'is-revealed'));
  root.classList.remove('work-motion-ready', 'work-playing', 'work-still');
  root.style.removeProperty('--path-progress');
  if (button) button.hidden = true;
 };
}
