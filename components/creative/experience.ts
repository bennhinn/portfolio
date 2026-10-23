import type { Work } from './data';

/** Campaign controls and a shared, accessible artwork viewer. */
export function attachCreative(root: HTMLElement, works: Work[]) {
  const controller = new AbortController();
  const { signal } = controller;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const stage = root.querySelector<HTMLElement>('.dc-stage');
  const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-dc-slide]'));
  const selectors = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-dc-select]'));
  const dialog = root.querySelector<HTMLDialogElement>('[data-dc-dialog]')!;
  const media = root.querySelector<HTMLElement>('[data-dc-modal-media]')!;
  const byId = new Map(works.map(work => [work.id, work]));
  const archiveOrder = Array.from(root.querySelectorAll<HTMLElement>('.kg-index [data-dc-open]')).map(el => byId.get(el.dataset.dcOpen!)).filter((work): work is Work => !!work);
  let slide = 0;
  let playing = false;
  let visible = true;
  let timer: ReturnType<typeof setInterval> | undefined;
  let currentWork = 0;
  let viewerWorks = works;
  let returnFocus: HTMLElement | null = null;
  let savedOverflow = '';
  let savedPadding = '';
  let savedScroll = { x: 0, y: 0 };
  let downX: number | null = null;
  const write = (selector: string, value: string) => {
    const node = root.querySelector<HTMLElement>(selector);
    if (node) node.textContent = value;
  };
  function select(index: number, announce = true) {
    if (!slides.length || !stage) return;
    slide = (index + slides.length) % slides.length;
    slides.forEach((node, i) => {
      node.dataset.active = String(i === slide);
      node.setAttribute('aria-hidden', String(i !== slide));
      node.inert = i !== slide;
    });
    selectors.forEach((node, i) => node.setAttribute('aria-pressed', String(i === slide)));
    const node = slides[slide];
    stage.style.setProperty('--dc-accent', node.dataset.accent || '#155aee');
    stage.style.setProperty('--dc-paper', node.dataset.paper || '#e8efff');
    stage.style.setProperty('--dc-ink', node.dataset.ink || '#102c67');
    write('[data-dc-status]', `${String(slide + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`);
    const bar = root.querySelector<HTMLElement>('[data-dc-progress]');
    if (bar) bar.style.transform = `scaleX(${(slide + 1) / slides.length})`;
    if (announce) write('[data-dc-announce]', node.getAttribute('aria-label') || 'Campaign changed.');
  }
  function syncPlayback() {
    clearInterval(timer); timer = undefined;
    const button = root.querySelector<HTMLButtonElement>('[data-dc-play]');
    button?.setAttribute('aria-pressed', String(playing));
    write('[data-dc-play-label]', playing ? 'Pause reel' : 'Play reel');
    write('[data-dc-play-icon]', playing ? 'Ⅱ' : '▶');
    if (playing && visible && !document.hidden && !dialog.open && !reduced.matches) timer = setInterval(() => select(slide + 1, false), 6000);
  }
  function renderWork() {
    const work = viewerWorks[currentWork];
    if (!work) return;
    media.querySelector('video')?.pause();
    media.replaceChildren();
    write('[data-dc-modal-category]', work.category);
    write('[data-dc-modal-title]', work.title);
    write('[data-dc-modal-subtitle]', work.subtitle);
    write('[data-dc-modal-count]', `${currentWork + 1} / ${viewerWorks.length}`);
    const original = root.querySelector<HTMLAnchorElement>('[data-dc-original]');
    if (original) {
      original.href = work.src;
      if (work.src.startsWith('data:')) {original.download = work.id + (work.kind === 'video' ? '.mp4' : '.webp'); original.textContent = 'Download original ↓';}
      else {original.removeAttribute('download'); original.textContent = 'Open original ↗';}
    }
    const node = document.createElement(work.kind === 'video' ? 'video' : 'img');
    node.src = work.src;
    if (node instanceof HTMLVideoElement) {
      node.controls = true; node.playsInline = true; node.preload = 'metadata'; node.poster = work.thumb;
    } else {node.alt = work.title; node.decoding = 'async';}
    node.addEventListener('error', () => {
      const error = document.createElement('p');
      error.className = 'kg-media-error';
      error.textContent = 'This artwork could not load. Use “Open original” to try it directly.';
      media.replaceChildren(error);
    }, {once: true});
    media.append(node);
  }
  function open(id: string, trigger: HTMLElement) {
    const ordered = trigger.closest('[data-kg-exhibition]') ? archiveOrder : works;
    viewerWorks = ordered.length ? ordered : works;
    currentWork = viewerWorks.findIndex(work => work.id === id);
    if (currentWork < 0) return;
    returnFocus = trigger;
    renderWork();
    if (!dialog.open) {
      savedScroll = {x: window.scrollX, y: window.scrollY};
      savedOverflow = document.body.style.overflow;
      savedPadding = document.body.style.paddingRight;
      const scrollbar = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
      document.body.style.overflow = 'hidden';
      dialog.showModal();
      root.querySelector<HTMLElement>('[data-dc-close]')?.focus({preventScroll: true});
    }
    syncPlayback();
  }
  function stepWork(delta: number) {
    currentWork = (currentWork + delta + viewerWorks.length) % viewerWorks.length;
    renderWork();
  }
  root.addEventListener('click', event => {
    const target = event.target as HTMLElement;
    const artwork = target.closest<HTMLElement>('[data-dc-open]');
    if (artwork) open(artwork.dataset.dcOpen!, artwork);
    const choice = target.closest<HTMLElement>('[data-dc-select]');
    if (choice) {select(Number(choice.dataset.dcSelect)); syncPlayback();}
    if (target.closest('[data-dc-next]')) select(slide + 1);
    if (target.closest('[data-dc-prev]')) select(slide - 1);
    if (target.closest('[data-dc-play]')) {playing = !playing; syncPlayback();}
    if (target.closest('[data-dc-close]')) dialog.close();
    if (target.closest('[data-dc-modal-prev]')) stepWork(-1);
    if (target.closest('[data-dc-modal-next]')) stepWork(1);
  }, {signal});
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  }, {signal});
  dialog.addEventListener('close', () => {
    media.querySelector('video')?.pause(); media.replaceChildren();
    document.body.style.overflow = savedOverflow; document.body.style.paddingRight = savedPadding;
    returnFocus?.focus({preventScroll: true});
    window.scrollTo({left: savedScroll.x, top: savedScroll.y, behavior: 'instant'});
    syncPlayback();
  }, {signal});
  dialog.addEventListener('keydown', event => {
    if (event.target instanceof HTMLVideoElement) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {event.preventDefault(); stepWork(event.key === 'ArrowRight' ? 1 : -1);}
  }, {signal});
  stage?.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {event.preventDefault(); select(slide + (event.key === 'ArrowRight' ? 1 : -1));}
  }, {signal});
  stage?.addEventListener('pointerdown', event => {if (!(event.target as HTMLElement).closest('button')) downX = event.clientX;}, {signal, passive: true});
  stage?.addEventListener('pointerup', event => {
    if (downX !== null && Math.abs(event.clientX - downX) > 60) select(slide + (event.clientX < downX ? 1 : -1));
    downX = null;
  }, {signal, passive: true});
  stage?.addEventListener('pointercancel', () => {downX = null;}, {signal});
  document.addEventListener('visibilitychange', syncPlayback, {signal});
  reduced.addEventListener('change', syncPlayback);
  const observer = new IntersectionObserver(entries => {visible = entries[0]?.isIntersecting ?? true; syncPlayback();}, {threshold: .15});
  if (stage) observer.observe(stage);
  select(0, false);
  return () => {
    controller.abort(); observer.disconnect(); clearInterval(timer); reduced.removeEventListener('change', syncPlayback);
    if (dialog.open) {dialog.close(); document.body.style.overflow = savedOverflow; document.body.style.paddingRight = savedPadding;}
  };
}
