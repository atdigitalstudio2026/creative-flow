import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  CheckSquare,
  ListTodo,
  Kanban,
  Calendar,
  Briefcase,
  BarChart3,
  Users,
  FileCode2,
  ShieldAlert,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
  Flame,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  BookOpen
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'kanban'
  | 'my-tasks'
  | 'all-tasks'
  | 'calendar'
  | 'team';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenCreateTask: () => void;
  onOpenManual?: () => void;
  myTasksCount: number;
  underReviewCount: number;
  revisionCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onOpenCreateTask,
  onOpenManual,
  myTasksCount,
  underReviewCount,
  revisionCount,
}) => {
  const { currentRole, canCreateTask } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Core navigation items designed specifically for graphic design workflow
  const primaryNav = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      subtitle: 'Monitoring & Ringkasan Alur',
      icon: LayoutDashboard,
      roles: ['SUPER_ADMIN', 'MANAGER', 'DESIGNER', 'CONTENT_CREATOR', 'REQUESTER'],
    },
    {
      id: 'kanban' as ActiveTab,
      label: 'Pipeline Alur Desain',
      subtitle: 'Tahapan Produksi & Detail',
      icon: Layers,
      roles: ['SUPER_ADMIN', 'MANAGER', 'DESIGNER', 'CONTENT_CREATOR'],
    },
    {
      id: 'my-tasks' as ActiveTab,
      label: 'Pekerjaan Saya',
      subtitle: 'Tugas & Revisi Anda',
      icon: CheckSquare,
      badge: myTasksCount > 0 ? myTasksCount : undefined,
      badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300',
      roles: ['SUPER_ADMIN', 'MANAGER', 'DESIGNER', 'CONTENT_CREATOR', 'REQUESTER'],
    },
    {
      id: 'all-tasks' as ActiveTab,
      label: 'Daftar Pekerjaan & Revisi',
      subtitle: 'Status, Filter Format & File',
      icon: ListTodo,
      badge: revisionCount > 0 ? `${revisionCount} Rev` : undefined,
      badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 animate-pulse',
      roles: ['SUPER_ADMIN', 'MANAGER', 'DESIGNER', 'CONTENT_CREATOR', 'REQUESTER'],
    },
    {
      id: 'calendar' as ActiveTab,
      label: 'Kalender & Deadline',
      subtitle: 'Jadwal Tayang & Serah Terima',
      icon: Calendar,
      roles: ['SUPER_ADMIN', 'MANAGER', 'DESIGNER', 'CONTENT_CREATOR'],
    },
    {
      id: 'team' as ActiveTab,
      label: 'Tim & Hak Akses',
      subtitle: 'Kelola User, Role & RBAC',
      icon: Users,
      roles: ['SUPER_ADMIN', 'MANAGER', 'DESIGNER', 'CONTENT_CREATOR', 'REQUESTER'],
    },
  ];

  return (
    <aside
      className={`relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-lg shrink-0 flex flex-col justify-between min-h-[calc(100vh-6rem)] p-3 transition-all duration-250 ease-in-out select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 z-30 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-transform hover:scale-110 active:scale-95"
        title={isCollapsed ? 'Perluas Menu' : 'Ciutkan Menu'}
        aria-label="Toggle sidebar collapse"
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      <div className="space-y-4">
        {/* Primary Action Button */}
        {canCreateTask && (
          <div>
            {isCollapsed ? (
              <button
                onClick={onOpenCreateTask}
                className="w-12 h-12 mx-auto rounded-xl btn-3d-primary flex items-center justify-center transition-all cursor-pointer group relative"
                title="Buat Task Desain Baru"
              >
                <Plus className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-200" />
                <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md">
                  + Buat Pekerjaan Desain
                </div>
              </button>
            ) : (
              <button
                onClick={onOpenCreateTask}
                className="w-full py-2.5 px-3.5 rounded-xl btn-3d-primary font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer group"
              >
                <Plus className="w-4 h-4 text-indigo-200 group-hover:rotate-90 transition-transform duration-200" />
                <span>+ Buat Pekerjaan Desain</span>
              </button>
            )}
          </div>
        )}

        {/* Section: 5 Fitur Utama Alur Desain Grafis */}
        <div>
          {!isCollapsed && (
            <div className="px-3 pb-1.5 flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-display">
              <span>Alur Monitoring Desain</span>
            </div>
          )}

          <nav className="space-y-1">
            {primaryNav
              .filter((item) => item.roles.includes(currentRole))
              .map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <div key={item.id} className="relative group">
                    <button
                      onClick={() => onTabChange(item.id)}
                      className={`w-full flex items-center ${
                        isCollapsed ? 'justify-center px-0' : 'justify-between px-3'
                      } py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 ring-1 ring-white/20'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white hover:translate-x-0.5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                            isActive
                              ? 'text-white'
                              : 'text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                          }`}
                        />
                        {!isCollapsed && (
                          <div className="text-left truncate">
                            <span className="block truncate leading-snug">{item.label}</span>
                          </div>
                        )}
                      </div>

                      {!isCollapsed && item.badge && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            isActive
                              ? 'bg-white/25 text-white'
                              : item.badgeColor || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>

                    {/* Tooltip on collapsed */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg border border-slate-800">
                        <div className="font-bold">{item.label}</div>
                        <div className="text-[10px] text-slate-400">{item.subtitle}</div>
                      </div>
                    )}
                  </div>
                );
              })}
          </nav>
        </div>

        {/* Status Monitoring Box */}
        {!isCollapsed && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="px-3 flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-display">
              <span>Status Kritis Desain</span>
            </div>
            <div className="bg-slate-50/80 dark:bg-slate-850/60 p-3 rounded-xl border border-slate-200/70 dark:border-slate-800/80 space-y-2.5 shadow-inner">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  Butuh Revisi:
                </span>
                <span className={`font-extrabold text-xs px-2 py-0.5 rounded-full font-display ${
                  revisionCount > 0
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 animate-glow-pulse'
                    : 'bg-slate-200/60 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                }`}>
                  {revisionCount}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  Menunggu Review:
                </span>
                <span className={`font-extrabold text-xs px-2 py-0.5 rounded-full font-display ${
                  underReviewCount > 0
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
                    : 'bg-slate-200/60 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                }`}>
                  {underReviewCount}
                </span>
              </div>
            </div>
          </div>
        )}
        {/* Buku Panduan PDF Button */}
        {onOpenManual && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            {isCollapsed ? (
              <button
                onClick={onOpenManual}
                className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group relative"
                title="Buka Panduan Penggunaan & PDF"
              >
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md">
                  Buku Panduan / PDF
                </div>
              </button>
            ) : (
              <button
                onClick={onOpenManual}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <span>Buku Panduan PDF</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  PDF
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
        {!isCollapsed ? (
          <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
            <span>Monitoring Desain Grafis</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Aktif
            </span>
          </div>
        ) : (
          <div className="w-2 h-2 rounded-full bg-emerald-500 mx-auto animate-pulse" title="Monitoring Aktif" />
        )}
      </div>
    </aside>
  );
};
