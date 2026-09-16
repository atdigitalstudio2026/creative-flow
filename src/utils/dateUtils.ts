import { TaskStatus } from '../types';

export function formatDateIndo(dateStr: string | undefined): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d) + ' WIB';
  } catch (e) {
    return dateStr;
  }
}

export function formatDateOnly(dateStr: string | undefined): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch (e) {
    return dateStr;
  }
}

export function getDeadlineUrgency(deadlineStr: string, status: TaskStatus): {
  isOverdue: boolean;
  isDueToday: boolean;
  isDueTomorrow: boolean;
  label: string;
  badgeClass: string;
} {
  if (['APPROVED', 'COMPLETED', 'ARCHIVED', 'CANCELLED'].includes(status)) {
    return {
      isOverdue: false,
      isDueToday: false,
      isDueTomorrow: false,
      label: 'Selesai',
      badgeClass: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    };
  }

  const now = new Date();
  const deadline = new Date(deadlineStr);
  const diffMs = deadline.getTime() - now.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const isSameDay =
    now.getFullYear() === deadline.getFullYear() &&
    now.getMonth() === deadline.getMonth() &&
    now.getDate() === deadline.getDate();

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow =
    tomorrow.getFullYear() === deadline.getFullYear() &&
    tomorrow.getMonth() === deadline.getMonth() &&
    tomorrow.getDate() === deadline.getDate();

  if (diffMs < 0) {
    const overdueHours = Math.abs(diffHours);
    const label = overdueHours > 24 ? `Overdue ${Math.abs(diffDays)} hari` : `Overdue ${overdueHours} jam`;
    return {
      isOverdue: true,
      isDueToday: false,
      isDueTomorrow: false,
      label,
      badgeClass: 'text-rose-700 bg-rose-50 border-rose-200 ring-1 ring-rose-300 animate-pulse font-semibold'
    };
  }

  if (isSameDay) {
    return {
      isOverdue: false,
      isDueToday: true,
      isDueTomorrow: false,
      label: `Hari Ini (${diffHours} jam lagi)`,
      badgeClass: 'text-amber-700 bg-amber-50 border-amber-300 font-semibold'
    };
  }

  if (isTomorrow) {
    return {
      isOverdue: false,
      isDueToday: false,
      isDueTomorrow: true,
      label: 'Besok',
      badgeClass: 'text-sky-700 bg-sky-50 border-sky-200'
    };
  }

  return {
    isOverdue: false,
    isDueToday: false,
    isDueTomorrow: false,
    label: `${diffDays} hari lagi`,
    badgeClass: 'text-neutral-600 bg-neutral-100 border-neutral-200'
  };
}
