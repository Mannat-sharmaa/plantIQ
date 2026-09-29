import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Button = React.forwardRef(({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
  onClick,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer";
  
  const variants = {
    primary: "bg-primary text-black font-semibold hover:bg-primary-hover shadow-neon-green focus:ring-primary",
    secondary: "bg-secondary text-white font-semibold hover:bg-secondary-hover shadow-neon-purple focus:ring-secondary",
    outline: "border border-border text-text-primary hover:border-primary hover:text-primary bg-surface/40 hover:bg-primary/10 focus:ring-primary",
    ghost: "text-text-muted hover:text-text-primary hover:bg-surface-light focus:ring-primary",
    danger: "bg-status-error text-white font-semibold hover:bg-red-600 focus:ring-status-error",
    subtle: "bg-surface-light border border-border text-text-primary hover:border-primary/40 focus:ring-primary",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
    icon: "p-2 text-sm",
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      whileTap={disabled || isLoading ? {} : { scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';
