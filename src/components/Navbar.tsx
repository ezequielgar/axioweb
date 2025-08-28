import { useState } from 'react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 w-full bg-slate-900/90 backdrop-blur-sm z-50 border-b border-slate-800">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-white text-2xl font-bold">AXIO</span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#inicio" className="text-sky-400 border-b-2 border-sky-400 px-3 py-2 text-sm font-medium">Inicio</a>
              <a href="#servicios" className="text-gray-300 hover:text-sky-400 px-3 py-2 text-sm font-medium transition-colors">Servicios</a>
              <a href="#nosotros" className="text-gray-300 hover:text-sky-400 px-3 py-2 text-sm font-medium transition-colors">Nosotros</a>
              <a href="#partners" className="text-gray-300 hover:text-sky-400 px-3 py-2 text-sm font-medium transition-colors">Partners</a>
              <a href="#contacto" className="text-gray-300 hover:text-sky-400 px-3 py-2 text-sm font-medium transition-colors">Contacto</a>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <span className="sr-only">Abrir menú principal</span>
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-slate-900/95 backdrop-blur-sm`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-slate-800">
          <a href="#" className="text-sky-400 block px-3 py-2 text-base font-medium">Inicio</a>
          <a href="#servicios" className="text-gray-300 hover:text-sky-400 block px-3 py-2 text-base font-medium">Servicios</a>
          <a href="#nosotros" className="text-gray-300 hover:text-sky-400 block px-3 py-2 text-base font-medium">Nosotros</a>
          <a href="#contacto" className="text-gray-300 hover:text-sky-400 block px-3 py-2 text-base font-medium">Contacto</a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
