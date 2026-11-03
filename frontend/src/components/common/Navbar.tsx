import React, { useState, useEffect } from 'react';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { 
  GraduationCap, ShieldAlert, UserCheck, BookOpen, 
  RotateCcw, Sparkles, ChevronDown 
} from 'lucide-react';
import { api } from '../../services/api';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const { 
    activePersona, 
    currentUser, 
    setActivePersona, 
    setCurrentUser,
    allUsers, 
    refreshDashboard, 
    showToast,
    kpis
  } = useAttendanceStore();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [isResetting, setIsResetting] = useState(false);
  const [personaMenuOpen, setPersonaMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await api.resetDemoData();
      await refreshDashboard();
      showToast('success', 'System Re-Seeded', 'University academic attendance registry restored to pristine demo state.');
    } catch (err: any) {
      showToast('error', 'Reset Failed', err.message);
    } finally {
      setIsResetting(false);
    }
  };

  const handleSelectRole = (role: UserRole) => {
    setActivePersona(role);
    setPersonaMenuOpen(false);
  };

  const handleSelectUser = (user: any) => {
    setCurrentUser(user);
    setPersonaMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-academic-600 via-academic-500 to-indigo-500 p-0.5 shadow-lg shadow-academic-500/20">
            <div className="h-full w-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-academic-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-white text-lg font-mono">VERITAS</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-academic-500/20 text-academic-300 border border-academic-500/30">
                ATTENDANCE OS
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">University Smart Academic Tracking & Reporting</p>
          </div>
        </div>

        {/* Center: Live Clock & Campus Status */}
        <div className="hidden md:flex items-center gap-4 bg-slate-850 px-3.5 py-1.5 rounded-full border border-slate-700/60">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Fall 2026 Live</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-xs font-mono text-slate-300 font-medium">{currentTime}</span>
          <span className="text-slate-600">|</span>
          <span className="text-xs text-slate-400">
            <strong className="text-white">{kpis?.dailyCampusAttendancePercentage || 90.4}%</strong> Campus Attendance
          </span>
        </div>

        {/* Right Actions: Persona Switcher & Demo Reset */}
        <div className="flex items-center gap-3">
          
          {/* Quick Demo Reset */}
          <button
            onClick={handleReset}
            disabled={isResetting}
            title="Reset Mock Data to initial state"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin text-academic-400' : ''}`} />
            <span>Reset Demo</span>
          </button>

          {/* Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setPersonaMenuOpen(!personaMenuOpen)}
              className="flex items-center gap-2.5 bg-slate-800 hover:bg-slate-750 px-3 py-1.5 rounded-xl border border-slate-700 hover:border-slate-600 transition shadow-sm"
            >
              <div className="relative">
                <img
                  src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={currentUser?.name || 'User'}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-academic-500/40"
                />
                <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-slate-900 ${
                  activePersona === 'ADMIN' ? 'bg-rose-500' : activePersona === 'PROFESSOR' ? 'bg-indigo-500' : 'bg-emerald-500'
                }`} />
              </div>

              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1.5">
                  <span>{currentUser?.name || 'Active User'}</span>
                  <span className={`text-[9px] uppercase px-1 py-0.2 rounded font-bold ${
                    activePersona === 'ADMIN' ? 'bg-rose-500/20 text-rose-300' :
                    activePersona === 'PROFESSOR' ? 'bg-indigo-500/20 text-indigo-300' :
                    'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {activePersona}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {currentUser?.universityId || 'Switch persona'}
                </div>
              </div>

              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {/* Persona Switcher Menu */}
            {personaMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-850 border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-700/60 mb-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Switch Role Persona</p>
                  <p className="text-xs text-slate-300">Experience system as administrator, faculty, or student.</p>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => handleSelectRole('ADMIN')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs transition ${
                      activePersona === 'ADMIN' ? 'bg-rose-500/15 text-rose-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="p-1.5 rounded-md bg-rose-500/20 text-rose-400">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-white">University Administrator</div>
                      <div className="text-[11px] text-slate-400">Dr. Eleanor Vance (Dean & Registrar)</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectRole('PROFESSOR')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs transition ${
                      activePersona === 'PROFESSOR' ? 'bg-indigo-500/15 text-indigo-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="p-1.5 rounded-md bg-indigo-500/20 text-indigo-400">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Professor / Instructor</div>
                      <div className="text-[11px] text-slate-400">Prof. Marcus Chen (CS-101 / CS-404)</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectRole('STUDENT')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs transition ${
                      activePersona === 'STUDENT' ? 'bg-emerald-500/15 text-emerald-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="p-1.5 rounded-md bg-emerald-500/20 text-emerald-400">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Student (At-Risk Profile)</div>
                      <div className="text-[11px] text-slate-400">Devon Miller (U26CSE003 - 62% Att.)</div>
                    </div>
                  </button>
                </div>

                {/* Quick Student Switcher for testing drill-downs */}
                <div className="mt-2 pt-2 border-t border-slate-700/60">
                  <div className="px-2 py-1 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                    <span>Quick Select Student</span>
                    <Sparkles className="w-3 h-3 text-academic-400" />
                  </div>
                  <div className="max-h-36 overflow-y-auto space-y-0.5 text-xs">
                    {allUsers.filter(u => u.role === 'STUDENT').slice(0, 5).map(stud => (
                      <button
                        key={stud.id}
                        onClick={() => handleSelectUser(stud)}
                        className="w-full text-left px-2 py-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-between text-[11px]"
                      >
                        <span className="truncate">{stud.name}</span>
                        <span className="font-mono text-[10px] text-slate-400">{stud.universityId}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};

