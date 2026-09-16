import React, { useState } from 'react';
import { Task, TaskStatus, TaskPriority } from '../../types';
import { PriorityBadge } from '../common/PriorityBadge';
import { DeadlineBadge } from '../common/DeadlineBadge';
import { DesignTypeBadge } from '../common/DesignTypeBadge';
import {
  X,
  Search,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  Clock,
  Flame,
  AlertTriangle,
  FolderOpen,
  User,
  Sparkles,
  Plus,
  Layers,
  Send,
  Check,
  FileCheck,
  ChevronDown,
  RotateCcw
} from 'lucide-react';

export interface FunnelStageData {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  tagline: string;
  purposeLabel: string;
  purposeDesc: string;
  contentIdeas: string[];
  goalLabel: string;
  goalDesc: string;
  statuses: TaskStatus[];
  defaultStatus: TaskStatus;
  coneGradient: string;
  coneWidth?: string;
  accentBg: string;
  accentText: string;
  accentBorder: string;
  nextStatus?: TaskStatus;
  nextLabel?: string;
  sopGuidelines: {
    title: string;
    items: string[];
  };
}

interface StageDetailModalProps {
  stage: FunnelStageData | null;
  tasks: Task[];
  isOpen: boolean;
  onClose: () => void;
  onSelectTask: (task: Task) => void;
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
  onOpenCreateTask: () => void;
  onOpenHandover: (task: Task) => void;
}

const ALL_PIPELINE_STAGES = [
  { label: '01 Brief & Permintaan', status: 'REQUESTED' as TaskStatus },
  { label: '02 Produksi Visual', status: 'IN_PROGRESS' as TaskStatus },
  { label: '03 Quality Review', status: 'UNDER_REVIEW' as TaskStatus },
  { label: '04 Revisi & Perbaikan', status: 'REVISION_REQUIRED' as TaskStatus },
  { label: '05 Approval & Handover', status: 'APPROVED' as TaskStatus },
];

export const StageDetailModal: React.FC<StageDetailModalProps> = ({
  stage,
  tasks,
  isOpen,
  onClose,
  onSelectTask,
  onUpdateStatus,
  onOpenCreateTask,
  onOpenHandover
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'tasks' | 'sop'>('tasks');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | TaskPriority>('ALL');
  const [checkedSopItems, setCheckedSopItems] = useState<Record<string, boolean>>({});

  if (!isOpen || !stage) return null;

  // Filter tasks within this stage
  const stageTasks = tasks.filter((t) => stage.statuses.includes(t.status));
  const filteredTasks = stageTasks.filter((t) => {
    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.task_id.toLowerCase().includes(q) ||
      (t.task_type || '').toLowerCase().includes(q) ||
      (t.current_assignee_name || '').toLowerCase().includes(q)
    );
  });

  const urgentCount = stageTasks.filter((t) => t.priority === 'URGENT' || t.priority === 'HIGH').length;
  const revisionCount = stageTasks.filter((t) => t.status === 'REVISION_REQUIRED').length;

  const toggleSopItem = (idx: number) => {
    const key = `${stage.id}-${idx}`;
    setCheckedSopItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalSop = stage.sopGuidelines.items.length;
  const completedSopCount = stage.sopGuidelines.items.filter((_, idx) => checkedSopItems[`${stage.id}-${idx}`]).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-5 overflow-y-auto animate-page-enter">
      <div className="modal-3d bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Dynamic Funnel Stage Header */}
        <div className={`p-5 sm:p-6 bg-gradient-to-r ${stage.coneGradient} text-white flex items-start justify-between relative overflow-hidden shrink-0`}>
          {/* Subtle 3D background watermark */}
          <div className="absolute right-12 -bottom-10 text-9xl font-black text-white/10 select-none pointer-events-none font-display">
            {stage.stepNumber}
          </div>

          <div className="relative z-10 space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-display">
                TAHAP {stage.stepNumber}
              </span>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-white/10 text-white/90">
                {stageTasks.length} Pekerjaan Aktif
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white font-display">
              {stage.title}
            </h3>

            <p className="text-xs sm:text-sm text-white/90 italic font-medium">
              &ldquo;{stage.tagline}&rdquo;
            </p>

            <div className="flex items-center gap-4 pt-1 text-xs text-white/80 flex-wrap">
              <span><strong>Tujuan:</strong> {stage.purposeLabel}</span>
              <span>&bull;</span>
              <span><strong>Target:</strong> {stage.goalLabel}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="relative z-10 w-9 h-9 rounded-2xl bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-all cursor-pointer active:scale-90 shadow-sm"
            title="Tutup Jendela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Navigation Bar & Quick Metrics */}
        <div className="px-5 sm:px-6 py-3 bg-slate-50/90 dark:bg-slate-850/90 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'tasks'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Daftar Desain ({stageTasks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('sop')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'sop'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>SOP & Standar Mutu ({completedSopCount}/{totalSop})</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {urgentCount > 0 && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
                <Flame className="w-3 h-3 text-rose-500" />
                {urgentCount} Prioritas Tinggi
              </span>
            )}

            {revisionCount > 0 && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-500" />
                {revisionCount} Revisi Aktif
              </span>
            )}

            <button
              onClick={() => {
                onClose();
                onOpenCreateTask();
              }}
              className="px-3 py-1.5 rounded-xl btn-3d-primary text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-amber-300" />
              <span>+ Tambah Desain</span>
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'tasks' ? (
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Cari pekerjaan di Tahap ${stage.stepNumber} (${stage.title})...`}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as any)}
                    className="py-2 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200 cursor-pointer shadow-2xs"
                  >
                    <option value="ALL">Semua Prioritas</option>
                    <option value="URGENT">Khusus Urgent</option>
                    <option value="HIGH">Khusus High</option>
                    <option value="NORMAL">Normal</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>

              {/* Tasks List */}
              {filteredTasks.length === 0 ? (
                <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                    <FolderOpen className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Tidak ada pekerjaan pada tahap ini
                  </p>
                  <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                    Buat tugas baru atau pindahkan kartu desain ke tahap ini untuk memprosesnya.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCreateTask();
                    }}
                    className="px-4 py-2 rounded-xl btn-3d-primary text-white text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Buat Desain di Tahap Ini</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredTasks.map((task) => {
                    const isRevision = task.status === 'REVISION_REQUIRED';

                    return (
                      <div
                        key={task.id}
                        className={`card-3d p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3.5 bg-white dark:bg-slate-850 shadow-xs hover:shadow-md ${
                          isRevision
                            ? 'border-rose-300 dark:border-rose-900/80 ring-1 ring-rose-500/20'
                            : 'border-slate-200/80 dark:border-slate-700/80'
                        }`}
                      >
                        {/* Card Top */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                              {task.task_id}
                            </span>
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
                                Rev #{task.revision_count}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Card Middle: Move to Any Stage Dropdown */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium shrink-0">
                            Pindahkan Status:
                          </span>
                          <select
                            value={task.status}
                            onChange={(e) => onUpdateStatus(task.id, e.target.value as TaskStatus)}
                            className="py-1 px-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold cursor-pointer max-w-[200px]"
                          >
                            {ALL_PIPELINE_STAGES.map((s) => (
                              <option key={s.status} value={s.status}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Card Bottom / Assignee & Actions */}
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
                            {/* Next Stage Button */}
                            {stage.nextStatus && (
                              <button
                                onClick={() => onUpdateStatus(task.id, stage.nextStatus!)}
                                className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 cursor-pointer active:scale-95 flex items-center gap-1"
                                title={`Pindahkan ke tahap berikutnya: ${stage.nextLabel}`}
                              >
                                <span>{stage.nextLabel || 'Lanjut'}</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}

                            {/* Handover button if in final approved / completed stage */}
                            {(task.status === 'APPROVED' || task.status === 'COMPLETED') && (
                              <button
                                onClick={() => {
                                  onClose();
                                  onOpenHandover(task);
                                }}
                                className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs cursor-pointer active:scale-95 flex items-center gap-1"
                                title="Serah terima file master ke klien"
                              >
                                <Send className="w-3 h-3" />
                                <span>Handover</span>
                              </button>
                            )}

                            {/* Open Task Detail Button */}
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
          ) : (
            /* SOP & Standards Tab with Interactive Checkboxes */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <h4 className="font-extrabold text-xs text-indigo-950 dark:text-indigo-200 uppercase tracking-wider font-display">
                      {stage.sopGuidelines.title}
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                    Progres: {completedSopCount} dari {totalSop} Terpenuhi
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-indigo-200/60 dark:bg-indigo-900/60 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${(completedSopCount / Math.max(1, totalSop)) * 100}%` }}
                  />
                </div>

                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {stage.sopGuidelines.items.map((item, idx) => {
                    const isChecked = !!checkedSopItems[`${stage.id}-${idx}`];
                    return (
                      <li
                        key={idx}
                        onClick={() => toggleSopItem(idx)}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                            : 'bg-white dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isChecked
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span className={isChecked ? 'line-through text-slate-400 dark:text-slate-500' : ''}>
                          {item}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Deliverables checklist */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  Checklist & Output Wajib Tahap Ini:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                  {stage.contentIdeas.map((idea, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                      <span className="truncate">{idea}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Klik kartu tugas untuk melihat riwayat revisi, pratinjau visual, dan log audit
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
