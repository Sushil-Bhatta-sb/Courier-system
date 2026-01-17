import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div style={{
      display: "flex",
      gap: "20px",
      padding: "15px",
      background: "#1e293b",
      color: "white"
    }}>
      <Link to="/" style={{ color: "white" }}>Home</Link>
      <Link to="/about" style={{ color: "white" }}>About</Link>
      
      <Link to="/staff" style={{ color: "white" }}>Staff</Link>
      <Link to="/customer" style={{ color: "white" }}>Customer</Link>
    
    </div>
  );
}
