
import { GoogleGenAI } from "@google/genai";
import { FortuneType } from '../types';

const fortuneTypeToPersian = (type: FortuneType): string => {
  switch (type) {
    case FortuneType.Daily: return 'روزانه';
    case FortuneType.Weekly: return 'هفتگی';
    case FortuneType.Monthly: return 'ماهانه';
    case FortuneType.Hafez: return 'حافظ';
    case FortuneType.Coffee: return 'قهوه';
    case FortuneType.Tarot: return 'تاروت';
    default: return 'عمومی';
  }
};

export const generateFortune = async (type: FortuneType): Promise<string> => {
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    throw new Error("API Key not found.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const persianType = fortuneTypeToPersian(type);
  
  const systemInstruction = `شما یک فالگیر عرفانی و دانا به نام "لونا" هستید. شما فال‌های شاعرانه و الهام‌بخش به زبان فارسی ارائه می‌دهید. پاسخ‌های شما باید دارای لحنی مثبت و دلگرم‌کننده باشند.`;
  
  const prompt = `
    یک فال ${persianType} برای من بگیر.
    این فال باید دقیقاً ۷ خط باشد.
    باید ریتم و آهنگ طبیعی و شاعرانه داشته باشد.
    شامل ایموجی‌های مرتبط (مانند 🌙، ✨، 🔮، ☕️، 🃏) باشد.
    حداقل سه هشتگ مرتبط فارسی در انتهای آن باشد (مثلاً #${persianType}_فال، #فال).
    متن باید زیبا، ویرایش شده و دلنشین باشد.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
        topP: 0.9,
      },
    });

    if (!response.text) {
      throw new Error("Received an empty response from the AI.");
    }

    return response.text;
  } catch (error) {
    console.error("Error generating fortune:", error);
    throw new Error("Failed to generate fortune from Gemini API.");
  }
};
