
import React, { useState, useCallback } from 'react';
import { FortuneType } from './types';
import { generateFortune, generateImageFortune } from './services/geminiService';
import Header from './components/Header';
import FortuneButton from './components/FortuneButton';
import FortuneDisplay from './components/FortuneDisplay';
import InviteTracker from './components/InviteTracker';
import MonthSelector from './components/MonthSelector';
import { DailyIcon, WeeklyIcon, MonthlyIcon, HafezIcon, CoffeeIcon, TarotIcon, LockIcon, VisualIcon, BirthMonthIcon, IstikharaIcon, AnbiyaIcon } from './components/Icons';
import ChannelPrompt from './components/ChannelPrompt';
import VisualFortuneInput from './components/VisualFortuneInput';

type AppState = 'INITIAL' | 'SELECTING_MONTH' | 'AWAITING_VISUAL_INTENTION' | 'LOADING' | 'SHOWING_FORTUNE';

const App: React.FC = () => {
  const [fortune, setFortune] = useState<string | null>('پیام خوش‌آمد! 🚀\nبرای شروع، یکی از گزینه‌های زیر را انتخاب کنید.');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inviteCount, setInviteCount] = useState<number>(0);
  const [appState, setAppState] = useState<AppState>('INITIAL');
  const [selectedFortuneType, setSelectedFortuneType] = useState<FortuneType | null>(null);
  const [monthSelectorTitle, setMonthSelectorTitle] = useState<string>('');

  const INVITES_NEEDED = 3;
  const specialFortunesUnlocked = inviteCount >= INVITES_NEEDED;

  const handleBack = () => {
    setAppState('INITIAL');
    setError(null);
    setImageUrl(null);
    setSelectedFortuneType(null);
    setFortune('پیام خوش‌آمد! 🚀\nبرای شروع، یکی از گزینه‌های زیر را انتخاب کنید.');
  };
  
  const handleApiError = (err: unknown) => {
    console.error("Error with AI Service:", err);
    if (err instanceof Error) {
      const errorMessage = err.message.toLowerCase();
      if (errorMessage.includes("api key not found")) {
        setError('کلید API یافت نشد. لطفاً مطمئن شوید که در تنظیمات Vercel، نام متغیر دقیقا `API_KEY` است و پس از ذخیره، پروژه را مجددا Deploy کرده‌اید.');
      } else if (errorMessage.includes("api_key_invalid") || (errorMessage.includes("invalid") && errorMessage.includes("api key"))) {
        setError('کلید API شما معتبر نیست. لطفاً یک کلید API معتبر از Google AI Studio دریافت کرده و در تنظیمات Vercel قرار دهید.');
      } else if (errorMessage.includes("quota")) {
        setError('محدودیت استفاده از API به پایان رسیده است. لطفاً بعداً دوباره تلاش کنید یا حساب خود را بررسی کنید.');
      } else if (errorMessage.includes("billing")) {
        setError('مشکلی در حساب کاربری شما وجود دارد (احتمالاً مربوط به پرداخت). لطفاً تنظیمات حساب Google Cloud خود را بررسی کنید.');
      } else if (errorMessage.includes("safety") || errorMessage.includes("blocked")) {
        setError('پاسخ هوش مصنوعی به دلیل محدودیت‌های ایمنی مسدود شد. لطفاً درخواست خود را تغییر داده و دوباره تلاش کنید.');
      } else {
        setError('خطا در ارتباط با هوش مصنوعی. لطفا دوباره تلاش کنید.');
      }
    } else {
      setError('یک خطای ناشناخته رخ داد. لطفا دوباره تلاش کنید.');
    }
  };

  const handleGetTextFortune = useCallback(async (type: FortuneType, details?: string) => {
    setAppState('LOADING');
    setError(null);
    setFortune(null);
    setImageUrl(null);
    try {
      const result = await generateFortune(type, details);
      setFortune(result);
    } catch (err) {
      handleApiError(err);
    }
    setAppState('SHOWING_FORTUNE');
  }, []);
  
  const handleGenerateVisualFortune = useCallback(async (intention: string) => {
    setAppState('LOADING');
    setError(null);
    setFortune(null);
    setImageUrl(null);
    try {
        const [imageResult, textResult] = await Promise.all([
            generateImageFortune(intention),
            generateFortune(FortuneType.Visual, intention)
        ]);
        setImageUrl(imageResult);
        setFortune(textResult);
    } catch (err) {
        handleApiError(err);
    }
    setAppState('SHOWING_FORTUNE');
  }, []);

  const handleFortuneTypeSelect = (type: FortuneType) => {
    const needsMonthSelection = [FortuneType.Daily, FortuneType.Weekly, FortuneType.Monthly, FortuneType.BirthMonth].includes(type);

    if (needsMonthSelection) {
      setSelectedFortuneType(type);
      setMonthSelectorTitle(type === FortuneType.BirthMonth ? 'ماه تولد خود را انتخاب کنید' : 'ماه مورد نظر خود را انتخاب کنید');
      setAppState('SELECTING_MONTH');
    } else if (type === FortuneType.Visual) {
        setSelectedFortuneType(type);
        setAppState('AWAITING_VISUAL_INTENTION');
    } else {
      handleGetTextFortune(type);
    }
  };

  const handleMonthSelect = (month: string) => {
    if (selectedFortuneType) {
      handleGetTextFortune(selectedFortuneType, month);
    }
  };

  const handleInvite = async () => {
    const inviteLink = window.location.href;
    const inviteText = `✨ فال روزانه‌ات رو با ربات هوش مصنوعی "فال بهتر" بگیر! ✨\n\nاز طریق این لینک وارد شو:\n${inviteLink}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ربات فال بهتر',
          text: inviteText,
          url: inviteLink,
        });
        if (inviteCount < INVITES_NEEDED) {
          setInviteCount(prev => prev + 1);
        }
      } catch (error) {
        console.error('خطا در اشتراک‌گذاری:', error);
      }
    } else {
      navigator.clipboard.writeText(inviteLink).then(() => {
        alert('لینک دعوت در کلیپ‌بورد شما کپی شد. آن را برای دوستانتان ارسال کنید!');
        if (inviteCount < INVITES_NEEDED) {
          setInviteCount(prev => prev + 1);
        }
      });
    }
  };

  const fortuneButtons = [
    { type: FortuneType.Daily, label: 'فال روزانه', icon: <DailyIcon /> },
    { type: FortuneType.Weekly, label: 'فال هفتگی', icon: <WeeklyIcon /> },
    { type: FortuneType.Monthly, label: 'فال ماهانه', icon: <MonthlyIcon /> },
    { type: FortuneType.BirthMonth, label: 'فال ماه تولد', icon: <BirthMonthIcon /> },
    { type: FortuneType.Hafez, label: 'فال حافظ', icon: <HafezIcon /> },
    { type: FortuneType.Anbiya, label: 'فال انبیاء', icon: <AnbiyaIcon /> },
    { type: FortuneType.Istikhara, label: 'استخاره با قرآن', icon: <IstikharaIcon /> },
    { type: FortuneType.Visual, label: 'فال تصویری', icon: <VisualIcon /> },
    { type: FortuneType.Coffee, label: 'فال قهوه', icon: specialFortunesUnlocked ? <CoffeeIcon /> : <LockIcon />, locked: !specialFortunesUnlocked },
    { type: FortuneType.Tarot, label: 'فال تاروت', icon: specialFortunesUnlocked ? <TarotIcon /> : <LockIcon />, locked: !specialFortunesUnlocked },
  ];
  
  const isLoading = appState === 'LOADING';

  const renderMainContent = () => {
    switch(appState) {
        case 'SELECTING_MONTH':
            return <MonthSelector onSelectMonth={handleMonthSelect} onBack={handleBack} title={monthSelectorTitle} />;
        case 'AWAITING_VISUAL_INTENTION':
            return <VisualFortuneInput onSubmit={handleGenerateVisualFortune} onBack={handleBack} isLoading={isLoading} />;
        case 'INITIAL':
        case 'LOADING':
        case 'SHOWING_FORTUNE':
        default:
            return <FortuneDisplay fortune={fortune} isLoading={isLoading} error={error} imageUrl={imageUrl} />;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white font-sans p-4 flex flex-col items-center">
      <div className="w-full max-w-md mx-auto">
        <Header />
        <main className="mt-8">
          
          {renderMainContent()}

          {error && appState === 'SHOWING_FORTUNE' && (
             <button
                onClick={handleBack}
                className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                بازگشت
              </button>
          )}
          
          <div className="grid grid-cols-2 gap-4 mt-8">
            {fortuneButtons.map(({ type, label, icon, locked }) => (
              <FortuneButton
                key={type}
                onClick={() => handleFortuneTypeSelect(type)}
                disabled={locked || isLoading || appState === 'SELECTING_MONTH' || appState === 'AWAITING_VISUAL_INTENTION' || (error && appState === 'SHOWING_FORTUNE')}
              >
                {icon}
                <span>{label}</span>
              </FortuneButton>
            ))}
          </div>

          <InviteTracker 
            inviteCount={inviteCount} 
            invitesNeeded={INVITES_NEEDED} 
            onInvite={handleInvite} 
          />
          <ChannelPrompt />
        </main>
      </div>
    </div>
  );
};

export default App;
