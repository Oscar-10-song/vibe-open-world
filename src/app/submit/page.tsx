import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { SubmitForm } from '@/components/forms/SubmitForm';
import { constructMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = constructMetadata({
  title: 'Submit Your Project',
  description: 'Show the world what you built with AI. Submit your vibe-coded project to the directory.',
});

export default function SubmitPage() {
  return (
    <Section>
      <Container narrow>
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-4xl mb-4">🚀</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0f1419] mb-3 tracking-tight">
            Submit Your Project
          </h1>
          <p className="text-[15px] text-[#505050] max-w-md mx-auto leading-relaxed">
            Show the world what you&apos;ve built with AI. Your project will appear
            in the directory after a quick review.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-[0_2px_16px_rgba(0,0,0,0.03)] p-6 sm:p-10">
          <SubmitForm />
        </div>
      </Container>
    </Section>
  );
}
