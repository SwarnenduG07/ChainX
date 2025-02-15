export function CallToAction() {
  return (
    <section className="py-16">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-8 md:p-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already using our platform to build amazing things.
          </p>
          <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Start Building Now
          </button>
        </div>
      </div>
    </section>
  );
}
