import { useEffect, useState } from "react";

export default function ViewModes() {
  const [modes, setModes] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/get_mode/")
      .then(res => res.json())
      .then(data => setModes(data));
  }, []);

  return (
    <div style={{ padding: "25px" }}>
      <h2>Transport Modes</h2>

      {modes.map(m => (
        <div key={m.id} style={card}>
          <p><b>Name:</b> {m.name}</p>
          <p><b>Cost Multiplier:</b> {m.multiplier}</p>
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
