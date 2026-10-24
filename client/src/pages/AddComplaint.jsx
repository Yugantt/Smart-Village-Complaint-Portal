import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaMapMarkerAlt, FaUpload } from "react-icons/fa";
import api from "../api/axios";

function AddComplaint() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [image, setImage] = useState(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [village, setVillage] = useState("");
  const [ward, setWard] = useState("");
  const [landmark, setLandmark] = useState("");
  const [fileError, setFileError] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (category === "Other" && !otherCategory.trim()) {
      toast.error("Please specify the category name");
      return;
    }

    if (image && image.size > 1 * 1024 * 1024) {
      setFileError("Image size must be less than 1MB!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      if (category === "Other") formData.append("customCategory", otherCategory);
      formData.append("description", description);
      formData.append("village", village);
      formData.append("ward", ward);
      formData.append("landmark", landmark);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);
      if (image) formData.append("image", image);

      await api.post("/api/complaints", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Complaint Submitted Successfully!");
      navigate("/thank-you");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error submitting complaint";
      toast.error(errorMsg);
      if (errorMsg.includes("size") || errorMsg.includes("too large")) {
        setImage(null);
        setFileName("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError("");
    setFileName("");

    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        setFileError(`Image size is ${(file.size / (1024 * 1024)).toFixed(2)}MB. Maximum allowed is 1MB!`);
        setImage(null);
        e.target.value = "";
        return;
      }
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        setFileError("Only JPG, JPEG, PNG, GIF and WEBP images are allowed!");
        setImage(null);
        e.target.value = "";
        return;
      }
      setImage(file);
      setFileName(`Selected: ${file.name} (${(file.size / 1024).toFixed(0)}KB)`);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    toast.info("Fetching location... Please allow location access.");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        toast.success("Location fetched successfully!");
      },
      () => toast.error("Unable to fetch location. Please enter manually."),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="container mt-5 pt-4" style={{ maxWidth: "700px" }}>
      <div className="clean-card">
        <h3 className="fw-bold text-primary text-center mb-4">File a New Complaint</h3>
        <form onSubmit={submitHandler}>
          <div className="mb-3">
            <label className="fw-semibold small text-secondary">Complaint Title</label>
            <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Broken street light near temple" required maxLength="100" />
          </div>
          <div className="mb-3">
            <label className="fw-semibold small text-secondary">Detailed Description</label>
            <textarea className="form-control" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the issue in detail..." required maxLength="2000"></textarea>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="fw-semibold small text-secondary">Category</label>
              <select className="form-control" value={category} onChange={(e) => { setCategory(e.target.value); setOtherCategory(""); }} required>
                <option value="">Select Category</option>
                <option value="Water Supply">Water Supply</option>
                <option value="Road">Road</option>
                <option value="Electricity">Electricity</option>
                <option value="Sanitation">Sanitation</option>
                <option value="Street Light">Street Light</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {category === "Other" && (
              <div className="col-md-6 mb-3">
                <label className="fw-semibold small text-secondary">Specify Category</label>
                <input type="text" className="form-control" placeholder="Enter custom category" value={otherCategory} onChange={(e) => setOtherCategory(e.target.value)} required maxLength="50" />
              </div>
            )}
          </div>
          <div className="mb-3">
            <label className="fw-semibold small text-secondary">Upload Image (Max 1MB)</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><FaUpload className="text-muted" /></span>
              <input type="file" id="fileInput" ref={fileInputRef} className="form-control" onChange={handleFileChange} accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" />
            </div>
            {fileError && <div className="mt-2 text-danger small fw-bold">{fileError}</div>}
            {fileName && !fileError && <div className="mt-2 text-success small fw-bold">{fileName}</div>}
          </div>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="fw-semibold small text-secondary">Village</label>
              <input type="text" className="form-control" value={village} onChange={(e) => setVillage(e.target.value)} required maxLength="100" />
            </div>
            <div className="col-md-4 mb-3">
              <label className="fw-semibold small text-secondary">Ward Number</label>
              <input type="text" className="form-control" value={ward} onChange={(e) => setWard(e.target.value)} maxLength="50" />
            </div>
            <div className="col-md-4 mb-3">
              <label className="fw-semibold small text-secondary">Landmark</label>
              <input type="text" className="form-control" value={landmark} onChange={(e) => setLandmark(e.target.value)} maxLength="100" />
            </div>
          </div>
          <div className="mb-4">
            <button type="button" className="btn btn-primary-custom w-100" onClick={getCurrentLocation}><FaMapMarkerAlt className="me-2" /> Use My Current Location</button>
            <div className="row mt-3">
              <div className="col-6">
                <label className="fw-semibold small text-secondary mb-1">Latitude</label>
                <input type="text" className="form-control text-center" value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="e.g., 28.6139" />
              </div>
              <div className="col-6">
                <label className="fw-semibold small text-secondary mb-1">Longitude</label>
                <input type="text" className="form-control text-center" value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="e.g., 77.2090" />
              </div>
            </div>
          </div>
          <button className="btn btn-success-custom w-100 py-3" type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit Complaint"}</button>
        </form>
      </div>
    </div>
  );
}

export default AddComplaint;