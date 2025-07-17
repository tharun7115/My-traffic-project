import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import RerouteMapPage from './components/RerouteMapPage';
import RouteInput from './components/RouteInput';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/route-input" element={<RouteInput />} />

        {/* Wrap RerouteMapPage in ErrorBoundary */}
        <Route
          path="/reroute"
          element={
            <ErrorBoundary>
              <RerouteMapPage />
            </ErrorBoundary>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;