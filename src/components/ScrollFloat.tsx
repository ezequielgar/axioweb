import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollFloatProps {
  children: ReactNode;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  containerClassName?: string;
  textClassName?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
}

export default function ScrollFloat({
  children,
  scrollContainerRef,
  containerClassName = '',
  textClassName = '',
  animationDuration = 1,
  ease = 'power2.out',
  scrollStart = 'top 80%',
  scrollEnd = 'top 30%',
  stagger = 0.03
}: ScrollFloatProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const text = typeof children === 'string' ? children : '';
    if (!text) return;

    const chars = containerRef.current.querySelectorAll('.char');
    
    if (chars.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        {
          y: 50,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: animationDuration,
          ease: ease,
          stagger: stagger,
          scrollTrigger: {
            trigger: containerRef.current,
            start: scrollStart,
            end: scrollEnd,
            scrub: 1,
            scroller: scrollContainerRef?.current || undefined
          }
        }
      );
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [children, animationDuration, ease, scrollStart, scrollEnd, stagger, scrollContainerRef]);

  const renderText = () => {
    if (typeof children === 'string') {
      return children.split('').map((char, index) => (
        <span
          key={index}
          className={`char inline-block ${textClassName}`}
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ));
    }
    return children;
  };

  return (
    <div ref={containerRef} className={`inline-block ${containerClassName}`}>
      {renderText()}
    </div>
  );
}
