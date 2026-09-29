import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const StatCard = ({
  title,
  value,
  subvalue,
  prefix = "",
  suffix = "",
  icon: Icon,
  trend,
  trendPositive = true,
  className,
  glow = false,
  purple = false,
}) => {
  const [displayValue, setDisplayValue] = useState(typeof value === 'number' ? 0 : value);

  useEffect(() => {
    if (typeof value !== 'number') {
      setDisplayValue(value);
      return;
    }

    let start = 0;
    const end = value;
    const duration = 800;
    const steps = 30;
    const stepTime = duration / steps;
    const increment = (end - start) / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Number.isInteger(end) ? Math.floor(start) : Number(start.toFixed(1)));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div
      className={cn(
        "rounded-2xl p-5 border bg-surface/80 backdrop-blur-sm relative overflow-hidden transition-all duration-300",
        purple ? "border-secondary/20 hover:border-secondary/40" : "border-border hover:border-primary/40",
        glow && "hover:shadow-neon-green/15",
        className
      )}
    >
      {/* Background flare */}
      <div 
        className={cn(
          "absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-20",
          purple ? "bg-secondary" : "bg-primary"
        )} 
      />

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-text-muted">{title}</span>
        {Icon && (
          <div className={cn(
            "p-2 rounded-xl",
            purple ? "bg-secondary/15 text-purple-300" : "bg-primary/10 text-primary"
          )}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-heading font-bold text-text-primary tracking-tight">
          {prefix}{displayValue}{suffix}
        </span>
        {subvalue && (
          <span className="text-xs font-mono text-text-muted">{subvalue}</span>
        )}
      </div>

      {trend && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs">
          <span className={cn(
            "font-medium",
            trendPositive ? "text-emerald-400" : "text-rose-400"
          )}>
            {trend}
          </span>
          <span className="text-text-dark text-[11px]">vs last period</span>
        </div>
      )}
    </div>
  );
};
