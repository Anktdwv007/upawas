import React, { useState } from 'react';
import { X, PlusCircle, Building, MapPin, ShieldCheck, CheckCircle2, Sparkles, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Property, PropertyType } from '../types';
import { UP_CITIES } from '../data/upProperties';

interface PostPropertyModalProps {
  onClose: () => void;
  onAddProperty: (property: Property) => void;
}

export const PostPropertyModal: React.FC<PostPropertyModalProps> = ({ onClose, onAddProperty }) => {
  const [listingCategory, setListingCategory] = useState<'Buy' | 'Rent' | 'Plots' | 'Commercial'>('Buy');
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

  // Image Upload state & restrictions
  const [images, setImages] = useState<string[]>([]);
  const [customUrl, setCustomUrl] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const MAX_PHOTOS = 5;
  const MAX_SIZE_MB = 3;

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > MAX_PHOTOS) {
      setUploadError(`Maximum ${MAX_PHOTOS} photos allowed per listing to maintain fast load times.`);
      return;
    }

    const fileList = Array.from(files);
    for (const file of fileList) {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setUploadError(`File "${file.name}" exceeds the ${MAX_SIZE_MB}MB size limit.`);
        return;
      }
    }

    for (const file of fileList) {
      const compressed = await compressImage(file);
      setImages((prev) => [...prev, compressed]);
    }
  };

  const handleAddCustomUrl = () => {
    setUploadError(null);
    if (!customUrl.trim()) return;

    if (images.length >= MAX_PHOTOS) {
      setUploadError(`Maximum ${MAX_PHOTOS} photos allowed per listing.`);
      return;
    }

    setImages((prev) => [...prev, customUrl.trim()]);
    setCustomUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setUploadError(null);
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalImages = images.length > 0
      ? images
      : [
          '/lucknow_villa.jpg',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        ];

    const effectiveType: PropertyType =
      listingCategory === 'Plots'
        ? 'Plot'
        : listingCategory === 'Commercial'
        ? 'Commercial'
        : type;

    const effectivePriceType = listingCategory === 'Rent' ? 'Rent' : 'Buy';

    const newProp: Property = {
      id: 'up-prop-' + Date.now(),
      title: title || `${effectiveType} in ${locality || city}`,
      location: locality ? `${locality}, ${city}` : city,
      locality: locality || city,
      city,
      price,
      priceType: effectivePriceType,
      rentPeriod: effectivePriceType === 'Rent' ? 'month' : undefined,
      type: effectiveType,
      bhk: effectiveType === 'Plot' || effectiveType === 'Commercial' ? undefined : bhk,
      bathrooms: effectiveType === 'Plot' || effectiveType === 'Commercial' ? undefined : bathrooms,
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
      images: finalImages,
      virtualTour360: true,
      featured: true,
      lat: 26.85 + (Math.random() - 0.5) * 0.5,
      lng: 80.9 + (Math.random() - 0.5) * 0.5,
      description: description || `Premium ${effectiveType} (${listingCategory}) located in prime location of ${locality}, ${city}, Uttar Pradesh. Fully verified legal title and RERA approved.`,
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
      viewsCount: 1,
      viewsToday: 1,
      inquiriesCount: 0,
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
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-600/20">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">
                Post Property Free on UPAwas
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
          
          <div className="space-y-4">
            
            {/* Listing Purpose / Category Tabs */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                Listing Purpose / Category *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'Buy', label: 'Buy (For Sale)', icon: '🏡' },
                  { id: 'Rent', label: 'Rent (For Rent)', icon: '🔑' },
                  { id: 'Plots', label: 'Plots / Bigha Land', icon: '📐' },
                  { id: 'Commercial', label: 'Commercial', icon: '🏢' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setListingCategory(cat.id as any)}
                    className={`py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition border ${
                      listingCategory === cat.id
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md ring-2 ring-blue-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Property Title / Headline *
              </label>
              <input
                type="text"
                required
                placeholder={
                  listingCategory === 'Rent'
                    ? 'e.g. Spacious 2 BHK Flat for Rent in Gomti Nagar'
                    : listingCategory === 'Plots'
                    ? 'e.g. 1 Bigha Residential Plot near Ram Path'
                    : listingCategory === 'Commercial'
                    ? 'e.g. Prime Main Road Commercial Showroom'
                    : 'e.g. Modern 3 BHK Luxury Apartment in Sector 150'
                }
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
                  value={listingCategory === 'Plots' ? 'Plot' : listingCategory === 'Commercial' ? 'Commercial' : type}
                  onChange={(e) => setType(e.target.value as any)}
                  disabled={listingCategory === 'Plots' || listingCategory === 'Commercial'}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold disabled:opacity-60"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa / House</option>
                  <option value="Plot">Plot / Land</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              {listingCategory !== 'Plots' && listingCategory !== 'Commercial' ? (
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
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Land Unit
                  </label>
                  <div className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-extrabold border border-slate-200 dark:border-slate-700 text-center">
                    {listingCategory === 'Plots' ? 'Bigha / Gaj / SqFt' : 'Commercial Space'}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Area (Sq.Ft) *
                </label>
                <input
                  type="number"
                  required
                  min={50}
                  value={areaSqFt}
                  onChange={(e) => setAreaSqFt(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {listingCategory === 'Rent' ? 'Monthly Rent (₹ INR/mo) *' : 'Total Price (₹ INR) *'}
                </label>
                <input
                  type="number"
                  required
                  min={1000}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold"
                />
              </div>
            </div>

            {/* Photo Upload Section */}
            <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50 space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-extrabold text-blue-900 dark:text-blue-300">
                  <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Property Photos / Pictures
                </label>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                  {images.length} / {MAX_PHOTOS} photos (Max 3MB each)
                </span>
              </div>

              {uploadError && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center justify-between">
                  <span>⚠️ {uploadError}</span>
                  <button type="button" onClick={() => setUploadError(null)} className="text-rose-500 hover:underline text-[10px]">Dismiss</button>
                </div>
              )}

              {/* Upload Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-blue-400/60 dark:border-blue-600/60 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-slate-800 cursor-pointer transition text-center group">
                  <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition mb-1" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Upload Photos from Device
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    PNG, JPG (Auto-compressed to 1200px)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Paste URL */}
                <div className="flex flex-col justify-between p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Or Add Image URL
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs outline-none text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomUrl}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Photo Thumbnails */}
              {images.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-blue-200 dark:border-blue-900/40">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 group shadow-sm">
                      <img src={img} alt={`Uploaded ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute inset-0 bg-slate-950/70 text-rose-400 opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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

