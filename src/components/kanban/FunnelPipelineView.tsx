import React, { useState } from 'react';
import { Task, TaskStatus, TaskPriority } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { StageDetailModal, FunnelStageData } from './StageDetailModal';
import {
  Megaphone,
  Palette,
  Eye,
  RefreshCw,
  Award,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Flame,
  Clock,
  CheckCircle2,
  Plus,
  Layers,
  Search,
  Filter,
  User,
  Check,
  Send,
  SlidersHorizontal,
  ChevronRight,
  MousePointerClick,
  RotateCcw,
  MoveDown,
  FileCheck
} from 'lucide-react';

interface FunnelPipelineViewProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
  onOpenCreateTask: () => void;
  onOpenHandover: (task: Task) => void;
  selectedStage?: FunnelStageData | null;
  onSelectStage?: (stage: FunnelStageData | null) => void;
}

// 5 Core Funnel Stages matching the user's uploaded diagram adapted to Graphic Design & Creative Studio Workflow
export const FUNNEL_STAGES: FunnelStageData[] = [
  {
    id: 'stage-brief',
    stepNumber: '01',
    title: 'BRIEF & PERMINTAAN',
    subtitle: 'Permintaan Desain Baru & Penugasan',
    tagline: 'Kebutuhan baru masuk. Brief naratif, referensi, & penunjukan desainer.',
    purposeLabel: 'VALIDASI BRIEF & ASSET',
    purposeDesc: 'Membantu pemohon menyusun brief yang jelas, aset referensi lengkap, serta menentukan desainer yang paling tepat.',
    contentIdeas: [
      'Brief naratif & copywriting',
      'Referensi visual / Moodboard',
      'Asset logo vector & brand guide',
      'Format ukuran (Feed/Story/Banner)',
      'Tenggat waktu penayangan'
    ],
    goalLabel: 'Brief Tervalidasi',
    goalDesc: 'Brief jelas tanpa asumsi & desainer siap mengeksekusi visual.',
    statuses: ['REQUESTED', 'ASSIGNED'],
    defaultStatus: 'REQUESTED',
    coneGradient: 'from-purple-700 via-purple-600 to-indigo-800',
    coneWidth: 'w-full max-w-[320px]',
    accentBg: 'bg-purple-50/70 dark:bg-purple-950/30',
    accentText: 'text-purple-700 dark:text-purple-300',
    accentBorder: 'border-purple-200/80 dark:border-purple-800/80',
    nextStatus: 'IN_PROGRESS',
    nextLabel: 'Mulai Desain',
    sopGuidelines: {
      title: 'SOP Tahap 01 - Briefing & Spesifikasi Awal',
      items: [
        'Pastikan rasio kanvas (1:1 untuk feed, 9:16 untuk story/reels, atau custom banner) telah disepakati.',
        'Periksa apakah aset logo vector (.SVG / .AI) dan color palette primer telah tersedia.',
        'Tentukan target audience serta pesan utama (key visual message) sebelum membuka kanvas desain.'
      ]
    }
  },
  {
    id: 'stage-production',
    stepNumber: '02',
    title: 'PRODUKSI VISUAL',
    subtitle: 'Proses Pengerjaan Layout & Grafis',
    tagline: 'Desainer mengeksplorasi konsep, tipografi, dan komposisi visual resolusi tinggi.',
    purposeLabel: 'EKSPLORASI & EKSEKUSI',
    purposeDesc: 'Mewujudkan brief menjadi karya desain estetis, proporsional, dan memiliki keterbacaan tinggi di semua media.',
    contentIdeas: [
      'Eksplorasi layout & grid system',
      'Hierarki tipografi & headline',
      'Manipulasi foto & vector artwork',
      'Palet warna brand & kontras',
      'File kerja master (PSD / AI / FIG)'
    ],
    goalLabel: 'Draf Pertama Siap',
    goalDesc: 'Draf visual resolusi tinggi selesai dan siap dikirim ke tahap review.',
    statuses: ['IN_PROGRESS'],
    defaultStatus: 'IN_PROGRESS',
    coneGradient: 'from-sky-600 via-blue-600 to-indigo-700',
    coneWidth: 'w-full max-w-[295px]',
    accentBg: 'bg-blue-50/70 dark:bg-blue-950/30',
    accentText: 'text-blue-700 dark:text-blue-300',
    accentBorder: 'border-blue-200/80 dark:border-blue-800/80',
    nextStatus: 'UNDER_REVIEW',
    nextLabel: 'Kirim Review (Draf V1)',
    sopGuidelines: {
      title: 'SOP Tahap 02 - Standar Pengerjaan Desain',
      items: [
        'Gunakan Color Mode RGB untuk materi digital/layar dan CMYK untuk materi cetak.',
        'Atur resolusi minimal 72-150 PPI untuk layar dan 300 DPI untuk media cetak/merchandise.',
        'Simpan file proyek terstruktur dalam folder master dan gunakan penamaan layer yang rapi.'
      ]
    }
  },
  {
    id: 'stage-review',
    stepNumber: '03',
    title: 'QUALITY REVIEW',
    subtitle: 'Pemeriksaan Hasil & Keselarasan Brand',
    tagline: 'Pemeriksaan ketelitian visual, tata bahasa, dan kepatuhan brand guideline.',
    purposeLabel: 'AUDIT MUTU & VALIDASI',
    purposeDesc: 'Memastikan tidak ada kesalahan pengetikan (typo), rasio kontras warna tepat, dan pesan tersampaikan dengan kuat.',
    contentIdeas: [
      'Pengecekan typo & tata bahasa',
      'Verifikasi rasio kontras visual',
      'Kepatuhan brand identity guide',
      'Uji keterbacaan di mobile screen',
      'Kesesuaian format ekspor'
    ],
    goalLabel: 'Lolos Quality Control',
    goalDesc: 'Karya terverifikasi memenuhi standar kualitas sebelum disetujui atau diberi revisi terarah.',
    statuses: ['SUBMITTED', 'UNDER_REVIEW', 'RESUBMITTED'],
    defaultStatus: 'UNDER_REVIEW',
    coneGradient: 'from-teal-600 via-emerald-600 to-cyan-800',
    coneWidth: 'w-full max-w-[270px]',
    accentBg: 'bg-teal-50/70 dark:bg-teal-950/30',
    accentText: 'text-teal-700 dark:text-teal-300',
    accentBorder: 'border-teal-200/80 dark:border-teal-800/80',
    nextStatus: 'APPROVED',
    nextLabel: 'Setujui Desain',
    sopGuidelines: {
      title: 'SOP Tahap 03 - Pengecekan Mutu (Quality Control)',
      items: [
        'Lakukan pengecekan zoom 100% untuk memeriksa ketajaman gambar dan artefak kompresi.',
        'Bandingkan output dengan checklist brief untuk memastikan seluruh poin permintaan telah terpenuhi.',
        'Jika ada catatan perbaikan, berikan instruksi spesifik dan terukur pada log revisi.'
      ]
    }
  },
  {
    id: 'stage-revision',
    stepNumber: '04',
    title: 'REVISI & PERBAIKAN',
    subtitle: 'Penyempurnaan Sesuai Feedback',
    tagline: 'Perbaikan detail, penomoran versi (V2, V3...), dan eksekusi catatan revisi.',
    purposeLabel: 'PENYEMPURNAAN FEEDBACK',
    purposeDesc: 'Mengeksekusi perbaikan secara tepat sasaran tanpa mengulangi kesalahan, dengan riwayat versi yang transparan.',
    contentIdeas: [
      'Eksekusi poin catatan revisi',
      'Pembaruan versi (v1.1, v2.0...)',
      'Perbandingan sebelum & sesudah',
      'Koreksi layout & penataan teks',
      'Konfirmasi cepat ke pemohon'
    ],
    goalLabel: 'Revisi Tuntas',
    goalDesc: 'Seluruh poin revisi terselesaikan dengan sempurna dan siap disetujui.',
    statuses: ['REVISION_REQUIRED'],
    defaultStatus: 'REVISION_REQUIRED',
    coneGradient: 'from-amber-600 via-orange-600 to-rose-700',
    coneWidth: 'w-full max-w-[245px]',
    accentBg: 'bg-orange-50/70 dark:bg-orange-950/30',
    accentText: 'text-orange-700 dark:text-orange-300',
    accentBorder: 'border-orange-200/80 dark:border-orange-800/80',
    nextStatus: 'IN_PROGRESS',
    nextLabel: 'Kirim Ulang Revisi',
    sopGuidelines: {
      title: 'SOP Tahap 04 - Manajemen Revisi Desain',
      items: [
        'Centang satu per satu daftar revisi setelah diperbaiki untuk mencegah poin terlewat.',
        'Tingkatkan nomor versi file (misal dari V1 menjadi V2) agar riwayat desain tidak tertimpa.',
        'Unggah draf perbaikan beserta catatan perubahan (*changelog*) untuk memudahkan verifikasi.'
      ]
    }
  },
  {
    id: 'stage-handover',
    stepNumber: '05',
    title: 'APPROVAL & HANDOVER',
    subtitle: 'Persetujuan & Serah Terima File Final',
    tagline: 'Desain resmi disetujui, siap tayang, dan seluruh paket file diserahkan ke klien.',
    purposeLabel: 'SERAH TERIMA RESMI',
    purposeDesc: 'Menyerahkan paket file siap tayang dan file master secara rapi disertai tautan unduh dan dokumentasi final.',
    contentIdeas: [
      'Paket file siap pakai (PNG, JPG, MP4)',
      'File master editable (PSD / AI / FIG)',
      'Font outlines & asset link bundle',
      'Cloud drive download link',
      'Berita acara serah terima digital'
    ],
    goalLabel: 'Siap Tayang / Cetak',
    goalDesc: 'File lengkap diserahkan ke klien/tim pemohon dan tersimpan aman di cloud repository.',
    statuses: ['APPROVED', 'COMPLETED'],
    defaultStatus: 'APPROVED',
    coneGradient: 'from-yellow-600 via-amber-500 to-orange-600',
    coneWidth: 'w-full max-w-[220px]',
    accentBg: 'bg-amber-50/70 dark:bg-amber-950/30',
    accentText: 'text-amber-700 dark:text-amber-300',
    accentBorder: 'border-amber-200/80 dark:border-amber-800/80',
    sopGuidelines: {
      title: 'SOP Tahap 05 - Final Handover & Archiving',
      items: [
        'Pastikan seluruh font telah di-convert ke Outlines/Shapes pada file master vektor (.AI/.EPS).',
        'Sertakan file preview high-resolution (PNG/JPG 100% quality) untuk kemudahan inspeksi cepat.',
        'Pastikan tautan folder Google Drive / Cloud Storage dapat diakses dan izin unduh telah aktif.'
      ]
    }
  }
];

export const FunnelPipelineView: React.FC<FunnelPipelineViewProps> = ({
  tasks,
  onSelectTask,
  onUpdateStatus,
  onOpenCreateTask,
  onOpenHandover,
  selectedStage: externalSelectedStage,
  onSelectStage
}) => {
  const { allUsers, canCreateTask } = useAuth();
  const [internalSelectedStage, setInternalSelectedStage] = useState<FunnelStageData | null>(null);

  const activeSelectedStage = externalSelectedStage !== undefined ? externalSelectedStage : internalSelectedStage;

  const handleSelectStage = (stage: FunnelStageData | null) => {
    if (onSelectStage) {
      onSelectStage(stage);
    } else {
      setInternalSelectedStage(stage);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterOnlyActiveRevisions, setFilterOnlyActiveRevisions] = useState(false);

  // Drag-and-drop state
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverStageId, setDragOverStageId] = useState<string | null>(null);

  // Filter tasks based on search & filter controls
  const filteredTasks = tasks.filter((t) => {
    if (filterOnlyActiveRevisions && t.status !== 'REVISION_REQUIRED') return false;
    if (filterAssignee !== 'ALL' && t.current_assignee_id !== filterAssignee) return false;
    if (filterType !== 'ALL' && t.task_type !== filterType) return false;
    if (filterPriority !== 'ALL' && t.priority !== filterPriority) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchId = t.task_id.toLowerCase().includes(q);
      const matchAssignee = (t.current_assignee_name || '').toLowerCase().includes(q);
      const matchType = (t.task_type || '').toLowerCase().includes(q);
      if (!matchTitle && !matchId && !matchAssignee && !matchType) return false;
    }
    return true;
  });

  const getStageTasks = (statuses: TaskStatus[]) => {
    return filteredTasks.filter((t) => statuses.includes(t.status));
  };

  const getStageIcon = (step: string) => {
    switch (step) {
      case '01':
        return <Megaphone className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case '02':
        return <Palette className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case '03':
        return <Eye className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
      case '04':
        return <RefreshCw className="w-5 h-5 text-orange-600 dark:text-orange-400" />;
      case '05':
        return <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-500" />;
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverStageId !== stageId) {
      setDragOverStageId(stageId);
    }
  };

  const handleDragLeave = (stageId: string) => {
    if (dragOverStageId === stageId) {
      setDragOverStageId(null);
    }
  };

  const handleDrop = (e: React.DragEvent, stage: FunnelStageData) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      onUpdateStatus(taskId, stage.defaultStatus);
    }
    setDragOverStageId(null);
    setDraggedTaskId(null);
  };

  const isFilterActive =
    searchQuery.trim() !== '' ||
    filterAssignee !== 'ALL' ||
    filterType !== 'ALL' ||
    filterPriority !== 'ALL' ||
    filterOnlyActiveRevisions;

  const resetFilters = () => {
    setSearchQuery('');
    setFilterAssignee('ALL');
    setFilterType('ALL');
    setFilterPriority('ALL');
    setFilterOnlyActiveRevisions(false);
  };

  return (
    <div className="space-y-5 animate-page-enter">
      {/* Control Bar: Filter & Search */}
      <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul, ID, desainer..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          {/* Designer Filter */}
          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="py-1.5 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200 cursor-pointer shadow-2xs"
          >
            <option value="ALL">Semua Desainer</option>
            {allUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.full_name} ({u.role})
              </option>
            ))}
          </select>

          {/* Design Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="py-1.5 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200 cursor-pointer shadow-2xs"
          >
            <option value="ALL">Semua Jenis Desain</option>
            <option value="Feed Instagram (1:1)">Feed Instagram (1:1)</option>
            <option value="Story / Reels (9:16)">Story / Reels (9:16)</option>
            <option value="Carousel Infografis">Carousel Infografis</option>
            <option value="Banner Promosi / Ads">Banner Promosi / Ads</option>
            <option value="Packaging / Merchandise">Packaging / Merchandise</option>
            <option value="Print / Cetak (Brosur/Flyer)">Print / Cetak</option>
            <option value="Logo & Brand Identity">Logo & Brand Identity</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="py-1.5 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200 cursor-pointer shadow-2xs"
          >
            <option value="ALL">Semua Prioritas</option>
            <option value="URGENT">Khusus Urgent</option>
            <option value="HIGH">High Priority</option>
            <option value="NORMAL">Normal</option>
            <option value="LOW">Low</option>
          </select>

          {isFilterActive && (
            <button
              onClick={resetFilters}
              className="py-1.5 px-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
              title="Reset Semua Filter"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 w-full lg:w-auto justify-between lg:justify-end">
          <button
            onClick={() => setFilterOnlyActiveRevisions(!filterOnlyActiveRevisions)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              filterOnlyActiveRevisions
                ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800 shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>Fokus Revisi Aktif</span>
          </button>

          {canCreateTask && (
            <button
              onClick={onOpenCreateTask}
              className="px-3.5 py-1.5 rounded-xl btn-3d-primary text-white text-xs font-bold shadow-md cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-amber-300" />
              <span>+ Buat Desain Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Helpful Instruction Banner */}
      <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-indigo-950 dark:text-indigo-200 font-medium">
        <div className="flex items-center gap-2.5">
          <MousePointerClick className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>
            <strong>Pipeline Alur Produksi Desain:</strong> Klik blok tahapan untuk membuka jendela detail lengkap atau geser (drag & drop) kartu desain antar tahap untuk memindahkan progres.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-200/70 dark:bg-indigo-900/70 text-indigo-800 dark:text-indigo-300">
            5 Tahap Produksi
          </span>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            Drag & Drop Aktif
          </span>
        </div>
      </div>

      {/* 3D Funnel Stages Container matching the uploaded infographic */}
      <div className="relative space-y-4 py-2">
        {/* Continuous vertical dashed timeline running along the left */}
        <div className="absolute left-6 sm:left-7 top-6 bottom-6 w-0.5 border-l-2 border-dashed border-slate-300 dark:border-slate-700 pointer-events-none z-0" />

        {FUNNEL_STAGES.map((stage, index) => {
          const stageTasks = getStageTasks(stage.statuses);
          const hasTasks = stageTasks.length > 0;
          const isDragOver = dragOverStageId === stage.id;

          return (
            <div
              key={stage.id}
              id={stage.id}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={() => handleDragLeave(stage.id)}
              onDrop={(e) => handleDrop(e, stage)}
              className={`relative z-10 flex flex-col lg:flex-row items-stretch gap-3 sm:gap-4 group transition-all duration-300 ${
                isDragOver ? 'scale-[1.01]' : ''
              }`}
            >
              {/* Left Column: Vertical Timeline Node + 3D Funnel Cone Tier */}
              <div className="flex items-center gap-3 sm:gap-4 shrink-0 lg:w-[360px]">
                {/* Circular Step Badge Node on Timeline */}
                <div
                  onClick={() => handleSelectStage(stage)}
                  className={`w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-white dark:bg-slate-800 border-2 shadow-lg flex items-center justify-center shrink-0 cursor-pointer transition-all duration-300 group-hover:scale-110 ${stage.accentBorder} relative z-20`}
                  title={`Klik untuk membuka detail Tahap ${stage.stepNumber}: ${stage.title}`}
                >
                  {getStageIcon(stage.stepNumber)}
                </div>

                {/* Horizontal Pin Linker from node to cone */}
                <div className="hidden sm:block w-3 h-0.5 bg-slate-300 dark:bg-slate-700 shrink-0" />

                {/* 3D Funnel Cone / Inverted Tier Block with authentic progressive tapering */}
                <div
                  onClick={() => handleSelectStage(stage)}
                  className={`${stage.coneWidth || 'w-full'} relative cursor-pointer rounded-2xl sm:rounded-3xl p-4 sm:p-5 bg-gradient-to-r ${stage.coneGradient} text-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border border-white/25 overflow-hidden select-none ${
                    isDragOver ? 'ring-4 ring-white/70 animate-pulse' : ''
                  }`}
                  style={{
                    boxShadow: '0 12px 28px -6px rgba(0, 0, 0, 0.3), inset 0 2px 5px rgba(255, 255, 255, 0.35)'
                  }}
                >
                  {/* Specular 3D Top Curved Rim Highlight */}
                  <div className="absolute inset-x-0 top-0 h-3.5 bg-gradient-to-b from-white/40 to-transparent rounded-t-2xl" />

                  {/* Watermark Step Number */}
                  <div className="absolute -right-3 -bottom-5 text-7xl font-black text-white/10 select-none pointer-events-none font-display">
                    {stage.stepNumber}
                  </div>

                  {/* Funnel Content */}
                  <div className="relative z-10 text-center space-y-1">
                    <div className="text-xl sm:text-2xl font-black text-white/95 tracking-tight font-display drop-shadow-xs">
                      {stage.stepNumber}
                    </div>

                    <h3 className="text-sm sm:text-base font-black tracking-wider text-white uppercase font-display drop-shadow-sm">
                      {stage.title}
                    </h3>

                    <p className="text-[11px] sm:text-xs text-white/90 italic font-medium line-clamp-1 px-1">
                      &ldquo;{stage.tagline.split('.')[0]}&rdquo;
                    </p>

                    <p className="text-[10px] text-white/75 line-clamp-1 px-1 pt-0.5">
                      {stage.subtitle}
                    </p>

                    {/* Active Task Pill Inside Funnel */}
                    <div className="pt-2 flex items-center justify-center">
                      <span
                        className={`text-[10px] font-extrabold px-3 py-1 rounded-full backdrop-blur-md border shadow-xs inline-flex items-center gap-1.5 ${
                          hasTasks
                            ? 'bg-white/25 text-white border-white/40'
                            : 'bg-black/20 text-white/80 border-white/10'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${hasTasks ? 'bg-emerald-400' : 'bg-slate-400'}`} />
                        <span>{stageTasks.length} Desain Aktif</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Connected Stage Details Card */}
              <div
                className={`flex-1 rounded-2xl sm:rounded-3xl border transition-all duration-200 ${
                  isDragOver
                    ? 'border-indigo-500 ring-2 ring-indigo-500/40 bg-indigo-50/40 dark:bg-indigo-950/40'
                    : `${stage.accentBorder} ${stage.accentBg}`
                } p-4 sm:p-5 flex flex-col justify-between gap-3 shadow-xs hover:shadow-md backdrop-blur-md`}
              >
                {/* Card Top: 3-column metadata matching the image */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  {/* Section 1: PURPOSE (Cols 1-4) */}
                  <div className="md:col-span-4 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-black uppercase tracking-wider ${stage.accentText} font-display`}>
                        PURPOSE:
                      </span>
                      <span className="text-xs font-black text-slate-900 dark:text-white uppercase font-display">
                        {stage.purposeLabel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {stage.purposeDesc}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="hidden md:block md:col-span-1 text-center">
                    <div className="w-px h-16 bg-slate-200 dark:bg-slate-700 mx-auto" />
                  </div>

                  {/* Section 2: FOKUS EKSEKUSI / DELIVERABLES (Cols 5-9) */}
                  <div className="md:col-span-4 space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 font-display">
                      FOKUS & DELIVERABLES:
                    </div>
                    <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 font-medium">
                      {stage.contentIdeas.slice(0, 3).map((idea, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0" />
                          <span className="truncate">{idea}</span>
                        </li>
                      ))}
                      {stage.contentIdeas.length > 3 && (
                        <li className="text-[11px] text-slate-400 dark:text-slate-500 italic pl-3">
                          +{stage.contentIdeas.length - 3} standar lainnya...
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Divider */}
                  <div className="hidden md:block md:col-span-1 text-center">
                    <div className="w-px h-16 bg-slate-200 dark:bg-slate-700 mx-auto" />
                  </div>

                  {/* Section 3: GOAL (Cols 10-12) */}
                  <div className="md:col-span-2 flex flex-col items-start md:items-end justify-center text-left md:text-right space-y-1">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${stage.accentText}`}>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-black uppercase font-display ${stage.accentText}`}>
                        GOAL:
                      </span>
                    </div>
                    <div className="text-xs font-extrabold text-slate-900 dark:text-white font-display">
                      {stage.goalLabel}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {stage.goalDesc}
                    </p>
                  </div>
                </div>

                {/* Card Bottom: Tasks Chips Preview with Drag & Drop & Quick Advance */}
                <div className="pt-3 border-t border-slate-200/70 dark:border-slate-700/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none flex-1 min-w-0">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 shrink-0">
                      Desain ({stageTasks.length}):
                    </span>

                    {stageTasks.length === 0 ? (
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                        {isDragOver ? 'Lepaskan kartu di sini untuk memindahkan...' : 'Belum ada tugas di tahap ini.'}
                      </span>
                    ) : (
                      stageTasks.map((t) => (
                        <div
                          key={t.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, t.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border transition-all cursor-grab active:cursor-grabbing shadow-2xs hover:scale-105 shrink-0 bg-white dark:bg-slate-800 ${
                            t.status === 'REVISION_REQUIRED'
                              ? 'border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/20'
                              : 'border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-400'
                          }`}
                        >
                          <span
                            onClick={() => onSelectTask(t)}
                            className="font-mono text-[10px] text-slate-400 cursor-pointer hover:underline"
                            title={`Buka detail tugas: ${t.task_id}`}
                          >
                            {t.task_id}
                          </span>
                          <span
                            onClick={() => onSelectTask(t)}
                            className="max-w-[130px] truncate cursor-pointer"
                            title={t.title}
                          >
                            {t.title}
                          </span>

                          {t.priority === 'URGENT' && <Flame className="w-3 h-3 text-rose-500 shrink-0" />}

                          {t.revision_count > 0 && (
                            <span className="text-[9px] px-1 rounded bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
                              R#{t.revision_count}
                            </span>
                          )}

                          {/* Quick advance button right on chip */}
                          {stage.nextStatus && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onUpdateStatus(t.id, stage.nextStatus!);
                              }}
                              className="ml-0.5 p-0.5 rounded text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 cursor-pointer"
                              title={`Lanjut ke: ${stage.nextLabel}`}
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Button to open Stage Detail Window */}
                  <button
                    onClick={() => handleSelectStage(stage)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-extrabold rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-xs cursor-pointer active:scale-95 transition-all shrink-0"
                  >
                    <span>Buka Jendela Detail</span>
                    <ChevronRight className="w-3.5 h-3.5 text-indigo-500" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Jendela Baru: Stage Detail Modal */}
      <StageDetailModal
        stage={activeSelectedStage}
        tasks={tasks}
        isOpen={activeSelectedStage !== null}
        onClose={() => handleSelectStage(null)}
        onSelectTask={onSelectTask}
        onUpdateStatus={onUpdateStatus}
        onOpenCreateTask={onOpenCreateTask}
        onOpenHandover={onOpenHandover}
      />
    </div>
  );
};
