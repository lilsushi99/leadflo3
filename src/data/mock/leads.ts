import { Lead, LeadSource, LeadStatus, Service, Task, Verification } from '../../types/crm';

export const branches = ['All Branches', 'Lagos Branch', 'Abuja Branch', 'Port Harcourt Branch', 'Kano Branch'];
export const users = ['Dominion Castiel', 'Sarah Okafor', 'Mark Benson', 'Aisha Bello', 'Tunde Cole'];
export const services: Service[] = ['Web Development', 'Marketing', 'SEO', 'Branding', 'Consulting', 'Product Design'];
export const sources: LeadSource[] = ['LinkedIn', 'Email', 'Website', 'Referral', 'Other'];
export const statuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'In Progress', 'Completed', 'Pending', 'Failed'];
export const verifications: Verification[] = ['Verified', 'Invalid', 'Risky', 'Unknown', 'Unverified'];
export const locations = ['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan'];

export const avatarColors = ['#E8F0FE', '#EFFBEA', '#FFF4E5', '#FEECEC', '#EEF2FF'];

export const generateLeads = (): Lead[] => {
  const companies = ['TechCorp', 'BrightLabs', 'Nexus Agency', 'Flow Systems', 'PixelCraft', 'Vantage Ltd', 'Bloom & Co', 'Atlas Works', 'NorthStar', 'Kora Pay', 'Paystack Clone', 'Mono Labs', 'Zed Crest', 'Lumen Studio', 'Orbit HQ'];
  return Array.from({ length: 48 }).map((_, i) => {
    const fn = ['Chidi', 'Amara', 'David', 'Grace', 'Emeka', 'Zainab', 'Femi', 'Ngozi', 'Kunle', 'Yemi', 'Bola', 'Tolu', 'Sade', 'Ibrahim', 'Chioma', 'Uche', 'Kemi', 'Dayo', 'Funke', 'Segun'][i % 20];
    const ln = ['Okoro', 'Bello', 'Adeyemi', 'Nwachukwu', 'Eze', 'Musa', 'Johnson', 'Okafor', 'Baloyi', 'Abdul', 'Smith', 'Cole', 'Diya', 'Okonkwo', 'Ike'][i % 15];
    return {
      id: `lead-${i + 1}`,
      firstName: fn,
      lastName: ln,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@${companies[i % companies.length].toLowerCase().replace(/[^a-z]/g, '')}.co`,
      phone: `+234 80${Math.floor(10000000 + Math.random() * 90000000)}`,
      company: companies[i % companies.length],
      source: sources[i % sources.length] as LeadSource,
      location: locations[i % locations.length],
      service: services[i % services.length],
      verification: verifications[i % verifications.length],
      status: statuses[i % statuses.length] as LeadStatus,
      assignee: users[i % users.length],
      branch: branches[1 + (i % 4)],
      createdAt: `${Math.floor(Math.random() * 28) + 1} ${['Jan', 'Feb', 'Mar', 'Apr'][i % 4]} 2024`,
      lastActivity: `${Math.floor(Math.random() * 12) + 1}h ago`,
      avatarColor: avatarColors[i % avatarColors.length],
    };
  });
};

export const initialLeads = generateLeads();

export const chartDataMap: Record<string, any[]> = {
  'Last 7 Days': [
    { name: 'Mon', lead: 42, emailsSent: 82, emailsReceived: 38, email: 120, dealsWon: 3, sales: 3, revenue: 4200 },
    { name: 'Tue', lead: 58, emailsSent: 68, emailsReceived: 30, email: 98, dealsWon: 5, sales: 5, revenue: 6800 },
    { name: 'Wed', lead: 35, emailsSent: 96, emailsReceived: 46, email: 142, dealsWon: 2, sales: 2, revenue: 2900 },
    { name: 'Thu', lead: 78, emailsSent: 74, emailsReceived: 36, email: 110, dealsWon: 6, sales: 6, revenue: 8400 },
    { name: 'Fri', lead: 62, emailsSent: 90, emailsReceived: 45, email: 135, dealsWon: 4, sales: 4, revenue: 5600 },
    { name: 'Sat', lead: 48, emailsSent: 55, emailsReceived: 25, email: 80, dealsWon: 3, sales: 3, revenue: 3800 },
    { name: 'Sun', lead: 66, emailsSent: 65, emailsReceived: 30, email: 95, dealsWon: 7, sales: 7, revenue: 9500 },
  ],
  'Last 30 Days': [
    { name: 'W1', lead: 180, emailsSent: 285, emailsReceived: 135, email: 420, dealsWon: 12, sales: 12, revenue: 16500 },
    { name: 'W2', lead: 220, emailsSent: 260, emailsReceived: 120, email: 380, dealsWon: 18, sales: 18, revenue: 24200 },
    { name: 'W3', lead: 190, emailsSent: 345, emailsReceived: 165, email: 510, dealsWon: 15, sales: 15, revenue: 21000 },
    { name: 'W4', lead: 260, emailsSent: 310, emailsReceived: 150, email: 460, dealsWon: 22, sales: 22, revenue: 31400 },
  ],
  Today: [
    { name: '9AM', lead: 12, emailsSent: 31, emailsReceived: 14, email: 45, dealsWon: 1, sales: 1, revenue: 1400 },
    { name: '11AM', lead: 28, emailsSent: 42, emailsReceived: 20, email: 62, dealsWon: 2, sales: 2, revenue: 2800 },
    { name: '1PM', lead: 19, emailsSent: 40, emailsReceived: 18, email: 58, dealsWon: 1, sales: 1, revenue: 1500 },
    { name: '3PM', lead: 34, emailsSent: 48, emailsReceived: 23, email: 71, dealsWon: 3, sales: 3, revenue: 4200 },
    { name: '5PM', lead: 22, emailsSent: 35, emailsReceived: 15, email: 50, dealsWon: 2, sales: 2, revenue: 2900 },
  ],
  'This Month': [
    { name: 'Week 1', lead: 320, emailsSent: 550, emailsReceived: 270, email: 820, dealsWon: 24, sales: 24, revenue: 32000 },
    { name: 'Week 2', lead: 410, emailsSent: 630, emailsReceived: 310, email: 940, dealsWon: 32, sales: 32, revenue: 44500 },
    { name: 'Week 3', lead: 380, emailsSent: 590, emailsReceived: 290, email: 880, dealsWon: 28, sales: 28, revenue: 38000 },
    { name: 'Week 4', lead: 445, emailsSent: 690, emailsReceived: 330, email: 1020, dealsWon: 36, sales: 36, revenue: 51200 },
  ],
  'Last Month': [
    { name: 'Week 1', lead: 280, emailsSent: 510, emailsReceived: 250, email: 760, dealsWon: 20, sales: 20, revenue: 28000 },
    { name: 'Week 2', lead: 350, emailsSent: 550, emailsReceived: 260, email: 810, dealsWon: 26, sales: 26, revenue: 35500 },
    { name: 'Week 3', lead: 310, emailsSent: 530, emailsReceived: 260, email: 790, dealsWon: 22, sales: 22, revenue: 30800 },
    { name: 'Week 4', lead: 390, emailsSent: 620, emailsReceived: 300, email: 920, dealsWon: 30, sales: 30, revenue: 42000 },
  ],
  'Custom Range': [
    { name: 'Day 1', lead: 48, emailsSent: 92, emailsReceived: 42, email: 134, dealsWon: 4, sales: 4, revenue: 5400 },
    { name: 'Day 5', lead: 65, emailsSent: 110, emailsReceived: 48, email: 158, dealsWon: 6, sales: 6, revenue: 7800 },
    { name: 'Day 10', lead: 52, emailsSent: 88, emailsReceived: 38, email: 126, dealsWon: 3, sales: 3, revenue: 4100 },
    { name: 'Day 15', lead: 84, emailsSent: 140, emailsReceived: 62, email: 202, dealsWon: 8, sales: 8, revenue: 11200 },
    { name: 'Day 20', lead: 71, emailsSent: 125, emailsReceived: 55, email: 180, dealsWon: 5, sales: 5, revenue: 6900 },
  ],
};

export const leadSourceData = [
  { name: 'LinkedIn', value: 42, color: '#76E05B' },
  { name: 'Email', value: 28, color: '#3B82F6' },
  { name: 'Website', value: 18, color: '#F59E0B' },
  { name: 'Referral', value: 8, color: '#8B5CF6' },
  { name: 'Other', value: 4, color: '#E7EAE5' },
];

export const initialTasks: Task[] = [
  { id: '1', title: 'Follow up with TechCorp', company: 'TechCorp', assignee: 'SC', due: 'Today, 2:30 PM', priority: 'High', completed: false },
  { id: '2', title: 'Send proposal to BrightLabs', company: 'BrightLabs', assignee: 'MB', due: 'Tomorrow, 10:00 AM', priority: 'Medium', completed: false },
  { id: '3', title: 'Schedule product demo', company: 'Nexus Agency', assignee: 'AB', due: 'Feb 12', priority: 'High', completed: false },
  { id: '4', title: 'Review new qualified leads', company: 'Internal', assignee: 'DC', due: 'Feb 13', priority: 'Low', completed: true },
  { id: '5', title: 'Enrich Lagos contacts', company: 'Lagos Branch', assignee: 'TC', due: 'Feb 14', priority: 'Medium', completed: false },
];
