import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  Check,
  Plus,
  AlertCircle,
  Search,
  X,
} from 'lucide-react';
import {
  CreditTransaction,
  CreditPackage,
  AuditLog,
  TeamMemberDetail,
} from '../../types/crm';
import { Dropdown } from '../../components/shared/Dropdown';
import { StatusBadge } from '../../components/shared/StatusBadge';

interface CreditsBillingPageProps {
  transactions: CreditTransaction[];
  setTransactions: React.Dispatch<React.SetStateAction<CreditTransaction[]>>;
  packages: CreditPackage[];
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp' | 'dateLabel'>) => void;
  teamMembers: TeamMemberDetail[];
}

export function CreditsBillingPage({
  transactions,
  setTransactions,
  packages,
  balance,
  setBalance,
  addAuditLog,
  teamMembers: _teamMembers,
}: CreditsBillingPageProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [dateFilter, setDateFilter] = useState('Last 30 Days');
  const [branchFilter, setBranchFilter] = useState('All Branches');
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
  const [showPurchase, setShowPurchase] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<CreditPackage | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      if (search && !`${t.activity} ${t.reference} ${t.actor}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (typeFilter !== 'All Types' && t.type !== typeFilter.toLowerCase()) return false;
      if (branchFilter !== 'All Branches' && t.branch !== branchFilter) return false;
      if (dateFilter === 'Last 7 Days') {
        const idx = transactions.indexOf(t);
        if (idx > 4) return false;
      }
      return true;
    });
  }, [transactions, search, typeFilter, branchFilter, dateFilter]);

  const usageStats = useMemo(() => {
    const consumed = transactions.filter(t => t.type === 'consumption').reduce((acc, t) => acc + Math.abs(t.amount), 0);
    const purchased = transactions.filter(t => t.type === 'purchase').reduce((acc, t) => acc + t.amount, 0);
    const thisMonthConsumed = transactions.slice(0, 5).filter(t => t.type === 'consumption').reduce((a, t) => a + Math.abs(t.amount), 0);
    return { consumed, purchased, thisMonthConsumed, remaining: balance };
  }, [transactions, balance]);

  const handlePurchaseConfirm = () => {
    const errs: Record<string, string> = {};
    if (!confirmChecked) errs.confirm = 'You must acknowledge this is a simulated demo purchase';
    if (!selectedPackage) errs.package = 'No package selected';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    if (!selectedPackage) return;
    const newBalance = balance + selectedPackage.credits;
    const newTx: CreditTransaction = {
      id: 'tx-' + Date.now(),
      date: new Date().toISOString().slice(0, 10),
      timestamp: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
      activity: `Credit Purchase — ${selectedPackage.name} Pack (${selectedPackage.credits} credits)`,
      type: 'purchase',
      amount: selectedPackage.credits,
      balanceAfter: newBalance,
      actor: 'Dominion Castiel',
      branch: 'Lagos Branch',
      reference: 'PUR-' + selectedPackage.name.toUpperCase() + '-' + Date.now().toString().slice(-6),
      status: 'Completed',
      isDemo: true,
    };
    setTransactions(prev => [newTx, ...prev]);
    setBalance(newBalance);
    addAuditLog({
      actor: 'Dominion Castiel',
      action: `Credit Purchase — ${selectedPackage.name} Pack`,
      actionType: 'Credit',
      affectedRecord: newTx.reference || newTx.id,
      affectedRecordType: 'Purchase',
      outcome: 'Success',
      details: `Simulated demo purchase: ${selectedPackage.name} Pack (${selectedPackage.credits} credits) for ₦${selectedPackage.priceNGN.toLocaleString()}. No real payment processed. Balance updated from ${balance} to ${newBalance}. Demo data.`,
      branch: 'Lagos Branch',
      isDemo: true,
      ip: '102.89.45.12',
      metadata: { credits: selectedPackage.credits, priceNGN: selectedPackage.priceNGN },
    });
    setPurchaseSuccess(selectedPackage);
    setShowPurchase(false);
    setSelectedPackage(null);
    setConfirmChecked(false);
    setTimeout(() => setPurchaseSuccess(null), 4000);
  };

  return (
    <div className="flex flex-col gap-[20px] max-w-[1600px]">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-[12px]">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight">Credits & Billing</h1>
          <p className="text-[14px] text-[var(--text-secondary)] mt-[2px] max-w-[680px]">
            Understand and manage your available lead credits. Track consumption, review transaction history, and purchase additional credits. All purchases are simulated demo transactions — no real payment is processed.
          </p>
        </div>
        <button
          onClick={() => setShowPurchase(true)}
          className="h-[40px] px-[20px] rounded-[10px] bg-[var(--primary)] text-[14px] font-semibold flex items-center gap-[8px]"
        >
          <DollarSign size={16} />Purchase Credits
        </button>
      </div>

      {purchaseSuccess && (
        <div className="bg-[#EFFBEA] border border-[#C5E8B7] rounded-[12px] p-[14px] flex items-center gap-[12px]">
          <div className="w-[32px] h-[32px] rounded-full bg-[#2E7D32] flex items-center justify-center">
            <Check size={18} className="text-white" />
          </div>
          <div>
            <div className="text-[13px] font-semibold">Demo purchase successful — {purchaseSuccess.name} Pack added</div>
            <div className="text-[12px] text-[var(--text-secondary)]">
              {purchaseSuccess.credits} credits added. New balance: {balance}. No real payment was processed. This is demo data.
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[16px]">
        <div className="lg:col-span-2 bg-white rounded-[16px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="flex justify-between items-start mb-[16px]">
            <div>
              <div className="text-[12px] uppercase tracking-[0.06em] text-[var(--text-muted)] font-medium">Current Credit Balance</div>
              <div className="flex items-baseline gap-[8px] mt-[6px]">
                <span className="text-[32px] font-semibold tracking-tight">{balance.toLocaleString()}</span>
                <span className="text-[14px] text-[var(--text-secondary)]">credits</span>
                <span className="ml-[8px] text-[11px] px-[8px] py-[2px] rounded-full bg-[#EFFBEA] text-[#166534]">Demo balance</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-[var(--text-muted)]">Last updated</div>
              <div className="text-[12px] font-medium">Today, 09:32 AM</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-[12px] mb-[16px]">
            <div className="bg-[var(--input-bg)] rounded-[10px] p-[12px]">
              <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-[0.06em]">Used This Month</div>
              <div className="text-[18px] font-semibold mt-[4px]">{usageStats.thisMonthConsumed}</div>
              <div className="text-[11px] text-[var(--text-secondary)]">credits consumed</div>
            </div>
            <div className="bg-[var(--input-bg)] rounded-[10px] p-[12px]">
              <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-[0.06em]">Total Consumed</div>
              <div className="text-[18px] font-semibold mt-[4px]">{usageStats.consumed}</div>
              <div className="text-[11px] text-[var(--text-secondary)]">all time (demo)</div>
            </div>
            <div className="bg-[var(--input-bg)] rounded-[10px] p-[12px]">
              <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-[0.06em]">Purchased</div>
              <div className="text-[18px] font-semibold mt-[4px]">{usageStats.purchased}</div>
              <div className="text-[11px] text-[var(--text-secondary)]">demo purchases</div>
            </div>
          </div>
          <div className="space-y-[8px]">
            <div className="flex justify-between text-[11px]">
              <span className="text-[var(--text-muted)]">Usage vs Remaining (demo)</span>
              <span className="font-medium">
                {balance > 0 ? Math.round((usageStats.thisMonthConsumed / (balance + usageStats.thisMonthConsumed)) * 100) : 0}% used
              </span>
            </div>
            <div className="w-full h-[8px] bg-[var(--input-bg)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--primary)] rounded-full transition-all"
                style={{ width: `${Math.min(100, Math.max(10, 100 - balance / 30))}%` }}
              />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-[16px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="text-[13px] font-semibold mb-[12px]">Quick Actions</div>
          <div className="flex flex-col gap-[10px]">
            <button
              onClick={() => setShowPurchase(true)}
              className="h-[44px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold flex items-center justify-center gap-[8px]"
            >
              <Plus size={16} />Purchase Credit Pack
            </button>
            <div className="bg-[var(--input-bg)] rounded-[10px] p-[12px] text-[11px] text-[var(--text-secondary)]">
              <div className="font-medium text-[var(--text-primary)] mb-[4px]">How credits work</div>
              • 1 credit = 1 lead discovered<br />
              • 0.5 credit = 1 email verified<br />
              • 1 credit = 1 contact enriched<br />
              • Demo: no real billing
            </div>
            <div className="bg-[#FFF4E5] border border-[#FED7AA] rounded-[10px] p-[12px] text-[11px] text-[#92400E]">
              <div className="font-medium flex items-center gap-[4px]">
                <AlertCircle size={12} /> Demo data notice
              </div>
              All balances and packages shown are demo data. No real payment details are collected and no transaction is processed via payment gateway.
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[14px] p-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col lg:flex-row gap-[12px] justify-between mb-[14px]">
          <div className="flex items-center gap-[8px]">
            <h2 className="text-[14px] font-semibold">Available Credit Packages</h2>
            <span className="text-[11px] px-[8px] py-[2px] rounded-full bg-[#F3F5F2] text-[var(--text-muted)]">Demo data</span>
          </div>
          <div className="text-[11px] text-[var(--text-muted)]">Prices shown are demo — no real payment</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[14px]">
          {packages.map(pkg => (
            <div
              key={pkg.id}
              className={`border rounded-[14px] p-[16px] flex flex-col gap-[12px] relative ${
                pkg.popular ? 'border-[#76E05B] shadow-[0_4px_12px_rgba(118,224,91,0.15)] bg-[#FBFFF8]' : 'border-[var(--border)] bg-white'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-[10px] left-[16px] bg-[var(--primary)] text-[11px] font-semibold px-[10px] py-[2px] rounded-full">
                  {pkg.badge}
                </div>
              )}
              <div>
                <div className="text-[16px] font-semibold">{pkg.name}</div>
                <div className="text-[11px] text-[var(--text-secondary)] mt-[2px]">{pkg.description}</div>
              </div>
              <div>
                <div className="flex items-baseline gap-[6px]">
                  <span className="text-[24px] font-semibold">₦{pkg.priceNGN.toLocaleString()}</span>
                  <span className="text-[11px] text-[var(--text-muted)]">/ ${pkg.priceUSD}</span>
                </div>
                <div className="text-[12px] font-medium mt-[2px]">{pkg.credits.toLocaleString()} credits</div>
              </div>
              <div className="flex flex-col gap-[6px]">
                {pkg.features.map(f => (
                  <div key={f} className="flex items-center gap-[6px] text-[11px] text-[var(--text-secondary)]">
                    <Check size={12} className="text-[#2E7D32]" />
                    {f}
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setSelectedPackage(pkg);
                  setShowPurchase(true);
                }}
                className={`h-[36px] rounded-[10px] text-[13px] font-semibold ${
                  pkg.popular ? 'bg-[var(--primary)]' : 'bg-[var(--input-bg)] border border-[var(--border)]'
                }`}
              >
                Select {pkg.name}
              </button>
              <div className="text-[10px] text-[var(--text-muted)] text-center">Demo package — simulated purchase</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[14px] p-[16px] shadow-sm">
        <div className="flex flex-col lg:flex-row gap-[12px] justify-between mb-[14px]">
          <div>
            <h2 className="text-[14px] font-semibold">Transaction History</h2>
            <p className="text-[11px] text-[var(--text-muted)]">
              Credit consumption history with dates, activities, and amounts. Demo and live activities distinguished.
            </p>
          </div>
          <div className="flex flex-wrap gap-[8px] items-center">
            <div className="relative">
              <Search size={14} className="absolute left-[10px] top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search activity, actor, ref"
                className="h-[36px] pl-[32px] pr-[12px] rounded-[10px] bg-[var(--input-bg)] border border-transparent text-[12px] w-[200px] focus:outline-none focus:border-[var(--primary)]"
                aria-label="Search transactions"
              />
            </div>
            <Dropdown value={typeFilter} onChange={setTypeFilter} options={['All Types', 'Consumption', 'Purchase', 'Adjustment', 'Refund']} />
            <Dropdown value={dateFilter} onChange={setDateFilter} options={['Last 30 Days', 'Last 7 Days', 'All Time']} />
            <Dropdown value={branchFilter} onChange={setBranchFilter} options={['All Branches', 'Lagos Branch', 'Abuja Branch', 'Port Harcourt Branch', 'Kano Branch']} />
            <button
              onClick={() => {
                setSearch('');
                setTypeFilter('All Types');
                setDateFilter('Last 30 Days');
                setBranchFilter('All Branches');
              }}
              className="h-[36px] px-[12px] rounded-[10px] bg-white border border-[var(--border)] text-[12px]"
            >
              Reset
            </button>
          </div>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] text-[11px] uppercase tracking-[0.06em] text-[var(--text-muted)]">
                <th className="py-[8px] px-[10px] font-medium">Date</th>
                <th className="py-[8px] px-[10px] font-medium">Activity</th>
                <th className="py-[8px] px-[10px] font-medium">Amount</th>
                <th className="py-[8px] px-[10px] font-medium">Balance After</th>
                <th className="py-[8px] px-[10px] font-medium">Actor</th>
                <th className="py-[8px] px-[10px] font-medium">Branch</th>
                <th className="py-[8px] px-[10px] font-medium">Type</th>
                <th className="py-[8px] px-[10px] font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(tx => (
                <tr key={tx.id} className="border-b border-[var(--border)]/60 hover:bg-[#F9FAF8]">
                  <td className="py-[10px] px-[10px] text-[12px] whitespace-nowrap">
                    <div className="font-medium">{tx.timestamp}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">{tx.reference}</div>
                  </td>
                  <td className="py-[10px] px-[10px] text-[12px]">
                    <div className="flex items-center gap-[6px]">
                      {tx.activity}
                      {tx.isDemo ? (
                        <span className="text-[10px] px-[6px] py-[1px] rounded-full bg-[#FFF4E5] text-[#92400E]">
                          Demo
                        </span>
                      ) : (
                        <span className="text-[10px] px-[6px] py-[1px] rounded-full bg-[#EFFBEA] text-[#166534]">
                          Live
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">{tx.branch}</div>
                  </td>
                  <td className={`py-[10px] px-[10px] text-[12px] font-semibold ${tx.amount > 0 ? 'text-[#166534]' : 'text-[#B91C1C]'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount}
                  </td>
                  <td className="py-[10px] px-[10px] text-[12px]">{tx.balanceAfter.toLocaleString()}</td>
                  <td className="py-[10px] px-[10px] text-[12px]">{tx.actor}</td>
                  <td className="py-[10px] px-[10px] text-[12px]">{tx.branch}</td>
                  <td className="py-[10px] px-[10px]"><StatusBadge label={tx.type} /></td>
                  <td className="py-[10px] px-[10px]"><StatusBadge label={tx.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-[24px] text-center text-[12px] text-[var(--text-muted)]">
              No transactions match your filters. Try resetting filters.
            </div>
          )}
        </div>
      </div>

      {showPurchase && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-[16px] bg-black/30">
          <div className="w-full max-w-[480px] bg-white rounded-[16px] border border-[var(--border)] shadow-xl">
            <div className="p-[20px] border-b border-[var(--border)] flex justify-between items-start">
              <div>
                <div className="font-semibold text-[15px]">Purchase Credits — Confirmation</div>
                <div className="text-[11px] text-[var(--text-muted)] mt-[2px]">Simulated demo workflow — no real payment will be processed</div>
              </div>
              <button onClick={() => setShowPurchase(false)} className="w-[32px] h-[32px] rounded-[8px] bg-[var(--input-bg)] flex items-center justify-center">
                <X size={16} />
              </button>
            </div>
            <div className="p-[20px] flex flex-col gap-[16px]">
              <div>
                <label className="text-[12px] font-medium">Selected Package *</label>
                <div className="mt-[6px]">
                  <Dropdown
                    placeholder="Select a package"
                    value={
                      selectedPackage
                        ? `${selectedPackage.name} — ${selectedPackage.credits} credits — ₦${selectedPackage.priceNGN.toLocaleString()} (Demo)`
                        : ''
                    }
                    options={packages.map(
                      p => `${p.name} — ${p.credits} credits — ₦${p.priceNGN.toLocaleString()} (Demo)`
                    )}
                    onChange={selectedStr => {
                      const matched = packages.find(
                        p => `${p.name} — ${p.credits} credits — ₦${p.priceNGN.toLocaleString()} (Demo)` === selectedStr
                      );
                      setSelectedPackage(matched || null);
                    }}
                    wrapperClassName="w-full"
                    className="w-full h-[40px]"
                    menuClassName="w-full"
                  />
                </div>
              </div>
              {selectedPackage && (
                <div className="bg-[var(--input-bg)] rounded-[10px] p-[12px] text-[12px]">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Package</span>
                    <span className="font-medium">{selectedPackage.name}</span>
                  </div>
                  <div className="flex justify-between mt-[6px]">
                    <span className="text-[var(--text-muted)]">Credits</span>
                    <span className="font-medium">{selectedPackage.credits.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mt-[6px]">
                    <span className="text-[var(--text-muted)]">Price (Demo)</span>
                    <span className="font-medium">₦{selectedPackage.priceNGN.toLocaleString()} / ${selectedPackage.priceUSD}</span>
                  </div>
                  <div className="flex justify-between mt-[6px]">
                    <span className="text-[var(--text-muted)]">New Balance After</span>
                    <span className="font-semibold">{(balance + selectedPackage.credits).toLocaleString()}</span>
                  </div>
                </div>
              )}
              <div className="bg-[#FFF4E5] border border-[#FED7AA] rounded-[10px] p-[12px] text-[11px] text-[#92400E]">
                This is a simulated purchase. No real payment gateway is called, no card or bank details are collected, and no money is transferred. The transaction will appear as Demo in history.
              </div>
              <label className="flex items-start gap-[8px] text-[12px]">
                <input
                  type="checkbox"
                  checked={confirmChecked}
                  onChange={e => setConfirmChecked(e.target.checked)}
                  className="mt-[2px]"
                />
                <span>I understand this is a simulated demo purchase and no real transaction will occur. I acknowledge the Demo data notice.</span>
              </label>
              {errors.confirm && (
                <div className="text-[11px] text-[#B91C1C] flex items-center gap-[4px]">
                  <AlertCircle size={12} />{errors.confirm}
                </div>
              )}
            </div>
            <div className="p-[20px] border-t border-[var(--border)] bg-[var(--bg)] flex justify-end gap-[8px]">
              <button onClick={() => setShowPurchase(false)} className="h-[40px] px-[16px] rounded-[10px] bg-white border border-[var(--border)] text-[13px]">
                Cancel
              </button>
              <button
                onClick={handlePurchaseConfirm}
                disabled={!selectedPackage}
                className="h-[40px] px-[20px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold flex items-center gap-[6px] disabled:opacity-50"
              >
                <DollarSign size={14} />Confirm Demo Purchase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
