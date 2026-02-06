import { useEffect, useState } from "react";

export default function ViewModes() {
  const [modes, setModes] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/get_mode/")
      .then(res => res.json())
      .then(data => setModes(data));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h2 className="text-3xl font-extrabold text-slate-900 mb-8 text-center">Transport Modes</h2>
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {modes.map(m => (
          <div key={m.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center text-center hover:border-indigo-300 transition-colors">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4 text-xl">🚚</div>
            <h3 className="text-xl font-bold text-slate-800">{m.name}</h3>
            <div className="mt-4 px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
              × {m.multiplier} Multiplier
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}