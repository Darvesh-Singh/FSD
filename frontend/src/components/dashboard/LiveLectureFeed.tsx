import React from 'react';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { 
  Radio, MapPin, User, Clock, QrCode, 
  ChevronRight, Users, CheckCircle2 
} from 'lucide-react';

export const LiveLectureFeed: React.FC = () => {
  const { kpis, setSelectedLectureId, setActiveView } = useAttendanceStore();
  const liveLectures = kpis?.liveLectures || [];

  const handleLaunchQR = (lectureId: string) => {
    setSelectedLectureId(lectureId);
    setActiveView('professor-console');
  };

  return (
    <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Live Lecture Stream & Hall Occupancy</h3>
            <p className="text-xs text-slate-400">Current sessions active across academic complexes</p>
          </div>
        </div>

        <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
          {liveLectures.filter(l => l.status === 'IN_PROGRESS').length} Active Sessions
        </span>
      </div>

      {liveLectures.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-xs">
          No live lectures currently in progress.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {liveLectures.map((lec) => {
            const isLive = lec.status === 'IN_PROGRESS';
            const occupancyColor = 
              lec.occupancyPercentage >= 80 ? 'bg-emerald-500' :
              lec.occupancyPercentage >= 65 ? 'bg-academic-500' :
              'bg-amber-500';

            return (
              <div
                key={lec.lectureId}
                className={`group relative rounded-xl p-4 border transition-all duration-200 ${
                  isLive 
                    ? 'bg-slate-850/80 border-slate-700 hover:border-academic-500/50 shadow-md' 
                    : 'bg-slate-900/50 border-slate-800 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <span className="font-mono text-xs font-bold text-academic-400">
                      {lec.courseCode} • {lec.sectionCode}
                    </span>
                    <h4 className="text-xs font-semibold text-white truncate group-hover:text-academic-300 transition">
                      {lec.courseTitle}
                    </h4>
                  </div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                    isLive 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {isLive ? 'IN SESSION' : 'SCHEDULED'}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs text-slate-400 mb-3.5">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{lec.hall}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{lec.instructorName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="font-mono text-[11px]">{lec.timeSlot}</span>
                  </div>
                </div>

                {/* Occupancy Progress */}
                <div className="space-y-1.5 pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      Hall Occupancy
                    </span>
                    <span className="font-mono font-bold text-white">
                      {lec.checkedInCount} / {lec.totalEnrolled} <span className="text-slate-400 text-[11px]">({lec.occupancyPercentage}%)</span>
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${occupancyColor}`}
                      style={{ width: `${Math.min(lec.occupancyPercentage, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Quick Action Button */}
                {isLive && (
                  <div className="mt-3 pt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                      <span>Token:</span>
                      <span className="bg-slate-800 px-1.5 py-0.5 rounded text-white font-bold border border-slate-700">
                        {lec.dynamicQrCode || 'ACTIVE'}
                      </span>
                    </div>

                    <button
                      onClick={() => handleLaunchQR(lec.lectureId)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-academic-400 hover:text-academic-300 transition group-hover:translate-x-0.5"
                    >
                      <span>Room View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

