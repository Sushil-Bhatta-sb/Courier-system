import { useEffect, useState } from "react";

export default function StaffDashboard() {
  const [shipments, setShipments] = useState([]);
  const currentStaffId = 1; // Temporary: replace with your logged-in staff's ID

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/get_shipments/")
      .then(res => res.json())
      .then(data => setShipments(data));
  }, []);

  const claimTask = (shipmentId) => {
    fetch("http://127.0.0.1:8000/api/claim_shipment/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shipment_id: shipmentId, staff_id: currentStaffId }),
    })
    .then(res => res.json())
    .then(() => {
      // Refresh data to show it moved to "My Tasks"
      window.location.reload(); 
    });
  };

  // Filter logic
  const unassigned = shipments.filter(s => !s.staff_id);
  const myTasks = shipments.filter(s => s.staff_id === currentStaffId);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Logistics Control Center</h1>

      <div className="grid md:grid-cols-2 gap-10">
        {/* SECTION 1: QUEUE */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-orange-600">Available Queue ({unassigned.length})</h2>
          {unassigned.map(s => (
            <div key={s.id} className="bg-white p-4 rounded-lg shadow mb-4 border-l-4 border-orange-500">
              <p><b>Pickup:</b> {s.pickup}</p>
              <button 
                onClick={() => claimTask(s.id)}
                className="mt-2 bg-orange-500 text-white px-4 py-1 rounded text-sm"
              >
                Claim Package
              </button>
            </div>
          ))}
        </section>

        {/* SECTION 2: ACTIVE TASKS */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-green-600">My Active Tasks ({myTasks.length})</h2>
          {myTasks.map(s => (
            <div key={s.id} className="bg-white p-4 rounded-lg shadow mb-4 border-l-4 border-green-500">
              <p><b>To:</b> {s.delivery}</p>
              <p className="text-sm text-gray-500">Current Status: {s.status}</p>
              {/* Here is where the Status Update buttons would live */}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}