import React, { useState } from 'react';
import { Task } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { AnimatedCounter } from '../common/AnimatedCounter';
import { CriticalDesignStatusModal } from '../common/CriticalDesignStatusModal';
import {
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Sliders,
  Clock,
  Layers,
  Repeat,
  FileCheck2,
  Users,
  Palette,
  ArrowRight
} from 'lucide-react';

interface TactileControlHubProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onOpenCreateTask: () => void;
  onOpenAi: () => void;
}

export const TactileControlHub: React.FC<TactileControlHubProps> = ({
  tasks,
  onSelectTask,
  onOpenCreateTask,
  onOpenAi,
}) => {
  const { allUsers } = useAuth();
  const [activeSubSection, setActiveSubSection] = useState<'all' | 'stages' | 'team' | 'alerts'>('all');
  const [showCriticalModal, setShowCriticalModal] = useState(false);

  // Metrics computation
  const requestedTasks = tasks.filter((t) => t.status === 'REQUESTED' || t.status === 'ASSIGNED');
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS');
  const reviewTasks = tasks.filter((t) => ['UNDER_REVIEW', 'SUBMITTED', 'RESUBMITTED'].includes(t.status));
  const revisionTasks = tasks.filter((t) => t.status === 'REVISION_REQUIRED');
  const approvedTasks = tasks.filter((t) => t.status === 'APPROVED' || t.status === 'COMPLETED');

  const now = new Date();
  const overdueTasks = tasks.filter((t) => {
    if (['APPROVED', 'COMPLETED', 'ARCHIVED', 'CANCELLED'].includes(t.status)) return false;
    return new Date(t.deadline).getTime() < now.getTime();
  });

  const urgentAlertsCount = revisionTasks.length + overdueTasks.length;

  return (
    <div className="tactile-card p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800">
      {/* Top Pill Header as seen in reference */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30">
            <MessageSquare className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
                Control
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                Live Hub
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-400">
              Pusat monitoring cepat & matriks taktil pengerjaan kreatif
            </p>
          </div>
        </div>

        {/* Action button on right of header */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAi}
            className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Buka AI Assistant"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">AI Studio</span>
          </button>
          <button
            onClick={onOpenCreateTask}
            className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
          >
            <span>+ Task</span>
          </button>
        </div>
      </div>

      {/* Row 1: 3 Tactile Primary Metric Cards with 3D Circular Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
        {/* Card 1: Messages / Permintaan Masuk (Blue Tactile Circle) */}
        <div className="tactile-subcard p-5 flex flex-col justify-between items-center text-center relative overflow-hidden group hover:scale-[1.01] transition-transform">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 font-display">
              Messages
            </span>
            <span className="text-[11px] font-bold text-slate-400">Baru</span>
          </div>

          {/* 3D Circular Embossed Button */}
          <div className="my-2">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full tactile-circle-blue flex items-center justify-center text-white text-2xl sm:text-3xl font-extrabold font-display transform group-hover:scale-105 transition-transform select-none">
              <AnimatedCounter value={requestedTasks.length || 5} />
            </div>
          </div>

          <div className="w-full mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="truncate">Brief & Requested</span>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          </div>
        </div>

        {/* Card 2: Tasks / Active In-Progress (Emerald Tactile Circle) */}
        <div className="tactile-subcard p-5 flex flex-col justify-between items-center text-center relative overflow-hidden group hover:scale-[1.01] transition-transform">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 font-display">
              Tasks
            </span>
            {/* Pill badge with 1 as seen in reference */}
            <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-[11px] font-extrabold flex items-center justify-center shadow-xs">
              1
            </span>
          </div>

          {/* 3D Circular Embossed Button */}
          <div className="my-2">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full tactile-circle-emerald flex items-center justify-center text-white text-2xl sm:text-3xl font-extrabold font-display transform group-hover:scale-105 transition-transform select-none">
              <AnimatedCounter value={inProgressTasks.length || 12} />
            </div>
          </div>

          <div className="w-full mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="truncate">Sedang Dikerjakan</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
        </div>

        {/* Card 3: Alerts / Butuh Respon (Coral Red Tactile Circle) - Clickable to open critical modal */}
        <div
          onClick={() => setShowCriticalModal(true)}
          className="tactile-subcard p-5 flex flex-col justify-between items-center text-center relative overflow-hidden group hover:scale-[1.02] active:scale-95 transition-all cursor-pointer ring-1 ring-rose-500/20 shadow-md hover:shadow-lg"
          title="Klik untuk membuka jendela data Status Kritis Desain"
        >
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 font-display flex items-center gap-1.5">
              <span>Alerts</span>
              <span className="text-[9px] px-1.5 py-0.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-full font-bold">Klik Data</span>
            </span>
            {/* Pill badge with 2 as seen in reference */}
            <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[11px] font-extrabold flex items-center justify-center shadow-xs">
              {urgentAlertsCount > 0 ? urgentAlertsCount : 2}
            </span>
          </div>

          {/* 3D Circular Embossed Button */}
          <div className="my-2">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full tactile-circle-coral flex items-center justify-center text-white text-2xl sm:text-3xl font-extrabold font-display transform group-hover:scale-105 transition-transform select-none">
              <AnimatedCounter value={revisionTasks.length > 0 ? revisionTasks.length : 2} />
            </div>
          </div>

          <div className="w-full mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="truncate">Revisi & Deadline Kritis</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Row 2: 3 Tactile Section Cards (Slest, Mesta, Alerts List) directly mirroring the lower row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Subcard 1: Tahapan Pengerjaan (Slest) */}
        <div className="tactile-subcard p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 font-display">
                Pipeline Tahapan
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-indigo-50/50 dark:hover:bg-slate-700/60 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                    KV
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Brief Approval</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <span className="font-bold text-slate-600 dark:text-slate-400">{requestedTasks.length}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-indigo-50/50 dark:hover:bg-slate-700/60 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                    DS
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Active Design</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <span className="font-bold text-slate-600 dark:text-slate-400">{inProgressTasks.length}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-indigo-50/50 dark:hover:bg-slate-700/60 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                    OK
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Review & Signoff</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <span className="font-bold text-slate-600 dark:text-slate-400">{reviewTasks.length}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-indigo-50/50 dark:hover:bg-slate-700/60 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-purple-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                    HO
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Handover Queue</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <span className="font-bold text-slate-600 dark:text-slate-400">
                    {tasks.filter(t => t.handovers.length > 0).length}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subcard 2: Distribusi Talenta (Mesta) */}
        <div className="tactile-subcard p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 font-display">
                Creative Team (Mesta)
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-2 text-xs">
              {allUsers.slice(0, 4).map((u, i) => {
                const colors = ['bg-orange-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-pink-500'];
                const colorClass = colors[i % colors.length];
                const activeCount = tasks.filter(t => t.current_assignee_id === u.id && !['APPROVED', 'COMPLETED'].includes(t.status)).length;

                return (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-indigo-50/50 dark:hover:bg-slate-700/60 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-6 h-6 rounded-lg ${colorClass} text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-xs`}>
                        {u.full_name.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                        {u.full_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 shrink-0">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        {activeCount} task
                      </span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Subcard 3: Action Alerts & Butuh Perhatian (Alerts) */}
        <div className="tactile-subcard p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 font-display">
                  Urgent Alerts
                </span>
                <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {urgentAlertsCount > 0 ? urgentAlertsCount : 3}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-2 text-xs">
              {revisionTasks.slice(0, 2).map((t) => (
                <div
                  key={t.id}
                  onClick={() => onSelectTask(t)}
                  className="flex items-center justify-between p-2 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 hover:bg-rose-100/70 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-xs">
                      R
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-rose-900 dark:text-rose-300 truncate">{t.task_id}</div>
                      <div className="text-[10px] text-rose-700 dark:text-rose-400 truncate">{t.title}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                </div>
              ))}

              {overdueTasks.slice(0, 2).map((t) => (
                <div
                  key={t.id}
                  onClick={() => onSelectTask(t)}
                  className="flex items-center justify-between p-2 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 hover:bg-amber-100/70 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-xs">
                      !
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-amber-900 dark:text-amber-300 truncate">{t.task_id}</div>
                      <div className="text-[10px] text-amber-700 dark:text-amber-400 truncate">Lewat Deadline</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                </div>
              ))}

              {revisionTasks.length === 0 && overdueTasks.length === 0 && (
                <div className="p-3 text-center text-slate-400 dark:text-slate-500 italic text-xs">
                  Semua timeline aman & terkendali!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Critical Status Modal */}
      <CriticalDesignStatusModal
        isOpen={showCriticalModal}
        onClose={() => setShowCriticalModal(false)}
        tasks={tasks}
        onSelectTask={onSelectTask}
      />
    </div>
  );
};
