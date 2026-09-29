import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, Activity } from 'lucide-react';
import { SeverityBadge } from './Badge';
import { cn } from '../../utils/cn';

export const TimelineNode = ({
  item,
  isLast = false,
  onSelectScan,
  index = 0
}) => {
  const { day, date, status, affectedPercentage, severity, notes, scanId } = item;

  return (
    <div className="relative flex items-start gap-4 sm:gap-6 group">
      {/* Connecting line */}
      {!isLast && (
        <div className="absolute left-[19px] top-10 bottom-0 w-[2px] bg-gradient-to-b from-primary/40 via-border to-border/20 group-hover:from-primary transition-colors" />
      )}

      {/* Node Dot */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: index * 0.1 }}
        className="relative z-10 w-10 h-10 rounded-full border-2 border-primary bg-surface flex items-center justify-center shrink-0 shadow-neon-green/30"
      >
        <Activity className="w-4 h-4 text-primary" />
      </motion.div>

      {/* Content Card */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 + 0.05 }}
        className="flex-1 pb-8"
      >
        <div className="rounded-xl border border-border bg-surface/70 hover:border-primary/40 transition-all p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-sm text-text-primary">{day}</span>
              <span className="text-xs text-text-muted flex items-center gap-1 font-mono">
                <Calendar className="w-3 h-3" />
                {date}
              </span>
            </div>
            <SeverityBadge severity={severity} affectedPercentage={affectedPercentage} />
          </div>

          <h4 className="text-sm font-semibold text-text-primary mb-1">{status}</h4>
          {notes && <p className="text-xs text-text-muted leading-relaxed mb-3">{notes}</p>}

          {scanId && onSelectScan && (
            <button
              onClick={() => onSelectScan(scanId)}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline cursor-pointer"
            >
              <span>View scan diagnostics</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
