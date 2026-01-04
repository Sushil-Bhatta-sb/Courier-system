import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";

import AdminDashboard from "./pages/admin/AdminDashboard";

import AddShipment  from "./pages/admin/AddShipment";
import AddCustomer from "./pages/admin/AddCustomer";
import AddStaff from "./pages/admin/AddStaff";
import AddMode from "./pages/admin/AddMode";
import AddStatus from "./pages/admin/AddStatus";
import CustomerDsh from "./pages/customer/CustomerDsh";

import StaffDsh from "./pages/Staff/StaffDsh";


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/AddShipment" element={<AddShipment />} />
        <Route path="/admin/AddCustomer" element={<AddCustomer />} />
        <Route path="/admin/AddStaff" element={<AddStaff />} />
        <Route path="/admin/AddMode" element={<AddMode />} />
        <Route path="/admin/AddStatus" element={<AddStatus />} />
        {/* Customer */}
        <Route path="/customer" element={<CustomerDsh />} />

        {/* Staff */}
        <Route path="/Staff" element={<StaffDsh />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

