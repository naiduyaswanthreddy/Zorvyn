import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '../store/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SettingsSkeleton } from '../components/ui/Skeletons';
import {
  User, Shield, Palette, Database, RotateCcw,
  Sun, Moon, Check, Lock, Unlock
} from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

export default function SettingsPage() {
  const { role, setRole, theme, setTheme, resetData, stats } = useFinance();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div key="skeleton" exit={{ opacity: 0, transition: { duration: 0.2 } }}>
          <SettingsSkeleton />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="space-y-8"
        >
      <div>
        <h1 className="text-4xl font-bold gradient-text tracking-tight">Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10">
              <User className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <CardTitle>Profile</CardTitle>
              <p className="text-sm text-secondary mt-0.5">Your account information</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-teal-400 flex items-center justify-center shadow-glow-sm">
              <User className="w-8 h-8 text-slate-900" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary">Yaswanth</h3>
              <p className="text-sm text-secondary">user@nexus.finance</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{stats.transactionCount}</p>
              <p className="text-xs text-muted mt-1">Transactions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-500">₹{stats.income.toLocaleString()}</p>
              <p className="text-xs text-muted mt-1">Total Income</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{stats.savingsRate}%</p>
              <p className="text-xs text-muted mt-1">Savings Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10">
              <Shield className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <CardTitle>Role & Permissions</CardTitle>
              <p className="text-sm text-secondary mt-0.5">Control access level for the dashboard</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border" style={{ background: 'hsl(var(--surface) / 0.5)' }}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">{role}</span>
                <Badge variant={role === 'admin' ? 'success' : 'default'}>
                  {role === 'admin' ? <Unlock className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
                  {role === 'admin' ? 'Full Access' : 'Read Only'}
                </Badge>
              </div>
              <p className="text-xs text-secondary">
                {role === 'admin'
                  ? 'You can create, edit, and delete transactions.'
                  : 'You can view all data but cannot modify transactions.'}
              </p>
            </div>
            <div className="flex gap-2 p-1 rounded-lg border shrink-0" style={{ background: 'hsl(var(--sidebar-role-bg))' }}>
              <button
                onClick={() => setRole('viewer')}
                className={`px-4 py-2 text-xs font-semibold rounded-md transition-all duration-300 ${
                  role === 'viewer' ? 'bg-white/10 light:bg-black/10 text-primary shadow-md' : 'text-secondary hover:text-primary'
                }`}
              >
                VIEWER
              </button>
              <button
                onClick={() => setRole('admin')}
                className={`px-4 py-2 text-xs font-semibold rounded-md transition-all duration-300 ${
                  role === 'admin' ? 'bg-accent text-slate-900 shadow-glow-sm' : 'text-secondary hover:text-primary'
                }`}
              >
                ADMIN
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { action: 'View Dashboard', viewer: true, admin: true },
              { action: 'View Transactions', viewer: true, admin: true },
              { action: 'Search & Filter', viewer: true, admin: true },
              { action: 'Export Data', viewer: true, admin: true },
              { action: 'Add Transaction', viewer: false, admin: true },
              { action: 'Edit Transaction', viewer: false, admin: true },
              { action: 'Delete Transaction', viewer: false, admin: true },
            ].map((perm) => (
              <div key={perm.action} className="flex items-center justify-between p-3 rounded-lg border" style={{ background: 'hsl(var(--surface) / 0.3)' }}>
                <span className="text-sm text-secondary">{perm.action}</span>
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center ${perm.viewer ? 'bg-emerald-500/20' : ''}`}
                    style={!perm.viewer ? { background: 'hsl(var(--text-muted) / 0.1)' } : {}}
                  >
                    {perm.viewer && <Check className="w-3 h-3 text-emerald-500" />}
                  </span>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center ${perm.admin ? 'bg-emerald-500/20' : ''}`}
                    style={!perm.admin ? { background: 'hsl(var(--text-muted) / 0.1)' } : {}}
                  >
                    {perm.admin && <Check className="w-3 h-3 text-emerald-500" />}
                  </span>
                </div>
              </div>
            ))}
            <div className="col-span-full flex items-center gap-4 text-xs text-muted px-1">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-muted/50" /> Viewer</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Admin</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10">
              <Palette className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <CardTitle>Appearance</CardTitle>
              <p className="text-sm text-secondary mt-0.5">Customize the look and feel</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 p-4 rounded-xl border transition-all duration-300 ${
                theme === 'dark'
                  ? 'border-accent/50 bg-accent/5 shadow-glow-sm'
                  : 'hover:border-accent/30'
              }`}
              style={theme !== 'dark' ? { background: 'hsl(var(--surface) / 0.3)', borderColor: 'hsl(var(--border))' } : {}}
            >
              <Moon className={`w-6 h-6 mb-2 ${theme === 'dark' ? 'text-accent' : 'text-muted'}`} />
              <p className="text-sm font-semibold text-primary">Dark</p>
              <p className="text-xs text-secondary mt-1">Deep slate theme</p>
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 p-4 rounded-xl border transition-all duration-300 ${
                theme === 'light'
                  ? 'border-accent/50 bg-accent/5 shadow-glow-sm'
                  : 'hover:border-accent/30'
              }`}
              style={theme !== 'light' ? { background: 'hsl(var(--surface) / 0.3)', borderColor: 'hsl(var(--border))' } : {}}
            >
              <Sun className={`w-6 h-6 mb-2 ${theme === 'light' ? 'text-accent' : 'text-muted'}`} />
              <p className="text-sm font-semibold text-primary">Light</p>
              <p className="text-xs text-secondary mt-1">Clean light mode</p>
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10">
              <Database className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <CardTitle>Data Management</CardTitle>
              <p className="text-sm text-secondary mt-0.5">Reset or manage your data</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-xl border" style={{ background: 'hsl(var(--surface) / 0.3)' }}>
            <div>
              <p className="text-sm font-medium text-primary">Reset to Defaults</p>
              <p className="text-xs text-secondary mt-1">Restore all transactions and settings to initial state</p>
            </div>
            <Button variant="danger" size="sm" onClick={resetData}>
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-center py-8 border-t">
        <p className="text-sm text-muted">Yaswanth Finance Dashboard v1.0</p>
        <p className="text-xs text-muted mt-1">Built with React, Tailwind CSS, Recharts & Framer Motion</p>
      </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
