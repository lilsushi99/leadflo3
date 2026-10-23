import React, { useState, useMemo } from 'react';
import {
  UsersRound,
  Award,
  DollarSign,
  TrendingUp,
  Mail,
  BarChart3,
  Activity as ActivityIcon,
  Target,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Lead, Deal, Campaign, Delivery, Activity, Meeting, SalesTask } from '../../types/crm';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { Dropdown } from '../../components/shared/Dropdown';
import { branches, sources, statuses, chartDataMap } from '../../data/mock/leads';
import { dealStages } from '../../data/mock/sales';

interface AnalyticsReportsPageProps {
  leads: Lead[];
  deals: Deal[];
  campaigns: Campaign[];
  deliveries: Delivery[];
  activities: Activity[];
  meetings: Meeting[];
  salesTasks: SalesTask[];
  branch?: string;
  dateRange?: string;
}

export function AnalyticsReportsPage({
  leads,
  deals,
  campaigns,
  deliveries,
  activities,
  meetings,
  salesTasks,
  branch: globalBranch,
  dateRange: globalDateRange,
}: AnalyticsReportsPageProps) {
  const [branchFilter, setBranchFilter] = useState(globalBranch || 'All Branches');
  const [dateFilter, setDateFilter] = useState(globalDateRange || 'Last 30 Days');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [reportTab, setReportTab] = useState<'overview' | 'acquisition' | 'pipeline' | 'outreach'>('overview');

  const filteredLeads = useMemo(() => {
    return leads.filter((l: Lead) => {
      if (branchFilter !== 'All Branches' && l.branch !== branchFilter) return false;
      if (sourceFilter !== 'All' && l.source !== sourceFilter) return false;
      if (statusFilter !== 'All' && l.status !== statusFilter) return false;
      return true;
    });
  }, [leads, branchFilter, sourceFilter, statusFilter]);

  const filteredDeals = useMemo(() => {
    return deals.filter((d: Deal) => {
      if (branchFilter !== 'All Branches' && d.branch !== branchFilter) return false;
      return true;
    });
  }, [deals, branchFilter]);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c: Campaign) => {
      if (branchFilter !== 'All Branches' && c.branch !== branchFilter) return false;
      return true;
    });
  }, [campaigns, branchFilter]);

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter((d: Delivery) => {
      if (branchFilter !== 'All Branches' && d.branch !== branchFilter) return false;
      return true;
    });
  }, [deliveries, branchFilter]);

  // Summary metrics
  const totalLeads = filteredLeads.length;
  const qualifiedLeads = filteredLeads.filter((l: Lead) => l.status === 'Qualified').length;
  const contactedLeads = filteredLeads.filter((l: Lead) =>
    ['Contacted', 'Qualified', 'In Progress', 'Completed'].includes(l.status)
  ).length;
  const completedLeads = filteredLeads.filter((l: Lead) => l.status === 'Completed').length;
  const qualificationRate = totalLeads ? (qualifiedLeads / totalLeads) * 100 : 0;
  const conversionRate = totalLeads ? (completedLeads / totalLeads) * 100 : 0;
  const contactRate = totalLeads ? (contactedLeads / totalLeads) * 100 : 0;

  const openDeals = filteredDeals.filter((d: Deal) => !['Closed Won', 'Closed Lost'].includes(d.stage));
  const wonDeals = filteredDeals.filter((d: Deal) => d.stage === 'Closed Won');
  const lostDeals = filteredDeals.filter((d: Deal) => d.stage === 'Closed Lost');
  const openValue = openDeals.reduce((s: number, d: Deal) => s + d.value, 0);
  const wonValue = wonDeals.reduce((s: number, d: Deal) => s + d.value, 0);
  const lostValue = lostDeals.reduce((s: number, d: Deal) => s + d.value, 0);
  const avgDealValue = filteredDeals.length
    ? Math.round(filteredDeals.reduce((s: number, d: Deal) => s + d.value, 0) / filteredDeals.length)
    : 0;
  const winRate = filteredDeals.length ? (wonDeals.length / filteredDeals.length) * 100 : 0;
  const expectedCloseValue = openDeals.reduce((s: number, d: Deal) => s + (d.value * d.probability) / 100, 0);

  const totalSent = filteredCampaigns.reduce((s: number, c: Campaign) => s + c.sent, 0);
  const avgOpen = filteredCampaigns.length
    ? Math.round(filteredCampaigns.reduce((s: number, c: Campaign) => s + c.open, 0) / filteredCampaigns.length)
    : 0;
  const avgClick = filteredCampaigns.length
    ? Math.round(filteredCampaigns.reduce((s: number, c: Campaign) => s + c.click, 0) / filteredCampaigns.length)
    : 0;
  const deliveredCount = filteredDeliveries.filter((d: Delivery) => d.status === 'Delivered').length;
  const deliveryRate = filteredDeliveries.length
    ? (deliveredCount / filteredDeliveries.length) * 100
    : 0;

  const chartData = chartDataMap[dateFilter] || chartDataMap['Last 30 Days'];

  const sourcePerformance = useMemo(() => {
    const map: Record<string, { total: number; qualified: number; completed: number }> = {};
    sources.forEach((src) => (map[src] = { total: 0, qualified: 0, completed: 0 }));
    filteredLeads.forEach((l: Lead) => {
      if (!map[l.source]) map[l.source] = { total: 0, qualified: 0, completed: 0 };
      map[l.source].total += 1;
      if (l.status === 'Qualified') map[l.source].qualified += 1;
      if (l.status === 'Completed') map[l.source].completed += 1;
    });
    return Object.entries(map)
      .map(([name, v]) => ({
        name,
        total: v.total,
        qualified: v.qualified,
        completed: v.completed,
        qualRate: v.total ? Math.round((v.qualified / v.total) * 100) : 0,
        convRate: v.total ? Math.round((v.completed / v.total) * 100) : 0,
      }))
      .filter((d) => d.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [filteredLeads]);

  const statusFunnel = useMemo(() => {
    return statuses
      .map((st) => ({
        name: st,
        value: filteredLeads.filter((l: Lead) => l.status === st).length,
        color:
          st === 'Qualified'
            ? '#76E05B'
            : st === 'New'
            ? '#E7EAE5'
            : st === 'Contacted'
            ? '#3B82F6'
            : st === 'Completed'
            ? '#2E7D32'
            : '#F59E0B',
      }))
      .filter((d) => d.value > 0);
  }, [filteredLeads]);

  const dealsByStage = useMemo(() => {
    return dealStages.map((st) => ({
      stage: st,
      count: filteredDeals.filter((d: Deal) => d.stage === st).length,
      value: filteredDeals.filter((d: Deal) => d.stage === st).reduce((s: number, d: Deal) => s + d.value, 0),
    }));
  }, [filteredDeals]);

  const branchPerformance = useMemo(() => {
    return branches.slice(1).map((br) => {
      const bLeads = leads.filter((l: Lead) => l.branch === br).length;
      const bDeals = deals.filter((d: Deal) => d.branch === br);
      const bWon = bDeals.filter((d: Deal) => d.stage === 'Closed Won');
      const bValue = bDeals.reduce((s: number, d: Deal) => s + d.value, 0);
      const bWonValue = bWon.reduce((s: number, d: Deal) => s + d.value, 0);
      return {
        branch: br,
        leads: bLeads,
        deals: bDeals.length,
        won: bWon.length,
        totalValue: bValue,
        wonValue: bWonValue,
        winRate: bDeals.length ? Math.round((bWon.length / bDeals.length) * 100) : 0,
      };
    });
  }, [leads, deals]);

  const campaignPerformance = useMemo(() => {
    return filteredCampaigns
      .map((c: Campaign) => ({
        ...c,
        openRate: c.sent ? Math.round((c.open / Math.max(1, c.sent)) * 100) : c.open,
        clickRate: c.sent ? Math.round((c.click / Math.max(1, c.sent)) * 100) : c.click,
        performanceScore: c.sent ? Math.round(((c.open + c.click) / Math.max(1, c.sent)) * 100) : 0,
      }))
      .sort((a: any, b: any) => b.sent - a.sent);
  }, [filteredCampaigns]);

  const topActivities = useMemo(() => {
    const map: Record<string, number> = {};
    activities.forEach((a: Activity) => {
      map[a.type] = (map[a.type] || 0) + 1;
    });
    return Object.entries(map)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
  }, [activities]);

  return (
    <div className="flex flex-col gap-[20px] max-w-[1600px]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-[12px]">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight">Analytics & Reports</h1>
          <p className="text-[14px] text-[var(--text-secondary)] mt-[2px]">
            CRM performance overview with acquisition, qualification, pipeline, and outreach insights.
          </p>
        </div>
        <div className="flex flex-wrap gap-[8px]">
          <Dropdown value={branchFilter} onChange={setBranchFilter} options={branches} />
          <Dropdown
            value={dateFilter}
            onChange={setDateFilter}
            options={['Today', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month']}
          />
          <Dropdown value={sourceFilter} onChange={setSourceFilter} options={['All', ...sources]} />
          <Dropdown value={statusFilter} onChange={setStatusFilter} options={['All', ...statuses]} />
          <button
            onClick={() => {
              setBranchFilter('All Branches');
              setDateFilter('Last 30 Days');
              setSourceFilter('All');
              setStatusFilter('All');
            }}
            className="h-[36px] px-[12px] rounded-[10px] bg-[var(--input-bg)] text-[13px] cursor-pointer hover:bg-[#EAECE8]"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[12px] p-[4px] w-fit flex gap-[4px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        {(['overview', 'acquisition', 'pipeline', 'outreach'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setReportTab(t)}
            className={`h-[32px] px-[14px] rounded-[10px] text-[13px] capitalize cursor-pointer transition-colors ${
              reportTab === t
                ? 'bg-[var(--text-primary)] text-white'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* KPI Cards: Borderless, Soft Shadows, Coordinated Icons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[14px]">
        {[
          {
            label: 'Total Leads',
            value: totalLeads,
            sub: `${qualifiedLeads} qualified`,
            trend: `+${Math.round(qualificationRate)}% qual`,
            icon: UsersRound,
            bg: 'bg-[#EBF5FF]',
            iconColor: 'text-[#2563EB]',
          },
          {
            label: 'Qualification Rate',
            value: `${qualificationRate.toFixed(1)}%`,
            sub: `${contactRate.toFixed(0)}% contacted`,
            trend: `${conversionRate.toFixed(1)}% converted`,
            icon: Award,
            bg: 'bg-[#EFFBEA]',
            iconColor: 'text-[#16A34A]',
          },
          {
            label: 'Open Pipeline Value',
            value: `$${openValue.toLocaleString()}`,
            sub: `${openDeals.length} open deals`,
            trend: `$${Math.round(expectedCloseValue).toLocaleString()} expected`,
            icon: DollarSign,
            bg: 'bg-[#FEF3C7]',
            iconColor: 'text-[#D97706]',
          },
          {
            label: 'Won Revenue',
            value: `$${wonValue.toLocaleString()}`,
            sub: `${wonDeals.length} won • ${winRate.toFixed(0)}% win rate`,
            trend: `Avg $${avgDealValue.toLocaleString()}`,
            icon: TrendingUp,
            bg: 'bg-[#EFFBEA]',
            iconColor: 'text-[#16A34A]',
          },
          {
            label: 'Emails Delivered',
            value: totalSent,
            sub: `${deliveryRate.toFixed(0)}% delivery • ${deliveredCount}/${filteredDeliveries.length}`,
            trend: `${avgOpen}% avg open • ${avgClick}% click`,
            icon: Mail,
            bg: 'bg-[#EBF5FF]',
            iconColor: 'text-[#2563EB]',
          },
          {
            label: 'Campaigns Active',
            value: filteredCampaigns.filter((c: Campaign) => c.status !== 'Draft').length,
            sub: `${filteredCampaigns.length} total`,
            trend: `${filteredCampaigns.filter((c: Campaign) => c.status === 'Sent').length} sent`,
            icon: BarChart3,
            bg: 'bg-[#F3E8FF]',
            iconColor: 'text-[#9333EA]',
          },
          {
            label: 'Activities Logged',
            value: activities.length,
            sub: `${meetings.length} meetings • ${salesTasks.length} tasks`,
            trend: `${topActivities[0]?.type || '-'} top`,
            icon: ActivityIcon,
            bg: 'bg-[#E0E7FF]',
            iconColor: 'text-[#4F46E5]',
          },
          {
            label: 'Conversion Rate',
            value: `${conversionRate.toFixed(1)}%`,
            sub: `${completedLeads} completed`,
            trend: `${lostDeals.length} lost deals`,
            icon: Target,
            bg: 'bg-[#EFFBEA]',
            iconColor: 'text-[#16A34A]',
          },
        ].map((k) => (
          <div
            key={k.label}
            className="bg-white rounded-[14px] p-[18px] flex flex-col gap-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
          >
            <div className="flex items-start justify-between">
              <span className="text-[13px] text-[var(--text-secondary)] font-medium">{k.label}</span>
              <div className={`w-[32px] h-[32px] rounded-[9px] ${k.bg} flex items-center justify-center shrink-0`}>
                <k.icon size={16} className={k.iconColor} />
              </div>
            </div>
            <div className="text-[22px] font-semibold leading-none tracking-tight">{k.value}</div>
            <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-[2px]">
              <span className="truncate">{k.sub}</span>
              <span className="font-medium text-[#166534] bg-[#EFFBEA] px-[6px] py-[2px] rounded-[4px] shrink-0 ml-[4px]">
                {k.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {reportTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[16px]">
            <div className="lg:col-span-2 bg-white rounded-[14px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between mb-[16px]">
                <div className="text-[15px] font-semibold">
                  Lead Acquisition & Revenue Trend • {dateFilter}
                </div>
                <div className="flex items-center gap-[8px] text-[11px]">
                  <span className="flex items-center gap-[4px]">
                    <span className="w-[8px] h-[8px] rounded-full bg-[#76E05B]" />
                    Leads
                  </span>
                  <span className="flex items-center gap-[4px]">
                    <span className="w-[8px] h-[8px] rounded-full bg-[#3B82F6]" />
                    Emails
                  </span>
                  <span className="flex items-center gap-[4px]">
                    <span className="w-[8px] h-[8px] rounded-full bg-[#8B5CF6]" />
                    Sales
                  </span>
                </div>
              </div>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E7EAE5" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <RechartsTooltip />
                    <Area type="monotone" dataKey="lead" stroke="#76E05B" fill="#EFFBEA" strokeWidth={2} />
                    <Area type="monotone" dataKey="email" stroke="#3B82F6" fill="#E8F0FE" strokeWidth={2} />
                    <Area type="monotone" dataKey="sales" stroke="#8B5CF6" fill="#F3E8FF" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-[14px] p-[20px] flex flex-col shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              <div className="text-[15px] font-semibold mb-[16px]">Lead Status Funnel</div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusFunnel}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {statusFunnel.map((e: any, i: number) => (
                        <Cell key={i} fill={e.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-[12px] grid grid-cols-2 gap-[8px]">
                {statusFunnel.map((s: any) => (
                  <div key={s.name} className="flex items-center justify-between text-[12px]">
                    <span className="flex items-center gap-[6px]">
                      <span className="w-[8px] h-[8px] rounded-full" style={{ background: s.color }} />
                      {s.name}
                    </span>
                    <span className="font-medium">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
            <div className="bg-white rounded-[14px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              <div className="text-[15px] font-semibold mb-[14px]">Branch Performance</div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead className="text-[11px] text-[var(--text-muted)] border-b border-[var(--border)]">
                    <tr>
                      <th className="text-left py-[8px]">Branch</th>
                      <th className="text-left">Leads</th>
                      <th className="text-left">Deals</th>
                      <th className="text-left">Win Rate</th>
                      <th className="text-left">Won Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branchPerformance.map((b: any) => (
                      <tr key={b.branch} className="border-b border-[#F3F5F2] text-[12px]">
                        <td className="py-[10px] font-medium">{b.branch}</td>
                        <td>{b.leads}</td>
                        <td>{b.deals}</td>
                        <td>
                          <span
                            className={`px-[6px] py-[2px] rounded-[6px] text-[11px] ${
                              b.winRate >= 50 ? 'bg-[#EFFBEA] text-[#2E7D32]' : 'bg-[var(--input-bg)]'
                            }`}
                          >
                            {b.winRate}%
                          </span>
                        </td>
                        <td className="font-medium">${b.wonValue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-white rounded-[14px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              <div className="text-[15px] font-semibold mb-[14px]">Top Campaigns</div>
              <div className="flex flex-col gap-[10px]">
                {campaignPerformance.slice(0, 5).map((c: any) => (
                  <div
                    key={c.id}
                    className="border border-[var(--border)] rounded-[10px] p-[12px] flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium text-[13px]">{c.name}</div>
                      <div className="text-[11px] text-[var(--text-muted)]">
                        {c.audience} • {c.branch}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[12px] font-medium">
                        {c.sent} sent • {c.openRate}% open • {c.clickRate}% click
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)]">
                        <StatusBadge label={c.status} />
                      </div>
                    </div>
                  </div>
                ))}
                {campaignPerformance.length === 0 && (
                  <div className="text-[12px] text-[var(--text-muted)]">
                    No campaigns for this branch filter.
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {reportTab === 'acquisition' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
          <div className="bg-white rounded-[14px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="text-[15px] font-semibold mb-[14px]">Lead Source Performance</div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourcePerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E7EAE5" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <RechartsTooltip />
                  <Bar dataKey="total" fill="#76E05B" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="qualified" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="completed" fill="#2E7D32" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-[12px] overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead className="text-[11px] text-[var(--text-muted)] border-b">
                  <tr>
                    <th className="text-left py-[8px]">Source</th>
                    <th className="text-left">Total</th>
                    <th className="text-left">Qualified</th>
                    <th className="text-left">Qual Rate</th>
                    <th className="text-left">Completed</th>
                    <th className="text-left">Conv Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {sourcePerformance.map((s: any) => (
                    <tr key={s.name} className="border-b border-[#F3F5F2] text-[12px]">
                      <td className="py-[8px] font-medium">{s.name}</td>
                      <td>{s.total}</td>
                      <td>{s.qualified}</td>
                      <td>{s.qualRate}%</td>
                      <td>{s.completed}</td>
                      <td>{s.convRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white rounded-[14px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="text-[15px] font-semibold mb-[14px]">Lead Qualification & Conversion</div>
            <div className="grid grid-cols-3 gap-[10px] mb-[16px]">
              {[
                { label: 'Total Leads', v: totalLeads },
                { label: 'Contacted', v: contactedLeads, pct: contactRate },
                { label: 'Qualified', v: qualifiedLeads, pct: qualificationRate },
                { label: 'Completed', v: completedLeads, pct: conversionRate },
                { label: 'Open Pipeline', v: openDeals.length },
                { label: 'Won', v: wonDeals.length, pct: winRate },
              ].map((k: any) => (
                <div key={k.label} className="bg-[var(--input-bg)] rounded-[10px] p-[10px]">
                  <div className="text-[11px] text-[var(--text-muted)]">{k.label}</div>
                  <div className="text-[16px] font-semibold">
                    {k.v}
                    {k.pct !== undefined ? ` • ${k.pct.toFixed(0)}%` : ''}
                  </div>
                </div>
              ))}
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E7EAE5" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="lead" stroke="#76E05B" fill="#EFFBEA" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-[12px] text-[12px] text-[var(--text-secondary)]">
              Qualification = Qualified / Total. Conversion = Completed / Total. Contact Rate = Contacted+
              stages / Total. Filter by source/status to refine.
            </div>
          </div>
        </div>
      )}

      {reportTab === 'pipeline' && (
        <div className="grid grid-cols-1 gap-[16px]">
          <div className="bg-white rounded-[14px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="text-[15px] font-semibold mb-[14px]">Sales Pipeline Performance by Stage</div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dealsByStage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E7EAE5" />
                  <XAxis dataKey="stage" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <RechartsTooltip />
                  <Bar dataKey="count" fill="#76E05B" radius={[6, 6, 0, 0]} name="Count" />
                  <Bar dataKey="value" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Value ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-[14px] grid grid-cols-2 lg:grid-cols-6 gap-[10px]">
              {dealsByStage.map((d: any) => (
                <div key={d.stage} className="bg-[var(--input-bg)] rounded-[10px] p-[10px]">
                  <div className="text-[11px] text-[var(--text-muted)]">{d.stage}</div>
                  <div className="text-[13px] font-semibold">{d.count} deals</div>
                  <div className="text-[11px] text-[var(--text-secondary)]">${d.value.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
            <div className="bg-white rounded-[14px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              <div className="text-[15px] font-semibold mb-[14px]">Revenue Trends • {dateFilter}</div>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E7EAE5" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="sales" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-[12px] grid grid-cols-3 gap-[8px] text-[12px]">
                <div className="bg-[#EFFBEA] rounded-[8px] p-[10px]">
                  <div className="text-[11px] text-[var(--text-muted)]">Open Value</div>
                  <div className="font-semibold">${openValue.toLocaleString()}</div>
                </div>
                <div className="bg-[#E8F0FE] rounded-[8px] p-[10px]">
                  <div className="text-[11px] text-[var(--text-muted)]">Expected Close</div>
                  <div className="font-semibold">${Math.round(expectedCloseValue).toLocaleString()}</div>
                </div>
                <div className="bg-[#F3E8FF] rounded-[8px] p-[10px]">
                  <div className="text-[11px] text-[var(--text-muted)]">Won / Lost</div>
                  <div className="font-semibold">
                    ${wonValue.toLocaleString()} / ${lostValue.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-[14px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              <div className="text-[15px] font-semibold mb-[14px]">Recent Deals • {branchFilter}</div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead className="text-[11px] text-[var(--text-muted)] border-b">
                    <tr>
                      <th className="text-left py-[8px]">Deal</th>
                      <th className="text-left">Stage</th>
                      <th className="text-left">Value</th>
                      <th className="text-left">Prob</th>
                      <th className="text-left">Owner</th>
                      <th className="text-left">Close</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDeals.slice(0, 8).map((d: Deal) => (
                      <tr key={d.id} className="border-b border-[#F3F5F2] text-[12px]">
                        <td className="py-[8px] font-medium">{d.name}</td>
                        <td>
                          <StatusBadge label={d.stage} />
                        </td>
                        <td>${d.value.toLocaleString()}</td>
                        <td>{d.probability}%</td>
                        <td>{d.owner.split(' ')[0]}</td>
                        <td className="text-[var(--text-muted)]">{d.expectedCloseDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredDeals.length === 0 && (
                <div className="py-[20px] text-center text-[12px] text-[var(--text-muted)]">
                  No deals for filter.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {reportTab === 'outreach' && (
        <div className="grid grid-cols-1 gap-[16px]">
          <div className="bg-white rounded-[14px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="text-[15px] font-semibold mb-[14px]">Outreach Campaign Performance</div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E7EAE5" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-10} textAnchor="end" height={70} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <RechartsTooltip />
                  <Bar dataKey="sent" fill="#76E05B" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="open" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="click" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-[14px] overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="text-[11px] text-[var(--text-muted)] border-b">
                  <tr>
                    <th className="text-left py-[8px]">Campaign</th>
                    <th className="text-left">Audience</th>
                    <th className="text-left">Status</th>
                    <th className="text-left">Sent</th>
                    <th className="text-left">Open</th>
                    <th className="text-left">Click</th>
                    <th className="text-left">Open Rate</th>
                    <th className="text-left">Click Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {campaignPerformance.map((c: any) => (
                    <tr key={c.id} className="border-b border-[#F3F5F2] text-[12px]">
                      <td className="py-[8px] font-medium">{c.name}</td>
                      <td className="text-[var(--text-secondary)]">{c.audience}</td>
                      <td>
                        <StatusBadge label={c.status} />
                      </td>
                      <td>{c.sent}</td>
                      <td>{c.open}</td>
                      <td>{c.click}</td>
                      <td>{c.openRate}%</td>
                      <td>{c.clickRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
            <div className="bg-white rounded-[14px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              <div className="text-[15px] font-semibold mb-[14px]">
                Delivery Performance • {filteredDeliveries.length} deliveries
              </div>
              <div className="grid grid-cols-3 gap-[10px] mb-[14px]">
                {[
                  {
                    label: 'Delivered',
                    v: filteredDeliveries.filter((d: Delivery) => d.status === 'Delivered').length,
                    color: '#EFFBEA',
                  },
                  {
                    label: 'Bounced',
                    v: filteredDeliveries.filter((d: Delivery) => d.status === 'Bounced').length,
                    color: '#FEECEC',
                  },
                  {
                    label: 'Failed',
                    v: filteredDeliveries.filter((d: Delivery) => d.status === 'Failed').length,
                    color: '#FFF7D6',
                  },
                ].map((k: any) => (
                  <div key={k.label} className="rounded-[10px] p-[12px]" style={{ background: k.color }}>
                    <div className="text-[11px] text-[var(--text-muted)]">{k.label}</div>
                    <div className="text-[18px] font-semibold">{k.v}</div>
                  </div>
                ))}
              </div>
              <div className="overflow-x-auto max-h-[260px] overflow-y-auto">
                <table className="w-full">
                  <thead className="text-[11px] text-[var(--text-muted)] sticky top-0 bg-white">
                    <tr>
                      <th className="text-left py-[6px]">Recipient</th>
                      <th className="text-left">Status</th>
                      <th className="text-left">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDeliveries.slice(0, 12).map((d: Delivery) => (
                      <tr key={d.id} className="border-b border-[#F3F5F2] text-[12px]">
                        <td className="py-[8px]">
                          <div className="font-medium">{d.recipient}</div>
                          <div className="text-[11px] text-[var(--text-muted)]">{d.email}</div>
                        </td>
                        <td>
                          <StatusBadge label={d.status} />
                        </td>
                        <td className="text-[11px] text-[var(--text-muted)]">{d.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-white rounded-[14px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              <div className="text-[15px] font-semibold mb-[14px]">Activity Metrics</div>
              <div className="grid grid-cols-2 gap-[10px] mb-[14px]">
                {topActivities.map((a: any) => (
                  <div
                    key={a.type}
                    className="bg-[var(--input-bg)] rounded-[10px] p-[12px] flex justify-between items-center"
                  >
                    <span className="text-[12px] font-medium">{a.type}</span>
                    <span className="text-[13px] font-semibold">{a.count}</span>
                  </div>
                ))}
                <div className="bg-[var(--primary-soft)] rounded-[10px] p-[12px]">
                  <div className="text-[11px] text-[var(--text-muted)]">Meetings</div>
                  <div className="text-[16px] font-semibold">{meetings.length}</div>
                </div>
                <div className="bg-[var(--input-bg)] rounded-[10px] p-[12px]">
                  <div className="text-[11px] text-[var(--text-muted)]">Tasks</div>
                  <div className="text-[16px] font-semibold">
                    {salesTasks.length} • {salesTasks.filter((t: SalesTask) => t.status === 'Completed').length}{' '}
                    done
                  </div>
                </div>
              </div>
              <div className="text-[12px] text-[var(--text-muted)]">
                Outreach and activity metrics derived from campaigns, deliveries, tasks, meetings, and activity logs.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
