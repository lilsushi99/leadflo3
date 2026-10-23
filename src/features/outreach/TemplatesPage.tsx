import React, { useState, useMemo } from 'react';
import { Plus, Search, Trash2, X, SearchX } from 'lucide-react';
import { Template } from '../../types/crm';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { Dropdown } from '../../components/shared/Dropdown';

interface TemplatesPageProps {
  templates: Template[];
  setTemplates: React.Dispatch<React.SetStateAction<Template[]>>;
}

export function TemplatesPage({ templates, setTemplates }: TemplatesPageProps) {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Template | null>(null);
  const [draft, setDraft] = useState({
    name: '',
    category: 'Sales',
    subject: '',
    body: '',
  });
  const [errors, setErrors] = useState<{ name?: string; subject?: string }>({});

  const filtered = useMemo(
    () =>
      templates.filter((t: Template) => {
        if (
          search &&
          !`${t.name} ${t.subject}`.toLowerCase().includes(search.toLowerCase())
        )
          return false;
        if (cat !== 'All' && t.category !== cat) return false;
        return true;
      }),
    [templates, search, cat]
  );

  const handleSave = () => {
    const err: { name?: string; subject?: string } = {};
    if (!draft.name.trim()) err.name = 'Template name is required';
    if (!draft.subject.trim()) err.subject = 'Subject line is required';
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    if (editing) {
      setTemplates(
        templates.map((t: Template) =>
          t.id === editing.id
            ? {
                ...t,
                name: draft.name.trim(),
                category: draft.category,
                subject: draft.subject.trim(),
                body: draft.body,
                updated: 'Just now',
              }
            : t
        )
      );
      setEditing(null);
    } else {
      const nt: Template = {
        id: `t${Date.now()}`,
        name: draft.name.trim(),
        category: draft.category,
        subject: draft.subject.trim(),
        body: draft.body,
        updated: 'Just now',
        usage: 0,
      };
      setTemplates([nt, ...templates]);
    }
    setDraft({ name: '', category: 'Sales', subject: '', body: '' });
    setErrors({});
    setShowAdd(false);
  };

  const handleOpenAdd = () => {
    setEditing(null);
    setDraft({ name: '', category: 'Sales', subject: '', body: '' });
    setErrors({});
    setShowAdd(true);
  };

  const handleOpenEdit = (t: Template) => {
    setEditing(t);
    setDraft({
      name: t.name,
      category: t.category,
      subject: t.subject,
      body: t.body,
    });
    setErrors({});
    setShowAdd(true);
  };

  const handleClose = () => {
    setShowAdd(false);
    setEditing(null);
    setDraft({ name: '', category: 'Sales', subject: '', body: '' });
    setErrors({});
  };

  return (
    <div className="flex flex-col gap-[20px] max-w-[1440px]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-[12px]">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight">Templates</h1>
          <p className="text-[14px] text-[var(--text-secondary)] mt-[2px]">
            Browse and manage reusable email templates with personalization tokens.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="h-[40px] px-[18px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold flex items-center gap-[8px] text-[#1B4D0F] cursor-pointer hover:bg-[var(--primary-hover)] transition-colors"
        >
          <Plus size={16} />
          New Template
        </button>
      </div>

      <div className="bg-white rounded-[14px] p-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col lg:flex-row gap-[12px] justify-between mb-[16px]">
          <div className="relative w-full lg:max-w-[320px]">
            <Search size={16} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="w-full h-[38px] pl-[36px] pr-[12px] rounded-[10px] bg-[var(--input-bg)] border border-transparent text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:bg-white focus:ring-[2px] focus:ring-[var(--primary-soft)] transition-all"
            />
          </div>
          <div className="flex items-center gap-[8px]">
            <Dropdown
              value={cat}
              onChange={setCat}
              options={['All', 'Sales', 'Follow-up', 'Marketing']}
            />
            {cat !== 'All' && (
              <button
                onClick={() => setCat('All')}
                className="h-[36px] px-[12px] rounded-[10px] bg-[var(--input-bg)] text-[13px] hover:bg-[#EAECE8] cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
          {filtered.map((t: Template) => (
            <div
              key={t.id}
              className="rounded-[12px] p-[16px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.05)] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-[8px] mb-[6px]">
                  <div className="font-medium text-[14px] leading-tight text-[var(--text-primary)]">{t.name}</div>
                  <StatusBadge label={t.category} />
                </div>
                <div className="text-[12.5px] font-medium text-[var(--text-secondary)] truncate mb-[6px]">
                  {t.subject}
                </div>
                <div className="text-[12px] text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                  {t.body}
                </div>
              </div>
              <div className="mt-[14px] pt-[10px] border-t border-[#F3F5F2] flex justify-between items-center">
                <span className="text-[11px] text-[var(--text-muted)]">
                  {t.updated} • Used {t.usage}x
                </span>
                <div className="flex gap-[6px]">
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="h-[28px] px-[12px] rounded-[8px] bg-[var(--input-bg)] text-[12px] font-medium text-[var(--text-primary)] cursor-pointer hover:bg-[#EAECE8] transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setTemplates(templates.filter((x: Template) => x.id !== t.id))}
                    className="h-[28px] px-[10px] rounded-[8px] bg-[var(--input-bg)] text-[12px] text-[var(--text-muted)] cursor-pointer hover:bg-[#FEECEC] hover:text-[#B91C1C] transition-colors"
                    aria-label={`Delete ${t.name}`}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-[40px] flex flex-col items-center text-center">
            <SearchX size={20} className="text-[var(--text-muted)] mb-[8px]" />
            <div className="text-[13px] text-[var(--text-muted)]">No matching templates found.</div>
          </div>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 p-[16px]">
          <div className="w-full max-w-[560px] bg-white rounded-[16px] p-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between mb-[16px]">
              <div className="text-[16px] font-semibold text-[var(--text-primary)]">
                {editing ? 'Edit Template' : 'New Template'}
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="w-[32px] h-[32px] rounded-[8px] bg-[var(--input-bg)] flex items-center justify-center cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                aria-label="Close dialog"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-[14px]">
              <div>
                <label
                  htmlFor="template-name"
                  className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]"
                >
                  Template Name *
                </label>
                <input
                  id="template-name"
                  value={draft.name}
                  onChange={(e) => {
                    setDraft({ ...draft, name: e.target.value });
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  placeholder="e.g. Initial Outreach - Enterprise"
                  className={`w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] border text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#76E05B] focus:ring-[2px] focus:ring-[#EFFBEA] ${
                    errors.name ? 'border-red-400' : 'border-[var(--border)]'
                  }`}
                />
                {errors.name && (
                  <div className="text-[11px] text-red-500 mt-[4px]">{errors.name}</div>
                )}
              </div>

              <div>
                <label
                  htmlFor="template-stage"
                  className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]"
                >
                  Sales Stage
                </label>
                <Dropdown
                  id="template-stage"
                  value={draft.category}
                  onChange={(v: string) => setDraft({ ...draft, category: v })}
                  options={['Sales', 'Follow-up', 'Marketing']}
                />
              </div>

              <div>
                <label
                  htmlFor="template-subject"
                  className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]"
                >
                  Subject *
                </label>
                <input
                  id="template-subject"
                  value={draft.subject}
                  onChange={(e) => {
                    setDraft({ ...draft, subject: e.target.value });
                    if (errors.subject) setErrors((prev) => ({ ...prev, subject: undefined }));
                  }}
                  placeholder="Subject with tokens e.g. Scaling revenue for {{company}}"
                  className={`w-full h-[40px] px-[12px] rounded-[10px] bg-[var(--input-bg)] border text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#76E05B] focus:ring-[2px] focus:ring-[#EFFBEA] ${
                    errors.subject ? 'border-red-400' : 'border-[var(--border)]'
                  }`}
                />
                {errors.subject && (
                  <div className="text-[11px] text-red-500 mt-[4px]">{errors.subject}</div>
                )}
              </div>

              <div>
                <label
                  htmlFor="template-body"
                  className="text-[12px] font-medium text-[var(--text-primary)] block mb-[4px]"
                >
                  Body
                </label>
                <textarea
                  id="template-body"
                  value={draft.body}
                  onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                  placeholder="Body with tokens {{firstName}} {{company}} {{location}}"
                  rows={5}
                  className="w-full min-h-[120px] p-[12px] rounded-[10px] bg-[var(--input-bg)] border border-[var(--border)] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#76E05B] focus:ring-[2px] focus:ring-[#EFFBEA] resize-y"
                />
                <div className="text-[11px] text-[var(--text-muted)] mt-[4px]">
                  Available tokens: {'{{firstName}}'}, {'{{lastName}}'}, {'{{company}}'}, {'{{location}}'}
                </div>
              </div>
            </div>

            <div className="mt-[20px] flex justify-end gap-[8px]">
              <button
                type="button"
                onClick={handleClose}
                className="h-[38px] px-[16px] rounded-[10px] bg-white border border-[var(--border)] text-[13px] font-medium cursor-pointer hover:bg-[var(--input-bg)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="h-[38px] px-[18px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold text-[#1B4D0F] hover:bg-[var(--primary-hover)] cursor-pointer transition-colors"
              >
                {editing ? 'Update Template' : 'Save Template'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
