import React, { useState, useMemo } from 'react';
import { Search, Users, BriefcaseBusiness, DollarSign, Mail, X } from 'lucide-react';
import { Lead, Deal, Campaign, SalesTask, Activity, Meeting } from '../../types/crm';
import { Dropdown } from '../../components/shared/Dropdown';
import { branches, users, statuses } from '../../data/mock/leads';
import { dealStages } from '../../data/mock/sales';

interface TeamPerformancePageProps {
  leads: Lead[];
  deals: Deal[];
  campaigns: Campaign[];
  salesTasks: SalesTask[];
  activities: Activity[];
  meetings: Meeting[];
  branch?: string;
  dateRange?: string;
}

export function TeamPerformancePage({
  leads,
  deals,
  campaigns,
  salesTasks,
  activities,
  meetings,
  branch: globalBranch,
  dateRange: globalDateRange,
}: TeamPerformancePageProps) {
  const [branchFilter, setBranchFilter] = useState(globalBranch || 'All Branches');
  const [dateFilter, setDateFilter] = useState(globalDateRange || 'Last 30 Days');
  const [memberFilter, setMemberFilter] = useState('All Members');
  const [search, setSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  const filteredLeads = useMemo(
    () => leads.filter((l: Lead) => branchFilter === 'All Branches' || l.branch === branchFilter),
    [leads, branchFilter]
  );
  const filteredDeals = useMemo(
    () => deals.filter((d: Deal) => branchFilter === 'All Branches' || d.branch === branchFilter),
    [deals, branchFilter]
  );
  const filteredCampaigns = useMemo(
    () => campaigns.filter((c: Campaign) => branchFilter === 'All Branches' || c.branch === branchFilter),
    [campaigns, branchFilter]
  );
  const filteredTasks = useMemo(
    () => salesTasks.filter((t: SalesTask) => branchFilter === 'All Branches' || t.branch === branchFilter),
    [salesTasks, branchFilter]
  );

  const memberStats = useMemo(() => {
    return users.map((user: string) => {
      const userLeads = filteredLeads.filter((l: Lead) => l.assignee === user);
      const qualified = userLeads.filter((l: Lead) => l.status === 'Qualified').length;
      const completed = userLeads.filter((l: Lead) => l.status === 'Completed').length;
      const qualRate = userLeads.length ? (qualified / userLeads.length) * 100 : 0;
      const userDeals = filteredDeals.filter((d: Deal) => d.owner === user);
      const won = userDeals.filter((d: Deal) => d.stage === 'Closed Won');
      const lost = userDeals.filter((d: Deal) => d.stage === 'Closed Lost');
      const open = userDeals.filter((d: Deal) => !['Closed Won', 'Closed Lost'].includes(d.stage));
      const winRate = userDeals.length ? (won.length / userDeals.length) * 100 : 0;
      const wonValue = won.reduce((s: number, d: Deal) => s + d.value, 0);
      const openValue = open.reduce((s: number, d: Deal) => s + d.value, 0);
      const totalValue = userDeals.reduce((s: number, d: Deal) => s + d.value, 0);
      const userCampaigns = filteredCampaigns.filter((c: Campaign) => c.owner === user);
      const sent = userCampaigns.reduce((s: number, c: Campaign) => s + c.sent, 0);
      const userTasks = filteredTasks.filter((t: SalesTask) => t.assignee === user);
      const completedTasks = userTasks.filter((t: SalesTask) => t.status === 'Completed').length;
      const userActivities = activities.filter((a: Activity) => a.owner === user);
      const userMeetings = meetings.filter((m: Meeting) => m.owner === user);
      const conversionRate = userLeads.length ? (completed / userLeads.length) * 100 : 0;
      return {
        user,
        leads: userLeads.length,
        qualified,
        completed,
        qualRate,
        conversionRate,
        deals: userDeals.length,
        won: won.length,
        lost: lost.length,
        open: open.length,
        winRate,
        wonValue,
        openValue,
        totalValue,
        campaigns: userCampaigns.length,
        sent,
        tasks: userTasks.length,
        completedTasks,
        taskCompletion: userTasks.length ? (completedTasks / userTasks.length) * 100 : 0,
        activities: userActivities.length,
        meetings: userMeetings.length,
      };
    });
  }, [filteredLeads, filteredDeals, filteredCampaigns, filteredTasks, activities, meetings]);

  const filteredMembers = useMemo(() => {
    return memberStats
      .filter((m: any) => {
        if (memberFilter !== 'All Members' && m.user !== memberFilter) return false;
        if (search && !m.user.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => b.wonValue - a.wonValue);
  }, [memberStats, memberFilter, search]);

  const totals = useMemo(() => {
    return {
      totalLeads: filteredLeads.length,
      totalDeals: filteredDeals.length,
      totalWon: filteredDeals.filter((d: Deal) => d.stage === 'Closed Won').length,
      totalWonValue: filteredDeals
        .filter((d: Deal) => d.stage === 'Closed Won')
        .reduce((s: number, d: Deal) => s + d.value, 0),
      totalCampaigns: filteredCampaigns.length,
      totalTasks: filteredTasks.length,
      avgQual: memberStats.length
        ? memberStats.reduce((s, m: any) => s + m.qualRate, 0) / memberStats.length
        : 0,
      avgWin: memberStats.length
        ? memberStats.reduce((s, m: any) => s + m.winRate, 0) / memberStats.length
        : 0,
    };
  }, [filteredLeads, filteredDeals, filteredCampaigns, filteredTasks, memberStats]);

  const selectedStat = selectedMember
    ? memberStats.find((m: any) => m.user === selectedMember)
    : null;

  return (
    <div className="flex flex-col gap-[20px] max-w-[1600px]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-[12px]">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight">Team Performance</h1>
          <p className="text-[14px] text-[var(--text-secondary)] mt-[2px]">
            Team and individual performance summaries across leads, outreach, and revenue.
          </p>
        </div>
        <div className="flex flex-wrap gap-[8px]">
          <Dropdown value={branchFilter} onChange={setBranchFilter} options={branches} />
          <Dropdown
            value={dateFilter}
            onChange={setDateFilter}
            options={['Today', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month']}
          />
          <Dropdown
            value={memberFilter}
            onChange={setMemberFilter}
            options={['All Members', ...users]}
          />
          <button
            onClick={() => {
              setBranchFilter('All Branches');
              setDateFilter('Last 30 Days');
              setMemberFilter('All Members');
              setSearch('');
            }}
            className="h-[36px] px-[12px] rounded-[10px] bg-[var(--input-bg)] text-[13px] cursor-pointer hover:bg-[#EAECE8]"
          >
            Reset
          </button>
        </div>
      </div>

      {/* KPI Cards: Borderless, Soft Shadows, Coordinated Icons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[16px]">
        {[
          {
            label: 'Total Leads Handled',
            value: totals.totalLeads,
            sub: `${memberStats.length} members • avg ${Math.round(totals.avgQual)}% qual`,
            icon: Users,
            bg: 'bg-[#EBF5FF]',
            iconColor: 'text-[#2563EB]',
          },
          {
            label: 'Deals • Won',
            value: `${totals.totalDeals} • ${totals.totalWon}`,
            sub: `Avg win ${totals.avgWin.toFixed(0)}% • ${
              filteredDeals.filter((d: Deal) => !['Closed Won', 'Closed Lost'].includes(d.stage)).length
            } open`,
            icon: BriefcaseBusiness,
            bg: 'bg-[#EFFBEA]',
            iconColor: 'text-[#16A34A]',
          },
          {
            label: 'Won Revenue',
            value: `$${totals.totalWonValue.toLocaleString()}`,
            sub: `${filteredDeals.filter((d: Deal) => d.stage === 'Closed Won').length} won deals • $${
              filteredDeals.length
                ? Math.round(
                    totals.totalWonValue /
                      Math.max(1, filteredDeals.filter((d: Deal) => d.stage === 'Closed Won').length)
                  ).toLocaleString()
                : 0
            } avg`,
            icon: DollarSign,
            bg: 'bg-[#FEF3C7]',
            iconColor: 'text-[#D97706]',
          },
          {
            label: 'Outreach & Tasks',
            value: `${totals.totalCampaigns} • ${totals.totalTasks}`,
            sub: `${activities.length} activities • ${meetings.length} meetings`,
            icon: Mail,
            bg: 'bg-[#F3E8FF]',
            iconColor: 'text-[#9333EA]',
          },
        ].map((k) => (
          <div
            key={k.label}
            className="bg-white rounded-[14px] p-[20px] flex flex-col gap-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
          >
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
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search team member..."
              className="w-full h-[38px] pl-[36px] pr-[12px] rounded-[10px] bg-[var(--input-bg)] border border-transparent text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:bg-white focus:ring-[2px] focus:ring-[var(--primary-soft)] transition-all"
            />
          </div>
          <div className="text-[12px] text-[var(--text-muted)] flex items-center gap-[6px]">
            Branch: <span className="font-medium text-[var(--text-primary)]">{branchFilter}</span> • Date:{' '}
            <span className="font-medium text-[var(--text-primary)]">{dateFilter}</span> •{' '}
            {filteredMembers.length} members
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="text-[11px] text-[var(--text-muted)] border-b border-[var(--border)] bg-[#FBFDFB]">
              <tr>
                <th className="text-left p-[10px]">Member</th>
                <th className="text-left">Leads</th>
                <th className="text-left">Qualified</th>
                <th className="text-left">Qual Rate</th>
                <th className="text-left">Completed</th>
                <th className="text-left">Conv Rate</th>
                <th className="text-left">Deals</th>
                <th className="text-left">Won</th>
                <th className="text-left">Win Rate</th>
                <th className="text-left">Won Revenue</th>
                <th className="text-left">Open Value</th>
                <th className="text-left">Campaigns</th>
                <th className="text-left">Sent</th>
                <th className="text-left">Tasks Done</th>
                <th className="text-left">Meetings</th>
                <th className="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((m: any) => (
                <tr key={m.user} className="border-b border-[#F3F5F2] hover:bg-[#FBFBF9] text-[12px]">
                  <td className="p-[10px]">
                    <div className="flex items-center gap-[8px]">
                      <div className="w-[28px] h-[28px] rounded-full bg-[var(--primary)] flex items-center justify-center text-[11px] font-semibold text-[#1B4D0F]">
                        {m.user
                          .split(' ')
                          .map((n: string) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-medium">{m.user}</div>
                        <div className="text-[11px] text-[var(--text-muted)]">
                          {m.leads} leads • {m.deals} deals
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{m.leads}</td>
                  <td>{m.qualified}</td>
                  <td>
                    <span
                      className={`px-[6px] py-[2px] rounded-[6px] text-[11px] ${
                        m.qualRate >= 40 ? 'bg-[#EFFBEA] text-[#2E7D32]' : 'bg-[var(--input-bg)]'
                      }`}
                    >
                      {m.qualRate.toFixed(0)}%
                    </span>
                  </td>
                  <td>{m.completed}</td>
                  <td>{m.conversionRate.toFixed(0)}%</td>
                  <td>{m.deals}</td>
                  <td>{m.won}</td>
                  <td>
                    <span
                      className={`px-[6px] py-[2px] rounded-[6px] text-[11px] ${
                        m.winRate >= 40 ? 'bg-[#EFFBEA] text-[#2E7D32]' : 'bg-[var(--input-bg)]'
                      }`}
                    >
                      {m.winRate.toFixed(0)}%
                    </span>
                  </td>
                  <td className="font-medium">${m.wonValue.toLocaleString()}</td>
                  <td>${m.openValue.toLocaleString()}</td>
                  <td>{m.campaigns}</td>
                  <td>{m.sent}</td>
                  <td>
                    {m.completedTasks}/{m.tasks} • {m.taskCompletion.toFixed(0)}%
                  </td>
                  <td>{m.meetings}</td>
                  <td>
                    <button
                      onClick={() => setSelectedMember(m.user)}
                      className="h-[28px] px-[10px] rounded-[8px] bg-[var(--input-bg)] text-[11px] cursor-pointer hover:bg-[#EAECE8]"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredMembers.length === 0 && (
          <div className="py-[24px] text-center text-[12px] text-[var(--text-muted)]">
            No members match filters. Clear search.
          </div>
        )}
      </div>

      {selectedStat && (
        <div
          className="fixed inset-0 z-[60] flex justify-end bg-black/20"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="w-full max-w-[440px] bg-white h-full overflow-auto p-[20px] border-l border-[var(--border)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between mb-[14px]">
              <div>
                <div className="font-semibold text-[16px]">{selectedStat.user}</div>
                <div className="text-[12px] text-[var(--text-muted)]">
                  Performance breakdown • {branchFilter} • {dateFilter}
                </div>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="p-[6px] bg-[var(--input-bg)] rounded-[8px] cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-[10px] mb-[14px]">
              {[
                { l: 'Leads Handled', v: selectedStat.leads },
                { l: 'Qualified', v: `${selectedStat.qualified} • ${selectedStat.qualRate.toFixed(0)}%` },
                { l: 'Deals Owned', v: selectedStat.deals },
                { l: 'Won', v: `${selectedStat.won} • ${selectedStat.winRate.toFixed(0)}%` },
                { l: 'Won Revenue', v: `$${selectedStat.wonValue.toLocaleString()}` },
                { l: 'Open Value', v: `$${selectedStat.openValue.toLocaleString()}` },
                { l: 'Campaigns', v: selectedStat.campaigns },
                { l: 'Emails Sent', v: selectedStat.sent },
                { l: 'Tasks', v: `${selectedStat.completedTasks}/${selectedStat.tasks} done` },
                { l: 'Meetings', v: selectedStat.meetings },
                { l: 'Activities', v: selectedStat.activities },
                { l: 'Conversion', v: `${selectedStat.conversionRate.toFixed(1)}%` },
              ].map((k: any) => (
                <div key={k.l} className="bg-[var(--input-bg)] rounded-[10px] p-[10px]">
                  <div className="text-[11px] text-[var(--text-muted)]">{k.l}</div>
                  <div className="text-[13px] font-semibold">{k.v}</div>
                </div>
              ))}
            </div>
            <div className="text-[11px] font-medium mb-[6px]">Lead Breakdown</div>
            <div className="flex flex-col gap-[6px] mb-[12px]">
              {statuses.map((st: string) => {
                const count = filteredLeads.filter(
                  (l: Lead) => l.assignee === selectedStat.user && l.status === st
                ).length;
                if (!count) return null;
                return (
                  <div
                    key={st}
                    className="flex justify-between text-[12px] border border-[var(--border)] rounded-[8px] p-[8px]"
                  >
                    <span>{st}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                );
              })}
            </div>
            <div className="text-[11px] font-medium mb-[6px]">Deals by Stage</div>
            <div className="flex flex-col gap-[6px]">
              {dealStages.map((st) => {
                const count = filteredDeals.filter(
                  (d: Deal) => d.owner === selectedStat.user && d.stage === st
                ).length;
                if (!count) return null;
                const val = filteredDeals
                  .filter((d: Deal) => d.owner === selectedStat.user && d.stage === st)
                  .reduce((s: number, d: Deal) => s + d.value, 0);
                return (
                  <div
                    key={st}
                    className="flex justify-between text-[12px] border border-[var(--border)] rounded-[8px] p-[8px]"
                  >
                    <span>{st}</span>
                    <span className="font-medium">
                      {count} • ${val.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
