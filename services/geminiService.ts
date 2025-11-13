

import { GoogleGenAI } from "@google/genai";

export const generateImage = async (prompt: string, count: number): Promise<string[]> => {
  // Proactively check for the API key to provide a clear error.
  if (!process.env.API_KEY) {
    throw new Error("An API Key must be set when running in a browser");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: count,
        outputMimeType: 'image/png',
        aspectRatio: '1:1',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const imageUrls = response.generatedImages.map(img => {
          const base64ImageBytes: string = img.image.imageBytes;
          return `data:image/png;base64,${base64ImageBytes}`;
      });
      return imageUrls;
    } else {
      throw new Error("No images were generated. The response may have been blocked.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    if (error instanceof Error) {
        if (error.message.includes('API Key')) {
            throw new Error('An API Key must be set when running in a browser');
        }
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred during image generation.");
  }
};