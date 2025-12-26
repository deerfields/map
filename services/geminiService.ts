import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { Unit } from "../types";

const setDestinationTool: FunctionDeclaration = {
  name: 'setDestination',
  parameters: {
    type: Type.OBJECT,
    description: 'Sets the user destination to a specific store or service in the mall to trigger navigation.',
    properties: {
      storeId: { type: Type.STRING, description: 'The unique ID of the unit.' },
      storeName: { type: Type.STRING, description: 'The human-readable name of the store.' }
    },
    required: ['storeId', 'storeName'],
  },
};

export interface ConciergeConfig {
  units: Unit[];
  isArabic: boolean;
  latitude?: number;
  longitude?: number;
  currentX?: number;
  currentY?: number;
}

const getConciergeSystemInstruction = (units: Unit[], isArabic: boolean, userX?: number, userY?: number) => {
  const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
  
  const storeKnowledge = units.map(u => {
    let distance = -1;
    if (userX !== undefined && userY !== undefined) {
      const minX = Math.min(...u.polygon.map(p => p[0]));
      const minY = Math.min(...u.polygon.map(p => p[1]));
      const maxX = Math.max(...u.polygon.map(p => p[0]));
      const maxY = Math.max(...u.polygon.map(p => p[1]));
      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;
      distance = Math.round(Math.sqrt(Math.pow(userX - cx, 2) + Math.pow(userY - cy, 2)));
    }

    return {
      id: u.id,
      name: isArabic ? u.nameAr : u.nameEn,
      mallAddress: u.mallAddress,
      type: u.type,
      category: u.category,
      floor: u.floor,
      // Fix: Removed reference to u.zone as it does not exist on Unit type
      hours: `${u.openingTime} - ${u.closingTime}`,
      tags: u.tags,
      attributes: u.attributes,
      isPromoted: u.isPromoted,
      distanceFromUser: distance,
      strategicPriority: u.rentTier || 1
      // Fix: Removed capabilities object referencing preOrderEnabled and checkStockUrl as they do not exist on Unit type
    };
  });

  return `You are the Deerfields Mall Elite Digital Concierge. Current Mall Time: ${currentTime}.
  
  CORE MISSION: Provide hyper-intelligent, context-aware assistance.
  
  KNOWLEDGE DOMAINS:
  1. TEMPORAL (Hours): Always check "hours" against ${currentTime}. If a user asks "is it open?", provide a definitive answer.
  2. PRODUCT/INTENT: Users ask for products (e.g. "sneakers") or features (e.g. "free wifi"). Search the "tags" and "attributes" of units.
  3. SPATIAL STORYTELLING: Use the MallAddress. Reference landmarks like the "Grand Atrium" or "Central Elevators" to give human directions.
  4. CONVERSATIONAL COMMERCE: Suggest stores based on their category and tags.
  
  DIRECTIVE FOR PROMOTIONS:
  - If multiple results match a category, prioritize 'isPromoted' units (Strategic Partners).
  
  RESPONSE STYLE:
  - Professional, warm, and brief.
  - Language: ${isArabic ? 'Arabic' : 'English'}.
  - If providing navigation, call 'setDestination'.
  
  MALL DIRECTORY:
  ${JSON.stringify(storeKnowledge)}`;
};

export const getConciergeResponse = async (
  query: string, 
  history: {role: 'user' | 'model', parts: {text: string}[]}[],
  config: ConciergeConfig
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = getConciergeSystemInstruction(config.units, config.isArabic, config.currentX, config.currentY);
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [...history, { role: 'user', parts: [{ text: query }] }],
    config: {
      systemInstruction,
      tools: [{ functionDeclarations: [setDestinationTool] }],
      thinkingConfig: { thinkingBudget: 0 }
    },
  });
  return response;
};

export const searchMall = async (query: string, currentUnits: Unit[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const minimalDirectory = currentUnits.map(s => ({
      id: s.id, 
      nameEn: s.nameEn, 
      nameAr: s.nameAr, 
      category: s.category,
      mallAddress: s.mallAddress,
      isPromoted: s.isPromoted,
      tags: s.tags
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Smart Search: Map query to a specific storeId. Handle products (e.g. "iPhone", "coffee"), categories, and direct names. 
      Directory: ${JSON.stringify(minimalDirectory)}. 
      Query: "${query}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            found: { type: Type.BOOLEAN },
            storeId: { type: Type.STRING },
            reasoning: { type: Type.STRING },
            suggestedSearch: { type: Type.STRING }
          },
          required: ["found", "reasoning"]
        },
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.warn("SearchMall Gemini Failure:", e);
    return { found: false };
  }
};