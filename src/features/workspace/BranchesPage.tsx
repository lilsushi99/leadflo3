import React, { useState, useMemo } from 'react';
import {
  Plus,
  Building2,
  Users,
  Activity,
  Building,
  Search,
  MapPin,
  Eye,
  Edit3,
  X,
  AlertCircle,
  Save,
} from 'lucide-react';
import {
  Lead,
  Deal,
  BranchDetail,
  BranchStatus,
  TeamMemberDetail,
} from '../../types/crm';
import { Dropdown } from '../../components/shared/Dropdown';
import { StatusBadge } from '../../components/shared/StatusBadge';

interface BranchesPageProps {
  leads: Lead[];
  deals: Deal[];
  branchDetails: BranchDetail[];
  setBranchDetails: React.Dispatch<React.SetStateAction<BranchDetail[]>>;
  branchList: string[];
  setBranchList: React.Dispatch<React.SetStateAction<string[]>>;
  teamMembers: TeamMemberDetail[];
}

export function BranchesPage({
  leads,
  deals,
  branchDetails,
  setBranchDetails,
  branchList,
  setBranchList,
  teamMembers,
}: BranchesPageProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [selectedBranch, setSelectedBranch] = useState<any | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState<BranchDetail | null>(null);
  const [form, setForm] = useState({
    name: '',
    location: '',
    address: '',
    manager: '',
    members: [] as string[],
    status: 'Active' as BranchStatus,
    phone: '',
    email: '',
    leadCapacity: 1000,
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredBranches = useMemo(() => {
    return branchDetails.filter((b: BranchDetail) => {
      if (search && !`${b.name} ${b.location} ${b.manager} ${b.address}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== 'All Statuses' && b.status !== statusFilter) return false;
      if (locationFilter !== 'All Locations' && !b.location.includes(locationFilter.replace(', Nigeria', ''))) return false;
      return true;
    });
  }, [branchDetails, search, statusFilter, locationFilter]);

  const branchStats = useMemo(() => {
    return branchDetails.map((b: BranchDetail) => {
      const bLeads = leads.filter((l: Lead) => l.branch === b.name).length;
      const bDeals = deals.filter((d: Deal) => d.branch === b.name);
      const bWon = bDeals.filter((d: Deal) => d.stage === 'Closed Won');
      const utilization = b.leadCapacity ? Math.round((bLeads / b.leadCapacity) * 100) : 0;
      return {
        ...b,
        leadsCount: bLeads,
        dealsCount: bDeals.length,
        wonCount: bWon.length,
        wonValue: bWon.reduce((s: number, d: Deal) => s + d.value, 0),
        utilization,
      };
    });
  }, [branchDetails, leads, deals]);

  const handleSave = () => {
    const err: Record<string, string> = {};
    if (!form.name.trim()) err.name = 'Branch name is required';
    if (!form.location.trim()) err.location = 'Location is required';
    if (!form.address.trim()) err.address = 'Address is required';
    if (!form.manager.trim()) err.manager = 'Manager is required';
    if (!form.phone.trim()) err.phone = 'Phone number is required';
    if (!form.email.trim() || !form.email.includes('@')) err.email = 'Valid email is required';
    if (!form.leadCapacity || form.leadCapacity < 100) err.leadCapacity = 'Capacity must be at least 100';
    setErrors(err);
    if (Object.keys(err).length) return;
    const branchName = form.name.trim();
    if (showEdit) {
      setBranchDetails(branchDetails.map((b: BranchDetail) => b.id === showEdit.id ? { ...b, ...form, name: branchName } : b));
      if (showEdit.name !== branchName) {
        setBranchList(branchList.map((br: string) => br === showEdit.name ? branchName : br));
      }
    } else {
      if (branchList.includes(branchName)) {
        setErrors({ ...err, name: 'Branch already exists - choose a unique name' });
        return;
      }
      const newBranch: BranchDetail = {
        id: `branch-${Date.now()}`,
        name: branchName,
        location: form.location.trim(),
        address: form.address.trim(),
        manager: form.manager.trim(),
        members: form.members.length ? form.members : [form.manager.trim()],
        status: form.status,
        phone: form.phone.trim(),
        email: form.email.trim(),
        createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        leadCapacity: form.leadCapacity,
        description: form.description.trim() || `${branchName} operational branch`,
      };
      setBranchDetails([...branchDetails, newBranch]);
      setBranchList([...branchList, branchName]);
    }
    setShowAdd(false);
    setShowEdit(null);
    setForm({
      name: '',
      location: '',
      address: '',
      manager: '',
      members: [] as string[],
      status: 'Active' as BranchStatus,
      phone: '',
      email: '',
      leadCapacity: 1000,
      description: '',
    });
    setErrors({});
  };

  const openEdit = (b: any) => {
    setForm({
      name: b.name,
      location: b.location,
      address: b.address,
      manager: b.manager,
      members: b.members,
      status: b.status,
      phone: b.phone,
      email: b.email,
      leadCapacity: b.leadCapacity,
      description: b.description,
    });
    setShowEdit(b);
    setShowAdd(true);
  };

  const toggleStatus = (b: BranchDetail) => {
    const newStatus = b.status === 'Active' ? 'Inactive' : 'Active';
    setBranchDetails(branchDetails.map((br: BranchDetail) => br.id === b.id ? { ...br, status: newStatus } : br));
  };

  return (
    <div className="flex flex-col gap-[20px] max-w-[1600px]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-[12px]">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight">Branches</h1>
          <p className="text-[14px] text-[var(--text-secondary)] mt-[2px]">Manage branch locations, managers, team members, and operational capacity.</p>
        </div>
        <button
          onClick={() => {
            setForm({ name: '', location: '', address: '', manager: '', members: [] as string[], status: 'Active' as BranchStatus, phone: '', email: '', leadCapacity: 1000, description: '' });
            setShowEdit(null);
            setShowAdd(true);
          }}
          className="h-[40px] px-[18px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold flex items-center gap-[6px]"
        >
          <Plus size={16} />Add Branch
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[16px]">
        {[
          { label: 'Total Branches', value: branchDetails.length, sub: `${branchDetails.filter((b: BranchDetail) => b.status === 'Active').length} active`, icon: Building2, bg: 'bg-[#EBF5FF]', iconColor: 'text-[#2563EB]' },
          { label: 'Total Capacity', value: branchDetails.reduce((s: number, b: BranchDetail) => s + b.leadCapacity, 0).toLocaleString(), sub: `${leads.length} leads assigned`, icon: Users, bg: 'bg-[#EFFBEA]', iconColor: 'text-[#16A34A]' },
          { label: 'Average Utilization', value: `${branchStats.length ? Math.round(branchStats.reduce((s: number, b: any) => s + b.utilization, 0) / branchStats.length) : 0}%`, sub: 'Leads vs capacity', icon: Activity, bg: 'bg-[#FEF3C7]', iconColor: 'text-[#D97706]' },
          { label: 'Team Coverage', value: `${new Set(branchDetails.flatMap((b: BranchDetail) => b.members)).size} members`, sub: `Across ${branchDetails.length} branches`, icon: Building, bg: 'bg-[#F3E8FF]', iconColor: 'text-[#9333EA]' },
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
            <Search size={16} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search branches"
              className="w-full h-[38px] pl-[36px] pr-[12px] rounded-[10px] bg-[var(--input-bg)] border border-transparent text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:bg-white focus:ring-[2px] focus:ring-[var(--primary-soft)] transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-[8px]">
            <Dropdown value={statusFilter} onChange={setStatusFilter} options={['All Statuses', 'Active', 'Inactive', 'Pending']} />
            <Dropdown value={locationFilter} onChange={setLocationFilter} options={['All Locations', 'Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan']} />
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('All Statuses');
                setLocationFilter('All Locations');
              }}
              className="h-[36px] px-[12px] rounded-[10px] bg-[var(--input-bg)] text-[13px] hover:bg-[#EAECE8] cursor-pointer whitespace-nowrap"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[14px]">
          {branchStats
            .filter((b: any) => {
              if (search && !`${b.name} ${b.location} ${b.manager}`.toLowerCase().includes(search.toLowerCase())) return false;
              if (statusFilter !== 'All Statuses' && b.status !== statusFilter) return false;
              if (locationFilter !== 'All Locations' && !b.location.includes(locationFilter)) return false;
              return true;
            })
            .map((b: any) => (
              <div
                key={b.id}
                className="border border-[var(--border)] rounded-[12px] p-[16px] flex flex-col gap-[12px] bg-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-[10px]">
                    <div className="w-[40px] h-[40px] rounded-[10px] bg-[var(--primary-soft)] flex items-center justify-center">
                      <Building2 size={18} className="text-[#3EA524]" />
                    </div>
                    <div>
                      <div className="font-semibold text-[14px]">{b.name}</div>
                      <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-[4px]">
                        <MapPin size={10} />{b.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-[6px]">
                    <StatusBadge label={b.status} />
                    <button
                      onClick={() => toggleStatus(b)}
                      className={`text-[11px] px-[8px] py-[2px] rounded-[6px] border ${b.status === 'Active' ? 'bg-white border-[var(--border)] text-[var(--text-muted)]' : 'bg-[var(--primary)] border-[var(--primary)] text-[#1B2D15]'}`}
                    >
                      {b.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
                <div className="text-[12px] text-[var(--text-secondary)] line-clamp-2">{b.description}</div>
                <div className="bg-[var(--input-bg)] rounded-[10px] p-[10px] flex flex-col gap-[8px]">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[var(--text-muted)]">Manager</span>
                    <span className="font-medium">{b.manager}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[var(--text-muted)]">Team Members</span>
                    <span className="font-medium">
                      {b.members.length} • {b.members.join(', ').slice(0, 24)}
                      {b.members.join(', ').length > 24 ? '...' : ''}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[var(--text-muted)]">Address</span>
                    <span className="font-medium text-right max-w-[160px] truncate">{b.address}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[var(--text-muted)]">Contact</span>
                    <span className="font-medium">{b.phone}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[var(--text-muted)]">Utilization</span>
                    <span className="font-medium">{b.leadsCount}/{b.leadCapacity} • {b.utilization}%</span>
                  </div>
                  <div className="h-[6px] w-full bg-[#E7EAE5] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--primary)] rounded-full" style={{ width: `${Math.min(100, b.utilization)}%` }} />
                  </div>
                  <div className="flex gap-[6px] text-[11px]">
                    <span className="px-[6px] py-[2px] rounded-[6px] bg-white border border-[var(--border)]">{b.leadsCount} leads</span>
                    <span className="px-[6px] py-[2px] rounded-[6px] bg-white border border-[var(--border)]">{b.dealsCount} deals</span>
                    <span className="px-[6px] py-[2px] rounded-[6px] bg-[#EFFBEA] text-[#2E7D32]">${b.wonValue.toLocaleString()} won</span>
                  </div>
                </div>
                <div className="flex gap-[8px]">
                  <button onClick={() => setSelectedBranch(b)} className="flex-1 h-[36px] rounded-[10px] bg-[var(--input-bg)] text-[13px] font-medium flex items-center justify-center gap-[6px]">
                    <Eye size={14} />View Details
                  </button>
                  <button onClick={() => openEdit(b)} className="flex-1 h-[36px] rounded-[10px] bg-white border border-[var(--border)] text-[13px] font-medium flex items-center justify-center gap-[6px]">
                    <Edit3 size={14} />Edit
                  </button>
                </div>
              </div>
            ))}
        </div>
        {filteredBranches.length === 0 && (
          <div className="py-[32px] text-center text-[13px] text-[var(--text-muted)]">
            No branches match your filters. Try adjusting search or add a new branch.
          </div>
        )}
      </div>

      {selectedBranch && (
        <div className="fixed inset-0 z-[60] flex justify-end bg-black/20" onClick={() => setSelectedBranch(null)}>
          <div className="w-full max-w-[520px] bg-white h-full overflow-auto border-l border-[var(--border)]" onClick={e => e.stopPropagation()}>
            <div className="p-[20px] border-b border-[var(--border)] flex justify-between items-start">
              <div className="flex gap-[12px]">
                <div className="w-[48px] h-[48px] rounded-[12px] bg-[var(--primary-soft)] flex items-center justify-center">
                  <Building2 size={20} className="text-[#3EA524]" />
                </div>
                <div>
                  <div className="font-semibold text-[16px]">{selectedBranch.name}</div>
                  <div className="text-[12px] text-[var(--text-muted)] flex items-center gap-[4px]">
                    <MapPin size={12} />{selectedBranch.location} • {selectedBranch.address}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] mt-[2px]">Manager: {selectedBranch.manager} • {selectedBranch.email}</div>
                </div>
              </div>
              <button onClick={() => setSelectedBranch(null)} className="p-[6px] bg-[var(--input-bg)] rounded-[8px]"><X size={14} /></button>
            </div>
            <div className="p-[20px] flex flex-col gap-[20px]">
              <div className="grid grid-cols-2 gap-[10px]">
                {[
                  { l: 'Leads', v: leads.filter((l: Lead) => l.branch === selectedBranch.name).length },
                  { l: 'Deals', v: deals.filter((d: Deal) => d.branch === selectedBranch.name).length },
                  { l: 'Won Value', v: `$${deals.filter((d: Deal) => d.branch === selectedBranch.name && d.stage === 'Closed Won').reduce((s: number, d: Deal) => s + d.value, 0).toLocaleString()}` },
                  { l: 'Capacity', v: `${selectedBranch.leadCapacity} • ${Math.round((leads.filter((l: Lead) => l.branch === selectedBranch.name).length / selectedBranch.leadCapacity) * 100)}% used` },
                  { l: 'Status', v: selectedBranch.status },
                  { l: 'Created', v: selectedBranch.createdAt },
                ].map((k: any) => (
                  <div key={k.l} className="bg-[var(--input-bg)] rounded-[10px] p-[10px]">
                    <div className="text-[11px] text-[var(--text-muted)]">{k.l}</div>
                    <div className="text-[13px] font-semibold">{k.v}</div>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-[12px] font-semibold mb-[8px]">Team Members • {selectedBranch.members.length}</div>
                <div className="flex flex-col gap-[8px]">
                  {selectedBranch.members.map((m: string) => {
                    const tm = teamMembers.find((t: TeamMemberDetail) => t.name === m);
                    return (
                      <div key={m} className="border border-[var(--border)] rounded-[10px] p-[10px] flex justify-between items-center">
                        <div className="flex items-center gap-[8px]">
                          <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[11px] font-semibold" style={{ background: tm?.avatarColor || '#E8F0FE' }}>
                            {m.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <div className="text-[12px] font-medium">{m}</div>
                            <div className="text-[11px] text-[var(--text-muted)]">{tm?.role} • {tm?.status}</div>
                          </div>
                        </div>
                        <StatusBadge label={tm?.status || 'Active'} />
                      </div>
                    );
                  })}
                  {selectedBranch.members.length === 0 && <div className="text-[11px] text-[var(--text-muted)]">No members assigned.</div>}
                </div>
              </div>
              <div>
                <div className="text-[12px] font-semibold mb-[8px]">Operational Details</div>
                <div className="bg-[var(--input-bg)] rounded-[10px] p-[12px] text-[12px] text-[var(--text-secondary)]">
                  {selectedBranch.description}
                  <div className="mt-[8px] text-[11px] text-[var(--text-muted)]">
                    Address: {selectedBranch.address}<br />Phone: {selectedBranch.phone}<br />Email: {selectedBranch.email}
                  </div>
                </div>
              </div>
              <div className="flex gap-[8px]">
                <button onClick={() => { openEdit(selectedBranch); setSelectedBranch(null); }} className="flex-1 h-[40px] rounded-[10px] bg-white border border-[var(--border)] text-[13px] font-medium flex items-center justify-center gap-[6px]">
                  <Edit3 size={14} />Edit Branch
                </button>
                <button onClick={() => setSelectedBranch(null)} className="flex-1 h-[40px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-[16px] bg-black/30">
          <div className="w-full max-w-[600px] bg-white rounded-[16px] border border-[var(--border)] shadow-xl overflow-auto max-h-[90vh]">
            <div className="p-[20px] border-b border-[var(--border)] flex justify-between items-center">
              <div className="font-semibold text-[15px]">{showEdit ? 'Edit Branch' : 'Add New Branch'}</div>
              <button onClick={() => { setShowAdd(false); setShowEdit(null); setErrors({}); }} className="w-[32px] h-[32px] rounded-[8px] bg-[var(--input-bg)] flex items-center justify-center">
                <X size={16} />
              </button>
            </div>
            <div className="p-[20px] grid grid-cols-2 gap-[14px]">
              <div className="col-span-2">
                <label htmlFor="branch-name" className="text-[12px] font-medium flex items-center gap-[4px]">
                  Branch Name <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="branch-name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter branch name e.g. Ibadan Branch"
                  className={`mt-[6px] w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] border text-[13px] focus:outline-none focus:border-[var(--primary)] ${errors.name ? 'border-[#FCA5A5] bg-[#FEF2F2]' : 'border-transparent'}`}
                />
                {errors.name && (
                  <div className="text-[11px] text-[#B91C1C] mt-[4px] flex items-center gap-[4px]">
                    <AlertCircle size={12} />{errors.name}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="branch-location" className="text-[12px] font-medium flex items-center gap-[4px]">
                  Location <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="branch-location"
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  placeholder="Enter location e.g. Ibadan, Nigeria"
                  className={`mt-[6px] w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] border text-[13px] focus:outline-none focus:border-[var(--primary)] ${errors.location ? 'border-[#FCA5A5] bg-[#FEF2F2]' : 'border-transparent'}`}
                />
                {errors.location && (
                  <div className="text-[11px] text-[#B91C1C] mt-[4px]">{errors.location}</div>
                )}
              </div>
              <div>
                <label className="text-[12px] font-medium flex items-center gap-[4px]">
                  Branch Manager <span className="text-[#B91C1C]">*</span>
                </label>
                <Dropdown
                  value={form.manager}
                  onChange={v => setForm({ ...form, manager: v })}
                  placeholder="Select manager"
                  options={teamMembers.map((tm: TeamMemberDetail) => tm.name)}
                  wrapperClassName="w-full mt-[6px]"
                  className={`w-full ${errors.manager ? 'border-[#FCA5A5] bg-[#FEF2F2]' : ''}`}
                />
                {errors.manager && (
                  <div className="text-[11px] text-[#B91C1C] mt-[4px]">{errors.manager}</div>
                )}
              </div>
              <div className="col-span-2">
                <label htmlFor="branch-address" className="text-[12px] font-medium flex items-center gap-[4px]">
                  Street Address <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="branch-address"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  placeholder="Enter street address e.g. 12 Adeola Odeku Street, Victoria Island"
                  className={`mt-[6px] w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] border text-[13px] focus:outline-none focus:border-[var(--primary)] ${errors.address ? 'border-[#FCA5A5] bg-[#FEF2F2]' : 'border-transparent'}`}
                />
                {errors.address && (
                  <div className="text-[11px] text-[#B91C1C] mt-[4px]">{errors.address}</div>
                )}
              </div>
              <div>
                <label htmlFor="branch-phone" className="text-[12px] font-medium flex items-center gap-[4px]">
                  Phone Number <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="branch-phone"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="Enter phone e.g. +234 1 234 5678"
                  className={`mt-[6px] w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] border text-[13px] focus:outline-none focus:border-[var(--primary)] ${errors.phone ? 'border-[#FCA5A5] bg-[#FEF2F2]' : 'border-transparent'}`}
                />
                {errors.phone && (
                  <div className="text-[11px] text-[#B91C1C] mt-[4px]">{errors.phone}</div>
                )}
              </div>
              <div>
                <label htmlFor="branch-email" className="text-[12px] font-medium flex items-center gap-[4px]">
                  Email Address <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="branch-email"
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="Enter email e.g. ibadan@leadflow.ng"
                  className={`mt-[6px] w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] border text-[13px] focus:outline-none focus:border-[var(--primary)] ${errors.email ? 'border-[#FCA5A5] bg-[#FEF2F2]' : 'border-transparent'}`}
                />
                {errors.email && (
                  <div className="text-[11px] text-[#B91C1C] mt-[4px]">{errors.email}</div>
                )}
              </div>
              <div>
                <label htmlFor="branch-capacity" className="text-[12px] font-medium flex items-center gap-[4px]">
                  Lead Capacity <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="branch-capacity"
                  type="number"
                  min={100}
                  value={form.leadCapacity}
                  onChange={e => setForm({ ...form, leadCapacity: parseInt(e.target.value) || 0 })}
                  placeholder="Enter capacity e.g. 1000"
                  className={`mt-[6px] w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] border text-[13px] focus:outline-none focus:border-[var(--primary)] ${errors.leadCapacity ? 'border-[#FCA5A5] bg-[#FEF2F2]' : 'border-transparent'}`}
                />
                {errors.leadCapacity && (
                  <div className="text-[11px] text-[#B91C1C] mt-[4px]">{errors.leadCapacity}</div>
                )}
              </div>
              <div>
                <label className="text-[12px] font-medium">Branch Status</label>
                <Dropdown
                  value={form.status}
                  onChange={v => setForm({ ...form, status: v as BranchStatus })}
                  options={['Active', 'Inactive', 'Pending']}
                  wrapperClassName="w-full mt-[6px]"
                  className="w-full"
                />
              </div>
              <div className="col-span-2">
                <label className="text-[12px] font-medium">Team Members Assigned</label>
                <div className="mt-[6px] border border-[var(--border)] rounded-[10px] p-[10px] bg-[var(--input-bg)] max-h-[120px] overflow-y-auto flex flex-col gap-[6px]">
                  {teamMembers.map((tm: TeamMemberDetail) => (
                    <label key={tm.id} className="flex items-center gap-[8px] text-[12px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.members.includes(tm.name)}
                        onChange={e => {
                          if (e.target.checked) setForm({ ...form, members: [...form.members, tm.name] });
                          else setForm({ ...form, members: form.members.filter((m: string) => m !== tm.name) });
                        }}
                        className="rounded"
                      />
                      <span>{tm.name} • {tm.role} • {tm.branch}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <label htmlFor="branch-description" className="text-[12px] font-medium">Branch Description</label>
                <textarea
                  id="branch-description"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Enter branch description e.g. South-West regional hub handling enterprise leads"
                  className="mt-[6px] w-full min-h-[80px] p-[12px] rounded-[10px] bg-[var(--input-bg)] border border-transparent text-[13px] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>
            <div className="p-[20px] border-t border-[var(--border)] bg-[var(--bg)] flex justify-end gap-[8px]">
              <button onClick={() => { setShowAdd(false); setShowEdit(null); setErrors({}); }} className="h-[40px] px-[16px] rounded-[10px] bg-white border border-[var(--border)] text-[13px]">
                Cancel
              </button>
              <button onClick={handleSave} className="h-[40px] px-[20px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold flex items-center gap-[6px]">
                <Save size={14} />{showEdit ? 'Save Changes' : 'Add Branch'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
