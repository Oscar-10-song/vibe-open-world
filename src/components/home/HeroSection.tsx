import { GlobeHero } from '@/components/home/GlobeHero';
import type { ProjectWithRelations } from '@/types';

interface HeroSectionProps {
  projects: ProjectWithRelations[];
}

export function HeroSection({ projects }: HeroSectionProps) {
  return <GlobeHero projects={projects} />;
}
