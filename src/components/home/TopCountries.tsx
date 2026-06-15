'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';

// ============================================================
// Country data
// ============================================================
interface CountryRank {
  name: string;
  flag: string;
  works: number;
  creators: number;
  trend: 'up' | 'down' | 'steady';
}

const TOP_COUNTRIES: CountryRank[] = [
  { name: 'United States', flag: '🇺🇸', works: 2480, creators: 1200, trend: 'up' },
  { name: 'Japan', flag: '🇯🇵', works: 1560, creators: 780, trend: 'up' },
  { name: 'South Korea', flag: '🇰🇷', works: 1230, creators: 540, trend: 'up' },
  { name: 'France', flag: '🇫🇷', works: 980, creators: 430, trend: 'steady' },
  { name: 'Germany', flag: '🇩🇪', works: 850, creators: 380, trend: 'up' },
  { name: 'United Kingdom', flag: '🇬🇧', works: 820, creators: 360, trend: 'steady' },
  { name: 'China', flag: '🇨🇳', works: 740, creators: 310, trend: 'up' },
  { name: 'Singapore', flag: '🇸🇬', works: 560, creators: 210, trend: 'up' },
];

// ============================================================
// Single rank row
// ============================================================
function CountryRow({ country, rank }: { country: CountryRank; rank: number }) {
  const trendIcon = { up: '▲', down: '▼', steady: '●' };
  const trendColor: Record<string, string> = {
    up: 'text-[#22c55e]',
    down: 'text-[#ef4444]',
    steady: 'text-[#8b98a5]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: rank * 0.06 }}
      className="flex items-center gap-4 py-4 border-b border-black/[0.04] last:border-b-0 group hover:bg-[#f8f8f8] px-3 -mx-3 rounded-lg transition-colors"
    >
      {/* Rank */}
      <div className="w-8 text-center">
        <span className={[
          'text-sm font-bold tabular-nums',
          rank <= 3 ? 'text-[#0f1419]' : 'text-[#8b98a5]',
        ].join(' ')}>
          {rank}
        </span>
      </div>

      {/* Country */}
      <div className="flex-1 flex items-center gap-3 min-w-0">
        <span className="text-xl">{country.flag}</span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#0f1419] truncate">{country.name}</p>
          <p className="text-[11px] text-[#8b98a5]">{country.creators.toLocaleString()} creators</p>
        </div>
      </div>

      {/* Works count */}
      <div className="text-right">
        <p className="text-sm font-semibold text-[#0f1419] tabular-nums">
          {country.works.toLocaleString()}
        </p>
        <p className="text-[11px] text-[#8b98a5]">works</p>
      </div>

      {/* Trend */}
      <div className="w-10 text-right">
        <span className={`text-[11px] ${trendColor[country.trend]}`}>
          {trendIcon[country.trend]}
        </span>
      </div>

      {/* Rank bar */}
      <div className="hidden sm:block w-24">
        <div className="h-1 rounded-full bg-black/[0.04] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${(country.works / TOP_COUNTRIES[0].works) * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 + rank * 0.06, ease: 'easeOut' }}
            className={[
              'h-full rounded-full',
              rank === 1 ? 'bg-[#0f1419]' :
              rank === 2 ? 'bg-[#0f1419]/60' :
              rank === 3 ? 'bg-[#0f1419]/30' :
              'bg-black/[0.06]',
            ].join(' ')}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// TopCountries Section
// ============================================================
export function TopCountries() {
  return (
    <section className="py-24 sm:py-32 bg-white">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Header + description */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl sm:text-3xl font-bold text-[#0f1419] tracking-tight"
            >
              Top Creator Countries
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mt-3 text-base text-[#505050] max-w-sm leading-relaxed"
            >
              AI creation is a global movement. See which countries are leading
              the way in AI-powered creativity.
            </motion.p>

            {/* Total summary */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 p-5 rounded-xl border border-black/[0.06] bg-[#f8f8f8]"
            >
              <p className="text-xs text-[#8b98a5] uppercase tracking-widest font-mono mb-2">
                Global Total
              </p>
              <div className="flex gap-8">
                <div>
                  <p className="text-2xl font-bold text-[#0f1419] tabular-nums">8,220</p>
                  <p className="text-xs text-[#505050] mt-0.5">Total Works</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#0f1419] tabular-nums">4,210</p>
                  <p className="text-xs text-[#505050] mt-0.5">Total Creators</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Leaderboard */}
          <div>
            <div className="rounded-xl border border-black/[0.06] bg-white p-4 sm:p-6">
              {/* Table header */}
              <div className="flex items-center gap-4 pb-3 mb-2 border-b border-black/[0.04] text-[10px] uppercase tracking-widest text-[#8b98a5] font-mono">
                <div className="w-8 text-center">#</div>
                <div className="flex-1">Country</div>
                <div className="text-right w-20">Works</div>
                <div className="text-right w-10">Tr.</div>
                <div className="hidden sm:block w-24" />
              </div>

              {/* Rows */}
              {TOP_COUNTRIES.map((country, i) => (
                <CountryRow key={country.name} country={country} rank={i + 1} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
