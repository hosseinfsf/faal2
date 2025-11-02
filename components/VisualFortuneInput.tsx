
import React, { useState } from 'react';

interface VisualFortuneInputProps {
  onSubmit: (intention: string) => void;
  onBack: () => void;
  isLoading: boolean;
}

const VisualFortuneInput: React.FC<VisualFortuneInputProps> = ({ onSubmit, onBack, isLoading }) => {
  const [intention, setIntention] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (intention.trim() && !isLoading) {
      onSubmit(intention.trim());
    }
  };

  return (
    <div className="min-h-[250px] p-6 rounded-2xl border border-white/20 bg-black/20 backdrop-blur-sm flex flex-col items-center justify-center">
      <h3 className="text-xl font-bold mb-4 text-indigo-200">نیت خود را بنویسید</h3>
      <p className="text-sm text-indigo-300 mb-4 text-center">هر چه نیت شما واضح‌تر باشد، تصویر تولید شده به آن نزدیک‌تر خواهد بود.</p>
      <form onSubmit={handleSubmit} className="w-full">
        <textarea
          value={intention}
          onChange={(e) => setIntention(e.target.value)}
          placeholder="مثال: آینده شغلی من"
          rows={3}
          className="w-full p-3 bg-white/10 rounded-lg border border-white/20 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-colors"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!intention.trim() || isLoading}
          className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-500/50"
        >
          {isLoading ? 'در حال خلق...' : 'دریافت فال تصویری'}
        </button>
      </form>
       <button
        onClick={onBack}
        className="w-full mt-2 bg-gray-600/50 hover:bg-gray-500/50 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        disabled={isLoading}
      >
        بازگشت
      </button>
    </div>
  );
};

export default VisualFortuneInput;
