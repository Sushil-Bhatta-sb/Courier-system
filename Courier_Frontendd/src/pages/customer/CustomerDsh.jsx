import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from '../apiConfig';
export default function CustomerDsh() {
    const [shipment, setShipment] = useState(null);
    const [searchId, setSearchId] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    // CHANGED TO sessionStorage: This wipes when the tab closes
    const customerId = sessionStorage.getItem("customerId");
    const steps = ["booked", "picked up", "in transit", "delivered"];

    useEffect(() => {
        if (!customerId) {
            navigate("/login");
            return;
        }

        fetch(`${API_URL}/get_shipments/`)
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
            const res = await fetch(`${API_URL}/track/${searchId}/`);
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

    const handleLogout = () => {
        // CHANGED TO sessionStorage
        sessionStorage.removeItem("customerId");
        navigate("/login");
    };

    const currentStatus = shipment?.status?.toLowerCase() || "";
    const statusIndex = steps.indexOf(currentStatus);

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-indigo-100">
            {/* --- TOP NAV: Frosted Glass Effect --- */}
            
            <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-10">
                    <h1 className="text-2xl font-black bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tighter">
                        LOGI<span className="text-slate-400">.</span>
                    </h1>
                    <div className="flex items-center gap-4">
                                            <button
                        onClick={() => navigate(-1)}
                        className="text-slate-400 hover:text-indigo-600 text-sm font-bold transition-colors"
                    >
                        ← Back
                    </button>
                        <Link to="/customer/dashboard" className="text-sm font-bold text-indigo-600 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600">Dashboard</Link>
                        <Link to="/customer/AddCustomer" className="text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors">Settings</Link>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center bg-slate-100/50 rounded-2xl px-4 py-2 border border-slate-200/50 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all duration-300 w-full sm:w-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input 
                            type="text" 
                            placeholder="Tracking ID..." 
                            className="bg-transparent border-none outline-none text-xs font-bold w-40 placeholder:text-slate-400"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                        />
                        <button onClick={handleSearch} className="text-indigo-600 font-black text-[10px] uppercase tracking-widest ml-2 hover:opacity-70">
                            {loading ? "..." : "Track"}
                        </button>
                    </div>
                    <button onClick={handleLogout} className="text-slate-400 hover:text-rose-500 text-xs font-bold transition-colors">
                        Sign Out
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-8 md:p-12">
                <header className="mb-12">
                    <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em] mb-3 block">Customer Portal</span>
                    <h2 className="text-5xl font-black tracking-tight text-slate-900 mb-2">Track your <span className="text-indigo-600">Journey.</span></h2>
                    <p className="text-slate-400 font-medium text-lg">Manage your logistics and real-time shipments.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 group">
                        <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-[0_30px_100px_rgba(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_30px_100px_rgba(79,70,229,0.08)] transition-all duration-500 relative overflow-hidden">
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl group-hover:bg-indigo-100/50 transition-colors duration-500"></div>
                            
                            {shipment ? (
                                <div className="relative z-10">
                                    <div className="flex justify-between items-center mb-16">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>
                                                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Current Parcel</p>
                                            </div>
                                            <h3 className="text-6xl font-black tracking-tighter text-slate-900 leading-none">#{shipment.id}</h3>
                                        </div>
                                        <Link to="/customer/AddShipment" className="bg-slate-900 text-white px-8 py-4 rounded-3xl font-bold text-sm shadow-2xl shadow-slate-200 hover:-translate-y-1 transition-all active:scale-95">
                                            + New Order
                                        </Link>
                                    </div>
                                    <div className="relative mb-20">
                                        <div className="absolute top-7 left-2 right-2 h-1.5 bg-slate-100 rounded-full"></div>
                                        <div 
                                            className="absolute top-7 left-2 h-1.5 bg-linear-to-r from-indigo-600 to-violet-500 rounded-full transition-all duration-1000 ease-in-out shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                                            style={{ width: `${(statusIndex / (steps.length - 1)) * 97}%` }}
                                        ></div>
                                        <div className="flex justify-between relative z-10 px-0">
                                            {steps.map((step, index) => (
                                                <div key={index} className="flex flex-col items-center">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-4 transition-all duration-700 ${
                                                        index <= statusIndex 
                                                        ? 'bg-white border-indigo-600 shadow-xl scale-110 rotate-3' 
                                                        : 'bg-slate-50 border-white text-slate-300'
                                                    }`}>
                                                        {index <= statusIndex ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L7 11.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        ) : (
                                                            <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
                                                        )}
                                                    </div>
                                                    <p className={`mt-6 text-[11px] font-black uppercase tracking-[0.15em] ${index <= statusIndex ? 'text-indigo-600' : 'text-slate-300'}`}>
                                                        {step}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-12 p-10 bg-slate-50/50 rounded-4xl border border-slate-100">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Destination</p>
                                            <p className="text-xl font-bold text-slate-800">{shipment.delivery_address || shipment.delivery}</p>
                                        </div>
                                        <div className="space-y-1 text-right">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Parcel Weight</p>
                                            <p className="text-xl font-bold text-slate-800">{shipment.weight} <span className="text-slate-400 font-medium">kg</span></p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-24 text-center">
                                    <div className="w-24 h-24 bg-slate-50 rounded-4xl flex items-center justify-center mx-auto mb-8 border border-slate-100">
                                        <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">No active packages</h2>
                                    <Link to="/customer/AddShipment" className="mt-6 inline-block bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:shadow-lg hover:shadow-indigo-200 transition-all">Start Shipment</Link>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-200 flex flex-col justify-between h-75">
                            <div>
                                <h4 className="text-2xl font-bold mb-3 tracking-tight">Courier Support</h4>
                                <p className="text-indigo-100/80 text-sm font-medium leading-relaxed">Having trouble with a delivery? Our 24/7 team is ready to assist.</p>
                            </div>
                            <button className="bg-white text-indigo-600 w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-lg">
                                Get Help Now
                            </button>
                        </div>
                        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
                            <h4 className="font-black text-slate-900 mb-8 flex justify-between items-center">
                                Timeline 
                                <span className="text-[10px] bg-slate-100 text-slate-400 px-3 py-1 rounded-full uppercase">Today</span>
                            </h4>
                            <div className="space-y-8">
                                <div className="flex gap-5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50 mt-2"></div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-800 tracking-tight">System Notification</p>
                                        <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Your profile was updated successfully.</p>
                                    </div>
                                </div>
                                <div className="flex gap-5 opacity-40">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 ring-4 ring-slate-50 mt-2"></div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-800 tracking-tight">No recent logs</p>
                                        <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Tracking for next shipment.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}