import { useEffect, useState } from "react";

export default function ViewShipments() {
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/get_shipments/")
      .then((res) => res.json())
      .then((data) => setShipments(data));
  }, []);

  // Helper to color-code the status badges
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered": return "bg-green-100 text-green-700 border-green-200";
      case "in transit": return "bg-blue-100 text-blue-700 border-blue-200";
      case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">Shipment Log</h2>
            <p className="text-slate-500 mt-1">Manage and track all outgoing courier packages.</p>
          </div>
          <div className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm">
            Total: {shipments.length}
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800 text-slate-200 uppercase text-xs tracking-widest font-semibold">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Route (From → To)</th>
                  <th className="px-6 py-4">Method & Weight</th>
                  <th className="px-6 py-4">Total Cost</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {shipments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400 italic">
                      No shipments found in the database.
                    </td>
                  </tr>
                ) : (
                  shipments.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 font-mono text-sm text-slate-400">#{s.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-slate-900 font-medium">{s.pickup}</span>
                          <span className="text-indigo-500 text-xs font-bold">→ {s.delivery}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <span className="font-semibold text-slate-800">{s.mode}</span>
                        <br />
                        {s.weight} kg
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        Rs. {Number(s.cost).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(s.status)}`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}