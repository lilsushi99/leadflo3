import React from 'react';
import { Settings } from 'lucide-react';

export function ComingSoonPage({ title }: { title: string }) {
  return (
    <div className="max-w-[720px] mx-auto mt-[60px] bg-white border border-[var(--border)] rounded-[16px] p-[32px] flex flex-col items-center text-center">
      <div className="w-[56px] h-[56px] rounded-[14px] bg-[var(--input-bg)] flex items-center justify-center mb-[16px]">
        <Settings size={24} className="text-[var(--text-muted)]" />
      </div>
      <div className="text-[20px] font-semibold tracking-tight">Coming soon</div>
      <div className="text-[14px] text-[var(--text-secondary)] mt-[8px] max-w-[420px]">
        The <span className="font-medium text-[var(--text-primary)]">{title}</span> module is under development and will be available in a future phase.
      </div>
      <div className="mt-[20px] flex gap-[8px]">
        <div className="h-[6px] w-[24px] rounded-full bg-[var(--primary)]" />
        <div className="h-[6px] w-[6px] rounded-full bg-[var(--border)]" />
        <div className="h-[6px] w-[6px] rounded-full bg-[var(--border)]" />
      </div>
    </div>
  );
}
