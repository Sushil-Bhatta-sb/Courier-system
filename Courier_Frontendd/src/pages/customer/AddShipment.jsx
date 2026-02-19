import { useState, useEffect } from "react";
import API_URL from "../apiConfig";

export default function AddShipment() {
  const [modes, setModes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [details, setDetails] = useState(null);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({});

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
    try {
      const res = await fetch(`${API_URL}/add_shipment/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Server Error:", data);
        setMsg(data.error || "Something went wrong");
        return;
      }

      setMsg(data.message);
      setDetails(data);

      // Reset form
      setForm({});

    } catch (err) {
      console.error("Network Error:", err);
      setMsg("Server connection failed");
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-slate-50";

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-lg border border-slate-100">

        <h2 className="text-3xl font-black text-slate-800 mb-6 tracking-tight">
          Book Shipment
        </h2>

        <div className="space-y-4">
          <input
            name="customer_id"
            placeholder="Customer ID"
            onChange={handleChange}
            className={inputClass}
          />

          <input
            name="pickup_address"
            placeholder="Pickup Address"
            onChange={handleChange}
            className={inputClass}
          />

          <input
            name="delivery_address"
            placeholder="Delivery Address"
            onChange={handleChange}
            className={inputClass}
          />

          <input
            name="weight"
            placeholder="Weight (KG)"
            type="number"
            onChange={handleChange}
            className={inputClass}
          />

          <div className="grid grid-cols-2 gap-4">
            <select name="mode_id" onChange={handleChange} className={inputClass}>
              <option hidden>Select Mode</option>
              {modes.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>

            <select name="status_id" onChange={handleChange} className={inputClass}>
              <option hidden>Select Status</option>
              {statuses
                .filter((s) => s.name === "booked")
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>
          </div>

          <button
            onClick={addShipment}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-[0.98] mt-4"
          >
            Confirm Booking
          </button>
        </div>

        {msg && (
          <p className="mt-4 text-center font-bold text-green-600 bg-green-50 py-2 rounded-lg">
            {msg}
          </p>
        )}

        {/* Receipt */}
        {details && details.shipment_id && (
          <div className="mt-8 p-6 bg-slate-900 text-white rounded-2xl shadow-inner relative overflow-hidden">

            <h3 className="text-lg font-bold mb-4 border-b border-slate-700 pb-2">
              Shipment Receipt
            </h3>

            <div className="space-y-2 text-sm">

              <p className="flex justify-between">
                <span className="text-slate-400">Shipment ID:</span>
                <span className="font-bold text-green-400">
                  #{details.shipment_id}
                </span>
              </p>

              <p className="flex justify-between">
                <span className="text-slate-400">Pickup:</span>
                <span>{details.pickup_address}</span>
              </p>

              <p className="flex justify-between">
                <span className="text-slate-400">Delivery:</span>
                <span>{details.delivery_address}</span>
              </p>

              <p className="flex justify-between">
                <span className="text-slate-400">Weight:</span>
                <span>{details.weight} kg</span>
              </p>

              <p className="flex justify-between text-lg font-black mt-4 pt-4 border-t border-slate-700">
                <span>Total Cost:</span>
                <span className="text-blue-400">
                  Rs. {details.cost}
                </span>
              </p>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
