import React, { useState, useMemo } from 'react';
import { Plus, Search, Eye, Ellipsis, X, Trash2 } from 'lucide-react';
import { Lead } from '../../types/crm';
import { StatusBadge } from '../../components/shared/StatusBadge';

interface ListsPageProps {
  leads: Lead[];
  lists: any[];
  setLists: React.Dispatch<React.SetStateAction<any[]>>;
  segments: any[];
  setSegments: React.Dispatch<React.SetStateAction<any[]>>;
}

export function ListsPage({
  leads,
  lists,
  setLists,
  segments,
  setSegments,
}: ListsPageProps) {
  const [tab, setTab] = useState<'lists' | 'segments'>('lists');
  const [search, setSearch] = useState('');
  const [showCreateList, setShowCreateList] = useState(false);
  const [showCreateSegment, setShowCreateSegment] = useState(false);
  const [newList, setNewList] = useState({ name: '', description: '', selectedLeads: [] as string[] });
  const [selectedDetail, setSelectedDetail] = useState<any>(null);
  const [ruleDraft, setRuleDraft] = useState<any[]>([
    { field: 'Location', operator: 'equals', value: 'Lagos', logic: 'AND' },
  ]);

  const filteredLists = lists.filter((l: any) => l.name.toLowerCase().includes(search.toLowerCase()));
  const filteredSegments = segments.filter((s: any) => s.name.toLowerCase().includes(search.toLowerCase()));

  const handleCreateList = () => {
    if (!newList.name) return;
    const list = {
      id: Date.now().toString(),
      name: newList.name,
      description: newList.description,
      count: newList.selectedLeads.length,
      owner: 'Dominion',
      updated: 'Now',
      leadIds: newList.selectedLeads,
    };
    setLists([list, ...lists]);
    setShowCreateList(false);
    setNewList({ name: '', description: '', selectedLeads: [] });
  };

  const matchCountForRules = useMemo(() => {
    return leads.filter((lead: Lead) =>
      ruleDraft.every((rule) => {
        const fieldVal = (lead as any)[
          rule.field.toLowerCase() === 'location'
            ? 'location'
            : rule.field.toLowerCase() === 'source'
            ? 'source'
            : rule.field.toLowerCase() === 'status'
            ? 'status'
            : rule.field.toLowerCase() === 'branch'
            ? 'branch'
            : rule.field.toLowerCase() === 'service'
            ? 'service'
            : rule.field.toLowerCase() === 'verification'
            ? 'verification'
            : 'assignee'
        ];
        if (!fieldVal) return false;
        if (rule.operator === 'equals')
          return String(fieldVal).toLowerCase() === rule.value.toLowerCase();
        if (rule.operator === 'contains')
          return String(fieldVal).toLowerCase().includes(rule.value.toLowerCase());
        if (rule.operator === 'not equals')
          return String(fieldVal).toLowerCase() !== rule.value.toLowerCase();
        return true;
      })
    ).length;
  }, [leads, ruleDraft]);

  const handleCreateSegment = () => {
    const seg = {
      id: Date.now().toString(),
      name: `Segment ${segments.length + 1}`,
      description: ruleDraft.map((r) => `${r.field} ${r.operator} ${r.value}`).join(' AND '),
      count: matchCountForRules,
      owner: 'Dominion',
      updated: 'Now',
      rules: ruleDraft,
    };
    setSegments([seg, ...segments]);
    setShowCreateSegment(false);
  };

  return (
    <div className="max-w-[1440px] flex flex-col gap-[20px]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-[12px]">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight">Lists & Segments</h1>
          <p className="text-[14px] text-[var(--text-secondary)] mt-[2px]">
            Organize leads into useful lists and dynamic audience groups.
          </p>
        </div>
        <button
          onClick={() => (tab === 'lists' ? setShowCreateList(true) : setShowCreateSegment(true))}
          className="h-[40px] px-[18px] rounded-[10px] bg-[var(--primary)] text-[#1B2D15] text-[14px] font-semibold flex items-center gap-[8px] cursor-pointer hover:bg-[var(--primary-hover)]"
        >
          <Plus size={16} />
          {tab === 'lists' ? 'Create List' : 'Create Segment'}
        </button>
      </div>

      <div className="bg-white rounded-[14px] p-[16px] flex flex-col gap-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col md:flex-row gap-[12px] justify-between">
          <div className="relative w-full md:max-w-[300px]">
            <Search size={16} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search lists..."
              className="w-full h-[38px] pl-[36px] pr-[12px] rounded-[10px] bg-[var(--input-bg)] border border-transparent text-[13px] focus:outline-none focus:border-[var(--primary)] focus:ring-[2px] focus:ring-[var(--primary-soft)]"
            />
          </div>
          <div className="flex p-[3px] bg-[var(--input-bg)] rounded-[10px] w-fit">
            <button
              onClick={() => setTab('lists')}
              className={`px-[16px] h-[32px] rounded-[8px] text-[13px] font-medium cursor-pointer transition-all ${
                tab === 'lists'
                  ? 'bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-[var(--text-primary)] font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Saved Lists
            </button>
            <button
              onClick={() => setTab('segments')}
              className={`px-[16px] h-[32px] rounded-[8px] text-[13px] font-medium cursor-pointer transition-all ${
                tab === 'segments'
                  ? 'bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-[var(--text-primary)] font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Dynamic Segments
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-[12px] max-w-full">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="text-[11px] text-[var(--text-muted)] border-b border-[var(--border)]">
                <th className="text-left py-[10px] font-medium">Name</th>
                <th className="text-left py-[10px] font-medium">Description</th>
                <th className="text-left py-[10px] font-medium">Leads</th>
                <th className="text-left py-[10px] font-medium">Owner</th>
                <th className="text-left py-[10px] font-medium">Last updated</th>
                <th className="text-left py-[10px] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(tab === 'lists' ? filteredLists : filteredSegments).map((item: any) => (
                <tr key={item.id} className="border-b border-[#F3F5F2] hover:bg-[#F7F8F5]/60">
                  <td className="py-[12px] text-[13px] font-medium">{item.name}</td>
                  <td className="py-[12px] text-[12px] text-[var(--text-secondary)] max-w-[260px] truncate">
                    {item.description}
                  </td>
                  <td className="py-[12px] text-[13px]">
                    <span className="bg-[var(--input-bg)] px-[8px] py-[2px] rounded-[6px] text-[12px]">
                      {item.count}
                    </span>
                  </td>
                  <td className="py-[12px] text-[12px]">{item.owner}</td>
                  <td className="py-[12px] text-[11px] text-[var(--text-muted)]">{item.updated}</td>
                  <td className="py-[12px]">
                    <div className="flex gap-[6px]">
                      <button
                        onClick={() => setSelectedDetail(item)}
                        className="w-[28px] h-[28px] rounded-[8px] bg-[var(--input-bg)] flex items-center justify-center cursor-pointer"
                        aria-label="View list details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="w-[28px] h-[28px] rounded-[8px] hover:bg-[var(--input-bg)] flex items-center justify-center cursor-pointer"
                        aria-label="More actions"
                      >
                        <Ellipsis size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(tab === 'lists' ? filteredLists : filteredSegments).length === 0 && (
            <div className="py-[40px] text-center text-[13px] text-[var(--text-muted)]">
              No {tab} found. Create your first {tab === 'lists' ? 'list' : 'segment'}.
            </div>
          )}
        </div>
      </div>

      {selectedDetail && (
        <div className="bg-white rounded-[14px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-[16px]">
            <div>
              <div className="text-[16px] font-semibold">{selectedDetail.name}</div>
              <div className="text-[13px] text-[var(--text-muted)]">
                {selectedDetail.description} • {selectedDetail.count} leads
              </div>
            </div>
            <button
              onClick={() => setSelectedDetail(null)}
              className="w-[32px] h-[32px] rounded-[8px] bg-[var(--input-bg)] flex items-center justify-center cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[11px] text-[var(--text-muted)] border-b border-[var(--border)]">
                  <th className="text-left py-[8px]">Lead</th>
                  <th className="text-left py-[8px]">Company</th>
                  <th className="text-left py-[8px]">Status</th>
                  <th className="text-left py-[8px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, selectedDetail.count || 5).map((l: Lead) => (
                  <tr key={l.id} className="border-b border-[#F3F5F2]">
                    <td className="py-[10px] text-[13px]">
                      {l.firstName} {l.lastName}
                    </td>
                    <td className="py-[10px] text-[12px]">{l.company}</td>
                    <td className="py-[10px]">
                      <StatusBadge label={l.status} />
                    </td>
                    <td className="py-[10px]">
                      <button className="text-[12px] text-[#B91C1C] cursor-pointer">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showCreateList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-[16px]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCreateList(false)} />
          <div className="relative bg-white rounded-[16px] w-full max-w-[560px] max-h-[90vh] overflow-auto border border-[var(--border)] shadow-xl">
            <div className="p-[20px] border-b border-[var(--border)] flex justify-between items-center">
              <div className="text-[16px] font-semibold">Create Saved List</div>
              <button
                onClick={() => setShowCreateList(false)}
                className="w-[32px] h-[32px] rounded-[8px] bg-[var(--input-bg)] flex items-center justify-center cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-[20px] flex flex-col gap-[14px]">
              <input
                value={newList.name}
                onChange={(e) => setNewList({ ...newList, name: e.target.value })}
                placeholder="List name e.g. Lagos Technology Leads"
                className="h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] border border-transparent text-[13px] focus:outline-none focus:border-[var(--primary)]"
              />
              <textarea
                value={newList.description}
                onChange={(e) => setNewList({ ...newList, description: e.target.value })}
                placeholder="Description"
                className="min-h-[60px] p-[12px] rounded-[10px] bg-[var(--input-bg)] border border-transparent text-[13px] focus:outline-none focus:border-[var(--primary)]"
              />
              <div className="border border-[var(--border)] rounded-[10px] max-h-[200px] overflow-auto">
                <div className="p-[10px] text-[12px] font-medium border-b border-[var(--border)]">Select leads</div>
                {leads.slice(0, 20).map((l: Lead) => (
                  <label
                    key={l.id}
                    className="flex items-center gap-[8px] p-[8px] hover:bg-[var(--input-bg)] text-[13px] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={newList.selectedLeads.includes(l.id)}
                      onChange={(e) =>
                        setNewList({
                          ...newList,
                          selectedLeads: e.target.checked
                            ? [...newList.selectedLeads, l.id]
                            : newList.selectedLeads.filter((id) => id !== l.id),
                        })
                      }
                    />
                    {l.firstName} {l.lastName} • {l.company}
                  </label>
                ))}
              </div>
            </div>
            <div className="p-[20px] border-t border-[var(--border)] flex justify-end gap-[8px] bg-[var(--bg)]">
              <button
                onClick={() => setShowCreateList(false)}
                className="h-[40px] px-[16px] rounded-[10px] bg-white border border-[var(--border)] text-[14px] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateList}
                className="h-[40px] px-[20px] rounded-[10px] bg-[var(--primary)] text-[14px] font-semibold text-[#1B4D0F] cursor-pointer"
              >
                Save List
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateSegment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-[16px]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCreateSegment(false)} />
          <div className="relative bg-white rounded-[16px] w-full max-w-[640px] max-h-[90vh] overflow-auto border border-[var(--border)] shadow-xl">
            <div className="p-[20px] border-b border-[var(--border)] flex justify-between items-center">
              <div className="text-[16px] font-semibold">Create Dynamic Segment</div>
              <button
                onClick={() => setShowCreateSegment(false)}
                className="w-[32px] h-[32px] rounded-[8px] bg-[var(--input-bg)] flex items-center justify-center cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-[20px] flex flex-col gap-[14px]">
              <div className="flex flex-col gap-[10px]">
                {ruleDraft.map((rule, idx) => (
                  <div key={idx} className="flex gap-[8px] items-center">
                    <select
                      value={rule.field}
                      onChange={(e) =>
                        setRuleDraft((rd) =>
                          rd.map((r, i) => (i === idx ? { ...r, field: e.target.value } : r))
                        )
                      }
                      className="h-[36px] px-[10px] rounded-[8px] bg-[var(--input-bg)] border border-transparent text-[12px]"
                    >
                      {['Location', 'Source', 'Status', 'Service', 'Branch', 'Assignee', 'Verification'].map(
                        (f) => (
                          <option key={f}>{f}</option>
                        )
                      )}
                    </select>
                    <select
                      value={rule.operator}
                      onChange={(e) =>
                        setRuleDraft((rd) =>
                          rd.map((r, i) => (i === idx ? { ...r, operator: e.target.value } : r))
                        )
                      }
                      className="h-[36px] px-[10px] rounded-[8px] bg-[var(--input-bg)] border border-transparent text-[12px]"
                    >
                      {['equals', 'contains', 'not equals'].map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                    <input
                      value={rule.value}
                      onChange={(e) =>
                        setRuleDraft((rd) =>
                          rd.map((r, i) => (i === idx ? { ...r, value: e.target.value } : r))
                        )
                      }
                      className="flex-1 h-[36px] px-[10px] rounded-[8px] bg-[var(--input-bg)] border border-transparent text-[12px]"
                      placeholder="Value"
                    />
                    <button
                      onClick={() => setRuleDraft((rd) => rd.filter((_, i) => i !== idx))}
                      className="w-[32px] h-[32px] rounded-[8px] bg-[#FEECEC] flex items-center justify-center cursor-pointer"
                    >
                      <Trash2 size={14} className="text-[#B91C1C]" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() =>
                  setRuleDraft([...ruleDraft, { field: 'Status', operator: 'equals', value: 'Qualified', logic: 'AND' }])
                }
                className="h-[36px] px-[14px] rounded-[10px] bg-white border border-[var(--border)] text-[13px] flex items-center gap-[6px] w-fit cursor-pointer"
              >
                <Plus size={14} />
                Add rule
              </button>
              <div className="bg-[var(--primary-soft)] border border-[var(--primary-soft-2)] rounded-[10px] p-[12px] text-[13px] text-[#1B4D0F]">
                Matching leads: <span className="font-semibold">{matchCountForRules}</span> • Rules apply automatically
                when data changes
              </div>
            </div>
            <div className="p-[20px] border-t border-[var(--border)] flex justify-end gap-[8px] bg-[var(--bg)]">
              <button
                onClick={() => setShowCreateSegment(false)}
                className="h-[40px] px-[16px] rounded-[10px] bg-white border border-[var(--border)] text-[14px] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSegment}
                className="h-[40px] px-[20px] rounded-[10px] bg-[var(--primary)] text-[14px] font-semibold text-[#1B4D0F] cursor-pointer"
              >
                Save Segment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
