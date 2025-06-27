import { GoogleGenerativeAI } from '@google/generative-ai';

const getGeminiModel = (apiKey) => {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set. Please set it in your .env file.');
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { temperature: 0.2 }});
};

export { getGeminiModel }; 