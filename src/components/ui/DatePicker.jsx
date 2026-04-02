import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const POPUP_WIDTH_MD = 320;
const POPUP_WIDTH_SM = 280;

function parseISODate(value) {
  if (!value) return null;
  const [y, m, d] = value.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getCalendarDays(viewDate) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i -= 1) {
    cells.push({ day: daysInPrevMonth - i, offset: -1 });
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ day, offset: 0 });
  }
  while (cells.length < 42) {
    cells.push({ day: cells.length - (firstDay + daysInMonth) + 1, offset: 1 });
  }

  return cells;
}

function getYearBlock(centerYear) {
  const start = Math.floor(centerYear / 12) * 12;
  return Array.from({ length: 12 }, (_, idx) => start + idx);
}

export default function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  className = '',
  size = 'md',
}) {
  const containerRef = useRef(null);
  const popupRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('days');
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });

  const selectedDate = useMemo(() => parseISODate(value), [value]);
  const [viewDate, setViewDate] = useState(selectedDate || new Date());

  useEffect(() => {
    if (selectedDate) {
      setViewDate(selectedDate);
    }
  }, [selectedDate]);

  const updatePopupPosition = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const popupWidth = size === 'sm' ? POPUP_WIDTH_SM : POPUP_WIDTH_MD;
    const isMobile = viewportWidth < 640;
    const effectiveWidth = isMobile ? Math.min(viewportWidth - 16, popupWidth) : popupWidth;

    const preferredLeft = isMobile ? (viewportWidth - effectiveWidth) / 2 : rect.left;
    const left = Math.min(
      Math.max(8, preferredLeft),
      Math.max(8, viewportWidth - effectiveWidth - 8),
    );

    const belowTop = rect.bottom + 8;
    const aboveTop = rect.top - 380;
    const shouldOpenAbove = belowTop + 360 > viewportHeight && aboveTop > 8;

    setPopupPos({
      left,
      top: shouldOpenAbove ? aboveTop : belowTop,
    });
  };

  useEffect(() => {
    if (!open) return undefined;

    updatePopupPosition();

    const onResize = () => updatePopupPosition();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
  }, [open]);

  useEffect(() => {
    const onDocClick = (event) => {
      if (!open) return;
      const target = event.target;
      if (containerRef.current?.contains(target)) return;
      if (popupRef.current?.contains(target)) return;
      setOpen(false);
      setMode('days');
    };

    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  const month = viewDate.getMonth();
  const year = viewDate.getFullYear();
  const days = getCalendarDays(viewDate);
  const years = getYearBlock(year);

  const displayValue = selectedDate
    ? selectedDate.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
    : '';

  const movePrev = () => {
    setViewDate((prev) => {
      if (mode === 'years') return new Date(prev.getFullYear() - 12, prev.getMonth(), 1);
      if (mode === 'months') return new Date(prev.getFullYear() - 1, prev.getMonth(), 1);
      return new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
    });
  };

  const moveNext = () => {
    setViewDate((prev) => {
      if (mode === 'years') return new Date(prev.getFullYear() + 12, prev.getMonth(), 1);
      if (mode === 'months') return new Date(prev.getFullYear() + 1, prev.getMonth(), 1);
      return new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
    });
  };

  const selectDay = (cell) => {
    const date = new Date(year, month + cell.offset, cell.day);
    onChange(toISODate(date));
    setOpen(false);
    setMode('days');
  };

  const selectMonth = (monthIdx) => {
    setViewDate((prev) => new Date(prev.getFullYear(), monthIdx, 1));
    setMode('days');
  };

  const selectYear = (yearValue) => {
    setViewDate((prev) => new Date(yearValue, prev.getMonth(), 1));
    setMode('months');
  };

  const clearDate = () => {
    onChange('');
    setOpen(false);
    setMode('days');
  };

  const popup = open ? (
    <div
      ref={popupRef}
      className={`fixed z-[120] max-w-[92vw] rounded-3xl overflow-hidden shadow-xl border ${
        size === 'sm' ? 'w-[280px]' : 'w-[320px]'
      }`}
      style={{
        top: popupPos.top,
        left: popupPos.left,
        width: window.innerWidth < 640 ? `min(${size === 'sm' ? 280 : 320}px, calc(100vw - 16px))` : undefined,
        background: '#f3f4f6',
        borderColor: '#e5e7eb',
      }}
    >
      <div className={`${size === 'sm' ? 'p-3' : 'p-4'} border-b`} style={{ background: '#e5e7eb', borderColor: '#d1d5db' }}>
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={movePrev}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMode('months')}
              className={`${size === 'sm' ? 'px-3 py-1' : 'px-4 py-1.5'} rounded-lg text-sm font-semibold transition-colors ${
                mode === 'months' ? 'text-blue-700' : 'text-slate-700 hover:text-slate-900'
              }`}
              style={mode === 'months' ? { background: '#dbeafe' } : {}}
            >
              {MONTHS[month]}
            </button>
            <button
              type="button"
              onClick={() => setMode('years')}
              className={`${size === 'sm' ? 'px-3 py-1' : 'px-4 py-1.5'} rounded-lg text-sm font-semibold transition-colors ${
                mode === 'years' ? 'text-blue-700' : 'text-slate-700 hover:text-slate-900'
              }`}
              style={mode === 'years' ? { background: '#dbeafe' } : {}}
            >
              {year}
            </button>
          </div>

          <button
            type="button"
            onClick={moveNext}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {mode === 'years' ? (
        <div className={`${size === 'sm' ? 'p-3 gap-2.5' : 'p-4 gap-3'} grid grid-cols-3`}>
          {years.map((y) => {
            const isActive = y === year;
            return (
              <button
                key={y}
                type="button"
                onClick={() => selectYear(y)}
                className={`${size === 'sm' ? 'h-10 rounded-xl' : 'h-12 rounded-2xl'} font-semibold transition-all ${
                  isActive ? 'text-white shadow-md' : 'text-slate-600 hover:text-slate-800'
                }`}
                style={
                  isActive
                    ? { background: '#2563eb' }
                    : { background: '#e5e7eb', border: '1px solid #d1d5db' }
                }
              >
                {y}
              </button>
            );
          })}
        </div>
      ) : mode === 'months' ? (
        <div className={`${size === 'sm' ? 'p-3 gap-2.5' : 'p-4 gap-3'} grid grid-cols-3`}>
          {MONTHS.map((label, idx) => {
            const isActive = idx === month;
            return (
              <button
                key={label}
                type="button"
                onClick={() => selectMonth(idx)}
                className={`${size === 'sm' ? 'h-10 rounded-xl' : 'h-12 rounded-2xl'} font-semibold transition-all ${
                  isActive ? 'text-white shadow-md' : 'text-slate-600 hover:text-slate-800'
                }`}
                style={
                  isActive
                    ? { background: '#2563eb' }
                    : { background: '#e5e7eb', border: '1px solid #d1d5db' }
                }
              >
                {label}
              </button>
            );
          })}
        </div>
      ) : (
        <div className={size === 'sm' ? 'p-3' : 'p-4'}>
          <div className={`grid grid-cols-7 ${size === 'sm' ? 'mb-1' : 'mb-2'}`}>
            {WEEKDAYS.map((day) => (
              <div key={day} className={`${size === 'sm' ? 'text-xs py-1.5' : 'text-sm py-2'} text-center text-slate-600`}>{day}</div>
            ))}
          </div>
          <div className={`grid grid-cols-7 ${size === 'sm' ? 'gap-y-0.5' : 'gap-y-1'}`}>
            {days.map((cell, idx) => {
              const date = new Date(year, month + cell.offset, cell.day);
              const isSelected = value === toISODate(date);
              const inCurrentMonth = cell.offset === 0;
              return (
                <button
                  key={`${cell.day}-${cell.offset}-${idx}`}
                  type="button"
                  onClick={() => selectDay(cell)}
                  className={`${size === 'sm' ? 'h-8 w-8 text-sm rounded-md' : 'h-10 w-10 text-base rounded-lg'} mx-auto transition-colors ${
                    isSelected
                      ? 'font-bold text-slate-900'
                      : inCurrentMonth
                        ? 'text-slate-800 hover:bg-white'
                        : 'text-slate-400 hover:text-slate-600'
                  }`}
                  style={isSelected ? { background: '#bfdbfe' } : {}}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className={`${size === 'sm' ? 'px-3 py-2' : 'px-4 py-3'} border-t flex justify-end`} style={{ borderColor: '#d1d5db' }}>
        <button
          type="button"
          onClick={clearDate}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Clear
        </button>
      </div>
    </div>
  ) : null;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => {
          setOpen((s) => !s);
          setMode('days');
        }}
        className="w-full rounded-xl py-2.5 px-3 text-sm text-left text-primary outline-none transition-all duration-200 focus:ring-2 focus:ring-accent/30"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--accent) / 0.07), hsl(var(--input-bg)))',
          border: '1px solid hsl(var(--accent) / 0.22)',
        }}
      >
        {displayValue || <span className="text-muted">{placeholder}</span>}
      </button>

      {typeof document !== 'undefined' ? createPortal(popup, document.body) : null}
    </div>
  );
}
