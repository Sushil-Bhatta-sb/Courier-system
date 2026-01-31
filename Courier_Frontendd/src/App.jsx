import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import DetailsDsh from "./pages/admin/details/DetailsDsh";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddCustomer from "./pages/customer/AddCustomer"; 
import AddShipment from "./pages/customer/AddShipment";
import AddStaff from "./pages/admin/AddStaff";
import AddMode from "./pages/admin/AddMode";
import AddStatus from "./pages/admin/AddStatus";
import CustomerDsh from "./pages/customer/CustomerDsh";
import StaffDsh from "./pages/Staff/StaffDsh";
import ViewCostumers from "./pages/admin/details/ViewCostumers";
import ViewShipments from "./pages/admin/details/ViewShipments";
import ViewModes from "./pages/admin/details/ViewModes";
import ViewStaffs  from "./pages/admin/details/ViewStaffs";
import ViewStatus from "./pages/admin/details/ViewStatus";
import ViewShipment from "./pages/Staff/ViewShipment";

import Login from "./auth/Login";
import Signup from "./auth/Signup";
import ProfileSettings from "./auth/ProfileSettings";
import ForgotPassword from "./auth/ForgotPassword";
import SetNewPassword from "./auth/SetNewPassword";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ForgotPassword />} />
        <Route path="/set-new-password" element={<SetNewPassword />} />
        <Route path="/customer/settings" element={<ProfileSettings />} />

       <Route path="/customer" element={<Navigate to="/customer/dashboard" replace />} />
       <Route path="/customer/dashboard" element={<CustomerDsh />} />
        <Route path="/customer/AddCustomer" element={<AddCustomer />} />
        <Route path="/customer/AddShipment" element={<AddShipment />} />
        
        <Route path="/staff" element={<StaffDsh />}>
          <Route path="shipments" element={<ViewShipment />} />
        </Route>

        <Route path="/admin/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/admin/AddStaff" element={<AddStaff />} />
        <Route path="/admin/AddMode" element={<AddMode />} />
        <Route path="/admin/AddStatus" element={<AddStatus />} />
  
        <Route path="/details" element={<DetailsDsh/>} />
        <Route path="/admin/details/ViewCostumers" element={<ViewCostumers/>} />
        <Route path="/admin/details/ViewShipments" element={<ViewShipments />} />
        <Route path="/admin/details/ViewModes" element={<ViewModes />} />
        <Route path="/admin/details/ViewStaffs" element={<ViewStaffs />} />
        <Route path="/admin/details/ViewStatus" element={<ViewStatus />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}