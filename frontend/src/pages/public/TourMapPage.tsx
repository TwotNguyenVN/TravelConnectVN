import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { tourService } from '../../services/tourService';
import { LoadingBlock, EmptyState } from '../../components/common';
import { Button } from '../../components/common/Button/Button';
import './TourMapPage.css';

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

// Component to handle map center and zoom when locations change
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

export const TourMapPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([21.0285, 105.8542]); // Default Hanoi
  const [mapZoom, setMapZoom] = useState(13);

  useEffect(() => {
    const fetchTourMapData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response: any = await tourService.getTourDetail(id);
        if (response.success && response.data) {
          setTour(response.data);
          
          // Filter locations with coordinates
          const validLocations = response.data.itinerary?.filter((loc: any) => loc.lat && loc.lng) || [];
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
  }, [id]);

  const handleLocationClick = (loc: any) => {
    if (loc.lat && loc.lng) {
      setMapCenter([loc.lat, loc.lng]);
      setSelectedLocation(loc);
      setMapZoom(16);
    }
  };

  if (loading) {
    return (
      <div className="tour-map-loading">
        <LoadingBlock height="100vh" />
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="tour-map-error">
        <EmptyState 
          title="Lỗi tải bản đồ" 
          description={error || "Không thể tải dữ liệu bản đồ."}
          action={<Button variant="primary" onClick={() => navigate(-1)}>Quay lại</Button>}
        />
      </div>
    );
  }

  const validLocations = tour.itinerary?.filter((loc: any) => loc.lat && loc.lng) || [];
  const polylinePositions = validLocations.map((loc: any) => [loc.lat, loc.lng]);

  return (
    <div className="tour-map-container">
      {/* Header Bar */}
      <div className="tour-map-header">
        <div className="tour-map-header-left">
          <button className="back-button" onClick={() => navigate(-1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div className="tour-info">
            <h1>{tour.title}</h1>
            <p>📍 {tour.location} | {tour.duration}</p>
          </div>
        </div>
        <div className="tour-map-header-right">
          <Link to={`/tours/${id}`} className="view-details-link">Xem chi tiết tour</Link>
        </div>
      </div>

      <div className="tour-map-content">
        {/* Sidebar */}
        <div className="tour-map-sidebar">
          <div className="sidebar-header">
            <h2>Lộ trình điểm đến</h2>
            <p>{validLocations.length} địa điểm trên bản đồ</p>
          </div>
          <div className="location-list">
            {tour.itinerary?.map((loc: any, index: number) => (
              <div 
                key={index} 
                className={`location-item ${selectedLocation?.day === loc.day ? 'active' : ''} ${!(loc.lat && loc.lng) ? 'no-coords' : ''}`}
                onClick={() => handleLocationClick(loc)}
              >
                <div className="location-number">{loc.day}</div>
                <div className="location-info">
                  <h3>{loc.title}</h3>
                  <p className="location-address">{loc.address || 'Đang cập nhật địa chỉ...'}</p>
                  {loc.detail && <p className="location-detail">{loc.detail}</p>}
                  {!(loc.lat && loc.lng) && <span className="no-map-badge">Chưa có vị trí bản đồ</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map Area */}
        <div className="tour-map-main">
          {validLocations.length > 0 ? (
            <MapContainer 
              center={mapCenter} 
              zoom={mapZoom} 
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapController center={mapCenter} zoom={mapZoom} />
              
              {validLocations.map((loc: any, index: number) => (
                <Marker 
                  key={index} 
                  position={[loc.lat, loc.lng]}
                  eventHandlers={{
                    click: () => setSelectedLocation(loc),
                  }}
                >
                  <Popup>
                    <div className="map-popup">
                      <h3>{loc.title}</h3>
                      <p>{loc.address}</p>
                      {loc.detail && <p className="popup-detail">{loc.detail}</p>}
                    </div>
                  </Popup>
                </Marker>
              ))}
              
              <Polyline 
                positions={polylinePositions} 
                color="var(--tc-primary)" 
                weight={3} 
                opacity={0.6}
                dashArray="10, 10"
              />
            </MapContainer>
          ) : (
            <div className="no-map-data">
              <EmptyState 
                title="Chưa có dữ liệu tọa độ" 
                description="Tour này hiện chưa được cập nhật tọa độ GPS cho các điểm đến."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
