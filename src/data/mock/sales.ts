import { Activity, Deal, DealStage, Lead, Meeting, SalesTask, SalesTaskPriority } from '../../types/crm';
import { branches, initialLeads, users } from './leads';

export const dealStages: DealStage[] = ['New Opportunity', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

export const stageProbability: Record<DealStage, number> = {
  'New Opportunity': 15,
  'Qualified': 30,
  'Proposal': 50,
  'Negotiation': 75,
  'Closed Won': 100,
  'Closed Lost': 0,
};

export const generateDeals = (leads: Lead[]): Deal[] => {
  const dealNames = ['Website Redesign', 'CRM Implementation', 'Marketing Automation', 'Brand Identity', 'SEO & Growth', 'Product Design Sprint', 'Consulting Retainer', 'E-commerce Platform', 'Mobile App MVP', 'Lead Enrichment Package', 'Outbound Campaign Setup', 'Sales Enablement', 'Data Migration', 'Integration Project', 'Custom Dashboard', 'Support Retainer'];
  return Array.from({ length: 22 }).map((_, i) => {
    const lead = leads[i % leads.length];
    const stage = dealStages[i % dealStages.length] as DealStage;
    const value = [3500, 5200, 7800, 12000, 18500, 24000, 32000, 45000, 68000, 85000][i % 10];
    const prob = stageProbability[stage];
    const closeOffset = stage === 'Closed Won' || stage === 'Closed Lost' ? -Math.floor(Math.random()*10) : Math.floor(Math.random()*45)+5;
    const closeDate = new Date(); closeDate.setDate(closeDate.getDate()+closeOffset);
    return {
      id: `deal-${i+1}`,
      name: `${dealNames[i % dealNames.length]} - ${lead.company}`,
      leadId: lead.id,
      company: lead.company,
      leadName: `${lead.firstName} ${lead.lastName}`,
      value,
      currency: i % 3 === 0 ? 'NGN' : 'USD',
      stage,
      probability: prob,
      expectedCloseDate: closeDate.toISOString().split('T')[0],
      owner: users[i % users.length],
      branch: branches[1 + (i % 4)],
      description: `Opportunity for ${lead.company} in ${lead.location}. Service: ${lead.service}.`,
      createdAt: `${Math.floor(Math.random()*28)+1} Jan 2024`,
      lastActivityAt: `${Math.floor(Math.random()*12)+1}h ago`,
      priority: (['High','Medium','Low'] as SalesTaskPriority[])[i % 3],
    };
  });
};

export const initialDeals = generateDeals(initialLeads);

export const initialSalesTasks: SalesTask[] = [
  { id: 'st1', title: 'Follow up with TechCorp on proposal', leadId: 'lead-1', dealId: 'deal-1', leadName: 'Chidi Okoro', dealName: 'Website Redesign - TechCorp', company: 'TechCorp', type: 'Follow-up', dueAt: '2024-02-15', dueLabel: 'Due Today', priority: 'High', status: 'Todo', assignee: 'Dominion Castiel', branch: 'Lagos Branch', notes: 'Discuss pricing' },
  { id: 'st2', title: 'Call Amara Bello - Qualified lead', leadId: 'lead-2', dealId: 'deal-2', leadName: 'Amara Bello', dealName: 'CRM Implementation - BrightLabs', company: 'BrightLabs', type: 'Call', dueAt: '2024-02-15', dueLabel: 'Due Today', priority: 'High', status: 'In Progress', assignee: 'Sarah Okafor', branch: 'Lagos Branch' },
  { id: 'st3', title: 'Send contract to Nexus Agency', leadId: 'lead-3', dealId: 'deal-3', leadName: 'David Adeyemi', dealName: 'Marketing Automation - Nexus Agency', company: 'Nexus Agency', type: 'Email', dueAt: '2024-02-16', dueLabel: 'Upcoming', priority: 'Medium', status: 'Todo', assignee: 'Mark Benson', branch: 'Abuja Branch' },
  { id: 'st4', title: 'Prepare demo for Flow Systems', leadId: 'lead-4', dealId: 'deal-4', leadName: 'Grace Nwachukwu', dealName: 'Brand Identity - Flow Systems', company: 'Flow Systems', type: 'Meeting', dueAt: '2024-02-12', dueLabel: 'Overdue', priority: 'High', status: 'Todo', assignee: 'Aisha Bello', branch: 'Port Harcourt Branch' },
  { id: 'st5', title: 'Review qualified leads with team', type: 'Other', dueAt: '2024-02-14', dueLabel: 'Completed', priority: 'Low', status: 'Completed', assignee: 'Dominion Castiel', branch: 'Lagos Branch', completedAt: '2h ago' },
  { id: 'st6', title: 'Log call with PixelCraft', leadId: 'lead-5', dealId: 'deal-5', leadName: 'Emeka Eze', dealName: 'SEO & Growth - PixelCraft', company: 'PixelCraft', type: 'Call', dueAt: '2024-02-16', dueLabel: 'Upcoming', priority: 'Medium', status: 'Todo', assignee: 'Tunde Cole', branch: 'Kano Branch' },
];

export const initialActivities: Activity[] = [
  { id: 'a1', type: 'Stage Change', summary: 'Moved to Qualified', leadId: 'lead-1', dealId: 'deal-1', leadName: 'Chidi Okoro', dealName: 'Website Redesign - TechCorp', company: 'TechCorp', owner: 'Dominion Castiel', occurredAt: '2h ago', notes: 'New Opportunity → Qualified' },
  { id: 'a2', type: 'Call', summary: 'Intro call - positive', leadId: 'lead-2', dealId: 'deal-2', leadName: 'Amara Bello', dealName: 'CRM Implementation - BrightLabs', company: 'BrightLabs', owner: 'Sarah Okafor', occurredAt: '5h ago', outcome: 'Connected', notes: 'Interested in Q2' },
  { id: 'a3', type: 'Email', summary: 'Proposal sent', leadId: 'lead-3', dealId: 'deal-3', leadName: 'David Adeyemi', dealName: 'Marketing Automation - Nexus Agency', company: 'Nexus Agency', owner: 'Mark Benson', occurredAt: '1d ago', outcome: 'Sent', notes: 'Proposal $12k' },
  { id: 'a4', type: 'Meeting', summary: 'Demo completed', leadId: 'lead-4', dealId: 'deal-4', leadName: 'Grace Nwachukwu', dealName: 'Brand Identity - Flow Systems', company: 'Flow Systems', owner: 'Aisha Bello', occurredAt: '2d ago', outcome: 'Completed' },
  { id: 'a5', type: 'Note', summary: 'Budget confirmed', leadId: 'lead-5', dealId: 'deal-5', leadName: 'Emeka Eze', dealName: 'SEO & Growth - PixelCraft', company: 'PixelCraft', owner: 'Tunde Cole', occurredAt: '3d ago', notes: 'Budget $8k approved' },
];

export const initialMeetings: Meeting[] = [
  { id: 'm1', type: 'video', title: 'Product Demo - TechCorp', leadId: 'lead-1', leadName: 'Chidi Okoro', dealId: 'deal-1', dealName: 'Website Redesign - TechCorp', company: 'TechCorp', owner: 'Dominion Castiel', startAt: '2024-02-15T10:00', endAt: '2024-02-15T10:45', dateLabel: 'Today, 10:00 AM', status: 'Scheduled', meetingLink: 'https://meet.leadflow.local/demo-techcorp', duration: '45m' },
  { id: 'm2', type: 'phone', title: 'Discovery Call - BrightLabs', leadId: 'lead-2', leadName: 'Amara Bello', dealId: 'deal-2', dealName: 'CRM Implementation - BrightLabs', company: 'BrightLabs', owner: 'Sarah Okafor', startAt: '2024-02-15T14:30', endAt: '2024-02-15T15:00', dateLabel: 'Today, 2:30 PM', status: 'Scheduled', location: '+234 801 234 5678', duration: '30m' },
  { id: 'm3', type: 'in-person', title: 'Proposal Review - Nexus Agency', leadId: 'lead-3', leadName: 'David Adeyemi', dealId: 'deal-3', dealName: 'Marketing Automation - Nexus Agency', company: 'Nexus Agency', owner: 'Mark Benson', startAt: '2024-02-16T09:00', endAt: '2024-02-16T10:00', dateLabel: 'Tomorrow, 9:00 AM', status: 'Scheduled', location: 'Lagos Branch Office', duration: '1h' },
  { id: 'm4', type: 'Call', title: 'Follow-up - Flow Systems', leadId: 'lead-4', leadName: 'Grace Nwachukwu', company: 'Flow Systems', owner: 'Aisha Bello', startAt: '2024-02-12T11:00', endAt: '2024-02-12T11:20', dateLabel: 'Feb 12, 11:00 AM', status: 'Completed', outcome: 'Connected', notes: 'Agreed to proposal review', duration: '20m' },
  { id: 'm5', type: 'video', title: 'Negotiation - Vantage Ltd', leadId: 'lead-6', leadName: 'Zainab Musa', dealId: 'deal-6', dealName: 'Product Design Sprint - Vantage Ltd', company: 'Vantage Ltd', owner: 'Tunde Cole', startAt: '2024-02-13T15:00', endAt: '2024-02-13T15:45', dateLabel: 'Feb 13, 3:00 PM', status: 'Completed', outcome: 'Follow-up Required', duration: '45m' },
];
