import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

function ThankYou() {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <FaCheckCircle size={80} className="text-success mb-4" />
      <h1 className="fw-bold text-dark mb-3">Thank You!</h1>
      <p className="text-muted mb-4 text-center" style={{ maxWidth: "500px" }}>
        Your complaint has been successfully registered. Our team will look into it shortly.
      </p>
      <div className="d-flex gap-3">
        <Link to="/my-complaints" className="btn btn-primary-custom px-4 py-2">
          View My Complaints
        </Link>
        <Link to="/" className="btn btn-outline-secondary px-4 py-2 fw-bold">
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default ThankYou;