const Footer = () => {
  return (
    <footer className="relative w-full bg-slate-950 border-t border-slate-800 overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-fuchsia-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Contenido principal del footer */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            
            {/* Logo y descripción */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold text-white">AXIO</span>
                <div className="ml-2 w-2 h-2 bg-sky-400 rounded-full animate-pulse"></div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md">
                Somos tu socio tecnológico de confianza. Transformamos ideas en soluciones digitales 
                que impulsan el crecimiento de tu negocio.
              </p>
              
              {/* Redes sociales */}
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gradient-to-br from-sky-500/20 to-fuchsia-500/20 rounded-lg flex items-center justify-center text-sky-400 hover:text-white hover:scale-110 transition-all duration-300 group"
                >
                  <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gradient-to-br from-sky-500/20 to-fuchsia-500/20 rounded-lg flex items-center justify-center text-sky-400 hover:text-white hover:scale-110 transition-all duration-300 group"
                >
                  <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gradient-to-br from-sky-500/20 to-fuchsia-500/20 rounded-lg flex items-center justify-center text-sky-400 hover:text-white hover:scale-110 transition-all duration-300 group"
                >
                  <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.219-.359-1.219c0-1.142.662-1.995 1.482-1.995.699 0 1.037.219 1.037 1.178 0 .718-.219 1.795-.359 2.792-.219.937.718 1.699 1.699 1.699 2.043 0 3.616-2.162 3.616-5.282 0-2.761-1.975-4.69-4.797-4.69-3.271 0-5.194 2.45-5.194 4.977 0 .984.379 2.042.852 2.613.094.11.107.219.079.339-.085.359-.274 1.117-.31 1.277-.049.219-.169.264-.389.159-1.463-.68-2.377-2.81-2.377-4.527 0-3.637 2.643-6.982 7.617-6.982 3.998 0 7.105 2.85 7.105 6.651 0 3.969-2.501 7.158-5.975 7.158-1.167 0-2.267-.611-2.643-1.421 0 0-.579 2.267-.719 2.826-.259.995-.961 2.24-1.43 3.003C9.484 23.761 10.72 24 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gradient-to-br from-sky-500/20 to-fuchsia-500/20 rounded-lg flex items-center justify-center text-sky-400 hover:text-white hover:scale-110 transition-all duration-300 group"
                >
                  <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.036 5.339c-3.635 0-6.591 2.956-6.591 6.589s2.956 6.589 6.591 6.589 6.591-2.956 6.591-6.589-2.956-6.589-6.591-6.589zm0 10.86c-2.353 0-4.27-1.918-4.27-4.271s1.917-4.271 4.27-4.271 4.27 1.918 4.27 4.271-1.917 4.271-4.27 4.271z"/>
                    <path d="M19.68 4.868c0 .823-.669 1.492-1.492 1.492s-1.492-.669-1.492-1.492.669-1.492 1.492-1.492 1.492.669 1.492 1.492z"/>
                    <path d="M12.036 0C5.39 0 0 5.39 0 12.036s5.39 12.036 12.036 12.036 12.036-5.39 12.036-12.036S18.682 0 12.036 0zm7.545 17.428c-.51.826-1.257 1.573-2.083 2.083-1.98.874-4.51 1.228-6.462 1.228s-4.482-.354-6.462-1.228c-.826-.51-1.573-1.257-2.083-2.083C1.617 15.448 1.263 12.918 1.263 10.966s.354-4.482 1.228-6.462c.51-.826 1.257-1.573 2.083-2.083C6.554 1.617 9.084 1.263 12.036 1.263s4.482.354 6.462 1.228c.826.51 1.573 1.257 2.083 2.083.874 1.98 1.228 4.51 1.228 6.462s-.354 4.482-1.228 6.462z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Enlaces rápidos */}
            <div>
              <h4 className="text-white font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-sky-400 text-sm transition-colors duration-300">Inicio</a></li>
                <li><a href="#servicios" className="text-gray-400 hover:text-sky-400 text-sm transition-colors duration-300">Servicios</a></li>
                <li><a href="#nosotros" className="text-gray-400 hover:text-sky-400 text-sm transition-colors duration-300">Sobre Nosotros</a></li>
                <li><a href="#contacto" className="text-gray-400 hover:text-sky-400 text-sm transition-colors duration-300">Contacto</a></li>
              </ul>
            </div>

            {/* Servicios */}
            <div>
              <h4 className="text-white font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-sky-400 text-sm transition-colors duration-300">Desarrollo Web</a></li>
                <li><a href="#" className="text-gray-400 hover:text-sky-400 text-sm transition-colors duration-300">Soporte IT</a></li>
                <li><a href="#" className="text-gray-400 hover:text-sky-400 text-sm transition-colors duration-300">Consultoría</a></li>
                <li><a href="#" className="text-gray-400 hover:text-sky-400 text-sm transition-colors duration-300">Mantenimiento</a></li>
              </ul>
            </div>
          </div>

          {/* Línea divisoria */}
          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              
              {/* Copyright */}
              <div className="flex items-center text-gray-400 text-sm mb-4 md:mb-0">
                <span>&copy; 2025 Axio. Todos los derechos reservados.</span>
                <div className="ml-2 w-1 h-1 bg-sky-400 rounded-full animate-pulse"></div>
              </div>

              {/* Links legales */}
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-sky-400 transition-colors duration-300">Política de Privacidad</a>
                <a href="#" className="text-gray-400 hover:text-sky-400 transition-colors duration-300">Términos de Uso</a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  )
}

export default Footer
