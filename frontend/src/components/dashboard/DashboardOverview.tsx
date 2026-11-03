import React from 'react';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { StatCard } from '../common/StatCard';
import { LiveLectureFeed } from './LiveLectureFeed';
import { AttendanceTrendChart } from './AttendanceTrendChart';
import { YearDistributionChart } from './YearDistributionChart';
import { StatusBadge, MethodBadge } from '../common/StatusBadge';
import { 
  Percent, Presentation, UserCheck, ShieldAlert, 
  Activity, ArrowUpRight, CheckCircle2 
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const { kpis, setActiveView } = useAttendanceStore();

  const campusPct = kpis?.dailyCampusAttendancePercentage || 90.4;
  const inProgressCount = kpis?.ongoingLecturesCount || 2;
  const checkedInCount = kpis?.totalStudentsCheckedInToday || 48;
  const expectedCount = kpis?.totalStudentsExpectedToday || 54;
  const atRiskCount = kpis?.atRiskStudentsCount || 7;
  const recentFeed = kpis?.recentActivityFeed || [];

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-academic-950/40 to-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-academic-400">
            University Academic Operations
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            Real-Time Campus Attendance & Compliance
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Automated student check-in telemetry across lecture halls, sensor kiosks, and mobile geofences with automated statutory academic risk detection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('capture')}
            className="inline-flex items-center gap-2 bg-academic-600 hover:bg-academic-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-academic-600/30"
          >
            <span>Launch Smart Check-In</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Core Academic KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Daily Campus Attendance"
          value={`${campusPct}%`}
          change="+1.8% vs yesterday"
          trend="up"
          subtitle="Overall university compliance"
          icon={Percent}
          color="blue"
        />

        <StatCard
          title="Ongoing Lectures"
          value={inProgressCount}
          subtitle="Currently active in halls"
          change="Real-time session telemetry"
          trend="neutral"
          icon={Presentation}
          color="purple"
          onClick={() => setActiveView('professor-console')}
        />

        <StatCard
          title="Checked-In Today"
          value={`${checkedInCount} / ${expectedCount}`}
          change={`${Math.round((checkedInCount / (expectedCount || 1)) * 100)}% verified`}
          trend="up"
          subtitle="Physical & mobile scans"
          icon={UserCheck}
          color="emerald"
          onClick={() => setActiveView('capture')}
        />

        <StatCard
          title="At-Risk Students"
          value={atRiskCount}
          subtitle="Attendance < 75% threshold"
          change="Immediate action required"
          trend="down"
          icon={ShieldAlert}
          color="rose"
          onClick={() => setActiveView('reports')}
        />
      </div>

      {/* Live Lecture Feed */}
      <LiveLectureFeed />

      {/* Charts Grid: Trends + Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AttendanceTrendChart />
        </div>
        <div className="lg:col-span-1">
          <YearDistributionChart />
        </div>
      </div>

      {/* Real-time Streaming Check-In Activity Ticker */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-academic-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">Real-Time Check-In Telemetry Stream</h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Streaming latest verified university transactions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Student</th>
                <th className="py-2.5 px-3">University ID</th>
                <th className="py-2.5 px-3">Course</th>
                <th className="py-2.5 px-3">Hall / Location</th>
                <th className="py-2.5 px-3">Method</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {recentFeed.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-500">
                    No recent check-ins recorded yet.
                  </td>
                </tr>
              ) : (
                recentFeed.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-850/50 transition">
                    <td className="py-2.5 px-3 text-white font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      {item.studentName}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-400">{item.studentUniversityId}</td>
                    <td className="py-2.5 px-3 text-academic-400 font-mono font-semibold">{item.courseCode}</td>
                    <td className="py-2.5 px-3 text-slate-300">{item.hall}</td>
                    <td className="py-2.5 px-3">
                      <MethodBadge method={item.method} />
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-400 text-[11px]">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

