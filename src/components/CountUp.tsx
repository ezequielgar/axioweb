import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';

interface CountUpProps {
  to: number;
  from?: number;
  direction?: 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

export default function CountUp({
  to,
  from = 0,
  direction = 'up',
  delay = 0,
  duration = 2,
  className = '',
  startWhen = true,
  separator = '',
  onStart,
  onEnd
}: CountUpProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  const startValue = direction === 'down' ? to : from;
  const endValue = direction === 'down' ? from : to;

  const spring = useSpring(startValue, {
    damping: 30,
    stiffness: 100,
    duration: duration * 1000
  });

  const display = useTransform(spring, (current) => {
    const num = Math.floor(current);
    if (separator) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    }
    return num.toString();
  });

  useEffect(() => {
    if (!ref.current || !startWhen || hasStarted) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          
          const timeout = setTimeout(() => {
            if (onStart) onStart();
            spring.set(endValue);
          }, delay * 1000);

          observer.unobserve(ref.current as Element);

          return () => clearTimeout(timeout);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [startWhen, hasStarted, spring, endValue, delay, onStart]);

  useEffect(() => {
    if (!hasStarted) return;

    const unsubscribe = spring.on('change', (latest) => {
      if (Math.abs(latest - endValue) < 0.5 && onEnd) {
        onEnd();
      }
    });

    return () => unsubscribe();
  }, [hasStarted, spring, endValue, onEnd]);

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  );
}
