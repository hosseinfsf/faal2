
import React, { useState, useCallback } from 'react';
import { FortuneType } from './types';
import { generateFortune } from './services/geminiService';
import Header from './components/Header';
import FortuneButton from './components/FortuneButton';
import FortuneDisplay from './components/FortuneDisplay';
import InviteTracker from './components/InviteTracker';
import MonthSelector from './components/MonthSelector';
import { DailyIcon, WeeklyIcon, MonthlyIcon, HafezIcon, CoffeeIcon, TarotIcon, LockIcon } from './components/Icons';

type AppState = 'INITIAL' | 'SELECTING_MONTH' | 'LOADING' | 'SHOWING_FORTUNE';

const App: React.FC = () => {
  const [fortune, setFortune] = useState<string | null>('پیام خوش‌آمد! 🚀\nبرای شروع، یکی از گزینه‌های زیر را انتخاب کنید.');
  const [error, setError] = useState<string | null>(null);
  const [inviteCount, setInviteCount] = useState<number>(0);
  const [appState, setAppState] = useState<AppState>('INITIAL');
  const [selectedFortuneType, setSelectedFortuneType] = useState<FortuneType | null>(null);

  const INVITES_NEEDED = 3;
  const specialFortunesUnlocked = inviteCount >= INVITES_NEEDED;

  const handleGetFortune = useCallback(async (type: FortuneType, month?: string) => {
    setAppState('LOADING');
    setError(null);
    setFortune(null);
    try {
      const result = await generateFortune(type, month);
      setFortune(result);
      setAppState('SHOWING_FORTUNE');
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("API Key not found")) {
          setError('کلید API یافت نشد. لطفا از تنظیم بودن آن در محیط Vercel اطمینان حاصل کنید.');
        } else {
          setError('خطا در ارتباط با هوش مصنوعی. لطفا دوباره تلاش کنید.');
        }
      } else {
        setError('یک خطای ناشناخته رخ داد. لطفا دوباره تلاش کنید.');
      }
      setAppState('SHOWING_FORTUNE'); // Show the error in the display
      console.error(err);
    }
  }, []);

  const handleFortuneTypeSelect = (type: FortuneType) => {
    const isTemporal = type === FortuneType.Daily || type === FortuneType.Weekly || type === FortuneType.Monthly;
    if (isTemporal) {
      setSelectedFortuneType(type);
      setAppState('SELECTING_MONTH');
    } else {
      handleGetFortune(type);
    }
  };

  const handleMonthSelect = (month: string) => {
    if (selectedFortuneType) {
      handleGetFortune(selectedFortuneType, month);
    }
  };


  const handleInvite = async () => {
    const inviteLink = window.location.href;
    const inviteText = `✨ فال روزانه‌ات رو با ربات هوش مصنوعی "لونا" بگیر! ✨\n\nاز طریق این لینک وارد شو:\n${inviteLink}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ربات فال لونا',
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
      // Fallback for browsers that don't support navigator.share
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
    { type: FortuneType.Hafez, label: 'فال حافظ', icon: <HafezIcon /> },
    { type: FortuneType.Coffee, label: 'فال قهوه', icon: specialFortunesUnlocked ? <CoffeeIcon /> : <LockIcon />, locked: !specialFortunesUnlocked },
    { type: FortuneType.Tarot, label: 'فال تاروت', icon: specialFortunesUnlocked ? <TarotIcon /> : <LockIcon />, locked: !specialFortunesUnlocked },
  ];
  
  const isLoading = appState === 'LOADING';

  const renderMainContent = () => {
    switch (appState) {
      case 'SELECTING_MONTH':
        return <MonthSelector onSelectMonth={handleMonthSelect} />;
      case 'INITIAL':
      case 'LOADING':
      case 'SHOWING_FORTUNE':
      default:
        return <FortuneDisplay fortune={fortune} isLoading={isLoading} error={error} />;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white font-sans p-4 flex flex-col items-center">
      <div className="w-full max-w-md mx-auto">
        <Header />
        <main className="mt-8">
          
          {renderMainContent()}
          
          <div className="grid grid-cols-2 gap-4 mt-8">
            {fortuneButtons.map(({ type, label, icon, locked }) => (
              <FortuneButton
                key={type}
                onClick={() => handleFortuneTypeSelect(type)}
                disabled={locked || isLoading || appState === 'SELECTING_MONTH'}
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
        </main>
      </div>
    </div>
  );
};

export default App;
