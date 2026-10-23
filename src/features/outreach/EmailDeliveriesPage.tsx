import React, { useState, useMemo } from 'react';
import { Search, Mail, CheckCircle2, AlertTriangle, XCircle, SearchX } from 'lucide-react';
import { Delivery } from '../../types/crm';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { Dropdown } from '../../components/shared/Dropdown';

interface EmailDeliveriesPageProps {
  deliveries: Delivery[];
}

export function EmailDeliveriesPage({ deliveries }: EmailDeliveriesPageProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = useMemo(
    () =>
      deliveries.filter((d: Delivery) => {
        if (
          search &&
          !`${d.recipient} ${d.email} ${d.campaign}`
            .toLowerCase()
            .includes(search.toLowerCase())
        )
          return false;
        if (statusFilter !== 'All' && d.status !== statusFilter) return false;
        return true;
      }),
    [deliveries, search, statusFilter]
  );

  const total = deliveries.length;
  const delivered = deliveries.filter((d: Delivery) => d.status === 'Delivered').length;
  const bounced = deliveries.filter((d: Delivery) => d.status === 'Bounced').length;
  const failed = deliveries.filter((d: Delivery) => d.status === 'Failed').length;

  return (
    <div className="flex flex-col gap-[20px] max-w-[1440px]">
      <div>
        <h1 className="text-[24px] font-semibold tracking-tight">Email Deliveries</h1>
        <p className="text-[14px] text-[var(--text-secondary)] mt-[2px]">
          Monitor delivery status across campaigns.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[16px]">
        {[
          {
            label: 'Total',
            value: total,
            icon: Mail,
            bg: 'bg-[#EBF5FF]',
            iconColor: 'text-[#2563EB]',
          },
          {
            label: 'Delivered',
            value: delivered,
            icon: CheckCircle2,
            bg: 'bg-[#EFFBEA]',
            iconColor: 'text-[#16A34A]',
          },
          {
            label: 'Bounced',
            value: bounced,
            icon: AlertTriangle,
            bg: 'bg-[#FEF3C7]',
            iconColor: 'text-[#D97706]',
          },
          {
            label: 'Failed',
            value: failed,
            icon: XCircle,
            bg: 'bg-[#FEE2E2]',
            iconColor: 'text-[#DC2626]',
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
            <div className="text-[26px] font-semibold leading-none tracking-tight">{s.value.toLocaleString()}</div>
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
              placeholder="Search recipient, email, campaign..."
              className="w-full h-[38px] pl-[36px] pr-[12px] rounded-[10px] bg-[var(--input-bg)] border border-transparent text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:bg-white focus:ring-[2px] focus:ring-[var(--primary-soft)] transition-all"
            />
          </div>
          <div className="flex gap-[8px]">
            <Dropdown
              value={statusFilter}
              onChange={setStatusFilter}
              options={['All', 'Delivered', 'Bounced', 'Failed', 'Queued']}
            />
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('All');
              }}
              className="h-[36px] px-[12px] rounded-[10px] bg-[var(--input-bg)] text-[13px] hover:bg-[#EAECE8] cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="text-[11px] text-[var(--text-muted)] border-b border-[var(--border)]">
              <tr>
                <th className="text-left py-[8px]">Recipient</th>
                <th className="text-left">Campaign</th>
                <th className="text-left">Status</th>
                <th className="text-left">Time</th>
                <th className="text-left">Error</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d: Delivery) => (
                <tr key={d.id} className="border-b border-[#F3F5F2] text-[13px]">
                  <td className="py-[10px]">
                    <div className="font-medium">{d.recipient}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">{d.email}</div>
                  </td>
                  <td className="text-[12px]">{d.campaign}</td>
                  <td>
                    <StatusBadge label={d.status} />
                  </td>
                  <td className="text-[12px] text-[var(--text-muted)]">{d.timestamp}</td>
                  <td className="text-[11px] text-[#B91C1C]">{d.error || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-[40px] flex flex-col items-center text-center">
            <SearchX size={20} className="text-[var(--text-muted)] mb-[8px]" />
            <div className="text-[13px] text-[var(--text-muted)]">No matching deliveries. Clear filters to see all.</div>
          </div>
        )}
      </div>
    </div>
  );
}
