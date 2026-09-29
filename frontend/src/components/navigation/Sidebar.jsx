import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ScanLine,
  Sprout,
  History,
  BarChart3,
  Bot,
  Cpu,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Network
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

export const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Scan Plant', path: '/scan', icon: ScanLine },
    { label: 'My Plants', path: '/plants', icon: Sprout },
    { label: 'Scan History', path: '/history', icon: History },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Clustering', path: '/clusters', icon: Network },
    { label: 'AI Assistant', path: '/assistant', icon: Bot },
    { label: 'Model Insights', path: '/model-performance', icon: Cpu },
  ];

  const bottomItems = [
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-border bg-[#0d1410] z-30 transition-all duration-300 relative select-none",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-border/50">
        <NavLink to="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 shadow-neon-green/20">
            <span className="text-xl">🌱</span>
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="font-heading font-bold text-base tracking-tight text-text-primary">
                Plant<span className="text-primary">IQ</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-text-muted">
                Health Intelligence
              </span>
            </motion.div>
          )}
        </NavLink>

        {/* Collapse toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-light transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-text-dark">
          {!isCollapsed && "Core Intelligence"}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold shadow-neon-green/10"
                    : "text-text-muted hover:text-text-primary hover:bg-surface-light hover:translate-x-1"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn("w-4 h-4 shrink-0 transition-transform group-hover:scale-110", isActive && "text-primary")} />
                  {!isCollapsed && <span>{item.label}</span>}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-0 top-1.5 bottom-1.5 w-1 rounded-l-full bg-primary shadow-neon-green"
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}

        {/* Admin Link if authorized */}
        {isAdmin && (
          <div className="pt-4">
            <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-purple-400">
              {!isCollapsed && "Administration"}
            </div>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group",
                  isActive
                    ? "bg-secondary/15 text-purple-300 font-semibold shadow-neon-purple/20"
                    : "text-purple-400/80 hover:text-purple-300 hover:bg-secondary/10 hover:translate-x-1"
                )
              }
            >
              <ShieldAlert className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110 text-purple-400" />
              {!isCollapsed && <span>Admin Console</span>}
            </NavLink>
          </div>
        )}
      </div>

      {/* Bottom Profile / Settings Section */}
      <div className="p-3 border-t border-border/50 space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group",
                  isActive
                    ? "bg-surface-light text-text-primary font-semibold"
                    : "text-text-muted hover:text-text-primary hover:bg-surface-light"
                )
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
