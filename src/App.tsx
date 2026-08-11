import React, { useState, useMemo, useEffect } from 'react';
import type { Property, FilterState, UnitSystem, ListingCategory, User, Lead, ToastMessage } from './types';
import {
  getStoredProperties,
  saveStoredProperties,
  getCurrentUser,
  setCurrentUserSession,
  getStoredLeads,
  saveStoredLeads,
  addLead,
  incrementPropertyViews,
} from './utils/storage';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { FilterBar } from './components/FilterBar';
import { PropertyCard } from './components/PropertyCard';
import { InteractiveMap } from './components/InteractiveMap';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { UPLandConverterModal } from './components/UPLandConverterModal';
import { UPStampDutyModal } from './components/UPStampDutyModal';
import { BhuNakshaGuideModal } from './components/BhuNakshaGuideModal';
import { PostPropertyModal } from './components/PostPropertyModal';
import { CompareModal } from './components/CompareModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AuthModal } from './components/AuthModal';
import { SellerDashboardModal } from './components/SellerDashboardModal';
import { BankLoanModal } from './components/BankLoanModal';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';
import { Scale, Heart, Sparkles, Building2, CheckCircle2 } from 'lucide-react';

export function App() {
  // Persistent Properties State
  const [properties, setProperties] = useState<Property[]>(getStoredProperties);
  
  // Persistent User Session
  const [currentUser, setCurrentUser] = useState<User | null>(getCurrentUser);

  // Persistent Leads
  const [leads, setLeads] = useState<Lead[]>(getStoredLeads);

  // Toast Alerts State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = 'toast-' + Date.now();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync Properties to localStorage
  useEffect(() => {
    saveStoredProperties(properties);
  }, [properties]);

  // Sync Leads to localStorage
  useEffect(() => {
    saveStoredLeads(leads);
  }, [leads]);

  // Theme State
  const [darkMode, setDarkMode] = useState<boolean>(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    city: 'All',
    category: 'Buy',
    propertyType: 'All',
    bhk: null,
    minPrice: 0,
    maxPrice: 50000000,
    reraOnly: false,
    vastuOnly: false,
    possessionStatus: 'All',
    unitSystem: 'Sq.Ft',
    sortBy: 'recommended',
  });

  // View Mode
  const [viewMode, setViewMode] = useState<'grid' | 'split'>('grid');

  // Saved Properties State (persisted)
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('awaas_up_saved_v2');
      return stored ? JSON.parse(stored) : ['up-prop-1', 'up-prop-3'];
    } catch {
      return ['up-prop-1', 'up-prop-3'];
    }
  });

  useEffect(() => {
    localStorage.setItem('awaas_up_saved_v2', JSON.stringify(savedIds));
  }, [savedIds]);

  // Compared Properties
  const [comparedProperties, setComparedProperties] = useState<Property[]>([]);

  // Selected Detail Modal
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Modal States
  const [isLandConverterOpen, setIsLandConverterOpen] = useState(false);
  const [isStampDutyOpen, setIsStampDutyOpen] = useState(false);
  const [isBhuNakshaOpen, setIsBhuNakshaOpen] = useState(false);
  const [isPostPropertyOpen, setIsPostPropertyOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSellerDashboardOpen, setIsSellerDashboardOpen] = useState(false);
  const [isBankLoansOpen, setIsBankLoansOpen] = useState(false);

  // Filter Handlers
  const handleUpdateFilters = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      city: 'All',
      category: 'Buy',
      propertyType: 'All',
      bhk: null,
      minPrice: 0,
      maxPrice: 50000000,
      reraOnly: false,
      vastuOnly: false,
      possessionStatus: 'All',
      unitSystem: filters.unitSystem,
      sortBy: 'recommended',
    });
  };

  const handleToggleSave = (id: string) => {
    setSavedIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        addToast('info', 'Removed from Wishlist', 'Property removed from saved list.');
        return prev.filter((i) => i !== id);
      } else {
        addToast('success', 'Saved to Wishlist', 'Property added to saved list.');
        return [...prev, id];
      }
    });
  };

  const handleToggleCompare = (property: Property) => {
    setComparedProperties((prev) => {
      const exists = prev.some((p) => p.id === property.id);
      if (exists) {
        return prev.filter((p) => p.id !== property.id);
      }
      if (prev.length >= 3) {
        addToast('warning', 'Comparison Limit Reached', 'You can compare up to 3 properties side-by-side.');
        return prev;
      }
      addToast('info', 'Added to Compare', `${property.title.slice(0, 25)}... added to comparison.`);
      return [...prev, property];
    });
  };

  const handleAddProperty = (newProperty: Property) => {
    const updatedProp = currentUser ? { ...newProperty, ownerId: currentUser.id } : newProperty;
    setProperties((prev) => [updatedProp, ...prev]);
    setIsPostPropertyOpen(false);
    setSelectedProperty(updatedProp);
    addToast('success', 'Property Published!', 'Your listing is live for lakhs of buyers across UP & NCR.');
  };

  const handleUpdatePropertyStatus = (propertyId: string, status: 'Ready to Move' | 'Sold') => {
    setProperties((prev) =>
      prev.map((p) => (p.id === propertyId ? { ...p, possessionStatus: status } : p))
    );
    addToast('success', 'Status Updated', `Property status set to ${status}.`);
  };

  const handleUpdateLeadStatus = (leadId: string, status: 'Pending' | 'Contacted' | 'Completed') => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status } : l))
    );
    addToast('info', 'Lead Updated', `Lead status updated to ${status}.`);
  };

  const handleBookSiteVisit = (property: Property, name: string, phone: string, date: string) => {
    const created = addLead({
      propertyId: property.id,
      propertyTitle: property.title,
      buyerName: name,
      buyerPhone: phone,
      visitDate: date,
      status: 'Pending',
    });
    setLeads((prev) => [created, ...prev]);
    addToast('success', 'Site Visit Requested', `Agent ${property.agent.name} notified for ${date}.`);
  };

  const handleShareProperty = (property: Property) => {
    navigator.clipboard.writeText(window.location.href);
    addToast('success', 'Link Copied', 'Property link copied to clipboard.');
  };

  const handleApplyLoan = (bankName: string) => {
    setIsBankLoansOpen(false);
    addToast('success', 'Loan Inquiry Submitted', `Partner representative from ${bankName} will contact you.`);
  };

  // Filtered & Sorted Properties List
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (filters.category === 'Rent' && p.priceType !== 'Rent') return false;
      if (filters.category === 'Plots' && p.type !== 'Plot') return false;
      if (filters.category === 'Commercial' && p.type !== 'Commercial') return false;
      if (filters.city !== 'All' && p.city !== filters.city) return false;
      if (filters.propertyType !== 'All' && p.type !== filters.propertyType) return false;
      if (filters.bhk !== null && p.bhk !== filters.bhk) return false;
      if (p.price > filters.maxPrice) return false;
      if (filters.reraOnly && !p.reraApproved) return false;
      if (filters.vastuOnly && !p.vastuCompliant) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchLoc = p.location.toLowerCase().includes(q);
        const matchCity = p.city.toLowerCase().includes(q);
        const matchLocality = p.locality.toLowerCase().includes(q);
        if (!matchTitle && !matchLoc && !matchCity && !matchLocality) return false;
      }
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (filters.sortBy === 'area-desc') return b.areaSqFt - a.areaSqFt;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [properties, filters]);

  const savedPropertyList = useMemo(() => {
    return properties.filter((p) => savedIds.includes(p.id));
  }, [properties, savedIds]);

  const handleSelectProperty = (property: Property) => {
    const updatedProps = incrementPropertyViews(property.id);
    setProperties(updatedProps);
    const updatedItem = updatedProps.find((p) => p.id === property.id) || property;
    setSelectedProperty(updatedItem);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col font-sans">
      
      {/* Header Bar */}
      <Header
        selectedCity={filters.city}
        onSelectCity={(city) => handleUpdateFilters({ city })}
        unitSystem={filters.unitSystem}
        onSelectUnitSystem={(unit) => handleUpdateFilters({ unitSystem: unit })}
        savedCount={savedIds.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenPostProperty={() => setIsPostPropertyOpen(true)}
        onOpenLandConverter={() => setIsLandConverterOpen(true)}
        onOpenStampDuty={() => setIsStampDutyOpen(true)}
        onOpenBhuNaksha={() => setIsBhuNakshaOpen(true)}
        onOpenBankLoans={() => setIsBankLoansOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSellerDashboard={() => setIsSellerDashboardOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Hero Showcase Search */}
      <HeroSearch
        category={filters.category}
        onSelectCategory={(cat) => handleUpdateFilters({ category: cat })}
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => handleUpdateFilters({ searchQuery: q })}
        selectedCity={filters.city}
        onSelectCity={(city) => handleUpdateFilters({ city })}
        onOpenLandConverter={() => setIsLandConverterOpen(true)}
        onOpenStampDuty={() => setIsStampDutyOpen(true)}
        onOpenBhuNaksha={() => setIsBhuNakshaOpen(true)}
      />

      {/* Sticky Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={handleUpdateFilters}
        onResetFilters={handleResetFilters}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        totalResults={filteredProperties.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {viewMode === 'grid' ? (
          /* Grid View Mode */
          filteredProperties.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
              <Building2 className="w-16 h-16 mx-auto text-slate-400 stroke-1" />
              <h3 className="text-xl font-extrabold">No Properties Matched Your Criteria</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Try widening your price range, clearing RERA/Vastu filters, or searching for other UP cities like Lucknow, Noida, or Ayodhya.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((prop) => (
                <PropertyCard
                  key={prop.id}
                  property={prop}
                  unitSystem={filters.unitSystem}
                  isSaved={savedIds.includes(prop.id)}
                  onToggleSave={handleToggleSave}
                  isCompared={comparedProperties.some((cp) => cp.id === prop.id)}
                  onToggleCompare={handleToggleCompare}
                  onSelectProperty={handleSelectProperty}
                />
              ))}
            </div>
          )
        ) : (
          /* Interactive Map Split View */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Map Canvas */}
            <div className="lg:col-span-7">
              <InteractiveMap
                properties={filteredProperties}
                unitSystem={filters.unitSystem}
                onSelectProperty={handleSelectProperty}
                selectedCity={filters.city}
              />
            </div>

            {/* Side Card List */}
            <div className="lg:col-span-5 space-y-4 max-h-[750px] overflow-y-auto pr-1">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Showing {filteredProperties.length} Properties on UP Map
              </div>

              {filteredProperties.map((prop) => (
                <PropertyCard
                  key={prop.id}
                  property={prop}
                  unitSystem={filters.unitSystem}
                  isSaved={savedIds.includes(prop.id)}
                  onToggleSave={handleToggleSave}
                  isCompared={comparedProperties.some((cp) => cp.id === prop.id)}
                  onToggleCompare={handleToggleCompare}
                  onSelectProperty={handleSelectProperty}
                />
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Floating Comparison Action Bar */}
      {comparedProperties.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-xl border border-slate-700 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-2 text-xs font-bold">
            <Scale className="w-4 h-4 text-blue-400" />
            <span>Comparing {comparedProperties.length}/3 Properties</span>
          </div>

          <button
            onClick={() => setIsCompareOpen(true)}
            className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md transition"
          >
            Compare Side-by-Side
          </button>

          <button
            onClick={() => setComparedProperties([])}
            className="text-slate-400 hover:text-white text-xs font-semibold"
          >
            Clear
          </button>
        </div>
      )}

      {/* Modals & Drawers */}
      <PropertyDetailModal
        property={selectedProperty}
        unitSystem={filters.unitSystem}
        onClose={() => setSelectedProperty(null)}
        isSaved={selectedProperty ? savedIds.includes(selectedProperty.id) : false}
        onToggleSave={handleToggleSave}
        onOpenBhuNaksha={() => {
          setSelectedProperty(null);
          setIsBhuNakshaOpen(true);
        }}
        onOpenBankLoans={() => {
          setSelectedProperty(null);
          setIsBankLoansOpen(true);
        }}
        onShareProperty={handleShareProperty}
        onBookSiteVisit={handleBookSiteVisit}
      />

      {isLandConverterOpen && (
        <UPLandConverterModal onClose={() => setIsLandConverterOpen(false)} />
      )}

      {isStampDutyOpen && (
        <UPStampDutyModal onClose={() => setIsStampDutyOpen(false)} />
      )}

      {isBhuNakshaOpen && (
        <BhuNakshaGuideModal onClose={() => setIsBhuNakshaOpen(false)} />
      )}

      {isBankLoansOpen && (
        <BankLoanModal
          onClose={() => setIsBankLoansOpen(false)}
          onApplyLoan={handleApplyLoan}
        />
      )}

      {isPostPropertyOpen && (
        <PostPropertyModal
          onClose={() => setIsPostPropertyOpen(false)}
          onAddProperty={handleAddProperty}
        />
      )}

      {isCompareOpen && (
        <CompareModal
          properties={comparedProperties}
          unitSystem={filters.unitSystem}
          onRemove={(id) =>
            setComparedProperties((prev) => prev.filter((p) => p.id !== id))
          }
          onClose={() => setIsCompareOpen(false)}
          onSelectProperty={setSelectedProperty}
        />
      )}

      {isAuthOpen && (
        <AuthModal
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setIsAuthOpen(false);
            addToast('success', `Welcome ${user.name}!`, `Logged in as ${user.role}.`);
          }}
        />
      )}

      {isSellerDashboardOpen && currentUser && (
        <SellerDashboardModal
          user={currentUser}
          properties={properties}
          leads={leads}
          unitSystem={filters.unitSystem}
          onClose={() => setIsSellerDashboardOpen(false)}
          onOpenPostProperty={() => {
            setIsSellerDashboardOpen(false);
            setIsPostPropertyOpen(true);
          }}
          onUpdatePropertyStatus={handleUpdatePropertyStatus}
          onUpdateLeadStatus={handleUpdateLeadStatus}
          onSelectProperty={setSelectedProperty}
        />
      )}

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        savedProperties={savedPropertyList}
        unitSystem={filters.unitSystem}
        onRemoveSave={handleToggleSave}
        onSelectProperty={setSelectedProperty}
      />

      {/* Real-Time Toast Alerts */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Footer */}
      <Footer
        onSelectCity={(city) => handleUpdateFilters({ city })}
        onOpenLandConverter={() => setIsLandConverterOpen(true)}
        onOpenStampDuty={() => setIsStampDutyOpen(true)}
        onOpenBhuNaksha={() => setIsBhuNakshaOpen(true)}
      />

    </div>
  );
}

export default App;
