import Hero from "@/components/hero";
import { HeroVideo } from "@/components/hero-video";
import { LandingFetures } from "@/components/landing-fetures";
import { LandingNavBar } from "@/components/landing-navbar";




export default function Home():JSX.Element {
  return (
    <div className="pb-48">
      <LandingNavBar />
       <Hero />
       <HeroVideo />
       <LandingFetures />
    </div>
  );
}
