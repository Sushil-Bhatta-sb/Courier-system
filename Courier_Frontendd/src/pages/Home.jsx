export default function Home() {
  return (
    <div className="min-h-[80vh]  from-blue-900 via-indigo-900 to-purple-900 text-white flex items-center">
      <div className="max-w-6xl mx-auto px-10 grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT CONTENT */}
        <div>
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Courier <span className="text-yellow-400">Management</span> System
          </h1>

          <p className="text-lg text-gray-200 mb-8">
            Delivering parcels faster, safer, and smarter with real-time tracking,
            automated costing, and seamless management.
          </p>

          <div className="flex gap-4">
           
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="hidden md:block">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
            <h3 className="text-xl font-semibold mb-4">Why Choose Us?</h3>

            <ul className="space-y-3 text-blue-400">
              <li>🚚 Fast & reliable delivery</li>
              <li>📍 Live shipment tracking</li>
              <li>💳 Online payment support</li>
              <li>📦 Smart cost calculation</li>
              <li>🔐 Secure data management</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
