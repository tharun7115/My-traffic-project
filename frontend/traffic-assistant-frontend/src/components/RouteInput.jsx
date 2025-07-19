import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RouteInputPage = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleGetPrediction = async () => {
    if (!source || !destination) {
      setError("Please fill all fields.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const trafficRes = await axios.post('http://127.0.0.1:5000/api/predict-traffic');
      const causeRes = await axios.post('http://127.0.0.1:5000/api/classify-image');

      setPrediction({
        condition: trafficRes.data.predicted_traffic_condition,
        cause: causeRes.data.predicted_cause,
        imageUrl: causeRes.data.image_url
      });
    } catch (err) {
      setError("Failed to get predictions. Please check the backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleShowMap = () => {
    if (source && destination) {
      // ✅ This path now correctly matches the path in App.jsx
      navigate(`/reroute?source=${source}&destination=${destination}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Traffic Prediction & Routing</h2>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter Source Location"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Enter Destination Location"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <button
          onClick={handleGetPrediction}
          disabled={loading}
          className="w-full py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? 'Analyzing...' : 'Get Traffic Analysis'}
        </button>

        {error && <p className="text-center text-red-500">{error}</p>}
        
        {prediction && (
          <div className="p-4 mt-4 bg-gray-50 border-l-4 border-blue-500 rounded-r-lg">
            <h3 className="text-lg font-bold text-gray-800">Live Traffic Analysis</h3>
            <img src={prediction.imageUrl} alt={prediction.cause} className="w-full h-48 object-cover mt-2 rounded-lg" />
            <p className="mt-2">
              <span className="font-semibold">Predicted Traffic:</span> 
              <span className="font-bold text-blue-700"> {prediction.condition}</span>
            </p>
            <p>
              <span className="font-semibold">Identified Cause:</span> 
              <span className="font-bold text-blue-700"> {prediction.cause}</span>
            </p>
            <button
              onClick={handleShowMap}
              className="w-full py-2 mt-4 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Show Route on Map
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteInputPage;