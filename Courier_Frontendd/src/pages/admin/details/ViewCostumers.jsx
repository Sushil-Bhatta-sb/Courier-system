import { useEffect, useState } from "react";

export default function ViewCostumers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/get_customers/")
      .then(res => res.json())
      .then(data => setCustomers(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Customer Details
      </h2>

      <div className="space-y-4">
        {customers.map(c => (
          <div
            key={c.id}
            className="bg-white border rounded-lg p-4 shadow-sm"
          >
            <p><span className="font-semibold">Name:</span> {c.name}</p>
            <p><span className="font-semibold">Phone:</span> {c.phone}</p>
            <p><span className="font-semibold">Email:</span> {c.email}</p>
            <p><span className="font-semibold">Address:</span> {c.address}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
