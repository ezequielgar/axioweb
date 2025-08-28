import { useState, useEffect } from 'react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('inicio')
  const [scrollProgress, setScrollProgress] = useState(0)

  const sections = [
    { id: 'inicio', name: 'Inicio' },
    { id: 'servicios', name: 'Servicios' },
    { id: 'nosotros', name: 'Nosotros' },
    { id: 'partners', name: 'Partners' },
    { id: 'contacto', name: 'Contacto' }
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

  const scrollToSection = (sectionId: string) => {
    const container = document.querySelector('.snap-container')
    const sectionIndex = sections.findIndex(section => section.id === sectionId)
    
    if (container && sectionIndex !== -1) {
      container.scrollTo({
        top: sectionIndex * window.innerHeight,
        behavior: 'smooth'
      })
    }
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
                  <div className="flex items-center space-x-2">
                    <img 
                      src="/logo_true.png" 
                      alt="AXIO Logo" 
                      className="w-8 h-8 filter drop-shadow-sm"
                    />
                    <span className="text-white text-xl font-bold tracking-wide">AXIO</span>
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
                <div className="flex items-center">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="lg:hidden p-2 rounded-xl text-gray-300 hover:text-white hover:bg-slate-800/50 transition-all duration-300"
                  >
                    <span className="sr-only">Abrir menú</span>
                    <div className="relative w-6 h-6">
                      <span className={`absolute block w-6 h-0.5 bg-current transform transition duration-300 ${isOpen ? 'rotate-45 top-3' : 'top-1'}`}></span>
                      <span className={`absolute block w-6 h-0.5 bg-current transform transition duration-300 ${isOpen ? 'opacity-0' : 'top-3'}`}></span>
                      <span className={`absolute block w-6 h-0.5 bg-current transform transition duration-300 ${isOpen ? '-rotate-45 top-3' : 'top-5'}`}></span>
                    </div>
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed top-20 left-4 right-4 lg:hidden transition-all duration-300 transform ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
          <div className="p-4 space-y-2">
            {sections.map((section) => (
              <button
                key={`mobile-${section.id}`}
                onClick={() => {
                  scrollToSection(section.id)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                  activeSection === section.id
                    ? 'text-white bg-slate-800/50 shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-slate-800/30'
                }`}
              >
                <span className="font-medium">{section.name}</span>
                {activeSection === section.id && (
                  <div className="ml-auto w-2 h-2 rounded-full" style={{backgroundColor: '#00BCD4'}}></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
