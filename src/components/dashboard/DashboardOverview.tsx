import React, { useState } from 'react';
import { Task } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { DeadlineBadge } from '../common/DeadlineBadge';
import { DesignTypeBadge } from '../common/DesignTypeBadge';
import { AnimatedCounter } from '../common/AnimatedCounter';
import { formatDateIndo } from '../../utils/dateUtils';
import { DesignFlowMonitor } from './DesignFlowMonitor';
import { CriticalDesignStatusModal, CriticalTab } from '../common/CriticalDesignStatusModal';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  Users,
  Flame,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Layers,
  Palette,
  Eye,
  CheckCheck,
  Activity,
  CheckSquare,
  BarChart2
} from 'lucide-react';

interface DashboardOverviewProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onOpenCreateTask: () => void;
  onOpenAi: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  tasks,
  onSelectTask,
  onOpenCreateTask,
  onOpenAi,
}) => {
  const { currentUser, currentRole, allUsers, canCreateTask } = useAuth();
  const [urgentTab, setUrgentTab] = useState<'ALL' | 'REVISION' | 'OVERDUE' | 'TODAY'>('ALL');
  const [showCriticalModal, setShowCriticalModal] = useState(false);
  const [criticalModalTab, setCriticalModalTab] = useState<CriticalTab>('ALL');

  // Metrics computation
  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS');
  const underReviewTasks = tasks.filter((t) => t.status === 'UNDER_REVIEW' || t.status === 'SUBMITTED' || t.status === 'RESUBMITTED');
  const revisionTasks = tasks.filter((t) => t.status === 'REVISION_REQUIRED');
  const approvedTasks = tasks.filter((t) => t.status === 'APPROVED' || t.status === 'COMPLETED');

  const now = new Date();
  const overdueTasks = tasks.filter((t) => {
    if (['APPROVED', 'COMPLETED', 'ARCHIVED', 'CANCELLED'].includes(t.status)) return false;
    return new Date(t.deadline).getTime() < now.getTime();
  });

  const dueTodayTasks = tasks.filter((t) => {
    if (['APPROVED', 'COMPLETED', 'ARCHIVED', 'CANCELLED'].includes(t.status)) return false;
    const d = new Date(t.deadline);
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  });

  // Filter urgent list according to tab
  const urgentList = React.useMemo(() => {
    if (urgentTab === 'REVISION') return revisionTasks;
    if (urgentTab === 'OVERDUE') return overdueTasks;
    if (urgentTab === 'TODAY') return dueTodayTasks;
    return [...new Set([...revisionTasks, ...overdueTasks, ...dueTodayTasks])];
  }, [urgentTab, revisionTasks, overdueTasks, dueTodayTasks]);

  // Designer workload calculation
  const designers = allUsers.filter(
    (u) => u.role === 'DESIGNER' || u.role === 'CONTENT_CREATOR'
  );

  const designerWorkloads = designers.map((d) => {
    const activeTasks = tasks.filter(
      (t) =>
        t.current_assignee_id === d.id &&
        !['APPROVED', 'COMPLETED', 'ARCHIVED', 'CANCELLED'].includes(t.status)
    );
    const completedTasks = tasks.filter(
      (t) =>
        t.current_assignee_id === d.id &&
        ['APPROVED', 'COMPLETED'].includes(t.status)
    );
    const hasRevision = activeTasks.some((t) => t.status === 'REVISION_REQUIRED');

    return {
      user: d,
      activeCount: activeTasks.length,
      completedCount: completedTasks.length,
      hasRevision,
      tasks: activeTasks
    };
  });

  // Total deliverables uploaded count
  const totalDeliverablesCount = tasks.reduce((sum, t) => sum + t.versions.length, 0);

  // Recent activity logs across all tasks
  const recentActivities = tasks
    .flatMap((t) =>
      t.activity_logs.map((a) => ({
        ...a,
        taskTitle: t.title,
        taskIdStr: t.task_id,
        rawTask: t
      }))
    )
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);

  // Greeting based on hours
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

  // Completion rate percentage
  const completionRate = totalTasks > 0 ? Math.round((approvedTasks.length / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6 animate-page-enter">
      {/* Premium 3D Workspace Hero */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-indigo-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 transition-all duration-300">
        {/* Layered 3D Ambient Orbs */}
        <div className="absolute -right-12 -top-12 w-72 h-72 rounded-full bg-indigo-500/25 blur-3xl pointer-events-none animate-subtle-float" />
        <div className="absolute right-1/4 -bottom-16 w-80 h-80 rounded-full bg-violet-600/20 blur-3xl pointer-events-none animate-subtle-float" style={{ animationDelay: '2s' }} />
        <div className="absolute left-1/3 top-4 w-40 h-40 rounded-full bg-cyan-400/15 blur-2xl pointer-events-none" />

        {/* Diagonal specular glass reflection */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 backdrop-blur-md shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                3D Creative Operations Hub
              </span>
              <span className="bg-slate-800/90 text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-lg font-mono border border-slate-700 shadow-inner">
                {currentRole} &bull; {currentUser.position || 'Creative Lead'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-display text-white">
              {greeting}, <span className="bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">{currentUser.full_name}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-w-xl">
              Pantau seluruh alur grafis, deliverable, rotasi revisi terukur, dan utilisasi kapasitas desainer dalam ruang kerja digital interaktif.
            </p>

            {/* Micro Highlights Floating Glass Pills */}
            <div className="pt-2 flex items-center gap-2.5 text-xs flex-wrap">
              <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15 flex items-center gap-2 shadow-xs transition-all">
                <span className="text-slate-300">Deliverable Selesai:</span>
                <span className="font-extrabold text-emerald-400 font-display">{approvedTasks.length} Output</span>
              </div>
              <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15 flex items-center gap-2 shadow-xs transition-all">
                <span className="text-slate-300">File Iterasi:</span>
                <span className="font-extrabold text-amber-300 font-display">{totalDeliverablesCount} Versi</span>
              </div>
              <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15 flex items-center gap-2 shadow-xs transition-all">
                <span className="text-slate-300">Tingkat Kelulusan:</span>
                <span className="font-extrabold text-cyan-300 font-display">{completionRate}%</span>
              </div>
            </div>
          </div>

          {/* Hero Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenAi}
              className="px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5 active:scale-95 shadow-md backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Creative Studio</span>
            </button>
            {canCreateTask && (
              <button
                onClick={onOpenCreateTask}
                className="px-4.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl btn-3d-primary flex items-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5 active:scale-95"
              >
                <span>+ Buat Pekerjaan Desain</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Graphic Design Workflow Live Pipeline & Monitor */}
      <DesignFlowMonitor
        tasks={tasks}
        onSelectTask={onSelectTask}
        onOpenCreateTask={onOpenCreateTask}
        onOpenAi={onOpenAi}
      />

      {/* KPI Cards Grid with Count-Up Animation & 3D Interactive Hover */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 perspective-workspace">
        {/* Total Tasks */}
        <div className="card-3d bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md transition-all group">
          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-display">
              Total Tasks
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 shadow-xs transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-display">
            <AnimatedCounter value={totalTasks} />
          </div>
          <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: '100%' }} />
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 font-medium">Seluruh alur aktif</div>
        </div>

        {/* In Progress */}
        <div className="card-3d bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md transition-all group">
          <div className="flex items-center justify-between text-violet-600 dark:text-violet-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-display">
              In Progress
            </span>
            <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/80 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:scale-110 shadow-xs transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-display">
            <AnimatedCounter value={inProgressTasks.length} />
          </div>
          <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-violet-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${totalTasks > 0 ? (inProgressTasks.length / totalTasks) * 100 : 0}%` }}
            />
          </div>
          <div className="text-[10px] text-violet-600 dark:text-violet-400 font-semibold mt-1.5">Sedang dikerjakan</div>
        </div>

        {/* Under Review */}
        <div className="card-3d bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md transition-all group">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-display">
              Under Review
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/80 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 shadow-xs transition-transform">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-display">
            <AnimatedCounter value={underReviewTasks.length} />
          </div>
          <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${totalTasks > 0 ? (underReviewTasks.length / totalTasks) * 100 : 0}%` }}
            />
          </div>
          <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-1.5">Menunggu approval</div>
        </div>

        {/* Revision - Clickable to Open Critical Status Window */}
        <div
          onClick={() => {
            setCriticalModalTab('REVISION');
            setShowCriticalModal(true);
          }}
          className={`card-3d p-4 rounded-2xl border shadow-md backdrop-blur-xl transition-all group cursor-pointer hover:scale-[1.02] active:scale-95 ${
            revisionTasks.length > 0
              ? 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-300/80 dark:border-rose-800/80 shadow-rose-500/10 hover:border-rose-400 ring-1 ring-rose-500/20'
              : 'bg-white/80 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800'
          }`}
          title="Klik untuk membuka jendela data desain Butuh Revisi"
        >
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-display flex items-center gap-1">
              <span>Revision</span>
              <span className="text-[9px] px-1.5 py-0.2 bg-rose-500/10 text-rose-600 rounded">Klik Data</span>
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-100/80 dark:bg-rose-950/80 flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:scale-110 shadow-xs transition-transform">
              <Flame className={`w-4 h-4 ${revisionTasks.length > 0 ? 'animate-glow-pulse text-rose-600' : ''}`} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-700 dark:text-rose-400 mt-2 font-display">
            <AnimatedCounter value={revisionTasks.length} />
          </div>
          <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-rose-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${totalTasks > 0 ? (revisionTasks.length / totalTasks) * 100 : 0}%` }}
            />
          </div>
          <div className="text-[10px] text-rose-600 dark:text-rose-400 font-bold mt-1.5 flex items-center justify-between">
            <span>{revisionTasks.length > 0 ? 'Perlu revisi segera' : 'Nihil pending'}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Approved */}
        <div className="card-3d bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md transition-all group">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-display">
              Approved
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 shadow-xs transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-display">
            <AnimatedCounter value={approvedTasks.length} />
          </div>
          <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${totalTasks > 0 ? (approvedTasks.length / totalTasks) * 100 : 0}%` }}
            />
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1.5">Selesai & disetujui</div>
        </div>

        {/* Overdue - Clickable to Open Critical Status Window */}
        <div
          onClick={() => {
            setCriticalModalTab('OVERDUE');
            setShowCriticalModal(true);
          }}
          className={`card-3d p-4 rounded-2xl border shadow-md backdrop-blur-xl transition-all group cursor-pointer hover:scale-[1.02] active:scale-95 ${
            overdueTasks.length > 0
              ? 'bg-red-50/50 dark:bg-red-950/30 border-red-300/80 dark:border-red-800/80 shadow-red-500/10 hover:border-red-400 ring-1 ring-red-500/20'
              : 'bg-white/80 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800'
          }`}
          title="Klik untuk membuka jendela data desain Overdue (Terlambat)"
        >
          <div className="flex items-center justify-between text-red-600 dark:text-red-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-display flex items-center gap-1">
              <span>Overdue</span>
              <span className="text-[9px] px-1.5 py-0.2 bg-red-500/10 text-red-600 rounded">Klik Data</span>
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-100/80 dark:bg-red-950/80 flex items-center justify-center text-red-600 dark:text-red-400 group-hover:scale-110 shadow-xs transition-transform">
              <AlertTriangle className={`w-4 h-4 ${overdueTasks.length > 0 ? 'animate-pulse' : ''}`} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-red-700 dark:text-red-400 mt-2 font-display">
            <AnimatedCounter value={overdueTasks.length} />
          </div>
          <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-red-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${totalTasks > 0 ? (overdueTasks.length / totalTasks) * 100 : 0}%` }}
            />
          </div>
          <div className="text-[10px] text-red-600 dark:text-red-400 font-bold mt-1.5 flex items-center justify-between">
            <span>{overdueTasks.length > 0 ? 'Lewat batas waktu' : 'On schedule'}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Main Content 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 perspective-workspace">
        {/* Left 2 Columns: Priority Tasks & Deadlines */}
        <div className="lg:col-span-2 space-y-6">
          {/* Priority & Urgent Action Table with Filter Tabs */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-900/40">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base font-display flex items-center gap-2">
                  <span>Task Perlu Perhatian Khusus</span>
                  {urgentList.length > 0 && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 shadow-xs animate-pulse">
                      {urgentList.length}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Task berstatus revisi, melewati deadline, atau jatuh tempo hari ini
                </p>
              </div>

              {/* Quick Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shrink-0 text-xs shadow-inner">
                <button
                  onClick={() => setUrgentTab('ALL')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    urgentTab === 'ALL'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setUrgentTab('REVISION')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    urgentTab === 'REVISION'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400'
                  }`}
                >
                  <Flame className="w-3 h-3" />
                  Revisi ({revisionTasks.length})
                </button>
                <button
                  onClick={() => setUrgentTab('OVERDUE')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    urgentTab === 'OVERDUE'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400'
                  }`}
                >
                  Overdue ({overdueTasks.length})
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 overflow-x-auto">
              {urgentList.length === 0 ? (
                <div className="p-10 text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-xs">
                    <CheckCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Semua Terkendali!</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Tidak ada task yang memerlukan tindakan darurat pada kategori ini. Seluruh alur kerja berjalan tepat waktu.
                  </p>
                </div>
              ) : (
                urgentList.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    className="p-4 hover:bg-indigo-50/50 dark:hover:bg-slate-800/50 transition-all flex items-center justify-between gap-4 cursor-pointer group"
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {task.task_id}
                        </span>
                        <DesignTypeBadge type={task.task_type} />
                        <StatusBadge status={task.status} size="sm" />
                        <PriorityBadge priority={task.priority} />
                        {task.versions.length > 0 && (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {task.versions[task.versions.length - 1].version_number}
                          </span>
                        )}
                        {task.handovers.length > 0 && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                            Handover ({task.handovers.length}x)
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                        {task.title}
                      </h4>

                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                        <span className="font-medium text-slate-600 dark:text-slate-300">
                          Proyek: {task.project_name || 'Stand-alone'}
                        </span>
                        <span>&bull;</span>
                        <div className="flex items-center gap-1.5">
                          <img
                            src={task.current_assignee_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                            alt={task.current_assignee_name || 'Assignee'}
                            className="w-4.5 h-4.5 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                          />
                          <span className="text-slate-700 dark:text-slate-300 font-medium">
                            {task.current_assignee_name || 'Belum ditugaskan'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                      <DeadlineBadge deadline={task.deadline} status={task.status} />
                      <span className="text-[11px] font-semibold text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center gap-1 transition-transform group-hover:translate-x-0.5">
                        Buka Task <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Designer Workload & Team Capacity */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base font-display flex items-center gap-2">
                  <Palette className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Kapasitas & Beban Kerja Desainer</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pantau distribusi tugas aktif, tingkat penyelesaian, dan kesiapan talenta tim
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {designerWorkloads.length} Talenta
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {designerWorkloads.map((item) => {
                const isOverloaded = item.activeCount >= 4;
                return (
                  <div
                    key={item.user.id}
                    className="card-3d p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/50 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={item.user.avatar_url}
                          alt={item.user.full_name}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500/20"
                        />
                        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white dark:ring-slate-900 ${item.hasRevision ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                            {item.user.full_name}
                          </h4>
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {item.user.role === 'DESIGNER' ? 'Graphic' : 'Creator'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-medium">
                          {item.user.position}
                        </p>
                      </div>
                    </div>

                    {/* Stats metrics */}
                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="bg-white/80 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                        <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold block uppercase font-display">
                          Task Aktif
                        </span>
                        <span className="font-extrabold text-slate-900 dark:text-white text-base font-display">
                          {item.activeCount}
                        </span>
                      </div>
                      <div className="bg-white/80 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                        <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold block uppercase font-display">
                          Selesai
                        </span>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-base font-display">
                          {item.completedCount}
                        </span>
                      </div>
                    </div>

                    {/* Capacity status bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                        <span>Status Kapasitas:</span>
                        <span className={isOverloaded ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}>
                          {isOverloaded ? 'Padat (Siaga)' : 'Optimal & Tersedia'}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isOverloaded ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(item.activeCount * 25, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Creative Delivery Pipeline & Recent Activity */}
        <div className="space-y-6">
          {/* Status Breakdown Visualization */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base font-display flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Distribusi Status Pekerjaan</span>
              </h3>
              <span className="text-xs font-bold text-slate-400">{totalTasks} Total</span>
            </div>

            <div className="space-y-3">
              {[
                { label: 'In Progress', count: inProgressTasks.length, color: 'bg-violet-600', text: 'text-violet-600 dark:text-violet-400' },
                { label: 'Under Review', count: underReviewTasks.length, color: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
                { label: 'Butuh Revisi', count: revisionTasks.length, color: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400' },
                { label: 'Approved Final', count: approvedTasks.length, color: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
              ].map((item, idx) => {
                const pct = totalTasks > 0 ? Math.round((item.count / totalTasks) * 100) : 0;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
                      <span className={`font-mono font-bold ${item.text}`}>{item.count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className={`${item.color} h-full rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Timeline Stream */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base font-display flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Log Aktivitas Terkini</span>
              </h3>
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                Live Feed
              </span>
            </div>

            <div className="space-y-3">
              {recentActivities.map((act) => (
                <div
                  key={act.id}
                  onClick={() => onSelectTask(act.rawTask)}
                  className="card-3d p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-850/40 hover:bg-indigo-50/50 dark:hover:bg-slate-800/60 transition-all cursor-pointer text-xs space-y-1.5 group"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate max-w-[160px]">
                      {act.taskTitle}
                    </span>
                    <span className="text-slate-400 text-[10px] font-mono shrink-0">
                      {formatDateIndo(act.created_at)}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                    {act.details}
                  </p>
                  <div className="text-[10px] text-slate-400 font-medium">
                    Oleh: <span className="text-slate-700 dark:text-slate-300 font-semibold">{act.user_name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Jendela Data Status Kritis Desain */}
      <CriticalDesignStatusModal
        isOpen={showCriticalModal}
        onClose={() => setShowCriticalModal(false)}
        tasks={tasks}
        onSelectTask={onSelectTask}
        initialTab={criticalModalTab}
      />
    </div>
  );
};
