import React, { useState, useMemo } from 'react';
import { Phone, Plus, Search, Video, Calendar, Trash2, X } from 'lucide-react';
import { Meeting, MeetingType, MeetingStatus, SalesTask, Lead, Deal } from '../../types/crm';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { Dropdown } from '../../components/shared/Dropdown';
import { users } from '../../data/mock/leads';

interface MeetingsCallsPageProps {
  meetings: Meeting[];
  setMeetings: React.Dispatch<React.SetStateAction<Meeting[]>>;
  salesTasks: SalesTask[];
  setSalesTasks: React.Dispatch<React.SetStateAction<SalesTask[]>>;
  leads: Lead[];
  deals: Deal[];
}

export function MeetingsCallsPage({
  meetings,
  setMeetings,
  salesTasks,
  setSalesTasks,
  leads,
  deals,
}: MeetingsCallsPageProps) {
  const [filter, setFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showMeeting, setShowMeeting] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [meetingError, setMeetingError] = useState('');

  const [newMeeting, setNewMeeting] = useState({
    title: '',
    leadName: leads[0] ? `${leads[0].firstName} ${leads[0].lastName}` : '',
    dealName: '',
    type: 'video' as MeetingType,
    startAt: '2024-02-15T10:00',
    endAt: '2024-02-15T10:45',
    owner: users[0],
    location: '',
    status: 'Scheduled' as MeetingStatus,
  });

  const [newCall, setNewCall] = useState({
    leadName: leads[0] ? `${leads[0].firstName} ${leads[0].lastName}` : '',
    dealName: '',
    outcome: 'Connected',
    notes: '',
    followUp: false,
  });

  const filtered = useMemo(
    () =>
      meetings.filter((m: Meeting) => {
        if (filter === 'Today' && !m.dateLabel.includes('Today')) return false;
        if (filter === 'Upcoming' && m.status !== 'Scheduled') return false;
        if (filter === 'Past' && m.status !== 'Completed' && m.status !== 'Cancelled')
          return false;
        if (typeFilter !== 'All' && m.type !== typeFilter) return false;
        if (
          search &&
          !`${m.title} ${m.leadName} ${m.company}`.toLowerCase().includes(search.toLowerCase())
        )
          return false;
        return true;
      }),
    [meetings, filter, typeFilter, search]
  );

  const handleAddMeeting = () => {
    if (!newMeeting.title) {
      setMeetingError('Title is required');
      return;
    }
    if (newMeeting.startAt >= newMeeting.endAt) {
      setMeetingError('End time must be after start time');
      return;
    }
    setMeetingError('');
    const lead = leads.find((l: Lead) => `${l.firstName} ${l.lastName}` === newMeeting.leadName);
    const deal = deals.find((d: Deal) => d.name === newMeeting.dealName);
    const meeting: Meeting = {
      id: `m${Date.now()}`,
      type: newMeeting.type,
      title: newMeeting.title,
      leadId: lead?.id || 'lead-1',
      leadName: newMeeting.leadName,
      dealId: deal?.id,
      dealName: deal?.name,
      company: lead?.company || '',
      owner: newMeeting.owner,
      startAt: newMeeting.startAt,
      endAt: newMeeting.endAt,
      dateLabel: new Date(newMeeting.startAt).toLocaleString(),
      status: newMeeting.status,
      location: newMeeting.location,
      duration: '45m',
    };
    setMeetings([meeting, ...meetings]);
    setShowMeeting(false);
  };

  const handleLogCall = () => {
    const lead = leads.find((l: Lead) => `${l.firstName} ${l.lastName}` === newCall.leadName);
    const deal = deals.find((d: Deal) => d.name === newCall.dealName);
    const call: Meeting = {
      id: `m${Date.now()}`,
      type: 'Call',
      title: `Call - ${newCall.leadName}`,
      leadId: lead?.id || 'lead-1',
      leadName: newCall.leadName,
      dealId: deal?.id,
      dealName: deal?.name,
      company: lead?.company || '',
      owner: 'Dominion Castiel',
      startAt: new Date().toISOString(),
      endAt: new Date().toISOString(),
      dateLabel: 'Now',
      status: 'Completed',
      outcome: newCall.outcome,
      notes: newCall.notes,
      duration: '12m',
    };
    setMeetings([call, ...meetings]);
    if (newCall.followUp) {
      const task: SalesTask = {
        id: `st${Date.now()}`,
        title: `Follow-up after call with ${newCall.leadName}`,
        leadId: lead?.id,
        dealId: deal?.id,
        leadName: newCall.leadName,
        dealName: newCall.dealName,
        company: lead?.company || '',
        type: 'Follow-up',
        dueAt: new Date().toISOString().split('T')[0],
        dueLabel: 'Upcoming',
        priority: 'Medium',
        status: 'Todo',
        assignee: 'Dominion Castiel',
        branch: 'Lagos Branch',
        notes: newCall.notes,
      };
      setSalesTasks([task, ...salesTasks]);
    }
    setShowCall(false);
    setNewCall({
      leadName: leads[0] ? `${leads[0].firstName} ${leads[0].lastName}` : '',
      dealName: '',
      outcome: 'Connected',
      notes: '',
      followUp: false,
    });
  };

  return (
    <div className="flex flex-col gap-[18px] max-w-[1440px]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-[12px]">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight">Meetings & Calls</h1>
          <p className="text-[14px] text-[var(--text-secondary)] mt-[2px]">
            Plan conversations and keep a clear record of customer interactions.
          </p>
        </div>
        <div className="flex gap-[8px]">
          <button
            onClick={() => setShowCall(true)}
            className="h-[40px] px-[16px] rounded-[10px] bg-white border border-[var(--border)] text-[13px] font-medium flex items-center gap-[6px] hover:bg-[var(--input-bg)] cursor-pointer"
          >
            <Phone size={14} />
            Log Call
          </button>
          <button
            onClick={() => {
              setMeetingError('');
              setShowMeeting(true);
            }}
            className="h-[40px] px-[16px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold flex items-center gap-[6px] text-[#1B4D0F] hover:bg-[var(--primary-hover)] cursor-pointer"
          >
            <Plus size={14} />
            Schedule Meeting
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[14px] p-[14px] flex flex-col lg:flex-row gap-[10px] justify-between shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="relative w-full lg:max-w-[280px]">
          <Search size={16} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search meetings, leads..."
            className="w-full h-[38px] pl-[36px] pr-[12px] rounded-[10px] bg-[var(--input-bg)] border border-transparent text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:bg-white focus:ring-[2px] focus:ring-[var(--primary-soft)] transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-[8px]">
          {['All', 'Today', 'Upcoming', 'Past'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`h-[32px] px-[12px] rounded-[10px] text-[12px] border cursor-pointer transition-colors ${
                filter === f
                  ? 'bg-[var(--text-primary)] text-white border-[var(--text-primary)]'
                  : 'bg-white border-[var(--border)]'
              }`}
            >
              {f}
            </button>
          ))}
          <Dropdown
            value={typeFilter}
            onChange={setTypeFilter}
            options={['All', 'video', 'phone', 'in-person', 'Call']}
          />
          <button
            onClick={() => {
              setSearch('');
              setFilter('All');
              setTypeFilter('All');
            }}
            className="h-[32px] px-[12px] rounded-[10px] bg-[var(--input-bg)] text-[12px] cursor-pointer hover:bg-[#EAECE8]"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[14px] p-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col gap-[10px]">
          {filtered.map((m: Meeting) => (
            <div
              key={m.id}
              className="border border-[var(--border)] rounded-[12px] p-[12px] flex flex-col lg:flex-row lg:items-center justify-between gap-[8px]"
            >
              <div className="flex items-start gap-[10px]">
                <div
                  className={`w-[36px] h-[36px] rounded-[10px] flex items-center justify-center ${
                    m.type === 'video'
                      ? 'bg-[#F3E8FF] text-[#7C3AED]'
                      : m.type === 'phone' || m.type === 'Call'
                      ? 'bg-[#E8F0FE] text-[#1A56DB]'
                      : 'bg-[#EFFBEA] text-[#166534]'
                  }`}
                >
                  {m.type === 'video' ? (
                    <Video size={16} />
                  ) : m.type === 'phone' || m.type === 'Call' ? (
                    <Phone size={16} />
                  ) : (
                    <Calendar size={16} />
                  )}
                </div>
                <div>
                  <div className="font-medium text-[13px]">{m.title}</div>
                  <div className="text-[11px] text-[var(--text-secondary)]">
                    {m.leadName} • {m.company} {m.dealName ? `• ${m.dealName}` : ''}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] mt-[2px]">
                    {m.dateLabel} • {m.duration} {m.location ? `• ${m.location}` : ''}{' '}
                    {m.meetingLink ? `• ${m.meetingLink}` : ''}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-[8px]">
                <StatusBadge label={m.type} />
                <StatusBadge label={m.status} />
                {m.outcome && <StatusBadge label={m.outcome} />}
                <button
                  onClick={() => setMeetings(meetings.filter((x: Meeting) => x.id !== m.id))}
                  className="h-[28px] w-[28px] rounded-[8px] bg-[var(--input-bg)] flex items-center justify-center cursor-pointer"
                  aria-label="Delete meeting"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-[24px] text-center text-[12px] text-[var(--text-muted)]">
              No meetings in this view.
            </div>
          )}
        </div>
      </div>

      {showMeeting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 p-[16px]">
          <div className="w-full max-w-[520px] bg-white rounded-[16px] p-[20px] border border-[var(--border)] max-h-[90vh] overflow-auto">
            <div className="flex justify-between mb-[12px]">
              <div className="font-semibold text-[15px]">Schedule Meeting</div>
              <button onClick={() => setShowMeeting(false)} className="p-[6px] rounded-[8px] bg-[var(--input-bg)] hover:bg-[#EAECE8] cursor-pointer">
                <X size={16} />
              </button>
            </div>
            {meetingError && (
              <div className="mb-[12px] p-[10px] rounded-[8px] bg-[#FEECEC] border border-[#FCA5A5] text-[#991B1B] text-[12px]">
                {meetingError}
              </div>
            )}
            <div className="flex flex-col gap-[12px]">
              <div>
                <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">Meeting Title *</label>
                <input
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  placeholder="e.g. Discovery & Needs Assessment"
                  className="w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] text-[13px] text-[var(--text-primary)] border border-transparent focus:outline-none focus:border-[var(--primary)] focus:bg-white focus:ring-[2px] focus:ring-[var(--primary-soft)] transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-[10px]">
                <div>
                  <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">Lead</label>
                  <Dropdown
                    value={newMeeting.leadName}
                    onChange={(v: string) => setNewMeeting({ ...newMeeting, leadName: v })}
                    options={leads.map((l: Lead) => `${l.firstName} ${l.lastName}`)}
                  />
                </div>
                <div>
                  <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">Deal</label>
                  <Dropdown
                    value={newMeeting.dealName}
                    onChange={(v: string) => setNewMeeting({ ...newMeeting, dealName: v })}
                    options={['', ...deals.map((d: Deal) => d.name)]}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-[10px]">
                <div>
                  <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">Type</label>
                  <Dropdown
                    value={newMeeting.type}
                    onChange={(v: string) => setNewMeeting({ ...newMeeting, type: v as MeetingType })}
                    options={['video', 'phone', 'in-person', 'other']}
                  />
                </div>
                <div>
                  <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">Host</label>
                  <Dropdown
                    value={newMeeting.owner}
                    onChange={(v: string) => setNewMeeting({ ...newMeeting, owner: v })}
                    options={users}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-[10px]">
                <div>
                  <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">Start Time</label>
                  <input
                    type="datetime-local"
                    value={newMeeting.startAt}
                    onChange={(e) => setNewMeeting({ ...newMeeting, startAt: e.target.value })}
                    className="w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] text-[13px] text-[var(--text-primary)] border border-transparent focus:outline-none focus:border-[var(--primary)] focus:bg-white focus:ring-[2px] focus:ring-[var(--primary-soft)] transition-all"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">End Time</label>
                  <input
                    type="datetime-local"
                    value={newMeeting.endAt}
                    onChange={(e) => setNewMeeting({ ...newMeeting, endAt: e.target.value })}
                    className="w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] text-[13px] text-[var(--text-primary)] border border-transparent focus:outline-none focus:border-[var(--primary)] focus:bg-white focus:ring-[2px] focus:ring-[var(--primary-soft)] transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">Location or Meeting Link</label>
                <input
                  value={newMeeting.location}
                  onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
                  placeholder="e.g. Google Meet or Lagos HQ Room 2"
                  className="w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] text-[13px] text-[var(--text-primary)] border border-transparent focus:outline-none focus:border-[var(--primary)] focus:bg-white focus:ring-[2px] focus:ring-[var(--primary-soft)] transition-all"
                />
              </div>
            </div>
            <div className="mt-[18px] flex justify-end gap-[8px]">
              <button
                onClick={() => setShowMeeting(false)}
                className="h-[36px] px-[14px] rounded-[10px] bg-[var(--input-bg)] text-[13px] hover:bg-[#EAECE8] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMeeting}
                className="h-[36px] px-[16px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold text-[#1B4D0F] hover:bg-[var(--primary-hover)] cursor-pointer"
              >
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>
      )}

      {showCall && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 p-[16px]">
          <div className="w-full max-w-[480px] bg-white rounded-[16px] p-[20px] border border-[var(--border)]">
            <div className="flex justify-between mb-[12px]">
              <div className="font-semibold">Log Call</div>
              <button onClick={() => setShowCall(false)} className="cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <div className="flex flex-col gap-[10px]">
              <Dropdown
                value={newCall.leadName}
                onChange={(v: string) => setNewCall({ ...newCall, leadName: v })}
                options={leads.map((l: Lead) => `${l.firstName} ${l.lastName}`)}
              />
              <Dropdown
                value={newCall.dealName}
                onChange={(v: string) => setNewCall({ ...newCall, dealName: v })}
                options={['', ...deals.map((d: Deal) => d.name)]}
              />
              <Dropdown
                value={newCall.outcome}
                onChange={(v: string) => setNewCall({ ...newCall, outcome: v })}
                options={['Connected', 'No Answer', 'Voicemail', 'Follow-up Required', 'Completed']}
              />
              <textarea
                value={newCall.notes}
                onChange={(e) => setNewCall({ ...newCall, notes: e.target.value })}
                placeholder="Notes"
                className="min-h-[80px] p-[12px] rounded-[10px] bg-[var(--input-bg)] text-[13px]"
              />
              <label className="flex items-center gap-[8px] text-[12px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={newCall.followUp}
                  onChange={(e) => setNewCall({ ...newCall, followUp: e.target.checked })}
                />
                Create follow-up task
              </label>
            </div>
            <div className="mt-[14px] flex justify-end gap-[8px]">
              <button
                onClick={() => setShowCall(false)}
                className="h-[36px] px-[14px] rounded-[10px] bg-[var(--input-bg)] text-[13px] hover:bg-[#EAECE8] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLogCall}
                className="h-[36px] px-[14px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold text-[#1B4D0F] hover:bg-[var(--primary-hover)] cursor-pointer"
              >
                Log Call
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
