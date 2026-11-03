import React from 'react';
import { CourseSummaryReport } from '../../types';
import { 
  AlertTriangle, BookOpen, Users, CheckCircle2, 
  ChevronRight, TrendingDown 
} from 'lucide-react';

interface CourseSummaryViewProps {
  summaries: CourseSummaryReport[];
  loading: boolean;
  onSelectCourse?: (courseId: string) => void;
}

export const CourseSummaryView: React.FC<CourseSummaryViewProps> = ({
  summaries,
  loading,
  onSelectCourse
}) => {
  if (loading) {
    return (
      <div className="py-12 text-center text-slate-400 text-xs">
        Aggregating cross-departmental course attendance records...
      </div>
    );
  }

  if (summaries.length === 0) {
    return (
      <div className="py-12 text-center text-slate-500 text-xs">
        No courses found matching the active department and semester filter.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-850/50">
                <th className="py-3 px-4">Course Code & Title</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Enrolled</th>
                <th className="py-3 px-4">Completed Sessions</th>
                <th className="py-3 px-4">Average Attendance</th>
                <th className="py-3 px-4">Critically Low Lectures</th>
                <th className="py-3 px-4 text-right">Students At Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {summaries.map((course) => {
                const avgColor = 
                  course.averageAttendancePercentage >= 85 ? 'text-emerald-400' :
                  course.averageAttendancePercentage >= 75 ? 'text-academic-400' :
                  'text-rose-400';

                const hasCriticalLectures = course.criticallyLowLecturesCount > 0;

                return (
                  <tr 
                    key={course.courseId} 
                    onClick={() => onSelectCourse && onSelectCourse(course.courseId)}
                    className="hover:bg-slate-850/40 transition cursor-pointer group"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-academic-500/10 border border-academic-500/20 flex items-center justify-center text-academic-400 shrink-0">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-academic-300 font-mono">
                            {course.courseCode}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-xs">
                            {course.title}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                        {course.departmentCode}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-white">
                      {course.enrolledStudents} students
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-300">
                      {course.completedLectures} lectures
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-bold text-sm ${avgColor}`}>
                          {course.averageAttendancePercentage}%
                        </span>
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                          <div 
                            className={`h-full rounded-full ${
                              course.averageAttendancePercentage >= 85 ? 'bg-emerald-500' :
                              course.averageAttendancePercentage >= 75 ? 'bg-academic-500' :
                              'bg-rose-500'
                            }`}
                            style={{ width: `${course.averageAttendancePercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Low Attendance Spotter (< 65%) */}
                    <td className="py-3 px-4">
                      {hasCriticalLectures ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          <span>{course.criticallyLowLecturesCount} Low Sessions</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/70" />
                          <span>All &gt;65%</span>
                        </span>
                      )}
                    </td>

                    {/* At-risk students in this course */}
                    <td className="py-3 px-4 text-right">
                      {course.atRiskStudentsCount > 0 ? (
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                          <TrendingDown className="w-3.5 h-3.5" />
                          {course.atRiskStudentsCount} Flagged
                        </span>
                      ) : (
                        <span className="font-mono text-slate-500">0</span>
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

