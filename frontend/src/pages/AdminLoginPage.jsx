import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../api';
import { useAuth } from '../context/AuthContext';

export default function AdminLoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) { setError('Username and password are required.'); return; }
        setError('');
        setLoading(true);
        try {
            const data = await adminLogin(username, password);
            login(data.token, data.username);
            navigate('/admin');
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#001b48] flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <span className="text-4xl font-bold text-[#ffbc00]"> FlyTicket</span>
                    <p className="text-white/60 mt-2 text-sm">Admin Panel</p>
                </div>
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h1 className="text-2xl font-bold text-[#001b48] mb-6 text-center">Login</h1>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Username</label>
                            <input
                                type="text"
                                placeholder="admin"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#001b48] focus:outline-none transition"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                autoComplete="username"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#001b48] focus:outline-none transition"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                autoComplete="current-password"
                            />
                        </div>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#ffbc00] hover:bg-[#e6a800] text-[#001b48] font-bold py-3 rounded-xl transition uppercase tracking-wider mt-2 disabled:opacity-60"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
                <p className="text-center text-white/40 text-xs mt-6">
                </p>
            </div>
        </div>
    );
}