import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getGeminiModel } from '../utils/geminiClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const knowledgeBasePath = path.join(__dirname, '../knowledge/knowledgebase.txt');

const queryAssistant = async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required.' });
  }

  try {
    const knowledgeBaseContent = fs.readFileSync(knowledgeBasePath, 'utf8');
    const model = getGeminiModel(process.env.GEMINI_API_KEY);

    const prompt = `You are an AI assistant. Answer the following question ONLY based on the provided knowledge base. If the answer is not in the knowledge base, state that you don't have enough information.

Knowledge Base:
${knowledgeBaseContent}

Question: ${query}

Answer:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ answer: text });
  } catch (error) {
    console.error('Error querying AI assistant:', error);
    if (error.response && error.response.text) {
      console.error('Gemini API Error Details:', error.response.text());
    } else if (error.message) {
      console.error('Error Message:', error.message);
    }
    res.status(500).json({ error: 'Failed to get a response from the AI assistant.', details: error.message });
  }
};

export { queryAssistant }; 