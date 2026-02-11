

import { GoogleGenAI, Modality } from "@google/genai";

// initialization guidelines: Use process.env.API_KEY directly and create instance right before making an API call.
export const generateImage = async (prompt: string): Promise<string> => {
  // Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  // Iterating through all parts to find the image part as recommended
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image data returned from Gemini");
};

export const generateSpeech = async (text: string, voice: string = 'Kore'): Promise<ArrayBuffer> => {
  // Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: voice },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("No audio data returned");

  // Manual base64 decode as recommended for raw PCM streams
  const binaryString = atob(base64Audio);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// Helper to play PCM data correctly in the browser
export const playPCM = async (buffer: ArrayBuffer, sampleRate: number = 24000) => {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate });
  const dataInt16 = new Int16Array(buffer);
  const frameCount = dataInt16.length;
  const audioBuffer = ctx.createBuffer(1, frameCount, sampleRate);
  const channelData = audioBuffer.getChannelData(0);
  
  for (let i = 0; i < frameCount; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }

  const source = ctx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(ctx.destination);
  source.start();
};