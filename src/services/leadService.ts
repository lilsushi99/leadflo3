import { Lead } from '../types/crm';

export class LeadService {
  filterLeads(
    leads: Lead[],
    filters: {
      search?: string;
      source?: string | null;
      status?: string | null;
      verification?: string | null;
      service?: string | null;
      branch?: string | null;
    }
  ): Lead[] {
    return leads.filter(lead => {
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const fullName = `${lead.firstName} ${lead.lastName}`.toLowerCase();
        const match =
          fullName.includes(query) ||
          lead.email.toLowerCase().includes(query) ||
          lead.company.toLowerCase().includes(query) ||
          lead.location.toLowerCase().includes(query);
        if (!match) return false;
      }
      if (filters.source && filters.source !== 'All Sources' && lead.source !== filters.source) {
        return false;
      }
      if (filters.status && filters.status !== 'All Statuses' && lead.status !== filters.status) {
        return false;
      }
      if (filters.verification && filters.verification !== 'All Verifications' && lead.verification !== filters.verification) {
        return false;
      }
      if (filters.service && filters.service !== 'All Services' && lead.service !== filters.service) {
        return false;
      }
      if (filters.branch && filters.branch !== 'All Branches' && lead.branch !== filters.branch) {
        return false;
      }
      return true;
    });
  }

  getLeadMetrics(leads: Lead[]) {
    const total = leads.length;
    const verified = leads.filter(l => l.verification === 'Verified').length;
    const qualified = leads.filter(l => l.status === 'Qualified').length;
    const conversionRate = total > 0 ? Math.round((qualified / total) * 100) : 0;
    return {
      total,
      verified,
      qualified,
      conversionRate,
    };
  }
}

export const leadService = new LeadService();
