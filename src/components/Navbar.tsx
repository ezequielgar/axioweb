import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('inicio')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isBlackHoleActive, setIsBlackHoleActive] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const sections = [
    { id: 'inicio', name: 'Inicio' },
    { id: 'servicios', name: 'Servicios' },
    { id: 'nosotros', name: 'Nosotros' },
    { id: 'partners', name: 'Partners' },
    { id: 'contacto', name: 'Contacto' },
    { id: 'turnos', name: 'Turnos', isRoute: true }
  ]

  useEffect(() => {
    const container = document.querySelector('.snap-container')
    if (!container) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      const scrollHeight = container.scrollHeight - container.clientHeight
      const progress = (scrollTop / scrollHeight) * 100
      setScrollProgress(progress)
      
      const sectionHeight = window.innerHeight
      const currentSectionIndex = Math.round(scrollTop / sectionHeight)
      
      if (currentSectionIndex >= 0 && currentSectionIndex < sections.length) {
        setActiveSection(sections[currentSectionIndex].id)
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [sections])

  // Cerrar menú móvil al redimensionar la ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setIsOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Cerrar menú móvil al presionar Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const scrollToSection = (sectionId: string) => {
    // Si es la sección de turnos, navegar a la ruta
    if (sectionId === 'turnos') {
      navigate('/turnos')
      setIsOpen(false)
      return
    }

    // Si no estamos en la página principal, navegar primero
    if (location.pathname !== '/') {
      navigate('/')
      // Esperar a que se cargue la página antes de hacer scroll
      setTimeout(() => {
        const container = document.querySelector('.snap-container')
        const sectionIndex = sections.findIndex(section => section.id === sectionId && !section.isRoute)
        
        if (container && sectionIndex !== -1) {
          container.scrollTo({
            top: sectionIndex * window.innerHeight,
            behavior: 'smooth'
          })
        }
      }, 100)
      return
    }

    const container = document.querySelector('.snap-container')
    const sectionIndex = sections.findIndex(section => section.id === sectionId && !section.isRoute)
    
    if (container && sectionIndex !== -1) {
      container.scrollTo({
        top: sectionIndex * window.innerHeight,
        behavior: 'smooth'
      })
    }
  }

  const handleLogoClick = () => {
    setIsBlackHoleActive(true)
    
    // Ir al inicio después de un pequeño delay para que se vea la animación
    setTimeout(() => {
      scrollToSection('inicio')
    }, 600)
    
    // Quitar la animación después de que termine
    setTimeout(() => {
      setIsBlackHoleActive(false)
    }, 1200)
  }

  return (
    <>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-800/50 z-50">
        <div 
          className="h-full transition-all duration-300 ease-out"
          style={{ 
            width: `${scrollProgress}%`,
            background: 'linear-gradient(to right, #00BCD4, #4CAF50, #1565C0)'
          }}
        />
      </div>
      
      <nav className="fixed top-1 left-0 right-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Glassmorphism Container */}
            <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/20">
              <div className="flex items-center justify-between h-16 px-6">
                
                {/* Logo Section */}
                <div className="flex items-center space-x-3">
                  <div 
                    className="flex items-center space-x-2 cursor-pointer group"
                    onClick={handleLogoClick}
                  >
                    <div className={`relative ${isBlackHoleActive ? 'suction-effect' : ''}`}>
                      <img 
                        src="/logo_true.png" 
                        alt="AXIO Logo" 
                        className={`w-8 h-8 filter drop-shadow-sm transition-all duration-300 group-hover:scale-110 ${
                          isBlackHoleActive ? 'black-hole-animation' : ''
                        }`}
                      />
                    </div>
                    <span className="text-white text-xl font-bold tracking-wide group-hover:text-cyan-400 transition-colors duration-300">AXIO</span>
                  </div>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center space-x-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group ${
                        activeSection === section.id
                          ? 'text-white bg-slate-800/50 shadow-lg'
                          : 'text-gray-300 hover:text-white hover:bg-slate-800/30'
                      }`}
                    >
                      <span>{section.name}</span>
                      
                      {/* Active Indicator */}
                      {activeSection === section.id && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2">
                          <div className="w-1 h-1 rounded-full" style={{backgroundColor: '#00BCD4'}}></div>
                        </div>
                      )}
                      
                      {/* Hover Effect */}
                      <div 
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: 'linear-gradient(to right, rgba(0, 188, 212, 0.1), rgba(76, 175, 80, 0.1), rgba(21, 101, 192, 0.1))'
                        }}
                      ></div>
                    </button>
                  ))}
                </div>

                {/* Mobile Menu Button */}
                <div className="flex items-center lg:hidden">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-slate-800/50 transition-all duration-300 z-50 relative"
                    aria-label="Toggle mobile menu"
                  >
                    <div className="relative w-6 h-6 flex flex-col justify-center">
                      <span className={`hamburger-line absolute block w-6 h-0.5 bg-current transform ${
                        isOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'
                      }`}></span>
                      <span className={`hamburger-line absolute block w-6 h-0.5 bg-current transform ${
                        isOpen ? 'opacity-0' : 'opacity-100'
                      }`}></span>
                      <span className={`hamburger-line absolute block w-6 h-0.5 bg-current transform ${
                        isOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'
                      }`}></span>
                    </div>
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed top-20 left-4 right-4 lg:hidden transition-all duration-300 ease-in-out transform z-50 ${
        isOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-4 opacity-0 pointer-events-none'
      }`}>
        <div className="mobile-menu-container bg-slate-900/98 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/30 overflow-hidden">
          <div className="p-4 space-y-2">
            {sections.map((section, index) => (
              <button
                key={`mobile-${section.id}`}
                onClick={() => {
                  scrollToSection(section.id)
                  setIsOpen(false)
                }}
                className={`mobile-menu-item w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-300 transform ${
                  activeSection === section.id
                    ? 'text-white bg-slate-800/50 shadow-lg scale-105'
                    : 'text-gray-300 hover:text-white hover:bg-slate-800/30 hover:scale-105'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <span className="font-medium">{section.name}</span>
                {activeSection === section.id && (
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{backgroundColor: '#00BCD4'}}></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default Navbar
