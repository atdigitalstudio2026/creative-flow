import React, { useState } from 'react';
import { AuditLog } from '../../types';
import { formatDateIndo } from '../../utils/dateUtils';
import { ShieldCheck, Search, Filter, Download, ArrowRight } from 'lucide-react';

interface AuditTrailViewProps {
  auditLogs: AuditLog[];
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ auditLogs }) => {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchActor = log.actor_name.toLowerCase().includes(q);
      const matchEntity = log.entity_id.toLowerCase().includes(q);
      const matchAction = log.action.toLowerCase().includes(q);
      if (!matchActor && !matchEntity && !matchAction) return false;
    }

    if (actionFilter !== 'ALL' && log.action !== actionFilter) {
      return false;
    }

    return true;
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'ASSIGN':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'HANDOVER':
        return 'bg-purple-100 text-purple-800 border-purple-300 font-bold';
      case 'APPROVAL':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
      case 'FILE_UPLOAD':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'REVISION_REQUEST':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
      case 'STATUS_CHANGE':
        return 'bg-neutral-100 text-neutral-800 border-neutral-300';
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
    }
  };

  const handleExportAudit = () => {
    const headers = ['Audit ID', 'Waktu', 'Aktor', 'Aksi', 'Tipe Entitas', 'ID Entitas', 'Nilai Sebelum', 'Nilai Sesudah'];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.created_at,
      `"${l.actor_name}"`,
      l.action,
      l.entity_type,
      l.entity_id,
      `"${JSON.stringify(l.before_value || '').replace(/"/g, '""')}"`,
      `"${JSON.stringify(l.after_value || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `audit-trail-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
              Audit Trail & Traceability Abadi
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
              Append-Only
            </span>
          </div>
          <p className="text-xs text-neutral-500">
            Seluruh perubahan penugasan, handover, persetujuan, dan unggahan file terekam tanpa kemungkinan dihapus
          </p>
        </div>

        <button
          onClick={handleExportAudit}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-200 shadow-2xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-3 bg-white rounded-xl border border-neutral-200 shadow-2xs flex flex-wrap gap-2.5 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama aktor, action, atau entity ID..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="py-1.5 px-3 text-xs rounded-lg border border-neutral-200 bg-white"
        >
          <option value="ALL">Semua Jenis Aksi</option>
          <option value="CREATE">CREATE</option>
          <option value="ASSIGN">ASSIGN</option>
          <option value="HANDOVER">HANDOVER</option>
          <option value="APPROVAL">APPROVAL</option>
          <option value="FILE_UPLOAD">FILE_UPLOAD</option>
          <option value="REVISION_REQUEST">REVISION_REQUEST</option>
          <option value="RESUBMISSION">RESUBMISSION</option>
          <option value="STATUS_CHANGE">STATUS_CHANGE</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/80 text-neutral-500 uppercase tracking-wider font-semibold border-b border-neutral-200 text-[10px]">
              <tr>
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-3">Aktor</th>
                <th className="py-3 px-3">Aksi</th>
                <th className="py-3 px-3">Entitas</th>
                <th className="py-3 px-4">Rincian Perubahan (Before &bull; After)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-mono text-[11px]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-neutral-400 font-sans text-xs">
                    Tidak ada catatan audit yang cocok.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap text-neutral-500">
                      {formatDateIndo(log.created_at)}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap font-sans font-bold text-neutral-900">
                      {log.actor_name}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded border tracking-tight font-sans font-semibold ${getActionBadge(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-bold text-neutral-800">{log.entity_id}</span>
                      <span className="text-[10px] text-neutral-400 block font-sans">
                        {log.entity_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-sans">
                      <div className="flex items-center gap-2 flex-wrap">
                        {log.before_value && (
                          <div className="p-1.5 rounded bg-neutral-100 text-neutral-700 font-mono text-[10px] max-w-xs truncate">
                            Sebelum: {JSON.stringify(log.before_value)}
                          </div>
                        )}
                        {log.before_value && log.after_value && (
                          <ArrowRight className="w-3 h-3 text-neutral-400 shrink-0" />
                        )}
                        {log.after_value && (
                          <div className="p-1.5 rounded bg-amber-50 text-amber-900 border border-amber-200 font-mono text-[10px] max-w-md truncate">
                            Sesudah: {JSON.stringify(log.after_value)}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
