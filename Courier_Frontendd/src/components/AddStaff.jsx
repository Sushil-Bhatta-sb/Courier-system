import { useState } from "react";

export default function AddStaff() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('');
  const [status, setStatus] = useState('');
  const [msg, setMsg] = useState('');

  const addStaff = () => {
    fetch("http://127.0.0.1:8000/api/add_staff/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, area, status })
    })
      .then(res => res.json())
      .then(data => setMsg(data.message || data.error))
      .catch(err => setMsg("Failed to add staff"));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add Staff</h2>

      <input
        placeholder="Staff Name"
        value={name}
        onChange={e => setName(e.target.value)}
      /><br /><br />

      <input
        placeholder="Phone"
        value={phone}
        onChange={e => setPhone(e.target.value)}
      /><br /><br />

      <input
        placeholder="Assigned Area"
        value={area}
        onChange={e => setArea(e.target.value)}
      /><br /><br />

      <input
        placeholder="Status (Available/Busy)"
        value={status}
        onChange={e => setStatus(e.target.value)}
      /><br /><br />

      <button onClick={addStaff}>Add Staff</button>

      {msg && <p style={{ color: "green" }}>{msg}</p>}
    </div>
  );
}
