import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from '../apiConfig';
export default function AddStaff() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('');
  const [status, setStatus] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const addStaff = () => {
    fetch(`${API_URL}/add_staff/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, area, status })
    })
    .then(res => res.json())
    .then(data => setMsg(data.message || data.error))
    .catch(err => setMsg("Failed to add staff"));
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <button
          onClick={() => navigate(-1)}
               className="text-slate-400 hover:text-indigo-600 text-sm font-bold transition-colors"
                  >
               ← 
       </button>
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
            Staff Registration
        </h2>

        <div className="space-y-4">
          <input placeholder="Full Name" className={inputClass} value={name} onChange={e => setName(e.target.value)} />
          <input placeholder="Phone" className={inputClass} value={phone} onChange={e => setPhone(e.target.value)} />
          <input placeholder="Assigned Area" className={inputClass} value={area} onChange={e => setArea(e.target.value)} />
          <input placeholder="Status (Available/Busy)" className={inputClass} value={status} onChange={e => setStatus(e.target.value)} />

          <button onClick={addStaff} className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-100 mt-2">
            Register Staff
          </button>
        </div>

        {msg && <p className="mt-4 text-center text-emerald-600 font-bold">{msg}</p>}
      </div>
    </div>
  );
}