import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors({
  origin: `${process.env.FRONTEND_URL}`, // your frontend domain
  methods: ["GET", "POST", "PUT", "DELETE"], // allowed methods
  credentials: true, // if you want to allow cookies/auth headers
}));
app.use(express.json());

app.post('/api/summarize', async (req, res) => {
  // 1. Collect API keys dynamically
  const apiKeys = [];
  let i = 1;
  while (process.env[`GEMINI_API_KEY_${i}`]) {
    apiKeys.push(process.env[`GEMINI_API_KEY_${i}`]);
    i++;
  }

  if (apiKeys.length === 0) {
    return res.status(500).json({ error: 'No API keys configured on the server.' });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required.' });
  }

  // 2. Try each API key
  for (let i = 0; i < apiKeys.length; i++) {
    const key = apiKeys[i];
    console.log(` Attempting API call with key #${i + 1}`);

    try {
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        Analyze the following document and provide the output in a valid JSON format.
        The JSON object must have the following keys: "short", "medium", "long", "keyPoints", and "mainIdeas".

        - "short": A summary of the document in 2-3 sentences.
        - "medium": A summary of the document in 1-2 paragraphs (4-6 sentences).
        - "long": A summary of the document in 2-3 paragraphs (8-12 sentences).
        - "keyPoints": An array of 5-7 concise, informative key points from the document.
        - "mainIdeas": An array of 3-5 main ideas or themes as complete sentences.

        Document:
        ---
        ${text}
        ---
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();

      // 3. Clean JSON (remove ```json fences if present)
      const jsonString = responseText.replace(/```json|```/g, '').trim();

      try {
        const parsed = JSON.parse(jsonString);
        console.log(`Success with key #${i + 1}`);
        return res.json(parsed);
      } catch (parseError) {
        console.error(" Failed to parse JSON from response:", parseError);
        console.error("Raw model response:", responseText);

        return res.status(500).json({
          error: "Model returned invalid JSON format.",
          raw: responseText
        });
      }

    } catch (error) {
      console.warn(`failed or hit a rate limit.`, error?.message || error);

      // If it's the last key, return error
      if (i === apiKeys.length - 1) {
        console.error(" All API keys failed.");
        return res.status(500).json({
          error: 'All available API keys have failed (quota exceeded or invalid response).'
        });
      }
    }
  }
});

app.listen(port, () => {
  console.log(` Secure backend server running at http://localhost:${port}`);
});
