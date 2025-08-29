
# 📄 DocSum – AI-powered Document Summarizer

**DocSum** is an intelligent full-stack web application that extracts, analyzes, and summarizes content from multiple document formats. Powered by **Google Gemini API** for advanced AI-based summarization and **Tesseract.js** for robust OCR, it transforms lengthy documents into concise **summaries, key points, main ideas, and improvement suggestions**.

---

## ✨ Features

- **📂 Multi-Format Support** – Upload PDFs, Word documents, Excel sheets, text files, and images.
- **🔎 Advanced OCR** – Extracts text from scanned files & images using **Tesseract.js**.
- **🧠 AI-Powered Summarization** – Generates:
  - **Summaries** (short, medium, long)
  - **Key points**
  - **Main ideas**
  - **Improvement suggestions**
- **⚡ Smart API Handling** – Uses multiple Gemini API keys with **auto-fallback** when a key hits its rate limit.
- **🔐 Secure Architecture** – API keys are protected in the backend; the frontend only communicates with the server.
- **📊 Process Status Tracking** – Real-time progress indicators for every stage of document processing.

---

## 🖼️ Screenshots

### 🔹 Processing Status
<img src="https://github.com/user-attachments/assets/6fe5f988-ad28-4f1f-b414-e67088ff9dd4" width="800" alt="DocSum Processing" />

### 🔹 Summaries, Key Points, Main Ideas & Improvements
<img src="https://github.com/user-attachments/assets/616ec819-7706-4333-9931-ea06a41782d4" width="800" alt="DocSum Results" />

### 🔹 Full UI
<img src="https://github.com/user-attachments/assets/d35f5214-e955-4632-b957-c0141705108f" width="800" alt="DocSum App UI" />

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React + Vite + TypeScript  
- **Styling:** Tailwind CSS  
- **UI/UX Enhancements:**  
  - `lucide-react` – icons  
  - `react-dropzone` – drag & drop uploads  
  - `framer-motion` – animations  
- **Document Parsing:**  
  - `tesseract.js` – OCR for images & scans  
  - `pdfjs-dist` – PDF parsing  
  - `mammoth` & `xlsx` – Word & Excel parsing  
- **API Communication:** `axios`  

### Backend
- **Framework:** Node.js + Express.js  
- **Middleware:** `cors`  
- **AI Integration:** `@google/generative-ai` SDK (Gemini API)  
- **Configuration:** `dotenv` (secure env management)  

---

## 🚀 Getting Started

### ✅ Prerequisites
- Node.js **v18+**
- npm (or yarn/pnpm)
- At least **one Google Gemini API key**

---

### 🔧 Installation

1. **Clone Repository**
```bash
git clone https://github.com/Untolders/docsum.git
cd docsum
````

2. **Backend Setup**

```bash
cd backend
npm install
```

3. **Frontend Setup**

```bash
cd frontend
npm install
```

4. **Environment Variables**

* **Backend (`/backend/.env`)**

```env
FRONTEND_URL="YOUR_FRONTEND_URL"
GEMINI_API_KEY_1="YOUR_FIRST_GEMINI_API_KEY"
GEMINI_API_KEY_2="YOUR_SECOND_GEMINI_API_KEY"
```

* **Frontend (`/frontend/.env.local`)**

```env
VITE_BACKEND_URL="http://localhost:3001"
```

---

### ▶️ Running the Application

1. **Start Backend**

```bash
cd backend
npm start
```

Server runs at: `http://localhost:3001` ✅

2. **Start Frontend**

```bash
cd frontend
npm run dev
```

Frontend runs at: `http://localhost:5173` 🚀

Now, upload documents and generate AI-powered summaries!

---

## 📜 Available Scripts

### Backend

* `npm start` – Run Express server

### Frontend

* `npm run dev` – Start dev server (HMR enabled)
* `npm run build` – Build for production
* `npm run preview` – Preview production build locally
* `npm run lint` – Run ESLint checks

---
## 🌐 Live Demo
[DocSum Live Demo ↗️](https://doc-sum-td55.vercel.app/)


---

## 📌 Roadmap / Future Enhancements

* 🗂️ Export summaries in multiple formats (PDF, DOCX, TXT)
* 🌍 Multi-language support for OCR & summarization
* 🔐 User authentication & history of processed files

---


