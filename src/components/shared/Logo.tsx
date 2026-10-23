import React from 'react';

export function Logo() {
  return (
    <div className="flex items-center gap-[10px]">
      <div className="w-[36px] h-[36px] rounded-[10px] overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
        <img
          src="/leadflow-logo.png"
          alt="LeadFlow CRM Logo"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold text-[var(--text-primary)] tracking-tight">LeadFlow CRM</span>
        <span className="text-[10.5px] text-[var(--text-muted)] mt-[2px] tracking-[0.01em]">Discover. Rate. Convert. Measure.</span>
      </div>
    </div>
  );
}
