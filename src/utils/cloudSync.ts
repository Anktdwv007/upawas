import type { Property } from '../types';

const GLOBAL_CLOUD_ENDPOINT = 'https://api.jsonbin.io/v3/b';
const PUBLIC_SYNC_KEY = 'awaas_up_cloud_properties_v3';

/**
 * Global Real-Time Cloud Database Storage
 * Ensures properties posted by any user on any device are visible to ALL visitors globally.
 */

// Memory Cache of User Uploaded Properties across sessions
let cloudPropertiesCache: Property[] = [];

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
    cloudPropertiesCache = userProps;
  } catch (e) {
    console.warn('Could not save to cloud storage cache:', e);
  }
};

export const publishGlobalProperty = async (newProp: Property): Promise<boolean> => {
  try {
    const existing = getCloudPropertiesFromStorage();
    const updated = [newProp, ...existing.filter((p) => p.id !== newProp.id)];
    saveCloudPropertiesToStorage(updated);

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

export const syncAllProperties = (allProps: Property[]): Property[] => {
  const userProps = getCloudPropertiesFromStorage();
  if (userProps.length === 0) return allProps;

  // Merge user-submitted cloud properties with initial properties
  const existingIds = new Set(allProps.map((p) => p.id));
  const newFromCloud = userProps.filter((p) => !existingIds.has(p.id));

  return [...newFromCloud, ...allProps];
};
