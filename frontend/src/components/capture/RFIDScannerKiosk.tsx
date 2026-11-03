import React, { useState } from 'react';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { api } from '../../services/api';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Radio, CheckCircle2, AlertCircle, Sparkles, 
  CreditCard, Volume2, ShieldCheck, User 
} from 'lucide-react';

export const RFIDScannerKiosk: React.FC = () => {
  const { allUsers, refreshDashboard, showToast } = useAttendanceStore();
  const [rfidInput, setRfidInput] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [errorResult, setErrorResult] = useState<string | null>(null);

  const students = allUsers.filter(u => u.role === 'STUDENT');

  const handleStudentSelect = (studId: string) => {
    setSelectedStudentId(studId);
    const stud = students.find(s => s.id === studId);
    if (stud?.rfidBadgeId) {
      setRfidInput(stud.rfidBadgeId);
    }
  };

  const executeScan = async (badgeId: string) => {
    if (!badgeId.trim()) return;
    setIsScanning(true);
    setErrorResult(null);
    setScanResult(null);

    try {
      const res = await api.rfidScan(badgeId.trim());
      setScanResult(res);
      showToast('success', 'Badge Verified', res.message);
      await refreshDashboard();
    } catch (err: any) {
      setErrorResult(err.message);
      showToast('error', 'RFID Scan Failed', err.message);
    } finally {
      setIsScanning(false);
    }
  };

  const handleSimulateQuickTap = (badgeId: string) => {
    setRfidInput(badgeId);
    executeScan(badgeId);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left: RFID Terminal Reader Device */}
      <div className="lg:col-span-7 space-y-6">
        <div className="rounded-2xl bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 border border-slate-700/80 p-6 shadow-xl relative overflow-hidden">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                KIOSK NFC/RFID TERMINAL #4A
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              13.56 MHz ISO 14443A
            </span>
          </div>

          {/* Interactive Tap Zone */}
          <div className="my-6">
            <div 
              onClick={() => rfidInput && executeScan(rfidInput)}
              className={`group relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
                isScanning 
                  ? 'border-academic-500 bg-academic-500/10 scale-[0.99]' 
                  : 'border-slate-700 hover:border-academic-400 bg-slate-900/60 hover:bg-slate-850'
              }`}
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-academic-500/15 border border-academic-500/30 flex items-center justify-center shadow-lg group-hover:scale-105 transition">
                  <Radio className={`w-10 h-10 text-academic-400 ${isScanning ? 'animate-ping' : ''}`} />
                </div>
                <CreditCard className="w-6 h-6 text-white absolute -bottom-1 -right-1 bg-slate-900 rounded-md p-0.5 border border-slate-700" />
              </div>

              <h4 className="mt-4 text-sm font-bold text-white text-center">
                {isScanning ? 'Reading RFID Frequency...' : 'Hold Student Smartcard or Badge to Scanner'}
              </h4>
              <p className="text-xs text-slate-400 text-center max-w-sm mt-1">
                Simulates real physical door reader at the lecture hall portal. Automatic verification against enrolled class roster.
              </p>

              {rfidInput && (
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-academic-300">
                  <span>Target:</span>
                  <strong className="text-white">{rfidInput}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Manual Badge ID Entry */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Card RFID UID / Badge Serial</span>
              <span className="text-[10px] font-normal text-slate-500">e.g. RFID-27CSE-002</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={rfidInput}
                onChange={(e) => setRfidInput(e.target.value)}
                placeholder="Enter or scan student RFID serial number..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-academic-500 font-mono"
              />
              <button
                onClick={() => executeScan(rfidInput)}
                disabled={isScanning || !rfidInput.trim()}
                className="bg-academic-600 hover:bg-academic-500 disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-2 shadow-md shadow-academic-600/20"
              >
                <Radio className="w-4 h-4" />
                <span>Simulate Tap</span>
              </button>
            </div>
          </div>

          {/* Scan Feedback Banner */}
          {scanResult && (
            <div className="mt-5 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs animate-in fade-in zoom-in-95">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm flex items-center gap-2">
                    <span>{scanResult.student.name} ({scanResult.student.universityId})</span>
                    <StatusBadge status={scanResult.attendance.status} size="sm" />
                  </div>
                  <p className="text-slate-300">
                    Course: <strong className="text-academic-300">{scanResult.lecture.courseCode}</strong> ({scanResult.lecture.hall})
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Timestamp: {new Date(scanResult.attendance.checkInTime).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {errorResult && (
            <div className="mt-5 p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs animate-in fade-in zoom-in-95 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white text-sm">Scan Verification Failed</p>
                <p className="mt-0.5 text-rose-300">{errorResult}</p>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Right: Quick Student Cards to Tap */}
      <div className="lg:col-span-5 space-y-4">
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Student Badge Registry</h3>
              <p className="text-xs text-slate-400">Click any card to simulate an instant NFC badge tap</p>
            </div>
            <Sparkles className="w-4 h-4 text-academic-400" />
          </div>

          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {students.slice(0, 8).map((stud) => (
              <div
                key={stud.id}
                onClick={() => stud.rfidBadgeId && handleSimulateQuickTap(stud.rfidBadgeId)}
                className="group flex items-center justify-between p-3 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-750 hover:border-academic-500/50 cursor-pointer transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={stud.avatarUrl}
                    alt={stud.name}
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-700 group-hover:ring-academic-400"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate group-hover:text-academic-300">
                      {stud.name}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 truncate">
                      {stud.universityId} • {stud.classYear}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700 block">
                    {stud.rfidBadgeId}
                  </span>
                  <span className="text-[9px] text-academic-400 font-semibold group-hover:underline">
                    Tap to check-in →
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
};

