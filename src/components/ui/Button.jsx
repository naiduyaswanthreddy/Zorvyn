import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const variants = {
  primary: 'bg-accent text-slate-900 hover:opacity-90 shadow-glow-sm hover:shadow-glow-md',
  secondary: 'glass hover:bg-white/10 light:hover:bg-black/5 text-primary',
  ghost: 'hover:bg-white/5 light:hover:bg-black/5 text-secondary hover:text-primary',
  danger: 'bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20',
  'danger-solid': 'bg-danger text-white hover:opacity-90',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = forwardRef(({
  children,
  className,
  variant = 'primary',
  size = 'md',
  asChild = false,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
