import { useEffect, useState } from "react";

export default function ViewCustomers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/get_customers/")
      .then(res => res.json())
      .then(data => setCustomers(data));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-8 border-b pb-4">Customer Directory</h2>
        <div className="grid gap-4">
          {customers.map(c => (
            <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-indigo-600">{c.name}</h3>
                  <p className="text-slate-500 text-sm mt-1">{c.address}</p>
                </div>
                <div className="text-right text-sm text-slate-600">
                  <p className="font-medium">📞 {c.phone}</p>
                  <p>✉️ {c.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}