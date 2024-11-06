
function LandingLayout({children}: {children: React.ReactNode}) {
    return (
      <main >
          <div className=" bg-black ">
              {children} 
          </div>
      </main>
    )
}
export default LandingLayout