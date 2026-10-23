import React, { useState, useEffect } from 'react';
import { Check, Save } from 'lucide-react';
import {
  WorkspaceSettings,
  ProfileSettings,
  NotificationSettings,
  SecurityPreferences,
  TeamMemberDetail,
  AuditLog,
} from '../../types/crm';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { Dropdown } from '../../components/shared/Dropdown';

interface SettingsPageProps {
  workspaceSettings: WorkspaceSettings;
  setWorkspaceSettings: React.Dispatch<React.SetStateAction<WorkspaceSettings>>;
  profileSettings: ProfileSettings;
  setProfileSettings: React.Dispatch<React.SetStateAction<ProfileSettings>>;
  notificationSettings: NotificationSettings;
  setNotificationSettings: React.Dispatch<React.SetStateAction<NotificationSettings>>;
  securityPreferences: SecurityPreferences;
  setSecurityPreferences: React.Dispatch<React.SetStateAction<SecurityPreferences>>;
  teamMembers: TeamMemberDetail[];
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp' | 'dateLabel'>) => void;
  branches: string[];
}

export function SettingsPage({
  workspaceSettings,
  setWorkspaceSettings,
  profileSettings,
  setProfileSettings,
  notificationSettings,
  setNotificationSettings,
  securityPreferences,
  setSecurityPreferences,
  teamMembers,
  addAuditLog,
  branches,
}: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState<'Workspace' | 'Profile' | 'Team & Permissions' | 'Notifications' | 'Security & Preferences'>('Workspace');
  const [workspaceForm, setWorkspaceForm] = useState(workspaceSettings);
  const [profileForm, setProfileForm] = useState(profileSettings);
  const [notifForm, setNotifForm] = useState(notificationSettings);
  const [securityForm, setSecurityForm] = useState(securityPreferences);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => { setWorkspaceForm(workspaceSettings); }, [workspaceSettings]);
  useEffect(() => { setProfileForm(profileSettings); }, [profileSettings]);
  useEffect(() => { setNotifForm(notificationSettings); }, [notificationSettings]);
  useEffect(() => { setSecurityForm(securityPreferences); }, [securityPreferences]);

  const validateWorkspace = () => {
    const e: Record<string, string> = {};
    if (!workspaceForm.workspaceName.trim()) e.workspaceName = 'Workspace name is required';
    if (!workspaceForm.website.trim()) e.website = 'Website is required';
    else if (!workspaceForm.website.includes('.')) e.website = 'Enter a valid website';
    if (!workspaceForm.defaultBranch) e.defaultBranch = 'Default branch is required';
    return e;
  };

  const validateProfile = () => {
    const e: Record<string, string> = {};
    if (!profileForm.displayName.trim()) e.displayName = 'Display name is required';
    if (!profileForm.email.includes('@')) e.email = 'Enter a valid email';
    return e;
  };

  const handleSave = (section: string) => {
    let errs: Record<string, string> = {};
    if (activeTab === 'Workspace') errs = validateWorkspace();
    if (activeTab === 'Profile') errs = validateProfile();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    if (activeTab === 'Workspace') {
      setWorkspaceSettings(workspaceForm);
      addAuditLog({
        actor: profileForm.displayName,
        action: 'Settings updated — Workspace',
        actionType: 'Settings',
        affectedRecord: 'workspace-settings',
        affectedRecordType: 'Settings',
        outcome: 'Success',
        details: `Workspace settings updated: name=${workspaceForm.workspaceName}, defaultBranch=${workspaceForm.defaultBranch}. Simulated save.`,
        branch: workspaceForm.defaultBranch,
        isDemo: false,
      });
    }
    if (activeTab === 'Profile') {
      setProfileSettings(profileForm);
      addAuditLog({
        actor: profileForm.displayName,
        action: 'Settings updated — Profile',
        actionType: 'Settings',
        affectedRecord: 'profile-settings',
        affectedRecordType: 'Settings',
        outcome: 'Success',
        details: `Profile updated for ${profileForm.displayName}. Simulated save.`,
        branch: workspaceForm.defaultBranch,
        isDemo: false,
      });
    }
    if (activeTab === 'Notifications') {
      setNotificationSettings(notifForm);
      addAuditLog({
        actor: profileForm.displayName,
        action: 'Settings updated — Notifications',
        actionType: 'Settings',
        affectedRecord: 'notification-settings',
        affectedRecordType: 'Settings',
        outcome: 'Success',
        details: 'Notification preferences updated. Simulated save.',
        branch: workspaceForm.defaultBranch,
        isDemo: false,
      });
    }
    if (activeTab === 'Security & Preferences') {
      setSecurityPreferences(securityForm);
      addAuditLog({
        actor: profileForm.displayName,
        action: 'Settings updated — Security & Preferences',
        actionType: 'Settings',
        affectedRecord: 'security-preferences',
        affectedRecordType: 'Settings',
        outcome: 'Success',
        details: `Security & interface preferences updated: landing=${securityForm.defaultLandingPage}, density=${securityForm.density}. Simulated save.`,
        branch: workspaceForm.defaultBranch,
        isDemo: false,
      });
    }
    setSaveSuccess(section);
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const roles = [
    { role: 'Admin', desc: 'Full access to all branches, billing, team, and settings', permissions: ['All permissions', 'Manage billing & credits', 'Manage team & branches', 'Edit workspace settings', 'View audit logs'], color: '#2E7D32' },
    { role: 'Sales Manager', desc: 'Manages deals, team performance, and branch leads', permissions: ['View & edit leads', 'Manage deals & pipeline', 'View team performance', 'Manage tasks & meetings'], color: '#1A56DB' },
    { role: 'SDR', desc: 'Focuses on outbound, qualification, and lead discovery', permissions: ['Discover & enrich leads', 'View & edit assigned leads', 'Log activities', 'Create tasks'], color: '#B45309' },
    { role: 'Account Executive', desc: 'Closes deals and manages key accounts', permissions: ['View qualified leads', 'Manage deals', 'Schedule meetings', 'View reports'], color: '#7C3AED' },
    { role: 'Support Specialist', desc: 'Customer success and enrichment support', permissions: ['View leads (read-only)', 'Enrich contacts', 'Manage support tasks'], color: '#69716A' },
    { role: 'Viewer', desc: 'Read-only access for reporting', permissions: ['View leads & deals', 'View reports', 'No edit permissions'], color: '#8B928C' },
  ];

  return (
    <div className="flex flex-col gap-[20px] max-w-[1600px]">
      <div>
        <h1 className="text-[24px] font-semibold tracking-tight">Settings</h1>
        <p className="text-[14px] text-[var(--text-secondary)] mt-[2px]">
          Manage workspace, profile, team permissions, notifications, and interface preferences. Changes are simulated and preserved in frontend state.
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-[14px] p-[8px] flex gap-[6px] w-fit overflow-auto">
        {(['Workspace', 'Profile', 'Team & Permissions', 'Notifications', 'Security & Preferences'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`h-[36px] px-[14px] rounded-[10px] text-[13px] font-medium whitespace-nowrap transition-all ${
              activeTab === tab ? 'bg-[var(--text-primary)] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--input-bg)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {saveSuccess && (
        <div className="bg-[#EFFBEA] border border-[#C5E8B7] rounded-[12px] p-[12px] flex items-center gap-[10px]">
          <div className="w-[28px] h-[28px] rounded-full bg-[#2E7D32] flex items-center justify-center">
            <Check size={14} className="text-white" />
          </div>
          <div className="text-[13px] font-medium">{saveSuccess} saved successfully — simulated save preserved in frontend state.</div>
        </div>
      )}

      {activeTab === 'Workspace' && (
        <div className="bg-white shadow-sm rounded-[14px] p-[20px]">
          <h2 className="text-[15px] font-semibold mb-[4px]">Workspace Settings</h2>
          <p className="text-[12px] text-[var(--text-secondary)] mb-[16px]">
            Update workspace name, branding details, and basic workspace preferences. Organized for easy editing without scrolling through one enormous form.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
            <div>
              <label htmlFor="ws-name" className="text-[12px] font-medium">Workspace Name *</label>
              <input
                id="ws-name"
                value={workspaceForm.workspaceName}
                onChange={e => setWorkspaceForm({ ...workspaceForm, workspaceName: e.target.value })}
                placeholder="Enter workspace name e.g. LeadFlow CRM"
                className={`mt-[6px] w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] border text-[13px] focus:outline-none focus:border-[var(--primary)] ${errors.workspaceName ? 'border-[#FCA5A5] bg-[#FEF2F2]' : 'border-transparent'}`}
              />
              {errors.workspaceName && <div className="text-[11px] text-[#B91C1C] mt-[4px]">{errors.workspaceName}</div>}
            </div>
            <div>
              <label htmlFor="ws-tagline" className="text-[12px] font-medium">Tagline</label>
              <input
                id="ws-tagline"
                value={workspaceForm.tagline}
                onChange={e => setWorkspaceForm({ ...workspaceForm, tagline: e.target.value })}
                placeholder="Enter tagline e.g. Discover. Rate. Convert. Measure."
                className="mt-[6px] w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] border border-transparent text-[13px] focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
            <div>
              <label htmlFor="ws-website" className="text-[12px] font-medium">Website *</label>
              <input
                id="ws-website"
                value={workspaceForm.website}
                onChange={e => setWorkspaceForm({ ...workspaceForm, website: e.target.value })}
                placeholder="Enter website e.g. https://leadflow.ng"
                className={`mt-[6px] w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] border text-[13px] focus:outline-none focus:border-[var(--primary)] ${errors.website ? 'border-[#FCA5A5] bg-[#FEF2F2]' : 'border-transparent'}`}
              />
              {errors.website && <div className="text-[11px] text-[#B91C1C] mt-[4px]">{errors.website}</div>}
            </div>
            <div>
              <label htmlFor="ws-logo" className="text-[12px] font-medium">Logo Letter (Branding)</label>
              <input
                id="ws-logo"
                value={workspaceForm.logoLetter}
                onChange={e => setWorkspaceForm({ ...workspaceForm, logoLetter: e.target.value.slice(0, 2).toUpperCase() })}
                placeholder="Enter 2 letters e.g. LF"
                className="mt-[6px] w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] border border-[var(--border)] text-[13px] text-[var(--text-primary)] focus:outline-none focus:border-[#76E05B] focus:ring-[2px] focus:ring-[#EFFBEA]"
              />
            </div>
            <div>
              <label className="text-[12px] font-medium text-[var(--text-primary)]">Default Branch *</label>
              <div className="mt-[6px]">
                <Dropdown
                  id="ws-branch"
                  placeholder="Select default branch"
                  value={workspaceForm.defaultBranch}
                  options={branches.filter(b => b !== 'All Branches')}
                  onChange={val => setWorkspaceForm({ ...workspaceForm, defaultBranch: val })}
                  wrapperClassName="w-full"
                  className={`w-full h-[40px] ${errors.defaultBranch ? 'border-[#FCA5A5] bg-[#FEF2F2]' : ''}`}
                  menuClassName="w-full"
                />
              </div>
              {errors.defaultBranch && <div className="text-[11px] text-[#B91C1C] mt-[4px]">{errors.defaultBranch}</div>}
            </div>
            <div>
              <label className="text-[12px] font-medium text-[var(--text-primary)]">Default Currency</label>
              <div className="mt-[6px]">
                <Dropdown
                  id="ws-currency"
                  placeholder="Select currency"
                  value={workspaceForm.defaultCurrency}
                  options={['NGN (₦)', 'USD ($)', 'EUR (€)', 'GBP (£)']}
                  onChange={val => setWorkspaceForm({ ...workspaceForm, defaultCurrency: val })}
                  wrapperClassName="w-full"
                  className="w-full h-[40px]"
                  menuClassName="w-full"
                />
              </div>
            </div>
            <div>
              <label className="text-[12px] font-medium text-[var(--text-primary)]">Timezone</label>
              <div className="mt-[6px]">
                <Dropdown
                  id="ws-timezone"
                  placeholder="Select timezone"
                  value={workspaceForm.timezone}
                  options={['Africa/Lagos (WAT, UTC+1)', 'Africa/Cairo (EET, UTC+2)', 'Europe/London (GMT)', 'America/New_York (EST)']}
                  onChange={val => setWorkspaceForm({ ...workspaceForm, timezone: val })}
                  wrapperClassName="w-full"
                  className="w-full h-[40px]"
                  menuClassName="w-full"
                />
              </div>
            </div>
            <div>
              <label className="text-[12px] font-medium text-[var(--text-primary)]">Date Format</label>
              <div className="mt-[6px]">
                <Dropdown
                  id="ws-date"
                  placeholder="Select date format"
                  value={workspaceForm.dateFormat}
                  options={['DD MMM YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']}
                  onChange={val => setWorkspaceForm({ ...workspaceForm, dateFormat: val })}
                  wrapperClassName="w-full"
                  className="w-full h-[40px]"
                  menuClassName="w-full"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-[8px] mt-[20px]">
            <button onClick={() => setWorkspaceForm(workspaceSettings)} className="h-[40px] px-[16px] rounded-[10px] bg-white border border-[var(--border)] text-[13px]">
              Cancel
            </button>
            <button onClick={() => handleSave('Workspace settings')} className="h-[40px] px-[20px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold flex items-center gap-[6px]">
              <Save size={14} />Save Changes
            </button>
          </div>
        </div>
      )}

      {activeTab === 'Profile' && (
        <div className="bg-white shadow-sm rounded-[14px] p-[20px]">
          <h2 className="text-[15px] font-semibold mb-[4px]">Profile Settings</h2>
          <p className="text-[12px] text-[var(--text-secondary)] mb-[16px]">
            Personal display name, email display, and profile preferences. Email display is shown as read-only where appropriate.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
            <div>
              <label htmlFor="profile-name" className="text-[12px] font-medium">Display Name *</label>
              <input
                id="profile-name"
                value={profileForm.displayName}
                onChange={e => setProfileForm({ ...profileForm, displayName: e.target.value })}
                placeholder="Enter display name e.g. Dominion Castiel"
                className={`mt-[6px] w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] border text-[13px] focus:outline-none focus:border-[var(--primary)] ${errors.displayName ? 'border-[#FCA5A5] bg-[#FEF2F2]' : 'border-transparent'}`}
              />
              {errors.displayName && <div className="text-[11px] text-[#B91C1C] mt-[4px]">{errors.displayName}</div>}
            </div>
            <div>
              <label htmlFor="profile-email" className="text-[12px] font-medium">Email Address *</label>
              <input
                id="profile-email"
                value={profileForm.email}
                onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                placeholder="Enter email e.g. dominion@leadflow.ng"
                className={`mt-[6px] w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] border text-[13px] focus:outline-none focus:border-[var(--primary)] ${errors.email ? 'border-[#FCA5A5] bg-[#FEF2F2]' : 'border-transparent'}`}
              />
              {errors.email && <div className="text-[11px] text-[#B91C1C] mt-[4px]">{errors.email}</div>}
            </div>
            <div>
              <label htmlFor="profile-role" className="text-[12px] font-medium">Role (from Team Records)</label>
              <input
                id="profile-role"
                value={profileForm.role}
                readOnly
                className="mt-[6px] w-full h-[40px] px-[12px] rounded-[10px] bg-[#F3F5F2] border border-[var(--border)] text-[13px] text-[var(--text-muted)]"
                placeholder="Role e.g. Admin"
              />
            </div>
            <div>
              <label htmlFor="profile-phone" className="text-[12px] font-medium">Phone Number</label>
              <input
                id="profile-phone"
                value={profileForm.phone}
                onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                placeholder="Enter phone e.g. +234 803 100 1001"
                className="mt-[6px] w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] border border-transparent text-[13px] focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
            <div>
              <label className="text-[12px] font-medium text-[var(--text-primary)]">Language Preference</label>
              <div className="mt-[6px]">
                <Dropdown
                  id="profile-lang"
                  placeholder="Select language"
                  value={profileForm.language}
                  options={['English (EN)', 'French (FR)', 'Yoruba']}
                  onChange={val => setProfileForm({ ...profileForm, language: val })}
                  wrapperClassName="w-full"
                  className="w-full h-[40px]"
                  menuClassName="w-full"
                />
              </div>
            </div>
            <div>
              <label className="text-[12px] font-medium text-[var(--text-primary)]">Personal Timezone</label>
              <div className="mt-[6px]">
                <Dropdown
                  id="profile-tz"
                  placeholder="Select timezone"
                  value={profileForm.personalTimezone}
                  options={['Africa/Lagos (WAT, UTC+1)', 'Africa/Cairo (EET, UTC+2)', 'Europe/London (GMT)']}
                  onChange={val => setProfileForm({ ...profileForm, personalTimezone: val })}
                  wrapperClassName="w-full"
                  className="w-full h-[40px]"
                  menuClassName="w-full"
                />
              </div>
            </div>
            <div className="lg:col-span-2">
              <label htmlFor="profile-bio" className="text-[12px] font-medium">Bio / Personal Notes</label>
              <textarea
                id="profile-bio"
                value={profileForm.bio}
                onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                placeholder="Enter bio e.g. Founder & Admin overseeing all operations..."
                className="mt-[6px] w-full min-h-[80px] p-[12px] rounded-[10px] bg-[var(--input-bg)] border border-transparent text-[13px] focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-[8px] mt-[20px]">
            <button onClick={() => setProfileForm(profileSettings)} className="h-[40px] px-[16px] rounded-[10px] bg-white border border-[var(--border)] text-[13px]">
              Cancel
            </button>
            <button onClick={() => handleSave('Profile')} className="h-[40px] px-[20px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold flex items-center gap-[6px]">
              <Save size={14} />Save Changes
            </button>
          </div>
        </div>
      )}

      {activeTab === 'Team & Permissions' && (
        <div className="flex flex-col gap-[16px]">
          <div className="bg-white shadow-sm rounded-[14px] p-[20px]">
            <h2 className="text-[15px] font-semibold mb-[4px]">Team & Permissions — Roles Overview</h2>
            <p className="text-[12px] text-[var(--text-secondary)] mb-[16px]">
              Available roles and permission summaries, consistent with existing Workspace team records. Roles define what members can view and edit across branches.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[12px]">
              {roles.map(r => (
                <div key={r.role} className="border border-[var(--border)] rounded-[12px] p-[14px]">
                  <div className="flex items-center gap-[8px] mb-[6px]">
                    <div className="w-[8px] h-[8px] rounded-full" style={{ background: r.color }} />
                    <span className="text-[13px] font-semibold">{r.role}</span>
                    <span className="ml-auto text-[10px] px-[6px] py-[2px] rounded-full bg-[var(--input-bg)]">{r.permissions.length} permissions</span>
                  </div>
                  <div className="text-[11px] text-[var(--text-secondary)] mb-[8px]">{r.desc}</div>
                  <div className="flex flex-wrap gap-[4px]">
                    {r.permissions.map(p => (
                      <span key={p} className="text-[10px] px-[6px] py-[2px] rounded-[6px] bg-[var(--input-bg)] border border-transparent">{p}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white shadow-sm rounded-[14px] p-[20px]">
            <h3 className="text-[13px] font-semibold mb-[12px]">Current Team Members — Branch & Role Consistency</h3>
            <div className="overflow-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[11px] uppercase tracking-[0.06em] text-[var(--text-muted)]">
                    <th className="py-[8px] px-[10px] font-medium">Member</th>
                    <th className="py-[8px] px-[10px] font-medium">Role</th>
                    <th className="py-[8px] px-[10px] font-medium">Branch</th>
                    <th className="py-[8px] px-[10px] font-medium">Status</th>
                    <th className="py-[8px] px-[10px] font-medium">Permissions</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map(m => (
                    <tr key={m.id} className="border-b border-[var(--border)]/60">
                      <td className="py-[10px] px-[10px]">
                        <div className="flex items-center gap-[8px]">
                          <div className="w-[28px] h-[28px] rounded-full flex items-center justify-center text-[11px] font-semibold" style={{ background: m.avatarColor }}>
                            {m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <div className="text-[12px] font-medium">{m.name}</div>
                            <div className="text-[11px] text-[var(--text-muted)]">{m.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-[10px] px-[10px] text-[12px]"><StatusBadge label={m.role} /></td>
                      <td className="py-[10px] px-[10px] text-[12px]">{m.branch}</td>
                      <td className="py-[10px] px-[10px]"><StatusBadge label={m.status} /></td>
                      <td className="py-[10px] px-[10px] text-[11px] text-[var(--text-secondary)]">{m.permissions.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-[12px] bg-[var(--input-bg)] rounded-[10px] p-[10px] text-[11px] text-[var(--text-secondary)]">
              Team records are sourced from Workspace → Team & Assignments. Editing team assignments should be done in Workspace Team to keep permissions consistent. This view is read-only summary for audit purposes.
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Notifications' && (
        <div className="bg-white shadow-sm rounded-[14px] p-[20px]">
          <h2 className="text-[15px] font-semibold mb-[4px]">Notification Preferences</h2>
          <p className="text-[12px] text-[var(--text-secondary)] mb-[16px]">
            Configurable notification preferences for leads, deals, credits, and system events. Choose how you want to be notified.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px]">
            <div className="space-y-[14px]">
              <div className="text-[12px] font-semibold">Lead & Deal Activity</div>
              {[
                { key: 'newLeadAssigned', label: 'New Lead Assigned', desc: 'When a lead is assigned to you' },
                { key: 'dealStageChanged', label: 'Deal Stage Changed', desc: 'When deal moves to new stage' },
                { key: 'taskDue', label: 'Task Due Reminder', desc: '24h before task due' },
              ].map(item => (
                <label key={item.key} className="flex items-start gap-[10px] p-[10px] border border-[var(--border)] rounded-[10px] cursor-pointer hover:bg-[var(--input-bg)]">
                  <input
                    type="checkbox"
                    checked={(notifForm as any)[item.key]}
                    onChange={e => setNotifForm({ ...notifForm, [item.key]: e.target.checked })}
                    className="mt-[2px]"
                  />
                  <div>
                    <div className="text-[12px] font-medium">{item.label}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">{item.desc}</div>
                  </div>
                </label>
              ))}
            </div>
            <div className="space-y-[14px]">
              <div className="text-[12px] font-semibold">System & Credit Alerts</div>
              {[
                { key: 'creditLow', label: 'Credit Low Warning', desc: 'When balance drops below 600 credits' },
                { key: 'weeklyReport', label: 'Weekly Performance Report', desc: 'Every Monday 9AM summary' },
                { key: 'integrationFailed', label: 'Integration Failed', desc: 'When integration sync fails' },
              ].map(item => (
                <label key={item.key} className="flex items-start gap-[10px] p-[10px] border border-[var(--border)] rounded-[10px] cursor-pointer hover:bg-[var(--input-bg)]">
                  <input
                    type="checkbox"
                    checked={(notifForm as any)[item.key]}
                    onChange={e => setNotifForm({ ...notifForm, [item.key]: e.target.checked })}
                    className="mt-[2px]"
                  />
                  <div>
                    <div className="text-[12px] font-medium">{item.label}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">{item.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="mt-[20px] pt-[16px] border-t border-[var(--border)]">
            <div className="text-[12px] font-semibold mb-[10px]">Delivery Channels</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[12px]">
              <label className="flex items-center gap-[8px] p-[12px] border border-[var(--border)] rounded-[10px]">
                <input
                  type="checkbox"
                  checked={notifForm.emailNotifications}
                  onChange={e => setNotifForm({ ...notifForm, emailNotifications: e.target.checked })}
                />
                <span className="text-[12px] font-medium">Email Notifications</span>
              </label>
              <label className="flex items-center gap-[8px] p-[12px] border border-[var(--border)] rounded-[10px]">
                <input
                  type="checkbox"
                  checked={notifForm.pushNotifications}
                  onChange={e => setNotifForm({ ...notifForm, pushNotifications: e.target.checked })}
                />
                <span className="text-[12px] font-medium">Push Notifications</span>
              </label>
              <label className="flex items-center gap-[8px] p-[12px] border border-[var(--border)] rounded-[10px]">
                <input
                  type="checkbox"
                  checked={notifForm.slackNotifications}
                  onChange={e => setNotifForm({ ...notifForm, slackNotifications: e.target.checked })}
                />
                <span className="text-[12px] font-medium">Slack Notifications</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-[8px] mt-[20px]">
            <button onClick={() => setNotifForm(notificationSettings)} className="h-[40px] px-[16px] rounded-[10px] bg-white border border-[var(--border)] text-[13px]">
              Cancel
            </button>
            <button onClick={() => handleSave('Notification preferences')} className="h-[40px] px-[20px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold flex items-center gap-[6px]">
              <Save size={14} />Save Changes
            </button>
          </div>
        </div>
      )}

      {activeTab === 'Security & Preferences' && (
        <div className="bg-white shadow-sm rounded-[14px] p-[20px]">
          <h2 className="text-[15px] font-semibold mb-[4px]">Security & Preferences</h2>
          <p className="text-[12px] text-[var(--text-secondary)] mb-[16px]">
            Relevant interface and account preferences supported by the existing frontend. No fake authentication, password changes, or security guarantees are implemented.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
            <div>
              <label className="text-[12px] font-medium">Default Landing Page</label>
              <div className="mt-[6px]">
                <Dropdown
                  id="sec-landing"
                  placeholder="Select landing page"
                  value={securityForm.defaultLandingPage}
                  options={['Overview', 'All Leads', 'Sales Pipeline', 'Credits & Billing']}
                  onChange={val => setSecurityForm({ ...securityForm, defaultLandingPage: val })}
                  wrapperClassName="w-full"
                  className="w-full h-[40px]"
                  menuClassName="w-full"
                />
              </div>
            </div>
            <div>
              <label className="text-[12px] font-medium">Interface Density</label>
              <div className="mt-[6px]">
                <Dropdown
                  id="sec-density"
                  placeholder="Select density"
                  value={securityForm.density}
                  options={['Comfortable', 'Compact']}
                  onChange={val => setSecurityForm({ ...securityForm, density: val as any })}
                  wrapperClassName="w-full"
                  className="w-full h-[40px]"
                  menuClassName="w-full"
                />
              </div>
            </div>
            <div>
              <label className="text-[12px] font-medium">Time Format</label>
              <div className="mt-[6px]">
                <Dropdown
                  id="sec-time"
                  placeholder="Select format"
                  value={securityForm.timeFormat}
                  options={['12h', '24h']}
                  onChange={val => setSecurityForm({ ...securityForm, timeFormat: val as any })}
                  wrapperClassName="w-full"
                  className="w-full h-[40px]"
                  menuClassName="w-full"
                />
              </div>
            </div>
            <div>
              <label className="text-[12px] font-medium">Inactivity Timeout</label>
              <div className="mt-[6px]">
                <Dropdown
                  id="sec-timeout"
                  placeholder="Select timeout"
                  value={securityForm.activityTimeout}
                  options={['15 minutes', '30 minutes', '60 minutes', 'Never']}
                  onChange={val => setSecurityForm({ ...securityForm, activityTimeout: val })}
                  wrapperClassName="w-full"
                  className="w-full h-[40px]"
                  menuClassName="w-full"
                />
              </div>
            </div>
            <label className="flex items-center gap-[8px] p-[12px] border border-[var(--border)] rounded-[10px]">
              <input
                type="checkbox"
                checked={securityForm.showAvatars}
                onChange={e => setSecurityForm({ ...securityForm, showAvatars: e.target.checked })}
              />
              <div>
                <div className="text-[12px] font-medium">Show Avatars</div>
                <div className="text-[11px] text-[var(--text-muted)]">Display user avatars in lists and tables</div>
              </div>
            </label>
            <label className="flex items-center gap-[8px] p-[12px] border border-[var(--border)] rounded-[10px]">
              <input
                type="checkbox"
                checked={securityForm.autoSave}
                onChange={e => setSecurityForm({ ...securityForm, autoSave: e.target.checked })}
              />
              <div>
                <div className="text-[12px] font-medium">Auto-save Forms</div>
                <div className="text-[11px] text-[var(--text-muted)]">Automatically save draft changes</div>
              </div>
            </label>
          </div>
          <div className="mt-[16px] bg-[var(--input-bg)] rounded-[10px] p-[12px] text-[11px] text-[var(--text-secondary)]">
            Security note: This demo does not implement authentication, password management, or security guarantees. All preferences are stored locally in frontend state and reset on page reload in production builds without backend persistence.
          </div>
          <div className="flex justify-end gap-[8px] mt-[20px]">
            <button onClick={() => setSecurityForm(securityPreferences)} className="h-[40px] px-[16px] rounded-[10px] bg-white border border-[var(--border)] text-[13px]">
              Cancel
            </button>
            <button onClick={() => handleSave('Security & Preferences')} className="h-[40px] px-[20px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold flex items-center gap-[6px]">
              <Save size={14} />Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
