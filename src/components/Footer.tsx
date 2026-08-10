import React from 'react';
import { Building2, ShieldCheck, MapPin, ExternalLink, Heart } from 'lucide-react';
import { UP_CITIES } from '../data/upProperties';

interface FooterProps {
  onSelectCity: (city: string) => void;
  onOpenLandConverter: () => void;
  onOpenStampDuty: () => void;
  onOpenBhuNaksha: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCity,
  onOpenLandConverter,
  onOpenStampDuty,
  onOpenBhuNaksha,
}) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-extrabold text-xl">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <span>UPAwas<span className="text-amber-400">.com</span></span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Uttar Pradesh's #1 Zillow-inspired real estate discovery platform at upawas.com. Enabling smart homebuyers & investors with UP RERA title verification, BhuNaksha land checking, and UP Bigha/Gaj conversions.
            </p>
          </div>

          {/* UP Cities Col */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">Top UP Destinations</h4>
            <ul className="space-y-1.5 font-medium">
              {UP_CITIES.filter(c => c !== 'All').slice(0, 6).map((city) => (
                <li key={city}>
                  <button
                    onClick={() => onSelectCity(city)}
                    className="hover:text-amber-400 transition"
                  >
                    Properties in {city}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* UP State Utilities Col */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">UP State Utilities</h4>
            <ul className="space-y-2 font-medium">
              <li>
                <button onClick={onOpenLandConverter} className="hover:text-amber-400 transition">
                  UP Bigha, Biswa & Gaj Converter
                </button>
              </li>
              <li>
                <button onClick={onOpenStampDuty} className="hover:text-amber-400 transition">
                  UP Stamp Duty Calculator (Male/Female)
                </button>
              </li>
              <li>
                <button onClick={onOpenBhuNaksha} className="hover:text-amber-400 transition">
                  UP Bhulekh Land Record Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Official Govt Portals */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">Official Portals</h4>
            <ul className="space-y-2 font-medium text-slate-400">
              <li>
                <a href="https://up-rera.in" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white transition">
                  <span>UPRERA Official Portal</span>
                  <ExternalLink className="w-3 h-3 text-blue-400" />
                </a>
              </li>
              <li>
                <a href="https://upbhulekh.gov.in" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white transition">
                  <span>UP Bhulekh (Khasra)</span>
                  <ExternalLink className="w-3 h-3 text-emerald-400" />
                </a>
              </li>
              <li>
                <a href="https://upbhunaksha.gov.in" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white transition">
                  <span>UP BhuNaksha Geo Maps</span>
                  <ExternalLink className="w-3 h-3 text-amber-400" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p>© 2026 UPAwas.com - Uttar Pradesh Real Estate Portal. All rights reserved.</p>
          <p className="flex items-center justify-center gap-1 text-slate-400">
            Crafted for Uttar Pradesh Consumers
          </p>
        </div>

      </div>
    </footer>
  );
};
