import { useEffect, useState } from "react";

export default function ViewShipments() {
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/get_shipments/")
      .then(res => res.json())
      .then(data => setShipments(data));
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        Shipment Details
      </h2>

      {shipments.length === 0 && (
        <p className="text-slate-600">No shipments found</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shipments.map(s => (
          <div
            key={s.id}
            className="bg-white rounded-xl shadow-md p-5 border border-slate-200"
          >
            <p className="text-slate-700">
              <span className="font-semibold">Pickup:</span> {s.pickup}
            </p>
            <p className="text-slate-700 mt-1">
              <span className="font-semibold">Delivery:</span> {s.delivery}
            </p>
            <p className="text-slate-700 mt-1">
              <span className="font-semibold">Weight:</span> {s.weight} kg
            </p>
            <p className="text-slate-700 mt-1">
              <span className="font-semibold">Cost:</span> Rs. {s.cost}
            </p>
            <p className="text-slate-700 mt-1">
              <span className="font-semibold">Mode:</span> {s.mode}
            </p>
            <p className="text-slate-700 mt-1">
              <span className="font-semibold">Status:</span> {s.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
