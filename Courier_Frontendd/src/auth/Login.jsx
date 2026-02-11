import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import  API_URL  from "../pages/apiConfig";
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await fetch(`${API_URL}/auth/login/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();

        if (data.success) {
            localStorage.setItem("customerId", data.user_id);
            navigate("/customer/dashboard");
        } else {
            alert(data.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Customer Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg" onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" className="w-full p-3 border rounded-lg" onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">Login</button>
                </form>
                <div className="mt-6 flex justify-between text-xs text-blue-600">
                    <Link to="/signup">New Account</Link>
                    <Link to="/reset-password">Forgot Password?</Link>
                </div>
            </div>
        </div>
    );
}