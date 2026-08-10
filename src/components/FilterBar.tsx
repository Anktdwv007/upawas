import React from 'react';
import { SlidersHorizontal, Grid, Map, Shield, Compass, RotateCcw } from 'lucide-react';
import type { FilterState, UnitSystem } from '../types';
import { formatPriceINR } from '../utils/conversions';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onResetFilters: () => void;
  viewMode: 'grid' | 'split';
  onToggleViewMode: (mode: 'grid' | 'split') => void;
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  viewMode,
  onToggleViewMode,
  totalResults,
}) => {
  return (
    <div className="sticky top-16 sm:top-20 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm py-3 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Filters */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          
          {/* Filter Indicator Icon */}
          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 mr-1">
            <SlidersHorizontal className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Filters:</span>
          </div>

          {/* Property Type Selector */}
          <select
            value={filters.propertyType}
            onChange={(e) => onFilterChange({ propertyType: e.target.value })}
            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium cursor-pointer focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Types</option>
            <option value="Apartment">Apartments</option>
            <option value="Villa">Villas / Houses</option>
            <option value="Plot">Plots / Land</option>
            <option value="Commercial">Commercial</option>
          </select>

          {/* BHK Chips */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold px-1">BHK:</span>
            {[null, 1, 2, 3, 4, 5].map((bhk) => (
              <button
                key={bhk ?? 'all'}
                onClick={() => onFilterChange({ bhk })}
                className={`px-2 py-0.5 rounded font-semibold transition ${
                  filters.bhk === bhk
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {bhk === null ? 'All' : `${bhk}`}
              </button>
            ))}
          </div>

          {/* Max Price Range Slider */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-slate-600 dark:text-slate-300 font-semibold">
              Max Price: {formatPriceINR(filters.maxPrice)}
            </span>
            <input
              type="range"
              min={2000000} // 20 Lacs
              max={50000000} // 5 Cr
              step={1000000}
              value={filters.maxPrice}
              onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
              className="w-24 accent-blue-600 cursor-pointer"
            />
          </div>

          {/* UP RERA Only Checkbox */}
          <button
            onClick={() => onFilterChange({ reraOnly: !filters.reraOnly })}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition font-semibold ${
              filters.reraOnly
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>RERA UP Only</span>
          </button>

          {/* Vastu Compliant Checkbox */}
          <button
            onClick={() => onFilterChange({ vastuOnly: !filters.vastuOnly })}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition font-semibold ${
              filters.vastuOnly
                ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Vastu Compliant</span>
          </button>

          {/* Reset Filters */}
          <button
            onClick={onResetFilters}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

        </div>

        {/* Right View Switch & Results Count */}
        <div className="flex items-center justify-between md:justify-end gap-3 text-xs">
          
          <span className="font-semibold text-slate-600 dark:text-slate-300">
            {totalResults} {totalResults === 1 ? 'Property' : 'Properties'} Available
          </span>

          {/* Sort Selector */}
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
          >
            <option value="recommended">Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest Listed</option>
            <option value="area-desc">Max Area</option>
          </select>

          {/* View Mode Toggle (Grid vs Interactive Map Split) */}
          <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold">
            <button
              onClick={() => onToggleViewMode('grid')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>

            <button
              onClick={() => onToggleViewMode('split')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition ${
                viewMode === 'split'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Interactive UP Map View"
            >
              <Map className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">UP Map</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
