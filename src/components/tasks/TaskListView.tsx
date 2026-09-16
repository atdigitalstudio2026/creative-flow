import React, { useState, useMemo } from 'react';
import { Task, TaskStatus, TaskPriority } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { DeadlineBadge } from '../common/DeadlineBadge';
import { DesignTypeBadge } from '../common/DesignTypeBadge';
import { formatDateIndo } from '../../utils/dateUtils';
import {
  Filter,
  ArrowUpDown,
  Download,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Repeat,
  Plus,
  Flame,
  Clock,
  Sparkles,
  Layers,
  Palette
} from 'lucide-react';

interface TaskListViewProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onOpenCreateTask: () => void;
  onOpenHandover: (task: Task) => void;
  filterAssigneeId?: string;
  initialStatusFilter?: TaskStatus | 'ALL';
  pageTitle?: string;
}

export const TaskListView: React.FC<TaskListViewProps> = ({
  tasks,
  onSelectTask,
  onOpenCreateTask,
  onOpenHandover,
  filterAssigneeId,
  initialStatusFilter = 'ALL',
  pageTitle = 'Daftar Seluruh Pekerjaan'
}) => {
  const { allUsers, canCreateTask, canHandover } = useAuth();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter);
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState<string>(filterAssigneeId || 'ALL');
  const [onlyOverdue, setOnlyOverdue] = useState(false);
  const [onlyRevision, setOnlyRevision] = useState(false);
  const [sortBy, setSortBy] = useState<'deadline' | 'priority' | 'id' | 'status'>('deadline');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Stats calculation
  const totalCount = tasks.length;
  const inProgressCount = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const reviewCount = tasks.filter(t => ['SUBMITTED', 'UNDER_REVIEW', 'RESUBMITTED'].includes(t.status)).length;
  const revisionCount = tasks.filter(t => t.status === 'REVISION_REQUIRED').length;
  const doneCount = tasks.filter(t => ['APPROVED', 'COMPLETED'].includes(t.status)).length;

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchId = t.task_id.toLowerCase().includes(q);
        const matchAssignee = (t.current_assignee_name || '').toLowerCase().includes(q);
        const matchProject = (t.project_name || '').toLowerCase().includes(q);
        const matchType = (t.task_type || '').toLowerCase().includes(q);
        if (!matchTitle && !matchId && !matchAssignee && !matchProject && !matchType) {
          return false;
        }
      }

      // Status
      if (statusFilter !== 'ALL' && t.status !== statusFilter) {
        return false;
      }

      // Priority
      if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) {
        return false;
      }

      // Assignee
      if (assigneeFilter !== 'ALL' && t.current_assignee_id !== assigneeFilter) {
        return false;
      }

      // Overdue
      if (onlyOverdue) {
        const isDone = ['APPROVED', 'COMPLETED', 'ARCHIVED', 'CANCELLED'].includes(t.status);
        if (isDone || new Date(t.deadline).getTime() >= Date.now()) {
          return false;
        }
      }

      // Revision
      if (onlyRevision && t.status !== 'REVISION_REQUIRED') {
        return false;
      }

      return true;
    }).sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'deadline') {
        cmp = new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      } else if (sortBy === 'id') {
        cmp = a.task_id.localeCompare(b.task_id);
      } else if (sortBy === 'priority') {
        const pOrder: Record<TaskPriority, number> = { URGENT: 4, HIGH: 3, NORMAL: 2, LOW: 1 };
        cmp = (pOrder[b.priority] || 0) - (pOrder[a.priority] || 0);
      } else if (sortBy === 'status') {
        cmp = a.status.localeCompare(b.status);
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });
  }, [tasks, search, statusFilter, priorityFilter, assigneeFilter, onlyOverdue, onlyRevision, sortBy, sortOrder]);

  const handleExportCSV = () => {
    const headers = ['Task ID', 'Judul', 'Status', 'Prioritas', 'Project', 'Assignee Saat Ini', 'Assignee Awal', 'Deadline', 'Versi Terakhir', 'Total Revisi', 'Handover'];
    const rows = filteredTasks.map((t) => [
      t.task_id,
      `"${t.title.replace(/"/g, '""')}"`,
      t.status,
      t.priority,
      `"${t.project_name || ''}"`,
      `"${t.current_assignee_name || '-'}"`,
      `"${t.original_assignee_name || '-'}"`,
      t.deadline,
      t.versions.length > 0 ? t.versions[t.versions.length - 1].version_number : '-',
      t.revisions.length,
      t.handovers.length
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `creative-tasks-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 animate-page-enter">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-glow-pulse" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display">
              {pageTitle}
            </h2>
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-2xs">
              {filteredTasks.length} / {tasks.length} Task
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Daftar terpadu pemantauan seluruh item desain, status progres, penugasan, dan riwayat revisi
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-850/80 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-2xs cursor-pointer transition-all active:scale-95"
            title="Download CSV untuk audit atau pelaporan"
          >
            <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Export CSV</span>
          </button>
          {canCreateTask && (
            <button
              onClick={onOpenCreateTask}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl btn-3d-primary text-white shadow-md cursor-pointer active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>+ Buat Task</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Summary Chips Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 perspective-workspace">
        <button
          onClick={() => { setStatusFilter('ALL'); setOnlyRevision(false); setOnlyOverdue(false); }}
          className={`card-3d p-3 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'ALL' && !onlyRevision && !onlyOverdue
              ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/60 shadow-md scale-[1.02]'
              : 'border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-850/70 hover:bg-white dark:hover:bg-slate-800 shadow-xs'
          }`}
        >
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Task</div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white font-display mt-0.5">{totalCount}</div>
        </button>

        <button
          onClick={() => { setStatusFilter('IN_PROGRESS'); setOnlyRevision(false); setOnlyOverdue(false); }}
          className={`card-3d p-3 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'IN_PROGRESS'
              ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/60 shadow-md scale-[1.02]'
              : 'border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-850/70 hover:bg-white dark:hover:bg-slate-800 shadow-xs'
          }`}
        >
          <div className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Sedang Dikerjakan</div>
          <div className="text-xl font-extrabold text-indigo-900 dark:text-indigo-300 font-display mt-0.5">{inProgressCount}</div>
        </button>

        <button
          onClick={() => { setStatusFilter('UNDER_REVIEW'); setOnlyRevision(false); setOnlyOverdue(false); }}
          className={`card-3d p-3 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'UNDER_REVIEW'
              ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/60 shadow-md scale-[1.02]'
              : 'border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-850/70 hover:bg-white dark:hover:bg-slate-800 shadow-xs'
          }`}
        >
          <div className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Menunggu Review</div>
          <div className="text-xl font-extrabold text-amber-900 dark:text-amber-300 font-display mt-0.5">{reviewCount}</div>
        </button>

        <button
          onClick={() => { setOnlyRevision(true); setStatusFilter('REVISION_REQUIRED'); }}
          className={`card-3d p-3 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'REVISION_REQUIRED' || onlyRevision
              ? 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/60 shadow-md scale-[1.02]'
              : 'border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-850/70 hover:bg-white dark:hover:bg-slate-800 shadow-xs'
          }`}
        >
          <div className="text-[10px] font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1">
            <Flame className="w-3 h-3 text-rose-500 animate-pulse" />
            Butuh Revisi
          </div>
          <div className="text-xl font-extrabold text-rose-700 dark:text-rose-300 font-display mt-0.5">{revisionCount}</div>
        </button>

        <button
          onClick={() => { setStatusFilter('APPROVED'); setOnlyRevision(false); setOnlyOverdue(false); }}
          className={`card-3d p-3 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'APPROVED'
              ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/60 shadow-md scale-[1.02]'
              : 'border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-850/70 hover:bg-white dark:hover:bg-slate-800 shadow-xs'
          }`}
        >
          <div className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Approved / Selesai</div>
          <div className="text-xl font-extrabold text-emerald-800 dark:text-emerald-300 font-display mt-0.5">{doneCount}</div>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari task ID, format, judul..."
              className="w-full pl-9.5 pr-3.5 py-2 text-xs rounded-xl border border-slate-200/80 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-slate-50/80 dark:bg-slate-800/60 text-slate-900 dark:text-white font-medium shadow-inner"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200/80 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-slate-50/80 dark:bg-slate-800/60 font-semibold text-slate-700 dark:text-slate-200 cursor-pointer shadow-inner"
            >
              <option value="ALL">Semua Status Pengerjaan</option>
              <option value="REQUESTED">Requested (Permintaan Masuk)</option>
              <option value="ASSIGNED">Assigned (Ditugaskan)</option>
              <option value="IN_PROGRESS">In Progress (Sedang Didesain)</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_REVIEW">Under Review (Evaluasi)</option>
              <option value="REVISION_REQUIRED">Revision Required (Revisi)</option>
              <option value="RESUBMITTED">Resubmitted</option>
              <option value="APPROVED">Approved (Disetujui)</option>
              <option value="COMPLETED">Completed (Final)</option>
              <option value="ON_HOLD">On Hold</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200/80 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-slate-50/80 dark:bg-slate-800/60 font-semibold text-slate-700 dark:text-slate-200 cursor-pointer shadow-inner"
            >
              <option value="ALL">Semua Prioritas</option>
              <option value="URGENT">Urgent (Darurat / Sangat Ketat)</option>
              <option value="HIGH">High (Tinggi)</option>
              <option value="NORMAL">Normal</option>
              <option value="LOW">Low (Rendah)</option>
            </select>
          </div>

          {/* Assignee Filter */}
          <div>
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200/80 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-slate-50/80 dark:bg-slate-800/60 font-semibold text-slate-700 dark:text-slate-200 cursor-pointer shadow-inner"
            >
              <option value="ALL">Semua Desainer & Kreator</option>
              {allUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name} ({u.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/80 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 select-none">
              <input
                type="checkbox"
                checked={onlyOverdue}
                onChange={(e) => setOnlyOverdue(e.target.checked)}
                className="rounded text-rose-600 focus:ring-rose-500 w-3.5 h-3.5"
              />
              <span className="font-bold text-rose-600 dark:text-rose-400">Hanya Overdue (Lewat Deadline)</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 select-none">
              <input
                type="checkbox"
                checked={onlyRevision}
                onChange={(e) => setOnlyRevision(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5"
              />
              <span className="font-bold text-amber-600 dark:text-amber-400">Hanya Butuh Revisi</span>
            </label>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-1.5 px-3 text-xs rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer shadow-2xs"
            >
              <option value="deadline">Batas Waktu (Deadline)</option>
              <option value="priority">Tingkat Prioritas</option>
              <option value="id">Task ID</option>
              <option value="status">Status</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 rounded-xl border border-slate-200/80 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer transition-colors shadow-2xs active:scale-95"
              title={`Arah: ${sortOrder === 'asc' ? 'Menaik' : 'Menurun'}`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Table of Tasks */}
      <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/90 dark:bg-slate-800/90 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-extrabold border-b border-slate-200/80 dark:border-slate-800 text-[10px] font-display">
              <tr>
                <th className="py-4 px-5">Task ID & Judul</th>
                <th className="py-4 px-3">Format / Tipe</th>
                <th className="py-4 px-3">Assignee</th>
                <th className="py-4 px-3">Status</th>
                <th className="py-4 px-3">Prioritas</th>
                <th className="py-4 px-3">Deadline</th>
                <th className="py-4 px-3 text-center">Versi</th>
                <th className="py-4 px-3">Progress</th>
                <th className="py-4 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 dark:divide-slate-800">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-slate-400 dark:text-slate-500 italic">
                    Tidak ada pekerjaan yang cocok dengan kriteria filter saat ini.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const latestVersion = task.versions.length > 0
                    ? task.versions[task.versions.length - 1].version_number
                    : 'V0';
                  const revisionCount = task.revisions.length;
                  const handoverCount = task.handovers.length;

                  return (
                    <tr
                      key={task.id}
                      className="hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-colors group cursor-pointer"
                      onClick={() => onSelectTask(task)}
                    >
                      {/* Task ID & Title */}
                      <td className="py-3.5 px-5 max-w-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {task.task_id}
                          </span>
                          {handoverCount > 0 && (
                            <span
                              className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                              title={`Pernah dialihkan (Handover) ${handoverCount} kali`}
                            >
                              Handover
                            </span>
                          )}
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white truncate mt-0.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {task.title}
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate font-medium">
                          {task.project_name || 'Stand-alone'}
                        </div>
                      </td>

                      {/* Format / Type Badge */}
                      <td className="py-3.5 px-3">
                        <DesignTypeBadge type={task.task_type} size="sm" />
                      </td>

                      {/* Current Assignee */}
                      <td className="py-3.5 px-3">
                        {task.current_assignee_name ? (
                          <div className="flex items-center gap-2">
                            <img
                              src={task.current_assignee_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                              alt={task.current_assignee_name}
                              className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/20"
                            />
                            <div className="min-w-0">
                              <span className="font-bold text-slate-800 dark:text-slate-200 block truncate max-w-[120px]">
                                {task.current_assignee_name}
                              </span>
                              {task.original_assignee_name && task.original_assignee_name !== task.current_assignee_name && (
                                <span className="text-[9px] text-slate-400 dark:text-slate-500 block truncate font-medium">
                                  Awal: {task.original_assignee_name}
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 italic">Belum ditugaskan</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <StatusBadge status={task.status} size="sm" />
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-3">
                        <PriorityBadge priority={task.priority} />
                      </td>

                      {/* Deadline */}
                      <td className="py-3.5 px-3">
                        <DeadlineBadge deadline={task.deadline} status={task.status} />
                      </td>

                      {/* Version & Revision Count */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="inline-flex items-center gap-1.5 font-mono text-[11px]">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">
                            {latestVersion}
                          </span>
                          {revisionCount > 0 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-extrabold border border-rose-200 dark:border-rose-900 flex items-center gap-0.5">
                              <Flame className="w-2.5 h-2.5 text-rose-600 animate-pulse" />
                              R{revisionCount}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Progress */}
                      <td className="py-3.5 px-3 min-w-[100px]">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                            <span>{task.progress_percentage}%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                task.status === 'APPROVED' || task.status === 'COMPLETED'
                                  ? 'bg-emerald-500'
                                  : task.status === 'REVISION_REQUIRED'
                                  ? 'bg-rose-500'
                                  : 'bg-indigo-600'
                              }`}
                              style={{ width: `${task.progress_percentage}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => onSelectTask(task)}
                            className="px-3.5 py-1.5 rounded-xl text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-xs font-bold transition-all border border-indigo-200/60 dark:border-indigo-800 cursor-pointer shadow-2xs active:scale-95"
                          >
                            Detail
                          </button>
                          {canHandover && (
                            <button
                              onClick={() => onOpenHandover(task)}
                              className="p-1.5 rounded-xl text-slate-400 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors cursor-pointer"
                              title="Alihkan Tugas (Handover) ke desainer lain"
                            >
                              <Repeat className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

