import React, { useState, FormEvent } from 'react';

interface Props { onSubmit: (input: HobbyInput) => void; }
export interface HobbyInput { hobby: string; budget: string; skillLevel: string; }

export default function HobbyForm({ onSubmit }: Props) {
  const [hobby, setHobby] = useState<string>('');
  const [budget, setBudget] = useState<string>('');
  const [skillLevel, setSkillLevel] = useState<string>('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ hobby, budget, skillLevel });
  };

  return (
    <form onSubmit={handleSubmit} className="hobby-form">
      <input
        type="text"
        value={hobby}
        onChange={e => setHobby(e.target.value)}
        placeholder="Your hobby"
        required
      />
      <input
        type="text"
        value={budget}
        onChange={e => setBudget(e.target.value)}
        placeholder="Monthly budget"
        required
      />
      <input
        type="text"
        value={skillLevel}
        onChange={e => setSkillLevel(e.target.value)}
        placeholder="Skill level"
        required
      />
      <button type="submit">Get Ideas</button>
    </form>
  );
}