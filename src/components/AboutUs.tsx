const AboutUs = () => {
  return (
    <section id="nosotros" className="relative w-full py-20 lg:py-32 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}} />
      </div>

      <div className="relative w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Contenido de texto */}
            <div className="opacity-0 animate-slide-in-left" style={{animationDelay: '0.2s', animationFillMode: 'forwards'}}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6">
                Sobre <span className="text-gradient">Axio</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-sky-400 to-fuchsia-500 mb-8 rounded-full"></div>
              
              <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                <p>
                  Somos una <strong className="text-sky-400">consultora tecnológica</strong> especializada en crear 
                  soluciones digitales personalizadas que transforman la manera en que las empresas operan y crecen.
                </p>
                <p>
                  Con años de experiencia en el sector, nos enfocamos en brindar <strong className="text-sky-400">soporte IT integral</strong> y 
                  consultoría estratégica para negocios que buscan optimizar sus procesos y mejorar su infraestructura tecnológica.
                </p>
                <p>
                  Nuestro equipo de expertos trabaja de cerca con cada cliente para entender sus necesidades específicas 
                  y desarrollar soluciones que no solo resuelvan problemas actuales, sino que también preparen a las 
                  empresas para el futuro digital.
                </p>
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div className="text-center group">
                  <div className="text-3xl font-bold text-sky-400 group-hover:scale-110 transition-transform">50+</div>
                  <div className="text-sm text-gray-400 mt-1">Proyectos</div>
                </div>
                <div className="text-center group">
                  <div className="text-3xl font-bold text-fuchsia-400 group-hover:scale-110 transition-transform">24/7</div>
                  <div className="text-sm text-gray-400 mt-1">Soporte</div>
                </div>
                <div className="text-center group">
                  <div className="text-3xl font-bold text-cyan-400 group-hover:scale-110 transition-transform">99%</div>
                  <div className="text-sm text-gray-400 mt-1">Satisfacción</div>
                </div>
              </div>
            </div>

            {/* Imagen/Ilustración */}
            <div className="flex justify-center lg:justify-end opacity-0 animate-fade-in-right" style={{animationDelay: '0.4s', animationFillMode: 'forwards'}}>
              <div className="relative">
                {/* Imagen principal */}
                <div className="w-80 h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-sky-400/20 via-fuchsia-500/20 to-cyan-500/20 rounded-3xl backdrop-blur-sm border border-white/20 flex items-center justify-center relative overflow-hidden hover:scale-105 transition-all duration-500">
                  
                  {/* Contenido de la "imagen" */}
                  <div className="text-center z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-fuchsia-500 rounded-2xl flex items-center justify-center mb-6 mx-auto animate-glow">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Innovación</h3>
                    <p className="text-gray-400">Tecnológica</p>
                  </div>

                  {/* Elementos decorativos en la imagen */}
                  <div className="absolute top-6 left-6 w-3 h-3 bg-sky-400 rounded-full animate-ping"></div>
                  <div className="absolute top-12 right-8 w-2 h-2 bg-fuchsia-400 rounded-full animate-bounce"></div>
                  <div className="absolute bottom-8 left-8 w-4 h-4 bg-cyan-400 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-6 right-6 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                </div>

                {/* Elementos decorativos externos */}
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-sky-400 to-fuchsia-500 rounded-xl opacity-80 animate-float"></div>
                <div className="absolute -bottom-6 -left-6 w-8 h-8 bg-gradient-to-br from-fuchsia-500 to-cyan-500 rounded-lg opacity-80 animate-float" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 -left-8 w-6 h-6 bg-gradient-to-br from-cyan-400 to-sky-500 rounded-full opacity-80 animate-bounce"></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutUs
