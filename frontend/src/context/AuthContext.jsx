import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [adminToken, setAdminToken] = useState(() => localStorage.getItem('adminToken'));
    const [adminUser, setAdminUser] = useState(() => localStorage.getItem('adminUser'));

    const login = (token, username) => {
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', username);
        setAdminToken(token);
        setAdminUser(username);
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setAdminToken(null);
        setAdminUser(null);
    };

    return (
        <AuthContext.Provider value={{ adminToken, adminUser, login, logout, isAdmin: !!adminToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);