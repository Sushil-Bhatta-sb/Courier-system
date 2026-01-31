import { useEffect, useState } from "react";

export default function ViewModes() {
  const [modes, setModes] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/get_mode/")
      .then(res => res.json())
      .then(data => setModes(data));
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        Transport Modes
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modes.map(m => (
          <div
            key={m.id}
            className="bg-white rounded-xl shadow-md p-5 border border-slate-200"
          >
            <p className="text-slate-700">
              <span className="font-semibold">Name:</span> {m.name}
            </p>
            <p className="text-slate-700 mt-2">
              <span className="font-semibold">Cost Multiplier:</span>{" "}
              {m.multiplier}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
