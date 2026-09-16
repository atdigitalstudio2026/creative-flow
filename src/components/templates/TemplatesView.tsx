import React from 'react';
import { INITIAL_TEMPLATES } from '../../data/seedData';
import { FileCode2, CheckSquare, Plus, Copy } from 'lucide-react';

interface TemplatesViewProps {
  onUseTemplate: (template: any) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({ onUseTemplate }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-neutral-200 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
            Template Standar Brief & Checklist
          </h2>
          <p className="text-xs text-neutral-500">
            Standarisasi pengerjaan untuk konsistensi kualitas deliverable tim kreatif
          </p>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {INITIAL_TEMPLATES.map((tmpl) => (
          <div
            key={tmpl.id}
            className="bg-white rounded-xl border border-neutral-200 p-5 shadow-2xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 font-semibold text-neutral-700">
                  {tmpl.task_type}
                </span>
                <span className="text-xs text-neutral-500 font-medium">
                  {tmpl.estimated_effort}
                </span>
              </div>
              <h3 className="font-bold text-sm text-neutral-900">{tmpl.name}</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {tmpl.description}
              </p>

              {/* Checklist preview */}
              <div className="pt-2 border-t border-neutral-100 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                  Checklist Wajib:
                </span>
                {tmpl.default_checklist.slice(0, 4).map((c, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-neutral-700">
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{c}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onUseTemplate(tmpl)}
              className="w-full py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-amber-400" />
              <span>Gunakan Template Ini</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
