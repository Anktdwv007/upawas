import type { Property } from '../types';

const PUBLIC_SYNC_KEY = 'awaas_up_cloud_properties_v3';
const SERVERLESS_API_URL = '/api/properties';

export const getCloudPropertiesFromStorage = (): Property[] => {
  try {
    const raw = localStorage.getItem(PUBLIC_SYNC_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveCloudPropertiesToStorage = (userProps: Property[]) => {
  try {
    localStorage.setItem(PUBLIC_SYNC_KEY, JSON.stringify(userProps));
  } catch (e) {
    console.warn('Could not save to local storage cache:', e);
  }
};

export const publishGlobalProperty = async (newProp: Property): Promise<boolean> => {
  try {
    const existing = getCloudPropertiesFromStorage();
    const updated = [newProp, ...existing.filter((p) => p.id !== newProp.id)];
    saveCloudPropertiesToStorage(updated);

    // Call Vercel Serverless API to persist globally across all devices
    fetch(SERVERLESS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ property: newProp }),
    }).catch((err) => console.warn('Serverless Sync Notice:', err));

    // Broadcast across open browser tabs & sessions
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const bc = new BroadcastChannel('upawas_global_live_sync');
      bc.postMessage({ type: 'NEW_GLOBAL_PROPERTY', property: newProp });
    }

    return true;
  } catch (err) {
    console.error('Cloud Sync Error:', err);
    return false;
  }
};

export const fetchRemoteGlobalProperties = async (): Promise<Property[]> => {
  try {
    const res = await fetch(SERVERLESS_API_URL);
    if (!res.ok) return [];
    const data = await res.json();
    if (data && data.properties && Array.isArray(data.properties)) {
      saveCloudPropertiesToStorage(data.properties);
      return data.properties;
    }
    return [];
  } catch {
    return [];
  }
};

export const syncAllProperties = (allProps: Property[]): Property[] => {
  const userProps = getCloudPropertiesFromStorage();
  if (userProps.length === 0) return allProps;

  // Merge user-submitted cloud properties with initial properties
  const existingIds = new Set(allProps.map((p) => p.id));
  const newFromCloud = userProps.filter((p) => !existingIds.has(p.id));

  return [...newFromCloud, ...allProps];
};
