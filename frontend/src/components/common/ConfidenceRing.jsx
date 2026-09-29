import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const ConfidenceRing = ({
  value = 0, // 0 to 1 or 0 to 100
  size = 120,
  strokeWidth = 10,
  label = "Confidence",
  sublabel = "Model certainty",
  className,
  color = "#00ff88"
}) => {
  // Normalize value to 0-100
  const normalizedValue = value > 1 ? Math.min(100, Math.max(0, value)) : Math.min(100, Math.max(0, value * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;

  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = normalizedValue;
    const duration = 1000;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = (end - start) / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [normalizedValue]);

  return (
    <div className={cn("flex flex-col items-center justify-center text-center", className)}>
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Progress Ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl font-bold text-text-primary tracking-tight">
            {displayValue.toFixed(1)}%
          </span>
          <span className="text-[10px] uppercase tracking-wider text-text-muted font-medium">
            {label}
          </span>
        </div>
      </div>
      {sublabel && (
        <p className="mt-2 text-xs text-text-muted max-w-[140px] leading-tight">
          {sublabel}
        </p>
      )}
    </div>
  );
};

export const ProgressBar = ({
  value = 0,
  max = 100,
  color = "bg-primary",
  height = "h-2",
  showLabel = false,
  label = "",
  className
}) => {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-text-muted font-mono">
          <span>{label}</span>
          <span>{percent.toFixed(1)}%</span>
        </div>
      )}
      <div className={cn("w-full bg-surface-light rounded-full overflow-hidden border border-border/40", height)}>
        <motion.div
          className={cn("h-full rounded-full transition-all duration-500", color)}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};
