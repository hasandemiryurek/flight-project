import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-[#001b48] text-white w-full shadow-md z-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Kısmı */}
          <div className="flex items-center gap-2 cursor-pointer">
            <span className="text-2xl font-bold tracking-wider text-lufthansa-yellow">✈ FlyTicket</span>
          </div>

          {/* Menü Linkleri */}
          <div className="hidden md:flex space-x-8">
            <a href="#" className="hover:text-lufthansa-yellow transition font-medium">Uçuş Ara</a>
            <a href="#" className="hover:text-lufthansa-yellow transition font-medium">Rezervasyonlarım</a>
            <a href="#" className="hover:text-lufthansa-yellow transition font-medium">Check-in</a>
          </div>

          {/* Admin Girişi / Kullanıcı */}
          <div>
            <button className="border border-white hover:border-lufthansa-yellow hover:text-lufthansa-yellow px-4 py-2 rounded transition font-medium">
              Giriş Yap
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;