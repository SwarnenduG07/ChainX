'use client';

import { useEffect, useRef } from 'react';

function ParticleRing() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = 800;
      canvas.height = 400;
    };
    resizeCanvas();

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      angle: number;
      speed: number;
      opacity: number;
      radius: number;
    }> = [];

    // Create particles
    const createParticle = () => {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 200 + 100;
      const x = canvas.width / 2 + Math.cos(angle) * radius;
      const y = canvas.height / 2 + Math.sin(angle) * radius * 0.5;
      const size = Math.random() * 1.5 + 0.5;
      const speed = Math.random() * 0.2 + 0.1;
      const opacity = Math.random() * 0.4 + 0.2;
      particles.push({ x, y, size, angle, speed, opacity, radius });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add new particles
      if (particles.length < 50) {
        createParticle();
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // Move particles in a spiral towards the center
        p.radius -= p.speed;
        p.angle += p.speed * 0.05;
        p.x = canvas.width / 2 + Math.cos(p.angle) * p.radius;
        p.y = canvas.height / 2 + Math.sin(p.angle) * p.radius * 0.5;

        // Remove particles that reach the center
        if (p.radius < 5) {
          particles.splice(i, 1);
          continue;
        }

        // Draw particle with gradient
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${p.opacity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}

export function BlackHole() {
  return (
    <div className="relative w-full max-w-[800px] h-[400px] mx-auto">
      {/* Main Arc Effect */}
      <div className="absolute inset-x-0 top-0 h-full">
        {/* Core Layers */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[400px] h-[200px]">
          {/* Deep Purple Core */}
          <div className="absolute inset-0 rounded-t-full bg-gradient-to-t from-[#a171df] via-[#2d1b4e] to-transparent opacity-95" />
          
          {/* First Purple Layer */}
          <div className="absolute inset-0 rounded-t-full bg-gradient-to-t from-transparent via-[#6935c0] to-[#a855f7] opacity-60 blur-[1px]" />
          
          {/* White Middle Layer */}
          <div className="absolute inset-0 rounded-t-full bg-gradient-to-t from-transparent via-white to-white opacity-80 blur-[2px] animate-pulse" />
          
          {/* Second Purple Layer */}
          <div className="absolute inset-0 rounded-t-full bg-gradient-to-t from-transparent via-[#9333ea] to-[#d8b4fe] opacity-50 blur-[1px]" />
          
          {/* Flowing White Top */}
          <div className="absolute inset-0 rounded-t-full bg-gradient-to-t from-transparent via-transparent to-white opacity-90 blur-sm animate-pulse" />
        </div>

        {/* Purple Glow Arcs */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[500px] h-[250px]">
          {/* First Arc Layer */}
          <div className="absolute inset-0 rounded-t-full bg-gradient-to-t from-[#1a0b2e] via-[#6935c0] to-[#d8b4fe] opacity-50 blur-md" />
          
          {/* Second Arc Layer */}
          <div className="absolute inset-0 rounded-t-full bg-gradient-to-t from-[#eb42be] via-[#9333ea] to-white opacity-40 blur-xl" />
          
          {/* Third Arc Layer */}
          <div className="absolute inset-0 rounded-t-full bg-gradient-to-t from-[#1a0b2e] via-[#6935c0] to-[#d8b4fe] opacity-30 blur-2xl" />
          
          {/* Fourth Arc Layer - Widest */}
          <div className="absolute inset-0 -inset-x-10 rounded-t-full bg-gradient-to-t from-[#1a0b2e] via-[#2d1b4e] to-[#a855f7] opacity-20 blur-3xl" />
        </div>

        {/* Outer Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-t-full bg-[#1a0b2e]/20 blur-3xl" />
      </div>

      {/* Particle Animation */}
      <ParticleRing />

      {/* Subtle Stars */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:20px_20px] opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:30px_30px] opacity-50" />
      </div>
    </div>
  );
}
