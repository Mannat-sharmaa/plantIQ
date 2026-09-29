import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const Card = ({
  children,
  className,
  header,
  footer,
  hover = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface text-text-primary p-5 shadow-sm",
        hover && "transition-all duration-300 hover:border-primary/40 hover:shadow-neon-green/20",
        className
      )}
      {...props}
    >
      {header && <div className="mb-4 pb-3 border-b border-border/50">{header}</div>}
      <div>{children}</div>
      {footer && <div className="mt-4 pt-3 border-t border-border/50">{footer}</div>}
    </div>
  );
};

export const GlassCard = ({
  children,
  className,
  glow = false,
  purple = false,
  tilt = false,
  onClick,
  ...props
}) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={tilt ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={cn(
        "rounded-2xl p-6 transition-all duration-300 relative overflow-hidden backdrop-blur-md",
        purple 
          ? "bg-[#161122]/70 border border-secondary/25 shadow-glass" 
          : "bg-surface/70 border border-border shadow-glass",
        glow && "hover:border-primary/40 hover:shadow-neon-green/20",
        purple && glow && "hover:border-secondary/40 hover:shadow-neon-purple/20",
        onClick && "cursor-pointer",
        className
      )}
      {...props}
    >
      {/* Subtle radial corner glow */}
      <div 
        className={cn(
          "absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl pointer-events-none opacity-40",
          purple ? "bg-secondary" : "bg-primary"
        )} 
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
