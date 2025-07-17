import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// OpenRouteService API key
const ORS_API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImMyYjhiNDM1NmE0NjQzNTZiODUyMjU1MzRhYjE2MGU5IiwiaCI6Im11cm11cjY0In0=';

const RerouteMapPage = () => {
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const source = search.get('source');
  const destination = search.get('destination');

  // Coordinates for popular Bangalore areas
  const locationCoords = {
  "Koramangala": [12.9615, 77.7216],
  "Indiranagar": [12.9848, 77.6497],
  "Whitefield": [12.9659, 77.7498],
  "Electronic City": [12.8340, 77.6746],
  "Jayanagar": [12.9344, 77.5664],
  "HSR Layout": [12.9279, 77.6273],
  "MG Road": [12.9698, 77.6095],
  "Richmond Road": [12.9698, 77.6095],
  "Cunningham Road": [12.9690, 77.6100],
  "Bannerghatta Road": [12.9554, 77.7018],
  "Domlur": [12.9600, 77.6380],
  "Sarjapur Road": [12.9350, 77.7070],
  "Hebbal": [12.9833, 77.5883],
  "BTM Layout": [12.9615, 77.5868],
  "HSR Layout": [12.9279, 77.6273],
  "Jayanagar": [12.9344, 77.5664]
};

  const getCoords = (loc) => {
    const key = Object.keys(locationCoords).find(k => k.toLowerCase() === loc?.toLowerCase());
    return key ? locationCoords[key] : null;
  };

  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoute = async () => {
      const src = getCoords(source);
      const dest = getCoords(destination);

      if (!src || !dest) {
        setError("Source or destination not supported");
        setLoading(false);
        return;
      }

      try {
        const url = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson ';

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': ORS_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            coordinates: [src, dest]
          })
        });

        const data = await res.json();

        if (data && data.features && data.features.length > 0) {
          const routeCoords = data.features[0].geometry.coordinates.map(coord => [
            coord[1], // Latitude
            coord[0]  // Longitude
          ]);
          setRoute(routeCoords);
        } else {
          setError("No route found");
        }
      } catch (err) {
        console.error("Error fetching route:", err);
        setError("Failed to load route");
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [source, destination]);

  if (loading) {
    return <div>Loading real route from OpenRouteService...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4">
        {error}
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <div className="bg-blue-600 text-white p-4 text-center">
        <h2 className="text-2xl font-bold">Alternate Route</h2>
        <p className="text-sm">From "{source}" to "{destination}"</p>
      </div>

      {/* Map */}
      <MapContainer center={getCoords(source) || [12.9716, 77.5946]} zoom={12} style={{ height: '70vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        {/* Source Marker */}
        {source && getCoords(source) && (
          <Marker position={getCoords(source)}>
            <Popup>Source: {source}</Popup>
          </Marker>
        )}

        {/* Destination Marker */}
        {destination && getCoords(destination) && (
          <Marker position={getCoords(destination)}>
            <Popup>Destination: {destination}</Popup>
          </Marker>
        )}

        {/* Real Route Line */}
        {route && (
          <Polyline
            positions={route}
            pathOptions={{
              color: 'blue',
              weight: 4,
              opacity: 0.8
            }}
          />
        )}
      </MapContainer>

      {/* Alternate Route Info */}
      <div className="bg-white p-6 mt-4">
        <h3 className="text-lg font-semibold mb-2">Alternate Route Suggestion</h3>
        <p>
          Based on traffic cause, the system suggests the following alternate route:
        </p>
        <p className="mt-2 text-green-600 font-bold">
          🔄 Rerouted via 80ft Road and Marathahalli Bridge
        </p>
      </div>
    </div>
  );
};

export default RerouteMapPage;