import React, { useState } from 'react';
import { X, Building, Calculator, Info, ShieldCheck } from 'lucide-react';
import { calculateUPStampDuty, formatPriceINR } from '../utils/conversions';

interface UPStampDutyModalProps {
  onClose: () => void;
}

export const UPStampDutyModal: React.FC<UPStampDutyModalProps> = ({ onClose }) => {
  const [propertyPrice, setPropertyPrice] = useState<number>(7500000); // 75 Lacs default
  const [genderCategory, setGenderCategory] = useState<'Female' | 'Male' | 'Joint'>('Female');

  const duty = calculateUPStampDuty(propertyPrice, genderCategory);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">
                UP Stamp Duty & Registry Calculator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official Uttar Pradesh Government Property Registration Taxes
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

        {/* Form Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
              Property Agreed Value / Circle Rate Value (₹):
            </label>
            <input
              type="number"
              min={500000}
              step={100000}
              value={propertyPrice}
              onChange={(e) => setPropertyPrice(Math.max(0, Number(e.target.value)))}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-extrabold text-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <div className="text-[11px] text-slate-500 mt-1">
              Currently Selected: {formatPriceINR(propertyPrice)}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
              Buyer Category (UP State Tax Concessions):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Female', 'Male', 'Joint'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setGenderCategory(cat)}
                  className={`py-3 px-3 rounded-xl text-xs font-bold border transition ${
                    genderCategory === cat
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div>{cat} Owner</div>
                  <div className="text-[10px] font-normal opacity-90 mt-0.5">
                    {cat === 'Female' ? '6% Stamp Duty' : cat === 'Male' ? '7% Stamp Duty' : '6.5% Stamp Duty'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calculation Result Breakdown */}
        <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-3 text-xs">
          <div className="flex justify-between py-1 border-b border-indigo-500/20 text-slate-700 dark:text-slate-300">
            <span>Stamp Duty Rate ({genderCategory}):</span>
            <span className="font-bold">{duty.stampDutyRate}%</span>
          </div>

          <div className="flex justify-between py-1 border-b border-indigo-500/20 text-slate-700 dark:text-slate-300">
            <span>Stamp Duty Amount:</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {formatPriceINR(duty.stampDutyAmount)}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-indigo-500/20 text-slate-700 dark:text-slate-300">
            <span>Registration Fee (1% UP Govt):</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {formatPriceINR(duty.registrationFee)}
            </span>
          </div>

          <div className="flex justify-between py-2 text-sm font-extrabold text-slate-900 dark:text-white pt-2 border-t border-indigo-500/30">
            <span>Total Government Taxes:</span>
            <span className="text-emerald-600 dark:text-emerald-400">
              {formatPriceINR(duty.totalGovtCharges)}
            </span>
          </div>
        </div>

        {/* Info box */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
          <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <span>
            Note: Uttar Pradesh offers 1% stamp duty concession for female buyers up to ₹10 Lakhs valuation. Additional processing charges of ₹1,000 to ₹2,500 apply for e-stamping certificates.
          </span>
        </div>

      </div>
    </div>
  );
};
