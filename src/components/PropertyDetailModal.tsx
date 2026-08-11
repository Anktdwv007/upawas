import React, { useState } from 'react';
import {
  X,
  MapPin,
  Heart,
  ShieldCheck,
  Compass,
  Phone,
  MessageSquare,
  Calendar,
  Calculator,
  Eye,
  Maximize2,
  Navigation,
  CheckCircle2,
  Building,
  UserCheck,
  Sparkles,
  Share2,
  Printer,
  Table,
} from 'lucide-react';
import type { Property, UnitSystem } from '../types';
import {
  convertLandArea,
  formatArea,
  formatPriceINR,
  calculateEMI,
  generateAmortizationSchedule,
  calculateUPStampDuty,
} from '../utils/conversions';

interface PropertyDetailModalProps {
  property: Property | null;
  unitSystem: UnitSystem;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onOpenBhuNaksha: () => void;
  onOpenBankLoans: () => void;
  onShareProperty: (property: Property) => void;
  onBookSiteVisit: (property: Property, name: string, phone: string, date: string) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  unitSystem,
  onClose,
  isSaved,
  onToggleSave,
  onOpenBhuNaksha,
  onOpenBankLoans,
  onShareProperty,
  onBookSiteVisit,
}) => {
  if (!property) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'tour' | 'finance' | 'visit'>('overview');
  const [selectedImg, setSelectedImg] = useState(property.images[0]);
  
  // EMI State
  const [loanPrincipal, setLoanPrincipal] = useState(Math.round(property.price * 0.8));
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);

  // UP Stamp Duty Gender State
  const [stampGender, setStampGender] = useState<'Male' | 'Female' | 'Joint'>('Female');

  // Site Visit Booking Form State
  const [visitDate, setVisitDate] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitBooked, setVisitBooked] = useState(false);

  // Calculations
  const landAreaDetails = convertLandArea(property.areaSqFt, 'Sq.Ft');
  const emiResult = calculateEMI(loanPrincipal, interestRate, tenureYears);
  const scheduleResult = generateAmortizationSchedule(loanPrincipal, interestRate, tenureYears);
  const stampDutyResult = calculateUPStampDuty(property.price, stampGender);

  const handleBookVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName || !visitorPhone || !visitDate) return;
    onBookSiteVisit(property, visitorName, visitorPhone, visitDate);
    setVisitBooked(true);
  };

  const handlePrintBrochure = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 font-bold text-xs border border-blue-600/20">
              {property.city}
            </span>
            {property.reraApproved && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>UPRERA: {property.reraId}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onShareProperty(property)}
              className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-500 transition"
              title="Share Property Link"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={handlePrintBrochure}
              className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-500 transition hidden sm:flex"
              title="Print Brochure"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={() => onToggleSave(property.id)}
              className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-rose-500 transition"
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Title & Price Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {property.title}
              </h2>
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm mt-1">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                <span>{property.location}, {property.city}, Uttar Pradesh</span>
              </div>

              {/* Viewers & Analytics Stats */}
              <div className="flex flex-wrap items-center gap-2 mt-2.5">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800">
                  <Eye className="w-3.5 h-3.5 text-blue-500" />
                  <span>{(property.viewsCount || 1420).toLocaleString('en-IN')} Views</span>
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{property.viewsToday || 84} Views Today</span>
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{property.inquiriesCount || 18} Buyer Inquiries</span>
                </span>
              </div>
            </div>

            <div className="text-left md:text-right">
              <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                {formatPriceINR(property.price)}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                ₹{property.pricePerSqFt.toLocaleString('en-IN')}/sq.ft
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs sm:text-sm font-semibold">
            {[
              { id: 'overview', label: 'Overview & Gallery', icon: Eye },
              { id: 'tour', label: '360° Virtual Tour', icon: Maximize2 },
              { id: 'finance', label: 'UP Stamp Duty & EMI', icon: Calculator },
              { id: 'visit', label: 'Book Site Visit', icon: Calendar },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW & GALLERY */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Photo Showcase */}
              <div className="space-y-3">
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                  <img
                    src={selectedImg}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {property.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImg(img)}
                      className={`relative aspect-video rounded-xl overflow-hidden border-2 transition ${
                        selectedImg === img ? 'border-blue-600 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* DUAL AREA BREAKDOWN FOR UP CONSUMERS */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-amber-900/10 border border-blue-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <Maximize2 className="w-5 h-5 text-amber-500" />
                    <span>Uttar Pradesh Land Area Specifications</span>
                  </h4>
                  <button
                    onClick={onOpenBhuNaksha}
                    className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                    Verify on BhuNaksha Portal →
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
                    <div className="text-[11px] text-slate-400 font-semibold">Square Feet</div>
                    <div className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
                      {landAreaDetails.sqFt.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
                    <div className="text-[11px] text-slate-400 font-semibold">Gaj (Sq. Yards)</div>
                    <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                      {landAreaDetails.gaj.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
                    <div className="text-[11px] text-slate-400 font-semibold">Pucca Bigha (UP)</div>
                    <div className="text-lg font-extrabold text-amber-600 dark:text-amber-400">
                      {landAreaDetails.bighaPucca}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
                    <div className="text-[11px] text-slate-400 font-semibold">UP Biswa</div>
                    <div className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                      {landAreaDetails.biswaPucca}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm col-span-2 sm:col-span-1">
                    <div className="text-[11px] text-slate-400 font-semibold">Acres</div>
                    <div className="text-lg font-extrabold text-rose-600 dark:text-rose-400">
                      {landAreaDetails.acre}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Description</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Amenities */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Amenities & Features</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {property.amenities.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: 360 VIRTUAL TOUR SIMULATOR */}
          {activeTab === 'tour' && (
            <div className="space-y-4 text-center py-6">
              <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 group">
                <img
                  src={property.images[0]}
                  alt="360 Tour"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-slate-950/40 flex flex-col items-center justify-center space-y-3 text-white p-4">
                  <div className="w-16 h-16 rounded-full bg-blue-600/80 backdrop-blur-md flex items-center justify-center animate-pulse">
                    <Maximize2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-extrabold">360° Interactive Panoramic Tour</h3>
                  <p className="text-xs text-slate-300 max-w-md">
                    Drag around to explore the interior balcony, grand living area, modular German kitchen, and master suite in 3D.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: UP STAMP DUTY & EMI AMORTIZATION */}
          {activeTab === 'finance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* UP Stamp Duty Box */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                    <Building className="w-5 h-5 text-indigo-500" />
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                      UP Government Stamp Duty Calculator
                    </h4>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                      Buyer Gender Category (UP Tax Rules):
                    </label>
                    <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                      {(['Female', 'Male', 'Joint'] as const).map((gender) => (
                        <button
                          key={gender}
                          onClick={() => setStampGender(gender)}
                          className={`py-2 rounded-xl border transition ${
                            stampGender === gender
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {gender} ({gender === 'Female' ? '6%' : gender === 'Male' ? '7%' : '6.5%'})
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                      <span>Property Agreed Price:</span>
                      <span className="font-bold">{formatPriceINR(property.price)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                      <span>Stamp Duty ({stampDutyResult.stampDutyRate}%):</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {formatPriceINR(stampDutyResult.stampDutyAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                      <span>Registration Fee (1%):</span>
                      <span className="font-bold">{formatPriceINR(stampDutyResult.registrationFee)}</span>
                    </div>
                    <div className="flex justify-between py-2 text-sm font-extrabold text-slate-900 dark:text-white pt-2">
                      <span>Total Effective Property Cost:</span>
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {formatPriceINR(stampDutyResult.totalEffectiveCost)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Home Loan EMI Box */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                    <div className="flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-blue-500" />
                      <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                        Home Loan EMI Estimator
                      </h4>
                    </div>
                    <button
                      onClick={onOpenBankLoans}
                      className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
                    >
                      Check Bank Rates →
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span>Loan Principal:</span>
                        <span>{formatPriceINR(loanPrincipal)}</span>
                      </div>
                      <input
                        type="range"
                        min={1000000}
                        max={property.price}
                        step={500000}
                        value={loanPrincipal}
                        onChange={(e) => setLoanPrincipal(Number(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span>Interest Rate (%):</span>
                        <span>{interestRate}% p.a.</span>
                      </div>
                      <input
                        type="range"
                        min={6.5}
                        max={12}
                        step={0.1}
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span>Loan Tenure:</span>
                        <span>{tenureYears} Years</span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={30}
                        step={1}
                        value={tenureYears}
                        onChange={(e) => setTenureYears(Number(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-600 text-white text-center space-y-1">
                    <div className="text-xs text-blue-100 font-semibold">Estimated Monthly EMI</div>
                    <div className="text-2xl font-extrabold">
                      ₹{emiResult.emi.toLocaleString('en-IN')}/mo
                    </div>
                  </div>
                </div>

              </div>

              {/* Monthly Amortization Schedule Table */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Table className="w-4 h-4 text-blue-500" />
                  <span>First Year Monthly Amortization Breakdown</span>
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase font-bold">
                        <th className="p-2">Month</th>
                        <th className="p-2">Principal Paid</th>
                        <th className="p-2">Interest Paid</th>
                        <th className="p-2">Remaining Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                      {scheduleResult.map((row) => (
                        <tr key={row.month}>
                          <td className="p-2 font-bold text-slate-900 dark:text-white">Month {row.month}</td>
                          <td className="p-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                            ₹{row.principalPayment.toLocaleString('en-IN')}
                          </td>
                          <td className="p-2 text-rose-500 font-semibold">
                            ₹{row.interestPayment.toLocaleString('en-IN')}
                          </td>
                          <td className="p-2 font-bold">
                            ₹{row.remainingBalance.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: BOOK FREE SITE VISIT */}
          {activeTab === 'visit' && (
            <div className="max-w-xl mx-auto space-y-6">
              {visitBooked ? (
                <div className="p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Site Visit Request Sent to Agent!
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Thank you, <strong>{visitorName}</strong>. Agent <strong>{property.agent.name}</strong> has received your site visit booking for <strong>{visitDate}</strong>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookVisit} className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span>Schedule Free Guided Site Visit</span>
                  </h3>

                  <div className="space-y-3 text-xs font-semibold">
                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aditi Sharma"
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 mb-1">Mobile Number (WhatsApp)</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={visitorPhone}
                        onChange={(e) => setVisitorPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 mb-1">Preferred Date</label>
                      <input
                        type="date"
                        required
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-md transition"
                  >
                    Confirm Free Site Visit Booking
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Footer Agent Sticky Action Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <img
              src={property.agent.avatar}
              alt={property.agent.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-blue-500"
            />
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1">
                <span>{property.agent.name}</span>
                {property.agent.verified && <UserCheck className="w-3.5 h-3.5 text-blue-500" />}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {property.agent.agency} | Rating: ★ {property.agent.rating}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${property.agent.whatsapp}?text=Hi%20${property.agent.name},%20I%20am%20interested%20in%20your%20property:%20${encodeURIComponent(property.title)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Agent</span>
            </a>

            <a
              href={`tel:${property.agent.phone}`}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
            >
              <Phone className="w-4 h-4" />
              <span>Call Agent</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
