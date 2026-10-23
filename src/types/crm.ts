export type LeadSource = 'LinkedIn' | 'Email' | 'Website' | 'Referral' | 'Other';
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'In Progress' | 'Completed' | 'Pending' | 'Failed';
export type Verification = 'Verified' | 'Invalid' | 'Risky' | 'Unknown' | 'Unverified';
export type Service = 'Web Development' | 'Marketing' | 'SEO' | 'Branding' | 'Consulting' | 'Product Design';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  source: LeadSource;
  location: string;
  service: Service;
  verification: Verification;
  status: LeadStatus;
  assignee: string;
  branch: string;
  createdAt: string;
  lastActivity: string;
  avatarColor: string;
  matchQuality?: 'High' | 'Medium' | 'Low';
}

export interface Task {
  id: string;
  title: string;
  company: string;
  assignee: string;
  due: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
}

export type CampaignStatus = 'Draft' | 'Scheduled' | 'Sending' | 'Sent';
export type DeliveryStatus = 'Delivered' | 'Bounced' | 'Failed' | 'Queued';
export type SequenceStatus = 'Active' | 'Paused' | 'Draft';
export type DealStage = 'New Opportunity' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
export type SalesTaskStatus = 'Todo' | 'In Progress' | 'Completed' | 'Overdue';
export type SalesTaskPriority = 'High' | 'Medium' | 'Low';
export type ActivityType = 'Call' | 'Email' | 'Meeting' | 'Note' | 'Stage Change';
export type MeetingType = 'in-person' | 'phone' | 'video' | 'other' | 'Call';
export type MeetingStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'No Show';

export interface Campaign {
  id: string;
  name: string;
  audience: string;
  status: CampaignStatus;
  sent: number;
  open: number;
  click: number;
  lastActivity: string;
  subject: string;
  branch: string;
  owner: string;
}

export interface Delivery {
  id: string;
  recipient: string;
  email: string;
  campaign: string;
  campaignId: string;
  status: DeliveryStatus;
  timestamp: string;
  error?: string;
  branch: string;
}

export interface Sequence {
  id: string;
  name: string;
  audience: string;
  status: SequenceStatus;
  steps: number;
  enrolled: number;
  performance: string;
  lastActivity: string;
  owner: string;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  subject: string;
  body: string;
  updated: string;
  usage: number;
}

export interface Deal {
  id: string;
  name: string;
  leadId: string;
  company: string;
  leadName: string;
  value: number;
  currency: string;
  stage: DealStage;
  probability: number;
  expectedCloseDate: string;
  owner: string;
  branch: string;
  description: string;
  createdAt: string;
  lastActivityAt: string;
  priority: SalesTaskPriority;
}

export interface SalesTask {
  id: string;
  title: string;
  leadId?: string;
  dealId?: string;
  leadName?: string;
  dealName?: string;
  company?: string;
  type: ActivityType | 'Follow-up' | 'Other';
  dueAt: string;
  dueLabel: 'Due Today' | 'Upcoming' | 'Overdue' | 'Completed';
  priority: SalesTaskPriority;
  status: SalesTaskStatus;
  assignee: string;
  branch: string;
  notes?: string;
  completedAt?: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  summary: string;
  leadId?: string;
  dealId?: string;
  leadName?: string;
  dealName?: string;
  company?: string;
  owner: string;
  occurredAt: string;
  outcome?: string;
  notes?: string;
}

export interface Meeting {
  id: string;
  type: MeetingType;
  title: string;
  leadId: string;
  leadName: string;
  dealId?: string;
  dealName?: string;
  company: string;
  owner: string;
  startAt: string;
  endAt: string;
  dateLabel: string;
  status: MeetingStatus;
  location?: string;
  meetingLink?: string;
  notes?: string;
  outcome?: string;
  duration?: string;
}

export type TeamRole = 'Admin' | 'Sales Manager' | 'SDR' | 'Account Executive' | 'Support Specialist' | 'Marketing Specialist';
export type TeamStatus = 'Active' | 'Away' | 'Offline' | 'On Leave';
export type BranchStatus = 'Active' | 'Inactive' | 'Pending';

export interface TeamMemberDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: TeamRole;
  status: TeamStatus;
  branch: string;
  location: string;
  avatarColor: string;
  joinedAt: string;
  bio: string;
  permissions: string[];
  leadsCount?: number;
  dealsCount?: number;
  tasksCount?: number;
  meetingsCount?: number;
  workload?: string;
  workloadCount?: number;
  qualifiedLeads?: number;
  wonDeals?: number;
  openDeals?: number;
}

export interface BranchDetail {
  id: string;
  name: string;
  location: string;
  address: string;
  manager: string;
  members: string[];
  status: BranchStatus;
  phone: string;
  email: string;
  createdAt: string;
  leadCapacity: number;
  description: string;
  leadsCount?: number;
  dealsCount?: number;
  wonCount?: number;
  wonValue?: number;
  utilization?: number;
}

export interface CreditTransaction {
  id: string;
  date: string;
  timestamp: string;
  activity: string;
  type: 'consumption' | 'purchase' | 'adjustment' | 'refund';
  amount: number;
  balanceAfter: number;
  actor: string;
  branch: string;
  reference?: string;
  status: 'Completed' | 'Pending' | 'Failed';
  isDemo: boolean;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  priceNGN: number;
  priceUSD: number;
  popular?: boolean;
  features: string[];
  description: string;
  isDemo: boolean;
  badge?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  dateLabel: string;
  actor: string;
  action: string;
  actionType: 'Lead' | 'Deal' | 'Credit' | 'Settings' | 'Team' | 'Branch' | 'Integration' | 'Campaign' | 'Auth' | 'System';
  affectedRecord: string;
  affectedRecordType?: string;
  outcome: 'Success' | 'Failed' | 'Pending';
  details: string;
  ip?: string;
  branch: string;
  isDemo: boolean;
  metadata?: Record<string, any>;
}

export interface WorkspaceSettings {
  workspaceName: string;
  tagline: string;
  website: string;
  defaultBranch: string;
  defaultCurrency: string;
  timezone: string;
  dateFormat: string;
  logoLetter: string;
}

export interface ProfileSettings {
  displayName: string;
  email: string;
  role: string;
  phone: string;
  language: string;
  personalTimezone: string;
  bio: string;
}

export interface NotificationSettings {
  newLeadAssigned: boolean;
  dealStageChanged: boolean;
  creditLow: boolean;
  weeklyReport: boolean;
  taskDue: boolean;
  integrationFailed: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  slackNotifications: boolean;
}

export interface SecurityPreferences {
  defaultLandingPage: string;
  density: 'Comfortable' | 'Compact';
  timeFormat: '12h' | '24h';
  showAvatars: boolean;
  autoSave: boolean;
  activityTimeout: string;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  logoUrl: string;
  officialSource: string;
  status: 'Connected' | 'Disconnected' | 'Pending';
  connectedAt?: string;
  features: string[];
  config: {
    id: string;
    label: string;
    type: 'text' | 'email' | 'select' | 'textarea';
    required: boolean;
    placeholder?: string;
    options?: string[];
  }[];
}
