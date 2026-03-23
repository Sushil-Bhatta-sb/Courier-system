import { Link } from "react-router-dom"; // Import Link from react-router-dom

export default function Home() {
  return (
    <div
      className="min-h-screen text-white flex items-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('/courier.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-7xl mx-auto px-10 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Courier <span className="text-yellow-400">Management</span>
            <br /> System
          </h1>

          <p className="text-lg text-gray-200 mb-8 max-w-xl">
            Deliver parcels faster, safer and smarter with real-time tracking,
            automated pricing, and seamless shipment management.
          </p>

          <div className="flex gap-4">
         
            <p
              to="/customer/AddShipment"
              className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
            >
              Book Your Shipment
            </p>

      
            <Link
              to="/admin-login"
              className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-black transition"
            >
              Admin
            </Link>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
            <h3 className="text-xl font-semibold mb-4 text-yellow-300">
              Why Choose Us?
            </h3>

            <ul className="space-y-3 text-gray-200">
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