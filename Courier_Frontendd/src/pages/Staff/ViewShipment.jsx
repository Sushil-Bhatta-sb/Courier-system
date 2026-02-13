import { useState } from "react";
import API_URL from "../apiConfig";
import ProofDelivery from "./ProofDelivery";

export default function ViewShipment({ shipment, onUpdate }) {
  const [remarks, setRemarks] = useState("");

  const handleDeliver = () => {
    if (!remarks.trim()) {
      alert("Please enter recipient name/notes before finalizing.");
      return;
    }

    fetch(`${API_URL}/update_shipment_status/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shipment_id: shipment.id,
        status: "Out for Delivery",
        remarks: remarks,
      }),
    })
      .then((res) => res.json())
      .then(() => onUpdate());
  };

  return (
    <div
      className={`p-5 rounded-xl border-l-4 shadow-sm ${
        shipment.status === "Delivered"
          ? "bg-slate-50 border-slate-300"
          : "bg-white border-emerald-500"
      }`}
    >
      <div className="flex justify-between mb-2">
        <p className="font-bold text-slate-700">ID #{shipment.id}</p>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {shipment.status}
        </span>
      </div>

      <p className="text-sm">
        <b>Destination:</b> {shipment.delivery}
      </p>
      {shipment.status === "booked" && (
        <div className="mt-4 pt-4 border-t space-y-3">
          <textarea
            rows="2"
            placeholder="Recipient remarks (e.g. Received by Gatekeeper)"
            className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />

          <button
            onClick={handleDeliver}
            className="w-full bg-emerald-600 text-white py-2 rounded-lg font-bold hover:bg-emerald-700 transition"
          >
            Start Delivery
          </button>
        </div>
      )}
      {shipment.status === "Out for Delivery" && (
        <div className="mt-4 pt-4 border-t">
          <ProofDelivery shipmentId={shipment.id} onDone={onUpdate} />
        </div>
      )}
      {shipment.status === "Delivered" && (
        <div className="mt-3 text-sm text-emerald-700 italic">
          Note: {shipment.remarks || "No remarks added."}
        </div>
      )}
    </div>
  );
}
