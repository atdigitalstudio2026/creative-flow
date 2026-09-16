import React, { useState, useMemo } from 'react';
import { Task } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { DeadlineBadge } from '../common/DeadlineBadge';
import { DesignTypeBadge } from '../common/DesignTypeBadge';
import { formatDateIndo } from '../../utils/dateUtils';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Sparkles,
  Layers,
  Palette,
  Eye,
  Filter,
  Search,
  CheckCheck,
  RotateCcw,
  ExternalLink,
  Plus
} from 'lucide-react';

interface DesignFlowMonitorProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onOpenCreateTask: () => void;
  onOpenAi: () => void;
}

type FlowStage = 'ALL' | 'BRIEF' | 'IN_PROGRESS' | 'REVIEW' | 'REVISION' | 'COMPLETED';

export const DesignFlowMonitor: React.FC<DesignFlowMonitorProps> = ({
  tasks,
  onSelectTask,
  onOpenCreateTask,
  onOpenAi,
}) => {
  const { allUsers } = useAuth();
  const [selectedStage, setSelectedStage] = useState<FlowStage>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  // Categorize tasks according to real graphic design stages
  const briefTasks = useMemo(
    () => tasks.filter((t) => t.status === 'REQUESTED' || t.status === 'ASSIGNED'),
    [tasks]
  );
  const inProgressTasks = useMemo(
    () => tasks.filter((t) => t.status === 'IN_PROGRESS'),
    [tasks]
  );
  const reviewTasks = useMemo(
    () => tasks.filter((t) => ['UNDER_REVIEW', 'SUBMITTED', 'RESUBMITTED'].includes(t.status)),
    [tasks]
  );
  const revisionTasks = useMemo(
    () => tasks.filter((t) => t.status === 'REVISION_REQUIRED'),
    [tasks]
  );
  const completedTasks = useMemo(
    () => tasks.filter((t) => t.status === 'APPROVED' || t.status === 'COMPLETED'),
    [tasks]
  );

  // Filter tasks based on stage, search, and type
  const filteredTasks = useMemo(() => {
    let list = tasks;

    // Stage filter
    if (selectedStage === 'BRIEF') list = briefTasks;
    else if (selectedStage === 'IN_PROGRESS') list = inProgressTasks;
    else if (selectedStage === 'REVIEW') list = reviewTasks;
    else if (selectedStage === 'REVISION') list = revisionTasks;
    else if (selectedStage === 'COMPLETED') list = completedTasks;

    // Type filter
    if (selectedType !== 'ALL') {
      list = list.filter((t) => t.design_type === selectedType);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.brand_name?.toLowerCase().includes(q) ||
          t.assignee?.full_name.toLowerCase().includes(q)
      );
    }

    return list;
  }, [tasks, selectedStage, selectedType, searchQuery, briefTasks, inProgressTasks, reviewTasks, revisionTasks, completedTasks]);

  const stages = [
    {
      id: 'BRIEF' as FlowStage,
      step: '1',
      title: 'Brief Masuk',
      subtitle: 'Permintaan & Penugasan',
      count: briefTasks.length,
      color: 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300',
      activeColor: 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-slate-100',
      badgeColor: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200',
      icon: FileText,
    },
    {
      id: 'IN_PROGRESS' as FlowStage,
      step: '2',
      title: 'Sedang Didesain',
      subtitle: 'Proses Pengerjaan',
      count: inProgressTasks.length,
      color: 'border-indigo-200 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300',
      activeColor: 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20',
      badgeColor: 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300',
      icon: Palette,
    },
    {
      id: 'REVIEW' as FlowStage,
      step: '3',
      title: 'Menunggu Review',
      subtitle: 'Approval Manajer/Klien',
      count: reviewTasks.length,
      color: 'border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-300',
      activeColor: 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20',
      badgeColor: 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300',
      icon: Eye,
    },
    {
      id: 'REVISION' as FlowStage,
      step: '4',
      title: 'Butuh Revisi',
      subtitle: 'Perbaikan Catatan Feedback',
      count: revisionTasks.length,
      color: 'border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300',
      activeColor: 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-500/20',
      badgeColor: 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300',
      icon: Flame,
    },
    {
      id: 'COMPLETED' as FlowStage,
      step: '5',
      title: 'Selesai & Handover',
      subtitle: 'File Disetujui & Siap Pakai',
      count: completedTasks.length,
      color: 'border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300',
      activeColor: 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20',
      badgeColor: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300',
      icon: CheckCheck,
    },
  ];

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-lg space-y-6">
      {/* Top Header: Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-glow-pulse" />
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-display">
              Alur Monitoring Pekerjaan Desain
            </h2>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              Live Flow 3D
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pantau pergerakan desain mulai dari brief masuk, pengerjaan, approval review, siklus revisi, hingga serah terima aset.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenAi}
            className="px-3.5 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-200/60 dark:border-slate-700 shadow-2xs active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>AI Assistant</span>
          </button>
          <button
            onClick={onOpenCreateTask}
            className="px-4 py-2 rounded-xl btn-3d-primary text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Buat Desain</span>
          </button>
        </div>
      </div>

      {/* 5-Step Visual Flow Stepper */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
          <span className="tracking-wider uppercase text-[11px]">PIPELINE KERJA DESAIN GRAFIS</span>
          {selectedStage !== 'ALL' && (
            <button
              onClick={() => setSelectedStage('ALL')}
              className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Tampilkan Semua ({tasks.length})
            </button>
          )}
        </div>

        {/* Stepper Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {stages.map((stg) => {
            const isSelected = selectedStage === stg.id;
            const Icon = stg.icon;

            return (
              <button
                key={stg.id}
                onClick={() => setSelectedStage(isSelected ? 'ALL' : stg.id)}
                className={`card-3d text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                  isSelected
                    ? `${stg.activeColor} shadow-lg scale-[1.02]`
                    : `bg-slate-50/70 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800/80 ${stg.color}`
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2.5">
                  <span
                    className={`w-7 h-7 rounded-xl text-xs font-extrabold flex items-center justify-center font-display ${
                      isSelected
                        ? 'bg-white/20 text-white shadow-inner'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs'
                    }`}
                  >
                    {stg.step}
                  </span>
                  <span
                    className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/25 text-white' : stg.badgeColor
                    }`}
                  >
                    {stg.count}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-4 h-4 shrink-0 opacity-90" />
                    <span className="text-xs font-extrabold truncate leading-tight font-display">
                      {stg.title}
                    </span>
                  </div>
                  <p
                    className={`text-[10px] mt-0.5 truncate font-medium ${
                      isSelected ? 'text-white/85' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {stg.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari judul desain, brand, atau desainer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9.5 pr-3.5 py-2 text-xs bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 shadow-inner"
          />
        </div>

        {/* Type & Quick Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 uppercase tracking-wider">Format:</span>
          {['ALL', 'FEED_INSTAGRAM', 'STORY_REELS', 'BANNER_ADS', 'BRANDING_LOGO', 'PRINT_PACKAGING'].map((typeKey) => {
            const labels: Record<string, string> = {
              ALL: 'Semua',
              FEED_INSTAGRAM: 'Feed IG',
              STORY_REELS: 'Reels / Story',
              BANNER_ADS: 'Banner Ads',
              BRANDING_LOGO: 'Logo / Brand',
              PRINT_PACKAGING: 'Cetak / Print',
            };
            const isTypeActive = selectedType === typeKey;

            return (
              <button
                key={typeKey}
                onClick={() => setSelectedType(typeKey)}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-xl shrink-0 transition-all cursor-pointer ${
                  isTypeActive
                    ? 'btn-3d-primary text-white shadow-xs'
                    : 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                {labels[typeKey] || typeKey}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filtered Tasks Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span>
            Menampilkan <strong className="text-slate-800 dark:text-slate-200">{filteredTasks.length}</strong> pekerjaan desain
            {selectedStage !== 'ALL' && ` dalam tahap ${stages.find((s) => s.id === selectedStage)?.title}`}
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer font-semibold"
            >
              Hapus pencarian
            </button>
          )}
        </div>

        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center bg-slate-50/50 dark:bg-slate-850/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <Palette className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Tidak ada pekerjaan desain yang sesuai dengan filter.
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Coba reset filter tahap atau buat pekerjaan desain baru.
            </p>
            <button
              onClick={() => {
                setSelectedStage('ALL');
                setSelectedType('ALL');
                setSearchQuery('');
              }}
              className="mt-3 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-100 transition-colors cursor-pointer"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 perspective-workspace">
            {filteredTasks.slice(0, 6).map((task) => {
              const revCount = task.revisions?.length || 0;
              const hasActiveRevision = task.status === 'REVISION_REQUIRED';

              return (
                <div
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  className="card-3d p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-850/70 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-sm transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    {/* Header line: Type & Status */}
                    <div className="flex items-center justify-between gap-1.5 flex-wrap">
                      <DesignTypeBadge type={task.design_type} />
                      <StatusBadge status={task.status} />
                    </div>

                    {/* Title & Brand */}
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                        {task.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                        {task.brand_name || 'Brand Umum'} &bull; Dimensi: {task.dimensions || '1080x1080px'}
                      </p>
                    </div>

                    {/* Version & Revision highlight */}
                    <div className="flex items-center gap-2 text-[11px] pt-1">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold border border-slate-200 dark:border-slate-700">
                        V{task.deliverable_version || 1}.0
                      </span>
                      {revCount > 0 ? (
                        <span
                          className={`flex items-center gap-1 font-bold px-2 py-0.5 rounded-md ${
                            hasActiveRevision
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 animate-pulse'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}
                        >
                          <Flame className="w-3 h-3" />
                          {revCount}x Revisi
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">Belum ada revisi</span>
                      )}
                    </div>
                  </div>

                  {/* Footer: Assignee & Deadline */}
                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 truncate max-w-[130px]">
                      {task.assignee ? (
                        <>
                          <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-[9px] shrink-0 ring-1 ring-indigo-500/20">
                            {task.assignee.full_name.charAt(0)}
                          </div>
                          <span className="text-slate-600 dark:text-slate-300 font-medium truncate">
                            {task.assignee.full_name}
                          </span>
                        </>
                      ) : (
                        <span className="text-slate-400 italic">Belum di-assign</span>
                      )}
                    </div>

                    <DeadlineBadge deadline={task.deadline} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
