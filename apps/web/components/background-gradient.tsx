export function BackgroundGradient() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden bg-[#08051A]">
      {/* Deep Purple Base Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(91,33,182,0.03),transparent_60%)]" />
      
      {/* Subtle Color Variations */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-purple-900/5 to-transparent" />
      </div>
      
      {/* Vignette Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}
