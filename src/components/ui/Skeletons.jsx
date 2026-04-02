import { Skeleton } from './Badge';
import { motion } from 'framer-motion';

function SkeletonLine({ className }) {
  return <Skeleton className={cn('h-4', className)} />;
}

function SkeletonBlock({ className }) {
  return <Skeleton className={cn('h-24', className)} />;
}

function GlassCard({ children, className }) {
  return (
    <div className={cn('glass-card p-6', className)}>
      {children}
    </div>
  );
}

import { cn } from '../../lib/utils';

export function DashboardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-4 w-24" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[0, 1, 2].map(i => (
          <GlassCard key={i}>
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-9 w-36" />
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-40 mb-1" />
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-48 mb-6" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t">
            {[0, 1, 2].map(i => (
              <Skeleton key={i} className="h-5 w-16 rounded-full" />
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <Skeleton className="h-6 w-40 mb-4" />
          <Skeleton className="h-72 w-full rounded-xl" />
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 p-0 overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="p-4 border-b flex gap-4">
            <Skeleton className="h-9 w-64 rounded-xl" />
            <Skeleton className="h-9 w-28 rounded-xl" />
          </div>
          <div className="divide-y">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="px-6 py-4 flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-40 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <Skeleton className="h-6 w-24 mb-4" />
          <div className="space-y-3">
            {[0, 1, 2].map(i => (
              <div key={i} className="p-3.5 border rounded-xl flex items-start gap-3">
                <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}

export function TransactionsSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-28 rounded-xl" />
          <Skeleton className="h-9 w-36 rounded-xl" />
        </div>
      </div>

      <GlassCard className="overflow-hidden p-0">
        <div className="p-5 border-b flex flex-col lg:flex-row gap-4">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-28 rounded-xl" />
            <Skeleton className="h-10 w-40 rounded-xl" />
            <Skeleton className="h-10 w-8 rounded-xl" />
            <Skeleton className="h-10 w-40 rounded-xl" />
          </div>
        </div>
        <div>
          <div className="px-6 py-4 flex gap-6 border-b" style={{ background: 'hsl(var(--surface) / 0.3)' }}>
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-20 hidden sm:block" />
            <Skeleton className="h-3 w-16 hidden md:block" />
            <Skeleton className="h-3 w-16 ml-auto" />
          </div>
          {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
            <div key={i} className="px-6 py-4 flex items-center gap-4 border-b" style={{ borderColor: 'hsl(var(--border) / 0.3)' }}>
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="flex-1">
                <Skeleton className="h-4 w-48 mb-1" />
                <Skeleton className="h-3 w-24 sm:hidden" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full hidden sm:block" />
              <Skeleton className="h-4 w-24 hidden md:block" />
              <Skeleton className="h-4 w-20 ml-auto" />
            </div>
          ))}
        </div>
        <div className="p-4 border-t flex items-center justify-between">
          <Skeleton className="h-4 w-40" />
          <div className="flex gap-2">
            {[0, 1, 2, 3].map(i => (
              <Skeleton key={i} className="h-8 w-8 rounded-lg" />
            ))}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export function AnalyticsSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Skeleton className="h-10 w-36 mb-2" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-10 w-52 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map(i => (
          <GlassCard key={i} className="relative overflow-hidden">
            <div className="absolute -right-5 -bottom-5">
              <Skeleton className="w-24 h-24 rounded-full" />
            </div>
            <div className="relative p-4 z-10">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-8 w-20" />
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[0, 1].map(i => (
          <GlassCard key={i}>
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-80 w-full rounded-xl" />
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <Skeleton className="h-6 w-40 mb-4" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </GlassCard>
        <GlassCard>
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="space-y-5">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}

export function SettingsSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div>
        <Skeleton className="h-10 w-32 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div>
            <Skeleton className="h-5 w-16 mb-1" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="h-16 w-16 rounded-2xl" />
          <div>
            <Skeleton className="h-5 w-28 mb-1" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          {[0, 1, 2].map(i => (
            <div key={i} className="text-center">
              <Skeleton className="h-7 w-12 mx-auto mb-1" />
              <Skeleton className="h-3 w-20 mx-auto" />
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div>
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
        <Skeleton className="h-24 w-full rounded-xl mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div>
            <Skeleton className="h-5 w-24 mb-1" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-32 flex-1 rounded-xl" />
          <Skeleton className="h-32 flex-1 rounded-xl" />
        </div>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div>
            <Skeleton className="h-5 w-36 mb-1" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
        <Skeleton className="h-20 w-full rounded-xl" />
      </GlassCard>
    </motion.div>
  );
}
