'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import GlassKey from './GlassKey';
import './HeroParallax.css';
import { attachHeroParallax } from './hero-parallax';

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
    if (frame.current) return attachHeroParallax(frame.current);
  }, []);

  return (
    <section id="home" className="hero hero--depth hero--parallax" aria-labelledby="hero-heading">
      <div className="hero-frame" ref={frame}>
        <div className="mobile-scene-backdrop">
          <img className="mobile-scene-fill" src="/images/mobile-hero-reference.jpg" alt="" aria-hidden="true" />
          <img className="mobile-scene-portrait" src="/images/mobile-hero-reference.jpg" width="495" height="888" alt="Bennhinn Mwangi wearing sunglasses and headphones, surrounded by a luminous blue halo" fetchPriority="high" />
        </div>
        <div className="hp-scene" aria-hidden="true">
          <div className="hp-layer hp-background"><img src="/images/hero-layers/01-background.png" alt="" fetchPriority="high" /></div>
          <div className="hp-layer hp-halo"><img src="/images/hero-layers/02-halo.png" alt="" /></div>
          <div className="hp-layer hp-portrait"><img src="/images/hero-layers/03-portrait.png" alt="" fetchPriority="high" /></div>
          <div className="hp-layer hp-trails"><img src="/images/hero-layers/04-light-trails.png" alt="" /></div>
          <div className="hp-shade" />
        </div>
        <span className="hp-sr">Portrait of Bennhinn Mwangi wearing sunglasses, headphones and a navy blazer.</span>

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


        <aside className="side-card hero-perspective" aria-labelledby="hero-perspective-heading">
          <div className="hero-perspective-label"><span aria-hidden="true" />Behind the work</div>
          <h2 id="hero-perspective-heading">A sense<br />of <em>rhythm.</em></h2>
          <p>Gospel piano taught me timing, space and when to leave something out. I design and build the same way.</p>
          <div className="hero-perspective-signature" aria-hidden="true">
            <svg viewBox="0 0 168 30" fill="none"><path d="M1 22H43C52 22 54 6 63 6S74 24 83 24 94 10 105 10H167" /><path d="M1 28H167" /></svg>
            <span>Timing. Space. Restraint.</span>
          </div>
        </aside>
        <button type="button" className="hp-motion" data-hp-motion aria-pressed="false">Pause depth</button>
        <div className="scroll-note" aria-hidden="true">Scroll to explore ↓</div>
      </div>
    </section>
  );
}

function Download() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3v12m0 0 5-5m-5 5-5-5M4 17v4h16v-4" /></svg>;
}
