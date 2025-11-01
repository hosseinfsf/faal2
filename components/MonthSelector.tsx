
import React from 'react';

interface MonthSelectorProps {
  onSelectMonth: (month: string) => void;
}

const months = [
  { name: 'فروردین', emoji: '🌷' },
  { name: 'اردیبهشت', emoji: '🌸' },
  { name: 'خرداد', emoji: '☀️' },
  { name: 'تیر', emoji: '🔥' },
  { name: 'مرداد', emoji: '🦁' },
  { name: 'شهریور', emoji: '🌾' },
  { name: 'مهر', emoji: '🍂' },
  { name: 'آبان', emoji: '💧' },
  { name: 'آذر', emoji: '🔥' },
  { name: 'دی', emoji: '❄️' },
  { name: 'بهمن', emoji: '💨' },
  { name: 'اسفند', emoji: '🐟' },
];

const MonthSelector: React.FC<MonthSelectorProps> = ({ onSelectMonth }) => {
  return (
    <div className="min-h-[250px] p-6 rounded-2xl border border-white/20 bg-black/20 backdrop-blur-sm flex flex-col items-center justify-center">
      <h3 className="text-xl font-bold mb-4 text-indigo-200">ماه مورد نظر خود را انتخاب کنید</h3>
      <div className="grid grid-cols-3 gap-3 w-full">
        {months.map((month) => (
          <button
            key={month.name}
            onClick={() => onSelectMonth(month.name)}
            className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg font-semibold text-white bg-white/10 hover:bg-white/20 transition-all duration-200"
          >
            <span className="text-2xl">{month.emoji}</span>
            <span>{month.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MonthSelector;
