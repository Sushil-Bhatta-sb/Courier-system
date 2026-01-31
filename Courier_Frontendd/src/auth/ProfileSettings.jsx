import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileSettings() {
    const customerId = localStorage.getItem("customerId");
    const [emailData, setEmailData] = useState({ current_password: "", new_email: "" });
    const [passData, setPassData] = useState({ current_password: "", new_password: "" });
    const navigate = useNavigate();

    const handleEmailChange = async (e) => {
        e.preventDefault();
        const res = await fetch("http://127.0.0.1:8000/api/auth/change-email/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customer_id: customerId, ...emailData }),
        });
        const data = await res.json();
        alert(data.message || data.error);
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        const res = await fetch("http://127.0.0.1:8000/api/auth/change-password/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customer_id: customerId, ...passData }),
        });
        const data = await res.json();
        alert(data.message || data.error);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <button onClick={() => navigate(-1)} className="mb-6 text-blue-600 font-bold">← Back to Dashboard</button>
            <div className="max-w-2xl mx-auto space-y-8">
                
                {/* CHANGE EMAIL SECTION */}
                <form onSubmit={handleEmailChange} className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold mb-4">Update Email Address</h2>
                    <input type="password" placeholder="Current Password" 
                        className="w-full p-2 border rounded mb-3"
                        onChange={(e) => setEmailData({...emailData, current_password: e.target.value})} />
                    <input type="email" placeholder="New Email" 
                        className="w-full p-2 border rounded mb-3"
                        onChange={(e) => setEmailData({...emailData, new_email: e.target.value})} />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded">Update Email</button>
                </form>

                {/* CHANGE PASSWORD SECTION */}
                <form onSubmit={handlePasswordChange} className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold mb-4">Change Security Password</h2>
                    <input type="password" placeholder="Current Password" 
                        className="w-full p-2 border rounded mb-3"
                        onChange={(e) => setPassData({...passData, current_password: e.target.value})} />
                    <input type="password" placeholder="New Password" 
                        className="w-full p-2 border rounded mb-3"
                        onChange={(e) => setPassData({...passData, new_password: e.target.value})} />
                    <button className="bg-slate-800 text-white px-4 py-2 rounded">Change Password</button>
                </form>
            </div>
        </div>
    );
}