interface BadgeProps {
  variant?: 'default' | 'accent' | 'success';
  children: React.ReactNode;
  className?: string;
}

const variantClasses = {
  default: 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]',
  accent: 'bg-[var(--color-accent-subtle)] text-[var(--color-accent-text)]',
  success: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

export function Badge({ variant = 'default', className = '', children }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full',
        variantClasses[variant],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
}
