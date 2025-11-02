
import { GoogleGenAI, Modality } from "@google/genai";
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
    case FortuneType.Visual: return 'تصویری';
    default: return 'عمومی';
  }
};

export const generateFortune = async (type: FortuneType, details?: string): Promise<string> => {
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    throw new Error("API Key not found. Ensure the Vercel Environment Variable is named exactly 'API_KEY' and you have redeployed after setting it.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const persianType = fortuneTypeToPersian(type);
  const today = new Date();
  const todayPersian = new Intl.DateTimeFormat('fa-IR-u-nu-latn', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  }).format(today);
  
  const systemInstruction = `شما هوش مصنوعی ربات "فال بهتر" هستید. هویت شما دوستانه، صمیمی و بسیار خودمونی است. شما باید فال‌هایی کاملاً به‌روز، دقیق و الهام‌بخش ارائه دهید. لحن شما همیشه گرم و دلگرم‌کننده است.`;
  
  let prompt = `امروز ${todayPersian} است.`;

  if (type === FortuneType.Visual) {
     prompt += `\nبر اساس نیت کاربر که "${details}" است، یک فال عرفانی و الهام‌بخش در ۲ پاراگراف بنویس. این فال باید به صورت تفسیر یک تصویر خیالی باشد که بر اساس نیت کاربر خلق شده است. متن باید ریتم و آهنگ طبیعی و شاعرانه داشته باشد و بسیار امروزی، جذاب و خودمونی باشد. شامل ایموجی‌های مرتبط و زیبا باشد. در انتهای فال، آیدی ربات @falbehtarbot و کانال @falbehtar را قرار بده. سپس حداقل سه هشتگ مرتبط فارسی قرار بده.`;
  } else {
    prompt += ` یک فال ${persianType} برای من بگیر.
این فال باید دقیقاً ۷ خط باشد.
متن باید ریتم و آهنگ طبیعی و شاعرانه داشته باشد و بسیار امروزی، جذاب و خودمونی باشد.
حتما حال و هوای فصل و ماه فعلی (${todayPersian}) را در متن فال لحاظ کن.
شامل ایموجی‌های مرتبط و زیبا باشد.
در انتهای فال، قبل از هشتگ‌ها، آیدی ربات یعنی @falbehtarbot و آیدی کانال یعنی @falbehtar را قرار بده.
سپس حداقل سه هشتگ مرتبط فارسی قرار بده (مثلاً #${persianType}_فال، #فال_امروز).
`;
  }


  if (type === FortuneType.Daily || type === FortuneType.Weekly || type === FortuneType.Monthly) {
    prompt += `این فال باید مخصوص ماه "${details}" باشد و حس و حال آن ماه را در متن بگنجان.`;
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
  if (lastError) {
    throw lastError; // Re-throw the actual error for better debugging in the UI component
  }
  
  throw new Error("Failed to generate fortune from Gemini API after trying all fallback models.");
};

export const generateImageFortune = async (intention: string): Promise<string> => {
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    throw new Error("API Key not found.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const prompt = `A mystical and symbolic, high-quality, artistic image representing the concept of: '${intention}'. The style should be like a digital painting, ethereal and full of hidden meanings, similar to a tarot card illustration.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return `data:image/png;base64,${base64ImageBytes}`;
      }
    }
    throw new Error("No image was generated by the model.");
  } catch (error) {
    console.error("Error generating image fortune:", error);
    throw error;
  }
};
