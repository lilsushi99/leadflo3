import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  Briefcase,
  UserRoundPlus,
  Users,
  ClipboardList,
  Activity,
  Building2,
  Search,
  Crown,
  Shield,
  Eye,
  Edit3,
  X,
  AlertCircle,
  Save,
} from 'lucide-react';
import {
  TeamMemberDetail,
  Lead,
  Deal,
  SalesTask,
  Meeting,
  TeamRole,
  TeamStatus,
} from '../../types/crm';
import { Dropdown } from '../../components/shared/Dropdown';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { avatarColors } from '../../data/mock/leads';

interface TeamAssignmentsPageProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  deals: Deal[];
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>;
  salesTasks: SalesTask[];
  meetings: Meeting[];
  activities: any[];
  teamMembers: TeamMemberDetail[];
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMemberDetail[]>>;
  branchList: string[];
}

export function TeamAssignmentsPage({
  leads,
  setLeads,
  deals,
  setDeals,
  salesTasks,
  meetings,
  activities: _activities,
  teamMembers,
  setTeamMembers,
  branchList,
}: TeamAssignmentsPageProps) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [branchFilter, setBranchFilter] = useState('All Branches');
  const [workloadFilter, setWorkloadFilter] = useState('All Workloads');
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [showAssignLead, setShowAssignLead] = useState(false);
  const [showAssignDeal, setShowAssignDeal] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showEditMember, setShowEditMember] = useState<TeamMemberDetail | null>(null);
  const [assignLeadForm, setAssignLeadForm] = useState({ leadId: '', memberName: '', reason: '' });
  const [assignDealForm, setAssignDealForm] = useState({ dealId: '', memberName: '', reason: '' });
  const [memberForm, setMemberForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'SDR' as TeamRole,
    branch: 'Lagos Branch',
    location: 'Lagos',
    status: 'Active' as TeamStatus,
    bio: '',
  });
  const [memberErrors, setMemberErrors] = useState<Record<string, string>>({});
  const [assignErrors, setAssignErrors] = useState<Record<string, string>>({});

  const memberStats = useMemo(() => {
    return teamMembers.map((tm: TeamMemberDetail) => {
      const tmLeads = leads.filter((l: Lead) => l.assignee === tm.name);
      const tmDeals = deals.filter((d: Deal) => d.owner === tm.name);
      const tmTasks = salesTasks.filter((t: SalesTask) => t.assignee === tm.name);
      const tmMeetings = meetings.filter((m: Meeting) => m.owner === tm.name);
      const workloadCount = tmLeads.length + tmDeals.length + tmTasks.filter((t: SalesTask) => t.status !== 'Completed').length;
      const workload = workloadCount > 20 ? 'High' : workloadCount > 10 ? 'Medium' : 'Low';
      return {
        ...tm,
        leadsCount: tmLeads.length,
        dealsCount: tmDeals.length,
        tasksCount: tmTasks.length,
        meetingsCount: tmMeetings.length,
        workload,
        workloadCount,
        qualifiedLeads: tmLeads.filter((l: Lead) => l.status === 'Qualified').length,
        wonDeals: tmDeals.filter((d: Deal) => d.stage === 'Closed Won').length,
        openDeals: tmDeals.filter((d: Deal) => !['Closed Won', 'Closed Lost'].includes(d.stage)).length,
      };
    });
  }, [teamMembers, leads, deals, salesTasks, meetings]);

  const filteredMembers = useMemo(() => {
    return memberStats.filter((m: any) => {
      if (search && !`${m.name} ${m.email} ${m.role}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (roleFilter !== 'All Roles' && m.role !== roleFilter) return false;
      if (statusFilter !== 'All Statuses' && m.status !== statusFilter) return false;
      if (branchFilter !== 'All Branches' && m.branch !== branchFilter) return false;
      if (workloadFilter !== 'All Workloads' && m.workload !== workloadFilter) return false;
      return true;
    });
  }, [memberStats, search, roleFilter, statusFilter, branchFilter, workloadFilter]);

  const handleAssignLead = () => {
    const err: Record<string, string> = {};
    if (!assignLeadForm.leadId) err.leadId = 'Lead is required';
    if (!assignLeadForm.memberName) err.memberName = 'Team member is required';
    setAssignErrors(err);
    if (Object.keys(err).length) return;
    const lead = leads.find((l: Lead) => l.id === assignLeadForm.leadId);
    if (!lead) return;
    setLeads(leads.map((l: Lead) => l.id === assignLeadForm.leadId ? { ...l, assignee: assignLeadForm.memberName } : l));
    setShowAssignLead(false);
    setAssignLeadForm({ leadId: '', memberName: '', reason: '' });
    setAssignErrors({});
  };

  const handleAssignDeal = () => {
    const err: Record<string, string> = {};
    if (!assignDealForm.dealId) err.dealId = 'Deal is required';
    if (!assignDealForm.memberName) err.memberName = 'Team member is required';
    setAssignErrors(err);
    if (Object.keys(err).length) return;
    setDeals(deals.map((d: Deal) => d.id === assignDealForm.dealId ? { ...d, owner: assignDealForm.memberName } : d));
    setShowAssignDeal(false);
    setAssignDealForm({ dealId: '', memberName: '', reason: '' });
    setAssignErrors({});
  };

  const handleAddMember = () => {
    const err: Record<string, string> = {};
    if (!memberForm.name.trim()) err.name = 'Full name is required';
    if (!memberForm.email.trim() || !memberForm.email.includes('@')) err.email = 'Valid email is required';
    if (!memberForm.phone.trim()) err.phone = 'Phone number is required';
    if (!memberForm.role) err.role = 'Role is required';
    if (!memberForm.branch) err.branch = 'Branch is required';
    if (!memberForm.location.trim()) err.location = 'Location is required';
    setMemberErrors(err);
    if (Object.keys(err).length) return;
    if (showEditMember) {
      setTeamMembers(teamMembers.map((tm: TeamMemberDetail) => tm.id === showEditMember.id ? { ...tm, ...memberForm } : tm));
      setShowEditMember(null);
    } else {
      const newMember: TeamMemberDetail = {
        id: `tm${Date.now()}`,
        name: memberForm.name.trim(),
        email: memberForm.email.trim(),
        phone: memberForm.phone.trim(),
        role: memberForm.role,
        status: memberForm.status,
        branch: memberForm.branch,
        location: memberForm.location.trim(),
        avatarColor: avatarColors[Math.floor(Math.random() * avatarColors.length)],
        joinedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        bio: memberForm.bio.trim() || `${memberForm.role} based in ${memberForm.branch}`,
        permissions: ['leads:read'],
      };
      setTeamMembers([...teamMembers, newMember]);
    }
    setShowAddMember(false);
    setMemberForm({
      name: '',
      email: '',
      phone: '',
      role: 'SDR' as TeamRole,
      branch: 'Lagos Branch',
      location: 'Lagos',
      status: 'Active' as TeamStatus,
      bio: '',
    });
    setMemberErrors({});
  };

  const openEdit = (tm: any) => {
    setMemberForm({
      name: tm.name,
      email: tm.email,
      phone: tm.phone,
      role: tm.role,
      branch: tm.branch,
      location: tm.location,
      status: tm.status,
      bio: tm.bio || '',
    });
    setShowEditMember(tm);
    setShowAddMember(true);
  };

  return (
    <div className="flex flex-col gap-[20px] max-w-[1600px]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-[12px]">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight">Team & Assignments</h1>
          <p className="text-[14px] text-[var(--text-secondary)] mt-[2px]">Manage team members, workload, and lead/deal assignments.</p>
        </div>
        <div className="flex gap-[8px]">
          <button onClick={() => setShowAssignLead(true)} className="h-[40px] px-[14px] rounded-[10px] bg-white border border-[var(--border)] text-[13px] font-medium flex items-center gap-[6px]">
            <UserCheck size={16} />Assign Lead
          </button>
          <button onClick={() => setShowAssignDeal(true)} className="h-[40px] px-[14px] rounded-[10px] bg-white border border-[var(--border)] text-[13px] font-medium flex items-center gap-[6px]">
            <Briefcase size={16} />Assign Deal
          </button>
          <button
            onClick={() => {
              setMemberForm({ name: '', email: '', phone: '', role: 'SDR' as TeamRole, branch: 'Lagos Branch', location: 'Lagos', status: 'Active' as TeamStatus, bio: '' });
              setShowAddMember(true);
              setShowEditMember(null);
            }}
            className="h-[40px] px-[18px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold flex items-center gap-[6px]"
          >
            <UserRoundPlus size={16} />Add Member
          </button>
        </div>
      </div>

      {/* KPI Cards: Borderless, Soft Shadows, Coordinated Icons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[16px]">
        {[
          { label: 'Total Members', value: teamMembers.length, sub: `${teamMembers.filter((m: TeamMemberDetail) => m.status === 'Active').length} active`, icon: Users, bg: 'bg-[#EBF5FF]', iconColor: 'text-[#2563EB]' },
          { label: 'Total Assignments', value: leads.length + deals.length, sub: `${leads.length} leads • ${deals.length} deals`, icon: ClipboardList, bg: 'bg-[#EFFBEA]', iconColor: 'text-[#16A34A]' },
          { label: 'Workload', value: memberStats.filter((m: any) => m.workload === 'High').length, sub: `${memberStats.filter((m: any) => m.workload === 'Medium').length} medium • ${memberStats.filter((m: any) => m.workload === 'Low').length} low`, icon: Activity, bg: 'bg-[#FEF3C7]', iconColor: 'text-[#D97706]' },
          { label: 'Branches Covered', value: new Set(teamMembers.map((m: TeamMemberDetail) => m.branch)).size, sub: `${branchList.length - 1} total branches`, icon: Building2, bg: 'bg-[#F3E8FF]', iconColor: 'text-[#9333EA]' },
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
              placeholder="Search team members"
              className="w-full h-[38px] pl-[36px] pr-[12px] rounded-[10px] bg-[var(--input-bg)] border border-transparent text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:bg-white focus:ring-[2px] focus:ring-[var(--primary-soft)] transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-[8px]">
            <Dropdown value={roleFilter} onChange={setRoleFilter} options={['All Roles', 'Admin', 'Sales Manager', 'SDR', 'Account Executive', 'Support Specialist', 'Marketing Specialist']} />
            <Dropdown value={statusFilter} onChange={setStatusFilter} options={['All Statuses', 'Active', 'Away', 'Offline', 'On Leave']} />
            <Dropdown value={branchFilter} onChange={setBranchFilter} options={branchList} />
            <Dropdown value={workloadFilter} onChange={setWorkloadFilter} options={['All Workloads', 'High', 'Medium', 'Low']} />
            <button
              onClick={() => {
                setSearch('');
                setRoleFilter('All Roles');
                setStatusFilter('All Statuses');
                setBranchFilter('All Branches');
                setWorkloadFilter('All Workloads');
              }}
              className="h-[36px] px-[12px] rounded-[10px] bg-[var(--input-bg)] text-[13px] hover:bg-[#EAECE8] cursor-pointer transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="text-[11px] text-[var(--text-muted)] border-b border-[var(--border)] bg-[#FBFDFB]">
              <tr>
                <th className="text-left p-[10px]">Member</th>
                <th className="text-left">Role</th>
                <th className="text-left">Status</th>
                <th className="text-left">Branch</th>
                <th className="text-left">Leads</th>
                <th className="text-left">Deals</th>
                <th className="text-left">Workload</th>
                <th className="text-left">Qualified / Won</th>
                <th className="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((m: any) => (
                <tr key={m.id} className="border-b border-[#F3F5F2] hover:bg-[#FBFBF9] text-[12px]">
                  <td className="p-[10px]">
                    <div className="flex items-center gap-[10px]">
                      <div className="w-[36px] h-[36px] rounded-full flex items-center justify-center text-[12px] font-semibold" style={{ background: m.avatarColor }}>
                        {m.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-medium text-[13px] flex items-center gap-[6px]">
                          {m.name} {m.role === 'Admin' && <Crown size={12} className="text-[#B45309]" />}
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)]">{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="flex items-center gap-[6px]">
                      <StatusBadge label={m.role} />
                    </span>
                  </td>
                  <td>
                    <StatusBadge label={m.status} />
                  </td>
                  <td className="text-[11px]">
                    {m.branch}
                    <div className="text-[10px] text-[var(--text-muted)]">{m.location}</div>
                  </td>
                  <td>
                    <span className="font-medium">{m.leadsCount}</span>
                    <span className="text-[11px] text-[var(--text-muted)]"> • {m.qualifiedLeads} qual</span>
                  </td>
                  <td>
                    <span className="font-medium">{m.dealsCount}</span>
                    <span className="text-[11px] text-[var(--text-muted)]"> • {m.wonDeals} won</span>
                  </td>
                  <td>
                    <span className={`px-[8px] py-[2px] rounded-[6px] text-[11px] font-medium ${m.workload === 'High' ? 'bg-[#FEECEC] text-[#B91C1C]' : m.workload === 'Medium' ? 'bg-[#FFF4E5] text-[#B45309]' : 'bg-[#EFFBEA] text-[#166534]'}`}>
                      {m.workload} • {m.workloadCount}
                    </span>
                  </td>
                  <td className="text-[11px]">{m.qualifiedLeads} qual / {m.wonDeals} won</td>
                  <td>
                    <div className="flex gap-[6px]">
                      <button onClick={() => setSelectedMember(m)} className="h-[28px] px-[10px] rounded-[8px] bg-[var(--input-bg)] text-[11px] flex items-center gap-[4px]">
                        <Eye size={12} />View
                      </button>
                      <button onClick={() => openEdit(m)} className="h-[28px] px-[10px] rounded-[8px] bg-white border border-[var(--border)] text-[11px] flex items-center gap-[4px]">
                        <Edit3 size={12} />Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredMembers.length === 0 && (
          <div className="py-[24px] text-center text-[13px] text-[var(--text-muted)]">
            No team members match your filters. Adjust search or add a new member.
          </div>
        )}
      </div>

      {selectedMember && (
        <div className="fixed inset-0 z-[60] flex justify-end bg-black/20" onClick={() => setSelectedMember(null)}>
          <div className="w-full max-w-[520px] bg-white h-full overflow-auto border-l border-[var(--border)]" onClick={e => e.stopPropagation()}>
            <div className="p-[20px] border-b border-[var(--border)] flex justify-between items-start">
              <div className="flex gap-[12px]">
                <div className="w-[48px] h-[48px] rounded-full flex items-center justify-center text-[14px] font-semibold" style={{ background: selectedMember.avatarColor }}>
                  {selectedMember.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div className="font-semibold text-[16px] flex items-center gap-[6px]">
                    {selectedMember.name} {selectedMember.role === 'Admin' && <Shield size={14} className="text-[#2E7D32]" />}
                  </div>
                  <div className="text-[12px] text-[var(--text-muted)]">{selectedMember.role} • {selectedMember.branch}</div>
                  <div className="text-[11px] text-[var(--text-muted)]">{selectedMember.email} • {selectedMember.phone}</div>
                </div>
              </div>
              <button onClick={() => setSelectedMember(null)} className="p-[6px] bg-[var(--input-bg)] rounded-[8px]"><X size={14} /></button>
            </div>
            <div className="p-[20px] flex flex-col gap-[20px]">
              <div>
                <div className="text-[12px] font-semibold mb-[8px]">Workload Overview</div>
                <div className="grid grid-cols-3 gap-[8px]">
                  {[
                    { l: 'Leads', v: selectedMember.leadsCount },
                    { l: 'Deals', v: selectedMember.dealsCount },
                    { l: 'Workload', v: `${selectedMember.workload} (${selectedMember.workloadCount})` },
                    { l: 'Qualified', v: selectedMember.qualifiedLeads },
                    { l: 'Won Deals', v: selectedMember.wonDeals },
                    { l: 'Open Deals', v: selectedMember.openDeals },
                  ].map((k: any) => (
                    <div key={k.l} className="bg-[var(--input-bg)] rounded-[10px] p-[10px]">
                      <div className="text-[11px] text-[var(--text-muted)]">{k.l}</div>
                      <div className="text-[13px] font-semibold">{k.v}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[12px] font-semibold mb-[8px]">Assigned Leads • {leads.filter((l: Lead) => l.assignee === selectedMember.name).length}</div>
                <div className="flex flex-col gap-[6px] max-h-[220px] overflow-y-auto">
                  {leads.filter((l: Lead) => l.assignee === selectedMember.name).slice(0, 10).map((l: Lead) => (
                    <div key={l.id} className="border border-[var(--border)] rounded-[8px] p-[8px] flex justify-between">
                      <div>
                        <div className="text-[12px] font-medium">{l.firstName} {l.lastName} • {l.company}</div>
                        <div className="text-[11px] text-[var(--text-muted)]">{l.status} • {l.branch}</div>
                      </div>
                      <StatusBadge label={l.status} />
                    </div>
                  ))}
                  {leads.filter((l: Lead) => l.assignee === selectedMember.name).length === 0 && <div className="text-[11px] text-[var(--text-muted)]">No leads assigned.</div>}
                </div>
              </div>
              <div>
                <div className="text-[12px] font-semibold mb-[8px]">Assigned Deals • {deals.filter((d: Deal) => d.owner === selectedMember.name).length}</div>
                <div className="flex flex-col gap-[6px] max-h-[220px] overflow-y-auto">
                  {deals.filter((d: Deal) => d.owner === selectedMember.name).slice(0, 10).map((d: Deal) => (
                    <div key={d.id} className="border border-[var(--border)] rounded-[8px] p-[8px] flex justify-between">
                      <div>
                        <div className="text-[12px] font-medium">{d.name}</div>
                        <div className="text-[11px] text-[var(--text-muted)]">{d.stage} • ${d.value.toLocaleString()}</div>
                      </div>
                      <StatusBadge label={d.stage} />
                    </div>
                  ))}
                  {deals.filter((d: Deal) => d.owner === selectedMember.name).length === 0 && <div className="text-[11px] text-[var(--text-muted)]">No deals assigned.</div>}
                </div>
              </div>
              <div>
                <div className="text-[12px] font-semibold mb-[8px]">Bio</div>
                <div className="text-[12px] text-[var(--text-secondary)] bg-[var(--input-bg)] rounded-[10px] p-[10px]">{selectedMember.bio}</div>
              </div>
              <div className="flex gap-[8px]">
                <button onClick={() => { openEdit(selectedMember); setSelectedMember(null); }} className="flex-1 h-[40px] rounded-[10px] bg-white border border-[var(--border)] text-[13px] font-medium flex items-center justify-center gap-[6px]">
                  <Edit3 size={14} />Edit Member
                </button>
                <button onClick={() => setSelectedMember(null)} className="flex-1 h-[40px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAssignLead && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-[16px] bg-black/30">
          <div className="w-full max-w-[520px] bg-white rounded-[16px] border border-[var(--border)] shadow-xl overflow-hidden">
            <div className="p-[20px] border-b border-[var(--border)] flex justify-between items-center">
              <div className="font-semibold text-[15px]">Assign Lead to Team Member</div>
              <button onClick={() => { setShowAssignLead(false); setAssignErrors({}); }} className="w-[32px] h-[32px] rounded-[8px] bg-[var(--input-bg)] flex items-center justify-center">
                <X size={16} />
              </button>
            </div>
            <div className="p-[20px] flex flex-col gap-[16px]">
              <div>
                <label className="text-[12px] font-medium flex items-center gap-[4px]">
                  Select Lead <span className="text-[#B91C1C]">*</span>
                </label>
                <Dropdown
                  value={
                    leads.find((l: Lead) => l.id === assignLeadForm.leadId)
                      ? `${leads.find((l: Lead) => l.id === assignLeadForm.leadId)?.firstName} ${leads.find((l: Lead) => l.id === assignLeadForm.leadId)?.lastName} • ${leads.find((l: Lead) => l.id === assignLeadForm.leadId)?.company}`
                      : ''
                  }
                  placeholder="Choose a lead to assign"
                  options={leads.map((l: Lead) => `${l.firstName} ${l.lastName} • ${l.company}`)}
                  onChange={(v: string) => {
                    const found = leads.find((l: Lead) => `${l.firstName} ${l.lastName} • ${l.company}` === v);
                    if (found) setAssignLeadForm({ ...assignLeadForm, leadId: found.id });
                  }}
                  wrapperClassName="w-full mt-[6px]"
                  className={`w-full ${assignErrors.leadId ? 'border-[#FCA5A5] bg-[#FEF2F2]' : ''}`}
                />
                {assignErrors.leadId && (
                  <div className="text-[11px] text-[#B91C1C] mt-[4px] flex items-center gap-[4px]">
                    <AlertCircle size={12} />{assignErrors.leadId}
                  </div>
                )}
              </div>
              <div>
                <label className="text-[12px] font-medium flex items-center gap-[4px]">
                  Assign to Team Member <span className="text-[#B91C1C]">*</span>
                </label>
                <Dropdown
                  value={assignLeadForm.memberName}
                  placeholder="Select team member"
                  options={teamMembers.map((tm: TeamMemberDetail) => tm.name)}
                  onChange={(v: string) => setAssignLeadForm({ ...assignLeadForm, memberName: v })}
                  wrapperClassName="w-full mt-[6px]"
                  className={`w-full ${assignErrors.memberName ? 'border-[#FCA5A5] bg-[#FEF2F2]' : ''}`}
                />
                {assignErrors.memberName && (
                  <div className="text-[11px] text-[#B91C1C] mt-[4px] flex items-center gap-[4px]">
                    <AlertCircle size={12} />{assignErrors.memberName}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="assign-lead-reason" className="text-[12px] font-medium">Reason for assignment</label>
                <textarea
                  id="assign-lead-reason"
                  value={assignLeadForm.reason}
                  onChange={e => setAssignLeadForm({ ...assignLeadForm, reason: e.target.value })}
                  placeholder="Enter reason for reassignment (optional) e.g. workload balancing, expertise match"
                  className="mt-[6px] w-full min-h-[80px] p-[12px] rounded-[10px] bg-[var(--input-bg)] border border-[var(--border)] text-[13px] text-[var(--text-primary)] focus:outline-none focus:border-[#76E05B] focus:ring-[2px] focus:ring-[#EFFBEA]"
                />
              </div>
            </div>
            <div className="p-[20px] border-t border-[var(--border)] bg-[var(--bg)] flex justify-end gap-[8px]">
              <button onClick={() => { setShowAssignLead(false); setAssignErrors({}); }} className="h-[40px] px-[16px] rounded-[10px] bg-white border border-[var(--border)] text-[13px]">
                Cancel
              </button>
              <button onClick={handleAssignLead} className="h-[40px] px-[20px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold flex items-center gap-[6px]">
                <Save size={14} />Assign Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {showAssignDeal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-[16px] bg-black/30">
          <div className="w-full max-w-[520px] bg-white rounded-[16px] border border-[var(--border)] shadow-xl overflow-hidden">
            <div className="p-[20px] border-b border-[var(--border)] flex justify-between items-center">
              <div className="font-semibold text-[15px]">Assign Deal to Team Member</div>
              <button onClick={() => { setShowAssignDeal(false); setAssignErrors({}); }} className="w-[32px] h-[32px] rounded-[8px] bg-[var(--input-bg)] flex items-center justify-center">
                <X size={16} />
              </button>
            </div>
            <div className="p-[20px] flex flex-col gap-[16px]">
              <div>
                <label className="text-[12px] font-medium flex items-center gap-[4px]">
                  Select Deal <span className="text-[#B91C1C]">*</span>
                </label>
                <Dropdown
                  value={deals.find((d: Deal) => d.id === assignDealForm.dealId)?.name || ''}
                  placeholder="Choose a deal to assign"
                  options={deals.map((d: Deal) => d.name)}
                  onChange={(v: string) => {
                    const found = deals.find((d: Deal) => d.name === v);
                    if (found) setAssignDealForm({ ...assignDealForm, dealId: found.id });
                  }}
                  wrapperClassName="w-full mt-[6px]"
                  className={`w-full ${assignErrors.dealId ? 'border-[#FCA5A5] bg-[#FEF2F2]' : ''}`}
                />
                {assignErrors.dealId && (
                  <div className="text-[11px] text-[#B91C1C] mt-[4px] flex items-center gap-[4px]">
                    <AlertCircle size={12} />{assignErrors.dealId}
                  </div>
                )}
              </div>
              <div>
                <label className="text-[12px] font-medium flex items-center gap-[4px]">
                  Assign to Team Member <span className="text-[#B91C1C]">*</span>
                </label>
                <Dropdown
                  value={assignDealForm.memberName}
                  placeholder="Select team member"
                  options={teamMembers.map((tm: TeamMemberDetail) => tm.name)}
                  onChange={(v: string) => setAssignDealForm({ ...assignDealForm, memberName: v })}
                  wrapperClassName="w-full mt-[6px]"
                  className={`w-full ${assignErrors.memberName ? 'border-[#FCA5A5] bg-[#FEF2F2]' : ''}`}
                />
                {assignErrors.memberName && (
                  <div className="text-[11px] text-[#B91C1C] mt-[4px] flex items-center gap-[4px]">
                    <AlertCircle size={12} />{assignErrors.memberName}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="assign-deal-reason" className="text-[12px] font-medium">Reason for assignment</label>
                <textarea
                  id="assign-deal-reason"
                  value={assignDealForm.reason}
                  onChange={e => setAssignDealForm({ ...assignDealForm, reason: e.target.value })}
                  placeholder="Enter reason for reassignment (optional) e.g. account ownership change"
                  className="mt-[6px] w-full min-h-[80px] p-[12px] rounded-[10px] bg-[var(--input-bg)] border border-transparent text-[13px] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>
            <div className="p-[20px] border-t border-[var(--border)] bg-[var(--bg)] flex justify-end gap-[8px]">
              <button onClick={() => { setShowAssignDeal(false); setAssignErrors({}); }} className="h-[40px] px-[16px] rounded-[10px] bg-white border border-[var(--border)] text-[13px]">
                Cancel
              </button>
              <button onClick={handleAssignDeal} className="h-[40px] px-[20px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold flex items-center gap-[6px]">
                <Save size={14} />Assign Deal
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddMember && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-[16px] bg-black/30">
          <div className="w-full max-w-[560px] bg-white rounded-[16px] border border-[var(--border)] shadow-xl overflow-auto max-h-[90vh]">
            <div className="p-[20px] border-b border-[var(--border)] flex justify-between items-center">
              <div className="font-semibold text-[15px]">{showEditMember ? 'Edit Team Member' : 'Add New Team Member'}</div>
              <button onClick={() => { setShowAddMember(false); setShowEditMember(null); setMemberErrors({}); }} className="w-[32px] h-[32px] rounded-[8px] bg-[var(--input-bg)] flex items-center justify-center">
                <X size={16} />
              </button>
            </div>
            <div className="p-[20px] grid grid-cols-2 gap-[14px]">
              <div className="col-span-2">
                <label htmlFor="member-name" className="text-[12px] font-medium flex items-center gap-[4px]">
                  Full Name <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="member-name"
                  value={memberForm.name}
                  onChange={e => setMemberForm({ ...memberForm, name: e.target.value })}
                  placeholder="Enter full name e.g. Sarah Okafor"
                  className={`mt-[6px] w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] border text-[13px] focus:outline-none focus:border-[var(--primary)] ${memberErrors.name ? 'border-[#FCA5A5] bg-[#FEF2F2]' : 'border-transparent'}`}
                />
                {memberErrors.name && <div className="text-[11px] text-[#B91C1C] mt-[4px]">{memberErrors.name}</div>}
              </div>
              <div>
                <label htmlFor="member-email" className="text-[12px] font-medium flex items-center gap-[4px]">
                  Email Address <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="member-email"
                  type="email"
                  value={memberForm.email}
                  onChange={e => setMemberForm({ ...memberForm, email: e.target.value })}
                  placeholder="Enter email address e.g. sarah@leadflow.ng"
                  className={`mt-[6px] w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] border text-[13px] focus:outline-none focus:border-[var(--primary)] ${memberErrors.email ? 'border-[#FCA5A5] bg-[#FEF2F2]' : 'border-transparent'}`}
                />
                {memberErrors.email && <div className="text-[11px] text-[#B91C1C] mt-[4px]">{memberErrors.email}</div>}
              </div>
              <div>
                <label htmlFor="member-phone" className="text-[12px] font-medium flex items-center gap-[4px]">
                  Phone Number <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="member-phone"
                  value={memberForm.phone}
                  onChange={e => setMemberForm({ ...memberForm, phone: e.target.value })}
                  placeholder="Enter phone e.g. +234 803 100 1002"
                  className={`mt-[6px] w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] border text-[13px] focus:outline-none focus:border-[var(--primary)] ${memberErrors.phone ? 'border-[#FCA5A5] bg-[#FEF2F2]' : 'border-transparent'}`}
                />
                {memberErrors.phone && <div className="text-[11px] text-[#B91C1C] mt-[4px]">{memberErrors.phone}</div>}
              </div>
              <div>
                <label className="text-[12px] font-medium flex items-center gap-[4px]">
                  Role <span className="text-[#B91C1C]">*</span>
                </label>
                <Dropdown
                  value={memberForm.role}
                  onChange={v => setMemberForm({ ...memberForm, role: v as TeamRole })}
                  options={['Admin', 'Sales Manager', 'SDR', 'Account Executive', 'Support Specialist', 'Marketing Specialist']}
                  wrapperClassName="w-full mt-[6px]"
                  className={`w-full ${memberErrors.role ? 'border-[#FCA5A5] bg-[#FEF2F2]' : ''}`}
                />
                {memberErrors.role && <div className="text-[11px] text-[#B91C1C] mt-[4px]">{memberErrors.role}</div>}
              </div>
              <div>
                <label className="text-[12px] font-medium flex items-center gap-[4px]">
                  Branch <span className="text-[#B91C1C]">*</span>
                </label>
                <Dropdown
                  value={memberForm.branch}
                  onChange={v => setMemberForm({ ...memberForm, branch: v })}
                  options={['Lagos Branch', 'Abuja Branch', 'Port Harcourt Branch', 'Kano Branch']}
                  wrapperClassName="w-full mt-[6px]"
                  className={`w-full ${memberErrors.branch ? 'border-[#FCA5A5] bg-[#FEF2F2]' : ''}`}
                />
                {memberErrors.branch && <div className="text-[11px] text-[#B91C1C] mt-[4px]">{memberErrors.branch}</div>}
              </div>
              <div>
                <label htmlFor="member-location" className="text-[12px] font-medium flex items-center gap-[4px]">
                  Location <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="member-location"
                  value={memberForm.location}
                  onChange={e => setMemberForm({ ...memberForm, location: e.target.value })}
                  placeholder="Enter location e.g. Lagos"
                  className={`mt-[6px] w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] border text-[13px] focus:outline-none focus:border-[var(--primary)] ${memberErrors.location ? 'border-[#FCA5A5] bg-[#FEF2F2]' : 'border-transparent'}`}
                />
                {memberErrors.location && <div className="text-[11px] text-[#B91C1C] mt-[4px]">{memberErrors.location}</div>}
              </div>
              <div>
                <label className="text-[12px] font-medium">Status</label>
                <Dropdown
                  value={memberForm.status}
                  onChange={v => setMemberForm({ ...memberForm, status: v as TeamStatus })}
                  options={['Active', 'Away', 'Offline', 'On Leave']}
                  wrapperClassName="w-full mt-[6px]"
                  className="w-full"
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="member-bio" className="text-[12px] font-medium">Bio / Notes</label>
                <textarea
                  id="member-bio"
                  value={memberForm.bio}
                  onChange={e => setMemberForm({ ...memberForm, bio: e.target.value })}
                  placeholder="Enter short bio or responsibilities e.g. Manages enterprise accounts in Lagos region"
                  className="mt-[6px] w-full min-h-[80px] p-[12px] rounded-[10px] bg-[var(--input-bg)] border border-transparent text-[13px] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>
            <div className="p-[20px] border-t border-[var(--border)] bg-[var(--bg)] flex justify-end gap-[8px]">
              <button onClick={() => { setShowAddMember(false); setShowEditMember(null); setMemberErrors({}); }} className="h-[40px] px-[16px] rounded-[10px] bg-white border border-[var(--border)] text-[13px]">
                Cancel
              </button>
              <button onClick={handleAddMember} className="h-[40px] px-[20px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold flex items-center gap-[6px]">
                <Save size={14} />{showEditMember ? 'Save Changes' : 'Add Member'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
