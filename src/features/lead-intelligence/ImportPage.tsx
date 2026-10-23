import React, { useState } from 'react';
import { Upload, FileSpreadsheet, Download, Check } from 'lucide-react';
import { Lead, LeadSource, Service, Verification, LeadStatus } from '../../types/crm';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { avatarColors, users } from '../../data/mock/leads';

interface ImportPageProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
}

export function ImportPage({ leads, setLeads }: ImportPageProps) {
  const [tab, setTab] = useState<'import' | 'enrichment' | 'history'>('import');
  const [step, setStep] = useState(1);
  const [fileName, setFileName] = useState('');
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [importHistory, setImportHistory] = useState<any[]>([
    {
      id: '1',
      file: 'leads_batch_1.csv',
      date: 'Feb 12',
      by: 'Dominion',
      records: 124,
      status: 'Completed',
      imported: 120,
      errors: 4,
    },
    {
      id: '2',
      file: 'abuja_contacts.xlsx',
      date: 'Feb 10',
      by: 'Sarah',
      records: 87,
      status: 'Completed',
      imported: 85,
      errors: 2,
    },
  ]);

  const handleFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const lines = text.split('\n').filter((l) => l.trim());
      if (lines.length < 2) {
        setParsedRows([]);
        return;
      }
      const headers = lines[0].split(',').map((h) => h.trim());
      const rows = lines.slice(1, 6).map((line) => {
        const vals = line.split(',');
        const obj: any = {};
        headers.forEach((h, i) => (obj[h] = vals[i]?.trim() || ''));
        return obj;
      });
      setParsedRows(rows);
      const initMap: Record<string, string> = {};
      headers.forEach((h) => {
        const low = h.toLowerCase();
        if (low.includes('first')) initMap[h] = 'First Name';
        else if (low.includes('last')) initMap[h] = 'Last Name';
        else if (low.includes('email')) initMap[h] = 'Email';
        else if (low.includes('company')) initMap[h] = 'Company';
        else if (low.includes('phone')) initMap[h] = 'Phone';
        else initMap[h] = 'Skip';
      });
      setMapping(initMap);
      setStep(2);
    };
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const csv =
      'First Name,Last Name,Email,Phone,Company,Source,Location\nJohn,Doe,john@company.co,+2348012345678,TechCorp,Website,Lagos';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lead_import_template.csv';
    a.click();
  };

  const handleImportConfirm = () => {
    const newLeads: Lead[] = parsedRows.map((r, i) => {
      const firstEntry = Object.entries(mapping).find(([, v]) => v === 'First Name');
      const first = firstEntry ? r[firstEntry[0]] : `Imported${i}`;
      const emailEntry = Object.entries(mapping).find(([, v]) => v === 'Email');
      const email = emailEntry ? r[emailEntry[0]] : `imported${i}@test.co`;
      return {
        id: `import-${Date.now()}-${i}`,
        firstName: first || 'Imported',
        lastName: 'Lead',
        email: email,
        phone: '+234 8000000000',
        company: 'Imported',
        source: 'Other' as LeadSource,
        location: 'Lagos',
        service: 'Web Development' as Service,
        verification: 'Unknown' as Verification,
        status: 'New' as LeadStatus,
        assignee: users[0],
        branch: 'Lagos Branch',
        createdAt: 'Now',
        lastActivity: 'Just now',
        avatarColor: avatarColors[i % avatarColors.length],
      };
    });
    setLeads([...newLeads, ...leads]);
    setImportHistory([
      {
        id: Date.now().toString(),
        file: fileName,
        date: 'Now',
        by: 'Dominion',
        records: newLeads.length,
        status: 'Completed',
        imported: newLeads.length,
        errors: 0,
      },
      ...importHistory,
    ]);
    setStep(5);
  };

  return (
    <div className="max-w-[1440px] flex flex-col gap-[20px]">
      <div>
        <h1 className="text-[24px] font-semibold tracking-tight">Import & Enrichment</h1>
        <p className="text-[14px] text-[var(--text-secondary)] mt-[2px]">
          Bring existing lead data into your workspace and improve its quality.
        </p>
      </div>

      <div className="flex p-[4px] bg-white rounded-[12px] w-fit shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        {[
          { id: 'import', label: 'Import' },
          { id: 'enrichment', label: 'Enrichment' },
          { id: 'history', label: 'History' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`px-[18px] h-[36px] rounded-[10px] text-[13px] font-medium transition-all cursor-pointer ${
              tab === t.id
                ? 'bg-[var(--text-primary)] text-white'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'import' && (
        <div className="bg-white rounded-[14px] p-[20px] flex flex-col gap-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-[8px]">
            {[
              { n: 1, label: 'Upload' },
              { n: 2, label: 'Map fields' },
              { n: 3, label: 'Preview' },
              { n: 4, label: 'Review' },
              { n: 5, label: 'Results' },
            ].map((s, idx) => (
              <React.Fragment key={s.n}>
                <div
                  className={`flex items-center gap-[8px] ${
                    step >= s.n ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'
                  }`}
                >
                  <div
                    className={`w-[28px] h-[28px] rounded-full flex items-center justify-center text-[12px] font-semibold border ${
                      step >= s.n
                        ? 'bg-[var(--primary)] border-[var(--primary)] text-[#1B2D15]'
                        : 'bg-white border-[var(--border)]'
                    }`}
                  >
                    {step > s.n ? <Check size={14} /> : s.n}
                  </div>
                  <span className="text-[13px] font-medium hidden md:block">{s.label}</span>
                </div>
                {idx < 4 && (
                  <div
                    className={`flex-1 h-[1px] ${step > s.n ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {step === 1 && (
            <div className="flex flex-col gap-[16px]">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const f = e.dataTransfer.files[0];
                  if (f) handleFile(f);
                }}
                className="border-[1.5px] border-dashed border-[var(--border)] hover:border-[var(--primary)] rounded-[14px] p-[32px] flex flex-col items-center justify-center gap-[12px] bg-[var(--bg)] transition-colors"
              >
                <div className="w-[48px] h-[48px] rounded-[12px] bg-white border border-[var(--border)] flex items-center justify-center">
                  <Upload size={20} className="text-[var(--text-muted)]" />
                </div>
                <div className="text-center">
                  <div className="text-[14px] font-medium">Drop CSV or XLSX here or click to browse</div>
                  <div className="text-[12px] text-[var(--text-muted)] mt-[4px]">
                    Supports .csv, .xlsx up to 10MB • Parsed locally in browser
                  </div>
                </div>
                <label className="h-[36px] px-[16px] rounded-[10px] bg-white border border-[var(--border)] text-[13px] font-medium flex items-center gap-[8px] cursor-pointer hover:bg-[var(--input-bg)]">
                  <FileSpreadsheet size={16} />
                  Browse files
                  <input
                    type="file"
                    accept=".csv,.xlsx"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFile(f);
                    }}
                  />
                </label>
              </div>
              <button
                onClick={downloadTemplate}
                className="h-[36px] px-[14px] rounded-[10px] bg-white border border-[var(--border)] text-[13px] font-medium w-fit flex items-center gap-[8px] cursor-pointer"
              >
                <Download size={14} />
                Download sample template
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-[14px]">
              <div className="text-[14px] font-semibold">Map file columns to LeadFlow fields</div>
              <div className="border border-[var(--border)] rounded-[12px] overflow-hidden">
                <table className="w-full text-[13px]">
                  <thead className="bg-[var(--bg)] text-[11px] text-[var(--text-muted)]">
                    <tr>
                      <th className="text-left p-[10px]">File Column</th>
                      <th className="text-left p-[10px]">Map To</th>
                      <th className="text-left p-[10px]">Preview</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(mapping).map((col) => (
                      <tr key={col} className="border-t border-[#F3F5F2]">
                        <td className="p-[10px] font-medium">{col}</td>
                        <td className="p-[10px]">
                          <select
                            value={mapping[col]}
                            onChange={(e) => setMapping({ ...mapping, [col]: e.target.value })}
                            className="h-[32px] px-[10px] rounded-[8px] bg-[var(--input-bg)] border border-transparent text-[12px]"
                          >
                            <option>Skip</option>
                            <option>First Name</option>
                            <option>Last Name</option>
                            <option>Email</option>
                            <option>Phone</option>
                            <option>Company</option>
                            <option>Source</option>
                            <option>Location</option>
                            <option>Service</option>
                            <option>Status</option>
                            <option>Branch</option>
                          </select>
                        </td>
                        <td className="p-[10px] text-[var(--text-secondary)]">{parsedRows[0]?.[col]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="h-[36px] px-[14px] rounded-[10px] bg-white border border-[var(--border)] text-[13px] cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="h-[36px] px-[18px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold text-[#1B4D0F] cursor-pointer"
                >
                  Continue to Preview
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-[14px]">
              <div className="text-[14px] font-semibold">
                Preview & Validate • {parsedRows.length} rows (showing first 5)
              </div>
              <div className="overflow-x-auto border border-[var(--border)] rounded-[12px]">
                <table className="w-full text-[12px]">
                  <thead className="bg-[var(--bg)]">
                    <tr>
                      {Object.keys(parsedRows[0] || {}).map((h) => (
                        <th key={h} className="text-left p-[10px] font-medium text-[11px] text-[var(--text-muted)]">
                          {h}
                        </th>
                      ))}
                      <th className="text-left p-[10px]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedRows.map((row, i) => (
                      <tr key={i} className="border-t border-[#F3F5F2]">
                        <td className="p-[10px]">{Object.values(row)[0] as string}</td>
                        <td className="p-[10px]">{Object.values(row)[1] as string}</td>
                        <td className="p-[10px]">{Object.values(row)[2] as string}</td>
                        <td className="p-[10px]">
                          <StatusBadge label={i === 1 ? 'Invalid' : 'Verified'} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="h-[36px] px-[14px] rounded-[10px] bg-white border border-[var(--border)] text-[13px] cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="h-[36px] px-[18px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold text-[#1B4D0F] cursor-pointer"
                >
                  Continue to Review
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-[16px]">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-[12px]">
                {[
                  { label: 'Total rows', value: parsedRows.length },
                  { label: 'Valid rows', value: parsedRows.length - 1 },
                  { label: 'Warnings', value: 1 },
                  { label: 'Errors', value: 1 },
                  { label: 'Duplicates', value: 0 },
                ].map((s) => (
                  <div key={s.label} className="bg-[var(--bg)] border border-[var(--border)] rounded-[10px] p-[12px]">
                    <div className="text-[11px] text-[var(--text-muted)]">{s.label}</div>
                    <div className="text-[18px] font-semibold">{s.value}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-[12px]">
                <label className="text-[13px] font-medium">Duplicate handling:</label>
                <select className="h-[36px] px-[12px] rounded-[10px] bg-[var(--input-bg)] border border-transparent text-[13px]">
                  <option>Skip duplicates</option>
                  <option>Keep all</option>
                  <option>Merge</option>
                </select>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => setStep(3)}
                  className="h-[36px] px-[14px] rounded-[10px] bg-white border border-[var(--border)] text-[13px] cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleImportConfirm}
                  className="h-[40px] px-[20px] rounded-[10px] bg-[var(--primary)] text-[14px] font-semibold text-[#1B4D0F] cursor-pointer"
                >
                  Confirm Import
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="flex flex-col gap-[16px] items-center py-[20px]">
              <div className="w-[56px] h-[56px] rounded-full bg-[var(--primary-soft)] flex items-center justify-center">
                <Check size={28} className="text-[#2E7D32]" />
              </div>
              <div className="text-center">
                <div className="text-[18px] font-semibold">Import Completed</div>
                <div className="text-[13px] text-[var(--text-muted)] mt-[4px]">
                  {parsedRows.length} rows processed • {parsedRows.length} imported • 0 failed
                </div>
              </div>
              <div className="flex gap-[8px]">
                <button
                  onClick={() => {
                    setStep(1);
                    setFileName('');
                    setParsedRows([]);
                  }}
                  className="h-[36px] px-[16px] rounded-[10px] bg-white border border-[var(--border)] text-[13px] cursor-pointer"
                >
                  Import Another File
                </button>
                <button
                  onClick={() => setTab('history')}
                  className="h-[36px] px-[16px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold text-[#1B4D0F] cursor-pointer"
                >
                  View History
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'enrichment' && (
        <div className="bg-white rounded-[14px] p-[20px] flex flex-col gap-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="flex justify-between items-center">
            <div className="text-[14px] font-semibold">Enrichment Queue • Simulated verification</div>
            <button className="h-[36px] px-[14px] rounded-[10px] bg-[var(--primary)] text-[13px] font-semibold text-[#1B4D0F] cursor-pointer">
              Run Enrichment
            </button>
          </div>
          <div className="overflow-x-auto rounded-[12px] max-w-full">
            <table className="w-full min-w-[700px]">
              <thead className="text-[11px] text-[var(--text-muted)] border-b border-[var(--border)]">
                <tr>
                  <th className="text-left py-[10px]">Lead</th>
                  <th className="text-left py-[10px]">Email</th>
                  <th className="text-left py-[10px]">Status</th>
                  <th className="text-left py-[10px]">Source</th>
                  <th className="text-left py-[10px]">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 12).map((l: Lead) => (
                  <tr key={l.id} className="border-b border-[#F3F5F2]">
                    <td className="py-[10px] text-[13px]">
                      {l.firstName} {l.lastName}
                    </td>
                    <td className="py-[10px] text-[12px]">{l.email}</td>
                    <td className="py-[10px]">
                      <StatusBadge label={l.verification} />
                    </td>
                    <td className="py-[10px] text-[11px] text-[var(--text-muted)]">{l.source} checker</td>
                    <td className="py-[10px] text-[11px] text-[var(--text-muted)]">{l.lastActivity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div className="bg-white rounded-[14px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="text-[14px] font-semibold mb-[14px]">Import History</div>
          <div className="overflow-x-auto rounded-[12px] max-w-full">
            <table className="w-full min-w-[700px]">
              <thead className="text-[11px] text-[var(--text-muted)] border-b border-[var(--border)]">
                <tr>
                  <th className="text-left py-[10px]">File name</th>
                  <th className="text-left py-[10px]">Date</th>
                  <th className="text-left py-[10px]">Uploaded by</th>
                  <th className="text-left py-[10px]">Records</th>
                  <th className="text-left py-[10px]">Status</th>
                  <th className="text-left py-[10px]">Imported</th>
                  <th className="text-left py-[10px]">Errors</th>
                  <th className="text-left py-[10px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {importHistory.map((h) => (
                  <tr key={h.id} className="border-b border-[#F3F5F2]">
                    <td className="py-[10px] text-[13px] font-medium">{h.file}</td>
                    <td className="py-[10px] text-[12px]">{h.date}</td>
                    <td className="py-[10px] text-[12px]">{h.by}</td>
                    <td className="py-[10px] text-[12px]">{h.records}</td>
                    <td className="py-[10px]">
                      <StatusBadge label={h.status} />
                    </td>
                    <td className="py-[10px] text-[12px]">{h.imported}</td>
                    <td className="py-[10px] text-[12px]">{h.errors}</td>
                    <td className="py-[10px]">
                      <button className="text-[12px] font-medium cursor-pointer">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
