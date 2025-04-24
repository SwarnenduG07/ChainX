"use client";
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Shape {
  type: 'sphere' | 'donut' | 'cube' | 'pyramid';
  position: { x: string; y: string };
  size: number;
  color: string;
  rotation: { x: number; y: number; z: number };
  floatY: number;
  duration: number;
  opacity: number;
  blur?: number;
}

export function FloatingShapes() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [interactionEnabled, setInteractionEnabled] = useState(false);
  
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    
    function handleMouseMove(e: MouseEvent) {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    }
    
    // Set initial size
    handleResize();
    
    // Enable interaction after a delay
    const timer = setTimeout(() => {
      setInteractionEnabled(true);
    }, 2000);
    
    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
    };
  }, []);
  
  const shapes: Shape[] = [
    // Subtle purple sphere
    {
      type: 'sphere',
      position: { x: '15%', y: '20%' },
      size: 90,
      color: 'rgba(147, 51, 234, 0.18)',
      rotation: { x: 0.02, y: 0.01, z: 0.005 },
      floatY: 60,
      duration: 20,
      opacity: 0.7,
      blur: 8
    },
    // Larger indigo sphere
    {
      type: 'sphere',
      position: { x: '75%', y: '70%' },
      size: 140,
      color: 'rgba(79, 70, 229, 0.13)',
      rotation: { x: 0.01, y: 0.02, z: 0.005 },
      floatY: 70,
      duration: 24,
      opacity: 0.7,
      blur: 10
    },
    // Small pink sphere
    {
      type: 'sphere',
      position: { x: '85%', y: '30%' },
      size: 70,
      color: 'rgba(219, 39, 119, 0.16)',
      rotation: { x: 0.02, y: 0.01, z: 0.01 },
      floatY: 50,
      duration: 18,
      opacity: 0.7,
      blur: 8
    },
    // Donut shape 1
    {
      type: 'donut',
      position: { x: '30%', y: '80%' },
      size: 120,
      color: 'rgba(147, 51, 234, 0.12)',
      rotation: { x: 0.01, y: 0.02, z: 0.005 },
      floatY: 50,
      duration: 22,
      opacity: 0.7,
      blur: 6
    },
    // Donut shape 2
    {
      type: 'donut',
      position: { x: '60%', y: '25%' },
      size: 90,
      color: 'rgba(59, 130, 246, 0.14)',
      rotation: { x: 0.02, y: 0.01, z: 0.01 },
      floatY: 40,
      duration: 19,
      opacity: 0.7,
      blur: 5
    },
    // Cube shape
    {
      type: 'cube',
      position: { x: '20%', y: '45%' },
      size: 80,
      color: 'rgba(236, 72, 153, 0.12)',
      rotation: { x: 0.02, y: 0.03, z: 0.01 },
      floatY: 40,
      duration: 16,
      opacity: 0.6,
      blur: 4
    },
    // Pyramid shape
    {
      type: 'pyramid',
      position: { x: '70%', y: '20%' },
      size: 100,
      color: 'rgba(16, 185, 129, 0.13)',
      rotation: { x: 0.01, y: 0.04, z: 0.02 },
      floatY: 45,
      duration: 21,
      opacity: 0.6,
      blur: 5
    }
  ];
  
  if (windowSize.width === 0) return null;
  
  // Create a distortion effect when near the mouse
  const getDistortionEffect = (shapePos: { x: string; y: string }, size: number) => {
    if (!interactionEnabled) return {};
    
    // Convert percentage position to pixels
    const x = parseFloat(shapePos.x) * windowSize.width / 100;
    const y = parseFloat(shapePos.y) * windowSize.height / 100;
    
    // Calculate distance to mouse
    const dx = x - mousePosition.x;
    const dy = y - mousePosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Maximum distance for distortion
    const maxDistance = 300;
    
    if (distance < maxDistance) {
      // Calculate distortion amount
      const distortionFactor = 1 - (distance / maxDistance);
      const scaleBoost = 1 + distortionFactor * 0.2;
      const blurReduction = distortionFactor * 4;
      
      return {
        scale: scaleBoost,
        blur: Math.max(0, (size * 0.1) - blurReduction),
        opacity: 0.7 + distortionFactor * 0.3
      };
    }
    
    return {};
  };
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape, index) => {
        const distortion = getDistortionEffect(shape.position, shape.size);
        
        return (
          <motion.div
            key={index}
            className="absolute rounded-full"
            style={{
              left: shape.position.x,
              top: shape.position.y,
              width: shape.size,
              height: shape.size,
              background: shape.type === 'sphere' 
                ? `radial-gradient(circle at 30% 30%, ${shape.color}, rgba(0,0,0,0) 70%)`
                : 'transparent',
              opacity: distortion.opacity || shape.opacity,
              zIndex: 1,
              filter: `blur(${distortion.blur !== undefined ? distortion.blur : shape.blur}px)`
            }}
            animate={{
              y: [0, shape.floatY, 0],
              rotateX: [0, 360 * shape.rotation.x],
              rotateY: [0, 360 * shape.rotation.y],
              rotateZ: [0, 360 * shape.rotation.z],
              scale: distortion.scale ? [distortion.scale, distortion.scale * 1.05, distortion.scale] : 1
            }}
            transition={{
              duration: shape.duration,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {shape.type === 'donut' && (
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  border: `2px solid ${shape.color}`,
                  borderRadius: '50%',
                  transform: 'perspective(800px) rotateX(60deg)'
                }}
              />
            )}
            
            {shape.type === 'cube' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  style={{
                    width: shape.size * 0.7,
                    height: shape.size * 0.7,
                    background: 'transparent',
                    border: `1px solid ${shape.color}`,
                    transform: 'perspective(800px) rotateX(45deg) rotateZ(45deg)'
                  }}
                />
              </div>
            )}
            
            {shape.type === 'pyramid' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: `${shape.size * 0.3}px solid transparent`,
                    borderRight: `${shape.size * 0.3}px solid transparent`,
                    borderBottom: `${shape.size * 0.5}px solid ${shape.color}`,
                    opacity: 0.7,
                    transform: 'perspective(800px) rotateX(-20deg)'
                  }}
                />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
} 