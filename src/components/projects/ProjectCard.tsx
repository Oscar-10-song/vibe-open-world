import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProjectWithRelations } from '@/types';
import { timeAgo } from '@/lib/utils';

interface ProjectCardProps {
  project: ProjectWithRelations;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`} className="block no-underline group">
      <Card hover padding={false} className="overflow-hidden h-full flex flex-col">
        {/* Screenshot */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-bg-tertiary)]">
          <img
            src={project.screenshot_url}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* Status badge */}
          {project.status === 'featured' && (
            <span className="absolute top-3 left-3 bg-[var(--color-accent)] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">
              Featured
            </span>
          )}
          {project.is_profitable && (
            <span className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">
              $$$
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* AI Tools */}
          {project.ai_tools.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {project.ai_tools.slice(0, 3).map(tool => (
                <span
                  key={tool.id}
                  className="text-[10px] text-[var(--color-text-tertiary)] bg-[var(--color-bg-tertiary)] px-1.5 py-0.5 rounded"
                >
                  {tool.name}
                </span>
              ))}
            </div>
          )}

          <h3 className="font-semibold text-[var(--color-text)] mb-1 line-clamp-1 group-hover:text-[var(--color-accent)] transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-3 flex-1">
            {project.tagline}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-[var(--color-text-tertiary)]">
            <span>{project.author.name}</span>
            <span>{timeAgo(project.published_at || project.created_at)}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
