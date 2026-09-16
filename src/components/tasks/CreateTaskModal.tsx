import React, { useState } from 'react';
import { TaskPriority, TaskBrief } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { taskService } from '../../services/taskService';
import { aiService } from '../../services/aiService';
import {
  X,
  Sparkles,
  Plus,
  Trash2,
  Calendar,
  Layers,
  CheckSquare,
  AlertCircle,
  PenTool,
  ExternalLink,
  Briefcase,
  Clock,
  Flame,
  FileText,
  Palette,
  CheckCircle2
} from 'lucide-react';

interface CreateTaskModalProps {
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    task_type: string;
    project_id?: string;
    campaign_id?: string;
    priority: TaskPriority;
    deadline: string;
    estimated_effort?: string;
    assignee_id?: string;
    brief: Partial<TaskBrief>;
    checklists?: string[];
  }) => void;
}

const DESIGN_PRESETS = [
  { id: 'Feed Instagram (1080x1080px)', name: 'Feed IG (1:1)', dim: '1080x1080px', icon: '📱' },
  { id: 'Story & Reels (1080x1920px)', name: 'Story / Reels (9:16)', dim: '1080x1920px', icon: '🎬' },
  { id: 'Web Banner & Ads (1920x1080px)', name: 'Banner Web (16:9)', dim: '1920x1080px', icon: '💻' },
  { id: 'Brand Logo & Identity', name: 'Logo & Brand', dim: 'Vector / SVG', icon: '🎨' },
  { id: 'Packaging & Label Produk', name: 'Packaging & Label', dim: 'Die Cut / CMYK', icon: '🏷️' },
  { id: 'Poster & Print A3 (300 DPI)', name: 'Cetak / Poster A3', dim: 'Print Ready CMYK', icon: '🖨️' },
  { id: 'Key Visual (KV)', name: 'Key Visual Utama', dim: 'High-Res Multi-Format', icon: '✨' },
];

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ onClose, onSubmit }) => {
  const { allUsers, currentUser } = useAuth();
  const availableProjects = taskService.getProjects();
  const isDesignerUser = currentUser.role === 'DESIGNER' || currentUser.role === 'CONTENT_CREATOR';

  // Tab State: 'general' (Info & Format Desain) | 'brief' (Brief & Checklist)
  const [activeTab, setActiveTab] = useState<'general' | 'brief'>('general');

  // Core Graphic Design Info
  const [title, setTitle] = useState('');
  const [taskType, setTaskType] = useState('Feed Instagram (1080x1080px)');
  const [customTaskType, setCustomTaskType] = useState('');
  const [isCustomType, setIsCustomType] = useState(false);
  const [projectId, setProjectId] = useState(availableProjects[0]?.id || '');
  const [assigneeId, setAssigneeId] = useState(
    isDesignerUser
      ? currentUser.id
      : allUsers.find((u) => u.role === 'DESIGNER')?.id || allUsers[0]?.id || ''
  );
  const [priority, setPriority] = useState<TaskPriority>('NORMAL');
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [estimatedEffort, setEstimatedEffort] = useState('8 Jam');

  // Creative Brief
  const [description, setDescription] = useState('');
  const [keyMessage, setKeyMessage] = useState('');
  const [designDirection, setDesignDirection] = useState('');
  const [mandatoryElements, setMandatoryElements] = useState('Logo brand resolusi tinggi, Palet warna resmi, Call to Action (CTA)');
  const [referenceLinks, setReferenceLinks] = useState<Array<{ title: string; url: string }>>([
    { title: 'Moodboard & Referensi Desain', url: 'https://pinterest.com' }
  ]);
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkTitle, setNewLinkTitle] = useState('');

  // Design Quality Checklists
  const [checklists, setChecklists] = useState<string[]>([
    'Format resolusi tinggi & color space sesuai (RGB/CMYK)',
    'Logo brand tajam & memiliki safe margin',
    'Headline & Copy teks terbaca jelas (legible typography)',
    'Visual produk/model ter-retouch rapi & pencahayaan natural',
    'Tombol Call to Action (CTA) menonjol'
  ]);
  const [newChecklistInput, setNewChecklistInput] = useState('');

  // AI Assist
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const effectiveTaskType = isCustomType && customTaskType.trim() ? customTaskType.trim() : taskType;

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingAi(true);
    try {
      const generated = await aiService.generateBriefFromPrompt({
        prompt: aiPrompt,
        taskType: effectiveTaskType,
        targetAudience: 'Konsumen & Pengikut Media Sosial'
      });

      if (!title) setTitle(aiPrompt);
      if (generated.objective) setDescription(generated.objective);
      if (generated.keyMessage) setKeyMessage(generated.keyMessage);
      if (generated.designDirection) setDesignDirection(generated.designDirection);
      if (generated.mandatoryElements) setMandatoryElements(generated.mandatoryElements);
      if (generated.checklist && generated.checklist.length > 0) {
        setChecklists(generated.checklist);
      }
      setActiveTab('brief');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleAddLink = () => {
    if (!newLinkUrl.trim()) return;
    setReferenceLinks([
      ...referenceLinks,
      {
        title: newLinkTitle.trim() || newLinkUrl.trim(),
        url: newLinkUrl.trim().startsWith('http') ? newLinkUrl.trim() : `https://${newLinkUrl.trim()}`
      }
    ]);
    setNewLinkTitle('');
    setNewLinkUrl('');
  };

  const handleRemoveLink = (idx: number) => {
    setReferenceLinks(referenceLinks.filter((_, i) => i !== idx));
  };

  const handleAddChecklist = () => {
    if (!newChecklistInput.trim()) return;
    setChecklists([...checklists, newChecklistInput.trim()]);
    setNewChecklistInput('');
  };

  const handleRemoveChecklist = (index: number) => {
    setChecklists(checklists.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setActiveTab('general');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim() || designDirection.trim(),
      task_type: effectiveTaskType,
      project_id: projectId || undefined,
      priority,
      deadline: new Date(deadline).toISOString(),
      estimated_effort: estimatedEffort,
      assignee_id: assigneeId || undefined,
      brief: {
        objective: description,
        keyMessage,
        designDirection,
        mandatoryElements,
        reference_links: referenceLinks
      },
      checklists
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="modal-3d bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden animate-page-enter flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-900/40 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base font-display flex items-center gap-2">
                Pekerjaan Desain Baru
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 shadow-xs">
                  {isDesignerUser ? 'Input Job Mandiri' : 'Graphic Design Order'}
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                {isDesignerUser
                  ? 'Catat pekerjaan desain baru untuk diri Anda sendiri atau delegasikan ke tim'
                  : 'Form terpadu spesifikasi visual, penugasan desainer, brief dan deadline'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 px-4 sm:px-6 pt-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`pb-2.5 px-4 font-extrabold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'general'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Palette className="w-4 h-4" />
            1. Format & Penugasan
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('brief')}
            className={`pb-2.5 px-4 font-extrabold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'brief'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            2. Creative Brief & Checklist ({checklists.length})
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {activeTab === 'general' ? (
            <div className="space-y-5">
              {/* Judul Desain */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Judul Pekerjaan Desain <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Feed Promo Flash Sale 10.10 - Diskon Up To 50%"
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Format & Dimensi Kanvas Preset */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Format & Dimensi Kanvas
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustomType(!isCustomType)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                  >
                    {isCustomType ? 'Gunakan Preset Standar' : '+ Format Kustom'}
                  </button>
                </div>

                {!isCustomType ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {DESIGN_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setTaskType(preset.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          taskType === preset.id
                            ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 shadow-2xs'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="text-base mb-1">{preset.icon}</div>
                        <div className="text-xs font-bold truncate">{preset.name}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                          {preset.dim}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={customTaskType}
                    onChange={(e) => setCustomTaskType(e.target.value)}
                    placeholder="Ketik format kustom (misal: Billboard 4x8m, Booth Pameran 3x3m)"
                    className="w-full p-2.5 rounded-xl border border-indigo-300 dark:border-indigo-700 bg-indigo-50/30 dark:bg-indigo-950/30 text-slate-900 dark:text-white text-xs font-medium"
                  />
                )}
              </div>

              {/* Grid: Klien/Proyek, Desainer, Prioritas, Deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Proyek / Klien */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Brand / Klien
                  </label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                  >
                    {availableProjects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Desainer Ditugaskan */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Pelaksana Desain (Assignee)
                    </label>
                    {isDesignerUser && (
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                        Otomatis: Diri Sendiri
                      </span>
                    )}
                  </div>
                  <select
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                  >
                    {allUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.id === currentUser.id ? `★ ${u.full_name} (Saya Sendiri - ${u.role})` : `${u.full_name} (${u.role})`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Prioritas */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Tingkat Prioritas
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['NORMAL', 'HIGH', 'URGENT'] as TaskPriority[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`py-2 px-2 text-center rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          priority === p
                            ? p === 'URGENT'
                              ? 'bg-rose-500 text-white border-rose-600'
                              : p === 'HIGH'
                              ? 'bg-amber-500 text-white border-amber-600'
                              : 'bg-indigo-600 text-white border-indigo-700'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {p === 'URGENT' ? 'Mendesak' : p === 'HIGH' ? 'Tinggi' : 'Normal'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Batas Waktu (Deadline)
                  </label>
                  <input
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                  />
                </div>
              </div>

              {/* Bantuan AI Generate Cepat */}
              <div className="p-3.5 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-2xl border border-indigo-200/80 dark:border-indigo-800/80 flex flex-col sm:flex-row items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div className="flex-1 w-full">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Bantuan AI Pembuat Brief Desain Otomatis
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Ketik ide desain (misal: Diskon kopi kenangan 50% nuansa pastel ceria)..."
                      className="flex-1 p-2 rounded-lg text-xs border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                    />
                    <button
                      type="button"
                      disabled={isGeneratingAi || !aiPrompt.trim()}
                      onClick={handleAiGenerate}
                      className="py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shrink-0 cursor-pointer"
                    >
                      {isGeneratingAi ? 'Menyusun...' : 'Generate Brief'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Ringkasan Konsep / Arahan Visual */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Arahan Desain & Nuansa Visual
                </label>
                <textarea
                  rows={3}
                  value={designDirection}
                  onChange={(e) => setDesignDirection(e.target.value)}
                  placeholder="Gaya visual, palet warna, tipografi, moodboard feeling (misal: Modern minimalis, tone biru & oranye energik, font bold display)..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              {/* Copywriting & Headline Teks Wajib */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Headline & Pesan Utama
                  </label>
                  <input
                    type="text"
                    value={keyMessage}
                    onChange={(e) => setKeyMessage(e.target.value)}
                    placeholder="Contoh: Beli 1 Gratis 1 Khusus Hari Ini!"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Elemen Wajib & CTA
                  </label>
                  <input
                    type="text"
                    value={mandatoryElements}
                    onChange={(e) => setMandatoryElements(e.target.value)}
                    placeholder="Logo HD, Harga coret, CTA 'Pesan Sekarang'"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              {/* Link Referensi / Drive Mockup */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Link Referensi / Google Drive / Figma
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={newLinkTitle}
                    onChange={(e) => setNewLinkTitle(e.target.value)}
                    placeholder="Nama link (misal: Folder Aset Foto)"
                    className="w-1/3 p-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                  <input
                    type="url"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="flex-1 p-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddLink}
                    className="py-2 px-3 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-xl border border-indigo-200 dark:border-indigo-800 cursor-pointer"
                  >
                    + Tambah
                  </button>
                </div>

                {referenceLinks.map((link, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs mb-1"
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1.5 truncate"
                    >
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      {link.title}: {link.url}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(idx)}
                      className="text-slate-400 hover:text-rose-500 cursor-pointer p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Checklist Standar Kualitas */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Checklist Standar Kualitas Desain Sebelum Review
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={newChecklistInput}
                    onChange={(e) => setNewChecklistInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddChecklist())}
                    placeholder="Tambah poin verifikasi desain..."
                    className="flex-1 p-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddChecklist}
                    className="py-2 px-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    + Tambah
                  </button>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {checklists.map((chk, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs"
                    >
                      <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        {chk}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveChecklist(idx)}
                        className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Footer Action */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            {activeTab === 'general' ? (
              <button
                type="button"
                onClick={() => setActiveTab('brief')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Lanjut ke Brief & Checklist &rarr;
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('general')}
                className="text-xs font-bold text-slate-500 hover:underline cursor-pointer"
              >
                &larr; Kembali ke Format & Penugasan
              </button>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="py-2 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="py-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/25 cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                + Terbitkan Pekerjaan Desain
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
