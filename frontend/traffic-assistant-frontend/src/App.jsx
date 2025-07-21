import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import LoginPage from './components/Login';
import HomePage from './components/Home';
import RegisterPage from './components/Register';
import RouteInputPage from './components/RouteInput';
import RerouteMapPage from './components/RerouteMapPage';
import AdminLoginPage from './components/AdminLogin';
// ✅ FIX: Import from the correct file 'AdminUser.jsx'
import AdminDashboard from './components/AdminUsers'; 

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/route-input" element={<RouteInputPage />} />
          <Route path="/reroute" element={<RerouteMapPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;