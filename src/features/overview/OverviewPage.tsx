import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  UsersRound,
  Check,
  Mail,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  ListFilter,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Lead, Task } from '../../types/crm';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { Dropdown } from '../../components/shared/Dropdown';
import { chartDataMap, leadSourceData } from '../../data/mock/leads';

interface OverviewPageProps {
  leads: Lead[];
  branch: string;
  dateRange: string;
  setCurrentPage: (page: string) => void;
  setSourceFilter: (source: string | null) => void;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

interface MetricDefinition {
  id: string;
  label: string;
  group: 'Lead Activity' | 'Email Activity' | 'Sales Performance';
  color: string;
  fill: string;
  isCurrency?: boolean;
}

const METRIC_DEFINITIONS: Record<string, MetricDefinition> = {
  lead: {
    id: 'lead',
    label: 'Leads Discovered',
    group: 'Lead Activity',
    color: '#16A34A',
    fill: 'rgba(22, 163, 74, 0.14)',
  },
  emailsSent: {
    id: 'emailsSent',
    label: 'Emails Sent',
    group: 'Email Activity',
    color: '#2563EB',
    fill: 'rgba(37, 99, 235, 0.12)',
  },
  emailsReceived: {
    id: 'emailsReceived',
    label: 'Emails Received',
    group: 'Email Activity',
    color: '#0891B2',
    fill: 'rgba(8, 145, 178, 0.12)',
  },
  dealsWon: {
    id: 'dealsWon',
    label: 'Deals Won',
    group: 'Sales Performance',
    color: '#9333EA',
    fill: 'rgba(147, 51, 234, 0.12)',
  },
  revenue: {
    id: 'revenue',
    label: 'Revenue',
    group: 'Sales Performance',
    color: '#D97706',
    fill: 'rgba(217, 119, 6, 0.12)',
    isCurrency: true,
  },
};

const METRIC_GROUPS = [
  {
    name: 'Lead Activity',
    metrics: ['lead'],
  },
  {
    name: 'Email Activity',
    metrics: ['emailsSent', 'emailsReceived'],
  },
  {
    name: 'Sales Performance',
    metrics: ['dealsWon', 'revenue'],
  },
];

const TIME_RANGE_OPTIONS = [
  'Today',
  'Last 7 Days',
  'Last 30 Days',
  'This Month',
  'Last Month',
  'Custom Range',
];

export function OverviewPage({
  leads,
  branch,
  dateRange,
  setCurrentPage,
  setSourceFilter,
  tasks,
  setTasks,
}: OverviewPageProps) {
  // Time-range dropdown for the chart, initialized with current dateRange
  const [chartTimeRange, setChartTimeRange] = useState<string>(dateRange || 'Last 30 Days');
  // Grouped metrics selected for the area chart series (default to Leads Discovered)
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['lead']);
  const [metricDropdownOpen, setMetricDropdownOpen] = useState(false);
  const metricDropdownRef = useRef<HTMLDivElement>(null);

  // Keep in sync if parent dateRange changes
  useEffect(() => {
    if (dateRange) setChartTimeRange(dateRange);
  }, [dateRange]);

  // Click outside listener for metric dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (metricDropdownRef.current && !metricDropdownRef.current.contains(e.target as Node)) {
        setMetricDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLeads = useMemo(
    () => (branch === 'All Branches' ? leads : leads.filter((l: Lead) => l.branch === branch)),
    [leads, branch]
  );
  const kpiFactor = branch === 'All Branches' ? 1 : 0.42;

  // Derive chart data according to selected time range and branch factor
  const chartData = useMemo(() => {
    const rawData = chartDataMap[chartTimeRange] || chartDataMap['Last 30 Days'] || [];
    return rawData.map((d) => ({
      ...d,
      lead: Math.round((d.lead ?? 0) * kpiFactor),
      emailsSent: Math.round((d.emailsSent ?? 0) * kpiFactor),
      emailsReceived: Math.round((d.emailsReceived ?? 0) * kpiFactor),
      dealsWon: Math.round((d.dealsWon ?? 0) * kpiFactor),
      revenue: Math.round((d.revenue ?? 0) * kpiFactor),
    }));
  }, [chartTimeRange, kpiFactor]);

  const totalSource = leadSourceData.reduce((a, b) => a + b.value, 0);

  const handleSourceClick = (name: string) => {
    setSourceFilter(name);
    setCurrentPage('all-leads');
  };

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metricId) ? prev.filter((id) => id !== metricId) : [...prev, metricId]
    );
  };

  // Dynamic heading and description based on which metric groups are selected
  const { heading, description } = useMemo(() => {
    const hasLead = selectedMetrics.includes('lead');
    const hasEmail = selectedMetrics.includes('emailsSent') || selectedMetrics.includes('emailsReceived');
    const hasSales = selectedMetrics.includes('dealsWon') || selectedMetrics.includes('revenue');

    if (!hasLead && !hasEmail && !hasSales) {
      return {
        heading: 'Activity Overview',
        description: 'Select one or more metrics from the dropdown below to visualize performance.',
      };
    }
    if (hasLead && !hasEmail && !hasSales) {
      return {
        heading: 'Lead Activity',
        description: 'Track lead discovery and creation across your selected period.',
      };
    }
    if (!hasLead && hasEmail && !hasSales) {
      return {
        heading: 'Email Activity',
        description: 'Compare email activity across your selected period.',
      };
    }
    if (!hasLead && !hasEmail && hasSales) {
      return {
        heading: 'Sales Performance',
        description: 'Track deals won and revenue across your selected period.',
      };
    }
    if (hasLead && hasEmail && !hasSales) {
      return {
        heading: 'Lead & Email Activity',
        description: 'Compare lead discovery and email engagement across your selected period.',
      };
    }
    if (hasLead && !hasEmail && hasSales) {
      return {
        heading: 'Lead & Sales Performance',
        description: 'Track lead generation, won deals, and revenue across your selected period.',
      };
    }
    if (!hasLead && hasEmail && hasSales) {
      return {
        heading: 'Outreach & Sales Performance',
        description: 'Compare email engagement with sales performance and revenue across your selected period.',
      };
    }
    return {
      heading: 'Comprehensive Activity & Sales Performance',
      description: 'Track lead discovery, email activity, and sales performance across your selected period.',
    };
  }, [selectedMetrics]);

  const hasRevenue = selectedMetrics.includes('revenue');

  return (
    <div className="flex flex-col gap-[24px] max-w-[1440px]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-[12px]">
        <div>
          <h1 className="text-[26px] font-semibold leading-tight tracking-tight">Good morning, Dominion</h1>
          <p className="text-[14px] text-[var(--text-secondary)] mt-[4px]">
            Here's what's happening across your agency.
          </p>
        </div>
        <div className="flex gap-[8px]">
          <span className="text-[12px] text-[var(--text-muted)] hidden md:block">
            Branch: {branch} • {dateRange}
          </span>
        </div>
      </div>

      {/* KPI Cards with Coordinated Expressive Icons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px]">
        {[
          {
            label: 'Leads Discovered',
            value: Math.round(1248 * kpiFactor),
            trend: '+12% vs last month',
            icon: UsersRound,
            bg: 'bg-[#EFFBEA]',
            iconColor: 'text-[#16A34A]',
          },
          {
            label: 'Qualified Leads',
            value: Math.round(342 * kpiFactor),
            trend: '+8% vs last month',
            icon: Check,
            bg: 'bg-[#EBF5FF]',
            iconColor: 'text-[#2563EB]',
          },
          {
            label: 'Emails Delivered',
            value: Math.round(8420 * kpiFactor),
            trend: '+23% vs last month',
            icon: Mail,
            bg: 'bg-[#FEF3C7]',
            iconColor: 'text-[#D97706]',
          },
          {
            label: 'Deals Won',
            value: Math.round(56 * kpiFactor),
            trend: '+4% vs last month',
            icon: BriefcaseBusiness,
            bg: 'bg-[#F3E8FF]',
            iconColor: 'text-[#9333EA]',
          },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-[14px] p-[20px] flex flex-col gap-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="flex justify-between items-start">
              <span className="text-[13px] text-[var(--text-secondary)] font-medium">{kpi.label}</span>
              <div className={`w-[32px] h-[32px] rounded-[9px] ${kpi.bg} flex items-center justify-center shrink-0`}>
                <kpi.icon size={16} className={kpi.iconColor} />
              </div>
            </div>
            <div className="text-[28px] font-semibold leading-none tracking-tight">{kpi.value.toLocaleString()}</div>
            <div className="text-[12px] text-[#2E7D32] bg-[var(--primary-soft)] inline-flex px-[8px] py-[2px] rounded-[6px] w-fit font-medium">
              {kpi.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Row: Area Chart + Lead Sources Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[20px] items-stretch">
        {/* Rebuilt Area Chart Card */}
        <div className="lg:col-span-2 bg-white rounded-[14px] p-[20px] min-w-0 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            {/* Header: Dynamic Heading & Time-Range Dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-[12px] mb-[12px]">
              <div>
                <h2 className="text-[16px] font-semibold text-[var(--text-primary)] transition-colors">
                  {heading}
                </h2>
                <p className="text-[13px] text-[var(--text-muted)] mt-[2px] transition-colors">
                  {description}
                </p>
              </div>

              {/* Time-Range Dropdown replacing previous 3 tabs */}
              <Dropdown
                value={chartTimeRange}
                onSelect={(val) => setChartTimeRange(val)}
                options={TIME_RANGE_OPTIONS}
                trigger={
                  <div className="flex items-center gap-[6px] h-[34px] px-[12px] rounded-[10px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] text-[12.5px] font-medium cursor-pointer hover:bg-[#F9FAF8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#76E05B]/50 transition-all shrink-0">
                    <CalendarDays size={14} className="text-[var(--text-muted)]" />
                    <span>{chartTimeRange}</span>
                    <ChevronDown size={13} className="text-[var(--text-muted)]" />
                  </div>
                }
              />
            </div>

            {/* Controls Bar: Grouped Metric Dropdown with Checkboxes + Active Legend */}
            <div className="flex flex-wrap items-center justify-between gap-[10px] pb-[10px] border-b border-[#F3F5F2]">
              {/* Grouped Metric Dropdown */}
              <div className="relative" ref={metricDropdownRef}>
                <button
                  type="button"
                  onClick={() => setMetricDropdownOpen(!metricDropdownOpen)}
                  className="flex items-center gap-[8px] h-[32px] px-[10px] rounded-[8px] bg-[var(--input-bg)] hover:bg-[#ECEEEA] text-[12.5px] font-medium text-[var(--text-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[#76E05B]/40"
                  aria-expanded={metricDropdownOpen}
                  aria-haspopup="true"
                >
                  <ListFilter size={14} className="text-[var(--text-muted)]" />
                  <span>Metrics</span>
                  <span className="px-[6px] py-[1px] rounded-full bg-[#EFFBEA] text-[#166534] text-[11px] font-semibold">
                    {selectedMetrics.length} selected
                  </span>
                  <ChevronDown
                    size={13}
                    className={`text-[var(--text-muted)] transition-transform duration-150 ${
                      metricDropdownOpen ? 'rotate-180 text-[#166534]' : ''
                    }`}
                  />
                </button>

                {metricDropdownOpen && (
                  <div className="absolute left-0 top-[calc(100%+6px)] w-[260px] bg-white rounded-[12px] border border-[var(--border)] shadow-[0_12px_28px_rgba(0,0,0,0.12)] p-[8px] z-50 animate-in fade-in duration-100">
                    <div className="px-[8px] py-[6px] flex items-center justify-between border-b border-[var(--border)] mb-[4px]">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        Select Metrics
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedMetrics.length === 5) {
                            setSelectedMetrics(['lead']);
                          } else {
                            setSelectedMetrics(['lead', 'emailsSent', 'emailsReceived', 'dealsWon', 'revenue']);
                          }
                        }}
                        className="text-[11px] text-[#166534] font-medium hover:underline"
                      >
                        {selectedMetrics.length === 5 ? 'Reset' : 'Select All'}
                      </button>
                    </div>

                    <div className="flex flex-col gap-[2px]">
                      {METRIC_GROUPS.map((group) => (
                        <div key={group.name} className="flex flex-col">
                          <div className="px-[8px] pt-[6px] pb-[3px] text-[10.5px] font-semibold uppercase tracking-wider text-[var(--text-muted)] border-t border-[var(--border)] first:border-0 first:pt-[2px]">
                            {group.name}
                          </div>
                          {group.metrics.map((metricKey) => {
                            const def = METRIC_DEFINITIONS[metricKey];
                            const isChecked = selectedMetrics.includes(metricKey);
                            return (
                              <button
                                key={metricKey}
                                type="button"
                                role="checkbox"
                                aria-checked={isChecked}
                                onClick={() => toggleMetric(metricKey)}
                                className={`flex items-center justify-between px-[8px] py-[6px] rounded-[6px] text-[12.5px] text-left transition-colors ${
                                  isChecked
                                    ? 'bg-[#EFFBEA] text-[#15803D] font-medium'
                                    : 'hover:bg-[#F7F8F5] text-[var(--text-primary)]'
                                }`}
                              >
                                <div className="flex items-center gap-[8px]">
                                  <div
                                    className={`w-[16px] h-[16px] rounded-[4px] border flex items-center justify-center transition-colors ${
                                      isChecked
                                        ? 'bg-[#76E05B] border-[#76E05B] text-white'
                                        : 'border-[#CBD5E1] bg-white'
                                    }`}
                                  >
                                    {isChecked && <Check size={12} strokeWidth={3} />}
                                  </div>
                                  <span>{def.label}</span>
                                </div>
                                <span
                                  className="w-[8px] h-[8px] rounded-full shrink-0"
                                  style={{ backgroundColor: def.color }}
                                />
                              </button>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Series Legend Pills */}
              <div className="flex flex-wrap items-center gap-[10px]">
                {selectedMetrics.map((key) => {
                  const def = METRIC_DEFINITIONS[key];
                  if (!def) return null;
                  return (
                    <div
                      key={key}
                      className="inline-flex items-center gap-[5px] text-[11.5px] text-[var(--text-secondary)] font-medium"
                    >
                      <span
                        className="w-[7px] h-[7px] rounded-full shrink-0"
                        style={{ backgroundColor: def.color }}
                      />
                      <span>{def.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Usable Area Chart Canvas with horizontal alignment and no excess space */}
          <div className="h-[310px] w-full mt-[16px] relative">
            {selectedMetrics.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: hasRevenue ? 10 : 0, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E7EAE5" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#8B928C' }} axisLine={false} tickLine={false} />
                  {/* Left Axis for standard counts */}
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 11, fill: '#8B928C' }}
                    axisLine={false}
                    tickLine={false}
                    width={36}
                  />
                  {/* Right Axis for currency/revenue when selected */}
                  {hasRevenue && (
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 11, fill: '#8B928C' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
                      width={44}
                    />
                  )}
                  <RechartsTooltip
                    content={({ active, payload, label }: any) => {
                      if (!active || !payload || !payload.length) return null;
                      return (
                        <div className="bg-white border border-[var(--border)] rounded-[10px] shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-[10px] text-[12px] min-w-[150px]">
                          <div className="font-semibold text-[var(--text-primary)] mb-[6px] pb-[4px] border-b border-[var(--border)]">
                            {label}
                          </div>
                          <div className="flex flex-col gap-[4px]">
                            {payload.map((item: any, i: number) => {
                              const def = METRIC_DEFINITIONS[item.dataKey];
                              return (
                                <div key={i} className="flex items-center justify-between gap-[12px]">
                                  <div className="flex items-center gap-[6px]">
                                    <span
                                      className="w-[7px] h-[7px] rounded-full shrink-0"
                                      style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-[var(--text-secondary)]">{item.name}:</span>
                                  </div>
                                  <span className="font-semibold text-[var(--text-primary)]">
                                    {def?.isCurrency
                                      ? `$${Number(item.value).toLocaleString()}`
                                      : Number(item.value).toLocaleString()}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }}
                  />
                  {selectedMetrics.map((metricKey) => {
                    const def = METRIC_DEFINITIONS[metricKey];
                    if (!def) return null;
                    return (
                      <Area
                        key={metricKey}
                        yAxisId={def.isCurrency ? 'right' : 'left'}
                        type="monotone"
                        dataKey={metricKey}
                        name={def.label}
                        stroke={def.color}
                        strokeWidth={2.2}
                        fill={def.fill}
                        fillOpacity={1}
                        dot={false}
                        activeDot={{ r: 4.5, fill: def.color, stroke: 'white', strokeWidth: 2 }}
                      />
                    );
                  })}
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-[20px] bg-[var(--input-bg)]/40 rounded-[10px] border border-dashed border-[var(--border)]">
                <div className="w-[36px] h-[36px] rounded-full bg-[#EFFBEA] flex items-center justify-center text-[#16A34A] mb-[8px]">
                  <TrendingUp size={18} />
                </div>
                <div className="text-[13px] font-semibold text-[var(--text-primary)]">No metrics selected</div>
                <div className="text-[12px] text-[var(--text-muted)] mt-[2px] max-w-[280px]">
                  Choose one or more metrics from the Metrics dropdown above to visualize activity data.
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedMetrics(['lead'])}
                  className="mt-[10px] text-[12px] px-[12px] py-[5px] rounded-[6px] bg-[#76E05B] text-black font-semibold hover:bg-[#66c94f] transition-colors"
                >
                  Select Leads Discovered
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Lead Sources Pie Chart Card */}
        <div className="bg-white rounded-[14px] p-[20px] flex flex-col justify-between min-w-0 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div>
            <div className="text-[16px] font-semibold text-[var(--text-primary)]">Lead Sources</div>
            <div className="text-[13px] text-[var(--text-muted)] mb-[12px]">Where leads originate</div>
            <div className="relative h-[190px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadSourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={56}
                    outerRadius={78}
                    dataKey="value"
                    stroke="none"
                    paddingAngle={2}
                  >
                    {leadSourceData.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    content={({ active, payload }: any) =>
                      active && payload ? (
                        <div className="bg-white border border-[var(--border)] rounded-[8px] px-[10px] py-[6px] text-[12px] shadow-md">
                          {payload[0].name}: {payload[0].value}%
                        </div>
                      ) : null
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-[24px] font-semibold leading-none">{totalSource}</div>
                <div className="text-[11px] text-[var(--text-muted)] mt-[2px]">Total</div>
              </div>
            </div>
          </div>

          <div className="mt-[12px] flex flex-col gap-[6px]">
            {leadSourceData.map((s) => (
              <button
                key={s.name}
                onClick={() => handleSourceClick(s.name)}
                className="flex items-center justify-between text-[13px] hover:bg-[var(--input-bg)] rounded-[8px] px-[8px] py-[5px] transition-colors"
              >
                <div className="flex items-center gap-[8px]">
                  <span className="w-[8px] h-[8px] rounded-full shrink-0" style={{ background: s.color }} />
                  <span>{s.name}</span>
                </div>
                <span className="text-[var(--text-secondary)]">
                  {s.value}% • {Math.round((filteredLeads.length * s.value) / 100)} leads
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Priority Tasks & Recent Leads Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px]">
        <div className="bg-white rounded-[14px] p-[20px] min-w-0 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-[16px]">
            <div className="text-[16px] font-semibold">Priority Tasks</div>
            <span className="text-[12px] text-[var(--text-muted)]">
              {tasks.filter((t: Task) => !t.completed).length} remaining
            </span>
          </div>
          <div className="flex flex-col">
            {tasks.map((task: Task) => (
              <div
                key={task.id}
                className="flex items-start gap-[12px] py-[12px] border-b border-[#F3F5F2] last:border-0 group"
              >
                <button
                  onClick={() =>
                    setTasks((prev: Task[]) =>
                      prev.map((t: Task) => (t.id === task.id ? { ...t, completed: !t.completed } : t))
                    )
                  }
                  className={`w-[18px] h-[18px] rounded-[5px] border mt-[2px] flex items-center justify-center shrink-0 transition-colors ${
                    task.completed
                      ? 'bg-[var(--primary)] border-[var(--primary)] text-black'
                      : 'border-[#CBD5E1] hover:border-[var(--primary)]'
                  }`}
                  aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
                >
                  {task.completed && <Check size={12} strokeWidth={3} />}
                </button>
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-[13px] font-medium transition-all ${
                      task.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'
                    }`}
                  >
                    {task.title}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] mt-[2px]">
                    {task.company} • {task.due}
                  </div>
                </div>
                <div className="flex items-center gap-[6px] shrink-0">
                  <StatusBadge label={task.priority} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[14px] p-[20px] min-w-0 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-[16px]">
            <div className="text-[16px] font-semibold">Recent Leads</div>
            <button
              onClick={() => setCurrentPage('all-leads')}
              className="text-[12px] text-[#166534] font-medium hover:underline"
            >
              View all
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#F3F5F2] text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  <th className="pb-[10px]">Lead</th>
                  <th className="pb-[10px]">Source</th>
                  <th className="pb-[10px]">Status</th>
                  <th className="pb-[10px]">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F5F2]">
                {filteredLeads.slice(0, 5).map((lead: Lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setCurrentPage('all-leads')}
                    className="hover:bg-[#F7F8F5] cursor-pointer transition-colors"
                  >
                    <td className="py-[10px]">
                      <div className="font-medium text-[13px] text-[var(--text-primary)]">
                        {lead.firstName} {lead.lastName}
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)]">{lead.company}</div>
                    </td>
                    <td className="py-[10px] text-[12px] text-[var(--text-secondary)]">{lead.source}</td>
                    <td className="py-[10px]">
                      <StatusBadge label={lead.status} />
                    </td>
                    <td className="py-[10px]">
                      <StatusBadge label={lead.verification} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
