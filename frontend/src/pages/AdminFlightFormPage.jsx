import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchCities, createFlight, updateFlight, fetchFlightById } from '../api';
import { useAuth } from '../context/AuthContext';

export default function AdminFlightFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const isEdit = !!id;

    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [form, setForm] = useState({
        from_city_id: '',
        to_city_id: '',
        departure_time: '',
        arrival_time: '',
        price: '',
        seats_total: '',
    });

    useEffect(() => {
        if (!isAdmin) { navigate('/admin/login'); return; }
        fetchCities().then(setCities).catch(() => setError('Şehirler yüklenemedi.'));
        if (isEdit) {
            fetchFlightById(id).then(flight => {
                setForm({
                    from_city_id: flight.from_city_id,
                    to_city_id: flight.to_city_id,
                    departure_time: toLocalDatetime(flight.departure_time),
                    arrival_time: toLocalDatetime(flight.arrival_time),
                    price: flight.price,
                    seats_total: flight.seats_total,
                });
            }).catch(() => setError('Uçuş bulunamadı.'));
        }
    }, [id, isAdmin, navigate, isEdit]);

    const toLocalDatetime = (iso) => {
        const d = new Date(iso);
        const pad = n => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (form.from_city_id === form.to_city_id) { setError('Kalkış ve varış şehri aynı olamaz.'); return; }
        if (new Date(form.arrival_time) <= new Date(form.departure_time)) { setError('Varış saati kalkış saatinden sonra olmalıdır.'); return; }
        setLoading(true);
        try {
            if (isEdit) {
                await updateFlight(id, form);
                setSuccess('Uçuş başarıyla güncellendi!');
            } else {
                await createFlight(form);
                setSuccess('Uçuş başarıyla oluşturuldu!');
                setForm({ from_city_id: '', to_city_id: '', departure_time: '', arrival_time: '', price: '', seats_total: '' });
            }
            setTimeout(() => navigate('/admin'), 1200);
        } catch (err) {
            setError(err.message || 'İşlem başarısız oldu.');
        } finally {
            setLoading(false);
        }
    };

    const field = (key, val) => setForm(f => ({ ...f, [key]: val }));

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-2xl mx-auto">
                <Link to="/admin" className="text-gray-400 hover:text-[#001b48] transition font-medium mb-6 inline-block">← Admin Panel</Link>
                <h1 className="text-3xl font-bold text-[#001b48] mb-6">
                    {isEdit ? 'Uçuşu Düzenle' : 'Yeni Uçuş Ekle'}
                </h1>

                <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Kalkış Şehri</label>
                                <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#001b48] focus:outline-none transition bg-white" value={form.from_city_id} onChange={e => field('from_city_id', e.target.value)} required>
                                    <option value="">Şehir seçin</option>
                                    {cities.map(c => <option key={c.id} value={c.id}>{c.city_name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Varış Şehri</label>
                                <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#001b48] focus:outline-none transition bg-white" value={form.to_city_id} onChange={e => field('to_city_id', e.target.value)} required>
                                    <option value="">Şehir seçin</option>
                                    {cities.map(c => <option key={c.id} value={c.id}>{c.city_name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Kalkış Saati</label>
                                <input type="datetime-local" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#001b48] focus:outline-none transition" value={form.departure_time} onChange={e => field('departure_time', e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Varış Saati</label>
                                <input type="datetime-local" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#001b48] focus:outline-none transition" value={form.arrival_time} onChange={e => field('arrival_time', e.target.value)} required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Bilet Fiyatı (₺)</label>
                                <input type="number" min="1" step="0.01" placeholder="örn. 850" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#001b48] focus:outline-none transition" value={form.price} onChange={e => field('price', e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Toplam Koltuk</label>
                                <input type="number" min="1" max="500" placeholder="örn. 180" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#001b48] focus:outline-none transition" value={form.seats_total} onChange={e => field('seats_total', e.target.value)} required />
                            </div>
                        </div>

                        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">{error}</div>}
                        {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">{success}</div>}

                        <div className="flex gap-3 pt-2">
                            <Link to="/admin" className="flex-1 text-center border-2 border-gray-300 text-gray-600 font-bold py-3 rounded-xl hover:border-[#001b48] hover:text-[#001b48] transition">İptal</Link>
                            <button type="submit" disabled={loading} className="flex-1 bg-[#ffbc00] hover:bg-[#e6a800] text-[#001b48] font-bold py-3 rounded-xl transition uppercase tracking-wider disabled:opacity-60">
                                {loading ? 'Kaydediliyor...' : isEdit ? 'Güncelle' : 'Uçuş Ekle'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
                    <strong>Kural Hatırlatması:</strong> Aynı şehirden aynı saatte iki farklı kalkış veya aynı şehre aynı saatte iki varış olamaz.
                </div>
            </div>
        </div>
    );
}