import React from 'react';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { 
  LayoutDashboard, Scan, FileSpreadsheet, 
  UserSquare2, Presentation, ShieldAlert,
  Flame, HelpCircle, Layers
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    kpis, 
    activePersona 
  } = useAttendanceStore();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Academic Dashboard',
      description: 'KPIs, live ticker & trends',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'PROFESSOR', 'STUDENT']
    },
    {
      id: 'capture',
      label: 'Smart Check-In Hub',
      description: 'RFID, Dynamic QR & Geofence',
      icon: Scan,
      badge: kpis?.ongoingLecturesCount ? `${kpis.ongoingLecturesCount} Live` : undefined,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      roles: ['ADMIN', 'PROFESSOR', 'STUDENT']
    },
    {
      id: 'reports',
      label: 'Academic Reports',
      description: 'Course data grid & At-Risk alerts',
      icon: FileSpreadsheet,
      badge: kpis?.atRiskStudentsCount ? `${kpis.atRiskStudentsCount} At Risk` : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
      roles: ['ADMIN', 'PROFESSOR']
    },
    {
      id: 'student-portal',
      label: 'Student Drill-Down',
      description: 'Subject stats & absence appeals',
      icon: UserSquare2,
      roles: ['ADMIN', 'PROFESSOR', 'STUDENT']
    },
    {
      id: 'professor-console',
      label: 'Instructor Console',
      description: 'Lecture controller & dynamic QR',
      icon: Presentation,
      roles: ['ADMIN', 'PROFESSOR']
    }
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block border-r border-slate-800 bg-slate-900/60 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        
        {/* Navigation Category */}
        <div>
          <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <span>Navigation Hub</span>
            <Layers className="w-3.5 h-3.5" />
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              const isRelevantForRole = item.roles.includes(activePersona);

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as any)}
                  className={`w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-xl transition duration-150 relative ${
                    isActive
                      ? 'bg-academic-600/20 text-white border border-academic-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  } ${!isRelevantForRole ? 'opacity-70' : ''}`}
                >
                  <div className={`mt-0.5 p-1.5 rounded-lg ${
                    isActive ? 'bg-academic-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold truncate text-slate-200">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {item.description}
                    </p>
                  </div>

                  {isActive && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-academic-500 rounded-r" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Live Academic System Stat Box */}
        <div className="rounded-xl bg-gradient-to-b from-slate-800/80 to-slate-850 p-3.5 border border-slate-700/60 shadow-inner">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium flex items-center gap-1.5 text-slate-300">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Academic Status
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              ACTIVE
            </span>
          </div>
          
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Mandatory Threshold:</span>
              <strong className="text-amber-400 font-mono">75.0%</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Grace Window:</span>
              <strong className="text-slate-200 font-mono">10 min</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Late Cutoff:</span>
              <strong className="text-slate-200 font-mono">25 min</strong>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
        <span>AURA Attendance v1.0</span>
        <span className="inline-flex items-center gap-1 text-slate-400">
          <HelpCircle className="w-3.5 h-3.5" />
          Senate Policy 4.2B
        </span>
      </div>
    </aside>
  );
};

