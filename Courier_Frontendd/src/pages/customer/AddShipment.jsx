import { useState, useEffect } from "react";
import API_URL from '../apiConfig';
export default function AddShipment() {
  const [modes, setModes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [details, setDetails] = useState(null);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/get_mode/`).then(res => res.json()).then(data => setModes(data));
    fetch(`${API_URL}/get_status/`).then(res => res.json()).then(data => setStatuses(data));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addShipment = () => {
    fetch(`${API_URL}/add_shipment/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    .then(res => res.json())
    .then(data => {
      setMsg(data.message || data.error);
      setDetails(data);
    });
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50";

  return (
    
    <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-lg border border-slate-100">
        <h2 className="text-3xl font-black text-slate-800 mb-6 tracking-tight">Book Shipment</h2>
        
        <div className="space-y-4">
          <input name="customer_id" placeholder="Customer ID" onChange={handleChange} className={inputClass} />
          <input name="pickup_address" placeholder="Pickup Address" onChange={handleChange} className={inputClass} />
          <input name="delivery_address" placeholder="Delivery Address" onChange={handleChange} className={inputClass} />
          <input name="weight" placeholder="Weight (KG)" type="number" onChange={handleChange} className={inputClass} />

          <div className="grid grid-cols-2 gap-4">
            <select name="mode_id" onChange={handleChange} className={inputClass}>
              <option hidden>Select Mode</option>
              {modes.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>

            <select name="status_id" onChange={handleChange} className={inputClass}>
              <option hidden>Select Status</option>
              {statuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <button onClick={addShipment} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-[0.98] mt-4">
            Confirm Booking
          </button>
        </div>

        {msg && <p className="mt-4 text-center font-bold text-green-600 bg-green-50 py-2 rounded-lg">{msg}</p>}

        {details && details.cost && (
          <div className="mt-8 p-6 bg-slate-900 text-white rounded-2xl shadow-inner relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>
             </div>
             <h3 className="text-lg font-bold mb-4 border-b border-slate-700 pb-2">Receipt Details</h3>
             <div className="space-y-2 text-sm">
                <p className="flex justify-between"><span className="text-slate-400">Pickup:</span> <span>{details.pickup_address}</span></p>
                <p className="flex justify-between"><span className="text-slate-400">Delivery:</span> <span>{details.delivery_address}</span></p>
                <p className="flex justify-between"><span className="text-slate-400">Weight:</span> <span>{details.weight} kg</span></p>
                <p className="flex justify-between text-lg font-black mt-4 pt-4 border-t border-slate-700"><span>Total Cost:</span> <span className="text-blue-400">Rs. {details.cost}</span></p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}