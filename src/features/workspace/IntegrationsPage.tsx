import React, { useState, useMemo } from 'react';
import {
  Building2,
  UserCheck,
  AlertCircle,
  ClipboardList,
  Search,
  Settings,
  X,
  Eye,
  Plus,
  Save,
} from 'lucide-react';
import { Dropdown } from '../../components/shared/Dropdown';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { IntegrationBrandLogo } from '../../components/shared/IntegrationBrandLogo';

export function IntegrationsPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [selected, setSelected] = useState<any>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [configForm, setConfigForm] = useState<Record<string, string>>({});
  const [configErrors, setConfigErrors] = useState<Record<string, string>>({});
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({});

  const [integrations, setIntegrations] = useState<any[]>([
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
        { id: 'branch', label: 'Default Branch for Payments', type: 'select', options: ['Lagos Branch', 'Abuja Branch', 'Port Harcourt Branch', 'Kano Branch'], required: true, placeholder: 'Select default branch' },
        { id: 'sync', label: 'Sync Frequency', type: 'select', options: ['Real-time (Demo simulation)', 'Hourly', 'Daily'], required: true, placeholder: 'Choose sync frequency' },
        { id: 'notify', label: 'Payment Notification Email', type: 'email', required: false, placeholder: 'Enter notification email e.g. finance@leadflow.ng' },
        { id: 'notes', label: 'Integration Notes', type: 'textarea', required: false, placeholder: 'Enter notes about this integration e.g. Used for enterprise collections' },
      ],
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
        { id: 'branch', label: 'Settlement Branch', type: 'select', options: ['Lagos Branch', 'Abuja Branch', 'Port Harcourt Branch', 'Kano Branch'], required: true, placeholder: 'Select settlement branch' },
        { id: 'sync', label: 'Auto-create Lead on Payment', type: 'select', options: ['Yes - simulated demo', 'No'], required: true, placeholder: 'Choose behavior' },
        { id: 'notify', label: 'Settlement Notification Email', type: 'email', required: false, placeholder: 'Enter email e.g. finance@leadflow.ng' },
      ],
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
        { id: 'branch', label: 'Primary Branch Workspace', type: 'select', options: ['Lagos Branch', 'Abuja Branch', 'Port Harcourt Branch', 'Kano Branch'], required: true, placeholder: 'Select primary branch' },
        { id: 'sync', label: 'Calendar Sync Scope', type: 'select', options: ['Meetings only (Demo)', 'All events'], required: true, placeholder: 'Choose sync scope' },
        { id: 'notify', label: 'Workspace Admin Email', type: 'email', required: false, placeholder: 'Enter admin email e.g. admin@leadflow.ng' },
        { id: 'notes', label: 'Workspace Notes', type: 'textarea', required: false, placeholder: 'Enter notes e.g. Used for South-West region docs' },
      ],
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
        { id: 'branch', label: 'Default Branch for Emails', type: 'select', options: ['Lagos Branch', 'Abuja Branch', 'Port Harcourt Branch', 'Kano Branch'], required: true, placeholder: 'Select default branch' },
        { id: 'autoLog', label: 'Auto-log to Activities', type: 'select', options: ['Yes - simulated', 'No'], required: true, placeholder: 'Choose logging behavior' },
      ],
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
        { id: 'branch', label: 'Assigned Branch', type: 'select', options: ['Lagos Branch', 'Abuja Branch', 'Port Harcourt Branch', 'Kano Branch'], required: true, placeholder: 'Select branch' },
      ],
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
      ],
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
        { id: 'branch', label: 'HubSpot Pipeline Branch', type: 'select', options: ['Lagos Branch', 'Abuja Branch', 'Port Harcourt Branch', 'Kano Branch'], required: true, placeholder: 'Select pipeline branch' },
        { id: 'mapping', label: 'Deal Stage Mapping Notes', type: 'textarea', required: false, placeholder: 'Enter mapping notes e.g. Map Qualified → SQL' },
      ],
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'Enterprise CRM sync. Mirror Salesforce opportunities and accounts into LeadFlow deals.',
      category: 'CRM',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg',
      officialSource: 'https://commons.wikimedia.org/wiki/File:Salesforce.com_logo.svg — official Salesforce.com logo (Salesforce-owned asset)',
      status: 'Pending',
      features: ['Opportunity sync', 'Account sync', 'Activity sync'],
      config: [
        { id: 'object', label: 'Salesforce Object', type: 'select', options: ['Opportunity (Demo)', 'Account', 'Contact'], required: true, placeholder: 'Select Salesforce object' },
        { id: 'branch', label: 'Branch Mapping', type: 'select', options: ['Lagos Branch', 'Abuja Branch', 'Port Harcourt Branch', 'Kano Branch'], required: true, placeholder: 'Select branch mapping' },
        { id: 'sync', label: 'Sync Frequency', type: 'select', options: ['Every 15 mins (Demo simulation)', 'Hourly', 'Daily'], required: true, placeholder: 'Choose frequency' },
      ],
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      description: 'Email marketing automation. Sync lists and campaign results back to LeadFlow segments.',
      category: 'Marketing',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Mailchimp_logo.svg',
      officialSource: 'https://mailchimp.com/about/brand-assets/ — official Mailchimp brand assets (Wikimedia representation)',
      status: 'Disconnected',
      features: ['List sync', 'Campaign results', 'Unsubscribe sync'],
      config: [
        { id: 'list', label: 'Default Audience Mapping', type: 'select', options: ['All Leads → Main Audience (Demo)', 'Qualified → Prospects', 'Custom mapping'], required: true, placeholder: 'Select audience mapping' },
        { id: 'branch', label: 'Branch for Campaign Attribution', type: 'select', options: ['Lagos Branch', 'Abuja Branch', 'Port Harcourt Branch', 'Kano Branch'], required: true, placeholder: 'Select attribution branch' },
        { id: 'notify', label: 'Campaign Report Email', type: 'email', required: false, placeholder: 'Enter report email e.g. marketing@leadflow.ng' },
      ],
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Automate workflows between LeadFlow and 6000+ apps. Trigger zaps on new leads and deals.',
      category: 'Automation',
      logoUrl: 'https://raw.githubusercontent.com/zapier/zapier-mcp/main/plugins/zapier/assets/logo.svg',
      officialSource: 'https://github.com/zapier/zapier-mcp — canonical Zapier wordmark SVG from Zapier brand assets folder',
      status: 'Connected',
      connectedAt: '01 Feb 2026',
      features: ['Lead triggers', 'Deal triggers', '6000+ app connections'],
      config: [
        { id: 'trigger', label: 'Primary Trigger Event', type: 'select', options: ['New Lead Created (Demo)', 'Deal Won', 'Task Completed'], required: true, placeholder: 'Select trigger' },
        { id: 'branch', label: 'Branch Filter for Zaps', type: 'select', options: ['All Branches', 'Lagos Branch only', 'Abuja Branch only'], required: true, placeholder: 'Select branch filter' },
        { id: 'notes', label: 'Zap Description', type: 'textarea', required: false, placeholder: 'Enter zap notes e.g. Send Slack on new Lagos lead' },
      ],
    },
  ]);

  const filtered = useMemo(() => {
    return integrations.filter((i: any) => {
      if (search && !`${i.name} ${i.description} ${i.category}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter !== 'All Categories' && i.category !== categoryFilter) return false;
      if (statusFilter !== 'All Statuses' && i.status !== statusFilter) return false;
      return true;
    });
  }, [integrations, search, categoryFilter, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: integrations.length,
      connected: integrations.filter((i: any) => i.status === 'Connected').length,
      disconnected: integrations.filter((i: any) => i.status === 'Disconnected').length,
      pending: integrations.filter((i: any) => i.status === 'Pending').length,
    };
  }, [integrations]);

  const handleConnect = (intg: any) => {
    setIntegrations(prev =>
      prev.map((p: any) =>
        p.id === intg.id
          ? { ...p, status: 'Connected', connectedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }
          : p
      )
    );
  };

  const handleDisconnect = (intg: any) => {
    setIntegrations(prev =>
      prev.map((p: any) =>
        p.id === intg.id ? { ...p, status: 'Disconnected', connectedAt: undefined } : p
      )
    );
    setShowConfig(false);
  };

  const openConfigure = (intg: any) => {
    setSelected(intg);
    const initial: Record<string, string> = {};
    intg.config.forEach((f: any) => {
      initial[f.id] = '';
    });
    setConfigForm(initial);
    setConfigErrors({});
    setShowConfig(true);
  };

  const validateConfig = () => {
    const errs: Record<string, string> = {};
    if (!selected) return errs;
    selected.config.forEach((f: any) => {
      if (f.required && !configForm[f.id]?.toString().trim()) {
        errs[f.id] = `${f.label} is required`;
      }
      if (f.type === 'email' && configForm[f.id] && !configForm[f.id].includes('@')) {
        errs[f.id] = 'Enter a valid email address';
      }
    });
    return errs;
  };

  const handleSaveConfig = () => {
    const errs = validateConfig();
    setConfigErrors(errs);
    if (Object.keys(errs).length) return;
    if (selected.status === 'Disconnected') {
      handleConnect(selected);
    }
    setShowConfig(false);
  };

  return (
    <div className="flex flex-col gap-[20px] max-w-[1600px]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-[12px]">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight">Integrations</h1>
          <p className="text-[14px] text-[var(--text-secondary)] mt-[2px]">
            Connect CRM, payments, communications, marketing, and automation tools. All connections shown are simulated demo integrations — no real account authentication is performed.
          </p>
        </div>
        <div className="flex items-center gap-[8px]">
          <button
            onClick={() => {
              setSearch('');
              setCategoryFilter('All Categories');
              setStatusFilter('All Statuses');
            }}
            className="h-[38px] px-[14px] rounded-[10px] bg-[var(--input-bg)] text-[13px] text-[var(--text-primary)] hover:bg-[#EAECE8] font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* KPI Cards: Borderless, Soft Shadows, Coordinated Icons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[16px]">
        {[
          { label: 'Total Integrations', value: stats.total, sub: '10 verified services', icon: Building2, bg: 'bg-[#EBF5FF]', iconColor: 'text-[#2563EB]' },
          { label: 'Connected (Demo)', value: stats.connected, sub: `${stats.connected} active connections`, icon: UserCheck, bg: 'bg-[#EFFBEA]', iconColor: 'text-[#16A34A]' },
          { label: 'Disconnected', value: stats.disconnected, sub: `${stats.pending} pending setup`, icon: AlertCircle, bg: 'bg-[#FEE2E2]', iconColor: 'text-[#DC2626]' },
          { label: 'Categories', value: 6, sub: 'Payments • Comms • CRM • Marketing • Productivity • Automation', icon: ClipboardList, bg: 'bg-[#FEF3C7]', iconColor: 'text-[#D97706]' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-[14px] p-[20px] flex flex-col gap-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="flex items-start justify-between">
              <span className="text-[13px] text-[var(--text-secondary)] font-medium">{k.label}</span>
              <div className={`w-[32px] h-[32px] rounded-[9px] ${k.bg} flex items-center justify-center shrink-0`}>
                <k.icon size={16} className={k.iconColor} />
              </div>
            </div>
            <div className="text-[26px] font-semibold leading-none tracking-tight">{k.value}</div>
            <div className="text-[12px] text-[var(--text-muted)] truncate">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Main Container: Borderless, Soft Shadow */}
      <div className="bg-white rounded-[14px] p-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col lg:flex-row gap-[12px] justify-between mb-[14px]">
          <div className="relative w-full lg:max-w-[360px]">
            <Search size={16} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search integrations e.g. Flutterwave, Gmail"
              className="w-full h-[40px] pl-[36px] pr-[12px] rounded-[10px] bg-[var(--input-bg)] border border-transparent text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:bg-white focus:ring-[2px] focus:ring-[var(--primary-soft)] transition-all"
              aria-label="Search integrations"
            />
          </div>
          <div className="flex flex-wrap gap-[8px]">
            <Dropdown value={categoryFilter} onChange={setCategoryFilter} options={['All Categories', 'Payments', 'Communications', 'CRM', 'Marketing', 'Productivity', 'Automation']} />
            <Dropdown value={statusFilter} onChange={setStatusFilter} options={['All Statuses', 'Connected', 'Disconnected', 'Pending']} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[14px]">
          {filtered.map((intg: any) => (
            <div
              key={intg.id}
              className="border border-[var(--border)] rounded-[12px] p-[16px] flex flex-col gap-[14px] bg-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-[12px] items-start">
                  <div className="w-[44px] h-[44px] rounded-[10px] bg-white border border-[var(--border)] flex items-center justify-center shrink-0 overflow-hidden p-[6px]">
                    <IntegrationBrandLogo
                      id={intg.id}
                      name={intg.name}
                      logoUrl={intg.logoUrl}
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-[14px] flex items-center gap-[6px]">
                      {intg.name}
                      {intg.status === 'Connected' && (
                        <span className="text-[10px] px-[6px] py-[2px] rounded-[6px] bg-[#EFFBEA] text-[#2E7D32] border border-[#C5E8B7]">
                          Demo
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] mt-[2px]">{intg.category}</div>
                    <div className="text-[11px] mt-[4px]">
                      <StatusBadge label={intg.status} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-[6px]">
                  <span className="text-[10px] text-[var(--text-muted)] max-w-[100px] text-right truncate" title={intg.officialSource}>
                    Official: {intg.officialSource.split(' — ')[0]}
                  </span>
                </div>
              </div>

              <div className="text-[12px] text-[var(--text-secondary)] leading-[1.4] line-clamp-3">{intg.description}</div>

              <div className="flex flex-wrap gap-[6px]">
                {intg.features.map((f: string) => (
                  <span key={f} className="text-[10px] px-[8px] py-[3px] rounded-[6px] bg-[var(--input-bg)] border border-transparent text-[var(--text-secondary)]">
                    {f}
                  </span>
                ))}
              </div>

              <div className="bg-[var(--input-bg)] rounded-[10px] p-[10px] flex flex-col gap-[6px]">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[var(--text-muted)]">Status</span>
                  <span className="font-medium flex items-center gap-[4px]">
                    {intg.status}
                    {intg.connectedAt && <span className="text-[10px] text-[var(--text-muted)]">• {intg.connectedAt}</span>}
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[var(--text-muted)]">Connection Type</span>
                  <span className="font-medium text-[11px]">
                    {intg.status === 'Connected' ? 'Simulated Demo — no real auth' : 'Not connected'}
                  </span>
                </div>
                <div className="text-[10px] text-[var(--text-muted)] mt-[2px]">Source: {intg.officialSource}</div>
              </div>

              <div className="flex gap-[8px]">
                {intg.status === 'Connected' ? (
                  <>
                    <button onClick={() => openConfigure(intg)} className="flex-1 h-[36px] rounded-[10px] bg-white border border-[var(--border)] text-[13px] font-medium flex items-center justify-center gap-[6px]">
                      <Settings size={14} />Configure
                    </button>
                    <button onClick={() => handleDisconnect(intg)} className="flex-1 h-[36px] rounded-[10px] bg-[#FEF2F2] border border-[#FECACA] text-[13px] font-medium text-[#B91C1C] flex items-center justify-center gap-[6px]">
                      <X size={14} />Disconnect
                    </button>
                  </>
                ) : intg.status === 'Pending' ? (
                  <>
                    <button onClick={() => openConfigure(intg)} className="flex-1 h-[36px] rounded-[10px] bg-[#FFF4E5] border border-[#FED7AA] text-[13px] font-medium text-[#B45309]">
                      Configure Pending
                    </button>
                    <button onClick={() => handleConnect(intg)} className="flex-1 h-[36px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold">
                      Connect Demo
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setSelected(intg); setShowConfig(false); }} className="flex-1 h-[36px] rounded-[10px] bg-[var(--input-bg)] text-[13px] font-medium flex items-center justify-center gap-[6px]">
                      <Eye size={14} />Details
                    </button>
                    <button onClick={() => handleConnect(intg)} className="flex-1 h-[36px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold flex items-center justify-center gap-[6px]">
                      <Plus size={14} />Connect
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="py-[32px] text-center text-[13px] text-[var(--text-muted)]">
            No integrations match your filters. Try adjusting search, category, or status.
          </div>
        )}
      </div>

      {selected && !showConfig && (
        <div className="fixed inset-0 z-[60] flex justify-end bg-black/20" onClick={() => setSelected(null)}>
          <div className="w-full max-w-[520px] bg-white h-full overflow-auto border-l border-[var(--border)]" onClick={e => e.stopPropagation()}>
            <div className="p-[20px] border-b border-[var(--border)] flex justify-between items-start">
              <div className="flex gap-[12px]">
                <div className="w-[48px] h-[48px] rounded-[12px] bg-white border border-[var(--border)] flex items-center justify-center overflow-hidden p-[6px]">
                  <IntegrationBrandLogo id={selected.id} name={selected.name} logoUrl={selected.logoUrl} />
                </div>
                <div>
                  <div className="font-semibold text-[16px] flex items-center gap-[6px]">
                    {selected.name}
                    {selected.status === 'Connected' && <span className="text-[10px] px-[6px] py-[2px] rounded-[6px] bg-[#EFFBEA] text-[#2E7D32]">Demo Connected</span>}
                  </div>
                  <div className="text-[12px] text-[var(--text-muted)]">{selected.category} • {selected.status}{selected.connectedAt && ` • ${selected.connectedAt}`}</div>
                  <div className="text-[11px] text-[var(--text-muted)] mt-[2px]">{selected.officialSource}</div>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="p-[6px] bg-[var(--input-bg)] rounded-[8px]"><X size={14} /></button>
            </div>
            <div className="p-[20px] flex flex-col gap-[20px]">
              <div>
                <div className="text-[12px] font-semibold mb-[8px]">About</div>
                <div className="text-[12px] text-[var(--text-secondary)] bg-[var(--input-bg)] rounded-[10px] p-[12px]">
                  {selected.description}
                  <div className="mt-[8px] flex flex-wrap gap-[6px]">
                    {selected.features.map((f: string) => (
                      <span key={f} className="text-[10px] px-[8px] py-[3px] rounded-[6px] bg-white border border-[var(--border)]">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-[12px] font-semibold mb-[8px]">Connection Details (Demo Simulation)</div>
                <div className="bg-[var(--input-bg)] rounded-[10px] p-[12px] text-[11px] text-[var(--text-secondary)]">
                  This integration is a <span className="font-medium text-[var(--text-primary)]">simulated demo connection</span>. No real OAuth, API keys, or passwords are requested. Connecting toggles local state only and does not access your {selected.name} account.<br /><br />
                  Official logo source: {selected.officialSource}<br />
                  Logo URL: <span className="break-all text-[10px]">{selected.logoUrl}</span>
                </div>
              </div>
              <div className="flex gap-[8px]">
                <button onClick={() => { openConfigure(selected); }} className="flex-1 h-[40px] rounded-[10px] bg-white border border-[var(--border)] text-[13px] font-medium flex items-center justify-center gap-[6px]">
                  <Settings size={14} />{selected.status === 'Connected' ? 'Configure' : 'Connect Demo'}
                </button>
                <button onClick={() => setSelected(null)} className="flex-1 h-[40px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showConfig && selected && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-[16px] bg-black/30">
          <div className="w-full max-w-[560px] bg-white rounded-[16px] border border-[var(--border)] shadow-xl overflow-auto max-h-[90vh]">
            <div className="p-[20px] border-b border-[var(--border)] flex justify-between items-center">
              <div className="flex items-center gap-[10px]">
                <div className="w-[36px] h-[36px] rounded-[10px] bg-white border border-[var(--border)] flex items-center justify-center overflow-hidden p-[4px]">
                  <IntegrationBrandLogo id={selected.id} name={selected.name} logoUrl={selected.logoUrl} />
                </div>
                <div>
                  <div className="font-semibold text-[15px]">{selected.status === 'Connected' ? 'Configure' : 'Connect'} {selected.name} — Demo Mode</div>
                  <div className="text-[11px] text-[var(--text-muted)]">{selected.category} • No real credentials required</div>
                </div>
              </div>
              <button onClick={() => setShowConfig(false)} className="w-[32px] h-[32px] rounded-[8px] bg-[var(--input-bg)] flex items-center justify-center">
                <X size={16} />
              </button>
            </div>
            <div className="p-[20px] flex flex-col gap-[16px]">
              <div className="bg-[#EFFBEA] border border-[#C5E8B7] rounded-[10px] p-[10px] text-[11px] text-[#166534]">
                You are configuring a <span className="font-semibold">simulated demo integration</span>. This does not connect to your real {selected.name} account and does not request passwords, API keys, or OAuth secrets.
              </div>
              {selected.config.map((field: any) => (
                <div key={field.id}>
                  <label htmlFor={`intg-${selected.id}-${field.id}`} className="text-[12px] font-medium flex items-center gap-[4px]">
                    {field.label}{field.required && <span className="text-[#B91C1C]">*</span>}
                  </label>
                  {field.type === 'select' ? (
                    <Dropdown
                      value={configForm[field.id] || ''}
                      placeholder={field.placeholder || `Select ${field.label}`}
                      options={field.options}
                      onChange={v => setConfigForm({ ...configForm, [field.id]: v })}
                      wrapperClassName="w-full mt-[6px]"
                      className={`w-full ${configErrors[field.id] ? 'border-[#FCA5A5] bg-[#FEF2F2]' : ''}`}
                    />
                  ) : field.type === 'textarea' ? (
                    <textarea
                      id={`intg-${selected.id}-${field.id}`}
                      value={configForm[field.id] || ''}
                      onChange={e => setConfigForm({ ...configForm, [field.id]: e.target.value })}
                      placeholder={field.placeholder}
                      className={`mt-[6px] w-full min-h-[80px] p-[12px] rounded-[10px] bg-[var(--input-bg)] border text-[13px] focus:outline-none focus:border-[var(--primary)] ${configErrors[field.id] ? 'border-[#FCA5A5] bg-[#FEF2F2]' : 'border-transparent'}`}
                    />
                  ) : (
                    <input
                      id={`intg-${selected.id}-${field.id}`}
                      type={field.type === 'email' ? 'email' : 'text'}
                      value={configForm[field.id] || ''}
                      onChange={e => setConfigForm({ ...configForm, [field.id]: e.target.value })}
                      placeholder={field.placeholder}
                      className={`mt-[6px] w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] border text-[13px] focus:outline-none focus:border-[var(--primary)] ${configErrors[field.id] ? 'border-[#FCA5A5] bg-[#FEF2F2]' : 'border-transparent'}`}
                    />
                  )}
                  {configErrors[field.id] && (
                    <div className="text-[11px] text-[#B91C1C] mt-[4px] flex items-center gap-[4px]">
                      <AlertCircle size={12} />{configErrors[field.id]}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="p-[20px] border-t border-[var(--border)] bg-[var(--bg)] flex justify-end gap-[8px]">
              <button onClick={() => setShowConfig(false)} className="h-[40px] px-[16px] rounded-[10px] bg-white border border-[var(--border)] text-[13px]">
                Cancel
              </button>
              <button onClick={handleSaveConfig} className="h-[40px] px-[20px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold flex items-center gap-[6px]">
                <Save size={14} />{selected.status === 'Connected' ? 'Save Configuration' : 'Connect Demo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
