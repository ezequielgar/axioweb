import { useEffect, useState } from 'react';

export const useScrollAnimation = () => {
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    const container = document.querySelector('.snap-container');
    if (!container) return;

    const sections = document.querySelectorAll('.snap-section');
    const sectionHeight = window.innerHeight;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const newSection = Math.round(scrollTop / sectionHeight);
      
      if (newSection !== currentSection && newSection >= 0 && newSection < sections.length) {
        setCurrentSection(newSection);
        
        // Animación simple y rápida
        sections.forEach((section, index) => {
          section.classList.remove('section-active', 'section-enter');
          
          if (index === newSection) {
            section.classList.add('section-active', 'section-enter');
          }
        });
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    // Inicializar la primera sección
    if (sections.length > 0) {
      sections[0].classList.add('section-active', 'section-enter');
    }

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [currentSection]);

  return currentSection;
};
