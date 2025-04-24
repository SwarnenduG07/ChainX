import { BackgroundGradient } from "@/components/background-gradient"
import { ParticleBackground } from "@/components/particle-background"
import { GlowEffect } from "@/components/glow-effect"
import { FloatingShapes } from "@/components/floating-shapes"
import { ScrollParallax } from "@/components/scroll-parallax"
import { ReflectInspiredBlob } from "@/components/reflect-inspired-blob"

function LandingLayout({children}: {children: React.ReactNode}):JSX.Element {
    return (
      <main className="min-h-screen overflow-hidden relative bg-black">
          {/* Enhanced background effects */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black pointer-events-none"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_var(--tw-gradient-stops))] from-black via-black to-purple-950/10 pointer-events-none"></div>
          
          {/* Floating gradient orbs */}
          <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-pink-600/10 rounded-full filter blur-3xl opacity-20 animate-float-delayed"></div>
          <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-indigo-600/10 rounded-full filter blur-3xl opacity-20 animate-float"></div>
          
          {/* Deep background glow spots */}
          <div className="absolute top-10 left-[20%] w-32 h-32 bg-violet-600/5 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-40 right-[15%] w-48 h-48 bg-blue-600/5 rounded-full filter blur-3xl"></div>
          <div className="absolute top-[30%] right-[10%] w-40 h-40 bg-fuchsia-600/5 rounded-full filter blur-3xl"></div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
          
          {/* Reflect-inspired blob effect */}
          <ReflectInspiredBlob />
          
          {/* Interactive particle background - Reflect.app style */}
          <ParticleBackground />
          
          {/* Scroll effect */}
          <ScrollParallax />
          
          {/* 3D Floating shapes */}
          <FloatingShapes />
          
          {/* Mouse-following glow effect */}
          <GlowEffect />
          
          {/* Animated stars background */}
          <div className="absolute inset-0 overflow-hidden opacity-50 pointer-events-none">
            <div className="stars-small"></div>
            <div className="stars-medium"></div>
            <div className="stars-large"></div>
          </div>
          
          {/* Noise texture overlay */}
          <div className="noise-texture"></div>
          
          <BackgroundGradient />
          <div className="relative z-10">
              {children} 
          </div>
      </main>
    )
}

export default LandingLayout

export const metadata = {
  title: 'ChainX - Automate Your Workflows',
  description: 'Build powerful workflows incredibly fast with our AI-driven automation platform.',
};