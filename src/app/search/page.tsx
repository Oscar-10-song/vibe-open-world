'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import type { ProjectWithRelations } from '@/types';

// ============================================================
// ProjectCard — inline card matching FeaturedWorks style
// ============================================================
function ProjectCard({ project, index }: { project: ProjectWithRelations; index: number }) {
  return (
    <div
      className="animate-[count-up_0.5s_ease-out_both]"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="group block rounded-xl border border-black/[0.06] bg-white hover:border-black/[0.12] hover:shadow-md transition-all duration-300 overflow-hidden"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-[#f2f2f2]">
          <img
            src={project.screenshot_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            loading="lazy"
          />
          {project.category && (
            <span className="absolute top-3 left-3 text-[10px] px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[#505050] border border-black/[0.08]">
              {project.category.name}
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-sm font-semibold text-[#0f1419] group-hover:text-black transition-colors truncate">
            {project.title}
          </h3>
          <p className="mt-1 text-xs text-[#505050] line-clamp-2">
            {project.tagline}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-[#f2f2f2] flex items-center justify-center text-[10px] text-[#505050]">
                {project.author.avatar_url ? (
                  <img src={project.author.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  project.author.name.charAt(0)
                )}
              </div>
              <span className="text-[11px] text-[#8b98a5] truncate max-w-[100px]">
                {project.author.name}
              </span>
            </div>
            <span className="text-[11px] text-[#8b98a5]">
              {project.view_count > 0 ? `${project.view_count.toLocaleString()} views` : ''}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

// ============================================================
// Skeleton card for loading state
// ============================================================
function SkeletonCard() {
  return (
    <div className="rounded-xl border border-black/[0.06] bg-white overflow-hidden animate-pulse">
      <div className="aspect-[16/10] bg-[#f2f2f2]" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-[#f2f2f2] rounded w-3/4" />
        <div className="h-3 bg-[#f2f2f2] rounded w-full" />
        <div className="h-3 bg-[#f2f2f2] rounded w-1/2" />
      </div>
    </div>
  );
}

// ============================================================
// SearchPage
// ============================================================
export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<ProjectWithRelations[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setTotal(0);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}&limit=12`);
      const data = await res.json();
      if (data.success) {
        setResults(data.results || []);
        setTotal(data.total || 0);
      }
    } catch {
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search on input change with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 300);
  };

  // Search on mount if URL has q param
  useEffect(() => {
    if (initialQuery) doSearch(initialQuery);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen pt-28 pb-20 bg-white">
      <Container>
        {/* Search header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0f1419] tracking-tight mb-4">
            Find AI Creations
          </h1>
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b98a5]"
              width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search projects, tools, creators..."
              autoFocus
              className="w-full pl-11 pr-4 py-3.5 text-base rounded-xl border border-black/[0.08] bg-white text-[#0f1419] placeholder:text-[#8b98a5] focus:outline-none focus:border-black/[0.2] focus:ring-2 focus:ring-black/[0.04] transition-all"
            />
          </div>
          {searched && !loading && (
            <p className="mt-3 text-sm text-[#8b98a5]">
              {total > 0
                ? `${total} project${total !== 1 ? 's' : ''} found for "${initialQuery || query}"`
                : `No results for "${initialQuery || query}"`}
            </p>
          )}
        </div>

        {/* Results grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        ) : searched ? (
          <div className="text-center py-16">
            <span className="text-5xl mb-5 block">🔍</span>
            <p className="text-[#505050] text-lg mb-2">No projects found</p>
            <p className="text-sm text-[#8b98a5] mb-8">
              Try a different search term, or be the first to submit something in this area.
            </p>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0f1419] text-white text-sm font-medium hover:bg-black transition-colors"
            >
              Submit a Project
            </Link>
          </div>
        ) : null}
      </Container>
    </div>
  );
}
