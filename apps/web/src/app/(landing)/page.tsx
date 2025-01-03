import {Hero} from "@/components/hero";
import { HeroVideo } from "@/components/hero-video";
import { LandingFetures } from "@/components/landing-fetures";
import { LandingNavBar } from "@/components/landing-navbar";

export default function Home():JSX.Element {
  return (
    <div className="relative">
      <div className="relative z-10">
        <LandingNavBar />
        <Hero />
        <HeroVideo />
        <LandingFetures />
      </div>
    </div>
  );
}
