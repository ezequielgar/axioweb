import React, { useEffect, useState } from 'react';

interface SectionIndicatorProps {
  sections: string[];
}

const SectionIndicator: React.FC<SectionIndicatorProps> = ({ sections }) => {
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    const container = document.querySelector('.snap-container');
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const sectionHeight = window.innerHeight;
      const newSection = Math.round(scrollTop / sectionHeight);
      setCurrentSection(Math.min(newSection, sections.length - 1));
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [sections.length]);

  const scrollToSection = (index: number) => {
    const container = document.querySelector('.snap-container');
    if (container) {
      container.scrollTo({
        top: index * window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex space-x-2">
      {sections.map((section, index) => (
        <button
          key={section}
          onClick={() => scrollToSection(index)}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            index === currentSection
              ? 'bg-gradient-to-r from-sky-400 to-fuchsia-500 scale-125 shadow-sm shadow-sky-400/50'
              : 'bg-slate-600/60 hover:bg-slate-500 hover:scale-110'
          }`}
          title={section}
        />
      ))}
    </div>
  );
};

export default SectionIndicator;
