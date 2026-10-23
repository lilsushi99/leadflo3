import React, { useState, useMemo } from 'react';
import { Plus, Search, X, SearchX } from 'lucide-react';
import { Sequence } from '../../types/crm';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { Dropdown } from '../../components/shared/Dropdown';

interface SequencesPageProps {
  sequences: Sequence[];
  setSequences: React.Dispatch<React.SetStateAction<Sequence[]>>;
}

export function SequencesPage({ sequences, setSequences }: SequencesPageProps) {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'sequences' | 'followups'>('sequences');
  const [showAdd, setShowAdd] = useState(false);
  const [newSeq, setNewSeq] = useState({
    name: '',
    audience: 'Lagos Technology Leads',
    steps: 2,
    status: 'Draft',
  });
  const [errors, setErrors] = useState<{ name?: string }>({});

  const filtered = useMemo(
    () =>
      sequences.filter(
        (s: Sequence) => !search || s.name.toLowerCase().includes(search.toLowerCase())
      ),
    [sequences, search]
  );

  const handleCreate = () => {
    if (!newSeq.name.trim()) {
      setErrors({ name: 'Sequence name is required' });
      return;
    }

    const ns: Sequence = {
      id: `s${Date.now()}`,
      name: newSeq.name.trim(),
      audience: newSeq.audience,
      status: newSeq.status as any,
      steps: Number(newSeq.steps) || 2,
      enrolled: 0,
      performance: '-',
      lastActivity: 'Just now',
      owner: 'Dominion Castiel',
    };

    setSequences([ns, ...sequences]);
    setNewSeq({
      name: '',
      audience: 'Lagos Technology Leads',
      steps: 2,
      status: 'Draft',
    });
    setErrors({});
    setShowAdd(false);
  };

  const handleCancel = () => {
    setShowAdd(false);
    setNewSeq({
      name: '',
      audience: 'Lagos Technology Leads',
      steps: 2,
      status: 'Draft',
    });
    setErrors({});
  };

  return (
    <div className="flex flex-col gap-[20px] max-w-[1440px]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-[12px]">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight">Sequences & Follow-ups</h1>
          <p className="text-[14px] text-[var(--text-secondary)] mt-[2px]">
            Automate outreach steps and multi-touch workflows.
          </p>
        </div>
        <button
          onClick={() => {
            setErrors({});
            setShowAdd(true);
          }}
          className="h-[40px] px-[18px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold flex items-center gap-[8px] text-[#1B4D0F] cursor-pointer hover:bg-[var(--primary-hover)] transition-colors"
        >
          <Plus size={16} />
          New Sequence
        </button>
      </div>

      <div className="bg-white rounded-[12px] p-[4px] w-fit flex gap-[4px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <button
          onClick={() => setTab('sequences')}
          className={`h-[32px] px-[16px] rounded-[8px] text-[13px] font-medium transition-all cursor-pointer ${
            tab === 'sequences'
              ? 'bg-[var(--text-primary)] text-white font-semibold'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Sequences
        </button>
        <button
          onClick={() => setTab('followups')}
          className={`h-[32px] px-[16px] rounded-[8px] text-[13px] font-medium transition-all cursor-pointer ${
            tab === 'followups'
              ? 'bg-[var(--text-primary)] text-white font-semibold'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Follow-ups
        </button>
      </div>

      {tab === 'sequences' ? (
        <div className="bg-white rounded-[14px] p-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="relative max-w-[320px] mb-[16px]">
            <Search size={16} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sequences..."
              className="w-full h-[38px] pl-[36px] pr-[12px] rounded-[10px] bg-[var(--input-bg)] border border-transparent text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:bg-white focus:ring-[2px] focus:ring-[var(--primary-soft)] transition-all"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[14px]">
            {filtered.map((s: Sequence) => (
              <div
                key={s.id}
                className="rounded-[12px] p-[16px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.05)] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-[8px] mb-[8px]">
                    <div className="font-medium text-[14px] leading-tight text-[var(--text-primary)]">{s.name}</div>
                    <StatusBadge label={s.status} />
                  </div>
                  <div className="text-[12px] text-[var(--text-secondary)]">Audience: {s.audience}</div>
                  <div className="mt-[10px] flex gap-[14px] text-[11.5px] text-[var(--text-secondary)]">
                    <span className="font-medium text-[var(--text-primary)]">{s.steps} steps</span>
                    <span>{s.enrolled} enrolled</span>
                    <span className="text-[#16A34A] font-medium">{s.performance}</span>
                  </div>
                </div>
                <div className="mt-[14px] pt-[10px] border-t border-[#F3F5F2] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                  <span>{s.owner}</span>
                  <span>{s.lastActivity}</span>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-[40px] flex flex-col items-center text-center">
              <SearchX size={20} className="text-[var(--text-muted)] mb-[8px]" />
              <div className="text-[13px] text-[var(--text-muted)]">No matching sequences found.</div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-[14px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="text-[15px] font-semibold mb-[4px] text-[var(--text-primary)]">
            Follow-up tasks generated from sequences
          </div>
          <div className="text-[13px] text-[var(--text-secondary)] mb-[16px]">
            Tasks due from sequences appear in Sales → Tasks & Activities for scheduled outreach execution.
          </div>
          <div className="border border-[#F3F5F2] rounded-[10px] overflow-hidden">
            <table className="w-full text-[13px]">
              <thead className="bg-[#F7F8F5] text-[11px] text-[var(--text-muted)]">
                <tr>
                  <th className="text-left p-[10px] font-medium">Task</th>
                  <th className="text-left p-[10px] font-medium">Associated Sequence</th>
                  <th className="text-left p-[10px] font-medium">Lead</th>
                  <th className="text-left p-[10px] font-medium">Due Date</th>
                  <th className="text-left p-[10px] font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F5F2]">
                {[
                  {
                    task: 'Send Step 2 follow-up email',
                    seq: sequences[0]?.name || 'Outbound Outreach',
                    lead: 'Dominion Castiel (Apex Global)',
                    due: 'Tomorrow, 10:00 AM',
                    status: 'Pending',
                  },
                  {
                    task: 'LinkedIn connection check',
                    seq: sequences[1]?.name || 'Executive Connect',
                    lead: 'Sarah Jenkins (Bright Media)',
                    due: 'In 3 days',
                    status: 'Scheduled',
                  },
                  {
                    task: 'Call touchpoint for unread emails',
                    seq: sequences[0]?.name || 'Outbound Outreach',
                    lead: 'Michael Obi (Lagos Tech)',
                    due: 'Next Monday',
                    status: 'Upcoming',
                  },
                ].map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#FBFBF9]">
                    <td className="p-[10px] font-medium text-[var(--text-primary)]">{item.task}</td>
                    <td className="p-[10px] text-[var(--text-secondary)]">{item.seq}</td>
                    <td className="p-[10px] text-[var(--text-secondary)]">{item.lead}</td>
                    <td className="p-[10px] text-[var(--text-muted)]">{item.due}</td>
                    <td className="p-[10px]">
                      <StatusBadge label={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 p-[16px]">
          <div className="w-full max-w-[480px] bg-white rounded-[16px] p-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between mb-[16px]">
              <div className="text-[16px] font-semibold text-[var(--text-primary)]">New Sequence</div>
              <button
                type="button"
                onClick={handleCancel}
                className="w-[32px] h-[32px] rounded-[8px] bg-[var(--input-bg)] flex items-center justify-center cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                aria-label="Close dialog"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex flex-col gap-[14px]">
              <div>
                <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">
                  Sequence Name *
                </label>
                <input
                  type="text"
                  value={newSeq.name}
                  onChange={(e) => {
                    setNewSeq({ ...newSeq, name: e.target.value });
                    if (errors.name) setErrors({});
                  }}
                  placeholder="e.g. Inbound Demo Request Sequence"
                  className={`w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] border text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#76E05B] focus:ring-[2px] focus:ring-[#EFFBEA] ${
                    errors.name ? 'border-red-400' : 'border-[var(--border)]'
                  }`}
                />
                {errors.name && (
                  <div className="text-[11px] text-red-500 mt-[4px]">{errors.name}</div>
                )}
              </div>

              <div>
                <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">
                  Target Audience
                </label>
                <Dropdown
                  value={newSeq.audience}
                  onChange={(v: string) => setNewSeq({ ...newSeq, audience: v })}
                  options={[
                    'Lagos Technology Leads',
                    'Abuja Marketing Agencies',
                    'Enterprise Prospects',
                    'High Growth Startups',
                    'General Inquiries',
                  ]}
                />
              </div>

              <div className="grid grid-cols-2 gap-[12px]">
                <div>
                  <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">
                    Steps
                  </label>
                  <select
                    value={newSeq.steps}
                    onChange={(e) => setNewSeq({ ...newSeq, steps: Number(e.target.value) })}
                    className="w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] border border-[var(--border)] text-[13px] text-[var(--text-primary)] focus:outline-none focus:border-[#76E05B] focus:ring-[2px] focus:ring-[#EFFBEA]"
                  >
                    <option value={2}>2 steps (Email + Follow-up)</option>
                    <option value={3}>3 steps (Multi-touch)</option>
                    <option value={4}>4 steps (Full Cadence)</option>
                    <option value={5}>5 steps (Comprehensive)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">
                    Initial Status
                  </label>
                  <Dropdown
                    value={newSeq.status}
                    onChange={(v: string) => setNewSeq({ ...newSeq, status: v })}
                    options={['Draft', 'Active', 'Paused']}
                  />
                </div>
              </div>
            </div>

            <div className="mt-[20px] flex justify-end gap-[8px]">
              <button
                type="button"
                onClick={handleCancel}
                className="h-[38px] px-[16px] rounded-[10px] bg-white border border-[var(--border)] text-[13px] font-medium cursor-pointer hover:bg-[var(--input-bg)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreate}
                className="h-[38px] px-[18px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold text-[#1B4D0F] hover:bg-[var(--primary-hover)] cursor-pointer transition-colors"
              >
                Create Sequence
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
