import React from 'react';
import { cn } from '../../utils/cn';

export const ChartCard = ({
  title,
  subtitle,
  children,
  action,
  className,
  disclaimer
}) => {
  return (
    <div className={cn("rounded-2xl border border-border bg-surface/80 p-5 backdrop-blur-sm flex flex-col", className)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-heading font-semibold text-text-primary tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>

      <div className="flex-1 w-full min-h-[240px]">
        {children}
      </div>

      {disclaimer && (
        <div className="mt-3 pt-2.5 border-t border-border/40 text-[11px] text-text-dark italic">
          {disclaimer}
        </div>
      )}
    </div>
  );
};

export const SectionHeading = ({
  badge,
  title,
  subtitle,
  centered = false,
  className
}) => {
  return (
    <div className={cn("space-y-2 mb-8", centered && "text-center mx-auto max-w-2xl", className)}>
      {badge && (
        <div className={cn("inline-block", centered && "mx-auto")}>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide bg-primary/10 text-primary border border-primary/25">
            {badge}
          </span>
        </div>
      )}
      <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm sm:text-base text-text-muted leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
