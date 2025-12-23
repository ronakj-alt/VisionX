
import { GoogleGenAI, Type } from "@google/genai";
import { DetectedObject } from "../types";

/**
 * Detects physical objects in a video frame using Gemini AI and performs a simulated 
 * visual search to find the most relevant shopping links across a variety of retailers.
 */
export const detectObjectsInFrame = async (base64Image: string): Promise<DetectedObject[]> => {
  // Always initialize with the current process.env.API_KEY per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    You are a high-end visual shopping AI assistant like Google Lens.
    
    TASK:
    1. OBJECT DETECTION: Scan the provided image for physical, non-living products. Identify items like clothing, footwear, accessories, electronics, home decor, and gadgets.
    2. EXCLUSION: Strictly ignore humans, body parts (except where relevant to showing the product), animals, and background environments.
    3. BRAND RECOGNITION: Identify the specific brand or logo visible on the item. If not visible, infer the style or designer.
    4. PRODUCT SEARCH: For EACH detected item, act as a search engine and find matches on MULTIPLE platforms. 
       - DO NOT limit results to just one store like Amazon.
       - YOU MUST provide a mix of sources for every single object.
       - REQUIRED SOURCES (Choose 3 per object): Flipkart, Myntra, Ajio, Amazon, Meesho, Nykaa, or the brand's official global store (e.g., Nike, Apple, Zara).
    
    5. DATA ATTRIBUTES:
       - Confidence: 0.0 to 1.0.
       - Price: Estimate the current market price in Indian Rupees (₹) for Indian retailers, or local currency for official stores.
       - Link: Generate a realistic search or product URL for that specific item on that platform.
       - ImageUrl: Provide a high-quality product placeholder or real product image URL if known.
    
    6. COORDINATES: Return a bounding box in normalized coordinates (0 to 1000).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { text: prompt },
          { inlineData: { mimeType: "image/jpeg", data: base64Image } }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "A unique ID for the detection" },
              name: { type: Type.STRING, description: "Common name of the item (e.g. 'Denim Jacket')" },
              brand: { type: Type.STRING, description: "The identified brand name" },
              confidence: { type: Type.NUMBER },
              boundingBox: {
                type: Type.OBJECT,
                properties: {
                  x: { type: Type.NUMBER, description: "Top-left X (0-1000)" },
                  y: { type: Type.NUMBER, description: "Top-left Y (0-1000)" },
                  width: { type: Type.NUMBER, description: "Width (0-1000)" },
                  height: { type: Type.NUMBER, description: "Height (0-1000)" }
                },
                required: ["x", "y", "width", "height"],
              },
              products: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    platform: { type: Type.STRING, description: "Retailer name (Amazon, Flipkart, Myntra, etc.)" },
                    title: { type: Type.STRING, description: "Full product title on the site" },
                    price: { type: Type.STRING, description: "Price including currency symbol" },
                    link: { type: Type.STRING, description: "Direct shopping URL" },
                    imageUrl: { type: Type.STRING, description: "Product image URL" }
                  },
                  required: ["platform", "title", "link", "imageUrl"],
                },
                description: "List of 2-3 matching products from different retailers."
              }
            },
            required: ["id", "name", "brand", "confidence", "boundingBox", "products"],
          }
        }
      }
    });

    const text = response.text || "[]";
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Visual Search Error:", error);
    return [];
  }
};
