import React from 'react';
import { X, ShieldCheck, ExternalLink, FileText, Map, CheckCircle } from 'lucide-react';

interface BhuNakshaGuideModalProps {
  onClose: () => void;
}

export const BhuNakshaGuideModal: React.FC<BhuNakshaGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">
                UP BhuNaksha & Bhulekh Verification Guide
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official Revenue Records & UPRERA Project Title Search
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

        {/* Official Portal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* UP Bhulekh */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <FileText className="w-5 h-5 text-emerald-500" />
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                Govt Portal
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">UP Bhulekh (Khasra & Khatauni)</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verify land owner names, encumbrances, and plot area online for all 75 UP districts.
            </p>
            <a
              href="https://upbhulekh.gov.in"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline pt-1"
            >
              <span>Visit upbhulekh.gov.in</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* UP BhuNaksha */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <Map className="w-5 h-5 text-amber-500" />
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                Geo Map
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">UP BhuNaksha (Cadastral Map)</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              View digital geo-referenced plot boundaries, road access, and canal proximity.
            </p>
            <a
              href="https://upbhunaksha.gov.in"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline pt-1"
            >
              <span>Visit upbhunaksha.gov.in</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        {/* Steps to Verify Property Title in UP */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
            4-Step Safe Property Buying Checklist in Uttar Pradesh:
          </h4>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white">1. Verify UPRERA Registration Number:</strong>
                <p>Ensure the builder project displays a valid registration ID (e.g. UPRERAPRJ12345) registered on up-rera.in.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white">2. Match Khatauni Name on UP Bhulekh:</strong>
                <p>Crosscheck seller's Khasra number and owner name on upbhulekh.gov.in against their sale deed.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white">3. Check Master Plan Development Authority Approval:</strong>
                <p>Check approval from LDA (Lucknow), NOIDA/GNDA Authority, ADA (Ayodhya), or VDA (Varanasi).</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white">4. E-Stamp Registration:</strong>
                <p>Ensure transaction e-stamping is processed via official Stock Holding Corporation (SHCIL) portal.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
