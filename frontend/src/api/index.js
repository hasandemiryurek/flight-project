const BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.error || 'Request failed');
    return data;
};

export const fetchCities = () =>
    fetch(`${BASE_URL}/cities`).then(handleResponse);

export const fetchAllFlights = () =>
    fetch(`${BASE_URL}/flights`).then(handleResponse);

export const fetchFlightById = (id) =>
    fetch(`${BASE_URL}/flights/${id}`).then(handleResponse);

export const searchFlights = ({ from, to, date }) => {
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    if (date) params.set('date', date);
    return fetch(`${BASE_URL}/flights/search?${params}`).then(handleResponse);
};

export const createFlight = (data) =>
    fetch(`${BASE_URL}/flights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data)
    }).then(handleResponse);

export const updateFlight = (id, data) =>
    fetch(`${BASE_URL}/flights/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data)
    }).then(handleResponse);

export const deleteFlight = (id) =>
    fetch(`${BASE_URL}/flights/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() }
    }).then(handleResponse);

export const bookTicket = (data) =>
    fetch(`${BASE_URL}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse);

export const fetchTicketsByEmail = (email) =>
    fetch(`${BASE_URL}/tickets/${encodeURIComponent(email)}`).then(handleResponse);

export const fetchAllTickets = () =>
    fetch(`${BASE_URL}/tickets/all`, {
        headers: { ...getAuthHeaders() }
    }).then(handleResponse);

export const adminLogin = (username, password) =>
    fetch(`${BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    }).then(handleResponse);