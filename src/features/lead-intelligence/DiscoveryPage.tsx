import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Lead, LeadSource, LeadStatus, Verification } from '../../types/crm';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { avatarColors, sources, users } from '../../data/mock/leads';

interface DiscoveryPageProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
}

export function DiscoveryPage({ leads, setLeads }: DiscoveryPageProps) {
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('Lagos');
  const [selectedSources, setSelectedSources] = useState<string[]>(['LinkedIn', 'Website']);
  const [contactType, setContactType] = useState('Both');
  const [emailVal, setEmailVal] = useState(true);
  const [phoneVal, setPhoneVal] = useState(false);
  const [limit, setLimit] = useState(50);
  const [jobStatus, setJobStatus] = useState<'Draft' | 'Queued' | 'Processing' | 'Completed' | 'Failed'>('Draft');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<Lead[]>([]);
  const [selectedResults, setSelectedResults] = useState<string[]>([]);
  const [history, setHistory] = useState<any[]>([
    { id: '1', name: 'SaaS founders Lagos', date: 'Feb 10', owner: 'Dominion', status: 'Completed', count: 42, credits: 42 },
    { id: '2', name: 'Marketing agencies Abuja', date: 'Feb 8', owner: 'Sarah', status: 'Completed', count: 28, credits: 28 },
    { id: '3', name: 'Tech leads PH', date: 'Feb 5', owner: 'Mark', status: 'Failed', count: 0, credits: 0 },
  ]);

  const estimatedCredits = limit;

  const startDiscovery = () => {
    setJobStatus('Queued');
    setProgress(0);
    setResults([]);
    setTimeout(() => {
      setJobStatus('Processing');
      let p = 0;
      const interval = setInterval(() => {
        p += Math.random() * 18 + 5;
        if (p >= 100) {
          p = 100;
          clearInterval(interval);
          const mockResults: Lead[] = Array.from({ length: Math.min(limit, 24) }).map((_, i) => ({
            id: `disc-${Date.now()}-${i}`,
            firstName: ['Tobi', 'Lola', 'Emeka', 'Ada'][i % 4],
            lastName: ['Smith', 'Brown', 'Ojo', 'Ibrahim'][i % 4],
            email: `lead${i}@${['tech', 'agency', 'studio', 'labs'][i % 4]}.co`,
            phone: `+234 80${Math.floor(10000000 + Math.random() * 90000000)}`,
            company: ['FlowTech', 'Bright Studio', 'Nexus Labs', 'Orbit'][i % 4],
            source: selectedSources[i % selectedSources.length] as LeadSource,
            location: location,
            service: 'Web Development',
            verification: (['Verified', 'Risky', 'Unknown'][i % 3] as Verification),
            status: 'New' as LeadStatus,
            assignee: users[0],
            branch: 'Lagos Branch',
            createdAt: 'Now',
            lastActivity: 'Just now',
            avatarColor: avatarColors[i % avatarColors.length],
            matchQuality: (['High', 'Medium', 'Low'][i % 3] as any),
          }));
          setResults(mockResults);
          setJobStatus('Completed');
          setHistory((h) => [
            {
              id: Date.now().toString(),
              name: keywords || 'Untitled discovery',
              date: 'Now',
              owner: 'Dominion',
              status: 'Completed',
              count: mockResults.length,
              credits: mockResults.length,
            },
            ...h,
          ]);
        }
        setProgress(Math.min(100, p));
      }, 300);
    }, 900);
  };

  const importSelected = () => {
    const toImport = results.filter((r) => selectedResults.includes(r.id));
    setLeads([...toImport, ...leads]);
    setSelectedResults([]);
    setResults([]);
    setJobStatus('Draft');
  };

  return (
    <div className="max-w-[1440px] flex flex-col gap-[20px]">
      <div>
        <h1 className="text-[24px] font-semibold tracking-tight">Lead Discovery</h1>
        <p className="text-[14px] text-[var(--text-secondary)] mt-[2px]">
          Find new leads based on your target audience and criteria.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-[16px]">
        <div className="bg-white rounded-[14px] p-[20px] flex flex-col gap-[18px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="text-[15px] font-semibold text-[var(--text-primary)]">Discovery Criteria</div>

          <div>
            <label className="text-[12px] font-medium">Search terms, keywords, hashtags</label>
            <textarea
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g. SaaS founders, marketing agencies, fintech CTO"
              className="mt-[6px] w-full min-h-[80px] p-[12px] rounded-[10px] bg-[var(--input-bg)] border border-transparent text-[13px] focus:outline-none focus:border-[var(--primary)] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
            <div>
              <label className="text-[12px] font-medium">Location</label>
              <div className="relative mt-[6px]">
                <MapPin size={14} className="absolute left-[10px] top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-[38px] pl-[32px] pr-[12px] rounded-[10px] bg-[var(--input-bg)] border border-transparent text-[13px] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-medium text-[var(--text-primary)]">Target record limit</label>
                <span className="text-[12px] font-semibold text-[#166534] bg-[#EFFBEA] px-[6px] py-[1px] rounded-[5px]">
                  {limit} records
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={500}
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="w-full mt-[10px] h-[6px] bg-[#E7EAE5] rounded-full appearance-none cursor-pointer accent-[#76E05B] focus:outline-none focus:ring-2 focus:ring-[#76E05B]/30"
              />
              <div className="flex justify-between text-[11px] text-[var(--text-muted)] mt-[4px]">
                <span>10</span>
                <span>500</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[12px] font-medium mb-[8px] block">Sources</label>
            <div className="flex flex-wrap gap-[8px]">
              {sources.map((s) => (
                <label
                  key={s}
                  className={`h-[36px] px-[14px] rounded-[10px] border flex items-center gap-[8px] cursor-pointer text-[13px] ${
                    selectedSources.includes(s)
                      ? 'bg-[var(--primary-soft)] border-[var(--primary-soft-2)] text-[#2E7D32] font-medium'
                      : 'bg-white border-[var(--border)]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSources.includes(s)}
                    onChange={(e) =>
                      setSelectedSources((prev) =>
                        e.target.checked ? [...prev, s] : prev.filter((x) => x !== s)
                      )
                    }
                    className="accent-[var(--primary)]"
                  />
                  {s}
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-[12px]">
            <div>
              <label className="text-[12px] font-medium mb-[8px] block">Contact type</label>
              <div className="flex gap-[8px]">
                {['Email', 'Phone', 'Both'].map((ct) => (
                  <button
                    key={ct}
                    onClick={() => setContactType(ct)}
                    className={`flex-1 h-[36px] rounded-[10px] border text-[13px] font-medium cursor-pointer ${
                      contactType === ct
                        ? 'bg-[var(--primary-soft)] border-[var(--primary-soft-2)] text-[#2E7D32]'
                        : 'bg-white border-[var(--border)]'
                    }`}
                  >
                    {ct}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[12px] font-medium mb-[8px] block">Validation</label>
              <div className="flex flex-col gap-[6px]">
                <label className="flex items-center gap-[8px] text-[13px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailVal}
                    onChange={(e) => setEmailVal(e.target.checked)}
                    className="accent-[var(--primary)]"
                  />
                  Email validation
                </label>
                <label className="flex items-center gap-[8px] text-[13px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={phoneVal}
                    onChange={(e) => setPhoneVal(e.target.checked)}
                    className="accent-[var(--primary)]"
                  />
                  Phone validation
                </label>
              </div>
            </div>
          </div>

          <div className="bg-[#F7F8F5] rounded-[10px] p-[14px] flex items-center justify-between">
            <div>
              <div className="text-[13px] font-medium">Estimated credit usage</div>
              <div className="text-[12px] text-[var(--text-muted)]">1 credit per lead • {limit} leads requested</div>
            </div>
            <div className="text-[20px] font-semibold">
              {estimatedCredits} <span className="text-[12px] font-normal text-[var(--text-muted)]">credits</span>
            </div>
          </div>

          <div className="flex items-center">
            <button
              type="button"
              onClick={startDiscovery}
              disabled={jobStatus === 'Processing' || jobStatus === 'Queued'}
              className="h-[42px] px-[20px] rounded-[10px] bg-[var(--primary)] text-[#1B2D15] text-[14px] font-semibold hover:bg-[var(--primary-hover)] disabled:opacity-50 flex items-center gap-[8px] cursor-pointer transition-colors"
            >
              <Search size={16} />
              Start Discovery
            </button>
          </div>

          {jobStatus !== 'Draft' && (
            <div className="rounded-[12px] p-[16px] bg-[#F7F8F5]">
              <div className="flex items-center justify-between mb-[10px]">
                <span className="text-[13px] font-semibold flex items-center gap-[6px]">
                  Job Status: <StatusBadge label={jobStatus} />
                </span>
                <span className="text-[12px] text-[var(--text-muted)]">{Math.round(progress)}%</span>
              </div>
              <div className="h-[8px] bg-[#E7EAE5] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--primary)] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="grid grid-cols-4 gap-[12px] mt-[12px] text-[12px]">
                <div>
                  <div className="text-[var(--text-muted)]">Processed</div>
                  <div className="font-semibold">{Math.round((progress / 100) * limit)}</div>
                </div>
                <div>
                  <div className="text-[var(--text-muted)]">Found</div>
                  <div className="font-semibold">
                    {results.length || Math.round((progress / 100) * Math.min(limit, 24))}
                  </div>
                </div>
                <div>
                  <div className="text-[var(--text-muted)]">Duplicates</div>
                  <div className="font-semibold">2</div>
                </div>
                <div>
                  <div className="text-[var(--text-muted)]">Credits used</div>
                  <div className="font-semibold">{Math.round((progress / 100) * limit)}</div>
                </div>
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="rounded-[12px] overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)] border border-[#F3F5F2]">
              <div className="p-[14px] flex items-center justify-between bg-white border-b border-[#F3F5F2]">
                <span className="text-[14px] font-semibold">Discovery Results • {results.length} leads</span>
                <button
                  onClick={importSelected}
                  disabled={selectedResults.length === 0}
                  className="h-[36px] px-[14px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold disabled:opacity-50 text-[#1B4D0F] cursor-pointer"
                >
                  Import Selected ({selectedResults.length})
                </button>
              </div>
              <div className="overflow-x-auto max-h-[320px] overflow-y-auto">
                <table className="w-full min-w-[700px]">
                  <thead className="sticky top-0 bg-[var(--bg)] text-[11px] text-[var(--text-muted)]">
                    <tr>
                      <th className="text-left p-[10px]">
                        <input
                          type="checkbox"
                          checked={selectedResults.length === results.length}
                          onChange={() =>
                            setSelectedResults(
                              selectedResults.length === results.length
                                ? []
                                : results.map((r) => r.id)
                            )
                          }
                        />
                      </th>
                      <th className="text-left p-[10px]">Lead</th>
                      <th className="text-left p-[10px]">Source</th>
                      <th className="text-left p-[10px]">Contact</th>
                      <th className="text-left p-[10px]">Validation</th>
                      <th className="text-left p-[10px]">Match</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r) => (
                      <tr key={r.id} className="border-b border-[#F3F5F2]">
                        <td className="p-[10px]">
                          <input
                            type="checkbox"
                            checked={selectedResults.includes(r.id)}
                            onChange={() =>
                              setSelectedResults((s) =>
                                s.includes(r.id) ? s.filter((id) => id !== r.id) : [...s, r.id]
                              )
                            }
                          />
                        </td>
                        <td className="p-[10px] text-[13px]">
                          <div className="font-medium">
                            {r.firstName} {r.lastName}
                          </div>
                          <div className="text-[11px] text-[var(--text-muted)]">{r.company}</div>
                        </td>
                        <td className="p-[10px] text-[12px]">{r.source}</td>
                        <td className="p-[10px] text-[12px]">{r.email}</td>
                        <td className="p-[10px]">
                          <StatusBadge label={r.verification} />
                        </td>
                        <td className="p-[10px]">
                          <StatusBadge label={r.matchQuality || 'Medium'} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-[16px]">
          <div className="bg-white rounded-[14px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="text-[14px] font-semibold mb-[12px] text-[var(--text-primary)]">How Discovery Works</div>
            <div className="flex flex-col gap-[10px] text-[12px] text-[var(--text-secondary)]">
              <div className="flex gap-[10px]">
                <div className="w-[24px] h-[24px] rounded-full bg-[var(--primary-soft)] text-[#2E7D32] flex items-center justify-center text-[11px] font-semibold shrink-0">
                  1
                </div>
                Define target audience with keywords, location and sources.
              </div>
              <div className="flex gap-[10px]">
                <div className="w-[24px] h-[24px] rounded-full bg-[var(--primary-soft)] text-[#2E7D32] flex items-center justify-center text-[11px] font-semibold shrink-0">
                  2
                </div>
                System searches and validates contacts according to your criteria.
              </div>
              <div className="flex gap-[10px]">
                <div className="w-[24px] h-[24px] rounded-full bg-[var(--primary-soft)] text-[#2E7D32] flex items-center justify-center text-[11px] font-semibold shrink-0">
                  3
                </div>
                Review results, check match quality and import qualified leads into your workspace.
              </div>
            </div>
          </div>
          <div className="bg-white rounded-[14px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="text-[14px] font-semibold mb-[12px] text-[var(--text-primary)]">Discovery History</div>
            <div className="flex flex-col">
              {history.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between py-[10px] border-b border-[#F3F5F2] last:border-0"
                >
                  <div>
                    <div className="text-[13px] font-medium">{h.name}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      {h.date} • {h.owner} • {h.credits} credits
                    </div>
                  </div>
                  <div className="flex items-center gap-[8px]">
                    <StatusBadge label={h.status} />
                    <span className="text-[12px] font-medium">{h.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
