import { CallToAction } from "@/components/call-to-action";
import { Hero } from "@/components/hero";
import { HeroVideo } from "@/components/hero-video";
import { LandingFetures } from "@/components/landing-fetures";
import { LandingNavBar } from "@/components/landing-navbar";
import { Testimonials } from "@/components/testimonials";

export default function Home(): JSX.Element {
  return (
    <div className="relative min-h-screen">
      {/* Subtle gradient overlay */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/5 via-transparent to-transparent z-0"
        style={{ backgroundPosition: 'center -200px' }}
      />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <LandingNavBar />
        <div className="space-y-32 pb-32">
          <Hero />
          <HeroVideo />
          <LandingFetures />
          <Testimonials />
          <CallToAction />
        </div>
      </div>
    </div>
  );
}
