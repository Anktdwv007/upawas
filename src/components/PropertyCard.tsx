import React, { useState } from 'react';
import {
  Heart,
  ShieldCheck,
  Compass,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Sparkles,
  PhoneCall,
  CheckSquare,
  Square,
  Navigation,
} from 'lucide-react';
import type { Property, UnitSystem } from '../types';
import { formatArea, formatPriceINR } from '../utils/conversions';

interface PropertyCardProps {
  property: Property;
  unitSystem: UnitSystem;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  isCompared: boolean;
  onToggleCompare: (property: Property) => void;
  onSelectProperty: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  unitSystem,
  isSaved,
  onToggleSave,
  isCompared,
  onToggleCompare,
  onSelectProperty,
}) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % property.images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <div
      onClick={() => onSelectProperty(property)}
      className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
    >
      
      {/* Property Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
        <img
          src={property.images[currentImgIndex]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto">
            {property.reraApproved && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-600/90 text-white text-[10px] font-bold shadow-sm backdrop-blur-md">
                <ShieldCheck className="w-3 h-3" />
                <span>RERA UP</span>
              </span>
            )}
            {property.vastuCompliant && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/90 text-slate-950 text-[10px] font-bold shadow-sm backdrop-blur-md">
                <Compass className="w-3 h-3" />
                <span>Vastu</span>
              </span>
            )}
            {property.featured && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-600/90 text-white text-[10px] font-bold shadow-sm backdrop-blur-md">
                <Sparkles className="w-3 h-3" />
                <span>Featured</span>
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(property.id);
            }}
            className="pointer-events-auto p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white transition hover:scale-110"
            title={isSaved ? 'Remove from Saved' : 'Save Property'}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
          </button>
        </div>

        {/* Carousel Prev/Next Buttons */}
        {property.images.length > 1 && (
          <div className="absolute inset-y-0 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <button
              onClick={handlePrevImage}
              className="pointer-events-auto p-1.5 rounded-full bg-slate-900/60 text-white hover:bg-slate-900 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="pointer-events-auto p-1.5 rounded-full bg-slate-900/60 text-white hover:bg-slate-900 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Price Tag Overlay at Bottom Left */}
        <div className="absolute bottom-3 left-3 text-white">
          <div className="text-xl sm:text-2xl font-extrabold tracking-tight drop-shadow-md">
            {formatPriceINR(property.price)}
          </div>
          <div className="text-[11px] text-slate-300 font-medium">
            ₹{property.pricePerSqFt.toLocaleString('en-IN')}/sq.ft
          </div>
        </div>

        {/* Image Dots Indicator */}
        {property.images.length > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1">
            {property.images.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  currentImgIndex === idx ? 'bg-white w-3' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        <div>
          {/* Property Title & Type */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
              {property.title}
            </h3>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs mt-1">
            <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="truncate">{property.location}, {property.city}</span>
          </div>
        </div>

        {/* Property Specs (BHK, Bath, Dual Unit Area) */}
        <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center text-xs font-semibold text-slate-700 dark:text-slate-300">
          <div>
            <div className="text-slate-400 font-normal text-[10px]">Type / BHK</div>
            <div className="truncate text-slate-900 dark:text-white">
              {property.bhk ? `${property.bhk} BHK` : property.type}
            </div>
          </div>

          <div>
            <div className="text-slate-400 font-normal text-[10px]">Baths</div>
            <div className="text-slate-900 dark:text-white">
              {property.bathrooms ? `${property.bathrooms} Bath` : 'N/A'}
            </div>
          </div>

          <div>
            <div className="text-slate-400 font-normal text-[10px]">Area ({unitSystem})</div>
            <div className="truncate text-blue-600 dark:text-blue-400 font-bold">
              {formatArea(property.areaSqFt, unitSystem)}
            </div>
          </div>
        </div>

        {/* Connectivity & UP Infrastructure Info */}
        {property.expresswayDistanceKm && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <Navigation className="w-3 h-3 text-indigo-500" />
            <span>{property.expresswayDistanceKm} km from Expressway Link</span>
          </div>
        )}

        {/* Card Footer Actions */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
          
          {/* Compare Checkbox */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(property);
            }}
            className={`flex items-center gap-1.5 font-semibold transition ${
              isCompared
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {isCompared ? (
              <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            <span>Compare</span>
          </button>

          {/* Agent Contact & View Details */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              {property.possessionStatus}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
