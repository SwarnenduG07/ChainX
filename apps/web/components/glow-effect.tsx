"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function GlowEffect() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mouseMoved, setMouseMoved] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Short delay before showing the glow to ensure it's only visible after component mounts
    const timer = setTimeout(() => setIsVisible(true), 500);
    
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!mouseMoved) setMouseMoved(true);
    };
    
    window.addEventListener('mousemove', updateMousePosition);
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      clearTimeout(timer);
    };
  }, [mouseMoved]);
  
  if (!isVisible) return null;
  
  // Generate slightly randomized colors for each glow orb
  // This creates a more dynamic and interesting visual effect
  const getRandomizedColor = (baseHue: number) => {
    const hue = baseHue + Math.random() * 20 - 10; // Vary hue by ±10
    const saturation = 70 + Math.random() * 20; // 70-90% saturation
    const lightness = 50 + Math.random() * 10; // 50-60% lightness
    return `hsla(${hue}, ${saturation}%, ${lightness}%, 0.15)`;
  };
  
  // Multiple glow orbs with different properties
  const glowOrbs = [
    {
      size: 600,
      delay: 0,
      color: 'from-purple-500/15 via-indigo-500/10 to-transparent',
      damping: 30,
      stiffness: 50,
    },
    {
      size: 400,
      delay: 0.05,
      color: 'from-pink-500/10 via-purple-400/8 to-transparent',
      damping: 25,
      stiffness: 45,
    },
    {
      size: 200,
      delay: 0.1,
      color: 'from-blue-500/12 via-indigo-400/8 to-transparent',
      damping: 20,
      stiffness: 40,
    }
  ];
  
  return (
    <motion.div 
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      {mouseMoved ? (
        /* Multiple overlapping glow orbs */
        glowOrbs.map((orb, index) => (
          <motion.div
            key={index}
            className={`absolute rounded-full -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r ${orb.color} blur-3xl`}
            style={{
              width: orb.size,
              height: orb.size,
            }}
            animate={{
              x: mousePosition.x,
              y: mousePosition.y,
            }}
            transition={{
              type: "spring",
              damping: orb.damping,
              stiffness: orb.stiffness,
              restDelta: 0.001,
              delay: orb.delay,
            }}
          />
        ))
      ) : (
        /* Subtle ambient pulse when mouse hasn't moved yet */
        <motion.div
          className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500/10 via-indigo-500/8 to-transparent blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.div>
  );
} 