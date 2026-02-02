import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (credentials.username === "admin" && credentials.password === "admin123") {
            localStorage.setItem("isAdmin", "true");
            navigate("/admin/AdminDashboard");
        } else {
            alert("Invalid Admin Credentials");
        }
    };
    return (
        <div className="h-screen flex items-center justify-center bg-slate-100">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-lg w-96 border border-slate-200">
                <h2 className="text-2xl font-black mb-6 text-slate-800 uppercase tracking-tighter">Admin Portal</h2>
                <div className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Username" 
                        className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    />
                    <button type="submit" className="w-full bg-slate-900 text-white p-3 rounded-lg font-bold hover:bg-black transition">
                        Enter Dashboard
                    </button>
                </div>
            </form>
        </div>
    );
}