import React, { useEffect } from 'react';
import { useAttendanceStore } from './store/useAttendanceStore';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { SmartCaptureHub } from './components/capture/SmartCaptureHub';
import { AcademicReportsModule } from './components/reports/AcademicReportsModule';
import { StudentPortal } from './components/student/StudentPortal';
import { ProfessorConsole } from './components/professor/ProfessorConsole';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export const App: React.FC = () => {
  const { 
    activeView, 
    initializeSystem, 
    isLoading, 
    toast, 
    clearToast 
  } = useAttendanceStore();

  useEffect(() => {
    initializeSystem();
  }, [initializeSystem]);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {isLoading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-3 text-slate-400 text-xs">
              <div className="w-8 h-8 border-2 border-academic-500 border-t-transparent rounded-full animate-spin" />
              <span>Initializing University Attendance Telemetry & In-Memory Registry...</span>
            </div>
          ) : (
            <>
              {activeView === 'dashboard' && <DashboardOverview />}
              {activeView === 'capture' && <SmartCaptureHub />}
              {activeView === 'reports' && <AcademicReportsModule />}
              {activeView === 'student-portal' && <StudentPortal />}
              {activeView === 'professor-console' && <ProfessorConsole />}
            </>
          )}
        </main>
      </div>

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 duration-200">
          <div className={`p-4 rounded-xl shadow-2xl border flex items-start gap-3 backdrop-blur-md ${
            toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200' :
            toast.type === 'error' ? 'bg-rose-950/90 border-rose-500/40 text-rose-200' :
            'bg-slate-900/90 border-slate-700 text-slate-200'
          }`}>
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-academic-400 shrink-0 mt-0.5" />}
            
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-xs">{toast.title}</p>
              <p className="text-[11px] mt-0.5 leading-relaxed text-slate-300">{toast.message}</p>
            </div>

            <button
              onClick={clearToast}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;

