import { AuditLog, CreditPackage, CreditTransaction, NotificationSettings, ProfileSettings, SecurityPreferences, WorkspaceSettings } from '../../types/crm';

export const initialCreditTransactions: CreditTransaction[] = [
  { id: 'tx-1', date: '2026-05-10', timestamp: '10 May 2026, 09:32 AM', activity: 'Lead Discovery — Lagos Tech (24 leads)', type: 'consumption', amount: -48, balanceAfter: 2452, actor: 'Dominion Castiel', branch: 'Lagos Branch', reference: 'LD-2026-0510-01', status: 'Completed', isDemo: false },
  { id: 'tx-2', date: '2026-05-09', timestamp: '09 May 2026, 04:12 PM', activity: 'Email Verification — 120 emails', type: 'consumption', amount: -60, balanceAfter: 2500, actor: 'Sarah Okafor', branch: 'Lagos Branch', reference: 'EV-120', status: 'Completed', isDemo: false },
  { id: 'tx-3', date: '2026-05-08', timestamp: '08 May 2026, 11:45 AM', activity: 'Credit Purchase — Growth Pack (2000 credits)', type: 'purchase', amount: 2000, balanceAfter: 2560, actor: 'Dominion Castiel', branch: 'Lagos Branch', reference: 'PUR-GROWTH-08', status: 'Completed', isDemo: true },
  { id: 'tx-4', date: '2026-05-07', timestamp: '07 May 2026, 02:30 PM', activity: 'Import & Enrichment — 85 contacts', type: 'consumption', amount: -85, balanceAfter: 560, actor: 'Mark Benson', branch: 'Abuja Branch', reference: 'IMP-85', status: 'Completed', isDemo: false },
  { id: 'tx-5', date: '2026-05-06', timestamp: '06 May 2026, 10:00 AM', activity: 'Campaign Send — Q2 Product Launch (124 emails)', type: 'consumption', amount: -62, balanceAfter: 645, actor: 'Dominion Castiel', branch: 'Lagos Branch', reference: 'CMP-c1', status: 'Completed', isDemo: false },
  { id: 'tx-6', date: '2026-05-05', timestamp: '05 May 2026, 09:15 AM', activity: 'Credit Adjustment — Bonus for onboarding', type: 'adjustment', amount: 250, balanceAfter: 707, actor: 'System', branch: 'All Branches', reference: 'ADJ-BONUS', status: 'Completed', isDemo: true },
  { id: 'tx-7', date: '2026-05-04', timestamp: '04 May 2026, 03:20 PM', activity: 'Lead Discovery — Marketing Agencies (18 leads)', type: 'consumption', amount: -36, balanceAfter: 457, actor: 'Aisha Bello', branch: 'Port Harcourt Branch', reference: 'LD-2026-0504-02', status: 'Completed', isDemo: true },
  { id: 'tx-8', date: '2026-05-03', timestamp: '03 May 2026, 08:45 AM', activity: 'Credit Purchase — Starter Pack (500 credits)', type: 'purchase', amount: 500, balanceAfter: 493, actor: 'Tunde Cole', branch: 'Kano Branch', reference: 'PUR-STARTER-03', status: 'Completed', isDemo: true },
];

export const initialCreditPackages: CreditPackage[] = [
  { id: 'pkg-starter', name: 'Starter', credits: 500, priceNGN: 25000, priceUSD: 32, description: 'Perfect for small teams testing lead discovery', features: ['500 lead credits', 'Email verification (0.5 credit/email)', 'Basic enrichment', 'Email support'], isDemo: true, badge: 'Most affordable' },
  { id: 'pkg-growth', name: 'Growth', credits: 2000, priceNGN: 85000, priceUSD: 110, popular: true, description: 'Best for growing sales teams in Lagos & Abuja', features: ['2000 lead credits', 'Advanced verification', 'Full enrichment suite', 'Priority support', 'Branch analytics'], isDemo: true, badge: 'Most popular' },
  { id: 'pkg-scale', name: 'Scale', credits: 5000, priceNGN: 190000, priceUSD: 245, description: 'For high-volume outreach and multi-branch operations', features: ['5000 lead credits', 'Unlimited verification', 'Premium enrichment', 'Dedicated manager', 'Custom integrations'], isDemo: true, badge: 'Best value' },
  { id: 'pkg-enterprise', name: 'Enterprise', credits: 15000, priceNGN: 500000, priceUSD: 645, description: 'Custom volume for enterprise operations (demo data)', features: ['15000+ lead credits', 'SLA & compliance', 'Custom branch limits', 'Onsite training', 'Audit support'], isDemo: true, badge: 'Demo Enterprise' },
];

export const initialAuditLogs: AuditLog[] = [
  { id: 'audit-1', timestamp: '2026-05-10 09:32:15', dateLabel: '10 May 2026, 09:32 AM', actor: 'Dominion Castiel', action: 'Lead Discovery — 24 leads imported', actionType: 'Lead', affectedRecord: 'LD-2026-0510-01', affectedRecordType: 'Lead Batch', outcome: 'Success', details: 'Imported 24 technology leads from Lagos via Lead Discovery. 48 credits consumed. Branch: Lagos Branch.', ip: '102.89.45.12', branch: 'Lagos Branch', isDemo: false, metadata: { credits: -48, source: 'LinkedIn' } },
  { id: 'audit-2', timestamp: '2026-05-10 08:15:42', dateLabel: '10 May 2026, 08:15 AM', actor: 'Sarah Okafor', action: 'Deal stage changed — Qualified → Proposal', actionType: 'Deal', affectedRecord: 'deal-12', affectedRecordType: 'Deal', outcome: 'Success', details: 'Deal TechCorp — Website Redesign moved from Qualified to Proposal. Value: ₦2,500,000.', ip: '102.89.45.13', branch: 'Lagos Branch', isDemo: false, metadata: { from: 'Qualified', to: 'Proposal' } },
  { id: 'audit-3', timestamp: '2026-05-09 16:12:08', dateLabel: '09 May 2026, 04:12 PM', actor: 'Sarah Okafor', action: 'Email Verification — 120 emails', actionType: 'Lead', affectedRecord: 'EV-120', affectedRecordType: 'Verification Batch', outcome: 'Success', details: 'Verified 120 emails. 98 verified, 12 risky, 10 invalid. 60 credits consumed.', ip: '102.89.45.13', branch: 'Lagos Branch', isDemo: false, metadata: { verified: 98 } },
  { id: 'audit-4', timestamp: '2026-05-09 10:00:00', dateLabel: '09 May 2026, 10:00 AM', actor: 'System', action: 'Credit low warning triggered', actionType: 'Credit', affectedRecord: 'Balance: 560 credits', affectedRecordType: 'Credit Balance', outcome: 'Success', details: 'Credit balance dropped below 600. Notification sent to Dominion Castiel.', ip: 'System', branch: 'All Branches', isDemo: true, metadata: { threshold: 600 } },
  { id: 'audit-5', timestamp: '2026-05-08 11:45:22', dateLabel: '08 May 2026, 11:45 AM', actor: 'Dominion Castiel', action: 'Credit Purchase — Growth Pack', actionType: 'Credit', affectedRecord: 'PUR-GROWTH-08', affectedRecordType: 'Purchase', outcome: 'Success', details: 'Simulated demo purchase: Growth Pack (2000 credits) for ₦85,000. No real payment processed. Balance updated from 560 to 2560.', ip: '102.89.45.12', branch: 'Lagos Branch', isDemo: true, metadata: { credits: 2000, priceNGN: 85000 } },
  { id: 'audit-6', timestamp: '2026-05-08 09:20:11', dateLabel: '08 May 2026, 09:20 AM', actor: 'Mark Benson', action: 'Branch created — Kano Branch (seeded)', actionType: 'Branch', affectedRecord: 'branch-kano', affectedRecordType: 'Branch', outcome: 'Success', details: 'Seeded demo branch: Kano Branch created with capacity 800. Manager: Tunde Cole.', ip: '102.89.44.98', branch: 'Kano Branch', isDemo: true, metadata: { capacity: 800 } },
  { id: 'audit-7', timestamp: '2026-05-07 14:30:55', dateLabel: '07 May 2026, 02:30 PM', actor: 'Aisha Bello', action: 'Integration connected — Slack (Demo)', actionType: 'Integration', affectedRecord: 'slack', affectedRecordType: 'Integration', outcome: 'Success', details: 'Simulated demo connection to Slack. Channel: #sales-alerts. No real OAuth performed.', ip: '102.89.45.14', branch: 'Port Harcourt Branch', isDemo: true, metadata: { integration: 'Slack' } },
  { id: 'audit-8', timestamp: '2026-05-07 10:15:33', dateLabel: '07 May 2026, 10:15 AM', actor: 'Dominion Castiel', action: 'Settings updated — Workspace', actionType: 'Settings', affectedRecord: 'workspace-settings', affectedRecordType: 'Settings', outcome: 'Success', details: 'Workspace name updated, default branch changed to Lagos Branch. Simulated save.', ip: '102.89.45.12', branch: 'Lagos Branch', isDemo: false, metadata: { fields: ['workspaceName','defaultBranch'] } },
  { id: 'audit-9', timestamp: '2026-05-06 15:42:10', dateLabel: '06 May 2026, 03:42 PM', actor: 'Tunde Cole', action: 'Lead status changed — New → Contacted', actionType: 'Lead', affectedRecord: 'lead-24', affectedRecordType: 'Lead', outcome: 'Success', details: 'Lead Chidi Okoro (TechCorp) status updated. Assigned to Tunde Cole.', ip: '102.89.44.99', branch: 'Kano Branch', isDemo: false, metadata: { leadId: 'lead-24' } },
  { id: 'audit-10', timestamp: '2026-05-06 11:00:00', dateLabel: '06 May 2026, 11:00 AM', actor: 'Dominion Castiel', action: 'Campaign sent — Q2 Product Launch', actionType: 'Campaign', affectedRecord: 'c1', affectedRecordType: 'Campaign', outcome: 'Success', details: 'Campaign Q2 Product Launch sent to 124 recipients. 62 credits consumed.', ip: '102.89.45.12', branch: 'Lagos Branch', isDemo: false, metadata: { sent: 124 } },
  { id: 'audit-11', timestamp: '2026-05-05 09:15:00', dateLabel: '05 May 2026, 09:15 AM', actor: 'System', action: 'Credit adjustment — Bonus', actionType: 'Credit', affectedRecord: 'ADJ-BONUS', affectedRecordType: 'Adjustment', outcome: 'Success', details: 'System granted 250 bonus credits for onboarding completion. Seeded demo adjustment.', ip: 'System', branch: 'All Branches', isDemo: true, metadata: { bonus: 250 } },
  { id: 'audit-12', timestamp: '2026-05-04 16:20:44', dateLabel: '04 May 2026, 04:20 PM', actor: 'Sarah Okafor', action: 'Team role updated — Mark Benson: SDR → Sales Manager', actionType: 'Team', affectedRecord: 'tm3', affectedRecordType: 'Team Member', outcome: 'Success', details: 'Role updated from SDR to Sales Manager for Abuja Branch. Permission set changed.', ip: '102.89.45.13', branch: 'Abuja Branch', isDemo: true, metadata: { from: 'SDR', to: 'Sales Manager' } },
];

export const initialWorkspaceSettings: WorkspaceSettings = {
  workspaceName: 'LeadFlow CRM',
  tagline: 'Discover. Rate. Convert. Measure.',
  website: 'https://leadflow.ng',
  defaultBranch: 'Lagos Branch',
  defaultCurrency: 'NGN (₦)',
  timezone: 'Africa/Lagos (WAT, UTC+1)',
  dateFormat: 'DD MMM YYYY',
  logoLetter: 'LF',
};

export const initialProfileSettings: ProfileSettings = {
  displayName: 'Dominion Castiel',
  email: 'dominion@leadflow.ng',
  role: 'Admin',
  phone: '+234 803 100 1001',
  language: 'English (EN)',
  personalTimezone: 'Africa/Lagos (WAT, UTC+1)',
  bio: 'Founder & Admin overseeing all operations and branch coordination across Lagos, Abuja, Port Harcourt and Kano.',
};

export const initialNotificationSettings: NotificationSettings = {
  newLeadAssigned: true,
  dealStageChanged: true,
  creditLow: true,
  weeklyReport: true,
  taskDue: true,
  integrationFailed: false,
  emailNotifications: true,
  pushNotifications: false,
  slackNotifications: true,
};

export const initialSecurityPreferences: SecurityPreferences = {
  defaultLandingPage: 'Overview',
  density: 'Comfortable',
  timeFormat: '12h',
  showAvatars: true,
  autoSave: true,
  activityTimeout: '30 minutes',
};
