import React, { useState, useMemo } from 'react';
import { Plus, Search, Trash2, X } from 'lucide-react';
import {
  SalesTask,
  Activity,
  Lead,
  Deal,
  ActivityType,
  SalesTaskPriority,
  SalesTaskStatus,
} from '../../types/crm';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { Dropdown } from '../../components/shared/Dropdown';
import { branches, users } from '../../data/mock/leads';

interface TasksActivitiesPageProps {
  salesTasks: SalesTask[];
  setSalesTasks: React.Dispatch<React.SetStateAction<SalesTask[]>>;
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  leads: Lead[];
  deals: Deal[];
}

export function TasksActivitiesPage({
  salesTasks,
  setSalesTasks,
  activities,
  setActivities,
  leads,
  deals,
}: TasksActivitiesPageProps) {
  const [tab, setTab] = useState<'tasks' | 'activities'>('tasks');
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showLog, setShowLog] = useState(false);
  const [showTask, setShowTask] = useState(false);

  const [newActivity, setNewActivity] = useState({
    type: 'Note' as ActivityType,
    summary: '',
    leadName: leads[0] ? `${leads[0].firstName} ${leads[0].lastName}` : '',
    dealName: deals[0]?.name || '',
    owner: users[0],
    outcome: '',
  });

  const [newTask, setNewTask] = useState({
    title: '',
    leadName: leads[0] ? `${leads[0].firstName} ${leads[0].lastName}` : '',
    dealName: deals[0]?.name || '',
    type: 'Follow-up' as any,
    priority: 'Medium' as SalesTaskPriority,
    assignee: users[0],
    branch: branches[1],
    dueAt: new Date().toISOString().split('T')[0],
  });

  const filteredTasks = useMemo(
    () =>
      salesTasks.filter((t: SalesTask) => {
        if (filter !== 'All' && t.dueLabel !== filter && t.status !== filter) {
          if (filter === 'Overdue' && t.dueLabel !== 'Overdue') return false;
          if (filter === 'Completed' && t.status !== 'Completed') return false;
          if (['Due Today', 'Upcoming'].includes(filter) && t.dueLabel !== filter) return false;
        }
        if (
          search &&
          !`${t.title} ${t.leadName} ${t.dealName}`.toLowerCase().includes(search.toLowerCase())
        )
          return false;
        return true;
      }),
    [salesTasks, filter, search]
  );

  const handleComplete = (id: string) => {
    setSalesTasks(
      salesTasks.map((t: SalesTask) =>
        t.id === id
          ? {
              ...t,
              status: 'Completed' as SalesTaskStatus,
              dueLabel: 'Completed' as const,
              completedAt: 'Now',
            }
          : t
      )
    );
  };

  const handleLog = () => {
    if (!newActivity.summary) return;
    const lead = leads.find((l: Lead) => `${l.firstName} ${l.lastName}` === newActivity.leadName);
    const deal = deals.find((d: Deal) => d.name === newActivity.dealName);
    const act: Activity = {
      id: `a${Date.now()}`,
      type: newActivity.type,
      summary: newActivity.summary,
      leadId: lead?.id,
      dealId: deal?.id,
      leadName: newActivity.leadName,
      dealName: newActivity.dealName,
      company: lead?.company || deal?.company || '',
      owner: newActivity.owner,
      occurredAt: 'Now',
      outcome:
        newActivity.outcome || (newActivity.type === 'Email' ? 'Sent' : 'Logged'),
      notes: '',
    };
    setActivities([act, ...activities]);
    setShowLog(false);
    setNewActivity({
      type: 'Note',
      summary: '',
      leadName: leads[0] ? `${leads[0].firstName} ${leads[0].lastName}` : '',
      dealName: deals[0]?.name || '',
      owner: users[0],
      outcome: '',
    });
  };

  const handleAddTask = () => {
    if (!newTask.title) return;
    const lead = leads.find((l: Lead) => `${l.firstName} ${l.lastName}` === newTask.leadName);
    const deal = deals.find((d: Deal) => d.name === newTask.dealName);
    const task: SalesTask = {
      id: `st${Date.now()}`,
      title: newTask.title,
      leadId: lead?.id,
      dealId: deal?.id,
      leadName: newTask.leadName,
      dealName: newTask.dealName,
      company: lead?.company || '',
      type: newTask.type,
      dueAt: newTask.dueAt,
      dueLabel: 'Upcoming',
      priority: newTask.priority,
      status: 'Todo',
      assignee: newTask.assignee,
      branch: newTask.branch,
    };
    setSalesTasks([task, ...salesTasks]);
    setShowTask(false);
  };

  return (
    <div className="flex flex-col gap-[18px] max-w-[1440px]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-[12px]">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight">Tasks & Activities</h1>
          <p className="text-[14px] text-[var(--text-secondary)] mt-[2px]">
            Keep sales actions organized and follow up at the right time.
          </p>
        </div>
        <div className="flex gap-[8px]">
          <button
            onClick={() => setShowTask(true)}
            className="h-[40px] px-[16px] rounded-[10px] bg-white border border-[var(--border)] text-[13px] font-medium flex items-center gap-[6px] hover:bg-[var(--input-bg)] cursor-pointer"
          >
            <Plus size={14} />
            Create Task
          </button>
          <button
            onClick={() => setShowLog(true)}
            className="h-[40px] px-[16px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold flex items-center gap-[6px] text-[#1B4D0F] hover:bg-[var(--primary-hover)] cursor-pointer"
          >
            <Plus size={14} />
            Log Activity
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[12px] p-[4px] w-fit flex gap-[4px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <button
          onClick={() => setTab('tasks')}
          className={`h-[32px] px-[16px] rounded-[8px] text-[13px] font-medium cursor-pointer transition-all ${
            tab === 'tasks'
              ? 'bg-[var(--text-primary)] text-white font-semibold'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Tasks
        </button>
        <button
          onClick={() => setTab('activities')}
          className={`h-[32px] px-[16px] rounded-[8px] text-[13px] font-medium cursor-pointer transition-all ${
            tab === 'activities'
              ? 'bg-[var(--text-primary)] text-white font-semibold'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Activity History
        </button>
      </div>

      {tab === 'tasks' ? (
        <div className="bg-white rounded-[14px] p-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="flex flex-col lg:flex-row gap-[10px] justify-between mb-[14px]">
            <div className="relative w-full lg:max-w-[280px]">
              <Search size={16} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks..."
                className="w-full h-[38px] pl-[36px] pr-[12px] rounded-[10px] bg-[var(--input-bg)] border border-transparent text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:bg-white focus:ring-[2px] focus:ring-[var(--primary-soft)] transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-[6px]">
              {['All', 'Due Today', 'Upcoming', 'Overdue', 'Completed'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`h-[32px] px-[12px] rounded-[10px] text-[12px] border cursor-pointer ${
                    filter === f
                      ? 'bg-[var(--text-primary)] text-white border-[var(--text-primary)]'
                      : 'bg-white border-[var(--border)]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="text-[11px] text-[var(--text-muted)] border-b border-[var(--border)]">
                <tr>
                  <th className="text-left p-[8px]">Title</th>
                  <th className="text-left">Related</th>
                  <th className="text-left">Type</th>
                  <th className="text-left">Due</th>
                  <th className="text-left">Priority</th>
                  <th className="text-left">Assigned</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((t: SalesTask) => (
                  <tr key={t.id} className="border-b border-[#F3F5F2] text-[12px]">
                    <td className="p-[8px]">
                      <div className="font-medium">{t.title}</div>
                      <div className="text-[11px] text-[var(--text-muted)]">{t.company}</div>
                    </td>
                    <td>
                      <div className="text-[11px]">{t.leadName || '-'}</div>
                      <div className="text-[11px] text-[var(--text-muted)]">{t.dealName || ''}</div>
                    </td>
                    <td>
                      <StatusBadge label={t.type as string} />
                    </td>
                    <td className="text-[11px]">
                      {t.dueAt} • {t.dueLabel}
                    </td>
                    <td>
                      <StatusBadge label={t.priority} />
                    </td>
                    <td className="text-[11px]">{t.assignee.split(' ')[0]}</td>
                    <td>
                      <StatusBadge label={t.status} />
                    </td>
                    <td>
                      <div className="flex gap-[6px]">
                        <button
                          onClick={() => handleComplete(t.id)}
                          disabled={t.status === 'Completed'}
                          className="h-[28px] px-[8px] rounded-[8px] bg-[var(--primary-soft)] text-[11px] text-[#2E7D32] disabled:opacity-50 cursor-pointer font-medium"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => setSalesTasks(salesTasks.filter((x: SalesTask) => x.id !== t.id))}
                          className="h-[28px] w-[28px] rounded-[8px] bg-[var(--input-bg)] flex items-center justify-center cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredTasks.length === 0 && (
            <div className="py-[24px] text-center text-[12px] text-[var(--text-muted)]">
              No tasks in this view.
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-[14px] p-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="flex flex-col gap-[8px]">
            {activities.map((a: Activity) => (
              <div
                key={a.id}
                className="border border-[var(--border)] rounded-[10px] p-[12px] flex flex-col lg:flex-row lg:items-center justify-between gap-[8px]"
              >
                <div className="flex items-center gap-[8px]">
                  <StatusBadge label={a.type} />
                  <span className="font-medium text-[13px]">{a.summary}</span>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    {a.company} • {a.leadName} {a.dealName ? `• ${a.dealName}` : ''}
                  </span>
                </div>
                <div className="flex items-center gap-[8px] text-[11px] text-[var(--text-muted)]">
                  <span>{a.owner}</span>
                  <span>•</span>
                  <span>{a.occurredAt}</span>
                  {a.outcome && (
                    <>
                      <span>•</span>
                      <StatusBadge label={a.outcome} />
                    </>
                  )}
                </div>
              </div>
            ))}
            {activities.length === 0 && (
              <div className="text-[12px] text-[var(--text-muted)] py-[16px] text-center">
                No activity history yet. Log an activity to start.
              </div>
            )}
          </div>
        </div>
      )}

      {showLog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 p-[16px]">
          <div className="w-full max-w-[480px] bg-white rounded-[16px] p-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
            <div className="flex justify-between mb-[12px]">
              <div className="font-semibold text-[16px] text-[var(--text-primary)]">Log Activity</div>
              <button
                onClick={() => setShowLog(false)}
                className="w-[32px] h-[32px] rounded-[8px] bg-[var(--input-bg)] flex items-center justify-center cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                aria-label="Close dialog"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex flex-col gap-[12px]">
              <div>
                <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">Activity Type</label>
                <Dropdown
                  value={newActivity.type}
                  onChange={(v: string) => setNewActivity({ ...newActivity, type: v as ActivityType })}
                  options={['Call', 'Email', 'Meeting', 'Note', 'Stage Change']}
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">Summary *</label>
                <input
                  value={newActivity.summary}
                  onChange={(e) => setNewActivity({ ...newActivity, summary: e.target.value })}
                  placeholder="e.g. Call regarding pricing"
                  className="w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] text-[13px] text-[var(--text-primary)] border border-[var(--border)] focus:outline-none focus:border-[#76E05B] focus:ring-[2px] focus:ring-[#EFFBEA]"
                />
              </div>
              <div className="grid grid-cols-2 gap-[10px]">
                <div>
                  <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">Related Lead</label>
                  <Dropdown
                    value={newActivity.leadName}
                    onChange={(v: string) => setNewActivity({ ...newActivity, leadName: v })}
                    options={leads.map((l: Lead) => `${l.firstName} ${l.lastName}`)}
                  />
                </div>
                <div>
                  <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">Related Deal</label>
                  <Dropdown
                    value={newActivity.dealName}
                    onChange={(v: string) => setNewActivity({ ...newActivity, dealName: v })}
                    options={deals.map((d: Deal) => d.name)}
                  />
                </div>
              </div>
              <div>
                <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">Outcome (optional)</label>
                <input
                  value={newActivity.outcome}
                  onChange={(e) => setNewActivity({ ...newActivity, outcome: e.target.value })}
                  placeholder="e.g. Follow up in 3 days"
                  className="w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] text-[13px] text-[var(--text-primary)] border border-[var(--border)] focus:outline-none focus:border-[#76E05B] focus:ring-[2px] focus:ring-[#EFFBEA]"
                />
              </div>
            </div>
            <div className="mt-[14px] flex justify-end gap-[8px]">
              <button
                onClick={() => setShowLog(false)}
                className="h-[36px] px-[14px] rounded-[10px] bg-[var(--input-bg)] text-[13px] hover:bg-[#EAECE8] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLog}
                className="h-[36px] px-[16px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold text-[#1B4D0F] hover:bg-[var(--primary-hover)] cursor-pointer"
              >
                Log Activity
              </button>
            </div>
          </div>
        </div>
      )}

      {showTask && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 p-[16px]">
          <div className="w-full max-w-[480px] bg-white rounded-[16px] p-[20px] border border-[var(--border)]">
            <div className="flex justify-between mb-[12px]">
              <div className="font-semibold">Create Task</div>
              <button onClick={() => setShowTask(false)} className="cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <div className="flex flex-col gap-[12px]">
              <div>
                <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">Task Title *</label>
                <input
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="e.g. Schedule demo call"
                  className="w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] text-[13px] text-[var(--text-primary)] border border-[var(--border)] focus:outline-none focus:border-[#76E05B] focus:ring-[2px] focus:ring-[#EFFBEA]"
                />
              </div>
              <div className="grid grid-cols-2 gap-[10px]">
                <div>
                  <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">Type</label>
                  <Dropdown
                    value={newTask.type}
                    onChange={(v: string) => setNewTask({ ...newTask, type: v })}
                    options={['Call', 'Email', 'Meeting', 'Follow-up', 'Other']}
                  />
                </div>
                <div>
                  <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">Priority</label>
                  <Dropdown
                    value={newTask.priority}
                    onChange={(v: string) =>
                      setNewTask({ ...newTask, priority: v as SalesTaskPriority })
                    }
                    options={['High', 'Medium', 'Low']}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-[10px]">
                <div>
                  <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">Lead</label>
                  <Dropdown
                    value={newTask.leadName}
                    onChange={(v: string) => setNewTask({ ...newTask, leadName: v })}
                    options={leads.map((l: Lead) => `${l.firstName} ${l.lastName}`)}
                  />
                </div>
                <div>
                  <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">Deal</label>
                  <Dropdown
                    value={newTask.dealName}
                    onChange={(v: string) => setNewTask({ ...newTask, dealName: v })}
                    options={deals.map((d: Deal) => d.name)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-[10px]">
                <div>
                  <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueAt}
                    onChange={(e) => setNewTask({ ...newTask, dueAt: e.target.value })}
                    className="w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] text-[13px] text-[var(--text-primary)] border border-[var(--border)] focus:outline-none focus:border-[#76E05B] focus:ring-[2px] focus:ring-[#EFFBEA]"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">Assignee</label>
                  <Dropdown
                    value={newTask.assignee}
                    onChange={(v: string) => setNewTask({ ...newTask, assignee: v })}
                    options={users}
                  />
                </div>
              </div>
            </div>
            <div className="mt-[14px] flex justify-end gap-[8px]">
              <button
                onClick={() => setShowTask(false)}
                className="h-[36px] px-[14px] rounded-[10px] bg-[var(--input-bg)] text-[13px] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="h-[36px] px-[14px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold text-[#1B4D0F] cursor-pointer"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
