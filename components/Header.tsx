
import React from 'react';
import { BotIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="inline-block bg-white/10 p-4 rounded-full">
        <BotIcon />
      </div>
      <h1 className="text-3xl font-bold mt-4 text-shadow">ربات فال لونا</h1>
      <p className="text-indigo-300 mt-2">آینده خود را با هوش مصنوعی کشف کنید ✨</p>
    </header>
  );
};

export default Header;
