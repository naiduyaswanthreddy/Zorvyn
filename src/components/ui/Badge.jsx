import { cn } from '../../lib/utils';

export function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-white/5 light:bg-black/5 text-secondary border',
    success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    danger: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  };

  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border', variants[variant], className)}>
      {children}
    </span>
  );
}

export function Skeleton({ className }) {
  return (
    <div className={cn('animate-pulse rounded-lg shimmer', className)}
      style={{ background: 'hsl(var(--text-muted) / 0.08)' }}
    />
  );
}

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'w-full rounded-xl px-3.5 py-2.5 text-sm text-primary placeholder:text-muted outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all duration-200',
        className
      )}
      style={{
        background: 'hsl(var(--input-bg))',
        border: '1px solid hsl(var(--input-border))',
      }}
      {...props}
    />
  );
}
