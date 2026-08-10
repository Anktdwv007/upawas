import React, { useState } from 'react';
import { X, PlusCircle, Building, MapPin, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Property, PropertyType } from '../types';
import { UP_CITIES } from '../data/upProperties';

interface PostPropertyModalProps {
  onClose: () => void;
  onAddProperty: (property: Property) => void;
}

export const PostPropertyModal: React.FC<PostPropertyModalProps> = ({ onClose, onAddProperty }) => {
  const [step, setStep] = useState<number>(1);

  const [title, setTitle] = useState('');
  const [city, setCity] = useState<'Lucknow' | 'Noida' | 'Greater Noida' | 'Varanasi' | 'Ayodhya' | 'Kanpur' | 'Prayagraj' | 'Agra' | 'Ghaziabad' | 'Gorakhpur'>('Lucknow');
  const [locality, setLocality] = useState('');
  const [type, setType] = useState<PropertyType>('Apartment');
  const [bhk, setBhk] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(3);
  const [areaSqFt, setAreaSqFt] = useState<number>(1500);
  const [price, setPrice] = useState<number>(7500000);
  const [reraApproved, setReraApproved] = useState(true);
  const [reraId, setReraId] = useState('UPRERAPRJ' + Math.floor(10000 + Math.random() * 90000));
  const [vastuCompliant, setVastuCompliant] = useState(true);
  const [agentName, setAgentName] = useState('');
  const [agentPhone, setAgentPhone] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProp: Property = {
      id: 'up-prop-' + Date.now(),
      title: title || `${type} in ${locality || city}`,
      location: locality ? `${locality}, ${city}` : city,
      locality: locality || city,
      city,
      price,
      priceType: 'Buy',
      type,
      bhk: type === 'Plot' || type === 'Commercial' ? undefined : bhk,
      bathrooms: type === 'Plot' || type === 'Commercial' ? undefined : bathrooms,
      areaSqFt,
      pricePerSqFt: Math.round(price / areaSqFt),
      facing: 'North-East',
      possessionStatus: 'Ready to Move',
      possessionYear: '2026',
      reraApproved,
      reraId: reraApproved ? reraId : undefined,
      vastuCompliant,
      bankApproved: true,
      bhuNakshaVerified: true,
      images: [
        '/lucknow_villa.jpg',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      ],
      virtualTour360: true,
      featured: true,
      lat: 26.85 + (Math.random() - 0.5) * 0.5,
      lng: 80.9 + (Math.random() - 0.5) * 0.5,
      description: description || `Premium ${type} located in prime location of ${locality}, ${city}, Uttar Pradesh. Fully verified legal title and RERA approved.`,
      amenities: ['24/7 Gated Security', 'Power Backup', 'Water Supply', 'Vastu Compliant'],
      agent: {
        name: agentName || 'Property Owner',
        agency: 'Direct Owner Listing',
        phone: agentPhone || '+91 98765 43210',
        whatsapp: '919876543210',
        verified: true,
        rating: 5.0,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      },
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Confetti celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    onAddProperty(newProp);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-600/20">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">
                Post Property Free on AwaasUP
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Reach Lakhs of genuine buyers across Uttar Pradesh & NCR
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Property Title / Headline *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Modern 3 BHK Luxury Apartment in Gomti Nagar"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Select UP City *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {UP_CITIES.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Locality / Landmark *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sector 150, Ram Path, Sigra"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa / House</option>
                  <option value="Plot">Plot / Land</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  BHK
                </label>
                <select
                  value={bhk}
                  onChange={(e) => setBhk(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>{num} BHK</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Area (Sq.Ft) *
                </label>
                <input
                  type="number"
                  required
                  min={100}
                  value={areaSqFt}
                  onChange={(e) => setAreaSqFt(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Price (₹ INR) *
                </label>
                <input
                  type="number"
                  required
                  min={100000}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-semibold">
              <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reraApproved}
                  onChange={(e) => setReraApproved(e.target.checked)}
                  className="w-4 h-4 accent-blue-600"
                />
                <span>RERA UP Registered Property</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={vastuCompliant}
                  onChange={(e) => setVastuCompliant(e.target.checked)}
                  className="w-4 h-4 accent-amber-500"
                />
                <span>Vastu Compliant Facing</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Owner / Agent Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={agentPhone}
                  onChange={(e) => setAgentPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold"
                />
              </div>
            </div>

          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-800 hover:to-indigo-700 text-white font-extrabold text-sm shadow-xl transition-all hover:scale-[1.01]"
          >
            Publish Free UP Property Listing
          </button>
        </form>

      </div>
    </div>
  );
};
