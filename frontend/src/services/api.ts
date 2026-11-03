import { 
  DashboardKPIs, CourseSummaryReport, AtRiskStudentReport, 
  StudentDrillDownReport, AcademicWarningLetter, Department, 
  Course, Section, User, Lecture, AttendanceStatus 
} from '../types';

const API_BASE = '/api';

export const api = {
  // Dashboard
  getDashboardKPIs: async (): Promise<DashboardKPIs> => {
    const res = await fetch(`${API_BASE}/dashboard/kpis`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to fetch dashboard KPIs');
    return json.data;
  },

  getLiveLecture: async (lectureId: string) => {
    const res = await fetch(`${API_BASE}/dashboard/lecture/${lectureId}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to fetch lecture details');
    return json.data;
  },

  // Check-In Engine
  rfidScan: async (rfidBadgeId: string, lectureId?: string) => {
    const res = await fetch(`${API_BASE}/attendance/rfid-scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rfidBadgeId, lectureId })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'RFID scan failed');
    return json;
  },

  dynamicQrScan: async (qrToken: string, studentId: string, lectureId: string) => {
    const res = await fetch(`${API_BASE}/attendance/dynamic-qr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qrToken, studentId, lectureId })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Dynamic QR validation failed');
    return json;
  },

  geofenceCheckIn: async (studentId: string, lectureId: string, lat: number, lng: number) => {
    const res = await fetch(`${API_BASE}/attendance/geofence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, lectureId, lat, lng })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Geofence check-in failed');
    return json;
  },

  manualOverride: async (lectureId: string, studentId: string, status: AttendanceStatus, notes?: string) => {
    const res = await fetch(`${API_BASE}/attendance/override`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lectureId, studentId, status, notes })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Manual override failed');
    return json;
  },

  rotateQr: async (lectureId: string) => {
    const res = await fetch(`${API_BASE}/attendance/rotate-qr/${lectureId}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to rotate QR');
    return json.data;
  },

  submitAppeal: async (payload: {
    studentId: string;
    attendanceLogId: string;
    reasonCategory: string;
    explanation: string;
    documentUrl?: string;
  }) => {
    const res = await fetch(`${API_BASE}/attendance/appeal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Appeal submission failed');
    return json;
  },

  resetDemoData: async () => {
    const res = await fetch(`${API_BASE}/attendance/reset-demo`, {
      method: 'POST'
    });
    return res.json();
  },

  // Reports
  getCourseSummaries: async (departmentId?: string, semester?: string): Promise<CourseSummaryReport[]> => {
    const params = new URLSearchParams();
    if (departmentId) params.append('departmentId', departmentId);
    if (semester) params.append('semester', semester);
    const res = await fetch(`${API_BASE}/reports/course-summaries?${params.toString()}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to fetch course summaries');
    return json.data;
  },

  getAtRiskStudents: async (departmentId?: string, courseId?: string, threshold?: number): Promise<AtRiskStudentReport[]> => {
    const params = new URLSearchParams();
    if (departmentId) params.append('departmentId', departmentId);
    if (courseId) params.append('courseId', courseId);
    if (threshold) params.append('threshold', String(threshold));
    const res = await fetch(`${API_BASE}/reports/at-risk-students?${params.toString()}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to fetch at-risk report');
    return json.data;
  },

  issueWarningLetter: async (studentId: string, courseId: string): Promise<AcademicWarningLetter> => {
    const res = await fetch(`${API_BASE}/reports/warning-letter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, courseId })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to issue warning letter');
    return json.data;
  },

  getWarningLetter: async (letterId: string): Promise<AcademicWarningLetter> => {
    const res = await fetch(`${API_BASE}/reports/warning-letter/${letterId}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to fetch warning letter');
    return json.data;
  },

  getStudentDrillDown: async (studentId: string): Promise<StudentDrillDownReport> => {
    const res = await fetch(`${API_BASE}/reports/student-drilldown/${studentId}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to fetch student report');
    return json.data;
  },

  // Academic Meta
  getDepartments: async (): Promise<Department[]> => {
    const res = await fetch(`${API_BASE}/academic/departments`);
    const json = await res.json();
    return json.data || [];
  },

  getCourses: async (deptId?: string): Promise<Course[]> => {
    const params = deptId ? `?departmentId=${deptId}` : '';
    const res = await fetch(`${API_BASE}/academic/courses${params}`);
    const json = await res.json();
    return json.data || [];
  },

  getUsers: async (role?: string): Promise<User[]> => {
    const params = role ? `?role=${role}` : '';
    const res = await fetch(`${API_BASE}/academic/users${params}`);
    const json = await res.json();
    return json.data || [];
  },

  getLectures: async (status?: string): Promise<Lecture[]> => {
    const params = status ? `?status=${status}` : '';
    const res = await fetch(`${API_BASE}/academic/lectures${params}`);
    const json = await res.json();
    return json.data || [];
  }
};

