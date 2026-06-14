import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { BottomCTA } from '@/components/home/BottomCTA';
import { constructMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = constructMetadata({
  title: 'About',
  description: 'Our mission is to help AI builders worldwide showcase their work.',
});

const stats = [
  { value: '2024', label: 'Founded' },
  { value: '13+', label: 'AI Tools' },
  { value: '9', label: 'Categories' },
  { value: '∞', label: 'Possibilities' },
];

const faqs = [
  {
    q: 'What is Vibe Open World?',
    a: 'A curated directory showcasing products built by solo developers using AI coding tools like Claude Code, Cursor, Bolt, Lovable, v0, and more. Think "Product Hunt meets Indie Hackers, but just the directory part."',
  },
  {
    q: 'Who can submit a project?',
    a: 'Anyone who built a product primarily using AI coding tools. Whether it took you 2 hours or 2 months, we want to see it.',
  },
  {
    q: 'Is it free to submit?',
    a: 'Yes, completely free. No hidden fees, no premium listings, no pay-to-win.',
  },
  {
    q: 'Do you review submissions?',
    a: 'Yes. We do a light review to ensure submissions are genuine AI-built projects and not spam. Most projects are approved within 24 hours.',
  },
  {
    q: 'Can I submit multiple projects?',
    a: 'Absolutely. Many builders ship a new project every week. We encourage it.',
  },
  {
    q: 'Who built this site?',
    a: 'This entire platform was vibe-coded using Claude Code, Next.js, and Neon. Meta, right?',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Mission */}
      <Section>
        <Container narrow>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)] mb-6 text-center">
            Our Mission
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed text-balance text-center mb-4">
            AI is changing how software gets built. Solo developers are shipping products
            that used to require entire teams — in days, not months.
          </p>
          <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed text-balance text-center">
            <strong>Vibe Open World</strong> exists to celebrate these builders.
            We provide a beautiful, minimal directory where every AI builder can show the world
            what they&apos;ve created. No feed, no comments, no noise — just projects.
          </p>
        </Container>
      </Section>

      {/* Stats */}
      <Section topPadding={false}>
        <Container>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map(s => (
              <div
                key={s.label}
                className="text-center p-6 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]"
              >
                <p className="text-2xl sm:text-3xl font-bold text-[var(--color-accent)]">{s.value}</p>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section>
        <Container narrow>
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-8 text-center">FAQ</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group border border-[var(--color-border)] rounded-xl overflow-hidden"
              >
                <summary className="px-5 py-4 cursor-pointer text-[var(--color-text)] font-medium text-sm select-none hover:bg-[var(--color-bg-tertiary)] transition-colors list-none">
                  {faq.q}
                </summary>
                <p className="px-5 pb-4 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      <BottomCTA />
    </>
  );
}
