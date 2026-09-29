import React from 'react';
import { cn } from '../../utils/cn';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  dot = false,
  ...props
}) => {
  const variants = {
    default: "bg-surface-light text-text-muted border-border/80",
    primary: "bg-primary/10 text-primary border-primary/30",
    secondary: "bg-secondary/15 text-purple-300 border-secondary/30",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    error: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    info: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full border backdrop-blur-sm",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn(
          "w-1.5 h-1.5 rounded-full shrink-0",
          variant === 'primary' && "bg-primary animate-pulse",
          variant === 'secondary' && "bg-secondary",
          variant === 'success' && "bg-emerald-400",
          variant === 'warning' && "bg-amber-400",
          variant === 'error' && "bg-rose-400",
          variant === 'default' && "bg-text-muted"
        )} />
      )}
      {children}
    </span>
  );
};

export const SeverityBadge = ({ severity, affectedPercentage, className }) => {
  const normSeverity = String(severity || 'Low').toLowerCase();

  let variant = 'info';
  let label = severity || 'Low';

  if (normSeverity.includes('crit')) {
    variant = 'error';
    label = 'Critical';
  } else if (normSeverity.includes('high')) {
    variant = 'warning';
    label = 'High';
  } else if (normSeverity.includes('mod')) {
    variant = 'warning';
    label = 'Moderate';
  } else if (normSeverity.includes('low') || normSeverity.includes('none')) {
    variant = 'success';
    label = normSeverity.includes('none') ? 'Healthy' : 'Low';
  }

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <Badge variant={variant} dot size="md">
        {label} Severity
      </Badge>
      {affectedPercentage !== undefined && affectedPercentage !== null && (
        <span className="font-mono text-xs text-text-muted">
          ({typeof affectedPercentage === 'number' ? affectedPercentage.toFixed(1) : affectedPercentage}%)
        </span>
      )}
    </div>
  );
};
