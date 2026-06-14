interface TagProps {
  children: React.ReactNode;
  onRemove?: () => void;
  className?: string;
}

export function Tag({ children, onRemove, className = '' }: TagProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 px-3 py-1 text-sm rounded-lg',
        'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]',
        'border border-[var(--color-border)]',
        className,
      ].join(' ')}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 text-[var(--color-text-tertiary)] hover:text-[var(--color-error)] transition-colors"
          aria-label="Remove"
        >
          ×
        </button>
      )}
    </span>
  );
}
