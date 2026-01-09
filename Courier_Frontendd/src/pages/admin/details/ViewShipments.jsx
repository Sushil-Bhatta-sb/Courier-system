import { useEffect, useState } from "react";

export default function ViewShipments() {
  const [shipments, setShipments] = useState([]);
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/get_shipments/")
      .then(res => res.json())
      .then(data => setShipments(data));
  },[]);
  
  return (
    <div style={{ padding: "25px" }}>
      <h2>Shipment Details</h2>

      {shipments.length === 0 && <p>No shipments found</p>}

      {shipments.map(s => (
        <div key={s.id} style={card}>
          <p><b>Pickup:</b> {s.pickup}</p>
          <p><b>Delivery:</b> {s.delivery}</p>
          <p><b>Weight:</b> {s.weight} kg</p>
          <p><b>Cost:</b> Rs. {s.cost}</p>
          <p><b>Mode:</b> {s.mode}</p>
          <p><b>Status:</b> {s.status}</p>
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
