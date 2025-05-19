'use client';

import React, { useState, useEffect } from 'react';
import rawHacks from '../data/hacks.json';

// Tell TS this is an array of strings
const hacks = rawHacks as string[];

const HackCard: React.FC = () => {
  const [hack, setHack] = useState<string>('');

  useEffect(() => {
    if (hacks.length > 0) {
      const idx = Math.floor(Math.random() * hacks.length);
      setHack(hacks[idx]);
    }
  }, []);

  return (
    <div className="hack-card">
      <h3>Hack of the Day</h3>
      <p>{hack || 'Loading…'}</p>
    </div>
  );
};

export default HackCard;
