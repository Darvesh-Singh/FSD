import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { api } from '../../services/api';
import { AcademicWarningLetter } from '../../types';
import { Printer, Download, CheckCircle, Mail, ShieldAlert } from 'lucide-react';
import { useAttendanceStore } from '../../store/useAttendanceStore';

interface WarningLetterModalProps {
  letterId: string | null;
  onClose: () => void;
}

export const WarningLetterModal: React.FC<WarningLetterModalProps> = ({ letterId, onClose }) => {
  const [letterData, setLetterData] = useState<AcademicWarningLetter | null>(null);
  const [loading, setLoading] = useState(false);
  const [dispatched, setDispatched] = useState(false);
  const { showToast } = useAttendanceStore();

  useEffect(() => {
    if (letterId) {
      setLoading(true);
      api.getWarningLetter(letterId)
        .then(data => {
          setLetterData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load letter:', err);
          setLoading(false);
        });
    } else {
      setLetterData(null);
    }
  }, [letterId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDispatch = () => {
    setDispatched(true);
    showToast('success', 'Letter Dispatched', 'Official Academic Warning dispatched to student university email & student portal.');
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <Modal
      isOpen={!!letterId}
      onClose={onClose}
      title="Official Academic Attendance Warning Letter"
      subtitle="Regulated Statutory Notice Pursuant to University Academic Code §14.8"
      maxWidth="3xl"
    >
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs">
          Compiling official university transcript and registry letter...
        </div>
      ) : letterData ? (
        <div className="space-y-6">
          
          {/* Printable Letterhead Paper */}
          <div className="bg-white text-slate-900 p-8 rounded-xl shadow-inner border border-slate-300 font-sans text-sm print:m-0 print:p-0 print:border-none print:shadow-none">
            {/* University Letterhead */}
            <div className="border-b-2 border-red-700 pb-4 mb-6 flex items-start justify-between">
              <div>
                <h1 className="text-xl font-black text-red-900 tracking-tight">
                  VERITAS UNIVERSITY
                </h1>
                <p className="text-xs font-semibold text-slate-600 tracking-wider uppercase">
                  OFFICE OF THE REGISTRAR & BOARD OF UNDERGRADUATE ACADEMIC STANDARDS
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  100 University Crest Avenue, Building 1A • Phone: (555) 019-2831 • registrar@university.edu
                </p>
              </div>

              <div className="text-right">
                <span className="inline-block px-2 py-1 bg-red-100 text-red-800 font-mono text-xs font-bold rounded border border-red-300">
                  {letterData.warningStage.replace(/_/g, ' ')}
                </span>
                <p className="text-[11px] font-mono text-slate-500 mt-1">
                  REF: {letterData.id}
                </p>
              </div>
            </div>

            {/* Injected HTML Body from Backend */}
            <div 
              dangerouslySetInnerHTML={{ __html: letterData.letterBodyHtml }}
              className="prose prose-sm max-w-none text-slate-800"
            />
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-400">
              Dispatched to student portal and student advisor.
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition"
              >
                <Printer className="w-4 h-4 text-slate-400" />
                <span>Print / Save PDF</span>
              </button>

              <button
                onClick={handleDispatch}
                disabled={dispatched}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-rose-600/30"
              >
                <Mail className="w-4 h-4" />
                <span>{dispatched ? 'Dispatched' : 'Confirm & Dispatch Notice'}</span>
              </button>
            </div>
          </div>

        </div>
      ) : null}
    </Modal>
  );
};

