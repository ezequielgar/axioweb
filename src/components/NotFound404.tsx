import React from 'react';

const NotFound404: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 flex items-center justify-center overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 blur-3xl rounded-full animate-pulse" style={{background: 'rgba(0, 188, 212, 0.2)'}} />
        <div className="absolute right-0 bottom-0 h-80 w-80 blur-3xl rounded-full animate-bounce" style={{background: 'rgba(21, 101, 192, 0.15)', animationDuration: '3s'}} />
        <div className="absolute left-0 top-1/2 h-64 w-64 blur-3xl rounded-full animate-ping" style={{background: 'rgba(76, 175, 80, 0.1)', animationDuration: '4s'}} />
        
        {/* Partículas flotantes */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full animate-bounce" style={{backgroundColor: '#00BCD4', animationDelay: '0.5s'}} />
        <div className="absolute bottom-1/3 right-1/3 w-3 h-3 rounded-full animate-pulse" style={{backgroundColor: '#4CAF50', animationDelay: '1s'}} />
        <div className="absolute top-1/2 left-3/4 w-1 h-1 rounded-full animate-ping" style={{backgroundColor: '#1565C0', animationDelay: '1.5s'}} />
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Logo AXIO */}
        <div className="mb-8 opacity-0 animate-fade-in-up" style={{animationDelay: '0.2s', animationFillMode: 'forwards'}}>
          <img 
            src="/logo_true.png" 
            alt="AXIO" 
            className="h-16 mx-auto drop-shadow-lg hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* 404 Grande */}
        <div className="mb-8 opacity-0 animate-slide-in-up" style={{animationDelay: '0.4s', animationFillMode: 'forwards'}}>
          <h1 className="text-8xl sm:text-9xl lg:text-[12rem] font-extrabold leading-none select-none">
            <span className="text-transparent bg-clip-text" style={{background: 'linear-gradient(to right, #00BCD4, #1565C0)', WebkitBackgroundClip: 'text'}}>
              404
            </span>
          </h1>
        </div>

        {/* Título y descripción */}
        <div className="mb-8 space-y-4 opacity-0 animate-fade-in-up" style={{animationDelay: '0.6s', animationFillMode: 'forwards'}}>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            ¡Oops! Esta página aún está en desarrollo
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            🚧 Nuestras redes sociales estarán disponibles muy pronto. Mientras tanto, 
            puedes contactarnos directamente por WhatsApp o explorar nuestros servicios.
          </p>
        </div>

        {/* Cards divertidas */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto opacity-0 animate-fade-in-up" style={{animationDelay: '0.8s', animationFillMode: 'forwards'}}>
          {/* Card WhatsApp */}
          <div className="group bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="text-lg font-semibold text-white mb-2">¡Chateemos!</h3>
            <p className="text-gray-400 text-sm mb-4">Contactanos por WhatsApp y te respondemos al instante</p>
            <a
              href={`https://wa.me/5493814401840?text=${encodeURIComponent('¡Hola AXIO! 👋 Vengo desde su página web y me gustaría conocer más sobre sus servicios. ¿Podrían ayudarme?')}`}
              className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors text-sm font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ir a WhatsApp 
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M7 13l3 3 7-7" />
              </svg>
            </a>
          </div>

          {/* Card Servicios */}
          <div className="group bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="text-lg font-semibold text-white mb-2">Servicios</h3>
            <p className="text-gray-400 text-sm mb-4">Descubre todas las soluciones que tenemos para tu negocio</p>
            <a
              href="/#servicios"
              className="inline-flex items-center hover:text-cyan-300 transition-colors text-sm font-medium"
              style={{color: '#00BCD4'}}
            >
              Ver servicios
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          {/* Card Home */}
          <div className="group bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105 sm:col-span-2 lg:col-span-1">
            <div className="text-4xl mb-3">🏠</div>
            <h3 className="text-lg font-semibold text-white mb-2">Inicio</h3>
            <p className="text-gray-400 text-sm mb-4">Volver a la página principal</p>
            <a
              href="/"
              className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium"
            >
              Ir al inicio
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </a>
          </div>
        </div>

        {/* Mensaje motivacional */}
        <div className="opacity-0 animate-fade-in-up" style={{animationDelay: '1s', animationFillMode: 'forwards'}}>
          <p className="text-gray-400 text-sm">
            💡 <span className="font-semibold" style={{color: '#00BCD4'}}>Tip:</span> 
            Mientras preparamos nuestras redes sociales, puedes seguir explorando nuestros servicios tecnológicos
          </p>
        </div>

        {/* Elemento decorativo final */}
        <div className="mt-8 flex justify-center opacity-0 animate-fade-in-up" style={{animationDelay: '1.2s', animationFillMode: 'forwards'}}>
          <div className="w-24 h-1 rounded-full" style={{background: 'linear-gradient(to right, #00BCD4, #1565C0)'}}></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound404;
