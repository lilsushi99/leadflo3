import { BranchDetail, Integration, TeamMemberDetail } from '../../types/crm';

export const initialTeamMembers: TeamMemberDetail[] = [
  { id: 'tm1', name: 'Dominion Castiel', email: 'dominion@leadflow.ng', phone: '+234 803 100 1001', role: 'Admin', status: 'Active', branch: 'Lagos Branch', location: 'Lagos', avatarColor: '#E8F0FE', joinedAt: '15 Jan 2023', bio: 'Founder & Admin overseeing all operations and branch coordination.', permissions: ['all'] },
  { id: 'tm2', name: 'Sarah Okafor', email: 'sarah.okafor@leadflow.ng', phone: '+234 803 100 1002', role: 'Sales Manager', status: 'Active', branch: 'Lagos Branch', location: 'Lagos', avatarColor: '#EFFBEA', joinedAt: '10 Mar 2023', bio: 'Leads sales team in Lagos, manages high-value deals.', permissions: ['leads:write','deals:write','team:read'] },
  { id: 'tm3', name: 'Mark Benson', email: 'mark.benson@leadflow.ng', phone: '+234 803 100 1003', role: 'SDR', status: 'Active', branch: 'Abuja Branch', location: 'Abuja', avatarColor: '#FFF4E5', joinedAt: '22 Apr 2023', bio: 'Sales Development Representative focused on outbound and qualification.', permissions: ['leads:write','activities:write'] },
  { id: 'tm4', name: 'Aisha Bello', email: 'aisha.bello@leadflow.ng', phone: '+234 803 100 1004', role: 'Account Executive', status: 'Away', branch: 'Port Harcourt Branch', location: 'Port Harcourt', avatarColor: '#FEECEC', joinedAt: '05 May 2023', bio: 'Manages key accounts in PH region, closing and expansion.', permissions: ['deals:write','meetings:write'] },
  { id: 'tm5', name: 'Tunde Cole', email: 'tunde.cole@leadflow.ng', phone: '+234 803 100 1005', role: 'Support Specialist', status: 'Active', branch: 'Kano Branch', location: 'Kano', avatarColor: '#EEF2FF', joinedAt: '18 Jun 2023', bio: 'Customer success and lead enrichment specialist.', permissions: ['leads:read','tasks:write'] },
];

export const initialBranchDetails: BranchDetail[] = [
  { id: 'branch-lagos', name: 'Lagos Branch', location: 'Lagos, Nigeria', address: '12 Adeola Odeku Street, Victoria Island, Lagos', manager: 'Dominion Castiel', members: ['Dominion Castiel', 'Sarah Okafor'], status: 'Active', phone: '+234 1 234 5678', email: 'lagos@leadflow.ng', createdAt: '10 Jan 2023', leadCapacity: 2000, description: 'Headquarters - Primary sales and operations hub for South-West.' },
  { id: 'branch-abuja', name: 'Abuja Branch', location: 'Abuja, Nigeria', address: '5 Constitution Avenue, Central Area, Abuja', manager: 'Mark Benson', members: ['Mark Benson'], status: 'Active', phone: '+234 9 123 4567', email: 'abuja@leadflow.ng', createdAt: '15 Feb 2023', leadCapacity: 1200, description: 'Capital region sales office handling government and enterprise leads.' },
  { id: 'branch-ph', name: 'Port Harcourt Branch', location: 'Port Harcourt, Nigeria', address: '32 Peter Odili Road, Port Harcourt', manager: 'Aisha Bello', members: ['Aisha Bello'], status: 'Active', phone: '+234 84 123 456', email: 'ph@leadflow.ng', createdAt: '20 Mar 2023', leadCapacity: 1000, description: 'South-South region operations and oil & gas accounts.' },
  { id: 'branch-kano', name: 'Kano Branch', location: 'Kano, Nigeria', address: '10 Zoo Road, Kano', manager: 'Tunde Cole', members: ['Tunde Cole'], status: 'Active', phone: '+234 64 123 456', email: 'kano@leadflow.ng', createdAt: '05 Apr 2023', leadCapacity: 800, description: 'Northern region coverage and support.' },
];

export const initialIntegrations: Integration[] = [
  {
    id: 'flutterwave',
    name: 'Flutterwave',
    description: 'Accept payments across Africa with cards, bank transfers, and mobile money. Sync transactions to deals.',
    category: 'Payments',
    logoUrl: 'https://flutterwave.com/images/logo/full.svg',
    officialSource: 'https://flutterwave.com — official brand asset full.svg',
    status: 'Disconnected',
    features: ['Payment sync to deals', 'Auto receipt emails', 'Multi-currency'],
    config: [
      { id: 'env', label: 'Environment', type: 'select', options: ['Sandbox (Demo)', 'Live'], required: true, placeholder: 'Select environment' },
      { id: 'branch', label: 'Default Branch for Payments', type: 'select', options: ['Lagos Branch','Abuja Branch','Port Harcourt Branch','Kano Branch'], required: true, placeholder: 'Select default branch' },
      { id: 'sync', label: 'Sync Frequency', type: 'select', options: ['Real-time (Demo simulation)', 'Hourly', 'Daily'], required: true, placeholder: 'Choose sync frequency' },
      { id: 'notify', label: 'Payment Notification Email', type: 'email', required: false, placeholder: 'Enter notification email e.g. finance@leadflow.ng' },
      { id: 'notes', label: 'Integration Notes', type: 'textarea', required: false, placeholder: 'Enter notes about this integration e.g. Used for enterprise collections' },
    ]
  },
  {
    id: 'paystack',
    name: 'Paystack',
    description: 'Nigeria-first payment gateway for cards and bank. Attach Paystack transactions to leads and deals.',
    category: 'Payments',
    logoUrl: 'https://s3-eu-west-1.amazonaws.com/pstk-integration-logos/paystack.jpg',
    officialSource: 'https://docs-v2.paystack.com / Paystack S3 integration logos bucket — official Paystack asset',
    status: 'Connected',
    connectedAt: '12 Feb 2026',
    features: ['Lead to payment linking', 'Settlement reports', 'Fraud detection sync'],
    config: [
      { id: 'env', label: 'Environment', type: 'select', options: ['Test Mode (Demo)', 'Live Mode'], required: true, placeholder: 'Select environment' },
      { id: 'branch', label: 'Settlement Branch', type: 'select', options: ['Lagos Branch','Abuja Branch','Port Harcourt Branch','Kano Branch'], required: true, placeholder: 'Select settlement branch' },
      { id: 'sync', label: 'Auto-create Lead on Payment', type: 'select', options: ['Yes - simulated demo', 'No'], required: true, placeholder: 'Choose behavior' },
      { id: 'notify', label: 'Settlement Notification Email', type: 'email', required: false, placeholder: 'Enter email e.g. finance@leadflow.ng' },
    ]
  },
  {
    id: 'google-workspace',
    name: 'Google Workspace',
    description: 'Connect Gmail, Calendar, Drive, and Docs. Central workspace for team collaboration and lead files.',
    category: 'Productivity',
    logoUrl: 'https://workspace.google.com/static/img/google-workspace-logo.svg',
    officialSource: 'https://workspace.google.com/static/img/google-workspace-logo.svg — official Google Workspace static asset',
    status: 'Disconnected',
    features: ['Calendar sync', 'Drive file linking', 'Team directory'],
    config: [
      { id: 'branch', label: 'Primary Branch Workspace', type: 'select', options: ['Lagos Branch','Abuja Branch','Port Harcourt Branch','Kano Branch'], required: true, placeholder: 'Select primary branch' },
      { id: 'sync', label: 'Calendar Sync Scope', type: 'select', options: ['Meetings only (Demo)', 'All events'], required: true, placeholder: 'Choose sync scope' },
      { id: 'notify', label: 'Workspace Admin Email', type: 'email', required: false, placeholder: 'Enter admin email e.g. admin@leadflow.ng' },
      { id: 'notes', label: 'Workspace Notes', type: 'textarea', required: false, placeholder: 'Enter notes e.g. Used for South-West region docs' },
    ]
  },
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Sync outreach emails, track opens, and log conversations to lead timelines.',
    category: 'Communications',
    logoUrl: 'https://www.gstatic.com/images/branding/productlogos/gmail_2026/v2/web/192px.svg',
    officialSource: 'https://www.gstatic.com/images/branding/productlogos/gmail_2026/v2/web/192px.svg — official Google gstatic Gmail 2026 asset',
    status: 'Connected',
    connectedAt: '28 Jan 2026',
    features: ['Email tracking', 'Thread timeline', 'Auto BCC to CRM'],
    config: [
      { id: 'sync', label: 'Email Sync Direction', type: 'select', options: ['Inbound + Outbound (Demo)', 'Inbound only'], required: true, placeholder: 'Select sync direction' },
      { id: 'branch', label: 'Default Branch for Emails', type: 'select', options: ['Lagos Branch','Abuja Branch','Port Harcourt Branch','Kano Branch'], required: true, placeholder: 'Select default branch' },
      { id: 'autoLog', label: 'Auto-log to Activities', type: 'select', options: ['Yes - simulated', 'No'], required: true, placeholder: 'Choose logging behavior' },
    ]
  },
  {
    id: 'outlook',
    name: 'Microsoft Outlook',
    description: 'Enterprise email and calendar. Sync meetings and emails for sales pipeline alignment.',
    category: 'Communications',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg',
    officialSource: 'Wikimedia Commons — official Microsoft Outlook icon (2018-present) representation',
    status: 'Disconnected',
    features: ['Meeting sync', 'Email sync', 'Contact sync'],
    config: [
      { id: 'sync', label: 'Sync Type', type: 'select', options: ['Meetings and Emails (Demo)', 'Meetings only'], required: true, placeholder: 'Select sync type' },
      { id: 'branch', label: 'Assigned Branch', type: 'select', options: ['Lagos Branch','Abuja Branch','Port Harcourt Branch','Kano Branch'], required: true, placeholder: 'Select branch' },
    ]
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Team notifications for new leads, deal stage changes, and task assignments.',
    category: 'Communications',
    logoUrl: 'https://a.slack-edge.com/80588/marketing/img/meta/slack_hash_256.png',
    officialSource: 'https://a.slack-edge.com — official Slack CDN (slack.com/media-kit)',
    status: 'Connected',
    connectedAt: '05 Feb 2026',
    features: ['Lead alerts', 'Deal notifications', 'Task mentions'],
    config: [
      { id: 'channel', label: 'Notification Channel', type: 'text', required: true, placeholder: 'Enter channel e.g. #sales-alerts' },
      { id: 'branch', label: 'Branch Channel Mapping', type: 'select', options: ['Lagos Branch → #lagos-sales', 'Abuja Branch → #abuja-sales', 'All branches → #general'], required: true, placeholder: 'Select channel mapping' },
      { id: 'events', label: 'Events to Notify', type: 'select', options: ['New leads + deal updates (Demo)', 'Deals only', 'Leads only'], required: true, placeholder: 'Choose events' },
    ]
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Two-way CRM sync for contacts, companies, and deal stages. Keep LeadFlow and HubSpot aligned.',
    category: 'CRM',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/HubSpot_Logo.svg',
    officialSource: 'https://upload.wikimedia.org — HubSpot official logo SVG',
    status: 'Disconnected',
    features: ['Contact sync', 'Deal stage mapping', 'Company sync'],
    config: [
      { id: 'direction', label: 'Sync Direction', type: 'select', options: ['LeadFlow → HubSpot (Demo)', 'Bi-directional (Demo)', 'HubSpot → LeadFlow'], required: true, placeholder: 'Select direction' },
      { id: 'branch', label: 'HubSpot Pipeline Branch', type: 'select', options: ['Lagos Branch','Abuja Branch','Port Harcourt Branch','Kano Branch'], required: true, placeholder: 'Select pipeline branch' },
      { id: 'mapping', label: 'Deal Stage Mapping Notes', type: 'textarea', required: false, placeholder: 'Enter mapping notes e.g. Map Qualified → SQL' },
    ]
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Enterprise CRM sync. Mirror Salesforce opportunities and accounts into LeadFlow deals.',
    category: 'CRM',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg',
    officialSource: 'https://commons.wikimedia.org/wiki/File:Salesforce.com_logo.svg — official Salesforce.com logo',
    status: 'Pending',
    features: ['Opportunity sync', 'Account sync', 'Activity sync'],
    config: [
      { id: 'object', label: 'Salesforce Object', type: 'select', options: ['Opportunity (Demo)', 'Account', 'Contact'], required: true, placeholder: 'Select Salesforce object' },
      { id: 'branch', label: 'Branch Mapping', type: 'select', options: ['Lagos Branch','Abuja Branch','Port Harcourt Branch','Kano Branch'], required: true, placeholder: 'Select branch mapping' },
      { id: 'sync', label: 'Sync Frequency', type: 'select', options: ['Every 15 mins (Demo simulation)', 'Hourly', 'Daily'], required: true, placeholder: 'Choose frequency' },
    ]
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Email marketing automation. Sync lists and campaign results back to LeadFlow segments.',
    category: 'Marketing',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Mailchimp_logo.svg',
    officialSource: 'https://mailchimp.com/about/brand-assets/ — official Mailchimp brand assets',
    status: 'Disconnected',
    features: ['List sync', 'Campaign results', 'Unsubscribe sync'],
    config: [
      { id: 'list', label: 'Default Audience Mapping', type: 'select', options: ['All Leads → Main Audience (Demo)', 'Qualified → Prospects', 'Custom mapping'], required: true, placeholder: 'Select audience mapping' },
      { id: 'branch', label: 'Branch for Campaign Attribution', type: 'select', options: ['Lagos Branch','Abuja Branch','Port Harcourt Branch','Kano Branch'], required: true, placeholder: 'Select attribution branch' },
      { id: 'notify', label: 'Campaign Report Email', type: 'email', required: false, placeholder: 'Enter report email e.g. marketing@leadflow.ng' },
    ]
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Automate workflows between LeadFlow and 6000+ apps. Trigger zaps on new leads and deals.',
    category: 'Automation',
    logoUrl: 'https://raw.githubusercontent.com/zapier/zapier-mcp/main/plugins/zapier/assets/logo.svg',
    officialSource: 'https://github.com/zapier/zapier-mcp — canonical Zapier wordmark SVG',
    status: 'Connected',
    connectedAt: '01 Feb 2026',
    features: ['Lead triggers', 'Deal triggers', '6000+ app connections'],
    config: [
      { id: 'trigger', label: 'Primary Trigger Event', type: 'select', options: ['New Lead Created (Demo)', 'Deal Won', 'Task Completed'], required: true, placeholder: 'Select trigger' },
      { id: 'branch', label: 'Branch Filter for Zaps', type: 'select', options: ['All Branches', 'Lagos Branch only', 'Abuja Branch only'], required: true, placeholder: 'Select branch filter' },
      { id: 'notes', label: 'Zap Description', type: 'textarea', required: false, placeholder: 'Enter zap notes e.g. Send Slack on new Lagos lead' },
    ]
  },
];
