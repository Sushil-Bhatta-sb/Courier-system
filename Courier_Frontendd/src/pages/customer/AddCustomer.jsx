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

  const addCustomer = async () => {
    try {
      const res = await fetch(`${API_URL}/add_customer/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, address })
      });

      const data = await res.json();

      if (data.customer_id) {
        setCustomerId(data.customer_id);
        setMsg("Customer profile created successfully!");

        // Save customer id for later use
        localStorage.setItem("customerId", data.customer_id);
      } else {
        setMsg(data.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMsg("Server error. Please try again.");
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none mb-4 transition-all";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        <h2 className="text-2xl font-black text-slate-800 mb-6 text-center">
          New Customer Profile
        </h2>

        <input
          placeholder="Full Name"
          className={inputClass}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Phone Number"
          className={inputClass}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          placeholder="Email Address"
          className={inputClass}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Permanent Address"
          className={inputClass}
          onChange={(e) => setAddress(e.target.value)}
        />

        <button
          onClick={addCustomer}
          className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 mt-2"
        >
          Add Profile
        </button>

        {msg && (
          <p className="mt-4 text-center text-sm font-semibold text-indigo-600">
            {msg}
          </p>
        )}

        {customerId && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
            <p className="text-sm text-green-700">
              Your Customer ID
            </p>
            <p className="text-2xl font-bold text-green-600">
              #{customerId}
            </p>

            <button
              onClick={() => navigate("/customer")}
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Continue to Create Shipment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
