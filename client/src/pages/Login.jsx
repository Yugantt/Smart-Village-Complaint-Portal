import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";
import { setAuth } from "../utils/auth";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/api/auth/login", formData);
      if (response.data.success) {
        setAuth(response.data.token, response.data.user);
        toast.success("Login Successful!");
        const role = response.data.user.role;
        if (role === "admin" || role === "superadmin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="clean-card" style={{ maxWidth: "420px", width: "100%" }}>
        <div className="text-center mb-5">
          <h3 className="fw-bold text-dark">Welcome Back</h3>
          <p className="text-muted small">Login to access your dashboard</p>
        </div>
        {error && <div className="alert alert-danger rounded-2 p-2 small text-center">{error}</div>}
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="form-label fw-semibold small text-secondary">Email Address</label>
            <input type="email" className="form-control" name="email" placeholder="name@example.com" value={formData.email} onChange={onChange} required />
          </div>
          <div className="mb-5">
            <label className="form-label fw-semibold small text-secondary">Password</label>
            <input type="password" className="form-control" name="password" placeholder="Enter your password" value={formData.password} onChange={onChange} required />
          </div>
          <button type="submit" className="btn btn-primary-custom w-100 py-2" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        </form>
        <div className="mt-4 text-center">
          <small className="text-muted">Don't have an account? <Link to="/register" className="text-primary fw-bold text-decoration-none">Sign up</Link></small>
        </div>
      </div>
    </div>
  );
}

export default Login;