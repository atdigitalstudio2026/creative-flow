import React, { useState } from 'react';
import { Task, TaskStatus, TaskPriority } from '../../types';
import { PriorityBadge } from '../common/PriorityBadge';
import { DeadlineBadge } from '../common/DeadlineBadge';
import { DesignTypeBadge } from '../common/DesignTypeBadge';
import { FunnelStageData } from './StageDetailModal';
import { FUNNEL_STAGES } from './FunnelPipelineView';
import {
  X,
  Search,
  ExternalLink,
  Layers,
  ArrowRight,
  Flame,
  Clock,
  User,
  Plus,
  Filter,
  CheckCircle2
} from 'lucide-react';

interface ActiveTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onOpenStage: (stage: FunnelStageData) => void;
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
  onOpenCreateTask: () => void;
}

export const ActiveTasksModal: React.FC<ActiveTasksModalProps> = ({
  isOpen,
  onClose,
  tasks,
  onSelectTask,
  onOpenStage,
  onUpdateStatus,
  onOpenCreateTask
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | TaskPriority>('ALL');

  if (!isOpen) return null;

  // Active tasks only (not completed, not cancelled, not archived)
  const activeTasks = tasks.filter(
    (t) => t.status !== 'COMPLETED' && t.status !== 'CANCELLED' && t.status !== 'ARCHIVED'
  );

  const filteredTasks = activeTasks.filter((t) => {
    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;
    if (stageFilter !== 'ALL') {
      const stage = FUNNEL_STAGES.find((s) => s.id === stageFilter);
      if (stage && !stage.statuses.includes(t.status)) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchId = t.task_id.toLowerCase().includes(q);
      const matchAssignee = (t.current_assignee_name || '').toLowerCase().includes(q);
      const matchType = (t.task_type || '').toLowerCase().includes(q);
      if (!matchTitle && !matchId && !matchAssignee && !matchType) return false;
    }
    return true;
  });

  const getTaskStage = (status: TaskStatus) => {
    return FUNNEL_STAGES.find((s) => s.statuses.includes(status)) || FUNNEL_STAGES[0];
  };

  const reviewCount = activeTasks.filter(
    (t) => t.status === 'UNDER_REVIEW' || t.status === 'SUBMITTED' || t.status === 'RESUBMITTED'
  ).length;
  const revisionCount = activeTasks.filter((t) => t.status === 'REVISION_REQUIRED').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-5 overflow-y-auto animate-page-enter">
      <div className="modal-3d bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white flex items-start justify-between relative overflow-hidden shrink-0">
          <div className="relative z-10 space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-display">
                RINGKASAN PIPELINE STUDIO
              </span>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                {activeTasks.length} Desain Sedang Berjalan
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white font-display">
              Seluruh Pekerjaan Desain Aktif
            </h3>

            <p className="text-xs sm:text-sm text-indigo-100/90 font-medium">
              Daftar terpadu seluruh order desain yang sedang diproses oleh tim di 5 tahapan alur kerja.
            </p>
          </div>

          <button
            onClick={onClose}
            className="relative z-10 w-9 h-9 rounded-2xl bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-all cursor-pointer active:scale-90 shadow-sm"
            title="Tutup Jendela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Filter & Search Strip */}
        <div className="px-5 sm:px-6 py-3 bg-slate-50/90 dark:bg-slate-850/90 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul, ID, nama desainer..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="py-1.5 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200 cursor-pointer shadow-2xs"
            >
              <option value="ALL">Semua Tahapan</option>
              {FUNNEL_STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  Tahap {s.stepNumber}: {s.title}
                </option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="py-1.5 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200 cursor-pointer shadow-2xs"
            >
              <option value="ALL">Semua Prioritas</option>
              <option value="URGENT">Khusus Urgent</option>
              <option value="HIGH">High</option>
              <option value="NORMAL">Normal</option>
              <option value="LOW">Low</option>
            </select>

            <button
              onClick={() => {
                onClose();
                onOpenCreateTask();
              }}
              className="py-1.5 px-3 rounded-xl btn-3d-primary text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-amber-300" />
              <span>+ Order Baru</span>
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 space-y-2">
              <Layers className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Tidak ada pekerjaan aktif yang cocok dengan pencarian
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredTasks.map((task) => {
                const stage = getTaskStage(task.status);
                const isRevision = task.status === 'REVISION_REQUIRED';

                return (
                  <div
                    key={task.id}
                    className={`card-3d p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 bg-white dark:bg-slate-850 shadow-xs hover:shadow-md ${
                      isRevision
                        ? 'border-rose-300 dark:border-rose-900/80 ring-1 ring-rose-500/20'
                        : 'border-slate-200/80 dark:border-slate-700/80'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                            {task.task_id}
                          </span>
                          <button
                            onClick={() => {
                              onClose();
                              onOpenStage(stage);
                            }}
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border cursor-pointer hover:underline ${stage.accentBg} ${stage.accentText} ${stage.accentBorder}`}
                            title="Klik untuk membuka jendela tahap ini"
                          >
                            Tahap {stage.stepNumber}: {stage.title}
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <PriorityBadge priority={task.priority} />
                          <DeadlineBadge deadline={task.deadline} />
                        </div>
                      </div>

                      <h4
                        onClick={() => {
                          onClose();
                          onSelectTask(task);
                        }}
                        className="font-extrabold text-sm text-slate-900 dark:text-white font-display cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2"
                      >
                        {task.title}
                      </h4>

                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <DesignTypeBadge type={task.task_type} />
                        {task.latest_version && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                            {task.latest_version}
                          </span>
                        )}
                        {task.revision_count > 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                            Revisi #{task.revision_count}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {task.current_assignee_avatar ? (
                          <img
                            src={task.current_assignee_avatar}
                            alt={task.current_assignee_name || 'Desainer'}
                            className="w-6 h-6 rounded-full object-cover ring-1 ring-indigo-500/30 shrink-0"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 shrink-0">
                            <User className="w-3 h-3" />
                          </div>
                        )}
                        <span className="text-xs text-slate-600 dark:text-slate-300 font-medium truncate">
                          {task.current_assignee_name || 'Belum ditugaskan'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            onClose();
                            onOpenStage(stage);
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer active:scale-95 flex items-center gap-1"
                          title="Lihat di Jendela Tahap"
                        >
                          <span>Tahap {stage.stepNumber}</span>
                          <ArrowRight className="w-3 h-3 text-indigo-500" />
                        </button>

                        <button
                          onClick={() => {
                            onClose();
                            onSelectTask(task);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Buka Data Detail Pekerjaan"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Menampilkan {filteredTasks.length} dari {activeTasks.length} pekerjaan aktif di pipeline
          </span>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            Tutup Jendela
          </button>
        </div>
      </div>
    </div>
  );
};
