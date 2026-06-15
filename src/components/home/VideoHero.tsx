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

  // ---- Inline SVG icons ----
  const StarIcon = (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );

  const AIIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );

  const ChevronDown = (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );

  const PaperclipIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
    </svg>
  );

  const MicIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
      <path d="M19 10v2a7 7 0 01-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );

  const SearchIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );

  const UpArrowIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );

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

      {/* ---- Hero Content ---- */}
      <div className="relative z-10 h-full flex items-center justify-center -mt-[50px]">
        <div className="w-full max-w-[1200px] mx-auto px-[120px]">
          <div className="flex flex-col items-center text-center">
            {/* ============================================================
                Badge Row
                ============================================================ */}
            <div className="flex items-center gap-2 mb-[34px]">
              {/* "New" badge — dark */}
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-[14px] font-normal"
                style={{
                  fontFamily: 'var(--font-inter)',
                  background: 'var(--hero-dark-badge)',
                }}
              >
                {StarIcon}
                New
              </span>
              {/* "Discover what's possible" badge — light */}
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-[14px] font-normal shadow-sm"
                style={{
                  fontFamily: 'var(--font-inter)',
                  background: 'var(--hero-light-bg)',
                  color: 'var(--hero-black)',
                }}
              >
                Discover what&apos;s possible
              </span>
            </div>

            {/* ============================================================
                Headline
                ============================================================ */}
            <h1
              className="mb-[34px] max-w-[800px]"
              style={{
                fontFamily: 'var(--font-fustat)',
                fontWeight: 700,
                fontSize: '80px',
                lineHeight: 'none',
                letterSpacing: '-4.8px',
                color: 'var(--hero-black)',
              }}
            >
              Transform Data Quickly
            </h1>

            {/* ============================================================
                Subtitle
                ============================================================ */}
            <p
              className="mb-[44px] max-w-[736px]"
              style={{
                fontFamily: 'var(--font-fustat)',
                fontWeight: 500,
                fontSize: '20px',
                letterSpacing: '-0.4px',
                color: 'var(--hero-gray)',
                lineHeight: 1.5,
              }}
            >
              Upload your information and get powerful insights right away.
              Work smarter and achieve goals effortlessly.
            </p>

            {/* ============================================================
                Search Input Box
                ============================================================ */}
            <div
              className="w-full max-w-[728px] rounded-[18px] p-4 backdrop-blur-xl"
              style={{ background: 'rgba(0,0,0,0.24)' }}
            >
              {/* Top row: credits + AI badge */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span
                    className="text-white"
                    style={{
                      fontFamily: 'var(--font-schibsted)',
                      fontWeight: 500,
                      fontSize: '12px',
                    }}
                  >
                    60/450 credits
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full text-white text-[11px] font-medium"
                    style={{
                      fontFamily: 'var(--font-schibsted)',
                      background: 'var(--hero-green)',
                    }}
                  >
                    Upgrade
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-white/70">{AIIcon}</span>
                  <span
                    className="text-white/70"
                    style={{
                      fontFamily: 'var(--font-schibsted)',
                      fontWeight: 500,
                      fontSize: '12px',
                    }}
                  >
                    Powered by GPT-4o
                  </span>
                </div>
              </div>

              {/* Main input area */}
              <div
                className="flex items-center gap-3 px-4 py-3.5 rounded-[12px] shadow-md"
                style={{ background: '#ffffff' }}
              >
                <input
                  type="text"
                  placeholder="Type question..."
                  className="flex-1 bg-transparent border-none outline-none text-[16px] placeholder:text-black/40"
                  style={{
                    fontFamily: 'var(--font-inter)',
                    color: 'rgba(0,0,0,0.8)',
                  }}
                />
                <button
                  className="shrink-0 w-9 h-9 rounded-full bg-black flex items-center justify-center hover:bg-black/80 transition-colors"
                  aria-label="Submit"
                >
                  <span className="text-white">{UpArrowIcon}</span>
                </button>
              </div>

              {/* Bottom row: action buttons + char counter */}
              <div className="flex items-center justify-between mt-3 px-1">
                {/* Left: action buttons */}
                <div className="flex items-center gap-2">
                  <button
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] text-white/80 hover:text-white hover:bg-white/[0.08] transition-colors text-[12px]"
                    style={{
                      fontFamily: 'var(--font-schibsted)',
                      fontWeight: 500,
                      background: 'rgba(255,255,255,0.08)',
                    }}
                  >
                    {PaperclipIcon}
                    Attach
                  </button>
                  <button
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] text-white/80 hover:text-white hover:bg-white/[0.08] transition-colors text-[12px]"
                    style={{
                      fontFamily: 'var(--font-schibsted)',
                      fontWeight: 500,
                      background: 'rgba(255,255,255,0.08)',
                    }}
                  >
                    {MicIcon}
                    Voice
                  </button>
                  <button
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] text-white/80 hover:text-white hover:bg-white/[0.08] transition-colors text-[12px]"
                    style={{
                      fontFamily: 'var(--font-schibsted)',
                      fontWeight: 500,
                      background: 'rgba(255,255,255,0.08)',
                    }}
                  >
                    {SearchIcon}
                    Prompts
                  </button>
                </div>
                {/* Right: character counter */}
                <span
                  className="text-white/50"
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '12px',
                  }}
                >
                  0/3,000
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Scroll indicator ---- */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="flex flex-col items-center gap-2 opacity-25">
          <span
            className="text-white font-medium tracking-widest uppercase"
            style={{
              fontFamily: 'var(--font-schibsted)',
              fontSize: '10px',
            }}
          >
            Scroll
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-white animate-bounce"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
