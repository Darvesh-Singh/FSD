import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { api } from '../../services/api';
import { 
  QrCode, RefreshCw, Maximize2, Minimize2, 
  Copy, Check, ShieldCheck, Clock, Users, ArrowRight 
} from 'lucide-react';

export const DynamicQRCodeGenerator: React.FC = () => {
  const { 
    kpis, 
    selectedLectureId, 
    allUsers, 
    currentUser, 
    refreshDashboard, 
    showToast 
  } = useAttendanceStore();

  const [activeCode, setActiveCode] = useState<string>('UNIV-849201');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedStudentForScan, setSelectedStudentForScan] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [scanMessage, setScanMessage] = useState<any>(null);

  const liveLectures = kpis?.liveLectures || [];
  const currentLecture = liveLectures.find(l => l.lectureId === selectedLectureId) || liveLectures[0];
  const students = allUsers.filter(u => u.role === 'STUDENT');

  // Generate QR image on token change
  useEffect(() => {
    if (activeCode) {
      QRCode.toDataURL(activeCode, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('QR code generation failed:', err));
    }
  }, [activeCode]);

  // Rotate QR code timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          // Trigger rotation
          if (currentLecture) {
            api.rotateQr(currentLecture.lectureId)
              .then(res => {
                if (res?.code) setActiveCode(res.code);
              })
              .catch(() => {
                const fallbackCode = `UNIV-${Math.floor(100000 + Math.random() * 900000)}`;
                setActiveCode(fallbackCode);
              });
          }
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentLecture]);

  // Initial code fetch
  useEffect(() => {
    if (currentLecture?.dynamicQrCode) {
      setActiveCode(currentLecture.dynamicQrCode);
    }
  }, [currentLecture]);

  const handleManualRotate = async () => {
    if (!currentLecture) return;
    try {
      const res = await api.rotateQr(currentLecture.lectureId);
      setActiveCode(res.code);
      setSecondsRemaining(30);
      showToast('info', 'Dynamic QR Rotated', 'New time-restricted verification token generated.');
    } catch (err: any) {
      const fallbackCode = `UNIV-${Math.floor(100000 + Math.random() * 900000)}`;
      setActiveCode(fallbackCode);
      setSecondsRemaining(30);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simulate a student scanning this QR code
  const handleStudentScanSubmission = async () => {
    const studentId = selectedStudentForScan || (currentUser?.role === 'STUDENT' ? currentUser.id : students[0]?.id);
    if (!studentId || !currentLecture) return;

    setIsVerifying(true);
    setScanMessage(null);

    try {
      const res = await api.dynamicQrScan(activeCode, studentId, currentLecture.lectureId);
      setScanMessage({ success: true, text: res.message });
      showToast('success', 'Attendance Recorded', res.message);
      await refreshDashboard();
    } catch (err: any) {
      setScanMessage({ success: false, text: err.message });
      showToast('error', 'QR Check-In Failed', err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  if (!currentLecture) {
    return (
      <div className="p-8 text-center bg-slate-900 rounded-xl border border-slate-800 text-slate-400">
        No active lecture selected. Please select a lecture from the dashboard.
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-8 overflow-y-auto' : ''}`}>
      
      {/* Header Controller */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-academic-400 text-sm">
              {currentLecture.courseCode} • {currentLecture.sectionCode}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              AUDITORIUM PROJECTOR MODE
            </span>
          </div>
          <h2 className="text-base font-bold text-white mt-0.5">
            {currentLecture.courseTitle} ({currentLecture.hall})
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleManualRotate}
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-200 px-3 py-2 rounded-lg border border-slate-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-academic-400" />
            <span>Force Rotate</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-200 px-3 py-2 rounded-lg border border-slate-700 transition"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Projector View'}</span>
          </button>
        </div>
      </div>

      {/* Center QR Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Big Dynamic QR Projection Card */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
          
          {/* Circular Countdown Progress Ring */}
          <div className="w-full flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Clock className="w-4 h-4 text-academic-400" />
              <span>Anti-Fraud TOTP Protection</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-white">
                Next token in <strong className="text-academic-400">{secondsRemaining}s</strong>
              </span>
              <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-academic-500 rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${(secondsRemaining / 30) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="p-4 bg-white rounded-2xl shadow-2xl ring-4 ring-academic-500/30 transition-all hover:scale-[1.01]">
            {qrDataUrl ? (
              <img 
                src={qrDataUrl} 
                alt="Dynamic University Attendance QR" 
                className="w-64 h-64 sm:w-72 sm:h-72 object-contain"
              />
            ) : (
              <div className="w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center text-slate-500">
                Generating Dynamic QR...
              </div>
            )}
          </div>

          {/* Dynamic Token String Display */}
          <div className="mt-6 flex items-center gap-2">
            <span className="text-xs text-slate-400">SESSION TOKEN:</span>
            <div className="font-mono text-2xl font-black tracking-widest text-white px-4 py-1.5 rounded-xl bg-slate-850 border border-slate-700 shadow-inner">
              {activeCode}
            </div>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition"
              title="Copy Token"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <p className="mt-4 text-xs text-slate-400 max-w-md">
            Students scan this rotating code using their university mobile portal. Codes expire automatically after 30 seconds to prevent screenshot sharing.
          </p>

        </div>

        {/* Right: Student Mobile Scanner Simulator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <QrCode className="w-4 h-4 text-academic-400" />
              <h3 className="text-sm font-bold text-white">Student Scan Simulator</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Test the mobile check-in verification engine from a student device.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                  Select Student Account:
                </label>
                <select
                  value={selectedStudentForScan}
                  onChange={(e) => setSelectedStudentForScan(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-academic-500"
                >
                  <option value="">Default (Active Student Persona)</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.universityId}) - {s.classYear}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                  Scanned Dynamic Token:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={activeCode}
                    readOnly
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                    LIVE
                  </span>
                </div>
              </div>

              <button
                onClick={handleStudentScanSubmission}
                disabled={isVerifying}
                className="w-full bg-academic-600 hover:bg-academic-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-academic-600/20"
              >
                <span>Verify & Check In Student</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {scanMessage && (
                <div className={`p-3 rounded-xl text-xs ${
                  scanMessage.success 
                    ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-200' 
                    : 'bg-rose-950/40 border border-rose-500/40 text-rose-200'
                }`}>
                  {scanMessage.text}
                </div>
              )}
            </div>

            {/* Hall Occupancy summary */}
            <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Lecture Hall Occupancy:</span>
                <strong className="text-white font-mono">{currentLecture.checkedInCount} / {currentLecture.totalEnrolled} checked in</strong>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${currentLecture.occupancyPercentage}%` }}
                />
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

