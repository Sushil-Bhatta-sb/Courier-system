import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // This calls Django's built-in auth or a custom endpoint
    const response = await fetch("https://courier-system-kf4b.onrender.com/api/logins/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(creds),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("isAdmin", "true"); // A simple way to "remember" login
      navigate("/admin");
    } else {
      setError("Invalid Admin Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-[#1e293b] flex items-center justify-center p-6">
      <div className="bg-[#334155]/50 border border-slate-700 p-10 rounded-3xl shadow-2xl w-full max-w-md backdrop-blur-sm">
        <h2 className="text-3xl font-black text-white mb-2">Security <span className="text-slate-500">Gate</span></h2>
        <p className="text-slate-400 text-sm mb-8">Authorization required for Archive Access.</p>
        
        {error && <p className="text-rose-400 text-xs mb-4 font-bold uppercase">{error}</p>}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <input 
            type="text" 
            placeholder="Username"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
            onChange={(e) => setCreds({...creds, username: e.target.value})}
          />
          <input 
            type="password" 
            placeholder="Password"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
            onChange={(e) => setCreds({...creds, password: e.target.value})}
          />
          <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-indigo-500/20">
            Verify Identity
          </button>
        </form>
      </div>
    </div>
  );
}