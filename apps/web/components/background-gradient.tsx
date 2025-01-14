export function BackgroundGradient() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden">
      {/* Primary Gradient Layer */}
      <div className="absolute h-full w-1/2 bg-gradient-to-r from-indigo-700 via-purple-800 to-fuchsia-700 opacity-80 animate-pulse-slow" />
      
      {/* Secondary Gradient Layer */}
      <div className="absolute right-0 h-full w-1/2 bg-gradient-to-l from-rose-600 via-violet-800 to-indigo-700 opacity-80 animate-pulse-slow" />
      
      {/* Radial Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(94,23,235,0.4)_0%,rgba(0,0,0,0.9)_100%)]" />
      
      {/* Animated Orbs */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-purple-600/30 blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl animate-float-delayed" />
      
      {/* Grain Effect */}
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj4NCjxmaWx0ZXIgaWQ9Im5vaXNlIiB4PSIwIiB5PSIwIj4NCjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjY1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+DQo8ZmVCbGVuZCBtb2RlPSJzY3JlZW4iLz4NCjwvZmlsdGVyPg0KPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuNCIvPg0KPC9zdmc+')]" />
      
      {/* Final Blur Layer */}
      <div className="absolute inset-0 backdrop-blur-[100px]" />
    </div>
  );
}
