import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // ✅ Toastify import kiya
import { FaUserShield, FaUser, FaCrown, FaArrowUp, FaArrowDown, FaTrash } from "react-icons/fa"; // ✅ FaTrash add kiya

function ViewUsers() {
  const API_BASE_URL = "http://localhost:5000";
  const [users, setUsers] = useState([]);

  // Check karo ki logged-in user Super Admin hai ya nahi
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isSuperAdmin = currentUser?.role === "superadmin";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(res.data.users);
    } catch (error) {
      toast.error("Failed to load users");
    }
  };

  // Promote / Demote karne ka function
  const handleRoleChange = async (userId, newRole, name) => {
    const confirmChange = window.confirm(`Are you sure you want to change ${name}'s role to ${newRole}?`);
    if (!confirmChange) return;

    try {
      await axios.put(
        `${API_BASE_URL}/api/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success(`User successfully changed to ${newRole}`); // ✅ Toast success
      fetchUsers(); // List refresh karo
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change role"); // ✅ Toast error
    }
  };

  // ✅ NAYA: User ko delete karne ka function
  const handleDeleteUser = async (userId, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to permanently delete ${name}? This cannot be undone.`);
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("User deleted successfully");
      fetchUsers(); // List refresh karo
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="container mt-5 pt-4">
      <h3 className="fw-bold text-primary mb-4 border-bottom pb-2">Registered Users</h3>
      
      <div className="clean-card p-0 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="py-3 px-4 text-secondary font-monospace">Name</th>
                <th className="py-3 px-4 text-secondary font-monospace">Email</th>
                <th className="py-3 px-4 text-secondary font-monospace">Role</th>
                
                {/* Action column sirf Super Admin ko dikhega */}
                {isSuperAdmin && (
                  <th className="py-3 px-4 text-secondary font-monospace text-center">Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="py-3 px-4 fw-semibold">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    {/* Teen alag-alag badges */}
                    {user.role === "superadmin" ? (
                      <span className="badge bg-danger px-3 py-2"><FaCrown className="me-1" /> Super Admin</span>
                    ) : user.role === "admin" ? (
                      <span className="badge bg-primary px-3 py-2"><FaUserShield className="me-1" /> Admin</span>
                    ) : (
                      <span className="badge bg-secondary px-3 py-2"><FaUser className="me-1" /> Citizen</span>
                    )}
                  </td>

                  {/* Action Buttons */}
                  {isSuperAdmin && (
                    <td className="py-3 px-4 text-center">
                      <div className="d-flex justify-content-center gap-2">
                        
                        {/* Promote Button */}
                        {user.role === "citizen" && (
                          <button 
                            className="btn btn-sm btn-success fw-bold"
                            onClick={() => handleRoleChange(user._id, "admin", user.name)}
                          >
                            <FaArrowUp className="me-1" /> Promote
                          </button>
                        )}
                        
                        {/* Demote Button */}
                        {user.role === "admin" && (
                          <button 
                            className="btn btn-sm btn-outline-danger fw-bold"
                            onClick={() => handleRoleChange(user._id, "citizen", user.name)}
                          >
                            <FaArrowDown className="me-1" /> Demote
                          </button>
                        )}

                        {/* ✅ Delete Button (Super Admin ko chhod kar sab par dikhega) */}
                        {user.role !== "superadmin" && (
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteUser(user._id, user.name)}
                            title="Delete User"
                          >
                            <FaTrash />
                          </button>
                        )}

                        {/* Super Admin ke aage kuch nahi dikhega */}
                        {user.role === "superadmin" && (
                          <span className="text-muted small fw-bold mt-2">—</span>
                        )}

                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ViewUsers;