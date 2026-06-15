'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { ProjectWithRelations } from '@/types';

// Dynamic import — no SSR for WebGL/Three.js
const GlobeScene = dynamic(() => import('./GlobeScene').then(m => ({ default: m.GlobeScene })), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-[#000011]">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-2 border-[var(--color-accent)]/30 border-t-[var(--color-accent)] animate-spin mx-auto mb-4" />
        <p className="text-sm text-[var(--color-text-tertiary)] font-mono tracking-wider">
          LOADING GLOBE
        </p>
      </div>
    </div>
  ),
});

interface GlobeHeroProps {
  projects: ProjectWithRelations[];
}

export function GlobeHero({ projects }: GlobeHeroProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectWithRelations | null>(null);
  const [cardVisible, setCardVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleProjectClick = useCallback((project: ProjectWithRelations) => {
    // Dismiss current card if clicking the same point
    if (selectedProject?.id === project.id && cardVisible) {
      dismissCard();
      return;
    }
    setSelectedProject(project);
    // Tiny delay for smooth animation trigger
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCardVisible(true), 50);
  }, [selectedProject, cardVisible]);

  const dismissCard = useCallback(() => {
    setCardVisible(false);
    timeoutRef.current = setTimeout(() => setSelectedProject(null), 300);
  }, []);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden bg-[#000011]">
      {/* 3D Globe background */}
      <GlobeScene projects={projects} onProjectClick={handleProjectClick} />

      {/* Top-left gradient vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(30,27,75,0.5) 0%, transparent 60%),
            radial-gradient(ellipse at 70% 50%, rgba(2,132,199,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 100%, rgba(0,0,17,0.8) 0%, transparent 50%)
          `,
        }}
      />

      {/* Text overlay — bottom-left, elegant */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <div className="max-w-[var(--content-width)] mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
          <div className="max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 mb-5 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shadow-[0_0_8px_var(--color-accent)]" />
              <span className="text-[11px] tracking-widest uppercase text-white/50 font-mono">
                Vibe Coding Directory
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white text-balance leading-[1.08]">
              Built with{' '}
              <span className="bg-gradient-to-r from-[var(--color-accent)] via-amber-400 to-orange-300 bg-clip-text text-transparent">
                AI
              </span>
              ,<br />
              Shipped by{' '}
              <span className="text-white/90">Humans</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-sm sm:text-base text-white/40 text-balance max-w-md leading-relaxed">
              Discover what solo builders are creating with Claude, Cursor, Bolt, and other AI tools.
              Drag the globe to explore.
            </p>

            {/* CTAs */}
            <div className="mt-6 flex items-center gap-3 pointer-events-auto">
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-all duration-200 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]"
              >
                Submit Your Project
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link
                href="/categories/saas"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/60 text-sm font-medium hover:bg-white/[0.08] hover:text-white/80 transition-all duration-200 backdrop-blur-sm"
              >
                Explore Projects
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade gradient for text readability */}
      <div
        className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,17,0.95) 0%, rgba(0,0,17,0.6) 40%, transparent 100%)',
        }}
      />

      {/* Scroll indicator */}
      <div className="absolute bottom-6 right-6 pointer-events-none">
        <div className="flex flex-col items-center gap-1 opacity-30">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white animate-bounce">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>

      {/* ============================================================
         Project Card Popup
         ============================================================ */}
      {selectedProject && (
        <div
          className={[
            'absolute bottom-32 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-8 sm:bottom-24',
            'pointer-events-auto z-20 transition-all duration-300 ease-out',
            cardVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4',
          ].join(' ')}
        >
          <div className="w-[320px] rounded-xl border border-white/[0.08] bg-[#0a0a14]/95 backdrop-blur-xl shadow-2xl shadow-black/50">
            {/* Screenshot */}
            <div className="relative aspect-[16/10] rounded-t-xl overflow-hidden bg-[#0d0d1a]">
              <img
                src={selectedProject.screenshot_url}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 rounded-t-xl ring-1 ring-inset ring-white/[0.04]" />
              {/* Close button */}
              <button
                onClick={dismissCard}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 border border-white/10 flex items-center justify-center hover:bg-black/80 transition-colors"
                aria-label="Close"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white/70">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-white truncate">
                    {selectedProject.title}
                  </h3>
                  <p className="text-xs text-white/40 truncate mt-0.5">
                    {selectedProject.tagline}
                  </p>
                </div>
                {selectedProject.category && (
                  <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20">
                    {selectedProject.category.name}
                  </span>
                )}
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-4 text-[11px] text-white/30 mb-3">
                <span className="flex items-center gap-1">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/></svg>
                  {selectedProject.author.name}
                </span>
                {selectedProject.dev_duration && (
                  <span className="flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {selectedProject.dev_duration}
                  </span>
                )}
                {selectedProject.is_profitable && (
                  <span className="text-green-400/60">💰 Revenue</span>
                )}
              </div>

              {/* Action */}
              <Link
                href={`/projects/${selectedProject.slug}`}
                onClick={dismissCard}
                className="block w-full text-center text-xs font-medium py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/50 hover:bg-white/[0.08] hover:text-white/80 transition-all"
              >
                View Project →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Click-outside overlay to dismiss card */}
      {selectedProject && (
        <div
          className="absolute inset-0 z-10 pointer-events-auto"
          onClick={dismissCard}
        />
      )}
    </section>
  );
}
