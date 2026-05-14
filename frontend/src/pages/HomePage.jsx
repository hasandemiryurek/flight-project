import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCities, searchFlights } from '../api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const formatTime = (dt) => new Date(dt).toString('en-US', { hour: '2-digit', minute: '2-digit' });
const formatDate = (dt) => new Date(dt).toString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
const duration = (dep, arr) => {
    const diff = new Date(arr) - new Date(dep);
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m`;
};

export default function HomePage() {
    const navigate = useNavigate();
    const [cities, setCities] = useState([]);
    const [fromCity, setFromCity] = useState('');
    const [toCity, setToCity] = useState('');
    const [date, setDate] = useState(null);
    const [flights, setFlights] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCities().then(setCities).catch(() => setError('Could not load cities.'));
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!fromCity || !toCity) { setError('Please select departure and arrival cities.'); return; }
        if (fromCity === toCity) { setError('Departure and arrival cities cannot be the same.'); return; }
        setError('');
        setLoading(true);
        try {
            const data = await searchFlights({ from: fromCity, to: toCity, date: date ? date.toISOString().split('T')[0] : '' });
            setFlights(data);
            setSearched(true);
        } catch {
            setError('An error occurred while searching for flights.');
        } finally {
            setLoading(false);
        }
    };

    const swap = () => { setFromCity(toCity); setToCity(fromCity); };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="relative">
                <div
                    className="h-[480px] bg-cover bg-center"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop")' }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-[#001b48]/70 to-[#001b48]/30" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-2 drop-shadow-lg">
                        Find Your Dream Flight
                    </h1>
                    <p className="text-white/80 text-lg mb-8 text-center">Affordable tickets to 81 cities in Turkey</p>

                    <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-6">
                        <form onSubmit={handleSearch}>
                            <div className="flex flex-col md:flex-row gap-3 items-end">
                                <div className="flex-1 w-full">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">From</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#001b48]"></span>
                                        <select
                                            className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl text-[#001b48] font-semibold focus:border-[#001b48] focus:outline-none bg-white transition"
                                            value={fromCity}
                                            onChange={e => setFromCity(e.target.value)}
                                        >
                                            <option value="">Select a city</option>
                                            {cities.map(c => <option key={c.id} value={c.id}>{c.city_name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={swap}
                                    className="hidden md:flex items-center justify-center w-10 h-10 bg-[#001b48] text-white rounded-full hover:bg-[#002a6e] transition flex-shrink-0 mb-1"
                                >
                                    ⇄
                                </button>

                                <div className="flex-1 w-full">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">To</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ffbc00]"></span>
                                        <select
                                            className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl text-[#001b48] font-semibold focus:border-[#001b48] focus:outline-none bg-white transition"
                                            value={toCity}
                                            onChange={e => setToCity(e.target.value)}
                                        >
                                            <option value="">Select a city</option>
                                            {cities.map(c => <option key={c.id} value={c.id}>{c.city_name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex-1 w-full">
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Date</label>
    <DatePicker
        selected={date}
        onChange={d => setDate(d)}
        dateFormat="dd/MM/yyyy"
         onChangeRaw={e => e.preventDefault()}  
        placeholderText="dd/mm/yyyy"
        locale="en"
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-[#001b48] font-semibold focus:border-[#001b48] focus:outline-none bg-white transition"
        wrapperClassName="w-full"
    />
</div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full md:w-auto bg-[#ffbc00] hover:bg-[#e6a800] text-[#001b48] font-bold px-8 py-4 rounded-xl transition text-sm uppercase tracking-wider shadow-md disabled:opacity-60 flex-shrink-0"
                                >
                                    {loading ? 'Searching...' : 'Search Flights'}
                                </button>
                            </div>

                            {error && (
                                <p className="mt-3 text-red-500 text-sm font-medium text-center">{error}</p>
                            )}
                        </form>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-10">
                {searched && (
                    <>
                        <h2 className="text-2xl font-bold text-[#001b48] mb-6">
                            {flights.length > 0 ? `${flights.length} flights found` : 'No results found'}
                        </h2>
                        {flights.length === 0 && (
                            <div className="text-center py-16 text-gray-400">
                                <div className="text-6xl mb-4">✈</div>
                                <p className="text-lg">No flights found for these criteria.</p>
                                <p className="text-sm mt-1">Try a different date or city.</p>
                            </div>
                        )}
                        <div className="flex flex-col gap-4">
                            {flights.map(flight => (
                                <FlightCard key={flight.id} flight={flight} onClick={() => navigate(`/booking/${flight.id}`)} />
                            ))}
                        </div>
                    </>
                )}

                {!searched && (
                    <div className="mt-4">
  <h2 className="text-3xl font-bold text-[#001b48]">
    Popular Routes
  </h2>

  <p className="text-gray-600 mb-8">
    Discover the most popular flight destinations
  </p>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

    {/* ANKARA */}
    <div className="relative h-[600px] rounded-3xl overflow-hidden group cursor-pointer">
      <img
        src="https://i.pinimg.com/1200x/cb/41/82/cb4182ca7b8e815f2237a3c9859c4796.jpg"
        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

      <div className="absolute bottom-6 left-6 text-white">
        <p className="text-lg">Turkey</p>
        <h3 className="text-4xl font-bold">Ankara</h3>
      </div>
    </div>

    {/* RIGHT PART */}
    <div className="flex flex-col gap-6">

      {/* TOP - ANTALYA */}
      <div className="relative h-[290px] rounded-3xl overflow-hidden group cursor-pointer">
        <img
          src="https://i.pinimg.com/736x/98/72/24/987224b0e091918557791fd5df149413.jpg"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

        <div className="absolute bottom-6 left-6 text-white">
          <p className="text-lg">Turkey</p>
          <h3 className="text-3xl font-bold">Antalya</h3>
        </div>
      </div>

      {/* BOTTOM  */}
      <div className="grid grid-cols-2 gap-6">

        {/* İZMİR */}
        <div className="relative h-[290px] rounded-3xl overflow-hidden group cursor-pointer">
          <img
            src="https://i.pinimg.com/1200x/80/bf/53/80bf53c05262ca99d3e025be8879e575.jpg"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

          <div className="absolute bottom-6 left-6 text-white">
            <p className="text-lg">Turkey</p>
            <h3 className="text-3xl font-bold">Izmir</h3>
          </div>
        </div>

        {/* İSTANBUL */}
        <div className="relative h-[290px] rounded-3xl overflow-hidden group cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1200"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

          <div className="absolute bottom-6 left-6 text-white">
            <p className="text-lg">Turkey</p>
            <h3 className="text-3xl font-bold">Istanbul</h3>
          </div>
        </div>

      </div>
    </div>
  </div>

  <button className="mt-8 bg-[#dfe6f5] px-6 py-3 rounded-lg font-medium hover:bg-[#cfd8ee] transition">
    Discover All Routes
  </button>
</div>
                )}
            </div>
        </div>
    );
}

function FlightCard({ flight, onClick }) {
    const from = flight.city_flight_from_city_idTocity?.city_name || '';
    const to = flight.city_flight_to_city_idTocity?.city_name || '';
    return (
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 flex flex-col md:flex-row items-center gap-4 border border-gray-100">
            <div className="flex-1 flex items-center gap-4 w-full">
                <div className="text-center">
                    <p className="text-2xl font-bold text-[#001b48]">{formatTime(flight.departure_time)}</p>
                    <p className="text-sm text-gray-500 font-medium">{from}</p>
                </div>
                <div className="flex-1 flex flex-col items-center">
                    <p className="text-xs text-gray-400 mb-1">{duration(flight.departure_time, flight.arrival_time)}</p>
                    <div className="w-full flex items-center">
                        <div className="w-2 h-2 rounded-full bg-[#001b48]" />
                        <div className="flex-1 h-px bg-gray-300 mx-1" />
                        <span className="text-[#ffbc00] text-lg">✈</span>
                        <div className="flex-1 h-px bg-gray-300 mx-1" />
                        <div className="w-2 h-2 rounded-full bg-[#ffbc00]" />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(flight.departure_time)}</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-[#001b48]">{formatTime(flight.arrival_time)}</p>
                    <p className="text-sm text-gray-500 font-medium">{to}</p>
                </div>
            </div>

            <div className="flex md:flex-col items-center gap-4 md:gap-1 flex-shrink-0">
                <div className="text-center">
                    <p className="text-3xl font-bold text-[#001b48]">{flight.price.toLocaleString('en-US')} ₺</p>
                    <p className="text-xs text-gray-400">per person</p>
                </div>
                <div className={`text-xs font-semibold px-2 py-1 rounded-full ${flight.seats_available > 10 ? 'bg-green-100 text-green-700' : flight.seats_available > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                    {flight.seats_available > 0 ? `${flight.seats_available} seats` : 'Full'}
                </div>
            </div>

            <button
                onClick={onClick}
                disabled={flight.seats_available === 0}
                className="bg-[#ffbc00] hover:bg-[#e6a800] text-[#001b48] font-bold px-6 py-3 rounded-xl transition text-sm uppercase tracking-wider shadow disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
                Buy
            </button>
        </div>
    );
}