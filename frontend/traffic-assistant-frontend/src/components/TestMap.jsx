import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const TestMap = () => {
  const center = [12.9716, 77.5946];
  const zoom = 12;

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <h2>Test Map</h2>
      <MapContainer center={center} zoom={zoom} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
      </MapContainer>
    </div>
  );
};

export default TestMap;