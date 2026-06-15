import Link from 'next/link';
import { HTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends HTMLAttributes<HTMLElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-white text-[#0f1419] hover:bg-white/90 shadow-lg shadow-white/5',
  secondary:
    'bg-white/[0.04] text-white/60 border border-white/[0.1] hover:bg-white/[0.08] hover:text-white/80 hover:border-white/[0.15]',
  ghost:
    'text-white/45 hover:text-white/80 hover:bg-white/[0.04]',
  outline:
    'border border-white/[0.1] text-white/60 hover:border-white/[0.15] hover:bg-white/[0.04] hover:text-white/80',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-lg gap-2',
  lg: 'px-6 py-3 text-base rounded-lg gap-2',
};

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  disabled,
  type = 'button',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const classes = [
    'inline-flex items-center justify-center font-medium transition-all duration-200',
    variantClasses[variant],
    sizeClasses[size],
    disabled && 'opacity-50 pointer-events-none',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (href && !disabled) {
    return (
      <Link href={href} className={classes} {...(props as any)}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} className={classes} {...props}>
      {children}
    </button>
  );
}
