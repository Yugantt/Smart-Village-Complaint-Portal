import { Link, useNavigate } from "react-router-dom";
import { FaLeaf, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { getToken, getUser, clearAuth } from "../utils/auth";

function Footer() {
  const navigate = useNavigate();
  const token = getToken();
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <footer className="modern-footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="d-flex align-items-center"><FaLeaf className="me-2 text-success" /> Smart Village</h5>
            <p style={{ fontSize: "14px", lineHeight: "1.6" }}>
              A digital initiative by the Ministry of Rural Development to empower citizens. Report grievances, track progress, and help build a better village.
            </p>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <h5>Quick Links</h5>
            <Link to="/">Home</Link>
            {!token && (<><Link to="/login">Login</Link><Link to="/register">Register</Link></>)}
            {token && user?.role === "citizen" && (
              <>
                <Link to="/user-dashboard">My Dashboard</Link>
                <Link to="/add-complaint">File a Complaint</Link>
                <Link to="/my-complaints">Track Status</Link>
                <button className="footer-btn" onClick={handleLogout}>Logout</button>
              </>
            )}
            {token && (user?.role === "admin" || user?.role === "superadmin") && (
              <>
                <Link to="/admin-dashboard">Admin Dashboard</Link>
                <Link to="/complaints">Manage Complaints</Link>
                <Link to="/users">Manage Users</Link>
                <button className="footer-btn" onClick={handleLogout}>Logout</button>
              </>
            )}
          </div>

          <div className="col-lg-2 col-md-6 mb-4">
            <h5>Support</h5>
            <Link to="/faq">FAQs</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <h5>Contact Us</h5>
            <p style={{ fontSize: "14px", marginBottom: "8px" }}><FaMapMarkerAlt className="me-2 text-success" /> Ministry of Rural Development, New Delhi</p>
            <p style={{ fontSize: "14px", marginBottom: "8px" }}><FaPhoneAlt className="me-2 text-success" /> Helpline: 1800-123-4567</p>
            <p style={{ fontSize: "14px", marginBottom: "8px" }}><FaEnvelope className="me-2 text-success" /> support@smartvillage.gov.in</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="mb-0">&copy; {new Date().getFullYear()} Smart Village Portal | Government of India. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;