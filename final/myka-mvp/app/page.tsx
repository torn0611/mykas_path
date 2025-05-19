// File: app/page.tsx

import React from 'react'
import EmotionGrid from '../components/EmotionGrid'
import HackCard from '../components/HackCard'
import ChatBox from '../components/ChatBox'
import GoalSection from '../components/GoalSection'

export default function HomePage() {
  return (
    <main>
      <header>
        <h1>Myka’s Path</h1>
      </header>

      <section>
        <h2>Emotion-Driven Quotes</h2>
        <EmotionGrid />
      </section>

      <section>
        <h2>Hack of the Day</h2>
        <HackCard />
      </section>

      <section>
        <h2>Ask Anything</h2>
        <ChatBox />
      </section>

      <section>
        <h2>Goal Breakdown</h2>
        <GoalSection />
      </section>
    </main>
  )
}
