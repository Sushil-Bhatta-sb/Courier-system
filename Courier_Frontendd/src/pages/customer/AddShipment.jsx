import { useState, useEffect } from "react";
import API_URL from "../apiConfig";

export default function AddShipment() {
  const [modes, setModes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [details, setDetails] = useState(null);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customer_id: "",
    pickup_address: "",
    delivery_address: "",
    weight: "",
    mode_id: "",
    status_id: ""
  });

  useEffect(() => {
    fetch(`${API_URL}/get_mode/`)
      .then(res => res.json())
      .then(data => setModes(data))
      .catch(err => console.error("Mode fetch error:", err));

    fetch(`${API_URL}/get_status/`)
      .then(res => res.json())
      .then(data => setStatuses(data))
      .catch(err => console.error("Status fetch error:", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addShipment = async () => {
    // Reset states
    setMsg("");
    setIsError(false);
    setDetails(null);

    // 1. Client-side Validation: Check if any value is empty or just whitespace
    const isFormIncomplete = Object.values(form).some(val => !val.toString().trim());
    
    if (isFormIncomplete) {
      setMsg("⚠️ All fields are required.");
      setIsError(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/add_shipment/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.error || "Something went wrong");
        setIsError(true);
        return;
      }

      setMsg(data.message);
      setDetails(data);
      setForm({ customer_id: "", pickup_address: "", delivery_address: "", weight: "", mode_id: "", status_id: "" });

    } catch (err) {
      setMsg("Connection failed. Check your server.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-slate-50 disabled:opacity-50";

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-lg border border-slate-100">

        <h2 className="text-3xl font-black text-slate-800 mb-6 tracking-tight">
          Book Shipment
        </h2>

        <div className="space-y-4">
          <input
            name="customer_id"
            value={form.customer_id}
            placeholder="Customer ID"
            onChange={handleChange}
            className={inputClass}
            disabled={loading}
          />

          <input
            name="pickup_address"
            value={form.pickup_address}
            placeholder="Pickup Address"
            onChange={handleChange}
            className={inputClass}
            disabled={loading}
          />

          <input
            name="delivery_address"
            value={form.delivery_address}
            placeholder="Delivery Address"
            onChange={handleChange}
            className={inputClass}
            disabled={loading}
          />

          <input
            name="weight"
            value={form.weight}
            placeholder="Weight (KG)"
            type="number"
            onChange={handleChange}
            className={inputClass}
            disabled={loading}
          />

          <div className="grid grid-cols-2 gap-4">
            <select name="mode_id" value={form.mode_id} onChange={handleChange} className={inputClass} disabled={loading}>
              <option value="">Select Mode</option>
              {modes.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>

            <select name="status_id" value={form.status_id} onChange={handleChange} className={inputClass} disabled={loading}>
              <option value="">Select Status</option>
              {statuses
                .filter((s) => s.name === "booked")
                .map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
            </select>
          </div>

          <button
            onClick={addShipment}
            disabled={loading}
            className={`w-full text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] mt-4 ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"
            }`}
          >
            {loading ? "Processing..." : "Confirm Booking"}
          </button>
        </div>

        {msg && (
          <p className={`mt-4 text-center font-bold py-2 rounded-lg border ${
            isError ? "text-red-600 bg-red-50 border-red-200" : "text-green-600 bg-green-50 border-green-200"
          }`}>
            {msg}
          </p>
        )}

        {/* Receipt */}
        {details && (
          <div className="mt-8 p-6 bg-slate-900 text-white rounded-2xl shadow-inner animate-in fade-in slide-in-from-top-4 duration-500">
            <h3 className="text-lg font-bold mb-4 border-b border-slate-700 pb-2">
              Shipment Receipt
            </h3>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between">
                <span className="text-slate-400">Shipment ID:</span>
                <span className="font-bold text-green-400">#{details.shipment_id}</span>
              </p>
              <p className="flex justify-between text-lg font-black mt-4 pt-4 border-t border-slate-700">
                <span>Total Cost:</span>
                <span className="text-blue-400">Rs. {details.cost}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}