import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Sparkles, ScanLine, Menu, X, Check, ShieldCheck, Database } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const Navbar = ({ onOpenMobileMenu }) => {
  const { user, demoMode, toggleDemoMode } = useAuth();
  const { notifications, unreadCount, markAllNotificationsRead } = useToast();
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b border-border/50 bg-[#0a0f0d]/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
      {/* Left section: mobile hamburger & breadcrumb/badge */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-light"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs">
          <Badge variant="primary" dot size="sm">System Online</Badge>
          <span className="text-text-dark font-mono">•</span>
          <span className="text-text-muted font-mono">PyTorch EfficientNet-B4 + U-Net</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Demo Mode Pill */}
        <button
          onClick={toggleDemoMode}
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border border-border bg-surface-light hover:border-primary/40 transition-colors"
          title="Click to toggle Demo Mode vs Live FastAPI"
        >
          <Database className="w-3.5 h-3.5 text-primary" />
          <span className="text-text-muted">Mode:</span>
          <span className={demoMode ? "text-amber-400 font-semibold" : "text-primary font-semibold"}>
            {demoMode ? "DEMO DATA" : "LIVE BACKEND"}
          </span>
        </button>

        {/* Quick Scan Action */}
        <Button
          size="sm"
          variant="primary"
          icon={ScanLine}
          onClick={() => navigate('/scan')}
          className="hidden sm:inline-flex text-xs"
        >
          Scan Plant
        </Button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) markAllNotificationsRead();
            }}
            className="relative p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-light transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-background animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-surface border border-border/80 shadow-2xl p-4 z-50 text-left"
              >
                <div className="flex items-center justify-between pb-3 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-semibold text-sm text-text-primary">Notifications</span>
                    <Badge variant="primary" size="sm">{notifications.length}</Badge>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-text-muted hover:text-text-primary text-xs"
                  >
                    Close
                  </button>
                </div>

                <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-surface-light/50 border border-border/50 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-text-primary">{n.title}</span>
                        <span className="text-[10px] text-text-muted">{n.time}</span>
                      </div>
                      <p className="text-text-muted mt-1 leading-snug">{n.message}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Mini Card */}
        <Link to="/profile" className="flex items-center gap-2.5 pl-2 border-l border-border/50 group">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-xs font-bold text-primary shadow-inner group-hover:scale-105 transition-transform">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-semibold text-text-primary leading-tight group-hover:text-primary transition-colors">
              {user?.name || 'Aarav Sharma'}
            </span>
            <span className="text-[10px] text-text-muted font-mono">
              {user?.role || 'USER'}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
};
