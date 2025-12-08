import { GoogleGenAI } from "@google/genai";

export const sendMessageToBot = async (message: string): Promise<string> => {
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    throw new Error("API Key not found. Ensure it is configured correctly.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // System instruction to define the bot's persona
  const systemInstruction = `شما یک دستیار هوشمند شخصی هستید که در محیطی شبیه به تلگرام با کاربر صحبت می‌کنید.
  
  ویژگی‌های شما:
  1. نام شما "دستیار هوشمند" است.
  2. لحن شما دوستانه، محترمانه و صمیمی است (شبیه به یک دوست دانا).
  3. پاسخ‌های شما باید دقیق و تا حد امکان مختصر و مفید باشد، مگر اینکه کاربر توضیح کامل بخواهد.
  4. زبان اصلی شما فارسی است، اما می‌توانید به هر زبانی پاسخ دهید.
  5. از ایموجی‌ها به جا و مناسب استفاده کنید تا مکالمه زنده‌تر شود.
  6. اگر سوالی را نمی‌دانید، صادقانه بگویید.
  
  وظیفه شما کمک به کاربر در هر زمینه‌ای است: از نوشتن متن و ترجمه گرفته تا پاسخ به سوالات عمومی و تخصصی.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7, // Creativity balance
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
      },
    });

    if (!response.text) {
      throw new Error("Received an empty response from the AI.");
    }
    return response.text;
  } catch (error) {
    console.error("Error communicating with AI:", error);
    throw error;
  }
};