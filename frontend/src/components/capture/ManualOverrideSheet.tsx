import React, { useState, useEffect } from 'react';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { api } from '../../services/api';
import { AttendanceStatus } from '../../types';
import { StatusBadge, MethodBadge } from '../common/StatusBadge';
import { 
  Edit3, Search, Check, Clock, X, Shield, 
  RotateCcw, Sparkles 
} from 'lucide-react';

export const ManualOverrideSheet: React.FC = () => {
  const { kpis, selectedLectureId, refreshDashboard, showToast } = useAttendanceStore();
  const [lectureData, setLectureData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const liveLectures = kpis?.liveLectures || [];
  const currentLectureId = selectedLectureId || liveLectures[0]?.lectureId;

  const loadLectureRoster = async (id: string) => {
    try {
      const data = await api.getLiveLecture(id);
      setLectureData(data);
    } catch (err: any) {
      console.error('Failed to load lecture roster:', err);
    }
  };

  useEffect(() => {
    if (currentLectureId) {
      loadLectureRoster(currentLectureId);
    }
  }, [currentLectureId]);

  const handleUpdateStatus = async (studentId: string, status: AttendanceStatus) => {
    if (!currentLectureId) return;
    setUpdatingId(studentId);

    try {
      await api.manualOverride(currentLectureId, studentId, status, 'Instructor roll call override');
      showToast('success', 'Status Updated', `Student marked as ${status}.`);
      await loadLectureRoster(currentLectureId);
      await refreshDashboard();
    } catch (err: any) {
      showToast('error', 'Update Failed', err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredStudents = lectureData?.students?.filter((s: any) => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.universityId.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-4">
      
      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search enrolled students by name or ID..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-academic-500"
          />
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400">
            Total Enrolled: <strong className="text-white font-mono">{lectureData?.enrolledCount || 0}</strong>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">
            Checked In: <strong className="text-emerald-400 font-mono">{lectureData?.checkedInCount || 0}</strong>
          </span>
        </div>
      </div>

      {/* Roster Table */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-850/50">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">University ID</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4">Method / Time</th>
                <th className="py-3 px-4 text-right">Manual Override Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No enrolled students match your search filter.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stud: any) => {
                  const isUpdating = updatingId === stud.id;

                  return (
                    <tr key={stud.id} className="hover:bg-slate-850/40 transition">
                      
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={stud.avatarUrl}
                            alt={stud.name}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
                          />
                          <div>
                            <div className="font-semibold text-white">{stud.name}</div>
                            <div className="text-[11px] text-slate-400">{stud.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-300">
                        {stud.universityId}
                      </td>

                      <td className="py-3 px-4">
                        <StatusBadge status={stud.status} size="sm" />
                      </td>

                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {stud.checkInTime ? (
                          <div className="space-y-0.5">
                            <MethodBadge method={stud.checkInMethod} />
                            <div className="font-mono text-[10px] text-slate-500">
                              {new Date(stud.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-600 font-mono italic">No check-in</span>
                        )}
                      </td>

                      {/* 1-Click Status Toggles */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                          
                          <button
                            onClick={() => handleUpdateStatus(stud.id, 'PRESENT')}
                            disabled={isUpdating}
                            title="Mark Present"
                            className={`p-1.5 rounded text-xs transition ${
                              stud.status === 'PRESENT' 
                                ? 'bg-emerald-500/20 text-emerald-300 font-bold' 
                                : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleUpdateStatus(stud.id, 'LATE')}
                            disabled={isUpdating}
                            title="Mark Late"
                            className={`p-1.5 rounded text-xs transition ${
                              stud.status === 'LATE' 
                                ? 'bg-amber-500/20 text-amber-300 font-bold' 
                                : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleUpdateStatus(stud.id, 'ABSENT')}
                            disabled={isUpdating}
                            title="Mark Absent"
                            className={`p-1.5 rounded text-xs transition ${
                              stud.status === 'ABSENT' 
                                ? 'bg-rose-500/20 text-rose-300 font-bold' 
                                : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800'
                            }`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleUpdateStatus(stud.id, 'EXCUSED')}
                            disabled={isUpdating}
                            title="Mark Excused"
                            className={`p-1.5 rounded text-xs transition ${
                              stud.status === 'EXCUSED' 
                                ? 'bg-sky-500/20 text-sky-300 font-bold' 
                                : 'text-slate-400 hover:text-sky-400 hover:bg-slate-800'
                            }`}
                          >
                            <Shield className="w-3.5 h-3.5" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

