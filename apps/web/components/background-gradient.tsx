export function BackgroundGradient() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full">
      {/* Left Gradient: Fully Purple Transition */}
      <div className="absolute h-full w-1/3 bg-gradient-to-r from-rose-600 via-purple-600 to-purple-800 animate-pulse-slow" />
      
      {/* Right Gradient: Fully Purple Transition */}
      <div className="absolute right-0 h-full w-1/3 bg-gradient-to-l from-rose-500 via-purple-700 to-fuchsia-800 animate-pulse-slow" />
      
      {/* Radial Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(128,0,128,0.7)_0%,rgba(0,0,0,0.95)_50%)]" />
      
      {/* Backdrop Blur */}
      <div className="absolute inset-0 backdrop-blur-[100px]" />
    </div>
  );
}
