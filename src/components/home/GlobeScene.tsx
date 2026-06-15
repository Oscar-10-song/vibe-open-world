'use client';

import { useEffect, useRef, useState } from 'react';
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
// Major city beacons
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

const AMBIENT_DOTS_COUNT = 120;

function generateAmbientDots() {
  const dots: { lat: number; lng: number; size: number; color: string }[] = [];
  for (let i = 0; i < AMBIENT_DOTS_COUNT; i++) {
    const lat = (Math.random() - 0.5) * 180;
    const lng = (Math.random() - 0.5) * 360;
    const r = Math.random();
    dots.push({
      lat, lng,
      size: 0.04 + r * 0.08,
      color: r > 0.85 ? '#f97316' : r > 0.6 ? '#6366f1' : '#3b82f6',
    });
  }
  return dots;
}

function generatePoints(projects: ProjectWithRelations[]): GlobePoint[] {
  const points: GlobePoint[] = [];

  MAJOR_CITIES.forEach((city, i) => {
    const project = projects[i] || null;
    points.push({
      lat: city.lat, lng: city.lng,
      size: project ? 0.42 : 0.28,
      color: project ? '#f97316' : '#6366f1',
      label: project
        ? `${project.title}\n${project.author.name} · ${city.name}`
        : city.name,
      project: project || undefined,
      city: city.name,
    });
  });

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

  generateAmbientDots().forEach(d => {
    points.push({ lat: d.lat, lng: d.lng, size: d.size, color: d.color });
  });

  return points;
}

// ============================================================
// Safely remove the Three.js canvas from the container DOM.
// globe.gl's _destructor() calls container.removeChild(canvas) internally,
// but if React has already re-rendered or the canvas was reparented, this
// throws: "Failed to execute 'removeChild' — node is not a child".
// We remove it ourselves first so _destructor() sees parentNode === null and skips.
// ============================================================
function safelyRemoveGlobeCanvas(container: HTMLElement | null) {
  if (!container) return;
  const canvas = container.querySelector('canvas');
  if (canvas && canvas.parentNode) {
    // Only remove if the canvas is actually a child of this container.
    // After React reconciliation, canvas might have been moved or removed already.
    if (canvas.parentNode === container) {
      container.removeChild(canvas);
    }
  }
}

// ============================================================
// GlobeScene Component
// ============================================================
export function GlobeScene({ projects, onProjectClickRef, onError }: GlobeSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeEl = useRef<any>(null);
  const cancelledRef = useRef(false);       // Track unmount across async boundaries
  const hasInitialized = useRef(false);      // Prevent StrictMode double-mount
  const projectsRef = useRef(projects);      // Always-current projects, avoids re-running effect
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  // Keep projects ref up to date without triggering effect re-run
  projectsRef.current = projects;

  useEffect(() => {
    // Prevent double initialization (React StrictMode in dev, or rapid remounts)
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    cancelledRef.current = false;

    const initGlobe = async () => {
      // Track step-by-step status for diagnostics
      let step = 'starting';

      try {
        // Step 1: Import globe.gl
        step = 'importing globe.gl module';
        const globeModule = await import('globe.gl');
        const Globe = globeModule.default;
        if (cancelledRef.current || !containerRef.current) return;

        // Step 2: Try to load GeoJSON (non-blocking — globe works without it)
        step = 'fetching GeoJSON';
        let geojsonFeatures: any[] | null = null;
        try {
          const geojsonRes = await fetch('/ne_110m_admin_0_countries.geojson');
          if (cancelledRef.current) return;
          if (geojsonRes.ok) {
            const geojsonData = await geojsonRes.json();
            geojsonFeatures = geojsonData.features || null;
          }
        } catch (geoErr) {
          // GeoJSON failed — continue without country borders
          console.warn('[GlobeScene] GeoJSON fetch failed, continuing without borders:', geoErr);
        }

        if (cancelledRef.current || !containerRef.current) return;

        // Step 3: Generate points (use ref for latest projects)
        step = 'generating points';
        const points = generatePoints(projectsRef.current);

        // Step 4: Clean up any previous globe instance before creating a new one
        if (globeEl.current) {
          try {
            safelyRemoveGlobeCanvas(containerRef.current);
            globeEl.current._destructor?.();
          } catch { /* ignore */ }
          globeEl.current = null;
        }

        // Step 5: Create globe instance
        step = 'creating globe instance';
        const globe = (Globe as any)()(containerRef.current);

        // Re-check cancellation — globe constructor may have taken time
        if (cancelledRef.current || !containerRef.current) {
          try { globe._destructor?.(); } catch { /* ignore */ }
          return;
        }

        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        if (w && h) {
          globe.width(w).height(h);
        }

        // Step 6: Configure globe
        step = 'configuring globe appearance';
        globe
          .backgroundColor('#08080f')
          .atmosphereColor('#1e1b4b')
          .atmosphereAltitude(0.25);

        // Country borders — only if GeoJSON loaded successfully
        if (geojsonFeatures && geojsonFeatures.length > 0) {
          step = 'setting hex polygons';
          globe
            .hexPolygonsData(geojsonFeatures)
            .hexPolygonResolution(3)
            .hexPolygonMargin(0.3)
            .hexPolygonColor(() => 'rgba(30, 27, 75, 0.6)')
            .hexPolygonLabel((f: any) => {
              const name = f?.properties?.name;
              return name ? `<b>${name}</b>` : '';
            });
        }

        // Points (always set — works regardless of GeoJSON)
        step = 'setting points data';
        globe
          .pointsData(points)
          .pointColor((p: any) => p.color)
          .pointAltitude(0.01)
          .pointRadius((p: any) => p.size * 1.2)
          .pointLabel((p: any) => p.label || '')
          .pointResolution(16)
          .onPointClick((p: GlobePoint) => {
            if (p.project && onProjectClickRef.current) {
              onProjectClickRef.current(p.project);
            }
          })
          .enablePointerInteraction(true)
          .showPointerCursor(true);

        // Step 7: Controls
        step = 'setting controls';
        const controls = globe.controls();
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.3;
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.minDistance = 130;
        controls.maxDistance = 600;

        // Initial view
        step = 'setting initial view';
        globe.pointOfView({ lat: 20, lng: 0, altitude: 2.2 }, 0);

        globeEl.current = globe;
        if (!cancelledRef.current) {
          setStatus('ready');
        }
        console.log('[GlobeScene] Ready ✓  GeoJSON:', geojsonFeatures ? `${geojsonFeatures.length} countries` : 'none');
      } catch (err: any) {
        if (cancelledRef.current) return; // Silently ignore errors after unmount
        const msg = err?.message || err?.toString?.() || 'Unknown error';
        const fullMsg = `[Step: ${step}] ${msg}`;
        console.error('[GlobeScene] Init failed:', fullMsg, err);
        setErrorMsg(fullMsg);
        setStatus('error');
        onError?.(fullMsg);
      }
    };

    // Small delay so the container is definitely laid out
    const timer = setTimeout(() => {
      if (!cancelled) initGlobe();
    }, 150);

    return () => {
      cancelled = true;
      cancelledRef.current = true;
      clearTimeout(timer);
      if (globeEl.current) {
        // Safely remove canvas BEFORE calling _destructor().
        // _destructor() internally does container.removeChild(canvas),
        // which throws "node is not a child" if the canvas was already
        // removed or reparented (e.g. by React reconciliation).
        safelyRemoveGlobeCanvas(container);
        try { globeEl.current._destructor?.(); } catch { /* ignore */ }
        globeEl.current = null;
      }
      // Allow re-initialization on next mount (e.g. SPA navigation back)
      hasInitialized.current = false;
    };
  }, []); // Only run on mount — projects changes handled via ref

  // Handle resize
  useEffect(() => {
    const onResize = () => {
      if (globeEl.current && containerRef.current) {
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        if (w && h) {
          try { globeEl.current.width(w).height(h); } catch { /* ignore */ }
        }
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 globe-container">
      {/* Loading spinner */}
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

      {/* Error — shows FULL error message directly, no clicking needed */}
      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#08080f]">
          <div className="text-center px-6 max-w-lg">
            <span className="text-4xl mb-3 block opacity-50">🌍</span>
            <p className="text-sm text-white/50 font-mono mb-2">
              Globe initialization failed
            </p>
            <p className="text-xs text-white/25 font-mono break-all leading-relaxed bg-white/[0.02] border border-white/[0.05] rounded-lg p-3 max-h-24 overflow-auto">
              {errorMsg}
            </p>
            <p className="text-xs text-white/15 mt-3">
              The rest of the page is available below.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
