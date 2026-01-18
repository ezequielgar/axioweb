import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ObleasProvider } from './context/ObleasContext'
import { AdminUsersProvider } from './context/AdminUsersContext'
import { ReimpresionesProvider } from './context/ReimpresionesContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import AboutUs from './components/AboutUs'
import Partners from './components/Partners'
import Contact from './components/Contact'
import Footer from './components/Footer'
import TransitionOverlay from './components/TransitionOverlay'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import Login from './components/Login'
import Turnos from './components/Turnos'
import AdminPanel from './components/AdminPanel'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import SplashScreen from './components/SplashScreen'
import LoginObleas from './components/LoginObleas'
import DashboardObleas from './components/DashboardObleas'
import ProtectedRouteObleas from './components/ProtectedRouteObleas'
import LoginAdmin from './components/LoginAdmin'
import AdminDashboard from './components/AdminDashboard'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'
import { useScrollAnimation } from './hooks/useScrollAnimation'

// Componente de la Landing Page principal
function LandingPage() {
  useScrollAnimation();

  return (
    <div className="w-full min-h-screen bg-slate-900">
      <Navbar />
      <TransitionOverlay />
      <FloatingWhatsApp />
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

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <AuthProvider>
      <ObleasProvider>
        <AdminUsersProvider>
          <ReimpresionesProvider>
            {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
            <Router>
              <Routes>
                {/* Ruta principal - Landing Page */}
                <Route path="/" element={<LandingPage />} />

                {/* Ruta de Login */}
                <Route path="/login" element={<Login />} />

                {/* Ruta protegida de Turnos */}
                <Route
                  path="/turnos"
                  element={
                    <ProtectedRoute>
                      <Turnos />
                    </ProtectedRoute>
                  }
                />

                {/* Ruta protegida de Admin (solo para admins) */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminPanel />
                    </AdminRoute>
                  }
                />

                {/* Rutas del módulo de Obleas - Acceso oculto */}
                <Route path="/munismt" element={<LoginObleas />} />
                <Route
                  path="/munismt/dashboard"
                  element={
                    <ProtectedRouteObleas>
                      <DashboardObleas />
                    </ProtectedRouteObleas>
                  }
                />

                {/* Rutas del Admin Panel - Gestión de usuarios */}
                <Route path="/admin-panel" element={<LoginAdmin />} />
                <Route
                  path="/admin-panel/dashboard"
                  element={
                    <ProtectedAdminRoute>
                      <AdminDashboard />
                    </ProtectedAdminRoute>
                  }
                />
              </Routes>
            </Router>
          </ReimpresionesProvider>
        </AdminUsersProvider>
      </ObleasProvider>
    </AuthProvider>
  )
}

export default App
