import axios, { AxiosError } from "axios";
import { Summary } from "../types";

// The server server URL.
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/summarize`;

/**
 * Sends text to your secure server to generate a summary.
 * @param text - The text to be summarized.
 * @returns A promise that resolves to the complete summary object.
 */
export const generateSummary = async (text: string): Promise<Summary> => {
  try {
    console.log("Sending text to secure server...");

    const response = await axios.post(API_URL, { text });

    console.log("Received summary from server.");

    return response.data;
  } catch (err: unknown) {
    let errorMessage = "An unexpected error occurred while summarizing.";

    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<{ error?: string; message?: string }>;

      if (axiosError.response) {
        // Server responded but with an error status
        const status = axiosError.response.status;
        const serverMessage =
          axiosError.response.data?.error ||
          axiosError.response.data?.message ||
          "Internal Server Error";

        errorMessage = `server error (${status}): ${serverMessage}`;
      } else if (axiosError.request) {
        // Request made but no response received
        errorMessage = "No response received from server. Please try again later.";
      } else {
        // Something else happened while setting up the request
        errorMessage = `Request setup error: ${axiosError.message}`;
      }
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }

    console.error("Error calling server server:", err);
    throw new Error(errorMessage);
  }
};

/**
 * Utility function to calculate reading time of given text.
 */
export const calculateReadingTime = (text: string): number => {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};
