import { useState } from "react";
import axios from "axios";
import "./App.css";

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

      const res = await axios.post(
        "http://localhost:5000/api/extract-receipt",
        data
      );

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

    const savedReceipts = JSON.parse(localStorage.getItem("receipts")) || [];
    savedReceipts.push(formData);
    localStorage.setItem("receipts", JSON.stringify(savedReceipts));

    setSubmitted(true);
  };

  return (
    <main className="container">
      <section className="card">
        <h1>AI Receipt Auto-Fill</h1>
        <p className="subtitle">
          Upload a receipt image and let AI extract the key details.
        </p>

        <div className="upload-box">
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        {preview && (
          <img src={preview} alt="Receipt preview" className="preview" />
        )}

        <button onClick={extractReceipt} disabled={loading}>
          {loading ? "Extracting..." : "Extract Receipt Data"}
        </button>

        <form onSubmit={handleSubmit} className="form">
          <label>
            Merchant Name
            <input
              name="merchant_name"
              value={formData.merchant_name}
              onChange={handleChange}
            />
          </label>

          <label>
            Date
            <input
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </label>

          <label>
            Total Amount
            <input
              name="total_amount"
              value={formData.total_amount}
              onChange={handleChange}
            />
          </label>

          <label>
            Currency
            <input
              name="currency"
              value={formData.currency}
              onChange={handleChange}
            />
          </label>

          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>

        {submitted && (
          <p className="success">
            Receipt data submitted and saved locally.
          </p>
        )}
      </section>
    </main>
  );
}

export default App;