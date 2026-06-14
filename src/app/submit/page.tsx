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
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)] mb-3">
          Submit Your Project
        </h1>
        <p className="text-[var(--color-text-secondary)] mb-10">
          Show the world what you&apos;ve built with AI. Fill out the form below and your
          project will appear in the directory after a quick review.
        </p>

        <SubmitForm />
      </Container>
    </Section>
  );
}
