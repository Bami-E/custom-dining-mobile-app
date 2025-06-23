import axios from 'axios';
import { GEMINI_API_KEY } from './config';

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// System instruction to guide the chatbot's behavior
const SYSTEM_INSTRUCTION = {
  role: 'user',
  parts: [{
    text: "You are a friendly and helpful chatbot for the 'Custom Dining' app. Your name is Chef Gemini. Your goal is to answer user questions about the app, healthy eating, meal plans, and restaurant features. Keep your answers concise, positive, and easy to understand. Start your very first message with a warm welcome and introduce yourself."
  }],
};

// Interface for chat messages
export interface ChatMessage {
  role: 'user' | 'model';
  parts: [{ text: string }];
}

const INITIAL_BOT_MESSAGE: ChatMessage = {
  role: 'model',
  parts: [{
    text: "Hello! I'm Chef Gemini, your personal assistant for the Custom Dining app. How can I help you today? Feel free to ask me anything about our features, meal plans, or healthy eating!"
  }]
}

class ChatbotService {
  async getBotResponse(history: ChatMessage[]): Promise<string> {
    // Prevent sending requests if the API key is a placeholder
    if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE' as any) {
      console.warn('⚠️ Gemini API key is a placeholder. Returning a mock response.');
      return "It looks like the Gemini API key isn't set up yet. Please ask the developer to add it. Once they do, I'll be ready to chat!";
    }

    try {
      console.log('🤖 Sending chat history to Gemini...');
      const response = await axios.post(API_URL, {
        contents: [SYSTEM_INSTRUCTION, ...history],
        // Safety settings to control content generation
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
          stopSequences: [],
        },
      });

      // Extract the text from the response
      const botResponse = response.data.candidates[0].content.parts[0].text;
      console.log('✅ Gemini Response:', botResponse);
      return botResponse;

    } catch (error: any) {
      console.error('❌ Gemini API Error:', error.response?.data || error.message);

      // Provide a user-friendly error message
      if (error.response?.data?.error?.message) {
        return `I'm having a little trouble connecting to my brain right now. The server said: "${error.response.data.error.message}"`;
      }
      return "Sorry, I couldn't get a response. Please check your connection or try again later.";
    }
  }
}

export default new ChatbotService();
export const initialBotMessage = INITIAL_BOT_MESSAGE; 