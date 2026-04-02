import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Card = forwardRef(({ children, className, hover = false, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'glass-card relative overflow-hidden',
        hover && 'card-gradient-border glass-card-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

const CardHeader = forwardRef(({ children, className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 border-b', className)} {...props}>
    {children}
  </div>
));
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef(({ children, className, ...props }, ref) => (
  <h2 ref={ref} className={cn('text-lg font-semibold text-primary', className)} {...props}>
    {children}
  </h2>
));
CardTitle.displayName = 'CardTitle';

const CardContent = forwardRef(({ children, className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6', className)} {...props}>
    {children}
  </div>
));
CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardTitle, CardContent };
