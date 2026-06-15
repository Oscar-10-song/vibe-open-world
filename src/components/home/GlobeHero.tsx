'use client';

import { useState, useCallback, useRef, useEffect, Component } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProjectWithRelations } from '@/types';

// ============================================================
// Error Boundary — isolates globe failures
// ============================================================
class GlobeErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean; errorMessage: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      errorMessage: error?.message || error?.toString?.() || 'Unknown error',
    };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[GlobeErrorBoundary]', error?.message, errorInfo?.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 bg-[#08080f] flex items-center justify-center">
          <div className="text-center max-w-md px-6">
            <p className="text-sm text-white/30 font-mono">Globe unavailable</p>
            <details className="mt-2">
              <summary className="text-xs text-white/15 cursor-pointer hover:text-white/25 font-mono">
                Error details
              </summary>
              <p className="text-xs text-white/12 mt-1 font-mono break-all">
                {this.state.errorMessage}
              </p>
            </details>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============================================================
// Dynamic import — no SSR for WebGL
// ============================================================
const GlobeScene = dynamic(
  () => import('./GlobeScene').then(m => ({ default: m.GlobeScene })),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center bg-[#08080f]">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-500/20 border-t-indigo-400 animate-spin mx-auto mb-4" />
          <p className="text-xs text-white/25 font-mono tracking-widest uppercase">Loading Globe</p>
        </div>
      </div>
    ),
  },
);

// ============================================================
// Types
// ============================================================
interface GlobeHeroProps {
  projects: ProjectWithRelations[];
}

// ============================================================
// GlobeHero — Stripe-style left content + right globe
// ============================================================
export function GlobeHero({ projects }: GlobeHeroProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectWithRelations | null>(null);
  const [cardVisible, setCardVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const onProjectClickRef = useRef<((project: ProjectWithRelations) => void) | undefined>(undefined);

  const handleProjectClick = useCallback((project: ProjectWithRelations) => {
    if (selectedProject?.id === project.id && cardVisible) {
      dismissCard();
      return;
    }
    setSelectedProject(project);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCardVisible(true), 50);
  }, [selectedProject, cardVisible]);

  onProjectClickRef.current = handleProjectClick;

  const dismissCard = useCallback(() => {
    setCardVisible(false);
    timeoutRef.current = setTimeout(() => setSelectedProject(null), 300);
  }, []);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <section className="relative h-screen min-h-[650px] max-h-[1000px] overflow-hidden bg-[#08080f]">
      {/* ============================================================
          Globe — right half
          ============================================================ */}
      <div className="absolute inset-0 lg:left-[42%] lg:inset-y-0">
        <GlobeErrorBoundary>
          <GlobeScene projects={projects} onProjectClickRef={onProjectClickRef} />
        </GlobeErrorBoundary>
      </div>

      {/* Globe gradient overlay — fade right edge */}
      <div
        className="absolute inset-y-0 left-0 w-[48%] pointer-events-none z-[2] hidden lg:block"
        style={{
          background: 'linear-gradient(to right, #08080f 30%, rgba(8,8,15,0.85) 60%, rgba(8,8,15,0) 100%)',
        }}
      />

      {/* Globe bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none z-[2]"
        style={{
          background: 'linear-gradient(to top, #08080f 20%, rgba(8,8,15,0.6) 50%, transparent 100%)',
        }}
      />

      {/* Top subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: `
            radial-gradient(ellipse at 70% 30%, rgba(99,102,241,0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 30% 60%, rgba(249,115,22,0.04) 0%, transparent 50%)
          `,
        }}
      />

      {/* ============================================================
          Left content — text + CTAs (Stripe-style)
          ============================================================ */}
      <div className="relative z-[3] h-full flex items-center">
        <div className="w-full max-w-[var(--content-width)] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-lg">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400" />
              </span>
              <span className="text-[11px] tracking-[0.2em] uppercase text-white/40 font-mono font-medium">
                AI Creator Showcase
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white text-balance leading-[1.06]"
            >
              Explore AI{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-300 bg-clip-text text-transparent">
                Creations
              </span>
              <br />
              Around The World
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-5 text-base sm:text-lg text-white/35 text-balance max-w-md leading-relaxed"
            >
              Discover AI-generated artworks, videos, music, games, and projects
              created by creators worldwide.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-[#0f1419] text-sm font-semibold hover:bg-white/90 transition-all duration-200 shadow-lg shadow-white/5"
              >
                Explore Works
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/[0.04] border border-white/[0.1] text-white/60 text-sm font-medium hover:bg-white/[0.08] hover:text-white/80 hover:border-white/[0.15] transition-all duration-200 backdrop-blur-sm"
              >
                Submit Your Work
              </Link>
            </motion.div>

            {/* Globe interaction hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-6 text-xs text-white/20 font-mono tracking-wide hidden lg:block"
            >
              Drag to rotate · Scroll to zoom · Click markers to explore
            </motion.p>
          </div>
        </div>
      </div>

      {/* ============================================================
          Project Card Popup
          ============================================================ */}
      <AnimatePresence>
        {selectedProject && (
          <>
            {/* Click-outside overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[10]"
              onClick={dismissCard}
            />

            {/* Card */}
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{
                opacity: cardVisible ? 1 : 0,
                y: cardVisible ? 0 : 16,
                scale: cardVisible ? 1 : 0.96,
              }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="absolute bottom-24 right-8 z-[20] pointer-events-auto"
            >
              <div className="w-[340px] rounded-xl border border-white/[0.08] bg-[#0c0c18]/95 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden">
                {/* Screenshot */}
                <div className="relative aspect-[16/10] bg-[#0d0d20]">
                  <img
                    src={selectedProject.screenshot_url}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/[0.04]" />
                  <button
                    onClick={dismissCard}
                    className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 border border-white/10 flex items-center justify-center hover:bg-black/80 transition-colors"
                    aria-label="Close"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white/60">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
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
                      <p className="text-xs text-white/35 truncate mt-0.5">
                        {selectedProject.tagline}
                      </p>
                    </div>
                    {selectedProject.category && (
                      <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {selectedProject.category.name}
                      </span>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-[11px] text-white/25 mb-3">
                    <span className="flex items-center gap-1">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 10-16 0" />
                      </svg>
                      {selectedProject.author.name}
                    </span>
                    {selectedProject.dev_duration && (
                      <span className="flex items-center gap-1">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                        </svg>
                        {selectedProject.dev_duration}
                      </span>
                    )}
                  </div>

                  {/* Action */}
                  <Link
                    href={`/projects/${selectedProject.slug}`}
                    onClick={dismissCard}
                    className="block w-full text-center text-xs font-medium py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/45 hover:bg-white/[0.08] hover:text-white/70 transition-all"
                  >
                    View Project →
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[3] pointer-events-none"
      >
        <div className="flex flex-col items-center gap-2 opacity-25">
          <span className="text-[10px] text-white font-mono tracking-widest uppercase">Scroll</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white animate-bounce">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}
