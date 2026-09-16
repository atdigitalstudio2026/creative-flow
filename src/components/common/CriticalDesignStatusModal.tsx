import React, { useState } from 'react';
import { Task, TaskStatus, TaskPriority } from '../../types';
import { PriorityBadge } from './PriorityBadge';
import { DeadlineBadge } from './DeadlineBadge';
import { DesignTypeBadge } from './DesignTypeBadge';
import { StatusBadge } from './StatusBadge';
import { formatDateIndo } from '../../utils/dateUtils';
import {
  X,
  AlertTriangle,
  Flame,
  Clock,
  ExternalLink,
  Search,
  CheckCircle2,
  Filter,
  ArrowRight,
  ShieldAlert,
  User,
  Sparkles,
  Layers
} from 'lucide-react';

export type CriticalTab = 'ALL' | 'REVISION' | 'OVERDUE' | 'URGENT';

interface CriticalDesignStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onUpdateStatus?: (taskId: string, newStatus: TaskStatus) => void;
  onOpenStageDirectly?: (stageId: string) => void;
  initialTab?: CriticalTab;
}

export const CriticalDesignStatusModal: React.FC<CriticalDesignStatusModalProps> = ({
  isOpen,
  onClose,
  tasks,
  onSelectTask,
  onUpdateStatus,
  onOpenStageDirectly,
  initialTab = 'ALL'
}) => {
  const [activeTab, setActiveTab] = useState<CriticalTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const now = new Date();

  // Categorize critical design tasks
  const revisionTasks = tasks.filter((t) => t.status === 'REVISION_REQUIRED');

  const overdueTasks = tasks.filter((t) => {
    if (['APPROVED', 'COMPLETED', 'ARCHIVED', 'CANCELLED'].includes(t.status)) return false;
    return new Date(t.deadline).getTime() < now.getTime();
  });

  const highUrgentTasks = tasks.filter((t) => {
    if (['APPROVED', 'COMPLETED', 'ARCHIVED', 'CANCELLED'].includes(t.status)) return false;
    return t.priority === 'URGENT' || t.priority === 'HIGH';
  });

  // Master unique list of critical tasks
  const allCriticalMap = new Map<string, Task>();
  [...revisionTasks, ...overdueTasks, ...highUrgentTasks].forEach((t) => {
    allCriticalMap.set(t.id, t);
  });
  const allCriticalTasks = Array.from(allCriticalMap.values());

  // Determine current filtered list based on tab
  let currentList: Task[] = [];
  if (activeTab === 'REVISION') {
    currentList = revisionTasks;
  } else if (activeTab === 'OVERDUE') {
    currentList = overdueTasks;
  } else if (activeTab === 'URGENT') {
    currentList = highUrgentTasks;
  } else {
    currentList = allCriticalTasks;
  }

  // Search filter
  const filteredList = currentList.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.task_id.toLowerCase().includes(q) ||
      (t.current_assignee_name || '').toLowerCase().includes(q) ||
      (t.project_name || '').toLowerCase().includes(q) ||
      (t.campaign_name || '').toLowerCase().includes(q) ||
      (t.task_type || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-5 overflow-y-auto animate-page-enter">
      <div className="modal-3d bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl w-full max-w-5xl rounded-3xl shadow-2xl border border-rose-200/80 dark:border-rose-900/60 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with High-Contrast Alert Aesthetic */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-rose-900 via-rose-800 to-amber-900 text-white flex items-start justify-between relative overflow-hidden shrink-0">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full bg-rose-500/30 text-rose-200 border border-rose-400/40 backdrop-blur-md flex items-center gap-1.5 font-display">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-300 animate-pulse" />
                JENDELA MONITOR STATUS KRITIS DESAIN
              </span>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/20">
                {allCriticalTasks.length} Pekerjaan Perlu Tindakan Segera
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white font-display">
              Pusat Tindakan & Resolusi Desain Kritis
            </h3>

            <p className="text-xs sm:text-sm text-rose-100/90 font-medium leading-relaxed">
              Jendela terpusat untuk meninjau pekerjaan grafis yang butuh revisi klien, melewati batas waktu (overdue), atau bertiket prioritas mendesak untuk segera diselesaikan.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 ml-4 active:scale-95"
            title="Tutup Jendela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action & Filter Bar */}
        <div className="p-4 sm:p-5 bg-slate-50/90 dark:bg-slate-850/90 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'ALL'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              Semua Kritis ({allCriticalTasks.length})
            </button>

            <button
              onClick={() => setActiveTab('REVISION')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'REVISION'
                  ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                  : 'bg-white dark:bg-slate-800 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>Butuh Revisi ({revisionTasks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('OVERDUE')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'OVERDUE'
                  ? 'bg-red-600 text-white shadow-sm shadow-red-600/30'
                  : 'bg-white dark:bg-slate-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/50 border border-red-200 dark:border-red-900/60'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
              <span>Overdue / Terlambat ({overdueTasks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('URGENT')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'URGENT'
                  ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                  : 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Prioritas Urgent/High ({highUrgentTasks.length})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari task kritis..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-rose-500/20"
            />
          </div>
        </div>

        {/* Content List Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800 space-y-3">
          {filteredList.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Tidak Ada Pekerjaan Pada Kategori Kritis Ini!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Semua proyek desain dalam kategori ini berjalan lancar tanpa kendala atau telah diselesaikan.
              </p>
            </div>
          ) : (
            filteredList.map((task) => {
              const isOverdue = new Date(task.deadline).getTime() < now.getTime();
              const isRevision = task.status === 'REVISION_REQUIRED';

              return (
                <div
                  key={task.id}
                  className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-850/40 hover:bg-rose-50/40 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-800/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group cursor-pointer"
                  onClick={() => {
                    onClose();
                    onSelectTask(task);
                  }}
                >
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-black text-rose-700 dark:text-rose-400 px-2 py-0.5 rounded-lg bg-rose-100/80 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60">
                        {task.task_id}
                      </span>
                      <StatusBadge status={task.status} size="sm" />
                      <PriorityBadge priority={task.priority} size="sm" />
                      <DeadlineBadge deadline={task.deadline} status={task.status} />
                      <DesignTypeBadge type={task.task_type} />
                      {task.project_name && (
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          {task.project_name}
                        </span>
                      )}
                    </div>

                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors font-display">
                      {task.title}
                    </h4>

                    {task.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    {/* Designer Assignee and Version Info */}
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap pt-1">
                      <div className="flex items-center gap-1.5 font-medium">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Desainer:</span>
                        <strong className="text-slate-800 dark:text-slate-200">
                          {task.current_assignee_name || 'Belum Ditugaskan'}
                        </strong>
                      </div>

                      {task.versions && task.versions.length > 0 && (
                        <div className="flex items-center gap-1 font-mono text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                          <span>{task.versions.length} Draf File Terunggah</span>
                        </div>
                      )}

                      {isRevision && (
                        <span className="text-[11px] font-extrabold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/80 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-900/50 flex items-center gap-1">
                          <Flame className="w-3 h-3 text-rose-500" />
                          Memerlukan revisi perbaikan desain
                        </span>
                      )}

                      {isOverdue && (
                        <span className="text-[11px] font-extrabold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/80 px-2 py-0.5 rounded-md border border-red-200 dark:border-red-900/50 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-red-500" />
                          Melewati tenggat waktu penyerahan
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Direct Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {isRevision && onOpenStageDirectly && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onClose();
                          onOpenStageDirectly('stage-revision');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/80 dark:hover:bg-rose-900 text-rose-800 dark:text-rose-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border border-rose-300 dark:border-rose-800 shadow-2xs active:scale-95"
                        title="Buka Tahap 04 Manajemen Revisi"
                      >
                        <Layers className="w-3.5 h-3.5 text-rose-600" />
                        <span>Tahap Revisi</span>
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                        onSelectTask(task);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <span>Buka Detail Data</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Menampilkan {filteredList.length} dari total {allCriticalTasks.length} status kritis
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200 font-bold cursor-pointer transition-all active:scale-95"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
