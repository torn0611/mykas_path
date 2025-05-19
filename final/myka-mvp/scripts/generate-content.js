// File: scripts/generate-content.js
import fs from 'fs/promises'
import path from 'path'
import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const emotions = [
  'happy','sad','angry','anxious','excited','calm',
  'confident','frustrated','hopeful','inspired',
  'lonely','motivated','overwhelmed','proud',
  'relaxed','scared','surprised','tired',
  'bored','curious','grateful','jealous',
  'nostalgic','optimistic','peaceful','stressed','worried'
]

/**
 * Finds the first JSON array in a string.
 */
function extractJSONArray(str) {
  const match = str.match(/\[([\s\S]*?)\]/)
  if (!match) throw new Error('No JSON array found')
  return match[0]
}

async function generateQuotes() {
  const result = {}
  for (let e of emotions) {
    console.log(`Generating quotes for "${e}"…`)
    const prompt = `Generate exactly 10 uplifting, concise quotes about the emotion "${e}". Respond with _only_ a JSON array of strings (no extra text or markdown fences).`
    const resp = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role:'user', content: prompt }],
    })
    let text = resp.choices[0]?.message?.content || ''
    // strip code fences
    text = text.replace(/```(?:json)?/g, '').trim()
    let arr = []
    try {
      // pull out the JSON array
      const jsonArr = extractJSONArray(text)
      arr = JSON.parse(jsonArr)
      if (!Array.isArray(arr)) throw new Error('Parsed value is not an array')
    } catch (err) {
      console.error(`❌ JSON parse error for "${e}":`, err.message)
      console.error('   Raw response:', text)
      arr = []  // fallback empty
    }
    result[e] = arr
  }
  await fs.writeFile(
    path.join('data','quotes.json'),
    JSON.stringify(result, null, 2)
  )
  console.log('✓ quotes.json written')
}

async function generateHacks() {
  console.log('Generating life hacks…')
  const prompt = `
Generate exactly 40 practical, one-sentence “life hacks” or “daily tips” 
spanning productivity, self-care, and small wins. 
Respond with _only_ a JSON array of strings (no extra text or markdown fences).
  `
  const resp = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role:'user', content: prompt.trim() }],
  })
  let text = resp.choices[0]?.message?.content || ''
  text = text.replace(/```(?:json)?/g, '').trim()
  let arr = []
  try {
    const jsonArr = extractJSONArray(text)
    arr = JSON.parse(jsonArr)
    if (!Array.isArray(arr)) throw new Error('Parsed hacks value is not an array')
  } catch (err) {
    console.error('❌ JSON parse error for hacks:', err.message)
    console.error('   Raw response:', text)
  }
  await fs.writeFile(
    path.join('data','hacks.json'),
    JSON.stringify(arr, null, 2)
  )
  console.log('✓ hacks.json written')
}

async function run() {
  await generateQuotes()
  await generateHacks()
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
