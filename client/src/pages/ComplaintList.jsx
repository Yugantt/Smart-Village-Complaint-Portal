import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // ✅ Toastify import kiya
import { 
  FaSearch, FaTrash, FaMapMarkerAlt, FaEye, 
  FaUser, FaCalendarAlt, FaInfoCircle, FaHome, FaMapPin 
} from "react-icons/fa";

function ComplaintList() {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Ek page par 5 complaints dikhengi

  const API_BASE_URL = "http://localhost:5000";

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/api/complaints`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(res.data.complaints);
    } catch (err) {
      toast.error("Failed to load complaints.");
    }
  };

  // ✅ changeStatus mein adminRemark bhi bhejenge
  const changeStatus = async (id, status, remark = "") => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE_URL}/api/complaints/${id}/status`, { status, adminRemark: remark }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Status & Remark Updated!");
      fetchComplaints();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const deleteComplaint = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
    
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/complaints/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Complaint deleted successfully!");
      fetchComplaints();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || (c.citizen?.name && c.citizen.name.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    const matchesCategory = categoryFilter === "All" || c.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // ✅ Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredComplaints.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);

  return (
    <div className="container mt-5 pt-4">
      <h3 className="fw-bold text-primary mb-4 border-bottom pb-2">Manage All Complaints</h3>

      {/* Filters */}
      <div className="clean-card mb-4 py-3 px-4 d-flex flex-wrap gap-3 align-items-center">
        <div className="input-group" style={{ maxWidth: "300px" }}>
          <span className="input-group-text bg-white border-end-0"><FaSearch className="text-muted" /></span>
          <input type="text" className="form-control border-start-0" placeholder="Search title or citizen..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />
        </div>
        
        <select className="form-select" style={{ maxWidth: "150px" }} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select className="form-select" style={{ maxWidth: "150px" }} value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}>
          <option value="All">All Categories</option>
          <option value="Road">Road</option>
          <option value="Water Supply">Water Supply</option>
          <option value="Electricity">Electricity</option>
          <option value="Sanitation">Sanitation</option>
          <option value="Street Light">Street Light</option>
          <option value="Other">Other</option>
        </select>
        
        <button className="btn btn-outline-secondary ms-auto" onClick={() => { setSearch(""); setStatusFilter("All"); setCategoryFilter("All"); setCurrentPage(1); }}>Reset</button>
      </div>

      {/* Table */}
      <div className="clean-card p-0 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="py-3 px-3 text-secondary fw-semibold">Citizen</th>
                <th className="py-3 px-3 text-secondary fw-semibold">Title</th>
                <th className="py-3 px-3 text-secondary fw-semibold">Category</th>
                <th className="py-3 px-3 text-secondary fw-semibold">Status</th>
                <th className="py-3 px-3 text-secondary fw-semibold">Update Status</th>
                <th className="py-3 px-3 text-secondary fw-semibold text-center">View</th>
                <th className="py-3 px-3 text-secondary fw-semibold text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((c) => (
                  <tr key={c._id}>
                    <td className="py-3 px-3 fw-semibold">{c.citizen?.name || "Unknown"}</td>
                    <td className="py-3 px-3">{c.title}</td>
                    <td className="py-3 px-3">{c.category}</td>
                    <td className="py-3 px-3">
                      <span className={`badge px-2 py-1 ${c.status === "Resolved" ? "bg-success" : c.status === "Pending" ? "bg-warning text-dark" : "bg-primary"}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <select 
                        className="form-select form-select-sm border-secondary" 
                        style={{ width: "120px" }} 
                        value={c.status} 
                        // ✅ Yahan remark pass kiya taaki dropdown change karne par purana remark delete na ho
                        onChange={(e) => changeStatus(c._id, e.target.value, c.adminRemark)} 
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => setSelectedComplaint(c)} title="View Details">
                          <FaEye /> View
                        </button>
                        {c.location?.latitude && (
                          <a href={`https://www.google.com/maps?q=${c.location.latitude},${c.location.longitude}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-secondary" title="View Map">
                            <FaMapMarkerAlt />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button className="btn btn-sm btn-outline-danger" onClick={() => deleteComplaint(c._id)} title="Delete">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" className="text-center py-4 text-muted">No complaints found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Pagination Controls */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
            </li>
            {[...Array(totalPages)].map((_, i) => (
              <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
            </li>
          </ul>
        </div>
      )}

      {/* ADMIN VIEW DETAILS MODAL */}
      {selectedComplaint && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(15, 23, 42, 0.7)", zIndex: 1050, backdropFilter: "blur(4px)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3 overflow-hidden">
              
              <div className="modal-header bg-primary text-white border-0 py-3 px-4">
                <h5 className="modal-title fw-bold d-flex align-items-center">
                  <FaInfoCircle className="me-2" /> Complaint Details
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedComplaint(null)}></button>
              </div>

              <div className="modal-body p-0">
                <div className="row g-0">
                  
                  <div className="col-md-7 p-4 border-end">
                    <span className={`badge mb-3 px-3 py-2 ${selectedComplaint.status === "Resolved" ? "bg-success" : selectedComplaint.status === "Pending" ? "bg-warning text-dark" : "bg-primary"}`}>
                      Status: {selectedComplaint.status}
                    </span>
                    
                    <h3 className="fw-bold text-dark mb-3">{selectedComplaint.title}</h3>
                    
                    <div className="d-flex text-muted small mb-4">
                      <span className="me-4 d-flex align-items-center">
                        <FaUser className="me-1 text-primary" /> {selectedComplaint.citizen?.name || "Unknown"}
                      </span>
                      <span className="d-flex align-items-center">
                        <FaCalendarAlt className="me-1 text-primary" /> {new Date(selectedComplaint.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="mb-4">
                      <h6 className="fw-bold text-secondary mb-2">Category</h6>
                      <span className="badge bg-secondary fs-6 px-3 py-2 rounded-pill">
                        {selectedComplaint.category} 
                        {selectedComplaint.customCategory ? ` - ${selectedComplaint.customCategory}` : ""}
                      </span>
                    </div>

                    <div>
                      <h6 className="fw-bold text-secondary mb-2">Description</h6>
                      <div className="bg-light p-3 rounded-3 text-dark border" style={{ lineHeight: "1.6" }}>
                        {selectedComplaint.description}
                      </div>
                    </div>

                    {/* ✅ ADMIN REMARK INPUT BOX */}
                    <div className="mt-4">
                      <h6 className="fw-bold text-success mb-2">Admin Remark / Solution</h6>
                      <textarea 
                        className="form-control border-success" 
                        rows="2" 
                        placeholder="Write a solution or remark here..."
                        value={selectedComplaint.adminRemark || ""}
                        onChange={(e) => setSelectedComplaint({...selectedComplaint, adminRemark: e.target.value})}
                      ></textarea>
                      <button 
                        className="btn btn-sm btn-success mt-2 fw-bold" 
                        onClick={() => {
                          changeStatus(selectedComplaint._id, selectedComplaint.status, selectedComplaint.adminRemark);
                          setSelectedComplaint(null); // Modal band kar do
                        }}
                      >
                        Save Remark
                      </button>
                    </div>
                  </div>

                  <div className="col-md-5 p-4 bg-light">
                    <h6 className="fw-bold text-secondary mb-2">Attached Evidence</h6>
                    {selectedComplaint.image ? (
                      <div className="mb-4 text-center">
                        <img
                          src={`${API_BASE_URL}/${selectedComplaint.image.replace(/\\/g, "/")}`}
                          alt="Complaint"
                          className="img-fluid rounded-3 shadow-sm border"
                          style={{ maxHeight: "200px", width: "100%", objectFit: "cover" }}
                        />
                      </div>
                    ) : (
                      <div className="bg-white text-center p-4 rounded-3 text-muted mb-4 border shadow-sm">
                        No Image Uploaded
                      </div>
                    )}

                    <h6 className="fw-bold text-secondary mb-3">Location Details</h6>
                    <div className="bg-white p-3 rounded-3 border shadow-sm">
                      <div className="d-flex align-items-start mb-2">
                        <FaHome className="text-primary mt-1 me-2" />
                        <div>
                          <small className="text-muted d-block">Village</small>
                          <span className="fw-semibold">{selectedComplaint.village || "N/A"}</span>
                        </div>
                      </div>
                      
                      <div className="d-flex align-items-start mb-2">
                        <FaMapPin className="text-primary mt-1 me-2" />
                        <div>
                          <small className="text-muted d-block">Ward / Landmark</small>
                          <span className="fw-semibold">
                            {selectedComplaint.ward || "N/A"} 
                            {selectedComplaint.landmark ? `, ${selectedComplaint.landmark}` : ""}
                          </span>
                        </div>
                      </div>

                      <hr className="my-3" />

                      {selectedComplaint.location?.latitude && selectedComplaint.location?.longitude ? (
                        <a 
                          href={`https://www.google.com/maps?q=${selectedComplaint.location.latitude},${selectedComplaint.location.longitude}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-primary w-100 fw-bold"
                        >
                          <FaMapMarkerAlt className="me-2" /> Open in Google Maps
                        </a>
                      ) : (
                        <div className="text-center text-muted small py-2 bg-light rounded">
                          No GPS coordinates provided
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>

              <div className="modal-footer border-0 bg-white py-3 px-4">
                <button type="button" className="btn btn-secondary px-4 fw-bold" onClick={() => setSelectedComplaint(null)}>
                  Close Details
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ComplaintList;