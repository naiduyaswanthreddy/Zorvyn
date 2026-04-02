import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Dropdown({ value, onChange, options, placeholder = 'Select...', className }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const menuRef = useRef(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 });

  const updateMenuPosition = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
    });
  };

  useEffect(() => {
    const handler = (e) => {
      const target = e.target;
      if (containerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;
    updateMenuPosition();

    const onViewportChange = () => updateMenuPosition();
    window.addEventListener('resize', onViewportChange);
    window.addEventListener('scroll', onViewportChange, true);

    return () => {
      window.removeEventListener('resize', onViewportChange);
      window.removeEventListener('scroll', onViewportChange, true);
    };
  }, [isOpen]);

  const selected = options.find(o => o.value === value);

  const menu = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.15 }}
          className="fixed z-[140] rounded-xl overflow-hidden shadow-xl border"
          style={{
            top: menuPos.top,
            left: menuPos.left,
            width: menuPos.width,
            background: 'hsl(var(--surface))',
            borderColor: 'hsl(var(--border))',
          }}
        >
          <div className="py-1 max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="flex items-center justify-between w-full px-3.5 py-2.5 text-sm text-left transition-colors duration-100"
                style={{
                  color: option.value === value ? 'hsl(var(--accent))' : 'hsl(var(--text-primary))',
                  background: option.value === value ? 'hsl(var(--accent) / 0.08)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (option.value !== value) {
                    e.currentTarget.style.background = 'hsl(var(--text-muted) / 0.06)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (option.value !== value) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span className="font-medium">{option.label}</span>
                {option.value === value && (
                  <Check className="w-4 h-4 text-accent" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-3 w-full rounded-xl py-2.5 px-3.5 text-sm cursor-pointer transition-all duration-200 hover:border-accent/30"
        style={{
          background: 'hsl(var(--input-bg))',
          border: `1px solid ${isOpen ? 'hsl(var(--accent) / 0.5)' : 'hsl(var(--input-border))'}`,
          color: selected ? 'hsl(var(--text-primary))' : 'hsl(var(--text-muted))',
          boxShadow: isOpen ? '0 0 0 2px hsl(var(--accent) / 0.15)' : 'none',
        }}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <ChevronDown className={cn('w-4 h-4 text-muted shrink-0 transition-transform duration-200', isOpen && 'rotate-180')} />
      </button>
      {typeof document !== 'undefined' ? createPortal(menu, document.body) : null}
    </div>
  );
}
