import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Bell,
  Search,
  Sparkles,
  Database,
  CheckCheck,
  ChevronDown,
  Layers,
  ArrowRight,
  Sun,
  Moon,
  Command,
  BookOpen,
  Users
} from 'lucide-react';
import { formatDateIndo } from '../../utils/dateUtils';

interface NavbarProps {
  onOpenAi: () => void;
  onOpenSettings: () => void;
  onOpenManual?: () => void;
  onOpenTeam?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectTaskFromSearch?: (taskId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAi,
  onOpenSettings,
  onOpenManual,
  onOpenTeam,
  searchQuery,
  onSearchChange,
}) => {
  const { currentUser, currentRole, allUsers, switchUser, isCloudConnected } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { theme, toggleTheme } = useTheme();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-300 dark:border-purple-800';
      case 'MANAGER':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'DESIGNER':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800';
      case 'CONTENT_CREATOR':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border-teal-300 dark:border-teal-800';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/80 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/30 dark:ring-white/10 transform hover:scale-105 transition-transform">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 dark:text-white tracking-tight text-base font-display flex items-center gap-1">
                  CREATIVE <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">FLOW</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 backdrop-blur-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Workspace 3D
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden md:block font-medium">
                Graphic Design Operations & Monitoring Hub
              </p>
            </div>
          </div>

          {/* Global Search */}
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative group">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-indigo-500" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari Task ID, judul, desainer, atau project..."
                className="w-full pl-9 pr-14 py-2 text-xs rounded-xl bg-slate-100/80 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-800 dark:text-slate-100 shadow-inner"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchQuery ? (
                  <button
                    onClick={() => onSearchChange('')}
                    className="p-1 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded"
                    title="Hapus pencarian"
                  >
                    ✕
                  </button>
                ) : (
                  <kbd className="hidden lg:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-xs">
                    <Command className="w-2.5 h-2.5" /> K
                  </kbd>
                )}
              </div>
            </div>
          </div>

          {/* Action Items */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 transition-all cursor-pointer transform active:scale-95 shadow-xs"
              title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 scale-100" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 transition-transform rotate-0 scale-100" />
              )}
            </button>

            {/* Panduan Manual PDF Button */}
            {onOpenManual && (
              <button
                onClick={onOpenManual}
                className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 bg-white/70 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-all shadow-xs cursor-pointer active:scale-95"
                title="Buka Buku Panduan Aplikasi & Download PDF SOP Lengkap"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="hidden lg:inline">Panduan PDF</span>
              </button>
            )}

            {/* AI Assistant Button */}
            <button
              onClick={onOpenAi}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-600 hover:opacity-95 transition-all shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 cursor-pointer transform active:scale-95"
              title="Buka AI Assistant untuk Generate Brief, Task Summary & Checklist"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden md:inline">AI Studio</span>
            </button>

            {/* Cloud / Database Status Button */}
            <button
              onClick={onOpenSettings}
              className="inline-flex items-center gap-2 px-2.5 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 bg-white/70 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-all shadow-xs"
              title="Database & Storage Settings / SQL Migration Export"
            >
              <span className={`w-2 h-2 rounded-full ${isCloudConnected ? 'bg-emerald-500 shadow-xs shadow-emerald-500/50' : 'bg-amber-500'}`} />
              <Database className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              <span className="hidden xl:inline">
                {isCloudConnected ? 'Live DB' : 'Demo DB'}
              </span>
            </button>

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-800 transition-all cursor-pointer shadow-xs"
                title="Pusat Notifikasi"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-page-enter">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-display">
                        Notifikasi Terkini
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {unreadCount} belum dibaca
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        Tandai dibaca
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-xs">
                        Tidak ada notifikasi baru
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markAsRead(n.id)}
                          className={`p-3.5 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer flex gap-3 ${
                            !n.is_read
                              ? 'bg-indigo-50/40 dark:bg-indigo-950/30 font-medium'
                              : ''
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                              !n.is_read ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-transparent'
                            }`}
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                              {n.title}
                            </p>
                            <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed text-[11px]">
                              {n.message}
                            </p>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                              {formatDateIndo(n.created_at)}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick User & Role Switcher */}
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
                title="Ganti User / Role untuk Preview Akses"
              >
                <img
                  src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={currentUser.full_name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
                />
                <div className="text-left hidden md:block leading-none pr-1">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white block truncate max-w-[110px]">
                    {currentUser.full_name}
                  </span>
                  <span className={`inline-block text-[9px] font-semibold px-1.5 py-0.2 rounded-sm border mt-0.5 ${getRoleBadge(currentRole)}`}>
                    {currentRole}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Switcher Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-page-enter">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-wider font-display">
                      Role-Based Access Switcher
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Pilih profil untuk menguji batasan hak akses:
                    </p>
                  </div>

                  <div className="p-1 max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {allUsers.map((user) => {
                      const isSelected = user.id === currentUser.id;
                      return (
                        <button
                          key={user.id}
                          onClick={() => {
                            switchUser(user);
                            setShowUserMenu(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl flex items-center gap-3 transition-colors ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          <img
                            src={user.avatar_url}
                            alt={user.full_name}
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate">{user.full_name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded-sm font-mono ${
                                  isSelected
                                    ? 'bg-white/20 text-white'
                                    : getRoleBadge(user.role)
                                }`}
                              >
                                {user.role}
                              </span>
                              <span
                                className={`text-[10px] truncate ${
                                  isSelected ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'
                                }`}
                              >
                                {user.position}
                              </span>
                            </div>
                          </div>
                          {isSelected && <ArrowRight className="w-3.5 h-3.5 text-amber-300 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {onOpenTeam && (
                    <div className="p-2 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onOpenTeam();
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-indigo-200/80 dark:border-indigo-800 shadow-2xs"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Kelola Personil & Hak Akses (RBAC)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
