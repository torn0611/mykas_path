import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { hobby, budget, skillLevel } = await req.json();
  if (!hobby || !budget || !skillLevel) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const prompt = `Suggest 5 side-hustle ideas for someone whose hobby is ${hobby}, monthly budget ${budget}, skill level ${skillLevel}.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });
    const text = completion.choices[0]?.message?.content || '';
      const suggestions = text.split(/\n/);
          return NextResponse.json({ suggestions });
        } catch (error) {
          return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 });
        }
    }