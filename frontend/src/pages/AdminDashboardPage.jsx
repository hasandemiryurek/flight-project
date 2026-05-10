import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchAllFlights, deleteFlight, fetchAllTickets } from '../api';
import { useAuth } from '../context/AuthContext';

const formatTime = (dt) => new Date(dt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
const formatDate = (dt) => new Date(dt).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });

export default function AdminDashboardPage() {
    const navigate = useNavigate();
    const { isAdmin, adminUser, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('flights');
    const [flights, setFlights] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [searchQ, setSearchQ] = useState('');

    useEffect(() => {
        if (!isAdmin) { navigate('/admin/login'); return; }
        loadData();
    }, [isAdmin, navigate]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [f, t] = await Promise.all([fetchAllFlights(), fetchAllTickets()]);
            setFlights(f);
            setTickets(t);
        } catch {
            // silently handle
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setDeleting(true);
        try {
            await deleteFlight(id);
            setFlights(prev => prev.filter(f => f.id !== id));
            setTickets(prev => prev.filter(t => t.flight_id !== id));
        } catch (e) {
            alert(e.message || 'Silinemedi.');
        } finally {
            setDeleting(false);
            setDeleteId(null);
        }
    };

    const handleLogout = () => { logout(); navigate('/'); };

    const filteredFlights = flights.filter(f => {
        const q = searchQ.toLowerCase();
        return (
            f.city_flight_from_city_idTocity?.city_name?.toLowerCase().includes(q) ||
            f.city_flight_to_city_idTocity?.city_name?.toLowerCase().includes(q)
        );
    });

    const filteredTickets = tickets.filter(t => {
        const q = searchQ.toLowerCase();
        return (
            t.passenger_name?.toLowerCase().includes(q) ||
            t.passenger_surname?.toLowerCase().includes(q) ||
            t.passenger_email?.toLowerCase().includes(q)
        );
    });

    return (
        <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 pt-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-6 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#001b48] tracking-tight">
                        Admin Dashboard
                    </h1>
                </div>
                
                <div className="mt-4 md:mt-0">
                    <Link 
                        to="/" 
                        className="text-sm font-bold text-[#001b48]/60 hover:text-[#001b48] transition flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl"
                    >
                        ← Return to FlyTicket
                    </Link>
                </div>
            </div>
        </div>
       
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Flights', value: flights.length, color: 'bg-gray-50 text-gray-700' },
                        { label: 'Total Tickets', value: tickets.length,  color: 'bg-gray-50 text-gray-700' },
                        { label: 'Filled Flights', value: flights.filter(f => f.seats_available === 0).length,color:'bg-gray-50 text-gray-700' },
                        { label: 'Available Seats', value: flights.reduce((a, f) => a + f.seats_available, 0),color: 'bg-gray-50 text-gray-700' },
                    ].map(stat => (
                        <div key={stat.label} className={`rounded-2xl p-4 ${stat.color}`}>
                            <div className="text-2xl mb-1">{stat.icon}</div>
                            <div className="text-3xl font-bold">{stat.value}</div>
                            <div className="text-sm font-medium opacity-70 mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                    <div className="flex gap-1 bg-gray-200 rounded-xl p-1">
                        {[['flights', 'Flights'], ['tickets', 'Tickets']].map(([tab, label]) => (
                            <button
                                key={tab}
                                onClick={() => { setActiveTab(tab); setSearchQ(''); }}
                                className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${activeTab === tab ? 'bg-white text-[#001b48] shadow' : 'text-gray-500 hover:text-[#001b48]'}`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder={activeTab === 'flights' ? 'Şehir ara...' : 'Yolcu ara...'}
                            className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-[#001b48] focus:outline-none text-sm w-full md:w-48 transition"
                            value={searchQ}
                            onChange={e => setSearchQ(e.target.value)}
                        />
                        {activeTab === 'flights' && (
                            <Link
                                to="/admin/flights/new"
                                className="bg-[#ffbc00] hover:bg-[#e6a800] text-[#001b48] font-bold px-4 py-2 rounded-xl text-sm transition whitespace-nowrap shadow"
                            >
                                + Add Flight
                            </Link>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-400 animate-pulse text-lg">Loading...</div>
                ) : activeTab === 'flights' ? (
                    <FlightsTable flights={filteredFlights} onDelete={id => setDeleteId(id)} />
                ) : (
                    <TicketsTable tickets={filteredTickets} />
                )}
            </div>

            {deleteId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
                        <h3 className="text-xl font-bold text-[#001b48] mb-2">Delete Flight</h3>
                        <p className="text-gray-500 text-sm mb-6">This flight and all related tickets will be permanently deleted. Are you sure?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="flex-1 border-2 border-gray-300 text-gray-600 font-bold py-2 rounded-xl hover:border-[#001b48] transition">İptal</button>
                            <button onClick={() => handleDelete(deleteId)} disabled={deleting} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-xl transition disabled:opacity-60">
                                {deleting ? 'Processing...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function FlightsTable({ flights, onDelete }) {
    if (flights.length === 0) return (
        <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-3">✈</div>
            <p>Flight not found.</p>
        </div>
    );
    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="text-left px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">Route</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">Departure</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">Arrival</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">Price</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">Seats</th>
                            <th className="text-right px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {flights.map((flight, i) => (
                            <tr key={flight.id} className={`border-b border-gray-50 hover:bg-gray-50 transition ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                                <td className="px-4 py-4">
                                    <span className="font-bold text-[#001b48]">{flight.city_flight_from_city_idTocity?.city_name}</span>
                                    <span className="text-[#ffbc00] mx-2">→</span>
                                    <span className="font-bold text-[#001b48]">{flight.city_flight_to_city_idTocity?.city_name}</span>
                                </td>
                                <td className="px-4 py-4 text-gray-600">
                                    <div>{formatDate(flight.departure_time)}</div>
                                    <div className="font-semibold text-[#001b48]">{formatTime(flight.departure_time)}</div>
                                </td>
                                <td className="px-4 py-4 text-gray-600">
                                    <div>{formatDate(flight.arrival_time)}</div>
                                    <div className="font-semibold text-[#001b48]">{formatTime(flight.arrival_time)}</div>
                                </td>
                                <td className="px-4 py-4 font-bold text-[#001b48]">{flight.price.toLocaleString('tr-TR')} ₺</td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#ffbc00] rounded-full"
                                                style={{ width: `${((flight.seats_total - flight.seats_available) / flight.seats_total) * 100}%` }}
                                            />
                                        </div>
                                        <span className={`text-xs font-semibold ${flight.seats_available === 0 ? 'text-red-500' : 'text-green-600'}`}>
                                            {flight.seats_available}/{flight.seats_total}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex gap-2 justify-end">
                                        <Link to={`/admin/flights/edit/${flight.id}`} className="bg-[#001b48] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#002a6e] transition">
                                            Edit
                                        </Link>
                                        <button onClick={() => onDelete(flight.id)} className="bg-red-50 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-100 transition border border-red-200">
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function TicketsTable({ tickets }) {
    if (tickets.length === 0) return (
        <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-3">🎫</div>
            <p>Henüz bilet bulunmuyor.</p>
        </div>
    );
    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="text-left px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">Yolcu</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">E-posta</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">Uçuş</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">Tarih</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">Koltuk</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((ticket, i) => (
                            <tr key={ticket.id} className={`border-b border-gray-50 hover:bg-gray-50 transition ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                                <td className="px-4 py-4 font-semibold text-[#001b48]">{ticket.passenger_name} {ticket.passenger_surname}</td>
                                <td className="px-4 py-4 text-gray-500">{ticket.passenger_email}</td>
                                <td className="px-4 py-4">
                                    <span className="font-bold text-[#001b48]">{ticket.flight?.city_flight_from_city_idTocity?.city_name}</span>
                                    <span className="text-[#ffbc00] mx-1">→</span>
                                    <span className="font-bold text-[#001b48]">{ticket.flight?.city_flight_to_city_idTocity?.city_name}</span>
                                </td>
                                <td className="px-4 py-4 text-gray-600">
                                    {ticket.flight?.departure_time ? formatDate(ticket.flight.departure_time) : '-'}
                                </td>
                                <td className="px-4 py-4">
                                    <span className="bg-[#001b48]/10 text-[#001b48] font-bold px-2 py-0.5 rounded text-xs">
                                        {ticket.seat_number || '-'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}