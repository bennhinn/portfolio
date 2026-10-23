"use client";

import { useEffect, useRef, useState } from 'react';

/**
 * The Seatly miniature is a 15-second video assembled from five illustrated
 * keyframes. It is NOT a rigged 3D scene or screen recording of the Seatly app.
 * The composition remains fixed; subtle activity is conveyed by changing frames.
 *
 * The video is intentionally not autoplayed in the server HTML. Playback starts
 * only in the viewport and is disabled for prefers-reduced-motion visitors.
 */
export default function SeatlyMiniature() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const visibleRef = useRef(false);
  const userPausedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(media.matches);
    const begin = () => {
      if (media.matches || !visibleRef.current || userPausedRef.current) return;
      video.play().catch(() => setPlaying(false));
    };
    const onPreferenceChange = () => {
      setReduced(media.matches);
      if (media.matches) video.pause();
      else begin();
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    media.addEventListener('change', onPreferenceChange);
    const observer = new IntersectionObserver((entries) => {
      visibleRef.current = entries[0]?.isIntersecting ?? false;
      if (visibleRef.current) begin();
      else video.pause();
    }, { threshold: 0.18 });
    observer.observe(video);
    return () => {
      observer.disconnect();
      video.pause();
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      media.removeEventListener('change', onPreferenceChange);
    };
  }, []);

  const toggle = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      userPausedRef.current = true;
      video.pause();
    } else {
      userPausedRef.current = false;
      try { await video.play(); }
      catch { setPlaying(false); }
    }
  };

  return (
    <div className="visual-v2 seatly-visual project-visual">
      <figure className="seatly-cinema">
        <video
          ref={videoRef}
          className="seatly-cinema-video"
          src="/images/seatly-miniature-loop.mp4"
          poster="/images/seatly-miniature-poster.webp"
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Animated isometric Seatly miniature illustrating venue booking, vehicle seat selection and a digital ticket"
        >
          Your browser does not support embedded video.
        </video>
        <span className="seatly-cinema-label">Seatly / Miniature world</span>
        <div className="seatly-cinema-bottom">
          <span className="seatly-cinema-caption">Discover · Select · Confirm</span>
          <button type="button" className="seatly-video-toggle" onClick={toggle} aria-label={playing ? 'Pause Seatly miniature animation' : 'Play Seatly miniature animation'}>
            <span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span> {playing ? 'Pause' : 'Play'}
          </button>
        </div>
        <figcaption className="sr-only">Illustrated 3D-style concept animation composed from keyframes, not footage of the working application. {reduced ? 'Autoplay is disabled because reduced motion is preferred.' : ''}</figcaption>
      </figure>
      <div className="seatly-experience-notes" aria-label="Booking workflow demonstrated">
        <span>01 <strong>Explore</strong></span>
        <span>02 <strong>Select a seat</strong></span>
        <span>03 <strong>Ticket</strong></span>
      </div>
      <span className="visual-label">Animated concept · Fixed camera</span>
    </div>
  );
}
