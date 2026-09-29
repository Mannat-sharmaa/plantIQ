import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Cpu, BarChart2, Settings, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const adminNavs = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Models', path: '/admin/models', icon: Cpu },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart2 },
    { label: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#e8eaf5] flex flex-col md:flex-row">
      {/* Admin Purple Sidebar */}
      <aside className="w-full md:w-64 bg-[#0e0f18] border-r border-secondary/20 flex flex-col p-4 shrink-0">
        <div className="flex items-center justify-between pb-4 border-b border-secondary/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-secondary/20 border border-secondary/40 flex items-center justify-center text-purple-300">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-sm tracking-tight text-white">
                Admin <span className="text-secondary">Console</span>
              </h2>
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">
                Governance & MLOps
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4 space-y-1">
          {adminNavs.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-secondary/20 text-purple-300 font-semibold border border-secondary/30 shadow-neon-purple/20'
                      : 'text-text-muted hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-secondary/20 space-y-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-text-muted hover:text-white hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>Return to User App</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};
