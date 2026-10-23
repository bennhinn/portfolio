'use client';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { archiveCollections, archiveFilters } from './creative/data';

type Collection = (typeof archiveCollections)[number];
type Work = Collection['items'][number];
type Tile = { work: Work; collection: string; clone: boolean };

/**
 * One entry per row.
 *  b / sg : start position and direction. Row A drifts left as you scroll
 *           down, row B drifts right, so neighbouring rows counter-move.
 *  k      : how much of its spare width the row travels (0 to 1). Different
 *           values make the rows feel like they sit at different depths.
 *  h      : row height multiplier, so the rows aren't one uniform band.
 */
const LANES = [
  { b: 0, sg: 1, k: 1, h: 1 },
  { b: 1, sg: -1, k: 0.85, h: 0.82 },
  { b: 0, sg: 1, k: 0.7, h: 1.08 },
];

// A row must be wider than the viewport or the motion would reveal a gap.
// Short rows are padded by repeating pieces (clones are hidden from tab order
// and screen readers).
const MIN_PER_ROW = 12;

function buildRows(): Tile[][] {
  const flat: Tile[] = archiveCollections.flatMap((c) =>
    c.items.map((work) => ({ work, collection: c.key, clone: false })),
  );
  const rows: Tile[][] = LANES.map(() => []);
  flat.forEach((t, i) => rows[i % LANES.length].push(t));
  return rows.map((row, r) => {
    if (!row.length) return row;
    const out = [...row];
    // start the repeat at a different point per row so clones don't line up
    for (let i = r; out.length < MIN_PER_ROW; i++) {
      out.push({ ...row[i % row.length], clone: true });
    }
    return out;
  });
}

const ROWS = buildRows();
const FIRST_ID = archiveCollections.find((c) => c.items.length)?.items[0].id;

export default function ArchiveRows() {
  const wall = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const el = wall.current;
    if (!el) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let target = 0; // where the scroll says we should be (0..1)
    let current = 0; // where we are, eased toward target
    let raf = 0;
    let visible = false;

    // 0 when the wall is just entering at the bottom, 1 when it has left the top
    const measure = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      target = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
    };

    const frame = () => {
      raf = 0;
      const d = target - current;
      if (Math.abs(d) < 0.0003) {
        current = target;
        el.style.setProperty('--p', current.toFixed(4));
        el.style.setProperty('--v', '0');
        return;
      }
      current += d * 0.085;
      // the gap between target and current is effectively scroll velocity;
      // it drives a small skew so rows lean into their motion
      const skew = Math.max(-5, Math.min(5, d * 40));
      el.style.setProperty('--p', current.toFixed(4));
      el.style.setProperty('--v', skew.toFixed(3));
      raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      measure();
      if (visible && !raf) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) kick();
      },
      { rootMargin: '30% 0px' },
    );
    io.observe(el);

    measure();
    current = target; // no ease-in from zero on first paint
    el.style.setProperty('--p', current.toFixed(4));

    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', kick);
      window.removeEventListener('resize', kick);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="ar" aria-labelledby="dc-archive-title">
      <div className="dc-archive-heading" id="creative-gallery">
        <div>
          <span className="dc-small">02 / THE REST OF THE STORY</span>
          <h3 id="dc-archive-title">Keep exploring</h3>
        </div>
        <p>
          A collection of the everyday,
          <br />
          the expressive and the unexpected.
        </p>
      </div>

      <div className="ar-toolbar">
        <div
          className="dc-filters"
          role="group"
          aria-label="Filter design archive"
        >
          {archiveFilters.map((f) => (
            <button
              key={f.key}
              type="button"
              data-ar-filter={f.key}
              aria-pressed={filter === f.key}
              onClick={() => setFilter(f.key)}
            >
              {f.key}
              <span>{f.count}</span>
            </button>
          ))}
        </div>
        {FIRST_ID && (
          <button type="button" className="ar-browse" data-dc-open={FIRST_ID}>
            Browse all <span aria-hidden="true">↗</span>
          </button>
        )}
      </div>
      <p className="dc-sr" aria-live="polite">
        {filter === 'All'
          ? 'Showing all pieces'
          : `Highlighting ${filter} work`}
      </p>

      <div className="ar-wall" ref={wall}>
        {ROWS.map((row, r) =>
          row.length === 0 ? null : (
            <div className="ar-lane" key={r}>
              <div
                className="ar-row"
                style={
                  {
                    '--b': LANES[r].b,
                    '--sg': LANES[r].sg,
                    '--k': LANES[r].k,
                    '--h': LANES[r].h,
                  } as CSSProperties
                }
              >
                {row.map((t, i) => {
                  const dim = filter !== 'All' && t.collection !== filter;
                  return (
                    <button
                      key={`${t.work.id}-${i}`}
                      type="button"
                      className="ar-tile"
                      data-dc-open={t.work.id}
                      data-dim={dim}
                      aria-label={'Open ' + t.work.title}
                      aria-hidden={t.clone || undefined}
                      tabIndex={t.clone || dim ? -1 : undefined}
                    >
                      <img
                        src={t.work.thumb}
                        alt={t.clone ? '' : t.work.title}
                        draggable={false}
                        decoding="async"
                      />
                      {t.work.kind === 'video' && (
                        <span className="ar-play" aria-hidden="true">
                          ▶
                        </span>
                      )}
                      <span className="ar-cap" aria-hidden="true">
                        <b>{t.work.title}</b>
                        <i>↗</i>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
