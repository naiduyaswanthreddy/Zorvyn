import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Receipt, PieChart, ShieldAlert, X, Settings } from 'lucide-react';
import { useFinance } from '../../store/FinanceContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transactions', icon: Receipt, label: 'Transactions' },
  { to: '/analytics', icon: PieChart, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ isMobileOpen, onClose }) {
  const { role, setRole } = useFinance();
  const location = useLocation();

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-64 glass border-r flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0
      ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="h-20 flex items-center justify-between px-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-teal-300 flex items-center justify-center shadow-glow-sm">
            <span className="text-slate-900 font-bold text-lg">Y</span>
          </div>
          <span className="text-xl font-bold tracking-tight gradient-text">Yaswanth</span>
        </div>
        <button onClick={onClose} className="md:hidden text-muted hover:text-primary p-1.5 rounded-lg hover:bg-white/10 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map(item => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className="relative block"
            >
              <div className={`
                flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative
                ${isActive
                  ? 'text-primary'
                  : 'text-secondary hover:text-primary hover:bg-white/5 light:hover:bg-black/5'
                }
              `}>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl shadow-lg"
                    style={{
                      background: 'hsl(var(--sidebar-active-bg))',
                      border: '1px solid hsl(var(--sidebar-active-border))',
                    }}
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <item.icon className={`w-5 h-5 mr-3 relative z-10 transition-colors ${isActive ? 'text-accent' : ''}`} />
                <span className="relative z-10">{item.label}</span>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-r-full shadow-glow-sm" />
                )}
              </div>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t">
        <div className="p-4 rounded-xl glass-card relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="p-2 rounded-full bg-white/5 light:bg-black/5 border shadow-inner">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted font-medium">System Role</span>
              <span className="text-sm font-bold text-primary uppercase tracking-wider">{role}</span>
            </div>
          </div>
          <div className="relative z-10 mt-3 flex gap-2 p-1 rounded-lg border" style={{ background: 'hsl(var(--sidebar-role-bg))' }}>
            <button
              onClick={() => setRole('viewer')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all duration-300 ${
                role === 'viewer' ? 'bg-white/10 light:bg-black/10 text-primary shadow-md' : 'text-secondary hover:text-primary'
              }`}
            >
              VIEWER
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all duration-300 ${
                role === 'admin' ? 'bg-accent text-slate-900 shadow-glow-sm' : 'text-secondary hover:text-primary'
              }`}
            >
              ADMIN
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
