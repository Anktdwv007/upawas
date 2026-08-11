import React from 'react';
import {
  Building2,
  Heart,
  PlusCircle,
  Calculator,
  Compass,
  FileCheck,
  Moon,
  Sun,
  MapPin,
  Maximize2,
  UserCheck,
  User as UserIcon,
  Briefcase,
  Eye,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import type { UnitSystem, User } from '../types';
import { UP_CITIES } from '../data/upProperties';

interface HeaderProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
  unitSystem: UnitSystem;
  onSelectUnitSystem: (unit: UnitSystem) => void;
  savedCount: number;
  onOpenWishlist: () => void;
  onOpenPostProperty: () => void;
  onOpenLandConverter: () => void;
  onOpenStampDuty: () => void;
  onOpenBhuNaksha: () => void;
  onOpenBankLoans: () => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenSellerDashboard: () => void;
  onLogout?: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCity,
  onSelectCity,
  unitSystem,
  onSelectUnitSystem,
  savedCount,
  onOpenWishlist,
  onOpenPostProperty,
  onOpenLandConverter,
  onOpenStampDuty,
  onOpenBhuNaksha,
  onOpenBankLoans,
  currentUser,
  onOpenAuth,
  onOpenSellerDashboard,
  onLogout,
  darkMode,
  onToggleDarkMode,
}) => {
  return (
    <>
      {/* Live Site Viewers Ticker Bar */}
      <div className="bg-slate-950 text-slate-300 text-[11px] py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-white">184 Live Buyers Online</span>
            <span className="hidden sm:inline text-slate-400">• Browsing UP real estate properties right now</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-blue-400" />
              <strong>48,920</strong> site views today
            </span>
            <span className="hidden md:inline text-amber-400 font-bold">UP BhuNaksha & UPRERA Verified</span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectCity('All')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                    UPAwas<span className="text-amber-500">.com</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    RERA UP
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  Uttar Pradesh's Premier Real Estate Portal
                </p>
              </div>
            </div>

            {/* Quick UP City Selector & Unit Toggle */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm">
                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <select
                  value={selectedCity}
                  onChange={(e) => onSelectCity(e.target.value)}
                  className="bg-transparent font-medium text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                >
                  {UP_CITIES.map((city) => (
                    <option key={city} value={city} className="dark:bg-slate-900">
                      {city === 'All' ? 'All UP Cities' : city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Unit System Switcher */}
              <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
                {(['Sq.Ft', 'Gaj', 'Bigha'] as UnitSystem[]).map((unit) => (
                  <button
                    key={unit}
                    onClick={() => onSelectUnitSystem(unit)}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      unitSystem === unit
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>

            {/* UP State Tool Shortcuts */}
            <div className="hidden xl:flex items-center gap-2 text-xs font-medium">
              <button
                onClick={onOpenLandConverter}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Convert Bigha, Biswa, Gaj & Sq.Ft"
              >
                <Maximize2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>Bigha/Gaj</span>
              </button>

              <button
                onClick={onOpenStampDuty}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="UP Stamp Duty Calculator"
              >
                <Calculator className="w-3.5 h-3.5 text-emerald-500" />
                <span>UP Stamp Duty</span>
              </button>

              <button
                onClick={onOpenBankLoans}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Pre-Approved Home Loans"
              >
                <Building2 className="w-3.5 h-3.5 text-blue-500" />
                <span>Home Loans</span>
              </button>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* User Auth / Dashboard Button */}
              {currentUser ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={onOpenSellerDashboard}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    title="Open Seller Hub / Dashboard"
                  >
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-6 h-6 rounded-full object-cover" />
                    <span className="hidden sm:inline text-xs font-bold truncate max-w-[100px]">
                      {currentUser.name}
                    </span>
                    <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                  </button>

                  {onLogout && (
                    <button
                      onClick={onLogout}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold transition flex items-center gap-1"
                      title="Sign Out"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="hidden md:inline">Sign Out</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={onOpenAuth}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition"
                  >
                    <UserIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="hidden sm:inline">Sign In</span>
                  </button>

                  <button
                    onClick={onOpenAuth}
                    className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/20 text-xs font-black transition"
                    title="Site Owner Admin Portal"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                    <span>Admin Portal</span>
                  </button>
                </div>
              )}

              {/* Theme Switcher */}
              <button
                onClick={onToggleDarkMode}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
              </button>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Heart className="w-5 h-5 text-rose-500" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Post Property CTA */}
            <button
              onClick={onOpenPostProperty}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-800 hover:to-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Post Property</span>
              <span className="sm:hidden">Post</span>
            </button>

          </div>

        </div>
      </div>
    </header>
    </>
  );
};
