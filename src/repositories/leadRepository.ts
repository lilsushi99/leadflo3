import { Lead } from '../types/crm';
import { initialLeads } from '../data/mock/leads';

export interface ILeadRepository {
  getAll(): Lead[];
  getById(id: string): Lead | undefined;
  create(lead: Lead): Lead;
  update(id: string, updates: Partial<Lead>): Lead | undefined;
  delete(id: string): boolean;
}

export class MockLeadRepository implements ILeadRepository {
  private leads: Lead[];

  constructor(initialData: Lead[] = initialLeads) {
    this.leads = [...initialData];
  }

  getAll(): Lead[] {
    return [...this.leads];
  }

  getById(id: string): Lead | undefined {
    return this.leads.find(l => l.id === id);
  }

  create(lead: Lead): Lead {
    this.leads.unshift(lead);
    return lead;
  }

  update(id: string, updates: Partial<Lead>): Lead | undefined {
    const idx = this.leads.findIndex(l => l.id === id);
    if (idx === -1) return undefined;
    this.leads[idx] = { ...this.leads[idx], ...updates };
    return this.leads[idx];
  }

  delete(id: string): boolean {
    const prevLen = this.leads.length;
    this.leads = this.leads.filter(l => l.id !== id);
    return this.leads.length < prevLen;
  }
}

export const leadRepository = new MockLeadRepository();
