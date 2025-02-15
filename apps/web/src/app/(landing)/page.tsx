import { CallToAction } from "@/components/call-to-action";
import { Hero } from "@/components/hero";
import { HeroVideo } from "@/components/hero-video";
import { LandingFetures } from "@/components/landing-fetures";
import { LandingNavBar } from "@/components/landing-navbar";
import { Testimonials } from "@/components/testimonials";

export default function Home(): JSX.Element {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <LandingNavBar />
        <div className="space-y-24 pb-24">
          <Hero />
          <HeroVideo />
          <LandingFetures />
          <Testimonials />
          <CallToAction />
        </div>
      </div>
      <div className="absolute inset-0 bg-[url('/')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
    </div>
  );
}
