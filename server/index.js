import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const allowedOrigins = [
  "http://localhost:5173",
  "https://ai-receipt-inky.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.options("*", cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("AI Receipt backend is running");
});

app.post("/api/extract-receipt", upload.single("receipt"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No receipt image uploaded." });
    }

    const base64Image = req.file.buffer.toString("base64");

    const prompt = `
Extract receipt information from this image.

Return ONLY valid JSON with this exact structure:
{
  "merchant_name": "",
  "date": "",
  "total_amount": "",
  "currency": ""
}

Rules:
- Use ISO date format if possible: YYYY-MM-DD
- Currency should be MYR, USD, SGD, etc.
- If a field is missing, return an empty string
- Do not include explanation or markdown
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: req.file.mimetype,
                data: base64Image,
              },
            },
          ],
        },
      ],
    });

    const text = response.text;
    const cleaned = text.replace(/```json|```/g, "").trim();
    const extractedData = JSON.parse(cleaned);

    res.json(extractedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to extract receipt data.",
    });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});