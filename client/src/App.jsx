import { useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("receipts")) || [];
    } catch {
      return [];
    }
  });

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

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const extractReceipt = async () => {
    if (!image) {
      alert("Please upload a receipt image first.");
      return;
    }

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newReceipt = {
      ...formData,
      submitted_at: new Date().toLocaleString(),
    };

    const updatedHistory = [newReceipt, ...history];

    localStorage.setItem("receipts", JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
    setSubmitted(true);
  };

  const clearHistory = () => {
    localStorage.removeItem("receipts");
    setHistory([]);
  };

  return (
    <main className="page">
      <section className="hero">
        <span className="badge">✨ Powered by Gemini AI</span>

        <h1>AI Receipt Intelligence</h1>

        <p>
          Extract structured receipt data instantly using Gemini Vision AI.
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

      <section className="history-section">
        <div className="history-header">
          <div>
            <h2>Recent Submissions</h2>
            <p>Submitted receipt records saved locally in your browser.</p>
          </div>

          {history.length > 0 && (
            <button className="clear-btn" onClick={clearHistory}>
              Clear History
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="empty-history">
            No submitted receipts yet.
          </div>
        ) : (
          <div className="history-grid">
            {history.map((item, index) => (
              <div className="history-modern-card" key={index}>
                <div className="history-top">
                  <div className="merchant-avatar">
                    {item.merchant_name
                      ? item.merchant_name.charAt(0).toUpperCase()
                      : "R"}
                  </div>

                  <div className="merchant-info">
                    <h3>{item.merchant_name || "Unknown Merchant"}</h3>

                    <p>{item.submitted_at}</p>
                  </div>
                </div>

                <div className="history-divider"></div>

                <div className="history-bottom">
                  <div className="history-stat">
                    <span>Currency</span>
                    <strong>{item.currency || "N/A"}</strong>
                  </div>

                  <div className="history-stat">
                    <span>Total</span>
                    <strong>{item.total_amount || "0.00"}</strong>
                  </div>

                  <div className="history-stat">
                    <span>Date</span>
                    <strong>{item.date || "N/A"}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;