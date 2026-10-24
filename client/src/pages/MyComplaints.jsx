import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaFolderOpen, FaEye, FaMapMarkerAlt, FaUser, FaCalendarAlt, FaInfoCircle, FaHome, FaMapPin } from "react-icons/fa";
import api from "../api/axios";
import { getToken } from "../utils/auth";

function MyComplaints() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    if (!getToken()) {
      toast.error("Please login first.");
      navigate("/login");
      return;
    }
    fetchMyComplaints();
  }, [navigate]);

  const fetchMyComplaints = async () => {
    try {
      const res = await api.get("/api/complaints/my");
      setComplaints(res.data.complaints);
    } catch (err) {
      toast.error("Unable to load complaints. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container mt-5 text-center fw-bold text-primary">Loading complaints...</div>;

  return (
    <div className="container mt-5 pt-4">
      <h3 className="fw-bold text-primary mb-4 border-bottom pb-2">My Complaints</h3>
      {complaints.length === 0 ? (
        <div className="clean-card text-center py-5">
          <FaFolderOpen size={60} className="text-muted mb-3" />
          <h4 className="fw-bold text-secondary">No complaints found.</h4>
          <p className="text-muted">You haven't filed any complaints yet.</p>
        </div>
      ) : (
        <div className="clean-card p-0 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="py-3 px-4 text-secondary fw-semibold">Title</th>
                  <th className="py-3 px-4 text-secondary fw-semibold">Category</th>
                  <th className="py-3 px-4 text-secondary fw-semibold">Status</th>
                  <th className="py-3 px-4 text-secondary fw-semibold">Date</th>
                  <th className="py-3 px-4 text-secondary fw-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c._id}>
                    <td className="py-3 px-4 fw-semibold">{c.title}</td>
                    <td className="py-3 px-4">{c.category}</td>
                    <td className="py-3 px-4">
                      <span className={c.status === "Resolved" ? "badge bg-success px-3 py-2" : c.status === "In Progress" ? "badge bg-warning text-dark px-3 py-2" : "badge bg-danger px-3 py-2"}>{c.status}</span>
                    </td>
                    <td className="py-3 px-4">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-center">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => setSelectedComplaint(c)}><FaEye className="me-1" /> View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedComplaint && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(15, 23, 42, 0.7)", zIndex: 1050, backdropFilter: "blur(4px)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3 overflow-hidden">
              <div className="modal-header bg-primary text-white border-0 py-3 px-4">
                <h5 className="modal-title fw-bold d-flex align-items-center"><FaInfoCircle className="me-2" /> Complaint Details</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedComplaint(null)}></button>
              </div>
              <div className="modal-body p-0">
                <div className="row g-0">
                  <div className="col-md-7 p-4 border-end">
                    <span className={`badge mb-3 px-3 py-2 ${selectedComplaint.status === "Resolved" ? "bg-success" : selectedComplaint.status === "Pending" ? "bg-warning text-dark" : "bg-primary"}`}>Status: {selectedComplaint.status}</span>
                    <h3 className="fw-bold text-dark mb-3">{selectedComplaint.title}</h3>
                    <div className="d-flex text-muted small mb-4">
                      <span className="me-4 d-flex align-items-center"><FaUser className="me-1 text-primary" /> {selectedComplaint.citizen?.name || "You"}</span>
                      <span className="d-flex align-items-center"><FaCalendarAlt className="me-1 text-primary" /> {new Date(selectedComplaint.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="mb-4">
                      <h6 className="fw-bold text-secondary mb-2">Category</h6>
                      <span className="badge bg-secondary fs-6 px-3 py-2 rounded-pill">{selectedComplaint.category} {selectedComplaint.customCategory ? ` - ${selectedComplaint.customCategory}` : ""}</span>
                    </div>
                    <div>
                      <h6 className="fw-bold text-secondary mb-2">Your Description</h6>
                      <div className="bg-light p-3 rounded-3 text-dark border" style={{ lineHeight: "1.6" }}>{selectedComplaint.description}</div>
                    </div>
                    {selectedComplaint.adminRemark && (
                      <div className="mt-4">
                        <h6 className="fw-bold text-success mb-2">Admin Remark / Solution</h6>
                        <div className="bg-success bg-opacity-10 p-3 rounded-3 text-dark border border-success" style={{ lineHeight: "1.6" }}>{selectedComplaint.adminRemark}</div>
                      </div>
                    )}
                  </div>
                  <div className="col-md-5 p-4 bg-light">
                    <h6 className="fw-bold text-secondary mb-2">Attached Evidence</h6>
                    {selectedComplaint.image ? (
                      <div className="mb-4 text-center">
                        <img src={`${process.env.REACT_APP_API_URL}/${selectedComplaint.image.replace(/\\/g, "/")}`} alt="Complaint" className="img-fluid rounded-3 shadow-sm border" style={{ maxHeight: "200px", width: "100%", objectFit: "cover" }} />
                      </div>
                    ) : (
                      <div className="bg-white text-center p-4 rounded-3 text-muted mb-4 border shadow-sm">No Image Uploaded</div>
                    )}
                    <h6 className="fw-bold text-secondary mb-3">Location Details</h6>
                    <div className="bg-white p-3 rounded-3 border shadow-sm">
                      <div className="d-flex align-items-start mb-2">
                        <FaHome className="text-primary mt-1 me-2" />
                        <div><small className="text-muted d-block">Village</small><span className="fw-semibold">{selectedComplaint.village || "N/A"}</span></div>
                      </div>
                      <div className="d-flex align-items-start mb-2">
                        <FaMapPin className="text-primary mt-1 me-2" />
                        <div><small className="text-muted d-block">Ward / Landmark</small><span className="fw-semibold">{selectedComplaint.ward || "N/A"}{selectedComplaint.landmark ? `, ${selectedComplaint.landmark}` : ""}</span></div>
                      </div>
                      <hr className="my-3" />
                      {selectedComplaint.location?.latitude && selectedComplaint.location?.longitude ? (
                        <a href={`https://www.google.com/maps?q=${selectedComplaint.location.latitude},${selectedComplaint.location.longitude}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary w-100 fw-bold"><FaMapMarkerAlt className="me-2" /> Open in Google Maps</a>
                      ) : (
                        <div className="text-center text-muted small py-2 bg-light rounded">No GPS coordinates provided</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 bg-white py-3 px-4">
                <button type="button" className="btn btn-secondary px-4 fw-bold" onClick={() => setSelectedComplaint(null)}>Close Details</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyComplaints;