import { GoogleGenAI } from "@google/genai";
import { FortuneType } from '../types';

// List of AI models to try in order. If the first fails, it will try the second.
const MODELS_TO_TRY = ['gemini-2.5-flash', 'gemini-2.5-pro'];

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

export const generateFortune = async (type: FortuneType, month?: string): Promise<string> => {
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    throw new Error("API Key not found. Ensure the Vercel Environment Variable is named exactly 'API_KEY' and you have redeployed after setting it.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const persianType = fortuneTypeToPersian(type);
  
  const systemInstruction = `شما هوش مصنوعی ربات "فال بهتر" هستید. هویت شما دوستانه، صمیمی و بسیار خودمونی است. شما باید فال‌هایی کاملاً به‌روز، دقیق و الهام‌بخش ارائه دهید. مهم: محتوای فال‌ها باید بر اساس اطلاعات و منابعی باشد که در یک هفته اخیر منتشر شده‌اند تا کاملاً تازه و مرتبط با امروز باشند. این فال‌ها باید انگار از بهترین و پربازدیدترین وب‌سایت‌های فال فارسی گرفته شده و سپس توسط شما به شکلی بهتر و امروزی‌تر بازنویسی شده‌اند. لحن شما همیشه گرم و دلگرم‌کننده است.`;
  
  let prompt = `یک فال ${persianType} برای من بگیر.
این فال باید دقیقاً ۷ خط باشد.
متن باید ریتم و آهنگ طبیعی و شاعرانه داشته باشد و بسیار امروزی، جذاب و خودمونی باشد.
شامل ایموجی‌های مرتبط و زیبا باشد.
در انتهای فال، قبل از هشتگ‌ها، آیدی ربات یعنی @falbehtarbot و آیدی کانال یعنی @falbehtar را قرار بده.
سپس حداقل سه هشتگ مرتبط فارسی قرار بده (مثلاً #${persianType}_فال، #فال_امروز).
`;

  if (type === FortuneType.Daily || type === FortuneType.Weekly || type === FortuneType.Monthly) {
    prompt += `این فال باید مخصوص ماه "${month}" باشد و حس و حال آن ماه را در متن بگنجان.`;
  } else if (type === FortuneType.Hafez) {
    prompt += `این فال حافظ باید تفسیری مدرن و کاربردی از یکی از غزل‌های حافظ باشد.`;
  } else if (type === FortuneType.Coffee) {
    prompt += `این فال قهوه باید نمادهای رایج در فال قهوه را به شکلی خلاقانه و امروزی تفسیر کند.`;
  } else if (type === FortuneType.Tarot) {
    prompt += `این فال تاروت باید بر اساس یکی از کارت‌های تاروت باشد و پیامی عمیق و کاربردی برای زندگی امروز داشته باشد.`;
  }

  let lastError: unknown = null;

  for (const modelName of MODELS_TO_TRY) {
    try {
      console.log(`Attempting to generate fortune with model: ${modelName}`);
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.85,
          topP: 0.9,
        },
      });

      if (!response.text) {
        throw new Error(`Received an empty response from the AI model ${modelName}.`);
      }

      // Success!
      return response.text;
    } catch (error) {
      console.error(`Error generating fortune with model ${modelName}:`, error);
      lastError = error; // Save the error and try the next model
    }
  }
  
  // If the loop finishes without returning, all models failed.
  console.error("All models failed to generate a fortune. Last error:", lastError);
  throw new Error("Failed to generate fortune from Gemini API after trying all fallback models.");
};