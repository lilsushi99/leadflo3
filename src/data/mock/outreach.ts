import { Campaign, Delivery, Sequence, Template } from '../../types/crm';

export const initialCampaigns: Campaign[] = [
  { id: 'c1', name: 'Q2 Product Launch - Lagos Tech', audience: 'Lagos Technology Leads', status: 'Sent', sent: 124, open: 42, click: 18, lastActivity: '2h ago', subject: 'Introducing LeadFlow 2.0', branch: 'Lagos Branch', owner: 'Dominion Castiel' },
  { id: 'c2', name: 'Marketing Agencies Outreach', audience: 'Marketing Agencies', status: 'Sending', sent: 87, open: 35, click: 12, lastActivity: '5h ago', subject: 'How agencies close 3x faster', branch: 'Abuja Branch', owner: 'Sarah Okafor' },
  { id: 'c3', name: 'Recently Qualified Nurture', audience: 'Recently Qualified', status: 'Scheduled', sent: 0, open: 0, click: 0, lastActivity: '1d ago', subject: 'Your qualified leads are ready', branch: 'Lagos Branch', owner: 'Mark Benson' },
  { id: 'c4', name: 'Port Harcourt Re-engagement', audience: 'Lagos Technology Leads', status: 'Draft', sent: 0, open: 0, click: 0, lastActivity: '2d ago', subject: 'Quick check-in', branch: 'Port Harcourt Branch', owner: 'Aisha Bello' },
];

export const initialDeliveries: Delivery[] = [
  { id: 'd1', recipient: 'Chidi Okoro', email: 'chidi.okoro@techcorp.co', campaign: 'Q2 Product Launch - Lagos Tech', campaignId: 'c1', status: 'Delivered', timestamp: 'Today 10:32 AM', branch: 'Lagos Branch' },
  { id: 'd2', recipient: 'Amara Bello', email: 'amara.bello@brightlabs.co', campaign: 'Q2 Product Launch - Lagos Tech', campaignId: 'c1', status: 'Delivered', timestamp: 'Today 10:31 AM', branch: 'Lagos Branch' },
  { id: 'd3', recipient: 'David Adeyemi', email: 'david.adeyemi@nexusagency.co', campaign: 'Marketing Agencies Outreach', campaignId: 'c2', status: 'Bounced', timestamp: 'Today 09:15 AM', error: 'Invalid domain', branch: 'Abuja Branch' },
  { id: 'd4', recipient: 'Grace Nwachukwu', email: 'grace@flowsystems.co', campaign: 'Marketing Agencies Outreach', campaignId: 'c2', status: 'Failed', timestamp: 'Yesterday 4:20 PM', error: 'Suppressed', branch: 'Abuja Branch' },
  { id: 'd5', recipient: 'Emeka Eze', email: 'emeka.eze@pixelcraft.co', campaign: 'Q2 Product Launch - Lagos Tech', campaignId: 'c1', status: 'Queued', timestamp: 'Yesterday 3:00 PM', branch: 'Lagos Branch' },
  { id: 'd6', recipient: 'Zainab Musa', email: 'zainab.musa@vantageltd.co', campaign: 'Q2 Product Launch - Lagos Tech', campaignId: 'c1', status: 'Delivered', timestamp: 'Yesterday 2:10 PM', branch: 'Kano Branch' },
];

export const initialSequences: Sequence[] = [
  { id: 's1', name: 'Lagos Tech Intro Sequence', audience: 'Lagos Technology Leads', status: 'Active', steps: 3, enrolled: 24, performance: '42% open', lastActivity: '3h ago', owner: 'Dominion Castiel' },
  { id: 's2', name: 'Agency Follow-up', audience: 'Marketing Agencies', status: 'Active', steps: 4, enrolled: 18, performance: '38% open', lastActivity: '1d ago', owner: 'Sarah Okafor' },
  { id: 's3', name: 'Qualified Lead Nurture', audience: 'Recently Qualified', status: 'Paused', steps: 2, enrolled: 12, performance: '51% open', lastActivity: '2d ago', owner: 'Mark Benson' },
];

export const initialTemplates: Template[] = [
  { id: 't1', name: 'Initial Outreach - Tech', category: 'Sales', subject: 'Quick intro: {{company}} + LeadFlow', body: 'Hi {{firstName}}, Noticed {{company}} scaling in {{location}}...', updated: '2d ago', usage: 12 },
  { id: 't2', name: 'Follow-up #2', category: 'Follow-up', subject: 'Re: {{company}} pipeline', body: 'Hi {{firstName}}, Circling back...', updated: '5d ago', usage: 8 },
  { id: 't3', name: 'Proposal Sent', category: 'Sales', subject: 'Proposal for {{company}}', body: 'Hi {{firstName}}, Attached proposal for {{dealName}}...', updated: '1w ago', usage: 5 },
  { id: 't4', name: 'Meeting Confirmation', category: 'Marketing', subject: 'Confirmed: {{meetingTitle}}', body: 'Hi {{firstName}}, Confirming our {{meetingType}}...', updated: '3d ago', usage: 15 },
];
