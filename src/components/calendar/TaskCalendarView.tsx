import React, { useState } from 'react';
import { Task } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface TaskCalendarViewProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}

export const TaskCalendarView: React.FC<TaskCalendarViewProps> = ({ tasks, onSelectTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 1)); // September 2026

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Calendar logic
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const leadingBlanks = Array.from({ length: firstDayIndex }, (_, i) => i);

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
            Kalender Deadline
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Jadwal pengiriman dan tenggat waktu seluruh tim kreatif
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-extrabold text-xs text-slate-900 px-3 font-display">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3.5 py-1.5 text-xs font-bold rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-700 shadow-2xs cursor-pointer transition-colors"
          >
            Hari Ini
          </button>
        </div>
      </div>

      {/* Grid Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Days of week */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/90 text-center text-xs font-extrabold text-slate-500 py-3 font-display">
          <span>Min</span>
          <span>Sen</span>
          <span>Sel</span>
          <span>Rab</span>
          <span>Kam</span>
          <span>Jum</span>
          <span>Sab</span>
        </div>

        {/* Days cells */}
        <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 min-h-[500px]">
          {/* Leading blank days */}
          {leadingBlanks.map((_, idx) => (
            <div key={`blank-${idx}`} className="bg-slate-50/40 p-2 min-h-[100px]" />
          ))}

          {/* Actual days */}
          {daysArray.map((day) => {
            const dateObj = new Date(year, month, day);
            const dateStringPrefix = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayTasks = tasks.filter((t) => t.deadline.startsWith(dateStringPrefix));

            const isToday =
              new Date().getFullYear() === year &&
              new Date().getMonth() === month &&
              new Date().getDate() === day;

            return (
              <div
                key={`day-${day}`}
                className={`p-2 min-h-[110px] flex flex-col justify-between transition-colors ${
                  isToday ? 'bg-indigo-50/40 font-bold' : 'hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-xs inline-flex items-center justify-center rounded-full w-6 h-6 ${
                      isToday
                        ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold shadow-sm'
                        : 'text-slate-700 font-medium'
                    }`}
                  >
                    {day}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-[10px] font-bold text-slate-400">
                      {dayTasks.length} task
                    </span>
                  )}
                </div>

                {/* Day Tasks */}
                <div className="space-y-1 overflow-y-auto max-h-[85px] flex-1 custom-scrollbar">
                  {dayTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => onSelectTask(t)}
                      className={`p-1.5 rounded-lg text-[11px] border leading-tight cursor-pointer transition-transform hover:scale-[1.02] shadow-2xs ${
                        t.priority === 'URGENT'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : t.status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono font-bold text-[9px] text-slate-500">
                        <span>{t.task_id}</span>
                        <span className={t.priority === 'URGENT' ? 'text-rose-600 font-extrabold' : ''}>{t.priority}</span>
                      </div>
                      <p className="font-bold truncate mt-0.5 text-slate-900">{t.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
