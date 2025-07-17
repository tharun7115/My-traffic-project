import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Welcome to Traffic Assistant</h1>
        <p className="mb-8 text-gray-700">Choose your login type:</p>

        <div className="flex flex-col space-y-4">
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded"
          >
            User Login
          </button>

          <button
            onClick={() => navigate('/admin/login')}
            className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded"
          >
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;