import React, { useState } from 'react';
import { X, Maximize2, RefreshCw, Info, CheckCircle2 } from 'lucide-react';
import { convertLandArea } from '../utils/conversions';

interface UPLandConverterModalProps {
  onClose: () => void;
}

export const UPLandConverterModal: React.FC<UPLandConverterModalProps> = ({ onClose }) => {
  const [inputValue, setInputValue] = useState<number>(1);
  const [inputUnit, setInputUnit] = useState<'Sq.Ft' | 'Gaj' | 'Bigha' | 'Biswa' | 'Acre' | 'Hectare'>('Bigha');

  const conversion = convertLandArea(inputValue, inputUnit);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Maximize2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">
                UP Land Area Unit Converter
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Convert Bigha, Biswa, Gaj, and Sq.Ft for Uttar Pradesh Land Registry
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

        {/* Converter Controls Input */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
              Enter Quantity Value:
            </label>
            <input
              type="number"
              min={0}
              step={0.1}
              value={inputValue}
              onChange={(e) => setInputValue(Math.max(0, Number(e.target.value)))}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-extrabold text-lg focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
              Select Input Unit:
            </label>
            <select
              value={inputUnit}
              onChange={(e) => setInputUnit(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-base focus:ring-2 focus:ring-amber-500 outline-none cursor-pointer"
            >
              <option value="Bigha">Pucca Bigha (UP)</option>
              <option value="Biswa">Biswa (UP)</option>
              <option value="Gaj">Gaj (Sq. Yards)</option>
              <option value="Sq.Ft">Square Feet (Sq.Ft)</option>
              <option value="Acre">Acres</option>
              <option value="Hectare">Hectares</option>
            </select>
          </div>
        </div>

        {/* Dynamic Conversion Table */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider text-center">
            Equivalent UP Land Measures
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
              <div className="text-xs text-blue-500 font-bold">Pucca Bigha (UP)</div>
              <div className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                {conversion.bighaPucca}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
              <div className="text-xs text-indigo-500 font-bold">UP Biswa</div>
              <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                {conversion.biswaPucca}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <div className="text-xs text-emerald-500 font-bold">Gaj (Sq. Yards)</div>
              <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {conversion.gaj.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
              <div className="text-xs text-amber-500 font-bold">Square Feet</div>
              <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
                {conversion.sqFt.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
              <div className="text-xs text-rose-500 font-bold">Kutcha Bigha</div>
              <div className="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
                {conversion.bighaKutcha}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
              <div className="text-xs text-purple-500 font-bold">Acres</div>
              <div className="text-xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
                {conversion.acre}
              </div>
            </div>
          </div>
        </div>

        {/* UP Land Standards Reference */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
          <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-blue-500" />
            <span>Uttar Pradesh Government Standard Definitions:</span>
          </div>
          <p>• 1 Pucca Bigha = 27,225 Sq.Ft = 3,025 Gaj = 20 Biswa</p>
          <p>• 1 Biswa = 1,361.25 Sq.Ft = 151.25 Gaj</p>
          <p>• 1 Gaj (Sq. Yard) = 9 Sq.Ft</p>
        </div>

      </div>
    </div>
  );
};
