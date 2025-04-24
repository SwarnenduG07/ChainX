"use client";
import React, { useEffect, useRef } from 'react';

export function ReflectInspiredBlob() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    let time = 0;
    
    // Blob parameters
    const blobPoints = 8; // Number of points to create the blob
    const radius = 120; // Base radius
    const randomness = 0.4; // How random the blob's movement is
    const colors = [
      { r: 128, g: 0, b: 255, a: 0.05 },    // Purple
      { r: 75, g: 0, b: 130, a: 0.05 },     // Indigo
      { r: 238, g: 130, b: 238, a: 0.05 },  // Violet
    ];
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    // Draw a blob with multiple points
    const drawBlob = (
      centerX: number, 
      centerY: number, 
      r: number, 
      points: number, 
      color: { r: number, g: number, b: number, a: number },
      timeOffset: number = 0
    ) => {
      ctx.beginPath();
      
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const noiseFactor = Math.sin(time * 0.5 + timeOffset + i) * randomness;
        const x = centerX + Math.cos(angle) * (r + r * noiseFactor);
        const y = centerY + Math.sin(angle) * (r + r * noiseFactor);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.closePath();
      ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
      ctx.fill();
    };
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01; // Increment time
      
      // Draw multiple blobs with slight variations
      colors.forEach((color, i) => {
        const timeOffset = i * 2;
        const sizeVariation = i * 20;
        drawBlob(
          mouseX, 
          mouseY, 
          radius + sizeVariation, 
          blobPoints, 
          color,
          timeOffset
        );
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Setup and start animation
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    
    resizeCanvas();
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      style={{ filter: 'blur(50px)' }}
    />
  );
} 