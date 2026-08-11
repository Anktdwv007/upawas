import type { Property, User, Lead } from '../types';
import { INITIAL_PROPERTIES } from '../data/upProperties';

const PROPERTIES_KEY = 'awaas_up_properties_v2';
const USER_KEY = 'awaas_up_current_user_v2';
const LEADS_KEY = 'awaas_up_leads_v2';
const SAVED_KEY = 'awaas_up_saved_v2';

// Live Cross-Tab & Cross-Session Broadcast Channel
const propertyBroadcastChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('upawas_properties_channel')
  : null;

export const getStoredProperties = (): Property[] => {
  try {
    const raw = localStorage.getItem(PROPERTIES_KEY);
    if (!raw) {
      const initialized = INITIAL_PROPERTIES.map((p, idx) => ({
        ...p,
        viewsCount: p.viewsCount || (1240 + idx * 340),
        viewsToday: p.viewsToday || (42 + (idx % 7) * 12),
        inquiriesCount: p.inquiriesCount || (14 + (idx % 5) * 6),
      }));
      localStorage.setItem(PROPERTIES_KEY, JSON.stringify(initialized));
      return initialized;
    }
    const parsed: Property[] = JSON.parse(raw);
    return parsed.map((p, idx) => ({
      ...p,
      viewsCount: p.viewsCount || (1240 + idx * 340),
      viewsToday: p.viewsToday || (42 + (idx % 7) * 12),
      inquiriesCount: p.inquiriesCount || (14 + (idx % 5) * 6),
    }));
  } catch {
    return INITIAL_PROPERTIES;
  }
};

export const incrementPropertyViews = (propertyId: string): Property[] => {
  const properties = getStoredProperties();
  const updated = properties.map((p) => {
    if (p.id === propertyId) {
      return {
        ...p,
        viewsCount: (p.viewsCount || 1000) + 1,
        viewsToday: (p.viewsToday || 30) + 1,
      };
    }
    return p;
  });
  saveStoredProperties(updated);
  return updated;
};

export const saveStoredProperties = (properties: Property[]) => {
  localStorage.setItem(PROPERTIES_KEY, JSON.stringify(properties));
  if (propertyBroadcastChannel) {
    try {
      propertyBroadcastChannel.postMessage({ type: 'PROPERTIES_UPDATED', properties });
    } catch (e) {
      console.warn('BroadcastChannel error:', e);
    }
  }
};

export const getCurrentUser = (): User | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setCurrentUserSession = (user: User | null) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
};

export const getStoredLeads = (): Lead[] => {
  try {
    const raw = localStorage.getItem(LEADS_KEY);
    if (!raw) {
      const mockLeads: Lead[] = [
        {
          id: 'lead-101',
          propertyId: 'up-prop-1',
          propertyTitle: 'Skymark Elevate - Luxury 3 BHK High-Rise Apartment',
          buyerName: 'Aditi Sharma',
          buyerPhone: '+91 98765 12345',
          buyerEmail: 'aditi.sharma@example.com',
          visitDate: '2026-08-15',
          status: 'Pending',
          createdAt: '2026-08-09',
        },
        {
          id: 'lead-102',
          propertyId: 'up-prop-2',
          propertyTitle: 'Awadh Greens Royal 4 BHK Independent Villa',
          buyerName: 'Rahul Verma',
          buyerPhone: '+91 99188 88776',
          buyerEmail: 'rahul.verma@example.com',
          visitDate: '2026-08-16',
          status: 'Contacted',
          createdAt: '2026-08-10',
        },
      ];
      localStorage.setItem(LEADS_KEY, JSON.stringify(mockLeads));
      return mockLeads;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveStoredLeads = (leads: Lead[]) => {
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
};

export const addLead = (lead: Omit<Lead, 'id' | 'createdAt'>): Lead => {
  const leads = getStoredLeads();
  const newLead: Lead = {
    ...lead,
    id: 'lead-' + Date.now(),
    createdAt: new Date().toISOString().split('T')[0],
  };
  saveStoredLeads([newLead, ...leads]);
  return newLead;
};

