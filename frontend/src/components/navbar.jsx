import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const isAdminArea = location.pathname.startsWith('/admin');
    const handleLogout = () => { logout(); navigate('/'); };

    return (
        <nav className="bg-[#001b48] text-white w-full shadow-lg z-50 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-2xl font-bold tracking-wider text-[#ffbc00]">✈ FlyTicket</span>
                    </Link>

                    <div className="flex items-center gap-8">
                        {isAdmin ? (
                            <>
                                <Link to="/admin" className="text-[#ffbc00] font-semibold text-sm hover:text-white transition hidden md:block">
                                    Admin Panel
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="border border-white/30 hover:border-[#ffbc00] hover:text-[#ffbc00] px-4 py-1.5 rounded-lg transition font-medium text-sm"
                                >
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/admin/login"
                                className="border border-white/30 hover:border-[#ffbc00] hover:text-[#ffbc00] px-4 py-1.5 rounded-lg transition font-medium text-sm"
                            >
                                Admin Login
                            </Link>
                        )}
                        <button
                            className="md:hidden text-white ml-2"
                            onClick={() => setMenuOpen(o => !o)}
                        >
                            {menuOpen ? '✕' : '☰'}
                        </button>
                    </div>
                </div>
            </div>

            {menuOpen && (
                <div className="md:hidden bg-[#002a6e] px-4 py-3 flex flex-col gap-2 border-t border-white/10">
                    <Link to="/" className="text-white hover:text-[#ffbc00] py-1 font-medium" onClick={() => setMenuOpen(false)}>Search Flights</Link>
                    {isAdmin && (
                        <Link to="/admin" className="text-[#ffbc00] hover:text-white py-1 font-medium" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
                    )}
                </div>
            )}
        </nav>
    );
}