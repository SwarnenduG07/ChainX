import { BackgroundGradient } from "@/components/background-gradient"

function LandingLayout({children}: {children: React.ReactNode}):JSX.Element {
    return (
      <main className="min-h-screen overflow-hidden ">
          <BackgroundGradient />
          <div className="relative">
              {children} 
          </div>
      </main>
    )
}
export default LandingLayout