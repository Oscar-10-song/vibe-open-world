import { ProjectWithRelations } from '@/types';
import { ProjectCard } from './ProjectCard';
import { EmptyState } from '@/components/ui/EmptyState';

interface ProjectGridProps {
  projects: ProjectWithRelations[];
  emptyMessage?: string;
}

export function ProjectGrid({ projects, emptyMessage = 'No projects yet.' }: ProjectGridProps) {
  if (projects.length === 0) {
    return <EmptyState icon="🚀" title={emptyMessage} description="Be the first to submit your AI-powered project!" />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
