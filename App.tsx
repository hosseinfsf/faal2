
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FortuneType } from './types';
import { generateFortune } from './services/geminiService';

interface Message {
  // FIX: Allow id to be a string as well to support the 'loader' id.
  id: number | string;
  text: string | React.ReactNode;
  sender: 'bot';
}

interface Button {
    text: string;
    action: () => void;
}

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => (
  <div className="message-bubble bot-bubble">
    {message.text}
  </div>
);

const InlineKeyboard: React.FC<{ buttons: Button[][], disabled: boolean }> = ({ buttons, disabled }) => (
  <div className="inline-keyboard">
    {buttons.map((row, rowIndex) => (
      <div key={rowIndex} className="flex gap-2 w-full">
        {row.map((button) => (
          <button key={button.text} onClick={button.action} disabled={disabled} className="inline-button flex-1">
            {button.text}
          </button>
        ))}
      </div>
    ))}
  </div>
);

const Loader: React.FC = () => (
  <div className="loader">
    <span>در حال آماده‌سازی</span>
    <div className="dot-flashing"></div>
  </div>
);

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);
  
  useEffect(() => {
    setMessages([{
      id: 1,
      sender: 'bot',
      text: 'سلام! به ربات فال حافظ و تاروت خوش آمدید ✨\n\nلطفاً نوع فال خود را انتخاب کنید:'
    }]);
  }, []);

  const handleFortuneRequest = useCallback(async (type: FortuneType) => {
    setShowButtons(false);
    setIsLoading(true);

    try {
      const result = await generateFortune(type);
      setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: result }]);
    } catch (e: any) {
      const errorMessage = e.message || 'خطایی در دریافت فال رخ داد. لطفاً دوباره تلاش کنید.';
      setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: `😕 اوه! مشکلی پیش آمد:\n\n${errorMessage}` }]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetChat = () => {
    setMessages([{
      id: 1,
      sender: 'bot',
      text: '✨ برای گرفتن فال جدید، یکی از گزینه‌های زیر را انتخاب کنید:'
    }]);
    setShowButtons(true);
  };

  const initialButtons: Button[][] = [
      [{ text: '📿 فال حافظ', action: () => handleFortuneRequest(FortuneType.Hafez) }],
      [{ text: '🃏 فال تاروت', action: () => handleFortuneRequest(FortuneType.Tarot) }],
  ];

  const newFortuneButton: Button[][] = [
      [{ text: '🔮 فال جدید', action: resetChat }]
  ];

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        {isLoading && <ChatMessage message={{ id: 'loader', sender: 'bot', text: <Loader /> }} />}
        <div ref={messagesEndRef} />
      </div>
      
      {showButtons && <InlineKeyboard buttons={initialButtons} disabled={isLoading} />}
      {!isLoading && !showButtons && <InlineKeyboard buttons={newFortuneButton} disabled={false} />}
    </div>
  );
};

export default App;