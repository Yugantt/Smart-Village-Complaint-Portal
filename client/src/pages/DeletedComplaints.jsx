import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // ✅ Toastify import

function DeletedComplaints() {
  const API_BASE_URL = "http://localhost:5000"; // ✅ Localhost URL

  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchDeletedComplaints();
  }, []);

  const fetchDeletedComplaints = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/complaints/deleted`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setComplaints(res.data.complaints);
    } catch (err) {
      toast.error("Failed to load deleted complaints"); // ✅ Toast
    }
  };

  return (
    <div className="container mt-5 pt-4">
      <h3 className="fw-bold text-danger mb-4 border-bottom pb-2">Deleted Complaints History</h3>

      <div className="clean-card p-0 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="py-3 px-4 text-secondary font-monospace">Citizen</th>
                <th className="py-3 px-4 text-secondary font-monospace">Title</th>
                <th className="py-3 px-4 text-secondary font-monospace">Category</th>
                <th className="py-3 px-4 text-secondary font-monospace">Deleted By</th>
                <th className="py-3 px-4 text-secondary font-monospace">Deleted On</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c._id}>
                  <td className="py-3 px-4 fw-semibold">{c.citizen?.name || "Unknown"}</td>
                  <td className="py-3 px-4">{c.title}</td>
                  <td className="py-3 px-4">{c.category}</td>
                  <td className="py-3 px-4">{c.deletedBy?.name || "Unknown"}</td>
                  <td className="py-3 px-4">{new Date(c.deletedAt).toLocaleString()}</td>
                </tr>
              ))}
              {complaints.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">No deleted complaints found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DeletedComplaints;