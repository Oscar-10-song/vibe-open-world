'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Container } from '@/components/layout/Container';

// ============================================================
// Animated counter hook
// ============================================================
function useCountUp(end: number, duration: number, startCounting: boolean) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!startCounting) return;
    startTimeRef.current = undefined;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === undefined) {
        startTimeRef.current = timestamp;
      }
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [end, duration, startCounting]);

  return count;
}

// ============================================================
// Single stat item
// ============================================================
function StatItem({
  value,
  suffix,
  label,
  index,
}: {
  value: string;
  suffix?: string;
  label: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const numValue = parseInt(value.replace(/,/g, ''), 10);
  const count = useCountUp(isNaN(numValue) ? 0 : numValue, 2000, inView);
  const displayValue = isNaN(numValue) ? value : count.toLocaleString();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="text-center"
    >
      <p className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0f1419] tabular-nums tracking-tight">
        {displayValue}
        {suffix && (
          <span className="text-[#8b98a5]">{suffix}</span>
        )}
      </p>
      <p className="mt-2 text-sm text-[#505050] font-medium tracking-wide">
        {label}
      </p>
    </motion.div>
  );
}

// ============================================================
// StatsSection
// ============================================================
interface StatsSectionProps {
  totalProjects: number;
  totalBuilders: number;
  totalCategories: number;
  newToday: number;
}

export function StatsSection({ totalProjects, totalBuilders, totalCategories, newToday }: StatsSectionProps) {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-white">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0f1419] tracking-tight">
            Global AI Creation Stats
          </h2>
          <p className="mt-3 text-base text-[#505050] max-w-md mx-auto">
            Tracking the pulse of AI-powered creativity across the world
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          <div className="relative">
            <StatItem
              value={totalProjects.toLocaleString()}
              suffix="+"
              label="Total Works"
              index={0}
            />
            <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-black/[0.06]" />
          </div>
          <div className="relative">
            <StatItem
              value={totalBuilders.toLocaleString()}
              suffix="+"
              label="Total Creators"
              index={1}
            />
            <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-black/[0.06]" />
          </div>
          <div className="relative">
            <StatItem
              value={totalCategories.toLocaleString()}
              label="Countries Covered"
              index={2}
            />
            <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-black/[0.06]" />
          </div>
          <div>
            <StatItem
              value={newToday.toLocaleString()}
              label="New Works Today"
              index={3}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
