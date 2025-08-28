import React, { useState, useEffect } from 'react';

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

        {/* Testimoniales estilo redes sociales */}
        <TestimonialsSection />
      </div>
    </section>
  );
};

// Componente de testimoniales animados
const TestimonialsSection: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

// Alternativa con fotos realistas (comentada)
  // const testimonials = [
  //   {
  //     id: 1,
  //     name: "María González",
  //     company: "TechStart Solutions", 
  //     avatar: "https://i.pravatar.cc/50?img=1",
  //     text: "¡Increíble trabajo! AXIO transformó completamente nuestra infraestructura digital. Resultados en tiempo récord 🚀",
  //     platform: "LinkedIn",
  //     verified: true
  //   },
  //   // ... más testimoniales con ?img=2, ?img=3, etc.
  // ];

  const testimonials = [
    {
      id: 1,
      name: "María González",
      company: "TechStart Solutions",
      avatar: "https://ui-avatars.com/api/?name=María+González&background=38bdf8&color=fff&size=50&bold=true",
      text: "¡Increíble trabajo! AXIO transformó completamente nuestra infraestructura digital. Resultados en tiempo récord 🚀",
      verified: true
    },
    {
      id: 2,
      name: "Carlos Ruiz",
      company: "Innovate Corp",
      avatar: "https://ui-avatars.com/api/?name=Carlos+Ruiz&background=10b981&color=fff&size=50&bold=true",
      text: "El mejor equipo de desarrollo que hemos trabajado. Profesionales, eficientes y siempre disponibles 💯",
      verified: true
    },
    {
      id: 3,
      name: "Ana Martinez",
      company: "Digital Future",
      avatar: "https://ui-avatars.com/api/?name=Ana+Martinez&background=ec4899&color=fff&size=50&bold=true",
      text: "Soporte 24/7 real! Nos salvaron en una emergencia crítica. Definitivamente recomendados 👏",
      verified: true
    },
    {
      id: 4,
      name: "Roberto Silva",
      company: "CloudTech Industries",
      avatar: "https://ui-avatars.com/api/?name=Roberto+Silva&background=8b5cf6&color=fff&size=50&bold=true",
      text: "La automatización que implementaron nos ahorra 15 horas semanales. ROI increíble! ⚡",
      verified: true
    },
    {
      id: 5,
      name: "Lucía Fernández",
      company: "StartUp Hub",
      avatar: "https://ui-avatars.com/api/?name=Lucía+Fernández&background=f59e0b&color=fff&size=50&bold=true",
      text: "De startup a empresa establecida gracias a su tecnología. ¡Partners estratégicos! 🎯",
      verified: true
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        setIsVisible(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const currentTest = testimonials[currentTestimonial];

  return (
    <div className="mt-16 mb-8">
      <h3 className="text-2xl font-bold text-white text-center mb-8">
        Lo que dicen nuestros <span className="text-transparent bg-clip-text" style={{background: 'linear-gradient(to right, #00BCD4, #1565C0)', WebkitBackgroundClip: 'text'}}>clientes</span>
      </h3>
      
      <div className="flex justify-center">
        <div 
          className={`max-w-md transition-all duration-500 transform ${
            isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
          }`}
        >
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-xl">
            {/* Header del testimonio */}
            <div className="flex items-center mb-4">
              <img 
                src={currentTest.avatar} 
                alt={currentTest.name}
                className="w-12 h-12 rounded-full border-2"
                style={{borderColor: '#00BCD4'}}
              />
              <div className="ml-3">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-semibold text-sm">{currentTest.name}</span>
                  {currentTest.verified && <span className="text-xs" style={{color: '#00BCD4'}}>✓</span>}
                </div>
                <span className="text-slate-400 text-xs">{currentTest.company}</span>
              </div>
            </div>

            {/* Contenido del testimonio */}
            <p className="text-slate-200 text-sm leading-relaxed mb-4">
              {currentTest.text}
            </p>

            {/* Footer con rating de estrellas */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-sm">⭐</span>
                ))}
              </div>
              <span className="text-slate-500 text-xs">Cliente verificado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Indicadores de testimoniales */}
      <div className="flex justify-center mt-6 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentTestimonial(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentTestimonial 
                ? 'scale-125' 
                : 'bg-slate-600 hover:bg-slate-500'
            }`}
            style={index === currentTestimonial ? {backgroundColor: '#00BCD4'} : {}}
          />
        ))}
      </div>

      {/* Call-to-Action animado para WhatsApp */}
      <div className="mt-12 flex justify-center">
        <CallToActionButton />
      </div>
    </div>
  );
};

// Componente del botón animado CTA
const CallToActionButton: React.FC = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = "5491123456789"; // Reemplaza con tu número real
    const message = encodeURIComponent(
      "¡Hola AXIO! 👋 Vengo desde su página web y me interesa ser su próximo cliente. Me gustaría conocer más sobre sus servicios y cómo pueden ayudarme con mi proyecto tecnológico. ¿Podríamos agendar una consulta? 🚀"
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative group">
      {/* Efecto de resplandor animado */}
      <div 
        className="absolute -inset-1 rounded-xl blur opacity-25 group-hover:opacity-50 animate-pulse"
        style={{
          background: 'linear-gradient(to right, #00BCD4, #1565C0, #4CAF50)'
        }}
      ></div>
      
      {/* Botón principal */}
      <button
        onClick={handleWhatsAppClick}
        className="relative text-white font-bold py-4 px-8 rounded-xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 group"
        style={{
          background: 'linear-gradient(to right, #00BCD4, #1565C0)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(to right, #4CAF50, #00BCD4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(to right, #00BCD4, #1565C0)';
        }}
      >
        {/* Contenido del botón */}
        <div className="flex items-center space-x-3">
          {/* Icono de WhatsApp animado */}
          <div className="relative">
            <span className="text-2xl group-hover:scale-110 transition-transform duration-300">💬</span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
          </div>
          
          <div className="text-left">
            <div className="text-lg font-bold">¡Sé nuestro próximo cliente!</div>
            <div className="text-sm opacity-90">Contactanos ahora por WhatsApp</div>
          </div>
          
          {/* Flecha animada */}
          <span className="text-xl group-hover:translate-x-1 transition-transform duration-300">→</span>
        </div>

        {/* Efecto de ondas */}
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>

        {/* Partículas flotantes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 left-4 w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
          <div className="absolute top-3 right-6 w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-2 left-8 w-1 h-1 bg-white/50 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
        </div>
      </button>

      {/* Texto motivacional debajo */}
      <div className="mt-4 text-center">
        <p className="text-slate-400 text-sm">
          <span className="font-semibold" style={{color: '#00BCD4'}}>Respuesta inmediata</span> • 
          <span className="font-semibold" style={{color: '#4CAF50'}}> Consulta gratuita</span> • 
          <span className="font-semibold" style={{color: '#1565C0'}}> Sin compromiso</span>
        </p>
      </div>
    </div>
  );
};

export default Partners;
