const Hero = () => {

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 flex items-center overflow-hidden pt-16">
      {/* Decorative elements with animations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 bg-sky-500/30 blur-3xl rounded-full animate-pulse" />
        <div className="absolute right-0 bottom-0 h-96 w-96 bg-fuchsia-500/20 blur-3xl rounded-full animate-bounce" style={{animationDuration: '3s'}} />
        <div className="absolute left-0 top-1/2 h-64 w-64 bg-cyan-500/20 blur-3xl rounded-full animate-ping" style={{animationDuration: '2s'}} />
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}} />
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-fuchsia-400 rounded-full animate-bounce" style={{animationDelay: '1s'}} />
        <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-cyan-400 rounded-full animate-ping" style={{animationDelay: '1.5s'}} />
      </div>
      
      <div className="relative w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-[80vh]">
          {/* Contenido de texto con animaciones */}
          <div className="w-full lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-tight font-extrabold text-white leading-tight animate-fade-in-up">
              <span className="block opacity-0 animate-slide-in-left" style={{animationDelay: '0.2s', animationFillMode: 'forwards'}}>Soluciones</span>
              <span className="block text-sky-400 opacity-0 animate-slide-in-left" style={{animationDelay: '0.4s', animationFillMode: 'forwards'}}>tecnológicas</span>
              <span className="block opacity-0 animate-slide-in-left" style={{animationDelay: '0.6s', animationFillMode: 'forwards'}}>para tu negocio</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-2xl mx-auto lg:mx-0 opacity-0 animate-fade-in-up" style={{animationDelay: '0.8s', animationFillMode: 'forwards'}}>
              Somos expertos en crear soluciones digitales personalizadas y brindar soporte IT para optimizar los procesos de tu empresa.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start opacity-0 animate-fade-in-up" style={{animationDelay: '1s', animationFillMode: 'forwards'}}>
              <a
                href={`https://wa.me/549XXXXXXXXXX?text=${encodeURIComponent('Hola, quiero más información sobre sus servicios tecnológicos.')}`}
                className="group w-full sm:w-auto flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/25"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5 mr-2 transition-transform group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <span className="group-hover:translate-x-1 transition-transform">Contactanos por WhatsApp</span>
              </a>
              <button className="group w-full sm:w-auto flex items-center justify-center px-8 py-4 border-2 border-sky-400 text-lg font-medium rounded-lg text-sky-400 hover:bg-sky-400 hover:text-white transition-all duration-300 transform hover:scale-105">
                <span className="group-hover:translate-x-1 transition-transform">Ver Servicios</span>
                <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Imagen o elementos decorativos con animaciones */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end opacity-0 animate-fade-in-right" style={{animationDelay: '1.2s', animationFillMode: 'forwards'}}>
            <div className="relative">
              <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-sky-400/20 to-fuchsia-500/20 rounded-3xl backdrop-blur-sm border border-white/20 flex items-center justify-center transform hover:rotate-3 transition-all duration-500 hover:scale-105">
                <div className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white/10 animate-pulse">AXIO</div>
              </div>
              {/* Elementos decorativos adicionales con animaciones */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-sky-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-fuchsia-500 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
              <div className="absolute top-1/2 -left-8 w-4 h-4 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '1.5s'}}></div>
              <div className="absolute top-1/4 -right-8 w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
