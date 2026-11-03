import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  color?: 'blue' | 'emerald' | 'amber' | 'rose' | 'purple';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  trend = 'neutral',
  icon: Icon,
  color = 'blue',
  onClick
}) => {
  const colorSchemes = {
    blue: {
      bg: 'from-blue-600/10 via-blue-500/5 to-transparent',
      border: 'border-blue-500/20 hover:border-blue-500/40',
      iconBg: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
      glow: 'group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]'
    },
    emerald: {
      bg: 'from-emerald-600/10 via-emerald-500/5 to-transparent',
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
      glow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]'
    },
    amber: {
      bg: 'from-amber-600/10 via-amber-500/5 to-transparent',
      border: 'border-amber-500/20 hover:border-amber-500/40',
      iconBg: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
      glow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]'
    },
    rose: {
      bg: 'from-rose-600/10 via-rose-500/5 to-transparent',
      border: 'border-rose-500/20 hover:border-rose-500/40',
      iconBg: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
      glow: 'group-hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]'
    },
    purple: {
      bg: 'from-purple-600/10 via-purple-500/5 to-transparent',
      border: 'border-purple-500/20 hover:border-purple-500/40',
      iconBg: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
      glow: 'group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]'
    }
  };

  const scheme = colorSchemes[color];

  return (
    <div 
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${scheme.bg} bg-slate-900/80 p-5 border ${scheme.border} transition-all duration-300 ${scheme.glow} ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-white">{value}</span>
            {change && (
              <span className={`text-xs font-semibold ${
                trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-rose-400' : 'text-slate-400'
              }`}>
                {change}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${scheme.iconBg}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

