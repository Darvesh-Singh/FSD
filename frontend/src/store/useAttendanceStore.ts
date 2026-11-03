import { create } from 'zustand';
import { 
  User, UserRole, DashboardKPIs, Department, Course, Lecture 
} from '../types';
import { api } from '../services/api';

interface AttendanceStoreState {
  // Navigation & Persona
  activePersona: UserRole;
  currentUser: User | null;
  activeView: 'dashboard' | 'capture' | 'reports' | 'student-portal' | 'professor-console';
  
  // Data State
  kpis: DashboardKPIs | null;
  departments: Department[];
  courses: Course[];
  allUsers: User[];
  activeLectures: Lecture[];
  selectedLectureId: string | null;

  // Filters
  selectedDepartmentId: string;
  selectedCourseId: string;
  selectedSemester: string;
  atRiskThreshold: number;

  // UI Modals & Notifications
  activeWarningLetterId: string | null;
  appealModalLogId: string | null;
  toast: { type: 'success' | 'error' | 'info'; title: string; message: string } | null;
  isLoading: boolean;

  // Actions
  setActivePersona: (role: UserRole) => void;
  setCurrentUser: (user: User) => void;
  setActiveView: (view: 'dashboard' | 'capture' | 'reports' | 'student-portal' | 'professor-console') => void;
  setSelectedDepartmentId: (id: string) => void;
  setSelectedCourseId: (id: string) => void;
  setSelectedSemester: (sem: string) => void;
  setAtRiskThreshold: (val: number) => void;
  setSelectedLectureId: (id: string | null) => void;
  setActiveWarningLetterId: (id: string | null) => void;
  setAppealModalLogId: (id: string | null) => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
  clearToast: () => void;
  
  // Async fetchers
  refreshDashboard: () => Promise<void>;
  initializeSystem: () => Promise<void>;
}

export const useAttendanceStore = create<AttendanceStoreState>((set, get) => ({
  activePersona: 'ADMIN',
  currentUser: null,
  activeView: 'dashboard',

  kpis: null,
  departments: [],
  courses: [],
  allUsers: [],
  activeLectures: [],
  selectedLectureId: null,

  selectedDepartmentId: 'ALL',
  selectedCourseId: 'ALL',
  selectedSemester: 'Fall 2026',
  atRiskThreshold: 75,

  activeWarningLetterId: null,
  appealModalLogId: null,
  toast: null,
  isLoading: false,

  setActivePersona: (role: UserRole) => {
    const { allUsers } = get();
    // Find representative user for this role
    let repUser: User | null = null;
    if (role === 'ADMIN') {
      repUser = allUsers.find(u => u.role === 'ADMIN') || null;
      set({ activePersona: role, currentUser: repUser, activeView: 'dashboard' });
    } else if (role === 'PROFESSOR') {
      repUser = allUsers.find(u => u.role === 'PROFESSOR') || null;
      set({ activePersona: role, currentUser: repUser, activeView: 'professor-console' });
    } else {
      // Pick an interesting student (e.g. Devon Miller who has at-risk or Camila)
      repUser = allUsers.find(u => u.role === 'STUDENT' && u.name.includes('Devon')) || 
                allUsers.find(u => u.role === 'STUDENT') || null;
      set({ activePersona: role, currentUser: repUser, activeView: 'student-portal' });
    }
  },

  setCurrentUser: (user: User) => {
    set({ currentUser: user, activePersona: user.role });
  },

  setActiveView: (view) => set({ activeView: view }),
  setSelectedDepartmentId: (id) => set({ selectedDepartmentId: id, selectedCourseId: 'ALL' }),
  setSelectedCourseId: (id) => set({ selectedCourseId: id }),
  setSelectedSemester: (sem) => set({ selectedSemester: sem }),
  setAtRiskThreshold: (val) => set({ atRiskThreshold: val }),
  setSelectedLectureId: (id) => set({ selectedLectureId: id }),
  setActiveWarningLetterId: (id) => set({ activeWarningLetterId: id }),
  setAppealModalLogId: (id) => set({ appealModalLogId: id }),

  showToast: (type, title, message) => {
    set({ toast: { type, title, message } });
    setTimeout(() => {
      if (get().toast?.title === title) {
        set({ toast: null });
      }
    }, 4500);
  },

  clearToast: () => set({ toast: null }),

  refreshDashboard: async () => {
    try {
      const kpis = await api.getDashboardKPIs();
      set({ kpis });
    } catch (err: any) {
      console.error('Error refreshing KPIs:', err);
    }
  },

  initializeSystem: async () => {
    set({ isLoading: true });
    try {
      const [kpis, departments, courses, users, lectures] = await Promise.all([
        api.getDashboardKPIs(),
        api.getDepartments(),
        api.getCourses(),
        api.getUsers(),
        api.getLectures('IN_PROGRESS')
      ]);

      const admin = users.find(u => u.role === 'ADMIN') || null;
      const inProgressLec = lectures[0] ? lectures[0].id : null;

      set({
        kpis,
        departments,
        courses,
        allUsers: users,
        activeLectures: lectures,
        currentUser: admin,
        selectedLectureId: inProgressLec,
        isLoading: false
      });
    } catch (err: any) {
      console.error('Failed to initialize attendance system:', err);
      set({ isLoading: false });
    }
  }
}));

