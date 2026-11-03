import React, { useState, useEffect } from 'react';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { api } from '../../services/api';
import { DynamicQRCodeGenerator } from '../capture/DynamicQRCodeGenerator';
import { ManualOverrideSheet } from '../capture/ManualOverrideSheet';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Presentation, QrCode, Users, Clock, MapPin, 
  CheckCircle2, Radio, Sparkles, RefreshCw 
} from 'lucide-react';

export const ProfessorConsole: React.FC = () => {
  const { 
    currentUser, 
    kpis, 
    selectedLectureId, 
    setSelectedLectureId,
    refreshDashboard 
  } = useAttendanceStore();

  const [activeSubTab, setActiveSubTab] = useState<'qr' | 'roster'>('qr');
  const [lectureDetails, setLectureDetails] = useState<any>(null);

  const liveLectures = kpis?.liveLectures || [];
  const currentLectureId = selectedLectureId || liveLectures[0]?.lectureId;

  const loadDetails = async (id: string) => {
    try {
      const data = await api.getLiveLecture(id);
      setLectureDetails(data);
    } catch (err) {
      console.error('Failed to load lecture details:', err);
    }
  };

  useEffect(() => {
    if (currentLectureId) {
      loadDetails(currentLectureId);
    }
  }, [currentLectureId]);

  return (
    <div className="space-y-6">
      
      {/* Professor Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
                Faculty Instructor Operations
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                ACTIVE SEMESTER
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              Lecture Session Command Center
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage in-hall student attendance, broadcast dynamic rotating QR codes to the auditorium screen, and inspect live roll calls.
            </p>
          </div>

          {/* Session Selector */}
          <div className="shrink-0">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Active Lecture Session:
            </label>
            <select
              value={currentLectureId || ''}
              onChange={(e) => setSelectedLectureId(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {liveLectures.map(lec => (
                <option key={lec.lectureId} value={lec.lectureId}>
                  {lec.courseCode} ({lec.sectionCode}) - {lec.hall}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Lecture Details Strip */}
        {lectureDetails && (
          <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Subject:</span>
              <strong className="text-white font-mono">{lectureDetails.course.code}</strong>
              <div className="text-[11px] text-slate-400 truncate">{lectureDetails.course.title}</div>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Hall Location:</span>
              <strong className="text-white flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                {lectureDetails.lecture.hall}
              </strong>
              <div className="text-[11px] text-slate-400">Geofence: 65m radius</div>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Scheduled Time:</span>
              <strong className="text-white font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                {lectureDetails.lecture.startTime} - {lectureDetails.lecture.endTime}
              </strong>
              <div className="text-[11px] text-slate-400">Grace: 10m / Cutoff: 25m</div>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Current Occupancy:</span>
              <strong className="text-emerald-400 font-mono text-sm">
                {lectureDetails.checkedInCount} / {lectureDetails.enrolledCount} Checked In
              </strong>
              <div className="text-[11px] text-slate-400">
                {Math.round((lectureDetails.checkedInCount / (lectureDetails.enrolledCount || 1)) * 100)}% verified presence
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Tabs: Dynamic QR Projector vs Live Roster */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('qr')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeSubTab === 'qr'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Dynamic QR Code Projector Screen</span>
        </button>

        <button
          onClick={() => setActiveSubTab('roster')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeSubTab === 'roster'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Section Roster & Roll Call Override</span>
        </button>
      </div>

      {/* Content */}
      {activeSubTab === 'qr' ? (
        <DynamicQRCodeGenerator />
      ) : (
        <ManualOverrideSheet />
      )}

    </div>
  );
};

