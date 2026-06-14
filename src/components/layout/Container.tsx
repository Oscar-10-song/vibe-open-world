export function Container({
  children,
  className = '',
  narrow = false,
}: {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
}) {
  return (
    <div
      className={[
        'mx-auto px-4 sm:px-6 lg:px-8 w-full',
        narrow ? 'max-w-[var(--content-width-narrow)]' : 'max-w-[var(--content-width)]',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
