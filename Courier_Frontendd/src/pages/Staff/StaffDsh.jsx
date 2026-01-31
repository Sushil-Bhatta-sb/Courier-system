import { useEffect, useState } from "react";
import ViewShipment from "./ViewShipment"; 

export default function StaffDashboard() {
  const [shipments, setShipments] = useState([]);
  const loggedInStaffId = 1; 
  const fetchData = () => {
    fetch("http://127.0.0.1:8000/api/get_shipments/")
      .then(res => res.json())
      .then(data => setShipments(data));
  };

  useEffect(() => { fetchData(); }, []);
  const handleClaim = (shipmentId) => {
    fetch("http://127.0.0.1:8000/api/claim_shipment/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        shipment_id: shipmentId, 
        staff_id: loggedInStaffId 
      }),
    })
    .then(res => res.json())
    .then(() => {
      fetchData();
    });
  };
  const availableQueue = shipments.filter(s => s.staff_id === null);
  const myTasks = shipments.filter(s => s.staff_id === loggedInStaffId);
  
  const deliveredCount = myTasks.filter(s => s.status === "delivered").length;

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Operations Hub</h1>
          <p className="text-slate-500">Manage pickups and final deliveries</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-slate-200">
          <span className="text-sm text-slate-500 block">Total Delivered</span>
          <span className="text-2xl font-bold text-emerald-600">{deliveredCount}</span>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-10">
        <section>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            Available for Pickup
          </h2>
          {availableQueue.map(s => (
            <div key={s.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 mb-4 hover:border-blue-300 transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">From: {s.pickup}</p>
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
          {availableQueue.length === 0 && <p className="text-slate-400 italic">No new parcels in queue...</p>}
        </section>
        <section>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
            My Active Shipments
          </h2>
          <div className="space-y-4">
            {myTasks.map(s => (
              <ViewShipment 
                key={s.id} 
                shipment={s} 
                onUpdate={fetchData} 
              />
            ))}
            {myTasks.length === 0 && <p className="text-slate-400 italic">You haven't accepted any parcels yet.</p>}
          </div>
        </section>

      </div>
    </div>
  );
}