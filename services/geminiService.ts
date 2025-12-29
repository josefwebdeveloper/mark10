import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Safely initialize the client only if key is present (though app requires it)
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateMagicStory = async (title: string, date: string, type: string): Promise<string> => {
  if (!ai) {
    return "Please configure your API Key to unlock magic stories!";
  }

  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      You are a magical storyteller for a 10-year-old's memory album.
      Write a short, whimsical, and fun one-paragraph story (max 40 words) about a memory titled "${title}" which happened on ${date}.
      The memory is a ${type}.
      Make it sound exciting and positive, and use appropriate emojis to make it pop! ✨
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }, // Disable thinking for faster simple creative writing
        temperature: 0.8, // Slightly creative
      }
    });

    return response.text || "The magic faded... try again!";
  } catch (error) {
    console.error("Gemini Magic Error:", error);
    return "Oops! The story sprites are sleeping. Try again later.";
  }
};