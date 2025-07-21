import React from 'react';
import { Link } from 'react-router-dom';
// ✅ 1. Import your local background image
import backgroundImage from '../assets/background.webp'; 

const HomePage = () => {
    return (
        <div className="min-h-screen flex flex-col font-poppins">
            <div className="relative flex-grow flex flex-col">
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    // ✅ 2. Use the imported image variable here
                    style={{ backgroundImage: `url(${backgroundImage})` }} 
                >
                    <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
                </div>

                <div className="relative flex-grow flex flex-col">
                    <header className="bg-transparent">
                        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                            <div className="text-2xl font-bold text-gray shadow-sm">Namma Yana</div>
                            <div className="space-x-4">
                                <Link 
                                    to="/login" 
                                    className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all shadow-md"
                                >
                                    User Login
                                </Link>
                                <Link 
                                    to="/admin/login" 
                                    className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all shadow-md"
                                >
                                    Admin Login
                                </Link>
                            </div>
                        </nav>
                    </header>

                    <main className="flex-grow flex items-center justify-center text-center">
                        <div className="px-4">
                            <h1 className="text-5xl sm:text-7xl font-bold text-white" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.6)' }}>
                                Namma Yana
                            </h1>
                            <p className="mt-4 text-lg text-white font-semibold" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}>
                                Your AI-powered guide to Bengaluru's traffic.
                            </p>
                            <Link 
                                to="/login" 
                                className="mt-8 inline-block bg-[#003366] text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#002244] transition-colors shadow-xl"
                            >
                                Plan Your Route
                            </Link>
                        </div>
                    </main>

                    <footer className="bg-transparent py-4">
                        <div className="container mx-auto text-center text-white font-semibold">
                            &copy; 2025 Namma Yana.
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default HomePage;