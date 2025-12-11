import { useState } from 'react';
import { motion } from 'motion/react';
import BlurText from './BlurText';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);

  const handleAnimationComplete = () => {
    // Esperar un momento antes de comenzar el fade out
    setTimeout(() => {
      setFadeOut(true);
    }, 800);
  };

  const handleFadeOutComplete = () => {
    onComplete();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900"
      initial={{ opacity: 1 }}
      animate={{ opacity: fadeOut ? 0 : 1 }}
      transition={{ duration: 0.8 }}
      onAnimationComplete={fadeOut ? handleFadeOutComplete : undefined}
    >
      <BlurText
        text="AXIO"
        delay={150}
        className="text-8xl font-bold text-white"
        animateBy="letters"
        direction="bottom"
        onAnimationComplete={handleAnimationComplete}
        stepDuration={0.4}
      />
    </motion.div>
  );
};

export default SplashScreen;
