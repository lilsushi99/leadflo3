import React from 'react';

export const badgeStyles: Record<string, { bg: string; text: string }> = {
  New: { bg: '#F3F5F2', text: '#69716A' },
  Contacted: { bg: '#E8F0FE', text: '#1A56DB' },
  Qualified: { bg: '#EFFBEA', text: '#2E7D32' },
  'In Progress': { bg: '#FFF4E5', text: '#B45309' },
  Completed: { bg: '#EFFBEA', text: '#2E7D32' },
  Pending: { bg: '#FFF7D6', text: '#92400E' },
  Failed: { bg: '#FEECEC', text: '#B91C1C' },
  Verified: { bg: '#EFFBEA', text: '#166534' },
  Invalid: { bg: '#FEECEC', text: '#991B1B' },
  Unknown: { bg: '#F3F5F2', text: '#69716A' },
  Unverified: { bg: '#F3F5F2', text: '#69716A' },
  Risky: { bg: '#FFF4E5', text: '#9A3412' },
  High: { bg: '#FEECEC', text: '#B91C1C' },
  Medium: { bg: '#FFF4E5', text: '#B45309' },
  Low: { bg: '#F3F5F2', text: '#69716A' },
  Draft: { bg: '#F3F5F2', text: '#69716A' },
  Scheduled: { bg: '#E8F0FE', text: '#1A56DB' },
  Sending: { bg: '#E8F0FE', text: '#1A56DB' },
  Sent: { bg: '#EFFBEA', text: '#2E7D32' },
  Delivered: { bg: '#EFFBEA', text: '#166534' },
  Bounced: { bg: '#FEECEC', text: '#991B1B' },
  Queued: { bg: '#FFF7D6', text: '#92400E' },
  Active: { bg: '#EFFBEA', text: '#2E7D32' },
  Paused: { bg: '#FFF4E5', text: '#B45309' },
  'New Opportunity': { bg: '#E8F0FE', text: '#1A56DB' },
  Proposal: { bg: '#FFF4E5', text: '#B45309' },
  Negotiation: { bg: '#F3E8FF', text: '#7C3AED' },
  'Closed Won': { bg: '#EFFBEA', text: '#166534' },
  'Closed Lost': { bg: '#FEECEC', text: '#991B1B' },
  Todo: { bg: '#F3F5F2', text: '#69716A' },
  'Due Today': { bg: '#FFF4E5', text: '#B45309' },
  Upcoming: { bg: '#E8F0FE', text: '#1A56DB' },
  Overdue: { bg: '#FEECEC', text: '#B91C1C' },
  Call: { bg: '#E8F0FE', text: '#1A56DB' },
  Email: { bg: '#F3E8FF', text: '#7C3AED' },
  Meeting: { bg: '#EFFBEA', text: '#2E7D32' },
  Note: { bg: '#F3F5F2', text: '#69716A' },
  'Stage Change': { bg: '#FFF4E5', text: '#92400E' },
  'in-person': { bg: '#EFFBEA', text: '#166534' },
  phone: { bg: '#E8F0FE', text: '#1A56DB' },
  video: { bg: '#F3E8FF', text: '#7C3AED' },
  other: { bg: '#F3F5F2', text: '#69716A' },
  Sales: { bg: '#EFFBEA', text: '#166534' },
  'Follow-up': { bg: '#FFF4E5', text: '#92400E' },
  Marketing: { bg: '#E8F0FE', text: '#1A56DB' },
  purchase: { bg: '#EFFBEA', text: '#166534' },
  consumption: { bg: '#FEECEC', text: '#991B1B' },
  adjustment: { bg: '#E8F0FE', text: '#1A56DB' },
  refund: { bg: '#FFF4E5', text: '#B45309' },
  Credit: { bg: '#EFFBEA', text: '#166534' },
  Settings: { bg: '#F3E8FF', text: '#7C3AED' },
  Team: { bg: '#E8F0FE', text: '#1A56DB' },
  Branch: { bg: '#FFF4E5', text: '#92400E' },
  Integration: { bg: '#F3F5F2', text: '#69716A' },
  Campaign: { bg: '#E8F0FE', text: '#1A56DB' },
  System: { bg: '#F3F5F2', text: '#69716A' },
  Success: { bg: '#EFFBEA', text: '#166534' },
  Lead: { bg: '#EFFBEA', text: '#166534' },
  Deal: { bg: '#E8F0FE', text: '#1A56DB' },
  Auth: { bg: '#F3F5F2', text: '#69716A' },
};

export function StatusBadge({ label }: { label: string }) {
  const s = badgeStyles[label] || { bg: '#F3F5F2', text: '#69716A' };
  return (
    <span
      style={{ background: s.bg, color: s.text }}
      className="inline-flex items-center px-[8px] py-[2px] rounded-[6px] text-[11px] font-medium leading-[18px] whitespace-nowrap"
    >
      {label}
    </span>
  );
}
