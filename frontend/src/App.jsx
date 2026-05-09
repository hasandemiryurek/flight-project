import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage.jsx';
import ConfirmationPage from './pages/ConfirmationPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminFlightFormPage from './pages/AdminFlightFormPage';

function AdminRoute({ children }) {
    const { isAdmin } = useAuth();
    return isAdmin ? children : <Navigate to="/admin/login" replace />;
}

function AppLayout() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/booking/:id" element={<BookingPage />} />
                <Route path="/confirmation" element={<ConfirmationPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
                <Route path="/admin/flights/new" element={<AdminRoute><AdminFlightFormPage /></AdminRoute>} />
                <Route path="/admin/flights/edit/:id" element={<AdminRoute><AdminFlightFormPage /></AdminRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppLayout />
            </AuthProvider>
        </BrowserRouter>
    );
}