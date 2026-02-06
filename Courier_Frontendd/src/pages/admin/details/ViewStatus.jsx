import { useEffect, useState } from "react";

export default function ViewStatus() {
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/get_status/")
      .then(res => res.json())
      .then(data => setStatuses(data));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-8 text-center">Tracking Statuses</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {statuses.map((s, index) => (
            <div key={s.id} className={`p-4 flex items-center gap-4 ${index !== statuses.length - 1 ? 'border-b border-slate-100' : ''}`}>
              <span className="shrink-0 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                {index + 1}
              </span>
              <p className="font-semibold text-slate-700 uppercase tracking-wide">{s.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}