import { GoogleGenAI } from "@google/genai";
import { FortuneType } from '../types';

const MODELS_TO_TRY = ['gemini-2.5-flash', 'gemini-2.5-pro'];

export const generateFortune = async (type: FortuneType): Promise<string> => {
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    throw new Error("API Key not found. Ensure it is configured correctly.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  let systemInstruction = `شما یک هوش مصنوعی متخصص در زمینه علوم عرفانی و ادبیات فارسی هستید. هویت شما "لونا"، یک راهنمای دانا و مهربان است. پاسخ‌های شما باید عمیق، الهام‌بخش و به زبان فارسی امروزی، روان و صمیمی باشد.`;
  let prompt = '';

  switch (type) {
    case FortuneType.Hafez:
      prompt = `من نیت کرده‌ام. لطفاً برای من یک فال حافظ بگیر.
      1.  یک غزل کامل از حافظ را به صورت تصادفی انتخاب کن و آن را به طور کامل بنویس.
      2.  سپس، تفسیر مدرن و کاربردی آن غزل را در چند پاراگراف بنویس. تفسیر باید به زبان ساده و امروزی باشد و به جنبه‌های مختلف زندگی مانند عشق، کار و حال عمومی بپردازد.
      3.  لحن شما باید دوستانه، حکیمانه و بسیار دلگرم‌کننده باشد.`;
      break;

    case FortuneType.Tarot:
      prompt = `من برای دریافت فال تاروت نیت کرده‌ام.
      1.  به صورت تصادفی یک کارت از «کارت‌های کبیر تاروت» (Major Arcana) انتخاب کن.
      2.  نام کارت را به فارسی و انگلیسی بنویس (مثال: 🃏 **کارت ابله (The Fool)**).
      3.  در یک پاراگراف، تصویری که روی کارت هست را توصیف کن.
      4.  در پاراگراف‌های بعدی، تفسیر و پیام کارت را در سه بخش مجزا ارائه بده:
          - **وضعیت کلی:** پیام اصلی کارت برای شرایط فعلی من.
          - **روابط عاطفی:** تفسیر کارت در زمینه عشق و روابط.
          - **مسائل کاری و مالی:** راهنمایی کارت در مورد شغل و پول.
      5.  تفسیر باید به زبان ساده، امروزی و کاربردی باشد. لحن شما باید کمی عرفانی اما قابل فهم و راهگشا باشد.`;
      break;
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
          temperature: 0.7,
          topP: 0.9,
        },
      });

      if (!response.text) {
        throw new Error(`Received an empty response from the AI model ${modelName}.`);
      }
      return response.text;
    } catch (error) {
      console.error(`Error generating fortune with model ${modelName}:`, error);
      lastError = error;
    }
  }

  if (lastError) {
    throw lastError;
  }

  throw new Error("Failed to generate fortune after trying all available models.");
};
