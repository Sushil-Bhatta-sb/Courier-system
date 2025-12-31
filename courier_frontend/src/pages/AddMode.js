import { useState } from "react";

export default function AddModePage() {
  const [name, setName] = useState("");
  const [multiplier, setMultiplier] = useState("");
  const [msg, setMsg] = useState("");

  const addMode = () => {
    fetch("http://127.0.0.1:8000/api/add_mode/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode_name: name, cost_multiplier: multiplier })
    })
    .then(res => res.json())
    .then(data => setMsg(data.message || data.error))
    .catch(() => setMsg("Error sending request"));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add Mode of Transport</h2>

      <input 
        placeholder="Mode Name (e.g., Road, Air)" 
        value={name}
        onChange={e => setName(e.target.value)}
      /><br/><br/>

      <input 
        placeholder="Cost Multiplier (e.g., 1.5)"
        type="number"
        step="0.1"
        value={multiplier}
        onChange={e => setMultiplier(e.target.value)}
      /><br/><br/>

      <button onClick={addMode}>Add Mode</button>

      {msg && <p style={{ color: "green" }}>{msg}</p>}
    </div>
  );
}
