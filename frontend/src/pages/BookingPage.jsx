import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchFlightById, bookTicket } from '../api';

const formatTime = (dt) => new Date(dt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
const formatDate = (dt) => new Date(dt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });
 
const duration = (dep, arr) => {
    const diff = new Date(arr) - new Date(dep);
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h} saat ${m} dakika`;
};

export default function BookingPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [flight, setFlight] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        passenger_name: '',
        passenger_surname: '',
        passenger_email: '',
    });

    useEffect(() => {
        fetchFlightById(id)
            .then(setFlight)
            .catch(() => setError('Flight not found.'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.passenger_name.trim() || !form.passenger_surname.trim() || !form.passenger_email.trim()) {
            setError('Please fill in all fields.');
            return;
        }
        setSubmitting(true);
        try {
            const result = await bookTicket({ ...form, flight_id: id });
            navigate('/confirmation', { state: { ticket: result.ticket } });
        } catch (err) {
            setError(err.message || 'Failed to book ticket. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-[#001b48] text-xl animate-pulse">Loading flight information...</div>
        </div>
    );

    if (error && !flight) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <p className="text-red-500 text-lg">{error}</p>
            <button onClick={() => navigate('/')} className="text-[#001b48] underline">Return to Home Page</button>
        </div>
    );

    if (!flight) return null;

    const from = flight.city_flight_from_city_idTocity?.city_name || '';
    const to = flight.city_flight_to_city_idTocity?.city_name || '';

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-3xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-[#001b48] transition mb-6 font-medium">
                    ← Return to Previous Page
                </button>

                <h1 className="text-3xl font-bold text-[#001b48] mb-6">Book a Ticket</h1>

                <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-bold text-[#001b48] bg-[#001b48]/10 px-3 py-1 rounded-full">FlyTicket</span>
                        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${flight.seats_available > 10 ? 'bg-green-100 text-green-700' : flight.seats_available > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                            {flight.seats_available} seats remaining
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <p className="text-4xl font-bold text-[#001b48]">{formatTime(flight.departure_time)}</p>
                            <p className="text-lg font-semibold text-gray-700 mt-1">{from}</p>
                        </div>
                        <div className="flex-1 flex flex-col items-center">
                            <p className="text-sm text-gray-400 mb-1">{duration(flight.departure_time, flight.arrival_time)}</p>
                            <div className="w-full flex items-center">
                                <div className="w-3 h-3 rounded-full border-2 border-[#001b48]" />
                                <div className="flex-1 h-0.5 bg-gray-300 mx-1" />
                                <span className="text-[#ffbc00] text-2xl">✈</span>
                                <div className="flex-1 h-0.5 bg-gray-300 mx-1" />
                                <div className="w-3 h-3 rounded-full bg-[#ffbc00]" />
                            </div>
                            <p className="text-sm text-gray-400 mt-1">{formatDate(flight.departure_time)}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-bold text-[#001b48]">{formatTime(flight.arrival_time)}</p>
                            <p className="text-lg font-semibold text-gray-700 mt-1">{to}</p>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-gray-500 text-sm">{flight.seats_total} seats available</span>
                        <span className="text-2xl font-bold text-[#001b48]">{flight.price.toLocaleString('tr-TR')} ₺</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                    <h2 className="text-xl font-bold text-[#001b48] mb-5">Passenger Information</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">First Name</label>
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#001b48] focus:outline-none transition"
                                    value={form.passenger_name}
                                    onChange={e => setForm(f => ({ ...f, passenger_name: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#001b48] focus:outline-none transition"
                                    value={form.passenger_surname}
                                    onChange={e => setForm(f => ({ ...f, passenger_surname: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Email</label>
                            <input
                                type="email"
                                placeholder="ornek@email.com"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#001b48] focus:outline-none transition"
                                value={form.passenger_email}
                                onChange={e => setForm(f => ({ ...f, passenger_email: e.target.value }))}
                            />
                            <p className="text-xs text-gray-400 mt-1">Ticket information will be sent to this address.</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-2">
                            <div>
                                <p className="text-sm text-gray-500">Amount to Pay</p>
                                <p className="text-3xl font-bold text-[#001b48]">{flight.price.toLocaleString('tr-TR')} ₺</p>
                            </div>
                            <button
                                type="submit"
                                disabled={submitting || flight.seats_available === 0}
                                className="bg-[#ffbc00] hover:bg-[#e6a800] text-[#001b48] font-bold px-10 py-4 rounded-xl transition uppercase tracking-wider shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                                {submitting ? 'Processing...' : flight.seats_available === 0 ? 'No Seats Available' : 'Purchase'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}