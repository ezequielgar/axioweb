const Contact = () => {
  return (
    <section id="contacto" className="relative w-full py-20 lg:py-32 bg-slate-900 overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1.5s'}} />
      </div>

      <div className="relative w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Título de la sección */}
          <div className="text-center mb-16 opacity-0 animate-fade-in-up" style={{animationDelay: '0.2s', animationFillMode: 'forwards'}}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6">
              ¿Listo para <span className="text-gradient">transformar</span> tu negocio?
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto">
              Contáctanos y descubre cómo podemos llevar tu empresa al siguiente nivel tecnológico
            </p>
            <div className="mt-4 w-24 h-1 bg-gradient-to-r from-sky-400 to-fuchsia-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            
            {/* Información de contacto */}
            <div className="opacity-0 animate-slide-in-left" style={{animationDelay: '0.4s', animationFillMode: 'forwards'}}>
              <h3 className="text-2xl font-bold text-white mb-8">Información de Contacto</h3>
              
              <div className="space-y-6">
                {/* Dirección */}
                <div className="flex items-start space-x-4 group hover-lift">
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-500/20 to-fuchsia-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-1">Dirección</h4>
                    <p className="text-gray-400">Av. Tecnológica 123, Piso 5<br />Ciudad Digital, Argentina</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4 group hover-lift">
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-500/20 to-fuchsia-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-1">Email</h4>
                    <a href="mailto:contacto@axio.com" className="text-sky-400 hover:text-sky-300 transition-colors">
                      contacto@axio.com
                    </a>
                  </div>
                </div>

                {/* Teléfono */}
                <div className="flex items-start space-x-4 group hover-lift">
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-500/20 to-fuchsia-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-1">Teléfono</h4>
                    <p className="text-gray-400">+54 9 11 XXXX-XXXX</p>
                  </div>
                </div>

                {/* Redes sociales */}
                <div className="flex items-start space-x-4 group hover-lift">
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-500/20 to-fuchsia-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-1">Síguenos</h4>
                    <div className="flex space-x-3">
                      <a href="#" className="text-sky-400 hover:text-sky-300 transition-colors">LinkedIn</a>
                      <span className="text-gray-600">•</span>
                      <a href="#" className="text-sky-400 hover:text-sky-300 transition-colors">Twitter</a>
                      <span className="text-gray-600">•</span>
                      <a href="#" className="text-sky-400 hover:text-sky-300 transition-colors">Instagram</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA y botón de WhatsApp */}
            <div className="opacity-0 animate-fade-in-right" style={{animationDelay: '0.6s', animationFillMode: 'forwards'}}>
              <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
                <h3 className="text-2xl font-bold text-white mb-6">¡Comencemos a trabajar juntos!</h3>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  ¿Tienes un proyecto en mente o necesitas asesoramiento tecnológico? 
                  Contáctanos a través de WhatsApp y te responderemos de inmediato.
                </p>
                
                {/* Botón principal de WhatsApp */}
                <a
                  href="https://wa.me/549XXXXXXXXXX?text=Hola,%20quiero%20más%20información%20sobre%20los%20servicios%20de%20Axio"
                  className="group w-full flex items-center justify-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/25 mb-6"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-6 h-6 mr-3 transition-transform group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  <span className="group-hover:translate-x-1 transition-transform">Escribinos por WhatsApp</span>
                </a>

                {/* Horarios de atención */}
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-2">Horarios de atención:</p>
                  <p className="text-sky-400 font-medium">Lunes a Viernes: 9:00 - 18:00 hs</p>
                  <p className="text-sky-400 font-medium">Soporte de emergencia: 24/7</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
