'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import type { ProjectWithRelations } from '@/types';

// ============================================================
// Single Work Card
// ============================================================
function WorkCard({ project, index }: { project: ProjectWithRelations; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="group block rounded-xl border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/[0.12] transition-all duration-300 overflow-hidden"
      >
        {/* Cover */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[#0d0d20]">
          <img
            src={project.screenshot_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/[0.04]" />

          {/* Category badge */}
          {project.category && (
            <span className="absolute top-3 left-3 text-[10px] px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white/70 border border-white/[0.08]">
              {project.category.name}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-white group-hover:text-white/90 transition-colors truncate">
            {project.title}
          </h3>
          <p className="mt-1 text-xs text-white/35 truncate">
            {project.tagline}
          </p>

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-white/[0.06] flex items-center justify-center text-[10px]">
                {project.author.avatar_url ? (
                  <img src={project.author.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  project.author.name.charAt(0)
                )}
              </div>
              <span className="text-[11px] text-white/30 truncate max-w-[100px]">
                {project.author.name}
              </span>
            </div>

            {/* Like count placeholder */}
            <span className="flex items-center gap-1 text-[11px] text-white/20">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {project.view_count > 0 ? project.view_count.toLocaleString() : '—'}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ============================================================
// FeaturedWorks Section
// ============================================================
interface FeaturedWorksProps {
  projects: ProjectWithRelations[];
}

export function FeaturedWorks({ projects }: FeaturedWorksProps) {
  if (projects.length === 0) return null;

  return (
    <section className="py-24 sm:py-32">
      <Container>
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
            >
              Featured Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mt-2 text-sm text-white/30"
            >
              Hand-picked AI creations from the community
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href="/explore"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-white/35 hover:text-white/60 transition-colors"
            >
              View all
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.slice(0, 6).map((project, i) => (
            <WorkCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
