import { useState } from "react";
import { useNavigate } from "react-router-dom";
import  API_URL  from "../pages/apiConfig";
export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleResetRequest = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/auth/reset-password/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            
            if (data.success) {
                // In this local setup, we show the token in an alert
                alert(`Reset link sent! Your test token is: ${data.reset_token}`);
                navigate("/set-new-password");
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert("Server connection failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
                <p className="text-gray-500 text-sm mb-6 text-center">Enter your email to receive a password reset token.</p>
                <form onSubmit={handleResetRequest} className="space-y-4">
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        className="w-full p-3 border rounded-lg outline-blue-500"
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">
                        Send Reset Token
                    </button>
                </form>
            </div>
        </div>
    );
}