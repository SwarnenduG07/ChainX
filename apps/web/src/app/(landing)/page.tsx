import Hero from "@/components/hero";
import { HeroVideo } from "@/components/hero-video";
import { LandingFetures } from "@/components/landing-fetures";
import { NavBar } from "@/components/nav-bar";




export default function Home():JSX.Element {
  return (
    <div className="pb-48">
       <NavBar/> 
       <Hero />
       <HeroVideo />
       <LandingFetures />
    </div>
  );
}
