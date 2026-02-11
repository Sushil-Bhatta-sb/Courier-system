import { useState } from "react";
import { useNavigate } from "react-router-dom";
import  API_URL  from "../pages/apiConfig";
export default function SetNewPassword() {
    const [customerId, setCustomerId] = useState("");
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const navigate = useNavigate();

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        
        try {
            const res = await fetch(`${API_URL}/auth/set-new-password/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customer_id: customerId,
                    reset_token: token,
                    new_password: newPassword
                }),
            });

            const data = await res.json();

            if (data.success) {
                alert("Password updated successfully! Please login.");
                navigate("/login");
            } else {
                alert(data.error || "Failed to update password.");
            }
        } catch (err) {
            alert("Connection error to server.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <form onSubmit={handleUpdatePassword} className="bg-white p-8 rounded-2xl shadow-xl w-96">
                <h2 className="text-2xl font-bold mb-6 text-slate-800 text-center">Set New Password</h2>
                
                <div className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Customer ID" 
                        className="w-full p-3 border rounded-lg outline-blue-500"
                        value={customerId}
                        onChange={(e) => setCustomerId(e.target.value)}
                        required
                    />
                    <input 
                        type="text" 
                        placeholder="Enter Reset Token" 
                        className="w-full p-3 border rounded-lg outline-blue-500"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="New Password (min 8 chars)" 
                        className="w-full p-3 border rounded-lg outline-blue-500"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <button 
                        type="submit"
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
                    >
                        Update Password
                    </button>
                </div>
            </form>
        </div>
    );
}