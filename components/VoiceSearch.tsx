
import React, { useState, useRef } from 'react';

interface VoiceSearchProps {
  onIntent: (query: string) => void;
  isArabic: boolean;
}

const VoiceSearch: React.FC<VoiceSearchProps> = ({ onIntent, isArabic }) => {
  const [isListening, setIsListening] = useState(false);
  
  const toggleListening = () => {
    if (!isListening) {
      setIsListening(true);
      // Simulate voice capture
      setTimeout(() => {
        setIsListening(false);
        onIntent("Where is Carrefour?"); // Mock intent
      }, 3000);
    } else {
      setIsListening(false);
    }
  };

  return (
    <button 
      onClick={toggleListening}
      className={`
        w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 relative
        ${isListening ? 'bg-red-500 scale-110' : 'bg-blue-600 hover:bg-blue-700'}
      `}
    >
      {isListening && (
        <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-50" />
      )}
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
      
      {isListening && (
        <div className={`absolute bottom-24 ${isArabic ? 'right-0' : 'left-0'} bg-white shadow-xl px-4 py-2 rounded-2xl border border-slate-100 whitespace-nowrap`}>
          <span className="text-sm font-bold text-slate-600 animate-pulse">
            {isArabic ? 'أنا أسمعك...' : 'Listening...'}
          </span>
        </div>
      )}
    </button>
  );
};

export default VoiceSearch;
