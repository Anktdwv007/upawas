import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Layers, ZoomIn, ZoomOut, RotateCcw, X, ExternalLink, ShieldCheck, Eye, Navigation } from 'lucide-react';
import type { Property, UnitSystem } from '../types';
import { formatArea, formatPriceINR } from '../utils/conversions';

interface InteractiveMapProps {
  properties: Property[];
  unitSystem: UnitSystem;
  onSelectProperty: (property: Property) => void;
  selectedCity: string;
}

const CITY_COORDINATES: Record<string, { lat: number; lng: number; zoom: number }> = {
  All: { lat: 26.8467, lng: 80.9462, zoom: 7 },
  Lucknow: { lat: 26.8467, lng: 80.9462, zoom: 12 },
  Noida: { lat: 28.5355, lng: 77.391, zoom: 12 },
  'Greater Noida': { lat: 28.4744, lng: 77.504, zoom: 12 },
  Ayodhya: { lat: 26.7922, lng: 82.1998, zoom: 13 },
  Varanasi: { lat: 25.3176, lng: 82.9739, zoom: 13 },
  Kanpur: { lat: 26.4499, lng: 80.3319, zoom: 12 },
  Prayagraj: { lat: 25.4358, lng: 81.8463, zoom: 12 },
  Agra: { lat: 27.1767, lng: 78.0081, zoom: 12 },
  Ghaziabad: { lat: 28.6692, lng: 77.4538, zoom: 12 },
  Gorakhpur: { lat: 26.7606, lng: 83.3732, zoom: 12 },
};

const TILE_LAYERS = {
  streets: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, Maxar, Earthstar Geographics',
  },
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO &copy; OpenStreetMap',
  },
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  properties,
  unitSystem,
  onSelectProperty,
  selectedCity,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const [activeProperty, setActiveProperty] = useState<Property | null>(null);
  const [layerMode, setLayerMode] = useState<'streets' | 'satellite' | 'osm' | 'dark'>('streets');

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const cityCenter = CITY_COORDINATES[selectedCity] || CITY_COORDINATES.All;
      const map = L.map(mapContainerRef.current, {
        center: [cityCenter.lat, cityCenter.lng],
        zoom: cityCenter.zoom,
        zoomControl: false,
      });

      const tileLayer = L.tileLayer(TILE_LAYERS[layerMode].url, {
        attribution: TILE_LAYERS[layerMode].attribution,
        maxZoom: 19,
      }).addTo(map);

      tileLayerRef.current = tileLayer;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when mode changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    tileLayerRef.current = L.tileLayer(TILE_LAYERS[layerMode].url, {
      attribution: TILE_LAYERS[layerMode].attribution,
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);
  }, [layerMode]);

  // Pan to selected city
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const coords = CITY_COORDINATES[selectedCity] || CITY_COORDINATES.All;
    mapInstanceRef.current.flyTo([coords.lat, coords.lng], coords.zoom, {
      duration: 1.2,
    });
  }, [selectedCity]);

  // Render Property Price Markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    properties.forEach((prop) => {
      const isSelected = activeProperty?.id === prop.id;
      const priceText = formatPriceINR(prop.price);

      const customIcon = L.divIcon({
        className: 'custom-map-price-pin',
        html: `
          <div class="cursor-pointer font-extrabold text-[11px] px-2.5 py-1 rounded-xl shadow-lg border transition-all transform hover:scale-110 flex items-center gap-1 ${
            isSelected
              ? 'bg-amber-500 text-slate-950 border-amber-300 ring-4 ring-amber-500/40 z-50 scale-110'
              : 'bg-blue-600 text-white border-blue-400/50 hover:bg-blue-700'
          }">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>${priceText}</span>
          </div>
        `,
        iconSize: [85, 30],
        iconAnchor: [42, 15],
      });

      const marker = L.marker([prop.lat, prop.lng], { icon: customIcon }).addTo(mapInstanceRef.current!);
      marker.on('click', () => {
        setActiveProperty(prop);
      });

      markersRef.current.push(marker);
    });
  }, [properties, activeProperty, layerMode]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleReset = () => {
    const coords = CITY_COORDINATES[selectedCity] || CITY_COORDINATES.All;
    mapInstanceRef.current?.flyTo([coords.lat, coords.lng], coords.zoom);
  };

  return (
    <div className="relative w-full h-[600px] lg:h-[750px] bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-800 overflow-hidden shadow-2xl flex flex-col">
      
      {/* Map Control Bar Header */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Layer Switcher */}
        <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white shadow-xl">
          <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400 ml-1.5" />
          <button
            onClick={() => setLayerMode('streets')}
            className={`px-2.5 py-1 rounded-lg transition ${
              layerMode === 'streets'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Google Light
          </button>

          <button
            onClick={() => setLayerMode('satellite')}
            className={`px-2.5 py-1 rounded-lg transition ${
              layerMode === 'satellite'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Satellite
          </button>

          <button
            onClick={() => setLayerMode('osm')}
            className={`px-2.5 py-1 rounded-lg transition ${
              layerMode === 'osm'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Streets
          </button>

          <button
            onClick={() => setLayerMode('dark')}
            className={`px-2.5 py-1 rounded-lg transition ${
              layerMode === 'dark'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Dark Mode
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white shadow-xl">
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            title="Reset Map View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Selected Property Popup Card Drawer */}
      {activeProperty && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-[500] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-4 rounded-2xl border border-slate-300 dark:border-slate-700 shadow-2xl text-slate-900 dark:text-white animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-600/20">
              {activeProperty.city}
            </span>
            <button
              onClick={() => setActiveProperty(null)}
              className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-3">
            <img
              src={activeProperty.images[0]}
              alt={activeProperty.title}
              className="w-24 h-20 rounded-xl object-cover"
            />
            <div className="flex-1 min-w-0 space-y-1">
              <h4 className="font-bold text-sm truncate text-slate-900 dark:text-white">
                {activeProperty.title}
              </h4>
              <div className="text-amber-600 dark:text-amber-400 font-extrabold text-base">
                {formatPriceINR(activeProperty.price)}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                {formatArea(activeProperty.areaSqFt, unitSystem)} | {activeProperty.bhk ? `${activeProperty.bhk} BHK` : activeProperty.type}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
            {activeProperty.reraApproved && (
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>UPRERA Registered</span>
              </div>
            )}
            <button
              onClick={() => onSelectProperty(activeProperty)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition ml-auto"
            >
              <span>View Details</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

