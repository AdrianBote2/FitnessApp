import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export default async function handler(req, res) {
  // only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { logs, workouts } = req.body

  // build a prompt from the user's last 7 days of data
  const prompt = `You are a fitness coach analyzing a user's last 7 days of data.
Give 3 short, actionable insights based on their trends. Be specific to their numbers.
Keep each insight to 2-3 sentences max. Focus on patterns, improvements, and areas to watch.

Daily logs (nutrition + recovery):
${JSON.stringify(logs, null, 2)}

Workout entries:
${JSON.stringify(workouts, null, 2)}

Respond in JSON format:
[
  { "title": "short title", "body": "2-3 sentence insight" },
  { "title": "short title", "body": "2-3 sentence insight" },
  { "title": "short title", "body": "2-3 sentence insight" }
]`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    })

    let content = response.choices[0].message.content
    // strip markdown code fences if OpenAI wraps the JSON
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const insights = JSON.parse(content)

    // log cost per call (gpt-4o-mini pricing: $0.15/1M input, $0.60/1M output)
    const inputTokens = response.usage?.prompt_tokens || 0
    const outputTokens = response.usage?.completion_tokens || 0
    const cost = (inputTokens * 0.15 / 1_000_000) + (outputTokens * 0.60 / 1_000_000)
    console.log(`Tokens — in: ${inputTokens}, out: ${outputTokens} | Cost: $${cost.toFixed(6)}`)

    return res.status(200).json({ insights })
  } catch (error) {
    console.error('OpenAI error:', error)
    return res.status(500).json({ error: 'Failed to generate insights' })
  }
}
