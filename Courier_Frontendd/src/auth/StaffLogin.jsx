import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../pages/apiConfig";

export default function StaffLogin() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loginStaff = async () => {
    setError(""); // Clear previous errors
    try {
      const res = await fetch(`${API_URL}/staff_login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (res.ok) {
        // ⚡ CHANGED: Switched to sessionStorage
        sessionStorage.setItem("staffId", data.staff_id);
        sessionStorage.setItem("staffName", data.name);
        navigate("/staff");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Server connection error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Staff Login</h2>
        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          onClick={loginStaff}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Continue
        </button>
      </div>
    </div>
  );
}