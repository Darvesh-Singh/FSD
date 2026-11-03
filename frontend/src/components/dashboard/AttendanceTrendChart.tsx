import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { TrendingUp, BarChart3, LineChart as LineIcon } from 'lucide-react';

export const AttendanceTrendChart: React.FC = () => {
  const { kpis } = useAttendanceStore();
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');

  const data = kpis?.weeklyDepartmentTrends || [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-xs">
          <p className="font-bold text-white mb-2">{label} (Academic Week 9)</p>
          <div className="space-y-1">
            {payload.map((item: any) => (
              <div key={item.dataKey} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5" style={{ color: item.color }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}:
                </span>
                <span className="font-mono font-bold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white tracking-tight">Weekly Department Attendance Trends</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-academic-500/15 text-academic-400 border border-academic-500/30">
              Cross-Faculty
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Aggregated physical and digital check-ins over the past 7 days</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
          <span className="text-[11px] font-medium text-slate-400 px-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            Campus Avg: 91.2%
          </span>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCSE" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorEE" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorME" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorMGMT" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="day" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis domain={[75, 100]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '14px', fontSize: '12px' }}
              formatter={(value) => <span className="text-slate-300 font-medium">{value}</span>}
            />
            <Area type="monotone" dataKey="CSE" name="Computer Science" stroke="#38bdf8" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCSE)" />
            <Area type="monotone" dataKey="EE" name="Electrical Eng." stroke="#a855f7" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEE)" />
            <Area type="monotone" dataKey="ME" name="Mechanical Eng." stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorME)" />
            <Area type="monotone" dataKey="MGMT" name="Management" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorMGMT)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

