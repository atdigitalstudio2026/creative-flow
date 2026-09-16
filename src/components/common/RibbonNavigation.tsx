import React from 'react';
import { ActiveTab } from './Sidebar';
import {
  LayoutDashboard,
  CheckSquare,
  Kanban,
  ListTodo,
  Calendar,
  Sparkles,
  Rocket,
  Flame,
  BarChart3,
  ChevronRight,
  Briefcase,
  Users,
  FileCode2,
  ShieldAlert,
  Settings,
  Lightbulb,
  Clock,
  Repeat
} from 'lucide-react';

interface RibbonNavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isCollapsed: boolean;
  myTasksCount: number;
  revisionCount: number;
  underReviewCount: number;
}

interface RibbonItemConfig {
  id: ActiveTab;
  number: string;
  title: string;
  description: string;
  badge?: number;
  badgeLabel?: string;
  // Color theme definitions matching the infographic reference
  colors: {
    numberText: string;
    pillBg: string;
    ribbonBg: string;
    foldBg: string;
    shadowGlow: string;
    borderAccent: string;
  };
  icon: React.ElementType;
}

export const RibbonNavigation: React.FC<RibbonNavigationProps> = ({
  activeTab,
  onTabChange,
  isCollapsed,
  myTasksCount,
  revisionCount,
  underReviewCount,
}) => {
  // 5 Main Ribbon Items mirroring the 5 infographic banners (Teal, Amber, Orange, Magenta, Purple)
  const ribbonItems: RibbonItemConfig[] = [
    {
      id: 'dashboard',
      number: '01',
      title: 'DASHBOARD UTAMA',
      description: 'Pusat kendali operasional & metrik kreatif',
      colors: {
        numberText: 'text-teal-600 dark:text-teal-400',
        pillBg: 'bg-white dark:bg-slate-900 border-teal-200 dark:border-teal-800/80',
        ribbonBg: 'from-teal-600 via-teal-500 to-teal-600',
        foldBg: 'bg-teal-900',
        shadowGlow: 'shadow-teal-500/25 dark:shadow-teal-500/15',
        borderAccent: 'border-teal-400/30'
      },
      icon: Lightbulb
    },
    {
      id: 'my-tasks',
      number: '02',
      title: 'PEKERJAAN SAYA',
      description: 'Daftar task desain aktif & prioritas Anda',
      badge: myTasksCount > 0 ? myTasksCount : undefined,
      badgeLabel: 'Tugas Aktif',
      colors: {
        numberText: 'text-amber-500 dark:text-amber-400',
        pillBg: 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-800/80',
        ribbonBg: 'from-amber-500 via-amber-400 to-amber-500',
        foldBg: 'bg-amber-800',
        shadowGlow: 'shadow-amber-500/25 dark:shadow-amber-500/15',
        borderAccent: 'border-amber-300/40'
      },
      icon: Clock
    },
    {
      id: 'kanban',
      number: '03',
      title: 'PIPELINE ALUR DESAIN',
      description: '5 Tahap produksi & jendela detail',
      colors: {
        numberText: 'text-orange-600 dark:text-orange-400',
        pillBg: 'bg-white dark:bg-slate-900 border-orange-200 dark:border-orange-800/80',
        ribbonBg: 'from-orange-600 via-orange-500 to-orange-600',
        foldBg: 'bg-orange-900',
        shadowGlow: 'shadow-orange-500/25 dark:shadow-orange-500/15',
        borderAccent: 'border-orange-400/30'
      },
      icon: Rocket
    },
    {
      id: 'all-tasks',
      number: '04',
      title: 'SEMUA TASK & REVISI',
      description: 'Monitoring approval & siklus iterasi aset',
      badge: revisionCount > 0 ? revisionCount : underReviewCount > 0 ? underReviewCount : undefined,
      badgeLabel: revisionCount > 0 ? 'Revisi' : 'Review',
      colors: {
        numberText: 'text-rose-600 dark:text-rose-400',
        pillBg: 'bg-white dark:bg-slate-900 border-rose-200 dark:border-rose-800/80',
        ribbonBg: 'from-rose-600 via-pink-600 to-rose-600',
        foldBg: 'bg-rose-950',
        shadowGlow: 'shadow-rose-500/25 dark:shadow-rose-500/15',
        borderAccent: 'border-rose-400/30'
      },
      icon: Repeat
    },
    {
      id: 'calendar',
      number: '05',
      title: 'KALENDER & TIMELINE',
      description: 'Jadwal deadline & distribusi proyek',
      colors: {
        numberText: 'text-purple-600 dark:text-purple-400',
        pillBg: 'bg-white dark:bg-slate-900 border-purple-200 dark:border-purple-800/80',
        ribbonBg: 'from-purple-600 via-violet-500 to-purple-600',
        foldBg: 'bg-purple-950',
        shadowGlow: 'shadow-purple-500/25 dark:shadow-purple-500/15',
        borderAccent: 'border-purple-400/30'
      },
      icon: BarChart3
    }
  ];

  // Secondary tools (Projects, Templates, Reports, Team, Settings)
  const secondaryItems = [
    { id: 'projects' as ActiveTab, label: 'Proyek & Kampanye', icon: Briefcase },
    { id: 'reports' as ActiveTab, label: 'Laporan & Efisiensi', icon: BarChart3 },
    { id: 'team' as ActiveTab, label: 'Tim & Hak Akses', icon: Users },
    { id: 'templates' as ActiveTab, label: 'Template Task', icon: FileCode2 },
    { id: 'audit-log' as ActiveTab, label: 'Audit Trail', icon: ShieldAlert },
    { id: 'settings' as ActiveTab, label: 'Pengaturan Database', icon: Settings }
  ];

  if (isCollapsed) {
    return (
      <div className="space-y-3 py-2">
        {/* Collapsed 5 Number Badges */}
        {ribbonItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <div key={item.id} className="relative group flex justify-center">
              <button
                onClick={() => onTabChange(item.id)}
                className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer shadow-md ${
                  isActive
                    ? `bg-gradient-to-br ${item.colors.ribbonBg} text-white ring-2 ring-offset-2 ring-indigo-500 scale-105`
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <span className={`text-xs font-black font-display ${isActive ? 'text-white' : item.colors.numberText}`}>
                  {item.number}
                </span>
                <Icon className={`w-3.5 h-3.5 mt-0.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              </button>

              {/* Tooltip */}
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-xl border border-slate-700">
                <div className="font-bold">{item.title}</div>
                <div className="text-[10px] text-slate-400">{item.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top 5-Color Strip directly inspired by the infographic header */}
      <div className="flex items-center justify-center gap-1.5 py-1 px-3">
        <div className="h-1.5 w-6 rounded-full bg-teal-500" title="Teal: Dashboard" />
        <div className="h-1.5 w-6 rounded-full bg-amber-400" title="Yellow: My Tasks" />
        <div className="h-1.5 w-6 rounded-full bg-orange-500" title="Orange: Kanban" />
        <div className="h-1.5 w-6 rounded-full bg-rose-500" title="Magenta: All Tasks & Revisi" />
        <div className="h-1.5 w-6 rounded-full bg-purple-600" title="Purple: Kalender & Laporan" />
      </div>

      {/* 5 Stacked 3D Ribbon Menu Banners */}
      <nav className="space-y-3.5" aria-label="Ribbon Navigation Bar">
        {ribbonItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <div
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative cursor-pointer transition-all duration-200 group select-none ${
                isActive ? 'scale-[1.02]' : 'hover:scale-[1.01]'
              }`}
            >
              {/* Outer Wrapper with soft ambient drop-shadow */}
              <div className="relative flex items-stretch">
                {/* 1. Left White/Slate Pill Container with 2-Digit Number */}
                <div
                  className={`relative z-10 w-14 sm:w-16 rounded-l-2xl sm:rounded-l-3xl p-2 flex flex-col items-center justify-center shadow-lg transition-all ${
                    item.colors.pillBg
                  } ${
                    isActive
                      ? 'ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-slate-900'
                      : 'border group-hover:border-slate-300 dark:group-hover:border-slate-600'
                  }`}
                  style={{ minHeight: '64px' }}
                >
                  <span
                    className={`text-xl sm:text-2xl font-black tracking-tight font-display ${item.colors.numberText}`}
                  >
                    {item.number}
                  </span>
                  {item.badge !== undefined && (
                    <span className="mt-0.5 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-extrabold animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* 2. Top-Left Fold Flap Corner (Underneath Shadow for 3D ribbon effect) */}
                <div
                  className={`absolute left-10 sm:left-12 -top-1.5 w-4 h-3.5 ${item.colors.foldBg} rounded-tl-sm z-0 transform -skew-x-12`}
                  aria-hidden="true"
                />

                {/* 3. Main Colored Folded Ribbon Body */}
                <div
                  className={`relative z-20 flex-1 ml-[-8px] sm:ml-[-10px] bg-gradient-to-r ${item.colors.ribbonBg} text-white rounded-r-2xl sm:rounded-r-3xl rounded-tl-2xl rounded-bl-3xl p-3 sm:py-2.5 sm:px-3.5 flex items-center justify-between shadow-md ${item.colors.shadowGlow} border-t border-white/30 border-b border-black/15 transition-all`}
                >
                  {/* Subtle top inner light highlight */}
                  <div className="absolute inset-x-2 top-0.5 h-[1px] bg-white/40 rounded-full pointer-events-none" />

                  {/* Left Content (Bullet + Title + Subtitle) */}
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      {/* White circular play / bullet icon */}
                      <span className="w-3.5 h-3.5 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0 text-[8px] font-bold">
                        ▶
                      </span>
                      <h3 className="text-xs font-black tracking-wider text-white uppercase font-display truncate">
                        {item.title}
                      </h3>
                    </div>

                    <p className="text-[10px] sm:text-[10.5px] text-white/90 font-medium mt-0.5 line-clamp-1">
                      {item.description}
                    </p>
                  </div>

                  {/* Right Line Icon matching infographic visual */}
                  <div className="shrink-0 pl-1">
                    <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-white/25 transition-all shadow-2xs">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Glow Indicator */}
              {isActive && (
                <div
                  className={`absolute -inset-0.5 rounded-3xl bg-gradient-to-r ${item.colors.ribbonBg} opacity-25 blur-sm -z-10`}
                />
              )}
            </div>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800">
        <div className="px-1 mb-2 flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-display">
          <span>Menu Tambahan</span>
          <span>SaaS Tools</span>
        </div>

        {/* Compact Grid for Secondary Tools */}
        <div className="grid grid-cols-2 gap-1.5">
          {secondaryItems.map((sec) => {
            const SecIcon = sec.icon;
            const isSecActive = activeTab === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => onTabChange(sec.id)}
                className={`px-2.5 py-2 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all text-left truncate cursor-pointer ${
                  isSecActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                    : 'bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/70'
                }`}
              >
                <SecIcon className={`w-3.5 h-3.5 shrink-0 ${isSecActive ? 'text-amber-300' : 'text-slate-400'}`} />
                <span className="truncate">{sec.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
