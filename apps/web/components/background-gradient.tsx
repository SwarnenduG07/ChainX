export function BackgroundGradient() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full">
      <div className="absolute h-full w-1/3 bg-gradient-to-r from-purple-600 to-transparent animate-pulse-slow" />
      <div className="absolute right-0 h-full w-1/3 bg-gradient-to-l from-purple-600 to-transparent animate-pulse-slow" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.95)_50%)]" />
      <div className="absolute inset-0 backdrop-blur-[100px]" />
    </div>
  )
}
