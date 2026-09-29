import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../utils/cn';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'PlantIQ Ready', message: 'Deep learning pipeline loaded & calibrated.', time: 'Just now', read: false },
    { id: '2', title: 'Environmental Sync', message: 'Microclimate weather provider connected.', time: '10m ago', read: false },
  ]);

  const addToast = useCallback(({ title, message, type = 'info', duration = 4000 }) => {
    const id = Date.now().toString();
    const newToast = { id, title, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    // Also add to notifications panel
    setNotifications((prev) => [
      { id, title: title || 'System Update', message: message || '', time: 'Just now', read: false },
      ...prev.slice(0, 19)
    ]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <ToastContext.Provider value={{
      addToast,
      toasts,
      notifications,
      unreadCount,
      markAllNotificationsRead,
      clearNotifications
    }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastItem = ({ toast, onClose }) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-status-warning shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-status-error shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />
  };

  const borderColors = {
    success: "border-primary/40",
    warning: "border-status-warning/40",
    error: "border-status-error/40",
    info: "border-cyan-400/40"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={cn(
        "pointer-events-auto rounded-xl p-3.5 bg-surface/95 border backdrop-blur-md shadow-2xl flex items-start gap-3",
        borderColors[toast.type] || "border-border"
      )}
    >
      {icons[toast.type] || icons.info}
      <div className="flex-1 min-w-0 text-left">
        {toast.title && <h4 className="text-xs font-semibold text-text-primary">{toast.title}</h4>}
        {toast.message && <p className="text-xs text-text-muted mt-0.5 leading-snug">{toast.message}</p>}
      </div>
      <button
        onClick={onClose}
        className="text-text-muted hover:text-text-primary transition-colors p-0.5 rounded"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
