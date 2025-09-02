import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'google';
  size?: 'default' | 'sm' | 'lg';
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-primary text-text-inverse border-none shadow-elevation1 hover:bg-primary-hover hover:shadow-elevation3 hover:-translate-y-0.5 active:translate-y-0 active:shadow-elevation1",
      secondary: "bg-background-primary text-text-primary border border-border-light hover:bg-background-secondary hover:border-border-medium",
      google: "bg-background-primary text-text-primary border border-border-light hover:bg-background-secondary hover:border-accent"
    };

    const sizes = {
      default: "h-12 px-6 text-base",
      sm: "h-10 px-4 text-sm",
      lg: "h-14 px-8 text-lg"
    };

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
