import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Input = React.forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  rightElement,
  className,
  id,
  type = 'text',
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-text-muted">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            "w-full bg-surface-light border border-border/80 text-text-primary text-sm rounded-lg px-3.5 py-2.5 transition-all duration-200",
            "placeholder:text-text-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-inner",
            Icon && "pl-10",
            rightElement && "pr-10",
            error && "border-status-error focus:border-status-error focus:ring-status-error animate-shake",
            className
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1.5 text-xs text-status-error pt-0.5"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </motion.p>
        )}
        {!error && helperText && (
          <p className="text-xs text-text-muted">{helperText}</p>
        )}
      </AnimatePresence>
    </div>
  );
});

Input.displayName = 'Input';

export const Select = React.forwardRef(({
  label,
  error,
  options = [],
  className,
  id,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-medium text-text-muted">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={cn(
          "w-full bg-surface-light border border-border/80 text-text-primary text-sm rounded-lg px-3.5 py-2.5 transition-all duration-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-inner",
          error && "border-status-error",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-surface text-text-primary">
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-status-error pt-0.5">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export const Checkbox = ({ label, checked, onChange, id, className, ...props }) => {
  const checkboxId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <label htmlFor={checkboxId} className={cn("inline-flex items-center gap-2 cursor-pointer select-none", className)}>
      <input
        type="checkbox"
        id={checkboxId}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-border bg-surface-light text-primary focus:ring-primary focus:ring-offset-background cursor-pointer"
        {...props}
      />
      {label && <span className="text-xs text-text-muted hover:text-text-primary transition-colors">{label}</span>}
    </label>
  );
};
