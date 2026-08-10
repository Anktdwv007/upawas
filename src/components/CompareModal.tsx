import React from 'react';
import { X, Check, ShieldCheck, Compass, MapPin, Trash2 } from 'lucide-react';
import type { Property, UnitSystem } from '../types';
import { formatArea, formatPriceINR } from '../utils/conversions';

interface CompareModalProps {
  properties: Property[];
  unitSystem: UnitSystem;
  onRemove: (id: string) => void;
  onClose: () => void;
  onSelectProperty: (property: Property) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  properties,
  unitSystem,
  onRemove,
  onClose,
  onSelectProperty,
}) => {
  if (properties.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">
              Side-by-Side Property Comparison ({properties.length}/3)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluate specs, area in {unitSystem}, RERA compliance, and prices
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Grid Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="p-3 w-40 font-bold text-slate-400 uppercase">Features</th>
                {properties.map((prop) => (
                  <th key={prop.id} className="p-3 min-w-[220px]">
                    <div className="space-y-2">
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950">
                        <img src={prop.images[0]} alt={prop.title} className="w-full h-full object-cover" />
                        <button
                          onClick={() => onRemove(prop.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-rose-400 hover:bg-rose-600 hover:text-white transition"
                          title="Remove from comparison"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1">
                        {prop.title}
                      </h4>
                      <div className="text-amber-500 font-extrabold text-base">
                        {formatPriceINR(prop.price)}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              <tr>
                <td className="p-3 font-bold text-slate-400">City / Locality</td>
                {properties.map((p) => (
                  <td key={p.id} className="p-3 font-bold text-slate-900 dark:text-white">
                    {p.locality}, {p.city}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-bold text-slate-400">Property Type</td>
                {properties.map((p) => (
                  <td key={p.id} className="p-3">{p.bhk ? `${p.bhk} BHK ${p.type}` : p.type}</td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-bold text-slate-400">Area ({unitSystem})</td>
                {properties.map((p) => (
                  <td key={p.id} className="p-3 font-bold text-blue-600 dark:text-blue-400">
                    {formatArea(p.areaSqFt, unitSystem)}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-bold text-slate-400">Price per Sq.Ft</td>
                {properties.map((p) => (
                  <td key={p.id} className="p-3 font-bold">₹{p.pricePerSqFt.toLocaleString('en-IN')}</td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-bold text-slate-400">UP RERA Status</td>
                {properties.map((p) => (
                  <td key={p.id} className="p-3">
                    {p.reraApproved ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Registered ({p.reraId})</span>
                      </span>
                    ) : (
                      <span className="text-slate-400">Not Applicable</span>
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-bold text-slate-400">Vastu Compliant</td>
                {properties.map((p) => (
                  <td key={p.id} className="p-3">
                    {p.vastuCompliant ? (
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <Compass className="w-4 h-4" />
                        <span>{p.facing} Facing</span>
                      </span>
                    ) : (
                      <span className="text-slate-400">Standard</span>
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-bold text-slate-400">Expressway Proximity</td>
                {properties.map((p) => (
                  <td key={p.id} className="p-3">
                    {p.expresswayDistanceKm ? `${p.expresswayDistanceKm} km` : 'N/A'}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-bold text-slate-400">Action</td>
                {properties.map((p) => (
                  <td key={p.id} className="p-3">
                    <button
                      onClick={() => {
                        onClose();
                        onSelectProperty(p);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
                    >
                      View Full Details
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
