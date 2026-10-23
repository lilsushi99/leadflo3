import { Deal } from '../types/crm';
import { generateDeals } from '../data/mock/sales';
import { initialLeads } from '../data/mock/leads';

export interface IDealRepository {
  getAll(): Deal[];
  getById(id: string): Deal | undefined;
  create(deal: Deal): Deal;
  update(id: string, updates: Partial<Deal>): Deal | undefined;
  delete(id: string): boolean;
}

export class MockDealRepository implements IDealRepository {
  private deals: Deal[];

  constructor(initialData: Deal[] = generateDeals(initialLeads)) {
    this.deals = [...initialData];
  }

  getAll(): Deal[] {
    return [...this.deals];
  }

  getById(id: string): Deal | undefined {
    return this.deals.find(d => d.id === id);
  }

  create(deal: Deal): Deal {
    this.deals.unshift(deal);
    return deal;
  }

  update(id: string, updates: Partial<Deal>): Deal | undefined {
    const idx = this.deals.findIndex(d => d.id === id);
    if (idx === -1) return undefined;
    this.deals[idx] = { ...this.deals[idx], ...updates };
    return this.deals[idx];
  }

  delete(id: string): boolean {
    const prevLen = this.deals.length;
    this.deals = this.deals.filter(d => d.id !== id);
    return this.deals.length < prevLen;
  }
}

export const dealRepository = new MockDealRepository();
