import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Navigation, 
  MapPin, 
  Layers, 
  RotateCcw, 
  Compass, 
  Clock, 
  Zap,
  School,
  Home
} from 'lucide-react';

// Fix for default Leaflet marker icons when bundled with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export type MapMode = 'parent' | 'driver' | 'admin' | 'student';
export type MapTheme = 'satellite' | 'streets' | 'dark';

interface CityMapProps {
  mode: MapMode;
  height?: string;
  alertDistanceMiles?: number;
  currentGps?: { latitude: number; longitude: number };
  onStopClick?: (stopName: string) => void;
  interactive?: boolean;
}

// Real Chennai & Full Tamil Nadu State Geographic Coordinates
const TN_COORDS = {
  center: [11.1271, 78.6569] as [number, number], // Center of Tamil Nadu State
  chennai: [13.0827, 80.2707] as [number, number],
  
  // Tambaram 6:35 AM Commute Coordinates
  tambaramPickup: [12.9250, 80.1180] as [number, number], // Tambaram Railway Station / Sanatorium (GST Road)
  tambaramSchool: [12.9320, 80.1260] as [number, number], // Tambaram High School & College Campus
  
  // Thoraipakkam 10:10 PM Commute Coordinates
  thoraipakkam: [12.9380, 80.2360] as [number, number], // Thoraipakkam Tollgate (OMR)
  oakridgeSchool: [12.9450, 80.2430] as [number, number], // Oakridge School, Thoraipakkam
  
  // Tamil Nadu Major Cities & Transit Nodes
  chengalpattu: [12.6841, 80.0033] as [number, number],
  vellore: [12.9165, 79.1325] as [number, number],
  salem: [11.6643, 78.1460] as [number, number],
  coimbatore: [11.0168, 76.9558] as [number, number],
  trichy: [10.7905, 78.7047] as [number, number],
  madurai: [9.9252, 78.1198] as [number, number],
  tirunelveli: [8.7139, 77.7567] as [number, number],
  puducherry: [11.9416, 79.8083] as [number, number]
};

// Real road waypoints for Tambaram 6:35 AM Commute (GST Road Corridor)
const TAMBARAM_WAYPOINTS: [number, number][] = [
  [12.9250, 80.1180], // Start: Tambaram Station / GST Road (6:35 AM Pickup)
  [12.9272, 80.1205], // Waypoint 1: Tambaram Sanatorium / Hindu Colony
  [12.9298, 80.1235], // Waypoint 2: GST Road Junction / Bus Stand
  [12.9320, 80.1260]  // Destination: Tambaram High School & College Campus
];

// Real road waypoints for Thoraipakkam 10:10 PM Night Commute
const THORAIPAKKAM_WAYPOINTS: [number, number][] = [
  [12.9380, 80.2360], // Start: Thoraipakkam Tollgate (OMR)
  [12.9395, 80.2375], // Anand Nagar OMR Intersection
  [12.9415, 80.2395], // 200 Feet Radial Road Corridor
  [12.9435, 80.2415], // Chandrasekhar Avenue
  [12.9450, 80.2430]  // Oakridge Matriculation School, Thoraipakkam
];

// Full Tamil Nadu Arterial State Highway Grid Lines
const TAMIL_NADU_HIGHWAY_CORRIDORS: [number, number][][] = [
  // Chennai ➔ Tambaram ➔ Chengalpattu ➔ Villupuram ➔ Trichy ➔ Madurai ➔ Tirunelveli (NH 45 / NH 44)
  [
    [13.0827, 80.2707], [12.9250, 80.1180], [12.6841, 80.0033], 
    [11.9400, 79.4900], [10.7905, 78.7047], [9.9252, 78.1198], [8.7139, 77.7567]
  ],
  // Chennai ➔ Vellore ➔ Krishnagiri ➔ Salem ➔ Coimbatore (NH 48 / NH 544)
  [
    [13.0827, 80.2707], [12.9165, 79.1325], [12.5200, 78.2100], 
    [11.6643, 78.1460], [11.3400, 77.7200], [11.0168, 76.9558]
  ],
  // Salem ➔ Namakkal ➔ Karur ➔ Dindigul ➔ Madurai
  [
    [11.6643, 78.1460], [11.2200, 78.1700], [10.9600, 78.0800], 
    [10.3600, 77.9800], [9.9252, 78.1198]
  ],
  // Chennai ➔ ECR Coastal Highway ➔ Puducherry ➔ Cuddalore ➔ Nagapattinam
  [
    [13.0827, 80.2707], [12.9380, 80.2360], [12.6000, 80.1700], 
    [11.9416, 79.8083], [11.7500, 79.7600], [10.7700, 79.8400]
  ]
];

// Map Tile Providers (High definition original satellite & full Tamil Nadu road maps)
const TILE_SERVERS: Record<MapTheme, { url: string; attribution: string; maxZoom: number }> = {
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; High-Resolution Satellite Photogrammetry (Tamil Nadu & India)',
    maxZoom: 19
  },
  streets: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> Road Map (Tamil Nadu Highways & Streets)',
    maxZoom: 19
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> Voyager Dark Telematics',
    maxZoom: 19
  }
};

export const CityMap: React.FC<CityMapProps> = ({
  mode,
  height = '100%',
  alertDistanceMiles = 0.5,
  currentGps,
  interactive = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const vehicleMarkerRef = useRef<L.Marker | null>(null);
  const alertCircleRef = useRef<L.Circle | null>(null);
  
  const [currentTheme, setCurrentTheme] = useState<MapTheme>('satellite');
  const [mapScope, setMapScope] = useState<'tambaram' | 'thoraipakkam' | 'tamilnadu'>('tambaram');
  const [speed, setSpeed] = useState<number>(36);
  const [eta, setEta] = useState<string>('3 min');

  // Helper to create HTML Pulse Marker Icons
  const createCustomMarker = (color: string, label: string, iconHtml: string) => {
    return L.divIcon({
      className: 'custom-city-marker',
      html: `
        <div style="display: flex; flex-direction: column; align-items: center; pointer-events: auto;">
          <div style="background: rgba(15, 23, 42, 0.94); border: 1.5px solid ${color}; color: #fff; padding: 2px 8px; border-radius: 8px; font-size: 9px; font-weight: 800; white-space: nowrap; box-shadow: 0 4px 14px rgba(0,0,0,0.6); margin-bottom: 3px; font-family: system-ui, sans-serif;">
            ${label}
          </div>
          <div style="width: 26px; height: 26px; border-radius: 50%; background: ${color}; border: 2.5px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 16px ${color}; color: #ffffff;">
            ${iconHtml}
          </div>
        </div>
      `,
      iconSize: [120, 46],
      iconAnchor: [60, 46]
    });
  };

  const createVehicleMarker = (plate: string, speedStr: string) => {
    return L.divIcon({
      className: 'custom-vehicle-marker',
      html: `
        <div style="display: flex; flex-direction: column; align-items: center; pointer-events: auto;">
          <div style="background: #0284c7; color: #fff; padding: 2px 8px; border-radius: 6px; font-size: 9px; font-weight: 900; white-space: nowrap; box-shadow: 0 3px 12px rgba(2,132,199,0.7); font-family: monospace; border: 1px solid #7dd3fc; margin-bottom: 2px;">
            🚖 ${plate} (${speedStr})
          </div>
          <div style="width: 30px; height: 30px; border-radius: 50%; background: #38bdf8; border: 2.5px solid #0f172a; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 16px #38bdf8;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
            </svg>
          </div>
        </div>
      `,
      iconSize: [130, 50],
      iconAnchor: [65, 50]
    });
  };

  // Mount Leaflet Map Once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    if ((mapContainerRef.current as any)._leaflet_id) {
      (mapContainerRef.current as any)._leaflet_id = null;
    }

    const initialCenter: [number, number] = [12.9285, 80.1220]; // Tambaram center
    const initialZoom = 15.5;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: interactive,
      dragging: interactive,
      touchZoom: interactive
    });

    // Add Attribution
    L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);

    // Initial Base Tile Layer (Satellite)
    const initialTile = TILE_SERVERS.satellite;
    const tileLayer = L.tileLayer(initialTile.url, {
      maxZoom: initialTile.maxZoom,
      attribution: initialTile.attribution
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    if (interactive) {
      L.control.zoom({ position: 'bottomright' }).addTo(map);
    }

    // 1. Draw Tamil Nadu Full State Highway Transit Grid
    TAMIL_NADU_HIGHWAY_CORRIDORS.forEach(corridor => {
      L.polyline(corridor, {
        color: '#38bdf8',
        weight: 2.5,
        opacity: 0.55,
        dashArray: '4, 8',
        lineCap: 'round'
      }).addTo(map);
    });

    // 2. Add Tamil Nadu Major City Node Pins
    const tnCities = [
      { name: 'Chennai (Capital)', coords: TN_COORDS.chennai, color: '#38bdf8' },
      { name: 'Tambaram Junction', coords: TN_COORDS.tambaramPickup, color: '#f59e0b' },
      { name: 'Chengalpattu (MWC)', coords: TN_COORDS.chengalpattu, color: '#06b6d4' },
      { name: 'Coimbatore Hub', coords: TN_COORDS.coimbatore, color: '#10b981' },
      { name: 'Madurai Gateway', coords: TN_COORDS.madurai, color: '#f59e0b' },
      { name: 'Trichy Central', coords: TN_COORDS.trichy, color: '#a855f7' },
      { name: 'Salem Corridor', coords: TN_COORDS.salem, color: '#ec4899' },
      { name: 'Vellore Hub', coords: TN_COORDS.vellore, color: '#6366f1' },
      { name: 'Puducherry Coastal', coords: TN_COORDS.puducherry, color: '#14b8a6' },
      { name: 'Tirunelveli', coords: TN_COORDS.tirunelveli, color: '#84cc16' }
    ];

    tnCities.forEach(city => {
      const cityMarker = L.marker(city.coords, {
        icon: L.divIcon({
          className: 'tn-city-node',
          html: `
            <div style="display: flex; flex-direction: column; align-items: center;">
              <div style="background: rgba(15,23,42,0.92); border: 1px solid ${city.color}; color: #fff; font-size: 8px; font-weight: 800; padding: 1px 5px; border-radius: 4px; white-space: nowrap; margin-bottom: 2px;">
                ${city.name}
              </div>
              <div style="width: 10px; height: 10px; border-radius: 50%; background: ${city.color}; border: 1.5px solid #fff; box-shadow: 0 0 8px ${city.color};"></div>
            </div>
          `,
          iconSize: [80, 24],
          iconAnchor: [40, 24]
        })
      }).addTo(map);
      cityMarker.bindPopup(`<b>${city.name}</b><br/>Tamil Nadu State SafePassage Corridor`);
    });

    // 3. TAMBARAM 6:35 AM ACTIVE RIDE OVERLAY
    L.polyline(TAMBARAM_WAYPOINTS, {
      color: '#f59e0b',
      weight: 8,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    L.polyline(TAMBARAM_WAYPOINTS, {
      color: '#fde047',
      weight: 4,
      opacity: 1,
      dashArray: '2, 6',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    // Tambaram Pickup Marker (6:35 AM)
    const tambaramPickupMarker = L.marker(TN_COORDS.tambaramPickup, {
      icon: createCustomMarker(
        '#10b981',
        'Pickup: Tambaram Station (6:35 AM)',
        '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>'
      )
    }).addTo(map);
    tambaramPickupMarker.bindPopup('<b>6:35 AM Pickup Point</b><br/>Tambaram Sanatorium / GST Road, Chennai');

    // Tambaram Drop-off Marker
    const tambaramDropMarker = L.marker(TN_COORDS.tambaramSchool, {
      icon: createCustomMarker(
        '#ef4444',
        'Drop: Tambaram School / Campus',
        '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>'
      )
    }).addTo(map);
    tambaramDropMarker.bindPopup('<b>Destination Drop Point</b><br/>Tambaram High School & College Campus');

    // 4. THORAIPAKKAM 10:10 PM ACTIVE RIDE OVERLAY
    L.polyline(THORAIPAKKAM_WAYPOINTS, {
      color: '#0284c7',
      weight: 6,
      opacity: 0.85,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    // Geofence Radius around Tambaram Pickup
    const radiusMeters = alertDistanceMiles * 1609.34;
    const alertCircle = L.circle(TN_COORDS.tambaramPickup, {
      radius: radiusMeters,
      color: '#f59e0b',
      fillColor: '#f59e0b',
      fillOpacity: 0.16,
      weight: 2,
      dashArray: '4, 6'
    }).addTo(map);
    alertCircleRef.current = alertCircle;

    // Live Moving Vehicle Marker: Maruti Ertiga / Force Traveller TN-02-CD-5678 (Tambaram 6:35 AM)
    const initialPos = TAMBARAM_WAYPOINTS[1];
    const vehicleMarker = L.marker(initialPos, {
      icon: createVehicleMarker('TN 02 CD 5678', '36 km/h'),
      zIndexOffset: 1000
    }).addTo(map);
    vehicleMarkerRef.current = vehicleMarker;

    mapInstanceRef.current = map;

    // Smooth Vehicle Animation along Tambaram Route
    let waypointIdx = 1;
    const animationInterval = setInterval(() => {
      waypointIdx = (waypointIdx + 1) % TAMBARAM_WAYPOINTS.length;
      const nextPos = TAMBARAM_WAYPOINTS[waypointIdx];
      const randomSpeed = Math.floor(32 + Math.random() * 8);
      
      if (vehicleMarkerRef.current && nextPos) {
        vehicleMarkerRef.current.setLatLng(nextPos);
        vehicleMarkerRef.current.setIcon(createVehicleMarker('TN 02 CD 5678', `${randomSpeed} km/h`));
      }
      setSpeed(randomSpeed);
      setEta(`${Math.max(1, 4 - waypointIdx)} min`);
    }, 3000);

    return () => {
      clearInterval(animationInterval);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (mapContainerRef.current) {
        (mapContainerRef.current as any)._leaflet_id = null;
      }
    };
  }, []);

  // Update Tile Layer Dynamically when theme changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const targetTile = TILE_SERVERS[currentTheme];
    tileLayerRef.current.setUrl(targetTile.url);
  }, [currentTheme]);

  // Update Geofence Radius when alertDistanceMiles changes
  useEffect(() => {
    if (alertCircleRef.current) {
      const radiusMeters = alertDistanceMiles * 1609.34;
      alertCircleRef.current.setRadius(radiusMeters);
    }
  }, [alertDistanceMiles]);

  // Scope Zoom Handler
  const handleZoomToScope = (scope: 'tambaram' | 'thoraipakkam' | 'tamilnadu') => {
    setMapScope(scope);
    if (!mapInstanceRef.current) return;
    if (scope === 'tambaram') {
      mapInstanceRef.current.flyTo([12.9285, 80.1220], 15.5, { duration: 1.5 });
    } else if (scope === 'thoraipakkam') {
      mapInstanceRef.current.flyTo([12.9415, 80.2395], 15.5, { duration: 1.5 });
    } else {
      mapInstanceRef.current.flyTo(TN_COORDS.center, 7.5, { duration: 1.5 });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[380px] overflow-hidden rounded-2xl">
      {/* Map Tile & Scope Controls Overlay */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Region Scope Selectors */}
        <div className="flex items-center gap-1.5 bg-slate-950/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 shadow-2xl pointer-events-auto">
          <button
            type="button"
            onClick={() => handleZoomToScope('tambaram')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              mapScope === 'tambaram'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-yellow-400" />
            <span>📍 Focus 6:35 AM Tambaram Ride</span>
          </button>

          <button
            type="button"
            onClick={() => handleZoomToScope('thoraipakkam')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              mapScope === 'thoraipakkam'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>📍 Thoraipakkam</span>
          </button>

          <button
            type="button"
            onClick={() => handleZoomToScope('tamilnadu')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              mapScope === 'tamilnadu'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-emerald-300" />
            <span>🗺️ Tamil Nadu Grid</span>
          </button>
        </div>

        {/* Map Imagery Layer Switchers */}
        <div className="flex items-center gap-1 bg-slate-950/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 shadow-2xl pointer-events-auto">
          <button
            type="button"
            onClick={() => setCurrentTheme('satellite')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 ${
              currentTheme === 'satellite'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🛰️ Original Satellite Map</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTheme('streets')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 ${
              currentTheme === 'streets'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🗺️ Road Map (Tamil Nadu)</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTheme('dark')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 ${
              currentTheme === 'dark'
                ? 'bg-slate-800 text-cyan-300 shadow-md border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🌙 Dark</span>
          </button>
        </div>
      </div>

      {/* Bottom Live Tracking HUD Banner */}
      <div className="absolute bottom-3 left-3 right-16 z-[1000] bg-slate-950/95 backdrop-blur-md border border-amber-500/40 p-2.5 rounded-xl shadow-2xl flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <div className="leading-tight">
            <span className="text-xs font-bold text-white block">
              Maruti Ertiga / Cab TN-02-CD-5678 (Ravi Chandran)
            </span>
            <span className="text-[10px] text-amber-300">
              Tambaram Sanatorium (6:35 AM Pickup) ↔ Tambaram High School • Weekly Plan
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="font-mono text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
            Speed: {speed} km/h
          </span>
          <span className="font-mono text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            ETA: {eta}
          </span>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider hidden sm:inline">
            Layer: {currentTheme.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Leaflet Map DOM Node */}
      <div ref={mapContainerRef} style={{ width: '100%', height }} />
    </div>
  );
};
