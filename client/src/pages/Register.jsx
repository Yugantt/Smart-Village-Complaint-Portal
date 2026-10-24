import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) return setError("Invalid Email Format.");

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(form.phone)) return setError("Phone number must be exactly 10 digits.");

    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(form.name)) return setError("Name should only contain alphabets.");

    setLoading(true);
    try {
      const res = await api.post("/api/auth/register", form);
      toast.success(res.data.message);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "85vh" }}>
      <div className="clean-card" style={{ maxWidth: "500px", width: "100%" }}>
        <div className="text-center mb-5">
          <h3 className="fw-bold text-dark">Create an Account</h3>
          <p className="text-muted small">Join the Smart Village initiative</p>
        </div>
        {error && <div className="alert alert-danger rounded-2 p-2 small text-center">{error}</div>}
        <form onSubmit={handleRegister}>
          <div className="row">
            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold small text-secondary">Full Name</label>
              <input type="text" name="name" className="form-control" placeholder="John Doe" value={form.name} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold small text-secondary">Phone Number</label>
              <input type="text" name="phone" className="form-control" placeholder="10 digit number" value={form.phone} onChange={handleChange} required maxLength="10" />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold small text-secondary">Email Address</label>
            <input type="email" name="email" className="form-control" placeholder="name@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="mb-5">
            <label className="form-label fw-semibold small text-secondary">Password</label>
            <input type="password" name="password" className="form-control" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required minLength="6" />
          </div>
          <button type="submit" className="btn btn-success-custom w-100 py-2" disabled={loading}>{loading ? "Creating Account..." : "Register"}</button>
        </form>
        <div className="mt-4 text-center">
          <small className="text-muted">Already registered? <Link to="/login" className="text-success fw-bold text-decoration-none">Login here</Link></small>
        </div>
      </div>
    </div>
  );
}

export default Register;