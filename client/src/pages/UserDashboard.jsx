import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFileAlt, FaClipboardList, FaSignOutAlt, FaLeaf } from "react-icons/fa";

function UserDashboard() {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="container mt-5 pt-4">
      {/* Header */}
      <div className="text-center mb-5">
        <h2 className="fw-bold text-primary d-flex justify-content-center align-items-center">
          <FaLeaf className="me-2 text-success" /> Citizen Dashboard
        </h2>
        <p className="text-muted">Manage your complaints and track their progress</p>
      </div>

      <div className="row justify-content-center g-4">
        {/* Register Complaint Card */}
        <div className="col-md-4">
          <div className="clean-card text-center h-100">
            <div className="bg-light rounded-circle d-inline-flex justify-content-center align-items-center mb-4" style={{ width: "80px", height: "80px" }}>
              <FaFileAlt size={35} className="text-primary" />
            </div>
            <h4 className="fw-bold mb-3">Register Complaint</h4>
            <p className="text-muted mb-4">Submit a new complaint regarding any village issue.</p>
            <Link to="/add-complaint" className="btn btn-success-custom w-100">
              Add Complaint
            </Link>
          </div>
        </div>

        {/* My Complaints Card */}
        <div className="col-md-4">
          <div className="clean-card text-center h-100">
            <div className="bg-light rounded-circle d-inline-flex justify-content-center align-items-center mb-4" style={{ width: "80px", height: "80px" }}>
              <FaClipboardList size={35} className="text-success" />
            </div>
            <h4 className="fw-bold mb-3">My Complaints</h4>
            <p className="text-muted mb-4">View all complaints submitted by you and track their status.</p>
            <Link to="/my-complaints" className="btn btn-primary-custom w-100">
              View Complaints
            </Link>
          </div>
        </div>

        {/* Logout Card */}
        <div className="col-md-4">
          <div className="clean-card text-center h-100">
            <div className="bg-light rounded-circle d-inline-flex justify-content-center align-items-center mb-4" style={{ width: "80px", height: "80px" }}>
              <FaSignOutAlt size={35} className="text-danger" />
            </div>
            <h4 className="fw-bold mb-3">Logout</h4>
            <p className="text-muted mb-4">Securely logout from your account.</p>
            <button onClick={logoutHandler} className="btn btn-outline-danger w-100 fw-bold">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;