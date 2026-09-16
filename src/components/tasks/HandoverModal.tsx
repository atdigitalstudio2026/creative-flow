import React, { useState } from 'react';
import { Task, UserProfile } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  Repeat,
  AlertTriangle,
  X,
  FileCheck2,
  Users
} from 'lucide-react';

interface HandoverModalProps {
  task: Task;
  onClose: () => void;
  onSubmitHandover: (
    taskId: string,
    newAssigneeId: string,
    reason: string,
    progressSummary: string,
    handoverNotes: string
  ) => void;
}

export const HandoverModal: React.FC<HandoverModalProps> = ({
  task,
  onClose,
  onSubmitHandover,
}) => {
  const { allUsers } = useAuth();

  const currentAssigneeId = task.current_assignee_id;
  const currentAssigneeName = task.current_assignee_name || 'Belum ditugaskan';

  const candidateUsers = allUsers.filter(
    (u) =>
      u.id !== currentAssigneeId &&
      ['DESIGNER', 'CONTENT_CREATOR', 'MANAGER'].includes(u.role)
  );

  const [newAssigneeId, setNewAssigneeId] = useState(candidateUsers[0]?.id || '');
  const [reason, setReason] = useState('Desainer cuti / sakit');
  const [customReason, setCustomReason] = useState('');
  const [progressSummary, setProgressSummary] = useState(
    `Pekerjaan sudah mencapai progress ${task.progress_percentage}%. Versi file terakhir ${
      task.versions.length > 0 ? task.versions[task.versions.length - 1].version_number : 'V0'
    }.`
  );
  const [handoverNotes, setHandoverNotes] = useState(
    'Harap lanjutkan sesuai creative brief dan pastikan palet warna konsisten.'
  );

  const latestVersion = task.versions.length > 0
    ? task.versions[task.versions.length - 1].version_number
    : 'V0 (Draft)';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = reason === 'Lainnya' ? customReason : reason;
    if (!newAssigneeId || !finalReason.trim() || !handoverNotes.trim()) {
      alert('Harap lengkapi desainer tujuan, alasan pemindahan, dan catatan handover.');
      return;
    }

    onSubmitHandover(task.id, newAssigneeId, finalReason, progressSummary, handoverNotes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-neutral-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-neutral-950 flex items-center justify-center font-bold">
              <Repeat className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">Alihkan Tugas (Handover Task)</h3>
              <p className="text-[11px] text-neutral-300 font-mono">
                {task.task_id} &bull; {task.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit Safety Warning Notice */}
        <div className="p-3.5 bg-amber-50 border-b border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Ketentuan Traceability:</span> Seluruh riwayat kerja
            desainer sebelumnya ({currentAssigneeName}) TIDAK AKAN DIHAPUS. Sistem mencatat
            audit trail resmi tentang perpindahan tanggung jawab ini.
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Previous Assignee Info */}
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
            <div>
              <span className="text-neutral-500 text-[10px] uppercase font-semibold">
                Desainer Saat Ini:
              </span>
              <p className="font-bold text-neutral-900 text-sm">{currentAssigneeName}</p>
            </div>
            <div className="text-right">
              <span className="text-neutral-500 text-[10px] uppercase font-semibold">
                Basis File Terakhir:
              </span>
              <p className="font-mono font-bold text-neutral-900 text-sm">{latestVersion}</p>
            </div>
          </div>

          {/* New Assignee Selection */}
          <div>
            <label className="block font-semibold text-neutral-800 mb-1">
              Desainer / Staff Penerima Handover <span className="text-rose-500">*</span>
            </label>
            <select
              value={newAssigneeId}
              onChange={(e) => setNewAssigneeId(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-neutral-900 text-neutral-900 bg-white"
              required
            >
              {candidateUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name} — {u.position} ({u.role})
                </option>
              ))}
            </select>
          </div>

          {/* Reason Selection */}
          <div>
            <label className="block font-semibold text-neutral-800 mb-1">
              Alasan Pengalihan (Wajib Audit) <span className="text-rose-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-neutral-900 text-neutral-900 bg-white"
            >
              <option value="Desainer cuti / sakit">Desainer cuti / sakit</option>
              <option value="Beban kerja overload (Load Balancing)">Beban kerja overload (Load Balancing)</option>
              <option value="Eskalasi deadline prioritas mendesak">Eskalasi deadline prioritas mendesak</option>
              <option value="Penyesuaian spesialisasi keahlian">Penyesuaian spesialisasi keahlian</option>
              <option value="Lainnya">Lainnya (Tuliskan secara manual)</option>
            </select>
            {reason === 'Lainnya' && (
              <input
                type="text"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Jelaskan alasan detail pengalihan..."
                className="mt-2 w-full p-2 rounded-lg border border-neutral-300 text-xs"
                required
              />
            )}
          </div>

          {/* Progress Summary */}
          <div>
            <label className="block font-semibold text-neutral-800 mb-1">
              Rangkuman Progress Saat Ini <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={progressSummary}
              onChange={(e) => setProgressSummary(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-neutral-300 text-neutral-900"
              required
            />
          </div>

          {/* Handover Notes */}
          <div>
            <label className="block font-semibold text-neutral-800 mb-1">
              Catatan Khusus untuk Desainer Baru <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={handoverNotes}
              onChange={(e) => setHandoverNotes(e.target.value)}
              placeholder="Jelaskan file mana yang dipakai, instruksi revisi yang masih terbuka, atau hal krusial lainnya..."
              className="w-full p-2.5 rounded-lg border border-neutral-300 text-neutral-900"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-neutral-700 hover:bg-neutral-100 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>Konfirmasi Handover Resmi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
