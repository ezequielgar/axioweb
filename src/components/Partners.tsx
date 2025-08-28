import React from 'react';

const Partners: React.FC = () => {
  // Por ahora usaremos logos de placeholder - luego los reemplazaremos con los logos reales
  const partners = [
    { id: 1, name: 'Partner 1', logo: 'https://via.placeholder.com/200x80/4ade80/ffffff?text=Partner+1' },
    { id: 2, name: 'Partner 2', logo: 'https://via.placeholder.com/200x80/06b6d4/ffffff?text=Partner+2' },
    { id: 3, name: 'Partner 3', logo: 'https://via.placeholder.com/200x80/8b5cf6/ffffff?text=Partner+3' },
    { id: 4, name: 'Partner 4', logo: 'https://via.placeholder.com/200x80/f59e0b/ffffff?text=Partner+4' },
    { id: 5, name: 'Partner 5', logo: 'https://via.placeholder.com/200x80/ef4444/ffffff?text=Partner+5' },
    { id: 6, name: 'Partner 6', logo: 'https://via.placeholder.com/200x80/ec4899/ffffff?text=Partner+6' },
    { id: 7, name: 'Partner 7', logo: 'https://via.placeholder.com/200x80/10b981/ffffff?text=Partner+7' },
    { id: 8, name: 'Partner 8', logo: 'https://via.placeholder.com/200x80/3b82f6/ffffff?text=Partner+8' },
  ];

  return (
    <section className="py-16 bg-slate-800 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-fuchsia-500">Partners</span>
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Empresas que ya confían en nosotros para impulsar su transformación digital
          </p>
        </div>

        {/* Carrusel 1 - Izquierda a Derecha */}
        <div className="relative overflow-hidden mb-8">
          <div className="flex animate-scroll-right">
            {/* Primera fila de logos */}
            {partners.slice(0, 4).map((partner) => (
              <div
                key={`row1-${partner.id}`}
                className="flex-shrink-0 mx-8 w-48 h-20 flex items-center justify-center bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
            {/* Duplicamos para efecto continuo */}
            {partners.slice(0, 4).map((partner) => (
              <div
                key={`row1-duplicate-${partner.id}`}
                className="flex-shrink-0 mx-8 w-48 h-20 flex items-center justify-center bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Carrusel 2 - Derecha a Izquierda */}
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll-left">
            {/* Segunda fila de logos */}
            {partners.slice(4, 8).map((partner) => (
              <div
                key={`row2-${partner.id}`}
                className="flex-shrink-0 mx-8 w-48 h-20 flex items-center justify-center bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
            {/* Duplicamos para efecto continuo */}
            {partners.slice(4, 8).map((partner) => (
              <div
                key={`row2-duplicate-${partner.id}`}
                className="flex-shrink-0 mx-8 w-48 h-20 flex items-center justify-center bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
