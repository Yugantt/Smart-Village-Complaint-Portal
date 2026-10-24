import React, { useEffect } from "react";

function PrivacyPolicy() {
  useEffect(() => {
    document.title = "Privacy Policy - Smart Village";
  }, []);

  return (
    <div className="container mt-5 pt-4 mb-5">
      <div className="clean-card">
        <h2 className="fw-bold text-primary mb-4 border-bottom pb-2">Privacy Policy</h2>
        <p className="text-muted">Last updated: October 2026</p>
        
        <h5 className="fw-bold mt-4">1. Information We Collect</h5>
        <p>We collect your name, email, phone number, and the details of the complaints you file, including images and location data.</p>

        <h5 className="fw-bold mt-4">2. How We Use Your Information</h5>
        <p>The information is solely used to process and resolve your complaints. Your data is accessible only to the authorized village administrators.</p>

        <h5 className="fw-bold mt-4">3. Data Security</h5>
        <p>We implement strict security measures to protect your personal data. Passwords are encrypted, and database access is restricted.</p>

        <h5 className="fw-bold mt-4">4. Contact Us</h5>
        <p>If you have any questions about this Privacy Policy, please contact us at support@smartvillage.gov.in.</p>
      </div>
    </div>
  );
}

export default PrivacyPolicy;