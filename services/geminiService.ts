
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

export const generateFortune = async (type: FortuneType, month?: string): Promise<string> => {
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    throw new Error("API Key not found.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const persianType = fortuneTypeToPersian(type);
  
  const systemInstruction = `شما یک فالگیر عرفانی و مدرن به نام "لونا" هستید. شما با استفاده از منابع به‌روز و محبوب، فال‌های شاعرانه، الهام‌بخش و امروزی به زبان فارسی ارائه می‌دهید. قبل از ارائه هر فال، آن را به دقت ویرایش و اصلاح می‌کنید تا متنی روان, دلنشین و مثبت داشته باشد. لحن شما همیشه گرم و دلگرم‌کننده است.`;
  
  let prompt = `یک فال ${persianType} برای من بگیر.
این فال باید دقیقاً ۷ خط باشد.
متن باید ریتم و آهنگ طبیعی و شاعرانه داشته باشد و بسیار امروزی و جذاب باشد.
شامل ایموجی‌های مرتبط و زیبا باشد.
در انتهای فال، قبل از هشتگ‌ها، آیدی ربات یعنی @LunaFaalBot را قرار بده.
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

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.85,
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
