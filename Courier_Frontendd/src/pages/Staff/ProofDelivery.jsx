import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import API_URL from "../apiConfig";
import toast from "react-hot-toast";

export default function ProofDelivery({ shipmentId, onDone }) {
  const sigRef = useRef();
  const [photo, setPhoto] = useState(null);

  const submitProof = async () => {
    // 1. Validation
    if (!sigRef.current || sigRef.current.isEmpty()) {
      toast.error("Please provide a signature");
      return;
    }
    if (!photo) {
      toast.error("Please upload a photo of the package");
      return;
    }

    // 2. FIX: Use getCanvas() instead of getTrimmedCanvas() to avoid the error
    const signatureImage = sigRef.current.getCanvas().toDataURL("image/png");

    const formData = new FormData();
    formData.append("shipment_id", shipmentId);
    formData.append("signature", signatureImage); // This is a Base64 string
    formData.append("photo", photo); // This is the actual file

    try {
      const res = await fetch(`${API_URL}/upload_proof/`, {
        method: "POST",
        body: formData,
        // Note: Do NOT set Content-Type header when sending FormData
      });

      if (res.ok) {
        toast.success("Delivery completed!");
        onDone();
      } else {
        const err = await res.json();
        toast.error(err.error || "Upload failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Server connection error");
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl space-y-4 border shadow-sm">
      <h3 className="font-bold text-slate-700 border-b pb-2">Complete Delivery</h3>

      {/* PHOTO UPLOAD */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Package Photo</label>
        <input 
          type="file" 
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {/* SIGNATURE */}
      <div>
        <div className="flex justify-between items-end mb-1">
          <label className="text-sm font-medium text-gray-600">Customer Signature</label>
          <button 
            type="button"
            onClick={() => sigRef.current.clear()}
            className="text-xs text-red-500 hover:underline"
          >
            Clear
          </button>
        </div>
        <div className="border rounded-lg bg-gray-50 overflow-hidden">
          <SignatureCanvas
            ref={sigRef}
            penColor="black"
            canvasProps={{ 
              width: 350, 
              height: 150, 
              className: "w-full cursor-crosshair" 
            }}
          />
        </div>
      </div>

      <button
        onClick={submitProof}
        className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition shadow-md"
      >
        Submit Proof & Deliver
      </button>
    </div>
  );
}