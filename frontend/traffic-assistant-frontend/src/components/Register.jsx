import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }
        setError('');

        try {
            const res = await axios.post('http://127.0.0.1:5000/register', {
                username,
                email,
                password,
                confirm_password: confirmPassword,
            });
            if (res.status === 201) {
                alert(res.data.message);
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed. Try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#CEDEF8] to-[#abc8d8] p-4 font-poppins">
            <div className="w-full max-w-md">
                <form 
                    onSubmit={handleRegister}
                    className="bg-white/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-4 border border-white/20"
                >
                    <h2 className="text-3xl font-bold text-center text-gray-800">Create Account</h2>
                    {error && <p className="text-red-600 text-center bg-red-100 p-2 rounded-lg">{error}</p>}
                    
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-3 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-[#3B5998] text-white py-3 rounded-lg font-semibold hover:bg-[#2f477a] transition-colors shadow-lg"
                    >
                        Register
                    </button>

                    <p className="text-center text-gray-700">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#3B5998] hover:underline font-semibold">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;