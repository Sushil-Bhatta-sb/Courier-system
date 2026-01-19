import { Link } from "react-router-dom";

export default function CustomerDsh() {
    return(
        <div className="min-h-screen bg-slate-100 p-6 flex " >
            <div >
                <Link to="/customer/AddCustomer"  className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition mr-1.5">Customer Info</Link>
                <Link to="/customer/AddShipment" className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition mr-1.5" >Place your Shipment</Link>
            </div>
        </div>
    )
}   