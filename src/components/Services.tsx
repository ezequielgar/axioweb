const ServiceCard = ({ title, description, icon: Icon, index }: { title: string; description: string; icon: any; index: number }) => (
  <div 
    className="relative group bg-white/5 p-8 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-all duration-500 border border-white/10 hover-lift opacity-0 animate-slide-in-up"
    style={{
      animationDelay: `${index * 0.2}s`,
      animationFillMode: 'forwards'
    }}
  >
    <div 
      className="absolute -inset-0.5 rounded-xl blur opacity-0 group-hover:opacity-30 transition-all duration-500"
      style={{
        background: 'linear-gradient(to right, #00BCD4, #1565C0)'
      }}
    ></div>
    <div className="relative">
      <div 
        className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 animate-glow"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 188, 212, 0.2), rgba(21, 101, 192, 0.2))'
        }}
      >
        <Icon className="h-8 w-8 group-hover:text-white transition-colors" style={{color: '#00BCD4'}} />
      </div>
      <h3 
        className="text-xl font-semibold text-white mb-4 transition-colors duration-300"
        onMouseEnter={(e) => (e.currentTarget.style.color = '#00BCD4')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'white')}
      >
        {title}
      </h3>
      <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{description}</p>
      
      {/* Elementos decorativos */}
      <div className="absolute top-4 right-4 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping" style={{backgroundColor: 'rgba(0, 188, 212, 0.5)'}}></div>
    </div>
  </div>
)

const Services = () => {
  const services = [
    {
      title: "Desarrollo Web",
      description: "Creamos sitios web modernos y aplicaciones personalizadas que impulsan tu presencia digital y mejoran la experiencia de tus usuarios.",
      icon: (props: any) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Soporte IT",
      description: "Brindamos soporte técnico integral y mantenimiento preventivo para tu infraestructura tecnológica, garantizando máxima disponibilidad.",
      icon: (props: any) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      title: "Consultoría Tecnológica",
      description: "Asesoramos en la implementación de soluciones tecnológicas estratégicas para optimizar tus procesos empresariales y aumentar la productividad.",
      icon: (props: any) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
  ]

  return (
    <section id="servicios" className="relative w-full py-20 lg:py-32 bg-slate-900 overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-64 h-64 rounded-full blur-3xl animate-float" style={{background: 'rgba(0, 188, 212, 0.1)'}} />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 blur-3xl rounded-full animate-float" style={{background: 'rgba(21, 101, 192, 0.1)', animationDelay: '1s'}} />
      </div>
      
      <div className="relative w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 opacity-0 animate-fade-in-up" style={{animationDelay: '0.2s', animationFillMode: 'forwards'}}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6">
            Nuestros <span style={{background: 'linear-gradient(to right, #00BCD4, #1565C0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>Servicios</span>
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto">
            Soluciones integrales para todas tus necesidades tecnológicas
          </p>
          <div 
            className="mt-4 w-24 h-1 mx-auto rounded-full"
            style={{
              background: 'linear-gradient(to right, #00BCD4, #1565C0)'
            }}
          ></div>
        </div>

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <ServiceCard key={index} index={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
