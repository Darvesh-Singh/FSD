import React from 'react';
import { StatusBadge, MethodBadge } from '../common/StatusBadge';
import { 
  Calendar, MapPin, Clock, FileText, CheckCircle2, 
  AlertCircle, HelpCircle, ArrowUpRight 
} from 'lucide-react';

interface AttendanceTimelineProps {
  logs: any[];
  onOpenAppeal: (logId: string) => void;
}

export const AttendanceTimeline: React.FC<AttendanceTimelineProps> = ({ logs, onOpenAppeal }) => {
  if (logs.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500 text-xs">
        No lecture sessions recorded for this student yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => {
        const isAbsent = log.status === 'ABSENT';
        const hasAppeal = !!log.appeal;

        return (
          <div
            key={log.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-850/80 hover:bg-slate-850 border border-slate-750 transition"
          >
            {/* Left: Date & Course Info */}
            <div className="flex items-start gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-slate-800 text-slate-400 shrink-0 text-center font-mono">
                <span className="text-[10px] block uppercase font-bold text-slate-500">
                  {new Date(log.date).toLocaleDateString([], { month: 'short' })}
                </span>
                <span className="text-sm font-bold text-white block leading-none mt-0.5">
                  {new Date(log.date).getDate()}
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-academic-400">
                    {log.courseCode}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs font-semibold text-white truncate">
                    {log.lectureTitle}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {log.hall}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {log.time}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Status, Method & Appeal */}
            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <MethodBadge method={log.method} />
              <StatusBadge status={log.status} size="sm" />

              {/* Appeal state */}
              {isAbsent && (
                <div>
                  {hasAppeal ? (
                    <span className={`inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded border ${
                      log.appeal.status === 'APPROVED' 
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
                        : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    }`}>
                      <FileText className="w-3 h-3" />
                      <span>Appeal: {log.appeal.status}</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => onOpenAppeal(log.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-academic-400 hover:text-academic-300 bg-academic-500/10 hover:bg-academic-500/20 px-2.5 py-1 rounded-lg border border-academic-500/30 transition"
                    >
                      <span>File Appeal</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
};

