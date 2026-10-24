import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaLeaf, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { getToken, getUser, clearAuth, isAdmin } from "../utils/auth";

function Navbar() {
  const navigate = useNavigate();
  const token = getToken();
  const user = getUser();
  const adminStatus = isAdmin(user);

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <>
      <div className="top-bar text-center">
        <div className="container d-flex justify-content-between">
          <span>Government of India | Ministry of Rural Development</span>
          <span>Helpline: 1800-123-4567</span>
        </div>
      </div>

      <nav className="navbar navbar-expand-lg modern-navbar sticky-top">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to={adminStatus ? "/admin-dashboard" : "/"}>
            <FaLeaf size={24} className="me-2 text-success" />
            Smart Village
          </Link>

          <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              {(!token || user?.role === "citizen") && (
                <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
              )}

              {token && user ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to={adminStatus ? "/admin-dashboard" : "/user-dashboard"}>Dashboard</Link>
                  </li>
                  {user.role === "citizen" && (
                    <>
                      <li className="nav-item"><Link className="nav-link" to="/add-complaint">New Complaint</Link></li>
                      <li className="nav-item"><Link className="nav-link" to="/my-complaints">Track Status</Link></li>
                    </>
                  )}
                  {adminStatus && (
                    <>
                      <li className="nav-item"><Link className="nav-link" to="/complaints">Manage Complaints</Link></li>
                      <li className="nav-item"><Link className="nav-link" to="/users">Manage Users</Link></li>
                      <li className="nav-item"><Link className="nav-link" to="/admin-chats">Support Chats</Link></li>
                    </>
                  )}
                  <li className="nav-item ms-3">
                    <button className="btn btn-outline-danger btn-sm rounded-pill fw-bold px-4" onClick={handleLogout}>Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item"><Link className="nav-link d-flex align-items-center" to="/login"><FaSignInAlt className="me-2" /> Login</Link></li>
                  <li className="nav-item ms-2"><Link className="btn btn-primary-custom btn-sm d-flex align-items-center" to="/register"><FaUserPlus className="me-2" /> Register</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;