import React from 'react';
import { Loader2, AlertCircle, RefreshCw, FolderSearch } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export const LoadingSpinner = ({ label = "Loading...", size = "md", className }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
        <Loader2 className={cn("text-primary animate-spin relative z-10", sizes[size])} />
      </div>
      {label && <p className="mt-3 text-xs font-mono text-text-muted">{label}</p>}
    </div>
  );
};

export const EmptyState = ({
  icon: Icon = FolderSearch,
  title = "No data found",
  description = "No items match your current filter or no entries have been recorded yet.",
  actionLabel,
  onAction,
  className
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center border border-dashed border-border/80 rounded-2xl bg-surface/30", className)}>
      <div className="w-12 h-12 rounded-2xl bg-surface-light border border-border flex items-center justify-center text-text-muted mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-heading font-semibold text-text-primary">{title}</h4>
      <p className="text-xs text-text-muted max-w-sm mt-1 mb-4 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction} variant="outline">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export const ErrorState = ({
  title = "Something went wrong",
  message = "An error occurred while loading this section.",
  onRetry,
  className
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center border border-status-error/30 rounded-2xl bg-status-error/5", className)}>
      <div className="w-12 h-12 rounded-2xl bg-status-error/10 border border-status-error/30 flex items-center justify-center text-status-error mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-heading font-semibold text-text-primary">{title}</h4>
      <p className="text-xs text-text-muted max-w-sm mt-1 mb-4">{message}</p>
      {onRetry && (
        <Button size="sm" onClick={onRetry} variant="outline" icon={RefreshCw}>
          Retry Request
        </Button>
      )}
    </div>
  );
};
