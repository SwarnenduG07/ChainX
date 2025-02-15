export function Testimonials() {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">What People Say</h2>
        <p className="text-gray-400">Trusted by developers worldwide</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm">
            <p className="text-gray-300 mb-4">"This tool has revolutionized our development workflow. Couldn't be happier!"</p>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-600" />
              <div className="ml-3">
                <h4 className="text-white font-medium">John Doe</h4>
                <p className="text-gray-400 text-sm">Senior Developer</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
