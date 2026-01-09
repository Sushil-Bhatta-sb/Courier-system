import { useState } from "react";

export default function AddCustomer() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [msg, setMsg] = useState("");

  const addCustomer = () => {
    fetch("http://127.0.0.1:8000/api/add_customer/", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ name, phone, email, address })
    })
    .then(res => res.json())
    .then(data => setMsg(data.message || data.error));
  };

  return (
    <div>
      <h2>Add Customer</h2>

      <input placeholder="Name" onChange={e => setName(e.target.value)} /><br/>
      <input placeholder="Phone" onChange={e => setPhone(e.target.value)} /><br/>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} /><br/>
      <input placeholder="Address" onChange={e => setAddress(e.target.value)} /><br/><br/>

      <button onClick={addCustomer}>Submit</button>

      {msg && <p>{msg}</p>}
    </div>
  );
}
