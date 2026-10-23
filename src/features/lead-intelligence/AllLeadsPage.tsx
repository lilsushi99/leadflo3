import React, { useState, useMemo, useEffect } from 'react';
import {
  Download,
  UserRoundPlus,
  Search,
  X,
  ChevronDown,
  Eye,
  SearchX,
} from 'lucide-react';
import { Lead, LeadSource, LeadStatus, Service, Verification } from '../../types/crm';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { Dropdown } from '../../components/shared/Dropdown';
import {
  avatarColors,
  branches,
  services,
  sources,
  statuses,
  users,
  verifications,
} from '../../data/mock/leads';

interface AllLeadsPageProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  sourceFilter: string | null;
  setSourceFilter: (source: string | null) => void;
  branch?: string;
}

export function AllLeadsPage({
  leads,
  setLeads,
  sourceFilter,
  setSourceFilter,
}: AllLeadsPageProps) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<{
    source: string;
    status: string;
    verification: string;
    service: string;
    branch: string;
    assignee: string;
  }>({
    source: sourceFilter || 'All',
    status: 'All',
    verification: 'All',
    service: 'All',
    branch: 'All',
    assignee: 'All',
  });
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [showAdd, setShowAdd] = useState(false);
  const [detailLead, setDetailLead] = useState<Lead | null>(null);
  const [newLead, setNewLead] = useState<Partial<Lead>>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    source: undefined,
    status: undefined,
    branch: '',
    service: undefined,
    verification: 'Unknown',
    assignee: users[0],
    location: 'Lagos',
  });
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (sourceFilter) setFilters((f) => ({ ...f, source: sourceFilter }));
  }, [sourceFilter]);

  const filtered = useMemo(() => {
    return leads.filter((l: Lead) => {
      if (
        search &&
        !`${l.firstName} ${l.lastName} ${l.email} ${l.company}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
        return false;
      if (filters.source !== 'All' && l.source !== filters.source) return false;
      if (filters.status !== 'All' && l.status !== filters.status) return false;
      if (filters.verification !== 'All' && l.verification !== filters.verification)
        return false;
      if (filters.service !== 'All' && l.service !== filters.service) return false;
      if (filters.branch !== 'All' && l.branch !== filters.branch) return false;
      if (filters.assignee !== 'All' && l.assignee !== filters.assignee) return false;
      return true;
    });
  }, [leads, search, filters]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const toggleSelectAll = () =>
    setSelected(
      selected.length === paginated.length ? [] : paginated.map((l: Lead) => l.id)
    );
  const toggleSelect = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((i) => i !== id) : [...s, id]));

  const handleAdd = () => {
    const err: any = {};
    if (!newLead.firstName) err.firstName = 'Required';
    if (!newLead.email || !newLead.email.includes('@'))
      err.email = 'Valid email required';
    setErrors(err);
    if (Object.keys(err).length) return;
    const lead: Lead = {
      id: `lead-${Date.now()}`,
      firstName: newLead.firstName!,
      lastName: newLead.lastName || '',
      email: newLead.email!,
      phone: newLead.phone || '',
      company: newLead.company || 'Unknown',
      source: (newLead.source as LeadSource) || 'Website',
      location: newLead.location || 'Lagos',
      service: (newLead.service as Service) || 'Web Development',
      verification: (newLead.verification as Verification) || 'Unknown',
      status: (newLead.status as LeadStatus) || 'New',
      assignee: newLead.assignee || users[0],
      branch: newLead.branch || 'Lagos Branch',
      createdAt: 'Now',
      lastActivity: 'Just now',
      avatarColor: avatarColors[Math.floor(Math.random() * avatarColors.length)],
    };
    setLeads([lead, ...leads]);
    setShowAdd(false);
    setNewLead({
      firstName: '',
      lastName: '',
      email: '',
      company: '',
      phone: '',
      source: undefined,
      status: undefined,
      branch: '',
      service: undefined,
      verification: 'Unknown',
      assignee: users[0],
      location: 'Lagos',
    });
  };

  const handleExport = () => {
    const csv = [
      'FirstName,LastName,Email,Company,Source,Status',
      ...filtered.map(
        (l: Lead) =>
          `${l.firstName},${l.lastName},${l.email},${l.company},${l.source},${l.status}`
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    a.click();
  };

  return (
    <div className="flex flex-col gap-[20px] max-w-[1440px]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-[12px]">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight">All Leads</h1>
          <p className="text-[14px] text-[var(--text-secondary)] mt-[2px]">
            Manage and track leads captured across your sources.
          </p>
        </div>
        <div className="flex gap-[8px]">
          <button
            onClick={handleExport}
            className="h-[40px] px-[16px] rounded-[10px] bg-white border border-[var(--border)] text-[14px] font-medium flex items-center gap-[8px] hover:bg-[var(--input-bg)]"
          >
            <Download size={16} />
            Export
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="h-[40px] px-[18px] rounded-[10px] bg-[var(--primary)] text-[#1B2D15] text-[14px] font-semibold flex items-center gap-[8px] hover:bg-[var(--primary-hover)] transition-colors"
          >
            <UserRoundPlus size={16} />
            Add Lead
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[14px] p-[16px] flex flex-col gap-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col xl:flex-row gap-[12px] xl:items-center justify-between">
          <div className="relative w-full sm:w-[280px] lg:w-[320px] shrink-0">
            <Search
              size={16}
              className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none z-10"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search name, email, or company..."
              className="w-full h-[38px] pl-[36px] pr-[32px] rounded-[10px] bg-[var(--input-bg)] border border-transparent text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:bg-white focus:ring-[2px] focus:ring-[var(--primary-soft)] transition-all block"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-[10px] top-1/2 -translate-y-1/2 p-[2px] text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-full"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-[8px] min-w-0">
            {[
              { key: 'source', opts: ['All', ...sources], label: 'Source' },
              { key: 'status', opts: ['All', ...statuses], label: 'Status' },
              { key: 'verification', opts: ['All', ...verifications], label: 'Verification' },
              { key: 'branch', opts: ['All', ...branches.slice(1)], label: 'Branch' },
              { key: 'assignee', opts: ['All', ...users], label: 'Assignee' },
            ].map((f) => (
              <Dropdown
                key={f.key}
                value={(filters as any)[f.key]}
                onSelect={(v) => {
                  setFilters({ ...filters, [f.key]: v });
                  setPage(1);
                }}
                options={f.opts}
                trigger={
                  <div className="h-[36px] px-[12px] rounded-[10px] bg-[var(--input-bg)] border border-transparent text-[13px] flex items-center gap-[6px] cursor-pointer">
                    {f.label}: <span className="font-medium">{(filters as any)[f.key]}</span>
                    <ChevronDown size={14} className="text-[var(--text-muted)]" />
                  </div>
                }
              />
            ))}
          </div>
        </div>

        <div className="flex gap-[16px] py-[10px] border-y border-[#F3F5F2] text-[12px]">
          <div className="flex gap-[6px]">
            <span className="text-[var(--text-muted)]">Total:</span>
            <span className="font-semibold">{filtered.length}</span>
          </div>
          <div className="flex gap-[6px]">
            <span className="text-[var(--text-muted)]">New:</span>
            <span className="font-semibold">{filtered.filter((l: Lead) => l.status === 'New').length}</span>
          </div>
          <div className="flex gap-[6px]">
            <span className="text-[var(--text-muted)]">Verified:</span>
            <span className="font-semibold">
              {filtered.filter((l: Lead) => l.verification === 'Verified').length}
            </span>
          </div>
          <div className="flex gap-[6px]">
            <span className="text-[var(--text-muted)]">Dup Candidates:</span>
            <span className="font-semibold">{Math.floor(filtered.length * 0.08)}</span>
          </div>
        </div>

        {selected.length > 0 && (
          <div className="flex items-center justify-between bg-[var(--primary-soft)] border border-[var(--primary-soft-2)] rounded-[10px] px-[14px] h-[44px]">
            <span className="text-[13px] font-medium">{selected.length} selected</span>
            <div className="flex gap-[8px]">
              <button onClick={() => setSelected([])} className="text-[13px] font-medium">
                Clear
              </button>
              <button className="h-[30px] px-[12px] rounded-[8px] bg-[var(--primary)] text-[13px] font-semibold text-[#1B4D0F]">
                Bulk Assign
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto rounded-[12px] border border-transparent max-w-full">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="text-[11px] font-medium text-[var(--text-muted)] border-b border-[var(--border)]">
                <th className="text-left py-[10px] w-[36px]">
                  <input
                    type="checkbox"
                    checked={selected.length === paginated.length && paginated.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="text-left py-[10px] font-medium">Lead / Company</th>
                <th className="text-left py-[10px] font-medium">Email / Phone</th>
                <th className="text-left py-[10px] font-medium">Source</th>
                <th className="text-left py-[10px] font-medium">Location</th>
                <th className="text-left py-[10px] font-medium">Service</th>
                <th className="text-left py-[10px] font-medium">Verification</th>
                <th className="text-left py-[10px] font-medium">Status</th>
                <th className="text-left py-[10px] font-medium">Assignee</th>
                <th className="text-left py-[10px] font-medium">Branch</th>
                <th className="text-left py-[10px] font-medium">Last Activity</th>
                <th className="text-left py-[10px] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((lead: Lead) => (
                <tr key={lead.id} className="border-b border-[#F3F5F2] hover:bg-[#F7F8F5]/70 group">
                  <td className="py-[12px]">
                    <input
                      type="checkbox"
                      checked={selected.includes(lead.id)}
                      onChange={() => toggleSelect(lead.id)}
                    />
                  </td>
                  <td className="py-[12px]">
                    <div className="flex items-center gap-[8px]">
                      <div
                        className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[11px] font-semibold"
                        style={{ background: lead.avatarColor }}
                      >
                        {lead.firstName[0]}
                        {lead.lastName[0]}
                      </div>
                      <div className="leading-tight">
                        <div className="text-[13px] font-medium">
                          {lead.firstName} {lead.lastName}
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)]">{lead.company}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-[12px]">
                    <div className="text-[12px]">{lead.email}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">{lead.phone}</div>
                  </td>
                  <td className="py-[12px] text-[12px]">{lead.source}</td>
                  <td className="py-[12px] text-[12px]">{lead.location}</td>
                  <td className="py-[12px] text-[12px]">{lead.service}</td>
                  <td className="py-[12px]">
                    <StatusBadge label={lead.verification} />
                  </td>
                  <td className="py-[12px]">
                    <StatusBadge label={lead.status} />
                  </td>
                  <td className="py-[12px] text-[12px]">{lead.assignee.split(' ')[0]}</td>
                  <td className="py-[12px] text-[12px]">{lead.branch.replace(' Branch', '')}</td>
                  <td className="py-[12px] text-[11px] text-[var(--text-muted)]">{lead.lastActivity}</td>
                  <td className="py-[12px]">
                    <button
                      onClick={() => setDetailLead(lead)}
                      className="w-[28px] h-[28px] rounded-[8px] hover:bg-[var(--input-bg)] flex items-center justify-center cursor-pointer"
                      aria-label="View lead details"
                    >
                      <Eye size={14} className="text-[var(--text-muted)]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {paginated.length === 0 && (
            <div className="py-[40px] text-center">
              <SearchX size={28} className="mx-auto text-[var(--text-muted)] mb-[8px]" />
              <div className="text-[14px] font-medium">No leads match filters</div>
              <div className="text-[12px] text-[var(--text-muted)]">Try adjusting search or filters</div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-[12px] border-t border-[var(--border)]">
          <div className="text-[12px] text-[var(--text-muted)]">
            {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filtered.length)} of {filtered.length}
          </div>
          <div className="flex gap-[8px]">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="h-[32px] px-[12px] rounded-[8px] bg-white border border-[var(--border)] text-[13px] disabled:opacity-50 cursor-pointer"
            >
              Prev
            </button>
            <div className="flex items-center gap-[4px]">
              {Array.from({ length: totalPages })
                .slice(0, 5)
                .map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-[32px] h-[32px] rounded-[8px] text-[13px] cursor-pointer ${
                      page === i + 1
                        ? 'bg-[var(--primary)] font-semibold text-[#1B4D0F]'
                        : 'bg-white border border-[var(--border)]'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
            </div>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="h-[32px] px-[12px] rounded-[8px] bg-white border border-[var(--border)] text-[13px] disabled:opacity-50 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-[16px]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAdd(false)} />
          <div className="relative bg-white rounded-[16px] w-full max-w-[560px] max-h-[90vh] overflow-auto border border-[var(--border)] shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
            <div className="sticky top-0 bg-white p-[20px] border-b border-[var(--border)] flex items-center justify-between">
              <div className="text-[16px] font-semibold">Add New Lead</div>
              <button
                onClick={() => setShowAdd(false)}
                className="w-[32px] h-[32px] rounded-[8px] bg-[var(--input-bg)] flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-[20px] grid grid-cols-2 gap-[14px]">
              <div className="col-span-1">
                <label className="text-[12px] font-medium text-[var(--text-primary)]">First Name *</label>
                <input
                  type="text"
                  value={newLead.firstName}
                  onChange={(e) => setNewLead({ ...newLead, firstName: e.target.value })}
                  className={`mt-[6px] w-full h-[38px] px-[12px] rounded-[10px] bg-[var(--input-bg)] border text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#76E05B] focus:ring-[2px] focus:ring-[#EFFBEA] ${
                    errors.firstName ? 'border-red-400' : 'border-[var(--border)]'
                  }`}
                  placeholder="e.g. Jane"
                />
                {errors.firstName && <div className="text-[11px] text-red-500 mt-[4px]">{errors.firstName}</div>}
              </div>
              <div className="col-span-1">
                <label className="text-[12px] font-medium text-[var(--text-primary)]">Last Name</label>
                <input
                  type="text"
                  value={newLead.lastName}
                  onChange={(e) => setNewLead({ ...newLead, lastName: e.target.value })}
                  className="mt-[6px] w-full h-[38px] px-[12px] rounded-[10px] bg-[var(--input-bg)] border border-[var(--border)] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#76E05B] focus:ring-[2px] focus:ring-[#EFFBEA]"
                  placeholder="e.g. Smith"
                />
              </div>
              <div className="col-span-2">
                <label className="text-[12px] font-medium text-[var(--text-primary)]">Email *</label>
                <input
                  type="email"
                  value={newLead.email}
                  onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  className={`mt-[6px] w-full h-[38px] px-[12px] rounded-[10px] bg-[var(--input-bg)] border text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#76E05B] focus:ring-[2px] focus:ring-[#EFFBEA] ${
                    errors.email ? 'border-red-400' : 'border-[var(--border)]'
                  }`}
                  placeholder="name@company.com"
                />
                {errors.email && <div className="text-[11px] text-red-500 mt-[4px]">{errors.email}</div>}
              </div>
              <div className="col-span-1">
                <label className="text-[12px] font-medium text-[var(--text-primary)]">Phone</label>
                <input
                  type="tel"
                  value={newLead.phone}
                  onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                  className="mt-[6px] w-full h-[38px] px-[12px] rounded-[10px] bg-[var(--input-bg)] border border-[var(--border)] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#76E05B] focus:ring-[2px] focus:ring-[#EFFBEA]"
                  placeholder="e.g. +234 801 234 5678"
                />
              </div>
              <div className="col-span-1">
                <label className="text-[12px] font-medium text-[var(--text-primary)]">Company</label>
                <input
                  type="text"
                  value={newLead.company}
                  onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                  className="mt-[6px] w-full h-[38px] px-[12px] rounded-[10px] bg-[var(--input-bg)] border border-[var(--border)] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#76E05B] focus:ring-[2px] focus:ring-[#EFFBEA]"
                  placeholder="e.g. Acme Ltd"
                />
              </div>
              <div className="col-span-1">
                <label className="text-[12px] font-medium text-[var(--text-primary)]">Source</label>
                <Dropdown
                  wrapperClassName="w-full mt-[6px] block"
                  className="w-full"
                  value={newLead.source || ''}
                  placeholder="Select source"
                  options={sources}
                  onSelect={(v) => setNewLead({ ...newLead, source: v as any })}
                />
              </div>
              <div className="col-span-1">
                <label className="text-[12px] font-medium text-[var(--text-primary)]">Status</label>
                <Dropdown
                  wrapperClassName="w-full mt-[6px] block"
                  className="w-full"
                  value={newLead.status || ''}
                  placeholder="Select status"
                  options={statuses}
                  onSelect={(v) => setNewLead({ ...newLead, status: v as any })}
                />
              </div>
              <div className="col-span-1">
                <label className="text-[12px] font-medium text-[var(--text-primary)]">Service</label>
                <Dropdown
                  wrapperClassName="w-full mt-[6px] block"
                  className="w-full"
                  value={newLead.service || ''}
                  placeholder="Select service"
                  options={services}
                  onSelect={(v) => setNewLead({ ...newLead, service: v as any })}
                />
              </div>
              <div className="col-span-1">
                <label className="text-[12px] font-medium text-[var(--text-primary)]">Service Branch</label>
                <Dropdown
                  wrapperClassName="w-full mt-[6px] block"
                  className="w-full"
                  value={newLead.branch || ''}
                  placeholder="Select service branch"
                  options={branches.slice(1)}
                  onSelect={(v) => setNewLead({ ...newLead, branch: v })}
                />
              </div>
            </div>
            <div className="p-[20px] border-t border-[var(--border)] flex justify-end gap-[8px] bg-[var(--bg)] rounded-b-[16px]">
              <button
                onClick={() => setShowAdd(false)}
                className="h-[40px] px-[16px] rounded-[10px] bg-white border border-[var(--border)] text-[14px] font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="h-[40px] px-[20px] rounded-[10px] bg-[var(--primary)] text-[#1B2D15] text-[14px] font-semibold hover:bg-[var(--primary-hover)] cursor-pointer"
              >
                Save Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {detailLead && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20" onClick={() => setDetailLead(null)} />
          <div className="relative w-full max-w-[420px] bg-white h-full border-l border-[var(--border)] shadow-[-12px_0_40px_rgba(0,0,0,0.08)] flex flex-col animate-[slideIn_0.2s_ease]">
            <div className="p-[20px] border-b border-[var(--border)] flex items-center justify-between">
              <div className="text-[16px] font-semibold">Lead Details</div>
              <button
                onClick={() => setDetailLead(null)}
                className="w-[32px] h-[32px] rounded-[8px] bg-[var(--input-bg)] flex items-center justify-center cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-[20px] flex flex-col gap-[20px]">
              <div className="flex items-center gap-[12px]">
                <div
                  className="w-[48px] h-[48px] rounded-full flex items-center justify-center text-[16px] font-semibold"
                  style={{ background: detailLead.avatarColor }}
                >
                  {detailLead.firstName[0]}
                  {detailLead.lastName[0]}
                </div>
                <div>
                  <div className="text-[16px] font-semibold">
                    {detailLead.firstName} {detailLead.lastName}
                  </div>
                  <div className="text-[13px] text-[var(--text-muted)]">{detailLead.company}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-[12px] text-[13px]">
                <div>
                  <div className="text-[11px] text-[var(--text-muted)]">Email</div>
                  <div className="font-medium">{detailLead.email}</div>
                </div>
                <div>
                  <div className="text-[11px] text-[var(--text-muted)]">Phone</div>
                  <div className="font-medium">{detailLead.phone}</div>
                </div>
                <div>
                  <div className="text-[11px] text-[var(--text-muted)]">Source</div>
                  <div>{detailLead.source}</div>
                </div>
                <div>
                  <div className="text-[11px] text-[var(--text-muted)]">Location</div>
                  <div>{detailLead.location}</div>
                </div>
                <div>
                  <div className="text-[11px] text-[var(--text-muted)]">Service</div>
                  <div>{detailLead.service}</div>
                </div>
                <div>
                  <div className="text-[11px] text-[var(--text-muted)]">Branch</div>
                  <div>{detailLead.branch}</div>
                </div>
                <div>
                  <div className="text-[11px] text-[var(--text-muted)]">Assignee</div>
                  <div>{detailLead.assignee}</div>
                </div>
                <div>
                  <div className="text-[11px] text-[var(--text-muted)]">Created</div>
                  <div>{detailLead.createdAt}</div>
                </div>
              </div>
              <div className="flex gap-[8px]">
                <StatusBadge label={detailLead.status} />
                <StatusBadge label={detailLead.verification} />
              </div>
              <div className="border-t border-[var(--border)] pt-[16px]">
                <div className="text-[13px] font-semibold mb-[8px]">Activity</div>
                <div className="flex flex-col gap-[8px] text-[12px]">
                  <div className="flex gap-[8px]">
                    <div className="w-[6px] h-[6px] rounded-full bg-[var(--primary)] mt-[6px]" />
                    Lead created • {detailLead.createdAt}
                  </div>
                  <div className="flex gap-[8px]">
                    <div className="w-[6px] h-[6px] rounded-full bg-[#3B82F6] mt-[6px]" />
                    Email verified • {detailLead.verification}
                  </div>
                  <div className="flex gap-[8px]">
                    <div className="w-[6px] h-[6px] rounded-full bg-[#8B5CF6] mt-[6px]" />
                    Status updated to {detailLead.status} • {detailLead.lastActivity}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
