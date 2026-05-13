# AI Receipt Auto-Fill Web App

This project is a simple AI-powered web app that extracts key fields from a receipt image and auto-fills a reviewable form.

## Features

- Upload receipt image
- Extract receipt details using Gemini Vision API
- Auto-fill editable form
- Submit extracted data
- Save submitted records to localStorage

## Fields Extracted

- Merchant name
- Date
- Total amount
- Currency

## Tech Stack

- React + Vite
- Express.js
- Gemini API
- LocalStorage

## Prompt Used

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

## How to Run

### Backend

```bash
cd server
npm install
npm run dev