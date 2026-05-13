# AI Receipt Intelligence

AI Receipt Intelligence is a simple web application that extracts structured receipt information using Gemini Vision AI and auto-fills an editable form for user review.

## Live Demo

Vercel Deployment:
https://ai-receipt-inky.vercel.app/

---

## Features

* Upload receipt image
* AI-powered receipt understanding using Gemini
* Auto-fill editable form
* Intelligent currency inference using receipt context
* Extract:

  * Merchant name
  * Date
  * Total amount
  * Currency
* Save submission history using localStorage

---

## Tech Stack

### Frontend

* React
* Vite
* CSS

### Backend

* Express.js
* Multer
* Gemini API

---

## AI Model Used

* Gemini 2.0 Flash

---

## Prompt Used

```text
Extract receipt information from this image.

Return ONLY valid JSON with this exact structure:

{
  "merchant_name": "",
  "date": "",
  "total_amount": "",
  "currency": ""
}

Rules:
- Extract merchant name, receipt date, total payable amount and currency.
- Infer the currency based on the receipt address, country, merchant location, phone number prefix or visible currency symbols if necessary.
- For Malaysia use MYR.
- For Singapore use SGD.
- For United States use USD.
- For United Kingdom use GBP.
- For Eurozone countries use EUR.
- For Japan use JPY.
- For Thailand use THB.
- For Indonesia use IDR.
- For Taiwan use TWD.
- Use ISO date format if possible: YYYY-MM-DD.
- Total amount should be the final payable amount.
- If a field is missing, return an empty string.
- Do not include explanation or markdown outside the JSON.
```

---

## How to Run Locally

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd AIReceipt
```

---

### 2. Backend Setup

```bash
cd server
npm install
```

Create `.env` file inside `/server`

```env
GEMINI_API_KEY=your_api_key_here
PORT=5000
```

Run backend:

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## Deployment

* Frontend deployed using Vercel
* Backend deployed using Render
