import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Panel</h2>

      <ul>
        <li><Link to="/admin/AddShipment">Shipments</Link></li>
        <li><Link to="/admin/AddCustomer">Customers</Link></li>
        <li><Link to="/admin/AddStaff">Staff</Link></li>
        <li><Link to="/admin/AddMode">Modes of Transport</Link></li>
        <li><Link to="/admin/AddStatus">Shipment Status</Link></li>
      </ul>
    </div>
  );
}
