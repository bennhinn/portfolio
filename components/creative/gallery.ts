/** Guided CSS-3D exhibition. No scroll capture and no WebGL dependency. */
export function attachGallery(root: HTMLElement) {
  const found = root.querySelector<HTMLElement>('[data-kg-exhibition]');
  if (!found) return () => {};
  const exhibition: HTMLElement = found;
  const journey = exhibition.querySelector<HTMLElement>('[data-kg-journey]')!;
  const viewport = exhibition.querySelector<HTMLElement>('[data-kg-viewport]')!;
  const world = exhibition.querySelector<HTMLElement>('[data-kg-world]')!;
  const bays = Array.from(exhibition.querySelectorAll<HTMLElement>('[data-kg-bay]'));
  const modeButton = exhibition.querySelector<HTMLButtonElement>('[data-kg-mode-toggle]')!;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const controller = new AbortController();
  const { signal } = controller;
  let index = 0;
  let piece = 0;
  let compact = false;
  let travel = 0;
  let frame = 0;
  let mode: 'tour' | 'all' = reduced.matches || !CSS.supports('perspective', '1000px') ? 'all' : 'tour';
  let start: {x: number; y: number} | null = null;
  let suppressClick = false;
  let lastAnnounced = -1;
  const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));
  const text = (selector: string, value: string) => {
    const el = exhibition.querySelector<HTMLElement>(selector);
    if (el && el.textContent !== value) el.textContent = value;
  };

  function paint(position: number) {
    if (!bays.length) return;
    const next = clamp(Math.round(position), 0, bays.length - 1);
    if (next !== index) piece = 0;
    index = next;
    // Viewpoint advances through actual CSS planes along the depth axis.
    world.style.setProperty('--kg-depth', `${position * 1200 + 100}px`);
    world.style.setProperty('--kg-sway', `${Math.sin(position * Math.PI) * 3}deg`);
    world.style.setProperty('--kg-drift', `${Math.sin(position * Math.PI) * -110}px`);
    bays.forEach((bay, i) => {
      const distance = i - position;
      bay.style.visibility = distance < -.55 || distance > 2.6 ? 'hidden' : 'visible';
      // Opacity below 1 flattens CSS-3D descendants; cull rooms instead.
      bay.style.opacity = '1';
      bay.inert = i !== next;
      bay.setAttribute('aria-hidden', String(i !== next));
    });
    const bay = bays[next];
    const stations = Array.from(bay.querySelectorAll<HTMLElement>('.kg-station'));
    piece = Math.min(piece, Math.max(0, stations.length - 1));
    bays.forEach((room, roomIndex) => room.querySelectorAll<HTMLElement>('.kg-station').forEach((station, j) => {
      station.dataset.focused = String(j === piece);
      station.inert = roomIndex !== next || (compact && j !== piece);
      station.setAttribute('aria-hidden', String(roomIndex !== next || (compact && j !== piece)));
    }));
    exhibition.querySelectorAll<HTMLElement>('[data-kg-pieces]').forEach(group => {group.hidden = Number(group.dataset.kgPieces) !== next;});
    exhibition.querySelectorAll<HTMLElement>('[data-kg-piece]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.kgPiece) === piece)));
    text('[data-kg-piece-count]', `Artwork ${piece + 1} of ${stations.length}`);
    text('[data-kg-current]', String(next + 1).padStart(2, '0'));
    text('[data-kg-title]', bay.dataset.title || 'The studio');
    text('[data-kg-category]', bay.dataset.category || 'Selected work');
    text('[data-kg-note]', bay.dataset.note || '');
    exhibition.style.setProperty('--kg-accent', bay.dataset.accent || '#bcd8d7');
    const progress = exhibition.querySelector<HTMLElement>('[data-kg-progress]');
    if (progress) progress.style.transform = `scaleX(${bays.length > 1 ? position / (bays.length - 1) : 1})`;
    exhibition.querySelectorAll<HTMLButtonElement>('[data-kg-jump]').forEach(button => {
      button.setAttribute('aria-pressed', String(Number(button.dataset.kgJump) === next));
    });
    exhibition.querySelectorAll<HTMLButtonElement>('[data-kg-room]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.kgRoom === bay.dataset.category));
    });
    exhibition.querySelector<HTMLButtonElement>('[data-kg-prev]')!.disabled = next === 0 && (!compact || piece === 0);
    exhibition.querySelector<HTMLButtonElement>('[data-kg-next]')!.disabled = next === bays.length - 1 && (!compact || piece === stations.length - 1);
    if (lastAnnounced !== next) {
      text('[data-kg-announce]', `Room ${next + 1} of ${bays.length}. ${bay.dataset.title}. ${bay.dataset.category}.`);
      lastAnnounced = next;
    }
  }

  function update() {
    frame = 0;
    if (mode !== 'tour') return;
    const position = compact || reduced.matches || !travel
      ? index
      : clamp(-journey.getBoundingClientRect().top / travel, 0, 1) * Math.max(0, bays.length - 1);
    paint(position);
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  function measure() {
    compact = window.innerWidth < 760 || window.innerHeight < 520;
    exhibition.dataset.compact = String(compact);
    travel = compact || reduced.matches ? 0 : Math.max(0, bays.length - 1) * Math.min(window.innerHeight * 1.05, 900);
    exhibition.style.setProperty('--kg-travel', `${travel}px`);
    world.style.setProperty('--kg-scale', String(compact ? Math.min((viewport.clientWidth - 88) / 420, (viewport.clientHeight - 320) / 560) : Math.min(viewport.clientWidth / 1400, viewport.clientHeight / 790)));
    exhibition.querySelector('[data-kg-prev]')?.setAttribute('aria-label', compact ? 'Previous artwork' : 'Previous gallery room');
    exhibition.querySelector('[data-kg-next]')?.setAttribute('aria-label', compact ? 'Next artwork' : 'Next gallery room');
    text('[data-kg-instruction]', compact ? 'Swipe to browse · tap to examine' : 'Scroll to walk · select an artwork');
    schedule();
  }
  function setMode(next: 'tour' | 'all', move = false) {
    mode = next;
    exhibition.dataset.mode = mode;
    modeButton.textContent = mode === 'tour' ? 'View all works ↗' : 'Enter the gallery ↗';
    modeButton.setAttribute('aria-pressed', String(mode === 'all'));
    measure();
    if (move) exhibition.querySelector<HTMLElement>('[data-kg-heading]')?.scrollIntoView({behavior: 'instant', block: 'start'});
  }
  function go(next: number) {
    piece = 0;
    index = clamp(next, 0, bays.length - 1);
    if (mode !== 'tour') setMode('tour');
    if (compact || reduced.matches || !travel) {
      paint(index);
    } else {
      const top = journey.getBoundingClientRect().top + window.scrollY + (index / Math.max(1, bays.length - 1)) * travel;
      window.scrollTo({top, behavior: 'smooth'});
    }
  }
  function step(delta: number) {
    if (!compact) {go(index + delta); return;}
    const count = bays[index].querySelectorAll('.kg-station').length;
    if (piece + delta < 0 && index > 0) {index--; piece = bays[index].querySelectorAll('.kg-station').length - 1;}
    else if (piece + delta >= count && index < bays.length - 1) {index++; piece = 0;}
    else piece = clamp(piece + delta, 0, count - 1);
    paint(index);
  }
  exhibition.addEventListener('click', event => {
    const target = event.target as HTMLElement;
    if (target.closest('[data-kg-mode-toggle]')) setMode(mode === 'tour' ? 'all' : 'tour', true);
    if (target.closest('[data-kg-prev]')) step(-1);
    if (target.closest('[data-kg-next]')) step(1);
    const art = target.closest<HTMLElement>('[data-kg-piece]');
    if (art) {piece = Number(art.dataset.kgPiece); paint(index);}
    const jump = target.closest<HTMLElement>('[data-kg-jump]');
    if (jump) go(Number(jump.dataset.kgJump));
    const room = target.closest<HTMLElement>('[data-kg-room]');
    if (room) go(bays.findIndex(bay => bay.dataset.category === room.dataset.kgRoom));
    const filter = target.closest<HTMLButtonElement>('[data-kg-filter]');
    if (filter) {
      const key = filter.dataset.kgFilter;
      exhibition.querySelectorAll<HTMLElement>('[data-kg-index-group]').forEach(group => {group.hidden = key !== 'All' && group.dataset.kgIndexGroup !== key;});
      exhibition.querySelectorAll('[data-kg-filter]').forEach(button => button.setAttribute('aria-pressed', String(button === filter)));
      text('[data-kg-index-status]', key === 'All' ? 'Showing all artwork.' : `Showing ${key} artwork.`);
    }
  }, { signal });
  viewport.addEventListener('keydown', event => {
    if (mode !== 'tour' || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home' || event.key === 'End') go(event.key === 'Home' ? 0 : bays.length - 1);
    else step(event.key === 'ArrowRight' ? 1 : -1);
  }, { signal });
  viewport.addEventListener('pointerdown', event => { if (event.pointerType !== 'mouse') start = { x: event.clientX, y: event.clientY }; }, {signal, passive: true});
  viewport.addEventListener('pointerup', event => {
    if (!start) return;
    const dx = event.clientX - start.x, dy = event.clientY - start.y;
    start = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      suppressClick = true;
      step(dx < 0 ? 1 : -1);
    }
  }, {signal, passive: true});
  viewport.addEventListener('pointercancel', () => {start = null;}, {signal});
  viewport.addEventListener('click', event => {
    if (!suppressClick) return;
    event.preventDefault(); event.stopPropagation(); suppressClick = false;
  }, {signal, capture: true});
  viewport.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || compact || reduced.matches || mode !== 'tour') return;
    const rect = viewport.getBoundingClientRect();
    world.style.setProperty('--kg-look', `${((event.clientX - rect.left) / rect.width - .5) * -2}deg`);
  }, {signal, passive: true});
  viewport.addEventListener('pointerleave', () => world.style.setProperty('--kg-look', '0deg'), {signal});
  window.addEventListener('scroll', schedule, {signal, passive: true});
  window.addEventListener('resize', measure, {signal, passive: true});
  const onReduced = () => {if (reduced.matches) setMode('all', false); measure();};
  reduced.addEventListener('change', onReduced);
  const observer = new ResizeObserver(measure);
  observer.observe(viewport);
  setMode(mode);
  paint(0);
  return () => {
    controller.abort(); observer.disconnect(); reduced.removeEventListener('change', onReduced);
    if (frame) cancelAnimationFrame(frame);
  };
}
