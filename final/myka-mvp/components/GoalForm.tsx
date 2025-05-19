import React, { useState, FormEvent } from 'react';

export interface GoalInput {
  goal: string;
  deadline: string; // ISO date string, e.g. "2025-06-30"
}

interface Props {
  onSubmit: (input: GoalInput) => void;
}

export default function GoalForm({ onSubmit }: Props) {
  const [goal, setGoal] = useState<string>('');
  const [deadline, setDeadline] = useState<string>('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ goal, deadline });
  };

  return (
    <form onSubmit={handleSubmit} className="goal-form">
      <input
        type="text"
        value={goal}
        onChange={e => setGoal(e.target.value)}
        placeholder="Your goal"
        required
      />
      <input
        type="date"
        value={deadline}
        onChange={e => setDeadline(e.target.value)}
        required
      />
      <button type="submit">Generate Milestones</button>
    </form>
  );
}
