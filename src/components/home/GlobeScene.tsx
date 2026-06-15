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
  city?: string;
}

interface GlobeSceneProps {
  projects: ProjectWithRelations[];
  onProjectClickRef: React.MutableRefObject<((project: ProjectWithRelations) => void) | undefined>;
  onError?: (message: string) => void;
}

// ============================================================
// Major city beacons — these always glow on the globe
// ============================================================
const MAJOR_CITIES: { lat: number; lng: number; name: string }[] = [
  { lat: 35.69, lng: 139.69, name: 'Tokyo' },
  { lat: 40.71, lng: -74.01, name: 'New York' },
  { lat: 51.51, lng: -0.13, name: 'London' },
  { lat: 48.86, lng: 2.35, name: 'Paris' },
  { lat: 37.57, lng: 126.98, name: 'Seoul' },
  { lat: 1.35, lng: 103.82, name: 'Singapore' },
  { lat: 52.52, lng: 13.40, name: 'Berlin' },
  { lat: 55.76, lng: 37.62, name: 'Moscow' },
  { lat: -33.87, lng: 151.21, name: 'Sydney' },
  { lat: 12.97, lng: 77.59, name: 'Bangalore' },
  { lat: -23.55, lng: -46.63, name: 'São Paulo' },
  { lat: 19.08, lng: 72.88, name: 'Mumbai' },
  { lat: 25.20, lng: 55.27, name: 'Dubai' },
  { lat: 31.23, lng: 121.47, name: 'Shanghai' },
  { lat: 39.90, lng: 116.41, name: 'Beijing' },
];

// Ambient scatter — random points for atmosphere
const AMBIENT_DOTS_COUNT = 120;

function generateAmbientDots(): { lat: number; lng: number; size: number; color: string }[] {
  const dots: { lat: number; lng: number; size: number; color: string }[] = [];
  for (let i = 0; i < AMBIENT_DOTS_COUNT; i++) {
    // Uniform distribution on sphere
    const lat = (Math.random() - 0.5) * 180;
    const lng = (Math.random() - 0.5) * 360;
    const r = Math.random();
    dots.push({
      lat,
      lng,
      size: 0.04 + r * 0.08,
      color: r > 0.85 ? '#f97316' : r > 0.6 ? '#6366f1' : '#3b82f6',
    });
  }
  return dots;
}

// ============================================================
// Generate globe points from projects + city beacons
// ============================================================
function generatePoints(projects: ProjectWithRelations[]): GlobePoint[] {
  const points: GlobePoint[] = [];

  // City beacons — always present, larger and brighter
  MAJOR_CITIES.forEach((city, i) => {
    // Try to match a project to this city
    const project = projects[i] || null;
    points.push({
      lat: city.lat,
      lng: city.lng,
      size: project ? 0.42 : 0.28,
      color: project ? '#f97316' : '#6366f1',
      label: project
        ? `${project.title}\n${project.author.name} · ${city.name}`
        : city.name,
      project: project || undefined,
      city: city.name,
    });
  });

  // Remaining projects mapped to random locations
  if (projects.length > MAJOR_CITIES.length) {
    const remaining = projects.slice(MAJOR_CITIES.length);
    const spreadCities = [
      [41.01, 28.98], [59.33, 18.07], [55.68, 12.57],
      [52.37, 4.90], [34.05, -118.24], [47.61, -122.33],
      [43.65, -79.38], [22.32, 114.17], [13.75, 100.50],
      [14.60, 120.98], [-34.60, -58.38], [-1.29, 36.82],
      [30.04, 31.24], [-26.20, 28.05], [53.35, -6.26],
      [45.42, -75.69], [40.42, -3.70], [37.98, 23.73],
      [41.90, 12.50], [50.45, 30.52], [59.91, 10.75],
    ];
    remaining.forEach((project, i) => {
      const [lat, lng] = spreadCities[i % spreadCities.length];
      points.push({
        lat: lat + (Math.random() - 0.5) * 1.5,
        lng: lng + (Math.random() - 0.5) * 1.5,
        size: 0.25 + Math.random() * 0.1,
        color: '#f97316',
        label: `${project.title}\n${project.author.name}`,
        project,
      });
    });
  }

  // Ambient scatter dots
  const ambient = generateAmbientDots();
  ambient.forEach(d => {
    points.push({
      lat: d.lat,
      lng: d.lng,
      size: d.size,
      color: d.color,
    });
  });

  return points;
}

// ============================================================
// GlobeScene Component
// ============================================================
export function GlobeScene({ projects, onProjectClickRef, onError }: GlobeSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeEl = useRef<any>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const pointsRef = useRef<GlobePoint[]>([]);

  const initGlobe = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      // Parallel load: globe.gl lib + GeoJSON data
      const [globeModule, geojsonRes] = await Promise.all([
        import('globe.gl'),
        fetch('/ne_110m_admin_0_countries.geojson').then(r => r.json()),
      ]);

      const Globe = globeModule.default;
      if (!containerRef.current) return;

      const points = generatePoints(projects);
      pointsRef.current = points;

      // Create globe instance (globe.gl v2 factory pattern)
      const globe = (Globe as any)()(containerRef.current);

      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      if (w && h) {
        globe.width(w).height(h);
      }

      // Configure the globe
      globe
        .backgroundColor('#08080f')
        .atmosphereColor('#1e1b4b')
        .atmosphereAltitude(0.25)
        // Country borders with glow
        .hexPolygonsData(geojsonRes.features)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.3)
        .hexPolygonColor(() => 'rgba(30, 27, 75, 0.6)')
        .hexPolygonLabel((f: any) => {
          const name = f?.properties?.name;
          return name ? `<b>${name}</b>` : '';
        })
        // Points
        .pointsData(points)
        .pointColor((p: any) => p.color)
        .pointAltitude(0.01)
        .pointRadius((p: any) => p.size * 1.2)
        .pointLabel((p: any) => p.label || '')
        .pointResolution(16)
        // Interaction
        .onPointClick((p: GlobePoint) => {
          if (p.project && onProjectClickRef.current) {
            onProjectClickRef.current(p.project);
          }
        })
        .enablePointerInteraction(true)
        .showPointerCursor(true);

      // Auto-rotate + damping
      const controls = globe.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.3;
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.minDistance = 130;
      controls.maxDistance = 600;

      // Initial view
      globe.pointOfView({ lat: 20, lng: 0, altitude: 2.2 }, 0);

      globeEl.current = globe;
      setStatus('ready');
    } catch (err: any) {
      const msg = err?.message || err?.toString?.() || 'Unknown error';
      console.error('[GlobeScene] Init failed:', msg, err);
      setErrorMsg(msg);
      setStatus('error');
      onError?.(msg);
    }
  }, [projects]);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      if (!cancelled) initGlobe();
    }, 150);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (globeEl.current) {
        try { globeEl.current._destructor?.(); } catch { /* ignore */ }
        globeEl.current = null;
      }
    };
  }, [initGlobe]);

  // Handle resize
  useEffect(() => {
    const onResize = () => {
      if (globeEl.current && containerRef.current) {
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        if (w && h) {
          try {
            globeEl.current.width(w).height(h);
          } catch { /* ignore */ }
        }
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 globe-container">
      {/* Loading */}
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#08080f]">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full border-2 border-indigo-500/20 border-t-indigo-400 animate-spin mx-auto mb-4" />
            <p className="text-xs text-white/25 font-mono tracking-widest uppercase">
              Loading Globe
            </p>
          </div>
        </div>
      )}

      {/* Error — minimal, blends with background */}
      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#08080f]">
          <div className="text-center px-6">
            <p className="text-xs text-white/30 font-mono">
              Globe unavailable — {errorMsg.slice(0, 80)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
