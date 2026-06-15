'use client';

import { useRef, useEffect, useCallback } from 'react';

// ============================================================
// VideoHero — Full-screen looping video background + hero content
// Custom JS fade system (requestAnimationFrame, NO CSS transitions)
// ============================================================

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260329_050842_be71947f-f16e-4a14-810c-06e83d23ddb5.mp4';

export function VideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadeAnimRef = useRef<number | null>(null);
  const isFadingOutRef = useRef(false);

  // ---- Cancel any running fade animation ----
  const cancelFade = useCallback(() => {
    if (fadeAnimRef.current !== null) {
      cancelAnimationFrame(fadeAnimRef.current);
      fadeAnimRef.current = null;
    }
  }, []);

  // ---- rAF-based fade from current opacity to target over `duration` ms ----
  const fadeTo = useCallback(
    (target: number, duration: number) => {
      cancelFade();
      const video = videoRef.current;
      if (!video) return;

      const startOpacity = parseFloat(video.style.opacity || '1');
      // If already at target, skip
      if (Math.abs(startOpacity - target) < 0.01) return;

      const startTime = performance.now();

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentOpacity = startOpacity + (target - startOpacity) * progress;
        if (video) {
          video.style.opacity = String(currentOpacity);
        }
        if (progress < 1) {
          fadeAnimRef.current = requestAnimationFrame(animate);
        } else {
          fadeAnimRef.current = null;
        }
      };

      fadeAnimRef.current = requestAnimationFrame(animate);
    },
    [cancelFade],
  );

  // ---- Fade in over 250ms ----
  const fadeIn = useCallback(() => {
    isFadingOutRef.current = false;
    fadeTo(1, 250);
  }, [fadeTo]);

  // ---- Fade out over 250ms ----
  const fadeOut = useCallback(() => {
    isFadingOutRef.current = true;
    fadeTo(0, 250);
  }, [fadeTo]);

  // ---- Attach video event listeners ----
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Start invisible, then fade in when ready
    video.style.opacity = '0';

    const handleLoadedData = () => {
      fadeIn();
    };

    const handleTimeUpdate = () => {
      if (!video.duration) return;
      const remaining = video.duration - video.currentTime;
      // Start fade-out when 0.55 seconds remain, but only trigger once
      if (remaining <= 0.55 && !isFadingOutRef.current) {
        fadeOut();
      }
    };

    const handleEnded = () => {
      video.style.opacity = '0';
      cancelFade();
      setTimeout(() => {
        video.currentTime = 0;
        video.play().catch(() => {});
        // fadeIn will be triggered by loadeddata or timeupdate at time~0
      }, 100);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      cancelFade();
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [fadeIn, fadeOut, cancelFade]);

  // ============================================================
  // Render
  // ============================================================
  return (
    <section className="relative h-screen min-h-[700px] max-h-[1080px] overflow-hidden bg-black">
      {/* ---- Video Background ---- */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          src={VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute top-0 left-1/2 -translate-x-1/2 h-[115%]"
          style={{
            width: '115%',
            objectFit: 'cover',
            objectPosition: 'top',
          }}
        />
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(0,0,0,0.24)' }}
        />
      </div>
    </section>
  );
}
