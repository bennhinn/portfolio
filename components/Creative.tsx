'use client';
import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import {
  works,
  campaigns,
  archiveCollections,
  archiveFilters,
  galleryStops,
  galleryRooms,
} from './creative/data';
import { attachCreative } from './creative/experience';
import { attachGallery } from './creative/gallery';

export default function Creative() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!root.current) return;
    const stopGallery = attachGallery(root.current);
    const stopCreative = attachCreative(root.current, works);
    return () => { stopGallery(); stopCreative(); };
  }, []);
  return (
    <section
      id="creative"
      ref={root}
      className="dc-section"
      aria-labelledby="dc-title"
    >
      <div className="dc-inner">
        <div className="dc-topline">
          <span>
            <i /> 03 / THE CREATIVE SIDE
          </span>
          <span>BENNHINN MWANGI · SELECTED DESIGN</span>
        </div>
        <div className="dc-intro">
          <h2 id="dc-title">
            Beyond
            <br />
            the <em>code.</em>
            <span className="dc-star" aria-hidden="true">
              ✳
            </span>
          </h2>
          <div className="dc-intro-copy">
            <span className="dc-small">
              A DIFFERENT MEDIUM. THE SAME CURIOSITY.
            </span>
            <p>
              I build with code.
              <br />I tell stories with design.
            </p>
            <span>
              Campaigns, community and a little motion.
              <br />
              Explore the work that shapes my creative side.
            </span>
            <a href="#dc-stage">
              Step inside <b aria-hidden="true">↘</b>
            </a>
          </div>
        </div>
        <div className="dc-ribbon" aria-hidden="true">
          <div className="dc-ribbon-track">
            {[...campaigns, ...campaigns].map((c, i) => (
              <div className="dc-ribbon-item" key={i}>
                <img src={c.work.thumb} alt="" loading="lazy" />
                <span>{c.short}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="dc-section-label">
          <h3>01 / SELECTED CAMPAIGNS</h3>
          <span>Six stories. Six different worlds.</span>
        </div>
        <div
          id="dc-stage"
          className="dc-stage"
          role="region"
          aria-roledescription="carousel"
          aria-label="Selected design campaigns"
          tabIndex={0}
          style={
            {
              '--dc-accent': campaigns[0].color,
              '--dc-paper': campaigns[0].paper,
              '--dc-ink': campaigns[0].ink,
            } as CSSProperties
          }
        >
          <div className="dc-stage-top">
            <span>THE DESIGN PLAYGROUND</span>
            <button
              className="dc-play-toggle"
              type="button"
              data-dc-play
              aria-pressed="false"
            >
              <span data-dc-play-icon aria-hidden="true">
                ▶
              </span>
              <span data-dc-play-label>Play reel</span>
            </button>
          </div>
          <div className="dc-slides">
            {campaigns.map((c, i) => (
              <article
                key={c.id}
                className="dc-slide"
                data-dc-slide={i}
                data-active={i === 0 ? 'true' : 'false'}
                data-accent={c.color}
                data-paper={c.paper}
                data-ink={c.ink}
                aria-hidden={i !== 0}
                inert={i !== 0}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of 6: ${c.work.title}`}
              >
                <div className="dc-slide-copy">
                  <span className="dc-small">
                    {c.number} / {c.label.toUpperCase()}
                  </span>
                  <h4>{c.word}</h4>
                  <p>{c.note}</p>
                  <button type="button" className="dc-view" data-dc-open={c.id}>
                    View original artwork <span aria-hidden="true">↗</span>
                  </button>
                  <div className="dc-palette" aria-hidden="true">
                    <i style={{ background: c.color }} />
                    <i style={{ background: c.ink }} />
                    <i style={{ background: '#fff' }} />
                    <span>COLOR / COMPOSITION / STORY</span>
                  </div>
                </div>
                <div
                  className="dc-composition"
                  aria-label={c.work.title + ' layered composition'}
                >
                  <div className="dc-backboard" aria-hidden="true">
                    <span>{c.short}</span>
                    <b>{c.number}</b>
                    <small>DESIGNED BY BENNHINN</small>
                  </div>
                  <div className="dc-outline" aria-hidden="true" />
                  <button
                    className="dc-main-art"
                    type="button"
                    data-dc-open={c.id}
                    aria-label={'View ' + c.work.title + ' original artwork'}
                  >
                    <img
                      src={c.work.src}
                      alt={c.work.title + ' — complete original design'}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      width={1440}
                      height={1440}
                    />
                    <span aria-hidden="true">EXPLORE ↗</span>
                  </button>
                  <div className="dc-detail" aria-hidden="true">
                    <div>
                      <img
                        src={c.work.thumb}
                        alt=""
                        loading="lazy"
                        style={{ objectPosition: c.position }}
                      />
                    </div>
                    <span>
                      {c.detail} <b>↗</b>
                    </span>
                  </div>
                  <div className="dc-float-label" aria-hidden="true">
                    <span>✳</span>
                    <div>
                      <small>SELECTED CAMPAIGN</small>
                      <strong>{c.work.title}</strong>
                    </div>
                  </div>
                  <div className="dc-orbit" aria-hidden="true" />
                  <span className="dc-tiny-cross" aria-hidden="true">
                    ✦
                  </span>
                </div>
              </article>
            ))}
          </div>
          <div className="dc-stage-bottom">
            <span className="dc-slide-status" data-dc-status>
              01 <i>/ 06</i>
            </span>
            <span className="dc-hint">
              Drag to explore <b>↔</b>
            </span>
            <div className="dc-arrows">
              <button type="button" data-dc-prev aria-label="Previous campaign">
                ←
              </button>
              <button type="button" data-dc-next aria-label="Next campaign">
                →
              </button>
            </div>
          </div>
          <div className="dc-progress" aria-hidden="true">
            <span data-dc-progress />
          </div>
          <p className="dc-sr" aria-live="polite" data-dc-announce />
        </div>
        <div
          className="dc-selector"
          role="group"
          aria-label="Choose a campaign"
        >
          {campaigns.map((c, i) => (
            <button
              type="button"
              key={c.id}
              data-dc-select={i}
              aria-pressed={i === 0}
            >
              <img src={c.work.thumb} alt="" loading="lazy" />
              <span>
                <small>{c.number}</small>
                {c.short}
              </span>
              <b aria-hidden="true">↗</b>
            </button>
          ))}
        </div>
        <Gallery />
        <div className="dc-outro" id="creative-after-gallery" tabIndex={-1}>
          <span className="dc-small">CODE. DESIGN. MUSIC.</span>
          <p>
            One curious mind.
            <br />
            <em>Many ways to create.</em>
          </p>
          <a href="#contact">
            Let’s make something <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <dialog
        className="dc-dialog kg-viewer"
        data-dc-dialog
        aria-labelledby="dc-dialog-title"
      >
        <div className="dc-dialog-shell">
          <header>
            <div>
              <span data-dc-modal-category className="dc-small" />
              <h3 id="dc-dialog-title" data-dc-modal-title />
              <p className="kg-viewer-subtitle" data-dc-modal-subtitle />
            </div>
            <button
              type="button"
              data-dc-close
              aria-label="Close artwork viewer"
              autoFocus
            >
              ✕
            </button>
          </header>
          <div className="dc-dialog-media" data-dc-modal-media />
          <footer>
            <button type="button" data-dc-modal-prev>
              ← Previous
            </button>
            <span data-dc-modal-count />
            <a data-dc-original href="#" target="_blank" rel="noopener noreferrer">Open original ↗</a>
            <button type="button" data-dc-modal-next>
              Next →
            </button>
          </footer>
        </div>
      </dialog>
    </section>
  );
}

/** A progressive enhancement: the complete artwork index works before JS loads. */
export function Gallery() {
  if (!galleryStops.length) return null;
  return (
    <section className="kg-exhibition" id="creative-gallery" data-kg-exhibition data-mode="all" aria-labelledby="kg-heading">
      <div className="kg-heading" data-kg-heading>
        <div><span className="kg-eyebrow">02 / THE OPEN STUDIO</span><h3 id="kg-heading">Keep exploring<span>.</span></h3></div>
        <div className="kg-invitation"><p>A space for ideas.<br />A different way to see them.</p><button type="button" data-kg-mode-toggle aria-pressed="true">Enter the gallery ↗</button></div>
      </div>
      <div className="kg-tour" data-kg-journey>
        <div className="kg-pin">
          <div className="kg-topbar"><span className="kg-brand">BM<span> / </span>THE STUDIO</span><a href="#creative-after-gallery">Leave gallery <span aria-hidden="true">↗</span></a></div>
          <div className="kg-viewport" data-kg-viewport tabIndex={0} role="region" aria-label="Walk-through art gallery. Use left and right arrow keys to change rooms." aria-describedby="kg-help">
            <div className="kg-world" data-kg-world>
              {galleryStops.map((room, index) => (
                <div key={room.id} className="kg-bay" data-kg-bay data-title={room.title} data-category={room.category} data-note={room.note} data-accent={room.accent}
                  style={{'--kg-z': `${-index * 1200}px`, '--room-accent': room.accent} as CSSProperties}>
                  <div className="kg-floor" aria-hidden="true" />
                  <div className="kg-ceiling" aria-hidden="true" />
                  <div className="kg-wall kg-wall-left" aria-hidden="true" />
                  <div className="kg-wall kg-wall-right" aria-hidden="true" />
                  <div className="kg-ceiling-light kg-ceiling-light-left" aria-hidden="true" />
                  <div className="kg-ceiling-light kg-ceiling-light-right" aria-hidden="true" />
                  <div className="kg-door-post kg-door-post-left" aria-hidden="true" />
                  <div className="kg-door-post kg-door-post-right" aria-hidden="true" />
                  <div className="kg-room-lettering" aria-hidden="true"><small>ROOM {String(index + 1).padStart(2, '0')}</small><strong>{room.category}</strong></div>
                  {room.items.map((work, artIndex) => (
                    <div className={'kg-station kg-station-' + artIndex} key={work.id}>
                      <span className="kg-spotlight" aria-hidden="true" />
                      <div className="kg-mount" aria-hidden="true" />
                      <button className="kg-artwork" type="button" data-dc-open={work.id} aria-label={'Examine ' + work.title}>
                        <img src={work.thumb} alt={work.title} loading={index < 2 ? 'eager' : 'lazy'} decoding="async" />
                        <span className="kg-inspect">{work.kind === 'video' ? 'Play film' : 'Examine artwork'} <span aria-hidden="true">↗</span></span>
                      </button>
                      <div className="kg-plaque"><span>{String(index * 3 + artIndex + 1).padStart(2, '0')} / {work.category}</span><strong>{work.title}</strong></div>
                      <div className="kg-art-shadow" aria-hidden="true" />
                    </div>
                  ))}
                </div>
              ))}
              <div className="kg-end-wall" aria-hidden="true" style={{transform: `translate3d(-660px, -420px, ${-galleryStops.length * 1200}px)`}}><span>MADE WITH<br /><em>PURPOSE.</em></span></div>
            </div>
            <div className="kg-vignette" aria-hidden="true" />
          </div>
          <div className="kg-hud">
            <div className="kg-room-caption"><span className="kg-eyebrow"><span data-kg-current>01</span> / {String(galleryStops.length).padStart(2, '0')} <i /> <span data-kg-category>{galleryStops[0].category}</span></span><h4 data-kg-title>{galleryStops[0].title}</h4><p data-kg-note>{galleryStops[0].note}</p></div>
            <div className="kg-navigation">
              <div className="kg-piece-picker"><span data-kg-piece-count />{galleryStops.map((room, roomIndex) => <div data-kg-pieces={roomIndex} key={room.id} hidden={roomIndex !== 0} role="group" aria-label="Artwork in this room">{room.items.map((work, artIndex) => <button type="button" data-kg-piece={artIndex} key={work.id} aria-pressed={artIndex === 0} aria-label={'View ' + work.title}><img src={work.thumb} alt="" /></button>)}</div>)}</div>
              <div className="kg-room-buttons" role="group" aria-label="Jump to a gallery area">{galleryRooms.map((room, i) => <button type="button" key={room.key} data-kg-room={room.key} aria-pressed={i === 0}>{room.key}</button>)}</div>
              <div className="kg-walk-controls"><span id="kg-help" data-kg-instruction>Scroll to walk · select an artwork</span><div><button type="button" data-kg-prev aria-label="Previous gallery room">←</button><button type="button" data-kg-next aria-label="Next gallery room">→</button></div></div>
            </div>
          </div>
          <div className="kg-progress" aria-hidden="true"><span data-kg-progress /></div>
          <nav className="kg-map" aria-label="Gallery floor plan">{galleryStops.map((room, i) => <button key={room.id} type="button" data-kg-jump={i} aria-pressed={i === 0} aria-label={`Room ${i + 1}: ${room.category}`}><span /></button>)}</nav>
          <p className="dc-sr" data-kg-announce role="status" aria-live="polite" />
        </div>
      </div>
      <div className="kg-index">
        <div className="kg-index-head"><p>Take a closer look.</p><div role="group" aria-label="Filter artwork">{archiveFilters.map(filter => <button key={filter.key} type="button" data-kg-filter={filter.key} aria-pressed={filter.key === 'All'}>{filter.key}<small>{filter.count}</small></button>)}</div></div>
        <p className="dc-sr" data-kg-index-status aria-live="polite" />
        {archiveCollections.filter(collection => collection.items.length > 0).map(collection => <section key={collection.key} data-kg-index-group={collection.key} aria-label={collection.key} className="kg-index-group">
          <header><span className="kg-eyebrow">{collection.key}</span><h4>{collection.title}</h4></header>
          <div className="kg-index-grid">{collection.items.map(work => <button key={work.id} type="button" data-dc-open={work.id} aria-label={'Examine ' + work.title}><span className="kg-index-image"><img src={work.thumb} alt={work.title} loading="lazy" /><i aria-hidden="true">↗</i></span><strong>{work.title}</strong><small>{work.subtitle}</small></button>)}</div>
        </section>)}
      </div>
      <div className="kg-exit-note"><span>CODE. DESIGN. A DIFFERENT PERSPECTIVE.</span><a href="#creative-after-gallery">Continue the story <span aria-hidden="true">↓</span></a></div>
    </section>
  );
}
