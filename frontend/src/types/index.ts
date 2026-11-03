export type UserRole = 'ADMIN' | 'PROFESSOR' | 'STUDENT';

export type AttendanceStatus = 'PRESENT' | 'LATE' | 'ABSENT' | 'EXCUSED';

export type CheckInMethod = 
  | 'RFID_SCAN' 
  | 'DYNAMIC_QR' 
  | 'GEOFENCE_GPS' 
  | 'MANUAL_OVERRIDE' 
  | 'SYSTEM_AUTO';

export type LectureStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type AppealStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type WarningStage = 'STAGE_1_CAUTION' | 'STAGE_2_PROBATION' | 'STAGE_3_DEBARMENT';

export interface Department {
  id: string;
  code: string;
  name: string;
  building: string;
  headOfDepartment: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  departmentId: string;
  credits: number;
  semester: string;
  description?: string;
}

export interface Section {
  id: string;
  sectionCode: string;
  courseId: string;
  instructorId: string;
  capacity: number;
  defaultRoom: string;
  scheduleTime: string;
}

export interface User {
  id: string;
  universityId: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId: string;
  rfidBadgeId?: string;
  classYear?: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
  avatarUrl?: string;
  gpa?: number;
  phone?: string;
}

export interface Lecture {
  id: string;
  sectionId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  hall: string;
  geofenceLat: number;
  geofenceLng: number;
  geofenceRadiusMeters: number;
  dynamicQrSecret?: string;
  dynamicQrCode?: string;
  dynamicQrExpiresAt?: string;
  status: LectureStatus;
  gracePeriodMinutes: number;
  lateCutoffMinutes: number;
}

export interface AttendanceLog {
  id: string;
  lectureId: string;
  studentId: string;
  status: AttendanceStatus;
  checkInTime?: string;
  checkInMethod: CheckInMethod;
  deviceIp?: string;
  gpsLat?: number;
  gpsLng?: number;
  distanceFromHallMeters?: number;
  verifiedByInstructor: boolean;
  notes?: string;
}

export interface AbsenceAppeal {
  id: string;
  attendanceLogId: string;
  studentId: string;
  reasonCategory: 'MEDICAL' | 'ACADEMIC_CONFLICT' | 'EMERGENCY' | 'ATHLETIC_REPRESENTATION' | 'OTHER';
  explanation: string;
  documentUrl?: string;
  status: AppealStatus;
  submittedAt: string;
  reviewedBy?: string;
  reviewerComment?: string;
}

export interface AcademicWarningLetter {
  id: string;
  studentId: string;
  courseId: string;
  attendancePercentage: number;
  thresholdPercentage: number;
  warningStage: WarningStage;
  status: 'ISSUED' | 'ACKNOWLEDGED';
  letterBodyHtml: string;
  issuedAt: string;
  student?: User;
  course?: Course;
}

export interface DashboardKPIs {
  dailyCampusAttendancePercentage: number;
  ongoingLecturesCount: number;
  totalStudentsCheckedInToday: number;
  totalStudentsExpectedToday: number;
  atRiskStudentsCount: number;
  liveLectures: Array<{
    lectureId: string;
    courseCode: string;
    courseTitle: string;
    sectionCode: string;
    instructorName: string;
    hall: string;
    timeSlot: string;
    status: LectureStatus;
    checkedInCount: number;
    totalEnrolled: number;
    occupancyPercentage: number;
    dynamicQrCode?: string;
  }>;
  weeklyDepartmentTrends: Array<{
    day: string;
    date: string;
    CSE: number;
    EE: number;
    ME: number;
    MGMT: number;
  }>;
  yearDistribution: Array<{
    name: string;
    count: number;
    presentPercentage: number;
    color: string;
  }>;
  recentActivityFeed: Array<{
    id: string;
    studentName: string;
    studentUniversityId: string;
    courseCode: string;
    hall: string;
    method: CheckInMethod;
    status: AttendanceStatus;
    timestamp: string;
  }>;
}

export interface CourseSummaryReport {
  courseId: string;
  courseCode: string;
  title: string;
  departmentCode: string;
  departmentName: string;
  semester: string;
  enrolledStudents: number;
  completedLectures: number;
  averageAttendancePercentage: number;
  criticallyLowLecturesCount: number;
  atRiskStudentsCount: number;
}

export interface AtRiskStudentReport {
  studentId: string;
  universityId: string;
  name: string;
  email: string;
  departmentCode: string;
  classYear: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  sectionCode: string;
  instructorName: string;
  totalLectures: number;
  attendedLectures: number;
  lateLectures: number;
  absentLectures: number;
  attendancePercentage: number;
  thresholdPercentage: number;
  warningStage: WarningStage;
  warningLetterIssued: boolean;
  warningLetterId?: string;
}

export interface StudentDrillDownReport {
  student: User;
  overallAttendancePercentage: number;
  isAtRisk: boolean;
  totalClassesEnrolled: number;
  courses: Array<{
    courseId: string;
    courseCode: string;
    courseTitle: string;
    sectionCode: string;
    instructorName: string;
    credits: number;
    totalLectures: number;
    attendedCount: number;
    lateCount: number;
    absentCount: number;
    excusedCount: number;
    attendancePercentage: number;
    status: 'GOOD' | 'WARNING' | 'CRITICAL';
  }>;
  recentLogs: Array<{
    id: string;
    lectureId: string;
    lectureTitle: string;
    courseCode: string;
    courseTitle: string;
    date: string;
    time: string;
    hall: string;
    status: AttendanceStatus;
    method: CheckInMethod;
    appeal?: AbsenceAppeal;
  }>;
}

