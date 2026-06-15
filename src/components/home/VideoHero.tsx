'use client';

// ============================================================
// VideoHero — Full-screen looping video background
// ============================================================

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260329_050842_be71947f-f16e-4a14-810c-06e83d23ddb5.mp4';

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
