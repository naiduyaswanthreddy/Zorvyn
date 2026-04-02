import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

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

export default function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  className = '',
}) {
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('days');
  const selectedDate = useMemo(() => parseISODate(value), [value]);
  const [viewDate, setViewDate] = useState(selectedDate || new Date());

  useEffect(() => {
    if (selectedDate) {
      setViewDate(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    const onDocClick = (event) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target)) {
        setOpen(false);
        setMode('days');
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const month = viewDate.getMonth();
  const year = viewDate.getFullYear();
  const days = getCalendarDays(viewDate);

  const displayValue = selectedDate
    ? selectedDate.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
    : '';

  const movePrev = () => {
    setViewDate((prev) => {
      if (mode === 'months') return new Date(prev.getFullYear() - 1, prev.getMonth(), 1);
      return new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
    });
  };

  const moveNext = () => {
    setViewDate((prev) => {
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

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="w-full rounded-xl py-2.5 px-3 text-sm text-left text-primary outline-none transition-all duration-200 focus:ring-2 focus:ring-accent/30"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--accent) / 0.07), hsl(var(--input-bg)))',
          border: '1px solid hsl(var(--accent) / 0.22)',
        }}
      >
        {displayValue || <span className="text-muted">{placeholder}</span>}
      </button>

      {open && (
        <div
          className="absolute z-40 mt-2 w-[320px] max-w-[92vw] rounded-3xl overflow-hidden shadow-xl border"
          style={{
            background: '#f3f4f6',
            borderColor: '#e5e7eb',
          }}
        >
          <div className="p-4 border-b" style={{ background: '#e5e7eb', borderColor: '#d1d5db' }}>
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
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                    mode === 'months' ? 'text-blue-700' : 'text-slate-700 hover:text-slate-900'
                  }`}
                  style={mode === 'months' ? { background: '#dbeafe' } : {}}
                >
                  {MONTHS[month]}
                </button>
                <span className="text-lg font-bold text-slate-800">{year}</span>
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

          {mode === 'months' ? (
            <div className="p-4 grid grid-cols-3 gap-3">
              {MONTHS.map((label, idx) => {
                const isActive = idx === month;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => selectMonth(idx)}
                    className={`h-12 rounded-2xl font-semibold transition-all ${
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
            <div className="p-4">
              <div className="grid grid-cols-7 mb-2">
                {WEEKDAYS.map((day) => (
                  <div key={day} className="text-center text-sm text-slate-600 py-2">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-1">
                {days.map((cell, idx) => {
                  const date = new Date(year, month + cell.offset, cell.day);
                  const isSelected = value === toISODate(date);
                  const inCurrentMonth = cell.offset === 0;
                  return (
                    <button
                      key={`${cell.day}-${cell.offset}-${idx}`}
                      type="button"
                      onClick={() => selectDay(cell)}
                      className={`h-10 w-10 mx-auto rounded-lg text-base transition-colors ${
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
        </div>
      )}
    </div>
  );
}
