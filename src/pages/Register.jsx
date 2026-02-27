import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import useAuthStore from '../context/useAuthStore';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [role, setRole] = useState('admin');
    const { register, loading, error } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = { name, email, password };
        if (role === 'doctor') {
            userData.specialization = specialization;
        }

        const success = await register(userData, role);
        if (success) {
            navigate('/login');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 font-primary">Register {role === 'admin' ? 'Admin' : 'Doctor'}</h2>

                {error && (
                    <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex justify-center space-x-4 mb-4">
                        <button
                            type="button"
                            onClick={() => setRole('admin')}
                            className={`px-4 py-2 text-sm font-medium rounded-md ${role === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Admin
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('doctor')}
                            className={`px-4 py-2 text-sm font-medium rounded-md ${role === 'doctor' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Doctor
                        </button>
                    </div>

                    {role === 'doctor' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Specialization</label>
                            <div className="relative mt-1">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={specialization}
                                    onChange={(e) => setSpecialization(e.target.value)}
                                    className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g. Cardiologist"
                                    required
                                />
                            </div>
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <User className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Admin Name"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Mail className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="admin@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Lock className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="********"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
