'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { ProjectWithRelations } from '@/types';

// ============================================================
// Types
// ============================================================
interface GlobePoint {
  lat: number;
  lng: number;
  size: number;
  color: string;
  label?: string;
  project?: ProjectWithRelations;
}

interface GlobeSceneProps {
  projects: ProjectWithRelations[];
  onProjectClick?: (project: ProjectWithRelations) => void;
}

// ============================================================
// City coordinates for real projects + ambient points
// ============================================================
const WORLD_CITIES: [number, number, string][] = [
  // Major tech hubs (project-anchored)
  [37.77, -122.42, 'San Francisco'],
  [40.71, -74.01, 'New York'],
  [51.51, -0.13, 'London'],
  [52.52, 13.40, 'Berlin'],
  [35.69, 139.69, 'Tokyo'],
  [-33.87, 151.21, 'Sydney'],
  [12.97, 77.59, 'Bangalore'],
  [-23.55, -46.63, 'São Paulo'],
  [55.76, 37.62, 'Moscow'],
  [48.86, 2.35, 'Paris'],
  [39.90, 116.41, 'Beijing'],
  [31.23, 121.47, 'Shanghai'],
  [37.57, 126.98, 'Seoul'],
  [1.35, 103.82, 'Singapore'],
  [59.33, 18.07, 'Stockholm'],
  [55.68, 12.57, 'Copenhagen'],
  [52.37, 4.90, 'Amsterdam'],
  [41.01, 28.98, 'Istanbul'],
  [25.20, 55.27, 'Dubai'],
  [19.08, 72.88, 'Mumbai'],
  [34.05, -118.24, 'Los Angeles'],
  [47.61, -122.33, 'Seattle'],
  [51.04, -114.07, 'Calgary'],
  [-34.60, -58.38, 'Buenos Aires'],
  [14.60, 120.98, 'Manila'],
  [13.75, 100.50, 'Bangkok'],
  [33.89, 35.50, 'Beirut'],
  [-1.29, 36.82, 'Nairobi'],
  [-26.20, 28.05, 'Johannesburg'],
  [30.04, 31.24, 'Cairo'],
  [53.35, -6.26, 'Dublin'],
  [45.42, -75.69, 'Ottawa'],
  [37.98, 23.73, 'Athens'],
  [41.90, 12.50, 'Rome'],
  [40.42, -3.70, 'Madrid'],
  [50.45, 30.52, 'Kyiv'],
  [59.91, 10.75, 'Oslo'],
  [60.17, 24.94, 'Helsinki'],
  [43.65, -79.38, 'Toronto'],
  [22.32, 114.17, 'Hong Kong'],
];

// Smaller ambient points for visual density
const AMBIENT_POINTS: [number, number][] = [
  [44.43, 26.10], [52.23, 21.01], [45.07, 7.68], [57.71, 11.97],
  [47.50, 19.04], [41.72, 44.79], [33.51, 36.31], [29.38, 47.98],
  [36.82, 10.18], [33.89, 9.54], [32.89, 13.18], [6.52, 3.38],
  [5.56, -0.20], [9.06, 7.49], [-4.32, 15.31], [-11.67, 27.48],
  [-15.42, 28.29], [-18.92, 47.52], [-25.74, 28.19], [-29.32, 27.48],
  [8.98, 38.76], [-6.17, 35.74], [-6.80, 39.28], [-1.94, 30.06],
  [33.57, -7.59], [36.75, 3.06], [28.03, 1.66], [18.07, -15.97],
  [14.69, -17.45], [6.35, 2.41], [-4.05, 39.67], [-3.38, 29.36],
  [38.72, -9.14], [41.16, -8.63], [48.11, -1.68], [44.84, -0.58],
  [50.84, 4.35], [53.48, -2.24], [51.45, -2.60], [42.70, 23.32],
  [46.05, 14.50], [48.15, 17.11], [54.90, 23.90], [56.95, 24.10],
  [62.06, 129.74], [47.92, 106.92], [42.87, 74.59], [41.30, 69.27],
  [48.02, 66.92], [51.17, 71.47], [43.24, 76.92], [38.57, 68.79],
  [-12.05, -77.04], [10.48, -66.87], [4.65, -74.06], [-0.21, -78.49],
];

function generatePoints(projects: ProjectWithRelations[]): GlobePoint[] {
  const points: GlobePoint[] = [];

  // Map real projects to cities (orange/amber glow)
  const shuffledCities = [...WORLD_CITIES].sort(() => Math.random() - 0.5);
  projects.forEach((project, i) => {
    const city = shuffledCities[i] || WORLD_CITIES[i % WORLD_CITIES.length];
    points.push({
      lat: city[0] + (Math.random() - 0.5) * 2,
      lng: city[1] + (Math.random() - 0.5) * 2,
      size: 0.35 + Math.random() * 0.15,
      color: '#f97316',
      label: `${project.title}\n${project.tagline}`,
      project,
    });
  });

  // Add ambient dimmer points for visual density (cyan/blue tiny dots)
  AMBIENT_POINTS.forEach(([lat, lng]) => {
    points.push({
      lat: lat + (Math.random() - 0.5) * 3,
      lng: lng + (Math.random() - 0.5) * 3,
      size: 0.08 + Math.random() * 0.1,
      color: Math.random() > 0.7 ? '#22d3ee' : '#818cf8',
    });
  });

  return points;
}

// ============================================================
// GlobeScene Component
// ============================================================
export function GlobeScene({ projects, onProjectClick }: GlobeSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeEl = useRef<any>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  const initGlobe = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      const Globe = (await import('globe.gl')).default;

      // Guard against unmount during async import
      if (!containerRef.current) return;

      const points = generatePoints(projects);

      // Fetch GeoJSON country data
      let countries: any = { features: [] };
      try {
        const geoRes = await fetch(
          'https://cdn.jsdelivr.net/npm/three-globe/example/datasets/ne_110m_admin_0_countries.geojson'
        );
        if (geoRes.ok) countries = await geoRes.json();
      } catch {
        // Proceed without country borders if fetch fails
      }

      // globe.gl types say `new Globe()` but runtime is `Globe()`
      const globe = (Globe as any)()(containerRef.current)
        // Globe texture — dark earth
        .globeImageUrl('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-dark.jpg')
        .bumpImageUrl('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png')
        .backgroundColor('#000011')
        .atmosphereColor('#1e1b4b')
        .atmosphereAltitude(0.22)
        // Country borders — dot-based for glowing tech effect
        .hexPolygonsData(countries.features)
        .hexPolygonColor(() => '#0c0e1a')
        .hexPolygonAltitude(0.004)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.15)
        .hexPolygonUseDots(true)
        .hexPolygonDotResolution(10)
        // Points — projects + ambient
        .pointsData(points)
        .pointColor((p: any) => p.color)
        .pointAltitude(0.005)
        .pointRadius((p: any) => p.size)
        .pointLabel((p: any) => p.label || '')
        // Click
        .onPointClick((p: GlobePoint) => {
          if (p.project && onProjectClick) {
            onProjectClick(p.project);
          }
        })
        // Interaction
        .enablePointerInteraction(true)
        .showPointerCursor(true);

      // Auto-rotate slowly
      const controls = globe.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.35;
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.minDistance = 150;
      controls.maxDistance = 800;

      // Set initial point of view (angled, showing Americas + Europe)
      globe.pointOfView({ lat: 20, lng: 0, altitude: 2.2 }, 0);

      globeEl.current = globe;
      setStatus('ready');
    } catch (err: any) {
      console.error('Globe init error:', err);
      setErrorMsg(err.message || 'Failed to initialize globe');
      setStatus('error');
    }
  }, [projects, onProjectClick]);

  useEffect(() => {
    let cancelled = false;

    // Small delay to let the DOM settle (improves initial paint)
    const timer = setTimeout(() => {
      if (!cancelled) initGlobe();
    }, 100);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (globeEl.current) {
        globeEl.current._destructor?.();
        globeEl.current = null;
      }
    };
  }, [initGlobe]);

  // Handle resize
  useEffect(() => {
    function onResize() {
      if (globeEl.current) {
        const w = containerRef.current?.clientWidth;
        const h = containerRef.current?.clientHeight;
        if (w && h) {
          globeEl.current.width(w);
          globeEl.current.height(h);
        }
      }
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0">
      {/* Loading / Error states */}
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#000011]">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-2 border-[var(--color-accent)]/30 border-t-[var(--color-accent)] animate-spin mx-auto mb-4" />
            <p className="text-sm text-[var(--color-text-tertiary)] font-mono">Loading globe...</p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#000011]">
          <div className="text-center px-6">
            <span className="text-4xl mb-4 block">🌍</span>
            <p className="text-sm text-[var(--color-text-secondary)]">{errorMsg}</p>
            <p className="text-xs text-[var(--color-text-tertiary)] mt-2">
              The globe requires WebGL. Try a different browser.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
