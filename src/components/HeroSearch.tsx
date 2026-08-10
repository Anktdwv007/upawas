import React from 'react';
import { Search, MapPin, ShieldCheck, LandPlot, Sparkles, Building, Layers } from 'lucide-react';
import type { ListingCategory } from '../types';

interface HeroSearchProps {
  category: ListingCategory;
  onSelectCategory: (category: ListingCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  onOpenLandConverter: () => void;
  onOpenStampDuty: () => void;
  onOpenBhuNaksha: () => void;
}

const POPULAR_UP_LOCATIONS = [
  { name: 'Noida Expressway', city: 'Noida' },
  { name: 'Gomti Nagar', city: 'Lucknow' },
  { name: 'Ram Path', city: 'Ayodhya' },
  { name: 'Sigra', city: 'Varanasi' },
  { name: 'Civil Lines', city: 'Prayagraj' },
  { name: 'Taj Nagari', city: 'Agra' },
  { name: 'Swaroop Nagar', city: 'Kanpur' },
];

export const HeroSearch: React.FC<HeroSearchProps> = ({
  category,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedCity,
  onSelectCity,
  onOpenLandConverter,
  onOpenStampDuty,
  onOpenBhuNaksha,
}) => {
  return (
    <div className="relative overflow-hidden bg-slate-900 text-white pt-8 pb-12 sm:pt-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
      
      {/* Background Glow Effects & Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-950 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center space-y-6">
        
        {/* State Tagline */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Uttar Pradesh Official Real Estate Search Engine</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Find Your Sanctuary in <br />
          <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
            Uttar Pradesh
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
          Explore UPRERA verified luxury apartments, independent villas, residential plots in Ayodhya & Lucknow, and prime NCR commercial spaces.
        </p>

        {/* Category Tabs & Search Box */}
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl p-3 sm:p-4 rounded-2xl border border-white/15 shadow-2xl space-y-3">
          
          {/* Tabs */}
          <div className="flex items-center justify-center sm:justify-start gap-1 border-b border-white/10 pb-3">
            {(['Buy', 'Rent', 'Plots', 'Commercial'] as ListingCategory[]).map((tab) => (
              <button
                key={tab}
                onClick={() => onSelectCategory(tab)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  category === tab
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab === 'Plots' ? 'Plots / Bigha Land' : tab}
              </button>
            ))}
          </div>

          {/* Search Inputs */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            
            {/* Search Query Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by locality, project name, or UP City (e.g. Gomti Nagar, Noida Sector 150, Ayodhya)..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-950/80 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
              />
            </div>

            {/* City Dropdown */}
            <div className="relative w-full sm:w-48">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
              <select
                value={selectedCity}
                onChange={(e) => onSelectCity(e.target.value)}
                className="w-full pl-9 pr-8 py-3.5 rounded-xl bg-slate-950/80 border border-white/20 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer appearance-none"
              >
                <option value="All" className="bg-slate-900">All UP Cities</option>
                <option value="Lucknow" className="bg-slate-900">Lucknow (Capital)</option>
                <option value="Noida" className="bg-slate-900">Noida Expressway</option>
                <option value="Greater Noida" className="bg-slate-900">Greater Noida</option>
                <option value="Ayodhya" className="bg-slate-900">Ayodhya Ram Path</option>
                <option value="Varanasi" className="bg-slate-900">Varanasi Kashi</option>
                <option value="Kanpur" className="bg-slate-900">Kanpur Metropolis</option>
                <option value="Prayagraj" className="bg-slate-900">Prayagraj Civil Lines</option>
                <option value="Agra" className="bg-slate-900">Agra Taj Corridor</option>
                <option value="Ghaziabad" className="bg-slate-900">Ghaziabad NCR</option>
                <option value="Gorakhpur" className="bg-slate-900">Gorakhpur Taal</option>
              </select>
            </div>

          </div>

          {/* Quick Locality Tags */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
            <span className="text-[11px] text-slate-400 font-medium">Trending Localities:</span>
            {POPULAR_UP_LOCATIONS.map((loc) => (
              <button
                key={loc.name}
                onClick={() => {
                  onSelectCity(loc.city);
                  onSearchChange(loc.name);
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 border border-white/10 transition"
              >
                {loc.name} ({loc.city})
              </button>
            ))}
          </div>

        </div>

        {/* UP Consumer Quick Utility Badges */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-300">
          <button
            onClick={onOpenBhuNaksha}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 hover:border-amber-500/50 hover:text-amber-300 transition"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>UP RERA & BhuNaksha Land Title Check</span>
          </button>

          <button
            onClick={onOpenLandConverter}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 hover:border-blue-500/50 hover:text-blue-300 transition"
          >
            <LandPlot className="w-4 h-4 text-amber-400" />
            <span>UP Bigha & Biswa Converter</span>
          </button>

          <button
            onClick={onOpenStampDuty}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 hover:border-indigo-500/50 hover:text-indigo-300 transition"
          >
            <Building className="w-4 h-4 text-indigo-400" />
            <span>UP Stamp Duty Calculator</span>
          </button>
        </div>

      </div>
    </div>
  );
};
