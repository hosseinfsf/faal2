
import React from 'react';

interface FortuneButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

const FortuneButton: React.FC<FortuneButtonProps> = ({ onClick, disabled = false, children }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center gap-3 p-4 rounded-2xl 
        font-semibold text-lg text-white
        border border-white/20 
        bg-white/10 backdrop-blur-md 
        shadow-lg
        transition-all duration-300 ease-in-out
        hover:bg-white/20 hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75
        disabled:bg-gray-500/20 disabled:text-gray-400 disabled:cursor-not-allowed disabled:scale-100
      `}
    >
      {children}
    </button>
  );
};

export default FortuneButton;
