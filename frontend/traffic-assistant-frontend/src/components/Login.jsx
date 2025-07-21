import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://127.0.0.1:5000/login', { email, password });
      if (res.status === 200) {
        navigate('/route-input');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#CEDEF8] to-[#abc8d8] p-4 font-poppins">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleLogin}
          className="bg-white/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-6 border border-white/20"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800">User Login</h2>
          {error && <p className="text-red-600 text-center bg-red-100 p-2 rounded-lg">{error}</p>}
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#3B5998] text-white py-3 rounded-lg font-semibold hover:bg-[#2f477a] transition-colors shadow-lg"
          >
            Login
          </button>

          <p className="text-center text-gray-700">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#3B5998] hover:underline font-semibold">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;