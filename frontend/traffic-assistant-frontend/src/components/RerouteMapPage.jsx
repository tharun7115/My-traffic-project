import React, { useEffect, useState } from 'react';
// ✅ 1. Import useNavigate
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { useMap } from 'react-leaflet';

// Add default icon fix to ensure markers display correctly
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// This component integrates leaflet-routing-machine
const RoutingMachine = ({ source, destination }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !source || !destination) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(source.lat, source.lng || source.lon),
        L.latLng(destination.lat, destination.lng || destination.lon)
      ],
      routeWhileDragging: true,
      show: true,
      lineOptions: {
        styles: [{ color: 'blue', opacity: 0.8, weight: 6 }]
      },
    }).addTo(map);

    // Cleanup function to remove the routing control
    return () => map.removeControl(routingControl);
    
  }, [map, source, destination]);

  return null;
};


const RerouteMapPage = () => {
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const sourceText = search.get('source');
  const destinationText = search.get('destination');
  
  // ✅ 2. Initialize the navigate function
  const navigate = useNavigate();

  const [sourceCoords, setSourceCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const BENGALURU_BOUNDS_VIEWBOX = '77.37,13.18,77.85,12.83';

  const geocodeLocation = async (locationText) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationText)}&viewbox=${BENGALURU_BOUNDS_VIEWBOX}&bounded=1`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
      }
      return null;
    } catch (err) {
      console.error("Geocoding error:", err);
      return null;
    }
  };

  useEffect(() => {
    const findCoordinates = async () => {
      if (!sourceText || !destinationText) {
        setError("Source or destination is missing from the URL.");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      const [src, dest] = await Promise.all([
        geocodeLocation(sourceText),
        geocodeLocation(destinationText)
      ]);

      if (src && dest) {
        setSourceCoords(src);
        setDestinationCoords(dest);
      } else {
        setError("Could not find coordinates for one or both locations within Bengaluru. Please try a more specific address.");
      }
      
      setLoading(false);
    };

    findCoordinates();
  }, [sourceText, destinationText]);


  if (loading) {
    return <div className="p-4 text-center">Finding locations...</div>;
  }

  if (error) {
    return <div className="bg-red-100 text-red-700 p-4 m-4 rounded">{error}</div>;
  }

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      {/* ✅ 3. MODIFIED HEADER with Home Button */}
      <div className="relative bg-blue-600 text-white p-4 text-center">
        <button
          onClick={() => navigate('/route-input')}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white text-blue-600 font-semibold py-1 px-3 rounded-md shadow-md hover:bg-gray-100 transition-colors"
        >
          Home
        </button>
        <h2 className="text-2xl font-bold">Route Map</h2>
        <p className="text-sm">From: <strong>{sourceText}</strong> To: <strong>{destinationText}</strong></p>
      </div>

      <MapContainer 
        center={sourceCoords || [12.9716, 77.5946]}
        zoom={12} 
        style={{ height: 'calc(100vh - 80px)', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {sourceCoords && destinationCoords && (
          <RoutingMachine source={sourceCoords} destination={destinationCoords} />
        )}
      </MapContainer>
    </div>
  );
};

export default RerouteMapPage;