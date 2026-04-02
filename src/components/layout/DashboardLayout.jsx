import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import ToastContainer from '../ui/Toast';

function FloatingOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-accent/[0.03] blur-3xl animate-float-slow light:bg-accent/[0.06]" />
      <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/[0.03] blur-3xl animate-float-slower light:bg-blue-500/[0.06]" />
      <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] rounded-full bg-purple-500/[0.02] blur-3xl animate-float light:bg-purple-500/[0.05]" />
    </div>
  );
}

const pageTransition = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-background noise-overlay">
      <FloatingOrbs />

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <Sidebar isMobileOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden w-full z-10">
        <Header onMenuToggle={() => setIsMobileMenuOpen(true)} />
        <main className="w-full relative py-8 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              {...pageTransition}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
