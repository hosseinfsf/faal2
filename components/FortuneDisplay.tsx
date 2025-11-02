
import React, { useState, useEffect } from 'react';
import { CopyIcon, CheckIcon } from './Icons';

interface FortuneDisplayProps {
  fortune: string | null;
  isLoading: boolean;
  error: string | null;
  imageUrl?: string | null;
}

const FortuneDisplay: React.FC<FortuneDisplayProps> = ({ fortune, isLoading, error, imageUrl }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    const textToCopy = imageUrl ? `${fortune}\n\n(این فال تصویری با هوش مصنوعی ساخته شده است)` : fortune;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 text-indigo-300">
          <div className="w-8 h-8 border-4 border-t-transparent border-purple-400 rounded-full animate-spin"></div>
          <p>لونا در حال آماده کردن فال شماست...</p>
        </div>
      );
    }
    if (error) {
      return <p className="text-red-400 text-center">{error}</p>;
    }
    if (imageUrl || fortune) {
      return (
        <div className="flex flex-col items-center gap-4 w-full">
          {imageUrl && (
            <img src={imageUrl} alt="فال تصویری" className="rounded-lg shadow-lg max-w-full h-auto" />
          )}
          {fortune && (
            <div className="whitespace-pre-line text-center leading-loose text-lg text-indigo-100">
              {fortune}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative min-h-[250px] p-6 rounded-2xl border border-white/20 bg-black/20 backdrop-blur-sm flex items-center justify-center">
      {fortune && !isLoading && !error && (
        <button 
          onClick={handleCopy}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Copy fortune"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      )}
      {renderContent()}
    </div>
  );
};

export default FortuneDisplay;
