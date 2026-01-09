import { useEffect, useState } from "react";

export default function ViewStaffs() {
  const [staffs, setStaffs] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/get_staff/")
      .then(res => res.json())
      .then(data => setStaffs(data));
  }, []);

  return (
    <div style={{ padding: "25px" }}>
      <h2>Staff Details</h2>

      {staffs.map(s => (
        <div key={s.id} style={card}>
          <p><b>Name:</b> {s.name}</p>
          <p><b>Phone:</b> {s.phone}</p>
          <p><b>Area:</b> {s.area}</p>
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
