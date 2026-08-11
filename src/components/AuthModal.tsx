import React, { useState } from 'react';
import { X, UserCheck, ShieldCheck, Mail, Phone, Lock, Building2, User } from 'lucide-react';
import type { User as UserType, UserRole } from '../types';
import { setCurrentUserSession } from '../utils/storage';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [role, setRole] = useState<UserRole>('seller');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agencyName, setAgencyName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newUser: UserType = {
      id: 'user-' + Date.now(),
      name: name || (mode === 'login' ? 'Sunil Srivastava' : 'Property User'),
      email: email || 'user@awaasup.in',
      phone: phone || '+91 98765 43210',
      role,
      agencyName: role === 'agent' ? (agencyName || 'Awadh Real Estate') : undefined,
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    };

    setCurrentUserSession(newUser);
    onLoginSuccess(newUser);
  };

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [adminError, setAdminError] = useState('');

  const handleVerifyAdminPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin.trim() === 'UPAWAS@2026' || adminPin.trim() === 'admin123') {
      const adminUser: UserType = {
        id: 'admin-001',
        name: 'UPAwas Official Admin',
        email: 'admin@upawas.com',
        phone: '+91 99188 00000',
        role: 'admin',
        agencyName: 'UPAwas Portal Administration',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      };
      setCurrentUserSession(adminUser);
      onLoginSuccess(adminUser);
    } else {
      setAdminError('❌ Incorrect Secret Admin Passcode! Access Denied.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-5">
        
        {/* Protected Admin Access Banner */}
        {!isAdminMode && (
          <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border border-amber-500/30 flex items-center justify-between gap-2 shadow-sm">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 dark:text-amber-300">
                <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Site Owner / Portal Admin?</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Protected password login for audit panel.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAdminMode(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-xs shadow-md transition transform hover:scale-105"
            >
              🔒 Admin Password Login
            </button>
          </div>
        )}

        {isAdminMode ? (
          <form onSubmit={handleVerifyAdminPin} className="space-y-4 pt-2">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-300">
              <div className="flex items-center gap-2 font-black text-sm mb-1">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
                <span>Protected Admin Portal Access</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enter your secret master password to access UPAwas fraud audit controls.
              </p>
            </div>

            {adminError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold">
                {adminError}
              </div>
            )}

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-bold text-xs">
                Secret Admin Master Passcode
              </label>
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter admin passcode (e.g. UPAWAS@2026)"
                value={adminPin}
                onChange={(e) => {
                  setAdminPin(e.target.value);
                  setAdminError('');
                }}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdminMode(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Back to User Login
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-xs shadow-lg transition"
              >
                Authenticate Admin
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-600/20">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">
                {mode === 'signup' ? 'Create AwaasUP Account' : 'Sign In to AwaasUP'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Access your Seller Dashboard, Saved Homes & Buyer Leads
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

        {/* Role Switcher */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">
            Select Your Account Purpose:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'buyer', label: 'Homebuyer', icon: User },
              { id: 'seller', label: 'Owner / Seller', icon: Building2 },
              { id: 'agent', label: 'Broker / Builder', icon: ShieldCheck },
            ].map((r) => {
              const Icon = r.icon;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id as any)}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                    role === r.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs font-semibold">
          {mode === 'signup' && (
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Sunil Srivastava"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="sunil@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1">Mobile Number (Indian +91)</label>
            <input
              type="tel"
              required
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {role === 'agent' && mode === 'signup' && (
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Agency / Company Name</label>
              <input
                type="text"
                placeholder="e.g. Awadh NCR Realty Experts"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-800 hover:to-indigo-700 text-white font-extrabold text-sm shadow-xl transition-all mt-2"
          >
            {mode === 'signup' ? `Register as ${role === 'seller' ? 'Seller' : role === 'agent' ? 'Agent' : 'Homebuyer'}` : 'Sign In Now'}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500">
          {mode === 'signup' ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                Register Free
              </button>
            </p>
          )}
        </div>
          </>
        )}

      </div>
    </div>
  );
};
