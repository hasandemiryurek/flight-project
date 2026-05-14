import { useLocation, useNavigate, Link } from 'react-router-dom';

const formatTime = (dt) => new Date(dt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
const formatDate = (dt) => new Date(dt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });

export default function ConfirmationPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const ticket = state?.ticket;

    if (!ticket) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-gray-500 text-lg">Ticket information not found.</p>
                <Link to="/" className="bg-[#ffbc00] text-[#001b48] font-bold px-6 py-3 rounded-xl">Return to Home Page</Link>
            </div>
        );
    }

    const flight = ticket.flight;
    const from = flight?.city_flight_from_city_idTocity?.city_name || '';
    const to = flight?.city_flight_to_city_idTocity?.city_name || '';

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                        <span className="text-4xl">✓</span>
                    </div>
                    <h1 className="text-3xl font-bold text-[#001b48]">Reservation Confirmed!</h1>
                    <p className="text-gray-500 mt-2">Your ticket has been created successfully. Have a great flight!</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100" id="ticket">
                    <div className="bg-[#001b48] px-6 py-4 flex items-center justify-between">
                        <span className="text-[#ffbc00] font-bold text-xl"> FlyTicket</span>
                        <span className="text-white/60 text-sm font-mono">Ticket No: {ticket.id?.slice(-8).toUpperCase()}</span>
                    </div>

                    <div className="px-6 py-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="text-center">
                                <p className="text-4xl font-bold text-[#001b48]">{formatTime(flight.departure_time)}</p>
                                <p className="text-xl font-semibold text-gray-700 mt-1">{from}</p>
                            </div>
                            <div className="flex-1 flex flex-col items-center">
                                <div className="w-full flex items-center">
                                    <div className="flex-1 h-0.5 border-t-2 border-dashed border-gray-300" />
                                    <span className="text-[#ffbc00] text-2xl mx-3">✈</span>
                                    <div className="flex-1 h-0.5 border-t-2 border-dashed border-gray-300" />
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-4xl font-bold text-[#001b48]">{formatTime(flight.arrival_time)}</p>
                                <p className="text-xl font-semibold text-gray-700 mt-1">{to}</p>
                            </div>
                        </div>
                        <p className="text-center text-gray-500 text-sm mb-6">{formatDate(flight.departure_time)}</p>

                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-5 h-5 rounded-full bg-gray-100 -ml-9 border border-gray-200" />
                            <div className="flex-1 border-t-2 border-dashed border-gray-200" />
                            <div className="w-5 h-5 rounded-full bg-gray-100 -mr-9 border border-gray-200" />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Yolcu Adı</p>
                                <p className="text-[#001b48] font-bold text-lg mt-1">{ticket.passenger_name} {ticket.passenger_surname}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Koltuk No</p>
                                <p className="text-[#001b48] font-bold text-lg mt-1">{ticket.seat_number || '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Ücret</p>
                                <p className="text-[#001b48] font-bold text-lg mt-1">{flight.price?.toLocaleString('tr-TR')} ₺</p>
                            </div>
                            <div className="col-span-2 md:col-span-3">
                                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">E-posta</p>
                                <p className="text-[#001b48] font-bold mt-1">{ticket.passenger_email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-100">
                        <div className="flex gap-1">
                            {Array.from({ length: 40 }).map((_, i) => (
                                <div key={i} className="bg-gray-800" style={{ width: i % 3 === 0 ? 3 : 1, height: 32 }} />
                            ))}
                        </div>
                        <span className="text-xs text-gray-400 font-mono ml-4">{ticket.id?.toUpperCase()}</span>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3 mt-6">
                    <button
                        onClick={() => window.print()}
                        className="flex-1 border-2 border-[#001b48] text-[#001b48] font-bold py-3 rounded-xl hover:bg-[#001b48] hover:text-white transition text-center"
                    >
                        Download / Print E-Ticket
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="flex-1 bg-[#ffbc00] hover:bg-[#e6a800] text-[#001b48] font-bold py-3 rounded-xl transition text-center"
                    >
                        Return to Home Page
                    </button>
                </div>
            </div>
        </div>
    );
}