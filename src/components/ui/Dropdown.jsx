import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Dropdown({ value, onChange, options, placeholder = 'Select...', className }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className={cn('relative', className)}>
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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1.5 rounded-xl overflow-hidden shadow-xl border"
            style={{
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
    </div>
  );
}
