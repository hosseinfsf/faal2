import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToBot } from './services/geminiService';

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
}

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isBot = message.sender === 'bot';
  
  // Format text to handle basic newlines
  const formattedText = message.text.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < message.text.split('\n').length - 1 && <br />}
    </React.Fragment>
  ));

  return (
    <div className={`message-bubble ${isBot ? 'bot-bubble' : 'user-bubble'}`}>
      {formattedText}
      {/* Time placeholder could go here */}
    </div>
  );
};

const Loader: React.FC = () => (
  <div className="loader">
    <div className="dot"></div>
    <div className="dot"></div>
    <div className="dot"></div>
  </div>
);

// Telegram-style Send Icon
const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 transform rotate-0">
    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    // Initial friendly greeting
    setMessages([{
      id: 1,
      sender: 'bot',
      text: 'سلام! 👋\nمن دستیار هوشمند شخصی شما هستم. چطور می‌تونم امروز کمکتون کنم؟'
    }]);
    
    // Focus input on load
    if(!('ontouchstart' in window)) { // Only focus on desktop to avoid keyboard popping up on mobile
       inputRef.current?.focus();
    }
  }, []);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    
    // Reset textarea height
    if (inputRef.current) {
        inputRef.current.style.height = 'auto';
    }

    // Add User Message
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const response = await sendMessageToBot(userText);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: response }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'bot', 
        text: 'متاسفانه ارتباط برقرار نشد. لطفا اتصال اینترنت خود را بررسی کنید.' 
      }]);
    } finally {
      setIsLoading(false);
      // Refocus input for desktop users
      if(!('ontouchstart' in window)) {
        inputRef.current?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        
        {isLoading && (
          <div className="message-bubble bot-bubble" style={{ width: 'fit-content' }}>
            <Loader />
          </div>
        )}
        <div ref={messagesEndRef} style={{ height: '10px' }} />
      </div>

      <div className="input-area">
        <textarea
          ref={inputRef}
          value={input}
          onChange={handleInputResize}
          onKeyDown={handleKeyDown}
          placeholder="پیام..."
          className="chat-input"
          rows={1}
          disabled={isLoading}
        />
        <button 
          onClick={() => handleSend()} 
          className="send-button"
          disabled={!input.trim() || isLoading}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default App;