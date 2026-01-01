import { useState, useEffect } from "react";

export default function AddShipment() {
  const [modes, setModes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [details, setDetails] = useState(null);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({});

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/get_mode/")
      .then((res) => res.json())
      .then((data) => setModes(data));

    fetch("http://127.0.0.1:8000/api/get_status/")
      .then((res) => res.json())
      .then((data) => setStatuses(data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addShipment = () => {
    fetch("http://127.0.0.1:8000/api/add_shipment/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        setMsg(data.message || data.error);
        setDetails(data);
      });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Book Shipment</h2>

      <input name="customer_id" placeholder="Customer ID" onChange={handleChange} /><br /><br />
      <input name="pickup_address" placeholder="Pickup Address" onChange={handleChange} /><br /><br />
      <input name="delivery_address" placeholder="Delivery Address" onChange={handleChange} /><br /><br />
      <input name="weight" placeholder="Weight" type="number" onChange={handleChange} /><br /><br />

      <select name="mode_id" onChange={handleChange}>
        <option hidden>Select Mode</option>
        {modes.map((m) => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
      </select><br /><br />

      <select name="status_id" onChange={handleChange}>
        <option hidden>Select Status</option>
        {statuses.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select><br /><br />

      <button onClick={addShipment}>Confirm Booking</button>

      {msg && <p style={{ color: "green" }}>{msg}</p>}

      {details && details.cost && (
        <div style={{ marginTop: "20px", border: "1px solid gray", padding: "15px" }}>
          <h3>Shipment Details</h3>
          <p><strong>Pickup:</strong> {details.pickup_address}</p>
          <p><strong>Delivery:</strong> {details.delivery_address}</p>
          <p><strong>Weight:</strong> {details.weight} kg</p>
          <p><strong>Total Cost:</strong> Rs. {details.cost}</p>
        </div>
      )}
    </div>
  );
}
