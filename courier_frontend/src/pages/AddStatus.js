import { useState } from "react";

export default function AddStatus() {
  const [name, setName] = useState('');
  const [msg, setMsg] = useState("");

  const addStatus = () => {
    fetch("http://127.0.0.1:8000/api/add_status/", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ name })
    })
    .then(res => res.json())
    .then(data => setMsg(data.message || data.error));
  };

  return (
    <div>
      <h2>Add Status</h2>
      <input 
        placeholder="Status Name" 
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <br /><br />
      <button onClick={addStatus}>Add Status</button>
      {msg && <p>{msg}</p>}
    </div>
  ); 
}