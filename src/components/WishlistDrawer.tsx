import React from 'react';
import { X, Heart, Trash2, ExternalLink, MapPin } from 'lucide-react';
import type { Property, UnitSystem } from '../types';
import { formatArea, formatPriceINR } from '../utils/conversions';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedProperties: Property[];
  unitSystem: UnitSystem;
  onRemoveSave: (id: string) => void;
  onSelectProperty: (property: Property) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  savedProperties,
  unitSystem,
  onRemoveSave,
  onSelectProperty,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              Saved Homes ({savedProperties.length})
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Saved Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedProperties.length === 0 ? (
            <div className="text-center py-16 space-y-3 text-slate-400">
              <Heart className="w-12 h-12 mx-auto stroke-1" />
              <p className="text-sm font-semibold">No saved properties yet.</p>
              <p className="text-xs">Click the heart icon on any UP property card to save it here.</p>
            </div>
          ) : (
            savedProperties.map((prop) => (
              <div
                key={prop.id}
                onClick={() => {
                  onClose();
                  onSelectProperty(prop);
                }}
                className="group relative p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex gap-3 cursor-pointer hover:border-blue-500 transition"
              >
                <img
                  src={prop.images[0]}
                  alt={prop.title}
                  className="w-20 h-20 rounded-xl object-cover"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-500 transition">
                    {prop.title}
                  </h4>

                  <div className="text-amber-500 font-extrabold text-sm">
                    {formatPriceINR(prop.price)}
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <MapPin className="w-3 h-3 text-blue-500 shrink-0" />
                    <span className="truncate">{prop.city}</span>
                  </div>

                  <div className="text-[10px] text-slate-400 font-semibold">
                    {formatArea(prop.areaSqFt, unitSystem)}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveSave(prop.id);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition self-start"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
