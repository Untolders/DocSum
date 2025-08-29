import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

// --- Custom Error Classes for Structured Handling ---
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

class BadRequestError extends ApiError {
  constructor(message = "Bad Request") {
    super(400, message);
  }
}

class ServiceUnavailableError extends ApiError {
  constructor(message = "Service Unavailable") {
    super(503, message);
  }
}

// --- Collect and Validate API Keys on Startup ---
const apiKeys = [];
let i = 1;
while (process.env[`GEMINI_API_KEY_${i}`]) {
  apiKeys.push(process.env[`GEMINI_API_KEY_${i}`]);
  i++;
}

if (apiKeys.length === 0) {
  console.error("❌ FATAL ERROR: No GEMINI_API_KEY found in .env file. Server is shutting down.");
  process.exit(1); // Exit if no keys are found
}

const app = express();
const port = 3001;

// --- Middleware Setup ---
app.use(
  cors({
    // For production, replace '*' with your actual frontend URL
    origin: process.env.FRONTEND_URL || "*", 
  })
);
app.use(express.json());

// --- API Endpoint Logic ---
app.post("/api/summarize", async (req, res, next) => {
  const { text } = req.body;

  // 1. Input Validation
  if (!text) {
    return next(new BadRequestError("Text is required in the request body."));
  }

  let lastKnownError = null;

  // 2. Loop through API keys
  for (let k = 0; k < apiKeys.length; k++) {
    const key = apiKeys[k];
    console.log(`🔑 Attempting API call with key #${k + 1}`);

    try {
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // ... inside app.post("/api/summarize", ...)

const prompt = `
  Analyze the following document and provide the output in a valid JSON format.
  The JSON object must have ONLY the following keys: "short", "medium", "long", "keyPoints", "mainIdeas", and "improvements".

  - "short", "medium", "long": Provide summaries of these respective lengths.
  - "keyPoints": An array of strings, with each string being a critical point.
  - "mainIdeas": An array of strings, with each string being a core concept.
  - "improvements": An array of strings, where each string is a specific, actionable suggestion to improve the clarity, grammar, or impact of the original text.

  Document:
  ---
  ${text}
  ---
`;

// ... the rest of the function remains the same

      const result = await model.generateContent(prompt);
      const response = result.response;
      const responseText = response.text();

      // 3. Try to parse the JSON response
      const jsonString = responseText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(jsonString);
      
      console.log(`✅ Success with key #${k + 1}`);
      return res.json(parsed); // Success! Send response and exit.

    } catch (error) {
      console.warn(`⚠️ Key #${k + 1} failed.`);
      lastKnownError = error; // Store the last error for context
    }
  }

  // 4. If all keys failed, pass a specific error to the handler
  console.error("❌ All API keys failed.");
  return next(new ServiceUnavailableError("All available API keys have failed, please try again later."));
});

// --- Centralized Error Handling Middleware ---
// This middleware runs if any route calls `next(error)`.
app.use((err, req, res, next) => {
  console.error("--- An error occurred ---");
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || "An unexpected internal server error occurred.";

  res.status(statusCode).json({
    error: message,
  });
});


app.listen(port, () => {
  console.log(`🚀 Secure backend server running at http://localhost:${port}`);
});