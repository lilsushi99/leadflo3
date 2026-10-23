import React, { useState, useMemo } from 'react';
import { Plus, Search, ChevronLeft, ChevronRight, TrendingUp, CheckCircle2, XCircle, Target, X } from 'lucide-react';
import { Deal, DealStage, SalesTaskPriority, Activity } from '../../types/crm';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { Dropdown } from '../../components/shared/Dropdown';
import { dealStages, stageProbability } from '../../data/mock/sales';
import { branches, initialLeads, users } from '../../data/mock/leads';

interface SalesPipelinePageProps {
  deals: Deal[];
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>;
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
}

const PIPELINE_ORDER: DealStage[] = [
  'New Opportunity',
  'Qualified',
  'Proposal',
  'Negotiation',
  'Closed Won',
];

export function SalesPipelinePage({
  deals,
  setDeals,
  activities,
  setActivities,
}: SalesPipelinePageProps) {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [ownerFilter, setOwnerFilter] = useState('All');
  const [branchFilter, setBranchFilter] = useState('All');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newDeal, setNewDeal] = useState({
    name: '',
    company: '',
    value: '',
    stage: 'New Opportunity' as DealStage,
    owner: users[0],
    branch: branches[1],
    expectedCloseDate: new Date().toISOString().split('T')[0],
    priority: 'Medium' as SalesTaskPriority,
  });

  const filteredDeals = useMemo(
    () =>
      deals.filter((d: Deal) => {
        if (
          search &&
          !`${d.name} ${d.company} ${d.leadName}`.toLowerCase().includes(search.toLowerCase())
        )
          return false;
        if (stageFilter !== 'All' && d.stage !== stageFilter) return false;
        if (ownerFilter !== 'All' && d.owner !== ownerFilter) return false;
        if (branchFilter !== 'All' && d.branch !== branchFilter) return false;
        return true;
      }),
    [deals, search, stageFilter, ownerFilter, branchFilter]
  );

  const openValue = useMemo(
    () =>
      filteredDeals
        .filter((d: Deal) => !['Closed Won', 'Closed Lost'].includes(d.stage))
        .reduce((s: number, d: Deal) => s + d.value, 0),
    [filteredDeals]
  );
  const wonDeals = useMemo(
    () => filteredDeals.filter((d: Deal) => d.stage === 'Closed Won'),
    [filteredDeals]
  );
  const lostDeals = useMemo(
    () => filteredDeals.filter((d: Deal) => d.stage === 'Closed Lost'),
    [filteredDeals]
  );
  const expectedClose = useMemo(
    () =>
      filteredDeals
        .filter((d: Deal) => !['Closed Won', 'Closed Lost'].includes(d.stage))
        .reduce((s: number, d: Deal) => s + (d.value * d.probability) / 100, 0),
    [filteredDeals]
  );

  const grouped = useMemo(() => {
    const g: Record<string, Deal[]> = {};
    dealStages.forEach((st) => (g[st] = []));
    filteredDeals.forEach((d: Deal) => {
      if (g[d.stage]) g[d.stage].push(d);
    });
    return g;
  }, [filteredDeals]);

  const handleStageChange = (dealId: string, newStage: DealStage) => {
    const oldDeal = deals.find((d: Deal) => d.id === dealId);
    if (!oldDeal || oldDeal.stage === newStage) return;
    const updated = deals.map((d: Deal) =>
      d.id === dealId
        ? {
            ...d,
            stage: newStage,
            probability: stageProbability[newStage],
            lastActivityAt: 'Now',
          }
        : d
    );
    setDeals(updated);
    const act: Activity = {
      id: `a${Date.now()}`,
      type: 'Stage Change',
      summary: `${oldDeal.stage} → ${newStage}`,
      dealId,
      dealName: oldDeal.name,
      leadName: oldDeal.leadName,
      company: oldDeal.company,
      owner: 'Dominion Castiel',
      occurredAt: 'Now',
      notes: `${oldDeal.stage} → ${newStage}`,
    };
    setActivities([act, ...activities]);
    if (selectedDeal && selectedDeal.id === dealId) {
      setSelectedDeal({
        ...selectedDeal,
        stage: newStage,
        probability: stageProbability[newStage],
      });
    }
  };

  const handleMoveStage = (dealId: string, direction: 'prev' | 'next') => {
    const deal = deals.find((d: Deal) => d.id === dealId);
    if (!deal) return;

    if (deal.stage === 'Closed Lost') {
      if (direction === 'prev') {
        handleStageChange(dealId, 'Negotiation');
      }
      return;
    }

    const curIdx = PIPELINE_ORDER.indexOf(deal.stage);
    if (curIdx === -1) return;

    if (direction === 'prev' && curIdx > 0) {
      handleStageChange(dealId, PIPELINE_ORDER[curIdx - 1]);
    } else if (direction === 'next' && curIdx < PIPELINE_ORDER.length - 1) {
      handleStageChange(dealId, PIPELINE_ORDER[curIdx + 1]);
    }
  };

  const handleAddDeal = () => {
    if (!newDeal.name || !newDeal.company || !newDeal.value) return;
    const lead =
      initialLeads.find((l: any) => l.company === newDeal.company) || initialLeads[0];
    const deal: Deal = {
      id: `deal-${Date.now()}`,
      name: newDeal.name,
      leadId: lead.id,
      company: newDeal.company,
      leadName: `${lead.firstName} ${lead.lastName}`,
      value: Number(newDeal.value),
      currency: 'USD',
      stage: newDeal.stage,
      probability: stageProbability[newDeal.stage],
      expectedCloseDate: newDeal.expectedCloseDate,
      owner: newDeal.owner,
      branch: newDeal.branch,
      description: `Opportunity for ${newDeal.company}`,
      createdAt: 'Now',
      lastActivityAt: 'Now',
      priority: newDeal.priority,
    };
    setDeals([deal, ...deals]);
    setShowAdd(false);
    setNewDeal({
      name: '',
      company: '',
      value: '',
      stage: 'New Opportunity',
      owner: users[0],
      branch: branches[1],
      expectedCloseDate: new Date().toISOString().split('T')[0],
      priority: 'Medium',
    });
  };

  return (
    <div className="flex flex-col gap-[18px] max-w-[1600px]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-[12px]">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight">Sales Pipeline</h1>
          <p className="text-[14px] text-[var(--text-secondary)] mt-[2px]">
            Track opportunities from first conversation to closed deal.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="h-[40px] px-[18px] rounded-[10px] bg-[var(--primary)] text-[#1B2D15] text-[14px] font-semibold flex items-center gap-[8px] hover:bg-[var(--primary-hover)] cursor-pointer transition-colors"
        >
          <Plus size={16} />
          Add Deal
        </button>
      </div>

      {/* KPI Cards: Borderless, Soft Shadows, Coordinated Icons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[16px]">
        {[
          {
            label: 'Open Pipeline Value',
            value: `$${openValue.toLocaleString()}`,
            sub: `${filteredDeals.filter((d: Deal) => !['Closed Won', 'Closed Lost'].includes(d.stage)).length} open deals`,
            icon: TrendingUp,
            bg: 'bg-[#EBF5FF]',
            iconColor: 'text-[#2563EB]',
          },
          {
            label: 'Deals Won',
            value: `$${wonDeals.reduce((s: number, d: Deal) => s + d.value, 0).toLocaleString()}`,
            sub: `${wonDeals.length} won deals`,
            icon: CheckCircle2,
            bg: 'bg-[#EFFBEA]',
            iconColor: 'text-[#16A34A]',
          },
          {
            label: 'Deals Lost',
            value: `$${lostDeals.reduce((s: number, d: Deal) => s + d.value, 0).toLocaleString()}`,
            sub: `${lostDeals.length} lost deals`,
            icon: XCircle,
            bg: 'bg-[#FEE2E2]',
            iconColor: 'text-[#DC2626]',
          },
          {
            label: 'Expected Closed Value',
            value: `$${Math.round(expectedClose).toLocaleString()}`,
            sub: 'Weighted forecast',
            icon: Target,
            bg: 'bg-[#FEF3C7]',
            iconColor: 'text-[#D97706]',
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-[14px] p-[20px] flex flex-col gap-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
          >
            <div className="flex justify-between items-start">
              <span className="text-[13px] text-[var(--text-secondary)] font-medium">{s.label}</span>
              <div className={`w-[32px] h-[32px] rounded-[9px] ${s.bg} flex items-center justify-center shrink-0`}>
                <s.icon size={16} className={s.iconColor} />
              </div>
            </div>
            <div className="text-[26px] font-semibold leading-none tracking-tight">{s.value}</div>
            <div className="text-[12px] text-[var(--text-muted)]">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Toolbar: Borderless, Soft Shadow */}
      <div className="bg-white rounded-[14px] p-[14px] flex flex-col lg:flex-row gap-[10px] justify-between shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="relative w-full lg:max-w-[280px]">
          <Search size={16} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search deal, company, lead..."
            className="w-full h-[38px] pl-[36px] pr-[12px] rounded-[10px] bg-[var(--input-bg)] border border-transparent text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:bg-white focus:ring-[2px] focus:ring-[var(--primary-soft)] transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-[8px]">
          <Dropdown value={stageFilter} onChange={setStageFilter} options={['All', ...dealStages]} />
          <Dropdown value={ownerFilter} onChange={setOwnerFilter} options={['All', ...users]} />
          <Dropdown value={branchFilter} onChange={setBranchFilter} options={['All', ...branches.slice(1)]} />
          <button
            onClick={() => {
              setSearch('');
              setStageFilter('All');
              setOwnerFilter('All');
              setBranchFilter('All');
            }}
            className="h-[36px] px-[12px] rounded-[10px] bg-[var(--input-bg)] text-[13px] hover:bg-[#EAECE8] cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Outer Pipeline Board Container: Borderless, Soft Shadow */}
      <div className="bg-white rounded-[16px] p-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="flex gap-[14px] overflow-x-auto pb-[6px]">
          {dealStages.map((stage) => {
            const stageDeals = grouped[stage] || [];
            const stageValue = stageDeals.reduce((s: number, d: Deal) => s + d.value, 0);
            return (
              <div
                key={stage}
                className="min-w-[300px] w-[300px] bg-[#F7F8F5] border border-[var(--border)] rounded-[14px] flex flex-col shrink-0"
              >
                <div className="p-[12px] border-b border-[var(--border)] bg-white rounded-t-[14px]">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-[13px] text-[var(--text-primary)]">{stage}</div>
                    <StatusBadge label={stage} />
                  </div>
                  <div className="mt-[6px] flex items-center gap-[8px] text-[11px] text-[var(--text-muted)]">
                    <span>{stageDeals.length} deals</span>
                    <span>•</span>
                    <span className="font-medium text-[var(--text-secondary)]">${stageValue.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex-1 p-[10px] flex flex-col gap-[10px] overflow-y-auto max-h-[620px]">
                  {stageDeals.map((d: Deal) => {
                    const isTerminal = d.stage === 'Closed Won' || d.stage === 'Closed Lost';
                    const isInitial = d.stage === 'New Opportunity';
                    const canMovePrev = d.stage === 'Closed Lost' || (!isInitial && PIPELINE_ORDER.includes(d.stage));
                    const canMoveNext = !isTerminal && PIPELINE_ORDER.includes(d.stage);

                    return (
                      <div
                        key={d.id}
                        onClick={() => setSelectedDeal(d)}
                        className="bg-white border border-[var(--border)] rounded-[12px] p-[12px] cursor-pointer hover:border-[#C5D6C1] hover:shadow-[0_2px_6px_rgba(0,0,0,0.04)] transition-all"
                      >
                        <div className="flex items-start justify-between gap-[8px]">
                          <div className="font-medium text-[13px] leading-tight text-[var(--text-primary)]">
                            {d.name}
                          </div>
                          {/* Compact left and right arrow controls */}
                          <div
                            className="flex items-center gap-[4px] shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              disabled={!canMovePrev}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveStage(d.id, 'prev');
                              }}
                              className="w-[24px] h-[24px] rounded-[6px] bg-[var(--input-bg)] hover:bg-[#EAECE8] disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                              title="Move to previous stage"
                              aria-label="Previous stage"
                            >
                              <ChevronLeft size={14} />
                            </button>
                            <button
                              type="button"
                              disabled={!canMoveNext}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveStage(d.id, 'next');
                              }}
                              className="w-[24px] h-[24px] rounded-[6px] bg-[var(--input-bg)] hover:bg-[#EAECE8] disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                              title="Advance to next stage"
                              aria-label="Next stage"
                            >
                              <ChevronRight size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="text-[12px] text-[var(--text-secondary)] mt-[4px]">
                          {d.company} • {d.leadName}
                        </div>
                        <div className="mt-[8px] flex items-center justify-between">
                          <div className="text-[12px] font-semibold text-[var(--text-primary)]">
                            ${d.value.toLocaleString()} {d.currency}
                          </div>
                          <StatusBadge label={d.priority} />
                        </div>
                        <div className="mt-[8px] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                          <span>Close {d.expectedCloseDate}</span>
                          <span>{d.owner.split(' ')[0]}</span>
                        </div>
                      </div>
                    );
                  })}
                  {stageDeals.length === 0 && (
                    <div className="py-[24px] text-center text-[12px] text-[var(--text-muted)]">
                      No deals in this stage.
                      <br />
                      Clear filters or add a deal.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedDeal && (
        <div
          className="fixed inset-0 z-[60] flex justify-end bg-black/20"
          onClick={() => setSelectedDeal(null)}
        >
          <div
            className="w-full max-w-[420px] bg-white h-full overflow-auto p-[20px] border-l border-[var(--border)]"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'slideIn 0.2s ease' }}
          >
            <div className="flex justify-between items-start mb-[16px]">
              <div>
                <div className="font-semibold text-[16px]">{selectedDeal.name}</div>
                <div className="text-[12px] text-[var(--text-muted)] mt-[2px]">
                  {selectedDeal.company} • {selectedDeal.leadName}
                </div>
              </div>
              <button
                onClick={() => setSelectedDeal(null)}
                className="p-[6px] rounded-[8px] bg-[var(--input-bg)] cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
            <div className="flex flex-wrap gap-[8px] mb-[14px]">
              <StatusBadge label={selectedDeal.stage} />
              <StatusBadge label={selectedDeal.priority} />
              <span className="text-[12px] px-[8px] py-[2px] rounded-full bg-[var(--input-bg)]">
                {selectedDeal.probability}% prob
              </span>
            </div>
            <div className="grid grid-cols-2 gap-[10px] mb-[14px] text-[12px]">
              <div className="bg-[var(--input-bg)] rounded-[10px] p-[10px]">
                <div className="text-[11px] text-[var(--text-muted)]">Value</div>
                <div className="font-semibold">
                  ${selectedDeal.value.toLocaleString()} {selectedDeal.currency}
                </div>
              </div>
              <div className="bg-[var(--input-bg)] rounded-[10px] p-[10px]">
                <div className="text-[11px] text-[var(--text-muted)]">Expected Close</div>
                <div className="font-semibold">{selectedDeal.expectedCloseDate}</div>
              </div>
              <div className="bg-[var(--input-bg)] rounded-[10px] p-[10px]">
                <div className="text-[11px] text-[var(--text-muted)]">Owner</div>
                <div className="font-medium">{selectedDeal.owner}</div>
              </div>
              <div className="bg-[var(--input-bg)] rounded-[10px] p-[10px]">
                <div className="text-[11px] text-[var(--text-muted)]">Branch</div>
                <div className="font-medium">{selectedDeal.branch}</div>
              </div>
            </div>
            <div className="mb-[14px]">
              <div className="text-[12px] font-medium mb-[6px]">Change Stage</div>
              <div className="flex flex-wrap gap-[6px]">
                {dealStages.map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStageChange(selectedDeal.id, st)}
                    className={`h-[30px] px-[10px] rounded-[8px] text-[11px] border cursor-pointer ${
                      selectedDeal.stage === st
                        ? 'bg-[var(--text-primary)] text-white border-[var(--text-primary)]'
                        : 'bg-white border-[var(--border)] hover:bg-[var(--input-bg)]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-[12px] text-[var(--text-secondary)] mb-[14px]">{selectedDeal.description}</div>
            <div className="text-[11px] text-[var(--text-muted)]">
              Last activity: {selectedDeal.lastActivityAt} • Created {selectedDeal.createdAt}
            </div>
          </div>
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 p-[16px]">
          <div className="w-full max-w-[520px] bg-white rounded-[16px] p-[20px] border border-[var(--border)] max-h-[90vh] overflow-auto">
            <div className="flex justify-between mb-[14px]">
              <div className="font-semibold">Add Deal</div>
              <button onClick={() => setShowAdd(false)} className="cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-[12px]">
              <div>
                <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">Deal Name *</label>
                <input
                  value={newDeal.name}
                  onChange={(e) => setNewDeal({ ...newDeal, name: e.target.value })}
                  placeholder="e.g. Enterprise License"
                  className="w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] text-[13px] text-[var(--text-primary)] border border-[var(--border)] focus:outline-none focus:border-[#76E05B] focus:ring-[2px] focus:ring-[#EFFBEA]"
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">Company *</label>
                <input
                  value={newDeal.company}
                  onChange={(e) => setNewDeal({ ...newDeal, company: e.target.value })}
                  placeholder="Company name"
                  className="w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] text-[13px] text-[var(--text-primary)] border border-[var(--border)] focus:outline-none focus:border-[#76E05B] focus:ring-[2px] focus:ring-[#EFFBEA]"
                />
              </div>
              <div className="grid grid-cols-2 gap-[10px]">
                <div>
                  <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">Value (USD) *</label>
                  <input
                    type="number"
                    value={newDeal.value}
                    onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })}
                    placeholder="50000"
                    className="w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] text-[13px] text-[var(--text-primary)] border border-[var(--border)] focus:outline-none focus:border-[#76E05B] focus:ring-[2px] focus:ring-[#EFFBEA]"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">Expected Close</label>
                  <input
                    type="date"
                    value={newDeal.expectedCloseDate}
                    onChange={(e) => setNewDeal({ ...newDeal, expectedCloseDate: e.target.value })}
                    className="w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] text-[13px] text-[var(--text-primary)] border border-[var(--border)] focus:outline-none focus:border-[#76E05B] focus:ring-[2px] focus:ring-[#EFFBEA]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-[10px]">
                <div>
                  <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">Stage</label>
                  <Dropdown
                    value={newDeal.stage}
                    onChange={(v: string) => setNewDeal({ ...newDeal, stage: v as DealStage })}
                    options={dealStages}
                  />
                </div>
                <div>
                  <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">Priority</label>
                  <Dropdown
                    value={newDeal.priority}
                    onChange={(v: string) => setNewDeal({ ...newDeal, priority: v as SalesTaskPriority })}
                    options={['High', 'Medium', 'Low']}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-[10px]">
                <div>
                  <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">Owner</label>
                  <Dropdown
                    value={newDeal.owner}
                    onChange={(v: string) => setNewDeal({ ...newDeal, owner: v })}
                    options={users}
                  />
                </div>
                <div>
                  <label className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]">Branch</label>
                  <Dropdown
                    value={newDeal.branch}
                    onChange={(v: string) => setNewDeal({ ...newDeal, branch: v })}
                    options={branches.slice(1)}
                  />
                </div>
              </div>
            </div>
            <div className="mt-[14px] flex justify-end gap-[8px]">
              <button
                onClick={() => setShowAdd(false)}
                className="h-[36px] px-[14px] rounded-[10px] bg-[var(--input-bg)] text-[13px] hover:bg-[#EAECE8] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDeal}
                disabled={!newDeal.name || !newDeal.company || !newDeal.value}
                className="h-[36px] px-[16px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold disabled:opacity-50 text-[#1B4D0F] hover:bg-[var(--primary-hover)] cursor-pointer"
              >
                Create Deal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
