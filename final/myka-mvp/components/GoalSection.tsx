// File: components/GoalSection.tsx
'use client';

import React, { useState, useEffect } from 'react';
import GoalForm, { GoalInput } from './GoalForm';
import MilestoneList, { Milestone } from './MilestoneList';

export default function GoalSection() {
  // --- state & logs for debugging ---
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [completed, setCompleted] = useState<boolean[]>([]);

  // load persisted state
  useEffect(() => {
    console.log('🏗️ GoalSection mounted');
    const raw = localStorage.getItem('milestoneCompleted');
    if (raw) setCompleted(JSON.parse(raw));
  }, []);

  // persist state
  useEffect(() => {
    localStorage.setItem('milestoneCompleted', JSON.stringify(completed));
  }, [completed]);

  // called by GoalForm
  const handleSubmit = async (input: GoalInput) => {
    console.log('🚀 handleSubmit fired with:', input);
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Bad response');
      console.log('📬 API returned:', data.milestones);
      setMilestones(data.milestones);
      setCompleted(new Array(data.milestones.length).fill(false));
    } catch (err: any) {
      console.error('❌ handleSubmit error:', err);
      setError(err.message || 'Unknown error');
      setMilestones([]);
    } finally {
      setLoading(false);
    }
  };

  const onToggle = (idx: number) => {
    setCompleted((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  return (
    <section className="goal-section">
      <GoalForm onSubmit={handleSubmit} />

      {/* debug info */}
      <div style={{ fontSize: '0.8em', color: '#888' }}>
        {loading && '⏳ Generating…'}
        {error && `⚠️ ${error}`}
        {!loading && !error && milestones.length === 0 && 'No milestones yet.'}
      </div>

      <MilestoneList
        milestones={milestones}
        loading={false}
        error={error}
        onToggle={onToggle}
        completed={completed}
      />
    </section>
  );
}
