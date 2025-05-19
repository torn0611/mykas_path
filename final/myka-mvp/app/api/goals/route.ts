// File: app/api/goals/route.ts

import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface Milestone {
  title: string
  todos: string[]
}

export async function POST(req: NextRequest) {
  const { goal, deadline } = await req.json()
  if (!goal || !deadline) {
    return NextResponse.json(
      { error: 'Missing goal or deadline' },
      { status: 400 }
    )
  }

  const prompt = `Break down the goal "${goal}" into 5–7 milestones with to-dos, to be completed by ${deadline}. Output _only_ a JSON array of objects, each with "title" (string) and "todos" (string[]).`

  try {
    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    })

    // Grab the raw text
    const text = completion.choices[0]?.message?.content || '[]'

    // Clean out any ```json or ``` fences
    const cleaned = text
      .trim()
      .replace(/^```json[\r\n]*/, '')
      .replace(/^```/, '')
      .replace(/```$/, '')
      .trim()

    // Parse into our Milestone type
    let milestones: Milestone[]
    try {
      milestones = JSON.parse(cleaned) as Milestone[]
    } catch (parseErr) {
      console.error('JSON parse failed:', parseErr, '\nRaw:', text)
      return NextResponse.json(
        { error: 'Invalid JSON from OpenAI', raw: text },
        { status: 502 }
      )
    }

    return NextResponse.json({ milestones })
  } catch (err) {
    console.error('OpenAI error:', err)
    return NextResponse.json(
      { error: 'Failed to generate milestones' },
      { status: 502 }
    )
  }
}
