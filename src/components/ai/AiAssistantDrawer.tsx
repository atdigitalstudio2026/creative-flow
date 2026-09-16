import React, { useState } from 'react';
import { Sparkles, X, Check, Copy, Send, ArrowRight, Layers } from 'lucide-react';
import { aiService } from '../../services/aiService';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyBriefToNewTask?: (briefData: any) => void;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  onApplyBriefToNewTask,
}) => {
  const [prompt, setPrompt] = useState('');
  const [taskType, setTaskType] = useState('Social Media Carousel');
  const [targetAudience, setTargetAudience] = useState('Gen Z & Milenial di perkotaan');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const data = await aiService.generateBriefFromPrompt({
        prompt,
        taskType,
        targetAudience
      });
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    const text = `
OBJEKTIF: ${result.objective}
TARGET AUDIENS: ${result.targetAudience}
KEY MESSAGE: ${result.keyMessage}
ARAHAN VISUAL: ${result.designDirection}
ELEMEN WAJIB: ${result.mandatoryElements}
DO'S: ${result.doList}
DON'TS: ${result.dontList}
CHECKLIST:
${result.checklist?.map((c: string) => `- ${c}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg h-full shadow-2xl flex flex-col overflow-hidden animate-page-enter border-l border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-900/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 text-white flex items-center justify-center font-bold shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight font-display text-white">
                AI Studio Assistant
              </h3>
              <p className="text-[11px] text-slate-300">
                Generate brief, visual directions, & checklist instan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Quick presets */}
          <div>
            <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2 font-display">
              Inspirasi Prompt Cepat:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Peluncuran Minuman Boba Matcha Rendah Gula',
                'Promo Gajian Diskon 70% Fashion Streetwear',
                'Banner Key Visual Webinar AI untuk Bisnis',
                'Reel Instagram Tips Fotografi Produk'
              ].map((text, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(text)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-700 dark:text-slate-300 text-[11px] transition-colors text-left border border-slate-200/80 dark:border-slate-700 cursor-pointer"
                >
                  {text}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleGenerate} className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Deskripsi Singkat / Topik Kampanye
              </label>
              <textarea
                rows={2}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Tuliskan produk, promo, atau konsep yang ingin dibuatkan brief..."
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Format Desain</label>
                <select
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                >
                  <option value="Key Visual (KV)">Key Visual (KV)</option>
                  <option value="Social Media Carousel">Social Media Carousel</option>
                  <option value="Video Motion Reel">Video Motion Reel</option>
                  <option value="Editorial Catalog">Editorial Catalog</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Target Audiens</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-500/25 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{loading ? 'AI sedang menyusun brief...' : 'Generate Creative Brief Lengkap'}</span>
            </button>
          </form>

          {/* Results Output */}
          {result && (
            <div className="space-y-3 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/40 dark:bg-indigo-950/30 animate-page-enter">
              <div className="flex items-center justify-between border-b border-indigo-200 dark:border-indigo-900/60 pb-2">
                <span className="font-extrabold text-indigo-950 dark:text-indigo-300 text-xs font-display">
                  Hasil Rekomendasi Brief
                </span>
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center gap-1 text-xs text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 font-bold"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin!' : 'Salin Semua'}</span>
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 block text-[10px] uppercase">
                    Objektif:
                  </span>
                  <p className="text-slate-900 dark:text-slate-100">{result.objective}</p>
                </div>

                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 block text-[10px] uppercase">
                    Key Message:
                  </span>
                  <p className="text-slate-900 dark:text-slate-100">{result.keyMessage}</p>
                </div>

                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 block text-[10px] uppercase">
                    Arahan Visual:
                  </span>
                  <p className="text-slate-900 dark:text-slate-100">{result.designDirection}</p>
                </div>

                {result.checklist && result.checklist.length > 0 && (
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300 block text-[10px] uppercase">
                      Checklist Output:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-800 dark:text-slate-200">
                      {result.checklist.map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
