import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from "react";

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
import AdminLogin from "./auth/AdminLogin"; // Added this import
import Signup from "./auth/Signup";
import ProfileSettings from "./auth/ProfileSettings";
import ForgotPassword from "./auth/ForgotPassword";
import SetNewPassword from "./auth/SetNewPassword";

// --- AUTH GUARD COMPONENT ---
const AdminGuard = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAdmin") === "true";
  
  console.log("Checking Auth:", isAuthenticated); // Add this line!

  if (!isAuthenticated) {
    console.log("Access Denied: Redirecting to Login");
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="min-h-screen"> 
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ForgotPassword />} />
          <Route path="/set-new-password" element={<SetNewPassword />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* PROTECTED ADMIN ROUTES */}
          {/* All routes starting with /admin/ are now wrapped in AdminGuard */}
          <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
          <Route path="/admin/stats" element={<AdminGuard><AdminStats /></AdminGuard>} />
          <Route path="/admin/AddStaff" element={<AdminGuard><AddStaff /></AdminGuard>} />
          <Route path="/admin/AddMode" element={<AdminGuard><AddMode /></AdminGuard>} />
          <Route path="/admin/AddStatus" element={<AdminGuard><AddStatus /></AdminGuard>} />
          
          {/* ADMIN DETAILS SUB-SECTION (PROTECTED) */}
          <Route path="/admin/details" element={<AdminGuard><DetailsDsh /></AdminGuard>} />
          <Route path="/admin/details/ViewCostumers" element={<AdminGuard><ViewCostumers /></AdminGuard>} />
          <Route path="/admin/details/ViewShipments" element={<AdminGuard><ViewShipments /></AdminGuard>} />
          <Route path="/admin/details/ViewModes" element={<AdminGuard><ViewModes /></AdminGuard>} />
          <Route path="/admin/details/ViewStaffs" element={<AdminGuard><ViewStaffs /></AdminGuard>} />
          <Route path="/admin/details/ViewStatus" element={<AdminGuard><ViewStatus /></AdminGuard>} />

          {/* CUSTOMER ROUTES */}
          <Route path="/customer" element={<Navigate to="/customer/dashboard" replace />} />
          <Route path="/customer/dashboard" element={<CustomerDsh />} />
          <Route path="/customer/AddCustomer" element={<AddCustomer />} />
          <Route path="/customer/AddShipment" element={<AddShipment />} />
          <Route path="/customer/settings" element={<ProfileSettings />} />

          {/* STAFF ROUTES */}
          <Route path="/staff" element={<StaffDsh />}>
            <Route path="shipments" element={<ViewShipment />} />
          </Route>

          {/* 404 - REDIRECT TO HOME */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}