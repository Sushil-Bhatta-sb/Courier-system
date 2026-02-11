import { useState } from "react";
import API_URL from '../apiConfig';
export default function AddCustomer() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [msg, setMsg] = useState("");

  const addCustomer = () => {
    fetch(`${API_URL}/add_customer/`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ name, phone, email, address })
    })
    .then(res => res.json())
    .then(data => setMsg(data.message || data.error));
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none mb-4 transition-all";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        <h2 className="text-2xl font-black text-slate-800 mb-6 text-center">New Customer Profile</h2>
        
        <input placeholder="Full Name" className={inputClass} onChange={e => setName(e.target.value)} />
        <input placeholder="Phone Number" className={inputClass} onChange={e => setPhone(e.target.value)} />
        <input placeholder="Email Address" className={inputClass} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Permanent Address" className={inputClass} onChange={e => setAddress(e.target.value)} />

        <button onClick={addCustomer} className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 mt-2">
          Add Customer
        </button>

        {msg && <p className="mt-4 text-center text-sm font-semibold text-indigo-600">{msg}</p>}
      </div>
    </div>
  );
}