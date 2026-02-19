import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../apiConfig";

export default function AddCustomer() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [msg, setMsg] = useState("");
  const [customerId, setCustomerId] = useState(null);
  const [loading, setLoading] = useState(false);

  const addCustomer = async () => {
    // 1. Reset states
    setMsg("");
    setCustomerId(null);

    // 2. Client-side Validation
    if (!name.trim() || !phone.trim() || !email.trim() || !address.trim()) {
      setMsg("⚠️ All fields are required.");
      return;
    }

    // Phone validation: Ensures only digits and at least 10 characters (adjust as needed)
    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(phone)) {
      setMsg("⚠️ Phone number must contain only digits.");
      return;
    }

    // Email validation: Basic format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMsg("⚠️ Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/add_customer/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: name.trim(), 
          phone: phone.trim(), 
          email: email.trim(), 
          address: address.trim() 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setCustomerId(data.customer_id);
        setMsg("✅ Customer profile created successfully!");
        localStorage.setItem("customerId", data.customer_id);
      } else {
        // Displays the specific error message from your Django backend
        setMsg(`❌ ${data.error || "Something went wrong."}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setMsg("❌ Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none mb-4 transition-all disabled:bg-slate-50";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        <h2 className="text-2xl font-black text-slate-800 mb-6 text-center">
          New Customer Profile
        </h2>

        <div className="space-y-1">
          <input
            placeholder="Full Name"
            className={inputClass}
            value={name}
            disabled={loading}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Phone Number (Digits only)"
            className={inputClass}
            value={phone}
            disabled={loading}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            placeholder="Email Address"
            type="email"
            className={inputClass}
            value={email}
            disabled={loading}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Permanent Address"
            className={inputClass}
            value={address}
            disabled={loading}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <button
          onClick={addCustomer}
          disabled={loading}
          className={`w-full text-white font-bold py-3.5 rounded-xl transition shadow-lg mt-2 ${
            loading 
            ? "bg-indigo-400 cursor-not-allowed" 
            : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100"
          }`}
        >
          {loading ? "Processing..." : "Add Profile"}
        </button>

        {msg && (
          <p className={`mt-4 text-center text-sm font-semibold ${
            msg.includes("✅") ? "text-green-600" : "text-red-500"
          }`}>
            {msg}
          </p>
        )}

        {customerId && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-center animate-in fade-in zoom-in duration-300">
            <p className="text-sm text-green-700">Your Customer ID</p>
            <p className="text-2xl font-bold text-green-600">#{customerId}</p>

            <button
              onClick={() => navigate("/customer")}
              className="mt-3 w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Continue to Create Shipment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}