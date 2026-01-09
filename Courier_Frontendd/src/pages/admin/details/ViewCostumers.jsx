import { useEffect, useState } from "react";

export default function ViewCostumers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/get_customers/")
      .then(res => res.json())
      .then(data => setCustomers(data));
  }, []);

  return (
    <div style={{ padding: "25px" }}>
      <h2>Customer Details</h2>

      {customers.length === 0 && <p>No customers found</p>}

      {customers.map(c => (
        <div key={c.id}
          style={{
            border: "1px solid #ccc",
            margin: "10px 0",
            padding: "12px",
            borderRadius: "6px"
          }}>
          <p><b>Name:</b> {c.name}</p>
          <p><b>Phone:</b> {c.phone}</p>
          <p><b>Email:</b> {c.email}</p>
          <p><b>Address:</b> {c.address}</p>
        </div>
      ))}
    </div>
  );
}
