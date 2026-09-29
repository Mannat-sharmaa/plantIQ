import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ScanLine, BarChart3, Bot, User } from 'lucide-react';
import { cn } from '../../utils/cn';

export const MobileBottomNav = () => {
  const items = [
    { label: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Scan', path: '/scan', icon: ScanLine, highlight: true },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'AI', path: '/assistant', icon: Bot },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d1410]/95 backdrop-blur-lg border-t border-border/80 px-2 py-1.5 safe-area-pb">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all text-[11px] font-medium select-none",
                  item.highlight && "relative -top-2.5 bg-primary text-black font-bold p-3 rounded-full shadow-neon-green",
                  !item.highlight && isActive && "text-primary",
                  !item.highlight && !isActive && "text-text-muted hover:text-text-primary"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn("w-5 h-5", item.highlight ? "text-black" : (isActive ? "text-primary" : "text-text-muted"))} />
                  {!item.highlight && <span className="mt-0.5">{item.label}</span>}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
