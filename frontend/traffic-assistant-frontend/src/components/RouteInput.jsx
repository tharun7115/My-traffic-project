import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';

const RouteInputPage = () => {
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  const locationOptions = [
    { value: 'Koramangala', label: 'Koramangala' },
    { value: 'Indiranagar', label: 'Indiranagar' },
    { value: 'Whitefield', label: 'Whitefield' },
    { value: 'Electronic City', label: 'Electronic City' },
    { value: 'Jayanagar', label: 'Jayanagar' },
    { value: 'HSR Layout', label: 'HSR Layout' },
    { value: 'MG Road', label: 'MG Road' },
    { value: 'Marathahalli', label: 'Marathahalli' },
    { value: 'Hebbal', label: 'Hebbal' },
    { value: 'Majestic', label: 'Majestic' },
    { value: 'BTM Layout', label: 'BTM Layout' },
    { value: 'Sarjapur Road', label: 'Sarjapur Road' },
    { value: 'JP Nagar', label: 'JP Nagar' },
    { value: 'Malleshwaram', label: 'Malleshwaram' },
  ];

  const handleGetPrediction = async () => {
    const sourceValue = source?.value;
    const destinationValue = destination?.value;

    if (!sourceValue || !destinationValue) {
      setError("Please select both source and destination.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setPrediction(null);
    setAlert({ message: '', type: '' });

    try {
      await axios.post('http://127.0.0.1:5000/api/save-search', {
        source: sourceValue,
        destination: destinationValue
      });

      const trafficRes = await axios.post('http://127.0.0.1:5000/api/predict-traffic');
      const causeRes = await axios.post('http://127.0.0.1:5000/api/classify-image', {
        source: sourceValue,
        destination: destinationValue
      });

      const predictionResult = {
        condition: trafficRes.data.predicted_traffic_condition,
        cause: causeRes.data.predicted_cause,
        imageUrl: causeRes.data.image_url
      };
      setPrediction(predictionResult);

      if (predictionResult.cause.toLowerCase() === 'clear') {
        setAlert({ message: 'The road is clear. You can expect less traffic. Safe journey!', type: 'success' });
      } else {
        setAlert({ message: 'Heavy traffic expected due to the incident. Better to take a reroute. Be happy, be safe!', type: 'warning' });
      }

    } catch (err) {
      console.error("Prediction error:", err);
      setError("Failed to get predictions. Please check the backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleShowMap = () => {
    if (source && destination) {
      navigate(`/reroute?source=${source.value}&destination=${destination.value}`);
    }
  };

  const alertStyles = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#CEDEF8] to-[#abc8d8] p-4 font-poppins">
      <div className="w-full max-w-lg">
        <div 
          className="bg-white/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-6 border border-white/20"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800">Plan Your Route</h2>
          <div className="space-y-4">
            <Select
              options={locationOptions}
              value={source}
              onChange={setSource}
              placeholder="Select Source Location"
              isDisabled={prediction !== null}
              className="w-full"
              classNamePrefix="select"
            />
            <Select
              options={locationOptions}
              value={destination}
              onChange={setDestination}
              placeholder="Select Destination Location"
              isDisabled={prediction !== null}
              className="w-full"
              classNamePrefix="select"
            />
          </div>
          <button
            onClick={handleGetPrediction}
            disabled={loading || prediction !== null}
            className="w-full py-3 font-semibold text-white bg-[#3B5998] rounded-lg hover:bg-[#2f477a] transition-colors shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyzing...' : 'Get Traffic Analysis'}
          </button>

          {error && <p className="text-center text-red-500">{error}</p>}
          
          {alert.message && (
            <div className={`p-4 text-center rounded-lg font-semibold ${alertStyles[alert.type]}`}>
              {alert.message}
            </div>
          )}
          
          {prediction && (
            <div className="p-4 mt-4 bg-gray-50/50 rounded-lg">
              <h3 className="text-lg font-bold text-gray-800">Live Traffic Analysis</h3>
              <img src={prediction.imageUrl} alt={prediction.cause} className="w-full h-48 object-cover mt-2 rounded-lg" />
              <p className="mt-2">
                <span className="font-semibold">Predicted Traffic:</span> 
                <span className="font-bold text-[#3B5998]"> {prediction.condition}</span>
              </p>
              <p>
                <span className="font-semibold">Identified Cause:</span> 
                <span className="font-bold text-[#3B5998]"> {prediction.cause}</span>
              </p>
              <button
                onClick={handleShowMap}
                className="w-full py-2 mt-4 font-semibold text-white bg-[#3B5998] rounded-lg hover:bg-[#2f477a] transition-colors shadow-lg"
              >
                Show Route on Map
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteInputPage;