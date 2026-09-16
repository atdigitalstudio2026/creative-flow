import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { taskService } from '../../services/taskService';
import {
  Database,
  X,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  ShieldCheck,
  Server
} from 'lucide-react';

interface DatabaseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetData: () => void;
}

export const DatabaseSettingsModal: React.FC<DatabaseSettingsModalProps> = ({
  isOpen,
  onClose,
  onResetData
}) => {
  const { isCloudConnected } = useAuth();
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const handleCopySqlGuide = () => {
    navigator.clipboard.writeText(`-- Eksekusi file supabase_schema.sql di Dashboard Supabase -> SQL Editor
-- File ini telah disiapkan di root proyek: /supabase_schema.sql`);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-neutral-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">Database & Infrastructure Hub</h3>
              <p className="text-[11px] text-neutral-400">
                Supabase PostgreSQL, RLS Policies & Gemini Server Proxy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Status Panel */}
          <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 space-y-3">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
              Status Koneksi Backend
            </span>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-neutral-200">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="font-semibold text-neutral-900 block">Supabase Client</span>
                    <span className="text-[10px] text-neutral-500">
                      {isCloudConnected ? 'Tersambung ke Supabase Live URL' : 'Mode Offline / Local Persistent Cache (Siap Migrasi)'}
                    </span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isCloudConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                }`}>
                  {isCloudConnected ? 'Connected' : 'Local Persistence'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-neutral-200">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="font-semibold text-neutral-900 block">Gemini AI Backend</span>
                    <span className="text-[10px] text-neutral-500">
                      Express Server Proxy (/api/ai/*)
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-neutral-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <div>
                    <span className="font-semibold text-neutral-900 block">Row Level Security (RLS)</span>
                    <span className="text-[10px] text-neutral-500">
                      Enforced by PostgreSQL Schema Policies
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                  Enforced
                </span>
              </div>
            </div>
          </div>

          {/* Migration file info */}
          <div className="p-4 rounded-xl border border-neutral-200 bg-white space-y-2">
            <h4 className="font-bold text-neutral-900 text-xs">
              File Skema Supabase (supabase_schema.sql)
            </h4>
            <p className="text-neutral-600 leading-relaxed text-[11px]">
              Skema DDL lengkap mencakup 10 tabel PostgreSQL (profiles, projects, campaigns, tasks, task_briefs, task_checklists, task_versions, task_revisions, task_handovers, task_comments, audit_logs) dan 20+ policy RLS siap dieksekusi di Supabase Dashboard Anda.
            </p>
            <button
              onClick={handleCopySqlGuide}
              className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-semibold text-xs"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Lokasi Tersalin' : 'Salin Instruksi Migrasi'}</span>
            </button>
          </div>

          {/* Reset Demo Data Action */}
          <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
            <button
              onClick={() => {
                if (confirm('Kembalikan seluruh data ke seed awal? Perubahan lokal akan direset.')) {
                  onResetData();
                  onClose();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 font-semibold text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Data Demo Awal</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs"
            >
              Selesai
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
