import React, { useState } from 'react';
import { X, Building, Calculator, CheckCircle2, ShieldCheck, ArrowRight, Percent } from 'lucide-react';
import { UP_BANK_PARTNERS, formatPriceINR } from '../utils/conversions';

interface BankLoanModalProps {
  onClose: () => void;
  onApplyLoan: (bankName: string) => void;
}

export const BankLoanModal: React.FC<BankLoanModalProps> = ({ onClose, onApplyLoan }) => {
  const [monthlyIncome, setMonthlyIncome] = useState<number>(100000); // 1 Lac default
  const [existingEmi, setExistingEmi] = useState<number>(0);

  // Max eligible EMI is typically 50% of net monthly income minus existing EMIs
  const eligibleEmi = Math.max(0, monthlyIncome * 0.5 - existingEmi);
  // Approx loan eligible at 8.5% interest for 20 years: Principal ~ EMI * 115
  const estimatedMaxLoan = Math.round(eligibleEmi * 115);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-600/20">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">
                Pre-Approved Home Loans for UP Properties
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Partnered with SBI, HDFC, ICICI & PNB with Lowest Interest Rates
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

        {/* Home Loan Eligibility Calculator */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-blue-900/10 border border-blue-500/20 space-y-4">
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Calculator className="w-4 h-4 text-blue-500" />
            <span>Instant Home Loan Eligibility Check</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">
                Net Monthly Take-home Income (₹):
              </label>
              <input
                type="number"
                min={20000}
                step={5000}
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Math.max(0, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-extrabold text-base focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">
                Existing Monthly EMIs (₹):
              </label>
              <input
                type="number"
                min={0}
                step={2000}
                value={existingEmi}
                onChange={(e) => setExistingEmi(Math.max(0, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-extrabold text-base focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-600 text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <div className="text-xs text-blue-100 font-bold">Estimated Eligible Home Loan Amount</div>
              <div className="text-2xl font-extrabold">{formatPriceINR(estimatedMaxLoan)}</div>
            </div>

            <div className="text-xs font-medium text-blue-100 bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
              Max Monthly EMI Cap: ₹{eligibleEmi.toLocaleString('en-IN')}/mo
            </div>
          </div>
        </div>

        {/* Bank Partner Offers */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
            Approved Bank Partners
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {UP_BANK_PARTNERS.map((bank) => (
              <div
                key={bank.bankName}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {bank.bankName}
                    </h5>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-extrabold text-xs">
                      {bank.interestRate}% p.a.
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {bank.specialFeature}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2 text-xs">
                  <span className="text-[10px] text-slate-400 font-semibold">
                    Fee: {bank.processingFee}
                  </span>
                  <button
                    onClick={() => onApplyLoan(bank.bankName)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
