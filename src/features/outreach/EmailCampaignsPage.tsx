import React, { useState, useMemo } from 'react';
import { Plus, Search, SearchX, X } from 'lucide-react';
import { Campaign } from '../../types/crm';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { Dropdown } from '../../components/shared/Dropdown';
import { branches } from '../../data/mock/leads';

interface EmailCampaignsPageProps {
  campaigns: Campaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
  lists: any[];
}

export function EmailCampaignsPage({
  campaigns,
  setCampaigns,
  lists,
}: EmailCampaignsPageProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [newCamp, setNewCamp] = useState({
    name: '',
    audience: lists[0]?.name || 'Lagos Technology Leads',
    subject: '',
    branch: 'Lagos Branch',
  });

  const filtered = useMemo(
    () =>
      campaigns.filter((c: Campaign) => {
        if (
          search &&
          !`${c.name} ${c.subject}`.toLowerCase().includes(search.toLowerCase())
        )
          return false;
        if (statusFilter !== 'All' && c.status !== statusFilter) return false;
        return true;
      }),
    [campaigns, search, statusFilter]
  );

  const handleAdd = () => {
    if (!newCamp.name || !newCamp.subject) return;
    const camp: Campaign = {
      id: `c${Date.now()}`,
      name: newCamp.name,
      audience: newCamp.audience,
      status: 'Draft',
      sent: 0,
      open: 0,
      click: 0,
      lastActivity: 'Now',
      subject: newCamp.subject,
      branch: newCamp.branch,
      owner: 'Dominion Castiel',
    };
    setCampaigns([camp, ...campaigns]);
    setShowAdd(false);
    setNewCamp({
      name: '',
      audience: lists[0]?.name || 'Lagos Technology Leads',
      subject: '',
      branch: 'Lagos Branch',
    });
  };

  return (
    <div className="flex flex-col gap-[20px] max-w-[1440px]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-[12px]">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight">Email Campaigns</h1>
          <p className="text-[14px] text-[var(--text-secondary)] mt-[2px]">
            Create and track email campaigns across your lists.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="h-[40px] px-[18px] rounded-[10px] bg-[var(--primary)] text-[#1B2D15] text-[14px] font-semibold flex items-center gap-[8px] hover:bg-[var(--primary-hover)] cursor-pointer"
        >
          <Plus size={16} />
          New Campaign
        </button>
      </div>

      <div className="bg-white rounded-[14px] p-[16px] flex flex-col gap-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col lg:flex-row gap-[12px] justify-between">
          <div className="relative w-full lg:max-w-[320px]">
            <Search size={16} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search campaigns..."
              className="w-full h-[38px] pl-[36px] pr-[12px] rounded-[10px] bg-[var(--input-bg)] border border-transparent text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:bg-white focus:ring-[2px] focus:ring-[var(--primary-soft)] transition-all"
            />
          </div>
          <div className="flex gap-[8px]">
            <Dropdown
              value={statusFilter}
              onChange={setStatusFilter}
              options={['All', 'Draft', 'Scheduled', 'Sending', 'Sent']}
            />
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('All');
              }}
              className="h-[36px] px-[12px] rounded-[10px] bg-[var(--input-bg)] text-[13px] hover:bg-[#EAECE8] cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[12px]">
          {filtered.map((c: Campaign) => (
            <div
              key={c.id}
              className="rounded-[12px] p-[16px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.05)] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-[8px] mb-[10px]">
                  <div className="font-medium text-[14px] leading-tight text-[var(--text-primary)]">{c.name}</div>
                  <StatusBadge label={c.status} />
                </div>
                <div className="text-[12px] text-[var(--text-secondary)] mb-[8px]">Audience: {c.audience}</div>
                <div className="text-[12px] text-[var(--text-muted)] mb-[12px] truncate">{c.subject}</div>
                <div className="flex gap-[12px] text-[11px] text-[var(--text-secondary)]">
                  <span>Sent {c.sent}</span>
                  <span className="text-[var(--text-muted)]">Open {c.open}%</span>
                  <span className="text-[var(--text-muted)]">Click {c.click}%</span>
                </div>
              </div>
              <div className="mt-[14px] pt-[10px] border-t border-[#F3F5F2] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                <span>
                  {c.branch} • {c.owner}
                </span>
                <span>{c.lastActivity}</span>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-[40px] flex flex-col items-center text-center">
            <SearchX size={20} className="text-[var(--text-muted)] mb-[8px]" />
            <div className="text-[13px] text-[var(--text-muted)]">No matching campaigns. Clear filters to see all.</div>
          </div>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 p-[16px]">
          <div className="w-full max-w-[480px] bg-white rounded-[16px] p-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
            <div className="flex items-center justify-between mb-[16px]">
              <div className="text-[16px] font-semibold text-[var(--text-primary)]">New Campaign</div>
              <button
                onClick={() => setShowAdd(false)}
                className="w-[32px] h-[32px] rounded-[8px] bg-[var(--input-bg)] flex items-center justify-center cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                aria-label="Close dialog"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex flex-col gap-[14px]">
              <div>
                <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">
                  Campaign Name *
                </label>
                <input
                  value={newCamp.name}
                  onChange={(e) => setNewCamp({ ...newCamp, name: e.target.value })}
                  placeholder="e.g. Q4 Executive Outreach"
                  className="w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] border border-[var(--border)] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#76E05B] focus:ring-[2px] focus:ring-[#EFFBEA]"
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">
                  Subject Line *
                </label>
                <input
                  value={newCamp.subject}
                  onChange={(e) => setNewCamp({ ...newCamp, subject: e.target.value })}
                  placeholder="e.g. Scaling revenue operations for 2026"
                  className="w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] border border-[var(--border)] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#76E05B] focus:ring-[2px] focus:ring-[#EFFBEA]"
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">
                  Target Audience
                </label>
                <Dropdown
                  value={newCamp.audience}
                  onChange={(v: string) => setNewCamp({ ...newCamp, audience: v })}
                  options={lists.map((l: any) => l.name)}
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">
                  Branch
                </label>
                <Dropdown
                  value={newCamp.branch}
                  onChange={(v: string) => setNewCamp({ ...newCamp, branch: v })}
                  options={branches.slice(1)}
                />
              </div>
            </div>
            <div className="mt-[20px] flex justify-end gap-[8px]">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="h-[38px] px-[16px] rounded-[10px] bg-white border border-[var(--border)] text-[13px] font-medium cursor-pointer hover:bg-[var(--input-bg)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAdd}
                className="h-[38px] px-[18px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold text-[#1B4D0F] hover:bg-[var(--primary-hover)] cursor-pointer transition-colors"
              >
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
