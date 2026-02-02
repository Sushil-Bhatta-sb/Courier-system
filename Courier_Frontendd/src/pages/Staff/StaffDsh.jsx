import { useEffect, useState } from "react";
import ViewShipment from "./ViewShipment"; 

export default function StaffDsh() {
  const [shipments, setShipments] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const loggedInStaffId = 1;
  const fetchData = () => {
    fetch("http://127.0.0.1:8000/api/get_shipments/")
      .then((res) => res.json())
      .then((data) => setShipments(data))
      .catch((err) => console.error("Error fetching shipments:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleClaim = (shipmentId) => {
    fetch("http://127.0.0.1:8000/api/claim_shipment/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shipment_id: shipmentId,
        staff_id: loggedInStaffId,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        fetchData();
      })
      .catch((err) => console.error("Error claiming shipment:", err));
  };
  const availableQueue = shipments.filter((s) => s.staff_id === null);
  const myTotalTasks = shipments.filter((s) => s.staff_id === loggedInStaffId);
  const activeTasks = myTotalTasks.filter((s) => s.status !== "delivered");
  const historyTasks = myTotalTasks.filter((s) => s.status === "delivered");

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Operations Hub</h1>
          <p className="text-slate-500">Manage pickups and final deliveries</p>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className={`px-6 py-3 rounded-xl shadow-sm border transition-all text-left ${
            showHistory
              ? "bg-emerald-600 border-emerald-600 text-white"
              : "bg-white border-slate-200"
          }`}
        >
          <span className={`text-sm block ${showHistory ? "text-emerald-100" : "text-slate-500"}`}>
            {showHistory ? "← Back to Dashboard" : "Total Delivered"}
          </span>
          <span className={`text-2xl font-bold ${showHistory ? "text-white" : "text-emerald-600"}`}>
            {historyTasks.length}
          </span>
        </button>
      </div>

      {!showHistory ? (
        <div className="grid lg:grid-cols-2 gap-10">
          <section>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              Available for Pickup
            </h2>
            {availableQueue.map((s) => (
              <div key={s.id} className="bg-white p-5 rounded-xl border border-slate-200 mb-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-slate-700">From: {s.pickup}</p>
                    <p className="text-sm text-slate-500">To: {s.delivery}</p>
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded">
                    {s.weight} kg
                  </span>
                </div>
                <button
                  onClick={() => handleClaim(s.id)}
                  className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Accept Task
                </button>
              </div>
            ))}
            {availableQueue.length === 0 && (
              <p className="text-slate-400 italic">No new parcels in queue...</p>
            )}
          </section>
          <section>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              My Active Tasks ({activeTasks.length})
            </h2>
            <div className="space-y-4">
              {activeTasks.map((s) => (
                <ViewShipment key={s.id} shipment={s} onUpdate={fetchData} />
              ))}
              {activeTasks.length === 0 && (
                <div className="bg-white p-10 rounded-xl border-2 border-dashed border-slate-200 text-center">
                  <p className="text-slate-400">No active tasks. Accept a shipment to start.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      ) : (
        <section className="animate-in fade-in duration-500">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
            Delivery History
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {historyTasks.map((s) => (
              <ViewShipment key={s.id} shipment={s} onUpdate={fetchData} />
            ))}
          </div>
          {historyTasks.length === 0 && (
            <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
              <p className="text-slate-400">Your history is currently empty.</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}