import React, { useState, useEffect } from 'react';

const HeroSearch = () => {
  const [cities, setCities] = useState([]);
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/cities')
      .then(res => res.json())
      .then(data => setCities(data))
      .catch(err => console.error("Şehirler yüklenirken hata:", err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Arama:", { fromCity, toCity, date });
  };

  return (
    <div className="w-full font-sans">
      
      {/* 1. KATMAN: BEYAZ ARAMA BARI (Tam Genişlik) */}
      <div className="w-full bg-white border-b border-gray-200 shadow-sm py-10">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Üst Küçük Seçenekler (Lufthansa stili) */}
          <div className="flex gap-6 mb-6 text-sm text-lufthansa-blue font-medium">
            <div className="flex items-center gap-1 cursor-pointer">
              <span>Gidiş-Dönüş</span>
              <span className="text-[10px]">▼</span>
            </div>
            <div className="flex items-center gap-1 cursor-pointer">
              <span>1 Yolcu, Ekonomi</span>
            </div>
          </div>

          {/* Ana Arama Formu */}
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-end gap-1">
            
            {/* Nereden */}
            <div className="flex-1 w-full bg-white border border-gray-300 p-3 h-16 flex flex-col justify-center">
              <label className="text-[11px] font-bold text-gray-500 uppercase">Nereden</label>
              <select 
                className="w-full text-lufthansa-blue font-bold outline-none bg-transparent appearance-none"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
              >
                <option value="">Şehir Seçin</option>
                {cities.map(city => <option key={city.id} value={city.id}>{city.city_name}</option>)}
              </select>
            </div>

            {/* Değiştirme İkonu (Oklar) */}
            <div className="hidden md:flex items-center justify-center px-2 text-lufthansa-blue">
              <span className="text-xl font-light">⇄</span>
            </div>

            {/* Nereye */}
            <div className="flex-1 w-full bg-white border border-gray-300 p-3 h-16 flex flex-col justify-center">
              <label className="text-[11px] font-bold text-gray-500 uppercase">Nereye</label>
              <select 
                className="w-full text-lufthansa-blue font-bold outline-none bg-transparent appearance-none"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
              >
                <option value="">Şehir Seçin</option>
                {cities.map(city => <option key={city.id} value={city.id}>{city.city_name}</option>)}
              </select>
            </div>

            {/* Tarih */}
            <div className="flex-1 w-full bg-white border border-gray-300 p-3 h-16 flex flex-col justify-center">
              <label className="text-[11px] font-bold text-gray-500 uppercase">Gidiş - Dönüş</label>
              <input 
                type="date" 
                className="w-full text-lufthansa-blue font-bold outline-none bg-transparent"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* Buton */}
            <button 
              type="submit"
              className="w-full md:w-auto bg-lufthansa-yellow hover:bg-[#ffbc00] text-lufthansa-blue font-bold px-12 h-16 transition-all uppercase text-sm tracking-widest ml-0 md:ml-2"
            >
              Uçuşları Bul
            </button>
          </form>
        </div>
      </div>

      {/* 2. KATMAN: FOTOĞRAF ALANI */}
      <div className="relative w-full h-[500px]">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=2070&auto=format&fit=crop")',
          }}
        ></div>

        {/* Sağdaki Beyaz Kutu (Yine fotoğrafın üzerinde kalsın) */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center justify-end">
          <div className="bg-white p-10 max-w-[400px] shadow-2xl">
            <h2 className="text-4xl font-bold text-[#001b48] leading-tight mb-6">
              Bir sonraki maceranıza bizimle uçun
            </h2>
            <button className="flex items-center gap-2 text-[#001b48] font-bold border-b-2 border-[#001b48]">
              Rotayı Keşfet →
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HeroSearch;