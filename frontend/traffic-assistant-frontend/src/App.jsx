import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';

// Import components using your specified file names
import HomePage from './components/Home';
import LoginPage from './components/Login';
import RegisterPage from './components/Register';
import RouteInputPage from './components/RouteInput';
import RerouteMapPage from './components/RerouteMapPage';
import AdminLoginPage from './components/AdminLogin';
// Assuming AdminDashboard component exists


function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          {/* Use the imported variable names in the 'element' prop */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/route-input" element={<RouteInputPage />} />
          <Route path="/reroute" element={<RerouteMapPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
               </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;