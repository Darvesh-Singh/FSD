import React, { useState } from 'react';
import { RFIDScannerKiosk } from './RFIDScannerKiosk';
import { DynamicQRCodeGenerator } from './DynamicQRCodeGenerator';
import { GeofenceCheckIn } from './GeofenceCheckIn';
import { ManualOverrideSheet } from './ManualOverrideSheet';
import { Radio, QrCode, MapPin, Edit3, Sparkles } from 'lucide-react';

export const SmartCaptureHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rfid' | 'qr' | 'geofence' | 'manual'>('rfid');

  const tabs = [
    {
      id: 'rfid',
      label: 'RFID Smartcard Tap',
      desc: 'Hall Kiosk & Physical Badges',
      icon: Radio,
      color: 'text-purple-400'
    },
    {
      id: 'qr',
      label: 'Dynamic Rotating QR',
      desc: 'Auditorium Anti-Fraud Code',
      icon: QrCode,
      color: 'text-indigo-400'
    },
    {
      id: 'geofence',
      label: 'Geofenced GPS Verification',
      desc: 'Perimeter Radius Telemetry',
      icon: MapPin,
      color: 'text-cyan-400'
    },
    {
      id: 'manual',
      label: 'Instructor Roll Override',
      desc: 'Manual Roster & Exception Desk',
      icon: Edit3,
      color: 'text-amber-400'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Title & Mode Switcher */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-academic-400">
                Automated Verification Engine
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Multi-Modal Ingestion
              </span>
            </div>
            <h1 className="text-xl font-black text-white mt-0.5">
              Smart Attendance Capture Hub
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Select an ingestion method to simulate real student verification and automated grace period grading.
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`p-3 rounded-xl text-left border transition ${
                  isActive 
                    ? 'bg-slate-800 border-academic-500 text-white shadow-md' 
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${tab.color}`} />
                  <span className="text-xs font-bold truncate text-white">{tab.label}</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">{tab.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'rfid' && <RFIDScannerKiosk />}
      {activeTab === 'qr' && <DynamicQRCodeGenerator />}
      {activeTab === 'geofence' && <GeofenceCheckIn />}
      {activeTab === 'manual' && <ManualOverrideSheet />}

    </div>
  );
};

