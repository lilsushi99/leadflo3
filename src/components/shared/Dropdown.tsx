import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownProps {
  trigger?: React.ReactNode;
  options: string[];
  value: string;
  onSelect?: (v: string) => void;
  onChange?: (v: string) => void;
  placeholder?: string;
  className?: string;
  wrapperClassName?: string;
  menuClassName?: string;
  align?: 'left' | 'right';
  id?: string;
  'aria-label'?: string;
}

export function Dropdown({
  trigger,
  options,
  value,
  onSelect,
  onChange,
  placeholder = 'Select...',
  className = '',
  wrapperClassName = '',
  menuClassName = '',
  align = 'left',
  id,
  'aria-label': ariaLabel,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', keyHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', keyHandler);
    };
  }, []);

  const handleSelect = (opt: string) => {
    if (onSelect) onSelect(opt);
    if (onChange) onChange(opt);
    setOpen(false);
  };

  const defaultTrigger = (
    <button
      type="button"
      id={id}
      aria-label={ariaLabel || placeholder}
      aria-haspopup="listbox"
      aria-expanded={open}
      className={`h-[38px] px-[12px] rounded-[10px] bg-[var(--input-bg)] hover:bg-[#ECEEEA] border text-[13px] flex items-center justify-between gap-[8px] cursor-pointer transition-all focus:outline-none focus:border-[#76E05B] focus:ring-[2px] focus:ring-[#EFFBEA] ${
        open ? 'border-[#76E05B] ring-[2px] ring-[#EFFBEA] bg-white' : 'border-[var(--border)]'
      } ${className}`}
    >
      <span className={`truncate font-medium ${value ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
        {value || placeholder}
      </span>
      <ChevronDown
        size={14}
        className={`text-[var(--text-muted)] shrink-0 transition-transform duration-150 ${
          open ? 'rotate-180 text-[#166534]' : ''
        }`}
      />
    </button>
  );

  return (
    <div ref={ref} className={`relative text-left ${wrapperClassName || 'inline-block'}`}>
      <div onClick={() => setOpen(!open)} role="presentation">
        {trigger ? trigger : defaultTrigger}
      </div>

      {open && (
        <div
          role="listbox"
          tabIndex={-1}
          className={`absolute top-[calc(100%+6px)] ${
            align === 'right' ? 'right-0' : 'left-0'
          } min-w-[180px] z-50 bg-white rounded-[12px] border border-[var(--border)] shadow-[0_10px_25px_rgba(0,0,0,0.08)] p-[6px] overflow-hidden max-h-[260px] overflow-y-auto ${
            menuClassName ? menuClassName : 'w-full max-w-[320px]'
          }`}
        >
          {options.map((opt) => {
            const isSelected = value === opt;
            return (
              <div
                key={opt}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                onClick={() => handleSelect(opt)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect(opt);
                  }
                }}
                className={`px-[12px] py-[8px] rounded-[8px] text-[13px] cursor-pointer flex items-center justify-between transition-colors focus:outline-none ${
                  isSelected
                    ? 'bg-[#EFFBEA] text-[#166534] font-semibold'
                    : 'text-[var(--text-primary)] hover:bg-[#F3F5F2]'
                }`}
              >
                <span className="truncate">{opt || '(Empty)'}</span>
                {isSelected && <Check size={14} className="text-[#166534] shrink-0 ml-[8px]" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
