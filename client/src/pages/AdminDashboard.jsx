import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaClipboardList, FaCheckCircle, FaClock, FaSpinner, FaUsers, FaTrash, FaUserPlus } from "react-icons/fa";
import Charts from "../components/Charts";
import api from "../api/axios";
import { getUser } from "../utils/auth";

function AdminDashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const isSuperAdmin = user?.role === "superadmin";

  const [stats, setStats] = useState({ total: 0, pending: 0, progress: 0, resolved: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const complaintRes = await api.get("/api/complaints");
      const complaints = complaintRes.data.complaints || [];

      const userRes = await api.get("/api/admin/users");
      const users = userRes.data.users || [];

      setStats({
        pending: complaints.filter(c => c.status === "Pending").length,
        progress: complaints.filter(c => c.status === "In Progress").length,
        resolved: complaints.filter(c => c.status === "Resolved").length,
        total: complaints.length,
        users: users.length,
      });
    } catch (err) {
      toast.error("Error loading dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container mt-5 text-center fw-bold text-primary">Loading Dashboard...</div>;

  return (
    <div className="container mt-5 pt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <h2 className="fw-bold text-primary mb-0">{isSuperAdmin ? "Super Admin Dashboard" : "Admin Dashboard"}</h2>
          <p className="text-muted mb-0">Welcome back, {user?.name}</p>
        </div>
        <div className="text-end"><small className="text-muted d-block">{new Date().toLocaleDateString()}</small></div>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-lg-3 col-md-6">
          <div className="clean-card d-flex align-items-center p-3">
            <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3"><FaClipboardList size={28} className="text-primary" /></div>
            <div><h6 className="text-muted mb-1 fw-bold">Total Complaints</h6><h3 className="fw-bold mb-0">{stats.total}</h3></div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="clean-card d-flex align-items-center p-3">
            <div className="bg-warning bg-opacity-10 rounded-circle p-3 me-3"><FaClock size={28} className="text-warning" /></div>
            <div><h6 className="text-muted mb-1 fw-bold">Pending</h6><h3 className="fw-bold mb-0">{stats.pending}</h3></div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="clean-card d-flex align-items-center p-3">
            <div className="bg-info bg-opacity-10 rounded-circle p-3 me-3"><FaSpinner size={28} className="text-info" /></div>
            <div><h6 className="text-muted mb-1 fw-bold">In Progress</h6><h3 className="fw-bold mb-0">{stats.progress}</h3></div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="clean-card d-flex align-items-center p-3">
            <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3"><FaCheckCircle size={28} className="text-success" /></div>
            <div><h6 className="text-muted mb-1 fw-bold">Resolved</h6><h3 className="fw-bold mb-0">{stats.resolved}</h3></div>
          </div>
        </div>
      </div>

      <h4 className="fw-bold text-secondary mb-3">Quick Actions</h4>
      <div className="row g-3 mb-5">
        <div className={isSuperAdmin ? "col-md-3" : "col-md-4"}>
          <button className="btn btn-primary-custom w-100 py-3 d-flex flex-column align-items-center" onClick={() => navigate("/complaints")}><FaClipboardList size={24} className="mb-2" /> Manage Complaints</button>
        </div>
        <div className={isSuperAdmin ? "col-md-3" : "col-md-4"}>
          <button className="btn btn-outline-primary w-100 py-3 d-flex flex-column align-items-center fw-bold" onClick={() => navigate("/users")}><FaUsers size={24} className="mb-2" /> View Users ({stats.users})</button>
        </div>
        {isSuperAdmin && (
          <div className="col-md-3">
            <button className="btn btn-success-custom w-100 py-3 d-flex flex-column align-items-center" onClick={() => navigate("/users")}><FaUserPlus size={24} className="mb-2" /> Create Admin</button>
          </div>
        )}
        <div className={isSuperAdmin ? "col-md-3" : "col-md-4"}>
          <button className="btn btn-outline-danger w-100 py-3 d-flex flex-column align-items-center fw-bold" onClick={() => navigate("/deleted-complaints")}><FaTrash size={24} className="mb-2" /> Deleted History</button>
        </div>
      </div>

      <div className="mt-5">
        <h4 className="fw-bold text-secondary mb-3">Analytics Overview</h4>
        <Charts />
      </div>
    </div>
  );
}

export default AdminDashboard;