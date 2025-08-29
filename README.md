
-----

# DocSum - AI-powered Document Summarizer

**DocSum** is an intelligent web application designed to extract and summarize content from a wide variety of document formats. Using the power of the Google Gemini API for advanced AI analysis and Tesseract.js for robust Optical Character Recognition (OCR), DocSum transforms lengthy documents into concise summaries, key points, and main ideas.

-----

## ✨ Key Features

  - **Multi-Format Support**: Upload and process a wide range of file types including PDF, DOCX, XLSX, TXT, and various image formats.
  - **Advanced OCR**: Built-in OCR powered by Tesseract.js to extract text from scanned documents and images.
  - **Intelligent Summarization**: Leverages the Google Gemini API to generate summaries in **short, medium, and long** formats, along with **key points** and **main ideas**.
  - **Resilient API Integration**: Supports a dynamic array of multiple Gemini API keys, automatically falling back to the next key if one hits its rate limit.
  - **Secure Architecture**: Features a separate Node.js backend to securely manage API keys and a modern React frontend for a seamless user experience.

-----

## 🛠️ Technology Stack

This project is a full-stack application built with modern technologies.

#### Frontend

  - **Core Framework**: React, Vite, TypeScript
  - **Styling**: Tailwind CSS
  - **UI & UX**:
      - `lucide-react` for icons
      - `react-dropzone` for file uploads
      - `framer-motion` for animations
  - **Document Processing**:
      - `tesseract.js` for Optical Character Recognition (OCR) in the browser
      - `pdfjs-dist` for client-side PDF text extraction
      - `mammoth` & `xlsx` for parsing Word and Excel files
  - **API Communication**: `axios`

#### Backend

  - **Core Framework**: Node.js, Express.js
  - **Middleware**: `cors` for handling cross-origin requests
  - **AI Integration**: `@google/generative-ai` SDK
  - **Configuration**: `dotenv` for secure environment variable management

-----

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

  - Node.js (v18 or later)
  - npm (or your preferred package manager)
  - One or more Google Gemini API keys.

### Installation & Setup

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/yourusername/docsum.git
    cd docsum
    ```

2.  **Install Backend Dependencies**
    Navigate to the backend directory and install the required packages.

    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies**
    In a separate terminal, navigate to the frontend directory and install its packages.

    ```bash
    cd frontend
    npm install
    ```

4.  **Configure Environment Variables**
    You will need to create two `.env` files—one for the backend and one for the frontend.

      - **Backend (`/backend/.env`)**: Create this file to store your secret Gemini API keys.

        ```env
        # Add as many keys as you want, following the numbered pattern
        GEMINI_API_KEY_1="YOUR_FIRST_GEMINI_API_KEY"
        GEMINI_API_KEY_2="YOUR_SECOND_GEMINI_API_KEY"
        ```

      - **Frontend (`/frontend/.env.local`)**: Create this file to tell the frontend where to find the backend server.

        ```env
        VITE_BACKEND_URL="http://localhost:3001"
        ```

### Usage

You need to run both the backend and frontend servers simultaneously in two separate terminals.

1.  **Start the Backend Server**
    In your backend directory terminal:

    ```bash
    npm start
    ```

    You should see the message: `✅ Secure backend server running at http://localhost:3001`

2.  **Start the Frontend Application**
    In your frontend directory terminal:

    ```bash
    npm run dev
    ```

    Your browser should automatically open to `http://localhost:5173` (or another available port).

You can now upload documents and start generating summaries\!

-----

## Available Scripts

### Backend

  - `npm start`: Runs the Express server using `node`.

### Frontend

  - `npm run dev`: Starts the Vite development server with Hot Module Replacement.
  - `npm run build`: Compiles and bundles the application for production.
  - `npm run lint`: Runs ESLint for code quality checks.
  - `npm run preview`: Serves the production build locally for testing.
