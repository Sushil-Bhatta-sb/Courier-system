import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CustomerDsh() {
    const [shipment, setShipment] = useState(null);
    const steps = ["booked", "picked up", "in transit", "delivered"];

    useEffect(() => {
        // Fetching the latest shipment for this customer
        fetch("http://127.0.0.1:8000/api/get_shipments/")
            .then(res => res.json())
            .then(data => {
                // For now, we take the most recent shipment (last one in array)
                if (data.length > 0) setShipment(data[data.length - 1]);
            });
    }, []);

    // Logic to determine how far the green bar should go
    const currentStatus = shipment?.status?.toLowerCase() || "booked";
    const statusIndex = steps.indexOf(currentStatus);

    return (
        <div className="h-screen bg-slate-100 p-6 flex flex-col gap-6 overflow-hidden">
            <div className="flex-none">
                <Link to="/customer/AddCustomer" className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition mr-2 shadow-md">
                    Customer Info
                </Link>
                <Link to="/customer/AddShipment" className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-md">
                    Place Shipment
                </Link>
            </div>

            <div className="flex-grow w-full relative rounded-3xl shadow-2xl overflow-hidden bg-white border border-slate-200">
                <img src="i0.jpg" alt="Delivery" className="w-full h-full object-contain bg-slate-50" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                {/* REAL DATA OVERLAY */}
                <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
                    {shipment ? (
                        <>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-white font-bold text-lg">Parcel Tracking: #{shipment.id}</h3>
                                    <p className="text-slate-300 text-sm">Destination: {shipment.delivery}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white font-bold">{shipment.weight} KG</p>
                                    <p className="text-green-400 text-xs font-mono uppercase">{shipment.status}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between relative px-4">
                                <div className="absolute top-3 left-6 right-6 h-1 bg-white/20 -translate-y-1/2"></div>
                                {steps.map((step, index) => (
                                    <div key={index} className="relative z-10 flex flex-col items-center">
                                        <div className={`w-6 h-6 rounded-full border-4 border-slate-900 transition-all duration-500 ${index <= statusIndex ? 'bg-green-400 scale-110' : 'bg-slate-500'}`}></div>
                                        <span className={`text-[10px] mt-3 font-bold uppercase tracking-wider ${index <= statusIndex ? 'text-green-300' : 'text-slate-400'}`}>
                                            {step}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="text-white italic text-center">No active shipments found...</p>
                    )}
                </div>
            </div>
        </div>
    );
}