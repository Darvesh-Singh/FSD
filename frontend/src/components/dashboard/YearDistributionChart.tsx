import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip 
} from 'recharts';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { Users2, Award } from 'lucide-react';

export const YearDistributionChart: React.FC = () => {
  const { kpis } = useAttendanceStore();
  const data = kpis?.yearDistribution || [];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-xs">
          <p className="font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            {item.name} Class
          </p>
          <div className="mt-1 space-y-0.5 text-slate-300">
            <p>Students Enrolled: <strong className="text-white font-mono">{item.count}</strong></p>
            <p>Average Attendance: <strong className="text-emerald-400 font-mono">{item.presentPercentage}%</strong></p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Users2 className="w-4 h-4 text-academic-400" />
            Attendance by Class Year
          </h3>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Cohort Analysis
          </span>
        </div>
        <p className="text-xs text-slate-400">Class level participation and presence distribution</p>
      </div>

      {/* Donut Chart */}
      <div className="h-52 w-full my-2 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Donut Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-extrabold text-white font-mono leading-none">
            {data.reduce((acc, curr) => acc + curr.count, 0)}
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">
            Students
          </span>
        </div>
      </div>

      {/* Legend & Compliance List */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-800/40 border border-slate-800">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-slate-300 font-medium truncate text-[11px]">{item.name}</span>
            </div>
            <span className="font-mono font-bold text-white text-[11px]">{item.presentPercentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

