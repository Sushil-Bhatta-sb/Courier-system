import { useEffect, useState } from "react";

export default function AdminStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/admin/stats/")
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  if (!stats) return <p className="p-6">Loading dashboard...</p>;

  const Card = ({ title, value }) => (
    <div className="bg-white shadow rounded-xl p-6 border">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-3xl font-bold">{value}</h2>
    </div>
  );

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Admin Monitoring Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">

        <Card title="Total Shipments" value={stats.total_shipments} />
        <Card title="booked" value={stats.booked} />
        <Card title="Shipped" value={stats.shipped} />
        <Card title="Delivered" value={stats.delivered} />
        <Card title="Customers" value={stats.customers} />
        <Card title="Staff" value={stats.staff} />

        <div className="md:col-span-3 bg-emerald-600 text-white rounded-xl p-6 shadow">
          <p className="text-lg">Total Revenue</p>
          <h2 className="text-4xl font-bold">Rs. {stats.revenue}</h2>
        </div>

      </div>
    </div>
  );
}
