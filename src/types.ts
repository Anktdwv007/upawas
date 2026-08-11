export type PropertyType = 'Apartment' | 'Villa' | 'Plot' | 'Commercial' | 'Farmhouse';
export type ListingCategory = 'Buy' | 'Rent' | 'Plots' | 'Commercial';
export type UnitSystem = 'Sq.Ft' | 'Gaj' | 'Bigha';

export type UserRole = 'buyer' | 'seller' | 'agent' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  agencyName?: string;
  avatar?: string;
  verified: boolean;
}

export interface Lead {
  id: string;
  propertyId: string;
  propertyTitle: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string;
  visitDate: string;
  status: 'Pending' | 'Contacted' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface Property {
  id: string;
  title: string;
  location: string;
  locality: string;
  city: 'Lucknow' | 'Noida' | 'Greater Noida' | 'Varanasi' | 'Ayodhya' | 'Kanpur' | 'Prayagraj' | 'Agra' | 'Ghaziabad' | 'Gorakhpur';
  price: number; // in INR
  priceType: 'Buy' | 'Rent';
  rentPeriod?: 'month' | 'year';
  type: PropertyType;
  bhk?: number;
  bathrooms?: number;
  areaSqFt: number;
  pricePerSqFt: number;
  facing: 'North' | 'East' | 'North-East' | 'South-East' | 'West';
  possessionStatus: 'Ready to Move' | 'Under Construction' | 'New Launch' | 'Sold';
  possessionYear?: string;
  
  // UP Specific & Compliance
  reraApproved: boolean;
  reraId?: string;
  vastuCompliant: boolean;
  bankApproved: boolean;
  bhuNakshaVerified: boolean;
  expresswayDistanceKm?: number;
  metroDistanceKm?: number;
  
  // Visuals & Media
  images: string[];
  virtualTour360?: boolean;
  floorPlanUrl?: string;
  featured?: boolean;
  
  // Coordinates for Map
  lat: number;
  lng: number;
  
  // Description & Amenities
  description: string;
  amenities: string[];
  
  // Owner / Agent Details
  ownerId?: string; // links to User if posted by user
  agent: {
    name: string;
    agency: string;
    phone: string;
    whatsapp: string;
    verified: boolean;
    rating: number;
    avatar: string;
  };
  
  // Analytics, Safety & Viewers Tracking
  viewsCount?: number;
  viewsToday?: number;
  inquiriesCount?: number;
  reportedCount?: number;
  verifiedPhone?: boolean;

  createdAt: string;
}

export interface FilterState {
  searchQuery: string;
  city: string;
  category: ListingCategory;
  propertyType: string;
  bhk: number | null;
  minPrice: number;
  maxPrice: number;
  reraOnly: boolean;
  vastuOnly: boolean;
  possessionStatus: string;
  unitSystem: UnitSystem;
  sortBy: 'recommended' | 'price-asc' | 'price-desc' | 'newest' | 'area-desc';
}

export interface LandConversionResult {
  sqFt: number;
  gaj: number;
  bighaPucca: number;
  biswaPucca: number;
  bighaKutcha: number;
  acre: number;
  hectare: number;
}

export interface AmortizationItem {
  month: number;
  principalPayment: number;
  interestPayment: number;
  remainingBalance: number;
}

export interface BankOffer {
  bankName: string;
  logo: string;
  interestRate: number;
  maxTenureYears: number;
  processingFee: string;
  specialFeature: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

export interface PropertyReport {
  id: string;
  propertyId: string;
  propertyTitle: string;
  sellerName: string;
  sellerPhone: string;
  reason: string;
  comments: string;
  reportedAt: string;
  status: 'Pending' | 'Dismissed' | 'Removed';
}
