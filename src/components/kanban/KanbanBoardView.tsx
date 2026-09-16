import React, { useState } from 'react';
import { Task, TaskStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { FunnelPipelineView, FUNNEL_STAGES } from './FunnelPipelineView';
import { FunnelStageData } from './StageDetailModal';
import { ActiveTasksModal } from './ActiveTasksModal';
import { CriticalDesignStatusModal, CriticalTab } from '../common/CriticalDesignStatusModal';
import {
  Layers,
  Plus,
  Flame,
  Clock,
  Sparkles,
  ChevronRight,
  ArrowRight,
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';

interface KanbanBoardViewProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
  onOpenCreateTask: () => void;
  onOpenHandover: (task: Task) => void;
}

export const KanbanBoardView: React.FC<KanbanBoardViewProps> = ({
  tasks,
  onSelectTask,
  onUpdateStatus,
  onOpenCreateTask,
  onOpenHandover
}) => {
  const { canCreateTask } = useAuth();
  const [selectedStage, setSelectedStage] = useState<FunnelStageData | null>(null);
  const [showActiveTasksModal, setShowActiveTasksModal] = useState(false);
  const [showCriticalModal, setShowCriticalModal] = useState(false);
  const [criticalModalTab, setCriticalModalTab] = useState<CriticalTab>('ALL');

  const totalActiveTasks = tasks.filter(
    (t) => t.status !== 'COMPLETED' && t.status !== 'CANCELLED' && t.status !== 'ARCHIVED'
  ).length;
  const inRevisionCount = tasks.filter((t) => t.status === 'REVISION_REQUIRED').length;
  const underReviewCount = tasks.filter(
    (t) => t.status === 'UNDER_REVIEW' || t.status === 'SUBMITTED' || t.status === 'RESUBMITTED'
  ).length;

  const now = new Date();
  const overdueCount = tasks.filter((t) => {
    if (['APPROVED', 'COMPLETED', 'ARCHIVED', 'CANCELLED'].includes(t.status)) return false;
    return new Date(t.deadline).getTime() < now.getTime();
  }).length;
  const totalCriticalCount = inRevisionCount + overdueCount;

  const handleOpenStageDirectly = (stageId: string) => {
    const stage = FUNNEL_STAGES.find((s) => s.id === stageId);
    if (stage) {
      setSelectedStage(stage);
      // Smooth scroll to the stage element in the page
      setTimeout(() => {
        const el = document.getElementById(stageId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  const handleOpenCriticalModal = (tab: CriticalTab = 'ALL') => {
    setCriticalModalTab(tab);
    setShowCriticalModal(true);
  };

  return (
    <div className="space-y-5 animate-page-enter">
      {/* Top Header Card - Proportional & Harmonious 2-Tier Layout */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md space-y-4">
        {/* Tier 1: Title, Subtitle, & Primary CTA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25 shrink-0 mt-0.5">
              <Layers className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">
                  Pipeline Alur Desain Grafis
                </h2>
                <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-teal-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 font-display">
                  5 TAHAP PRODUKSI KREATIF
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-3xl leading-relaxed">
                Manajemen alur kerja terstruktur studio desain: mulai dari validasi brief, eksekusi visual, quality control (QC), penyempurnaan revisi, hingga persetujuan & serah terima file final.
              </p>
            </div>
          </div>

          {canCreateTask && (
            <button
              onClick={onOpenCreateTask}
              className="py-2.5 px-4 rounded-2xl btn-3d-primary text-white font-extrabold text-xs flex items-center gap-2 shadow-md cursor-pointer active:scale-95 shrink-0 self-start md:self-center"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Order Desain Baru</span>
            </button>
          )}
        </div>

        {/* Tier 2: Interactive Signal Status Bar (Direct Clickable Access) */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>Indikator Status & Akses Cepat:</span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Signal 1: Pekerjaan Aktif (Clickable -> Opens ActiveTasksModal) */}
            <button
              onClick={() => setShowActiveTasksModal(true)}
              className="group px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 border border-slate-200/80 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-800 flex items-center gap-2 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 text-xs"
              title="Klik untuk membuka daftar seluruh pekerjaan desain aktif"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-500 group-hover:scale-125 transition-transform shrink-0" />
              <span>
                <strong className="font-extrabold">{totalActiveTasks}</strong> Pekerjaan Aktif
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>

            {/* Signal 2: Menunggu Review (Clickable -> Opens Tahap 03 Quality Review) */}
            <button
              onClick={() => handleOpenStageDirectly('stage-review')}
              className={`group px-3 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 text-xs ${
                underReviewCount > 0
                  ? 'bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800 hover:border-teal-300'
                  : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700'
              }`}
              title="Klik untuk langsung menuju data Quality Review (Tahap 03)"
            >
              <Clock
                className={`w-3.5 h-3.5 shrink-0 ${
                  underReviewCount > 0 ? 'text-teal-600 dark:text-teal-400 animate-pulse' : 'text-slate-400'
                }`}
              />
              <span>
                <strong className="font-extrabold">{underReviewCount}</strong> Menunggu Review
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-teal-500 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>

            {/* Signal 3: Butuh Revisi (Clickable -> Opens Tahap 04 Revisi & Perbaikan) */}
            <button
              onClick={() => handleOpenStageDirectly('stage-revision')}
              className={`group px-3 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 text-xs ${
                inRevisionCount > 0
                  ? 'bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800 hover:border-rose-300'
                  : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700'
              }`}
              title="Klik untuk langsung menuju data Revisi & Perbaikan (Tahap 04)"
            >
              <Flame
                className={`w-3.5 h-3.5 shrink-0 ${
                  inRevisionCount > 0 ? 'text-rose-500 animate-bounce' : 'text-slate-400'
                }`}
              />
              <span>
                <strong className="font-extrabold">{inRevisionCount}</strong> Butuh Revisi
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-rose-500 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>

            {/* Signal 4: Status Kritis Desain (Clickable -> Langsung menuju Jendela Data Kritis) */}
            <button
              onClick={() => handleOpenCriticalModal('ALL')}
              className={`group px-3 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 text-xs ${
                totalCriticalCount > 0
                  ? 'bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 hover:border-amber-400 ring-1 ring-amber-500/20'
                  : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700'
              }`}
              title="Klik untuk langsung membuka jendela data Status Kritis Desain (Revisi, Overdue & Urgent)"
            >
              <ShieldAlert
                className={`w-3.5 h-3.5 shrink-0 ${
                  totalCriticalCount > 0 ? 'text-amber-600 dark:text-amber-400 animate-pulse' : 'text-slate-400'
                }`}
              />
              <span>
                <strong className="font-extrabold">{totalCriticalCount}</strong> Status Kritis Desain
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          </div>
        </div>
      </div>

      {/* Render the 3D Funnel Pipeline Workflow with coordinated stage selection */}
      <FunnelPipelineView
        tasks={tasks}
        onSelectTask={onSelectTask}
        onUpdateStatus={onUpdateStatus}
        onOpenCreateTask={onOpenCreateTask}
        onOpenHandover={onOpenHandover}
        selectedStage={selectedStage}
        onSelectStage={setSelectedStage}
      />

      {/* Modal: Daftar Seluruh Pekerjaan Aktif */}
      <ActiveTasksModal
        isOpen={showActiveTasksModal}
        onClose={() => setShowActiveTasksModal(false)}
        tasks={tasks}
        onSelectTask={onSelectTask}
        onOpenStage={(stage) => {
          setShowActiveTasksModal(false);
          setSelectedStage(stage);
          setTimeout(() => {
            document.getElementById(stage.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        }}
        onUpdateStatus={onUpdateStatus}
        onOpenCreateTask={onOpenCreateTask}
      />

      {/* Modal: Jendela Data Status Kritis Desain */}
      <CriticalDesignStatusModal
        isOpen={showCriticalModal}
        onClose={() => setShowCriticalModal(false)}
        tasks={tasks}
        onSelectTask={onSelectTask}
        onUpdateStatus={onUpdateStatus}
        onOpenStageDirectly={handleOpenStageDirectly}
        initialTab={criticalModalTab}
      />
    </div>
  );
};

