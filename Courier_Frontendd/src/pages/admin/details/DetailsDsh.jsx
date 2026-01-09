import {Link} from "react-router-dom";
import React from  "react";
export default function DetailsDsh()
{
    return(
          <div style={{ padding: "30px" }}>
      <h2>Details Section</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li><Link to="/admin/details/ViewCostumers">View Customers</Link></li>
        <li><Link to="/admin/details/ViewShipments">View Shipments</Link></li>
        <li><Link to="/admin/details/ViewStaffs">View Staff</Link></li>
        <li><Link to="/admin/details/ViewModes">View Modes</Link></li>
        <li><Link to="/admin/details/ViewStatus">View Status</Link></li>
      </ul>
    </div>
    );
}