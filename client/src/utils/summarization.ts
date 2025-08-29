import axios from 'axios';
import { Summary } from '../types';

// The backend server URL.
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/summarize`;

/**
 * Sends text to your secure backend to generate a summary.
 * @param text - The text to be summarized.
 * @returns A promise that resolves to the complete summary object.
 */
export const generateSummary = async (text: string): Promise<Summary> => {
  try {
    console.log('Sending text to secure backend...');

    // Make a POST request to your backend server's endpoint
    const response = await axios.post(API_URL, {
      text: text, // Send the text in the request body
    });

    console.log('Received summary from backend.');
    
    // The backend already returns the data in the correct JSON format
    return response.data;

  } catch (error: any) {
    console.error('Error calling backend server:', error);

    // Pass along the error message from the backend, or a default one
    const errorMessage = error.response?.data?.error || 'Failed to connect to the backend server.';
    throw new Error(errorMessage);
  }
};

/**
 * This function remains unchanged. It's a simple utility that doesn't
 * need to interact with any APIs.
 */
export const calculateReadingTime = (text: string): number => {
  const wordsPerMinute = 200; // Average reading speed.
  const wordCount = text.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};