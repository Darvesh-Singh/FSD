import React from 'react';
import { AttendanceStatus, CheckInMethod } from '../../types';
import { CheckCircle2, Clock, XCircle, ShieldCheck, Radio, QrCode, MapPin, Edit3, Cpu } from 'lucide-react';

interface StatusBadgeProps {
  status: AttendanceStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold'
  };

  switch (status) {
    case 'PRESENT':
      return (
        <span className={`inline-flex items-center rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 ${sizeClasses[size]}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Present</span>
        </span>
      );
    case 'LATE':
      return (
        <span className={`inline-flex items-center rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 ${sizeClasses[size]}`}>
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Late</span>
        </span>
      );
    case 'ABSENT':
      return (
        <span className={`inline-flex items-center rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 ${sizeClasses[size]}`}>
          <XCircle className="w-3.5 h-3.5 text-rose-400" />
          <span>Absent</span>
        </span>
      );
    case 'EXCUSED':
      return (
        <span className={`inline-flex items-center rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30 ${sizeClasses[size]}`}>
          <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
          <span>Excused</span>
        </span>
      );
    default:
      return null;
  }
};

interface MethodBadgeProps {
  method: CheckInMethod;
}

export const MethodBadge: React.FC<MethodBadgeProps> = ({ method }) => {
  switch (method) {
    case 'RFID_SCAN':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
          <Radio className="w-3 h-3" />
          RFID Badge
        </span>
      );
    case 'DYNAMIC_QR':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
          <QrCode className="w-3 h-3" />
          Dynamic QR
        </span>
      );
    case 'GEOFENCE_GPS':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
          <MapPin className="w-3 h-3" />
          GPS Geofence
        </span>
      );
    case 'MANUAL_OVERRIDE':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
          <Edit3 className="w-3 h-3" />
          Instructor Roll
        </span>
      );
    case 'SYSTEM_AUTO':
    default:
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-700/50 text-slate-400 border border-slate-600/30">
          <Cpu className="w-3 h-3" />
          System Auto
        </span>
      );
  }
};

