import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, Menu, Sun, Moon, Shield, LogOut } from 'lucide-react';
import { useFinance } from '../../store/FinanceContext';

export default function Header({ onMenuToggle }) {
  const { theme, setTheme, role, setRole } = useFinance();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="h-16 glass-header sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 backdrop-blur-xl">
      <button onClick={onMenuToggle} className="md:hidden p-2 -ml-2 rounded-lg text-secondary hover:bg-white/10 light:hover:bg-black/5 transition-colors">
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="relative p-2.5 rounded-xl hover:bg-white/10 light:hover:bg-black/5 transition-colors group"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-secondary group-hover:text-amber-400 transition-colors" />
          ) : (
            <Moon className="w-5 h-5 text-secondary group-hover:text-blue-500 transition-colors" />
          )}
        </button>

        <button className="relative p-2.5 rounded-xl hover:bg-white/10 light:hover:bg-black/5 transition-colors group">
          <Bell className="w-5 h-5 text-secondary group-hover:text-primary transition-colors" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
        </button>

        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 rounded-full border flex items-center justify-center cursor-pointer hover:border-accent/50 transition-colors"
            style={{ background: 'linear-gradient(135deg, hsl(var(--accent) / 0.15), hsl(var(--info) / 0.15))' }}
          >
            <User className="w-5 h-5 text-secondary" />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl border overflow-hidden z-50"
                style={{ background: 'hsl(var(--surface))', borderColor: 'hsl(var(--border))' }}
              >
                <div className="p-3 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
                  <p className="text-sm font-semibold text-primary">Yaswanth</p>
                  <p className="text-xs text-muted">user@nexus.finance</p>
                </div>

                <div className="p-1.5">
                  <button
                    onClick={() => {
                      setRole(role === 'admin' ? 'viewer' : 'admin');
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-secondary hover:text-primary hover:bg-white/5 light:hover:bg-black/5 transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Switch to {role === 'admin' ? 'Viewer' : 'Admin'}</span>
                  </button>

                  <button
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-secondary hover:text-primary hover:bg-white/5 light:hover:bg-black/5 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
