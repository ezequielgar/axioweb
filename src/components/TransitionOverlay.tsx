import React, { useEffect, useState } from 'react';

const TransitionOverlay: React.FC = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    const container = document.querySelector('.snap-container');
    if (!container) return;

    let transitionTimeout: number;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const sectionHeight = window.innerHeight;
      const newSection = Math.round(scrollTop / sectionHeight);
      
      if (newSection !== currentSection) {
        setIsTransitioning(true);
        setCurrentSection(newSection);

        // Limpiar timeout anterior
        clearTimeout(transitionTimeout);
        
        // Quitar el overlay rápidamente
        transitionTimeout = setTimeout(() => {
          setIsTransitioning(false);
        }, 400);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(transitionTimeout);
    };
  }, [currentSection]);

  if (!isTransitioning) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {/* Efecto sutil de transición */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-full h-full opacity-10"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.2) 0%, transparent 60%)`,
            animation: 'quickFade 0.4s ease-out forwards'
          }}
        />
      </div>
    </div>
  );
};

export default TransitionOverlay;
