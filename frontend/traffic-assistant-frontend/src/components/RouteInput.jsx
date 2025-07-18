import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RouteInput = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [trafficData, setTrafficData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!source || !destination) {
      setError("Please enter both source and destination");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/api/traffic`, {
        params: { source, destination }
      });

      setTrafficData(res.data);
      setError('');
    } catch (err) {
      setError("Error fetching traffic info");
    }
  };

 const handleReroute = () => {
  navigate(`/reroute?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}`);
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Enter Your Route</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Source</label>
            <input
              type="text"
              placeholder="E.g., Koramangala"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full p-3 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Destination</label>
            <input
              type="text"
              placeholder="E.g., Whitefield"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full p-3 border rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Get Traffic Info
          </button>
        </form>

        {error && <p className="mt-4 text-red-500">{error}</p>}

        {/* Traffic Info */}
        {trafficData && (
          <div className="mt-6 p-4 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded">
            <h3 className="font-semibold">Traffic Alert:</h3>
            <p><strong>Cause:</strong> {trafficData.cause || 'Unknown'}</p>
            <p><strong>Congestion Level:</strong> {trafficData.congestion_level || 'Unknown'}</p>

            <button
              onClick={handleReroute}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Reroute Map
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteInput;