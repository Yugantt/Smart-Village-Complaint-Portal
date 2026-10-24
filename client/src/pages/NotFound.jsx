import React from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

function NotFound() {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <FaExclamationTriangle size={80} className="text-warning mb-4" />
      <h1 className="fw-bold text-dark mb-3">404 - Page Not Found</h1>
      <p className="text-muted mb-4 text-center" style={{ maxWidth: "400px" }}>
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary-custom px-4 py-2">
        Go Back to Home
      </Link>
    </div>
  );
}

export default NotFound;