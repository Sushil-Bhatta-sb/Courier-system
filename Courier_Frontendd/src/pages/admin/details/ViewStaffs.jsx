import { useEffect, useState } from "react";
import API_URL from '../../apiConfig';
export default function ViewStaffs() {
  const [staffs, setStaffs] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/get_staff/`)
      .then(res => res.json())
      .then(data => setStaffs(data));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h2 className="text-3xl font-extrabold text-slate-900 mb-8">Service Staff</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {staffs.map(s => (
          <div key={s.id} className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">👤</div>
            <h3 className="font-bold text-lg text-slate-800">{s.name}</h3>
            <p className="text-indigo-600 text-sm font-medium">{s.area}</p>
            <p className="text-slate-500 text-xs mt-1">{s.phone}</p>
            <div className={`mt-4 inline-block px-3 py-1 rounded-full text-xs font-bold ${s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
              {s.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}