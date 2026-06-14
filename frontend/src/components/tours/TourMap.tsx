import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper to extract coordinates from Google Maps URL
const extractLatLngFromUrl = (url: string): { lat: number, lng: number } | null => {
  if (!url) return null;
  
  try {
    // Format 1: @10.762622,106.660172
    const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (atMatch) {
      return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
    }

    // Format 2: q=10.762622,106.660172
    const qMatch = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (qMatch) {
      return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
    }

    // Format 3: !3d10.762622!4d106.660172
    const d3Match = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (d3Match) {
      return { lat: parseFloat(d3Match[1]), lng: parseFloat(d3Match[2]) };
    }

    // Format 4: ll=10.762622,106.660172
    const llMatch = url.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (llMatch) {
      return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };
    }

    // Format 5: place/.../10.762622,106.660172
    const placeMatch = url.match(/place\/[^/]+\/(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (placeMatch) {
      return { lat: parseFloat(placeMatch[1]), lng: parseFloat(placeMatch[2]) };
    }
    // Format 6: Generic lat,lng match anywhere in URL (more aggressive)
    const genericMatch = url.match(/(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (genericMatch) {
      const lat = parseFloat(genericMatch[1]);
      const lng = parseFloat(genericMatch[2]);
      // Basic validation for Vietnam coordinates
      if (lat > 8 && lat < 24 && lng > 102 && lng < 110) {
        return { lat, lng };
      }
    }
  } catch (e) {
    console.error('Error parsing coordinates from URL:', e);
  }
  
  return null;
};

interface MapPoint {
  day?: number;
  sequenceNo?: number;
  title?: string;
  name?: string;
  address?: string;
  lat?: number | null;
  lng?: number | null;
  googleMapsLink?: string;
}

interface TourMapProps {
  points: MapPoint[];
  fallbackPoints?: MapPoint[];
}

// Component to handle map view changes
const MapController = ({ bounds, shouldFit }: { bounds: L.LatLngBounds | null, shouldFit: boolean }) => {
  const map = useMap();
  
  useEffect(() => {
    if (bounds && shouldFit) {
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
    }
  }, [bounds, shouldFit, map]);
  
  return null;
};

// Custom Reset Control
const ResetViewControl = ({ onReset }: { onReset: () => void }) => {
  return (
    <div className="leaflet-top leaflet-right" style={{ marginTop: '10px', marginRight: '10px' }}>
      <div className="leaflet-control leaflet-bar">
        <button 
          onClick={(e) => {
            e.preventDefault();
            onReset();
          }}
          title="Căn giữa bản đồ"
          style={{
            backgroundColor: 'white',
            border: 'none',
            width: '34px',
            height: '34px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            borderRadius: '4px',
            boxShadow: '0 1px 5px rgba(0,0,0,0.4)'
          }}
        >
          🎯
        </button>
      </div>
    </div>
  );
};

export const TourMap: React.FC<TourMapProps> = ({ points, fallbackPoints = [] }) => {
  const [shouldFit, setShouldFit] = useState(true);
  const [resolvedPoints, setResolvedPoints] = useState<any[]>([]);
  const [isResolving, setIsResolving] = useState(false);

  // Process points and extract coordinates asynchronously
  useEffect(() => {
    let isMounted = true;
    
    const resolvePointsAsync = async () => {
      setIsResolving(true);
      const uniquePoints = new Map();
      
      // Merge fallback and main points. Fallback first so main overrides them.
      const allPoints = [...fallbackPoints, ...points];
      
      const fetchFromNominatim = async (query: string) => {
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
          const data = await response.json();
          if (data && data.length > 0) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        } catch (e) { console.error("Nominatim error:", e); }
        return null;
      };

      let hasCalledNominatim = false;

      for (const p of allPoints) {
        let lat = p.lat !== null && p.lat !== undefined ? Number(p.lat) : null;
        let lng = p.lng !== null && p.lng !== undefined ? Number(p.lng) : null;
        
        if ((lat === null || isNaN(lat)) && p.googleMapsLink) {
          const extracted = extractLatLngFromUrl(p.googleMapsLink);
          if (extracted) {
            lat = extracted.lat;
            lng = extracted.lng;
          } else {
            // Check for query parameter
            const queryMatch = p.googleMapsLink.match(/[?&](query|q)=([^&]+)/);
            let searchQuery = "";
            if (queryMatch) {
              searchQuery = decodeURIComponent(queryMatch[2].replace(/\+/g, ' '));
            } else if (p.googleMapsLink.includes('maps.app.goo.gl') || p.googleMapsLink.includes('goo.gl')) {
              searchQuery = `${p.title || p.name || ''} ${p.address || ''}`.trim();
            }

            if (searchQuery) {
              if (hasCalledNominatim) {
                // Wait 1.1s before next call to respect Nominatim rate limit (1 req/sec)
                await new Promise(r => setTimeout(r, 1100));
              }
              const geo = await fetchFromNominatim(searchQuery);
              hasCalledNominatim = true;
              
              if (geo) {
                lat = geo.lat;
                lng = geo.lng;
              }
            }
          }
        }
        
        if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)) {
          const displayNumber = p.sequenceNo || p.day || 0;
          
          let finalLat = lat;
          let finalLng = lng;
          let key = `${finalLat.toFixed(6)},${finalLng.toFixed(6)}`;
          
          const existing = uniquePoints.get(key);
          // If a point already exists here and it's a DIFFERENT point (different displayNumber)
          // we add a tiny offset so they don't hide each other.
          // If it's the SAME point, we let it overwrite (e.g. main point overwrites fallback point)
          if (existing && existing.displayNumber !== displayNumber) {
            while (uniquePoints.has(key)) {
              finalLat -= 0.0002; // shift slightly down
              finalLng += 0.0002; // shift slightly right
              key = `${finalLat.toFixed(6)},${finalLng.toFixed(6)}`;
            }
          }

          const processedP = {
            ...p,
            lat: finalLat,
            lng: finalLng,
            displayTitle: p.title || p.name || 'Điểm đến',
            displayNumber
          };
          
          uniquePoints.set(key, processedP);
        }
      }

      if (isMounted) {
        setResolvedPoints(Array.from(uniquePoints.values()).sort((a: any, b: any) => a.displayNumber - b.displayNumber));
        setIsResolving(false);
      }
    };

    resolvePointsAsync();

    return () => { isMounted = false; };
  }, [points, fallbackPoints]);

  const bounds = useMemo(() => {
    if (resolvedPoints.length === 0) return null;
    return L.latLngBounds(resolvedPoints.map(p => [p.lat, p.lng]));
  }, [resolvedPoints]);

  const handleReset = useCallback(() => {
    setShouldFit(true);
    setTimeout(() => setShouldFit(false), 500);
  }, []);

  // Initial fit
  useEffect(() => {
    if (resolvedPoints.length > 0) {
      setShouldFit(true);
      const timer = setTimeout(() => setShouldFit(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [resolvedPoints.length]);

  if (isResolving) {
    return (
      <div className="tc-map-placeholder">
        <div className="tc-map-empty-state">
          <div className="tc-spinner"></div>
          <p>Đang tải tọa độ bản đồ...</p>
        </div>
      </div>
    );
  }

  if (resolvedPoints.length === 0) {
    return (
      <div className="tc-map-placeholder">
        <div className="tc-map-empty-state">
          <span>📍</span>
          <p>Dữ liệu bản đồ đang được cập nhật cho hành trình này.</p>
        </div>
      </div>
    );
  }

  const createNumberedIcon = (number: number) => {
    return L.divIcon({
      className: 'tc-map-marker-custom',
      html: `<div class="marker-pin"></div><span class="marker-number">${number}</span>`,
      iconSize: [30, 42],
      iconAnchor: [15, 42],
      popupAnchor: [0, -40]
    });
  };

  return (
    <div className="tc-tour-map-wrapper">
      <MapContainer 
        center={[resolvedPoints[0].lat, resolvedPoints[0].lng]} 
        zoom={13} 
        style={{ height: '500px', width: '100%', borderRadius: '16px', zIndex: 1 }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController bounds={bounds} shouldFit={shouldFit} />
        <ResetViewControl onReset={handleReset} />

        {resolvedPoints.map((point, index) => (
          <Marker 
            key={`${point.displayNumber}-${index}`} 
            position={[point.lat, point.lng]} 
            icon={createNumberedIcon(point.displayNumber)}
          >
            <Popup>
              <div className="tc-map-popup">
                <strong>Điểm {point.displayNumber}: {point.displayTitle}</strong>
                <p>{point.address}</p>
                {point.googleMapsLink && (
                  <a href={point.googleMapsLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--tc-primary)', fontSize: '11px', fontWeight: 'bold' }}>
                    Mở Google Maps
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {resolvedPoints.length > 1 && (
          <Polyline 
            positions={resolvedPoints.map(p => [p.lat, p.lng])} 
            color="#004a99" 
            weight={5} 
            opacity={0.8}
            dashArray="10, 10"
          />
        )}
      </MapContainer>

      <style>{`
        .tc-tour-map-wrapper {
          margin: 20px 0;
          box-shadow: var(--tc-shadow-lg);
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--tc-border);
          position: relative;
        }
        
        .tc-map-placeholder {
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          border-radius: 16px;
          border: 2px dashed var(--tc-border);
        }
        
        .tc-map-empty-state {
          text-align: center;
          color: var(--tc-text-secondary);
        }
        
        .tc-map-empty-state span {
          font-size: 40px;
          display: block;
          margin-bottom: 10px;
        }
        
        .tc-map-marker-custom {
          background: none;
          border: none;
        }

        .marker-pin {
          width: 30px;
          height: 30px;
          border-radius: 50% 50% 50% 0;
          background: var(--tc-primary);
          position: absolute;
          transform: rotate(-45deg);
          left: 50%;
          top: 50%;
          margin: -15px 0 0 -15px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          border: 2px solid white;
        }

        .marker-number {
          position: absolute;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 14px;
          left: 50%;
          top: 50%;
          margin: -15px 0 0 -15px;
          z-index: 10;
        }

        .tc-map-popup {
          font-family: inherit;
        }

        .tc-map-popup strong {
          color: var(--tc-primary);
          display: block;
          margin-bottom: 4px;
        }

        .tc-map-popup p {
          margin: 0;
          font-size: 12px;
          color: #666;
          margin-bottom: 8px;
        }
      `}</style>
    </div>
  );
};
