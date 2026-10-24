import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaFileAlt, FaMapMarkerAlt, FaSearch, FaArrowRight, FaUsers, FaCheckCircle, FaClock, FaClipboardList } from "react-icons/fa";

function Home() {
  const navigate = useNavigate();
  const API_BASE_URL = "http://localhost:5000";

  // ✅ Real Stats ke liye state
  const [stats, setStats] = useState({
    totalComplaints: 0,
    resolvedComplaints: 0,
    pendingComplaints: 0,
    totalUsers: 0
  });

  useEffect(() => {
    document.title = "Smart Village Complaint Portal | Home";
    
    // ✅ Backend se stats fetch karo
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/public/stats`);
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (error) {
        console.log("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  const handleComplaint = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to register a complaint.");
      navigate("/login");
      return;
    }
    navigate("/add-complaint");
  };

  const handleTrack = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to track your complaints.");
      navigate("/login");
      return;
    }
    navigate("/my-complaints");
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container text-center">
          <h1 className="hero-title mb-3">SMART VILLAGE</h1>
          <p className="hero-subtitle mb-5">
            A digital initiative bridging the gap between citizens and administration. Report issues, track progress, and build a better tomorrow.
          </p>
          
          <button className="btn btn-success-custom btn-lg d-inline-flex align-items-center shadow" onClick={handleComplaint}>
            Register a Complaint <FaArrowRight className="ms-2" />
          </button>

          {/* ✅ UPDATED: Dynamic Glass Cards */}
          <div className="row justify-content-center g-4 mt-5">
            <div className="col-6 col-md-3">
              <div className="glass-card">
                <FaClipboardList size={30} className="mb-2 text-warning" />
                <h3>{stats.totalComplaints}</h3>
                <p>Total Complaints</p>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="glass-card">
                <FaCheckCircle size={30} className="mb-2 text-success" />
                <h3>{stats.resolvedComplaints}</h3>
                <p>Resolved</p>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="glass-card">
                <FaClock size={30} className="mb-2 text-danger" />
                <h3>{stats.pendingComplaints}</h3>
                <p>Pending</p>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="glass-card">
                <FaUsers size={30} className="mb-2 text-info" />
                <h3>{stats.totalUsers}</h3>
                <p>Total Users</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="container mt-5 pt-4">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-dark">Our Services</h2>
          <p className="text-muted">Simple steps to get your village issues resolved</p>
        </div>
        
        <div className="row g-4">
          <div className="col-md-4">
            <div className="service-card text-center h-100">
              <div className="icon-wrapper bg-primary bg-opacity-10 text-primary">
                <FaFileAlt size={35} />
              </div>
              <h4 className="fw-bold mb-3">File a Complaint</h4>
              <p className="text-muted mb-4">Report issues related to Roads, Water, Electricity, and Sanitation directly.</p>
              <button className="btn btn-primary-custom w-100" onClick={handleComplaint}>Register Now</button>
            </div>
          </div>

          <div className="col-md-4">
            <div className="service-card text-center h-100">
              <div className="icon-wrapper bg-danger bg-opacity-10 text-danger">
                <FaMapMarkerAlt size={35} />
              </div>
              <h4 className="fw-bold mb-3">Pin Location</h4>
              <p className="text-muted mb-4">Provide the exact GPS location of the issue for faster action by local authorities.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="service-card text-center h-100">
              <div className="icon-wrapper bg-success bg-opacity-10 text-success">
                <FaSearch size={35} />
              </div>
              <h4 className="fw-bold mb-3">Track Status</h4>
              <p className="text-muted mb-4">Monitor the real-time progress of your complaints from pending to resolved.</p>
              <button className="btn btn-outline-dark w-100 fw-bold" onClick={handleTrack}>Track Now</button>
            </div>
          </div>
        </div>
      </div>

      {/* Internal Links */}
      <div className="container mt-5">
        <div className="row justify-content-center text-center">
          <div className="col-md-8">
            <h5 className="text-muted mb-3">
              Have questions? Read our <Link to="/faq" className="text-primary fw-bold text-decoration-none">FAQs</Link> or check our <Link to="/privacy-policy" className="text-primary fw-bold text-decoration-none">Privacy Policy</Link>.
            </h5>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="container mt-4 mb-5 pt-4">
        <div className="info-card border-start border-5 border-success">
          <h4 className="fw-bold mb-3">About the Initiative</h4>
          <p className="text-muted mb-0" style={{lineHeight: "1.8"}}>
            The Smart Village Portal is a digital initiative aimed at bridging the gap between rural citizens and local administration. 
            By providing a transparent platform to log grievances, we ensure that every issue is tracked, addressed, and resolved efficiently. 
            Your voice matters, and we are here to listen.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;