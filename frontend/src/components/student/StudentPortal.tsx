import React, { useState, useEffect } from 'react';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { api } from '../../services/api';
import { StudentDrillDownReport } from '../../types';
import { AttendanceTimeline } from './AttendanceTimeline';
import { AbsenceAppealModal } from './AbsenceAppealModal';
import { 
  GraduationCap, BookOpen, ShieldAlert, CheckCircle2, 
  AlertTriangle, Calendar, Award, Phone, Mail, UserCheck 
} from 'lucide-react';

export const StudentPortal: React.FC = () => {
  const { currentUser, allUsers, setCurrentUser } = useAttendanceStore();
  const [drillDownData, setDrillDownData] = useState<StudentDrillDownReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [appealLogId, setAppealLogId] = useState<string | null>(null);

  // If active user is student, use them; else fallback to first student
  const students = allUsers.filter(u => u.role === 'STUDENT');
  const targetStudentId = (currentUser?.role === 'STUDENT' ? currentUser.id : students[0]?.id) || 'stud-003';

  const loadStudentReport = async (sId: string) => {
    setLoading(true);
    try {
      const data = await api.getStudentDrillDown(sId);
      setDrillDownData(data);
    } catch (err) {
      console.error('Failed to load student drilldown:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (targetStudentId) {
      loadStudentReport(targetStudentId);
    }
  }, [targetStudentId]);

  const handleStudentSwitch = (sId: string) => {
    const stud = students.find(s => s.id === sId);
    if (stud) {
      setCurrentUser(stud);
    }
  };

  const student = drillDownData?.student;
  const overallPct = drillDownData?.overallAttendancePercentage || 0;
  const isAtRisk = drillDownData?.isAtRisk || false;

  return (
    <div className="space-y-6">
      
      {/* Student Profile Card & Switcher */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Avatar & Identifiers */}
          <div className="flex items-start gap-4">
            <img
              src={student?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={student?.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-academic-500/30 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white">{student?.name || 'Student Portal'}</h1>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isAtRisk 
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {isAtRisk ? 'AT-RISK DEFICIENCY' : 'ACADEMICALLY COMPLIANT'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                <span>ID: <strong className="text-slate-200">{student?.universityId}</strong></span>
                <span>•</span>
                <span>Dept: <strong className="text-slate-200">{student?.departmentId.replace('dept-', '').toUpperCase()}</strong></span>
                <span>•</span>
                <span>Class: <strong className="text-slate-200">{student?.classYear}</strong></span>
                <span>•</span>
                <span>GPA: <strong className="text-amber-400">{student?.gpa || '3.50'}</strong></span>
              </div>

              <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-2">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  {student?.email}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  {student?.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Overall Attendance Stat Gauge */}
          <div className="flex items-center gap-5 p-4 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Cumulative Attendance
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className={`text-3xl font-black font-mono ${
                  overallPct >= 80 ? 'text-emerald-400' : overallPct >= 75 ? 'text-academic-400' : 'text-rose-400'
                }`}>
                  {overallPct}%
                </span>
                <span className="text-xs text-slate-500 font-mono">/ 75% required</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {drillDownData?.totalClassesEnrolled} active courses enrolled
              </p>
            </div>

            {/* Quick Switcher */}
            <div className="border-l border-slate-800 pl-4">
              <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                Inspect Another Student:
              </label>
              <select
                value={targetStudentId}
                onChange={(e) => handleStudentSwitch(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.universityId})
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* Enrolled Courses Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-academic-400" />
            <span>Enrolled Subjects & Attendance Breakdown</span>
          </h2>
          <span className="text-xs text-slate-400">
            Mandatory examination eligibility threshold: <strong>75.0%</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drillDownData?.courses.map((crs) => {
            const isCritical = crs.attendancePercentage < 75;
            const isWarning = crs.attendancePercentage >= 75 && crs.attendancePercentage < 80;

            const badgeColor = 
              isCritical ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
              isWarning ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
              'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';

            const progressColor = 
              isCritical ? 'bg-rose-500' :
              isWarning ? 'bg-amber-500' :
              'bg-emerald-500';

            return (
              <div 
                key={crs.courseId}
                className={`p-4 rounded-xl border bg-slate-900/90 transition-all ${
                  isCritical ? 'border-rose-500/40 shadow-sm' : 'border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <span className="font-mono text-xs font-bold text-academic-400">
                      {crs.courseCode} • {crs.sectionCode}
                    </span>
                    <h3 className="text-xs font-bold text-white truncate mt-0.5">
                      {crs.courseTitle}
                    </h3>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                    {crs.status}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 space-y-1 mb-3">
                  <div>Instructor: <strong className="text-slate-300">{crs.instructorName}</strong></div>
                  <div>Credits: <strong className="text-slate-300">{crs.credits} Units</strong></div>
                </div>

                {/* Progress bar with 75% indicator */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Attendance:</span>
                    <strong className={isCritical ? 'text-rose-400' : 'text-emerald-400'}>
                      {crs.attendancePercentage}%
                    </strong>
                  </div>

                  <div className="relative w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                      style={{ width: `${crs.attendancePercentage}%` }}
                    />
                  </div>

                  {/* Telemetry pill */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                    <span className="text-emerald-400">{crs.attendedCount} Present</span>
                    <span className="text-amber-400">{crs.lateCount} Late</span>
                    <span className="text-rose-400">{crs.absentCount} Absent</span>
                    <span className="text-sky-400">{crs.excusedCount} Excused</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Attendance Timeline */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-academic-400" />
              <span>Historical Session Logs & Excusal Appeals</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Detailed chronological record of every physical and electronic check-in
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {drillDownData?.recentLogs.length} Records Logged
          </span>
        </div>

        <AttendanceTimeline
          logs={drillDownData?.recentLogs || []}
          onOpenAppeal={(logId) => setAppealLogId(logId)}
        />
      </div>

      {/* Absence Appeal Modal */}
      {appealLogId && student && (
        <AbsenceAppealModal
          logId={appealLogId}
          studentId={student.id}
          onClose={() => setAppealLogId(null)}
          onSuccess={() => loadStudentReport(student.id)}
        />
      )}

    </div>
  );
};

