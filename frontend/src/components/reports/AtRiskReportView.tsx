import React, { useState } from 'react';
import { AtRiskStudentReport } from '../../types';
import { api } from '../../services/api';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { 
  ShieldAlert, Mail, FileText, CheckCircle2, 
  ExternalLink, UserSquare2, AlertTriangle, Sparkles 
} from 'lucide-react';

interface AtRiskReportViewProps {
  reports: AtRiskStudentReport[];
  loading: boolean;
  onViewLetter: (letterId: string) => void;
  onRefresh: () => void;
}

export const AtRiskReportView: React.FC<AtRiskReportViewProps> = ({
  reports,
  loading,
  onViewLetter,
  onRefresh
}) => {
  const { showToast, setCurrentUser, allUsers, setActiveView } = useAttendanceStore();
  const [issuingKey, setIssuingKey] = useState<string | null>(null);

  const handleIssueLetter = async (studentId: string, courseId: string) => {
    const key = `${studentId}-${courseId}`;
    setIssuingKey(key);

    try {
      const letter = await api.issueWarningLetter(studentId, courseId);
      showToast('success', 'Warning Letter Generated', `Official advisory created for student.`);
      onRefresh();
      onViewLetter(letter.id);
    } catch (err: any) {
      showToast('error', 'Generation Failed', err.message);
    } finally {
      setIssuingKey(null);
    }
  };

  const handleViewStudentPortal = (studentId: string) => {
    const stud = allUsers.find(u => u.id === studentId);
    if (stud) {
      setCurrentUser(stud);
      setActiveView('student-portal');
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-slate-400 text-xs">
        Scanning university attendance database for statutory compliance deficiencies...
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-8 text-center">
        <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
        <h3 className="text-sm font-bold text-white">Full Attendance Compliance</h3>
        <p className="text-xs text-slate-400 mt-1">
          No students are currently below the university attendance threshold in the selected filter scope.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {/* Overview Alert Box */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-rose-950/30 border border-rose-500/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Statutory Non-Compliance Advisory Active
            </h4>
            <p className="text-xs text-rose-200/80">
              {reports.length} student course enrollments currently violate the mandatory 75% attendance rule.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-rose-300 bg-rose-500/20 px-2.5 py-1 rounded-full border border-rose-500/30">
          Threshold: &lt;75.0%
        </span>
      </div>

      {/* Grid Table */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-850/50">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">University ID</th>
                <th className="py-3 px-4">Subject Under Review</th>
                <th className="py-3 px-4">Session Telemetry</th>
                <th className="py-3 px-4">Attendance Rate</th>
                <th className="py-3 px-4">Warning Classification</th>
                <th className="py-3 px-4 text-right">Academic Advisory Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {reports.map((item) => {
                const itemKey = `${item.studentId}-${item.courseId}`;
                const isIssuing = issuingKey === itemKey;

                return (
                  <tr key={itemKey} className="hover:bg-slate-850/40 transition">
                    
                    {/* Student Info */}
                    <td className="py-3 px-4">
                      <div>
                        <div 
                          onClick={() => handleViewStudentPortal(item.studentId)}
                          className="font-bold text-white hover:text-academic-300 cursor-pointer flex items-center gap-1.5"
                        >
                          <span>{item.name}</span>
                          <ExternalLink className="w-3 h-3 text-slate-500" />
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {item.classYear} • {item.departmentCode}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-300">
                      {item.universityId}
                    </td>

                    {/* Course */}
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-academic-400">{item.courseCode}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                        {item.courseTitle}
                      </div>
                    </td>

                    {/* Telemetry */}
                    <td className="py-3 px-4 font-mono text-xs">
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="text-emerald-400" title="Present">{item.attendedLectures}P</span>
                        <span className="text-slate-600">/</span>
                        <span className="text-amber-400" title="Late">{item.lateLectures}L</span>
                        <span className="text-slate-600">/</span>
                        <span className="text-rose-400 font-bold" title="Absent">{item.absentLectures}A</span>
                        <span className="text-slate-500 text-[10px]">({item.totalLectures} total)</span>
                      </div>
                    </td>

                    {/* Rate */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-rose-400 text-sm">
                          {item.attendancePercentage}%
                        </span>
                        <div className="w-14 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-rose-500 rounded-full"
                            style={{ width: `${item.attendancePercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Stage Badge */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.warningStage === 'STAGE_2_PROBATION'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        <AlertTriangle className="w-3 h-3" />
                        <span>{item.warningStage.replace(/_/g, ' ')}</span>
                      </span>
                    </td>

                    {/* Action: Warning Letter */}
                    <td className="py-3 px-4 text-right">
                      {item.warningLetterIssued && item.warningLetterId ? (
                        <button
                          onClick={() => onViewLetter(item.warningLetterId!)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-academic-300 hover:text-academic-200 border border-slate-700 transition"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Official Letter</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleIssueLetter(item.studentId, item.courseId)}
                          disabled={isIssuing}
                          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-sm transition disabled:opacity-50"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>{isIssuing ? 'Issuing...' : 'Generate Warning Letter'}</span>
                        </button>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

