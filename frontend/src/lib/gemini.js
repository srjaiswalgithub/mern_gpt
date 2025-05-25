


import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

// Safety settings for blocking harmful content
const safetySetting = [
  {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
];

// Initialize the GoogleGenerativeAI instance with the public key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_PUBLIC_KEY);

// Set the model to the correct name (for example, "gemini-1.5-flash-001" from the available list)
const model = genAI.getGenerativeModel({
  model: "models/gemini-1.5-flash", // Use the correct model name here
  safetySetting,
});

// Export the model for use in other parts of your application
export default model;