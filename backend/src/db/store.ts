import { 
  Department, Course, Section, User, Enrollment, Lecture, 
  AttendanceLog, AbsenceAppeal, AcademicWarningLetter,
  AttendanceStatus, CheckInMethod, LectureStatus, WarningStage,
  DashboardKPIs, CourseSummaryReport, AtRiskStudentReport, StudentDrillDownReport
} from '../models/types.js';
import { generateUniversityDataset } from '../services/mockGenerator.js';

class UniversityDataStore {
  public departments: Department[] = [];
  public courses: Course[] = [];
  public sections: Section[] = [];
  public users: User[] = [];
  public enrollments: Enrollment[] = [];
  public lectures: Lecture[] = [];
  public attendanceLogs: AttendanceLog[] = [];
  public absenceAppeals: AbsenceAppeal[] = [];
  public warningLetters: AcademicWarningLetter[] = [];

  constructor() {
    this.reset();
  }

  public reset() {
    const dataset = generateUniversityDataset();
    this.departments = dataset.departments;
    this.courses = dataset.courses;
    this.sections = dataset.sections;
    this.users = dataset.users;
    this.enrollments = dataset.enrollments;
    this.lectures = dataset.lectures;
    this.attendanceLogs = dataset.attendanceLogs;
    this.absenceAppeals = dataset.absenceAppeals;
    this.warningLetters = dataset.warningLetters;
  }

  // Dashboard Aggregations
  public getDashboardKPIs(): DashboardKPIs {
    const today = '2026-11-03';
    const todayLectures = this.lectures.filter(l => l.date === today);
    const inProgressLectures = todayLectures.filter(l => l.status === 'IN_PROGRESS');

    // Calculate daily campus attendance %
    const todayLogs = this.attendanceLogs.filter(log => {
      const lec = this.lectures.find(l => l.id === log.lectureId);
      return lec && lec.date === today;
    });

    const attendedTodayCount = todayLogs.filter(l => l.status === 'PRESENT' || l.status === 'LATE').length;
    const totalTodayLogs = todayLogs.length || 1;
    const dailyCampusAttendancePercentage = Number(((attendedTodayCount / totalTodayLogs) * 100).toFixed(1));

    // Calculate At-risk students count across all courses
    const atRiskReport = this.getAtRiskStudentsReport();
    const uniqueAtRiskStudents = new Set(atRiskReport.map(r => r.studentId)).size;

    // Live lecture feed
    const liveLectures = inProgressLectures.concat(todayLectures.filter(l => l.status === 'SCHEDULED')).map(lec => {
      const sec = this.sections.find(s => s.id === lec.sectionId)!;
      const course = this.courses.find(c => c.id === sec.courseId)!;
      const instructor = this.users.find(u => u.id === sec.instructorId)!;
      const enrolled = this.enrollments.filter(e => e.sectionId === sec.id).length;
      const checkedIn = this.attendanceLogs.filter(
        log => log.lectureId === lec.id && (log.status === 'PRESENT' || log.status === 'LATE')
      ).length;

      return {
        lectureId: lec.id,
        courseCode: course.code,
        courseTitle: course.title,
        sectionCode: sec.sectionCode,
        instructorName: instructor.name,
        hall: lec.hall,
        timeSlot: `${lec.startTime} - ${lec.endTime}`,
        status: lec.status,
        checkedInCount: checkedIn,
        totalEnrolled: enrolled,
        occupancyPercentage: enrolled > 0 ? Math.round((checkedIn / enrolled) * 100) : 0,
        dynamicQrCode: lec.dynamicQrCode
      };
    });

    // Weekly Trends across departments (past 5 working days)
    const days = [
      { day: 'Mon', date: 'Oct 26', CSE: 93, EE: 89, ME: 91, MGMT: 95 },
      { day: 'Tue', date: 'Oct 27', CSE: 91, EE: 87, ME: 88, MGMT: 92 },
      { day: 'Wed', date: 'Oct 28', CSE: 94, EE: 90, ME: 89, MGMT: 94 },
      { day: 'Thu', date: 'Oct 29', CSE: 88, EE: 84, ME: 86, MGMT: 90 },
      { day: 'Fri', date: 'Oct 30', CSE: 86, EE: 82, ME: 83, MGMT: 89 },
      { day: 'Mon', date: 'Nov 02', CSE: 92, EE: 88, ME: 90, MGMT: 93 },
      { day: 'Today', date: 'Nov 03', CSE: 91, EE: 86, ME: 89, MGMT: 94 }
    ];

    // Year Distribution
    const studentUsers = this.users.filter(u => u.role === 'STUDENT');
    const yearCounts: Record<string, { total: number; attended: number }> = {
      Freshman: { total: 0, attended: 0 },
      Sophomore: { total: 0, attended: 0 },
      Junior: { total: 0, attended: 0 },
      Senior: { total: 0, attended: 0 }
    };

    studentUsers.forEach(s => {
      const yr = s.classYear || 'Sophomore';
      if (!yearCounts[yr]) yearCounts[yr] = { total: 0, attended: 0 };
      yearCounts[yr].total++;
    });

    const yearColors: Record<string, string> = {
      Freshman: '#3b82f6',
      Sophomore: '#10b981',
      Junior: '#8b5cf6',
      Senior: '#f59e0b'
    };

    const yearDistribution = Object.entries(yearCounts).map(([yr, data]) => ({
      name: yr,
      count: data.total,
      presentPercentage: yr === 'Freshman' ? 92 : yr === 'Sophomore' ? 88 : yr === 'Junior' ? 84 : 89,
      color: yearColors[yr] || '#64748b'
    }));

    // Recent activity stream
    const checkedInLogs = this.attendanceLogs
      .filter(l => l.checkInTime && (l.status === 'PRESENT' || l.status === 'LATE'))
      .sort((a, b) => new Date(b.checkInTime!).getTime() - new Date(a.checkInTime!).getTime())
      .slice(0, 10);

    const recentActivityFeed = checkedInLogs.map(log => {
      const student = this.users.find(u => u.id === log.studentId)!;
      const lecture = this.lectures.find(l => l.id === log.lectureId)!;
      const sec = this.sections.find(s => s.id === lecture.sectionId)!;
      const course = this.courses.find(c => c.id === sec.courseId)!;

      return {
        id: log.id,
        studentName: student ? student.name : 'Unknown Student',
        studentUniversityId: student ? student.universityId : '',
        courseCode: course ? course.code : '',
        hall: lecture ? lecture.hall : '',
        method: log.checkInMethod,
        status: log.status,
        timestamp: log.checkInTime || new Date().toISOString()
      };
    });

    return {
      dailyCampusAttendancePercentage,
      ongoingLecturesCount: inProgressLectures.length,
      totalStudentsCheckedInToday: attendedTodayCount,
      totalStudentsExpectedToday: totalTodayLogs,
      atRiskStudentsCount: uniqueAtRiskStudents,
      liveLectures,
      weeklyDepartmentTrends: days,
      yearDistribution,
      recentActivityFeed
    };
  }

  // Course Summaries
  public getCourseSummaries(filters?: { departmentId?: string; semester?: string }): CourseSummaryReport[] {
    return this.courses
      .filter(c => {
        if (filters?.departmentId && filters.departmentId !== 'ALL' && c.departmentId !== filters.departmentId) return false;
        if (filters?.semester && filters.semester !== 'ALL' && c.semester !== filters.semester) return false;
        return true;
      })
      .map(course => {
        const dept = this.departments.find(d => d.id === course.departmentId)!;
        const courseSecs = this.sections.filter(s => s.courseId === course.id);
        const secIds = courseSecs.map(s => s.id);
        
        const courseLectures = this.lectures.filter(l => secIds.includes(l.sectionId));
        const completedLectures = courseLectures.filter(l => l.status === 'COMPLETED');
        const enrolledStudents = this.enrollments.filter(e => secIds.includes(e.sectionId)).length;

        // Completed logs
        const completedLecIds = completedLectures.map(l => l.id);
        const logs = this.attendanceLogs.filter(l => completedLecIds.includes(l.lectureId));
        const attended = logs.filter(l => l.status === 'PRESENT' || l.status === 'LATE').length;
        const totalPossible = logs.length || 1;
        const avgPercentage = Number(((attended / totalPossible) * 100).toFixed(1));

        // Lectures with critically low attendance (< 65%)
        let criticallyLowCount = 0;
        completedLectures.forEach(lec => {
          const lecLogs = logs.filter(l => l.lectureId === lec.id);
          const lecAtd = lecLogs.filter(l => l.status === 'PRESENT' || l.status === 'LATE').length;
          const lecTotal = lecLogs.length || 1;
          if ((lecAtd / lecTotal) < 0.65) {
            criticallyLowCount++;
          }
        });

        // Students at risk in this course (< 75%)
        const courseAtRisk = this.getAtRiskStudentsReport({ courseId: course.id });

        return {
          courseId: course.id,
          courseCode: course.code,
          title: course.title,
          departmentCode: dept.code,
          departmentName: dept.name,
          semester: course.semester,
          enrolledStudents,
          completedLectures: completedLectures.length,
          averageAttendancePercentage: avgPercentage,
          criticallyLowLecturesCount: criticallyLowCount,
          atRiskStudentsCount: courseAtRisk.length
        };
      });
  }

  // At-Risk Students Report (< 75% threshold)
  public getAtRiskStudentsReport(filters?: { departmentId?: string; courseId?: string; minThreshold?: number }): AtRiskStudentReport[] {
    const threshold = filters?.minThreshold ?? 75.0;
    const reports: AtRiskStudentReport[] = [];

    const activeSections = this.sections.filter(s => {
      if (filters?.courseId && filters.courseId !== 'ALL' && s.courseId !== filters.courseId) return false;
      return true;
    });

    activeSections.forEach(sec => {
      const course = this.courses.find(c => c.id === sec.courseId)!;
      if (filters?.departmentId && filters.departmentId !== 'ALL' && course.departmentId !== filters.departmentId) return;

      const dept = this.departments.find(d => d.id === course.departmentId)!;
      const instructor = this.users.find(u => u.id === sec.instructorId)!;
      const secLectures = this.lectures.filter(l => l.sectionId === sec.id && l.status === 'COMPLETED');
      const totalLectures = secLectures.length;
      if (totalLectures === 0) return;

      const secLecIds = secLectures.map(l => l.id);
      const secEnrollments = this.enrollments.filter(e => e.sectionId === sec.id);

      secEnrollments.forEach(enr => {
        const student = this.users.find(u => u.id === enr.studentId);
        if (!student) return;

        const studentLogs = this.attendanceLogs.filter(
          l => secLecIds.includes(l.lectureId) && l.studentId === student.id
        );

        const attended = studentLogs.filter(l => l.status === 'PRESENT').length;
        const late = studentLogs.filter(l => l.status === 'LATE').length;
        const absent = studentLogs.filter(l => l.status === 'ABSENT').length;
        const excused = studentLogs.filter(l => l.status === 'EXCUSED').length;

        // Weighted: Present = 1.0, Late = 0.75, Excused = 1.0
        const effectiveCount = attended + (late * 0.75) + excused;
        const percentage = Number(((effectiveCount / totalLectures) * 100).toFixed(1));

        if (percentage < threshold) {
          const existingLetter = this.warningLetters.find(
            w => w.studentId === student.id && w.courseId === course.id
          );

          const stage: WarningStage = percentage < 60 ? 'STAGE_2_PROBATION' : 'STAGE_1_CAUTION';

          reports.push({
            studentId: student.id,
            universityId: student.universityId,
            name: student.name,
            email: student.email,
            departmentCode: dept.code,
            classYear: student.classYear || 'Sophomore',
            courseId: course.id,
            courseCode: course.code,
            courseTitle: course.title,
            sectionCode: sec.sectionCode,
            instructorName: instructor.name,
            totalLectures,
            attendedLectures: attended,
            lateLectures: late,
            absentLectures: absent,
            attendancePercentage: percentage,
            thresholdPercentage: threshold,
            warningStage: stage,
            warningLetterIssued: !!existingLetter,
            warningLetterId: existingLetter?.id
          });
        }
      });
    });

    return reports.sort((a, b) => a.attendancePercentage - b.attendancePercentage);
  }

  // Individual Student Drill-Down
  public getStudentDrillDown(studentId: string): StudentDrillDownReport | null {
    const student = this.users.find(u => u.id === studentId);
    if (!student) return null;

    const studentEnrollments = this.enrollments.filter(e => e.studentId === studentId);
    let totalEnrolledLectures = 0;
    let totalAttendedWeighted = 0;

    const courseBreakdowns = studentEnrollments.map(enr => {
      const sec = this.sections.find(s => s.id === enr.sectionId)!;
      const course = this.courses.find(c => c.id === sec.courseId)!;
      const instructor = this.users.find(u => u.id === sec.instructorId)!;
      
      const secLectures = this.lectures.filter(l => l.sectionId === sec.id && l.status === 'COMPLETED');
      const totalLectures = secLectures.length;
      const secLecIds = secLectures.map(l => l.id);

      const logs = this.attendanceLogs.filter(
        l => secLecIds.includes(l.lectureId) && l.studentId === studentId
      );

      const attended = logs.filter(l => l.status === 'PRESENT').length;
      const late = logs.filter(l => l.status === 'LATE').length;
      const absent = logs.filter(l => l.status === 'ABSENT').length;
      const excused = logs.filter(l => l.status === 'EXCUSED').length;

      const effective = attended + (late * 0.75) + excused;
      const pct = totalLectures > 0 ? Number(((effective / totalLectures) * 100).toFixed(1)) : 100;

      totalEnrolledLectures += totalLectures;
      totalAttendedWeighted += effective;

      const status: 'GOOD' | 'WARNING' | 'CRITICAL' = pct >= 80 ? 'GOOD' : pct >= 75 ? 'WARNING' : 'CRITICAL';

      return {
        courseId: course.id,
        courseCode: course.code,
        courseTitle: course.title,
        sectionCode: sec.sectionCode,
        instructorName: instructor.name,
        credits: course.credits,
        totalLectures,
        attendedCount: attended,
        lateCount: late,
        absentCount: absent,
        excusedCount: excused,
        attendancePercentage: pct,
        status
      };
    });

    const overallPct = totalEnrolledLectures > 0 
      ? Number(((totalAttendedWeighted / totalEnrolledLectures) * 100).toFixed(1))
      : 100;

    // Student's complete attendance logs with appeals
    const studentLogs = this.attendanceLogs
      .filter(l => l.studentId === studentId)
      .map(log => {
        const lec = this.lectures.find(l => l.id === log.lectureId)!;
        const sec = this.sections.find(s => s.id === lec.sectionId)!;
        const course = this.courses.find(c => c.id === sec.courseId)!;
        const appeal = this.absenceAppeals.find(a => a.attendanceLogId === log.id);

        return {
          id: log.id,
          lectureId: lec.id,
          lectureTitle: lec.title,
          courseCode: course.code,
          courseTitle: course.title,
          date: lec.date,
          time: `${lec.startTime} - ${lec.endTime}`,
          hall: lec.hall,
          status: log.status,
          method: log.checkInMethod,
          appeal
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      student,
      overallAttendancePercentage: overallPct,
      isAtRisk: overallPct < 75.0,
      totalClassesEnrolled: studentEnrollments.length,
      courses: courseBreakdowns,
      recentLogs: studentLogs
    };
  }

  // Issue Academic Warning Letter
  public issueWarningLetter(studentId: string, courseId: string): AcademicWarningLetter {
    const student = this.users.find(u => u.id === studentId)!;
    const course = this.courses.find(c => c.id === courseId)!;
    
    // Calculate current percentage
    const drillDown = this.getStudentDrillDown(studentId);
    const courseStats = drillDown?.courses.find(c => c.courseId === courseId);
    const percentage = courseStats ? courseStats.attendancePercentage : 68.5;
    const stage: WarningStage = percentage < 60 ? 'STAGE_2_PROBATION' : 'STAGE_1_CAUTION';

    const letterId = `warn-${Date.now()}-${student.id}`;
    const newLetter: AcademicWarningLetter = {
      id: letterId,
      studentId: student.id,
      courseId: course.id,
      attendancePercentage: percentage,
      thresholdPercentage: 75.0,
      warningStage: stage,
      status: 'ISSUED',
      letterBodyHtml: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <div style="border-bottom: 2px solid #dc2626; padding-bottom: 12px; margin-bottom: 16px;">
            <h2 style="color: #991b1b; margin: 0 0 4px 0; font-size: 20px;">OFFICIAL NOTICE OF ACADEMIC ATTENDANCE DEFICIENCY</h2>
            <p style="color: #64748b; margin: 0; font-size: 13px;">OFFICE OF THE ACADEMIC REGISTRAR & BOARD OF UNDERGRADUATE STUDIES</p>
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 14px;">
            <tr><td style="padding: 4px 0; color: #64748b; width: 140px;">Student Name:</td><td style="font-weight: 600;">${student.name}</td></tr>
            <tr><td style="padding: 4px 0; color: #64748b;">University ID:</td><td style="font-weight: 600;">${student.universityId}</td></tr>
            <tr><td style="padding: 4px 0; color: #64748b;">Class Year & Major:</td><td>${student.classYear || 'Undergraduate'} (${student.departmentId.toUpperCase()})</td></tr>
            <tr><td style="padding: 4px 0; color: #64748b;">Course / Code:</td><td style="font-weight: 600; color: #0284c7;">${course.code} - ${course.title}</td></tr>
            <tr><td style="padding: 4px 0; color: #64748b;">Current Attendance:</td><td><strong style="color: #dc2626; font-size: 16px;">${percentage}%</strong> (Mandatory Requirement: <strong>75.0%</strong>)</td></tr>
            <tr><td style="padding: 4px 0; color: #64748b;">Advisory Classification:</td><td><span style="background: #fee2e2; color: #991b1b; padding: 2px 8px; border-radius: 4px; font-weight: 600;">${stage.replace(/_/g, ' ')}</span></td></tr>
          </table>
          <p>Dear <strong>${student.name}</strong>,</p>
          <p>This document serves as formal notification that your verified physical/electronic attendance in <strong>${course.code}</strong> has fallen critically below the statutory seventy-five percent (75%) institutional requirement.</p>
          <p>Under University Academic Regulation §14.8, students with persistent non-attendance are subject to administrative debarment from final semester examinations and forfeiture of course credit.</p>
          <div style="background: #f8fafc; border-left: 4px solid #f59e0b; padding: 12px; margin: 16px 0; font-size: 13px;">
            <strong>MANDATORY ACTIONS REQUIRED:</strong>
            <ol style="margin: 6px 0 0 16px; padding: 0;">
              <li>Acknowledge receipt of this formal advisory via the University Portal.</li>
              <li>Schedule an in-person attendance counseling conference with the course instructor within 5 business days.</li>
              <li>Submit legitimate documentation or doctor certificates for any unexcused historical absences.</li>
            </ol>
          </div>
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: space-between; font-size: 13px; color: #475569;">
            <div>
              <strong>Issued by:</strong> Dean of Academic Affairs & Registrar<br/>
              <em>Date of Dispatch: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</em>
            </div>
            <div style="text-align: right;">
              <span style="font-family: monospace; color: #94a3b8;">REF-ID: ${letterId}</span>
            </div>
          </div>
        </div>
      `,
      issuedAt: new Date().toISOString()
    };

    this.warningLetters.push(newLetter);
    return newLetter;
  }
}

export const dbStore = new UniversityDataStore();

