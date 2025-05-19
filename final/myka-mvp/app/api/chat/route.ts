import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: NextRequest) {
  const { prompt } = await req.json()
  if (!prompt) {
    return NextResponse.json({ error: 'Missing prompt' }, { status: 400 })
  }

  try {
    // kick off a streaming completion
    const stream = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: [
        { role: 'system', content: 'You are a helpful, magical assistant.' },
        { role: 'user', content: prompt }
      ],
    })

    // encoder to turn strings into Uint8Array
    const encoder = new TextEncoder()
    // build a ReadableStream that pipes OpenAI chunks directly to the client
    const textStream = new ReadableStream({
      async start(controller) {
        for await (const part of stream) {
          const chunk = part.choices[0]?.delta?.content
          if (chunk) controller.enqueue(encoder.encode(chunk))
        }
        controller.close()
      }
    })

    // return as a plain-text stream
    return new NextResponse(textStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      }
    })
  } catch (err) {
    console.error('OpenAI error:', err)
    return NextResponse.json(
      { error: 'Failed to reach OpenAI' },
      { status: 502 }
    )
  }
}
