import React, { useState } from 'react';
import { X, Flag, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import type { Property } from '../types';

interface ReportPropertyModalProps {
  property: Property;
  onClose: () => void;
  onSubmitReport: (propertyId: string, reason: string, comments: string) => void;
}

const REPORT_REASONS = [
  { id: 'price', label: 'Fake / Suspiciously Low Price', icon: '💵' },
  { id: 'phone', label: 'Invalid / Fraud Phone Number', icon: '📞' },
  { id: 'photos', label: 'Fake / Watermarked Internet Photos', icon: '📸' },
  { id: 'advance', label: 'Asked for Advance Token / Visiting Fee', icon: '💸' },
  { id: 'rera', label: 'Invalid RERA or Legal Title', icon: '🏛️' },
  { id: 'other', label: 'Other Fraudulent Details', icon: '⚠️' },
];

export const ReportPropertyModal: React.FC<ReportPropertyModalProps> = ({
  property,
  onClose,
  onSubmitReport,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>(REPORT_REASONS[0].label);
  const [comments, setComments] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport(property.id, selectedReason, comments);
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Report Fake / Suspicious Property
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[240px]">
                {property.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-extrabold text-xl text-slate-900 dark:text-white">
              Report Submitted for Audit
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              Thank you for keeping UPAwas safe! Our security team will review this listing within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Safety Warning */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-medium flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong>Buyer Safety Rule:</strong> Never transfer advance token money or visiting fees via UPI before physically inspecting the property.
              </span>
            </div>

            {/* Select Reason */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
                Why are you reporting this listing? *
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {REPORT_REASONS.map((r) => (
                  <label
                    key={r.id}
                    onClick={() => setSelectedReason(r.label)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition ${
                      selectedReason === r.label
                        ? 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-300'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{r.icon}</span>
                    <span className="flex-1">{r.label}</span>
                    <input
                      type="radio"
                      name="reportReason"
                      checked={selectedReason === r.label}
                      onChange={() => setSelectedReason(r.label)}
                      className="accent-rose-600"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Comments Input */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Additional Details (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Phone number was switched off or seller asked for ₹2,000 Paytm advance..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-extrabold text-xs shadow-lg transition-all"
            >
              Flag Listing for Admin Audit
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
