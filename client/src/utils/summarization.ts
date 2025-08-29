import axios, { AxiosError } from "axios";
import { Summary } from "../types";

// Backend API URL
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/summarize`;


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
        errorMessage =
          "No response received from server. Please try again later.";
      } else {
        // Something else happened while setting up the request
        errorMessage = `Request setup error: ${axiosError.message}`;
      }
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }

    console.error("Error calling secure server:", err);
    throw new Error(errorMessage);
  }
};

/**
 * Utility function to calculate reading time of given text.
 * Returns a user-friendly string like "2 min read".
 */
export const calculateReadingTime = (text: string): string => {
  if (!text) return "0 min read";

  const wordsPerMinute = 200; // average adult reading speed
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  return `${minutes} min read`;
};
