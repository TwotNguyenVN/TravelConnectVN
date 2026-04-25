import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapPoint {
  day: number;
  title: string;
  address: string;
  lat: number | null;
  lng: number | null;
}

interface TourMapProps {
  points: MapPoint[];
}

// Component to auto-fit map bounds to markers
const ChangeView = ({ bounds }: { bounds: L.LatLngBoundsExpression }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
};

// Create a custom numbered icon
const createNumberedIcon = (number: number) => {
  return L.divIcon({
    className: 'tc-map-marker-custom',
    html: `<div class="marker-pin"></div><span class="marker-number">${number}</span>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -40]
  });
};

export const TourMap: React.FC<TourMapProps> = ({ points }) => {
  // Filter points that have valid coordinates
  const validPoints = useMemo(() => 
    points.filter(p => p.lat !== null && p.lng !== null) as (MapPoint & { lat: number, lng: number })[],
  [points]);

  if (validPoints.length === 0) {
    return (
      <div className="tc-map-placeholder">
        <div className="tc-map-empty-state">
          <span>📍</span>
          <p>Dữ liệu bản đồ đang được cập nhật cho hành trình này.</p>
        </div>
      </div>
    );
  }

  // Calculate bounds
  const bounds = L.latLngBounds(validPoints.map(p => [p.lat, p.lng]));
  
  // Coordinates for the polyline
  const polylinePositions = validPoints.map(p => [p.lat, p.lng] as [number, number]);

  return (
    <div className="tc-tour-map-wrapper">
      <MapContainer 
        center={[validPoints[0].lat, validPoints[0].lng]} 
        zoom={13} 
        style={{ height: '500px', width: '100%', borderRadius: '16px', zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <ChangeView bounds={bounds} />

        {validPoints.map((point, index) => (
          <Marker 
            key={index} 
            position={[point.lat, point.lng]} 
            icon={createNumberedIcon(point.day)}
          >
            <Popup>
              <div className="tc-map-popup">
                <strong>Ngày {point.day}: {point.title}</strong>
                <p>{point.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {validPoints.length > 1 && (
          <Polyline 
            positions={polylinePositions} 
            color="var(--tc-primary)" 
            weight={4} 
            opacity={0.6}
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
        }
      `}</style>
    </div>
  );
};
