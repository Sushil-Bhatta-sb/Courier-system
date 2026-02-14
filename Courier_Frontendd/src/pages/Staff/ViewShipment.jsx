import { useState } from "react";
import API_URL from "../apiConfig";
import ProofDelivery from "./ProofDelivery";

export default function ViewShipment({ shipment, onUpdate }) {
  const [remarks, setRemarks] = useState("");
  const [showProof, setShowProof] = useState(false);
  const getMediaUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    
    const base = API_URL.endsWith("/api") 
      ? API_URL.replace("/api", "") 
      : API_URL.replace("/api/", "");
    return `${base}/media/${path}`;
  };
  const handleDeliver = () => {
    

    fetch(`${API_URL}/update_shipment_status/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shipment_id: shipment.shipment_id || shipment.id,
        status: "Out for Delivery",
        remarks: remarks,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success || data.message) {
          onUpdate();
        } else {
          alert("Error updating status: " + (data.error || "Unknown error"));
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  };

  return (
    <div
      className={`p-5 rounded-xl border-l-4 shadow-sm transition-all duration-300 ${
        shipment.status === "Delivered"
          ? "bg-slate-50 border-slate-300"
          : "bg-white border-emerald-500"
      }`}
    >
    
      <div className="flex justify-between items-center mb-3">
        <p className="font-bold text-slate-700 text-lg">
          ID #{shipment.shipment_id || shipment.id}
        </p>
        <span
          className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
            shipment.status === "Delivered"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {shipment.status}
        </span>
      </div>

    
      <div className="space-y-1 text-sm text-slate-600">
        <p>
          <span className="font-semibold text-slate-800">From:</span>{" "}
          {shipment.pickup_address}
        </p>
        <p>
          <span className="font-semibold text-slate-800">To:</span>{" "}
          {shipment.delivery_address}
        </p>
      </div>

      {shipment.status === "booked" && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
          <textarea
            rows="2"
            placeholder="Recipient remarks (e.g., 'Left at front desk')"
            className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
          <button
            onClick={handleDeliver}
            className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Start Delivery
          </button>
        </div>
      )}

      {shipment.status === "Out for Delivery" && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <ProofDelivery
            shipmentId={shipment.shipment_id || shipment.id}
            onDone={onUpdate}
          />
        </div>
      )}

      {shipment.status === "Delivered" && (
        <div className="mt-4 pt-3 border-t border-slate-200">
          <div className="bg-white p-3 rounded-lg border border-slate-200 mb-3">
            <p className="text-xs text-slate-500 font-bold uppercase mb-1">
              Staff Remarks
            </p>
            <p className="text-sm text-slate-700 italic">
              "{shipment.remarks || "No remarks provided."}"
            </p>
          </div>

          <button
            onClick={() => setShowProof(!showProof)}
            className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            {showProof ? "Close Proof" : "View Delivery Proof"}
            <span className="text-[10px]">{showProof ? "▲" : "▼"}</span>
          </button>

          {showProof && (
            <div className="mt-3 grid grid-cols-2 gap-3 p-3 bg-white border border-slate-200 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-1.5">
                <p className="text-[10px] text-slate-400 uppercase font-black">
                  Photo
                </p>
                <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-100">
                  <img
                    src={getMediaUrl(shipment.delivery_photo)}
                    alt="Package Proof"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/300?text=Photo+Not+Found";
                    }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-[10px] text-slate-400 uppercase font-black">
                  Signature
                </p>
                <div className="aspect-square bg-slate-50 rounded-lg overflow-hidden border border-slate-100">
                  <img
                    src={getMediaUrl(shipment.delivery_signature)}
                    alt="Customer Signature"
                    className="w-full h-full object-contain p-2"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/300?text=No+Signature";
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}