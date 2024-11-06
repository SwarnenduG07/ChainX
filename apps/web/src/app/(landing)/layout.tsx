
function LandingLayout({children}: {children: React.ReactNode}):JSX.Element {
    return (
      <main >
          <div className=" bg-black ">
              {children} 
          </div>
      </main>
    )
}
export default LandingLayout