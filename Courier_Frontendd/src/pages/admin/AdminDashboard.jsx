import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      
      <h2 className="text-3xl font-bold text-center mb-10 text-indigo-700">
        Admin Control Panel
      </h2>

      <div className="max-w-5xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-8">
        <Link
          to="/admin/AddStaff"
          className="bg-white shadow-lg rounded-xl p-6 text-center hover:scale-105 transition"
        >
          <div className="text-4xl mb-3">👨‍💼</div>
          <h3 className="text-lg font-semibold">Manage Staff</h3>
          <p className="text-sm text-gray-500 mt-2">
            Add and update delivery staff
          </p>
        </Link>

        <Link
          to="/admin/AddMode"
          className="bg-white shadow-lg rounded-xl p-6 text-center hover:scale-105 transition"
        >
          <div className="text-4xl mb-3">🚚</div>
          <h3 className="text-lg font-semibold">Transport Modes</h3>
          <p className="text-sm text-gray-500 mt-2">
            Manage delivery methods
          </p>
        </Link>

        <Link
          to="/admin/AddStatus"
          className="bg-white shadow-lg rounded-xl p-6 text-center hover:scale-105 transition"
        >
          <div className="text-4xl mb-3">📦</div>
          <h3 className="text-lg font-semibold">Shipment Status</h3>
          <p className="text-sm text-gray-500 mt-2">
            Control shipment states
          </p>
        </Link>

        <Link
          to="/details"
          className="bg-indigo-600 text-white shadow-lg rounded-xl p-6 text-center hover:bg-indigo-700 transition"
        >
          <div className="text-4xl mb-3">📊</div>
          <h3 className="text-lg font-semibold">View System Details</h3>
          <p className="text-sm mt-2">
            Customers, shipments, staff & more
          </p>
        </Link>

      </div>
    </div>
  );
}
