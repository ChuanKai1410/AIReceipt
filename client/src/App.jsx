import { useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    merchant_name: "",
    date: "",
    total_amount: "",
    currency: "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setSubmitted(false);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const extractReceipt = async () => {
    if (!image) return alert("Please upload a receipt image first.");
    setLoading(true);

    try {
      const data = new FormData();
      data.append("receipt", image);

      const res = await axios.post(`${API_URL}/api/extract-receipt`, data);
      setFormData(res.data);
    } catch (error) {
      alert("Failed to extract receipt data.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const savedReceipts = JSON.parse(localStorage.getItem("receipts")) || [];
    savedReceipts.push({ ...formData, submitted_at: new Date().toISOString() });
    localStorage.setItem("receipts", JSON.stringify(savedReceipts));
    setSubmitted(true);
  };

  return (
    <main className="page">
      <section className="hero">
        <span className="badge">AI Intern Assessment</span>
        <h1>Receipt-to-Form Auto-Fill</h1>
        <p>
          Upload a receipt image and use Gemini AI to extract merchant name,
          date, total amount and currency into an editable form.
        </p>
      </section>

      <section className="app-card">
        <div className="left-panel">
          <h2>1. Upload Receipt</h2>

          <label className="upload-box">
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <span>Click to upload receipt image</span>
            <small>PNG, JPG or JPEG supported</small>
          </label>

          {preview ? (
            <img src={preview} alt="Receipt preview" className="preview" />
          ) : (
            <div className="empty-preview">Receipt preview will appear here</div>
          )}

          <button onClick={extractReceipt} disabled={loading}>
            {loading ? "Extracting with AI..." : "Extract Receipt Data"}
          </button>
        </div>

        <div className="right-panel">
          <h2>2. Review Extracted Data</h2>

          <form onSubmit={handleSubmit} className="form">
            <label>
              Merchant Name
              <input
                name="merchant_name"
                value={formData.merchant_name}
                onChange={handleChange}
                placeholder="e.g. Starbucks"
              />
            </label>

            <label>
              Date
              <input
                name="date"
                value={formData.date}
                onChange={handleChange}
                placeholder="YYYY-MM-DD"
              />
            </label>

            <label>
              Total Amount
              <input
                name="total_amount"
                value={formData.total_amount}
                onChange={handleChange}
                placeholder="e.g. 25.90"
              />
            </label>

            <label>
              Currency
              <input
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                placeholder="e.g. MYR"
              />
            </label>

            <button type="submit" className="submit-btn">
              Submit Reviewed Data
            </button>
          </form>

          {submitted && (
            <div className="success">
              Receipt data submitted successfully and saved to localStorage.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;