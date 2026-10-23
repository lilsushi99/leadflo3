import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { OverviewPage } from '../features/overview/OverviewPage';
import { AllLeadsPage } from '../features/lead-intelligence/AllLeadsPage';
import { DiscoveryPage } from '../features/lead-intelligence/DiscoveryPage';
import { ListsPage } from '../features/lead-intelligence/ListsPage';
import { ImportPage } from '../features/lead-intelligence/ImportPage';
import { EmailCampaignsPage } from '../features/outreach/EmailCampaignsPage';
import { EmailDeliveriesPage } from '../features/outreach/EmailDeliveriesPage';
import { SequencesPage } from '../features/outreach/SequencesPage';
import { TemplatesPage } from '../features/outreach/TemplatesPage';
import { SalesPipelinePage } from '../features/sales/SalesPipelinePage';
import { DealsPage } from '../features/sales/DealsPage';
import { TasksActivitiesPage } from '../features/sales/TasksActivitiesPage';
import { MeetingsCallsPage } from '../features/sales/MeetingsCallsPage';
import { AnalyticsReportsPage } from '../features/insights/AnalyticsReportsPage';
import { TeamPerformancePage } from '../features/insights/TeamPerformancePage';
import { TeamAssignmentsPage } from '../features/workspace/TeamAssignmentsPage';
import { BranchesPage } from '../features/workspace/BranchesPage';
import { IntegrationsPage } from '../features/workspace/IntegrationsPage';
import { CreditsBillingPage } from '../features/administration/CreditsBillingPage';
import { SettingsPage } from '../features/administration/SettingsPage';
import { AuditCompliancePage } from '../features/administration/AuditCompliancePage';

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

export interface RouteConfig {
  id: string;
  path: string;
  label: string;
  parentId?: string;
  aliases?: string[];
}

export const APP_ROUTES: RouteConfig[] = [
  { id: 'overview', path: '/overview', label: 'Overview', aliases: ['/'] },
  { id: 'all-leads', path: '/lead-intelligence/all-leads', label: 'All Leads', parentId: 'lead-intelligence', aliases: ['/lead-intelligence', '/all-leads'] },
  { id: 'discovery', path: '/lead-intelligence/lead-discovery', label: 'Lead Discovery', parentId: 'lead-intelligence', aliases: ['/lead-intelligence/discovery', '/discovery'] },
  { id: 'lists', path: '/lead-intelligence/lists-and-segments', label: 'Lists & Segments', parentId: 'lead-intelligence', aliases: ['/lead-intelligence/lists', '/lists'] },
  { id: 'import', path: '/lead-intelligence/import', label: 'Import & Enrichment', parentId: 'lead-intelligence', aliases: ['/lead-intelligence/enrichment', '/import'] },
  { id: 'outreach-email-campaigns', path: '/outreach/email-campaigns', label: 'Email Campaigns', parentId: 'outreach', aliases: ['/outreach', '/outreach/campaigns', '/email-campaigns'] },
  { id: 'outreach-email-deliveries', path: '/outreach/email-deliveries', label: 'Email Deliveries', parentId: 'outreach', aliases: ['/outreach/deliveries', '/email-deliveries'] },
  { id: 'outreach-sequences', path: '/outreach/sequences', label: 'Sequences & Follow-ups', parentId: 'outreach', aliases: ['/outreach/follow-ups', '/sequences'] },
  { id: 'outreach-templates', path: '/outreach/templates', label: 'Templates', parentId: 'outreach', aliases: ['/templates'] },
  { id: 'sales-pipeline', path: '/sales/pipeline', label: 'Sales Pipeline', parentId: 'sales', aliases: ['/sales', '/sales-pipeline', '/pipeline'] },
  { id: 'sales-deals', path: '/sales/deals', label: 'Deals', parentId: 'sales', aliases: ['/sales-deals', '/deals'] },
  { id: 'sales-tasks', path: '/sales/tasks-and-activities', label: 'Tasks & Activities', parentId: 'sales', aliases: ['/sales/tasks', '/sales/activities', '/tasks'] },
  { id: 'sales-meetings', path: '/sales/meetings-and-calls', label: 'Meetings & Calls', parentId: 'sales', aliases: ['/sales/meetings', '/sales/calls', '/meetings'] },
  { id: 'insights-analytics', path: '/insights/analytics', label: 'Analytics & Reports', parentId: 'insights', aliases: ['/insights', '/insights/reports', '/analytics'] },
  { id: 'insights-team', path: '/insights/team-performance', label: 'Team Performance', parentId: 'insights', aliases: ['/insights/team', '/team-performance'] },
  { id: 'workspace-team', path: '/workspace/team-and-assignment', label: 'Team & Assignments', parentId: 'workspace', aliases: ['/workspace', '/workspace/team', '/team-assignment'] },
  { id: 'workspace-branches', path: '/workspace/branches', label: 'Branches', parentId: 'workspace', aliases: ['/branches'] },
  { id: 'workspace-integrations', path: '/workspace/integrations', label: 'Integrations', parentId: 'workspace', aliases: ['/integrations'] },
  { id: 'admin-billing', path: '/administration/credits-and-billing', label: 'Credits & Billing', parentId: 'administration', aliases: ['/administration/billing', '/administration/credits', '/billing'] },
  { id: 'admin-settings', path: '/administration/settings', label: 'Settings', parentId: 'administration', aliases: ['/administration', '/settings'] },
  { id: 'admin-audit', path: '/administration/audit-and-compliance', label: 'Audit & Compliance', parentId: 'administration', aliases: ['/administration/audit', '/administration/compliance', '/audit'] },
];

export function getRouteById(id: string): RouteConfig | undefined {
  return APP_ROUTES.find(r => r.id === id);
}

export function getPathByPageId(id: string): string {
  const r = getRouteById(id);
  return r ? r.path : '/overview';
}

export function getPageIdByPath(pathname: string): string {
  const cleanPath = pathname.replace(/\/+$/, '') || '/';
  for (const r of APP_ROUTES) {
    if (r.path === cleanPath || r.aliases?.includes(cleanPath)) {
      return r.id;
    }
  }
  return 'overview';
}

export interface AppRouteProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  filteredByGlobal: Lead[];
  branch: string;
  setBranch: (b: string) => void;
  branchList: string[];
  setBranchList: React.Dispatch<React.SetStateAction<string[]>>;
  branchDetails: BranchDetail[];
  setBranchDetails: React.Dispatch<React.SetStateAction<BranchDetail[]>>;
  teamMembers: TeamMemberDetail[];
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMemberDetail[]>>;
  dateRange: string;
  setDateRange: (d: string) => void;
  sourceFilter: string | null;
  setSourceFilter: (s: string | null) => void;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  lists: any[];
  setLists: React.Dispatch<React.SetStateAction<any[]>>;
  segments: any[];
  setSegments: React.Dispatch<React.SetStateAction<any[]>>;
  campaigns: Campaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
  deliveries: Delivery[];
  sequences: Sequence[];
  setSequences: React.Dispatch<React.SetStateAction<Sequence[]>>;
  templates: Template[];
  setTemplates: React.Dispatch<React.SetStateAction<Template[]>>;
  deals: Deal[];
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>;
  salesTasks: SalesTask[];
  setSalesTasks: React.Dispatch<React.SetStateAction<SalesTask[]>>;
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  meetings: Meeting[];
  setMeetings: React.Dispatch<React.SetStateAction<Meeting[]>>;
  creditTransactions: CreditTransaction[];
  setCreditTransactions: React.Dispatch<React.SetStateAction<CreditTransaction[]>>;
  creditPackages: CreditPackage[];
  creditBalance: number;
  setCreditBalance: React.Dispatch<React.SetStateAction<number>>;
  auditLogs: AuditLog[];
  setAuditLogs: React.Dispatch<React.SetStateAction<AuditLog[]>>;
  workspaceSettings: WorkspaceSettings;
  setWorkspaceSettings: React.Dispatch<React.SetStateAction<WorkspaceSettings>>;
  profileSettings: ProfileSettings;
  setProfileSettings: React.Dispatch<React.SetStateAction<ProfileSettings>>;
  notificationSettings: NotificationSettings;
  setNotificationSettings: React.Dispatch<React.SetStateAction<NotificationSettings>>;
  securityPreferences: SecurityPreferences;
  setSecurityPreferences: React.Dispatch<React.SetStateAction<SecurityPreferences>>;
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp' | 'dateLabel'>) => void;
  branches: string[];
}

export function AppRouter(props: AppRouteProps): React.ReactElement {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/overview" replace />} />
      <Route
        path="/overview"
        element={
          <OverviewPage
            leads={props.filteredByGlobal}
            branch={props.branch}
            dateRange={props.dateRange}
            setCurrentPage={props.setCurrentPage}
            setSourceFilter={props.setSourceFilter}
            tasks={props.tasks}
            setTasks={props.setTasks}
          />
        }
      />

      {/* Lead Intelligence */}
      <Route
        path="/lead-intelligence/all-leads"
        element={
          <AllLeadsPage
            leads={props.filteredByGlobal}
            setLeads={props.setLeads}
            sourceFilter={props.sourceFilter}
            setSourceFilter={props.setSourceFilter}
            branch={props.branch}
          />
        }
      />
      <Route path="/all-leads" element={<Navigate to="/lead-intelligence/all-leads" replace />} />
      <Route path="/lead-intelligence" element={<Navigate to="/lead-intelligence/all-leads" replace />} />

      <Route
        path="/lead-intelligence/lead-discovery"
        element={<DiscoveryPage leads={props.leads} setLeads={props.setLeads} />}
      />
      <Route path="/lead-intelligence/discovery" element={<Navigate to="/lead-intelligence/lead-discovery" replace />} />
      <Route path="/discovery" element={<Navigate to="/lead-intelligence/lead-discovery" replace />} />

      <Route
        path="/lead-intelligence/lists-and-segments"
        element={
          <ListsPage
            leads={props.leads}
            lists={props.lists}
            setLists={props.setLists}
            segments={props.segments}
            setSegments={props.setSegments}
          />
        }
      />
      <Route path="/lead-intelligence/lists" element={<Navigate to="/lead-intelligence/lists-and-segments" replace />} />
      <Route path="/lists" element={<Navigate to="/lead-intelligence/lists-and-segments" replace />} />

      <Route
        path="/lead-intelligence/import"
        element={<ImportPage leads={props.leads} setLeads={props.setLeads} />}
      />
      <Route path="/import" element={<Navigate to="/lead-intelligence/import" replace />} />

      {/* Outreach */}
      <Route
        path="/outreach/email-campaigns"
        element={
          <EmailCampaignsPage
            campaigns={props.campaigns}
            setCampaigns={props.setCampaigns}
            lists={props.lists}
          />
        }
      />
      <Route path="/outreach" element={<Navigate to="/outreach/email-campaigns" replace />} />
      <Route path="/outreach/campaigns" element={<Navigate to="/outreach/email-campaigns" replace />} />

      <Route
        path="/outreach/email-deliveries"
        element={<EmailDeliveriesPage deliveries={props.deliveries} />}
      />
      <Route path="/outreach/deliveries" element={<Navigate to="/outreach/email-deliveries" replace />} />

      <Route
        path="/outreach/sequences"
        element={
          <SequencesPage
            sequences={props.sequences}
            setSequences={props.setSequences}
          />
        }
      />
      <Route path="/outreach/follow-ups" element={<Navigate to="/outreach/sequences" replace />} />

      <Route
        path="/outreach/templates"
        element={
          <TemplatesPage
            templates={props.templates}
            setTemplates={props.setTemplates}
          />
        }
      />

      {/* Sales */}
      <Route
        path="/sales/pipeline"
        element={
          <SalesPipelinePage
            deals={props.deals}
            setDeals={props.setDeals}
            activities={props.activities}
            setActivities={props.setActivities}
          />
        }
      />
      <Route path="/sales" element={<Navigate to="/sales/pipeline" replace />} />
      <Route path="/sales-pipeline" element={<Navigate to="/sales/pipeline" replace />} />
      <Route path="/pipeline" element={<Navigate to="/sales/pipeline" replace />} />

      <Route
        path="/sales/deals"
        element={
          <DealsPage
            deals={props.deals}
            setDeals={props.setDeals}
            leads={props.leads}
            activities={props.activities}
            meetings={props.meetings}
          />
        }
      />
      <Route path="/deals" element={<Navigate to="/sales/deals" replace />} />

      <Route
        path="/sales/tasks-and-activities"
        element={
          <TasksActivitiesPage
            salesTasks={props.salesTasks}
            setSalesTasks={props.setSalesTasks}
            activities={props.activities}
            setActivities={props.setActivities}
            leads={props.leads}
            deals={props.deals}
          />
        }
      />
      <Route path="/sales/tasks" element={<Navigate to="/sales/tasks-and-activities" replace />} />
      <Route path="/sales/activities" element={<Navigate to="/sales/tasks-and-activities" replace />} />
      <Route path="/tasks" element={<Navigate to="/sales/tasks-and-activities" replace />} />

      <Route
        path="/sales/meetings-and-calls"
        element={
          <MeetingsCallsPage
            meetings={props.meetings}
            setMeetings={props.setMeetings}
            salesTasks={props.salesTasks}
            setSalesTasks={props.setSalesTasks}
            leads={props.leads}
            deals={props.deals}
          />
        }
      />
      <Route path="/sales/meetings" element={<Navigate to="/sales/meetings-and-calls" replace />} />
      <Route path="/meetings" element={<Navigate to="/sales/meetings-and-calls" replace />} />

      {/* Insights */}
      <Route
        path="/insights/analytics"
        element={
          <AnalyticsReportsPage
            leads={props.leads}
            deals={props.deals}
            campaigns={props.campaigns}
            deliveries={props.deliveries}
            activities={props.activities}
            meetings={props.meetings}
            salesTasks={props.salesTasks}
            branch={props.branch}
            dateRange={props.dateRange}
          />
        }
      />
      <Route path="/insights" element={<Navigate to="/insights/analytics" replace />} />
      <Route path="/insights/reports" element={<Navigate to="/insights/analytics" replace />} />
      <Route path="/analytics" element={<Navigate to="/insights/analytics" replace />} />

      <Route
        path="/insights/team-performance"
        element={
          <TeamPerformancePage
            leads={props.leads}
            deals={props.deals}
            campaigns={props.campaigns}
            salesTasks={props.salesTasks}
            activities={props.activities}
            meetings={props.meetings}
            branch={props.branch}
            dateRange={props.dateRange}
          />
        }
      />
      <Route path="/insights/team" element={<Navigate to="/insights/team-performance" replace />} />

      {/* Workspace */}
      <Route
        path="/workspace/team-and-assignment"
        element={
          <TeamAssignmentsPage
            leads={props.leads}
            setLeads={props.setLeads}
            deals={props.deals}
            setDeals={props.setDeals}
            salesTasks={props.salesTasks}
            meetings={props.meetings}
            activities={props.activities}
            teamMembers={props.teamMembers}
            setTeamMembers={props.setTeamMembers}
            branchList={props.branchList}
          />
        }
      />
      <Route path="/workspace" element={<Navigate to="/workspace/team-and-assignment" replace />} />
      <Route path="/workspace/team" element={<Navigate to="/workspace/team-and-assignment" replace />} />

      <Route
        path="/workspace/branches"
        element={
          <BranchesPage
            leads={props.leads}
            deals={props.deals}
            branchDetails={props.branchDetails}
            setBranchDetails={props.setBranchDetails}
            branchList={props.branchList}
            setBranchList={props.setBranchList}
            teamMembers={props.teamMembers}
          />
        }
      />
      <Route path="/branches" element={<Navigate to="/workspace/branches" replace />} />

      <Route
        path="/workspace/integrations"
        element={<IntegrationsPage />}
      />
      <Route path="/integrations" element={<Navigate to="/workspace/integrations" replace />} />

      {/* Administration */}
      <Route
        path="/administration/credits-and-billing"
        element={
          <CreditsBillingPage
            transactions={props.creditTransactions}
            setTransactions={props.setCreditTransactions}
            packages={props.creditPackages}
            balance={props.creditBalance}
            setBalance={props.setCreditBalance}
            addAuditLog={props.addAuditLog}
            teamMembers={props.teamMembers}
          />
        }
      />
      <Route path="/administration/billing" element={<Navigate to="/administration/credits-and-billing" replace />} />
      <Route path="/admin-billing" element={<Navigate to="/administration/credits-and-billing" replace />} />
      <Route path="/billing" element={<Navigate to="/administration/credits-and-billing" replace />} />

      <Route
        path="/administration/settings"
        element={
          <SettingsPage
            workspaceSettings={props.workspaceSettings}
            setWorkspaceSettings={props.setWorkspaceSettings}
            profileSettings={props.profileSettings}
            setProfileSettings={props.setProfileSettings}
            notificationSettings={props.notificationSettings}
            setNotificationSettings={props.setNotificationSettings}
            securityPreferences={props.securityPreferences}
            setSecurityPreferences={props.setSecurityPreferences}
            teamMembers={props.teamMembers}
            addAuditLog={props.addAuditLog}
            branches={props.branches}
          />
        }
      />
      <Route path="/administration" element={<Navigate to="/administration/settings" replace />} />
      <Route path="/admin-settings" element={<Navigate to="/administration/settings" replace />} />
      <Route path="/settings" element={<Navigate to="/administration/settings" replace />} />

      <Route
        path="/administration/audit-and-compliance"
        element={
          <AuditCompliancePage
            logs={props.auditLogs}
            setLogs={props.setAuditLogs}
            teamMembers={props.teamMembers}
          />
        }
      />
      <Route path="/administration/audit" element={<Navigate to="/administration/audit-and-compliance" replace />} />
      <Route path="/admin-audit" element={<Navigate to="/administration/audit-and-compliance" replace />} />
      <Route path="/audit" element={<Navigate to="/administration/audit-and-compliance" replace />} />

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/overview" replace />} />
    </Routes>
  );
}
