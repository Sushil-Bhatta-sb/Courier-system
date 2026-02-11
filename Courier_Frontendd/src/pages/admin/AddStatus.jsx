import { useState } from "react";
import API_URL from '../apiConfig';
export default function AddStatus() {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  const addStatus = () => {
    fetch(`${API_URL}/add_status/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status_name: name })  
    })
    .then(res => res.json())
    .then(data => setMsg(data.msg || data.error)); 
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm border border-slate-100 text-center">
        <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">!</div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">System Status</h2>
        <p className="text-slate-400 text-sm mb-6">Create new tracking milestones for the logistics pipeline.</p>

        <input placeholder="Status Name (e.g. In Hub)" className="w-full px-4 py-3 rounded-xl border border-slate-200 mb-6 outline-none focus:ring-2 focus:ring-blue-600 transition-all text-center" value={name} onChange={e => setName(e.target.value)} />

        <button onClick={addStatus} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100">
          Add New Status
        </button>

        {msg && <p className="mt-4 text-blue-600 font-bold">{msg}</p>}
      </div>
    </div>
  );
}