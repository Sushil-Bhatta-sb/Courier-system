import { Link, Outlet } from "react-router-dom";

export default function StaffDsh() {
  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "15px" }}>
        <Link to="shipments">View Shipments</Link>
      </div>
      <Outlet />
    </div>
  );
}
