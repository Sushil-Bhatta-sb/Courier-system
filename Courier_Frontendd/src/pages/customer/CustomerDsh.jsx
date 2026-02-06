import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CustomerDsh() {
    const [shipment, setShipment] = useState(null);
    const [searchId, setSearchId] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const customerId = localStorage.getItem("customerId");
    const steps = ["booked", "picked up", "in transit", "delivered"];

    useEffect(() => {
        if (!customerId) {
            navigate("/login");
            return;
        }

        fetch("http://127.0.0.1:8000/api/get_shipments/")
            .then(res => res.json())
            .then(data => {
                const myShipments = data.filter(s => s.customer_id === parseInt(customerId));
                if (myShipments.length > 0) {
                    setShipment(myShipments[myShipments.length - 1]);
                }
            })
            .catch(err => console.error("Fetch error:", err));
    }, [customerId, navigate]);

    const handleSearch = async () => {
        if (!searchId) return;
        setLoading(true);
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/track/${searchId}/`);
            const data = await res.json();
            if (res.ok) {
                setShipment(data);
            } else {
                alert(data.error || "Shipment not found");
                setShipment(null);
            }
        } catch (err) {
            alert("Server connection error.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch("http://127.0.0.1:8000/api/auth/logout/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ customer_id: customerId }),
            });
        } finally {
            localStorage.removeItem("customerId");
            navigate("/login");
        }
    };

    const currentStatus = shipment?.status?.toLowerCase() || "";
    const statusIndex = steps.indexOf(currentStatus);

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-6 flex flex-col gap-6 font-sans">
            {/* TOP NAVIGATION BAR */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-black text-blue-600 tracking-tight mr-4">LogiTrack</h1>
                    <div className="flex gap-2">
                        <Link to="/customer/AddCustomer" className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-200 transition">
                            Profile
                        </Link>
                        <Link to="/customer/AddShipment" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                            + New Shipment
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex bg-slate-50 rounded-xl border border-slate-200 p-1 group focus-within:border-blue-400 transition-all">
                        <input 
                            type="text" 
                            placeholder="Tracking ID..." 
                            className="bg-transparent px-3 py-1.5 text-sm outline-none w-32 md:w-48 text-slate-600 font-medium"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                        />
                        <button 
                            onClick={handleSearch}
                            className="bg-slate-900 text-white px-5 py-1.5 rounded-lg text-sm font-bold hover:bg-black transition active:scale-95"
                        >
                            {loading ? "..." : "Track"}
                        </button>
                    </div>
                    <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition text-sm font-bold px-2">
                        Logout
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="grow w-full flex items-center justify-center relative overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-sm min-h-[500px]">
                <div className="absolute inset-0 opacity-40 pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-50 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 w-full max-w-4xl p-6 md:p-12">
                    {shipment ? (
                        <div className="space-y-12">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-8">
                                <div>
                                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">Active Shipment</span>
                                    <h3 className="text-slate-900 font-black text-4xl md:text-5xl mt-4 tracking-tighter">#{shipment.id}</h3>
                                    <div className="mt-4">
                                        <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Destination</p>
                                        <p className="text-slate-700 font-bold text-lg">{shipment.delivery_address || shipment.delivery}</p>
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 min-w-[200px] w-full md:w-auto text-right">
                                    <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Weight</p>
                                    <p className="text-slate-900 text-4xl font-black">{shipment.weight} <span className="text-lg text-slate-400 font-medium">KG</span></p>
                                    <div className="mt-4 bg-green-500 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase inline-block">{shipment.status}</div>
                                </div>
                            </div>

                            <div className="relative pt-8 pb-4">
                                <div className="absolute top-[44px] left-4 right-4 h-1.5 bg-slate-100 rounded-full"></div>
                                <div className="absolute top-[44px] left-4 h-1.5 bg-blue-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                    style={{ width: `${(statusIndex / (steps.length - 1)) * 96}%` }}></div>
                                <div className="flex justify-between relative z-10">
                                    {steps.map((step, index) => (
                                        <div key={index} className="flex flex-col items-center">
                                            <div className={`w-8 h-8 rounded-full border-4 transition-all duration-500 flex items-center justify-center ${index <= statusIndex ? 'bg-blue-600 border-white shadow-lg scale-110' : 'bg-white border-slate-200'}`}>
                                                {index <= statusIndex && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                            </div>
                                            <span className={`text-[10px] md:text-[11px] mt-4 font-black uppercase tracking-widest ${index <= statusIndex ? 'text-blue-600' : 'text-slate-300'}`}>{step}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-100">
                                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Track your Parcel</h2>
                            <p className="text-slate-400 mt-2 max-w-xs mx-auto text-sm">Enter your tracking number above to see the live status of your shipment.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}