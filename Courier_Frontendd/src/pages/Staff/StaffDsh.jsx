import API_URL from "../apiConfig";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import ViewShipment from "./ViewShipment";

export default function StaffDsh() {
  const [shipments, setShipments] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const navigate = useNavigate();
  const loggedInStaffId = Number(sessionStorage.getItem("staffId"));
  const staffName = sessionStorage.getItem("staffName");

  useEffect(() => {
    if (!loggedInStaffId) {
      navigate("/staff/login");
      return;
    }
    fetchData();
  }, [loggedInStaffId, navigate]);

  const fetchData = () => {
    fetch(`${API_URL}/get_shipments/`)
      .then((res) => res.json())
      .then((data) => setShipments(data))
      .catch(() => toast.error("Failed to load shipments"));
  };
  const handleLogout = () => {
    sessionStorage.clear(); 
        toast.success("Logged out successfully");
    navigate("/staff/login");
  };

  const handleClaim = (shipmentId) => {
    const claimPromise = fetch(`${API_URL}/claim_shipment/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shipment_id: shipmentId,
        staff_id: loggedInStaffId,
      }),
    });

    toast.promise(claimPromise, {
      loading: "Accepting task...",
      success: "Shipment assigned!",
      error: "Assignment failed",
    });

    claimPromise
      .then(() => fetchData())
      .catch(() => toast.error("Server error"));
  };
  const availableQueue = shipments.filter((s) => s.staff_id === null);
  const myTotalTasks = shipments.filter((s) => Number(s.staff_id) === loggedInStaffId);
  const activeTasks = myTotalTasks.filter((s) => s.status !== "Delivered");
  const historyTasks = myTotalTasks.filter((s) => s.status === "Delivered");

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
                          <button
                        onClick={() => navigate(-1)}
                        className="text-slate-400 hover:text-indigo-600 text-sm font-bold transition-colors"
                    >
                        ← Back
                    </button>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Staff Operations</h1>
          <p className="text-slate-500">Welcome back, {staffName || "Staff"}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`px-6 py-2 rounded-xl border shadow-sm transition ${
              showHistory ? "bg-emerald-600 text-white" : "bg-white text-slate-700"
            }`}
          >
            {showHistory ? "View Active" : `History (${historyTasks.length})`}
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-2 rounded-xl border border-red-200 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </div>

      {!showHistory ? (
        <div className="grid lg:grid-cols-2 gap-10">
          <section>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              Available Shipments
            </h2>
            {availableQueue.map((s) => (
              <div key={s.id} className="bg-white p-5 rounded-xl border mb-4 shadow-sm">
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold">From: {s.pickup_address}</p>
                    <p className="text-sm text-gray-500">To: {s.delivery_address || "N/A"}</p>
                  </div>
                  <span className="bg-gray-100 px-2 py-1 rounded text-sm">{s.weight}kg</span>
                </div>
                <button
                  onClick={() => handleClaim(s.id)}
                  className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Accept Shipment
                </button>
              </div>
            ))}
            {availableQueue.length === 0 && <p className="italic text-gray-400">No shipments available</p>}
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
                <div className="bg-white p-10 rounded-xl border-dashed border-2 text-center text-gray-400">
                  No active shipments
                </div>
              )}
            </div>
          </section>
        </div>
      ) : (
        <section>
          <h2 className="text-xl font-bold mb-6">Delivery History</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {historyTasks.map((s) => (
              <ViewShipment key={s.id} shipment={s} onUpdate={fetchData} />
            ))}
          </div>
          {historyTasks.length === 0 && (
            <div className="bg-white p-12 rounded-xl border text-center text-gray-400">
              No completed deliveries yet
            </div>
          )}
        </section>
      )}
    </div>
  );
}