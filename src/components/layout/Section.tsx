export function Section({
  children,
  className = '',
  topPadding = true,
  bottomPadding = true,
}: {
  children: React.ReactNode;
  className?: string;
  topPadding?: boolean;
  bottomPadding?: boolean;
}) {
  return (
    <section
      className={[
        topPadding && 'pt-16 sm:pt-20',
        bottomPadding && 'pb-16 sm:pb-20',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </section>
  );
}
