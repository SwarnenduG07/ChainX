"use client";
import { useEffect, useState } from "react";

export function ScrollParallax() {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    // Track scroll position for parallax effects
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Calculate parallax offsets based on scroll position
  const parallaxOffset1 = scrollY * 0.1;
  const parallaxOffset2 = scrollY * 0.2;
  const parallaxOffset3 = scrollY * 0.05;
  const rotationOffset = scrollY * 0.01;
  
  // Style objects for each parallax element
  const styles = {
    element1: {
      transform: `translateY(${parallaxOffset1}px)`,
      opacity: Math.max(0, 1 - (scrollY * 0.001))
    },
    element2: {
      transform: `translateY(${-parallaxOffset2}px)`,
      opacity: Math.max(0, 1 - (scrollY * 0.0015))
    },
    element3: {
      transform: `translateY(${parallaxOffset3}px) rotate(${rotationOffset}deg)`,
      opacity: Math.max(0, 1 - (scrollY * 0.002))
    }
  };
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Parallax floating elements */}
      <div 
        className="absolute top-[10%] right-[25%] w-40 h-40 rounded-full bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 blur-xl"
        style={styles.element1}
      />
      <div
        className="absolute top-[60%] left-[15%] w-60 h-60 rounded-full bg-gradient-to-tr from-indigo-500/10 to-blue-500/5 blur-xl"
        style={styles.element2}
      />
      <div
        className="absolute top-[40%] right-[15%] w-32 h-32 rounded-full border border-purple-500/20 blur-sm"
        style={styles.element3}
      />
        
      {/* Subtle horizontal lines that move on scroll */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-full h-px bg-gradient-to-r from-transparent via-purple-500/10 to-transparent"
            style={{
              top: `${20 + i * 15}%`,
              transform: `translateY(${scrollY * 0.05 * (i % 2 === 0 ? 1 : -1)}px)`,
              opacity: 0.4 - (i * 0.05)
            }}
          />
        ))}
      </div>
    </div>
  );
} 