import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import { getUser, isAdmin } from "./utils/auth";
import "./App.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ThankYou from "./pages/ThankYou";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import FAQ from "./pages/FAQ";
import UserDashboard from "./pages/UserDashboard";
import AddComplaint from "./pages/AddComplaint";
import MyComplaints from "./pages/MyComplaints";
import AdminDashboard from "./pages/AdminDashboard";
import ComplaintList from "./pages/ComplaintList";
import ViewUsers from "./pages/ViewUsers";
import DeletedComplaints from "./pages/DeletedComplaints";
import ManageChats from "./pages/ManageChats";

function AppLayout() {
  const user = getUser();
  const adminStatus = isAdmin(user);

  return (
    <div className="App">
      <ScrollToTop />
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          <Route path="/user-dashboard" element={<ProtectedRoute allowedRoles={["citizen"]}><UserDashboard /></ProtectedRoute>} />
          <Route path="/add-complaint" element={<ProtectedRoute allowedRoles={["citizen", "admin", "superadmin"]}><AddComplaint /></ProtectedRoute>} />
          <Route path="/my-complaints" element={<ProtectedRoute allowedRoles={["citizen"]}><MyComplaints /></ProtectedRoute>} />

          <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={["admin", "superadmin"]}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/complaints" element={<ProtectedRoute allowedRoles={["admin", "superadmin"]}><ComplaintList /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute allowedRoles={["admin", "superadmin"]}><ViewUsers /></ProtectedRoute>} />
          <Route path="/deleted-complaints" element={<ProtectedRoute allowedRoles={["admin", "superadmin"]}><DeletedComplaints /></ProtectedRoute>} />
          <Route path="/admin-chats" element={<ProtectedRoute allowedRoles={["admin", "superadmin"]}><ManageChats /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {!adminStatus && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
        <AppLayout />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;