import { useEffect, useState } from "react";

export default function ViewStatus() {
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/get_status/")
      .then(res => res.json())
      .then(data => setStatuses(data));
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Status List</h2>

      {statuses.map(s => (
        <div key={s.id} style={card}>
          <p><b>Status:</b> {s.name}</p>
        </div>
      ))}
    </div>
  );
}

const card = {
  border: "1px solid #ccc",
  margin: "10px 0",
  padding: "12px",
  borderRadius: "6px"
};
