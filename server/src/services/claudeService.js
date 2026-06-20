import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateLocationDescription(locationName, category) {
  const prompt = `You are a witty, atmospheric travel writer for a gamified city exploration app called "Prague Stories".

Write a vivid 100-120 word description of "${locationName}" (category: ${category}) in Prague, Czech Republic.
Capture its history, unique atmosphere, and one surprising or little-known fact.
Keep the tone adventurous and inviting — like a quest description.

Return ONLY valid JSON in exactly this format (no markdown, no extra text):
{
  "en": "English description here",
  "cz": "Czech description here",
  "zh": "Chinese (Simplified) description here"
}`;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].text.trim();
  const parsed = JSON.parse(text);

  if (!parsed.en || !parsed.cz || !parsed.zh) {
    throw new Error('Claude response missing required language fields');
  }
  return parsed;
}
