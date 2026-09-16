import React, { useState } from 'react';
import { UserProfile, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Shield,
  Check,
  Lock,
  ShieldAlert,
  UserPlus,
  Edit2,
  Trash2,
  LogIn,
  X,
  Search,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Info,
  Layers,
  Crown,
  Briefcase,
  Palette,
  Film,
  Send,
  UserCheck
} from 'lucide-react';

const PRESET_AVATARS = [
  { label: 'Wanita 1 (Desainer)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
  { label: 'Pria 1 (Manager)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
  { label: 'Pria 2 (Admin)', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80' },
  { label: 'Wanita 2 (Kreator)', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80' },
  { label: 'Pria 3 (Art Director)', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80' },
  { label: 'Wanita 3 (Illustrator)', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80' }
];

export const TeamAccessView: React.FC = () => {
  const {
    allUsers,
    currentUser,
    switchUser,
    updateUserProfile,
    addUserProfile,
    deleteUserProfile,
    canManageUsers
  } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState<'users' | 'matrix'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('ALL');

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Form State for Add / Edit
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('DESIGNER');
  const [position, setPosition] = useState('Graphic Designer');
  const [departmentName, setDepartmentName] = useState('Creative & Graphic Design');
  const [avatarUrl, setAvatarUrl] = useState(PRESET_AVATARS[0].url);

  // Filtered Users List
  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'ALL' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const showFeedback = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => {
      setActionNotice(null);
    }, 4000);
  };

  const handleOpenAddModal = () => {
    setFullName('');
    setEmail('');
    setRole('DESIGNER');
    setPosition('Graphic Designer');
    setDepartmentName('Creative & Graphic Design');
    setAvatarUrl(PRESET_AVATARS[0].url);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (user: UserProfile) => {
    setEditingUser(user);
    setFullName(user.full_name);
    setEmail(user.email);
    setRole(user.role);
    setPosition(user.position);
    setDepartmentName(user.department_name);
    setAvatarUrl(user.avatar_url || PRESET_AVATARS[0].url);
  };

  const handleSaveAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    addUserProfile({
      full_name: fullName.trim(),
      email: email.trim(),
      role,
      position: position.trim() || 'Creative Specialist',
      department_name: departmentName.trim() || 'Creative & Design',
      avatar_url: avatarUrl
    });

    setShowAddModal(false);
    showFeedback(`Pengguna "${fullName}" berhasil ditambahkan sebagai ${role}.`);
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !fullName.trim() || !email.trim()) return;

    updateUserProfile(editingUser.id, {
      full_name: fullName.trim(),
      email: email.trim(),
      role,
      position: position.trim(),
      department_name: departmentName.trim(),
      avatar_url: avatarUrl
    });

    setEditingUser(null);
    showFeedback(`Data dan hak akses pengguna "${fullName}" berhasil diperbarui.`);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    if (userToDelete.id === currentUser.id) {
      showFeedback('Gagal: Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif!');
      setUserToDelete(null);
      return;
    }

    const success = deleteUserProfile(userToDelete.id);
    if (success) {
      showFeedback(`Pengguna "${userToDelete.full_name}" telah dihapus dari tim.`);
    } else {
      showFeedback('Gagal menghapus pengguna.');
    }
    setUserToDelete(null);
  };

  const handleRoleQuickChange = (userId: string, newRole: UserRole) => {
    updateUserProfile(userId, { role: newRole });
    const target = allUsers.find(u => u.id === userId);
    showFeedback(`Hak akses "${target?.full_name || 'Pengguna'}" diubah menjadi ${newRole}.`);
  };

  const getRoleBadgeStyle = (userRole: UserRole) => {
    switch (userRole) {
      case 'SUPER_ADMIN':
        return 'bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'MANAGER':
        return 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'DESIGNER':
        return 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case 'CONTENT_CREATOR':
        return 'bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800';
      case 'REQUESTER':
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const getRoleIcon = (userRole: UserRole) => {
    switch (userRole) {
      case 'SUPER_ADMIN':
        return <Crown className="w-3 h-3 text-purple-500" />;
      case 'MANAGER':
        return <Briefcase className="w-3 h-3 text-amber-500" />;
      case 'DESIGNER':
        return <Palette className="w-3 h-3 text-indigo-500" />;
      case 'CONTENT_CREATOR':
        return <Film className="w-3 h-3 text-teal-500" />;
      case 'REQUESTER':
        return <Send className="w-3 h-3 text-slate-500" />;
    }
  };

  // Counts for summary
  const superAdminsCount = allUsers.filter(u => u.role === 'SUPER_ADMIN').length;
  const managersCount = allUsers.filter(u => u.role === 'MANAGER').length;
  const designersCount = allUsers.filter(u => u.role === 'DESIGNER' || u.role === 'CONTENT_CREATOR').length;

  return (
    <div className="space-y-5 animate-page-enter">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-glow-pulse" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display">
              Manajemen Tim & Hak Akses (RBAC)
            </h2>
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shadow-2xs">
              {allUsers.length} Anggota
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pengaturan peran pengguna, izin wewenang (Role-Based Access Control), tambah/edit anggota, dan simulasi login
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {canManageUsers && (
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl btn-3d-primary text-white shadow-md cursor-pointer active:scale-95 transition-all"
            >
              <UserPlus className="w-4 h-4 text-amber-300" />
              <span>+ Tambah Anggota Tim</span>
            </button>
          )}
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-2xs animate-page-enter">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-lg text-emerald-600 dark:text-emerald-400 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3D Metric Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 perspective-workspace">
        <div className="card-3d p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/75 dark:bg-slate-850/75 shadow-xs">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Anggota</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-display mt-0.5">{allUsers.length}</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Terdaftar di workspace</div>
        </div>

        <div className="card-3d p-3.5 rounded-2xl border border-purple-500/30 dark:border-purple-800/50 bg-purple-50/50 dark:bg-purple-950/30 shadow-xs">
          <div className="text-[10px] font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Super Admin</div>
          <div className="text-2xl font-extrabold text-purple-900 dark:text-purple-200 font-display mt-0.5">{superAdminsCount}</div>
          <div className="text-[10px] text-purple-600/80 dark:text-purple-400/80 mt-1">Hak wewenang penuh</div>
        </div>

        <div className="card-3d p-3.5 rounded-2xl border border-amber-500/30 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-950/30 shadow-xs">
          <div className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Manager Tim</div>
          <div className="text-2xl font-extrabold text-amber-900 dark:text-amber-200 font-display mt-0.5">{managersCount}</div>
          <div className="text-[10px] text-amber-600/80 dark:text-amber-400/80 mt-1">Approval & supervisi alur</div>
        </div>

        <div className="card-3d p-3.5 rounded-2xl border border-indigo-500/30 dark:border-indigo-800/50 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-xs">
          <div className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Desainer & Kreator</div>
          <div className="text-2xl font-extrabold text-indigo-900 dark:text-indigo-200 font-display mt-0.5">{designersCount}</div>
          <div className="text-[10px] text-indigo-600/80 dark:text-indigo-400/80 mt-1">Eksekutor & job mandiri</div>
        </div>
      </div>

      {/* Sub Tabs: Daftar Pengguna vs Matriks Wewenang RBAC */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`pb-3 px-4 text-xs sm:text-sm font-extrabold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'users'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Daftar Anggota & Aksi Akun ({filteredUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('matrix')}
          className={`pb-3 px-4 text-xs sm:text-sm font-extrabold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'matrix'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Matriks Hak Akses & Kebijakan RLS</span>
        </button>
      </div>

      {activeSubTab === 'users' ? (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, email, atau jabatan..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">Filter Peran:</span>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="py-1.5 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200 cursor-pointer shadow-2xs"
              >
                <option value="ALL">Semua Peran ({allUsers.length})</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                <option value="MANAGER">MANAGER</option>
                <option value="DESIGNER">DESIGNER</option>
                <option value="CONTENT_CREATOR">CONTENT_CREATOR</option>
                <option value="REQUESTER">REQUESTER</option>
              </select>
            </div>
          </div>

          {/* User List Card */}
          <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.length === 0 ? (
                <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs italic">
                  Tidak ada anggota tim yang cocok dengan kriteria pencarian.
                </div>
              ) : (
                filteredUsers.map((user) => {
                  const isCurrentActive = user.id === currentUser.id;

                  return (
                    <div
                      key={user.id}
                      className={`p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors ${
                        isCurrentActive
                          ? 'bg-indigo-50/30 dark:bg-indigo-950/20 border-l-4 border-l-indigo-600'
                          : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      {/* User Avatar & Info */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative shrink-0">
                          <img
                            src={user.avatar_url || PRESET_AVATARS[0].url}
                            alt={user.full_name}
                            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-xs"
                          />
                          <span
                            className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-2xs"
                            title="Akun Aktif"
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-slate-900 dark:text-white text-sm font-display truncate">
                              {user.full_name}
                            </span>

                            <span
                              className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border shadow-2xs inline-flex items-center gap-1 ${getRoleBadgeStyle(
                                user.role
                              )}`}
                            >
                              {getRoleIcon(user.role)}
                              {user.role}
                            </span>

                            {isCurrentActive && (
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-600 text-white shadow-2xs flex items-center gap-1">
                                <UserCheck className="w-2.5 h-2.5" />
                                Sedang Login
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate font-medium">
                            <span className="text-slate-700 dark:text-slate-300 font-semibold">{user.position}</span> &bull; {user.department_name}
                          </p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      {/* Controls & Actions */}
                      <div className="flex items-center gap-2 self-end lg:self-center flex-wrap shrink-0">
                        {/* Simulate Login / Switch User */}
                        <button
                          onClick={() => switchUser(user)}
                          disabled={isCurrentActive}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer ${
                            isCurrentActive
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 active:scale-95'
                          }`}
                          title={`Masuk sebagai ${user.full_name} untuk menguji antarmuka`}
                        >
                          <LogIn className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{isCurrentActive ? 'Akun Aktif' : 'Simulasikan Login'}</span>
                        </button>

                        {/* Quick Role Dropdown for Admin & Manager */}
                        {canManageUsers && (
                          <div className="flex items-center gap-1.5">
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleQuickChange(user.id, e.target.value as UserRole)}
                              className="py-1.5 px-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200 cursor-pointer shadow-2xs"
                              title="Ubah hak akses wewenang pengguna"
                            >
                              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                              <option value="MANAGER">MANAGER</option>
                              <option value="DESIGNER">DESIGNER</option>
                              <option value="CONTENT_CREATOR">CONTENT_CREATOR</option>
                              <option value="REQUESTER">REQUESTER</option>
                            </select>

                            <button
                              onClick={() => handleOpenEditModal(user)}
                              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer shadow-2xs active:scale-95"
                              title="Edit Informasi Lengkap Pengguna"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setUserToDelete(user)}
                              disabled={isCurrentActive}
                              className={`p-2 rounded-xl border transition-colors shadow-2xs ${
                                isCurrentActive
                                  ? 'text-slate-300 dark:text-slate-600 border-slate-100 dark:border-slate-800 cursor-not-allowed'
                                  : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 border-slate-200 dark:border-slate-700 cursor-pointer active:scale-95'
                              }`}
                              title={isCurrentActive ? 'Tidak bisa menghapus akun sendiri' : 'Hapus pengguna dari tim'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      ) : (
        /* RBAC & Row Level Security Matrix */
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 rounded-3xl space-y-4 shadow-xl border border-indigo-900/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white font-display">
                  Prinsip Role-Based Access Control (RBAC) & Row Level Security (RLS)
                </h3>
                <p className="text-xs text-slate-300">
                  Arsitektur keamanan data berbasis peran di mana setiap aksi dibatasi sesuai wewenang tugasnya
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Di sistem ini, <strong>Administrator (SUPER_ADMIN)</strong> dan <strong>Manager (MANAGER)</strong> memiliki wewenang penuh untuk mengatur akun pengguna, menambahkan anggota tim baru, mengubah peran hak akses, serta menghapus akun yang tidak lagi bertugas. Desainer grafis memiliki hak mandiri untuk mencatat pekerjaan sendiri, mengunggah revisi, dan menandai penyelesaian.
            </p>

            {/* Matrix Table */}
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs text-slate-300 border border-slate-800 rounded-2xl overflow-hidden">
                <thead className="text-[10px] uppercase tracking-wider text-slate-400 bg-slate-950/80 border-b border-slate-800 font-display">
                  <tr>
                    <th className="py-3 px-3.5">Peran / Role</th>
                    <th className="py-3 px-3">Input Job Mandiri</th>
                    <th className="py-3 px-3">Assign & Delegasi</th>
                    <th className="py-3 px-3">Upload File / Versi</th>
                    <th className="py-3 px-3">Review & Approval</th>
                    <th className="py-3 px-3">Handover Desain</th>
                    <th className="py-3 px-3">Kelola User & Role</th>
                    <th className="py-3 px-3">Akses Audit Trail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-[11px] font-medium bg-slate-900/50">
                  <tr>
                    <td className="py-3 px-3.5 font-bold text-purple-300 font-display">
                      <div className="flex items-center gap-1.5">
                        <Crown className="w-3.5 h-3.5 text-purple-400" />
                        SUPER_ADMIN
                      </div>
                    </td>
                    <td className="py-3 px-3 text-emerald-400">&#10003; Ya</td>
                    <td className="py-3 px-3 text-emerald-400">&#10003; Ya</td>
                    <td className="py-3 px-3 text-emerald-400">&#10003; Ya</td>
                    <td className="py-3 px-3 text-emerald-400">&#10003; Ya</td>
                    <td className="py-3 px-3 text-emerald-400">&#10003; Ya</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">&#10003; Full CRUD</td>
                    <td className="py-3 px-3 text-emerald-400">&#10003; Ya</td>
                  </tr>

                  <tr>
                    <td className="py-3 px-3.5 font-bold text-amber-300 font-display">
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                        MANAGER
                      </div>
                    </td>
                    <td className="py-3 px-3 text-emerald-400">&#10003; Ya</td>
                    <td className="py-3 px-3 text-emerald-400">&#10003; Ya</td>
                    <td className="py-3 px-3 text-emerald-400">&#10003; Ya</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">&#10003; Approval Wewenang</td>
                    <td className="py-3 px-3 text-emerald-400">&#10003; Ya</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">&#10003; Full CRUD</td>
                    <td className="py-3 px-3 text-emerald-400">&#10003; Ya</td>
                  </tr>

                  <tr>
                    <td className="py-3 px-3.5 font-bold text-indigo-300 font-display">
                      <div className="flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-indigo-400" />
                        DESIGNER
                      </div>
                    </td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">&#10003; Ya (Job Mandiri)</td>
                    <td className="py-3 px-3 text-indigo-300">&#10003; Self / Assign</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">&#10003; Ya (Upload V1, V2...)</td>
                    <td className="py-3 px-3 text-slate-500">&#10005; Tinjau Revisi Saja</td>
                    <td className="py-3 px-3 text-slate-500">&#10005; Wewenang Manager</td>
                    <td className="py-3 px-3 text-slate-500">&#10005; Terkunci</td>
                    <td className="py-3 px-3 text-slate-500">&#10005; Terkunci</td>
                  </tr>

                  <tr>
                    <td className="py-3 px-3.5 font-bold text-teal-300 font-display">
                      <div className="flex items-center gap-1.5">
                        <Film className="w-3.5 h-3.5 text-teal-400" />
                        CONTENT_CREATOR
                      </div>
                    </td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">&#10003; Ya (Job Mandiri)</td>
                    <td className="py-3 px-3 text-teal-300">&#10003; Self / Assign</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">&#10003; Ya</td>
                    <td className="py-3 px-3 text-slate-500">&#10005; Tinjau Revisi Saja</td>
                    <td className="py-3 px-3 text-slate-500">&#10005; Wewenang Manager</td>
                    <td className="py-3 px-3 text-slate-500">&#10005; Terkunci</td>
                    <td className="py-3 px-3 text-slate-500">&#10005; Terkunci</td>
                  </tr>

                  <tr>
                    <td className="py-3 px-3.5 font-bold text-slate-300 font-display">
                      <div className="flex items-center gap-1.5">
                        <Send className="w-3.5 h-3.5 text-slate-400" />
                        REQUESTER
                      </div>
                    </td>
                    <td className="py-3 px-3 text-emerald-400">&#10003; Request Form</td>
                    <td className="py-3 px-3 text-slate-500">&#10005; Ditentukan Manager</td>
                    <td className="py-3 px-3 text-slate-500">&#10005; Hanya Desainer</td>
                    <td className="py-3 px-3 text-slate-500">&#10005; Wewenang Manager</td>
                    <td className="py-3 px-3 text-slate-500">&#10005; Wewenang Manager</td>
                    <td className="py-3 px-3 text-slate-500">&#10005; Terkunci</td>
                    <td className="py-3 px-3 text-slate-500">&#10005; Terkunci</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Tambah Anggota Tim Baru */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
          <div className="modal-3d bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden animate-page-enter">
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-900/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base font-display">Tambah Pengguna Baru</h3>
                  <p className="text-xs text-slate-300">Masukkan profil dan tentukan peran hak akses</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAddUser} className="p-5 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Rian Pratama"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Kantor / Akun <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Contoh: rian.pratama@creativestudio.id"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Peran / Hak Akses (Role)
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold cursor-pointer"
                  >
                    <option value="SUPER_ADMIN">SUPER_ADMIN (Wewenang Penuh)</option>
                    <option value="MANAGER">MANAGER (Supervisi & Approval)</option>
                    <option value="DESIGNER">DESIGNER (Eksekusi & Job Mandiri)</option>
                    <option value="CONTENT_CREATOR">CONTENT_CREATOR (Kreator Konten)</option>
                    <option value="REQUESTER">REQUESTER (Pemohon Desain)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Jabatan / Posisi
                  </label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="Contoh: Senior Graphic Designer"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Departemen / Divisi
                </label>
                <input
                  type="text"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  placeholder="Contoh: Creative & Graphic Design"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
                />
              </div>

              {/* Preset Avatar Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Pilih Foto Avatar
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {PRESET_AVATARS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarUrl(p.url)}
                      className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                        avatarUrl === p.url
                          ? 'border-indigo-600 ring-2 ring-indigo-500/40 scale-105 shadow-md'
                          : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-2 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl btn-3d-primary text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  <UserPlus className="w-4 h-4 text-amber-300" />
                  <span>Simpan & Tambah Pengguna</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Data Pengguna */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
          <div className="modal-3d bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden animate-page-enter">
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-900/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base font-display">Edit Profil & Peran Pengguna</h3>
                  <p className="text-xs text-slate-300">{editingUser.full_name} ({editingUser.role})</p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="p-5 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Kantor / Akun <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Peran / Hak Akses (Role)
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold cursor-pointer"
                  >
                    <option value="SUPER_ADMIN">SUPER_ADMIN (Wewenang Penuh)</option>
                    <option value="MANAGER">MANAGER (Supervisi & Approval)</option>
                    <option value="DESIGNER">DESIGNER (Eksekusi & Job Mandiri)</option>
                    <option value="CONTENT_CREATOR">CONTENT_CREATOR (Kreator Konten)</option>
                    <option value="REQUESTER">REQUESTER (Pemohon Desain)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Jabatan / Posisi
                  </label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Departemen / Divisi
                </label>
                <input
                  type="text"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
                />
              </div>

              {/* Preset Avatar Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Ganti Foto Avatar
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {PRESET_AVATARS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarUrl(p.url)}
                      className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                        avatarUrl === p.url
                          ? 'border-indigo-600 ring-2 ring-indigo-500/40 scale-105 shadow-md'
                          : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="py-2 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl btn-3d-primary text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dialog Konfirmasi Hapus Pengguna */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-3 sm:p-4">
          <div className="modal-3d bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-rose-200 dark:border-rose-900/60 p-5 sm:p-6 space-y-4 animate-page-enter">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-display">
                Konfirmasi Hapus Pengguna
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Apakah Anda yakin ingin menghapus <strong>{userToDelete.full_name}</strong> ({userToDelete.role}) dari daftar tim?
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>Tugas yang sudah selesai atau sedang berjalan yang diasosiasikan dengan pengguna ini akan tetap tersimpan di riwayat.</span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="py-2 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md cursor-pointer active:scale-95 transition-all"
              >
                Ya, Hapus Pengguna
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
