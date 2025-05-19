import React from 'react';
import { HobbyInput } from './HobbyForm';

interface Props { suggestions: string[]; loading: boolean; error?: string; }

export default function SuggestionList({ suggestions, loading, error }: Props) {
  if (loading) return <p>Loading suggestions…</p>;
  if (error) return <p className="error">{error}</p>;
  return (
    <ul className="suggestion-list">
      {suggestions.map((s, i) => (
        <li key={i}>{s}</li>
      ))}
    </ul>
  );
}