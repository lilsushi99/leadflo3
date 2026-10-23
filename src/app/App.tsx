import { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { AppRouter, getPageIdByPath, getPathByPageId, getRouteById } from './routes';
import { initialLeads, branches } from '../data/mock/leads';
import { initialTasks } from '../data/mock/leads';
import {
  initialCampaigns,
  initialDeliveries,
  initialSequences,
  initialTemplates,
} from '../data/mock/outreach';
import {
  generateDeals,
  initialSalesTasks,
  initialActivities,
  initialMeetings,
} from '../data/mock/sales';
import {
  initialCreditTransactions,
  initialCreditPackages,
  initialAuditLogs,
  initialWorkspaceSettings,
  initialProfileSettings,
  initialNotificationSettings,
  initialSecurityPreferences,
} from '../data/mock/admin';
import { initialBranchDetails, initialTeamMembers } from '../data/mock/workspace';
import {
  Lead,
  Task,
  Campaign,
  Delivery,
  Sequence,
  Template,
  Deal,
  SalesTask,
  Activity,
  Meeting,
  BranchDetail,
  TeamMemberDetail,
  CreditTransaction,
  CreditPackage,
  AuditLog,
  WorkspaceSettings,
  ProfileSettings,
  NotificationSettings,
  SecurityPreferences,
} from '../types/crm';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Clean URL-derived active page
  const currentPage = useMemo(() => {
    return getPageIdByPath(location.pathname);
  }, [location.pathname]);

  const setCurrentPage = (pageId: string) => {
    const targetPath = getPathByPageId(pageId);
    navigate(targetPath);
  };

  // Sync document title and handle legacy hash cleanup if arrived via old bookmark
  useEffect(() => {
    if (window.location.hash) {
      const hash = window.location.hash.replace(/^#\/?/, '');
      const matchedPage = getPageIdByPath('/' + hash) || getPageIdByPath(hash);
      const targetPath = getPathByPageId(matchedPage);
      navigate(targetPath, { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const route = getRouteById(currentPage);
    if (route) {
      document.title = `LeadFlow CRM - ${route.label}`;
    }
  }, [currentPage]);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'lead-intelligence': true,
    outreach: true,
    sales: true,
    insights: true,
    workspace: true,
    administration: false,
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [branch, setBranch] = useState('Lagos Branch');
  const [branchList, setBranchList] = useState<string[]>(branches);
  const [branchDetails, setBranchDetails] = useState<BranchDetail[]>(initialBranchDetails);
  const [teamMembers, setTeamMembers] = useState<TeamMemberDetail[]>(initialTeamMembers);
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [globalSearch, setGlobalSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [lists, setLists] = useState<any[]>([
    {
      id: '1',
      name: 'Lagos Technology Leads',
      description: 'High-intent technology companies in Lagos region',
      count: 124,
      owner: 'Dominion',
      updated: '2h ago',
      leadIds: [],
    },
    {
      id: '2',
      name: 'Marketing Agencies',
      description: 'Verified marketing agencies with 10+ employees',
      count: 87,
      owner: 'Sarah',
      updated: '1d ago',
      leadIds: [],
    },
    {
      id: '3',
      name: 'Recently Qualified',
      description: 'Leads qualified in last 7 days',
      count: 56,
      owner: 'Mark',
      updated: '3d ago',
      leadIds: [],
    },
  ]);
  const [segments, setSegments] = useState<any[]>([
    {
      id: '1',
      name: 'Verified Email Contacts',
      description: 'Verification equals Verified',
      count: 18,
      owner: 'Dominion',
      updated: '5h ago',
      rules: [],
    },
    {
      id: '2',
      name: 'Leads Interested in Web Development',
      description: 'Service equals Web Development',
      count: 9,
      owner: 'Sarah',
      updated: '2d ago',
      rules: [],
    },
    {
      id: '3',
      name: 'High Value Prospects',
      description: 'Status equals Qualified AND Location equals Lagos',
      count: 12,
      owner: 'Mark',
      updated: '1w ago',
      rules: [],
    },
  ]);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [deliveries] = useState<Delivery[]>(initialDeliveries);
  const [sequences, setSequences] = useState<Sequence[]>(initialSequences);
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [deals, setDeals] = useState<Deal[]>(() => generateDeals(initialLeads));
  const [salesTasks, setSalesTasks] = useState<SalesTask[]>(initialSalesTasks);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [creditTransactions, setCreditTransactions] = useState<CreditTransaction[]>(initialCreditTransactions);
  const [creditPackages] = useState<CreditPackage[]>(initialCreditPackages);
  const [creditBalance, setCreditBalance] = useState<number>(
    () => initialCreditTransactions[0]?.balanceAfter ?? 2452
  );
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [workspaceSettings, setWorkspaceSettings] = useState<WorkspaceSettings>(initialWorkspaceSettings);
  const [profileSettings, setProfileSettings] = useState<ProfileSettings>(initialProfileSettings);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(initialNotificationSettings);
  const [securityPreferences, setSecurityPreferences] = useState<SecurityPreferences>(initialSecurityPreferences);

  const addAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp' | 'dateLabel'>) => {
    const now = new Date();
    const dateLabel = now.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    const newLog: AuditLog = {
      id: 'audit-' + Date.now(),
      timestamp: now.toISOString().slice(0, 19).replace('T', ' '),
      dateLabel,
      ...log,
      isDemo: log.isDemo ?? false,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const filteredByGlobal = useMemo(() => {
    if (!globalSearch) return leads;
    return leads.filter(l =>
      `${l.firstName} ${l.lastName} ${l.company} ${l.email}`
        .toLowerCase()
        .includes(globalSearch.toLowerCase())
    );
  }, [leads, globalSearch]);

  return (
    <div
      className="min-h-screen flex bg-[var(--bg)] overflow-clip"
      style={{ paddingTop: 'var(--safe-area-inset-top)' }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600&display=swap');
        :root{--primary:#76E05B;--primary-hover:#66c94f;--primary-soft:#EFFBEA;--primary-soft-2:#E3F6DC;--bg:#F7F8F5;--surface:#FFFFFF;--text-primary:#20251F;--text-secondary:#69716A;--text-muted:#8B928C;--border:#E7EAE5;--input-bg:#F3F5F2;--radius:12px;--radius-sm:8px;}
        *{font-family:'Outfit',sans-serif}
        @keyframes slideIn{from{transform:translateX(20px);opacity:0}to{transform:translateX(0);opacity:1}}
      `}</style>
      <div
        id="interaction-feedback"
        aria-live="polite"
        className="sr-only hidden"
        style={{
          display: 'none',
          position: 'absolute',
          width: 0,
          height: 0,
          opacity: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        ready:{currentPage}
      </div>
      <div
        id="nav-state"
        data-current={currentPage}
        aria-hidden="true"
        className="sr-only hidden"
        style={{
          display: 'none',
          position: 'absolute',
          width: 0,
          height: 0,
          opacity: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {currentPage}
      </div>
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        expanded={expanded}
        setExpanded={setExpanded}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        creditBalance={creditBalance}
      />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header
          currentPage={currentPage}
          branch={branch}
          setBranch={setBranch}
          branchList={branchList}
          dateRange={dateRange}
          setDateRange={setDateRange}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
          setMobileOpen={setMobileOpen}
          onNavigate={setCurrentPage}
          leads={leads}
          deals={deals}
          tasks={tasks}
          meetings={meetings}
          campaigns={campaigns}
        />
        <main className="flex-1 overflow-auto px-[16px] lg:px-[28px] py-[20px] lg:py-[24px]">
          <AppRouter
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            leads={leads}
            setLeads={setLeads}
            filteredByGlobal={filteredByGlobal}
            branch={branch}
            setBranch={setBranch}
            branchList={branchList}
            setBranchList={setBranchList}
            branchDetails={branchDetails}
            setBranchDetails={setBranchDetails}
            teamMembers={teamMembers}
            setTeamMembers={setTeamMembers}
            dateRange={dateRange}
            setDateRange={setDateRange}
            sourceFilter={sourceFilter}
            setSourceFilter={setSourceFilter}
            tasks={tasks}
            setTasks={setTasks}
            lists={lists}
            setLists={setLists}
            segments={segments}
            setSegments={setSegments}
            campaigns={campaigns}
            setCampaigns={setCampaigns}
            deliveries={deliveries}
            sequences={sequences}
            setSequences={setSequences}
            templates={templates}
            setTemplates={setTemplates}
            deals={deals}
            setDeals={setDeals}
            salesTasks={salesTasks}
            setSalesTasks={setSalesTasks}
            activities={activities}
            setActivities={setActivities}
            meetings={meetings}
            setMeetings={setMeetings}
            creditTransactions={creditTransactions}
            setCreditTransactions={setCreditTransactions}
            creditPackages={creditPackages}
            creditBalance={creditBalance}
            setCreditBalance={setCreditBalance}
            auditLogs={auditLogs}
            setAuditLogs={setAuditLogs}
            workspaceSettings={workspaceSettings}
            setWorkspaceSettings={setWorkspaceSettings}
            profileSettings={profileSettings}
            setProfileSettings={setProfileSettings}
            notificationSettings={notificationSettings}
            setNotificationSettings={setNotificationSettings}
            securityPreferences={securityPreferences}
            setSecurityPreferences={setSecurityPreferences}
            addAuditLog={addAuditLog}
            branches={branches}
          />
        </main>
      </div>
    </div>
  );
}
