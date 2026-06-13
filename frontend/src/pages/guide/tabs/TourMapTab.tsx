import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { tourService } from '../../../services/tourService';
import { LoadingBlock, EmptyState } from '../../../components/common';
import '../../public/TourMapPage.css';

// Fix Leaflet default icon issue with Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

interface TourMapTabProps {
  tourId: string;
}

export const TourMapTab: React.FC<TourMapTabProps> = ({ tourId }) => {
  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([21.0285, 105.8542]);
  const [mapZoom, setMapZoom] = useState(13);

  useEffect(() => {
    async function fetchTourMapData() {
      try {
        setLoading(true);
        const response: any = await tourService.getTourDetail(tourId);
        if (response.success && response.data) {
          setTour(response.data);
          
          const validLocations = response.data.destinations?.filter((loc: any) => loc.lat && loc.lng) || [];
          if (validLocations.length > 0) {
            setMapCenter([validLocations[0].lat, validLocations[0].lng]);
            setMapZoom(14);
            setSelectedLocation(validLocations[0]);
          }
        } else {
          setError('Không tìm thấy thông tin tour.');
        }
      } catch (err) {
        console.error('Error fetching map data:', err);
        setError('Đã xảy ra lỗi khi tải bản đồ. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    fetchTourMapData();
  }, [tourId]);

  function handleLocationClick(loc: any) {
    if (loc.lat && loc.lng) {
      setMapCenter([loc.lat, loc.lng]);
      setSelectedLocation(loc);
      setMapZoom(16);
    }
  };

  if (loading) return <LoadingBlock height="400px" />;
  if (error || !tour) return <EmptyState title="Lỗi tải bản đồ" description={error || "Không thể tải dữ liệu bản đồ."} />;

  const validLocations = tour.destinations?.filter((loc: any) => loc.lat && loc.lng) || [];
  const polylinePositions = validLocations.map((loc: any) => [loc.lat, loc.lng]);

  return (
    <div className="tour-map-content" style={{ height: 'calc(100vh - 250px)', minHeight: '500px', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
      <div className="tour-map-sidebar">
        <div className="sidebar-header">
          <h2>Lộ trình điểm đến</h2>
          <p>{validLocations.length} địa điểm trên bản đồ</p>
        </div>
        <div className="location-list">
          {tour.destinations?.map((loc: any, index: number) => (
            <div 
              key={index} 
              className={`location-item ${selectedLocation?.id === loc.id ? 'active' : ''} ${!(loc.lat && loc.lng) ? 'no-coords' : ''}`}
              onClick={() => handleLocationClick(loc)}
            >
              <div className="location-number">{loc.sequenceNo || index + 1}</div>
              <div className="location-info">
                <h3>{loc.name}</h3>
                <p className="location-address">{loc.address || 'Đang cập nhật địa chỉ...'}</p>
                {loc.description && <p className="location-detail">{loc.description}</p>}
                {!(loc.lat && loc.lng) && <span className="no-map-badge">Chưa có vị trí bản đồ</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="tour-map-main">
        {validLocations.length > 0 ? (
          <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapController center={mapCenter} zoom={mapZoom} />
            {validLocations.map((loc: any, index: number) => (
              <Marker key={index} position={[loc.lat, loc.lng]} eventHandlers={{ click: () => setSelectedLocation(loc) }}>
                <Popup>
                  <div className="map-popup">
                    <h3>{loc.name}</h3>
                    <p>{loc.address}</p>
                    {loc.description && <p className="popup-detail">{loc.description}</p>}
                  </div>
                </Popup>
              </Marker>
            ))}
            <Polyline positions={polylinePositions} color="var(--tc-primary)" weight={3} opacity={0.6} dashArray="10, 10" />
          </MapContainer>
        ) : (
          <div className="no-map-data">
            <EmptyState title="Chưa có dữ liệu tọa độ" description="Tour này hiện chưa được cập nhật tọa độ GPS cho các điểm đến." />
          </div>
        )}
      </div>
    </div>
  );
};
