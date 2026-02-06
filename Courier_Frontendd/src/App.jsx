import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Components & Layout
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";

// General Pages
import Home from "./pages/Home";
import About from "./pages/About";

// Admin Section Components
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddStaff from "./pages/admin/AddStaff";
import AddMode from "./pages/admin/AddMode";
import AddStatus from "./pages/admin/AddStatus";
import DetailsDsh from "./pages/admin/details/DetailsDsh";
import ViewCostumers from "./pages/admin/details/ViewCostumers";
import ViewShipments from "./pages/admin/details/ViewShipments";
import ViewModes from "./pages/admin/details/ViewModes";
import ViewStaffs from "./pages/admin/details/ViewStaffs";
import ViewStatus from "./pages/admin/details/ViewStatus";
import AdminStats from "./pages/admin/AdminStats";
// Customer Section Components
import CustomerDsh from "./pages/customer/CustomerDsh";
import AddCustomer from "./pages/customer/AddCustomer"; 
import AddShipment from "./pages/customer/AddShipment";

// Staff Section Components
import StaffDsh from "./pages/Staff/StaffDsh";
import ViewShipment from "./pages/Staff/ViewShipment";

// Auth Components
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import ProfileSettings from "./auth/ProfileSettings";
import ForgotPassword from "./auth/ForgotPassword";
import SetNewPassword from "./auth/SetNewPassword";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="min-h-screen"> {/* Wrapper to keep footer at bottom */}
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ForgotPassword />} />
          <Route path="/set-new-password" element={<SetNewPassword />} />
      
          {/* PROTECTED ADMIN ROUTES */}
          <Route path="/admin/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/admin/AddStaff" element={<AddStaff />} />
          <Route path="/admin/AddMode" element={<AddMode />} />
          <Route path="/admin/AddStatus" element={<AddStatus />} />
          <Route path="/admin/stats" element={<AdminStats />} />
          {/* PROTECTED ADMIN DETAILS SECTION */}
          <Route path="/details" element={<DetailsDsh />} />
          <Route path="/admin/details/ViewCostumers" element={<ViewCostumers />} />
          <Route path="/admin/details/ViewShipments" element={<ViewShipments />} />
          <Route path="/admin/details/ViewModes" element={<ViewModes />} />
          <Route path="/admin/details/ViewStaffs" element={<ViewStaffs />} />
          <Route path="/admin/details/ViewStatus" element={<ViewStatus />} />

          {/* CUSTOMER ROUTES */}
          {/* Redirect base /customer to the dashboard */}
          <Route path="/customer" element={<Navigate to="/customer/dashboard" replace />} />
          <Route path="/customer/dashboard" element={<CustomerDsh />} />
          <Route path="/customer/AddCustomer" element={<AddCustomer />} />
          <Route path="/customer/AddShipment" element={<AddShipment />} />
          <Route path="/customer/settings" element={<ProfileSettings />} />

          {/* STAFF ROUTES */}
          <Route path="/staff" element={<StaffDsh />}>
            <Route path="shipments" element={<ViewShipment />} />
          </Route>

          {/* 404 - REDIRECT TO HOME IF ROUTE NOT FOUND */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}