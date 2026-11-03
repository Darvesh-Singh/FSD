import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { api } from '../../services/api';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { Send, FileText, AlertCircle, ShieldAlert } from 'lucide-react';

interface AbsenceAppealModalProps {
  logId: string | null;
  studentId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const AbsenceAppealModal: React.FC<AbsenceAppealModalProps> = ({
  logId,
  studentId,
  onClose,
  onSuccess
}) => {
  const { showToast } = useAttendanceStore();
  const [reasonCategory, setReasonCategory] = useState<string>('MEDICAL');
  const [explanation, setExplanation] = useState<string>('');
  const [documentUrl, setDocumentUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logId || !explanation.trim()) return;

    setIsSubmitting(true);
    try {
      await api.submitAppeal({
        studentId,
        attendanceLogId: logId,
        reasonCategory,
        explanation: explanation.trim(),
        documentUrl: documentUrl.trim() || undefined
      });
      showToast('success', 'Appeal Submitted', 'Your absence excuse has been transmitted to course faculty.');
      onSuccess();
      onClose();
    } catch (err: any) {
      showToast('error', 'Appeal Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={!!logId}
      onClose={onClose}
      title="Submit Formal Absence Appeal"
      subtitle="Request instructor excusal for a missed lecture session"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        
        <div>
          <label className="font-semibold text-slate-300 block mb-1">
            Reason Category:
          </label>
          <select
            value={reasonCategory}
            onChange={(e) => setReasonCategory(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-academic-500"
          >
            <option value="MEDICAL">Medical Illness / Hospitalization</option>
            <option value="ACADEMIC_CONFLICT">Authorized University Academic Conflict</option>
            <option value="ATHLETIC_REPRESENTATION">Varsity Athletics / Official Representation</option>
            <option value="EMERGENCY">Family / Personal Emergency</option>
            <option value="OTHER">Other Extenuating Circumstances</option>
          </select>
        </div>

        <div>
          <label className="font-semibold text-slate-300 block mb-1">
            Detailed Justification:
          </label>
          <textarea
            rows={4}
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            required
            placeholder="Describe the reason for missing the lecture and reference any attached proof..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-academic-500"
          />
        </div>

        <div>
          <label className="font-semibold text-slate-300 block mb-1">
            Documentation / Medical Certificate Link (Optional):
          </label>
          <input
            type="url"
            value={documentUrl}
            onChange={(e) => setDocumentUrl(e.target.value)}
            placeholder="https://drive.google.com/cert-proof.pdf"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-academic-500 font-mono"
          />
        </div>

        <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting || !explanation.trim()}
            className="px-5 py-2 rounded-xl bg-academic-600 hover:bg-academic-500 disabled:opacity-50 text-white font-bold transition flex items-center gap-1.5 shadow-md shadow-academic-600/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Submitting...' : 'Transmit Appeal'}</span>
          </button>
        </div>

      </form>
    </Modal>
  );
};

