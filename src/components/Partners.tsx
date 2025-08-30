import React from 'react';

const Partners: React.FC = () => {
  // Logos reales de partners
  const partners = [
    { id: 1, name: 'Clínica Argañaraz', logo: '/Partners img/clinica arganaraz.png' },
    { id: 2, name: 'Geogas', logo: '/Partners img/geogas.png' },
    { id: 3, name: 'Iacono', logo: '/Partners img/iacono.png' },
    { id: 4, name: 'Municipalidad de Banda', logo: '/Partners img/muni banda.png' },
    { id: 5, name: 'SMT', logo: '/Partners img/smt.png' },
    { id: 6, name: 'Clínica Argañaraz', logo: '/Partners img/clinica arganaraz.png' }, // Duplicado para flujo
    { id: 7, name: 'Geogas', logo: '/Partners img/geogas.png' }, // Duplicado para flujo
    { id: 8, name: 'Iacono', logo: '/Partners img/iacono.png' }, // Duplicado para flujo
  ];

  return (
    <section id="partners" className="pt-24 pb-16 bg-slate-800 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Nuestros <span className="text-transparent bg-clip-text" style={{background: 'linear-gradient(to right, #00BCD4, #1565C0)', WebkitBackgroundClip: 'text'}}>Partners</span>
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

        {/* Tipos de negocios */}
        <BusinessTypesSection />
      </div>
    </section>
  );
};

// Componente de tipos de negocios
const BusinessTypesSection: React.FC = () => {
  const businessTypes = [
    {
      icon: "🏥",
      title: "Clínicas Médicas",
      description: "Sistemas de gestión de pacientes, historias clínicas digitales y automatización de procesos médicos."
    },
    {
      icon: "🍽️",
      title: "Bares y Restaurantes",
      description: "Plataformas de pedidos online, sistemas de reservas y gestión de inventarios inteligentes."
    },
    {
      icon: "🏪",
      title: "Pequeños Negocios",
      description: "Presencia digital, e-commerce personalizado y herramientas de gestión comercial."
    },
    {
      icon: "🏭",
      title: "Grandes Industrias",
      description: "Automatización industrial, sistemas ERP y soluciones de Big Data para optimización."
    },
    {
      icon: "🏢",
      title: "Empresas Medianas",
      description: "Transformación digital completa, integración de sistemas y consultoría estratégica."
    },
    {
      icon: "🛍️",
      title: "Comercios",
      description: "Soluciones POS, gestión de stock y plataformas de ventas omnicanal."
    }
  ];

  return (
    <div className="mt-16 mb-8">
      <h3 className="text-2xl font-bold text-white text-center mb-12">
        Preparamos soluciones digitales para <span className="text-transparent bg-clip-text" style={{background: 'linear-gradient(to right, #00BCD4, #1565C0)', WebkitBackgroundClip: 'text'}}>todo tipo de negocio</span>
      </h3>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {businessTypes.map((business, index) => (
          <div 
            key={index}
            className="group bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg opacity-0 animate-slide-in-up"
            style={{
              animationDelay: `${index * 0.1}s`,
              animationFillMode: 'forwards'
            }}
          >
            {/* Icono */}
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {business.icon}
            </div>
            
            {/* Título */}
            <h4 className="text-lg font-semibold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text transition-all duration-300"
                style={{
                  background: 'linear-gradient(to right, #00BCD4, #1565C0)',
                  WebkitBackgroundClip: 'text'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(to right, #00BCD4, #1565C0)';
                  (e.currentTarget.style as any).webkitBackgroundClip = 'text';
                  e.currentTarget.style.color = 'transparent';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
            >
              {business.title}
            </h4>
            
            {/* Descripción */}
            <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
              {business.description}
            </p>
            
            {/* Elemento decorativo */}
            <div className="mt-4 w-12 h-1 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300" 
                 style={{background: 'linear-gradient(to right, #00BCD4, #1565C0)'}}>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Partners;
