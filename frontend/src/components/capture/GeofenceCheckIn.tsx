import React, { useState } from 'react';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { api } from '../../services/api';
import { StatusBadge } from '../common/StatusBadge';
import { 
  MapPin, Navigation, Compass, AlertCircle, 
  CheckCircle2, ShieldCheck, Crosshair, Sparkles 
} from 'lucide-react';

export const GeofenceCheckIn: React.FC = () => {
  const { kpis, allUsers, currentUser, refreshDashboard, showToast } = useAttendanceStore();
  
  const liveLectures = kpis?.liveLectures || [];
  const currentLecture = liveLectures[0];
  const students = allUsers.filter(u => u.role === 'STUDENT');

  // Default coordinate: Turing Hall A-101 (37.774929, -122.419416, 65m radius)
  const hallLat = 37.774929;
  const hallLng = -122.419416;
  const allowedRadiusMeters = 65;

  const [studentId, setStudentId] = useState(currentUser?.role === 'STUDENT' ? currentUser.id : students[0]?.id || '');
  const [offsetMeters, setOffsetMeters] = useState<number>(20); // 20m inside hall
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Compute simulated lat/lng from offset (1 degree lat ~= 111,000 meters)
  const simulatedLat = Number((hallLat + (offsetMeters / 111000)).toFixed(6));
  const simulatedLng = Number((hallLng).toFixed(6));

  const isWithinGeofence = offsetMeters <= allowedRadiusMeters;

  const handleExecuteGeofenceCheckIn = async () => {
    if (!currentLecture || !studentId) return;

    setIsCheckingIn(true);
    setResult(null);
    setErrorMsg(null);

    try {
      const res = await api.geofenceCheckIn(
        studentId,
        currentLecture.lectureId,
        simulatedLat,
        simulatedLng
      );
      setResult(res);
      showToast('success', 'Geofence Verified', res.message);
      await refreshDashboard();
    } catch (err: any) {
      setErrorMsg(err.message);
      showToast('error', 'Geofence Denied', err.message);
    } finally {
      setIsCheckingIn(false);
    }
  };

  const presetLocations = [
    { label: 'Front Row Desk', distance: 12, desc: 'Well inside hall' },
    { label: 'Hall Exit Doorway', distance: 52, desc: 'Near boundary (within 65m)' },
    { label: 'Campus Courtyard', distance: 140, desc: 'Outside boundary (denied)' },
    { label: 'Student Dorms', distance: 480, desc: 'Far away (denied)' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left: GPS Radar Visualization & Coordinates */}
      <div className="lg:col-span-7 space-y-6">
        <div className="rounded-2xl bg-slate-900 border border-slate-700/80 p-6 shadow-xl relative overflow-hidden">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                GPS GEOFENCE TELEMETRY ENGINE
              </h3>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
              isWithinGeofence 
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
            }`}>
              {isWithinGeofence ? 'IN BOUNDARY (VERIFIED)' : 'OUT OF BOUNDARY (BLOCKED)'}
            </span>
          </div>

          {/* Interactive Radar Screen */}
          <div className="my-6 relative h-64 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
            {/* Radar Grid Lines */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
            <div className="absolute w-48 h-48 rounded-full border border-cyan-500/20" />
            <div className="absolute w-32 h-32 rounded-full border border-cyan-500/30" />
            
            {/* Geofence Perimeter Ring (65m) */}
            <div className="absolute w-36 h-36 rounded-full border-2 border-emerald-400/40 bg-emerald-500/5 flex items-center justify-center animate-pulse-subtle">
              <span className="text-[9px] font-mono text-emerald-400/70 absolute -top-4 font-bold">
                65m Perimeter Limit
              </span>
            </div>

            {/* Hall Center Pin */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-academic-500/20 border-2 border-academic-400 flex items-center justify-center text-white shadow-lg">
                <MapPin className="w-4 h-4 text-academic-300" />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-300 mt-1 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-700">
                {currentLecture?.hall || 'Turing Hall A-101'}
              </span>
            </div>

            {/* Student Position Beacon */}
            <div 
              className="absolute z-20 transition-all duration-300 flex flex-col items-center pointer-events-none"
              style={{
                transform: `translateY(-${Math.min(offsetMeters * 1.1, 110)}px)`
              }}
            >
              <div className="relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isWithinGeofence ? 'bg-emerald-400' : 'bg-rose-400'
                }`} />
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-[9px] shadow-lg ${
                  isWithinGeofence ? 'bg-emerald-500' : 'bg-rose-500'
                }`}>
                  <Navigation className="w-3 h-3" />
                </div>
              </div>
              <span className={`text-[10px] font-mono font-bold mt-1 px-1.5 py-0.2 rounded border shadow ${
                isWithinGeofence ? 'bg-emerald-950 text-emerald-300 border-emerald-600' : 'bg-rose-950 text-rose-300 border-rose-600'
              }`}>
                {offsetMeters}m
              </span>
            </div>

          </div>

          {/* Interactive Distance Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Simulate Distance from Hall:</span>
              <span className="font-mono font-bold text-white text-sm">
                {offsetMeters} meters <span className="text-slate-400 text-xs">({isWithinGeofence ? 'Allowed' : 'Too far'})</span>
              </span>
            </div>

            <input
              type="range"
              min="5"
              max="250"
              value={offsetMeters}
              onChange={(e) => setOffsetMeters(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0m (Center)</span>
              <span className="text-emerald-400 font-bold">65m (Max Radius)</span>
              <span>250m (Off Perimeter)</span>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            {presetLocations.map((loc) => (
              <button
                key={loc.label}
                onClick={() => setOffsetMeters(loc.distance)}
                className={`p-2 rounded-lg text-left text-xs transition border ${
                  offsetMeters === loc.distance 
                    ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300' 
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="font-semibold text-[11px] truncate">{loc.label}</div>
                <div className="text-[10px] font-mono text-slate-400">{loc.distance}m</div>
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Right: Check-In Action & Verification Results */}
      <div className="lg:col-span-5 space-y-4">
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Geofence Check-In Submittal</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Submits high-precision device GPS fix to verify physical lecture hall presence.
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                Select Student:
              </label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.universityId}) - {s.classYear}
                  </option>
                ))}
              </select>
            </div>

            {/* Coordinates metadata card */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1 text-slate-400">
              <div className="flex justify-between">
                <span>Hall Target:</span>
                <strong className="text-white">{hallLat}, {hallLng}</strong>
              </div>
              <div className="flex justify-between">
                <span>Device Fix:</span>
                <strong className="text-cyan-300">{simulatedLat}, {simulatedLng}</strong>
              </div>
              <div className="flex justify-between">
                <span>Computed Distance:</span>
                <strong className={isWithinGeofence ? 'text-emerald-400' : 'text-rose-400'}>
                  {offsetMeters}m
                </strong>
              </div>
            </div>

            <button
              onClick={handleExecuteGeofenceCheckIn}
              disabled={isCheckingIn}
              className={`w-full font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg ${
                isWithinGeofence 
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/20' 
                  : 'bg-rose-600/80 hover:bg-rose-600 text-white shadow-rose-600/20'
              }`}
            >
              <Crosshair className="w-4 h-4" />
              <span>Verify Geofence & Check In ({offsetMeters}m)</span>
            </button>

            {/* Results */}
            {result && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs animate-in fade-in zoom-in-95">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">{result.message}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span>Status:</span>
                      <StatusBadge status={result.attendance.status} size="sm" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs animate-in fade-in zoom-in-95">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Geofence Check-In Denied</p>
                    <p className="mt-1 text-rose-300 text-[11px] leading-relaxed">{errorMsg}</p>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
};

