'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import GlassKey from './GlassKey';
// CSS is handled by the app bundler; TypeScript has no declaration for this side-effect import.
// @ts-expect-error -- intentional stylesheet side-effect import
import './HeroDepth.css';

export type HeroProps = {
  splineScene?: string;
  contactHref?: string;
  cvUrl?: string;
};

const HEADLINE = ['Building digital', 'experiences', 'with code, design,', 'and rhythm.'];

export default function Hero({ splineScene, contactHref = '#contact', cvUrl }: HeroProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [mobileOpen]);

  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    const enabled = window.matchMedia('(min-width: 851px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    let pending = 0;
    let x = 0;
    let y = 0;
    const paint = () => {
      pending = 0;
      element.style.setProperty('--hero-depth-x', `${x * 5}px`);
      element.style.setProperty('--hero-depth-y', `${y * 4}px`);
      element.style.setProperty('--hero-light-x', `${65 + x * 7}%`);
      element.style.setProperty('--hero-light-y', `${35 + y * 7}%`);
    };
    const reset = () => {
      cancelAnimationFrame(pending);
      pending = 0;
      x = 0;
      y = 0;
      paint();
    };
    const move = (event: PointerEvent) => {
      if (!enabled.matches || event.pointerType !== 'mouse') return;
      const bounds = element.getBoundingClientRect();
      x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - .5) * 2));
      y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - .5) * 2));
      if (!pending) pending = requestAnimationFrame(paint);
    };
    element.addEventListener('pointermove', move, { passive: true });
    element.addEventListener('pointerleave', reset);
    enabled.addEventListener('change', reset);
    window.addEventListener('blur', reset);
    return () => {
      cancelAnimationFrame(pending);
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerleave', reset);
      enabled.removeEventListener('change', reset);
      window.removeEventListener('blur', reset);
      element.style.removeProperty('--hero-depth-x');
      element.style.removeProperty('--hero-depth-y');
      element.style.removeProperty('--hero-light-x');
      element.style.removeProperty('--hero-light-y');
    };
  }, []);

  return (
    <section id="home" className="hero hero--depth" aria-labelledby="hero-heading">
      <div className="hero-frame" ref={frame}>
        <div className="mobile-scene-backdrop">
          <img className="mobile-scene-fill" src="/images/mobile-hero-reference.jpg" alt="" aria-hidden="true" />
          <img className="mobile-scene-portrait" src="/images/mobile-hero-reference.jpg" width="495" height="888" alt="Bennhinn Mwangi wearing sunglasses and headphones, surrounded by a luminous blue halo" fetchPriority="high" />
        </div>
        <div className="hero-photo" role="img" aria-label="Cinematic portrait of Bennhinn framed by an electric-blue halo" />
        <div className="hero-shine" aria-hidden="true" />
        <div className="halo-breath" aria-hidden="true" />
        <div className="hero-atmosphere" aria-hidden="true"><span /><span /></div>

        <header className="hero-header">
          <a className="brand" href="#home" aria-label="Bennhinn Mwangi, homepage">BM<span>.</span></a>
          <nav aria-label="Primary navigation" className="nav-links">
            <a href="#selected-work">Work</a><a href="#about">About</a><a href="#creative">Creative</a><a href={contactHref}>Contact</a>
          </nav>
          <button ref={menuButton} type="button" className="menu-button" aria-expanded={mobileOpen} aria-controls="mobile-navigation" aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMobileOpen(value => !value)}>
            <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {mobileOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
          <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" hidden={!mobileOpen}>
            { [['Work', '#selected-work'], ['About', '#about'], ['Creative', '#creative'], ['Contact', contactHref]].map(([name, to]) => <a key={name} href={to} onClick={() => setMobileOpen(false)}>{name}</a>) }
          </nav>
        </header>

        <div className="hero-copy">
          <p className="eyebrow">Software Developer &amp; Creative Technologist</p>
          <h1 id="hero-heading" className="hero-title">
            {HEADLINE.map((text, i) => <span key={text} className={i > 1 ? 'line gradient' : 'line'} style={{ '--i': i } as CSSProperties}>{text}{' '}</span>)}
          </h1>
          <p className="hero-description">I’m Bennhinn Mwangi. I build web systems end to end, and I bring a pianist’s sense of timing and restraint to every interface.</p>
          <div className="hero-actions" aria-label="Portfolio actions">
            <a className="mobile-work-cta" href="#selected-work">View My Work<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 19 19 5M9 5h10v10" /></svg></a>
            <GlassKey href="#selected-work" splineScene={splineScene} />
            <a className="secondary-cta" href={contactHref}>Let’s Connect</a>
            {cvUrl && <a className="cv-cta" href={cvUrl} download><Download />Download CV</a>}
          </div>
        </div>

        <div className="mobile-art" role="img" aria-label="Bennhinn wearing tinted glasses and headphones, with a luminous blue circular halo" />
        <div className="orb" aria-hidden="true"><span className="orb-ring" /><span className="orb-satellite" /></div>

        <aside className="side-card hero-perspective" aria-labelledby="hero-perspective-heading">
          <div className="hero-perspective-label"><span aria-hidden="true" />Behind the work</div>
          <h2 id="hero-perspective-heading">A sense<br />of <em>rhythm.</em></h2>
          <p>Gospel piano taught me timing, space and when to leave something out. I design and build the same way.</p>
          <div className="hero-perspective-signature" aria-hidden="true">
            <svg viewBox="0 0 168 30" fill="none"><path d="M1 22H43C52 22 54 6 63 6S74 24 83 24 94 10 105 10H167" /><path d="M1 28H167" /></svg>
            <span>Timing. Space. Restraint.</span>
          </div>
        </aside>
        <div className="scroll-note" aria-hidden="true">Scroll to explore ↓</div>
      </div>
    </section>
  );
}

function Download() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3v12m0 0 5-5m-5 5-5-5M4 17v4h16v-4" /></svg>;
}
