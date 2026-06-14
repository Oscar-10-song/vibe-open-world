interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: boolean;
}

export function Card({ children, className = '', hover = false, padding = true }: CardProps) {
  return (
    <div
      className={[
        'bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl',
        padding && 'p-5',
        hover && 'card-hover',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
