import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  ListFilter,
  Building2,
  ChevronDown,
  CalendarDays,
  Bell,
  X,
  UsersRound,
  BriefcaseBusiness,
  CheckSquare,
  Mail,
  ArrowRight,
} from 'lucide-react';
import { Dropdown } from '../shared/Dropdown';
import { branches, initialLeads, initialTasks } from '../../data/mock/leads';
import { initialCampaigns } from '../../data/mock/outreach';
import { initialMeetings } from '../../data/mock/sales';
import { Lead, Task, Deal, Meeting, Campaign } from '../../types/crm';

interface HeaderProps {
  currentPage: string;
  branch: string;
  setBranch: (branch: string) => void;
  branchList?: string[];
  dateRange: string;
  setDateRange: (range: string) => void;
  globalSearch: string;
  setGlobalSearch: (query: string) => void;
  setMobileOpen: (open: boolean) => void;
  onNavigate?: (page: string) => void;
  leads?: Lead[];
  deals?: Deal[];
  tasks?: Task[];
  meetings?: Meeting[];
  campaigns?: Campaign[];
}

interface SearchResultItem {
  id: string;
  type: 'Lead' | 'Deal' | 'Task' | 'Meeting' | 'Campaign';
  title: string;
  subtitle: string;
  tag?: string;
  page: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export function Header({
  currentPage,
  branch,
  setBranch,
  branchList,
  dateRange,
  setDateRange,
  globalSearch,
  setGlobalSearch,
  setMobileOpen,
  onNavigate,
  leads = initialLeads,
  deals = [],
  tasks = initialTasks,
  meetings = initialMeetings,
  campaigns = initialCampaigns,
}: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute live search results across real CRM data
  const searchResults = useMemo<SearchResultItem[]>(() => {
    const q = globalSearch.trim().toLowerCase();
    if (!q) return [];

    const results: SearchResultItem[] = [];

    // 1. Leads
    for (const lead of leads) {
      const match =
        lead.firstName.toLowerCase().includes(q) ||
        lead.lastName.toLowerCase().includes(q) ||
        lead.company.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        (lead.service && lead.service.toLowerCase().includes(q));

      if (match) {
        results.push({
          id: `lead-${lead.id}`,
          type: 'Lead',
          title: `${lead.firstName} ${lead.lastName}`,
          subtitle: `${lead.company} • ${lead.email}`,
          tag: lead.status,
          page: 'all-leads',
          icon: UsersRound,
        });
      }
      if (results.length >= 8) break;
    }

    // 2. Deals
    for (const deal of deals) {
      const match =
        deal.name.toLowerCase().includes(q) ||
        deal.company.toLowerCase().includes(q) ||
        deal.stage.toLowerCase().includes(q) ||
        (deal.leadName && deal.leadName.toLowerCase().includes(q));

      if (match) {
        results.push({
          id: `deal-${deal.id}`,
          type: 'Deal',
          title: deal.name,
          subtitle: `${deal.company} • $${deal.value.toLocaleString()}`,
          tag: deal.stage,
          page: 'sales-deals',
          icon: BriefcaseBusiness,
        });
      }
      if (results.length >= 12) break;
    }

    // 3. Tasks
    for (const task of tasks) {
      const match =
        task.title.toLowerCase().includes(q) ||
        task.company.toLowerCase().includes(q) ||
        (task.priority && task.priority.toLowerCase().includes(q));

      if (match) {
        results.push({
          id: `task-${task.id}`,
          type: 'Task',
          title: task.title,
          subtitle: `${task.company} • Due: ${task.due}`,
          tag: task.priority,
          page: 'sales-tasks',
          icon: CheckSquare,
        });
      }
      if (results.length >= 16) break;
    }

    // 4. Meetings
    for (const meeting of meetings) {
      const match =
        meeting.title.toLowerCase().includes(q) ||
        meeting.company.toLowerCase().includes(q) ||
        meeting.leadName.toLowerCase().includes(q);

      if (match) {
        results.push({
          id: `meeting-${meeting.id}`,
          type: 'Meeting',
          title: meeting.title,
          subtitle: `${meeting.company} with ${meeting.leadName}`,
          tag: meeting.type,
          page: 'sales-meetings',
          icon: CalendarDays,
        });
      }
      if (results.length >= 20) break;
    }

    // 5. Campaigns
    for (const camp of campaigns) {
      const match =
        camp.name.toLowerCase().includes(q) ||
        camp.subject.toLowerCase().includes(q);

      if (match) {
        results.push({
          id: `campaign-${camp.id}`,
          type: 'Campaign',
          title: camp.name,
          subtitle: camp.subject,
          tag: camp.status,
          page: 'outreach-email-campaigns',
          icon: Mail,
        });
      }
      if (results.length >= 24) break;
    }

    return results;
  }, [globalSearch, leads, deals, tasks, meetings, campaigns]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [globalSearch]);

  const handleSelectResult = (item: SearchResultItem) => {
    if (onNavigate) {
      onNavigate(item.page);
    } else {
      window.location.hash = item.page;
    }
    setSearchOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setSearchOpen(false);
      searchInputRef.current?.blur();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults[selectedIndex]) {
        handleSelectResult(searchResults[selectedIndex]);
      }
    }
  };

  return (
    <header
      className="h-[64px] sticky top-0 z-20 bg-[var(--bg)] lg:bg-[#F7F8F5]/80 backdrop-blur-[6px] border-b border-[var(--border)] flex items-center gap-[12px] px-[16px] lg:px-[28px]"
      style={{ top: 'var(--safe-area-inset-top)' }}
    >
      <button
        className="lg:hidden p-[8px] rounded-[8px] border border-[var(--border)] bg-white"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
      >
        <ListFilter size={16} />
      </button>

      {/* Global Search Bar with Live Accessible Dropdown */}
      <div className="flex-1 flex items-center" ref={searchContainerRef}>
        <div className="relative w-full max-w-[420px]">
          <Search size={16} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
          <input
            ref={searchInputRef}
            value={globalSearch}
            onChange={(e) => {
              setGlobalSearch(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => {
              if (globalSearch.trim()) setSearchOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search leads, companies, deals, tasks..."
            className="w-full h-[36px] pl-[36px] pr-[32px] rounded-[10px] bg-white text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] border-0 shadow-[0_1px_3px_rgba(0,0,0,0.05)] focus:outline-none focus:ring-2 focus:ring-[#76E05B]/50 transition-all"
            aria-label="Global search"
            aria-expanded={searchOpen}
            aria-controls="global-search-results"
            role="combobox"
          />
          {globalSearch && (
            <button
              type="button"
              onClick={() => {
                setGlobalSearch('');
                setSearchOpen(false);
                searchInputRef.current?.focus();
              }}
              className="absolute right-[10px] top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-[4px]"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}

          {/* Search Results Dropdown Panel */}
          {searchOpen && globalSearch.trim().length > 0 && (
            <div
              id="global-search-results"
              role="listbox"
              className="absolute left-0 top-[44px] w-full bg-white border border-[var(--border)] rounded-[12px] shadow-[0_12px_32px_rgba(0,0,0,0.12)] p-[6px] z-50 max-h-[380px] overflow-y-auto"
            >
              {searchResults.length > 0 ? (
                <div>
                  <div className="px-[10px] py-[6px] text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] flex justify-between items-center border-b border-[var(--border)] mb-[4px]">
                    <span>Results ({searchResults.length})</span>
                    <span className="text-[10px] lowercase text-[var(--text-muted)]">esc to close</span>
                  </div>
                  <div className="flex flex-col gap-[2px]">
                    {searchResults.map((item, idx) => {
                      const isSelected = idx === selectedIndex;
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.id}
                          role="option"
                          aria-selected={isSelected}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          onClick={() => handleSelectResult(item)}
                          className={`flex items-center justify-between p-[8px] rounded-[8px] cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-[#EFFBEA] text-[#15803D]'
                              : 'hover:bg-[#F7F8F5] text-[var(--text-primary)]'
                          }`}
                        >
                          <div className="flex items-center gap-[10px] min-w-0">
                            <div
                              className={`w-[28px] h-[28px] rounded-[6px] flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-white text-[#16A34A]' : 'bg-[var(--input-bg)] text-[var(--text-muted)]'
                              }`}
                            >
                              <Icon size={14} />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[13px] font-medium truncate">{item.title}</span>
                              <span className="text-[11px] text-[var(--text-muted)] truncate">{item.subtitle}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-[8px] shrink-0 ml-[8px]">
                            {item.tag && (
                              <span
                                className={`text-[10px] font-medium px-[6px] py-[2px] rounded-[4px] ${
                                  isSelected
                                    ? 'bg-[#E3F6DC] text-[#166534]'
                                    : 'bg-[var(--input-bg)] text-[var(--text-secondary)]'
                                }`}
                              >
                                {item.tag}
                              </span>
                            )}
                            <ArrowRight size={12} className={isSelected ? 'text-[#16A34A]' : 'text-[var(--text-muted)]'} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="py-[24px] px-[16px] text-center">
                  <p className="text-[13px] font-medium text-[var(--text-primary)]">
                    No results found for "{globalSearch}"
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-[4px]">
                    Try searching by name, company, email, deals, or tasks.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-[8px]">
        <Dropdown
          value={branch}
          onSelect={setBranch}
          options={branchList || branches}
          trigger={
            <div className="hidden md:flex items-center gap-[6px] h-[36px] px-[12px] rounded-[10px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] text-[13px] font-medium cursor-pointer hover:bg-[#F9FAF8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#76E05B]/50 transition-all">
              <Building2 size={16} className="text-[var(--text-muted)]" />
              <span>{branch}</span>
              <ChevronDown size={14} className="text-[var(--text-muted)]" />
            </div>
          }
        />

        {currentPage === 'overview' && (
          <Dropdown
            value={dateRange}
            onSelect={setDateRange}
            options={['Today', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month', 'Custom Range']}
            trigger={
              <div className="hidden md:flex items-center gap-[6px] h-[36px] px-[12px] rounded-[10px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] text-[13px] font-medium cursor-pointer hover:bg-[#F9FAF8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#76E05B]/50 transition-all">
                <CalendarDays size={16} className="text-[var(--text-muted)]" />
                <span>{dateRange}</span>
                <ChevronDown size={14} className="text-[var(--text-muted)]" />
              </div>
            }
          />
        )}

        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="w-[36px] h-[36px] rounded-[10px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex items-center justify-center relative hover:bg-[#F9FAF8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#76E05B]/50 transition-all"
            aria-label="View notifications"
          >
            <Bell size={18} className="text-[var(--text-muted)]" />
            <span className="absolute top-[6px] right-[8px] w-[7px] h-[7px] bg-[#EF4444] rounded-full border-[2px] border-white" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-[44px] w-[320px] bg-white border border-[var(--border)] rounded-[12px] shadow-[0_12px_32px_rgba(0,0,0,0.10)] p-[12px] z-50">
              <div className="text-[14px] font-semibold mb-[8px]">Notifications</div>
              <div className="flex flex-col gap-[8px]">
                <div className="p-[10px] rounded-[8px] bg-[var(--bg)]">
                  <div className="text-[13px] font-medium">New qualified lead: TechCorp</div>
                  <div className="text-[11px] text-[var(--text-muted)]">2 hours ago • Lagos Branch</div>
                </div>
                <div className="p-[10px] rounded-[8px] bg-[var(--bg)]">
                  <div className="text-[13px] font-medium">Import completed: 124 leads added</div>
                  <div className="text-[11px] text-[var(--text-muted)]">5 hours ago</div>
                </div>
                <div className="p-[10px] rounded-[8px] bg-[var(--bg)]">
                  <div className="text-[13px] font-medium">Discovery job finished</div>
                  <div className="text-[11px] text-[var(--text-muted)]">Yesterday • 42 leads found</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-[32px] h-[32px] rounded-full bg-[var(--primary)] flex items-center justify-center text-[12px] font-semibold text-[#1B4D0F]">
          DC
        </div>
      </div>
    </header>
  );
}
