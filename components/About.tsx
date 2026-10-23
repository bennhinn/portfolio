'use client';

import React, { useEffect, useRef } from 'react';
import { disciplines, milestones } from './about/data';
import { attachAbout } from './about/interaction';

export default function About() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (root.current) return attachAbout(root.current);
  }, []);

  const active = disciplines[0];

  return (
    <section
      className="about-section about-aurora"
      id="about"
      aria-labelledby="about-heading"
      ref={root}
    >
      <div className="aa-shell">
        <header className="aa-overline">
          <span>02 / THE PERSON BEHIND THE WORK</span>
          <button
            className="aa-motion-toggle"
            type="button"
            data-aa-motion
            aria-pressed="false"
          >
            Ⅱ Pause depth
          </button>
        </header>

        <div className="aa-intro-grid">
          <div className="aa-story">
            <div className="aa-eyebrow">
              <span /> HEY, I&apos;M BENNHINN
            </div>

            <h2 id="about-heading">
              Behind every system,
              <br />
              <em>
                there&apos;s someone
                <br />
                waiting.
              </em>
            </h2>

            <p className="aa-intro">
              I&apos;m a{' '}
              <strong>
                software developer and creative technologist
              </strong>{' '}
              who wants to improve how technology serves people,
              especially in hospitals and the public sector.
            </p>

            <p className="aa-body">
              I&apos;ve seen what slow, unreliable systems do to people:
              long queues, frustrated staff, and hours spent waiting
              only to hear, &ldquo;The system isn&apos;t working
              today.&rdquo; Nobody can say when it will return, and
              the person who needs help is left with little choice
              but to wait.
            </p>

            <p className="aa-body">
              That stays with me. I want to build systems that people
              can depend on, even on the busiest days. Technology
              should make it easier to provide a service and easier
              to receive one. When people have to return to paper
              just to get things done, I see a problem worth solving.
            </p>

            <p className="aa-body">
              Beyond software, I play piano and explore graphic
              design. Music gives me space to listen and express
              myself; design lets me turn ideas into something
              people can see. Both are a big part of who I am.
            </p>

            <div className="aa-story-actions">
              <a
                className="aa-pill"
                href="#selected-work"
                style={{ color: '#fff' }}
              >
                Explore my work{' '}
                <span
                  aria-hidden="true"
                  style={{ color: '#fff' }}
                >
                  ↗
                </span>
              </a>

              <span>
                Based in Kenya
                <br />
                Working across disciplines
              </span>
            </div>
          </div>

          <div
            className="aa-portrait-scene"
            data-aa-surface
            data-aa-depth="5"
            aria-label="Illustrated portrait of Bennhinn and his creative disciplines"
          >
            <div className="aa-portrait-halo" aria-hidden="true" />

            <div className="aa-portrait-rig" data-aa-rig>
              <div
                className="aa-sphere aa-sphere-one"
                aria-hidden="true"
              />

              <figure className="aa-portrait-frame">
                <div className="aa-portrait-mat">
                  <picture>
                    <source
                      media="(max-width:600px)"
                      srcSet="/images/about-creative-portrait-small.webp"
                    />
                    <img
                      src="/images/about-creative-portrait.webp"
                      width="1320"
                      height="880"
                      alt="3D illustration of Bennhinn with a laptop, keyboard, code window and cloud"
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>

                  <span
                    className="aa-image-sheen"
                    aria-hidden="true"
                  />
                </div>

                <figcaption>
                  <span>BENNHINN MWANGI</span>
                  <span>Code · Design · Rhythm</span>
                </figcaption>
              </figure>

              <div
                className="aa-floating aa-floating-code"
                aria-hidden="true"
              >
                <span className="aa-code-key">&lt;/&gt;</span>
                <span>
                  <small>THE WAY I THINK</small>
                  <b>Builder first.</b>
                </span>
              </div>

              <div
                className="aa-floating aa-floating-music"
                aria-hidden="true"
              >
                <span className="aa-music-key">♫</span>
                <span>
                  <small>THE WAY I CREATE</small>
                  <b>Creative always.</b>
                </span>
              </div>

              <div
                className="aa-sphere aa-sphere-two"
                aria-hidden="true"
              />
            </div>

            <div className="aa-mouse-caption" aria-hidden="true">
              <span /> Move your cursor. Explore the depth.
            </div>
          </div>
        </div>

        <div className="aa-principles">
          <span>
            Developer <i aria-hidden="true">/</i> Designer{' '}
            <i aria-hidden="true">/</i> Musician
          </span>
          <span>BUILDER FIRST. CREATIVE ALWAYS.</span>
        </div>

        <section
          className="aa-layers"
          aria-labelledby="aa-layers-heading"
        >
          <header className="aa-section-head">
            <div>
              <p className="aa-eyebrow">
                THE LAYERS BEHIND THE WORK
              </p>
              <h3 id="aa-layers-heading" data-aa-reveal>
                Different disciplines.
                <br />
                <em>One creative process.</em>
              </h3>
            </div>

            <p>
              Explore the layers that shape how I build. Select a
              surface to bring its perspective forward.
            </p>
          </header>

          <div className="aa-layer-grid">
            <div
              className="aa-stack-scene"
              data-aa-surface
              data-aa-depth="4"
              aria-label="Explore engineering, design and music"
            >
              <div className="aa-stack-halo" aria-hidden="true" />

              <div className="aa-stack-rig" data-aa-rig>
                <div className="aa-plinth" aria-hidden="true" />

                {disciplines.map((discipline, index) => (
                  <button
                    className={`aa-layer aa-layer-${index} ${
                      index === 0 ? 'is-active' : ''
                    }`}
                    type="button"
                    key={discipline.id}
                    data-aa-select={index}
                    aria-pressed={index === 0}
                    aria-controls="aa-insight"
                    aria-label={`Explore ${discipline.word.toLowerCase()}`}
                  >
                    <span
                      className="aa-layer-icon"
                      aria-hidden="true"
                    >
                      {discipline.mark}
                    </span>

                    <span className="aa-layer-copy">
                      <small>
                        {discipline.number} / {discipline.sub}
                      </small>
                      <strong>{discipline.word}</strong>
                    </span>

                    <span
                      className="aa-layer-arrow"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </button>
                ))}
              </div>

              <span className="aa-stack-foot" aria-hidden="true">
                STRUCTURE · PERSPECTIVE · RHYTHM
              </span>
            </div>

            <div
              className="aa-insight"
              id="aa-insight"
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="aa-insight-head">
                <span>INSIDE THE LAYER</span>
                <span data-aa-num>
                  01 / {String(disciplines.length).padStart(2, '0')}
                </span>
              </div>

              <div
                className="aa-insight-mark"
                data-aa-mark
                aria-hidden="true"
              >
                {active.mark}
              </div>

              <p className="aa-insight-sub" data-aa-sub>
                {active.sub}
              </p>
              <h4 data-aa-title>{active.title}</h4>
              <p className="aa-insight-body" data-aa-body>
                {active.text}
              </p>

              <p className="aa-methods-label">
                WHAT IT BRINGS TO MY WORK
              </p>

              <ul data-aa-methods>
                {active.methods.map((method: string) => (
                  <li key={method}>{method}</li>
                ))}
              </ul>

              <div
                className="aa-layer-nav"
                aria-label="Choose a discipline"
              >
                {disciplines.map((discipline, index) => (
                  <button
                    key={discipline.id}
                    type="button"
                    data-aa-select={index}
                    aria-pressed={index === 0}
                    aria-controls="aa-insight"
                    aria-label={`Show ${discipline.word.toLowerCase()}`}
                  >
                    {discipline.number}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className="aa-journey"
          aria-labelledby="aa-journey-heading"
        >
          <div className="aa-journey-intro">
            <p className="aa-eyebrow">THE JOURNEY SO FAR</p>

            <h3 id="aa-journey-heading" data-aa-reveal>
              Experience that
              <br />
              <em>connects the dots.</em>
            </h3>

            <p>
              Supporting people with IT problems has shown me where
              technology gets in the way. Building applications gives
              me a way to work on those problems.
            </p>
          </div>

          <div className="aa-timeline">
            {milestones.map((milestone, index) => (
              <article
                className="aa-experience"
                key={milestone.title}
                data-aa-reveal
              >
                <span className="aa-timeline-number">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div>
                  <p className="aa-experience-meta">
                    {milestone.meta}
                  </p>
                  <h4>{milestone.title}</h4>
                  <p className="aa-experience-body">
                    {milestone.body}
                  </p>
                </div>

                <span
                  className="aa-experience-mark"
                  aria-hidden="true"
                >
                  {['↗', '</>', '+'][index] ?? '+'}
                </span>
              </article>
            ))}
          </div>
        </section>

        <footer className="aa-footer">
          <div className="aa-footer-title">
            <span
              className="aa-footer-sculpture"
              aria-hidden="true"
            >
              ✳
            </span>

            <p>
              Learning never stops.
              <br />
              <strong>Neither does curiosity.</strong>
            </p>
          </div>

          <div className="aa-credentials">
            <span>
              <i aria-hidden="true">↗</i>
              OCI 2025 Architect Associate
            </span>
            <span>
              <i aria-hidden="true">↗</i>
              Kubernetes &amp; Cloud Native Associate (KCNA)
            </span>
          </div>
        </footer>

        <div className="aa-close">
          <span>BUILT WITH CODE. THINKING CREATIVELY.</span>
          <a href="#creative">
            Explore the creative side{' '}
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}