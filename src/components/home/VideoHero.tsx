'use client';

// ============================================================
// VideoHero — Full-screen looping video background
// ============================================================

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260329_050842_be71947f-f16e-4a14-810c-06e83d23ddb5.mp4';

const TAGLINE =
  'This world is so beautiful, because so many beautiful ideas were born here.';

export function VideoHero() {
  return (
    <section className="relative h-screen min-h-[700px] max-h-[1080px] overflow-hidden bg-black">
      {/* ---- Video Background ---- */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          src={VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'top' }}
        />
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(0,0,0,0.24)' }}
        />
      </div>

      {/* ---- Brand Tagline ---- */}
      <div className="absolute inset-0 flex items-center justify-center z-[2] pointer-events-none">
        <div className="text-center px-6 max-w-[620px] pt-[6vh]">
          {/* Subtle rule */}
          <div
            className="mx-auto mb-7"
            style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.18)' }}
          />
          {/* Text */}
          <p
            className="text-[17px] sm:text-[20px] leading-[1.7]"
            style={{
              fontFamily: 'var(--font-fustat)',
              fontWeight: 400,
              letterSpacing: '0.02em',
              color: 'rgba(255,255,255,0.48)',
              textWrap: 'balance',
              animation: 'hero-tagline-in 2s 1.2s ease-out both',
            }}
          >
            {TAGLINE}
          </p>
        </div>
      </div>
    </section>
  );
}
