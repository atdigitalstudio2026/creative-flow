import React from 'react';
import { Task, UserProfile } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  RotateCcw,
  TrendingUp,
  AlertTriangle,
  Award,
  Users
} from 'lucide-react';

interface ReportsViewProps {
  tasks: Task[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ tasks }) => {
  const { allUsers } = useAuth();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'APPROVED' || t.status === 'COMPLETED').length;
  const tasksWithRevisions = tasks.filter((t) => t.revisions.length > 0).length;
  const totalRevisions = tasks.reduce((sum, t) => sum + t.revisions.length, 0);

  const revisionRate = totalTasks > 0 ? Math.round((tasksWithRevisions / totalTasks) * 100) : 0;
  const avgRevisionsPerTask = totalTasks > 0 ? (totalRevisions / totalTasks).toFixed(1) : '0';

  const designers = allUsers.filter((u) => ['DESIGNER', 'CONTENT_CREATOR'].includes(u.role));

  const designerStats = designers.map((d) => {
    const designerTasks = tasks.filter(
      (t) => t.current_assignee_id === d.id || t.original_assignee_id === d.id
    );
    const approved = designerTasks.filter(
      (t) => t.status === 'APPROVED' || t.status === 'COMPLETED'
    ).length;
    const revs = designerTasks.reduce((acc, t) => acc + t.revisions.length, 0);
    const handoversReceived = tasks.filter(
      (t) => t.handovers.some((h) => h.new_assignee_id === d.id)
    ).length;

    return {
      user: d,
      totalAssigned: designerTasks.length,
      approved,
      revisions: revs,
      handoversReceived
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-neutral-200">
        <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
          Laporan Kinerja & Analisis Alur Kerja
        </h2>
        <p className="text-xs text-neutral-500">
          Metrik efisiensi pengerjaan, tingkat revisi, dan produktivitas tim kreatif
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-medium">Tingkat Penyelesaian</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 mt-2">
            {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            {completedTasks} dari {totalTasks} task selesai
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-medium">Tingkat Revisi</span>
            <RotateCcw className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 mt-2">
            {revisionRate}%
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            {tasksWithRevisions} task membutuhkan revisi
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-medium">Rata-rata Putaran Revisi</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 mt-2">
            {avgRevisionsPerTask}x
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Per task yang diajukan</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-purple-600">
            <span className="text-xs font-medium">Total Handover</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-purple-700 mt-2">
            {tasks.reduce((sum, t) => sum + t.handovers.length, 0)}x
          </div>
          <div className="text-[11px] text-purple-600 font-medium mt-1">Perpindahan terlacak</div>
        </div>
      </div>

      {/* Designer Productivity Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-neutral-900 text-sm">
              Produktivitas Desainer & Content Creator
            </h3>
            <p className="text-xs text-neutral-500">
              Perbandingan output pengerjaan, tingkat approval, dan jumlah revisi per anggota tim
            </p>
          </div>
          <Award className="w-5 h-5 text-amber-500" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 uppercase font-semibold text-[10px] border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Nama Desainer</th>
                <th className="py-3 px-3">Posisi</th>
                <th className="py-3 px-3 text-center">Total Ditugaskan</th>
                <th className="py-3 px-3 text-center">Task Approved</th>
                <th className="py-3 px-3 text-center">Putaran Revisi</th>
                <th className="py-3 px-3 text-center">Menerima Handover</th>
                <th className="py-3 px-4 text-right">Efisiensi Approval</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {designerStats.map((stat) => {
                const efficiency = stat.totalAssigned > 0
                  ? Math.round((stat.approved / stat.totalAssigned) * 100)
                  : 0;

                return (
                  <tr key={stat.user.id} className="hover:bg-neutral-50">
                    <td className="py-3 px-4 font-bold text-neutral-900 flex items-center gap-2.5">
                      <img
                        src={stat.user.avatar_url}
                        alt={stat.user.full_name}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-neutral-200"
                      />
                      <span>{stat.user.full_name}</span>
                    </td>
                    <td className="py-3 px-3 text-neutral-600">{stat.user.position}</td>
                    <td className="py-3 px-3 text-center font-bold">{stat.totalAssigned}</td>
                    <td className="py-3 px-3 text-center font-bold text-emerald-700">{stat.approved}</td>
                    <td className="py-3 px-3 text-center font-bold text-rose-700">{stat.revisions}</td>
                    <td className="py-3 px-3 text-center font-mono">{stat.handoversReceived}x</td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-bold text-neutral-900">{efficiency}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
