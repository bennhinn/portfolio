/** Bounded desktop pointer + scroll parallax. No wheel capture or perpetual RAF. */
export function attachHeroParallax(frame: HTMLElement) {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 851px) and (hover: hover) and (pointer: fine)');
  const button = frame.querySelector<HTMLButtonElement>('[data-hp-motion]');
  const abort = new AbortController();
  const { signal } = abort;
  let paused = false;
  let visible = true;
  let raf = 0;
  let targetX = 0, targetY = 0, targetScroll = 0;
  let currentX = 0, currentY = 0, currentScroll = 0;
  let lastTime = 0;
  const enabled = () => !paused && !motion.matches && desktop.matches && visible && !document.hidden;
  const write = () => {
    frame.style.setProperty('--hp-x', `${currentX.toFixed(3)}px`);
    frame.style.setProperty('--hp-y', `${currentY.toFixed(3)}px`);
    frame.style.setProperty('--hp-scroll', `${currentScroll.toFixed(3)}px`);
    frame.style.setProperty('--hero-depth-x', `${(currentX * .35).toFixed(3)}px`);
    frame.style.setProperty('--hero-depth-y', `${(currentY * .35).toFixed(3)}px`);
  };
  function reset() {
    cancelAnimationFrame(raf); raf = 0; lastTime = 0;
    targetX = targetY = targetScroll = currentX = currentY = currentScroll = 0;
    write();
  }
  function tick(time: number) {
    raf = 0;
    if (!enabled()) { reset(); return; }
    const elapsed = lastTime ? Math.min(time - lastTime, 50) : 16;
    lastTime = time;
    const ease = 1 - Math.exp(-elapsed / 115);
    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;
    currentScroll += (targetScroll - currentScroll) * ease;
    const remaining = Math.abs(targetX - currentX) + Math.abs(targetY - currentY) + Math.abs(targetScroll - currentScroll);
    if (remaining < .03) {
      currentX = targetX; currentY = targetY; currentScroll = targetScroll; lastTime = 0;
    } else raf = requestAnimationFrame(tick);
    write();
  }
  function schedule() { if (enabled() && !raf) raf = requestAnimationFrame(tick); }
  function scroll() {
    if (!enabled()) return;
    const rect = frame.getBoundingClientRect();
    targetScroll = Math.max(-1, Math.min(1, -rect.top / Math.max(rect.height, 1))) * 36;
    schedule();
  }
  function sync() {
    frame.dataset.hpPaused = String(paused || motion.matches || !desktop.matches || !visible || document.hidden);
    if (button) {
      button.disabled = motion.matches;
      button.setAttribute('aria-pressed', String(paused || motion.matches));
      button.textContent = motion.matches ? 'Reduced motion' : paused ? 'Resume depth' : 'Pause depth';
    }
    if (!enabled()) reset(); else scroll();
  }
  frame.addEventListener('pointermove', event => {
    if (!enabled() || event.pointerType !== 'mouse') return;
    const rect = frame.getBoundingClientRect();
    targetX = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1)) * 16;
    targetY = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1)) * 12;
    schedule();
  }, { passive: true, signal });
  frame.addEventListener('pointerleave', () => { targetX = targetY = 0; schedule(); }, { signal });
  button?.addEventListener('click', () => { paused = !paused; sync(); }, { signal });
  window.addEventListener('scroll', scroll, { passive: true, signal });
  window.addEventListener('resize', scroll, { passive: true, signal });
  window.addEventListener('blur', reset, { signal });
  document.addEventListener('visibilitychange', sync, { signal });
  motion.addEventListener('change', sync);
  desktop.addEventListener('change', sync);
  const observer = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? true; sync(); });
  observer.observe(frame);
  sync();
  return () => {
    abort.abort(); observer.disconnect();
    motion.removeEventListener('change', sync); desktop.removeEventListener('change', sync);
    cancelAnimationFrame(raf);
    ['--hp-x', '--hp-y', '--hp-scroll', '--hero-depth-x', '--hero-depth-y'].forEach(name => frame.style.removeProperty(name));
    delete frame.dataset.hpPaused;
  };
}
