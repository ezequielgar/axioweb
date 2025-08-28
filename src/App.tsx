import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import AboutUs from './components/AboutUs'
import Partners from './components/Partners'
import Contact from './components/Contact'
import Footer from './components/Footer'
import SectionIndicator from './components/SectionIndicator'
import TransitionOverlay from './components/TransitionOverlay'
import { useScrollAnimation } from './hooks/useScrollAnimation'

function App() {
  useScrollAnimation();

  const sections = ['Inicio', 'Servicios', 'Nosotros', 'Partners', 'Contacto', 'Footer'];

  return (
    <div className="w-full min-h-screen bg-slate-900">
      <Navbar />
      <SectionIndicator sections={sections} />
      <TransitionOverlay />
      <div className="snap-container">
        <section id="inicio" className="snap-section">
          <Hero />
        </section>
        <section id="servicios" className="snap-section">
          <Services />
        </section>
        <section id="nosotros" className="snap-section">
          <AboutUs />
        </section>
        <section id="partners" className="snap-section">
          <Partners />
        </section>
        <section id="contacto" className="snap-section">
          <Contact />
        </section>
        <section className="snap-section footer-section">
          <Footer />
        </section>
      </div>
    </div>
  )
}

export default App
