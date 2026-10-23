import React, { useState, useMemo } from 'react';
import {
  ClipboardList,
  Activity,
  FileUp,
  AlertCircle,
  Search,
  Eye,
  SearchX,
  X,
} from 'lucide-react';
import { AuditLog, TeamMemberDetail } from '../../types/crm';
import { Dropdown } from '../../components/shared/Dropdown';
import { StatusBadge } from '../../components/shared/StatusBadge';

interface AuditCompliancePageProps {
  logs: AuditLog[];
  setLogs: React.Dispatch<React.SetStateAction<AuditLog[]>>;
  teamMembers: TeamMemberDetail[];
}

export function AuditCompliancePage({
  logs,
  setLogs: _setLogs,
  teamMembers: _teamMembers,
}: AuditCompliancePageProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [actorFilter, setActorFilter] = useState('All Actors');
  const [outcomeFilter, setOutcomeFilter] = useState('All Outcomes');
  const [dateFilter, setDateFilter] = useState('All Time');
  const [selected, setSelected] = useState<AuditLog | null>(null);
  const [branchFilter, setBranchFilter] = useState('All Branches');

  const filtered = useMemo(() => {
    return logs.filter(l => {
      if (search && !`${l.action} ${l.affectedRecord} ${l.actor} ${l.details}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (typeFilter !== 'All Types' && l.actionType !== typeFilter) return false;
      if (actorFilter !== 'All Actors' && l.actor !== actorFilter) return false;
      if (outcomeFilter !== 'All Outcomes' && l.outcome !== outcomeFilter) return false;
      if (branchFilter !== 'All Branches' && l.branch !== branchFilter) return false;
      if (dateFilter === 'Last 7 Days') {
        const idx = logs.indexOf(l);
        if (idx > 6) return false;
      }
      return true;
    });
  }, [logs, search, typeFilter, actorFilter, outcomeFilter, branchFilter, dateFilter]);

  const stats = useMemo(() => {
    return {
      total: logs.length,
      live: logs.filter(l => !l.isDemo).length,
      demo: logs.filter(l => l.isDemo).length,
      failed: logs.filter(l => l.outcome === 'Failed').length,
    };
  }, [logs]);

  return (
    <div className="flex flex-col gap-[20px] max-w-[1600px]">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-[12px]">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight">Audit & Compliance</h1>
          <p className="text-[14px] text-[var(--text-secondary)] mt-[2px] max-w-[720px]">
            Review important workspace activities. Searchable audit records with filters for date, activity type, actor, and outcome. Demo seeded records are clearly distinguished from genuinely recorded live activity. No compliance certifications are claimed.
          </p>
        </div>
        <div className="flex items-center gap-[8px]">
          <button
            onClick={() => {
              setSearch('');
              setTypeFilter('All Types');
              setActorFilter('All Actors');
              setOutcomeFilter('All Outcomes');
              setBranchFilter('All Branches');
              setDateFilter('All Time');
            }}
            className="h-[36px] px-[12px] rounded-[10px] bg-[var(--input-bg)] text-[13px] hover:bg-[#EAECE8] cursor-pointer whitespace-nowrap"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[16px]">
        {[
          { label: 'Total Events', value: stats.total, sub: 'All recorded activity', icon: ClipboardList, bg: 'bg-[#EBF5FF]', iconColor: 'text-[#2563EB]' },
          { label: 'Live Activity', value: stats.live, sub: 'Genuinely recorded', icon: Activity, bg: 'bg-[#EFFBEA]', iconColor: 'text-[#16A34A]' },
          { label: 'Demo Seeded', value: stats.demo, sub: 'Seeded records', icon: FileUp, bg: 'bg-[#FEF3C7]', iconColor: 'text-[#D97706]' },
          { label: 'Failed Outcomes', value: stats.failed, sub: 'Needs attention', icon: AlertCircle, bg: 'bg-[#FEE2E2]', iconColor: 'text-[#DC2626]' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-[14px] p-[20px] flex flex-col gap-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="flex items-start justify-between">
              <span className="text-[13px] text-[var(--text-secondary)] font-medium">{k.label}</span>
              <div className={`w-[32px] h-[32px] rounded-[9px] ${k.bg} flex items-center justify-center shrink-0`}>
                <k.icon size={16} className={k.iconColor} />
              </div>
            </div>
            <div className="text-[26px] font-semibold leading-none tracking-tight">{k.value}</div>
            <div className="text-[12px] text-[var(--text-muted)]">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[14px] p-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col lg:flex-row gap-[12px] justify-between mb-[14px]">
          <div className="relative w-full lg:max-w-[320px]">
            <Search size={16} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search action, actor, record, details"
              className="w-full h-[40px] pl-[36px] rounded-[10px] bg-[var(--input-bg)] border border-transparent text-[13px] focus:outline-none focus:border-[var(--primary)]"
              aria-label="Search audit logs"
            />
          </div>
          <div className="flex flex-wrap gap-[8px]">
            <Dropdown value={typeFilter} onChange={setTypeFilter} options={['All Types', 'Lead', 'Deal', 'Credit', 'Settings', 'Team', 'Branch', 'Integration', 'Campaign', 'System']} />
            <Dropdown value={actorFilter} onChange={setActorFilter} options={['All Actors', ...Array.from(new Set(logs.map(l => l.actor)))]} />
            <Dropdown value={outcomeFilter} onChange={setOutcomeFilter} options={['All Outcomes', 'Success', 'Failed', 'Pending']} />
            <Dropdown value={branchFilter} onChange={setBranchFilter} options={['All Branches', 'Lagos Branch', 'Abuja Branch', 'Port Harcourt Branch', 'Kano Branch']} />
            <Dropdown value={dateFilter} onChange={setDateFilter} options={['All Time', 'Last 7 Days', 'Last 30 Days']} />
          </div>
        </div>

        <div className="overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] text-[11px] uppercase tracking-[0.06em] text-[var(--text-muted)]">
                <th className="py-[8px] px-[10px] font-medium">Timestamp</th>
                <th className="py-[8px] px-[10px] font-medium">Actor</th>
                <th className="py-[8px] px-[10px] font-medium">Action</th>
                <th className="py-[8px] px-[10px] font-medium">Affected Record</th>
                <th className="py-[8px] px-[10px] font-medium">Outcome</th>
                <th className="py-[8px] px-[10px] font-medium">Type</th>
                <th className="py-[8px] px-[10px] font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(log => (
                <tr key={log.id} className="border-b border-[var(--border)]/60 hover:bg-[#F9FAF8] cursor-pointer" onClick={() => setSelected(log)}>
                  <td className="py-[10px] px-[10px] text-[12px] whitespace-nowrap">
                    <div className="font-medium">{log.dateLabel}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">{log.branch}</div>
                  </td>
                  <td className="py-[10px] px-[10px] text-[12px]">{log.actor}</td>
                  <td className="py-[10px] px-[10px] text-[12px]">
                    <div className="flex items-center gap-[6px]">
                      <span className="font-medium">{log.action}</span>
                      {log.isDemo ? (
                        <span className="text-[10px] px-[6px] py-[1px] rounded-full bg-[#FFF4E5] text-[#92400E]">
                          Demo
                        </span>
                      ) : (
                        <span className="text-[10px] px-[6px] py-[1px] rounded-full bg-[#EFFBEA] text-[#166534]">
                          Live
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">{log.actionType}</div>
                  </td>
                  <td className="py-[10px] px-[10px] text-[12px]">
                    <div className="font-medium">{log.affectedRecord}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">{log.affectedRecordType}</div>
                  </td>
                  <td className="py-[10px] px-[10px]">
                    <StatusBadge label={log.outcome} />
                  </td>
                  <td className="py-[10px] px-[10px]">
                    <StatusBadge label={log.actionType} />
                  </td>
                  <td className="py-[10px] px-[10px]">
                    <button className="h-[28px] px-[10px] rounded-[8px] bg-[var(--input-bg)] text-[11px] flex items-center gap-[4px]">
                      <Eye size={12} />View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-[32px] text-center">
              <div className="w-[48px] h-[48px] mx-auto rounded-full bg-[var(--input-bg)] flex items-center justify-center mb-[12px]">
                <SearchX size={20} className="text-[var(--text-muted)]" />
              </div>
              <div className="text-[13px] font-medium">No audit records found</div>
              <div className="text-[12px] text-[var(--text-muted)] mt-[4px]">
                No records match your current filters. Try adjusting search, date range, or reset filters.
              </div>
              <button
                onClick={() => {
                  setSearch('');
                  setTypeFilter('All Types');
                  setActorFilter('All Actors');
                  setOutcomeFilter('All Outcomes');
                  setBranchFilter('All Branches');
                  setDateFilter('All Time');
                }}
                className="mt-[12px] h-[36px] px-[14px] rounded-[10px] bg-white border border-[var(--border)] text-[13px]"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-[60] flex justify-end bg-black/20" onClick={() => setSelected(null)}>
          <div className="w-full max-w-[520px] bg-white h-full overflow-auto border-l border-[var(--border)]" onClick={e => e.stopPropagation()}>
            <div className="p-[20px] border-b border-[var(--border)] flex justify-between items-start">
              <div>
                <div className="font-semibold text-[15px] flex items-center gap-[8px]">
                  {selected.action}
                  {selected.isDemo ? (
                    <span className="text-[10px] px-[6px] py-[2px] rounded-full bg-[#FFF4E5] text-[#92400E]">
                      Demo seeded
                    </span>
                  ) : (
                    <span className="text-[10px] px-[6px] py-[2px] rounded-full bg-[#EFFBEA] text-[#166534]">
                      Live activity
                    </span>
                  )}
                </div>
                <div className="text-[12px] text-[var(--text-muted)] mt-[2px]">
                  {selected.dateLabel} • {selected.branch} • {selected.actor}
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="p-[6px] bg-[var(--input-bg)] rounded-[8px]">
                <X size={14} />
              </button>
            </div>
            <div className="p-[20px] flex flex-col gap-[16px]">
              <div className="grid grid-cols-2 gap-[12px]">
                <div className="bg-[var(--input-bg)] rounded-[10px] p-[10px]">
                  <div className="text-[11px] text-[var(--text-muted)] uppercase">Actor</div>
                  <div className="text-[12px] font-medium mt-[2px]">{selected.actor}</div>
                </div>
                <div className="bg-[var(--input-bg)] rounded-[10px] p-[10px]">
                  <div className="text-[11px] text-[var(--text-muted)] uppercase">Outcome</div>
                  <div className="mt-[2px]"><StatusBadge label={selected.outcome} /></div>
                </div>
                <div className="bg-[var(--input-bg)] rounded-[10px] p-[10px]">
                  <div className="text-[11px] text-[var(--text-muted)] uppercase">Action Type</div>
                  <div className="text-[12px] font-medium mt-[2px]">{selected.actionType}</div>
                </div>
                <div className="bg-[var(--input-bg)] rounded-[10px] p-[10px]">
                  <div className="text-[11px] text-[var(--text-muted)] uppercase">Affected Record</div>
                  <div className="text-[12px] font-medium mt-[2px]">{selected.affectedRecord}</div>
                  <div className="text-[11px] text-[var(--text-muted)]">{selected.affectedRecordType}</div>
                </div>
              </div>
              <div>
                <div className="text-[12px] font-semibold mb-[6px]">Event Details</div>
                <div className="bg-[var(--input-bg)] rounded-[10px] p-[12px] text-[12px] text-[var(--text-secondary)] leading-[1.5]">
                  {selected.details}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-[12px]">
                <div>
                  <div className="text-[11px] text-[var(--text-muted)] uppercase">IP / Source</div>
                  <div className="text-[12px] font-medium">{selected.ip || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-[11px] text-[var(--text-muted)] uppercase">Branch</div>
                  <div className="text-[12px] font-medium">{selected.branch}</div>
                </div>
              </div>
              {selected.metadata && (
                <div>
                  <div className="text-[12px] font-semibold mb-[6px]">Metadata</div>
                  <pre className="bg-[#20251F] text-[#EFFBEA] rounded-[10px] p-[12px] text-[11px] overflow-auto">
                    {JSON.stringify(selected.metadata, null, 2)}
                  </pre>
                </div>
              )}
              <div className={`rounded-[10px] p-[10px] text-[11px] ${selected.isDemo ? 'bg-[#FFF4E5] border border-[#FED7AA] text-[#92400E]' : 'bg-[#EFFBEA] border border-[#C5E8B7] text-[#166534]'}`}>
                {selected.isDemo
                  ? 'This is a seeded demo record — created to demonstrate audit log variety. Distinguished from genuinely recorded live activity.'
                  : 'This is genuinely recorded application activity — created from user actions in this session or recent frontend interactions.'}
              </div>
              <div className="bg-[#F3F5F2] rounded-[10px] p-[10px] text-[10px] text-[var(--text-muted)]">
                Compliance note: This audit log is for operational visibility only. No compliance certifications (SOC2, ISO, GDPR compliance) are claimed or implied. Records are stored in frontend state for demo purposes.
              </div>
              <button onClick={() => setSelected(null)} className="h-[40px] rounded-[10px] bg-[var(--text-primary)] text-white text-[13px] font-medium">
                Close Detail View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
