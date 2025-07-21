import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5000/api/admin/users');
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch users.');
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`http://127.0.0.1:5000/api/admin/users/${userId}`);
                fetchUsers();
            } catch (err) {
                setError('Failed to delete user.');
            }
        }
    };

    if (loading) return <p className="text-center mt-10">Loading users...</p>;
    if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#CEDEF8] to-[#abc8d8] p-4 font-poppins">
            <div className="w-full max-w-6xl mx-auto">
                <div 
                    className="bg-white/50 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20"
                    style={{ minHeight: '80vh' }}
                >
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-gray-800">
                            <thead className="border-b border-black/20">
                                <tr>
                                    <th className="p-4 font-semibold">ID</th>
                                    <th className="p-4 font-semibold">Username</th>
                                    <th className="p-4 font-semibold">Email</th>
                                    <th className="p-4 font-semibold text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} className="border-b border-black/10 hover:bg-white/30">
                                        <td className="p-4">{user.id}</td>
                                        <td className="p-4 font-medium">{user.username}</td>
                                        <td className="p-4">{user.email}</td>
                                        <td className="p-4 text-center space-x-2">
                                            <button 
                                                onClick={() => setSelectedUser(user)}
                                                className="bg-[#3B5998] text-white px-4 py-2 rounded-lg shadow hover:bg-[#2f477a] transition-colors"
                                            >
                                                View History
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(user.id)}
                                                className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {selectedUser && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Search History: {selectedUser.username}</h2>
                        <ul className="list-disc list-inside space-y-2 h-48 overflow-y-auto text-gray-700">
                            {selectedUser.searches.length > 0 ? (
                                selectedUser.searches.map((search, index) => (
                                    <li key={index}><strong>From:</strong> {search.source} <strong> to </strong> {search.destination}</li>
                                ))
                            ) : (
                                <li>No search history found.</li>
                            )}
                        </ul>
                        <button 
                            onClick={() => setSelectedUser(null)}
                            className="mt-6 w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;