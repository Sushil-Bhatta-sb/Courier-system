import { Link } from "react-router-dom";
import React from "react";

export default function DetailsDsh() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/admin/details/ViewCostumers"
          className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition" >
          <h3 className="text-xl font-semibold text-indigo-600 mb-2">
            Customers</h3>
          <p className="text-gray-600">
            View and manage registered customers.
          </p>
        </Link>
        <Link
          to="/admin/details/ViewShipments"
          className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
          <h3 className="text-xl font-semibold text-indigo-600 mb-2">
            Shipments
          </h3>
          <p className="text-gray-600">
            Track all shipment details and status.
          </p>
        </Link>

        <Link
          to="/admin/details/ViewStaffs"
          className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
          <h3 className="text-xl font-semibold text-indigo-600 mb-2">
            Staff
          </h3>
          <p className="text-gray-600">
            View courier staff and assignments.
          </p>
        </Link>

        <Link
          to="/admin/details/ViewModes"
          className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition"
        >
          <h3 className="text-xl font-semibold text-indigo-600 mb-2">
            Transport Modes
          </h3>
          <p className="text-gray-600">
            Manage delivery transport methods.
          </p>
        </Link>

        <Link
          to="/admin/details/ViewStatus"
          className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition"
        >
          <h3 className="text-xl font-semibold text-indigo-600 mb-2">
            Shipment Status
          </h3>
          <p className="text-gray-600">
            View and update shipment status.
          </p>
        </Link>

      </div>
    </div>
  );
}
