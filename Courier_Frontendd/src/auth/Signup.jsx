import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
    const [formData, setFormData] = useState({
        name: "", email: "", phone: "", address: "", password: ""
    });
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://127.0.0.1:8000/api/auth/signup/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success) {
                alert("Account created! Please login.");
                navigate("/login");
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert("Connection error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <form onSubmit={handleSignup} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Create Account</h2>
                <div className="space-y-4">
                    <input name="name" placeholder="Full Name" className="w-full p-3 border rounded-lg" onChange={handleChange} required />
                    <input name="email" type="email" placeholder="Email" className="w-full p-3 border rounded-lg" onChange={handleChange} required />
                    <input name="phone" placeholder="Phone" className="w-full p-3 border rounded-lg" onChange={handleChange} required />
                    <input name="address" placeholder="Address" className="w-full p-3 border rounded-lg" onChange={handleChange} required />
                    <input name="password" type="password" placeholder="Password (min 8 chars)" className="w-full p-3 border rounded-lg" onChange={handleChange} required />
                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">Sign Up</button>
                </div>
                <p className="mt-4 text-center text-sm">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
            </form>
        </div>
    );
}