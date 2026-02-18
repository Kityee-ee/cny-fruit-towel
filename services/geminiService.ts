import { GoogleGenAI, Type } from "@google/genai";
import { PlacedItem, FruitType } from "../types";
import { FRUIT_DEFS } from "../constants";

const getFruitName = (type: FruitType) => FRUIT_DEFS[type].name;

export const generateBlessing = async (items: PlacedItem[]): Promise<{ blessing: string; luckyNumbers: number[] }> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Count fruits
  const counts: Record<string, number> = {};
  items.forEach(item => {
    const name = getFruitName(item.type);
    counts[name] = (counts[name] || 0) + 1;
  });

  const fruitSummary = Object.entries(counts)
    .map(([name, count]) => `${name} x${count}`)
    .join(', ');

  const prompt = `
    Role: You are the God of Wealth (Caishen) for the Chinese New Year 2026 (Year of the Horse).
    Context: A devotee has built a fruit tower offering with the following fruits: ${fruitSummary}.
    Task:
    1. Generate a poetic, auspicious Chinese New Year blessing (4 sentences, rhyming if possible) specifically mentioning the symbolism of the fruits provided.
    2. Provide 6 lucky lottery numbers (1-49).
    
    Tone: Joyful, traditional, grand, and prosperous.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            blessing: { type: Type.STRING, description: "The 4-sentence blessing in Chinese." },
            luckyNumbers: { 
              type: Type.ARRAY, 
              items: { type: Type.INTEGER },
              description: "6 lucky numbers."
            }
          },
          required: ["blessing", "luckyNumbers"]
        }
      }
    });

    const text = response.text;
    if (!text) return { blessing: "新春大吉，财源广进！", luckyNumbers: [8, 18, 28, 38, 68, 88] };
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      blessing: "金马迎春福气到，财源滚滚步步高。平安喜乐常相伴，阖家幸福乐陶陶。",
      luckyNumbers: [6, 8, 16, 18, 26, 28]
    };
  }
};
