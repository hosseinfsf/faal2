
import React, { useState, useCallback } from 'react';
import { FortuneType } from './types';
import { generateFortune } from './services/geminiService';
import Header from './components/Header';
import FortuneButton from './components/FortuneButton';
import FortuneDisplay from './components/FortuneDisplay';
import InviteTracker from './components/InviteTracker';
import { DailyIcon, WeeklyIcon, MonthlyIcon, HafezIcon, CoffeeIcon, TarotIcon, LockIcon } from './components/Icons';

const App: React.FC = () => {
  const [fortune, setFortune] = useState<string | null>('پیام خوش‌آمد! 🚀\nبرای شروع، یکی از گزینه‌های زیر را انتخاب کنید.');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteCount, setInviteCount] = useState<number>(0);

  const INVITES_NEEDED = 3;
  const specialFortunesUnlocked = inviteCount >= INVITES_NEEDED;

  const handleGetFortune = useCallback(async (type: FortuneType) => {
    setIsLoading(true);
    setError(null);
    setFortune(null);
    try {
      const result = await generateFortune(type);
      setFortune(result);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("API Key not found")) {
          setError('کلید API یافت نشد. لطفا از تنظیم بودن آن در محیط خود اطمینان حاصل کنید.');
        } else {
          setError('خطا در ارتباط با هوش مصنوعی. لطفا دوباره تلاش کنید.');
        }
      } else {
        setError('یک خطای ناشناخته رخ داد. لطفا دوباره تلاش کنید.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInvite = () => {
    if (inviteCount < INVITES_NEEDED) {
      setInviteCount(prev => prev + 1);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white font-sans p-4 flex flex-col items-center">
      <div className="w-full max-w-md mx-auto">
        <Header />
        <main className="mt-8">
          <FortuneDisplay fortune={fortune} isLoading={isLoading} error={error} />
          
          <div className="grid grid-cols-2 gap-4 mt-8">
            {fortuneButtons.map(({ type, label, icon, locked }) => (
              <FortuneButton
                key={type}
                onClick={() => handleGetFortune(type)}
                disabled={locked || isLoading}
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
