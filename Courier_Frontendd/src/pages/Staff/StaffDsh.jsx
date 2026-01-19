import { Link, Outlet } from "react-router-dom";

export default function StaffDsh() {
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Staff Dashboard
        </h2>

        <div className="mb-6">
          <Link
            to="shipments"
            className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            View Shipments
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <Outlet />
        </div>

      </div>
    </div>
  );
}
