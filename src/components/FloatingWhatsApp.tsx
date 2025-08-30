import { useState, useEffect } from 'react'

const FloatingWhatsApp = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  // Scroll effect - hide when scrolling, show when stopped
  useEffect(() => {
    let timeoutId: number
    
    const handleScroll = () => {
      setIsVisible(false)
      
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setIsVisible(true)
      }, 150) as unknown as number
    }

    const container = document.querySelector('.snap-container')
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true })
      
      return () => {
        container.removeEventListener('scroll', handleScroll)
        clearTimeout(timeoutId)
      }
    }
  }, [])

  const handleWhatsAppClick = () => {
    const phoneNumber = "5493814401840"
    const message = encodeURIComponent(
      "¡Hola AXIO! 👋 Vengo desde su página web y me interesa conocer más sobre sus servicios tecnológicos. ¿Podrían ayudarme con soluciones digitales para mi empresa? Me gustaría agendar una consulta. ¡Gracias! 🚀"
    )
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-70'
      }`}
    >
      {/* Tooltip/Message */}
      <div 
        className={`absolute bottom-full right-0 mb-3 transition-all duration-300 ${
          isHovered ? 'translate-y-0 opacity-100 visible' : 'translate-y-2 opacity-0 invisible'
        }`}
      >
        <div className="bg-slate-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl shadow-lg border border-slate-700/50 whitespace-nowrap">
          <div className="text-sm font-medium">¡Hablemos de tu proyecto! 💬</div>
          <div className="text-xs text-gray-300 mt-1">Respuesta inmediata</div>
          {/* Arrow */}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900/90"></div>
        </div>
      </div>

      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 border border-green-400/20 backdrop-blur-sm"
      >
        {/* Pulse Animation */}
        <div className="absolute inset-0 rounded-2xl bg-green-500/30 animate-ping"></div>
        <div className="absolute inset-0 rounded-2xl bg-green-500/20 animate-pulse"></div>
        
        {/* WhatsApp Icon */}
        <svg 
          className="w-9 h-9 text-white group-hover:scale-110 transition-transform duration-300 relative z-10" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>

        {/* Notification Badge */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </div>
      </button>
    </div>
  )
}

export default FloatingWhatsApp
