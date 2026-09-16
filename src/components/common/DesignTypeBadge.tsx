import React from 'react';
import {
  Instagram,
  Video,
  Sparkles,
  Layout,
  Printer,
  Palette,
  Package,
  FileCode,
  Layers
} from 'lucide-react';

interface DesignTypeBadgeProps {
  type: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const DesignTypeBadge: React.FC<DesignTypeBadgeProps> = ({
  type,
  className = '',
  size = 'sm'
}) => {
  const normalized = (type || '').toLowerCase();

  const getConfig = () => {
    if (normalized.includes('feed') || normalized.includes('instagram') || normalized.includes('carousel')) {
      return {
        label: type,
        icon: Instagram,
        style: 'bg-gradient-to-r from-pink-50 to-rose-50 text-rose-700 border-rose-200/80',
        iconColor: 'text-rose-500'
      };
    }
    if (normalized.includes('reels') || normalized.includes('tiktok') || normalized.includes('story') || normalized.includes('video') || normalized.includes('shorts')) {
      return {
        label: type,
        icon: Video,
        style: 'bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 border-purple-200/80',
        iconColor: 'text-purple-600'
      };
    }
    if (normalized.includes('motion') || normalized.includes('animat')) {
      return {
        label: type,
        icon: Sparkles,
        style: 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800 border-amber-200/80',
        iconColor: 'text-amber-600'
      };
    }
    if (normalized.includes('key visual') || normalized.includes('campaign') || normalized.includes('poster')) {
      return {
        label: type,
        icon: Layers,
        style: 'bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border-indigo-200/80',
        iconColor: 'text-indigo-600'
      };
    }
    if (normalized.includes('ui') || normalized.includes('web') || normalized.includes('app') || normalized.includes('landing')) {
      return {
        label: type,
        icon: Layout,
        style: 'bg-gradient-to-r from-cyan-50 to-sky-50 text-sky-800 border-sky-200/80',
        iconColor: 'text-sky-600'
      };
    }
    if (normalized.includes('brand') || normalized.includes('logo') || normalized.includes('identitas')) {
      return {
        label: type,
        icon: Palette,
        style: 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 border-emerald-200/80',
        iconColor: 'text-emerald-600'
      };
    }
    if (normalized.includes('print') || normalized.includes('packaging') || normalized.includes('kemasan') || normalized.includes('banner')) {
      return {
        label: type,
        icon: Printer,
        style: 'bg-gradient-to-r from-stone-100 to-amber-50 text-stone-800 border-stone-200/80',
        iconColor: 'text-stone-600'
      };
    }

    return {
      label: type,
      icon: Package,
      style: 'bg-slate-100 text-slate-700 border-slate-200',
      iconColor: 'text-slate-500'
    };
  };

  const config = getConfig();
  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-md border shadow-2xs whitespace-nowrap ${config.style} ${sizeClasses} ${className}`}
    >
      <Icon className={`w-3 h-3 ${config.iconColor} shrink-0`} />
      <span className="truncate max-w-[140px]">{config.label}</span>
    </span>
  );
};
