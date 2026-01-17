import { Link } from "react-router-dom";

export default function CustomerDsh() {
    return(
        <div >
            <div style={{ display: "flex", gap: "20px" }}>
                <Link to="/customer/AddCustomer">Customer Info</Link>
                <Link to="/customer/AddShipment" >Place your Shipment</Link>
            </div>
        </div>
    )
}