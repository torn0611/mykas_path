'use client';

import React, { useState } from 'react';
import rawQuotes from '../data/quotes.json';

// Tell TS “quotes” is a map from string → string[]
const quotes = rawQuotes as Record<string, string[]>;

const EmotionGrid: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [currentQuote, setCurrentQuote] = useState<string>('');

  const emotions = Object.keys(quotes);

  const handleClick = (emotion: string) => {
    const list = quotes[emotion] || [];
    if (list.length === 0) {
      setCurrentQuote('No quotes available.');
    } else {
      setCurrentQuote(list[Math.floor(Math.random() * list.length)]);
    }
    setSelectedEmotion(emotion);
  };

  return (
    <div>
      <div className="emotion-grid">
        {emotions.map((emo) => (
          <button
            key={emo}
            className="emotion-button"
            onClick={() => handleClick(emo)}
          >
            {emo}
          </button>
        ))}
      </div>

      {currentQuote && (
        <div className="quote-display">
          <strong>{selectedEmotion}:</strong> {currentQuote}
        </div>
      )}
    </div>
  );
};

export default EmotionGrid;
