import { useState } from "react";
import API_URL from '../apiConfig';
export default function AddModePage() {
  const [name, setName] = useState("");
  const [multiplier, setMultiplier] = useState("");
  const [msg, setMsg] = useState("");

  const addMode = () => {
    fetch(`${API_URL}/add_mode/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode_name: name, cost_multiplier: multiplier })
    })
    .then(res => res.json())
    .then(data => setMsg(data.message || data.error))
    .catch(() => setMsg("Error sending request"));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm border border-slate-100">
        <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Transport Mode</h2>
        <p className="text-slate-400 text-sm mb-6">Define shipping methods and pricing scales.</p>

        <input placeholder="Mode Name (e.g., Air, Sea)" className="w-full px-4 py-3 rounded-xl border border-slate-200 mb-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Cost Multiplier (e.g. 1.5)" type="number" step="0.1" className="w-full px-4 py-3 rounded-xl border border-slate-200 mb-6 outline-none focus:ring-2 focus:ring-blue-500 transition-all" value={multiplier} onChange={e => setMultiplier(e.target.value)} />

        <button onClick={addMode} className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-black transition-all">
          Save Transport Mode
        </button>

        {msg && <p className="mt-4 text-center text-green-600 font-bold">{msg}</p>}
      </div>
    </div>
  );
}