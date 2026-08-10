import React, { useState } from 'react';
import { MapPin, Navigation, Layers, ZoomIn, ZoomOut, RotateCcw, X, ExternalLink, ShieldCheck } from 'lucide-react';
import type { Property, UnitSystem } from '../types';
import { formatArea, formatPriceINR } from '../utils/conversions';

interface InteractiveMapProps {
  properties: Property[];
  unitSystem: UnitSystem;
  onSelectProperty: (property: Property) => void;
  selectedCity: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  properties,
  unitSystem,
  onSelectProperty,
  selectedCity,
}) => {
  const [activeProperty, setActiveProperty] = useState<Property | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [layerMode, setLayerMode] = useState<'standard' | 'expressway' | 'satellite'>('standard');

  // Bound UP map coordinates (Approx Lat: 25 to 29 N, Lng: 77 to 84 E)
  const minLat = 25.0;
  const maxLat = 29.0;
  const minLng = 77.0;
  const maxLng = 84.5;

  const getPinPosition = (lat: number, lng: number) => {
    const xPercent = ((lng - minLng) / (maxLng - minLng)) * 100;
    const yPercent = (1 - (lat - minLat) / (maxLat - minLat)) * 100;
    return {
      left: `${Math.max(5, Math.min(95, xPercent))}%`,
      top: `${Math.max(5, Math.min(95, yPercent))}%`,
    };
  };

  return (
    <div className="relative w-full h-[600px] lg:h-[750px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
      
      {/* Map Control Bar Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        
        {/* Layer Switcher */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-xs font-semibold text-white shadow-lg">
          <Layers className="w-4 h-4 text-blue-400 ml-1.5" />
          {(['standard', 'expressway', 'satellite'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setLayerMode(mode)}
              className={`px-2.5 py-1 rounded-lg capitalize transition ${
                layerMode === mode
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {mode === 'expressway' ? 'UP Expressways' : mode}
            </button>
          ))}
        </div>

        {/* Zoom Controls */}
        <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-white shadow-lg">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.3, 2.2))}
            className="p-1.5 rounded-lg hover:bg-white/10 transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.3, 0.8))}
            className="p-1.5 rounded-lg hover:bg-white/10 transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition"
            title="Reset Map View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Map Canvas Canvas Container */}
      <div className="relative flex-1 w-full h-full overflow-hidden select-none bg-[#090d16]">
        
        {/* Transform Scale Wrapper */}
        <div
          className="relative w-full h-full transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          
          {/* Simulated UP State Grid Lines & Topography SVG */}
          <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3b82f6" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* UP Major Expressways Overlay Layer */}
          {layerMode === 'expressway' && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-80 z-10">
              {/* Yamuna Expressway (Noida to Agra) */}
              <line x1="12%" y1="20%" x2="25%" y2="40%" stroke="#f59e0b" strokeWidth="4" strokeDasharray="6 4" />
              {/* Agra-Lucknow Expressway (Agra to Lucknow) */}
              <line x1="25%" y1="40%" x2="55%" y2="48%" stroke="#10b981" strokeWidth="4" strokeDasharray="6 4" />
              {/* Purvanchal Expressway (Lucknow to Varanasi/Ghazipur) */}
              <line x1="55%" y1="48%" x2="80%" y2="65%" stroke="#3b82f6" strokeWidth="4" strokeDasharray="6 4" />
            </svg>
          )}

          {/* City Cluster Labels */}
          <div className="absolute inset-0 pointer-events-none text-white/40 text-[11px] font-bold tracking-widest uppercase">
            <span className="absolute top-[18%] left-[10%]">NOIDA / NCR</span>
            <span className="absolute top-[46%] left-[53%] text-amber-400/60 font-extrabold text-sm">LUCKNOW (Capital)</span>
            <span className="absolute top-[63%] left-[78%]">VARANASI</span>
            <span className="absolute top-[50%] left-[72%] text-amber-300/80">AYODHYA</span>
            <span className="absolute top-[48%] left-[45%]">KANPUR</span>
            <span className="absolute top-[62%] left-[62%]">PRAYAGRAJ</span>
            <span className="absolute top-[38%] left-[23%]">AGRA</span>
            <span className="absolute top-[40%] left-[82%]">GORAKHPUR</span>
          </div>

          {/* Interactive Property Map Pins */}
          {properties.map((prop) => {
            const pos = getPinPosition(prop.lat, prop.lng);
            const isSelected = activeProperty?.id === prop.id;

            return (
              <div
                key={prop.id}
                style={{ left: pos.left, top: pos.top }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveProperty(prop);
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
              >
                {/* Price Badge Pin */}
                <div
                  className={`px-2.5 py-1 rounded-xl font-bold text-xs shadow-xl transition-all duration-200 flex items-center gap-1 ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/40 scale-110 z-30'
                      : 'bg-blue-600 text-white hover:bg-blue-500 hover:scale-105 border border-blue-400/30'
                  }`}
                >
                  <MapPin className="w-3 h-3" />
                  <span>{formatPriceINR(prop.price)}</span>
                </div>
              </div>
            );
          })}

        </div>

        {/* Selected Property Popup Card Drawer */}
        {activeProperty && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-30 bg-slate-900/95 backdrop-blur-xl p-4 rounded-2xl border border-slate-700 shadow-2xl text-white animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {activeProperty.city}
              </span>
              <button
                onClick={() => setActiveProperty(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-3">
              <img
                src={activeProperty.images[0]}
                alt={activeProperty.title}
                className="w-24 h-20 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="font-bold text-sm truncate text-white">
                  {activeProperty.title}
                </h4>
                <div className="text-amber-400 font-extrabold text-base">
                  {formatPriceINR(activeProperty.price)}
                </div>
                <div className="text-xs text-slate-400 font-medium truncate">
                  {formatArea(activeProperty.areaSqFt, unitSystem)} | {activeProperty.bhk ? `${activeProperty.bhk} BHK` : activeProperty.type}
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              {activeProperty.reraApproved && (
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>UPRERA Registered</span>
                </div>
              )}
              <button
                onClick={() => onSelectProperty(activeProperty)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition ml-auto"
              >
                <span>View Specs</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
